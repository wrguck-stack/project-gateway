import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  renameSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { randomUUID } from "node:crypto";
import type { Project, Session } from "@/domain/model";
import { seedProjects } from "./seed";
import { requireDemo } from "./config";
export type Store = {
  version: 1;
  projects: Record<string, Project>;
  sessions: Record<string, Session>;
  requests: Record<string, { fingerprint: string; result: unknown }>;
};
export function dataDir() {
  return resolve(
    /* turbopackIgnore: true */ process.env.GATEWAY_DATA_DIR ?? ".gateway",
  );
}
export function transaction<T>(fn: (state: Store) => T): T {
  requireDemo();
  const dir = dataDir();
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const path = join(dir, "demo-store.json");
  const state: Store = existsSync(path)
    ? JSON.parse(readFileSync(path, "utf8"))
    : {
        version: 1,
        projects: Object.fromEntries(seedProjects().map((p) => [p.id, p])),
        sessions: {},
        requests: {},
      };
  // This synchronous read/mutate/rename transaction is atomic within one Node process.
  // Demo deployment MUST remain single-process; PostgreSQL is required for multi-process live operation.
  const result = fn(state);
  const temp = join(dir, `store-${randomUUID()}.tmp`);
  writeFileSync(temp, JSON.stringify(state), { mode: 0o600 });
  renameSync(temp, path);
  return structuredClone(result);
}
