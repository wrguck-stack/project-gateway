# Project Gateway · Vom Stromanschluss zum Energiestandort

final result: passed

## Auftrag und Vergleichsgrundlage

Am 02.10.2026 hat der Nutzer die vorgeschlagene eigenständige Standortgeschichte,
drei konkrete Einstiegssituationen und eine entsprechende visuelle Überarbeitung
freigegeben. Diese Änderung entwickelt den zuvor gewählten Night-Shift-Stil weiter
und ersetzt die bisherige Hero-Aussage sowie den ersten Bildabschnitt. Die frühere
Atlas-Vorgabe ist für diese öffentliche Homepage durch die Nutzerauswahl ersetzt;
fachliche Verträge, Score-Geometrie und bestehende Abläufe bleiben maßgeblich.

Ausgangspunkt ist `docs/qa/nightshift-2026-10-02/hero-viewport-fit.webp`.
Diese Aufnahme wurde gemeinsam mit der neuen Desktop-/Mobilansicht geöffnet.
Die jetzige Umsetzung ist eine ausdrücklich gewünschte Weiterentwicklung,
kein pixelidentischer Nachbau des älteren Rasterentwurfs.

Figma war verbunden. Ein neuer leerer Entwurf wurde angelegt, die erste
Canvas-Bearbeitung jedoch vom Figma-MCP-Limit des Starter-Plans blockiert.
Es entstand kein Figma-Design. Die Umsetzung erfolgte direkt im bestehenden
Frontend, ohne Upgrade oder neue kostenpflichtige Ressource.

## Umsetzung

- Hero: „Vom Stromanschluss zum Energiestandort.“ Ein zusammenhängender
  Gewerbestandort zeigt Netzanschluss, PV-Dach und Batteriespeicher.
- Vier Stationen heben die tatsächlichen Bildbereiche hervor und erklären die
  jeweilige Planungsfrage. Hotspots und Zeitleiste sind echte HTML-Bedienelemente.
- Automatische Erkundung über 16 Sekunden, Pause/Fortsetzen/Neustart,
  manuelle Auswahl und Regler mit Tastaturbedienung. Bei reduzierter Bewegung
  bleibt das Gesamtbild stehen; alle Stationen sind manuell erreichbar.
- Drei aufklappbare Einstiege: hoher Stromverbrauch, bestehende PV-Anlage,
  ungenutzte Dachfläche. Jeder erläutert die erste Prüffrage, benötigte Angaben
  und einen konkreten nächsten Schritt im vorhandenen Standortcheck.
- Die Projektart wird passend vorausgewählt; hoher Stromverbrauch löscht eine
  zuvor gewählte Art und legt keine Technik fest.
- Folgeabschnitte, Metadaten und Rahmentexte benennen Verbrauch, Anschluss,
  Dachzustand, Nachweise und offene Prüfungen konkret.

## Sichtprüfung: fünf Flächen

1. **Typografie:** Selbst gehostete Arimo und Gelasio bleiben erhalten; CDP
   bestätigt die tatsächlich gerenderten Webfonts. Klare große Hierarchie,
   mobile Stationsnamen 12 px, Text und sekundärer CTA mindestens 14 px.
2. **Layout und Rhythmus:** Desktop mit Text-/Bildspalte, mobile Anordnung im
   normalen Dokumentfluss. Hero samt Kopfzeile, CTA, Erklärung und Zeitleiste
   passt bei normaler Schrift in eine Bildschirmhöhe. Bei 200 % Text darf
   er zugunsten der Lesbarkeit wachsen. Neue nummerierte Einstiege ersetzen
   die bisherige allgemeine Bildfolge.
3. **Farben und Zustände:** Navy, eisblaue Akzente und feine Trennlinien führen
   den gewählten Stil fort. Kontrastreiche Buttons, sichtbare Fokusrahmen,
   aktive Station und auf-/zugeklappte Bereiche sind unterscheidbar.
4. **Bild:** Neues erzeugtes Architekturmotiv, 1536 × 1024, WebP, 303610 Byte.
   3:2-Darstellung ohne Beschnitt bewahrt die Zuordnung der Hotspots:
   Anschluss 28/69 %, Dach 50/24 %, Speicher 82/58 %. Weiche Bildränder,
   keine eingebrannten Texte, keine erfundenen Messdaten oder Stromflüsse.
   Alttext bezeichnet die Szene als Architekturvisualisierung; sie ist keine
   behauptete Kundenreferenz.
5. **Inhalt und Funktion:** Überschriften benennen konkrete Fragen. Keine
   garantierten Einsparungen, keine erfundenen Rechtsaussagen. Vorhandene
   synthetische Projektbeispiele und nicht angebundene Übergaben behalten
   ihre sachlich erforderliche Kennzeichnung. Der Standortcheck bleibt eine
   strukturierte Erfassung und ersetzt keine Fachplanung.

## Belege und Korrekturen

Belegordner: `docs/qa/energy-story-2026-10-02/`.

- `hero-desktop-mobile.webp`: Desktop 1366 × 768 und Mobil 390 × 844, DPR 1,
  nebeneinander ohne Skalierung; Zustand Zusammenspiel, reduzierte Bewegung.
- `hero-grid-focus.webp`: Desktop 1440 × 900, aktive Station Netzanschluss.
- `entry-desktop-mobile.webp`: neue Einstiegssektion mit geöffnetem PV-Bestand,
  Elementaufnahmen bei 1440 bzw. 390 Pixeln Viewportbreite, nebeneinander.
- `browser-metrics.json`: alle 36 finalen Breiten-/Stationsmessungen sowie
  Wiedergabe- und Skiplink-Prüfung.

Vollansicht und fokussierte Zustände wurden vor und nach den Korrekturen
visuell geprüft. Ein zweiter Designreview bestätigte Bildzuordnung, Hierarchie
und Bedienbarkeit. Keine offenen P0/P1/P2-Befunde.

Behoben: zu hoher Hero auf 320 × 640 durch angepasste Bildhöhe/Abstände und
kurze mobile Stationsnamen; kleine mobile Beschriftungen vergrößert.
Ein gelber Skiplink in überhohen Element-Screenshots war ein Aufnahmeeffekt:
Im normalen Browser liegt der nicht fokussierte Link vollständig oberhalb
des Viewports (top −100 px, bottom −41 px), ohne Fokus und ohne Überlagerung.
Die finalen Elementaufnahmen unterdrücken ausschließlich diesen außerhalb
des sichtbaren Viewports liegenden, nicht fokussierten Link. Tastaturfokus
und der echte sichtbare Skiplink bleiben unverändert.

## Funktions- und Darstellungsprüfung

- Produktionsbuild und Typecheck bestanden.
- 26 relevante E2E-Szenarien bestanden: vollständige Eigentümerabläufe auf
  Desktop/Mobil, Upload, Review, Ergebnis, Einwilligung und Beleg;
  neue Einstiege, tatsächlicher Draft-Request, Rücksetzen alter Projektart;
  Hero-Stationen/Hotspots, Navigation, Formulare, Score, Modal, Fokus und Axe.
- Anschließend neuer Hero-Höhen-Regressionstest und 200-%-Reflow erneut
  bestanden: 2/2. Damit 27 unterschiedliche relevante Szenarien abgedeckt.
- Finale Bild-/Höhenprüfung: 1440 × 900, 1366 × 768, 1280 × 720, 1024 × 768,
  768 × 1024, 390 × 844, 375 × 667, 360 × 640, 320 × 640, jeweils vier Stationen.
  Alle 36 Zustände passen vollständig in die erste Ansicht; keine horizontale
  Überbreite, keine JavaScriptfehler.
- Autoplay, Pause, Fortsetzen, Ende und erneute Wiedergabe im normalen
  Bewegungsmodus zusätzlich im Browser geprüft.
- Vergrößerte Schrift, Touch, reduzierte Bewegung und reale Webfonts geprüft.

## Veröffentlichung

Bestehende Netlify-Site und Free-Plan bleiben erhalten. Kein Hostingwechsel,
keine Tarifänderung, kein kostenpflichtiges Add-on. Produktionsdeploy und abschließende Live-Prüfung sind unter
`docs/qa/energy-story-2026-10-02/live-verification.md` dokumentiert.
Auch der Produktionsbuild mit 192 Tests und die öffentliche Desktop-/Mobilprüfung
sind bestanden.

final result: passed
