import { describe, it, expect } from "vitest";
import { annualEnergyComparison, energyExtent } from "../src/domain/energy";
import { seedProjects } from "../src/server/seed";
describe("Annual energy geometry", () => {
  const values = seedProjects().find(
    (p) => p.id === "PG-DEMO-ENERGY",
  )!.evidence;
  it("uses the distinct handoff example and its shared annual axis", () => {
    const comparison = annualEnergyComparison(values)!;
    expect(comparison.maximum).toBe(620);
    expect(comparison.values.map(energyExtent)).toEqual([620, 180, 450]);
    expect(comparison.values[2].value).toBeNull();
  });
  it("does not compare inconsistent periods", () => {
    expect(
      annualEnergyComparison(
        values.map((v, i) =>
          i === 1 ? { ...v, period: { ...v.period!, end: "2024-12-31" } } : v,
        ),
      ),
    ).toBeNull();
  });
  it("does not place power on the annual energy axis", () => {
    expect(
      annualEnergyComparison(
        values.slice(0, 2).map((v, i) => (i ? { ...v, unit: "kWp" } : v)),
      ),
    ).toBeNull();
  });
  it("keeps confirmed zero separate from unknown", () => {
    expect(energyExtent({ ...values[0], value: 0 })).toBe(0);
    expect(
      energyExtent({ ...values[0], value: null, nature: "UNKNOWN" }),
    ).toBeNull();
  });
  it("rejects invalid intervals and excludes stale evidence from geometry", () => {
    expect(
      energyExtent({
        ...values[2],
        interval: { ...values[2].interval!, lower: 500, upper: 450 },
      }),
    ).toBeNull();
    expect(
      annualEnergyComparison(
        values
          .slice(0, 2)
          .map((v, i) => (i ? { ...v, loadState: "STALE" } : v)),
      ),
    ).toBeNull();
  });
});
