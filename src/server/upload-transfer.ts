import { randomUUID } from "node:crypto";
import { z } from "zod";
import { categories, type Document, type Session } from "@/domain/model";
import {
  authorize,
  checkRevision,
  DomainError,
  uploadLimits,
} from "@/domain/rules";
import { transaction, type Store } from "./store";
import { uploads } from "./services";
import {
  deletePrivateBytes,
  putPrivateBytes,
  readPrivateBytes,
} from "./storage";

// Raw chunks stay comfortably below the serverless binary request limit.
export const UPLOAD_CHUNK_BYTES = 2_000_000;
export const UPLOAD_TRANSFER_TTL_MS = 60 * 60 * 1000;
const CLEANUP_GRACE_MS = 120_000;
const MAX_TRANSFERS = 200;
const MAX_PENDING_BYTES = 500_000_000;

export type UploadTransfer = {
  id: string;
  projectId: string;
  actorId: string;
  tenantId: string;
  revision: number;
  name: string;
  size: number;
  category: Document["category"];
  chunkCount: number;
  createdAt: number;
  expiresAt: number;
  cleanupAfter: number;
  state: "open" | "finalizing" | "complete" | "cancelled";
  bytesReleased?: boolean;
};

const transferInput = z
  .object({
    revision: z.number().int().positive(),
    name: z
      .string()
      .min(1)
      .max(240)
      .refine((name) => !/[\u0000-\u001f\u007f]/.test(name)),
    size: z.number().int().positive().max(20_000_000),
    category: z.enum(categories),
  })
  .strict();
const transferId = z.uuid();

function ownedProject(state: Store, id: string, actor: Session) {
  const project = state.projects[id];
  if (!project || actor.role !== "OWNER")
    throw new DomainError("Kein Zugriff auf diese Dateiübertragung.", 403);
  authorize(project, actor);
  return project;
}

function requireTransfer(
  state: Store,
  projectId: string,
  id: string,
  actor: Session,
) {
  const project = ownedProject(state, projectId, actor);
  const transfer = state.uploadTransfers?.[id];
  if (
    !transfer ||
    transfer.projectId !== projectId ||
    transfer.actorId !== actor.actorId ||
    transfer.tenantId !== actor.tenantId
  )
    throw new DomainError(
      "Dateiübertragung nicht verfügbar. Bitte erneut auswählen.",
      404,
    );
  if (transfer.expiresAt <= Date.now())
    throw new DomainError(
      "Die Dateiübertragung ist abgelaufen. Bitte erneut hochladen.",
      410,
    );
  if (transfer.state === "cancelled")
    throw new DomainError("Die Dateiübertragung wurde entfernt.", 410);
  return { project, transfer };
}

function requireEditable(
  project: ReturnType<typeof ownedProject>,
  revision: number,
) {
  if (project.receipt)
    throw new DomainError(
      "Upload nur im eigenen, noch nicht eingereichten Entwurf.",
      403,
    );
  checkRevision(project, revision);
}

function chunkKey(id: string, index: number) {
  return `uploads/${id}/${index}`;
}

/** Private bounded sweep; invoked on the next upload, never exposed as a public route.
 * Tombstones outlive in-flight serverless requests before their bytes are removed.
 * Failed deletion keeps its record so that a later sweep can retry it.
 */
export async function cleanupExpiredUploads(at = Date.now()) {
  const candidates = await transaction((state) =>
    Object.values(state.uploadTransfers ?? {})
      .filter((entry) => entry.cleanupAfter <= at)
      .slice(0, 25),
  );
  for (const entry of candidates) {
    try {
      for (let index = 0; index < entry.chunkCount; index++)
        await deletePrivateBytes(chunkKey(entry.id, index));
      // Expiry is also checked in the document metadata CAS: after this grace
      // period no in-flight finalization can publish an unreferenced final blob.
      if (entry.expiresAt + CLEANUP_GRACE_MS <= at) {
        const referenced = await transaction((state) =>
          Object.values(state.projects).some((project) =>
            project.documents.some((document) => document.id === entry.id),
          ),
        );
        if (!referenced) await deletePrivateBytes(`documents/${entry.id}`);
      }
      await transaction((state) => {
        const current = state.uploadTransfers?.[entry.id];
        if (!current || current.cleanupAfter !== entry.cleanupAfter) return;
        if (current.expiresAt + CLEANUP_GRACE_MS <= at)
          delete state.uploadTransfers![entry.id];
        else {
          current.bytesReleased = true;
          current.cleanupAfter = current.expiresAt + CLEANUP_GRACE_MS;
        }
      });
    } catch {
      // Keep the manifest and reservation for a future retry; no false cleanup claim.
    }
  }
}

export async function startUploadTransfer(
  projectId: string,
  actor: Session,
  input: unknown,
) {
  const value = transferInput.parse(input);
  // Fail authorization before scanning any global staging records.
  await transaction((state) => {
    requireEditable(ownedProject(state, projectId, actor), value.revision);
  });
  await cleanupExpiredUploads();
  const at = Date.now();
  const id = randomUUID();
  return transaction((state) => {
    const project = ownedProject(state, projectId, actor);
    requireEditable(project, value.revision);
    const records = Object.values(state.uploadTransfers ?? {});
    const pending = records.filter((entry) => !entry.bytesReleased);
    if (
      records.length >= MAX_TRANSFERS ||
      pending.reduce((sum, entry) => sum + entry.size, 0) + value.size >
        MAX_PENDING_BYTES
    )
      throw new DomainError(
        "Zu viele offene Dateiübertragungen. Bitte später erneut versuchen.",
        429,
      );
    const own = pending.filter(
      (entry) =>
        entry.actorId === actor.actorId && entry.tenantId === actor.tenantId,
    );
    if (
      own.length >= 15 ||
      own.reduce((sum, entry) => sum + entry.size, 0) + value.size > 100_000_000
    )
      throw new DomainError(
        "Bitte offene Dateiübertragungen abschließen oder entfernen.",
        429,
      );
    const projectPending = pending.filter(
      (entry) =>
        entry.projectId === projectId &&
        (entry.state === "open" || entry.state === "finalizing"),
    );
    uploadLimits([
      ...project.documents.filter((document) => document.state !== "removed"),
      ...projectPending,
      value,
    ]);
    const transfer: UploadTransfer = {
      ...value,
      id,
      projectId,
      actorId: actor.actorId,
      tenantId: actor.tenantId,
      chunkCount: Math.ceil(value.size / UPLOAD_CHUNK_BYTES),
      createdAt: at,
      expiresAt: at + UPLOAD_TRANSFER_TTL_MS,
      cleanupAfter: at + UPLOAD_TRANSFER_TTL_MS + CLEANUP_GRACE_MS,
      state: "open",
    };
    (state.uploadTransfers ??= {})[id] = transfer;
    return {
      id,
      chunkSize: UPLOAD_CHUNK_BYTES,
      chunkCount: transfer.chunkCount,
      expiresAt: transfer.expiresAt,
    };
  });
}

export async function putUploadChunk(
  projectId: string,
  id: string,
  actor: Session,
  index: number,
  bytes: Uint8Array,
) {
  transferId.parse(id);
  const entry = await transaction((state) => {
    const { project, transfer } = requireTransfer(state, projectId, id, actor);
    requireEditable(project, transfer.revision);
    if (transfer.state !== "open")
      throw new DomainError("Die Datei wird bereits verarbeitet.", 409);
    return transfer;
  });
  if (!Number.isInteger(index) || index < 0 || index >= entry.chunkCount)
    throw new DomainError("Ungültiger Dateiabschnitt.", 422);
  const expected = Math.min(
    UPLOAD_CHUNK_BYTES,
    entry.size - index * UPLOAD_CHUNK_BYTES,
  );
  if (bytes.byteLength !== expected)
    throw new DomainError(
      "Die Größe des Dateiabschnitts stimmt nicht überein.",
      413,
    );
  const key = chunkKey(id, index);
  if (!(await putPrivateBytes(key, bytes))) {
    const existing = await readPrivateBytes(key);
    if (!existing?.equals(Buffer.from(bytes)))
      throw new DomainError(
        "Dieser Dateiabschnitt wurde bereits mit anderem Inhalt übertragen.",
        409,
      );
  }
  try {
    await transaction((state) => {
      const { transfer } = requireTransfer(state, projectId, id, actor);
      if (transfer.state !== "open")
        throw new DomainError("Dateiübertragung bereits beendet.", 409);
    });
  } catch (error) {
    // A cancellation/expiry can race a byte write; do not leave that late chunk behind.
    if (error instanceof DomainError && [404, 410].includes(error.status))
      await deletePrivateBytes(key);
    throw error;
  }
  return { received: index, bytes: expected };
}

export async function finishUploadTransfer(
  projectId: string,
  id: string,
  actor: Session,
) {
  transferId.parse(id);
  const snapshot = await transaction((state) => {
    const { project, transfer } = requireTransfer(state, projectId, id, actor);
    // Metadata may have committed before the completion response was lost.
    // Reconcile the stable document ID before checking the now-old revision.
    const committed = project.documents.find((document) => document.id === id);
    if (
      committed &&
      committed.name === transfer.name &&
      committed.size === transfer.size &&
      committed.category === transfer.category
    ) {
      transfer.state = "complete";
      transfer.cleanupAfter = Date.now() + CLEANUP_GRACE_MS;
    }
    if (transfer.state === "complete") return { project, transfer };
    requireEditable(project, transfer.revision);
    transfer.state = "finalizing";
    return { project, transfer };
  });
  if (snapshot.transfer.state === "complete") return snapshot.project;
  const entry = snapshot.transfer;
  try {
    const chunks: ArrayBuffer[] = [];
    for (let index = 0; index < entry.chunkCount; index++) {
      const bytes = await readPrivateBytes(chunkKey(id, index));
      const expected = Math.min(
        UPLOAD_CHUNK_BYTES,
        entry.size - index * UPLOAD_CHUNK_BYTES,
      );
      if (!bytes || bytes.length !== expected)
        throw new DomainError(
          "Die Datei ist noch nicht vollständig übertragen.",
          409,
        );
      chunks.push(new Uint8Array(bytes).buffer);
    }
    const file = new File(chunks, entry.name);
    const project = await uploads.upload(
      projectId,
      actor,
      file,
      entry.category,
      entry.revision,
      id,
    );
    await transaction((state) => {
      const current = state.uploadTransfers?.[id];
      if (current) {
        current.state = "complete";
        current.cleanupAfter = Date.now() + CLEANUP_GRACE_MS;
      }
    });
    return project;
  } catch (error) {
    // A confirmed validation/conflict failure permits retrying chunks or removal.
    // Ambiguous storage failures keep FINALIZING and the stable upload ID for reconciliation.
    if (error instanceof DomainError && error.status < 500)
      await transaction((state) => {
        const current = state.uploadTransfers?.[id];
        if (current?.state === "finalizing") current.state = "open";
      });
    throw error;
  }
}

export async function cancelUploadTransfer(
  projectId: string,
  id: string,
  actor: Session,
) {
  transferId.parse(id);
  return transaction((state) => {
    const { transfer } = requireTransfer(state, projectId, id, actor);
    if (transfer.state === "finalizing" || transfer.state === "complete")
      throw new DomainError(
        "Verarbeitung bereits begonnen. Bitte den Projektstand prüfen.",
        409,
      );
    transfer.state = "cancelled";
    transfer.cleanupAfter = Date.now() + CLEANUP_GRACE_MS;
    return { removed: true };
  });
}

/** Counts actual bytes even if Content-Length is absent or forged. */
export async function boundedRequestBytes(request: Request, limit: number) {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (!Number.isFinite(declared) || declared < 0 || declared > limit)
    throw new DomainError("Anfrage zu groß.", 413);
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new DomainError("Anfrage zu groß.", 413);
      }
      chunks.push(next.value);
    }
  } finally {
    reader.releaseLock();
  }
  return new Uint8Array(Buffer.concat(chunks, size));
}
