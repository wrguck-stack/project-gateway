import {
  factorIds,
  factorLabels,
  type Project,
  type Score,
  type Factor,
} from "@/domain/model";
import { assessFactors } from "@/domain/rules";
export function qualifyDemo(project: Project, at: string): Score {
  const a = project.answers;
  const maxima =
    a.areaKind === "Freifläche"
      ? [20, 20, 20, 15, 0, 5, 10, 5, 5]
      : [15, 15, 20, 15, 10, 5, 10, 5, 5];
  const base =
    a.areaKind === "Freifläche"
      ? [18, 16, 18, 15, null, 4, 7, 3, 4]
      : [13, 12, 18, 15, 6, 4, 7, 3, 4];
  // Deliberately synthetic, versioned rules. No technical suitability thresholds.
  const values: (number | null)[] = [
    a.area === null ? null : base[0],
    project.synthetic ? base[1] : null,
    a.consumption === null ? null : a.consumption === 0 ? 0 : base[2],
    a.authority === "Liegt vor" ? base[3] : null,
    a.areaKind === "Freifläche"
      ? null
      : a.roofCondition === "Unbekannt"
        ? null
        : base[4],
    a.area === null ? null : base[5],
    a.goal === null ? null : base[6],
    a.noDocuments ? 0 : a.availableDocuments.length ? base[7] : null,
    a.pv === "Unbekannt" || a.battery === "Unbekannt" ? null : base[8],
  ];
  if (project.scenario === "partial") values[1] = null;
  const factors: Factor[] = factorIds.map((id, i) => ({
    factorId: id,
    label: factorLabels[i],
    applicable: i !== 4 || a.areaKind === "Dach",
    maxPoints: maxima[i],
    contribution: values[i],
    basisState:
      i === 4 && a.areaKind === "Freifläche"
        ? "NOT_APPLICABLE"
        : values[i] === null
          ? "UNKNOWN"
          : project.scenario === "ready"
            ? "OBSERVED"
            : [0, 1, 2, 4, 5].includes(i)
              ? "ESTIMATED"
              : "OBSERVED",
    origin: values[i] === null ? null : i === 1 ? "DERIVED" : "USER",
    ruleId: `DEMO_${id}`,
    ruleVersion: "demo-v1",
    evidenceRefs:
      values[i] === null ? [] : [`input-${project.inputVersion}-${id}`],
    explanation:
      values[i] === null
        ? "Für diesen Faktor fehlt eine verfügbare Grundlage. Bekannte Beiträge werden nicht hochgerechnet."
        : `Synthetische Demo-Regel demo-v1: ${values[i]} von ${maxima[i]} Punkten bei der erfassten Angabe. Keine fachlich validierte Eignungsschwelle.`,
  }));
  const result = assessFactors(factors);
  let state: Score["state"] = result.partial
    ? "PARTIAL"
    : factors.some((f) => f.basisState === "ESTIMATED")
      ? "ESTIMATED"
      : "READY";
  if (
    !a.locationConfirmed ||
    !a.buildingType ||
    project.scenario === "not-ready"
  )
    state = "NOT_READY";
  if (project.scenario === "error") state = "ERROR";
  if (project.scenario === "stale") state = "STALE";
  return {
    assessmentId: `${project.id}-assessment-${project.inputVersion}`,
    projectId: project.id,
    modelVersion: "demo-v1",
    profileId:
      a.areaKind === "Freifläche"
        ? "GROUND_PV"
        : a.goal === "Speicher ergänzen"
          ? "STORAGE"
          : a.goal === "Bestehende PV erweitern"
            ? "PV_EXTENSION"
            : "COMMERCIAL_ROOF_PV",
    inputVersion: String(project.inputVersion),
    calculatedAt: at,
    state,
    displayScore: ["ERROR", "NOT_READY"].includes(state)
      ? null
      : result.displayScore,
    class: ["ERROR", "NOT_READY"].includes(state) ? null : result.class,
    bounds: ["ERROR", "NOT_READY"].includes(state) ? null : result.bounds,
    factors,
    blockingFindingIds: project.blockers,
    previousAssessmentId: project.score?.assessmentId ?? null,
  };
}
