import fixture from "@/data/pipeline-fixture.json";
import examples from "@/data/analytics-examples.json";
import {
  answersSchema,
  type Project,
  type Status,
  type Contact,
  type Evidence,
} from "@/domain/model";
import { qualifyDemo } from "./qualification";
export const demoAddresses = [
  "Musterstraße 18 · 76131 Karlsruhe",
  "Industriestraße 24 · 68159 Mannheim",
  "Dieselstraße 10 · 89079 Ulm",
];
export const demoContact: Contact = {
  organization: "Demo Immobilien GmbH · synthetisch",
  firstName: "Alex",
  lastName: "Beispiel",
  email: "projekt@example.invalid",
  phone: "",
};
export function newProject(
  id: string,
  ownerId: string,
  address: string,
  at: string,
): Project {
  return {
    id,
    tenantId: "DEMO-PARTNER",
    ownerId,
    partnerId: null,
    synthetic: demoAddresses.includes(address),
    revision: 1,
    inputVersion: 1,
    maxVisited: 1,
    createdAt: at,
    updatedAt: at,
    status: "NEW",
    statusEnteredAt: at,
    answers: answersSchema.parse({ address }),
    documents: [],
    score: null,
    scoreJobState: "IDLE",
    analysisRows: [],
    receipt: null,
    events: [],
    infoRequests: [],
    contact: null,
    assignee: null,
    nextAction: null,
    region: "Baden-Württemberg",
    evidence: [],
    blockers: [],
    scenario: "normal",
  };
}
export function seedProjects(): Project[] {
  return fixture.projects.map((row, i) => {
    const p = newProject(
      i === 0
        ? "PG-DEMO-82"
        : i === 1
          ? "PG-DEMO-PARTIAL"
          : i === 2
            ? "PG-DEMO-STALE"
            : i === 3
              ? "PG-DEMO-ERROR"
              : i === 4
                ? "PG-DEMO-BLOCKED"
                : i === 5
                  ? "PG-DEMO-ZERO"
                  : i === 6
                    ? "PG-DEMO-NOT-READY"
                    : i === 7
                      ? "PG-DEMO-READY"
                      : i === 8
                        ? "PG-DEMO-ENERGY"
                        : row.projectId,
      "seed-owner",
      demoAddresses[i % 3],
      fixture.asOf,
    );
    p.synthetic = true;
    p.maxVisited = 10;
    p.partnerId = "DEMO-PARTNER";
    p.answers = answersSchema.parse({
      address: p.answers.address,
      locationConfirmed: true,
      buildingType: "Logistikhalle",
      area: 4800,
      areaNature: "ESTIMATED",
      role: "Eigentümer",
      authority: "Liegt vor",
      consumption: i === 5 ? 0 : 620000,
      consumptionNature: "OBSERVED",
      zeroConfirmed: i === 5,
      usageProfile: "Tagsüber",
      roofCondition: "Keine Sanierung bekannt",
      pv: i === 8 ? "Ja" : "Nein",
      battery: "Nein",
      goal: "Eigenverbrauch steigern",
      availableDocuments: ["Dach-/Lageplan", "Stromabrechnung"],
    });
    p.scenario =
      i === 1
        ? "partial"
        : i === 2
          ? "stale"
          : i === 3
            ? "error"
            : i === 4
              ? "blocked"
              : i === 6
                ? "not-ready"
                : i === 7
                  ? "ready"
                  : "normal";
    if (i === 4)
      p.blockers = [
        "Synthetischer bestätigter Befund: Sanierung vor Installation erforderlich. Quelle: Demo-Fachvermerk 05.09.2026.",
      ];
    p.score = qualifyDemo(p, fixture.asOf);
    if (i === 8) {
      p.evidence = examples.energy.values.map((v) => ({
        id: v.id,
        value: v.value,
        unit: v.unit,
        origin: v.origin as Evidence["origin"],
        nature: v.nature as Evidence["nature"],
        asOf: fixture.asOf,
        sourceRef: v.source,
        loadState: "READY",
        ...(v.interval ? { interval: v.interval } : {}),
        period: examples.energy.period,
        note: "Eigenständiger synthetischer Jahresenergie-Datensatz. Keine reale Standortbewertung.",
      }));
    }
    if (i === 2 || i === 3) {
      p.evidence = [
        {
          id: "LAST_KNOWN_YIELD",
          value: 980,
          unit: "kWh/kWp/Jahr",
          origin: "DERIVED",
          nature: "ESTIMATED",
          asOf: fixture.asOf,
          sourceRef: "Synthetischer UI-Prüfdatensatz · DEMO_SOURCE_SOLAR_YIELD",
          loadState: i === 2 ? "STALE" : "ERROR",
          note: "Simulierter Aktualisierungszustand. Keine externe Abfrage; letzter Beispielwert bleibt sichtbar.",
        },
      ];
    }
    p.scoreJobState = i === 3 ? "FAILED" : "SUCCEEDED";
    // Keep the supplied 140-project stage ledger. Named demo edge cases are independent score states.
    p.status = row.status as Status;
    p.statusEnteredAt = row.statusEnteredAt;
    p.contact = demoContact;
    p.assignee = i % 2 ? "demo-reviewer" : null;
    p.nextAction = row.nextAction
      ? {
          label:
            p.status === "INFO_REQUESTED"
              ? "Ausstehende Angaben nachfassen"
              : p.status === "QUALIFIED"
                ? "Erstprüfung beginnen"
                : "Unterlagen prüfen",
          dueAt: row.nextAction.dueAt,
          open: row.nextAction.open,
        }
      : null;
    p.receipt = {
      requestId: `seed-${p.id}`,
      recipient: "Gateway Demopartner",
      submittedAt: fixture.asOf,
      documentIds: [],
      inputVersion: "1",
      scope: ["Standort", "Objekt", "Energie", "Ziel", "Score"],
      comment: "Synthetischer Demo-Bestand aus dem Analytics-Handoff.",
      contact: demoContact,
      snapshot: {
        answers: structuredClone(p.answers),
        score: structuredClone(p.score),
        documents: [],
      },
      simulated: true,
    };
    p.events = [
      {
        eventId: `event-${p.id}`,
        requestId: `seed-${p.id}`,
        actorId: "Demo-Datenimport",
        occurredAt: fixture.asOf,
        action: "Synthetischen Bestandsstand geladen",
        from: p.status,
        to: p.status,
        inputVersion: "1",
        revision: 1,
        scoreSnapshot: structuredClone(p.score),
        rejection:
          p.status === "REJECTED"
            ? {
                primary: "MISSING_INFORMATION",
                secondary: [],
                certainty: "INSUFFICIENT_EVIDENCE",
                note: "Synthetisches Ablehnungsbeispiel.",
                evidenceRefs: [],
              }
            : null,
        note: "Demo-Bestand; keine rekonstruierte echte Projekthistorie.",
        visibility: "INTERNAL",
        simulated: true,
      },
    ];
    if (p.status === "INFO_REQUESTED")
      p.infoRequests = [
        {
          id: `info-${p.id}`,
          items: ["Dach-/Lageplan", "Lastgang"],
          answered: i % 2 ? ["Dach-/Lageplan"] : [],
          message: "Bitte ergänzen Sie Dachplan und Lastgang.",
          recipient: demoContact.email,
          dueAt: row.nextAction?.dueAt ?? null,
          createdAt: row.statusEnteredAt,
          delivery: "SIMULATED_CONFIRMED",
        },
      ];
    return p;
  });
}
