"use client";

import { useId, useRef, useState } from "react";
import { Add, ArrowRight, Subtract } from "@carbon/icons-react";
import type { ProjectIntent } from "./landing-content";
import "./site-situations.css";

type SiteSituation = {
  title: string;
  question: string;
  explanation: string;
  inputs: readonly [string, string, string];
  action: string;
  intent?: ProjectIntent;
};

const situations: readonly SiteSituation[] = [
  {
    title: "Hoher Stromverbrauch",
    question: "Wann braucht Ihr Betrieb den Strom?",
    explanation:
      "Ihre Verbrauchszeiten entscheiden mit darüber, ob eigene Erzeugung oder ein Speicher näher geprüft werden sollte. Der Jahresverbrauch allein reicht dafür nicht.",
    inputs: [
      "Jahresverbrauch und Stromabrechnung",
      "Betriebszeiten oder vorhandener Lastgang",
      "Vorhandene Anlagen und Anschlussunterlagen",
    ],
    action: "Mein Verbrauchsprofil erfassen",
  },
  {
    title: "PV bereits vorhanden",
    question: "Was soll Ihre bestehende PV-Anlage künftig leisten?",
    explanation:
      "Mehr Eigenverbrauch, zusätzliche Module oder ein Speicher: Ausgangspunkt der fachlichen Prüfung sind Ihre Bestandsanlage und der Verbrauch am Standort.",
    inputs: [
      "Leistung und Inbetriebnahme der PV-Anlage",
      "Eigennutzung, Einspeisung und Verbrauchszeiten",
      "Freie Dachfläche und Anschlussunterlagen",
    ],
    action: "Meine PV-Erweiterung vorbereiten",
    intent: "extension",
  },
  {
    title: "Ungenutzte Dachfläche",
    question: "Was muss vor der Belegung Ihres Dachs geklärt sein?",
    explanation:
      "Fläche allein macht noch kein PV-Projekt. Dachzustand, Tragfähigkeit, Nutzungsrechte und Anschluss gehören gemeinsam in die fachliche Prüfung.",
    inputs: [
      "Dachfläche und bekannter Sanierungsbedarf",
      "Eigentumsverhältnis und vorhandene Statik",
      "Stromverbrauch und Anschlussunterlagen",
    ],
    action: "Meine Dachfläche erfassen",
    intent: "roof",
  },
];

export function SiteSituations({
  onStart,
}: {
  onStart: (intent?: ProjectIntent) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const id = useId();
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <section
      id="ausgangslage"
      className="section wrap site-situations"
      aria-labelledby={`${id}-heading`}
    >
      <p className="overline">01 / WO STEHEN SIE HEUTE?</p>
      <div className="site-situations-heading">
        <h2 id={`${id}-heading`}>
          Was trifft auf Ihren <em>Betrieb zu?</em>
        </h2>
        <p>
          Wählen Sie Ihre Ausgangslage. Sie sehen, welche Frage zuerst zu klären
          ist und welche Angaben dafür helfen.
        </p>
      </div>

      <div className="site-situations-list">
        {situations.map((situation, index) => {
          const open = expanded === index;
          const triggerId = `${id}-trigger-${index}`;
          const panelId = `${id}-panel-${index}`;

          return (
            <article
              key={situation.title}
              className={`site-situation${open ? " is-open" : ""}`}
            >
              <h3>
                <button
                  type="button"
                  className="site-situation-trigger"
                  ref={(element) => {
                    triggers.current[index] = element;
                  }}
                  id={triggerId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setExpanded(open ? null : index)}
                  onKeyDown={(event) => {
                    const next =
                      event.key === "ArrowDown"
                        ? (index + 1) % situations.length
                        : event.key === "ArrowUp"
                          ? (index + situations.length - 1) % situations.length
                          : event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? situations.length - 1
                              : null;
                    if (next !== null) {
                      event.preventDefault();
                      triggers.current[next]?.focus();
                    }
                  }}
                >
                  <span className="site-situation-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="site-situation-title">
                    {situation.title}
                  </span>
                  <span className="site-situation-toggle" aria-hidden="true">
                    {open ? <Subtract size={24} /> : <Add size={24} />}
                  </span>
                </button>
              </h3>

              <div
                className="site-situation-panel"
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                hidden={!open}
              >
                <div className="site-situation-question">
                  <p className="site-situation-label">ZUERST KLÄREN</p>
                  <h4>{situation.question}</h4>
                  <p>{situation.explanation}</p>
                </div>
                <div className="site-situation-next">
                  <p className="site-situation-label">
                    DIESE DREI ANGABEN HELFEN
                  </p>
                  <ul>
                    {situation.inputs.map((input) => (
                      <li key={input}>{input}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => onStart(situation.intent)}
                    aria-haspopup="dialog"
                  >
                    {situation.action}
                    <ArrowRight size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="site-situations-note">
        Noch nicht alles zur Hand? Unbekannte Werte können im Standortcheck
        offen bleiben.
      </p>
    </section>
  );
}
