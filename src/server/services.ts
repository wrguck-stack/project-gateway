import { randomUUID, randomBytes, createHash } from "node:crypto";
import { z } from "zod";
import {
  answersSchema,
  contactSchema,
  categories,
  rejectionSchema,
  type Answers,
  type Session,
  type Project,
  type Document,
  type Receipt,
  type HistoryEvent,
  statuses,
} from "@/domain/model";
import {
  authorize,
  checkRevision,
  coverage,
  DomainError,
  guardTransition,
  normalizeAnswers,
  uploadLimits,
  validateStep,
} from "@/domain/rules";
import { transaction, StorageCommitUncertainError, type Store } from "./store";
import {
  putPrivateBytes,
  readPrivateBytes,
  streamPrivateBytes,
  deletePrivateBytes,
} from "./storage";
import { newProject, demoAddresses } from "./seed";
import { qualifyDemo } from "./qualification";
import { partnerConfig, requireDemo } from "./config";
import type {
  AuthProvider,
  DraftRepository,
  LocationSearchProvider,
  SiteEvidenceProvider,
  PartnerProjectRepository,
  PartnerActionProvider,
  SubmissionProvider,
  QualificationProvider,
  UploadProvider,
} from "./ports";
const now = () => new Date().toISOString();
const hash = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");
function find(s: Store, id: string, actor: Session, partnerOnly = false) {
  const p = s.projects[id];
  if (!p) throw new DomainError("Projekt nicht gefunden.", 404);
  authorize(p, actor, partnerOnly);
  return p;
}
function bump(p: Project) {
  p.revision++;
  p.updatedAt = now();
}
function event(
  p: Project,
  actor: Session,
  requestId: string,
  action: string,
  from = p.status,
  note = "",
  rejection: HistoryEvent["rejection"] = null,
  visibility: HistoryEvent["visibility"] = "INTERNAL",
) {
  p.events.unshift({
    eventId: randomUUID(),
    requestId,
    actorId: actor.actorId,
    occurredAt: now(),
    action,
    from,
    to: p.status,
    inputVersion: String(p.inputVersion),
    revision: p.revision,
    scoreSnapshot: structuredClone(p.score),
    rejection,
    note,
    visibility,
    simulated: true,
  });
}
function idempotent<T>(
  s: Store,
  actor: Session,
  id: string,
  key: string,
  input: unknown,
  fn: () => T,
): T {
  z.string().min(8).max(160).parse(key);
  const k = `${actor.tenantId}:${actor.actorId}:${id}:${key}`;
  const fingerprint = hash(JSON.stringify(input));
  const previous = s.requests[k];
  if (previous) {
    if (previous.fingerprint !== fingerprint)
      throw new DomainError(
        "Diese Auftrags-ID gehört zu anderen Eingaben.",
        409,
      );
    return previous.result as T;
  }
  const result = fn();
  s.requests[k] = { fingerprint, result: structuredClone(result) };
  return result;
}
export const auth: AuthProvider = {
  async create(role) {
    requireDemo();
    const token = randomBytes(32).toString("hex");
    const session: Session = {
      actorId: role === "PARTNER" ? "demo-reviewer" : `owner-${randomUUID()}`,
      role,
      tenantId: partnerConfig.id,
      partnerId: role === "PARTNER" ? partnerConfig.id : null,
      expiresAt: Date.now() + 86400000 * 7,
    };
    await transaction((s) => {
      s.sessions[hash(token)] = session;
      return true;
    });
    return { token, session };
  },
  async resolve(token) {
    if (!token) return null;
    return transaction((s) => {
      const session = s.sessions[hash(token)];
      return session && session.expiresAt > Date.now() ? session : null;
    });
  },
};
export const locations: LocationSearchProvider = {
  async search(query) {
    requireDemo();
    return demoAddresses
      .filter((a) =>
        a.toLocaleLowerCase("de").includes(query.toLocaleLowerCase("de")),
      )
      .map((address) => ({
        address,
        source: "Synthetischer Demo-Standort",
        coordinates: null,
      }));
  },
};
export const siteEvidence: SiteEvidenceProvider = {
  async get() {
    requireDemo();
    return { available: false, source: null, coordinates: null };
  },
};
export const projectIntentSchema = z.enum([
  "roof",
  "extension",
  "storage",
  "ground",
]);
export type ProjectIntent = z.infer<typeof projectIntentSchema>;
export async function createDraft(
  actor: Session,
  address: string,
  projectIntent?: ProjectIntent,
) {
  if (actor.role !== "OWNER")
    throw new DomainError("Eigentümersitzung erforderlich.", 403);
  z.string().trim().min(3).max(240).parse(address);
  const intent = projectIntentSchema.optional().parse(projectIntent);
  return transaction((s) => {
    const p = newProject(
      `PG-${randomUUID().slice(0, 8).toUpperCase()}`,
      actor.actorId,
      address.trim(),
      now(),
    );
    // A selected project type expresses intent, not verified site evidence.
    if (intent === "ground") {
      p.answers.buildingType = "Freifläche";
      p.answers.areaKind = "Freifläche";
      p.answers.goal = "Dach oder Fläche bereitstellen";
    } else if (intent === "extension") {
      p.answers.goal = "Bestehende PV erweitern";
    } else if (intent === "storage") {
      p.answers.goal = "Speicher ergänzen";
    } else if (intent === "roof") {
      p.answers.areaKind = "Dach";
      p.answers.goal = "Möglichkeiten zunächst prüfen";
    }
    s.projects[p.id] = p;
    return p;
  });
}
export const drafts: DraftRepository = {
  async get(id, actor) {
    return transaction((s) => find(s, id, actor));
  },
  async save(id, actor, revision, answers, step, completeStep = true) {
    return transaction((s) => {
      const p = find(s, id, actor);
      if (actor.role !== "OWNER")
        throw new DomainError(
          "Nur der Projektkontakt kann den Entwurf bearbeiten.",
          403,
        );
      checkRevision(p, revision);
      if (p.receipt)
        throw new DomainError(
          "Die eingereichte Fassung ist unveränderlich. Ergänzungen erfolgen über die Rückfrage in der Projektübersicht.",
          409,
        );
      const a = normalizeAnswers(answersSchema.parse(answers));
      if (completeStep) validateStep(a, step);
      const changed = JSON.stringify(a) !== JSON.stringify(p.answers);
      p.answers = a;
      p.synthetic = demoAddresses.includes(a.address);
      if (completeStep)
        p.maxVisited = Math.max(p.maxVisited, Math.min(step + 1, 10));
      if (changed) {
        p.inputVersion++;
        if (p.score) p.score.state = "STALE";
      }
      bump(p);
      return p;
    });
  },
};
export const qualification: QualificationProvider = {
  async qualify(id, actor, revision) {
    const started = await transaction((s) => {
      const p = find(s, id, actor);
      checkRevision(p, revision);
      for (let step = 1; step <= 10; step++) validateStep(p.answers, step);
      if (
        p.score?.inputVersion === String(p.inputVersion) &&
        !["STALE", "ERROR"].includes(p.score.state)
      )
        return p;
      p.scoreJobState = "RUNNING";
      if (["NEW", "INCOMPLETE"].includes(p.status)) {
        guardTransition(p, "SCORING", {});
        p.status = "SCORING";
        p.statusEnteredAt = now();
      }
      if (p.score) p.score.state = "SCORING";
      p.analysisRows = [
        { label: "Standort zuordnen", state: "complete" },
        { label: "Objektdaten prüfen", state: "running" },
        { label: "Energiedaten einordnen", state: "waiting" },
        { label: "Projektqualifizierung erstellen", state: "waiting" },
      ];
      bump(p);
      return p;
    });
    if (started.scoreJobState !== "RUNNING") return started;
    // Each phase follows actual synchronous validation/calculation/persistence; no delay or pretend progress.
    return transaction((s) => {
      const p = find(s, id, actor);
      if (p.inputVersion !== started.inputVersion)
        throw new DomainError(
          "Angaben wurden geändert. Bitte die aktuelle Version qualifizieren.",
          409,
        );
      p.score = qualifyDemo(p, now());
      p.scoreJobState = p.score.state === "ERROR" ? "FAILED" : "SUCCEEDED";
      p.analysisRows = [
        { label: "Standort manuell erfasst", state: "complete" },
        { label: "Objektdaten auf Vollständigkeit geprüft", state: "complete" },
        {
          label: "Energiedaten eingeordnet",
          state: p.answers.consumption === null ? "open" : "complete",
        },
        {
          label: "Projektqualifizierung erstellt",
          state: p.score.state === "ERROR" ? "error" : "complete",
        },
      ];
      if (p.status === "SCORING") {
        const qualified = canSubmit(p);
        const to = qualified
          ? "QUALIFIED"
          : p.score.displayScore !== null && p.score.displayScore < 50
            ? "NEW"
            : "INCOMPLETE";
        guardTransition(p, to, { qualified });
        p.status = to;
        p.statusEnteredAt = now();
      }
      bump(p);
      event(p, actor, randomUUID(), "Demo-Qualifizierung erstellt");
      return p;
    });
  },
};
export function canSubmit(p: Project) {
  return (
    !!p.score &&
    !p.blockers.length &&
    ["READY", "ESTIMATED", "PARTIAL"].includes(p.score.state) &&
    p.answers.locationConfirmed &&
    p.answers.area !== null &&
    p.answers.authority === "Liegt vor" &&
    (p.score.displayScore ?? p.score.bounds?.lower ?? 0) >= 65
  );
}
const submitSchema = z
  .object({
    requestId: z.string().min(8).max(160),
    revision: z.number().int().positive(),
    contact: contactSchema,
    consent: z.literal(true),
    comment: z.string().max(2000),
    documentIds: z.array(z.string()).max(15),
  })
  .strict();
export const submissions: SubmissionProvider = {
  async submit(id, actor, input) {
    const v = submitSchema.parse(input);
    return transaction((s) => {
      const p = find(s, id, actor);
      if (actor.role !== "OWNER")
        throw new DomainError("Projektkontakt erforderlich.", 403);
      return idempotent(s, actor, id, v.requestId, v, () => {
        if (p.receipt) return p.receipt;
        checkRevision(p, v.revision);
        if (!partnerConfig.id)
          throw new DomainError(
            "Für dieses Projekt ist noch kein Empfänger hinterlegt.",
            503,
          );
        if (!canSubmit(p))
          throw new DomainError(
            "Bitte zunächst die entscheidungsrelevanten Angaben oder Blocker klären.",
            422,
          );
        const documents = p.documents.filter(
          (d) => v.documentIds.includes(d.id) && d.state === "ready",
        );
        if (documents.length !== new Set(v.documentIds).size)
          throw new DomainError("Eine ausgewählte Datei ist nicht verfügbar.");
        const receipt: Receipt = {
          requestId: v.requestId,
          recipient: partnerConfig.name,
          submittedAt: now(),
          documentIds: documents.map((d) => d.id),
          inputVersion: String(p.inputVersion),
          scope: [
            "Standort",
            "Objekt und Berechtigung",
            "Energieprofil",
            "Projektziel",
            "Score und offene Angaben",
            "Ausgewählte Unterlagen",
          ],
          comment: v.comment,
          contact: v.contact,
          snapshot: {
            answers: structuredClone(p.answers),
            score: structuredClone(p.score),
            documents: structuredClone(documents),
          },
          simulated: true,
        };
        p.receipt = receipt;
        p.contact = v.contact;
        p.partnerId = partnerConfig.id;
        p.nextAction = {
          label: "Erstprüfung beginnen",
          dueAt: null,
          open: true,
        };
        bump(p);
        event(
          p,
          actor,
          v.requestId,
          "Übermittlung simuliert",
          p.status,
          v.comment,
          null,
          "CONTACT",
        );
        return receipt;
      });
    });
  },
};
export const partnerProjects: PartnerProjectRepository = {
  get: drafts.get,
  async list(actor) {
    if (actor.role !== "PARTNER")
      throw new DomainError("Partnerzugriff erforderlich.", 403);
    return transaction((s) =>
      Object.values(s.projects).filter(
        (p) =>
          p.tenantId === actor.tenantId &&
          p.partnerId === actor.partnerId &&
          p.receipt,
      ),
    );
  },
};
export const actionSchema = z
  .object({
    requestId: z.string().min(8).max(160),
    revision: z.number().int().positive(),
    action: z.enum([
      "accept",
      "request-info",
      "reject",
      "begin-review",
      "reopen",
      "resume",
      "milestone",
      "note",
      "respond",
    ]),
    note: z.string().max(2000).default(""),
    rejection: rejectionSchema.optional(),
    items: z.array(z.string().min(1).max(100)).max(20).default([]),
    recipient: z.email().optional(),
    dueAt: z.iso.datetime().nullable().optional(),
    targetStatus: z.enum(statuses).optional(),
    infoRequestId: z.string().optional(),
    milestoneConfirmed: z.boolean().default(false),
  })
  .strict();
export const partnerActions: PartnerActionProvider = {
  async execute(id, actor, input) {
    const v = actionSchema.parse(input);
    return transaction((s) => {
      const p = find(s, id, actor, v.action !== "respond");
      return idempotent(s, actor, id, v.requestId, v, () => {
        checkRevision(p, v.revision);
        const from = p.status;
        let to = p.status;
        if (v.action === "accept") to = "ACCEPTED";
        if (v.action === "request-info") to = "INFO_REQUESTED";
        if (v.action === "reject") to = "REJECTED";
        if (["begin-review", "reopen", "resume"].includes(v.action))
          to = "PARTNER_REVIEW";
        if (v.action === "milestone") {
          if (!v.targetStatus) throw new DomainError("Meilenstein fehlt.");
          to = v.targetStatus;
        }
        if (
          ["reopen", "resume", "note"].includes(v.action) &&
          v.note.trim().length < 3
        )
          throw new DomainError("Bitte die Aktion erläutern.", 422, "note");
        if (v.action === "request-info") {
          if (!v.items.length || v.note.trim().length < 3)
            throw new DomainError(
              "Bitte konkrete Angaben und eine Nachricht ergänzen.",
              422,
              "items",
            );
          if (!p.contact || v.recipient !== p.contact.email)
            throw new DomainError(
              "Der Empfänger muss dem freigegebenen Projektkontakt entsprechen.",
            );
          if (v.dueAt && Date.parse(v.dueAt) < Date.now())
            throw new DomainError("Die Fälligkeit muss in der Zukunft liegen.");
        }
        if (
          v.action === "reject" &&
          v.rejection?.certainty === "CONFIRMED" &&
          [v.rejection.primary, ...v.rejection.secondary].includes(
            "STRUCTURAL_CONSTRAINT",
          ) &&
          !p.evidence.some(
            (e) =>
              e.id === "structural" &&
              e.origin === "PARTNER" &&
              e.nature === "OBSERVED" &&
              e.value === "CONSTRAINT",
          )
        )
          throw new DomainError(
            "Unbekannte Statik ist kein bestätigter Mangel. Einschätzungsstand korrigieren.",
          );
        if (v.action === "respond") {
          if (actor.role !== "OWNER")
            throw new DomainError(
              "Nur der Projektkontakt kann antworten.",
              403,
            );
          const r = p.infoRequests.find((r) => r.id === v.infoRequestId);
          if (!r || !v.items.length || !v.note.trim())
            throw new DomainError(
              "Antwort und tatsächlich beantwortete Punkte fehlen.",
            );
          if (v.items.some((i) => !r.items.includes(i)))
            throw new DomainError("Antwort enthält nicht angeforderte Punkte.");
          r.answered = [...new Set([...r.answered, ...v.items])];
          p.nextAction = { label: "Antwort prüfen", dueAt: null, open: true };
        } else if (v.action !== "note") {
          guardTransition(p, to, {
            explicit: true,
            note: v.note,
            rejection: v.rejection,
            deliveryConfirmed: v.action === "request-info",
            milestoneConfirmed: v.milestoneConfirmed,
          });
          p.status = to;
          p.statusEnteredAt = now();
          if (v.action === "request-info") {
            p.infoRequests.push({
              id: randomUUID(),
              items: [...new Set(v.items)],
              answered: [],
              message: v.note,
              recipient: v.recipient!,
              dueAt: v.dueAt ?? null,
              createdAt: now(),
              delivery: "SIMULATED_CONFIRMED",
            });
            p.nextAction = {
              label: "Ausstehende Angaben nachfassen",
              dueAt: v.dueAt ?? null,
              open: true,
            };
          } else
            p.nextAction = ["REJECTED", "REALIZED"].includes(to)
              ? null
              : {
                  label:
                    to === "ACCEPTED"
                      ? "Weitere Bearbeitung abstimmen"
                      : "Fachliche Prüfung fortsetzen",
                  dueAt: null,
                  open: true,
                };
        }
        bump(p);
        event(
          p,
          actor,
          v.requestId,
          {
            accept: "Übernahme simuliert",
            "request-info": "Rückfrage simuliert",
            reject: "Ablehnung simuliert",
            "begin-review": "Prüfung bewusst begonnen",
            reopen: "Projekt wiederaufgenommen",
            resume: "Prüfung bewusst wiederaufgenommen",
            milestone: "Demo-Meilenstein dokumentiert",
            note: "Interne Notiz",
            respond: "Antwort des Projektkontakts erfasst",
          }[v.action],
          from,
          v.note,
          v.rejection ?? null,
          v.action === "respond" || v.action === "request-info"
            ? "CONTACT"
            : "INTERNAL",
        );
        return p;
      });
    });
  },
};
function matchingUpload(
  project: Project,
  documentId: string,
  file: { name: string; size: number },
  category: Document["category"],
  digest: string,
) {
  const document = project.documents.find((d) => d.id === documentId);
  if (!document) return false;
  if (
    document.hash !== digest ||
    document.size !== file.size ||
    document.name !== file.name.slice(0, 240) ||
    document.category !== category ||
    document.state !== "ready"
  )
    throw new DomainError(
      "Diese Upload-ID gehört zu einer anderen oder entfernten Datei.",
      409,
    );
  return true;
}

export const uploads: UploadProvider = {
  async upload(id, actor, file, category, revision, requestId) {
    if (actor.role !== "OWNER")
      throw new DomainError("Upload nur im eigenen Entwurf.", 403);
    const initial = await drafts.get(id, actor);
    z.enum(categories).parse(category);
    uploadLimits([file]);
    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length !== file.size)
      throw new DomainError("Ungültige Dateigröße.");
    const digest = hash(bytes);
    const documentId = requestId ? z.uuid().parse(requestId) : randomUUID();
    // Finalization can be retried after a lost response with the same upload ID.
    if (
      requestId &&
      matchingUpload(initial, documentId, file, category, digest)
    )
      return initial;
    if (initial.receipt)
      throw new DomainError(
        "Upload nur im eigenen, noch nicht eingereichten Entwurf.",
        403,
      );
    checkRevision(initial, revision);
    if (
      initial.documents.some((d) => d.hash === digest && d.state !== "removed")
    )
      throw new DomainError("Diese Datei wurde bereits hinzugefügt.", 409);
    uploadLimits([
      ...initial.documents.filter((d) => d.state !== "removed"),
      file,
    ]);
    const ext = file.name.split(".").pop()?.toLowerCase();
    let mime = "";
    if (ext === "csv") {
      let text: string;
      try {
        text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      } catch {
        throw new DomainError("Die Datei ist keine lesbare UTF-8-CSV-Datei.");
      }
      if (/[\u0000-\u0008\u000E-\u001F]/.test(text) || !/[;,\t]/.test(text))
        throw new DomainError("Die Datei ist keine lesbare CSV-Datei.");
      mime = "text/csv";
    } else {
      const { fileTypeFromBuffer } = await import("file-type");
      const type = await fileTypeFromBuffer(bytes);
      const permitted: Record<string, string[]> = {
        pdf: ["pdf"],
        jpg: ["jpg"],
        jpeg: ["jpg"],
        png: ["png"],
        xlsx: ["xlsx"],
      };
      if (!type || !permitted[ext ?? ""]?.includes(type.ext))
        throw new DomainError(
          "Dateiinhalt passt nicht zum unterstützten Dateityp.",
        );
      mime = type.mime;
    }
    const document: Document = {
      id: documentId,
      name: file.name.slice(0, 240),
      size: bytes.length,
      mime,
      hash: digest,
      category,
      version: 1,
      state: "ready",
      reviewState: "NOT_REVIEWED",
      createdAt: now(),
    };
    const key = `documents/${document.id}`;
    // Bytes must be durably available before metadata can say "ready". This
    // immutable write is deliberately outside the retried CAS callback.
    const created = await putPrivateBytes(key, bytes);
    if (!created) {
      const existing = await readPrivateBytes(key);
      if (
        !existing ||
        existing.length !== bytes.length ||
        hash(existing) !== digest
      )
        throw new DomainError("Die Upload-ID ist bereits anders belegt.", 409);
    }
    try {
      return await transaction((s) => {
        const p = find(s, id, actor);
        if (requestId && matchingUpload(p, documentId, file, category, digest))
          return p;
        if (requestId) {
          const transfer = s.uploadTransfers?.[requestId];
          if (
            !transfer ||
            transfer.state !== "finalizing" ||
            transfer.expiresAt <= Date.now() ||
            transfer.projectId !== id ||
            transfer.actorId !== actor.actorId ||
            transfer.tenantId !== actor.tenantId
          )
            throw new DomainError(
              "Der Upload ist abgelaufen oder nicht zur Fertigstellung freigegeben.",
              409,
            );
        }
        if (p.receipt)
          throw new DomainError(
            "Die eingereichte Dokumentfassung ist unveränderlich.",
            403,
          );
        checkRevision(p, revision);
        if (p.documents.some((d) => d.hash === digest && d.state !== "removed"))
          throw new DomainError("Diese Datei wurde bereits hinzugefügt.", 409);
        uploadLimits([
          ...p.documents.filter((d) => d.state !== "removed"),
          file,
        ]);
        p.documents.push(structuredClone(document));
        p.inputVersion++;
        if (p.score) p.score.state = "STALE";
        bump(p);
        return p;
      });
    } catch (error) {
      if (error instanceof StorageCommitUncertainError) {
        // Reconcile a response lost after the metadata commit. If the read also
        // fails, retain the private bytes; deleting could break a committed file.
        try {
          const current = await drafts.get(id, actor);
          if (matchingUpload(current, documentId, file, category, digest))
            return current;
        } catch {
          /* Preserve the original indeterminate-commit error. */
        }
      } else if (created && !requestId) {
        // A random document ID is exclusive to this invocation. Stable transfer
        // IDs may be finalized concurrently and are cleaned by the transfer owner.
        await deletePrivateBytes(key).catch(() => undefined);
      }
      throw error;
    }
  },
};
export async function updateDocument(
  id: string,
  documentId: string,
  actor: Session,
  revision: number,
  category: Document["category"] | null,
) {
  return transaction((s) => {
    const p = find(s, id, actor);
    checkRevision(p, revision);
    if (actor.role !== "OWNER" || p.receipt)
      throw new DomainError(
        "Die eingereichte Dokumentfassung ist unveränderlich.",
        403,
      );
    const d = p.documents.find((d) => d.id === documentId);
    if (!d) throw new DomainError("Dokument nicht gefunden.", 404);
    if (category) {
      z.enum(categories).parse(category);
      d.category = category;
      d.version++;
    } else d.state = "removed";
    p.inputVersion++;
    if (p.score) p.score.state = "STALE";
    bump(p);
    return p;
  });
}
async function authorizedDocument(id: string, docId: string, actor: Session) {
  const p = await drafts.get(id, actor);
  const document = p.documents.find(
    (d) => d.id === docId && d.state === "ready",
  );
  if (
    !document ||
    (actor.role === "PARTNER" && !p.receipt?.documentIds.includes(docId))
  )
    throw new DomainError("Kein Zugriff auf dieses Dokument.", 403);
  return document;
}

export async function downloadDocument(
  id: string,
  docId: string,
  actor: Session,
) {
  const document = await authorizedDocument(id, docId, actor);
  const bytes = await readPrivateBytes(`documents/${document.id}`);
  if (!bytes) throw new DomainError("Dokument nicht verfügbar.", 404);
  return { document, bytes };
}

export async function downloadDocumentStream(
  id: string,
  docId: string,
  actor: Session,
) {
  const document = await authorizedDocument(id, docId, actor);
  const stream = await streamPrivateBytes(`documents/${document.id}`);
  if (!stream) throw new DomainError("Dokument nicht verfügbar.", 404);
  return { document, stream };
}
export function safeProject(p: Project, actor: Session) {
  const safe = structuredClone(p);
  if (actor.role === "OWNER")
    safe.events = safe.events.filter(
      (e) =>
        e.visibility === "CONTACT" ||
        e.action === "Demo-Qualifizierung erstellt",
    );
  else
    safe.documents = safe.documents.filter((d) =>
      safe.receipt?.documentIds.includes(d.id),
    );
  return safe;
}
