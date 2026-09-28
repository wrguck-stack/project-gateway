import { createHash, randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  mkdir,
  readFile,
  unlink,
  writeFile,
  stat,
  link,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { Readable } from "node:stream";
import { getStore } from "@netlify/blobs";
import { DomainError } from "@/domain/rules";
import { requireDemo } from "./config";

export function dataDir() {
  return resolve(
    /* turbopackIgnore: true */ process.env.GATEWAY_DATA_DIR ?? ".gateway",
  );
}

export function storageBackend(): "local" | "netlify-blobs" {
  const backend = process.env.GATEWAY_STORAGE ?? "local";
  if (backend !== "local" && backend !== "netlify-blobs")
    throw new DomainError("Unbekannter GATEWAY_STORAGE-Speicher.", 503);
  if (backend === "local" && process.env.NETLIFY === "true")
    throw new DomainError(
      "Netlify benötigt GATEWAY_STORAGE=netlify-blobs. Lokaler Speicher ist dort nicht dauerhaft.",
      503,
    );
  return backend;
}

export function blobStoreName() {
  const base = process.env.GATEWAY_BLOBS_NAMESPACE ?? "project-gateway-demo-v1";
  if (!/^[a-z0-9][a-z0-9-]{0,31}$/.test(base))
    throw new DomainError("Ungültiger GATEWAY_BLOBS_NAMESPACE.", 503);
  const context = process.env.GATEWAY_DEPLOY_CONTEXT ?? process.env.CONTEXT;
  if (context === "production") return `${base}-production`;
  if (!["deploy-preview", "branch-deploy", "dev"].includes(context ?? ""))
    throw new DomainError(
      "GATEWAY_DEPLOY_CONTEXT muss production, deploy-preview, branch-deploy oder dev sein.",
      503,
    );
  const identity =
    process.env.GATEWAY_DEPLOY_KEY ??
    process.env.REVIEW_ID ??
    process.env.BRANCH ??
    process.env.DEPLOY_ID ??
    "shared";
  const suffix = createHash("sha256")
    .update(identity)
    .digest("hex")
    .slice(0, 16);
  return `${base}-${context}-${suffix}`;
}

/** Site-wide, private store: production survives deployments; previews are isolated. */
export function privateBlobStore() {
  requireDemo();
  return getStore({ name: blobStoreName(), consistency: "strong" });
}

function localPath(key: string) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9/_-]{0,239}$/.test(key))
    throw new DomainError("Ungültiger interner Speicherschlüssel.", 500);
  return join(dataDir(), key);
}

function isMissing(error: unknown) {
  return (error as NodeJS.ErrnoException).code === "ENOENT";
}

/** Immutable private bytes. False means the key already exists, never overwrite it. */
export async function putPrivateBytes(
  key: string,
  bytes: Uint8Array,
): Promise<boolean> {
  requireDemo();
  const path = localPath(key);
  if (storageBackend() === "netlify-blobs") {
    const result = await privateBlobStore().set(
      key,
      new Uint8Array(bytes).buffer,
      {
        onlyIfNew: true,
      },
    );
    return result.modified;
  }
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const temp = join(dirname(path), `pending-${randomUUID()}`);
  try {
    await writeFile(temp, bytes, { flag: "wx", mode: 0o600 });
    // Hard-linking publishes complete bytes atomically without overwriting an
    // existing key. Concurrent chunk retries never observe a partial file.
    await link(temp, path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") return false;
    throw error;
  } finally {
    await unlink(temp).catch(() => undefined);
  }
}

export async function readPrivateBytes(key: string): Promise<Buffer | null> {
  requireDemo();
  const path = localPath(key);
  if (storageBackend() === "netlify-blobs") {
    const bytes = await privateBlobStore().get(key, {
      type: "arrayBuffer",
      consistency: "strong",
    });
    return bytes === null ? null : Buffer.from(bytes);
  }
  try {
    return await readFile(path);
  } catch (error) {
    if (isMissing(error)) return null;
    throw error;
  }
}

export async function streamPrivateBytes(
  key: string,
): Promise<ReadableStream<Uint8Array> | null> {
  requireDemo();
  const path = localPath(key);
  if (storageBackend() === "netlify-blobs")
    return privateBlobStore().get(key, {
      type: "stream",
      consistency: "strong",
    });
  try {
    await stat(path);
    return Readable.toWeb(createReadStream(path)) as ReadableStream<Uint8Array>;
  } catch (error) {
    if (isMissing(error)) return null;
    throw error;
  }
}

export async function deletePrivateBytes(key: string): Promise<void> {
  requireDemo();
  const path = localPath(key);
  if (storageBackend() === "netlify-blobs") {
    await privateBlobStore().delete(key);
    return;
  }
  try {
    await unlink(path);
  } catch (error) {
    if (!isMissing(error)) throw error;
  }
}
