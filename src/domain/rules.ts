import { z } from "zod";
import contract from "@/data/analytics-contract.json";
import {
  type Answers,
  type Factor,
  type Project,
  type ScoreClass,
  type Session,
  type Status,
  rejectionSchema,
  type Rejection,
} from "./model";
export class DomainError extends Error {
  constructor(
    message: string,
    public status = 400,
    public field?: string,
  ) {
    super(message);
  }
}
export function scoreClass(value: number): ScoreClass {
  if (!Number.isInteger(value) || value < 0 || value > 100)
    throw new DomainError("Ungültiger Score.");
  return value >= 80
    ? "HIGH_PRIORITY"
    : value >= 65
      ? "GOOD_POTENTIAL"
      : value >= 50
        ? "MORE_INFORMATION"
        : "LOW_PRIORITY";
}
export function assessFactors(factors: Factor[]) {
  if (
    factors.length !== 9 ||
    new Set(factors.map((f) => f.factorId)).size !== 9
  )
    throw new DomainError("Neun eindeutige Faktoren erforderlich.");
  const active = factors.filter((f) => f.applicable && f.maxPoints > 0);
  if (
    factors.some((f) => !Number.isFinite(f.maxPoints) || f.maxPoints < 0) ||
    Math.abs(active.reduce((s, f) => s + f.maxPoints, 0) - 100) > 0.00001
  )
    throw new DomainError("Modellgewichte müssen 100 ergeben.");
  let lower = 0,
    upper = 0,
    known = 0,
    weightCovered = 0;
  for (const f of active) {
    if (f.contribution === null) {
      upper += f.maxPoints;
      continue;
    }
    if (
      !Number.isFinite(f.contribution) ||
      f.contribution < 0 ||
      f.contribution > f.maxPoints
    )
      throw new DomainError("Ungültiger Faktorbeitrag.");
    const b = f.contributionBounds ?? {
      lower: f.contribution,
      upper: f.contribution,
    };
    if (
      !Number.isFinite(b.lower) ||
      !Number.isFinite(b.upper) ||
      b.lower < 0 ||
      b.upper > f.maxPoints ||
      b.lower > b.upper
    )
      throw new DomainError("Ungültige Beitragsspanne.");
    lower += b.lower;
    upper += b.upper;
    known++;
    weightCovered += f.maxPoints;
  }
  const partial = known < active.length;
  const total = partial
    ? null
    : Math.round(active.reduce((s, f) => s + (f.contribution ?? 0), 0));
  return {
    displayScore: total,
    class: total === null ? null : scoreClass(total),
    bounds: partial
      ? { lower, upper, meaning: "POSSIBLE_POINTS" as const }
      : null,
    partial,
    known,
    applicable: active.length,
    weightCovered,
  };
}
export function authorize(
  project: Project,
  session: Session,
  partnerOnly = false,
) {
  if (project.tenantId !== session.tenantId)
    throw new DomainError("Kein Zugriff auf dieses Projekt.", 403);
  if (session.role === "PARTNER") {
    if (!project.receipt || project.partnerId !== session.partnerId)
      throw new DomainError(
        "Projekt wurde für diesen Partner nicht freigegeben.",
        403,
      );
  } else if (partnerOnly || project.ownerId !== session.actorId)
    throw new DomainError("Kein Zugriff auf dieses Projekt.", 403);
}
export function checkRevision(project: Project, expected: number) {
  if (project.revision !== expected)
    throw new DomainError(
      "Der Projektstand wurde inzwischen geändert. Neu laden und prüfen.",
      409,
    );
}
export function transitionAllowed(from: Status, to: Status) {
  return (contract.statusTransitions[from] as string[]).includes(to);
}
export function guardTransition(
  project: Project,
  to: Status,
  context: {
    explicit?: boolean;
    note?: string;
    rejection?: Rejection;
    qualified?: boolean;
    deliveryConfirmed?: boolean;
    milestoneConfirmed?: boolean;
  },
) {
  if (!transitionAllowed(project.status, to))
    throw new DomainError("Dieser Statusübergang ist nicht zulässig.", 409);
  if (to === "REJECTED") {
    if (!context.explicit || !context.rejection)
      throw new DomainError(
        "Eine bewusste begründete Entscheidung ist erforderlich.",
      );
    rejectionSchema.parse(context.rejection);
  }
  if (to === "ACCEPTED" && project.blockers.length)
    throw new DomainError("Bestätigten Blocker zuerst fachlich klären.", 409);
  if (to === "QUALIFIED" && !context.qualified)
    throw new DomainError("Vorqualifizierungsbedingungen fehlen.");
  if (to === "INFO_REQUESTED" && !context.deliveryConfirmed)
    throw new DomainError(
      "Die Übermittlung der Rückfrage ist nicht bestätigt.",
    );
  if (
    project.status === "REJECTED" &&
    (!context.explicit || !context.note?.trim())
  )
    throw new DomainError("Wiederaufnahme begründen.");
  if (
    project.status === "INFO_REQUESTED" &&
    to === "PARTNER_REVIEW" &&
    !context.explicit &&
    !project.infoRequests.some((r) => r.answered.length)
  )
    throw new DomainError("Antwort oder bewusste Wiederaufnahme erforderlich.");
  if (
    ["DEVELOPMENT", "CONTRACTED", "REALIZED"].includes(to) &&
    !context.milestoneConfirmed
  )
    throw new DomainError("Tatsächlichen Meilenstein bestätigen.");
}
export function normalizeAnswers(a: Answers): Answers {
  const n = structuredClone(a);
  if (n.areaNature === "UNKNOWN") n.area = null;
  if (n.consumptionNature === "UNKNOWN") {
    n.consumption = null;
    n.zeroConfirmed = false;
  }
  if (n.areaKind === "Freifläche") {
    n.roofForm = "Unbekannt";
    n.roofCondition = "Unbekannt";
    n.roofMaterial = "";
    n.occupiedArea = null;
    n.usableArea = null;
  }
  if (n.pv !== "Ja") {
    n.pvPower = null;
    n.pvYear = null;
    n.pvUsage = "Unbekannt";
  }
  if (n.battery !== "Ja") {
    n.batteryCapacity = null;
    n.batteryPower = null;
    n.batteryYear = null;
  }
  if (n.noDocuments) n.availableDocuments = [];
  return n;
}
export function validateStep(a: Answers, step: number) {
  const fail = (m: string, f: string) => {
    throw new DomainError(m, 422, f);
  };
  if (step === 1 && (a.address.trim().length < 3 || !a.locationConfirmed))
    fail(
      "Bitte geben Sie einen Standort an und bestätigen Sie ihn.",
      "address",
    );
  if (
    step === 2 &&
    (!a.buildingType ||
      (a.buildingType === "Sonstiges" && a.otherBuilding.trim().length < 3))
  )
    fail(
      "Bitte wählen Sie einen Gebäudetyp und ergänzen Sie bei Sonstiges eine Beschreibung.",
      "buildingType",
    );
  if (
    step === 3 &&
    a.areaNature !== "UNKNOWN" &&
    (a.area === null || a.area <= 0)
  )
    fail(
      "Bitte geben Sie eine Fläche größer als 0 an oder wählen Sie Noch unbekannt.",
      "area",
    );
  if (step === 3 && a.area && a.usableArea && a.usableArea > a.area)
    fail(
      "Die Nutzfläche darf die angegebene Gesamtfläche nicht überschreiten.",
      "usableArea",
    );
  if (step === 4 && !a.role) fail("Bitte geben Sie Ihre Rolle an.", "role");
  if (step === 5 && a.consumptionNature !== "UNKNOWN" && a.consumption === null)
    fail(
      "Bitte geben Sie Ihren Verbrauch an oder wählen Sie Noch unbekannt.",
      "consumption",
    );
  if (step === 5 && a.consumption === 0 && !a.zeroConfirmed)
    fail(
      "Bitte bestätigen Sie, dass der Standort derzeit keinen Verbrauch hat.",
      "zeroConfirmed",
    );
  if (step === 8 && !a.goal) fail("Bitte wählen Sie ein Hauptziel.", "goal");
  if (step === 9 && !a.availableDocuments.length && !a.noDocuments)
    fail(
      "Bitte wählen Sie Unterlagen oder Noch keine Unterlagen verfügbar.",
      "availableDocuments",
    );
}
export function parseGermanNumber(raw: string): number | null {
  const s = raw.trim();
  if (!s) return null;
  if (!/^(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d+)?$/.test(s))
    throw new DomainError(
      "Bitte eine positive Zahl im deutschen Format eingeben.",
    );
  const n = Number(s.replaceAll(".", "").replace(",", "."));
  if (!Number.isFinite(n)) throw new DomainError("Ungültige Zahl.");
  return n;
}
export const numberDE = (n: number | null, maximumFractionDigits = 1) =>
  n === null
    ? "Noch unbekannt"
    : new Intl.NumberFormat("de-DE", { maximumFractionDigits }).format(n);
export const dateDE = (s: string) =>
  new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  }).format(new Date(s));
export function uploadLimits(files: { size: number; name: string }[]) {
  if (files.length > 15)
    throw new DomainError("Maximal 15 Dateien pro Projekt.");
  if (files.some((f) => f.size > 20_000_000))
    throw new DomainError("Maximal 20 MB pro Datei.");
  if (files.some((f) => f.size <= 0 || !Number.isFinite(f.size)))
    throw new DomainError("Leere oder ungültige Datei.");
  if (files.reduce((s, f) => s + f.size, 0) > 100_000_000)
    throw new DomainError("Maximal 100 MB pro Projekt.");
  if (files.some((f) => !/^.+\.(pdf|jpe?g|png|csv|xlsx)$/i.test(f.name)))
    throw new DomainError("Dateityp nicht unterstützt.");
}
export function validateRejection(input: unknown) {
  return rejectionSchema.parse(input);
}
export function readableError(e: unknown) {
  return e instanceof z.ZodError
    ? e.issues.map((i) => i.message).join(" ")
    : e instanceof Error
      ? e.message
      : "Der Vorgang konnte nicht abgeschlossen werden.";
}
export function coverage(a: Answers) {
  const required = [
    "address",
    "buildingType",
    "area",
    "role",
    "authority",
    "consumption",
    "usageProfile",
    "pv",
    "battery",
    "goal",
    ...(a.areaKind === "Dach" ? ["roofCondition"] : ["currentUse"]),
  ];
  const available = required.filter((k) => {
    const v = a[k as keyof Answers];
    return v !== null && v !== "" && v !== "Unbekannt" && v !== "In Klärung";
  });
  const docs =
    a.areaKind === "Dach"
      ? ["Dach-/Lageplan", "Stromabrechnung", "Lastgang"]
      : ["Dach-/Lageplan", "Netzanschlussunterlagen"];
  return { required, available, requiredDocuments: docs };
}
export function pipeline(projects: Project[], asOf: string) {
  return Object.keys(contract.statusTransitions).map((s) => {
    const status = s as Status;
    const rows = projects.filter((p) => p.status === status);
    const ages = rows
      .map((p) => (Date.parse(asOf) - Date.parse(p.statusEnteredAt)) / 86400000)
      .sort((a, b) => a - b);
    const n = ages.length;
    return {
      status,
      count: n,
      open: rows.filter((p) => p.nextAction?.open).length,
      overdue: rows.filter(
        (p) =>
          p.nextAction?.open && p.nextAction.dueAt && p.nextAction.dueAt < asOf,
      ).length,
      age:
        ["REALIZED", "REJECTED"].includes(s) || !n
          ? null
          : n % 2
            ? ages[(n - 1) / 2]
            : (ages[n / 2 - 1] + ages[n / 2]) / 2,
    };
  });
}
