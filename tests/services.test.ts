import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  auth,
  createDraft,
  drafts,
  qualification,
  submissions,
  partnerActions,
  partnerProjects,
  uploads,
  downloadDocument,
  canSubmit,
} from "@/server/services";
import { demoAddresses, demoContact, seedProjects } from "@/server/seed";
import { transaction } from "@/server/store";
import type { Session, Project } from "@/domain/model";
let dir: string, owner: Session, partner: Session;
beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), "gateway-unit-"));
  process.env.GATEWAY_DATA_DIR = dir;
  process.env.APP_MODE = "demo";
  owner = (await auth.create("OWNER")).session;
  partner = (await auth.create("PARTNER")).session;
});
afterAll(() => {
  delete process.env.GATEWAY_DATA_DIR;
  delete process.env.APP_MODE;
  rmSync(dir, { recursive: true, force: true });
});
async function ready() {
  let p = await createDraft(owner, demoAddresses[0]);
  const answers = seedProjects()[0].answers;
  p = await drafts.save(p.id, owner, p.revision, answers, 10);
  return qualification.qualify(p.id, owner, p.revision);
}
async function submit(p: Project, key = randomUUID()) {
  const input = {
    requestId: key,
    revision: p.revision,
    contact: demoContact,
    consent: true as const,
    comment: "Test",
    documentIds: [],
  };
  return { input, receipt: await submissions.submit(p.id, owner, input) };
}
describe("Persistent service boundaries", () => {
  it("carries selected project intent into a new draft without inventing site facts", async () => {
    const ground = await createDraft(
      owner,
      "Freifläche am Gewerbepark",
      "ground",
    );
    const extension = await createDraft(
      owner,
      "Halle mit Erweiterungswunsch",
      "extension",
    );
    const storage = await createDraft(
      owner,
      "Standort für Speicherprüfung",
      "storage",
    );
    const roof = await createDraft(owner, "Gewerbedach im Gewerbepark", "roof");
    expect((await drafts.get(ground.id, owner)).answers).toMatchObject({
      buildingType: "Freifläche",
      areaKind: "Freifläche",
      goal: "Dach oder Fläche bereitstellen",
      locationConfirmed: false,
      area: null,
    });
    expect(extension.answers.goal).toBe("Bestehende PV erweitern");
    expect(storage.answers.goal).toBe("Speicher ergänzen");
    expect(roof.answers.goal).toBe("Möglichkeiten zunächst prüfen");
    for (const p of [ground, extension, storage, roof]) {
      expect(p.answers.pv).toBe("Unbekannt");
      expect(p.answers.battery).toBe("Unbekannt");
      expect(p.answers.area).toBeNull();
      expect(p.score).toBeNull();
      expect(p.maxVisited).toBe(1);
    }
    const ordinary = await createDraft(owner, "Standort ohne Vorauswahl");
    expect(ordinary.answers.goal).toBeNull();
    await expect(
      createDraft(partner, "Unzulässiger Entwurf", "roof"),
    ).rejects.toThrow();
    await expect(
      createDraft(owner, "Ungültige Vorauswahl", "unsupported" as never),
    ).rejects.toThrow();
  });
  it("persists drafts and sessions while keeping owners isolated", async () => {
    const { token, session } = await auth.create("OWNER");
    expect(await auth.resolve(token)).toEqual(session);
    const p = await createDraft(session, "Manuell erfasste Gewerbefläche");
    expect((await drafts.get(p.id, session)).answers.address).toBe(
      "Manuell erfasste Gewerbefläche",
    );
    await expect(drafts.get(p.id, owner)).rejects.toThrow();
    await expect(drafts.get(p.id, partner)).rejects.toThrow();
  });
  it("submits idempotently, creates one receipt/event and detects key payload mismatch", async () => {
    const p = await ready();
    expect(canSubmit(p)).toBe(true);
    const { input, receipt } = await submit(p);
    expect(await submissions.submit(p.id, owner, input)).toEqual(receipt);
    expect(
      (await drafts.get(p.id, owner)).events.filter(
        (e) => e.action === "Übermittlung simuliert",
      ),
    ).toHaveLength(1);
    await expect(
      submissions.submit(p.id, owner, { ...input, comment: "changed" }),
    ).rejects.toThrow();
    expect((await drafts.get(p.id, partner)).receipt?.simulated).toBe(true);
  });
  it("rejects stale revisions and unconsented submissions", async () => {
    const p = await ready();
    await expect(
      submissions.submit(p.id, owner, {
        requestId: randomUUID(),
        revision: p.revision - 1,
        contact: demoContact,
        consent: true,
        comment: "",
        documentIds: [],
      }),
    ).rejects.toThrow();
    await expect(
      submissions.submit(p.id, owner, {
        requestId: randomUUID(),
        revision: p.revision,
        contact: demoContact,
        consent: false as true,
        comment: "",
        documentIds: [],
      }),
    ).rejects.toThrow();
  });
  it("keeps partner reading side-effect free, decisions idempotent and immutable", async () => {
    let p = await ready();
    await submit(p);
    p = await drafts.get(p.id, partner);
    const revision = p.revision;
    await partnerProjects.list(partner);
    expect((await drafts.get(p.id, partner)).revision).toBe(revision);
    const input = {
      requestId: randomUUID(),
      revision,
      action: "accept",
      note: "",
    };
    const accepted = await partnerActions.execute(p.id, partner, input);
    expect(accepted.status).toBe("ACCEPTED");
    expect(await partnerActions.execute(p.id, partner, input)).toEqual(
      accepted,
    );
    expect(accepted.score).toEqual(p.score);
    expect(accepted.events[0].scoreSnapshot).toEqual(p.score);
    await expect(
      partnerActions.execute(p.id, partner, {
        ...input,
        requestId: randomUUID(),
      }),
    ).rejects.toThrow();
  });
  it("requests information, records a partial reply and keeps unanswered requirements", async () => {
    let p = await ready();
    await submit(p);
    p = await drafts.get(p.id, partner);
    p = await partnerActions.execute(p.id, partner, {
      requestId: randomUUID(),
      revision: p.revision,
      action: "request-info",
      items: ["Dach-/Lageplan", "Lastgang"],
      note: "Bitte Dachplan und Lastgang ergänzen.",
      recipient: demoContact.email,
    });
    expect(p.status).toBe("INFO_REQUESTED");
    p = await partnerActions.execute(p.id, owner, {
      requestId: randomUUID(),
      revision: p.revision,
      action: "respond",
      items: ["Dach-/Lageplan"],
      infoRequestId: p.infoRequests[0].id,
      note: "Dachplanangaben erläutert.",
    });
    expect(p.infoRequests[0].answered).toEqual(["Dach-/Lageplan"]);
    expect(p.status).toBe("INFO_REQUESTED");
    expect(p.nextAction?.label).toBe("Antwort prüfen");
  });
  it("rejects OTHER without text and keeps the original decision on reopening", async () => {
    let p = await ready();
    await submit(p);
    p = await drafts.get(p.id, partner);
    const input = {
      requestId: randomUUID(),
      revision: p.revision,
      action: "reject",
      rejection: {
        primary: "OTHER",
        secondary: [],
        certainty: "PARTNER_SCOPE_DECISION",
        note: "",
        evidenceRefs: [],
      },
    };
    await expect(
      partnerActions.execute(p.id, partner, input),
    ).rejects.toThrow();
    p = await partnerActions.execute(p.id, partner, {
      ...input,
      rejection: {
        ...input.rejection,
        note: "Demo-Fit wurde fachlich anders eingeordnet.",
      },
    });
    const rejectEvent = p.events[0];
    p = await partnerActions.execute(p.id, partner, {
      requestId: randomUUID(),
      revision: p.revision,
      action: "reopen",
      note: "Neue Grundlage liegt vor.",
    });
    expect(p.status).toBe("PARTNER_REVIEW");
    expect(p.events.find((e) => e.eventId === rejectEvent.eventId)).toEqual(
      rejectEvent,
    );
  });
  it("retains active business status while re-scoring and guards the input version", async () => {
    let p = await ready();
    await submit(p);
    p = await drafts.get(p.id, partner);
    p = await partnerActions.execute(p.id, partner, {
      requestId: randomUUID(),
      revision: p.revision,
      action: "begin-review",
    });
    await transaction((s) => {
      s.projects[p.id].score!.state = "STALE";
      return true;
    });
    p = await qualification.qualify(p.id, partner, p.revision);
    expect(p.status).toBe("PARTNER_REVIEW");
    expect(p.scoreJobState).toBe("SUCCEEDED");
  });
  it("stores actual private bytes, rejects duplicate content and spoofed extensions", async () => {
    let p = await createDraft(owner, demoAddresses[0]);
    const file = new File(["time;load\n00:00;4\n"], "lastgang.csv", {
      type: "text/csv",
    });
    p = await uploads.upload(p.id, owner, file, "Lastgang", p.revision);
    expect(p.documents[0].state).toBe("ready");
    expect(p.documents[0].reviewState).toBe("NOT_REVIEWED");
    expect(
      (await downloadDocument(p.id, p.documents[0].id, owner)).bytes.toString(),
    ).toContain("00:00;4");
    await expect(
      uploads.upload(
        p.id,
        owner,
        new File(["time;load\n00:00;4\n"], "anders.csv"),
        "Lastgang",
        p.revision,
      ),
    ).rejects.toThrow("bereits");
    await expect(
      uploads.upload(
        p.id,
        owner,
        new File(["not a PDF"], "fake.pdf"),
        "Sonstiges",
        p.revision,
      ),
    ).rejects.toThrow("Dateiinhalt");
    await expect(
      downloadDocument(p.id, p.documents[0].id, partner),
    ).rejects.toThrow();
  });
  it("fails closed in live mode", async () => {
    process.env.APP_MODE = "live";
    try {
      await expect(auth.create("PARTNER")).rejects.toThrow(
        "Live-Integrationen",
      );
    } finally {
      process.env.APP_MODE = "demo";
    }
  });
});
