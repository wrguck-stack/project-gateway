import { z } from "zod";

export const statuses = [
  "NEW",
  "INCOMPLETE",
  "SCORING",
  "QUALIFIED",
  "PARTNER_REVIEW",
  "INFO_REQUESTED",
  "ACCEPTED",
  "DEVELOPMENT",
  "CONTRACTED",
  "REALIZED",
  "REJECTED",
] as const;
export type Status = (typeof statuses)[number];
export const statusLabels: Record<Status, string> = {
  NEW: "Neu",
  INCOMPLETE: "Angaben fehlen",
  SCORING: "Bewertung läuft",
  QUALIFIED: "Vorqualifiziert",
  PARTNER_REVIEW: "In Prüfung",
  INFO_REQUESTED: "Rückfrage offen",
  ACCEPTED: "Übernommen",
  DEVELOPMENT: "In Entwicklung",
  CONTRACTED: "Vertrag geschlossen",
  REALIZED: "Realisiert",
  REJECTED: "Abgelehnt",
};
export const factorIds = [
  "USABLE_AREA",
  "SOLAR_YIELD",
  "CONSUMPTION_SELF_USE",
  "DECISION_AUTHORITY",
  "ROOF_CONDITION",
  "PROJECT_SCALE",
  "READINESS",
  "DOCUMENTATION",
  "ENERGY_INFRASTRUCTURE",
] as const;
export const factorLabels = [
  "Nutzbare Fläche",
  "Solar-/Ertragspotenzial",
  "Verbrauch / Eigenverbrauch",
  "Entscheidungssituation",
  "Dachzustand",
  "Projektgröße",
  "Projektbereitschaft",
  "Unterlagen",
  "Energieinfrastruktur",
];
export const scoreStates = [
  "READY",
  "ESTIMATED",
  "PARTIAL",
  "NOT_READY",
  "SCORING",
  "STALE",
  "ERROR",
] as const;
export type ScoreState = (typeof scoreStates)[number];
export type Nature = "OBSERVED" | "ESTIMATED" | "UNKNOWN" | "NOT_APPLICABLE";
export type Origin = "USER" | "EXTERNAL" | "PARTNER" | "DERIVED";
export type Evidence = {
  id: string;
  value: number | string | boolean | null;
  unit: string | null;
  origin: Origin | null;
  nature: Nature;
  asOf: string | null;
  sourceRef: string | null;
  loadState: "READY" | "ERROR" | "STALE";
  interval?: { lower: number; upper: number; kind: string; methodRef: string };
  note?: string;
  period?: { start: string; end: string; timezone: string };
};
export type Factor = {
  factorId: (typeof factorIds)[number];
  label: string;
  applicable: boolean;
  maxPoints: number;
  contribution: number | null;
  contributionBounds?: { lower: number; upper: number } | null;
  basisState: Nature;
  origin: Origin | null;
  ruleId: string;
  ruleVersion: string;
  evidenceRefs: string[];
  explanation: string;
};
export type Score = {
  assessmentId: string;
  projectId: string;
  modelVersion: string;
  profileId: string;
  inputVersion: string;
  calculatedAt: string;
  state: ScoreState;
  displayScore: number | null;
  class: ScoreClass | null;
  bounds: { lower: number; upper: number; meaning: "POSSIBLE_POINTS" } | null;
  factors: Factor[];
  blockingFindingIds: string[];
  previousAssessmentId: string | null;
};
export type ScoreClass =
  "HIGH_PRIORITY" | "GOOD_POTENTIAL" | "MORE_INFORMATION" | "LOW_PRIORITY";
export const classLabels: Record<ScoreClass, string> = {
  HIGH_PRIORITY: "Hohe Priorität",
  GOOD_POTENTIAL: "Gutes Potenzial",
  MORE_INFORMATION: "Informationen ergänzen",
  LOW_PRIORITY: "Aktuell geringe Priorität",
};
export const buildingTypes = [
  "Logistikhalle",
  "Industriegebäude",
  "Gewerbeimmobilie",
  "Landwirtschaftliches Gebäude",
  "Gewerbepark / Bestand",
  "Freifläche",
  "Sonstiges",
] as const;
export const goals = [
  "Eigenverbrauch steigern",
  "Dach oder Fläche bereitstellen",
  "Bestehende PV erweitern",
  "Speicher ergänzen",
  "Möglichkeiten zunächst prüfen",
] as const;
export const categories = [
  "Dach-/Lageplan",
  "Stromabrechnung",
  "Lastgang",
  "Fotos",
  "Statik",
  "Netzanschlussunterlagen",
  "Sonstiges",
] as const;
const quantity = z.number().finite().nonnegative().nullable();
const optionalPositive = z.number().finite().positive().nullable();
export const answersSchema = z
  .object({
    address: z.string().trim().max(240).default(""),
    postalCity: z.string().max(120).default(""),
    parcel: z.string().max(120).default(""),
    locationConfirmed: z.boolean().default(false),
    buildingType: z.enum(buildingTypes).nullable().default(null),
    otherBuilding: z.string().max(160).default(""),
    areaKind: z.enum(["Dach", "Freifläche"]).default("Dach"),
    area: optionalPositive.default(null),
    areaNature: z.enum(["OBSERVED", "ESTIMATED", "UNKNOWN"]).default("UNKNOWN"),
    roofForm: z
      .enum(["Flachdach", "Satteldach", "Sonstige", "Unbekannt"])
      .default("Unbekannt"),
    roofCondition: z
      .enum(["Keine Sanierung bekannt", "Sanierung geplant", "Unbekannt"])
      .default("Unbekannt"),
    roofMaterial: z.string().max(160).default(""),
    occupiedArea: quantity.default(null),
    usableArea: optionalPositive.default(null),
    currentUse: z.string().max(500).default(""),
    role: z
      .enum([
        "Eigentümer",
        "Mieter / Pächter",
        "Verwaltung / Bevollmächtigt",
        "Andere Rolle",
      ])
      .nullable()
      .default(null),
    authority: z
      .enum(["Liegt vor", "In Klärung", "Unbekannt"])
      .default("Unbekannt"),
    ownerContact: z
      .enum(["Besteht", "Wird geklärt", "Unbekannt"])
      .default("Unbekannt"),
    consumption: quantity.default(null),
    consumptionNature: z
      .enum(["OBSERVED", "ESTIMATED", "UNKNOWN"])
      .default("UNKNOWN"),
    consumptionYear: z.number().int().min(1900).max(2100).default(2025),
    zeroConfirmed: z.boolean().default(false),
    usageProfile: z
      .enum(["Tagsüber", "Rund um die Uhr", "Saisonal", "Unbekannt"])
      .default("Unbekannt"),
    pv: z.enum(["Ja", "Nein", "Unbekannt"]).default("Unbekannt"),
    pvPower: optionalPositive.default(null),
    pvYear: z.number().int().min(1900).max(2100).nullable().default(null),
    pvUsage: z
      .enum(["Eigenverbrauch", "Einspeisung", "Unbekannt"])
      .default("Unbekannt"),
    battery: z.enum(["Ja", "Nein", "Unbekannt"]).default("Unbekannt"),
    batteryCapacity: optionalPositive.default(null),
    batteryPower: optionalPositive.default(null),
    batteryYear: z.number().int().min(1900).max(2100).nullable().default(null),
    goal: z.enum(goals).nullable().default(null),
    additionalGoals: z.array(z.enum(goals)).max(4).default([]),
    description: z.string().max(2000).default(""),
    availableDocuments: z.array(z.enum(categories)).max(7).default([]),
    noDocuments: z.boolean().default(false),
  })
  .strict();
export type Answers = z.infer<typeof answersSchema>;
export const contactSchema = z
  .object({
    organization: z.string().trim().min(2).max(160),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.email().max(240),
    phone: z.string().max(80).default(""),
  })
  .strict();
export type Contact = z.infer<typeof contactSchema>;
export const reasons = [
  "AREA_TOO_SMALL",
  "ROOF_CONDITION",
  "OWNERSHIP_AUTHORITY",
  "LOW_CONSUMPTION",
  "PROJECT_SCALE_MISMATCH",
  "GRID_CONSTRAINT",
  "STRUCTURAL_CONSTRAINT",
  "REGION_OUT_OF_SCOPE",
  "ECONOMICS",
  "MISSING_INFORMATION",
  "OTHER",
  "PARTNER_CAPACITY",
  "DUPLICATE",
  "WITHDRAWN",
] as const;
export const reasonLabels: Record<(typeof reasons)[number], string> = {
  AREA_TOO_SMALL: "Nutzbare Fläche zu klein",
  ROOF_CONDITION: "Dachzustand",
  OWNERSHIP_AUTHORITY: "Eigentum / Entscheidung",
  LOW_CONSUMPTION: "Verbrauch",
  PROJECT_SCALE_MISMATCH: "Projektgröße passt nicht",
  GRID_CONSTRAINT: "Netzsituation",
  STRUCTURAL_CONSTRAINT: "Statik",
  REGION_OUT_OF_SCOPE: "Region außerhalb des Fokus",
  ECONOMICS: "Wirtschaftlichkeit",
  MISSING_INFORMATION: "Informationen unvollständig",
  OTHER: "Sonstiges",
  PARTNER_CAPACITY: "Partnerkapazität · organisatorisch",
  DUPLICATE: "Dublette · administrativ",
  WITHDRAWN: "Rückzug · separat",
};
export const rejectionSchema = z
  .object({
    primary: z.enum(reasons),
    secondary: z.array(z.enum(reasons)).max(3),
    certainty: z.enum([
      "CONFIRMED",
      "INSUFFICIENT_EVIDENCE",
      "PARTNER_SCOPE_DECISION",
    ]),
    note: z.string().trim().max(2000),
    evidenceRefs: z.array(z.string().min(3).max(240)).max(10),
  })
  .superRefine((v, ctx) => {
    if (
      new Set(v.secondary).size !== v.secondary.length ||
      v.secondary.includes(v.primary)
    )
      ctx.addIssue({
        code: "custom",
        message: "Gründe dürfen sich nicht wiederholen.",
      });
    const all = [v.primary, ...v.secondary];
    if (all.includes("OTHER") && v.note.length < 3)
      ctx.addIssue({
        code: "custom",
        path: ["note"],
        message: "Bitte erläutern Sie Sonstiges.",
      });
    if (
      all.some((r) =>
        [
          "ROOF_CONDITION",
          "GRID_CONSTRAINT",
          "STRUCTURAL_CONSTRAINT",
          "ECONOMICS",
        ].includes(r),
      ) &&
      (!v.evidenceRefs.length || v.note.length < 10)
    )
      ctx.addIssue({
        code: "custom",
        path: ["evidenceRefs"],
        message:
          "Technische Gründe benötigen einen fachlichen Bezug und eine Erläuterung.",
      });
  });
export type Rejection = z.infer<typeof rejectionSchema>;
export type Document = {
  id: string;
  name: string;
  size: number;
  mime: string;
  hash: string;
  category: (typeof categories)[number];
  version: number;
  state: "ready" | "processing" | "failed" | "removed";
  reviewState: "NOT_REVIEWED" | "REVIEWED";
  createdAt: string;
};
export type HistoryEvent = {
  eventId: string;
  requestId: string;
  actorId: string;
  occurredAt: string;
  action: string;
  from: Status;
  to: Status;
  inputVersion: string;
  revision: number;
  scoreSnapshot: Score | null;
  rejection: Rejection | null;
  note: string;
  visibility: "INTERNAL" | "CONTACT";
  simulated: boolean;
};
export type InfoRequest = {
  id: string;
  items: string[];
  answered: string[];
  message: string;
  recipient: string;
  dueAt: string | null;
  createdAt: string;
  delivery: "SIMULATED_CONFIRMED";
};
export type Receipt = {
  requestId: string;
  recipient: string;
  submittedAt: string;
  documentIds: string[];
  inputVersion: string;
  scope: string[];
  comment: string;
  contact: Contact;
  snapshot: { answers: Answers; score: Score | null; documents: Document[] };
  simulated: true;
};
export type Project = {
  id: string;
  tenantId: string;
  ownerId: string;
  partnerId: string | null;
  synthetic: boolean;
  revision: number;
  inputVersion: number;
  maxVisited: number;
  createdAt: string;
  updatedAt: string;
  status: Status;
  statusEnteredAt: string;
  answers: Answers;
  documents: Document[];
  score: Score | null;
  scoreJobState: "IDLE" | "RUNNING" | "SUCCEEDED" | "FAILED";
  analysisRows: {
    label: string;
    state: "waiting" | "running" | "complete" | "open" | "error";
  }[];
  receipt: Receipt | null;
  events: HistoryEvent[];
  infoRequests: InfoRequest[];
  contact: Contact | null;
  assignee: string | null;
  nextAction: { label: string; dueAt: string | null; open: boolean } | null;
  region: string;
  evidence: Evidence[];
  blockers: string[];
  scenario:
    | "normal"
    | "partial"
    | "stale"
    | "error"
    | "blocked"
    | "not-ready"
    | "ready";
};
export type Session = {
  actorId: string;
  role: "OWNER" | "PARTNER";
  tenantId: string;
  partnerId: string | null;
  expiresAt: number;
};
