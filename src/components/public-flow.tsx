"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Project, type Receipt } from "@/domain/model";
import { dateDE, numberDE, readableError } from "@/domain/rules";
import { api, ApiError } from "./client-api";
import { Button, Checks, ErrorNotice, Field, Notice } from "./ui";
import {
  Completeness,
  Documents,
  EnergyProfile,
  Factors,
  Findings,
  ScoreSummary,
  SiteDetails,
  History,
} from "./project-details";
import { SiteContext } from "./site-context";
export function Review({ project }: { project: Project }) {
  const a = project.answers;
  return (
    <main id="main" className="wrap page">
      <p className="overline">STANDORTCHECK / ZUSAMMENFASSUNG</p>
      <h1>Ihre Angaben auf einen Blick.</h1>
      <p>Prüfen Sie Ihre Angaben, bevor Sie das Demo-Regelmodell starten.</p>
      <div className="review-grid">
        <div>
          {[
            [
              "Standort",
              1,
              [
                a.address,
                a.locationConfirmed
                  ? "Manuell bestätigt · nicht geocodiert"
                  : "Bestätigung offen",
              ],
            ],
            [
              "Objekt und Berechtigung",
              3,
              [
                a.buildingType ?? "Gebäudetyp offen",
                `${a.areaKind}: ${numberDE(a.area)}${a.area === null ? "" : " m²"}`,
                `${a.role ?? "Rolle offen"} · Berechtigung: ${a.authority}`,
                a.areaKind === "Dach"
                  ? `Dachzustand: ${a.roofCondition}`
                  : `Nutzung: ${a.currentUse || "Noch unbekannt"}`,
              ],
            ],
            [
              "Energie",
              5,
              [
                `${a.consumption === null ? "Verbrauch noch unbekannt" : numberDE(a.consumption) + " kWh/Jahr"} · ${a.consumptionYear}`,
                `PV: ${a.pv} · Speicher: ${a.battery}`,
                `Verbrauchsprofil: ${a.usageProfile}`,
              ],
            ],
            ["Ziel", 8, [a.goal ?? "Hauptziel offen", a.description]],
            [
              "Unterlagen",
              9,
              [
                a.noDocuments
                  ? "Noch keine Unterlagen verfügbar"
                  : a.availableDocuments.join(", ") || "Verfügbarkeit offen",
                `${project.documents.filter((d) => d.state === "ready").length} Dateien technisch verfügbar · nicht fachlich geprüft`,
              ],
            ],
          ].map(([title, step, lines]) => (
            <section className="review-section" key={String(title)}>
              <div className="section-heading">
                <h2>{String(title)}</h2>
                <Link
                  href={`/standortcheck/${project.id}/${step}?return=review`}
                >
                  {title} bearbeiten
                </Link>
              </div>
              {(lines as string[]).filter(Boolean).map((l) => (
                <p key={l}>{l}</p>
              ))}
            </section>
          ))}
          <Notice>
            Die Qualifizierung ordnet Ihre Angaben nach dem synthetischen Modell
            demo-v1 ein. Sie ersetzt keine technische Planung.
          </Notice>
          <Link
            href={`/standortcheck/${project.id}/analyse`}
            className="button primary"
          >
            Projekt qualifizieren →
          </Link>
        </div>
        <aside>
          <SiteContext address={a.address} synthetic={project.synthetic} />
          <Completeness project={project} />
        </aside>
      </div>
    </main>
  );
}
export function Analysis({ initial }: { initial: Project }) {
  const [project, setProject] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const launched = useRef(false);
  const router = useRouter();
  async function run() {
    setBusy(true);
    setError("");
    try {
      const p = await api<Project>(
        `/api/projects/${initial.id}/qualify`,
        "POST",
        { revision: project.revision },
      );
      setProject(p);
      if (p.scoreJobState === "FAILED") {
        setError(
          "Bewertung derzeit nicht verfügbar. Angaben bleiben erhalten.",
        );
        setBusy(false);
      } else router.replace(`/projekte/${initial.id}/ergebnis`);
    } catch (e) {
      setBusy(false);
      setError(readableError(e));
    }
  }
  useEffect(() => {
    if (!launched.current) {
      launched.current = true;
      run();
    }
  }, []);
  return (
    <main id="main" className="wrap page">
      <div className="review-grid">
        <section>
          <p className="overline">PROJEKTQUALIFIZIERUNG / DEMO</p>
          <h1>Ihre Projektqualifizierung wird erstellt.</h1>
          <p className="lead">
            Wir ordnen die vorhandenen Angaben ein und kennzeichnen offene
            Punkte.
          </p>
          <div role="status" aria-live="polite">
            <p>
              {busy
                ? "Qualifizierungsauftrag wird ausgeführt."
                : "Qualifizierungsauftrag beendet."}
            </p>
            <ol className="analysis-list">
              {(project.analysisRows.length
                ? project.analysisRows
                : [
                    { label: "Standort zuordnen", state: "waiting" },
                    { label: "Objektdaten prüfen", state: "waiting" },
                    { label: "Energiedaten einordnen", state: "waiting" },
                    {
                      label: "Projektqualifizierung erstellen",
                      state: "waiting",
                    },
                  ]
              ).map((r) => (
                <li key={r.label}>
                  <span>{r.label}</span>
                  <strong>
                    {
                      {
                        waiting: "Wartet auf Auftrag",
                        running: "Läuft",
                        complete: "Abgeschlossen",
                        open: "Angaben offen",
                        error: "Dienstfehler",
                      }[r.state]
                    }
                  </strong>
                </li>
              ))}
            </ol>
          </div>
          <p className="meta">
            Externe Solardaten noch nicht verfügbar. Keine automatische
            Gebäude-, Statik- oder Dokumentprüfung.
          </p>
          <ErrorNotice message={error} />
          {!busy && <Button onClick={run}>Erneut versuchen</Button>}
          <Link
            className="text-link"
            href={`/standortcheck/${project.id}/zusammenfassung`}
          >
            Angaben ansehen
          </Link>
        </section>
        <SiteContext
          address={initial.answers.address}
          synthetic={initial.synthetic}
        />
      </div>
    </main>
  );
}
export function Result({
  project,
  canSubmit,
  example = false,
}: {
  project: Project;
  canSubmit: boolean;
  example?: boolean;
}) {
  const s = project.score;
  return (
    <main id="main" className="wrap page result-page">
      <p className="overline">
        PROJECT GATEWAY / {example ? "SYNTHETISCHES UI-BEISPIEL" : project.id}
      </p>
      <h1>Ihre Projektvor&shy;qualifizierung</h1>
      <p className="lead">{project.answers.address}</p>
      <div className="result-grid">
        <section>
          <ScoreSummary project={project} />
          <Completeness project={project} />
          <div className="result-actions">
            {example ? (
              <Link className="button primary" href="/">
                Eigenen Standort erfassen →
              </Link>
            ) : project.receipt ? (
              <Link
                className="button primary"
                href={`/projekte/${project.id}/eingereicht`}
              >
                Übermittlungsbeleg ansehen →
              </Link>
            ) : s?.state === "STALE" || s?.state === "ERROR" ? (
              <Link
                className="button primary"
                href={`/standortcheck/${project.id}/analyse`}
              >
                Bewertung aktualisieren →
              </Link>
            ) : canSubmit ? (
              <Link
                className="button primary"
                href={`/projekte/${project.id}/einreichen`}
              >
                Zur fachlichen Prüfung übermitteln →
              </Link>
            ) : (
              <Link
                className="button primary"
                href={`/standortcheck/${project.id}/${project.blockers.length ? 3 : project.answers.consumption === null ? 5 : 3}?return=review`}
              >
                {project.blockers.length
                  ? "Dachzustand klären"
                  : "Angaben ergänzen"}{" "}
                →
              </Link>
            )}
            {!example && !project.receipt && (
              <Link href={`/standortcheck/${project.id}/zusammenfassung`}>
                Angaben bearbeiten
              </Link>
            )}
          </div>
        </section>
        <aside className="result-context">
          <SiteContext
            address={project.answers.address}
            synthetic={project.synthetic}
          />
          <p className="meta">
            {project.answers.buildingType} · Leistung offen
          </p>
        </aside>
      </div>
      {!example && <Findings project={project} />}
      <Factors project={project} editable={!example && !project.receipt} />
      <EnergyProfile project={project} />
      <SiteDetails project={project} />
      {!example && (
        <>
          <Documents project={project} />
          {project.receipt && (
            <>
              <ContactResponses project={project} />
              <History project={project} />
            </>
          )}
        </>
      )}
    </main>
  );
}
export function Submission({
  project,
  recipient,
  allowed,
}: {
  project: Project;
  recipient: string;
  allowed: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [selected, setSelected] = useState(
    project.documents.filter((d) => d.state === "ready").map((d) => d.id),
  );
  const [requestId] = useState(() => crypto.randomUUID());
  const router = useRouter();
  const payloadRef = useRef<unknown>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(e.currentTarget);
    const payload = {
      requestId,
      revision: project.revision,
      contact: {
        organization: data.get("organization"),
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        phone: data.get("phone"),
      },
      consent,
      comment: data.get("comment"),
      documentIds: selected,
    };
    if (!payloadRef.current) payloadRef.current = payload;
    try {
      await api<Receipt>(
        `/api/projects/${project.id}/submit`,
        "POST",
        payloadRef.current,
      );
      router.push(`/projekte/${project.id}/eingereicht`);
    } catch (e) {
      setError(readableError(e));
      if (e instanceof ApiError && e.status !== 0) payloadRef.current = null;
      setPending(false);
    }
  }
  return (
    <main id="main" className="wrap page">
      <p className="overline">PROJEKTÜBERMITTLUNG / {project.id}</p>
      <h1>Ihr Projekt zur fachlichen Prüfung einreichen.</h1>
      <p className="lead">
        Prüfen Sie den Empfänger und die Angaben, die Sie übermitteln möchten.
      </p>
      <div className="review-grid">
        <section>
          <div className="review-section">
            <h2>Projekt und Empfänger</h2>
            <p>{project.answers.address}</p>
            <strong>
              {recipient ||
                "Für dieses Projekt ist noch kein Empfänger hinterlegt."}
            </strong>
            <p>
              Expliziter Demo-Partnerkontext. Es erfolgt keine echte Übertragung
              an ein Unternehmen und kein E-Mail-Versand.
            </p>
          </div>
          <details className="review-section">
            <summary>Enthaltene Projektangaben ansehen</summary>
            <p>
              Standort, Objekt und Berechtigung, Energieprofil, Projektziel,
              Score mit Erklärung und offene Angaben. Rolle:{" "}
              {project.answers.role}.
            </p>
            <p>
              Fläche: {numberDE(project.answers.area)} m² · Verbrauch:{" "}
              {numberDE(project.answers.consumption)} kWh/Jahr · Ziel:{" "}
              {project.answers.goal}
            </p>
          </details>
          <h2>Enthaltene Dokumente</h2>
          {project.documents.filter((d) => d.state === "ready").length ? (
            project.documents
              .filter((d) => d.state === "ready")
              .map((d) => (
                <label className="option" key={d.id}>
                  <input
                    type="checkbox"
                    checked={selected.includes(d.id)}
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? [...selected, d.id]
                          : selected.filter((id) => id !== d.id),
                      )
                    }
                  />
                  <span>
                    {d.name}
                    <small>
                      {d.category} · Version {d.version} · technisch verfügbar,
                      nicht fachlich geprüft
                    </small>
                  </span>
                </label>
              ))
          ) : (
            <p>
              Keine Dateien enthalten. Fehlende Unterlagen bleiben für den
              Empfänger sichtbar.
            </p>
          )}
          <ErrorNotice message={error} />
          <form onSubmit={submit}>
            <h2>Ihr Projektkontakt</h2>
            <Field
              label="Firma / Organisation"
              name="organization"
              autoComplete="organization"
              required
              minLength={2}
              maxLength={160}
            />
            <div className="field-pair">
              <Field
                label="Vorname"
                name="firstName"
                autoComplete="given-name"
                required
                maxLength={80}
              />
              <Field
                label="Nachname"
                name="lastName"
                autoComplete="family-name"
                required
                maxLength={80}
              />
            </div>
            <Field
              label="Geschäftliche E-Mail"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
            <Field
              label="Telefon (optional)"
              name="phone"
              type="tel"
              autoComplete="tel"
            />
            <label className="field">
              Nachricht (optional)
              <textarea name="comment" maxLength={2000} />
              <small>Maximal 2.000 Zeichen.</small>
            </label>
            <label className="check-label consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />
              Ich möchte die angezeigten Projektangaben und ausgewählten
              Unterlagen an {recipient} zur fachlichen Prüfung übermitteln.
            </label>
            <p className="meta">
              In dieser Demo wird die Freigabe lokal simuliert.{" "}
              <Link href="/datenschutz">Datenschutzhinweise</Link>
            </p>
            {!allowed && (
              <Notice>
                Bitte zunächst die entscheidungsrelevanten Angaben oder Blocker
                klären.
              </Notice>
            )}
            <Button
              type="submit"
              pending={pending}
              disabled={!allowed || !recipient}
            >
              {pending ? "Projekt wird eingereicht …" : "Projekt einreichen"}
            </Button>
            {error && (
              <p className="meta">
                Ein unbekannter Sendestatus wird mit derselben Auftrags-ID
                abgeglichen: {requestId}. Wiederholen erzeugt keine zweite
                Einreichung.
              </p>
            )}
          </form>
        </section>
        <aside>
          <ScoreSummary project={project} compact />
          <Completeness project={project} />
        </aside>
      </div>
    </main>
  );
}
export function ReceiptView({ project }: { project: Project }) {
  const receipt = project.receipt;
  if (!receipt)
    return (
      <main id="main" className="wrap page">
        <h1>Noch keine Einreichung bestätigt.</h1>
        <Link href={`/projekte/${project.id}/einreichen`}>Zur Einreichung</Link>
      </main>
    );
  return (
    <main id="main" className="wrap page receipt">
      <p className="overline">BESTÄTIGTER DEMO-BELEG</p>
      <h1>Übermittlung simuliert</h1>
      <p className="lead">
        Ihre Projektanfrage wurde im lokalen Demo-Partnerkontext freigegeben.
      </p>
      <dl className="facts">
        <div>
          <dt>Projekt-ID</dt>
          <dd>{project.id}</dd>
        </div>
        <div>
          <dt>Empfänger</dt>
          <dd>{receipt.recipient}</dd>
        </div>
        <div>
          <dt>Zeitpunkt</dt>
          <dd>{dateDE(receipt.submittedAt)} · Europe/Berlin</dd>
        </div>
        <div>
          <dt>Eingereichte Version</dt>
          <dd>{receipt.inputVersion}</dd>
        </div>
        <div>
          <dt>Enthaltener Umfang</dt>
          <dd>
            {receipt.scope.join(", ")} · {receipt.documentIds.length} Dateien
          </dd>
        </div>
        <div>
          <dt>Auftrags-ID</dt>
          <dd className="mono">{receipt.requestId}</dd>
        </div>
      </dl>
      <Notice>
        Die Demo löst keine echte E-Mail, Partnerübertragung oder Beauftragung
        aus. Es gibt keine zugesagte Annahme oder Bearbeitungsfrist.
      </Notice>
      <div className="actions">
        <Link
          className="button primary"
          href={`/projekte/${project.id}/ergebnis`}
        >
          Projektübersicht ansehen →
        </Link>
        <Link
          className="button secondary"
          href="/"
          onClick={() => sessionStorage.removeItem("gateway-draft")}
        >
          Weiteren Standort prüfen
        </Link>
      </div>
    </main>
  );
}
export function ContactResponses({ project }: { project: Project }) {
  const [current, setCurrent] = useState(project);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <section className="dossier-section">
      <h2>Rückfragen des Partners</h2>
      <ErrorNotice message={error} />
      {!current.infoRequests.length ? (
        <p>Noch keine Rückfragen.</p>
      ) : (
        current.infoRequests.map((r) => (
          <form
            key={r.id}
            className="review-section"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              setPending(true);
              try {
                const p = await api<Project>(
                  `/api/projects/${project.id}/actions`,
                  "POST",
                  {
                    requestId: crypto.randomUUID(),
                    revision: current.revision,
                    action: "respond",
                    infoRequestId: r.id,
                    items: form.getAll("items"),
                    note: form.get("note"),
                  },
                );
                setCurrent(p);
              } catch (e) {
                setError(readableError(e));
              } finally {
                setPending(false);
              }
            }}
          >
            <h3>{r.message}</h3>
            <p>An {r.recipient} · Übermittlung simuliert</p>
            {r.items.map((item) => (
              <label className="option" key={item}>
                <input
                  name="items"
                  type="checkbox"
                  value={item}
                  disabled={r.answered.includes(item)}
                />
                {item} ·{" "}
                {r.answered.includes(item)
                  ? "Antwort eingegangen"
                  : "Antwort offen"}
              </label>
            ))}
            <label className="field">
              Antwort zu den ausgewählten Punkten
              <textarea name="note" required maxLength={2000} />
            </label>
            <Button pending={pending}>Antwort speichern</Button>
            <small>
              Eine Antwort ist noch keine fachliche Bestätigung. Nicht
              beantwortete Punkte bleiben offen.
            </small>
          </form>
        ))
      )}
    </section>
  );
}
