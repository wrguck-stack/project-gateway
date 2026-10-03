import type { Metadata } from "next";
import "@fontsource/ibm-plex-sans-condensed/400.css";
import "@fontsource/ibm-plex-sans-condensed/500.css";
import "@fontsource/ibm-plex-sans-condensed/600.css";
import "@fontsource/ibm-plex-sans-condensed/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { RouteFocus } from "@/components/route-focus";
export const metadata: Metadata = {
  title: {
    default: "Project Gateway · PV geplant. Die richtigen Fragen zuerst.",
    template: "%s · Project Gateway",
  },
  description:
    "PV-Dach, Speicher, Verbrauch und Netzanschluss gemeinsam betrachten. Finden Sie den passenden Einstieg und bereiten Sie die fachliche Prüfung Ihres Gewerbestandorts vor.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <a href="#main" className="skip-link">
          Zum Inhalt
        </a>
        {children}
        <RouteFocus />
      </body>
    </html>
  );
}
