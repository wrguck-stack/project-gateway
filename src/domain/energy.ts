import type { Evidence } from "./model";

export function energyExtent(value: Evidence) {
  if (value.nature === "UNKNOWN" || value.nature === "NOT_APPLICABLE")
    return null;
  if (value.interval) {
    const { lower, upper } = value.interval;
    return Number.isFinite(lower) &&
      Number.isFinite(upper) &&
      lower >= 0 &&
      upper >= lower
      ? upper
      : null;
  }
  return typeof value.value === "number" &&
    Number.isFinite(value.value) &&
    value.value >= 0
    ? value.value
    : null;
}

export function annualEnergyComparison(values: Evidence[]) {
  const usable = values.filter(
    (v) =>
      v.loadState === "READY" &&
      v.unit === "MWh/year" &&
      v.period &&
      energyExtent(v) !== null,
  );
  if (usable.length < 2) return null;
  const period = usable[0].period!;
  if (
    usable.some(
      (v) =>
        v.period!.start !== period.start ||
        v.period!.end !== period.end ||
        v.period!.timezone !== period.timezone,
    )
  )
    return null;
  const maximum = Math.max(...usable.map((v) => energyExtent(v)!));
  return { values: usable, period, maximum };
}
