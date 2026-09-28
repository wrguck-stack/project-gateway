// Local HTTP persistence check against the existing production build.
// Never accepts a remote URL or reuses an existing GATEWAY_DATA_DIR.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdtemp, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const cancelled = new AbortController();
const address = "Synthetischer Vorschautest - kein realer Standort";
const csv = Buffer.from("zeit;kwh\n2026-01-01T00:00:00Z;1.25\n", "utf8");
const digest = createHash("sha256").update(csv).digest("hex");
let tempDirectory;
let activeServer;
let output = "";

function interrupted(signal) {
  process.exitCode = signal === "SIGINT" ? 130 : 143;
  cancelled.abort(new Error(`Preview verification interrupted (${signal}).`));
}
const onInterrupt = () => interrupted("SIGINT");
const onTerminate = () => interrupted("SIGTERM");
process.once("SIGINT", onInterrupt);
process.once("SIGTERM", onTerminate);

async function unusedPort() {
  const reservation = createServer();
  await new Promise((resolveReady, reject) => {
    reservation.once("error", reject);
    reservation.listen(0, "127.0.0.1", resolveReady);
  });
  const port = reservation.address().port;
  await new Promise((resolveClosed, reject) => {
    reservation.close((error) => (error ? reject(error) : resolveClosed()));
  });
  return port;
}

async function startServer(port) {
  cancelled.signal.throwIfAborted();
  const child = spawn(
    process.execPath,
    [
      require.resolve("next/dist/bin/next"),
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      cwd: root,
      env: {
        ...process.env,
        NODE_ENV: "production",
        APP_MODE: "demo",
        GATEWAY_DATA_DIR: tempDirectory,
        PORT: String(port),
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  const server = {
    child,
    closed: false,
    ready: false,
    error: null,
    exited: null,
  };
  activeServer = server;
  server.exited = new Promise((resolveExit) => {
    child.once("error", (error) => {
      server.error = error;
    });
    child.once("close", () => {
      server.closed = true;
      resolveExit();
    });
  });
  const collect = (chunk) => {
    const text = chunk.toString();
    output = (output + text).slice(-8000);
    if (/\bReady in\b/.test(text)) server.ready = true;
  };
  child.stdout.on("data", collect);
  child.stderr.on("data", collect);
  const origin = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    cancelled.signal.throwIfAborted();
    if (server.error) throw server.error;
    assert(
      !server.closed,
      "The production server exited before becoming ready.",
    );
    // Wait for this child's readiness message before any HTTP request. A port
    // collision must fail, rather than sending test writes to another server.
    if (server.ready) {
      const response = await fetch(origin, {
        redirect: "error",
        signal: AbortSignal.any([cancelled.signal, AbortSignal.timeout(8000)]),
      });
      await response.text();
      assert.equal(response.status, 200, "Homepage must answer HTTP 200.");
      assert(
        !server.closed,
        "The production server exited during its readiness check.",
      );
      return origin;
    }
    await delay(100, undefined, { signal: cancelled.signal });
  }
  throw new Error("Production server readiness timed out after 45 seconds.");
}

async function stopServer() {
  const server = activeServer;
  if (!server) return;
  if (!server.closed) {
    server.child.kill("SIGTERM");
    const timeout = setTimeout(() => {
      if (!server.closed) server.child.kill("SIGKILL");
    }, 10_000);
    try {
      await server.exited;
    } finally {
      clearTimeout(timeout);
    }
  }
  activeServer = undefined;
}

async function request(
  origin,
  path,
  { cookie, json, body, method = "GET", expected = 200 } = {},
) {
  cancelled.signal.throwIfAborted();
  assert(
    activeServer && !activeServer.closed,
    "No owned test server is running.",
  );
  const headers = { origin };
  if (cookie) headers.cookie = cookie;
  if (json !== undefined) headers["content-type"] = "application/json";
  const response = await fetch(new URL(path, origin), {
    method,
    headers,
    body: json !== undefined ? JSON.stringify(json) : body,
    redirect: "error",
    signal: AbortSignal.any([cancelled.signal, AbortSignal.timeout(8000)]),
  });
  assert.equal(
    response.status,
    expected,
    `${method} ${path}: unexpected HTTP status.`,
  );
  return response;
}

async function ownerSession(origin) {
  const response = await request(origin, "/api/session", {
    method: "POST",
    json: { role: "OWNER" },
  });
  const session = await response.json();
  assert.equal(session.mode, "demo");
  const header = response.headers
    .getSetCookie()
    .find((value) => value.startsWith("gateway_owner="));
  assert(
    header && /;\s*HttpOnly/i.test(header),
    "Expected an opaque HttpOnly owner cookie.",
  );
  return header.split(";")[0];
}

async function checkAccess(origin, id, documentId, foreignCookie) {
  for (const path of [
    `/api/drafts/${id}`,
    `/api/drafts/${id}/documents/${documentId}`,
  ]) {
    await (
      await request(origin, path, { cookie: foreignCookie, expected: 403 })
    ).arrayBuffer();
    await (await request(origin, path, { expected: 401 })).arrayBuffer();
  }
}

try {
  assert.equal(
    process.argv.length,
    2,
    "This script accepts no arguments or remote targets.",
  );
  await access(join(root, ".next", "BUILD_ID")).catch(() => {
    throw new Error(
      "No production build found. Run npm run build before npm run verify:preview.",
    );
  });
  tempDirectory = await mkdtemp(join(tmpdir(), "gateway-preview-"));
  const port = await unusedPort();
  const origin = await startServer(port);
  const owner = await ownerSession(origin);
  const foreignOwner = await ownerSession(origin);
  const draft = await (
    await request(origin, "/api/drafts", {
      cookie: owner,
      method: "POST",
      json: { address },
    })
  ).json();
  assert.equal(draft.answers.address, address);
  assert.equal(draft.documents.length, 0);
  const form = new FormData();
  form.set(
    "file",
    new Blob([csv], { type: "text/csv" }),
    "synthetic-preview.csv",
  );
  form.set("category", "Lastgang");
  form.set("revision", String(draft.revision));
  const uploaded = await (
    await request(origin, `/api/drafts/${draft.id}/documents`, {
      cookie: owner,
      method: "POST",
      body: form,
    })
  ).json();
  assert.equal(uploaded.documents.length, 1);
  const document = uploaded.documents[0];
  assert.equal(document.hash, digest);
  assert.equal(document.size, csv.length);
  assert.equal(document.state, "ready");
  assert.equal(document.category, "Lastgang");
  const projectPath = `/api/drafts/${draft.id}`;
  const filePath = `${projectPath}/documents/${document.id}`;
  const before = await (
    await request(origin, projectPath, { cookie: owner })
  ).json();
  const beforeBytes = Buffer.from(
    await (await request(origin, filePath, { cookie: owner })).arrayBuffer(),
  );
  assert.deepEqual(beforeBytes, csv);
  await checkAccess(origin, draft.id, document.id, foreignOwner);
  console.log(
    "PASS: synthetic session, draft, CSV upload/download and owner access boundaries.",
  );

  await stopServer();
  await startServer(port);
  // Reuse the original cookies; creating a new session would conceal a loss.
  const after = await (
    await request(origin, projectPath, { cookie: owner })
  ).json();
  assert.deepEqual(
    after,
    before,
    "Project changed or was lost across the process restart.",
  );
  const afterBytes = Buffer.from(
    await (await request(origin, filePath, { cookie: owner })).arrayBuffer(),
  );
  assert.deepEqual(
    afterBytes,
    beforeBytes,
    "Uploaded file changed or was lost across the restart.",
  );
  await checkAccess(origin, draft.id, document.id, foreignOwner);
  console.log(
    "PASS: full process restart preserves the project, upload bytes and original owner session.",
  );
  console.log(
    "PASS: foreign-owner and unauthenticated access remain denied after restart.",
  );
  console.log(
    "Local HTTP verification only; no browser, remote hosting or live integration was tested.",
  );
} catch (error) {
  process.exitCode ||= 1;
  console.error(`Preview verification failed: ${error.message}`);
  if (output) console.error(output);
} finally {
  await stopServer();
  if (tempDirectory) await rm(tempDirectory, { recursive: true, force: true });
  process.removeListener("SIGINT", onInterrupt);
  process.removeListener("SIGTERM", onTerminate);
}
