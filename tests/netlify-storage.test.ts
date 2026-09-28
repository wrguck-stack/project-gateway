import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Store } from "@/server/store";

type BlobEntry = { text: string; etag: string };
type WriteOptions = { onlyIfNew?: boolean; onlyIfMatch?: string };

// One remote store is shared by all simulated function invocations. Reads
// return independent snapshots; only a matching ETag can replace a snapshot.
const remote = vi.hoisted(() => ({
  stores: new Map<string, Map<string, BlobEntry>>(),
  opens: [] as { name: string; consistency?: string }[],
  writes: [] as { name: string; key: string; options: WriteOptions }[],
  revision: 0,
  conflicts: 0,
  failReads: false,
  writeFailure: null as "before" | "after" | null,
  competingWrite: false,
}));

vi.mock("@netlify/blobs", () => ({
  getStore(options: { name: string; consistency?: string }) {
    remote.opens.push(options);
    const entries =
      remote.stores.get(options.name) ?? new Map<string, BlobEntry>();
    remote.stores.set(options.name, entries);
    return {
      async getWithMetadata(key: string) {
        if (remote.failReads) throw new Error("Remote storage unavailable");
        const entry = entries.get(key);
        return entry
          ? { data: JSON.parse(entry.text), etag: entry.etag, metadata: {} }
          : null;
      },
      async set(key: string, text: string, conditions: WriteOptions = {}) {
        remote.writes.push({ name: options.name, key, options: conditions });
        if (remote.writeFailure === "before")
          throw new Error("Remote write unavailable");
        const entry = entries.get(key);
        if (remote.competingWrite && entry && conditions.onlyIfMatch) {
          remote.competingWrite = false;
          const competingState = JSON.parse(entry.text) as Store;
          competingState.requests.other = {
            fingerprint: "another-invocation",
            result: "preserved",
          };
          entries.set(key, {
            text: JSON.stringify(competingState),
            etag: `etag-${++remote.revision}`,
          });
          remote.conflicts++;
          return { modified: false };
        }
        if (
          (conditions.onlyIfNew && entry) ||
          (conditions.onlyIfMatch && entry?.etag !== conditions.onlyIfMatch)
        ) {
          remote.conflicts++;
          return { modified: false };
        }
        const etag = `etag-${++remote.revision}`;
        entries.set(key, { text, etag });
        if (remote.writeFailure === "after")
          throw new Error("Response lost after remote commit");
        return { modified: true, etag };
      },
    };
  },
}));

import { auth, createDraft, drafts, partnerProjects } from "@/server/services";
import { transaction } from "@/server/store";

let localDir: string;

beforeEach(() => {
  remote.stores.clear();
  remote.opens.length = 0;
  remote.writes.length = 0;
  remote.revision = 0;
  remote.conflicts = 0;
  remote.failReads = false;
  remote.writeFailure = null;
  remote.competingWrite = false;
  localDir = mkdtempSync(join(tmpdir(), "gateway-netlify-storage-"));
  vi.stubEnv("APP_MODE", "demo");
  vi.stubEnv("NETLIFY", "true");
  vi.stubEnv("GATEWAY_STORAGE", "netlify-blobs");
  vi.stubEnv("GATEWAY_DATA_DIR", localDir);
  vi.stubEnv("GATEWAY_BLOBS_NAMESPACE", "test-gateway");
  vi.stubEnv("GATEWAY_DEPLOY_CONTEXT", "production");
  vi.stubEnv("GATEWAY_DEPLOY_KEY", "");
  vi.stubEnv("CONTEXT", "production");
  vi.stubEnv("DEPLOY_ID", "deploy-one");
  vi.stubEnv("REVIEW_ID", "");
  vi.stubEnv("BRANCH", "feat/homepage-professional-pass");
});

afterEach(() => {
  vi.unstubAllEnvs();
  rmSync(localDir, { recursive: true, force: true });
});

describe("Durable Netlify state across function invocations", () => {
  it("preserves every session during competing first writes and every concurrent draft", async () => {
    const sessions = await Promise.all([
      auth.create("OWNER"),
      auth.create("OWNER"),
      auth.create("PARTNER"),
    ]);
    for (const { token, session } of sessions)
      expect(await auth.resolve(token)).toEqual(session);

    const projects = await Promise.all([
      createDraft(sessions[0].session, "Halle am Nordtor"),
      createDraft(sessions[1].session, "Halle am Südtor"),
    ]);
    expect(await drafts.get(projects[0].id, sessions[0].session)).toEqual(
      projects[0],
    );
    expect(await drafts.get(projects[1].id, sessions[1].session)).toEqual(
      projects[1],
    );
    await expect(
      drafts.get(projects[0].id, sessions[1].session),
    ).rejects.toMatchObject({
      status: 403,
    });
    expect(remote.conflicts).toBeGreaterThan(0);
    expect(remote.writes.some((write) => write.options.onlyIfNew)).toBe(true);
    expect(remote.opens.every((open) => open.consistency === "strong")).toBe(
      true,
    );
  });

  it("accepts only one concurrent edit of a revision and keeps the winning contents", async () => {
    const { session } = await auth.create("OWNER");
    const project = await createDraft(
      session,
      "Gewerbehalle vor der Bearbeitung",
    );
    const edits = await Promise.allSettled([
      drafts.save(
        project.id,
        session,
        project.revision,
        { ...project.answers, address: "Gewerbehalle Nord" },
        1,
        false,
      ),
      drafts.save(
        project.id,
        session,
        project.revision,
        { ...project.answers, address: "Gewerbehalle Süd" },
        1,
        false,
      ),
    ]);
    const accepted = edits.filter((edit) => edit.status === "fulfilled");
    const rejected = edits.filter((edit) => edit.status === "rejected");
    expect(accepted).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(rejected[0].reason).toMatchObject({ status: 409 });
    const saved = await drafts.get(project.id, session);
    expect(saved).toEqual(accepted[0].value);
    expect(saved.revision).toBe(project.revision + 1);
  });

  it("retries a rejected conditional write against fresh state without losing a competing change", async () => {
    await auth.create("OWNER");
    remote.competingWrite = true;
    await transaction((state) => {
      state.requests.ours = { fingerprint: "this-invocation", result: "saved" };
      return true;
    });
    expect(await transaction((state) => state.requests)).toEqual({
      other: { fingerprint: "another-invocation", result: "preserved" },
      ours: { fingerprint: "this-invocation", result: "saved" },
    });
    expect(remote.conflicts).toBe(1);
  });

  it("does not rewrite persistent state when resolving sessions or reading projects", async () => {
    const owner = await auth.create("OWNER");
    const partner = await auth.create("PARTNER");
    const project = await createDraft(owner.session, "Halle für Lesezugriffe");
    const writeCount = remote.writes.length;
    expect(await auth.resolve(owner.token)).toEqual(owner.session);
    expect(await drafts.get(project.id, owner.session)).toEqual(project);
    expect(
      (await partnerProjects.list(partner.session)).length,
    ).toBeGreaterThan(0);
    expect(remote.writes).toHaveLength(writeCount);
  });

  it("fails on unavailable remote reads and writes without saving a local substitute", async () => {
    remote.failReads = true;
    await expect(auth.create("OWNER")).rejects.toThrow(
      "Remote storage unavailable",
    );
    expect(remote.writes).toHaveLength(0);
    remote.failReads = false;
    remote.writeFailure = "before";
    await expect(auth.create("OWNER")).rejects.toMatchObject({ status: 503 });
    expect(remote.writes).toHaveLength(1);
    expect(existsSync(join(localDir, "demo-store.json"))).toBe(false);
    expect(
      [...remote.stores.values()].every((entries) => entries.size === 0),
    ).toBe(true);
  });

  it.each([null, { version: 99, projects: {}, sessions: {}, requests: {} }])(
    "does not replace an invalid stored document (%j) with seeded demo data",
    async (invalidState) => {
      await auth.create("OWNER");
      const lastWrite = remote.writes.at(-1)!;
      const entry = remote.stores.get(lastWrite.name)!.get(lastWrite.key)!;
      entry.text = JSON.stringify(invalidState);
      const writesBefore = remote.writes.length;
      await expect(auth.create("OWNER")).rejects.toMatchObject({ status: 503 });
      expect(remote.writes).toHaveLength(writesBefore);
      expect(entry.text).toBe(JSON.stringify(invalidState));
      expect(existsSync(join(localDir, "demo-store.json"))).toBe(false);
    },
  );

  it("reports an uncertain commit without replaying a mutation after its response is lost", async () => {
    await auth.create("OWNER");
    const writesBefore = remote.writes.length;
    remote.writeFailure = "after";
    await expect(
      transaction((state) => {
        state.requests.once = {
          fingerprint: "request-once",
          result: "committed",
        };
        return "committed";
      }),
    ).rejects.toMatchObject({ status: 503 });
    expect(remote.writes).toHaveLength(writesBefore + 1);
    remote.writeFailure = null;
    expect(await transaction((state) => state.requests.once)).toEqual({
      fingerprint: "request-once",
      result: "committed",
    });
  });

  it("keeps production durable across deployments and isolates preview data", async () => {
    const production = await auth.create("OWNER");
    const project = await createDraft(
      production.session,
      "Dauerhafter Produktionsentwurf",
    );
    vi.stubEnv("DEPLOY_ID", "deploy-two");
    expect(await auth.resolve(production.token)).toEqual(production.session);
    expect(await drafts.get(project.id, production.session)).toEqual(project);

    vi.stubEnv("GATEWAY_DEPLOY_CONTEXT", "deploy-preview");
    vi.stubEnv("GATEWAY_DEPLOY_KEY", "review-42");
    vi.stubEnv("REVIEW_ID", "42");
    expect(await auth.resolve(production.token)).toBeNull();
    await expect(
      drafts.get(project.id, production.session),
    ).rejects.toMatchObject({ status: 404 });
    const preview = await auth.create("OWNER");
    vi.stubEnv("DEPLOY_ID", "preview-rebuilt");
    expect(await auth.resolve(preview.token)).toEqual(preview.session);

    vi.stubEnv("GATEWAY_DEPLOY_KEY", "review-43");
    vi.stubEnv("REVIEW_ID", "43");
    expect(await auth.resolve(preview.token)).toBeNull();
    vi.stubEnv("GATEWAY_DEPLOY_CONTEXT", "production");
    expect(await auth.resolve(production.token)).toEqual(production.session);
    expect(await auth.resolve(preview.token)).toBeNull();
  });
});
