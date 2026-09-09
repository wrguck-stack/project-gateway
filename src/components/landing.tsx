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
} from "@carbon/icons-react";
import { Header, Footer } from "./shell";
import { Button } from "./ui";
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
import "./landing.css";

const faq = [
  [
    "Was bekomme ich nach dem Standortcheck?",
    "Eine strukturierte Übersicht Ihrer Angaben, eine vorläufige Einordnung und sichtbar offene Punkte. Das interaktive Beispiel zeigt Ihnen das Ergebnis vorab. In dieser Demo sind Bewertung und Partnerübergabe beispielhaft; es entsteht keine technische Freigabe.",
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
    "In dieser Demo wird Ihre Adresse manuell erfasst. Es gibt keine automatische Gebäudeerkennung und keine tatsächliche Ertrags- oder Wirtschaftlichkeitsberechnung. Bilder und Beispielwerte sind als solche gekennzeichnet.",
  ],
  [
    "Wer bekommt meine Unterlagen?",
    "Vor jeder Freigabe sehen Sie den Empfänger und die ausgewählten Angaben und Dateien. Sie entscheiden ausdrücklich über die Übergabe. In der Demo wird diese nur simuliert; es erfolgt kein externer Versand.",
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
                  <small>{s.source}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button type="submit" pending={pending}>
          {pending ? "Entwurf wird angelegt …" : "Standort prüfen"}
        </Button>
      </div>
      <small id={`${id}-help`} aria-live="polite">
        {searching
          ? "Demo-Adressen werden gesucht …"
          : searchFailed
            ? "Adresssuche nicht erreichbar. Sie können den Standort manuell eingeben."
            : "Adresse manuell eingeben oder einen gekennzeichneten Demo-Standort wählen."}
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
    document.getElementById("standort-start")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    document
      .getElementById("gateway-address-hero")
      ?.focus({ preventScroll: true });
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
    <>
      <Header mode={mode} />
      <main id="main" className="landing-page">
        <section className="hero wrap" id="standort-start">
          <div className="hero-copy">
            <p className="overline hero-overline">
              GEWERBEIMMOBILIEN / ENERGIEPROJEKTE
            </p>
            <h1>
              Ihre Fläche.
              <br />
              Ein klarer Weg zum Energieprojekt.
            </h1>
            <p className="lead">
              Bringen Sie Dach, Verbrauch und Unterlagen in eine strukturierte
              Projektakte. Erkennen Sie offene Fragen und bereiten Sie die
              fachliche Prüfung vor.
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
            <div className="hero-secondary">
              <Link href="/beispiel" className="text-link">
                Beispiel-Projektakte ansehen{" "}
                <ArrowRight size={20} aria-hidden />
              </Link>
              <p className="meta">
                Ohne Pflichtkonto · Unbekannte Angaben sind möglich
              </p>
            </div>
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
                  }}
                >
                  Neuen Standort beginnen
                </button>
              </p>
            )}
          </div>
          <figure className="landing-aerial hero-site">
            <img
              src="/atlas/gateway-industrial-hero-v2.webp"
              width={1254}
              height={1254}
              alt="Illustrative Luftansicht einer Gewerbehalle mit großzügigen Dachflächen und Ladehof."
              fetchPriority="high"
            />
            <figcaption>
              <span className="mono">FLÄCHE. SUBSTANZ. PERSPEKTIVE.</span>
              <span>
                KI-generierte Illustration · kein analysierter Standort
              </span>
            </figcaption>
          </figure>
          <nav className="hero-stages" aria-label="Der Weg zum Projekt">
            <a href="#standort-start">
              <span className="mono">01</span> Standort erfassen
            </a>
            <a href="#projektakte">
              <span className="mono">02</span> Projektakte ansehen
            </a>
            <a href="#projektpartner">
              <span className="mono">03</span> Fachliche Prüfung
            </a>
          </nav>
        </section>

        <section className="section wrap dossier-section" id="projektakte">
          <div className="dossier-intro">
            <p className="overline">IHR ERGEBNIS / VORAB ANSEHEN</p>
            <h2>Aus einzelnen Angaben wird eine klare Projektgrundlage.</h2>
            <p className="lead">
              Was ist bekannt? Was fehlt noch? Und was ist als Nächstes zu
              klären? Ihre Projektakte hält die Antworten an einem Ort fest.
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

        <section id="ablauf" className="section wrap">
          <p className="overline">DER WEG ZUM PROJEKT</p>
          <h2>Ihr Standort. Drei klare Schritte.</h2>
          <div className="process-grid">
            {[
              [
                "Standort erfassen",
                "Beginnen Sie mit der Adresse oder einer Beschreibung Ihrer Fläche. Ein Pflichtkonto ist dafür nicht nötig.",
              ],
              [
                "Angaben zusammenführen",
                "Ergänzen Sie Objekt, Energieprofil und Unterlagen. Unbekannte Werte bleiben als offene Punkte erhalten.",
              ],
              [
                "Prüfung vorbereiten",
                "Sehen Sie Ihre Projektakte durch und entscheiden Sie bewusst über die Übergabe. In dieser Demo wird sie simuliert.",
              ],
            ].map(([title, text], i) => (
              <article key={title}>
                <span className="process-number">0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section wrap editorial-split landing-check"
          id="standortcheck-vorschau"
        >
          <LandingCheckPreview />
          <div>
            <p className="overline">DER STANDORTCHECK / DIREKT AUSPROBIEREN</p>
            <h2>Sie kennen Ihre Immobilie. Wir bringen Struktur hinein.</h2>
            <p className="lead">
              Zehn verständliche Schritte führen durch die Angaben. Sie müssen
              dafür weder eine fertige Planung noch jede technische Antwort
              mitbringen.
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
              <p className="overline">VIER AUSGANGSPUNKTE</p>
              <h2>Was möchten Sie mit Ihrer Fläche bewegen?</h2>
            </div>
            <p>
              Öffnen Sie die passende Projektart und starten Sie mit einer
              Auswahl, die zu Ihrem Vorhaben passt.
            </p>
          </div>
          <ProjectTypes selected={intent} onSelect={selectIntent} />
        </section>
        <ScorePreview />

        <section className="section wrap audience-section" id="eigentuemer">
          <p className="overline">
            FÜR EIGENTÜMER, UNTERNEHMEN UND BESTANDSHALTER
          </p>
          <h2>Eine Immobilie verdient einen klaren nächsten Schritt.</h2>
          <div className="audience-columns">
            <article>
              <span className="mono muted">01 / EIGENTÜMER & UNTERNEHMEN</span>
              <h3>Ihre Fläche ins Gespräch bringen.</h3>
              <p>
                Halten Sie Potenzialfragen und Voraussetzungen fest. So können
                Sie ein Dach-, Speicher- oder Flächenprojekt mit einer
                geordneten Grundlage besprechen.
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
            <p className="overline">FÜR PROJEKTENTWICKLER UND PARTNER</p>
            <h2>Gut vorbereitet in die fachliche Prüfung.</h2>
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
                Partner-Demo öffnen <ArrowRight size={20} aria-hidden />
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
            <p className="overline">VOR DEM ERSTEN SCHRITT</p>
            <h2>
              Ihre Fragen.
              <br />
              Klare Antworten.
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
                  <span aria-hidden>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="section wrap closing">
          <div>
            <p className="overline">BEGINNEN WIR MIT IHRER FLÄCHE</p>
            <h2>Der nächste Schritt beginnt mit einem Standort.</h2>
            <p>
              Erfassen Sie Ihre Immobilie und sehen Sie, welche Angaben Ihre
              Projektanfrage voranbringen.
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
      <Footer />
    </>
  );
}
