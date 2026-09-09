import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/shell";
import { appMode, operatorContact } from "@/server/config";

export const dynamic = "force-dynamic";
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
  searchParams,
}: {
  params: Promise<{ legal: string }>;
  searchParams: Promise<{ anliegen?: string }>;
}) {
  const { legal } = await params;
  if (!Object.hasOwn(copy, legal)) notFound();
  const c = copy[legal];
  if (!c) notFound();
  const operator = operatorContact();
  const mode = appMode();
  const partnership = (await searchParams).anliegen === "partnerschaft";
  const hasContact = Boolean(operator.email || operator.phone);
  const showOperator = legal === "impressum" && operator.name;
  const subject = partnership
    ? "Partnerschaft mit Project Gateway"
    : "Anfrage zu Project Gateway";
  return (
    <>
      <Header mode={mode} />
      <main id="main" className="wrap page legal">
        <p className="overline">PROJECT GATEWAY / {mode.toUpperCase()}</p>
        <h1>
          {legal === "kontakt" && partnership
            ? "Zusammenarbeit besprechen"
            : c.title}
        </h1>
        {legal === "kontakt" ? (
          <>
            <p className="lead">
              {partnership
                ? "Sie entwickeln Energieprojekte oder betreuen einen Immobilienbestand? Hier geht es um die Zusammenarbeit mit Project Gateway."
                : "Sie haben Fragen zu Ihrer Fläche oder zu Project Gateway? Hier finden Sie den Kontakt zur Plattform."}
            </p>
            {hasContact ? (
              <section aria-label="Persönlicher Kontakt">
                {operator.name && <h2>{operator.name}</h2>}
                {operator.person && <p>{operator.person}</p>}
                {operator.email && (
                  <p>
                    <a
                      className="text-link"
                      href={`mailto:${operator.email}?subject=${encodeURIComponent(subject)}`}
                    >
                      E-Mail schreiben: {operator.email}
                    </a>
                  </p>
                )}
                {operator.phone && (
                  <p>
                    <a
                      className="text-link"
                      href={`tel:${operator.phone.replace(/[^\d+]/g, "")}`}
                    >
                      Anrufen: {operator.phone}
                    </a>
                  </p>
                )}
                <p className="meta">
                  Der Kontakt öffnet Ihr E-Mail- oder Telefonprogramm. Eine
                  Nachricht wird erst gesendet, wenn Sie diese dort absenden.
                </p>
              </section>
            ) : (
              <section aria-label="Kontaktstatus">
                <h2>Persönlicher Kontakt folgt</h2>
                <p>
                  Für diese Vorschau ist noch kein Ansprechpartner hinterlegt.
                  Über die Demo werden keine Anfragen an Unternehmen verschickt.
                </p>
                <p>
                  Sie können bereits ansehen, wie eine Projektakte aufgebaut ist
                  und wie Projekte im Partnerbereich bearbeitet werden.
                </p>
              </section>
            )}
            <p>
              <Link className="text-link" href="/beispiel">
                Beispiel-Projektakte ansehen →
              </Link>
            </p>
            {partnership && (
              <p>
                <Link className="text-link" href="/partner/login">
                  Partnerbereich als Demo ansehen →
                </Link>
              </p>
            )}
          </>
        ) : showOperator ? (
          <>
            <h2>{operator.name}</h2>
            {operator.address.length > 0 && (
              <address>
                {operator.address.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </address>
            )}
            {operator.representative && (
              <p>Vertreten durch: {operator.representative}</p>
            )}
            {operator.register && <p>{operator.register}</p>}
            {operator.vatId && <p>Umsatzsteuer-ID: {operator.vatId}</p>}
            {operator.email && (
              <p>
                E-Mail:{" "}
                <a href={`mailto:${operator.email}`}>{operator.email}</a>
              </p>
            )}
            {operator.phone && (
              <p>
                Telefon:{" "}
                <a href={`tel:${operator.phone.replace(/[^\d+]/g, "")}`}>
                  {operator.phone}
                </a>
              </p>
            )}
            {mode === "demo" && (
              <p>
                Diese Installation dient der Demonstration. Projektbewertungen
                und Partneraktionen sind simuliert.
              </p>
            )}
          </>
        ) : (
          c.body.map((p) => <p key={p}>{p}</p>)
        )}
        <Link className="text-link" href="/">
          Zur Startseite →
        </Link>
      </main>
      <Footer />
    </>
  );
}
