import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  renameSync,
  unlinkSync,
} from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { Project, Session } from "@/domain/model";
import { DomainError } from "@/domain/rules";
import { seedProjects } from "./seed";
import { requireDemo } from "./config";
import { dataDir, privateBlobStore, storageBackend } from "./storage";
import type { UploadTransfer } from "./upload-transfer";
export { dataDir } from "./storage";
export type Store = {
  version: 1;
  projects: Record<string, Project>;
  sessions: Record<string, Session>;
  requests: Record<string, { fingerprint: string; result: unknown }>;
  uploadTransfers?: Record<string, UploadTransfer>;
};
const STORE_KEY = "demo-store.json";
const MAX_ATTEMPTS = 8;

export class StorageCommitUncertainError extends DomainError {
  constructor() {
    super(
      "Der Speicherstand konnte nicht bestätigt werden. Bitte den aktuellen Projektstand neu laden, bevor Sie den Vorgang erneut ausführen.",
      503,
    );
  }
}

function initialStore(): Store {
  return {
    version: 1,
    projects: Object.fromEntries(seedProjects().map((p) => [p.id, p])),
    sessions: {},
    requests: {},
  };
}

function assertStore(value: unknown): asserts value is Store {
  if (
    !value ||
    typeof value !== "object" ||
    !("version" in value) ||
    value.version !== 1 ||
    !("projects" in value) ||
    !value.projects ||
    !("sessions" in value) ||
    !value.sessions ||
    !("requests" in value) ||
    !value.requests
  )
    throw new DomainError(
      "Der gespeicherte Projektstand ist ungültig. Keine automatische Rücksetzung.",
      503,
    );
}

function run<T>(fn: (state: Store) => T, state: Store) {
  const before = JSON.stringify(state);
  const result = fn(state);
  if (result && typeof result === "object" && "then" in result)
    throw new Error(
      "Storage transaction callbacks must be synchronous and have no external side effects.",
    );
  return {
    result: structuredClone(result),
    before,
    after: JSON.stringify(state),
  };
}

/**
 * The callback may run again after a competing write. It must only inspect/mutate
 * state, with no I/O or external side effects. Only a confirmed CAS is returned.
 */
export async function transaction<T>(fn: (state: Store) => T): Promise<T> {
  requireDemo();
  if (storageBackend() === "local") {
    // No await inside this block: atomic within the local single Node process.
    const dir = dataDir();
    const path = join(dir, STORE_KEY);
    const state: unknown = existsSync(path)
      ? JSON.parse(readFileSync(path, "utf8"))
      : initialStore();
    assertStore(state);
    const { result, before, after } = run(fn, state);
    if (before === after) return result;
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    const temp = join(dir, `store-${randomUUID()}.tmp`);
    try {
      writeFileSync(temp, after, { mode: 0o600 });
      renameSync(temp, path);
    } finally {
      if (existsSync(temp)) unlinkSync(temp);
    }
    return result;
  }

  const store = privateBlobStore();
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const entry = await store.getWithMetadata(STORE_KEY, {
      type: "json",
      consistency: "strong",
    });
    const state: unknown = entry ? entry.data : initialStore();
    assertStore(state);
    const { result, before, after } = run(fn, state);
    // Includes authorization/session resolution and idempotent replays.
    if (before === after) return result;
    if (entry && !entry.etag)
      throw new DomainError(
        "Der Speicher hat keine gültige Versionskennung geliefert.",
        503,
      );
    let written;
    try {
      written = await store.set(
        STORE_KEY,
        after,
        entry ? { onlyIfMatch: entry.etag } : { onlyIfNew: true },
      );
    } catch {
      // A network failure may follow a successful write. Never rerun an
      // unconfirmed mutation or erase its document bytes automatically.
      throw new StorageCommitUncertainError();
    }
    if (written.modified) return result;
    // A competing CAS won. Re-read strongly, then re-check domain revisions.
  }
  throw new DomainError(
    "Der Speicher wird gleichzeitig aktualisiert. Bitte erneut versuchen.",
    409,
  );
}
