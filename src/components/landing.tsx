"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Location,
  Building,
  Flash,
  Document,
  Checkmark,
  ChevronDown,
} from "@carbon/icons-react";
import { Header, Footer } from "./shell";
import { Button, Modal } from "./ui";
import { api } from "./client-api";
import {
  DossierPreview,
  LandingCheckPreview,
  ProjectTypes,
  ScorePreview,
  projectTypes,
  type ProjectIntent,
} from "./landing-content";
import type { Project } from "@/domain/model";
import "@fontsource/arimo/latin-400.css";
import "@fontsource/arimo/latin-700.css";
import "@fontsource/gelasio/latin-400-italic.css";
import "./landing.css";
import { NightshiftHero } from "./nightshift-hero";
import { SiteSituations } from "./site-situations";
import "./nightshift-landing.css";

const faq = [
  [
    "Lohnt sich Photovoltaik trotz der Unsicherheiten noch?",
    "Ob sich ein Projekt lohnt, hängt von Ihrem Standort, der Nutzung, den Investitions- und Betriebskosten sowie den geltenden Rahmenbedingungen ab. Der Standortcheck sammelt die Ausgangsdaten. Ertrag, Risiken und Wirtschaftlichkeit werden anschließend fachlich geprüft – auch mit dem möglichen Ergebnis, ein Vorhaben vorerst nicht weiterzuverfolgen.",
  ],
  [
    "Welche Rolle spielt mein bestehender Netzanschluss?",
    "Die vorhandene Anschlussleistung und die Möglichkeiten für Bezug und Einspeisung gehören zur Prüfung von Photovoltaik und Speichern. Anschlussunterlagen helfen dabei, die Ausgangslage zu klären. Welche Nutzung technisch möglich, zulässig und wirtschaftlich sinnvoll ist, muss für Ihren Standort geprüft werden.",
  ],
  [
    "Was bekomme ich nach dem Standortcheck?",
    "Eine strukturierte Übersicht Ihrer Angaben, eine vorläufige Einordnung und sichtbar offene Punkte. Das interaktive Beispiel zeigt Ihnen das Ergebnis vorab. Die fachliche Prüfung ist der nächste Schritt.",
  ],
  [
    "Welche Angaben brauche ich?",
    "Die Adresse oder Beschreibung der Fläche und erste Angaben zu Objekt, Stromverbrauch und Projektziel. Unterlagen können Sie ergänzen. Was Sie noch nicht wissen, kennzeichnen Sie als unbekannt.",
  ],
  [
    "Muss ich mich vorher registrieren?",
    "Nein. Sie können den Standortcheck ohne Pflichtkonto beginnen und das Ergebnis ansehen. Erst bei einer gewünschten Projektübergabe werden Kontaktdaten benötigt.",
  ],
  [
    "Wird meine Immobilie automatisch analysiert?",
    "Sie erfassen Ihre Adresse und die Angaben zum Objekt. Gateway strukturiert diese Informationen und zeigt offene Fragen. Die Prüfung von Gebäude, Ertrag und Wirtschaftlichkeit gehört in die anschließende fachliche Planung.",
  ],
  [
    "Wer bekommt meine Unterlagen?",
    "Sie bestimmen, welche Angaben und Dateien Sie für Ihre Projektanfrage freigeben. Den zugeordneten Partner und den vollständigen Umfang sehen Sie vor dem Abschluss.",
  ],
  [
    "Ist die Einreichung bereits ein Auftrag?",
    "Nein. Eine Projektanfrage dient der Vorbereitung einer fachlichen Prüfung. Planung, Wirtschaftlichkeit und weitere Vereinbarungen werden gesondert mit einem tatsächlich benannten Projektpartner geklärt.",
  ],
];

type AddressProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  pending: boolean;
  error?: string;
  inputId?: string;
};
export function AddressEntry({
  value,
  onChange,
  onSubmit,
  pending,
  error = "",
  inputId,
}: AddressProps) {
  const fallbackId = useId();
  const id = inputId ?? fallbackId;
  const [suggestions, setSuggestions] = useState<
    { address: string; source: string }[]
  >([]);
  const [index, setIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  useEffect(() => {
    let active = true;
    setSuggestions([]);
    setIndex(-1);
    setSearchFailed(false);
    if (value.trim().length < 2 || !open) {
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      api<{ address: string; source: string }[]>(
        `/api/locations?q=${encodeURIComponent(value)}`,
      )
        .then((rows) => {
          if (active) setSuggestions(rows.slice(0, 5));
        })
        .catch(() => {
          if (active) setSearchFailed(true);
        })
        .finally(() => {
          if (active) setSearching(false);
        });
    }, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [value, open]);
  const choose = (address: string) => {
    onChange(address);
    setOpen(false);
    setIndex(-1);
  };
  return (
    <form
      className="address-form"
      aria-busy={pending}
      onSubmit={(e) => {
        e.preventDefault();
        setOpen(false);
        if (!pending) onSubmit();
      }}
    >
      <label htmlFor={id}>Adresse Ihrer Immobilie oder Fläche</label>
      <div className="address-line">
        <div className="address-input">
          <Location size={24} aria-hidden />
          <input
            id={id}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open && suggestions.length > 0}
            aria-controls={
              open && suggestions.length > 0 ? `${id}-list` : undefined
            }
            aria-activedescendant={
              open && index >= 0 && suggestions[index]
                ? `${id}-option-${index}`
                : undefined
            }
            aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
            value={value}
            disabled={pending}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            placeholder="Straße, Hausnummer, PLZ oder Ort"
            required
            minLength={3}
            maxLength={240}
            autoComplete="street-address"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
                setIndex((i) => Math.min(i + 1, suggestions.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => (suggestions.length ? Math.max(i - 1, 0) : -1));
              }
              if (e.key === "Escape") {
                if (open && (suggestions.length > 0 || searching)) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                setOpen(false);
                setIndex(-1);
              }
              if (
                e.key === "Enter" &&
                open &&
                index >= 0 &&
                suggestions[index]
              ) {
                e.preventDefault();
                choose(suggestions[index].address);
              }
            }}
          />
          {open && suggestions.length > 0 && (
            <ul
              role="listbox"
              id={`${id}-list`}
              aria-label="Adressvorschläge"
              className="suggestions"
            >
              {suggestions.map((s, i) => (
                <li
                  key={s.address}
                  id={`${id}-option-${i}`}
                  role="option"
                  aria-selected={index === i}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => choose(s.address)}
                >
                  <strong>{s.address}</strong>
                  <small>
                    {s.source === "Synthetischer Demo-Standort"
                      ? "Beispielstandort"
                      : s.source}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button type="submit" pending={pending}>
          {pending ? "Entwurf wird angelegt …" : "Standortcheck starten"}
        </Button>
      </div>
      <small id={`${id}-help`} aria-live="polite">
        {searching
          ? "Adressvorschläge werden gesucht …"
          : searchFailed
            ? "Adresssuche nicht erreichbar. Sie können den Standort manuell eingeben."
            : "Geben Sie die Adresse oder eine Beschreibung Ihrer Fläche ein."}
      </small>
      {error && (
        <p
          ref={errorRef}
          id={`${id}-error`}
          tabIndex={-1}
          className="notice critical-notice"
          role="alert"
        >
          {error}
        </p>
      )}
    </form>
  );
}

type SavedDraft = {
  id: string;
  address: string;
  projectIntent?: ProjectIntent;
};
export function Landing({ mode }: { mode: string }) {
  const [address, setAddress] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [activeForm, setActiveForm] = useState("hero");
  const [entryOpen, setEntryOpen] = useState(false);
  const [intent, setIntent] = useState<ProjectIntent>();
  const [draft, setDraft] = useState<SavedDraft | null>(null);
  const starting = useRef(false);
  const router = useRouter();
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("gateway-draft");
      if (raw) {
        const d = JSON.parse(raw);
        if (typeof d.id === "string" && typeof d.address === "string") {
          setDraft(d);
          setAddress(d.address);
          if (projectTypes.some((p) => p.id === d.projectIntent))
            setIntent(d.projectIntent);
        }
      }
    } catch {
      /* The check remains usable without browser storage. */
    }
  }, []);
  async function start(source: string) {
    if (starting.current) return;
    setActiveForm(source);
    setError("");
    if (address.trim().length < 3) {
      setError("Bitte geben Sie eine Adresse oder Standortbeschreibung ein.");
      return;
    }
    starting.current = true;
    setPending(true);
    try {
      if (
        draft &&
        draft.address === address.trim() &&
        draft.projectIntent === intent
      ) {
        router.push(`/standortcheck/${draft.id}/1`);
        return;
      }
      await api("/api/session", "POST", { role: "OWNER" });
      const p = await api<Project>("/api/drafts", "POST", {
        address: address.trim(),
        projectIntent: intent,
      });
      const saved = {
        id: p.id,
        address: p.answers.address,
        projectIntent: intent,
      };
      setDraft(saved);
      try {
        sessionStorage.setItem("gateway-draft", JSON.stringify(saved));
      } catch {
        /* Server-created draft can still be opened. */
      }
      router.push(`/standortcheck/${p.id}/1`);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Der Standortcheck konnte nicht geöffnet werden. Bitte versuchen Sie es erneut.",
      );
      starting.current = false;
      setPending(false);
    }
  }
  function focusEntry() {
    setError("");
    setEntryOpen(true);
  }
  function selectIntent(value: ProjectIntent) {
    setIntent(value);
    setError("");
    focusEntry();
  }
  const selectedTitle = projectTypes.find((p) => p.id === intent)?.title;
  const entry = (source: string) => (
    <AddressEntry
      value={address}
      onChange={(value) => {
        setAddress(value);
        setError("");
      }}
      pending={pending}
      onSubmit={() => start(source)}
      error={activeForm === source ? error : ""}
      inputId={`gateway-address-${source}`}
    />
  );
  return (
    <div className="gateway-editorial">
      <Header mode={mode} editorial nightshift />
      <main id="main" className="landing-page">
        <NightshiftHero onStart={focusEntry}>
          {draft && (
            <p className="draft-return">
              <Link href={`/standortcheck/${draft.id}/1`}>
                Entwurf fortsetzen
              </Link>
              <button
                className="text-button"
                onClick={() => {
                  setDraft(null);
                  setAddress("");
                  setIntent(undefined);
                  try {
                    sessionStorage.removeItem("gateway-draft");
                  } catch {}
                  focusEntry();
                }}
              >
                Neuen Standort beginnen
              </button>
            </p>
          )}
        </NightshiftHero>
        {entryOpen && (
          <Modal
            title="Wo liegt Ihr Standort?"
            onClose={() => setEntryOpen(false)}
          >
            <div className="site-entry-dialog">
              <p>
                Beginnen Sie mit der Adresse Ihrer Immobilie oder einer
                Beschreibung Ihrer Fläche.
              </p>
              {selectedTitle && (
                <div className="selected-intent" role="status">
                  <span>
                    <Checkmark size={20} aria-hidden />
                    {selectedTitle} ausgewählt
                  </span>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setIntent(undefined)}
                  >
                    Auswahl aufheben
                  </button>
                </div>
              )}
              {entry("hero")}
              <p className="meta">
                Ohne Pflichtkonto · Ihre Angaben bereiten die fachliche Prüfung
                vor.
              </p>
            </div>
          </Modal>
        )}

        <SiteSituations
          onStart={(value) => {
            setIntent(value);
            focusEntry();
          }}
        />

        <section id="ablauf" className="section wrap decision-section">
          <div className="decision-intro">
            <p className="overline">02 / VOR DER ANLAGENPLANUNG</p>
            <h2>
              Erst den Betrieb verstehen.
              <br />
              <em>Dann die Anlage planen.</em>
            </h2>
            <p>
              Ein großes Dach allein entscheidet noch nicht über eine passende
              Anlage. Verbrauchszeiten, Anschlussleistung und Gebäude müssen
              zusammenpassen. Diese drei Fragen stehen am Anfang.
            </p>
            <a href="#standortcheck-vorschau" className="text-link">
              Den Standortcheck kennenlernen{" "}
              <ArrowRight size={20} aria-hidden />
            </a>
          </div>
          <div className="process-grid">
            {[
              [
                "moeglichkeiten",
                "Wann benötigt Ihr Betrieb Strom?",
                "Stromabrechnung, Betriebszeiten und ein vorhandener Lastgang zeigen unterschiedliche Aspekte Ihres Bedarfs. Sie helfen dabei, Erzeugung und Nutzung zeitlich zusammenzudenken.",
              ],
              [
                "wirtschaftlichkeit",
                "Was lässt Ihr Netzanschluss zu?",
                "Die verfügbare Leistung für Bezug und Einspeisung ist eine eigene Planungsfrage. Vorhandene Anschlussunterlagen werden ergänzt; offene Punkte müssen mit Fachplanung und Netzbetreiber geklärt werden.",
              ],
              [
                "naechste-schritte",
                "Was steht einer Investition noch im Weg?",
                "Dachzustand, Statik, Genehmigungen und die Wirtschaftlichkeit brauchen belastbare Nachweise. Der Standortcheck sammelt die Ausgangsdaten und hält fest, welche Prüfungen noch fehlen.",
              ],
            ].map(([id, title, text], i) => (
              <article key={id} id={id}>
                <span className="process-number">0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section wrap dossier-section" id="projektakte">
          <div className="dossier-intro">
            <p className="overline">03 / IHRE PROJEKTAKTE</p>
            <h2>
              Vom Strombeleg
              <br />
              <em>zur Projektakte.</em>
            </h2>
            <p className="lead">
              Stromrechnung, Dachplan, vorhandene Anlagen: Aus einzelnen Angaben
              entsteht eine gemeinsame Standortakte. Bekannte Werte, Schätzungen
              und fehlende Nachweise bleiben darin klar unterscheidbar.
            </p>
            <ul className="value-list">
              <li>
                <Checkmark size={20} aria-hidden />
                <span>Objekt, Energie und Unterlagen zusammengeführt</span>
              </li>
              <li>
                <Checkmark size={20} aria-hidden />
                <span>Schätzwerte und offene Prüfungen klar benannt</span>
              </li>
              <li>
                <Checkmark size={20} aria-hidden />
                <span>Nachvollziehbare Grundlage für das Fachgespräch</span>
              </li>
            </ul>
            <Link href="/beispiel" className="button secondary">
              Ergebnis am Beispiel ansehen <ArrowRight size={20} aria-hidden />
            </Link>
          </div>
          <DossierPreview />
        </section>

        <section
          className="section wrap editorial-split landing-check"
          id="standortcheck-vorschau"
        >
          <LandingCheckPreview />
          <div>
            <p className="overline">04 / DER STANDORTCHECK</p>
            <h2>
              Wie viel Dach ist
              <br />
              <em>wirklich nutzbar?</em>
            </h2>
            <p className="lead">
              Eine der Fragen im Standortcheck. Probieren Sie aus, wie sich
              Angaben, Schätzwerte und unbekannte Werte erfassen lassen. Eine
              fertige Planung benötigen Sie für den Einstieg nicht.
            </p>
            {[
              [
                Building,
                "Objekt und Fläche",
                "Gebäude, verfügbare Fläche und Ihre Rolle.",
              ],
              [
                Flash,
                "Energieprofil",
                "Verbrauch, bestehende PV und Speicher.",
              ],
              [
                Document,
                "Vorhandene Unterlagen",
                "Pläne, Abrechnungen und offene Nachweise.",
              ],
            ].map(([Icon, title, text]) => {
              const Component = Icon as typeof Building;
              return (
                <div key={String(title)} className="editorial-line">
                  <Component size={24} aria-hidden />
                  <div>
                    <strong>{String(title)}</strong>
                    <small>{String(text)}</small>
                  </div>
                </div>
              );
            })}
            <button className="text-link text-button" onClick={focusEntry}>
              Eigenen Standort prüfen <ArrowRight size={20} aria-hidden />
            </button>
          </div>
        </section>

        <section className="section wrap" id="projektarten">
          <div className="section-intro">
            <div>
              <p className="overline">05 / IHRE MÖGLICHKEITEN</p>
              <h2>
                Neu erzeugen.
                <br />
                <em>Bestehendes ergänzen.</em>
              </h2>
            </div>
            <p>
              Dach-PV, Erweiterung, Speicher oder Freifläche: Hier sehen Sie,
              welche Angaben für den jeweiligen Projektweg gebraucht werden.
            </p>
          </div>
          <ProjectTypes selected={intent} onSelect={selectIntent} />
        </section>
        <ScorePreview />

        <section className="section wrap audience-section" id="eigentuemer">
          <p className="overline">07 / FÜR EIGENTÜMER UND UNTERNEHMEN</p>
          <h2>
            Ein Betrieb.
            <br />
            <em>Oder ein ganzes Portfolio.</em>
          </h2>
          <div className="audience-columns">
            <article>
              <span className="mono muted">01 / EIGENTÜMER & UNTERNEHMEN</span>
              <h3>Fläche und Netzanschluss gemeinsam betrachten.</h3>
              <p>
                Ihr vorhandener Netzanschluss gehört zur Betrachtung Ihres
                Standorts. Halten Sie Strombedarf, Anlagen und
                Anschlussunterlagen fest, um das wirtschaftliche Potenzial von
                Photovoltaik und Speichern fachlich prüfen zu lassen.
              </p>
              <button className="text-button text-link" onClick={focusEntry}>
                Meinen Standort erfassen <ArrowRight size={20} aria-hidden />
              </button>
            </article>
            <article>
              <span className="mono muted">
                02 / PORTFOLIOS & ASSET MANAGEMENT
              </span>
              <h3>Einheitliche Angaben. Klarere Entscheidungen.</h3>
              <p>
                Ein gemeinsamer Aufbau macht Informationen leichter prüfbar.
                Quellen, fehlende Nachweise und offene Entscheidungen bleiben je
                Standort nachvollziehbar.
              </p>
              <a className="text-link" href="#projektpartner">
                Zusammenarbeit kennenlernen <ArrowRight size={20} aria-hidden />
              </a>
            </article>
          </div>
        </section>

        <section className="section wrap partner-section" id="projektpartner">
          <div>
            <p className="overline">08 / DIE ZUSAMMENARBEIT</p>
            <h2>
              Wer prüft Ihren Standort?
              <br />
              <em>Wer plant die Anlage?</em>
            </h2>
            <p className="lead">
              Project Gateway bündelt die Angaben. Der tatsächlich benannte
              Projektpartner bewertet die fachlichen Voraussetzungen und
              entscheidet über die nächsten Schritte.
            </p>
            <div className="actions">
              <Link
                href="/kontakt?anliegen=partnerschaft"
                className="button secondary"
              >
                Zusammenarbeit besprechen <ArrowRight size={20} aria-hidden />
              </Link>
              <Link className="text-link" href="/partner/login">
                Partnerbereich öffnen <ArrowRight size={20} aria-hidden />
              </Link>
            </div>
          </div>
          <div className="responsibility-list">
            {[
              [
                "Geordnete Projektanfragen",
                "Standort, Objekt, Energieprofil und Unterlagen in einer gemeinsamen Akte.",
              ],
              [
                "Nachvollziehbare Einordnung",
                "Datenherkunft, Schätzwerte und offene Punkte stehen neben der Bewertung.",
              ],
              [
                "Bewusste Entscheidungen",
                "Prüfen, Angaben anfordern und Entscheidungen mit Begründung dokumentieren.",
              ],
            ].map(([title, text], i) => (
              <article key={title}>
                <span className="mono amber">0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section wrap faq">
          <div>
            <p className="overline">09 / HÄUFIGE FRAGEN</p>
            <h2>
              Was vor einer Investition
              <br />
              <em>zu klären ist.</em>
            </h2>
            <Link href="/kontakt" className="text-link">
              Kontakt und Ansprechpartner <ArrowRight size={20} aria-hidden />
            </Link>
          </div>
          <div>
            {faq.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <ChevronDown className="faq-chevron" size={24} aria-hidden />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="section wrap closing">
          <div>
            <p className="overline">10 / IHR NÄCHSTER SCHRITT</p>
            <h2>
              Ihr Energiekonzept beginnt
              <br />
              <em>mit Ihrem Standort.</em>
            </h2>
            <p>
              Beginnen Sie mit Ihrer Adresse. Ergänzen Sie, was Sie über Dach,
              Verbrauch und bestehende Anlagen wissen. Offene Fragen bleiben
              sichtbar, bis sie fachlich geklärt sind.
            </p>
          </div>
          <div>
            {selectedTitle && (
              <p className="meta">Ausgewählte Projektart: {selectedTitle}</p>
            )}
            {entry("closing")}
            <Link href="/beispiel" className="text-link">
              Zuerst das Beispiel ansehen <ArrowRight size={20} aria-hidden />
            </Link>
          </div>
        </section>
      </main>
      <Footer editorial />
    </div>
  );
}
