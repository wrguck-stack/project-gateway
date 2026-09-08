# Landingpage: Abstände, Produktvorschau und Score

Stand: 8. September 2026. Ausgangsstand: `904a6ab6cdcc94460c71786c6243e271814eaa3e`, Branch `work`.

## Ergebnis

Atlas / Variante 1, die vorhandenen Schriftfamilien und sämtliche Bewertungsregeln bleiben erhalten. Die Änderungen betreffen die Landingpage; der Standortcheck und seine Berechnungen wurden nicht verändert.

- **Abstände:** Die Abschnittsgrenzen verwenden zusammen 96 px auf Desktop, 80 px auf Tablet und 64 px mobil. Dafür werden die vorhandenen Maße 48, 40 und 32 px je Seite verwendet. Zuvor summierten sich die Desktop-Innenabstände auf 192 px. Prozessabsätze haben keinen zusätzlichen unteren Außenabstand mehr. Keine starren Abschnittshöhen.
- **Hero:** Überschrift, Nutzenzeile und Standorteingabe haben auf Desktop eine gemeinsame Breite von 640 px. Die bereits korrigierten vier Titelzeilen bei 72/74 px bleiben erhalten, einschließlich des ungeteilten Desktop-Worts „Gewerbeimmobilie“. Die Vorschlagsliste liegt über der Prozessleiste. Der primäre Button bleibt bei 1440 px bis y=649 px und bei 390 px bis y=542 px vollständig im ersten Viewport; diese bereits erreichte vertikale Position bleibt unverändert.
- **Produktvorschau:** Das zweite Hallenbild wurde durch einen HTML-Auszug aus Schritt 3 „Objekt“ ersetzt. Verwendet werden die vorhandenen `Options`, `SelectField` und `Field`: Dach/Freifläche, Genauigkeit der Fläche, verfügbare Fläche und Dachzustand. „Beispieldaten · Standortcheck“, „Auszug aus Schritt 3 von 10“ sowie geschätzte/unbekannte Angaben sind sichtbar. Die Beispielansicht ist nicht bearbeitbar; „Eigenen Standort prüfen“ führt zur tatsächlichen Standorteingabe. Keine neuen Funktionen oder Ergebnisse.
- **Score:** „4 von 9 Faktoren“, gemeinsame beschriftete Punkteachse und gut lesbare Punktwerte. Die vier Beiträge und die 82 Punkte stammen jetzt direkt aus dem vorhandenen `analytics-examples.json`-Beispiel `scoreFull`. Beispielkennzeichnung, vorläufiger Status, fehlende technische Freigabe und offene Prüfung von Netzanschluss/Tragfähigkeit bleiben sichtbar. Der Link führt direkt nach `/beispiel#score`; dort lassen sich alle neun Faktoren öffnen.

## Vorher / Nachher und Quellen

| Ansicht | Vorher | Nachher | Vergleich |
| --- | --- | --- | --- |
| Desktop 1440 × 900, ganze Seite | [Bild](before/landing-1440.png) | [Bild](after/landing-1440.png) | [Nebeneinander](desktop-before-after.png) |
| Mobil 390 × 844, ganze Seite | [Bild](before/landing-390.png) | [Bild](after/landing-390.png) | [Nebeneinander](mobile-before-after.png) |
| Standortcheck, Desktop / Mobil | | | [1440 px](check-1440-before-after.png), [390 px](check-390-before-after.png) |
| Score, Desktop / Mobil | | | [1440 px](score-1440-before-after.png), [390 px](score-390-before-after.png) |

Die Browserbilder zeigen dieselben Viewports und den leeren Ausgangszustand. Einzelaufnahmen von Hero, Prozess, Check, Score und Projektarten liegen jeweils in `before/` und `after/`. Für die Übersicht sind Desktop-Vergleichsbilder verkleinert; die Einzelaufnahmen behalten die Originalauflösung.

`AGENTS.md`, Aufgabenstellung, Product-Design- und Analytics-Verträge wurden geprüft. Die Handoffs einschließlich beider PDFs sind unverändert. Der bestehende Render von Product Design Seite 2 wurde erneut direkt mit dem aktuellen Browserbild verglichen. Das Analytics-PDF wurde als [Seitenübersicht](references/analytics-overview.png) und die Score-Referenz auf [Seite 3](references/analytics-score.png) neu gerendert und angesehen.

- [Atlas-Referenz neben aktuellem Browserstand](reference-versus-after.png)
- [Analytics-Referenz neben Landingpage-Score](score-reference-versus-after.png)

Die PDFs besitzen keinen festgelegten Browser-Viewport. Ihr Vergleich prüft Komposition und Semantik, keinen Pixel-Diff. Die explizit gewünschte Formularvorschau ersetzt die Bildwiederholung des Boards. Normative redaktionelle Projektart-Zeilen und Analytics-Werte haben weiterhin Vorrang vor widersprüchlichen illustrativen Boarddetails.

## Gemessene Abstände und Balken

Abstände zwischen den Inhaltsboxen, einschließlich der 1-px-Abschnittslinie:

| Grenze | 1440 px vorher → nachher | 390 px vorher → nachher |
| --- | ---: | ---: |
| Ende Prozessschritte → Beginn Checkvorschau | 193 → 97 px | 129 → 65 px |
| Ende Score-Inhalt → Projektarten-Überzeile | 193 → 97 px | 129 → 65 px |

Die gesamte Desktop-Seite wird rund 598 px kürzer. Mobil wird sie trotz reduzierter Leerabstände rund 185 px länger: Die lesbare Produktvorschau und die breiteren, separat angeordneten Balken benötigen mehr Inhaltshöhe als das bisherige Foto und die engen Balkenzeilen. Es wird keine künstlich verkürzte Darstellung behauptet. [Messwerte vorher](before/metrics.json), [nachher](after/metrics.json).

Bereits im Ausgangsstand lief „18/20“ nicht über seinen Rahmen hinaus. Korrigiert wurden die fehlende Skalenbeschriftung, die enge mobile Darstellung und der Einfluss des 1-px-Innenrahmens auf die Füllbreite. Der Rahmen wird jetzt als Outline gezeichnet.

Analytics verlangt eine **gemeinsame Achse von 0 bis 20 Punkten**, keine Normierung aller Maximalrahmen auf dieselbe Länge:

| Faktor | Beitrag / Maximum | Füllung auf 0–20-Achse | Erfüllung des eigenen Maximums |
| --- | ---: | ---: | ---: |
| Nutzbare Fläche | 13/15 | 65 % | 86,7 % |
| Solar-/Ertragspotenzial | 12/15 | 60 % | 80 % |
| Verbrauch / Eigenverbrauch | 18/20 | 90 % | 90 % |
| Entscheidungssituation | 15/15 | 75 % | 100 % |

Bei 390 px ist die Achse 350 px breit: „18/20“ füllt 315 px, „15/15“ füllt seinen 262,5-px-Rahmen vollständig. Bei 1440 px beträgt die Achse 268 px. Die Geometrie wird an beiden Breiten gegen unabhängige Vertragswerte getestet. Gesamtscore, Gewichtungen und Regeln sind unverändert.

## Tatsächlich ausgeführte Prüfungen

- `npm test`: **168 Tests in 3 Dateien bestanden**.
- `npm run typecheck`, `npm run build`, Prettier für die geänderten Code-Dateien und `git diff --check`: erfolgreich.
- `node scripts/capture-landing-product.mjs`: Chromium bei **1440, 1280, 1024, 768, 390, 360 und 320 px**. Kein horizontaler Seitenüberlauf, keine JavaScript-Seitenfehler, Bilder geladen und primärer Button im ersten Viewport. Desktop-Wortumbruch zusätzlich über Textrechtecke geprüft.
- Die betroffenen Abschnitte bei **1440 und 390 px** sowie die vollständigen Vorher-/Nachher-Ansichten wurden visuell angesehen und mit den Quellen verglichen. Mobile QA durch Chromium-Viewport-/Touch-Emulation, kein physisches Smartphone; Safari und Firefox wurden nicht geprüft.
- **5 Playwright-Browserfälle bestanden, letzter vollständiger Lauf 31,1 s:** neue Vorschau-/Geometrie-/Linktests bei 1440 und 390 px; vollständiger öffentlicher Dachprojektablauf einschließlich Dateiupload, Ergebnis, Einwilligung und simuliertem Beleg; Tastaturauswahl, Dialogfokus und axe-Prüfung; Touch, FAQ, 200 % Text, reduzierte Bewegung und Karte im Querformat.
- Der neue Browsertest prüft insbesondere die gesperrten Beispielfelder, 82/100, alle vier Balken, die neun erreichbaren Faktoren, den Rücksprung zur Eingabe, anklickbare Adressvorschläge, gemeinsamen Adresszustand beider Eingaben und die Übernahme in Schritt 1. Die ersten Testläufe fanden unpassende Selektoren; sie wurden auf die tatsächlichen Formulare, Vorschlagsliste und äußere Faktorenüberschrift korrigiert. Ein abgebrochener Lauf hinterließ einen Testserver auf 3103; dieser wurde beendet, bevor der erfolgreiche vollständige Lauf startete.

```sh
GATEWAY_E2E_PORT=3103 GATEWAY_QA_SCREENSHOTS=docs/qa/landing-product-pass/flows npm run test:e2e -- --grep 'landing product|complete public roof|keyboard combobox|200% text'
```

Die übrigen E2E-Fälle der Gesamtanwendung wurden in diesem Durchlauf nicht erneut ausgeführt. [Aufnahmen der geprüften Abläufe](flows/).

## Bildqualität: verbleibender Punkt

Die bestehenden Bildausschnitte sind die einzigen verfügbaren Assets. Die vier Motive passen zu Dach-PV, PV-Erweiterung, Speichercontainer und Freifläche. Sie werden bei 1440 und 390 px nun in ihrer jeweiligen nativen Größe angezeigt, ohne die bisherige minimale Streckung auf einheitlich 170 px. Der bestehende Hero-Ausschnitt bleibt erhalten.

| Vorhandene Datei unter `public/atlas/` | Native Auflösung | Fehlendes Original |
| --- | ---: | --- |
| `atlas-reference-aerial.webp` | 304 × 332 px | Hochauflösende Luftansicht der Atlas-Halle mit Ladehof |
| `atlas-reference-roof.webp` | 170 × 73 px | Separates Motiv der unbelegten Gewerbedachfläche |
| `atlas-reference-extension.webp` | 169 × 73 px | Separates Motiv der vorhandenen PV-Dachanlage |
| `atlas-reference-storage.webp` | 167 × 73 px | Separates Motiv des Batteriespeichercontainers |
| `atlas-reference-ground.webp` | 167 × 73 px | Separates Motiv der unbebauten Freifläche |

Für eine scharfe endgültige Darstellung fehlen diese fünf hochauflösenden Quelldateien samt Herkunfts-/Nutzungsangaben. Insbesondere das Hero-Bild bleibt wegen seiner geringen Originalauflösung sichtbar begrenzt; für Displays mit hoher Pixeldichte reichen auch die kleinen Projektmotive nicht aus. Es wurden keine zusätzlichen Details generiert oder fehlende Originale vorgetäuscht. Die bisherige [Asset-Provenienz](../landing-refinement/asset-provenance.json) gilt weiter.

## Private Vorschau

`npm run start -- --port 3000` läuft in einem weiterlaufenden Terminal mit Bindung an **0.0.0.0:3000**.

- **Lokal:** `http://127.0.0.1:3000` antwortet mit HTTP 200.
- **Codespaces im Browser:** Die private HTTPS-Vorschau wurde am 8. September 2026 um 20:54 UTC authentifiziert in Chromium geöffnet. Nach dem Codespaces-Zwischenschritt erschienen die tatsächliche Landingpage, die neue Formularvorschau, „4 von 9 Faktoren“ und ein funktionierender Adressvorschlag. Keine JavaScript-Seitenfehler. [Prüfprotokoll](preview-check.json), [Screenshot](private-preview-1440.png).
- `gh codespace ports` bestätigt für Port 3000 **private**. Die Sichtbarkeit wurde nicht verändert. Keine Veröffentlichung oder Deployment. Der Prozess läuft innerhalb dieses Codespaces; ein Codespace-Neustart beendet ihn.

Vorschau: https://curly-umbrella-x57j4pw645xrf67g9-3000.app.github.dev
