"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { Pause, Play, Restart } from "@carbon/icons-react";
import "./nightshift-hero.css";

const stages = [
  {
    name: "Netzanschluss",
    short: "Netz",
    position: 0,
    title: "Der Anschluss setzt den Rahmen.",
    caption:
      "Anschlussleistung, Bezug und Einspeisung bestimmen, was technisch zu prüfen ist.",
    description: "Vorhandenen Netzanschluss und verfügbare Leistung einordnen",
    x: 29,
    y: 74,
  },
  {
    name: "Dachfläche",
    short: "Dach",
    position: 34,
    title: "Erzeugung beginnt auf dem Dach.",
    caption:
      "Fläche, Dachzustand und Statik bilden die Grundlage für eine passende PV-Planung.",
    description:
      "Nutzbare Dachfläche, Dachzustand und Statik gemeinsam betrachten",
    x: 50,
    y: 26,
  },
  {
    name: "Speicher",
    short: "Speicher",
    position: 67,
    title: "Strom dann nutzen, wenn er gebraucht wird.",
    caption:
      "Ob ein Speicher passt, hängt von Erzeugung, Verbrauch und dem zeitlichen Bedarf ab.",
    description:
      "Speicher passend zu Erzeugung und zeitlichem Strombedarf prüfen",
    x: 83,
    y: 61,
  },
  {
    name: "Zusammenspiel",
    short: "Konzept",
    position: 100,
    title: "Ein Standort. Ein abgestimmtes Konzept.",
    caption:
      "Dach, Speicher und Netzanschluss werden gemeinsam mit Ihrem Verbrauch betrachtet.",
    description:
      "Erzeugung, Verbrauch, Speicher und Netzanschluss gemeinsam betrachten",
    x: 50,
    y: 50,
  },
] as const;

const DURATION = 16_000;
const SITE_IMAGE = "/energy/gateway-energy-site-v3-night.webp";

export function NightshiftHero({
  onStart,
  children,
}: {
  onStart: () => void;
  children?: ReactNode;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const progressRef = useRef(100);
  const [progress, setProgress] = useState(100);
  const [playing, setPlaying] = useState(true);
  const [manual, setManual] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);

  const updateProgress = useCallback((value: number) => {
    const bounded = Math.max(0, Math.min(100, value));
    progressRef.current = bounded;
    setProgress(bounded);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setReducedMotion(preference.matches);
      updateProgress(preference.matches ? 100 : 0);
      setPlaying(!preference.matches);
    };
    syncPreference();
    preference.addEventListener("change", syncPreference);

    const syncVisibility = () =>
      setPageVisible(document.visibilityState === "visible");
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
    };
  }, [updateProgress]);

  useEffect(() => {
    if (
      !playing ||
      !imageReady ||
      !visible ||
      !pageVisible ||
      reducedMotion !== false
    )
      return;
    let frame = 0;
    let lastTime: number | null = null;
    let lastRender = 0;
    const tick = (time: number) => {
      if (lastTime === null) lastTime = time;
      progressRef.current = Math.min(
        100,
        progressRef.current + ((time - lastTime) / DURATION) * 100,
      );
      lastTime = time;
      if (time - lastRender >= 32 || progressRef.current === 100) {
        setProgress(progressRef.current);
        lastRender = time;
      }
      if (progressRef.current < 100) frame = window.requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, imageReady, visible, pageVisible, reducedMotion]);

  const selectProgress = (value: number) => {
    setManual(true);
    setPlaying(false);
    updateProgress(value);
  };
  const togglePlayback = () => {
    if (reducedMotion !== false) return;
    if (progressRef.current >= 100) {
      setManual(false);
      updateProgress(0);
      setPlaying(true);
    } else setPlaying((value) => !value);
  };

  const stageIndex =
    progress < 25 ? 0 : progress < 50 ? 1 : progress < 75 ? 2 : 3;
  const activeStage = stages[stageIndex];
  const motionLabel = reducedMotion
    ? "Animation bei reduzierter Bewegung deaktiviert"
    : progress >= 100
      ? "Animation erneut abspielen"
      : playing
        ? "Animation pausieren"
        : "Animation fortsetzen";
  const PlaybackIcon = progress >= 100 ? Restart : playing ? Pause : Play;
  const heroStyle = {
    "--night-progress": progress / 100,
    "--night-progress-percent": `${progress}%`,
  } as CSSProperties;

  return (
    <section
      ref={heroRef}
      className="nightshift-hero"
      id="standort-start"
      aria-labelledby="nightshift-hero-title"
      data-motion={
        reducedMotion === null
          ? "pending"
          : reducedMotion
            ? "reduced"
            : playing
              ? "playing"
              : "paused"
      }
      data-stage={activeStage.name}
      style={heroStyle}
    >
      <div className="nightshift-hero-body">
        <div className="nightshift-hero-content">
          <p className="nightshift-hero-eyebrow">Energiekonzepte für Gewerbe</p>
          <h1 id="nightshift-hero-title">
            <span>Vom Stromanschluss</span> <em>zum Energiestandort.</em>
          </h1>
          <p className="nightshift-hero-intro">
            PV, Speicher und Netzanschluss: Welche Kombination passt zu Ihrem
            Betrieb?
          </p>
          <div className="nightshift-hero-actions">
            <button
              className="nightshift-hero-primary"
              type="button"
              aria-haspopup="dialog"
              onClick={onStart}
            >
              Meinen Standort prüfen
            </button>
            <Link className="nightshift-hero-secondary" href="#ausgangslage">
              Standort entdecken
            </Link>
          </div>
          {children && <div className="nightshift-hero-return">{children}</div>}
        </div>

        <figure className="nightshift-hero-visual">
          <div className="energy-scene" data-active={stageIndex}>
            <Image
              className="nightshift-hero-photo"
              src={SITE_IMAGE}
              width={1536}
              height={1024}
              sizes="(max-width: 900px) 90vw, 58vw"
              preload
              unoptimized
              alt="Fotorealistische KI-Visualisierung eines Gewerbestandorts bei Nacht: PV auf dem Hallendach, Batteriespeicher rechts und eine Trafostation im Vordergrund, mit dezenter Beleuchtung im Gewerbegebiet."
              onLoad={() => setImageReady(true)}
            />
            {stages.slice(0, 3).map((stage, index) => (
              <div
                key={stage.name}
                className={`energy-focus energy-focus-${index}`}
                data-active={stageIndex === index}
                aria-hidden="true"
              >
                <img src={SITE_IMAGE} alt="" width={1536} height={1024} />
              </div>
            ))}
            {stages.slice(0, 3).map((stage, index) => (
              <button
                key={stage.name}
                type="button"
                className="energy-hotspot"
                style={{ left: `${stage.x}%`, top: `${stage.y}%` }}
                aria-label={`${stage.name} im Standortbild erkunden`}
                aria-pressed={stageIndex === index}
                aria-controls="nightshift-stage-description"
                onClick={() => selectProgress(stage.position)}
              >
                <span className="energy-hotspot-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <span className="energy-hotspot-label" aria-hidden="true">
                  {stage.name}
                </span>
              </button>
            ))}
          </div>
          <figcaption
            id="nightshift-stage-description"
            aria-live={manual ? "polite" : "off"}
          >
            <span className="energy-caption-number" aria-hidden="true">
              0{stageIndex + 1}
            </span>
            <div>
              <strong>{activeStage.title}</strong>
              <p>{activeStage.caption}</p>
            </div>
          </figcaption>
        </figure>
      </div>

      <div
        className="nightshift-hero-controls"
        aria-label="Energiekonzept entdecken"
        role="group"
      >
        <button
          className="nightshift-hero-playback"
          type="button"
          aria-label={motionLabel}
          title={motionLabel}
          aria-describedby={
            reducedMotion ? "nightshift-motion-help" : undefined
          }
          disabled={!imageReady || reducedMotion !== false}
          onClick={togglePlayback}
        >
          <PlaybackIcon size={24} aria-hidden />
        </button>
        <div className="nightshift-hero-timeline">
          <div className="nightshift-hero-stages">
            {stages.map((stage, index) => (
              <button
                key={stage.name}
                type="button"
                onClick={() => selectProgress(stage.position)}
                aria-pressed={stageIndex === index}
                aria-controls="nightshift-stage-description"
                aria-label={stage.name}
              >
                <span className="stage-full">{stage.name}</span>
                <span className="stage-short" aria-hidden="true">
                  {stage.short}
                </span>
              </button>
            ))}
          </div>
          <input
            className="nightshift-hero-range"
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(progress)}
            aria-label="Energiekonzept erkunden"
            aria-valuetext={activeStage.description}
            onChange={(event) =>
              selectProgress(Number(event.currentTarget.value))
            }
          />
          <p className="nightshift-sr-only" id="nightshift-motion-help">
            Die Animation hebt Netzanschluss, Dach und Speicher im Standortbild
            nacheinander hervor. Wählen Sie eine Station oder bedienen Sie den
            Regler mit den Pfeiltasten. Bei reduzierter Bewegung bleibt das Bild
            ruhig.
          </p>
        </div>
      </div>
    </section>
  );
}
