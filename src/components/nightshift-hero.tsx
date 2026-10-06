"use client";

import { useId, type ReactNode } from "react";
import Image from "next/image";
import { ArrowRight, CircleFilled } from "@carbon/icons-react";
import type { ProjectIntent } from "./landing-content";
import "./nightshift-hero.css";

const factors = [
  { id: "roof", label: "Dachfläche", possessive: "Ihre" },
  { id: "consumption", label: "Stromverbrauch", possessive: "Ihr" },
  { id: "connection", label: "Netzanschluss", possessive: "Ihr" },
] as const;

export function NightshiftHero({
  onStart,
  children,
}: {
  onStart: (intent?: ProjectIntent) => void;
  children?: ReactNode;
}) {
  const id = useId();
  return (
    <section
      className="nightshift-hero"
      id="standort-start"
      aria-labelledby="nightshift-hero-title"
    >
      <div className="nightshift-hero-heading">
        <h1 id="nightshift-hero-title">
          <span className="nightshift-hero-statement">
            PV <span>geplant.</span>
          </span>{" "}
          <span className="nightshift-hero-question">
            Die richtigen <br />
            Fragen zuerst.
          </span>
        </h1>
        <p className="nightshift-hero-intro">
          Dachfläche, Stromverbrauch und Netzanschluss gemeinsam betrachten.
        </p>
      </div>
      <figure
        className="gateway-hero-system"
        aria-labelledby={`${id}-project`}
        aria-describedby={`${id}-description`}
      >
        <p className="sr-only" id={`${id}-description`}>
          Qualitative, schematische Illustration: Dachfläche, Stromverbrauch und
          Netzanschluss fließen gemeinsam in die Vorbereitung Ihres PV-Projekts
          ein. Die Darstellung enthält keine Standortmesswerte und keinen
          elektrischen Schaltplan.
        </p>
        <svg
          className="gateway-hero-convergence"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 0 C60 0 38 50 100 50 M0 50 H100 M0 100 C60 100 38 50 100 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <CircleFilled
          className="gateway-hero-junction"
          size={14}
          aria-hidden="true"
        />
        <div className="gateway-hero-factors">
          {factors.map((factor) => (
            <figure className="gateway-hero-factor" key={factor.id}>
              <div className="gateway-hero-asset">
                <Image
                  src={`/energy/technical-hero/${factor.id}.webp`}
                  width={1000}
                  height={680}
                  sizes="(max-width: 700px) 30vw, (max-width: 1100px) 28vw, 32vw"
                  alt=""
                  unoptimized
                  loading="eager"
                  fetchPriority={factor.id === "roof" ? "high" : "auto"}
                />
              </div>
              <figcaption>
                <span>{factor.possessive}</span> {factor.label}
              </figcaption>
            </figure>
          ))}
        </div>
        <figcaption className="gateway-hero-project" id={`${id}-project`}>
          Ihr PV-Projekt
        </figcaption>
      </figure>
      <div className="nightshift-hero-controls">
        <p className="nightshift-control-caption" id={`${id}-start`}>
          Start mit Ihrer Adresse
        </p>
        <button
          className="nightshift-hero-primary"
          type="button"
          aria-haspopup="dialog"
          aria-describedby={`${id}-start`}
          onClick={() => onStart()}
        >
          <span>Standortcheck starten</span>
          <ArrowRight size={24} aria-hidden />
        </button>
      </div>
      {children && <div className="nightshift-hero-return">{children}</div>}
    </section>
  );
}
