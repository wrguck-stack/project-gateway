# Landingpage: Atlas Variante 1 – visueller Abgleich

Stand: 8. September 2026. Ausgangsstand: `f01d596ea02e2931474d0eac58e436bafa1b49eb` auf `work`.

## Quellen und Vergleich

`AGENTS.md` wurde zuerst geprüft, `02_PRODUCT_DESIGN_FULL.md` vollständig gelesen. Die bereits gelesenen Aufgaben- und Analytics-Verträge bleiben verbindlich. Alle fünf Seiten von `04_PRODUCT_DESIGN_VISUALS.pdf` wurden neu als Bilder gerendert und angesehen. Für diese Korrektur sind insbesondere Seite 1 (Hero), Seite 2 (Landingpage, Projektartbilder) und Seite 3 (unbeschrifteter Luftbildausschnitt) relevant.

Die Quellen und Handoffs wurden nicht verändert. Normative Typografie, Farben, Formulare, mobile Reihenfolge und redaktionelle Projektart-Zeilen haben Vorrang vor illustrativen Beschriftungen und Layoutdetails der generierten Boards. Atlas Variante 1 bleibt die Designrichtung.

- [Gerenderte PDF-Seite 1](references/product-reference-1.png), [Seite 2](references/product-reference-2.png), [Seite 3](references/product-reference-3.png)
- [Referenz neben Ausgangsstand](references/reference-versus-before.png)
- [Referenz neben korrigiertem Browserstand](reference-versus-after.png)

Die PDF-Komposition wurde für den direkten Vergleich auf die gleiche Darstellungsbreite skaliert. Das PDF enthält keinen Browser-Viewport mit messbarer CSS-Pixelgröße. Der Vergleich bewertet deshalb Komposition und Hierarchie; er ist kein Pixel-Diff. Die Vorher-/Nachher-Browseraufnahmen verwenden dagegen exakt gleiche Viewports und den leeren Ausgangszustand.

## Belegte Abweichungen und Änderungen

1. **Titel und früher Einstieg.** Auf Desktop zerfiel die Überschrift in fünf Zeilen, einschließlich eines getrennten „Gewerbeimmobilie“. Sie nutzt jetzt die vier Zeilen der Referenz bei unverändert 72/74 px. Die letzte Zeile bleibt auf Desktop zusammen. Die Nutzenzeile erhält ausreichend Breite; obere Abstände und der Abstand zum Formular wurden reduziert. Auf Mobilgeräten beginnt die Frage direkt nach dem Header und dem Demo-Hinweis. Beschriftung, Eingabe, Button und kurzer Kontext stehen vor dem Bild.
2. **Bildmotiv und Proportionen.** Die bisherige schematische SVG-Grafik entsprach nicht dem freigegebenen Hero mit Luftansicht, Halle, Ladehof und gelber Dachkontur. Auf der Landingpage wird jetzt ein reiner Bildausschnitt des vorhandenen Atlas-Boards verwendet. Die Halle bleibt auf Desktop vollständig im Bild; ein Verlauf verbindet die Bildfläche mit dem Graphit-Hintergrund. Das Bild bestimmt nicht länger über sein natürliches Seitenverhältnis die Höhe des gesamten Hero-Rasters. Die vier Projektart-Zeilen erhalten die entsprechenden vorhandenen Bildausschnitte. Auf Mobilgeräten folgen innerhalb jeder Zeile Bild, Titel und Beschreibung in dieser Reihenfolge.
3. **Typografie und untere Bereiche.** IBM Plex Sans Condensed bleibt verbindlich. Die tatsächlichen Browser-Fontfaces wurden zusätzlich über Chromium/CDP geprüft: Bold im Titel, Regular in der Nutzenzeile, Medium im Label und SemiBold in der Marke. Kein Schriftfamilienwechsel. Das FAQ-Außenraster folgt wieder der gemeinsamen Inhaltskante; die Fragen bleiben auf eine gut lesbare Breite begrenzt.

Adresszustand, Vorschlagsauswahl, Wiederaufnahme, Links, FAQ und Standortcheck-Logik sind unverändert. Die Bildänderung betrifft die Landingpage, nicht die Standortdaten und Kartenfunktionen im Check.

## Vorher-/Nachher-Aufnahmen

| Ansicht | Vorher | Nachher | Vergleich |
| --- | --- | --- | --- |
| Desktop 1440 × 900 | [Screenshot](before/landing-1440.png) | [Screenshot](after/landing-1440.png) | [Nebeneinander](desktop-before-after.png) |
| Mobil 390 × 844 | [Screenshot](before/landing-390.png) | [Screenshot](after/landing-390.png) | [Nebeneinander](mobile-before-after.png) |
| Ganze Desktop-Seite | [Screenshot](before/landing-1440-full.png) | [Screenshot](after/landing-1440-full.png) | |
| Ganze mobile Seite | [Screenshot](before/landing-390-full.png) | [Screenshot](after/landing-390-full.png) | |

[Mobile Projektart-Zeilen im Detail](after/project-types-390.png). Weitere Aufnahmen für 1280, 1024, 768, 360 und 320 px liegen in `before/` und `after/`.

Gemessene Unterkante des primären „Standort prüfen“-Buttons, relativ zum oberen Viewport-Rand:

| Breite | Vorher | Nachher | Früher sichtbar |
| --- | ---: | ---: | ---: |
| 1440 px | 809 px | 649 px | 160 px |
| 1280 px | 809 px | 649 px | 160 px |
| 1024 px | 679 px | 593 px | 86 px |
| 768 px | 619 px | 593 px | 26 px |
| 390 px | 608 px | 542 px | 66 px |
| 360 px | 596 px | 530 px | 66 px |
| 320 px | 655 px | 589 px | 66 px |

Die Desktop-Titelhöhe sinkt von rund 370 auf 296 px. Auf 390 und 360 px bleibt auch mobil das gesamte Wort ungeteilt; auf 320 px wird es am vorgesehenen weichen Trennzeichen lesbar umgebrochen. Exakte DOM-Messwerte: [vorher](before/metrics.json), [nachher einschließlich Fontfaces](after/metrics.json).

## Tatsächlich ausgeführte Prüfung

- `npm run typecheck`: erfolgreich.
- `npm test`: **168 Tests in 3 Dateien bestanden**.
- `npm run build`: erfolgreicher Next.js Production Build einschließlich TypeScript und Routenerzeugung.
- Prettier-Prüfung der geänderten Code-Dateien und `git diff --check`: erfolgreich.
- `node scripts/capture-landing.mjs after`: echter Chromium-Browser mit Viewports **1440, 1280, 1024, 768, 390, 360 und 320 px**. Auf allen sieben Breiten: kein horizontaler Überlauf, keine `pageerror`-Fehler, alle Landingpage-Bildassets geladen, primärer Button vollständig im ersten Viewport. Der ungeteilte Desktop-Begriff wird zusätzlich anhand der Text-ClientRects geprüft. Alle sieben Ansichten sowie Desktop-/Mobil-Ganzseiten wurden visuell betrachtet.
- Drei bestehende Playwright-Regressionsfälle gegen einen getrennten Production-Server auf Port 3103: **3 bestanden, 28,4 s**. Abgedeckt sind der vollständige öffentliche Dachprojekt-Ablauf einschließlich Dateiupload, Ergebnis, Einwilligung und simuliertem Beleg; Tastatur-Vorschlagsauswahl, Dialogfokus und axe-Zugänglichkeitsprüfung; mobile Touch-Bedienung, FAQ, 200 % Text, reduzierte Bewegung und Kartenansicht im Querformat. [Browserartefakte](flows/).

Reproduzierbarer Aufruf der ausgewählten Regressionstests:

```sh
GATEWAY_E2E_PORT=3103 GATEWAY_QA_SCREENSHOTS=docs/qa/landing-refinement/flows npm run test:e2e -- --grep 'complete public roof|keyboard combobox|200% text'
```

Die übrigen E2E-Fälle der Gesamtanwendung wurden für diese Landingpage-Korrektur nicht erneut ausgeführt. Mobile QA erfolgte durch Chromium-Touch-/Viewport-Emulation, nicht auf einem physischen Smartphone. Firefox und Safari wurden in diesem Durchlauf nicht geprüft.

## Bildassets und verbleibende Einschränkung

Separate Originalbilddateien wurden nicht mitgeliefert. Die PDFs enthalten gerasterte, generierte Designboards, keine freigegebenen hochauflösenden Produktionsfotos. Für die lokale Demo wurden ausschließlich bildliche Bereiche ohne eingebrannte UI, Adressen, Koordinaten, Maßstäbe oder Zahlen ausgeschnitten und verlustfrei als WebP gespeichert. Es wurden keine Bilddetails erfunden, nachgezeichnet oder generativ ergänzt. Die Aufnahme wird ausdrücklich als Beispielansicht ohne Standortanalyse bezeichnet.

- Luftansicht der Halle mit Ladehof: vorhandener sauberer Ausschnitt **304 × 332 px**, PDF-Seite 3. Auf Desktop deshalb sichtbar begrenzte Schärfe.
- Gewerbedach-PV, PV-Erweiterung, Speicherprojekt und Freiflächenprojekt: jeweils ungefähr **170 × 73 px**, PDF-Seite 2.
- **Weiterhin fehlen:** die separate hochauflösende Luftbild-/Hallendatei des freigegebenen Motivs, die vier separaten Projektart-Originalbilder sowie ihre Herkunfts-/Nutzungsangaben. Für eine scharfe endgültige Bildumsetzung werden diese Quelldateien benötigt.

[Provenienz mit PDF-Hash, Seiten, Pixelkoordinaten und Dateigrößen](asset-provenance.json). Die Ausschnitte sind ein transparent gekennzeichneter Demo-Zwischenstand, keine Behauptung, dass Produktionsassets vorliegen.

## Laufende Vorschau

Der aktualisierte Production Build läuft über `npm run start -- --port 3000` mit Bindung an **0.0.0.0:3000**. Die Startseite wurde lokal per HTTP und Chromium erfolgreich geladen. Es wurde kein Deployment durchgeführt und die Port-Sichtbarkeit wurde nicht geändert.
