// HTTP integration against the production Next build and Netlify's local SDK
// emulator. Accepts no targets, tokens or other options; never contacts Netlify.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { access, mkdtemp, rm } from "node:fs/promises";
import { createServer as createHTTPServer } from "node:http";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { BlobsServer } from "@netlify/blobs/server";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const cancelled = new AbortController();
const address = "Synthetischer Netlify-Test - kein realer Standort";
const csv = Buffer.from(
  "zeit;kwh\n" + "2026-01-01T00:00:00Z;1.25\n".repeat(250_000),
);
const digest = createHash("sha256").update(csv).digest("hex");
let tempDirectory;
let emulator;
let emulatorBridge;
let blobContext;
let activeServer;
let output = "";

function interrupted(signal) {
  process.exitCode = signal === "SIGINT" ? 130 : 143;
  cancelled.abort(new Error(`Netlify verification interrupted (${signal}).`));
}
const onInterrupt = () => interrupted("SIGINT");
const onTerminate = () => interrupted("SIGTERM");
process.once("SIGINT", onInterrupt);
process.once("SIGTERM", onTerminate);

async function unusedPort() {
  const reservation = createServer();
  await new Promise((ready, reject) => {
    reservation.once("error", reject);
    reservation.listen(0, "127.0.0.1", ready);
  });
  const port = reservation.address().port;
  await new Promise((closed, reject) => {
    reservation.close((error) => (error ? reject(error) : closed()));
  });
  return port;
}

async function startEmulatorBridge(endpoint) {
  // @netlify/blobs 11.1.1's official emulator omits ETag on GET/HEAD, but
  // supplies the genuine version used for conditional PUTs in LIST results.
  // This narrow test-only forwarder repairs that header for the state file.
  // It is safe only for this sequential verifier; never use this two-read
  // workaround in application code or as evidence of atomic concurrent CAS.
  emulatorBridge = createHTTPServer(async (incoming, outgoing) => {
    try {
      const target = new URL(incoming.url, endpoint);
      assert.equal(
        target.origin,
        endpoint,
        "Emulator forwarding must remain local.",
      );
      const headers = { ...incoming.headers, host: target.host };
      const upstream = await fetch(target, {
        method: incoming.method,
        headers,
        body: ["GET", "HEAD"].includes(incoming.method) ? undefined : incoming,
        duplex: "half",
        redirect: "error",
        signal: AbortSignal.timeout(30_000),
      });
      const responseHeaders = new Headers(upstream.headers);
      if (
        incoming.method === "GET" &&
        upstream.status === 200 &&
        target.pathname.endsWith("/demo-store.json") &&
        !responseHeaders.has("etag")
      ) {
        const listing = new URL(".", target);
        listing.searchParams.set("prefix", "demo-store.json");
        const listed = await fetch(listing, {
          headers: { authorization: incoming.headers.authorization ?? "" },
          redirect: "error",
          signal: AbortSignal.timeout(8000),
        });
        assert.equal(
          listed.status,
          200,
          "Emulator LIST must return the real ETag.",
        );
        const entry = (await listed.json()).blobs.find(
          (blob) => blob.key === "demo-store.json",
        );
        assert(entry?.etag, "Emulator did not supply its state-file ETag.");
        responseHeaders.set("etag", entry.etag);
      }
      outgoing.writeHead(upstream.status, Object.fromEntries(responseHeaders));
      if (upstream.body)
        await pipeline(Readable.fromWeb(upstream.body), outgoing);
      else outgoing.end();
    } catch (error) {
      output = (output + `\nLocal emulator bridge: ${error.message}`).slice(
        -8000,
      );
      if (!outgoing.headersSent) outgoing.writeHead(502);
      outgoing.end();
    }
  });
  await new Promise((ready, reject) => {
    emulatorBridge.once("error", reject);
    emulatorBridge.listen(0, "127.0.0.1", ready);
  });
  return `http://127.0.0.1:${emulatorBridge.address().port}`;
}

async function startServer(port, context = "production") {
  cancelled.signal.throwIfAborted();
  assert(!activeServer, "Stop the owned server before starting another.");
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
      // Deliberately do not inherit tokens, endpoints, Node preloads or live mode.
      env: {
        PATH: process.env.PATH,
        NODE_ENV: "production",
        NEXT_TELEMETRY_DISABLED: "1",
        // @next/env respects this marker: do not import credentials from .env.
        __NEXT_PROCESSED_ENV: "true",
        APP_MODE: "demo",
        NETLIFY: "true",
        CONTEXT: context,
        GATEWAY_STORAGE: "netlify-blobs",
        GATEWAY_DATA_DIR: join(tempDirectory, "unused-local-store"),
        GATEWAY_BLOBS_NAMESPACE: "gateway-verification",
        GATEWAY_DEPLOY_CONTEXT: context,
        GATEWAY_DEPLOY_KEY: "synthetic-preview",
        NETLIFY_BLOBS_CONTEXT: blobContext,
        PORT: String(port),
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
  server.exited = new Promise((done) => {
    child.once("error", (error) => {
      server.error = error;
    });
    child.once("close", () => {
      server.closed = true;
      done();
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
      "The owned Next server exited before becoming ready.",
    );
    // Only contact the port after this child reports readiness. A collision
    // must fail, never send synthetic writes to another running application.
    if (server.ready) {
      await (await request(origin, "/")).text();
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
  const url = new URL(path, origin);
  assert.equal(url.origin, origin, "External targets are forbidden.");
  assert.equal(
    url.hostname,
    "127.0.0.1",
    "Only loopback requests are permitted.",
  );
  const headers = { origin };
  if (cookie) headers.cookie = cookie;
  if (json !== undefined) headers["content-type"] = "application/json";
  else if (body) headers["content-type"] = "application/octet-stream";
  const response = await fetch(url, {
    method,
    headers,
    body: json !== undefined ? JSON.stringify(json) : body,
    redirect: "error",
    signal: AbortSignal.any([cancelled.signal, AbortSignal.timeout(30_000)]),
  });
  if (expected !== null && response.status !== expected) {
    const detail = (await response.text()).slice(0, 500);
    assert.fail(
      `${method} ${path}: HTTP ${response.status}, expected ${expected}. ${detail}`,
    );
  }
  return response;
}

async function ownerSession(origin) {
  const response = await request(origin, "/api/session", {
    method: "POST",
    json: { role: "OWNER" },
  });
  assert.equal((await response.json()).mode, "demo");
  const header = response.headers
    .getSetCookie()
    .find((value) => value.startsWith("gateway_owner="));
  assert(
    header && /;\s*HttpOnly/i.test(header),
    "Expected an opaque HttpOnly owner cookie.",
  );
  return header.split(";")[0];
}

async function createDraft(origin, cookie, title = address) {
  return (
    await request(origin, "/api/drafts", {
      method: "POST",
      cookie,
      json: { address: title },
    })
  ).json();
}

async function checkAccess(origin, projectPath, filePath, foreignCookie) {
  for (const path of [projectPath, filePath]) {
    await (
      await request(origin, path, { cookie: foreignCookie, expected: 403 })
    ).text();
    await (await request(origin, path, { expected: 401 })).text();
  }
}

async function verifyDownload(origin, filePath, cookie) {
  const response = await request(origin, filePath, { cookie });
  assert.match(response.headers.get("content-type") ?? "", /^text\/csv/);
  assert.match(
    response.headers.get("cache-control") ?? "",
    /private.*no-store/,
  );
  assert(response.body, "Expected a streamed download body.");
  const hash = createHash("sha256");
  let offset = 0;
  for await (const chunk of response.body) {
    const bytes = Buffer.from(chunk);
    assert.deepEqual(
      bytes,
      csv.subarray(offset, offset + bytes.length),
      "Downloaded bytes changed.",
    );
    hash.update(bytes);
    offset += bytes.length;
  }
  assert.equal(offset, csv.length, "Incomplete streamed download.");
  assert.equal(hash.digest("hex"), digest);
}

async function uploadChunks(origin, draft, owner, foreignOwner) {
  const path = `/api/projects/${draft.id}/transfers`;
  const transfer = await (
    await request(origin, path, {
      cookie: owner,
      method: "POST",
      json: {
        revision: draft.revision,
        name: "synthetic-netlify.csv",
        size: csv.length,
        category: "Lastgang",
      },
    })
  ).json();
  assert(transfer.chunkSize > 0 && transfer.chunkSize <= 2_000_000);
  assert.equal(transfer.chunkCount, Math.ceil(csv.length / transfer.chunkSize));
  const first = csv.subarray(0, transfer.chunkSize);
  const firstPath = `${path}/${transfer.id}/0`;
  await (
    await request(origin, firstPath, {
      cookie: foreignOwner,
      method: "PUT",
      body: first,
      expected: 403,
    })
  ).text();
  await (
    await request(origin, firstPath, {
      method: "PUT",
      body: first,
      expected: 401,
    })
  ).text();
  for (let index = 0; index < transfer.chunkCount; index++) {
    const bytes = csv.subarray(
      index * transfer.chunkSize,
      (index + 1) * transfer.chunkSize,
    );
    const received = await (
      await request(origin, `${path}/${transfer.id}/${index}`, {
        cookie: owner,
        method: "PUT",
        body: bytes,
      })
    ).json();
    assert.equal(received.received, index);
    assert.equal(received.bytes, bytes.length);
  }
  const finish = `${path}/${transfer.id}/complete`;
  const uploaded = await (
    await request(origin, finish, { cookie: owner, method: "POST", json: {} })
  ).json();
  const replay = await (
    await request(origin, finish, { cookie: owner, method: "POST", json: {} })
  ).json();
  assert.deepEqual(replay, uploaded, "Upload finalization must be idempotent.");
  assert.equal(uploaded.documents.length, 1);
  assert.equal(uploaded.documents[0].hash, digest);
  assert.equal(uploaded.documents[0].size, csv.length);
  assert.equal(uploaded.documents[0].state, "ready");
  return uploaded;
}

try {
  assert.equal(
    process.argv.length,
    2,
    "This script accepts no arguments, credentials or remote targets.",
  );
  await access(join(root, ".next", "BUILD_ID")).catch(() => {
    throw new Error(
      "No production build found. Run npm run build before npm run verify:netlify.",
    );
  });
  assert(csv.length > 6_000_000 && csv.length <= 20_000_000);
  tempDirectory = await mkdtemp(join(tmpdir(), "gateway-netlify-"));
  const token = randomBytes(32).toString("hex");
  emulator = new BlobsServer({
    directory: join(tempDirectory, "blobs"),
    token,
    logger: () => {},
  });
  const local = await emulator.start();
  assert(
    ["localhost", "127.0.0.1", "[::1]"].includes(
      new URL(local.address).hostname,
    ),
  );
  const endpoint = await startEmulatorBridge(`http://127.0.0.1:${local.port}`);
  console.log(
    "INFO: local emulator GET lacks ETag; a test-only loopback bridge forwards its real LIST ETag. Sequential verification only.",
  );
  blobContext = Buffer.from(
    JSON.stringify({
      apiURL: endpoint,
      edgeURL: endpoint,
      uncachedEdgeURL: endpoint,
      siteID: "gateway-local-verification",
      token,
    }),
  ).toString("base64");
  const port = await unusedPort();
  const origin = await startServer(port);
  const owner = await ownerSession(origin);
  const foreignOwner = await ownerSession(origin);
  const draft = await createDraft(origin, owner);
  assert.equal(draft.answers.address, address);
  const uploaded = await uploadChunks(origin, draft, owner, foreignOwner);
  const projectPath = `/api/drafts/${draft.id}`;
  const filePath = `${projectPath}/documents/${uploaded.documents[0].id}`;
  await verifyDownload(origin, filePath, owner);
  await checkAccess(origin, projectPath, filePath, foreignOwner);
  console.log(
    "PASS: actual Blobs SDK, durable session/draft, >6 MB chunk upload, streamed download and access boundaries.",
  );

  // The official emulator checks ETags before asynchronous filesystem writes;
  // unlike the hosted service, its CAS check is not atomic under overlap.
  // Exercise stale-revision HTTP behavior here. Real contention/retries are
  // covered with an atomic storage fake in tests/netlify-storage.test.ts.
  const patch = {
    revision: uploaded.revision,
    step: 1,
    completeStep: false,
    answers: { ...uploaded.answers, description: "Saved synthetic edit" },
  };
  const before = await (
    await request(origin, projectPath, {
      cookie: owner,
      method: "PATCH",
      json: patch,
    })
  ).json();
  await (
    await request(origin, projectPath, {
      cookie: owner,
      method: "PATCH",
      expected: 409,
      json: {
        ...patch,
        answers: { ...patch.answers, description: "Stale synthetic edit" },
      },
    })
  ).text();
  assert.equal(before.revision, uploaded.revision + 1);
  assert.deepEqual(
    await (await request(origin, projectPath, { cookie: owner })).json(),
    before,
  );
  console.log(
    "PASS: stale same-revision HTTP write conflicts and preserves the saved edit. Concurrent CAS is covered by unit tests, not this non-atomic emulator.",
  );

  await stopServer();
  await startServer(port);
  assert.deepEqual(
    await (await request(origin, projectPath, { cookie: owner })).json(),
    before,
    "Project or original session changed across the application process restart.",
  );
  await verifyDownload(origin, filePath, owner);
  await checkAccess(origin, projectPath, filePath, foreignOwner);
  console.log(
    "PASS: process restart preserves original owner sessions, project revision and exact upload bytes.",
  );

  await stopServer();
  await startServer(port, "deploy-preview");
  await (
    await request(origin, projectPath, { cookie: owner, expected: 401 })
  ).text();
  const previewOwner = await ownerSession(origin);
  await (
    await request(origin, projectPath, { cookie: previewOwner, expected: 404 })
  ).text();
  const previewDraft = await createDraft(
    origin,
    previewOwner,
    "Synthetischer Preview-Namensraum",
  );
  await stopServer();
  await startServer(port);
  await (
    await request(origin, `/api/drafts/${previewDraft.id}`, {
      cookie: previewOwner,
      expected: 401,
    })
  ).text();
  await (
    await request(origin, `/api/drafts/${previewDraft.id}`, {
      cookie: owner,
      expected: 404,
    })
  ).text();
  assert.deepEqual(
    await (await request(origin, projectPath, { cookie: owner })).json(),
    before,
  );
  await verifyDownload(origin, filePath, owner);
  console.log(
    "PASS: preview sessions and drafts are isolated from the preserved production namespace.",
  );
  console.log(
    "Local Next HTTP + official Blobs emulator only; hosted functions, browser and live integrations were not tested.",
  );
} catch (error) {
  process.exitCode ||= 1;
  console.error(`Netlify verification failed: ${error.message}`);
  if (output) console.error(output);
} finally {
  await stopServer();
  if (emulatorBridge?.listening) {
    emulatorBridge.closeAllConnections();
    await new Promise((done, reject) =>
      emulatorBridge.close((error) => (error ? reject(error) : done())),
    );
  }
  await emulator?.stop();
  if (tempDirectory) await rm(tempDirectory, { recursive: true, force: true });
  process.removeListener("SIGINT", onInterrupt);
  process.removeListener("SIGTERM", onTerminate);
}
