"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "@carbon/icons-react";
import { Modal } from "./ui";
export function Brand({ editorial = false }: { editorial?: boolean }) {
  if (editorial)
    return (
      <Link
        href="/"
        className="brand editorial-brand"
        aria-label="Project Gateway – Startseite"
      >
        <span>
          PROJECT GATEWAY
          <span className="brand-slash" aria-hidden>
            {" "}
            /
          </span>
        </span>
      </Link>
    );
  return (
    <Link href="/" className="brand" aria-label="Project Gateway – Startseite">
      <span className="brand-mark" aria-hidden />
      <span>PROJECT GATEWAY</span>
    </Link>
  );
}
export function Header({
  partner = false,
  editorial = false,
  nightshift = false,
}: {
  partner?: boolean;
  editorial?: boolean;
  nightshift?: boolean;
  mode?: string;
}) {
  const [open, setOpen] = useState(false);
  const links = partner ? (
    <>
      <Link href="/partner/projekte">Projekte</Link>
      <Link href="/partner/pipeline">Pipeline</Link>
      <span className="muted">Gateway Projektpartner</span>
    </>
  ) : nightshift ? (
    <>
      <a href="/#ausgangslage">Standort</a>
      <a href="/#projektakte">Projektakte</a>
      <Link href="/kontakt">Kontakt</Link>
    </>
  ) : (
    <>
      <a href="/#ausgangslage">Möglichkeiten</a>
      <Link href="/beispiel">Projektbeispiel</Link>
      <Link href="/kontakt">Kontakt</Link>
    </>
  );
  return (
    <>
      <header
        className={`header wrap${editorial ? " editorial-header" : ""}${nightshift ? " nightshift-header" : ""}`}
      >
        <div className={nightshift ? "editorial-brand-group" : undefined}>
          <Brand editorial={nightshift} />
        </div>
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
export function Footer({
  editorial = false,
  fieldbook = false,
}: {
  editorial?: boolean;
  fieldbook?: boolean;
}) {
  return (
    <footer className={`footer wrap${editorial ? " editorial-footer" : ""}`}>
      {fieldbook ? (
        <Brand editorial />
      ) : editorial ? (
        <>
          <div className="footer-intro">
            <p>Anschluss. Erzeugung. Nutzung.</p>
            <a href="#main">Zurück nach oben</a>
          </div>
          <Link
            href="/"
            className="editorial-wordmark"
            aria-label="Project Gateway – Startseite"
          >
            PROJECT
            <br />
            GATEWAY<span aria-hidden>/</span>
          </Link>
        </>
      ) : (
        <Brand />
      )}
      <nav aria-label="Fußnavigation">
        <Link href="/kontakt">Kontakt</Link>
        <Link href="/datenschutz">Datenschutz</Link>
        <Link href="/impressum">Impressum</Link>
        <Link href="/partner/login">Partner-Login</Link>
      </nav>
      <p className="footer-note">
        <span>
          Digitale Projektvorqualifizierung. Fachliche Entscheidungen bleiben
          beim Projektpartner.
        </span>
        <a className="hosting-credit" href="https://www.netlify.com/">
          Powered by Netlify
        </a>
      </p>
    </footer>
  );
}
