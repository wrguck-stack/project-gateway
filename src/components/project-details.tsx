import Link from "next/link";
import { type Project, classLabels } from "@/domain/model";
import { assessFactors, coverage, dateDE, numberDE } from "@/domain/rules";
import { Notice, ResponsiveDisclosure } from "./ui";
import { SiteContext } from "./site-context";
import { EnergyEvidence } from "./energy-evidence";
export function ScoreSummary({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  const s = project.score;
  return (
    <div
      className={`score-summary ${compact ? "compact-score" : ""}`}
      data-score-state={s?.state ?? "NOT_READY"}
    >
      {!s || s.state === "NOT_READY" ? (
        <>
          <h2>Noch nicht bewertbar</h2>
          <p>Standort, Profil oder notwendige Grundlagen ergänzen.</p>
        </>
      ) : s.state === "ERROR" ? (
        <>
          <h2>Bewertung derzeit nicht verfügbar.</h2>
          <Notice>
            Fehler im Demo-Bewertungsdienst. Vorhandene Angaben bleiben
            erhalten.
          </Notice>
        </>
      ) : s.state === "SCORING" ? (
        <h2>Qualifizierung wird erstellt</h2>
      ) : s.displayScore === null ? (
        <>
          <p className="lead">Noch kein Gesamtscore</p>
          {s.bounds && (
            <div className="partial-number">
              {numberDE(s.bounds.lower)}–{numberDE(s.bounds.upper)}
            </div>
          )}
          <p>Mögliche Punktespanne · finale Klasse offen</p>
          <small>
            Bekannte Beiträge plus offene Gewichtspunkte. Kein statistisches
            Konfidenzintervall.
          </small>
        </>
      ) : (
        <>
          <div className="score-number">
            {s.displayScore}
            <span>/100</span>
          </div>
          {s.class && (
            <h2 className="score-class amber">{classLabels[s.class]}</h2>
          )}
          <p className="basis">
            {s.state === "STALE"
              ? "Letzte Bewertung · Aktualisierung erforderlich"
              : s.state === "ESTIMATED"
                ? "Vorläufig · enthält Schätzwerte"
                : "Alle anwendbaren Faktoren bewertbar"}
          </p>
        </>
      )}
      {s && (
        <p className="meta">
          Modell {s.modelVersion} · Eingabeversion {s.inputVersion}
          <br />
          Stand {dateDE(s.calculatedAt)} · Demo-Bewertung
        </p>
      )}
      <p className="meta">
        Keine technische Freigabe. Die Punktzahl ist keine Datenvollständigkeit.
      </p>
      {project.blockers.map((b) => (
        <Notice critical key={b}>
          <strong>Bestätigter Blocker</strong>
          <p>{b}</p>
        </Notice>
      ))}
      <Notice>
        <strong>Noch offen</strong>
        <p>Netzanschluss und Tragfähigkeit sind noch nicht geprüft.</p>
      </Notice>
    </div>
  );
}
export function Factors({
  project,
  editable = true,
}: {
  project: Project;
  editable?: boolean;
}) {
  const s = project.score;
  if (!s) return null;
  let result;
  try {
    result = assessFactors(s.factors);
  } catch {
    return (
      <Notice critical>
        Fehlerhafte Faktorwerte. Keine gültige Aufschlüsselung verfügbar.
      </Notice>
    );
  }
  const max = Math.max(...s.factors.map((f) => f.maxPoints));
  return (
    <section id="score" className="dossier-section">
      <p className="overline">NACHVOLLZIEHBARE BEWERTUNG</p>
      <h2>Neun Faktoren. Eine Grundlage.</h2>
      <p>
        {result.known} von {result.applicable} Faktoren bewertbar ·{" "}
        {result.weightCovered} von 100 Gewichtspunkten abgedeckt
      </p>
      <ResponsiveDisclosure>
        <summary>Alle 9 Faktoren ansehen</summary>
        <ol className="factor-list">
          {s.factors.map((f) => (
            <li key={f.factorId} data-factor={f.factorId}>
              <details>
                <summary>
                  <span>{f.label}</span>
                  <strong className="mono">
                    {!f.applicable
                      ? "Nicht relevant"
                      : f.maxPoints === 0
                        ? "Nicht gewichtet"
                        : f.contribution === null
                          ? "Noch unbekannt"
                          : `${numberDE(f.contribution)} / ${numberDE(f.maxPoints)}`}
                  </strong>
                </summary>
                <div className="factor-rule">
                  <p>{f.explanation}</p>
                  <p>
                    Regel:{" "}
                    <span className="mono">
                      {f.ruleId} / {f.ruleVersion}
                    </span>
                  </p>
                  <p>
                    Eingabeversion {s.inputVersion} · {dateDE(s.calculatedAt)}
                  </p>
                  <p>
                    Belegreferenz:{" "}
                    {f.evidenceRefs.join(", ") || "Kein verfügbarer Beleg"}
                  </p>
                  {editable && (
                    <Link
                      href={`/standortcheck/${project.id}/${f.factorId === "DOCUMENTATION" ? 9 : f.factorId === "CONSUMPTION_SELF_USE" ? 5 : 3}?return=review`}
                    >
                      Angabe ergänzen
                    </Link>
                  )}
                </div>
              </details>
              {f.applicable && f.maxPoints > 0 && (
                <div className="factor-axis" aria-hidden>
                  <div
                    className={`bar-max ${f.contribution === null ? "unknown-bar" : ""}`}
                    style={{ width: `${(f.maxPoints / max) * 100}%` }}
                  >
                    {f.contribution !== null && (
                      <i
                        style={{
                          width: `${(f.contribution / f.maxPoints) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
              <small>
                {!f.applicable
                  ? "Nicht anwendbar im aktiven Profil"
                  : f.origin === "DERIVED"
                    ? "Berechnet · synthetisches Demo-Szenario"
                    : f.origin === "USER"
                      ? "Vom Nutzer angegeben"
                      : "Quelle offen"}{" "}
                ·{" "}
                {
                  {
                    OBSERVED: "angegeben",
                    ESTIMATED: "geschätzt",
                    UNKNOWN: "unbekannt",
                    NOT_APPLICABLE: "nicht relevant",
                  }[f.basisState]
                }
              </small>
            </li>
          ))}
        </ol>
        <p className="mono">
          {s.displayScore === null
            ? "Kein hochgerechneter Gesamtscore"
            : `Summe ${s.displayScore} / 100`}
        </p>
        <small>
          Gemeinsame Punkteachse: 0 bis {max}. Maximalgewichte bleiben sichtbar.
        </small>
      </ResponsiveDisclosure>
    </section>
  );
}
export function Findings({ project }: { project: Project }) {
  const a = project.answers;
  return (
    <div className="findings">
      <section>
        <h3>Dafür spricht</h3>
        <p>
          {a.area !== null
            ? "Eine verfügbare Fläche wurde angegeben."
            : "Der Standort ist erfasst."}
        </p>
        <p>
          {a.authority === "Liegt vor"
            ? "Eine Entscheidungssituation wurde angegeben."
            : "Ein Projektziel kann gezielt geklärt werden."}
        </p>
      </section>
      <section>
        <h3>Zu klären</h3>
        <p>
          Netzanschluss, Tragfähigkeit und zeitliche Verbrauchspassung bleiben
          fachlich offen.
        </p>
      </section>
      <section>
        <h3>Angaben ergänzen</h3>
        <p>
          {a.consumption === null
            ? "Jahresverbrauch noch unbekannt."
            : "Lastgang für die zeitliche Verbrauchspassung ergänzen."}
        </p>
        <Link
          href={`/standortcheck/${project.id}/${a.consumption === null ? 5 : 9}?return=review`}
        >
          Fehlende Angaben ansehen →
        </Link>
      </section>
    </div>
  );
}
export function Completeness({ project }: { project: Project }) {
  const c = coverage(project.answers);
  const count = c.requiredDocuments.filter((cat) =>
    project.documents.some((d) => d.category === cat && d.state === "ready"),
  ).length;
  return (
    <div className="completeness">
      <strong>
        {c.available.length} von {c.required.length} benötigten Angaben
        vorhanden
      </strong>
      <small>Anforderungsprofil demo-v1 · {project.answers.areaKind}</small>
      <p>
        {count} von {c.requiredDocuments.length} derzeit benötigten Unterlagen
        technisch verfügbar
      </p>
      <small>
        Dokumentverfügbarkeit und fachliche Prüfung sind getrennte Zustände.
      </small>
    </div>
  );
}
export function EnergyProfile({ project }: { project: Project }) {
  const a = project.answers;
  const hasAnnualExample = project.evidence.some((v) => v.id === "CONSUMPTION");
  return (
    <section id="energie" className="dossier-section">
      <p className="overline">ENERGIEPROFIL</p>
      <h2>Größenordnung mit klarer Datenbasis.</h2>
      <EnergyEvidence values={project.evidence} />
      <dl className="facts">
        {!hasAnnualExample && (
          <>
            <div>
              <dt>Jährlicher Stromverbrauch · {a.consumptionYear}</dt>
              <dd>
                {a.consumption === null
                  ? "Noch unbekannt"
                  : `${numberDE(a.consumption)} kWh/Jahr`}
              </dd>
              <small>
                Vom Nutzer angegeben ·{" "}
                {a.consumptionNature === "ESTIMATED"
                  ? "geschätzt"
                  : a.consumption === 0
                    ? "bestätigter Nullwert"
                    : a.consumption === null
                      ? "unbekannt"
                      : "Wert aus Abrechnung"}
              </small>
            </div>
            <div>
              <dt>Vorhandene jährliche Eigenerzeugung</dt>
              <dd>Noch unbekannt</dd>
              <small>
                Keine PV-Angabe beweist keine Eigenerzeugung aus anderen
                Quellen.
              </small>
            </div>
            <div>
              <dt>Zusätzliches Jahreserzeugungspotenzial</dt>
              <dd>Nicht verfügbar</dd>
              <small>Kein externer Solar-/Ertragsdienst angeschlossen.</small>
            </div>
          </>
        )}
        <div>
          <dt>Bestehende PV-Anlage</dt>
          <dd>
            {a.pv}
            {a.pv === "Ja" && a.pvPower !== null
              ? ` · ${numberDE(a.pvPower)} kWp`
              : ""}
          </dd>
          <small>Vom Nutzer angegeben · Leistung ist keine Jahresenergie</small>
        </div>
        <div>
          <dt>Bestehender Speicher</dt>
          <dd>
            {a.battery}
            {a.battery === "Ja" && a.batteryCapacity !== null
              ? ` · ${numberDE(a.batteryCapacity)} kWh`
              : ""}
            {a.batteryPower !== null ? ` / ${numberDE(a.batteryPower)} kW` : ""}
          </dd>
        </div>
        <div>
          <dt>Verbrauchsprofil</dt>
          <dd>{a.usageProfile}</dd>
        </div>
      </dl>
      <Notice>
        Eigenverbrauchsquote und Speichereignung sind noch nicht belastbar. Dazu
        fehlen kompatible Last- und Erzeugungsprofile.
      </Notice>
    </section>
  );
}
export function SiteDetails({ project }: { project: Project }) {
  const a = project.answers;
  return (
    <section id="standort" className="dossier-section">
      <h2>Standort und Objekt</h2>
      <SiteContext address={a.address} synthetic={project.synthetic} />
      <dl className="facts">
        <div>
          <dt>Objekttyp</dt>
          <dd>{a.buildingType ?? "Noch unbekannt"}</dd>
        </div>
        <div>
          <dt>
            Verfügbare {a.areaKind === "Dach" ? "Dachfläche" : "Freifläche"}
          </dt>
          <dd>
            {a.area === null ? "Noch unbekannt" : `${numberDE(a.area)} m²`}
          </dd>
          <small>
            Vom Nutzer angegeben ·{" "}
            {a.areaNature === "ESTIMATED" ? "geschätzt" : "ungeprüft"}
          </small>
        </div>
        {a.areaKind === "Dach" ? (
          <div>
            <dt>Dachzustand</dt>
            <dd>{a.roofCondition}</dd>
            <small>Nutzerauskunft · kein statischer Nachweis</small>
          </div>
        ) : (
          <div>
            <dt>Aktuelle Nutzung</dt>
            <dd>{a.currentUse || "Noch unbekannt"}</dd>
          </div>
        )}
        <div>
          <dt>Rolle / Berechtigung</dt>
          <dd>
            {a.role ?? "Noch unbekannt"} · {a.authority}
          </dd>
          <small>Vom Nutzer angegeben · nicht fachlich verifiziert</small>
        </div>
      </dl>
    </section>
  );
}
export function Documents({
  project,
  partner = false,
}: {
  project: Project;
  partner?: boolean;
}) {
  const docs = project.documents.filter((d) => d.state !== "removed");
  return (
    <section id="dokumente" className="dossier-section">
      <h2>Dokumente</h2>
      {!docs.length ? (
        <p>
          Keine Dateien verfügbar. Verfügbarkeit laut Nutzer:{" "}
          {project.answers.availableDocuments.join(", ") ||
            "Noch keine Unterlagen"}
          .
        </p>
      ) : (
        <ul className="document-list">
          {docs.map((d) => (
            <li key={d.id}>
              <div>
                <a
                  href={`/api/${partner ? "partner/projects" : "projects"}/${project.id}/documents/${d.id}`}
                >
                  {d.name}
                </a>
                <p>
                  {d.category} · {numberDE(d.size / 1e6, 2)} MB · Version{" "}
                  {d.version}
                </p>
                <small>
                  {d.state === "ready"
                    ? "Technisch verfügbar"
                    : "Verarbeitung offen"}{" "}
                  ·{" "}
                  {d.reviewState === "REVIEWED"
                    ? "fachlich geprüft"
                    : "nicht fachlich geprüft"}{" "}
                  · {dateDE(d.createdAt)}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
export function History({ project }: { project: Project }) {
  return (
    <section id="verlauf" className="dossier-section">
      <h2>Prozess / Verlauf</h2>
      <ol className="history">
        {project.events.map((e) => (
          <li key={e.eventId}>
            <strong>{e.action}</strong>
            <small>
              {e.actorId} · {dateDE(e.occurredAt)} · Europe/Berlin
            </small>
            <p>
              {e.from} → {e.to} · Eingabeversion {e.inputVersion}
            </p>
            {e.note && (
              <p>
                {e.visibility === "INTERNAL"
                  ? "Interne Notiz"
                  : "Nachricht an Projektkontakt"}
                : {e.note}
              </p>
            )}
            <details>
              <summary>Entscheidungsgrundlage ansehen</summary>
              <p>Auftrag {e.requestId}</p>
              <p>
                Score: {e.scoreSnapshot?.displayScore ?? "Kein Gesamtscore"} ·{" "}
                {e.scoreSnapshot?.modelVersion ?? "Kein Modell"} ·{" "}
                {e.scoreSnapshot?.assessmentId}
              </p>
              {e.rejection && (
                <p>
                  Primärgrund: {e.rejection.primary} · {e.rejection.certainty}
                  <br />
                  {e.rejection.note}
                </p>
              )}
              <ul>
                {e.scoreSnapshot?.factors.map((f) => (
                  <li key={f.factorId}>
                    {f.label}: {f.contribution ?? "unbekannt"} / {f.maxPoints} ·{" "}
                    {f.basisState}
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
