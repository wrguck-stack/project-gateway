# Project Gateway · Night Shift Variante 3

final result: passed

## Korrektur nach Nutzerfeedback: Hero in einer Bildschirmhöhe

Die frühere Abnahme hat die Gesamthöhe auf üblichen Laptopbildschirmen nicht
korrekt gewichtet. Der Nutzer verlangt jetzt ausdrücklich einen vollständig
sichtbaren Hero. Diese Vorgabe ersetzt die ursprüngliche hohe Proportion des
Rasterentwurfs. Die folgenden älteren Vergleichsangaben sind historisch.

P1 behoben: feste Mindesthöhe von 900–1256 px durch `min-height: 100svh`
ersetzt; Typografie und Abstände berücksichtigen nun auch die Viewporthöhe.
Header, Text, CTA und Zeitleiste passen gemeinsam in die erste Ansicht.
Mobil liegt das vorhandene Foto ebenfalls hinter dem Inhalt. Keine Texte oder
Bedienelemente werden zum Erreichen der Höhe ausgeblendet.

Aktueller Browserbeleg: `docs/qa/nightshift-2026-10-02/hero-viewport-fit.webp`.
Links Desktop 1366 × 768, rechts Mobile 390 × 844, beide DPR 1 ohne Skalierung,
gemeinsames Bild 1756 × 844. Unter dem Desktopbild liegt ausschließlich
Auffüllfläche des Belegs. Hero-Zustand Nutzen / 100 % / reduzierte Bewegung.
Quelle und aktueller Desktop wurden gemeinsam geöffnet; Farben, Schriftfamilien,
vierzeilige Hierarchie, Bildstil und Wortlaut bleiben erhalten. Die abweichende
Höhe ist die gewünschte Korrektur, kein weiterer Nachbaufehler.

Prüfung: 1920 × 1080, 1440 × 900, 1366 × 768, 1280 × 720, 1024 × 768,
390 × 844, 375 × 667 und 360 × 640. Bei normaler Schrift ist die Herohöhe
jeweils exakt die Viewporthöhe; CTA und Zeitleiste sind vollständig sichtbar.
Bei 200 % Schrift darf der Inhalt zugunsten der Lesbarkeit nach unten wachsen.
Die erneute Sichtprüfung korrigierte mobile Wortüberläufe und die Überlagerung
von Bildbeschriftung und CTA: Beschriftung im normalen Layoutfluss, flexible
Umbrüche und eine mit der Schrift wachsende Kopfzeile. Alle Bedienelemente
bleiben per Scroll erreichbar. Keine horizontalen Überläufe oder JavaScriptfehler.
Build und Typecheck bestanden. Keine Funktions-, Inhalts- oder Hostingänderung.

Aktueller final result: passed

## Vergleichsgrundlage

Der Nutzer wählte die dritte **angezeigte** Variante der Night-Shift-Entwürfe.
Diese Auswahl ersetzt die ältere Atlas-Vorgabe für die öffentliche Homepage.
Fachliche Verträge und die bestehende Anwendung bleiben maßgeblich.

- Visuelle Quelle: `docs/qa/nightshift-2026-10-02/selected-variant-3.webp`, 946 × 1663 Pixel.
- Gerenderte Umsetzung: `docs/qa/nightshift-2026-10-02/desktop-final.webp`, 1440 × 2531 Pixel, CSS-Viewport 1440 × 2531, DPR 1.
- Zum Vergleich wurde die Browseraufnahme auf 946 × 1663 Pixel normalisiert. Quelle und Umsetzung wurden gemeinsam geöffnet; keine Browserrahmen.
- Zustand: Startseite, Bilder und lokal bereitgestellte Fonts geladen, Energiekonzept am Ende (100 %, Nutzen), reduzierte Bewegung.
- Referenzstil zusätzlich an der tatsächlichen Night-Shift-Seite einschließlich Desktop, Mobilansicht und interaktiven Zuständen geprüft.
- Browser: Chromium 153 / Playwright 1.63; der Nutzer hatte diesen Browserweg ausdrücklich freigegeben, nachdem der Cloud-Browser nicht funktionierte.

## Sichtvergleich und Befunde

Keine offenen P0/P1/P2-Befunde. Vollansicht sowie fokussierte Ausschnitte wurden nach den Korrekturen erneut verglichen.

1. **Fonts / Typografie:** Arimo Regular/Bold und Gelasio Italic werden selbst gehostet. CDP bestätigt die tatsächlich verwendeten Webfonts. Sie ersetzen die zuvor sichtbaren Linux-Fallbacks und bilden den Arial/Georgia-Charakter der Quelle ab. Vierzeilige Hero-Hierarchie, eisblaues `Stromkosten` und kursives `senken?` sind erhalten. Geringe Glyphen-/Breitenunterschiede zum Rasterentwurf sind P3.
2. **Layout / Rhythmus:** vollständiges Hero-Bild, linker Texteinstieg, schmale Kopfzeile, untere Zeitleiste und versetzte Bildspalten folgen der Vorlage. Hero-Ende bei 1265 CSS-Pixeln entspricht nach Normalisierung ungefähr dem Vorlagenende. Nachfolgende bestehende Abschnitte übernehmen Schrift, Abstände, Linien und Farben. Mobil werden Bild und Text lesbar angeordnet; die Referenz enthält keinen separaten mobilen Entwurf.
3. **Farben / Zustände:** Navy-Grund #080d13, helle Schrift und eisblaue Akzente. Felder, Buttons, Tabs, Fokus und Vorschläge haben sichtbare Konturen und Zustände. Dropdown-Vorschläge wurden ausdrücklich auf dunkle Flächen mit kontrastreichen Texten umgestellt. Axe- und Tastaturprüfung bestanden.
4. **Bildqualität:** drei eigenständige, optimierte WebP-Motive mit PV-Dach, Speicher und beleuchtetem Gewerbebetrieb. Keine eingebrannte UI; Texte und Bedienelemente bleiben echtes HTML. Die Bildszene ist eine neu erzeugte Interpretation des Entwurfs und etwas wärmer. Kein behauptetes Kundenreferenzprojekt.
5. **Inhalt:** exakte ausgewählte Hero-Frage und Standortbezug. Keine garantierten Einsparungen, Erträge oder erfundenen Rechtsaussagen. Synthetische Projektbeispiele bleiben als solche bezeichnet. Die vorhandene Erfassung und Übergabesemantik wurde nicht zu einer Live-Fachplanung umgedeutet.

Fokussierte Belege (jeweils Quelle links, Umsetzung rechts):
- `docs/qa/nightshift-2026-10-02/hero-focus.webp`
- `docs/qa/nightshift-2026-10-02/section-focus.webp`

Weitere Browserbelege:
- `docs/qa/nightshift-2026-10-02/mobile-final.webp`
- `docs/qa/nightshift-2026-10-02/dialog-mobile.webp`
- `docs/qa/nightshift-2026-10-02/dialog-text-200.webp`

## Vergleichshistorie

- Erster Durchlauf: P2 bei zu kleiner Typografie im ersten Inhaltsabschnitt und zu breitem Hero-Schriftbild durch System-Fallbacks. Korrektur: selbst gehostete passende Fonts, größere Überschrift/Kartentexte, angepasste Absatzgrößen und führende Linie.
- Responsiver Durchlauf: P2 bei umbrechenden Nummern und Überbreite mit 200 % Text. Diese Überbreite vergrößerte den mobilen Layout-Viewport und erschwerte das Schließen des Dialogs. Korrektur: sinnvolle Mindestbreiten, zulässige Wortumbrüche, flexible Kopfzeile und Link-/Buttonbreiten; Nummern bleiben zusammen. Der Test vergleicht nun gegen die echte Seitenbreite statt den durch Overflow vergrößerten Layout-Viewport.
- Dialog: P2 bei hellen Vorschlagflächen mit übernommenem hellen Text. Korrektur: explizite dunkle Vorschlag- und Hoverflächen plus kontrastreiche Texte.
- Nach Korrekturen: Produktionsbuild, neue Browseraufnahmen und erneuter vollständiger/fokussierter Sichtvergleich; keine offenen P0/P1/P2. Beide prüfenden Agenten bestätigen das Ergebnis.

## Funktionsprüfung

- Produktionsbuild und Typecheck bestanden.
- 24 relevante E2E-Szenarien insgesamt bestanden: zunächst 23/24; das fehlerhafte 200-%-Szenario nach Korrektur bestanden. Vier von der Korrektur betroffene Prüfungen wurden gezielt wiederholt und bestanden.
- Vollständiger Eigentümerablauf auf Desktop und Mobilgerät einschließlich Upload, Review, Ergebnis, Einwilligung und Beleg.
- Bestehende Landing-Interaktionen, Projektarten, Navigation, Entwurfsfortsetzung, Dialog und Tastaturfokus.
- Reflow auf 1440, 1280, 1024, 768, 390, 360 und 320 Pixeln; Dialog auf allen Breiten.
- Reduzierte Bewegung, Touch und 200 % Text; Stationsschalter, Regler und Tastaturbedienung.
- Axe-Smokecheck und tatsächlich gerenderte Fonts geprüft.
- Keine JavaScript-Laufzeitfehler in den abschließenden Browseraufnahmen.

## Akzeptierte Unterschiede / Restumfang

- Echte Formulare und mobile Umbrüche ergänzen Zustände, die der Desktopentwurf nicht spezifiziert.
- Nativer zugänglicher Regler statt nachgezeichneter statischer Zeitleiste. Animation kann pausiert, erneut abgespielt oder manuell erkundet werden; bei reduzierter Bewegung steht das Bild still.
- Geringe Schriftkontur- und Fotodetailunterschiede sind P3 und blockieren nicht.
- Kein neuer Hostingtarif und keine zusätzliche kostenpflichtige Ressource. Veröffentlichung nutzt die bestehende Netlify-Site; Live-Beleg wird separat dokumentiert.

## Abgeschlossene Checkliste

- [x] Exakte Auswahl zugeordnet und Bildmaterial eingebunden.
- [x] Alle fünf Vergleichsflächen geprüft.
- [x] P0/P1/P2 behoben und erneut aufgenommen.
- [x] Kerneinstieg, Mobilansicht und zugängliche Bedienung geprüft.
- [x] Produktionsbuild und Typecheck bestanden.

final result: passed
