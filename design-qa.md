# Project Gateway · Energie-Hero · Visuelle Abnahme 2. Oktober 2026

final result: passed

## Vergleichsgrundlage

- Gewählt: Variante 3 der letzten Entwurfsrunde, „Können PV und Speicher Ihre
  Stromkosten senken?“.
- Source: `docs/qa/homepage-overhaul/hero-energy-reference.webp`, 1487 × 1058 px.
- Implementierung: `docs/qa/hero-energy-2026-10-02/hero-1487.webp`, gleicher
  Viewport 1487 × 1058 CSS-Pixel, deviceScaleFactor 1. Keine Skalierung oder
  Dichtenormalisierung nötig. Zustand: Homepage, kein gespeicherter Entwurf,
  geschlossener Standortdialog.
- Direkte Playwright-Prüfung vom Nutzer am 02.10.2026 ausdrücklich freigegeben,
  nachdem der Cloud-Browser wiederholt ohne DOM oder Screenshot hängen blieb.
- Chromium 153.0.8010.12 gegen den lokalen Next-Produktionsbuild.

## Vergleich und Korrekturschleife

1. Referenz und erste Implementierungsaufnahme gemeinsam geöffnet. P2:
   Die technische Overline brach auf Desktop unerwünscht in zwei Zeilen um.
   Ursache: geerbtes `p { max-width: 62ch }` zusammen mit der Zierlinie.
   Vorher-Beleg: `docs/qa/hero-energy-2026-10-02/hero-1487-before.webp`.
2. Scoped `max-width: none` und `flex-shrink: 0` für die Linie ergänzt.
   Produktionsbuild und Typecheck erneut bestanden.
3. Neu aufgenommen und mit der Referenz verglichen, einschließlich Detailcrop
   (x40/y90, 1400 × 350 px) der Überschrift, Overline, Einleitung und CTA.
   Overline nun einzeilig. Desktop-Headline bleibt dreizeilig, rechte
   CTA-Spalte und Panorama entsprechen der ausgewählten Komposition.
   Keine offenen P0/P1/P2-Befunde.

## Geprüfte Gestaltungsflächen

- **Schrift:** tatsächliche IBM Plex Sans Condensed 700 und IBM Plex Mono aus
  der bestehenden Marke. Headline, Akzentzeilen und Hierarchie stimmen; die
  Bildgenerierung stellt den Schriftzug kräftiger dar als die reale
  Markenschrift. Diese Abweichung ist bewusst akzeptiert, keine dritte
  Schrift eingeführt. Text bleibt echtes, skalierbares HTML.
- **Abstände/Layout:** Textspalten, CTA, breites Motiv und Caption geprüft.
  Korrigierter Overline-Umbruch; keine abgeschnittenen Controls oder
  horizontalen Überläufe in den gemessenen Viewports.
- **Farben:** vorhandene Atlas-Tokens, Amber-Akzent, dunkle Oberfläche und
  sichtbare Interaktionskonturen. Unterstrichene Links bleiben erkennbar.
- **Bild:** eigenständiges WebP 1999 × 787 px, PV-Dach, Werkhalle, Speicher und
  Ladefahrzeug wie in der Vorlage. Sanfter Übergang am oberen Bildrand.
  Kleine dunkle Hintergründe der Beschriftungen dienen der Lesbarkeit.
- **Inhalt:** gewählte Überschrift, Einleitung und CTA; keine zugesagten
  Einsparbeträge oder garantierten Erträge. Der Standortcheck bereitet die
  fachliche Prüfung vor.

## Responsive- und Funktionsprüfung

- Neue Aufnahmen und DOM-Messungen bei 1487/1440/1280/1024/768/390/320 px.
  In allen Fällen entspricht Dokumentbreite der Viewportbreite.
- Standortdialog bei 1487/768/390/320 px ohne horizontalen Überlauf;
  Escape schließt und der Fokus kehrt zum öffnenden Button zurück.
- Mobile Belege: `hero-390-complete.webp`, `hero-320.webp`, `dialog-390.webp`
  im oben genannten QA-Verzeichnis. Auf Mobile stehen Bildbeschriftungen
  unter dem Motiv; Text und Einstieg stehen vor dem Bild.
- `capture-metrics.json` enthält Größen, Fokusnachweise und Konsolenergebnisse.
- 23/23 bestehende ausgewählte Playwright-Tests bestanden (1,4 Minuten):
  alle 18 Landing-Tests bei 1440/390 px; zwei vollständige Nutzerabläufe mit
  Upload, Ergebnis, Review und Einreichung; Tastatur/Dialog/axe-Smoke;
  42 Seitenansichten und sieben Dialog-Reflows; 200 % Text, Touch,
  reduzierte Bewegung und Querformat.
- 192/192 Unit-Tests, Produktionsbuild und Typecheck bestanden.
- Keine JavaScript-Laufzeitfehler. Ein erster automatischer Aufruf von
  `/favicon.ico` liefert 404; die Anwendung und ihre Bild-/Schriftdateien
  laden. Dies ist ein P3-Nachtrag, keine Funktions- oder Abnahmeblockade.

## Ergebnis

Die frühere Blockade der visuellen Abnahme ist durch den freigegebenen
Playwright-Weg behoben. Umsetzung für die bestehende Netlify-Site freigegeben.
Hosting-Tarif und Ressourcen bleiben unverändert.

## Live-Nachweis

Commit `eba9d317` mit Netlify-Deploy `6abfa22cde313623a350e370` veröffentlicht.
Die öffentliche Desktop-/Mobilansicht und der Dialog wurden zusätzlich mit
Playwright geprüft. Kein horizontaler Überlauf und keine JS-Laufzeitfehler.
Der Live-Zustand entspricht dem abgenommenen lokalen Build. Details:
[Veröffentlichung](docs/qa/HERO-ENERGY-2026-10-02.md#veröffentlichung-und-live-kontrolle).
