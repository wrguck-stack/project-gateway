# Atlas-Hero · Umsetzungsstand 29. September 2026

final result: blocked

## Aktueller Auftrag · 1. Oktober 2026

Der freigegebene Einstieg lautet jetzt „Erst Klarheit. Dann investieren.“.
Die Homepage stellt Möglichkeiten, Wirtschaftlichkeit und nächste Schritte in
den Vordergrund. Neue Überschrift, CTA, Folgetexte, FAQs und Metadaten sind
implementiert; das vorhandene Hallenmotiv und sein weicher Übergang bleiben
erhalten. Die Schriftgrößen sind für den längeren Text angepasst. Die frühere
Bildvorlage dokumentiert die Gestaltung, nicht den jetzt freigegebenen Wortlaut.

Tests, Build, Typecheck und statisch erzeugtes HTML sind geprüft. Ein neuer
Cloud-Browser-Versuch am 01.10. lieferte erneut keinen Seitenzustand: Inventar und
Bindung funktionierten, die einmalige Navigation hing trotz 45-Sekunden-Timeout
bis zum Abbruch nach 232,3 Sekunden. Keine aktuelle visuelle Abnahme, kein
Screenshot und kein nicht freigegebener Browserwechsel.

Nach erneuter, vom Nutzer bestätigter Netlify-Anmeldung wurde Commit `4c936c3`
auf der bestehenden Site veröffentlicht. Deploy `6abe89017fcc5f1a4ac2c417`
ist live; vier öffentliche Seiten und die neuen HTML-/CSS-Inhalte wurden per
HTTPS erfolgreich geprüft. Das ersetzt keine visuelle Browserabnahme.
Details: [Positionierung](docs/qa/POSITIONING-2026-10-01.md).

## Frühere Aufträge · 29. September 2026

Nachträglicher Nutzerauftrag vom 29.09.2026: allgemeine Demo-Auszeichnung aus der
Oberfläche entfernt und Netlify-Verweis als Footer-Link eingebaut. Der Hero selbst
bleibt unverändert; der entfernte Banner verändert den vertikalen Einstieg.
Diese neue Fassung ist ebenfalls noch nicht im Browser visuell abgenommen.
Details: [Produktansicht](docs/qa/PRESENTATION-2026-09-29.md).

Weiterer Nutzerauftrag: Eingaben und klickbare Elemente professionell erkennbar
machen. Kontrastreichere Feld- und Buttonkonturen, dauerhafte Linkunterstreichung,
deutliche Tabs und beschriftete aufklappbare Projektarten sind umgesetzt.
Details: [Bedienelemente](docs/qa/CONTROLS-2026-09-29.md). Auch diese Fassung ist
noch nicht visuell abgenommen; `final result: blocked` bleibt bestehen.

## Vergleichsgrundlage und Status

- Freigegebene visuelle Vorlage: `docs/qa/homepage-overhaul/hero-editorial-reference.webp`.
- Quelle: erster Entwurf, danach vom Nutzer ausdrücklich gewünschter weicher
  Fotoübergang; Zustimmung zur überarbeiteten Fassung am 29.09.2026.
- Quellbild: 1486 × 1059 Pixel, Desktop-Hero; keine Browser-Chrome.
- Implementierung: Homepage `/`, normaler Demo-Einstieg ohne gespeicherten
  Entwurf. `src/components/landing.tsx` und `landing-hero.css`.
- Vorgesehene Vergleichsgröße: 1486 × 1059 CSS-Pixel, DPR 1. Weitere Prüfpunkte:
  320, 360, 390, 768, 1024, 1280 und 1440 Pixel sowie 200 % Textgröße.
- Browseraufnahme der Implementierung: **nicht verfügbar**.
- Dichtenormalisierung, Vollbildvergleich und fokussierter Vergleich:
  **nicht durchgeführt**. Keine visuelle Übereinstimmung bestätigt.

## Blocker

Der vorhandene Vorschaudienst meldete bei zwei Startversuchen zunächst einen
erfolgreichen Start, war bei anschließender Statusprüfung aber wieder gestoppt.
Der Cloud-Browser erhielt `ERR_CONNECTION_REFUSED`. Der zweite Versuch folgte
nach Aufnahme von `terminal.local` in die dokumentierte Next-Dev-Origin-Liste.
Es wurde kein anderer Browserweg als vermeintlich gleichwertige Sichtprüfung
ausgegeben. Weitere unveränderte Startversuche wurden nicht wiederholt.

Ein separater HTTP-Diagnoselauf bestätigte anschließend den Start des
unveränderten Next-Dev-Kommandos und HTTP 200 mit der neuen Headline. Der
Testprozess wurde danach beendet. Dieser Nachweis grenzt den Fehler auf die
verwaltete Vorschau ein; es ist keine Browser- oder Layoutprüfung.

Damit sind Interaktionen und Browser-Konsole in dieser neuen Fassung **nicht
geprüft**. Unit-Tests und Build ersetzen diese Prüfungen nicht. Die ältere
Browserabnahme vom 10. September gilt nicht als Freigabe des neuen Layouts.

Die Anwendung wurde inzwischen auf Netlify veröffentlicht und per HTTPS geprüft.
Der erste Cloud-Browser-Aufruf zur öffentlichen URL blieb ohne Seitenzustand
hängen und wurde nach 1210,2 Sekunden abgebrochen. Es wurde dabei weder eine
DOM-Ansicht noch ein Screenshot oder eine Interaktionsprüfung gewonnen. Die
verfügbare Browser-API bietet außerdem keine Änderung der Viewportgröße für die
geforderte mobile Abnahme. Die erfolgreiche HTTP-Prüfung ersetzt diese fehlende
visuelle Evidenz nicht.

Nach erfolgreicher Veröffentlichung funktionierten Inventarabfrage und Auswahl
des leeren Tabs 4. Ein einzelner Wiederaufnahmeversuch blieb anschließend schon
beim Abruf der Browser-Fehlerbehandlung hängen und wurde nach 181,7 Sekunden
abgebrochen; eine erneute Navigation wurde nicht ausgeführt. Es liegt weiterhin
kein gerendertes Bild der aktuellen Fassung vor. Für einen direkten Wechsel zur
Playwright CLI verlangt die Product-Design-Anleitung eine gesonderte Zustimmung.

Beim Auftrag zu den Bedienelementen gelangen erneut Dokumentationsabruf,
Browserinventar und Auswahl des leeren Tabs 4. Die anschließende einzelne
Navigation zur öffentlichen Netlify-URL lieferte nach 68,6 Sekunden weiterhin
keinen Seitenzustand und wurde abgebrochen. Es entstanden weder DOM-Ansicht noch
Screenshot. Es folgte kein weiterer unveränderter Versuch und kein Wechsel zu
einem nicht freigegebenen Browserweg.

## Fünf verpflichtende Prüfflächen

| Fläche | Im Code umgesetzt | Noch visuell zu prüfen |
| --- | --- | --- |
| Typografie | Vorhandene lokal geladene IBM Plex Sans Condensed/Mono; dreizeilige Headline, Amber auf „Perspektive.“ | Reale Umbrüche, Gewicht, Zeilenabstand und Reflow bei 200 % |
| Abstände und Layout | Asymmetrischer Desktop-Hero, breite Eingabe, eigene mobile Reihenfolge | Zielproportionen, CTA im sichtbaren Bereich, Fokusrahmen und Vorschläge |
| Farben | Bestehende Atlas-Tokens; nur Bild-Deckkraft weich ausgeblendet | Kontrast insbesondere an der Fotogrenze und unter der Bildunterschrift |
| Bild | Separates KI-Motiv, 1586 × 992, als WebP eingebunden; keine gerasterten UI-Texte | Crop/Schärfe bei allen Breiten und nahtloser Übergang |
| Inhalte | Freigegebene Headline/Subline; bestehende Labels, Hilfetexte und Demo-Kennzeichnung erhalten | Lesbarkeit und keine Überlagerung dynamischer Fehlermeldungen |

## Code-Review und ausgeführte Prüfungen

- 192 Unit-Tests bestanden; regulärer Produktionsbuild und Typecheck erfolgreich.
- Der Hero verändert keine Session-, Draft- oder Speicherdienste.
- Im anschließenden Funktionsreview wurde die Check-Navigation während
  Dateioperationen gesperrt, die Wiederholung unvollständiger Uploads korrigiert
  und blockierter Browser-Sitzungsspeicher abgefangen. Drei neue Browserfälle
  sind vorbereitet, aber noch nicht ausgeführt.
- Formularzustand, Vorschläge, Tastaturbehandlung, Entwurfsfortsetzung,
  Projektartauswahl, Links und Navigation bleiben in den bestehenden Komponenten.
- Nach Review: explizites Leerzeichen beim mobil ausgeblendeten Zeilenumbruch
  ergänzt; Tablet-Textbreite für vergrößerte Schrift auf `min(100%, 36rem)` begrenzt.
- Die Bildmaske betrifft ausschließlich die Fotodatei. Formulare, Vorschläge
  und Fokusrahmen liegen außerhalb des beschnittenen Bildcontainers.

Diese Punkte sind Code-Prüfungen, keine visuellen QA-Iterationen. Es gibt noch
keine zulässige visuelle Vergleichshistorie.

## Vor Freigabe

1. Funktionsfähige Browservorschau öffnen und den Desktop-Hero in der Zielgröße aufnehmen.
2. Vorlage und gerenderte Seite gemeinsam vergleichen; zusätzlich Headline,
   Bildübergang, Formulare und mobile Ansicht im Detail prüfen.
3. Alle genannten Breiten und 200 % Textgröße prüfen; keinen horizontalen
   Überlauf, abgeschnittene Vorschläge oder verdeckte Aktionen akzeptieren.
4. Standortcheck per Tastatur/Button starten, Demo-Entwurf öffnen, Projektart
   auswählen, Beispielseite und Navigation prüfen; Konsole kontrollieren.
5. Abweichungen beheben, erneut aufnehmen und erst danach `final result: passed` setzen.

Die Codefassung ist auf dem Arbeitsbranch gesichert und unter
https://project-gateway-wrguck.netlify.app auf Netlify Free veröffentlicht,
aber noch nicht visuell abgenommen. Es wurden keine kostenpflichtigen Dienste
eingerichtet. Die gehosteten Funktionsprüfungen stehen separat im
[Abnahmebericht](docs/qa/HOSTED-2026-09-29.md).
