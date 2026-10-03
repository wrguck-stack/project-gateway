"use client";

import { useId, useRef, useState } from "react";
import { ArrowRight } from "@carbon/icons-react";
import type { ProjectIntent } from "./landing-content";
import "./site-situations.css";

type SiteSituation = {
  title: string;
  statement: string;
  question: string;
  explanation: string;
  inputs: readonly [string, string, string];
  intent?: ProjectIntent;
};

const situations: readonly SiteSituation[] = [
  {
    title: "Hoher Stromverbrauch",
    statement: "Ihr Betrieb braucht Strom.",
    question: "Zu welchen Zeiten?",
    explanation:
      "Tagsüber, nachts oder rund um die Uhr: Ihr Verbrauchsprofil ist der Ausgangspunkt für die Frage, wie eigene Erzeugung und Speicher dazu passen.",
    inputs: [
      "Jahresverbrauch und Stromabrechnung",
      "Betriebszeiten oder vorhandener Lastgang",
      "Vorhandene Anlagen und Anschlussunterlagen",
    ],
  },
  {
    title: "PV bereits vorhanden",
    statement: "Ihre PV ist schon da.",
    question: "Was soll dazukommen?",
    explanation:
      "Mehr Eigenverbrauch, ein Speicher oder zusätzliche Erzeugung: Zuerst zählt der vorhandene Anlagenbestand.",
    inputs: [
      "Leistung und Baujahr",
      "Erzeugung und Verbrauch",
      "Anschlussunterlagen",
    ],
    intent: "extension",
  },
  {
    title: "Ungenutzte Dachfläche",
    statement: "Ihr Dach bietet Fläche.",
    question: "Was lässt sich daraus machen?",
    explanation:
      "Bevor Module geplant werden, müssen Dachzustand, Tragfähigkeit, Nutzungsrechte und der Anschluss gemeinsam betrachtet werden.",
    inputs: [
      "Dachfläche und bekannter Sanierungsbedarf",
      "Eigentumsverhältnis und vorhandene Statik",
      "Stromverbrauch und Anschlussunterlagen",
    ],
    intent: "roof",
  },
];

export function SiteSituations({
  onStart,
}: {
  onStart: (intent?: ProjectIntent) => void;
}) {
  const [active, setActive] = useState(1);
  const id = useId();
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <section
      id="ausgangslage"
      className="site-situations"
      aria-labelledby={`${id}-heading`}
    >
      <div className="site-situations-inner">
        <header className="site-situations-heading">
          <div>
            <p className="site-situations-kicker">Ausgangslage</p>
            <h2 id={`${id}-heading`}>Was bringt Ihr Betrieb mit?</h2>
          </div>
          <p>Passenden Einstieg ansehen.</p>
        </header>

        <p className="site-situations-cue" id={`${id}-cue`}>
          Wählen Sie eine Ausgangslage. Danach sehen Sie, wie Sie beginnen
          können.
        </p>
        <div
          className="site-situations-tabs"
          role="tablist"
          aria-label="Ihre Ausgangslage"
          aria-describedby={`${id}-cue`}
        >
          {situations.map((situation, index) => (
            <button
              key={situation.title}
              type="button"
              role="tab"
              className="site-situations-tab"
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
                    ? (index + 1) % situations.length
                    : event.key === "ArrowLeft"
                      ? (index + situations.length - 1) % situations.length
                      : event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? situations.length - 1
                          : null;
                if (next !== null) {
                  event.preventDefault();
                  setActive(next);
                  triggers.current[next]?.focus();
                }
              }}
            >
              {situation.title}
            </button>
          ))}
        </div>

        {situations.map((situation, index) => (
          <div
            key={situation.title}
            className="site-situations-panel"
            id={`${id}-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${index}`}
            tabIndex={0}
            hidden={active !== index}
          >
            <div className="site-situations-question">
              <h3>
                <strong>{situation.statement}</strong>
                <span>{situation.question}</span>
              </h3>
              <p>{situation.explanation}</p>
            </div>
            <div className="site-situations-next">
              <p className="site-situations-label">Hilfreiche Angaben</p>
              <ul>
                {situation.inputs.map((input) => (
                  <li key={input}>{input}</li>
                ))}
              </ul>
              <p className="site-situations-note">
                Später ergänzbar – Unbekanntes kann offen bleiben.
              </p>
              <button
                type="button"
                className="site-situations-action"
                onClick={() => onStart(situation.intent)}
                aria-haspopup="dialog"
              >
                <span>Standort angeben</span>
                <ArrowRight size={22} aria-hidden="true" />
              </button>
              <p className="site-situations-helper">
                Danach erfassen Sie die Angaben zu Ihrem Vorhaben.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
