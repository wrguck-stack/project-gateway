import { describe, it, expect } from "vitest";
import {
  answersSchema,
  rejectionSchema,
  statuses,
  type Factor,
  type Session,
} from "@/domain/model";
import {
  assessFactors,
  authorize,
  checkRevision,
  guardTransition,
  normalizeAnswers,
  parseGermanNumber,
  pipeline,
  scoreClass,
  transitionAllowed,
  uploadLimits,
  validateStep,
} from "@/domain/rules";
import contract from "@/data/analytics-contract.json";
import examples from "@/data/analytics-examples.json";
import { seedProjects } from "@/server/seed";
import { qualifyDemo } from "@/server/qualification";
const full = () => structuredClone(examples.scoreFull.factors) as Factor[];
const project = () => seedProjects()[0];
describe("Normative scoring contract", () => {
  it.each([
    [0, "LOW_PRIORITY"],
    [49, "LOW_PRIORITY"],
    [50, "MORE_INFORMATION"],
    [64, "MORE_INFORMATION"],
    [65, "GOOD_POTENTIAL"],
    [79, "GOOD_POTENTIAL"],
    [80, "HIGH_PRIORITY"],
    [100, "HIGH_PRIORITY"],
  ])("classifies %s from exactly the displayed integer", (value, expected) =>
    expect(scoreClass(Number(value))).toBe(expected),
  );
  it.each([-1, 101, 79.6, NaN, Infinity])(
    "rejects invalid score %s without clamping",
    (v) => expect(() => scoreClass(v)).toThrow(),
  );
  it("uses all nine contributions and rounds only the sum", () => {
    expect(assessFactors(full()).displayScore).toBe(82);
    const f = full();
    f[0].contribution = 13.5;
    expect(assessFactors(f).displayScore).toBe(83);
  });
  it("keeps the exact 70–85 possible range without renormalization or class", () => {
    const f = full();
    f[1].contribution = null;
    const r = assessFactors(f);
    expect(r).toMatchObject({
      displayScore: null,
      class: null,
      partial: true,
      bounds: { lower: 70, upper: 85 },
      known: 8,
      weightCovered: 85,
    });
  });
  it("includes contribution uncertainty in partial bounds", () => {
    const f = full();
    f[1].contribution = null;
    f[0].contributionBounds = { lower: 11, upper: 14 };
    expect(assessFactors(f).bounds).toMatchObject({ lower: 68, upper: 86 });
  });
  it("distinguishes a known zero from unknown", () => {
    const f = full();
    f[0].contribution = 0;
    expect(assessFactors(f).displayScore).toBe(69);
    f[0].contribution = null;
    expect(assessFactors(f).displayScore).toBeNull();
  });
  it("excludes unweighted and not-applicable factors from coverage", () => {
    const f = full();
    f[4].applicable = false;
    f[4].maxPoints = 0;
    f[4].contribution = null;
    f[0].maxPoints += 10;
    expect(assessFactors(f)).toMatchObject({
      known: 8,
      applicable: 8,
      partial: false,
    });
    f[4].applicable = true;
    expect(assessFactors(f).partial).toBe(false);
  });
  it("rejects invalid weights, duplicate factors, NaN and inverted ranges", () => {
    for (const mutate of [
      (f: Factor[]) => (f[0].maxPoints = 0),
      (f: Factor[]) => (f[0].factorId = f[1].factorId),
      (f: Factor[]) => (f[0].contribution = NaN),
      (f: Factor[]) => (f[0].contributionBounds = { lower: 15, upper: 10 }),
    ]) {
      const f = full();
      mutate(f);
      expect(() => assessFactors(f)).toThrow();
    }
  });
});
describe("Status matrix", () => {
  for (const from of statuses)
    for (const to of statuses)
      it(`${from} → ${to} matches the Analytics matrix`, () =>
        expect(transitionAllowed(from, to)).toBe(
          (contract.statusTransitions[from] as string[]).includes(to),
        ));
  it("requires explicit reasons for rejection and explanation for reopening", () => {
    const p = project();
    p.status = "QUALIFIED";
    expect(() => guardTransition(p, "REJECTED", {})).toThrow();
    p.status = "REJECTED";
    expect(() =>
      guardTransition(p, "PARTNER_REVIEW", { explicit: true }),
    ).toThrow();
    expect(() =>
      guardTransition(p, "PARTNER_REVIEW", {
        explicit: true,
        note: "Neue Grundlagen vorhanden",
      }),
    ).not.toThrow();
  });
  it("requires confirmed delivery before requesting information", () => {
    const p = project();
    p.status = "QUALIFIED";
    expect(() => guardTransition(p, "INFO_REQUESTED", {})).toThrow();
    expect(() =>
      guardTransition(p, "INFO_REQUESTED", { deliveryConfirmed: true }),
    ).not.toThrow();
  });
  it("requires qualification gates and confirmed milestones", () => {
    const p = project();
    p.status = "SCORING";
    expect(() => guardTransition(p, "QUALIFIED", {})).toThrow();
    p.status = "CONTRACTED";
    expect(() => guardTransition(p, "REALIZED", {})).toThrow();
    expect(() =>
      guardTransition(p, "REALIZED", { milestoneConfirmed: true }),
    ).not.toThrow();
  });
  it("keeps high score and blocks acceptance with a confirmed blocker", () => {
    const p = seedProjects()[4];
    p.status = "QUALIFIED";
    expect(p.score?.displayScore).toBe(82);
    expect(() => guardTransition(p, "ACCEPTED", {})).toThrow();
  });
  it("guards response resumption but leaves partial requirements intact", () => {
    const p = project();
    p.status = "INFO_REQUESTED";
    p.infoRequests = [
      {
        id: "request",
        items: ["Dachplan", "Lastgang"],
        answered: ["Dachplan"],
        createdAt: p.createdAt,
        dueAt: null,
        recipient: "contact@example.invalid",
        message: "Bitte ergänzen",
        delivery: "SIMULATED_CONFIRMED",
      },
    ];
    expect(() => guardTransition(p, "PARTNER_REVIEW", {})).not.toThrow();
    expect(p.infoRequests[0].answered).not.toContain("Lastgang");
  });
});
describe("Input, provenance, files and access", () => {
  it("parses German decimal/thousands values and preserves empty vs zero", () => {
    expect(parseGermanNumber("4.800")).toBe(4800);
    expect(parseGermanNumber("4,8")).toBe(4.8);
    expect(parseGermanNumber("0")).toBe(0);
    expect(parseGermanNumber("")).toBeNull();
    expect(() => parseGermanNumber("-4")).toThrow();
    expect(() => parseGermanNumber("4.8")).toThrow();
  });
  it("clears irrelevant roof/PV/storage fields and unknown consumption", () => {
    const a = answersSchema.parse({
      areaKind: "Freifläche",
      roofCondition: "Sanierung geplant",
      pv: "Nein",
      pvPower: 100,
      battery: "Nein",
      batteryCapacity: 250,
      consumption: 100,
      consumptionNature: "UNKNOWN",
    });
    expect(normalizeAnswers(a)).toMatchObject({
      roofCondition: "Unbekannt",
      pvPower: null,
      batteryCapacity: null,
      consumption: null,
    });
  });
  it("requires zero consumption confirmation without turning unknown into zero", () => {
    const a = answersSchema.parse({
      consumption: 0,
      consumptionNature: "OBSERVED",
    });
    expect(() => validateStep(a, 5)).toThrow();
    a.zeroConfirmed = true;
    expect(() => validateStep(a, 5)).not.toThrow();
    a.consumptionNature = "UNKNOWN";
    a.consumption = null;
    expect(() => validateStep(a, 5)).not.toThrow();
  });
  const rejection = {
    primary: "OTHER",
    secondary: [],
    certainty: "INSUFFICIENT_EVIDENCE",
    note: "Konkreter sonstiger Grund",
    evidenceRefs: [],
  };
  it("requires OTHER text, one primary, max three distinct secondary reasons", () => {
    expect(rejectionSchema.safeParse(rejection).success).toBe(true);
    for (const delta of [
      { note: "" },
      { primary: undefined },
      { secondary: ["OTHER"] },
      { secondary: ["ECONOMICS", "ECONOMICS"] },
      {
        secondary: [
          "AREA_TOO_SMALL",
          "OWNERSHIP_AUTHORITY",
          "LOW_CONSUMPTION",
          "MISSING_INFORMATION",
        ],
      },
    ])
      expect(
        rejectionSchema.safeParse({ ...rejection, ...delta }).success,
      ).toBe(false);
  });
  it("requires a professional reference for technical rejection reasons", () => {
    expect(
      rejectionSchema.safeParse({
        ...rejection,
        primary: "STRUCTURAL_CONSTRAINT",
        evidenceRefs: [],
      }).success,
    ).toBe(false);
    expect(
      rejectionSchema.safeParse({
        ...rejection,
        primary: "STRUCTURAL_CONSTRAINT",
        evidenceRefs: ["Fachvermerk A"],
      }).success,
    ).toBe(true);
  });
  it("enforces per-file, count, total, supported types and non-empty files", () => {
    expect(() =>
      uploadLimits([{ name: "plan.pdf", size: 20_000_000 }]),
    ).not.toThrow();
    for (const files of [
      [{ name: "plan.pdf", size: 20_000_001 }],
      Array.from({ length: 16 }, () => ({ name: "p.pdf", size: 1 })),
      Array.from({ length: 6 }, () => ({ name: "p.pdf", size: 20_000_000 })),
      [{ name: "macro.xlsm", size: 10 }],
      [{ name: "a.pdf", size: 0 }],
    ])
      expect(() => uploadLimits(files)).toThrow();
  });
  it("enforces tenant/partner/owner guards and version conflicts", () => {
    const p = project();
    const s: Session = {
      actorId: "reviewer",
      role: "PARTNER",
      tenantId: p.tenantId,
      partnerId: p.partnerId,
      expiresAt: Date.now() + 1000,
    };
    expect(() => authorize(p, s)).not.toThrow();
    expect(() => authorize(p, { ...s, tenantId: "OTHER" })).toThrow();
    expect(() => authorize(p, { ...s, partnerId: "OTHER" })).toThrow();
    expect(() =>
      authorize(p, { ...s, role: "OWNER", actorId: "wrong" }),
    ).toThrow();
    p.receipt = null;
    expect(() => authorize(p, s)).toThrow();
    expect(() => checkRevision(p, p.revision - 1)).toThrow();
  });
  it("preserves all pipeline fixture counts and freezes terminal ages", () => {
    const rows = pipeline(seedProjects(), examples.pipeline.asOf);
    expect(rows.reduce((s, r) => s + r.count, 0)).toBe(140);
    for (const expected of examples.pipeline.rows) {
      const row = rows.find((r) => r.status === expected.status)!;
      expect(row.count).toBe(expected.count);
      expect(row.overdue).toBe(expected.overdueActions);
      if (["REJECTED", "REALIZED"].includes(row.status))
        expect(row.age).toBeNull();
    }
  });
  it("uses dynamic ground profile weights and never associates a real address with synthetic solar evidence", () => {
    const p = project();
    p.answers.areaKind = "Freifläche";
    const score = qualifyDemo(p, p.createdAt);
    expect(score.factors[4]).toMatchObject({
      applicable: false,
      maxPoints: 0,
      contribution: null,
    });
    expect(
      score.factors
        .filter((f) => f.applicable)
        .reduce((s, f) => s + f.maxPoints, 0),
    ).toBe(100);
    p.synthetic = false;
    expect(qualifyDemo(p, p.createdAt).factors[1].contribution).toBeNull();
  });
});
