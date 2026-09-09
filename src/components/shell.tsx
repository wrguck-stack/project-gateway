"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "@carbon/icons-react";
import { Modal } from "./ui";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Project Gateway – Startseite">
      <span className="brand-mark" aria-hidden />
      <span>PROJECT GATEWAY</span>
    </Link>
  );
}
export function Header({
  partner = false,
  mode = "demo",
}: {
  partner?: boolean;
  mode?: string;
}) {
  const [open, setOpen] = useState(false);
  const links = partner ? (
    <>
      <Link href="/partner/projekte">Projekte</Link>
      <Link href="/partner/pipeline">Pipeline</Link>
      <span className="muted">Gateway Demopartner</span>
    </>
  ) : (
    <>
      <Link href="/#ablauf">So funktioniert’s</Link>
      <Link href="/beispiel">Beispiel ansehen</Link>
      <Link href="/#projektpartner">Für Projektpartner</Link>
      <Link href="/partner/login">Partner-Login</Link>
    </>
  );
  return (
    <>
      <header className="header wrap">
        <Brand />
        <nav aria-label="Hauptnavigation" className="desktop-nav">
          {links}
        </nav>
        <button
          className="icon-button mobile-menu"
          onClick={() => setOpen(true)}
          aria-label="Menü öffnen"
        >
          <Menu size={24} />
        </button>
      </header>
      <section className="mode-strip" aria-label="Betriebsmodus">
        <div className="wrap">
          {mode === "demo"
            ? "Interaktive Demo · Beispieldaten und simulierte Projektübergabe"
            : "LIVE · Integrationen noch nicht konfiguriert"}
        </div>
      </section>
      {open && (
        <Modal title="Navigation" onClose={() => setOpen(false)}>
          <nav className="mobile-nav" onClick={() => setOpen(false)}>
            {links}
          </nav>
        </Modal>
      )}
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer wrap">
      <Brand />
      <nav aria-label="Fußnavigation">
        <Link href="/kontakt">Kontakt</Link>
        <Link href="/datenschutz">Datenschutz</Link>
        <Link href="/impressum">Impressum</Link>
        <Link href="/partner/login">Partner-Login</Link>
      </nav>
      <p>
        Digitale Projektvorqualifizierung. Fachliche Entscheidungen bleiben beim
        Projektpartner.
      </p>
    </footer>
  );
}
