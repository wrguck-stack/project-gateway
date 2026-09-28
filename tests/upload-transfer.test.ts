import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NextRequest } from "next/server";
import { auth, createDraft, downloadDocument, drafts } from "@/server/services";
import { transaction } from "@/server/store";
import { putPrivateBytes, readPrivateBytes } from "@/server/storage";
import {
  boundedRequestBytes,
  cancelUploadTransfer,
  cleanupExpiredUploads,
  finishUploadTransfer,
  putUploadChunk,
  startUploadTransfer,
  UPLOAD_CHUNK_BYTES,
} from "@/server/upload-transfer";
import { DELETE, GET, POST, PUT } from "@/app/api/[...path]/route";
import type { Session } from "@/domain/model";

let dir: string,
  owner: Session,
  foreign: Session,
  partner: Session,
  token: string;
const previous = {
  data: process.env.GATEWAY_DATA_DIR,
  mode: process.env.APP_MODE,
  backend: process.env.GATEWAY_STORAGE,
};
beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), "gateway-transfer-"));
  process.env.GATEWAY_DATA_DIR = dir;
  process.env.APP_MODE = "demo";
  process.env.GATEWAY_STORAGE = "local";
  ({ session: owner, token } = await auth.create("OWNER"));
  foreign = (await auth.create("OWNER")).session;
  partner = (await auth.create("PARTNER")).session;
});
afterAll(() => {
  for (const [key, value] of Object.entries({
    GATEWAY_DATA_DIR: previous.data,
    APP_MODE: previous.mode,
    GATEWAY_STORAGE: previous.backend,
  })) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  rmSync(dir, { recursive: true, force: true });
});
function csv(size: number) {
  const bytes = Buffer.alloc(size, "1");
  bytes.write("time;load\n");
  return bytes;
}
function start(
  project: { id: string; revision: number },
  size = 30,
  name = "lastgang.csv",
) {
  return startUploadTransfer(project.id, owner, {
    name,
    size,
    category: "Lastgang",
    revision: project.revision,
  });
}
function route(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string[],
  body?: BodyInit,
  cookie = token,
  origin = "http://localhost",
) {
  const request = new NextRequest(`http://localhost/api/${path.join("/")}`, {
    method,
    body,
    headers: { cookie: cookie ? `gateway_owner=${cookie}` : "", origin },
  });
  return { GET, POST, PUT, DELETE }[method](request, {
    params: Promise.resolve({ path }),
  });
}

describe("Private serverless upload transport", () => {
  it("reassembles a >6 MB CSV in index order, streams it, and reconciles a lost completion response", async () => {
    const project = await createDraft(owner, "Große Lastgangdatei");
    const bytes = csv(6_000_007);
    const created = await route(
      "POST",
      ["projects", project.id, "transfers"],
      JSON.stringify({
        name: "lastgang.csv",
        size: bytes.length,
        category: "Lastgang",
        revision: project.revision,
      }),
    );
    expect(created.status).toBe(200);
    const transfer = await created.json();
    for (const index of [3, 1, 0, 2]) {
      const response = await route(
        "PUT",
        ["projects", project.id, "transfers", transfer.id, String(index)],
        new Uint8Array(
          bytes.subarray(
            index * UPLOAD_CHUNK_BYTES,
            (index + 1) * UPLOAD_CHUNK_BYTES,
          ),
        ),
      );
      expect(response.status).toBe(200);
    }
    const completed = await route(
      "POST",
      ["projects", project.id, "transfers", transfer.id, "complete"],
      "{}",
    );
    expect(completed.status).toBe(200);
    const saved = await completed.json();
    expect(saved.documents).toHaveLength(1);
    expect(saved.documents[0]).toMatchObject({
      id: transfer.id,
      size: bytes.length,
      state: "ready",
      reviewState: "NOT_REVIEWED",
    });
    // Simulate metadata success followed by lost transfer-completion acknowledgement.
    await transaction((state) => {
      state.uploadTransfers![transfer.id].state = "finalizing";
    });
    const replay = await route(
      "POST",
      ["projects", project.id, "transfers", transfer.id, "complete"],
      "{}",
    );
    expect(replay.status).toBe(200);
    expect((await replay.json()).revision).toBe(saved.revision);
    const download = await route("GET", [
      "projects",
      project.id,
      "documents",
      transfer.id,
    ]);
    expect(download.headers.get("cache-control")).toBe("private, no-store");
    expect(Buffer.from(await download.arrayBuffer()).equals(bytes)).toBe(true);
  });

  it("rejects wrong sizes and replacement bytes while allowing safe identical chunk retries", async () => {
    const project = await createDraft(owner, "Abschnittsprüfung");
    const transfer = await start(project, UPLOAD_CHUNK_BYTES + 12);
    await expect(
      putUploadChunk(project.id, transfer.id, owner, 0, csv(12)),
    ).rejects.toMatchObject({ status: 413 });
    await expect(
      putUploadChunk(project.id, transfer.id, owner, 2, csv(12)),
    ).rejects.toMatchObject({ status: 422 });
    await putUploadChunk(project.id, transfer.id, owner, 1, csv(12));
    await putUploadChunk(project.id, transfer.id, owner, 1, csv(12));
    await expect(
      putUploadChunk(project.id, transfer.id, owner, 1, Buffer.alloc(12, "2")),
    ).rejects.toMatchObject({ status: 409 });
    await expect(
      finishUploadTransfer(project.id, transfer.id, owner),
    ).rejects.toMatchObject({ status: 409 });
    await putUploadChunk(
      project.id,
      transfer.id,
      owner,
      0,
      csv(UPLOAD_CHUNK_BYTES),
    );
    expect(
      (await finishUploadTransfer(project.id, transfer.id, owner)).documents,
    ).toHaveLength(1);
  });

  it("enforces sessions, owner identity, project identity, revision, and request origin", async () => {
    const project = await createDraft(owner, "Zugriffsschutz");
    const transfer = await start(project);
    const path = ["projects", project.id, "transfers", transfer.id, "0"];
    expect((await route("PUT", path, csv(30), "")).status).toBe(401);
    expect(
      (await route("PUT", path, csv(30), token, "https://foreign.example"))
        .status,
    ).toBe(403);
    await expect(
      putUploadChunk(project.id, transfer.id, foreign, 0, csv(30)),
    ).rejects.toMatchObject({ status: 403 });
    await expect(
      finishUploadTransfer(project.id, transfer.id, partner),
    ).rejects.toMatchObject({ status: 403 });
    const other = await createDraft(owner, "Anderes Projekt");
    await expect(
      putUploadChunk(other.id, transfer.id, owner, 0, csv(30)),
    ).rejects.toMatchObject({ status: 404 });
    await drafts.save(
      project.id,
      owner,
      project.revision,
      { ...project.answers, address: "Neue Adresse" },
      1,
      false,
    );
    await expect(
      putUploadChunk(project.id, transfer.id, owner, 0, csv(30)),
    ).rejects.toMatchObject({ status: 409 });
    await expect(
      cancelUploadTransfer(project.id, transfer.id, foreign),
    ).rejects.toMatchObject({ status: 403 });
    expect(
      (
        await route("DELETE", [
          "projects",
          project.id,
          "transfers",
          transfer.id,
        ])
      ).status,
    ).toBe(200);
    await expect(
      putUploadChunk(project.id, transfer.id, owner, 0, csv(30)),
    ).rejects.toMatchObject({ status: 410 });
  });

  it("counts actual request bytes and preserves the small multipart upload endpoint", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(8));
        controller.enqueue(new Uint8Array(8));
        controller.close();
      },
    });
    const request = new Request("http://localhost", {
      method: "PUT",
      body: stream,
      duplex: "half",
      headers: { "content-length": "1" },
    } as RequestInit);
    await expect(boundedRequestBytes(request, 12)).rejects.toMatchObject({
      status: 413,
    });
    const project = await createDraft(owner, "Bestehende Integration");
    const form = new FormData();
    form.set("file", new File(["time;load\n0;1"], "legacy.csv"));
    form.set("category", "Lastgang");
    form.set("revision", String(project.revision));
    const response = await route(
      "POST",
      ["projects", project.id, "documents"],
      form,
    );
    expect(response.status).toBe(200);
    expect((await response.json()).documents).toHaveLength(1);
  });

  it("cleans expired chunks and uncommitted final bytes without deleting committed documents", async () => {
    const project = await createDraft(owner, "Ablauf und Bereinigung");
    const transfer = await start(project);
    await putUploadChunk(project.id, transfer.id, owner, 0, csv(30));
    await putPrivateBytes(`documents/${transfer.id}`, csv(30));
    await transaction((state) => {
      state.uploadTransfers![transfer.id].expiresAt = Date.now() - 180_000;
      state.uploadTransfers![transfer.id].cleanupAfter = Date.now() - 1;
    });
    await expect(
      finishUploadTransfer(project.id, transfer.id, owner),
    ).rejects.toMatchObject({ status: 410 });
    await cleanupExpiredUploads();
    expect(await readPrivateBytes(`uploads/${transfer.id}/0`)).toBeNull();
    expect(await readPrivateBytes(`documents/${transfer.id}`)).toBeNull();
    expect(
      await transaction((state) => state.uploadTransfers![transfer.id]),
    ).toBeUndefined();
    const completed = await start(project);
    await putUploadChunk(project.id, completed.id, owner, 0, csv(30));
    const saved = await finishUploadTransfer(project.id, completed.id, owner);
    await transaction((state) => {
      state.uploadTransfers![completed.id].expiresAt = Date.now() - 180_000;
      state.uploadTransfers![completed.id].cleanupAfter = Date.now() - 1;
    });
    await cleanupExpiredUploads();
    expect(
      (await downloadDocument(project.id, saved.documents[0].id, owner)).bytes,
    ).toEqual(csv(30));
  });

  it("reserves file count and total bytes before accepting chunks", async () => {
    const isolated = (await auth.create("OWNER")).session;
    const project = await createDraft(isolated, "Übertragungsgrenzen");
    const input = {
      name: "large.csv",
      size: 20_000_000,
      category: "Lastgang",
      revision: project.revision,
    };
    await expect(
      startUploadTransfer(project.id, isolated, { ...input, size: 20_000_001 }),
    ).rejects.toThrow();
    for (let count = 0; count < 5; count++)
      await startUploadTransfer(project.id, isolated, input);
    await expect(
      startUploadTransfer(project.id, isolated, { ...input, size: 1 }),
    ).rejects.toMatchObject({ status: 429 });
    const another = (await auth.create("OWNER")).session;
    const small = await createDraft(another, "Dateianzahlgrenze");
    for (let count = 0; count < 15; count++)
      await startUploadTransfer(small.id, another, {
        ...input,
        revision: small.revision,
        size: 1,
      });
    await expect(
      startUploadTransfer(small.id, another, {
        ...input,
        revision: small.revision,
        size: 1,
      }),
    ).rejects.toMatchObject({ status: 429 });
  });
});
