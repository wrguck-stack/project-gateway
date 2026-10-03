"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Location, ChevronDown } from "@carbon/icons-react";
import { Header, Footer } from "./shell";
import { Button, Modal } from "./ui";
import { api } from "./client-api";
import { projectTypes, type ProjectIntent } from "./landing-content";
import type { Project } from "@/domain/model";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";
import { NightshiftHero } from "./nightshift-hero";
import { SiteSituations } from "./site-situations";
import { SiteRecord } from "./site-record";
import "./fieldbook-landing.css";

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
          {pending
            ? "Entwurf wird angelegt …"
            : "Weiter zu den Standortangaben"}
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
  function selectIntent(value?: ProjectIntent) {
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
    <div className="gateway-editorial gateway-fieldbook">
      <Header mode={mode} editorial nightshift />
      <main id="main" className="landing-page">
        <NightshiftHero onStart={selectIntent}>
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
                Geben Sie Ihre Adresse oder eine Beschreibung Ihrer Fläche ein.
                Danach ergänzen Sie die Angaben zu Ihrem Standort.
              </p>
              <div className="fieldbook-intent field">
                <label htmlFor="gateway-project-intent">Projektvorhaben</label>
                <select
                  id="gateway-project-intent"
                  aria-describedby="gateway-project-intent-help"
                  value={intent ?? ""}
                  onChange={(event) =>
                    setIntent(
                      event.target.value
                        ? (event.target.value as ProjectIntent)
                        : undefined,
                    )
                  }
                >
                  <option value="">Noch offen</option>
                  {projectTypes.map((projectType) => (
                    <option key={projectType.id} value={projectType.id}>
                      {projectType.title}
                    </option>
                  ))}
                </select>
                <small id="gateway-project-intent-help">
                  Optional – kann noch offen bleiben.
                </small>
              </div>
              {entry("hero")}
              <p className="meta">
                Ohne Pflichtkonto · Ihre Angaben bereiten die fachliche Prüfung
                vor.
              </p>
            </div>
          </Modal>
        )}

        <aside
          className="fieldbook-route"
          aria-label="Ablauf des Standortchecks"
        >
          <p>
            Ihr Weg zur <br />
            Standortübersicht
          </p>
          <ol>
            <li>
              <span aria-hidden="true">01</span>
              <div>
                <strong>Standort angeben</strong>
                <small>Adresse oder Fläche</small>
              </div>
            </li>
            <li>
              <span aria-hidden="true">02</span>
              <div>
                <strong>Angaben ergänzen</strong>
                <small>Was Ihnen bereits bekannt ist</small>
              </div>
            </li>
            <li>
              <span aria-hidden="true">03</span>
              <div>
                <strong>Übersicht erhalten</strong>
                <small>Stand und offene Fragen sehen</small>
              </div>
            </li>
          </ol>
        </aside>

        <SiteSituations
          onStart={(value) => {
            setIntent(value);
            focusEntry();
          }}
        />

        <SiteRecord />

        <section
          className="fieldbook-faq"
          id="fragen"
          aria-labelledby="faq-title"
        >
          <div className="fieldbook-faq-inner">
            <div>
              <p className="overline">VOR DER INVESTITION</p>
              <h2 id="faq-title">
                Gute Entscheidungen
                <br />
                beginnen mit Fragen.
              </h2>
              <Link href="/kontakt" className="text-link">
                Kontakt und Ansprechpartner <ArrowRight size={20} aria-hidden />
              </Link>
            </div>
            <div>
              <p className="fieldbook-faq-guide">
                Frage auswählen und Antwort aufklappen.
              </p>
              {faq.map(([q, a]) => (
                <details key={q}>
                  <summary>
                    {q}
                    <ChevronDown
                      className="faq-chevron"
                      size={24}
                      aria-hidden
                    />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section
          className="fieldbook-closing closing"
          id="standort-erfassen"
          aria-labelledby="closing-title"
        >
          <div>
            <p className="overline">IHR NÄCHSTER SCHRITT</p>
            <h2 id="closing-title">
              Beginnen wir mit
              <br />
              Ihrem Standort.
            </h2>
            <p>
              Eine Adresse genügt für den ersten Schritt. Ergänzen Sie danach,
              was Sie über Ihren Betrieb wissen. Fehlende Angaben können offen
              bleiben.
            </p>
          </div>
          <div>
            {selectedTitle && (
              <div className="fieldbook-intent-review">
                <p className="meta">Projektvorhaben: {selectedTitle}</p>
                <button
                  type="button"
                  onClick={focusEntry}
                  aria-haspopup="dialog"
                >
                  Projektvorhaben ändern
                </button>
              </div>
            )}
            {entry("closing")}
            <Link href="/beispiel" className="text-link">
              Zuerst das Beispiel ansehen <ArrowRight size={20} aria-hidden />
            </Link>
          </div>
        </section>
      </main>
      <Footer editorial fieldbook />
    </div>
  );
}
