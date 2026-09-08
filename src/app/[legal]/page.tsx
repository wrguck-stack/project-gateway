import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/shell";
const copy: Record<string, { title: string; body: string[] }> = {
  kontakt: {
    title: "Kontakt",
    body: [
      "Project Gateway befindet sich in einer ausdrücklich gekennzeichneten Demo. Es ist noch keine reale Kontaktadresse eines Betreibers oder Projektpartners konfiguriert.",
      "Die Demo führt keine externen Kontaktanfragen aus. Projektinformationen können innerhalb der Demo-Strecke erfasst und simuliert eingereicht werden.",
    ],
  },
  datenschutz: {
    title: "Datenschutzhinweise zur Demo",
    body: [
      "Ihre Eingaben und ausgewählten Dateien werden im lokalen Demo-Speicher dieser Installation abgelegt. Technisch notwendige Sitzungscookies verbinden den Browser mit den zugehörigen Projektentwürfen.",
      "Der Partnerbereich verwendet einen offen zugänglichen Demo-Kontext. Verwenden Sie hier ausschließlich Testdaten und keine vertraulichen Unterlagen. Es gibt keine Live-Authentifizierung, keine Marketinganalyse und keinen externen E-Mail-Versand.",
      "Vor einem produktiven Einsatz müssen der verantwortliche Betreiber, Zwecke, Rechtsgrundlagen, Aufbewahrungsfristen, Betroffenenrechte und reale Dienstleister konkret ergänzt und geprüft werden. Diese Seite ist keine freigegebene produktive Datenschutzerklärung.",
    ],
  },
  impressum: {
    title: "Impressum · Demo",
    body: [
      "Project Gateway ist eine Entwicklungs- und Demonstrationsumgebung. Reale Betreiberinformationen sind noch nicht hinterlegt.",
      "Verantwortlicher Betreiber, ladungsfähige Anschrift, Vertretung und weitere anwendbare Pflichtangaben müssen vor einem öffentlichen Produktivbetrieb ergänzt werden. Es werden keine Unternehmensdaten erfunden.",
    ],
  },
};
export default async function Page({
  params,
}: {
  params: Promise<{ legal: string }>;
}) {
  const { legal } = await params;
  const c = copy[legal];
  if (!c) notFound();
  return (
    <>
      <Header />
      <main id="main" className="wrap page legal">
        <p className="overline">PROJECT GATEWAY / DEMO</p>
        <h1>{c.title}</h1>
        {c.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <Link className="text-link" href="/">
          Zur Startseite →
        </Link>
      </main>
      <Footer />
    </>
  );
}
