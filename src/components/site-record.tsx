"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@carbon/icons-react";
import "./site-record.css";

const records = [
  {
    id: "roof",
    label: "Dach",
    heading: "Dachfläche",
    alt: "Detail der Dachfläche der KI-visualisierten Logistikhalle",
    rows: [
      ["Stand", "Nutzbare Fläche noch offen"],
      ["Herkunft", "Angabe des Eigentümers"],
      ["Nächster Schritt", "Dachplan und Statik ergänzen"],
    ],
  },
  {
    id: "consumption",
    label: "Verbrauch",
    heading: "Stromverbrauch",
    alt: "Beleuchtete Betriebsräume der KI-visualisierten Logistikhalle",
    rows: [
      ["Stand", "Verbrauchszeiten angegeben"],
      ["Herkunft", "Nutzerauskunft · noch unbelegt"],
      ["Nächster Schritt", "Stromabrechnung und Lastgang ergänzen"],
    ],
  },
  {
    id: "connection",
    label: "Anschluss",
    heading: "Netzanschluss",
    alt: "Detail der Netzanschlussstation der KI-visualisierten Logistikhalle",
    rows: [
      ["Stand", "Noch zu klären"],
      ["Benötigt", "Anschlussunterlagen"],
      ["Nächster Schritt", "Verfügbare Leistung erfassen"],
    ],
  },
] as const;

export function SiteRecord() {
  const [active, setActive] = useState(2);
  const id = useId();
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <section
      id="projektakte"
      className="site-record"
      aria-labelledby={`${id}-heading`}
    >
      <div className="site-record-inner">
        <header className="site-record-heading">
          <div>
            <p className="site-record-kicker">Ergebnis vorab ansehen</p>
            <h2 id={`${id}-heading`}>
              Offene Fragen
              <br />
              gehören auf den Tisch.
            </h2>
          </div>
          <div className="site-record-controls">
            <p className="site-record-control-label" id={`${id}-controls`}>
              Bereich ansehen
            </p>
            <div
              className="site-record-tabs"
              role="tablist"
              aria-label="Bereiche der Projektakte"
              aria-describedby={`${id}-controls`}
            >
              {records.map((record, index) => (
                <button
                  key={record.id}
                  type="button"
                  role="tab"
                  className="site-record-tab"
                  ref={(element) => {
                    triggers.current[index] = element;
                  }}
                  id={`${id}-tab-${index}`}
                  aria-selected={active === index}
                  aria-controls={`${id}-panel-${index}`}
                  tabIndex={active === index ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => {
                    const next =
                      event.key === "ArrowRight"
                        ? (index + 1) % records.length
                        : event.key === "ArrowLeft"
                          ? (index + records.length - 1) % records.length
                          : event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? records.length - 1
                              : null;
                    if (next !== null) {
                      event.preventDefault();
                      setActive(next);
                      triggers.current[next]?.focus();
                    }
                  }}
                >
                  {record.label}
                </button>
              ))}
            </div>
          </div>
          <p className="site-record-intro">
            Ihre Angaben, ihre Herkunft und der nächste Klärungsbedarf bleiben
            zusammen.
          </p>
        </header>

        {records.map((record, index) => (
          <div
            key={record.id}
            className="site-record-panel"
            id={`${id}-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${index}`}
            tabIndex={0}
            hidden={active !== index}
          >
            <figure className="site-record-figure">
              <div
                className={`site-record-image site-record-image-${record.id}`}
              >
                <Image
                  src="/energy/gateway-energy-site-v3-night.webp"
                  alt={record.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 700px) 100vw, 40vw"
                />
              </div>
              <figcaption>Logistikhalle · Beispiel</figcaption>
            </figure>
            <div className="site-record-details">
              <h3>{record.heading}</h3>
              <dl>
                {record.rows.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ))}

        <footer className="site-record-footer">
          <p>Ein gemeinsamer Stand für das nächste Fachgespräch.</p>
          <Link href="/beispiel" className="site-record-action">
            Beispielakte öffnen
            <ArrowRight size={22} aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </section>
  );
}
