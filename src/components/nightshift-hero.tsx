"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ArrowRight } from "@carbon/icons-react";
import type { ProjectIntent } from "./landing-content";
import "./nightshift-hero.css";

const COMPACT_IMAGE_MEDIA = "(max-width: 900px)";

const stations: {
  id: string;
  name: string;
  question: string;
  action: string;
  intent?: ProjectIntent;
  x: number;
  y: number;
  wideX: number;
  wideY: number;
}[] = [
  {
    id: "roof",
    name: "Dachfläche",
    question: "Welche Fläche steht zur Verfügung?",
    action: "Meine Dachfläche erfassen",
    intent: "roof",
    x: 50,
    y: 26,
    wideX: 50,
    wideY: 32,
  },
  {
    id: "grid",
    name: "Netzanschluss",
    question: "Welche Leistung steht zur Verfügung?",
    action: "Anschlussunterlagen erfassen",
    x: 29,
    y: 74,
    wideX: 32.5,
    wideY: 80,
  },
  {
    id: "storage",
    name: "Speicher",
    question: "Wann braucht Ihr Betrieb den Strom?",
    action: "Mein Speicherprojekt vorbereiten",
    intent: "storage",
    x: 83,
    y: 61,
    wideX: 74.5,
    wideY: 74,
  },
];

export function NightshiftHero({
  onStart,
  children,
}: {
  onStart: (intent?: ProjectIntent) => void;
  children?: ReactNode;
}) {
  const [active, setActive] = useState(1);
  const [compactImage, setCompactImage] = useState(false);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const scene = useRef<HTMLDivElement>(null);
  const station = stations[active];

  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const media = window.matchMedia(COMPACT_IMAGE_MEDIA);
    const fitScene = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      const compact = media.matches;
      setCompactImage(compact);
      const ratio = compact ? 1.5 : 2010 / 782;
      const planeWidth = Math.max(width, height * ratio);
      const planeHeight = planeWidth / ratio;
      // Move the complete photo/marker plane, never individual coordinates.
      // Keep each 44px hit area inside the crop whenever the aspect ratio permits.
      const cropOffset = (centered: number, lower: number, upper: number) =>
        lower <= upper ? Math.max(lower, Math.min(upper, centered)) : centered;
      const left = cropOffset(
        (width - planeWidth) / 2,
        24 - planeWidth * (compact ? 0.29 : 0.325),
        width - 24 - planeWidth * (compact ? 0.83 : 0.745),
      );
      const top = cropOffset(
        (height - planeHeight) / 2,
        24 - planeHeight * (compact ? 0.26 : 0.32),
        height - 24 - planeHeight * (compact ? 0.74 : 0.8),
      );
      element.style.setProperty("--scene-plane-width", `${planeWidth}px`);
      element.style.setProperty("--scene-plane-ratio", `${ratio}`);
      element.style.setProperty(
        "--scene-plane-center-x",
        `${left + planeWidth / 2}px`,
      );
      element.style.setProperty(
        "--scene-plane-center-y",
        `${top + planeHeight / 2}px`,
      );
    };
    const observer = new ResizeObserver(fitScene);
    observer.observe(element);
    media.addEventListener("change", fitScene);
    fitScene();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", fitScene);
    };
  }, []);

  const focusStation = (index: number) => {
    setActive(index);
    tabs.current[index]?.focus();
  };

  return (
    <section
      className="nightshift-hero"
      id="standort-start"
      aria-labelledby="nightshift-hero-title"
      data-stage={station.id}
    >
      <div className="nightshift-hero-heading">
        <h1 id="nightshift-hero-title">
          <span className="nightshift-hero-statement">PV geplant.</span>{" "}
          <span className="nightshift-hero-question">
            Die richtigen <br />
            Fragen zuerst.
          </span>
        </h1>
        <p className="nightshift-hero-intro">
          Dachfläche, Stromverbrauch und Netzanschluss gemeinsam betrachten.
        </p>
      </div>

      <figure className="nightshift-hero-visual">
        <div className="energy-scene" ref={scene}>
          {/* Image and markers share one native coordinate plane for each crop. */}
          <div className="energy-scene-plane">
            <picture>
              <source
                media={COMPACT_IMAGE_MEDIA}
                srcSet="/energy/gateway-energy-site-v3-night.webp"
              />
              <Image
                className="nightshift-hero-photo"
                src="/energy/gateway-energy-site-v4-panorama.webp"
                width={2010}
                height={782}
                sizes="100vw"
                loading="eager"
                fetchPriority="high"
                unoptimized
                alt="Fotorealistische KI-Visualisierung eines Gewerbestandorts bei Nacht: PV auf dem Hallendach, Batteriespeicher rechts und eine Trafostation im Vordergrund."
              />
            </picture>
            {stations.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`energy-hotspot energy-hotspot-${item.id}`}
                style={{
                  left: `${compactImage ? item.x : item.wideX}%`,
                  top: `${compactImage ? item.y : item.wideY}%`,
                }}
                aria-label={`${item.name} im Standortbild erkunden`}
                aria-pressed={active === index}
                aria-controls={`${id}-panel`}
                onClick={() => setActive(index)}
              >
                <span className="energy-hotspot-dot" aria-hidden="true" />
                <span className="energy-hotspot-leader" aria-hidden="true" />
                <span className="energy-hotspot-label" aria-hidden="true">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        <figcaption className="nightshift-hero-context">
          <div
            id={`${id}-panel`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${active}`}
            tabIndex={0}
          >
            <p className="nightshift-context-label">{station.name}</p>
            <p className="nightshift-context-question">{station.question}</p>
            <button
              type="button"
              className="nightshift-context-action"
              aria-haspopup="dialog"
              onClick={() => onStart(station.intent)}
            >
              <span>{station.action}</span>
              <ArrowRight size={20} aria-hidden />
            </button>
          </div>
        </figcaption>
      </figure>

      <div className="nightshift-hero-controls">
        <div
          className="nightshift-hero-stations"
          role="tablist"
          aria-label="Bestandteile Ihres Standorts"
        >
          {stations.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              aria-selected={active === index}
              aria-controls={`${id}-panel`}
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                let next: number | undefined;
                if (event.key === "ArrowRight")
                  next = (index + 1) % stations.length;
                if (event.key === "ArrowLeft")
                  next = (index - 1 + stations.length) % stations.length;
                if (event.key === "Home") next = 0;
                if (event.key === "End") next = stations.length - 1;
                if (next !== undefined) {
                  event.preventDefault();
                  focusStation(next);
                }
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        <button
          className="nightshift-hero-primary"
          type="button"
          aria-haspopup="dialog"
          onClick={() => onStart()}
        >
          Meinen Standort prüfen
          <ArrowRight size={22} aria-hidden />
        </button>
      </div>
      {children && <div className="nightshift-hero-return">{children}</div>}
    </section>
  );
}
