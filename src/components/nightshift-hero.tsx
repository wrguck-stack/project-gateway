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
        <Image
          className="gateway-hero-convergence"
          src="/energy/technical-hero/convergence.webp"
          alt=""
          width={614}
          height={1060}
          unoptimized
          loading="eager"
          aria-hidden="true"
        />
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
          Standortcheck starten <ArrowRight size={24} aria-hidden />
        </button>
      </div>
      {children && <div className="nightshift-hero-return">{children}</div>}
    </section>
  );
}
