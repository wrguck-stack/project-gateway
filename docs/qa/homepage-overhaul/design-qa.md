# Homepage-Überarbeitung · Prüf- und Übergabestand

Stand: 9. September 2026. Ausgangspunkt: Branch `work`, Commit `7874c30c0a9bfcc367600b382e6f53061c7d43bb`. Umsetzung auf dem isolierten Branch `feat/homepage-professional-pass`.

## Ziel und gestalterische Grundlage

Die übergebenen Screenshots zeigen eine zurückhaltende Atlas-Oberfläche, deren konkreter Nutzen spät sichtbar wird, wiederholte Luftbilder und teilweise unbedienbare Vorschauen. Die Überarbeitung behält Anthrazit, Amber, IBM Plex, rechteckige Flächen und die bestehenden fachlichen Verträge bei. Sie führt früh zur Beispielakte und macht die Projektarten sowie die eingebettete Check-Vorschau bedienbar. Der zehnstufige Standortcheck und die fachlichen Bewertungsregeln bleiben die Grundlage.

Das Hero-Motiv zeigt ein eigenständiges Industriegebäude mit räumlicher Tiefe und natürlichem Licht. PV-Erweiterung, Speicher und Freifläche erhalten eigene Motive. Alle vier WebP-Dateien liegen lokal unter `public/atlas/`; die Bildherkunft ist in `hero-asset.json` und `project-assets.json` dokumentiert. Die Originaldateien wurden visuell angesehen. Die Motive sind ausdrücklich Illustrationen und kein Nachweis realer Referenzprojekte.

## Umgesetzte Interaktionen

| Element | Verhalten im Code und vorgesehene Prüfung |
| --- | --- |
| Beide Adressformulare | Gemeinsamer Adresswert, Vorschläge per Tastatur oder Pointer, nur ein laufender Start, Fehler am verwendeten Formular und erneuter Versuch. Entwurf wird bei gleicher Adresse und Projektart wiederverwendet. |
| Beispielakte | Drei bedienbare Tabs mit Tastaturnavigation, erkennbare Beispieldaten, Quellen und offene Punkte; Link zur vollständigen Beispielseite. |
| Eingebetteter Check | Dach/Freifläche, Fläche, Herkunft und Dachzustand ändern eine ungespeicherte Zusammenfassung. Unbekannte und ungültige Werte bleiben eindeutig. Kein API-Aufruf und keine Veränderung des Scores. |
| Vier Projektarten | Details lassen sich öffnen und schließen. Auswahl fokussiert den Einstieg und übergibt editierbare Vorgaben an einen echten Demo-Entwurf. Eine Erweiterung bestätigt keine bestehende PV-Anlage. |
| Score | 82-Punkte-Beispiel bleibt synthetisch. Vier sichtbare Faktoren verwenden die gemeinsame 0–20-Punkte-Achse; vollständige Erklärung führt zu allen neun Faktoren. |
| Abschnittslinks, FAQ und Partnerwege | Reale Anker und aufklappbare Antworten. Zusammenarbeit führt zum entsprechenden Kontaktthema, Partner-Demo zum vorhandenen Demo-Login. |
| Kontakt | Validierte E-Mail-/Telefonangaben aus Betreiber-Konfiguration erzeugen bedienbare Links. Ohne diese Daten erscheint ein transparenter Hinweis mit nutzbaren Beispielwegen. |
| Serverfehler | HTML-502, ungültige JSON-Antworten und Zeitüberschreitungen werden verständlich angezeigt. Keine automatische Wiederholung schreibender Requests. |

## Tatsächlich ausgeführte Validierung

| Prüfung | Ergebnis |
| --- | --- |
| TypeScript | `npm run typecheck` erfolgreich. |
| Unit- und Servicetests | `npm test`: 177 Tests in fünf Dateien bestanden. Enthält Vorgaben der Projektarten, Kontaktvalidierung und Fehlerbehandlung der API. |
| Produktionsbuild | `NODE_OPTIONS=--max-old-space-size=768 NEXT_TELEMETRY_DISABLED=1 npm run build -- --webpack` erfolgreich; alle Routen gebaut. |
| Entwicklungsserver | Next.js mit dem neuen Argument-Wrapper gestartet. HTTP 200 der Homepage und enthaltenes Hero-Heading innerhalb derselben Laufzeit bestätigt. |
| HTTP-Integration am Produktionsbuild | Acht Prüfungen bestanden: Homepage mit neuer Überschrift, konfigurierter Partnerschaftskontakt mit E-Mail-/Telefonlink, zwei unbekannte Pfade einschließlich `/constructor` mit HTTP 404 sowie alle vier neuen WebP-Assets mit HTTP 200 und passendem Dateityp. Synthetische Kontaktdaten ausschließlich im Testprozess; kein Versand. |
| Automatisierte Browserregression | Suite mit 29 Fällen gestartet. Alle Fälle scheiterten vor der ersten Seiteninteraktion, weil der benötigte Chromium-Headless-Browser nicht installiert ist. Der Installationsversuch erreichte den Downloadserver nicht und lief in einen Timeout. Dies sind keine bestandenen Funktionstests. |
| Neue Homepage-Fälle | 16 Fälle für Desktop 1440 und Mobil 390 vorbereitet: Vorschau, Tastatur-Tabs, vier Projektarten bis zu den gespeicherten Angaben, Formularfehler mit erneutem Versuch und Score-Achse. Ausführung bleibt offen. |
| Separate Cloud-Browservorschau | Zwei Starts des vorgesehenen Preview-Dienstes versucht. Trotz Startmeldung meldet der Browser für die zugehörige Vorschau `ERR_CONNECTION_REFUSED`. Die private Codespaces-Adresse führt zum GitHub-Login. Kein erfolgreicher Zugriff auf die neue Seite behauptet. |
| Visuelle Abnahme | Neue Assets geprüft; finale Seitenkomposition, mobile Umbrüche und Klickwege konnten im Browser nicht abschließend angesehen werden. Keine neuen Screenshot-Belege und kein erfolgreicher Vergleich der gerenderten neuen Seite mit den Referenzen. |

Die abschließende unabhängige Codeprüfung fand keine konkreten P0-/P1-Fehler. Zwei kleinere Randfälle wurden korrigiert: Telefonnummern müssen tatsächlich Ziffern enthalten, und unbekannte rechtliche Routen dürfen keine geerbten Objekteigenschaften auflösen. Unit-Tests und Produktionsbuild wurden danach erneut erfolgreich ausgeführt; die beiden HTTP-404-Fälle wurden am gebauten Server bestätigt.

Die 52 Screenshots und bestandenen Browserprüfungen im früheren Protokoll beziehen sich auf den ursprünglichen Stand. Sie werden nicht als Nachweis für diese Überarbeitung verwendet. Die neuen Tests müssen nach erfolgreichem Build in Codespaces bzw. einer Umgebung mit installiertem Chromium laufen:

```sh
npm ci
npx playwright install --with-deps chromium
npm run typecheck
npm test
npm run build -- --webpack
GATEWAY_QA_SCREENSHOTS=docs/qa/homepage-overhaul/screenshots npm run test:e2e
```

Anschließend die erzeugten Landing-Aufnahmen bei 1440, 1280, 1024, 768, 390, 360 und 320 Pixeln sowie 200 % Textgröße visuell prüfen. Die bestehenden End-to-End-Fälle decken außerdem den vollständigen Eigentümerpfad, Dateien, Zustimmung, Demo-Einreichung, Partneraktionen und Zugriffsschutz ab.

## Offene Übergabepunkte

- Reale Betreiber-, Ansprechpartner- und Kontaktdaten fehlen. Die optionalen Variablen in `.env.example` sind vorbereitet; keine Namen oder Unternehmensdaten wurden erfunden.
- Keine GVS-Partnerschaft, verwalteten Vermögenswerte, Kundenlogos, Kundenstimmen oder technische Prüfleistungen werden behauptet.
- Produktive Anmeldung, Geodaten, technische Bewertung, Datenbankanbindung und echte Partnerzustellung bleiben die bereits dokumentierten Integrationsgrenzen des Demo-Produkts.
- Die automatische Freigabe hat den Push zu GitHub abgelehnt, weil die Nutzerfreigabe für die Homepage-Umsetzung nicht als ausdrückliche Erlaubnis zum Hochladen des Repository-Inhalts an den Remote gewertet wurde. Es erfolgte kein Push, kein Merge und kein Deployment. Die überprüfbare lokale Änderung wird vor einem erneuten Push zur ausdrücklichen Freigabe vorgelegt.
