"use client";
import { useId, useState } from "react";
import { Location, Add, Subtract, FitToScreen } from "@carbon/icons-react";
import { Modal, Button } from "./ui";
export function SiteSchematic({ zoom = 1 }: { zoom?: number }) {
  const prefix = useId();
  return (
    <svg
      viewBox="0 0 700 620"
      role="img"
      aria-label="Schematischer Gewerbestandort. Keine realen Geodaten, kein Maßstab."
      className="site-svg"
    >
      <defs>
        <pattern
          id={`${prefix}-site-grid`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path d="M40 0H0V40" fill="none" stroke="#39454D" strokeWidth=".5" />
        </pattern>
        <pattern
          id={`${prefix}-roof-lines`}
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 0V12" stroke="#697B87" strokeWidth="1" />
        </pattern>
        <pattern
          id={`${prefix}-area-hatch`}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 8L8 0" stroke="#B9C2C8" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="700" height="620" fill="#11171C" />
      <rect width="700" height="620" fill={`url(#${prefix}-site-grid)`} />
      <g
        transform={`translate(350 310) scale(${zoom}) rotate(-28) translate(-350 -310)`}
      >
        <path
          d="M-60 120H760M-60 510H760M110 -120V760M580 -120V760"
          stroke="#303B42"
          strokeWidth="46"
        />
        <path
          d="M-60 120H760M-60 510H760M110 -120V760M580 -120V760"
          stroke="#697B87"
          strokeWidth="1"
          strokeDasharray="12 12"
        />
        {[
          [160, 0, 160, 65],
          [365, 0, 130, 65],
          [650, 190, 100, 185],
          [170, 570, 230, 110],
          [5, 240, 48, 120],
        ].map(([x, y, w, h], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="#29343B"
            stroke="#566670"
          />
        ))}
        <rect
          x="172"
          y="175"
          width="346"
          height="288"
          fill="#26333C"
          stroke="#697B87"
        />
        <rect
          x="211"
          y="193"
          width="238"
          height="250"
          fill="#39474F"
          stroke="#E9B64C"
          strokeWidth="2"
        />
        <rect
          x="223"
          y="205"
          width="214"
          height="226"
          fill={`url(#${prefix}-roof-lines)`}
        />
        <rect
          x="238"
          y="219"
          width="160"
          height="196"
          fill={`url(#${prefix}-area-hatch)`}
          stroke="#F3F5F6"
        />
        {Array.from({ length: 9 }, (_, i) => (
          <rect
            key={i}
            x="467"
            y={191 + i * 29}
            width="33"
            height="13"
            fill="#8D9CA4"
          />
        ))}
        <path
          d="M211 193L211 173H240M449 443V463H420"
          fill="none"
          stroke="#E9B64C"
          strokeWidth="3"
        />
      </g>
      <path d="M38 35h24m-12-12v24M636 571h24m-12-12v24" stroke="#97A4AD" />
      <text x="32" y="582" fill="#B9C2C8" fontSize="12" fontFamily="monospace">
        SCHEMATISCH · KEIN MASSSTAB
      </text>
    </svg>
  );
}
export function SiteContext({
  address,
  synthetic = false,
  hero = false,
}: {
  address?: string;
  synthetic?: boolean;
  hero?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const drawing = synthetic || hero;
  return (
    <div className={`site-context ${hero ? "hero-site" : ""}`}>
      {drawing ? (
        <>
          <SiteSchematic />
          <div className="site-caption">
            <span className="overline">DEMO / OBJEKTKONTEXT</span>
            <strong>Eine Fläche. Viele Möglichkeiten.</strong>
            <small>Schematischer Gewerbestandort · keine Standortanalyse</small>
          </div>
        </>
      ) : (
        <div className="site-fallback">
          <Location size={40} />
          <h3>Ihr Standort, manuell erfasst.</h3>
          <p>{address}</p>
          <p>
            Kartendaten nicht verfügbar. Die Adresse wurde nicht geocodiert.
            Ihre Angaben bleiben die Grundlage des Checks.
          </p>
        </div>
      )}
      {!hero && (
        <div className="site-meta">
          <Location size={20} />
          <span>
            {address}
            <small>
              {synthetic
                ? "Synthetischer Demo-Standort"
                : "Vom Nutzer angegeben · geografisch ungeprüft"}
            </small>
          </span>
          <Button variant="text" onClick={() => setOpen(true)}>
            {drawing ? "Karte öffnen" : "Standort ansehen"}
          </Button>
        </div>
      )}
      {open && (
        <Modal
          title={drawing ? "Schematische Standortansicht" : "Standortangaben"}
          onClose={() => setOpen(false)}
        >
          <div className="map-dialog">
            {drawing && <SiteSchematic zoom={zoom} />}
            <div>
              <p>{address}</p>
              <p>
                Keine Georeferenzierung, keine Flächenmessung. Solar-, Statik-
                und Netzprüfung sind nicht verfügbar.
              </p>
              {drawing && (
                <div className="actions">
                  <button
                    className="icon-button"
                    aria-label="Vergrößern"
                    onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
                  >
                    <Add />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Verkleinern"
                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  >
                    <Subtract />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Ansicht einpassen"
                    onClick={() => setZoom(1)}
                  >
                    <FitToScreen />
                  </button>
                </div>
              )}
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Zurück zum Projekt
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
