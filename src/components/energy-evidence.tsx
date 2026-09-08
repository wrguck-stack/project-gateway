import type { Evidence } from "@/domain/model";
import { annualEnergyComparison, energyExtent } from "@/domain/energy";
import { dateDE, numberDE } from "@/domain/rules";
const labels: Record<string, string> = {
  CONSUMPTION: "Jährlicher Stromverbrauch",
  EXISTING_GENERATION: "Vorhandene Eigenerzeugung",
  ADDITIONAL_POTENTIAL: "Zusätzliches Erzeugungspotenzial",
  LAST_KNOWN_YIELD: "Letzter spezifischer Jahresertrag",
};
export function EnergyEvidence({ values }: { values: Evidence[] }) {
  if (!values.length) return null;
  const comparison = annualEnergyComparison(values);
  return (
    <div className="energy-evidence">
      <p>
        Separates synthetisches Datenbeispiel · kein externer Dienst
        angeschlossen.
      </p>
      {comparison && (
        <p className="meta">
          Vergleichszeitraum {comparison.period.start} bis{" "}
          {comparison.period.end} · {comparison.period.timezone}. Gemeinsame
          Nullachse: 0 bis {numberDE(comparison.maximum)} MWh/Jahr. Keine
          Summierung.
        </p>
      )}
      <dl>
        {values.map((v) => {
          const plotted =
            comparison?.values.includes(v) && comparison.maximum > 0;
          return (
            <div key={v.id} className="energy-row" data-energy={v.id}>
              <dt>{labels[v.id] ?? v.id}</dt>
              <dd>
                <strong>
                  {v.interval
                    ? `${numberDE(v.interval.lower)}–${numberDE(v.interval.upper)}`
                    : v.value === null
                      ? "Noch unbekannt"
                      : typeof v.value === "number"
                        ? numberDE(v.value)
                        : String(v.value)}{" "}
                  {v.unit === "MWh/year" ? "MWh/Jahr" : v.unit}
                </strong>
                {plotted && comparison && (
                  <div className="energy-track" aria-hidden>
                    {v.interval ? (
                      <span
                        className="energy-interval"
                        style={{
                          left: `${(v.interval.lower / comparison.maximum) * 100}%`,
                          width: `${((v.interval.upper - v.interval.lower) / comparison.maximum) * 100}%`,
                        }}
                      />
                    ) : (
                      <span
                        className="energy-bar"
                        style={{
                          width: `${(energyExtent(v)! / comparison.maximum) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                )}
                <small>
                  {v.nature === "ESTIMATED"
                    ? "Geschätzt"
                    : "Vom Nutzer angegeben"}
                  {v.interval
                    ? " · Szenariospanne, kein Konfidenzintervall"
                    : ""}{" "}
                  · {v.sourceRef}
                </small>
                <small>
                  Stand {v.asOf ? dateDE(v.asOf) : "unbekannt"}
                  {v.loadState === "STALE"
                    ? " · Veraltet – Aktualisierung ausstehend"
                    : v.loadState === "ERROR"
                      ? " · Aktualisierung fehlgeschlagen – letzter gültiger Beispielwert"
                      : ""}
                </small>
                {v.note && <small>{v.note}</small>}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
