import Link from "next/link";
import { Header, Footer } from "./shell";
import { DomainError } from "@/domain/rules";
export function AccessError({ error }: { error: unknown }) {
  if (!(error instanceof DomainError)) throw error;
  return (
    <>
      <Header />
      <main id="main" className="wrap page">
        <p className="overline">PROJEKTZUGRIFF</p>
        <h1>
          {error.status === 404
            ? "Projekt nicht gefunden."
            : "Projekt nicht verfügbar."}
        </h1>
        <p>{error.message}</p>
        <Link className="button primary" href="/">
          Zur Startseite →
        </Link>
      </main>
      <Footer />
    </>
  );
}
