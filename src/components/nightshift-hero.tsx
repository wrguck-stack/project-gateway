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
    name: "Erzeugen",
    position: 0,
    caption: "Solarstrom auf dem eigenen Dach",
    description: "Solarstrom auf dem eigenen Dach erzeugen",
  },
  {
    name: "Speichern",
    position: 50,
    caption: "Strom zeitversetzt nutzen",
    description: "Solarstrom für die spätere Nutzung speichern",
  },
  {
    name: "Nutzen",
    position: 100,
    caption: "PV + Speicher + Netzanschluss",
    description: "Erzeugung, Speicher und Netzanschluss gemeinsam betrachten",
  },
] as const;

const DURATION = 8_000;

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
    setPlaying(false);
    updateProgress(value);
  };
  const togglePlayback = () => {
    if (reducedMotion !== false) return;
    if (progressRef.current >= 100) {
      updateProgress(0);
      setPlaying(true);
    } else setPlaying((value) => !value);
  };

  const stageIndex = progress < 33.34 ? 0 : progress < 66.67 ? 1 : 2;
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
      <figure className="nightshift-hero-visual">
        <Image
          className="nightshift-hero-photo"
          src="/energy/gateway-night-hero-v1.webp"
          width={1402}
          height={1122}
          sizes="100vw"
          preload
          unoptimized
          alt="Energiekonzept eines Gewerbestandorts bei Abendlicht: Photovoltaik auf dem Hallendach und Batteriespeicher vor dem beleuchteten Betrieb."
          onLoad={() => setImageReady(true)}
        />
        <figcaption id="nightshift-stage-description">
          {activeStage.caption}
        </figcaption>
      </figure>

      <div className="nightshift-hero-content">
        <p className="nightshift-hero-eyebrow">
          Photovoltaik für Gewerbe und Industrie
        </p>
        <h1 id="nightshift-hero-title">
          <span>Können PV und</span> <span>Speicher Ihre</span>{" "}
          <strong>Stromkosten</strong> <em>senken?</em>
        </h1>
        <p className="nightshift-hero-intro">
          Was zählt, ist Ihr Betrieb: Verbrauch, Kosten und Netzanschluss.
          Schaffen Sie die Grundlage, um Chancen und offene Voraussetzungen
          gezielt prüfen zu lassen.
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
          <Link className="nightshift-hero-secondary" href="/beispiel">
            Projektbeispiel ansehen
          </Link>
        </div>
        {children && <div className="nightshift-hero-return">{children}</div>}
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
              >
                {stage.name}
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
            Die Animation bewegt das Standortbild vom Dach zum Energiekonzept.
            Wählen Sie eine Station oder bedienen Sie den Regler mit den
            Pfeiltasten. Bei reduzierter Bewegung bleibt das Bild ruhig.
          </p>
        </div>
      </div>
    </section>
  );
}
