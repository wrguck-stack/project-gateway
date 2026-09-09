# Homepage-Überarbeitung · Prüf- und Übergabestand

Stand: 9. September 2026. Ausgangspunkt: Branch `work`, Commit `7874c30c0a9bfcc367600b382e6f53061c7d43bb`. Umsetzung auf dem isolierten Branch `feat/homepage-professional-pass`.

## Ziel und gestalterische Grundlage

Die übergebenen Screenshots zeigen eine zurückhaltende Atlas-Oberfläche, deren konkreter Nutzen spät sichtbar wird, wiederholte Luftbilder und teilweise unbedienbare Vorschauen. Die Überarbeitung behält Anthrazit, Amber, IBM Plex, rechteckige Flächen und die bestehenden fachlichen Verträge bei. Sie führt früh zur Beispielakte und macht die Projektarten sowie die eingebettete Check-Vorschau bedienbar. Der zehnstufige Standortcheck und die fachlichen Bewertungsregeln bleiben die Grundlage.

Das Hero-Motiv zeigt ein eigenständiges Industriegebäude mit räumlicher Tiefe und natürlichem Licht. PV-Erweiterung, Speicher und Freifläche erhalten eigene Motive. Alle vier WebP-Dateien liegen lokal unter `public/atlas/`; die Bildherkunft ist in `hero-asset.json` und `project-assets.json` dokumentiert. Die Originaldateien wurden visuell angesehen. Die Motive sind ausdrücklich Illustrationen und kein Nachweis realer Referenzprojekte.

## Umgesetzte Interaktionen

| Element                              | Verhalten im Code und vorgesehene Prüfung                                                                                                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Beide Adressformulare                | Gemeinsamer Adresswert, Vorschläge per Tastatur oder Pointer, nur ein laufender Start, Fehler am verwendeten Formular und erneuter Versuch. Entwurf wird bei gleicher Adresse und Projektart wiederverwendet. |
| Beispielakte                         | Drei bedienbare Tabs mit Tastaturnavigation, erkennbare Beispieldaten, Quellen und offene Punkte; Link zur vollständigen Beispielseite.                                                                       |
| Eingebetteter Check                  | Dach/Freifläche, Fläche, Herkunft und Dachzustand ändern eine ungespeicherte Zusammenfassung. Unbekannte und ungültige Werte bleiben eindeutig. Kein API-Aufruf und keine Veränderung des Scores.             |
| Vier Projektarten                    | Details lassen sich öffnen und schließen. Auswahl fokussiert den Einstieg und übergibt editierbare Vorgaben an einen echten Demo-Entwurf. Eine Erweiterung bestätigt keine bestehende PV-Anlage.              |
| Score                                | 82-Punkte-Beispiel bleibt synthetisch. Vier sichtbare Faktoren verwenden die gemeinsame 0–20-Punkte-Achse; vollständige Erklärung führt zu allen neun Faktoren.                                               |
| Abschnittslinks, FAQ und Partnerwege | Reale Anker und aufklappbare Antworten. Zusammenarbeit führt zum entsprechenden Kontaktthema, Partner-Demo zum vorhandenen Demo-Login.                                                                        |
| Kontakt                              | Validierte E-Mail-/Telefonangaben aus Betreiber-Konfiguration erzeugen bedienbare Links. Ohne diese Daten erscheint ein transparenter Hinweis mit nutzbaren Beispielwegen.                                    |
| Serverfehler                         | HTML-502, ungültige JSON-Antworten und Zeitüberschreitungen werden verständlich angezeigt. Keine automatische Wiederholung schreibender Requests.                                                             |

## Browserprüfung in Codespaces abgeschlossen

Die beim ursprünglichen Handoff fehlende Chromium-Installation wurde in Codespaces nachgeholt. Die überarbeitete Homepage wurde vom Remote-Branch `feat/homepage-professional-pass` übernommen. Vor dem Wechsel wurde die lokale Änderung an `next-env.d.ts` im Stash `Backup before homepage-professional-pass checkout 2026-09-09` gesichert.

Die aktuellen Ergebnisse, Screenshots und reproduzierbaren Befehle stehen im [Browser-Prüfbericht](browser-review/REPORT.md). Die Dateien unter `screenshots/` und `browser-review/` wurden für diese überarbeitete Homepage neu aufgenommen. Frühere Screenshots unter anderen QA-Verzeichnissen dienen nicht als Nachweis dieses Durchlaufs.

Bei der Prüfung wurden folgende Fehler korrigiert:

- Die Hero-Schrittnummern konnten durch `flex: 0` auf zwei Zeilen umbrechen. Sie behalten nun ihre natürliche Breite.
- Der Entwicklungsserver blockierte die HMR-Verbindung über `127.0.0.1`. Die Next-Konfiguration erlaubt jetzt diesen lokalen Host und den konkreten privaten Codespaces-Host für Port 3000.
- Die Abschnittsnavigation konnte die URL ändern, ohne zum Abschnitt zu scrollen. Native Anker führen nun zuverlässig zu Ablauf und Projektpartnern. Beim Schließen des mobilen Menüs stellt der Dialog den Fokus ohne einen zusätzlichen Scrollsprung wieder her.

Zusätzliche Regressionen prüfen die Abschnittsnavigation einschließlich des Wechsels von der Beispielseite sowie den vollständigen Standortcheck auf einem mobilen Touch-Viewport. Die visuelle Prüfung vergleicht die gerenderten Seiten mit der vorgegebenen Atlas-/Variante-1-Richtung: IBM Plex, Anthrazit/Amber, rechteckige Flächen, responsive Check-Shell und Score-Geometrie.

## Offene Übergabepunkte

- Reale Betreiber-, Ansprechpartner- und Kontaktdaten fehlen. Die optionalen Variablen in `.env.example` sind vorbereitet; keine Namen oder Unternehmensdaten wurden erfunden.
- Keine GVS-Partnerschaft, verwalteten Vermögenswerte, Kundenlogos, Kundenstimmen oder technische Prüfleistungen werden behauptet.
- Produktive Anmeldung, Geodaten, technische Bewertung, Datenbankanbindung und echte Partnerzustellung bleiben die bereits dokumentierten Integrationsgrenzen des Demo-Produkts.
