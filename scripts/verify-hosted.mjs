// Explicit hosted DEMO acceptance only. Usage:
// npm run verify:hosted -- https://YOUR-OWN-SITE.netlify.app
// Never discovers a target, reads credentials, follows redirects or submits a
// project. Creates private synthetic sessions, a draft and a 20 MB CSV upload.
// Those records remain on the selected site; no deletion endpoint exists.
// Redeploy persistence and overlapping writes require separate acceptance.
import { createHash, randomUUID } from "node:crypto";

const cancelled = new AbortController();
const FILE_BYTES = 20_000_000;
const filename = "synthetic-hosted-boundary-20mb.csv";
let stage = "validate explicit target";

class VerificationError extends Error {}

function ensure(condition, message) {
  if (!condition) throw new VerificationError(message);
}

function explicitOrigin() {
  ensure(
    process.argv.length === 3,
    "Usage: npm run verify:hosted -- https://YOUR-OWN-SITE.netlify.app",
  );
  let target;
  try {
    target = new URL(process.argv[2]);
  } catch {
    throw new VerificationError(
      "The explicit target must be a valid HTTPS origin.",
    );
  }
  ensure(
    target.protocol === "https:" &&
      /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.netlify\.app$/.test(
        target.hostname,
      ) &&
      target.port === "" &&
      target.username === "" &&
      target.password === "" &&
      target.pathname === "/" &&
      target.search === "" &&
      target.hash === "",
    "Use only an explicit https://SITE.netlify.app origin without credentials, port, path, query or fragment.",
  );
  return target.origin;
}

function syntheticCSV() {
  const bytes = Buffer.alloc(FILE_BYTES);
  let offset = bytes.write("timestamp;load\n");
  const row = Buffer.from("2026-01-01T00:00:00Z;1.25\n");
  // Reserve a complete final row so the exact boundary is valid CSV, never a
  // truncated row or padding with binary bytes.
  const count = Math.floor((FILE_BYTES - offset - 4) / row.length);
  bytes.fill(row, offset, offset + count * row.length);
  offset += count * row.length;
  const tail = `0;${"0".repeat(FILE_BYTES - offset - 3)}\n`;
  ensure(bytes.write(tail, offset) === tail.length, "CSV fixture overflow.");
  return bytes;
}

function interrupted(signal) {
  process.exitCode = signal === "SIGINT" ? 130 : 143;
  cancelled.abort();
}
const onInterrupt = () => interrupted("SIGINT");
const onTerminate = () => interrupted("SIGTERM");
process.once("SIGINT", onInterrupt);
process.once("SIGTERM", onTerminate);

async function request(
  origin,
  path,
  {
    cookie,
    json,
    bytes,
    method = "GET",
    expected = 200,
    timeout = 30_000,
  } = {},
) {
  cancelled.signal.throwIfAborted();
  const url = new URL(path, origin);
  ensure(url.origin === origin, "Requests must remain on the selected site.");
  ensure(
    timeout === 30_000 || timeout === 60_000,
    "Only bounded 30/60 second requests are supported.",
  );
  const headers = { origin, accept: "application/json" };
  if (cookie) headers.cookie = cookie;
  if (json !== undefined) headers["content-type"] = "application/json";
  if (bytes) headers["content-type"] = "application/octet-stream";
  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: json !== undefined ? JSON.stringify(json) : bytes,
      redirect: "error",
      signal: AbortSignal.any([cancelled.signal, AbortSignal.timeout(timeout)]),
    });
  } catch {
    // Fetch errors can contain URLs or transport details. Never print them.
    throw new VerificationError(
      "Request failed, timed out or attempted a redirect.",
    );
  }
  if (response.status !== expected) {
    await response.body?.cancel();
    throw new VerificationError(
      `HTTP ${response.status}; expected ${expected}.`,
    );
  }
  return response;
}

async function readJSON(response) {
  try {
    return await response.json();
  } catch {
    throw new VerificationError("Expected a complete JSON response.");
  }
}

async function discard(response) {
  await response.body?.cancel();
}

async function ownerSession(origin) {
  const response = await request(origin, "/api/session", {
    method: "POST",
    json: { role: "OWNER" },
  });
  const data = await readJSON(response);
  ensure(
    data.mode === "demo",
    "The selected application must be in demo mode.",
  );
  const cookies = response.headers
    .getSetCookie()
    .filter((value) => value.startsWith("gateway_owner="));
  ensure(cookies.length === 1, "Expected exactly one owner session cookie.");
  const header = cookies[0];
  ensure(/;\s*Secure(?:;|$)/i.test(header), "Owner cookie is missing Secure.");
  ensure(
    /;\s*HttpOnly(?:;|$)/i.test(header),
    "Owner cookie is missing HttpOnly.",
  );
  ensure(
    /;\s*SameSite=Lax(?:;|$)/i.test(header),
    "Owner cookie must use SameSite=Lax.",
  );
  ensure(
    /;\s*Path=\/(?:;|$)/i.test(header),
    "Owner cookie must cover the application.",
  );
  ensure(!/;\s*Domain=/i.test(header), "Owner cookie must be host-only.");
  ensure(
    /^gateway_owner=[^;\s]+;/.test(header),
    "Owner cookie has no opaque session value.",
  );
  return header.split(";")[0];
}

function safeId(value) {
  ensure(
    typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value),
    "The application returned an invalid resource identifier.",
  );
  return value;
}

async function checkAccess(origin, paths, foreignOwner) {
  for (const path of paths) {
    await discard(await request(origin, path, { expected: 401 }));
    await discard(
      await request(origin, path, { cookie: foreignOwner, expected: 403 }),
    );
  }
}

async function verifyDownload(origin, path, owner, csv, digest) {
  const response = await request(origin, path, {
    cookie: owner,
    timeout: 60_000,
  });
  ensure(
    /^text\/csv(?:;|$)/i.test(response.headers.get("content-type") ?? ""),
    "Download must be CSV.",
  );
  const cache = response.headers.get("cache-control") ?? "";
  ensure(
    /\bprivate\b/i.test(cache) && /\bno-store\b/i.test(cache),
    "Download must use private, no-store caching.",
  );
  ensure(
    /^attachment;/i.test(response.headers.get("content-disposition") ?? ""),
    "Download must be an attachment.",
  );
  ensure(response.body, "Expected a streamed download body.");
  const hash = createHash("sha256");
  let offset = 0;
  for await (const part of response.body) {
    const chunk = Buffer.from(part);
    ensure(
      offset + chunk.length <= csv.length,
      "Download exceeds the expected size.",
    );
    ensure(
      chunk.equals(csv.subarray(offset, offset + chunk.length)),
      "Downloaded bytes differ from uploaded bytes.",
    );
    hash.update(chunk);
    offset += chunk.length;
  }
  ensure(
    offset === FILE_BYTES,
    "Download did not deliver all 20,000,000 bytes.",
  );
  ensure(hash.digest("hex") === digest, "Download checksum mismatch.");
}

try {
  const origin = explicitOrigin();
  console.log(`Target: ${origin}`);
  console.log(
    "Synthetic demo verification: creates a private draft and a 20,000,000-byte file; records remain stored.",
  );
  stage = "confirm the Gateway homepage before creating synthetic data";
  const homepage = await (await request(origin, "/")).text();
  ensure(
    homepage.includes("PROJECT GATEWAY") &&
      homepage.includes("Meinen Standort prüfen"),
    "The homepage does not identify the expected Gateway application.",
  );

  // Presentation copy is independent of the storage/integration mode. Each
  // newly created session below must still report mode=demo before any draft
  // or upload can be created by this verifier.

  stage = "create synthetic owner sessions and inspect HTTPS cookies";
  const owner = await ownerSession(origin);
  const foreignOwner = await ownerSession(origin);
  ensure(
    owner !== foreignOwner,
    "Independent owners must receive different sessions.",
  );
  console.log(
    "PASS: demo mode and Secure / HttpOnly / SameSite=Lax host-only owner cookies.",
  );

  stage = "create and save a synthetic draft";
  const address = `Synthetischer Hostingtest ${randomUUID()} - kein realer Standort`;
  const draft = await readJSON(
    await request(origin, "/api/drafts", {
      method: "POST",
      cookie: owner,
      json: { address },
    }),
  );
  const id = safeId(draft.id);
  const projectPath = `/api/drafts/${id}`;
  ensure(
    draft.answers?.address === address && draft.documents?.length === 0,
    "New synthetic draft is not empty or has unexpected data.",
  );
  ensure(
    Number.isInteger(draft.revision) && draft.revision > 0,
    "Draft revision must be a positive integer.",
  );
  const saved = await readJSON(
    await request(origin, projectPath, {
      method: "PATCH",
      cookie: owner,
      json: {
        revision: draft.revision,
        step: 1,
        completeStep: false,
        answers: {
          ...draft.answers,
          description:
            "Synthetic hosted acceptance only; no real project or personal data.",
        },
      },
    }),
  );
  ensure(
    saved.revision === draft.revision + 1,
    "Saving must advance the revision exactly once.",
  );
  await checkAccess(origin, [projectPath], foreignOwner);
  console.log(
    "PASS: synthetic draft saved; anonymous and foreign-owner access denied.",
  );

  stage = "create the 20 MB transfer";
  const csv = syntheticCSV();
  const digest = createHash("sha256").update(csv).digest("hex");
  const transferPath = `/api/projects/${id}/transfers`;
  const transfer = await readJSON(
    await request(origin, transferPath, {
      method: "POST",
      cookie: owner,
      json: {
        revision: saved.revision,
        name: filename,
        size: FILE_BYTES,
        category: "Lastgang",
      },
    }),
  );
  const transferId = safeId(transfer.id);
  // The current application promises exactly 2 MB chunks. A smaller or
  // unbounded server response must not turn acceptance into an unbounded loop.
  ensure(
    transfer.chunkSize === 2_000_000 && transfer.chunkCount === 10,
    "Expected exactly ten 2 MB chunks.",
  );
  for (let index = 0; index < 10; index++) {
    stage = `upload synthetic chunk ${index + 1}/10`;
    const chunk = csv.subarray(
      index * transfer.chunkSize,
      (index + 1) * transfer.chunkSize,
    );
    const receipt = await readJSON(
      await request(origin, `${transferPath}/${transferId}/${index}`, {
        method: "PUT",
        cookie: owner,
        bytes: chunk,
        timeout: 60_000,
      }),
    );
    ensure(
      receipt.received === index && receipt.bytes === chunk.length,
      "Chunk acknowledgement does not match the sent bytes.",
    );
    console.log(`PASS: synthetic chunk ${index + 1}/10 stored.`);
  }
  stage = "finalize the 20 MB upload";
  const finishPath = `${transferPath}/${transferId}/complete`;
  const uploaded = await readJSON(
    await request(origin, finishPath, {
      method: "POST",
      cookie: owner,
      json: {},
      timeout: 60_000,
    }),
  );
  ensure(uploaded.documents?.length === 1, "Expected one completed document.");
  const document = uploaded.documents[0];
  ensure(
    document.id === transferId &&
      document.name === filename &&
      document.size === FILE_BYTES &&
      document.hash === digest &&
      document.category === "Lastgang" &&
      document.state === "ready",
    "Completed document metadata is incorrect.",
  );
  stage = "repeat upload completion safely";
  const replay = await readJSON(
    await request(origin, finishPath, {
      method: "POST",
      cookie: owner,
      json: {},
      timeout: 60_000,
    }),
  );
  ensure(
    replay.revision === uploaded.revision &&
      replay.documents?.length === 1 &&
      replay.documents[0].id === document.id,
    "Repeated completion must not create a duplicate or change the revision.",
  );

  stage = "stream and compare all uploaded bytes";
  const filePath = `${projectPath}/documents/${safeId(document.id)}`;
  await verifyDownload(origin, filePath, owner, csv, digest);
  await checkAccess(origin, [projectPath, filePath], foreignOwner);
  console.log(
    "PASS: exact 20 MB upload, idempotent completion, byte-equal streamed download and private file access.",
  );

  stage = "verify stale-revision conflict";
  const patch = {
    revision: uploaded.revision,
    step: 1,
    completeStep: false,
    answers: {
      ...uploaded.answers,
      description:
        "Synthetic current revision; stale overwrite must be rejected.",
    },
  };
  const current = await readJSON(
    await request(origin, projectPath, {
      method: "PATCH",
      cookie: owner,
      json: patch,
    }),
  );
  ensure(
    current.revision === uploaded.revision + 1,
    "Current edit must advance the revision exactly once.",
  );
  await discard(
    await request(origin, projectPath, {
      method: "PATCH",
      cookie: owner,
      expected: 409,
      json: {
        ...patch,
        answers: {
          ...patch.answers,
          description: "STALE synthetic overwrite: must never be stored.",
        },
      },
    }),
  );
  const retained = await readJSON(
    await request(origin, projectPath, { cookie: owner }),
  );
  ensure(
    retained.revision === current.revision &&
      retained.answers?.description === patch.answers.description,
    "Stale write changed the saved project.",
  );
  console.log(
    "PASS: a stale revision receives HTTP 409 and preserves the current edit.",
  );
  console.log(`Synthetic project retained for inspection: ${id}`);
  console.log(
    "Hosted HTTP acceptance passed. Browser UI, redeployment persistence and overlapping writes are separate, unverified gates.",
  );
} catch (error) {
  process.exitCode ||= 1;
  // No response payloads, cookie values, credential-bearing URLs or stack traces.
  const reason = cancelled.signal.aborted
    ? "Verification interrupted."
    : error instanceof VerificationError
      ? error.message
      : "Unexpected transport or response error; details were not logged.";
  console.error(`Hosted verification failed during ${stage}: ${reason}`);
} finally {
  process.removeListener("SIGINT", onInterrupt);
  process.removeListener("SIGTERM", onTerminate);
}
