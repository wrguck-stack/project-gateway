"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Location,
  Building,
  Flash,
  Document,
} from "@carbon/icons-react";
import { Header, Footer } from "./shell";
import { Button, ErrorNotice } from "./ui";
import "./landing.css";
import { api } from "./client-api";
import type { Project } from "@/domain/model";
const faq = [
  [
    "Was benötige ich für den Standortcheck?",
    "Die Adresse und erste Angaben zu Objekt, Fläche und Stromverbrauch. Unbekannte Werte und fehlende Unterlagen können Sie kenntlich machen.",
  ],
  [
    "Ist der Score bereits eine technische Planung?",
    "Nein. Der Score ordnet die vorhandenen Angaben für die Projektvorqualifizierung ein. Statik, Netzanschluss, Planung und Wirtschaftlichkeit werden gegebenenfalls anschließend fachlich geprüft.",
  ],
  [
    "Was passiert mit meinen Unterlagen?",
    "Vor einer Projektübergabe sehen Sie den Empfänger und die enthaltenen Angaben und Dateien. Erst mit Ihrer ausdrücklichen Übermittlung wird die Projektakte an diesen Partner weitergegeben.",
  ],
  [
    "Kann ich eine Fläche ohne Gebäude prüfen?",
    "Ja. Wählen Sie Freifläche. Die folgenden Fragen beziehen sich dann auf Fläche, Nutzung und Verfügungsrechte.",
  ],
  [
    "Kann ich ohne vollständige Unterlagen fortfahren?",
    "Ja. Der Check zeigt, was noch fehlt. Je nach Datenlage ist bereits eine vorläufige Einordnung möglich oder zunächst eine Ergänzung erforderlich.",
  ],
  [
    "Ist die Übermittlung bereits ein Projektauftrag?",
    "Sie reichen eine Projektanfrage zur fachlichen Prüfung ein. Weitere Vereinbarungen werden gesondert mit dem Projektpartner getroffen.",
  ],
];
function LandingAerial() {
  return (
    <figure className="landing-aerial hero-site">
      <img
        src="/atlas/atlas-reference-aerial.webp"
        width={304}
        height={332}
        alt="Illustrative Luftansicht einer Logistikhalle mit Ladehof aus der freigegebenen Atlas-Referenz."
      />
      <figcaption>
        Atlas-Beispielansicht · kein analysierter Standort
      </figcaption>
    </figure>
  );
}
export function AddressEntry({
  value,
  onChange,
  onSubmit,
  pending,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  pending: boolean;
}) {
  const id = useId();
  const [suggestions, setSuggestions] = useState<
    { address: string; source: string }[]
  >([]);
  const [index, setIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    let active = true;
    if (value.length < 2) {
      return;
    }
    setSearching(true);
    api<{ address: string; source: string }[]>(
      `/api/locations?q=${encodeURIComponent(value)}`,
    )
      .then((v) => {
        if (active) {
          setSuggestions(v);
          setIndex(-1);
        }
      })
      .catch(() => {
        if (active) setSuggestions([]);
      })
      .finally(() => {
        if (active) setSearching(false);
      });
    return () => {
      active = false;
    };
  }, [value]);
  return (
    <form
      className="address-form"
      onSubmit={(e) => {
        e.preventDefault();
        setOpen(false);
        onSubmit();
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
            aria-controls={`${id}-list`}
            aria-activedescendant={
              open && index >= 0 ? `${id}-${index}` : undefined
            }
            value={value}
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
                setIndex((i) => Math.max(i - 1, 0));
              }
              if (e.key === "Escape") setOpen(false);
              if (
                e.key === "Enter" &&
                open &&
                index >= 0 &&
                suggestions[index]
              ) {
                e.preventDefault();
                onChange(suggestions[index].address);
                setOpen(false);
              }
            }}
          />
          {open && suggestions.length > 0 && (
            <ul role="listbox" id={`${id}-list`} className="suggestions">
              {suggestions.slice(0, 5).map((s, i) => (
                <li
                  key={s.address}
                  id={`${id}-${i}`}
                  role="option"
                  aria-selected={i === index}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(s.address);
                    setOpen(false);
                  }}
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
      <small aria-live="polite">
        {searching
          ? "Demo-Adressen werden gesucht."
          : "Adresse manuell erfassen oder einen gekennzeichneten Demo-Standort wählen."}
      </small>
    </form>
  );
}
export function Landing({ mode }: { mode: string }) {
  const [address, setAddress] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<{ id: string; address: string } | null>(
    null,
  );
  const router = useRouter();
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("gateway-draft");
      if (saved) {
        const d = JSON.parse(saved);
        setDraft(d);
        setAddress(d.address);
      }
    } catch {}
  }, []);
  async function start() {
    setPending(true);
    setError("");
    try {
      if (draft && draft.address === address) {
        router.push(`/standortcheck/${draft.id}/1`);
        return;
      }
      await api("/api/session", "POST", { role: "OWNER" });
      const p = await api<Project>("/api/drafts", "POST", { address });
      sessionStorage.setItem(
        "gateway-draft",
        JSON.stringify({ id: p.id, address: p.answers.address }),
      );
      router.push(`/standortcheck/${p.id}/1`);
    } catch (e) {
      setError((e as Error).message);
      setPending(false);
    }
  }
  const addressProps = {
    value: address,
    onChange: setAddress,
    onSubmit: start,
    pending,
  };
  return (
    <>
      <Header mode={mode} />
      <main id="main" className="landing-page">
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="overline hero-overline">
              GROSSE FLÄCHEN.
              <br />
              ECHTES POTENZIAL.
            </p>
            <h1>
              <span className="hero-line">Wie viel</span>{" "}
              <span className="hero-line">Energiepotenzial</span>{" "}
              <span className="hero-line">steckt in Ihrer</span>{" "}
              <span className="hero-line hero-property">
                Gewerbe&shy;immobilie?
              </span>
            </h1>
            <p className="lead">
              Standort erfassen. Projektpotenzial einordnen. Fachlich prüfen
              lassen.
            </p>
            <AddressEntry {...addressProps} />
            <ErrorNotice message={error} />
            {draft && (
              <p className="meta">
                Ein Entwurf ist vorhanden.{" "}
                <Link href={`/standortcheck/${draft.id}/1`}>
                  Entwurf fortsetzen
                </Link>{" "}
                ·{" "}
                <button
                  className="text-button"
                  onClick={() => {
                    setDraft(null);
                    setAddress("");
                    sessionStorage.removeItem("gateway-draft");
                  }}
                >
                  Neuen Standort beginnen
                </button>
              </p>
            )}
          </div>
          <LandingAerial />
          <div className="hero-stages" aria-label="Der Weg zum Projekt">
            <span className="active">01 Standort</span>
            <span>02 Qualifizierung</span>
            <span>03 Fachliche Prüfung</span>
          </div>
        </section>
        <section id="ablauf" className="section wrap">
          <p className="overline">DER WEG ZUM PROJEKT</p>
          <h2>Von der Fläche zum Energieprojekt</h2>
          <div className="process-grid">
            {[
              [
                "Standort erfassen",
                "Geben Sie die Adresse Ihrer Immobilie oder Fläche an und ordnen Sie den Standort zu.",
              ],
              [
                "Projekt qualifizieren",
                "Ergänzen Sie Objekt, Energieprofil und vorhandene Unterlagen. Gateway strukturiert Ihre Angaben und macht offene Punkte sichtbar.",
              ],
              [
                "Fachlich prüfen lassen",
                "Übermitteln Sie Ihre Projektakte gezielt an den angezeigten Fachpartner.",
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
        <section className="section wrap editorial-split">
          <LandingAerial />
          <div>
            <p className="overline">DER DIGITALE STANDORTCHECK</p>
            <h2>Ein Standortcheck, der die richtigen Fragen stellt</h2>
            <p className="lead">
              Sie ergänzen die Angaben. Gateway macht die offenen Punkte
              sichtbar.
            </p>
            {[
              [Building, "Objekt und Fläche"],
              [Flash, "Energieprofil"],
              [Document, "Vorhandene Unterlagen"],
            ].map(([Icon, title]) => {
              const Component = Icon as typeof Building;
              return (
                <div key={String(title)} className="editorial-line">
                  <Component size={24} />
                  <span>{String(title)}</span>
                </div>
              );
            })}
            <p className="muted">
              Zehn Schritte. Unbekannte Werte bleiben offen. Ohne Pflichtkonto
              vor dem Ergebnis.
            </p>
          </div>
        </section>
        <section className="section wrap score-preview">
          <p className="overline">NACHVOLLZIEHBARE EINORDNUNG</p>
          <h2>Ein Score. Eine nachvollziehbare Grundlage.</h2>
          <div className="preview-grid">
            <div>
              <div className="score-number">
                82<span>/100</span>
              </div>
              <h3 className="amber">Hohe Priorität</h3>
              <p className="meta">
                Synthetisches UI-Beispiel · Vorläufig
                <br />
                Keine technische Freigabe
              </p>
            </div>
            <div>
              {[
                ["Nutzbare Fläche", 13, 15],
                ["Solar-/Ertragspotenzial", 12, 15],
                ["Verbrauch / Eigenverbrauch", 18, 20],
                ["Entscheidungssituation", 15, 15],
              ].map(([label, value, max]) => (
                <div className="preview-factor" key={label}>
                  <span>{label}</span>
                  <div className="mini-axis">
                    <div
                      className="bar-max"
                      style={{ width: `${Number(max) * 5}%` }}
                    >
                      <i
                        style={{
                          width: `${(Number(value) / Number(max)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="mono">
                    {value}/{max}
                  </span>
                </div>
              ))}
              <Link className="text-link" href="/beispiel">
                Bewertung erklären · alle 9 Faktoren <ArrowRight size={20} />
              </Link>
            </div>
            <div className="preview-findings">
              <h3>Dafür spricht</h3>
              <p>Fläche angegeben, Entscheidungsträger benannt.</p>
              <h3>Zu klären</h3>
              <p>Netzanschluss und Tragfähigkeit noch nicht geprüft.</p>
            </div>
          </div>
        </section>
        <section className="section wrap">
          <p className="overline">PROJEKTARTEN</p>
          <h2>Welches Projekt steckt in Ihrer Fläche?</h2>
          <div className="project-types">
            {[
              [
                "Gewerbedach-PV",
                "Untersuchen Sie, ob eine gewerbliche Dachfläche für ein PV-Projekt weiter geprüft werden sollte.",
              ],
              [
                "PV-Erweiterung",
                "Ordnen Sie zusätzliche Flächen und eine vorhandene Anlage in eine strukturierte Projektanfrage ein.",
              ],
              [
                "Speicherprojekt",
                "Stellen Sie Verbrauch, vorhandene Anlagen und Ihr Speicherziel zusammen.",
              ],
              [
                "Freiflächenprojekt",
                "Erfassen Sie unbebaute Flächen, Nutzung und Verfügungsrechte für eine erste Einordnung.",
              ],
            ].map(([title, text], i) => (
              <article key={title}>
                <span className="mono muted">0{i + 1}</span>
                <img
                  className="project-type-image"
                  src={`/atlas/atlas-reference-${["roof", "extension", "storage", "ground"][i]}.webp`}
                  alt=""
                  width={170}
                  height={73}
                  loading="lazy"
                />
                <h3>{title}</h3>
                <p>{text}</p>
                <ArrowRight size={24} aria-hidden />
              </article>
            ))}
          </div>
          <p className="meta project-image-source">
            Illustrative Bildausschnitte aus der Atlas-Referenz.
          </p>
        </section>
        <section className="section wrap editorial-split text-split">
          <div>
            <p className="overline">FÜR EIGENTÜMER UND UNTERNEHMEN</p>
            <h2>Für Flächen mit Verantwortung</h2>
          </div>
          <ul className="audience-list">
            {[
              "Eigentümer von Gewerbeimmobilien",
              "Industrieunternehmen",
              "Logistikunternehmen",
              "Landwirtschaft",
              "Gewerbeparks",
              "Größere Bestandshalter",
              "Asset Manager",
            ].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
        <section className="section wrap" id="projektpartner">
          <p className="overline">KLARE VERANTWORTUNG</p>
          <h2>
            Digital vorbereitet.
            <br />
            Fachlich geprüft.
          </h2>
          <div className="editorial-split text-split">
            <p className="lead">
              Project Gateway bereitet Ihre Projektangaben digital auf. Die
              fachliche Bewertung und Entscheidung übernimmt der benannte
              Projektpartner.
            </p>
            <div>
              {[
                "Nachvollziehbare Kriterien",
                "Klare Datenherkunft",
                "Benannter Empfänger",
              ].map((s) => (
                <div className="editorial-line" key={s}>
                  <span className="amber">↗</span>
                  {s}
                </div>
              ))}
              <Link className="text-link" href="/partner/login">
                Zum Partnerbereich <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
        <section className="section wrap faq">
          <p className="overline">GUT ZU WISSEN</p>
          <h2>Häufige Fragen</h2>
          {faq.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
        <section className="section wrap closing">
          <h2>Beginnen wir mit Ihrem Standort.</h2>
          <AddressEntry {...addressProps} />
        </section>
      </main>
      <Footer />
    </>
  );
}
