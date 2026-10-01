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
    default: "Project Gateway · Erst Klarheit. Dann investieren.",
    template: "%s · Project Gateway",
  },
  description:
    "Photovoltaik, Speicher und Netzanschluss gemeinsam betrachten: Ausgangslage erfassen, offene Fragen erkennen und die fachliche Prüfung vorbereiten.",
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
