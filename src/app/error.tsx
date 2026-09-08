"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="wrap page">
      <h1>Diese Ansicht ist gerade nicht verfügbar.</h1>
      <p>Ihre zuletzt gespeicherten Angaben bleiben erhalten.</p>
      <button className="button primary" onClick={reset}>
        Erneut laden
      </button>
    </main>
  );
}
