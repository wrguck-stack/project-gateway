"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search, ArrowRight } from "@carbon/icons-react";
import {
  type Project,
  type Status,
  statuses,
  statusLabels,
  classLabels,
  reasonLabels,
  reasons,
  buildingTypes,
  categories,
} from "@/domain/model";
import {
  coverage,
  dateDE,
  numberDE,
  pipeline,
  readableError,
  transitionAllowed,
} from "@/domain/rules";
import { api, ApiError } from "./client-api";
import {
  Button,
  Checks,
  ErrorNotice,
  Field,
  Modal,
  Notice,
  SelectField,
} from "./ui";
import {
  Completeness,
  Documents,
  EnergyProfile,
  Factors,
  History,
  ScoreSummary,
  SiteDetails,
} from "./project-details";
export function PartnerLogin() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <main className="wrap page login-page" id="main">
      <p className="overline">PARTNERARBEITSPLATZ</p>
      <h1>Aus Angaben werden Projekte.</h1>
      <p className="lead">
        Projektanfragen sichten, offene Punkte klären und die nächste fachliche
        Entscheidung dokumentieren.
      </p>
      <div className="login-panel">
        <h2>Gateway Demopartner</h2>
        <p>
          Offen zugänglicher Demo-Arbeitsplatz mit synthetischen Projekten. Die
          Sitzung simuliert die Partnerrolle; es ist keine produktive Anmeldung.
        </p>
        <ErrorNotice message={error} />
        <Button
          pending={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await api("/api/session", "POST", { role: "PARTNER" });
              router.push("/partner/projekte");
            } catch (e) {
              setError(readableError(e));
              setBusy(false);
            }
          }}
        >
          Demo-Arbeitsplatz öffnen
        </Button>
      </div>
    </main>
  );
}
const views = [
  "Alle Projekte",
  "Neue Projekte",
  "Hohe Priorität",
  "Informationen fehlen",
  "In Prüfung",
  "Übernommen",
  "Abgelehnt",
];
const profiles: Record<string, string> = {
  COMMERCIAL_ROOF_PV: "Gewerbedach-PV",
  GROUND_PV: "Freiflächenprojekt",
  PV_EXTENSION: "PV-Erweiterung",
  STORAGE: "Speicherprojekt",
};
type Filters = {
  view: string;
  status: string;
  score: string;
  type: string;
  building: string;
  region: string;
  min: string;
  max: string;
  unit: string;
  completeness: string;
  assignee: string;
  due: string;
  query: string;
};
const defaults: Filters = {
  view: "Alle Projekte",
  status: "",
  score: "",
  type: "",
  building: "",
  region: "",
  min: "",
  max: "",
  unit: "m²",
  completeness: "",
  assignee: "",
  due: "",
  query: "",
};
function readFilters(params: URLSearchParams) {
  const f = { ...defaults };
  for (const k of Object.keys(f) as (keyof Filters)[])
    if (params.has(k)) f[k] = params.get(k)!.slice(0, 240);
  if (!views.includes(f.view)) f.view = "Alle Projekte";
  if (f.status && !statuses.includes(f.status as Status)) f.status = "";
  return f;
}
function matches(p: Project, f: Filters) {
  const a = p.answers;
  const c = coverage(a);
  const missing = c.available.length < c.required.length;
  const score = p.score?.displayScore;
  const high = score !== null && score !== undefined && score >= 80;
  if (f.view === "Neue Projekte" && p.status !== "QUALIFIED") return false;
  if (f.view === "Hohe Priorität" && !high) return false;
  if (
    f.view === "Informationen fehlen" &&
    !missing &&
    p.status !== "INFO_REQUESTED"
  )
    return false;
  if (f.view === "In Prüfung" && p.status !== "PARTNER_REVIEW") return false;
  if (f.view === "Übernommen" && p.status !== "ACCEPTED") return false;
  if (f.view === "Abgelehnt" && p.status !== "REJECTED") return false;
  if (f.status && p.status !== f.status) return false;
  if (f.score && p.score?.class !== f.score) return false;
  if (f.type && p.score?.profileId !== f.type) return false;
  if (f.building && a.buildingType !== f.building) return false;
  if (f.region && p.region !== f.region) return false;
  if ((f.min || f.max) && (f.unit !== "m²" || a.area === null)) return false;
  if (f.min && a.area !== null && a.area < Number(f.min)) return false;
  if (f.max && a.area !== null && a.area > Number(f.max)) return false;
  if (f.completeness === "Vollständig" && missing) return false;
  if (f.completeness === "Angaben fehlen" && !missing) return false;
  if (f.assignee === "Mir zugewiesen" && p.assignee !== "demo-reviewer")
    return false;
  if (f.assignee === "Nicht zugewiesen" && p.assignee !== null) return false;
  if (
    f.due === "Überfällig" &&
    (!p.nextAction?.open ||
      !p.nextAction.dueAt ||
      p.nextAction.dueAt >= new Date().toISOString())
  )
    return false;
  if (f.due === "Ohne Frist" && p.nextAction?.dueAt) return false;
  if (
    f.query &&
    !`${p.id} ${a.address}`.toLowerCase().includes(f.query.toLowerCase())
  )
    return false;
  return true;
}
function priority(p: Project) {
  if (
    p.nextAction?.open &&
    p.nextAction.dueAt &&
    Date.parse(p.nextAction.dueAt) < Date.now() &&
    p.assignee === "demo-reviewer"
  )
    return 0;
  if (p.nextAction?.label === "Antwort prüfen") return 1;
  if (p.status === "QUALIFIED" && (p.score?.displayScore ?? 0) >= 80) return 2;
  if (p.nextAction?.open) return 3;
  return 4;
}
export function Workspace({ initial }: { initial: Project[] }) {
  const [projects, setProjects] = useState(initial);
  const [filterOpen, setFilterOpen] = useState(false);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const params = useSearchParams();
  const f = readFilters(new URLSearchParams(params.toString()));
  const router = useRouter();
  const [draftFilters, setDraftFilters] = useState(f);
  const [search, setSearch] = useState(f.query);
  const [asOf, setAsOf] = useState(() => new Date().toISOString());
  const sorted = useMemo(
    () =>
      [...projects].sort(
        (a, b) =>
          priority(a) - priority(b) ||
          (a.nextAction?.dueAt ?? "9999").localeCompare(
            b.nextAction?.dueAt ?? "9999",
          ) ||
          a.createdAt.localeCompare(b.createdAt) ||
          a.id.localeCompare(b.id),
      ),
    [projects],
  );
  const filtered = sorted.filter((p) => matches(p, f));
  const page = Math.min(
    Math.max(1, Number(params.get("page")) || 1),
    Math.max(1, Math.ceil(filtered.length / 50)),
  );
  const rows = filtered.slice((page - 1) * 50, page * 50);
  const selected =
    filtered.find((p) => p.id === params.get("selected")) ?? rows[0];
  const query = params.toString();
  function navigate(changes: Record<string, string>, resetPage = true) {
    const q = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (!v || v === (defaults as Record<string, string>)[k]) q.delete(k);
      else q.set(k, v);
    }
    if (resetPage) q.delete("page");
    router.replace(`/partner/projekte${q.size ? "?" + q.toString() : ""}`, {
      scroll: false,
    });
  }
  const active = Object.entries(f).filter(
    ([k, v]) => v && v !== (defaults as Record<string, string>)[k],
  );
  return (
    <main id="main" className="wrap page partner-page">
      <div className="section-heading">
        <div>
          <p className="overline">PARTNERARBEITSPLATZ</p>
          <h1>Welche Projekte sollte ich jetzt bearbeiten?</h1>
        </div>
        <Button
          variant="secondary"
          pending={refreshing}
          onClick={async () => {
            setRefreshing(true);
            try {
              setProjects(await api<Project[]>("/api/partner/projects"));
              setAsOf(new Date().toISOString());
              setError("");
            } catch (e) {
              setError(readableError(e));
            } finally {
              setRefreshing(false);
            }
          }}
        >
          Snapshot aktualisieren
        </Button>
      </div>
      <div className="work-meta">
        <span>Nächste Aktion bestimmt die Reihenfolge.</span>
        <span>
          {projects.length} freigegebene Demo-Projekte · Stand {dateDE(asOf)}
        </span>
      </div>
      <ErrorNotice message={error} />
      <nav className="view-tabs" aria-label="Arbeitsansichten">
        {views.map((view) => (
          <button
            key={view}
            className={f.view === view ? "active" : ""}
            onClick={() => navigate({ view, selected: "" })}
          >
            {view}
          </button>
        ))}
      </nav>
      <div className="queue-tools">
        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ query: search, selected: "" });
          }}
        >
          <label htmlFor="project-search" className="sr-only">
            Projekt-ID oder Standort suchen
          </label>
          <Search size={20} />
          <input
            id="project-search"
            placeholder="Projekt-ID oder Standort suchen"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxLength={240}
          />
          <Button variant="text" type="submit">
            Suchen
          </Button>
        </form>
        <Button
          variant="secondary"
          onClick={() => {
            setDraftFilters(f);
            setFilterOpen(true);
          }}
        >
          <Filter size={20} />
          Filter {active.length > 0 ? `(${active.length})` : ""}
        </Button>
      </div>
      {active.length > 0 && (
        <div className="active-filters" aria-label="Aktive Filter">
          {active.map(([k, v]) => (
            <button
              key={k}
              onClick={() => navigate({ [k]: "", selected: "" })}
              aria-label={`Filter ${v} entfernen`}
            >
              {v} ×
            </button>
          ))}
          <Button
            variant="text"
            onClick={() => {
              router.replace("/partner/projekte");
              setSearch("");
            }}
          >
            Filter zurücksetzen
          </Button>
        </div>
      )}
      <div className="workspace-grid">
        <section aria-label="Projektarbeitsliste">
          <p className="meta">
            {filtered.length
              ? `${(page - 1) * 50 + 1}–${Math.min(page * 50, filtered.length)}`
              : "0"}{" "}
            von {filtered.length} Projekten · 50 je Seite
          </p>
          <div className="work-queue">
            {rows.length ? (
              rows.map((p) => (
                <article
                  key={p.id}
                  className={`queue-row ${selected?.id === p.id ? "selected" : ""}`}
                >
                  <div className="queue-text">
                    <p className="next-label">
                      {p.nextAction?.label ??
                        "Status und nächsten Schritt ansehen"}
                    </p>
                    <h2>
                      <Link
                        className="queue-mobile-link"
                        href={`/partner/projekte/${p.id}?back=${encodeURIComponent(query)}`}
                      >
                        {p.answers.buildingType ?? "Projekt"} ·{" "}
                        {p.answers.address.split(" · ").pop()}
                      </Link>
                      <button
                        className="queue-desktop-button"
                        onClick={() => navigate({ selected: p.id }, false)}
                      >
                        {p.answers.buildingType ?? "Projekt"} ·{" "}
                        {p.answers.address.split(" · ").pop()}
                      </button>
                    </h2>
                    <p className="meta">
                      {p.id} ·{" "}
                      {profiles[p.score?.profileId ?? ""] ?? "Profil offen"}
                    </p>
                    <p className="meta">
                      {p.answers.area === null
                        ? "Fläche offen"
                        : `ca. ${numberDE(p.answers.area)} m² · geschätzt`}{" "}
                      · Leistung offen
                    </p>
                    <p className="queue-status">
                      {statusLabels[p.status]}
                      {p.blockers.length > 0 ? " · Bestätigter Blocker" : ""}
                    </p>
                  </div>
                  <div className="queue-score">
                    <strong>{p.score?.displayScore ?? "—"}</strong>
                    <small>
                      {p.score?.state === "PARTIAL"
                        ? "Teilbewertung"
                        : p.score?.state === "STALE"
                          ? "Veraltet"
                          : p.score?.state === "ERROR"
                            ? "Dienstfehler"
                            : p.score?.state === "NOT_READY"
                              ? "Nicht bewertbar"
                              : "Demo-Score"}
                    </small>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty">
                <h2>Keine Projekte für diese Auswahl.</h2>
                <p>
                  Setzen Sie die Filter zurück, um den freigegebenen Bestand zu
                  sehen.
                </p>
              </div>
            )}
          </div>
          <div className="pagination">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() =>
                navigate({ page: String(page - 1), selected: "" }, false)
              }
            >
              Zurück
            </Button>
            <span>
              Seite {page} / {Math.max(1, Math.ceil(filtered.length / 50))}
            </span>
            <Button
              variant="secondary"
              disabled={page * 50 >= filtered.length}
              onClick={() =>
                navigate({ page: String(page + 1), selected: "" }, false)
              }
            >
              Weiter
            </Button>
          </div>
        </section>
        <div className="workspace-dossier">
          {selected && (
            <Dossier
              project={selected}
              compact
              back={query}
              onUpdate={(p) =>
                setProjects((list) =>
                  list.map((old) => (old.id === p.id ? p : old)),
                )
              }
            />
          )}
        </div>
      </div>
      {filterOpen && (
        <Modal title="Projekte filtern" onClose={() => setFilterOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ ...draftFilters, selected: "" });
              setFilterOpen(false);
            }}
          >
            <div className="filter-fields">
              <div className="field">
                <label htmlFor="status-filter">Status</label>
                <select
                  id="status-filter"
                  value={draftFilters.status}
                  onChange={(e) =>
                    setDraftFilters({ ...draftFilters, status: e.target.value })
                  }
                >
                  <option value="">Alle Status</option>
                  {statuses.map((s) => (
                    <option value={s} key={s}>
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="score-filter">Scoreklasse</label>
                <select
                  id="score-filter"
                  value={draftFilters.score}
                  onChange={(e) =>
                    setDraftFilters({ ...draftFilters, score: e.target.value })
                  }
                >
                  <option value="">Alle Klassen</option>
                  {Object.entries(classLabels).map(([id, label]) => (
                    <option value={id} key={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="type-filter">Projektart</label>
                <select
                  id="type-filter"
                  value={draftFilters.type}
                  onChange={(e) =>
                    setDraftFilters({ ...draftFilters, type: e.target.value })
                  }
                >
                  <option value="">Alle Projektarten</option>
                  {Object.entries(profiles).map(([id, label]) => (
                    <option value={id} key={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              {[
                ["Gebäudetyp", "building", ["", ...buildingTypes]],
                ["Region", "region", ["", "Baden-Württemberg"]],
                ["Einheit der Größe", "unit", ["m²", "kWp", "kWh"]],
                [
                  "Vollständigkeit",
                  "completeness",
                  ["", "Vollständig", "Angaben fehlen"],
                ],
                [
                  "Verantwortlicher",
                  "assignee",
                  ["", "Mir zugewiesen", "Nicht zugewiesen"],
                ],
                ["Fälligkeit", "due", ["", "Überfällig", "Ohne Frist"]],
              ].map(([label, key, options]) => (
                <SelectField
                  key={String(key)}
                  label={String(label)}
                  value={draftFilters[key as keyof Filters]}
                  options={options as string[]}
                  onChange={(v) =>
                    setDraftFilters({ ...draftFilters, [String(key)]: v })
                  }
                />
              ))}
              <Field
                label={`Mindestgröße (${draftFilters.unit})`}
                type="number"
                min={0}
                value={draftFilters.min}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, min: e.target.value })
                }
              />
              <Field
                label={`Maximalgröße (${draftFilters.unit})`}
                type="number"
                min={0}
                value={draftFilters.max}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, max: e.target.value })
                }
              />
            </div>
            <p className="meta">
              Fläche, PV-Leistung und Speicherkapazität werden getrennt
              gefiltert. Im Demo-Bestand ist nur Fläche belegt.
            </p>
            <div className="actions">
              <Button type="submit">Filter anwenden</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setDraftFilters({ ...defaults })}
              >
                Zurücksetzen
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  );
}
export function Dossier({
  project,
  compact = false,
  back = "",
  onUpdate,
}: {
  project: Project;
  compact?: boolean;
  back?: string;
  onUpdate?: (p: Project) => void;
}) {
  const [local, setLocal] = useState<Project | null>(null);
  const p =
    local?.id === project.id && local.revision >= project.revision
      ? local
      : project;
  const [decision, setDecision] = useState(false);
  return (
    <article className={`dossier ${compact ? "compact-dossier" : ""}`}>
      <header className="dossier-header">
        <p className="overline">
          {p.id} / {statusLabels[p.status]}
        </p>
        <h1>
          {p.answers.buildingType ?? "Projekt"} ·{" "}
          {p.answers.address.split(" · ").pop()}
        </h1>
        <p>{p.answers.address}</p>
        {compact && (
          <Link
            className="text-link"
            href={`/partner/projekte/${p.id}?back=${encodeURIComponent(back)}`}
          >
            Vollständige Projektakte öffnen <ArrowRight size={20} />
          </Link>
        )}
      </header>
      <div className="dossier-body">
        <div>
          <ScoreSummary project={p} compact />
          <div className="next-action">
            <span className="overline">NÄCHSTE AKTION</span>
            <h3>
              {p.nextAction?.label ?? "Status und nächsten Schritt ansehen"}
            </h3>
            <Button onClick={() => setDecision(true)}>Entscheidung</Button>
          </div>
          <Completeness project={p} />
          <nav className="section-nav" aria-label="Aktenabschnitte">
            {[
              "Standort",
              "Energie",
              "Ziel",
              "Score",
              "Dokumente",
              "Verlauf",
            ].map((s) => (
              <a key={s} href={`#${s.toLowerCase()}`}>
                {s}
              </a>
            ))}
          </nav>
          {!compact && <SiteDetails project={p} />}
          <EnergyProfile project={p} />
          <section id="ziel" className="dossier-section">
            <h2>Projektziel</h2>
            <p className="lead">{p.answers.goal ?? "Noch offen"}</p>
            <p>{p.answers.description || "Keine ergänzende Beschreibung."}</p>
            <p>
              Kontakt: {p.contact?.firstName} {p.contact?.lastName} ·{" "}
              {p.contact?.organization}
            </p>
            <p>{p.contact?.email}</p>
          </section>
          <Factors project={p} editable={false} />
          <Documents project={p} partner />
          {p.infoRequests.length > 0 && (
            <section className="dossier-section">
              <h2>Offene Anforderungen</h2>
              {p.infoRequests.map((r) => (
                <div key={r.id}>
                  <h3>{r.message}</h3>
                  <p>An {r.recipient} · Übermittlung simuliert</p>
                  <ul>
                    {r.items.map((i) => (
                      <li key={i}>
                        {i} ·{" "}
                        {r.answered.includes(i)
                          ? "Antwort eingegangen, fachlich zu prüfen"
                          : "Antwort offen"}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
          <History project={p} />
        </div>
        {!compact && (
          <aside className="decision-rail">
            <p className="overline">FACHLICHE BEARBEITUNG</p>
            <h2>Nächsten Schritt dokumentieren.</h2>
            <p>
              Jede Entscheidung erhält Akteur, Zeitpunkt und unveränderlichen
              Bewertungssnapshot.
            </p>
            <Button onClick={() => setDecision(true)}>Entscheidung</Button>
            <p className="meta">
              Demo-Partnerkontext · keine echten Übermittlungen
            </p>
          </aside>
        )}
      </div>
      {decision && (
        <DecisionDialog
          project={p}
          onClose={() => setDecision(false)}
          onUpdate={(updated) => {
            setLocal(updated);
            onUpdate?.(updated);
          }}
        />
      )}
    </article>
  );
}
type Action =
  | "accept"
  | "request-info"
  | "reject"
  | "begin-review"
  | "reopen"
  | "resume"
  | "milestone"
  | "note";
const titles: Record<Action, string> = {
  accept: "Projekt übernehmen",
  "request-info": "Informationen anfordern",
  reject: "Projekt begründet ablehnen",
  "begin-review": "Fachliche Prüfung beginnen",
  reopen: "Projekt wiederaufnehmen",
  resume: "Prüfung wiederaufnehmen",
  milestone: "Meilenstein dokumentieren",
  note: "Interne Notiz",
};
export function DecisionDialog({
  project,
  onClose,
  onUpdate,
}: {
  project: Project;
  onClose: () => void;
  onUpdate: (p: Project) => void;
}) {
  const [p, setP] = useState(project);
  const [action, setAction] = useState<Action | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState<string[]>([]);
  const [certainty, setCertainty] = useState("INSUFFICIENT_EVIDENCE");
  const [items, setItems] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [evidence, setEvidence] = useState("");
  const [due, setDue] = useState("");
  const [target, setTarget] = useState<Status>("DEVELOPMENT");
  const [confirmed, setConfirmed] = useState(false);
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  const [conflict, setConflict] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!action) return;
    setPending(true);
    setError("");
    try {
      const result = await api<Project>(
        `/api/partner/projects/${p.id}/actions`,
        "POST",
        {
          requestId,
          revision: p.revision,
          action,
          note,
          items,
          ...(action === "reject"
            ? {
                rejection: {
                  primary,
                  secondary,
                  certainty,
                  note,
                  evidenceRefs: evidence.trim() ? [evidence.trim()] : [],
                },
              }
            : {}),
          ...(action === "request-info"
            ? {
                recipient: p.contact?.email,
                dueAt: due
                  ? new Date(`${due}T12:00:00+02:00`).toISOString()
                  : null,
              }
            : {}),
          ...(action === "milestone"
            ? { targetStatus: target, milestoneConfirmed: confirmed }
            : {}),
        },
      );
      onUpdate(result);
      setP(result);
      setSuccess(result.events[0].action);
      setAction(null);
    } catch (e) {
      setError(readableError(e));
      setConflict(e instanceof ApiError && e.status === 409);
    } finally {
      setPending(false);
    }
  }
  const actions: Action[] = [];
  if (transitionAllowed(p.status, "PARTNER_REVIEW"))
    actions.push(
      p.status === "REJECTED"
        ? "reopen"
        : p.status === "INFO_REQUESTED"
          ? "resume"
          : "begin-review",
    );
  if (transitionAllowed(p.status, "ACCEPTED")) actions.push("accept");
  if (transitionAllowed(p.status, "INFO_REQUESTED"))
    actions.push("request-info");
  if (transitionAllowed(p.status, "REJECTED")) actions.push("reject");
  if (["ACCEPTED", "DEVELOPMENT", "CONTRACTED"].includes(p.status))
    actions.push("milestone");
  actions.push("note");
  return (
    <Modal
      title={action ? titles[action] : "Entscheidung"}
      onClose={pending ? () => {} : onClose}
    >
      <p className="lead">
        {p.answers.buildingType} · {p.answers.address}
      </p>
      <p className="meta">
        {p.id} · Revision {p.revision} · Scoreversion{" "}
        {p.score?.assessmentId ?? "Noch offen"}
      </p>
      <ErrorNotice message={error} />
      {success && (
        <p role="status" className="notice">
          {success}. Im Demo-Speicher bestätigt.
        </p>
      )}
      {!action ? (
        <div className="decision-options">
          {actions.map((a) => (
            <Button
              key={a}
              variant={a === "reject" ? "critical" : "secondary"}
              onClick={() => {
                setAction(a);
                setSuccess("");
                setError("");
                setNote("");
                setItems([]);
                setPrimary("");
                setSecondary([]);
                setEvidence("");
                setConfirmed(false);
                setRequestId(crypto.randomUUID());
                setTarget(
                  p.status === "ACCEPTED"
                    ? "DEVELOPMENT"
                    : p.status === "DEVELOPMENT"
                      ? "CONTRACTED"
                      : "REALIZED",
                );
              }}
            >
              {titles[a]}
            </Button>
          ))}
        </div>
      ) : (
        <form onSubmit={submit}>
          {action === "accept" && (
            <>
              <p>
                Sie übernehmen die weitere fachliche Bearbeitung dieses
                Projekts.
              </p>
              <Notice>
                Die Übernahme ist kein Vertrag und keine garantierte Umsetzung.
                Diese Aktion wird lokal simuliert.
              </Notice>
              {p.blockers.map((b) => (
                <Notice critical key={b}>
                  {b}
                </Notice>
              ))}
            </>
          )}
          {action === "request-info" && (
            <>
              <Checks
                label="Benötigte Felder / Dokumente"
                values={items}
                onChange={setItems}
                options={["Jahresverbrauch", "Berechtigung", ...categories]}
              />
              <Field
                label="Tatsächlicher Empfänger im Demo-Projekt"
                value={p.contact?.email ?? ""}
                readOnly
              />
              <Field
                label="Fälligkeit (optional)"
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
              <p>
                Der Versand wird simuliert und im Verlauf ausdrücklich so
                gekennzeichnet.
              </p>
            </>
          )}
          {action === "reject" && (
            <>
              <div className="field">
                <label htmlFor="primary-reason">Primärer Ablehnungsgrund</label>
                <select
                  id="primary-reason"
                  required
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                >
                  <option value="">Genau einen Grund auswählen</option>
                  {reasons.map((r) => (
                    <option value={r} key={r}>
                      {reasonLabels[r]}
                    </option>
                  ))}
                </select>
              </div>
              <details className="inline-details">
                <summary>Zusätzliche Gründe (maximal 3)</summary>
                <Checks
                  label="Zusätzliche Gründe"
                  values={secondary}
                  onChange={setSecondary}
                  options={reasons.filter((r) => r !== primary)}
                />
              </details>
              <div className="field">
                <label htmlFor="certainty">Einschätzungsstand</label>
                <select
                  id="certainty"
                  value={certainty}
                  onChange={(e) => setCertainty(e.target.value)}
                >
                  <option value="INSUFFICIENT_EVIDENCE">
                    Nicht ausreichend belegt
                  </option>
                  <option value="CONFIRMED">Bestätigt</option>
                  <option value="PARTNER_SCOPE_DECISION">
                    Partnerkriterium
                  </option>
                </select>
              </div>
              <Field
                label="Fachlicher Beleg / Prüfreferenz"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                help="Für technische Gründe erforderlich. Unbekannte Statik ist kein bestätigter Mangel."
              />
            </>
          )}
          {action === "milestone" && (
            <>
              <SelectField
                label="Nächster Meilenstein"
                value={target}
                options={statuses.filter(
                  (s) => transitionAllowed(p.status, s) && s !== "REJECTED",
                )}
                onChange={(v) => setTarget(v as Status)}
              />
              <label className="check-label">
                <input
                  type="checkbox"
                  required
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                Ich bestätige den synthetischen Demo-Meilenstein ausdrücklich.
              </label>
            </>
          )}
          {action !== "accept" && (
            <div className="field">
              <label htmlFor="decision-note">
                {action === "request-info"
                  ? "Nachricht an Projektkontakt"
                  : action === "note"
                    ? "Interne Notiz · kein Versand"
                    : "Erläuterung"}
              </label>
              <textarea
                id="decision-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={2000}
                required={action !== "begin-review"}
                minLength={action === "reject" ? undefined : 3}
              />
            </div>
          )}
          <div className="actions">
            <Button
              type="submit"
              pending={pending}
              variant={action === "reject" ? "critical" : "primary"}
              disabled={
                conflict || (action === "accept" && p.blockers.length > 0)
              }
            >
              {action === "accept"
                ? "Übernahme bestätigen"
                : action === "reject"
                  ? "Projekt ablehnen"
                  : action === "request-info"
                    ? "Anfrage senden"
                    : "Aktion bestätigen"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={pending}
              onClick={() => setAction(null)}
            >
              Abbrechen
            </Button>
          </div>
        </form>
      )}
      {conflict && (
        <div>
          <p>
            Ihre Eingaben bleiben erhalten. Laden Sie den neuen Stand und prüfen
            Sie Ihre Entscheidung erneut.
          </p>
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                const current = await api<Project>(
                  `/api/partner/projects/${p.id}`,
                );
                setP(current);
                onUpdate(current);
                setConflict(false);
                setRequestId(crypto.randomUUID());
                setError(
                  "Aktueller Stand geladen. Bitte die Entscheidung erneut bewusst bestätigen.",
                );
              } catch (e) {
                setError(readableError(e));
              }
            }}
          >
            Neuen Stand laden
          </Button>
        </div>
      )}
    </Modal>
  );
}
export function PipelineView({ projects }: { projects: Project[] }) {
  const asOf = new Date().toISOString();
  const rows = pipeline(projects, asOf);
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <main id="main" className="wrap page">
      <p className="overline">PARTNERARBEITSPLATZ / PIPELINE</p>
      <h1>Projekte im Prozess.</h1>
      <p className="lead">Bestand und offene Arbeit auf einen Blick.</p>
      <p className="meta">
        {projects.length} freigegebene Demo-Projekte · Stand {dateDE(asOf)} ·
        aktueller Bestand, keine Durchsatzmessung
      </p>
      <table className="pipeline-table">
        <caption className="sr-only">
          Projektbestand nach Status, offene und überfällige Aufgaben sowie
          Median des aktuellen Statusalters
        </caption>
        <thead>
          <tr>
            <th>Stufe</th>
            <th>Bestand</th>
            <th>Offene Aufgaben</th>
            <th>Überfällig</th>
            <th>Median Statusalter</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.status}
              className={r.status === "REJECTED" ? "terminal-branch" : ""}
            >
              <th scope="row">
                <Link href={`/partner/projekte?status=${r.status}`}>
                  {statusLabels[r.status]}
                </Link>
              </th>
              <td data-label="Bestand">
                <Link href={`/partner/projekte?status=${r.status}`}>
                  {r.count}
                </Link>
                <span
                  className="pipeline-bar"
                  aria-hidden
                  style={{ width: `${(r.count / max) * 100}%` }}
                />
              </td>
              <td data-label="Offene Aufgaben">{r.open}</td>
              <td data-label="Überfällig">
                <Link
                  href={`/partner/projekte?status=${r.status}&due=${encodeURIComponent("Überfällig")}`}
                >
                  {r.overdue}
                </Link>
              </td>
              <td data-label="Median Statusalter">
                {r.age === null
                  ? r.count
                    ? "Abschluss"
                    : "— · keine Fälle"
                  : r.age < 1
                    ? `${Math.round(r.age * 1440)} Min.`
                    : `${numberDE(r.age)} Tage`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="meta">
        Median der bisherigen Aufenthaltsdauer aktueller Fälle. Terminale Stufen
        akkumulieren keine weitere Liegezeit. Überfälligkeit setzt eine echte
        Fälligkeit in den Demo-Daten voraus.
      </p>
    </main>
  );
}
