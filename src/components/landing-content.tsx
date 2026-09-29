"use client";
import { useId, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Checkmark,
  ChevronDown,
  Document,
  WarningAlt,
} from "@carbon/icons-react";
import { Field, Options, SelectField } from "./ui";
import examples from "@/data/analytics-examples.json";

export const projectTypes = [
  {
    id: "roof",
    title: "Gewerbedach-PV",
    eyebrow: "DACHFLÄCHEN NUTZEN",
    text: "Bringen Sie Dachfläche, Strombedarf und Eigentumssituation zusammen. So wird sichtbar, welche Fragen vor einer PV-Planung zu klären sind.",
    image: "gateway-industrial-hero-v2.webp",
    action: "Dachprojekt vorbereiten",
  },
  {
    id: "extension",
    title: "PV-Erweiterung",
    eyebrow: "BESTAND WEITERDENKEN",
    text: "Erfassen Sie Ihre bestehende Anlage und zusätzliche Flächen. Bereiten Sie die Prüfung einer Erweiterung mit den relevanten Angaben vor.",
    image: "gateway-extension-v2.webp",
    action: "Erweiterung vorbereiten",
  },
  {
    id: "storage",
    title: "Speicherprojekt",
    eyebrow: "ENERGIE GEZIELT EINSETZEN",
    text: "Bündeln Sie Verbrauch, Lastprofil und vorhandene Anlagen. Eine klare Grundlage für die Frage, ob ein Speicher näher untersucht werden sollte.",
    image: "gateway-storage-v2.webp",
    action: "Speicherprojekt vorbereiten",
  },
  {
    id: "ground",
    title: "Freiflächenprojekt",
    eyebrow: "FLÄCHEN NEU BETRACHTEN",
    text: "Halten Sie Größe, aktuelle Nutzung und Verfügungsrechte fest. Genehmigung und Netzanschluss bleiben als eigene Prüfschritte sichtbar.",
    image: "gateway-ground-v2.webp",
    action: "Freifläche vorbereiten",
  },
] as const;
export type ProjectIntent = (typeof projectTypes)[number]["id"];

export function DossierPreview() {
  const [tab, setTab] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = ["Objekt", "Energie", "Nächste Schritte"];
  const rows = [
    [
      ["Gebäudetyp", "Logistikhalle", "Beispielangabe"],
      ["Verfügbare Dachfläche", "ca. 4.800 m²", "Geschätzt · Nutzerauskunft"],
      ["Entscheidungssituation", "Eigentümer", "Berechtigung angegeben"],
    ],
    [
      ["Jahresverbrauch", "620.000 kWh", "Beispielwert"],
      ["Projektziel", "Eigenverbrauch steigern", "Auswahl im Standortcheck"],
      [
        "Ertrag und Wirtschaftlichkeit",
        "Fachlich zu prüfen",
        "Keine Prognose aus diesen Angaben",
      ],
    ],
    [
      [
        "Tragfähigkeit",
        "Noch zu prüfen",
        "Statik oder fachlichen Nachweis ergänzen",
      ],
      [
        "Netzanschluss",
        "Noch zu klären",
        "Anschlusssituation fachlich untersuchen",
      ],
      [
        "Projektübergabe",
        "Bewusst freigeben",
        "Empfänger und Unterlagen vorher prüfen",
      ],
    ],
  ];
  return (
    <div className="dossier-preview">
      <div className="dossier-topline">
        <span className="mono">PROJEKTAKTE / BEISPIEL</span>
        <Document size={24} aria-hidden />
      </div>
      <h3>Logistikhalle Karlsruhe</h3>
      <p className="meta">Fiktives Projekt · keine Standortanalyse</p>
      <div
        role="tablist"
        aria-label="Beispiel-Projektakte"
        className="dossier-tabs"
      >
        {tabs.map((name, i) => (
          <button
            key={name}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={tab === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={tab === i ? 0 : -1}
            onClick={() => setTab(i)}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? (i + 1) % tabs.length
                  : event.key === "ArrowLeft"
                    ? (i + tabs.length - 1) % tabs.length
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? tabs.length - 1
                        : null;
              if (next !== null) {
                event.preventDefault();
                setTab(next);
                refs.current[next]?.focus();
              }
            }}
          >
            {name}
          </button>
        ))}
      </div>
      {rows.map((items, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={tab !== i}
          tabIndex={0}
        >
          <dl className="dossier-facts">
            {items.map(([label, value, source]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>
                  {value}
                  <small>{source}</small>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
      <div className="dossier-open">
        <WarningAlt size={20} aria-hidden />
        <p>Offene Prüfungen bleiben sichtbar – auch bei hoher Priorität.</p>
      </div>
      <Link href="/beispiel" className="text-link">
        Vollständige Beispielakte öffnen <ArrowRight size={20} aria-hidden />
      </Link>
    </div>
  );
}

export function LandingCheckPreview() {
  const [kind, setKind] = useState("Dach");
  const [nature, setNature] = useState("Geschätzt");
  const [area, setArea] = useState("4.800");
  const [condition, setCondition] = useState("Unbekannt");
  const numericArea = Number(area.replace(/\./g, "").replace(",", "."));
  const areaValid =
    /^(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d+)?$/.test(area) &&
    Number.isFinite(numericArea) &&
    numericArea > 0;
  const areaText =
    nature === "Noch unbekannt"
      ? "Fläche noch offen"
      : areaValid
        ? `${nature === "Geschätzt" ? "ca. " : ""}${new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(numericArea)} m² ${kind === "Dach" ? "Dachfläche" : "Freifläche"}`
        : "Bitte eine positive Fläche eingeben.";
  return (
    <div className="check-preview" aria-label="Standortcheck ausprobieren">
      <p className="overline">HIER AUSPROBIEREN / SCHRITT 3 VON 10</p>
      <h3>Welche Fläche steht zur Verfügung?</h3>
      <Options
        label="Art der verfügbaren Fläche"
        name="preview-area-kind"
        value={kind}
        options={["Dach", "Freifläche"]}
        onChange={setKind}
      />
      <div className="check-preview-pair">
        <SelectField
          label="Genauigkeit der Fläche"
          value={nature}
          options={["Genau bekannt", "Geschätzt", "Noch unbekannt"]}
          onChange={setNature}
        />
        {nature !== "Noch unbekannt" && (
          <Field
            label="Verfügbare Fläche · m²"
            value={area}
            inputMode="decimal"
            onChange={(e) => setArea(e.target.value)}
            aria-invalid={!areaValid || undefined}
            help={
              !areaValid
                ? "Bitte eine positive Fläche eingeben, zum Beispiel 4.800."
                : undefined
            }
            maxLength={16}
          />
        )}
      </div>
      {kind === "Dach" && (
        <SelectField
          label="Dachzustand (Nutzerauskunft)"
          value={condition}
          options={[
            "Keine Sanierung bekannt",
            "Sanierung geplant",
            "Unbekannt",
          ]}
          onChange={setCondition}
        />
      )}
      <div className="check-live-summary" role="status">
        <span className="meta">
          So bleibt die Angabe in der Akte nachvollziehbar:
        </span>
        <strong>{areaText}</strong>
        <p>
          {kind === "Dach"
            ? `Dachzustand: ${condition}. Tragfähigkeit bleibt fachlich zu prüfen.`
            : "Nutzung, Verfügungsrechte und Genehmigung sind separat zu klären."}
        </p>
      </div>
      <p className="meta">
        Interaktives Beispiel. Diese Eingaben werden nicht gespeichert und
        verändern keinen Score.
      </p>
    </div>
  );
}

export function ProjectTypes({
  selected,
  onSelect,
}: {
  selected?: ProjectIntent;
  onSelect: (intent: ProjectIntent) => void;
}) {
  const [expanded, setExpanded] = useState<ProjectIntent | null>("roof");
  return (
    <div className="project-types">
      {projectTypes.map((p, i) => (
        <article
          key={p.id}
          className={
            expanded === p.id ? "project-type expanded" : "project-type"
          }
        >
          <h3>
            <button
              type="button"
              aria-expanded={expanded === p.id}
              aria-controls={`type-${p.id}`}
              onClick={() =>
                setExpanded((current) => (current === p.id ? null : p.id))
              }
            >
              <span className="mono muted">0{i + 1}</span>
              <span>{p.title}</span>
              <span className="project-type-action">
                {expanded === p.id ? "Details schließen" : "Details ansehen"}
                <ChevronDown size={20} aria-hidden />
              </span>
            </button>
          </h3>
          <div
            className="project-type-detail"
            id={`type-${p.id}`}
            hidden={expanded !== p.id}
          >
            <img
              src={`/atlas/${p.image}`}
              alt={`Illustration: ${p.title === "Gewerbedach-PV" ? "Gewerbehalle mit großer Dachfläche" : p.title}`}
              width={p.id === "roof" ? 1254 : 1536}
              height={p.id === "roof" ? 1254 : 1024}
              loading="lazy"
            />
            <div>
              <p className="overline">{p.eyebrow}</p>
              <p className="lead">{p.text}</p>
              <button
                className="button secondary"
                onClick={() => onSelect(p.id)}
              >
                {selected === p.id
                  ? "Ausgewählt · Standort eingeben"
                  : p.action}
                <ArrowRight size={20} aria-hidden />
              </button>
              <p className="meta">
                Die Auswahl wird im Standortcheck übernommen. Sie können sie
                dort ändern.
              </p>
            </div>
          </div>
        </article>
      ))}
      <p className="meta project-image-source">
        KI-generierte Illustrationen · keine realen Referenzprojekte oder
        Eignungsnachweise.
      </p>
    </div>
  );
}

export function ScorePreview() {
  const score = examples.scoreFull;
  const factors = score.factors.slice(0, 4);
  const axisMax = Math.max(...score.factors.map((f) => f.maxPoints));
  return (
    <section className="section wrap score-preview" id="bewertung">
      <div className="section-intro">
        <div>
          <p className="overline">EINORDNUNG MIT BEGRÜNDUNG</p>
          <h2>Eine Zahl braucht eine Grundlage.</h2>
        </div>
        <p>
          Sie sehen, welche Angaben für Ihr Projekt sprechen und was noch offen
          ist. Die einzelnen Beiträge bleiben nachvollziehbar.
        </p>
      </div>
      <div className="preview-grid">
        <div>
          <div className="score-number">
            {score.displayScore}
            <span>/100</span>
          </div>
          <h3 className="amber">Hohe Priorität</h3>
          <p className="meta">Beispielbewertung</p>
          <p className="preview-basis">Vorläufig · enthält Schätzwerte</p>
          <p className="meta">Keine technische Freigabe</p>
        </div>
        <div className="preview-factor-group">
          <h3>4 von 9 Faktoren</h3>
          <p className="meta">Beitrag / maximal mögliche Punkte</p>
          {factors.map(
            ({ factorId, label, contribution: value, maxPoints: max }) => (
              <div
                className="preview-factor"
                key={factorId}
                data-preview-factor={factorId}
              >
                <span>{label}</span>
                <div className="mini-axis" aria-hidden>
                  <div
                    className="bar-max"
                    style={{ width: `${(max / axisMax) * 100}%` }}
                  >
                    <i style={{ width: `${(value / max) * 100}%` }} />
                  </div>
                </div>
                <span className="mono">
                  {value}/{max}
                </span>
              </div>
            ),
          )}
          <div className="preview-factor-scale" aria-hidden>
            <span>Gemeinsame Punkteachse</span>
            <div>
              <span>0</span>
              <span>10</span>
              <span>20</span>
            </div>
          </div>
          <Link href="/beispiel#score" className="text-link">
            Bewertung erklären · alle 9 Faktoren{" "}
            <ArrowRight size={20} aria-hidden />
          </Link>
        </div>
        <div className="preview-findings">
          <h3>
            <Checkmark size={20} aria-hidden />
            Dafür spricht
          </h3>
          <p>Fläche angegeben, Entscheidungsträger benannt.</p>
          <h3>
            <WarningAlt size={20} aria-hidden />
            Zu klären
          </h3>
          <p>Netzanschluss und Tragfähigkeit noch nicht geprüft.</p>
        </div>
      </div>
    </section>
  );
}
