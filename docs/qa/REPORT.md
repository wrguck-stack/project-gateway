# Project Gateway — Abnahmeprotokoll

> Dieses Protokoll dokumentiert den ursprünglichen Stand vom 7./8. September. Für die anschließende Homepage-Überarbeitung gilt das separate [Prüfprotokoll vom 9. September](homepage-overhaul/design-qa.md). Die früheren Browserergebnisse und Screenshots belegen nicht die neue Homepage.

Ausgeführt im Codespace am 7./8. September 2026 auf Branch `work`. Grundlage: `AGENTS.md`, `01_CODEX_TASK.md`, Product Design, Analytics Core und beide vollständig gerenderten Visual-Reference-PDFs (5 Produktseiten, 11 Analytics-Seiten). Die sechs verbindlichen Handoff-Dateien wurden anhand ihrer SHA-256-Prüfsummen unverändert erhalten. Die bereits vorhandenen Änderungen an AGENTS/Task sowie Analytics Core bleiben Bestandteil der Übergabe.

## Ausgeführte Prüfungen

| Prüfung                | Ergebnis                                                                                                                                                                                                                                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Paketinstallation      | Vorgesehener Next.js-/React-/TypeScript-/Tailwind-Stack installiert, Lockfile vorhanden. Sandbox-DNS scheiterte zunächst mit `EAI_AGAIN`; freigegebene Installation außerhalb der Sandbox erfolgreich.                                                                                                                      |
| Fachlogik und Services | `npm test`: 168 Tests in 3 Dateien bestanden. Alle 121 Statuspaare, Scoregrenzen, Teilspannen ohne Hochrechnung, Unknown/Nullwert, Gründe, Uploadgrenzen, Dateiinhalt, Zugriff, Revisionen, idempotente Übergaben/Entscheidungen, unveränderliche Snapshots und Jahresenergie-Vergleich.                                    |
| TypeScript             | `npm run typecheck`: erfolgreich, keine Fehler.                                                                                                                                                                                                                                                                             |
| Production Build       | `npm run build`: erfolgreich mit Next.js 16.3.4 / Turbopack, einschließlich TypeScript und aller App-Routen.                                                                                                                                                                                                                |
| Datenbankschema        | Drizzle-SQL-Migration mit 24 Tabellen erzeugt. Kein PostgreSQL-Server angebunden und keine Migration gegen eine echte Datenbank ausgeführt.                                                                                                                                                                                 |
| Browser                | Alle 13 Chromium-Fälle bestanden: Shard 1/2 mit 7 Tests in 38,3 s; Shard 2/2 mit 6 Tests in 59,1 s. Jeweils Exit 0, frischer Server und isolierter Demo-Speicher. 42 Responsive-Kombinationen, insgesamt 52 PNG-Aufnahmen. Im öffentlichen End-to-End-Pfad keine JavaScript-Laufzeitfehler; axe-Smoke-Checks ohne Verstöße. |

Chromium und die erforderlichen Linux-Bibliotheken wurden installiert. Playwright startet `next start` aus dem Production Build und verwendet pro Lauf einen neuen privaten Demo-Datenordner. Portbindung und Browser benötigen in dieser Umgebung freigegebene Ausführung außerhalb der Sandbox. Ein Zwischenlauf endete mit SIGTERM (Exit 143); er wird nicht als vollständiger Erfolg gezählt. Sein verbliebener Testserver führte nach einem Build zu fehlerhaften Client-Dateiladungen in einem Folgelauf. Der identifizierte alte Prozess wurde beendet. `reuseExistingServer: false` verhindert nun eine unbemerkte Wiederverwendung; die beiden abschließenden Gruppen starteten jeweils einen frischen Server. Die vollständige Suite wurde wegen wiederholter SIGTERM-Abbrüche in zwei kürzere Gruppen aufgeteilt; es wird kein erfolgreicher ungeteilter Gesamtlauf behauptet.

Reproduzierbare Abnahmebefehle für diese eingeschränkte Umgebung:

```sh
GATEWAY_E2E_PORT=3102 npm run test:e2e -- --fully-parallel --workers=1 --shard=1/2
GATEWAY_E2E_PORT=3103 npm run test:e2e -- --fully-parallel --workers=1 --shard=2/2
```

Die Aufteilung erfolgt pro Test; ein Worker vermeidet konkurrierende Mutationen am gemeinsamen Demo-Bestand. Chromium bestätigt die tatsächlich gerenderten lokalen IBM-Plex-Schriften für Hero, Fließtext und Adresse auch über das DevTools-Protokoll.

## Browserumfang

Die vollständige öffentliche Dach-Strecke durchläuft Landing, Adresse, Q01–Q10, echten CSV-Dateiupload, Review-Bearbeitung, Qualifizierung, 82-Punkte-Ergebnis, ausdrückliche Zustimmung und simulierten Übermittlungsbeleg. Weitere Fälle prüfen Freifläche, unbekannten Verbrauch, bestätigte 0, fehlende Unterlagen, manuelle Adresse, Teilscore, veraltete Bewertung, Fehlerzustand und bestätigten Blocker bei hohem Score. Ein im Test zurückgehaltener echter Qualifizierungsrequest prüft die laufende Anzeige und anschließende Fertigstellung ohne erfundene Prozentwerte.

Partnerprüfung: Demo-Sitzung, Statusfilter, 50er-Pagination, Akte, Rückkehr mit erhaltenen Filtern, Informationsanforderung, Übernahme, OTHER-Ablehnung, Wiederaufnahme und paralleler Versionskonflikt mit bewusstem Neuladen. Der Browser überprüft die Geometrie der separaten Energie-Szenariospanne sowie den erhaltenen letzten Wert bei fehlgeschlagener Aktualisierung.

Accessibility: Tastaturbedienung der Adressauswahl, native Dialoge mit Escape und Fokusrückgabe, axe-Prüfung von Landing, Energieformular und Filterdialog. Zusätzlich Touch-Kontext ohne Hover, reduzierte Bewegung, 200 % Textvergrößerung und Kartenmodal in 844 × 390. Kein Test mit physischem Mobilgerät, Screenreader, Firefox oder Safari; dies ist kein vollständiges WCAG-Audit.

## Responsive- und visuelle Sichtprüfung

Jeweils reale Browser-Screenshots für Landing, Objektformular, Ergebnis, Partnerliste, vollständige Akte und Pipeline bei **1440, 1280, 1024, 768, 390, 360 und 320 CSS-Pixeln**. Desktop/Tablet-Höhe 1000, schmale Ansichten 844. Der Browser prüft für alle 42 Kombinationen, dass das Dokument nicht horizontal überläuft. Zusätzliche Aufnahmen zeigen Energie- und Dokumentformular, Ergebnis mit geöffneten Faktoren, Übermittlungsbeleg, laufende Analyse, Jahresenergie-Szenario, Textvergrößerung und Querformatkarte.

Die Sichtprüfung vergleicht Komposition, IBM-Plex-Typografie, Graphitflächen, zurückhaltendes Amber, helles Adressfeld, Formular-/Objektteilung, Scorehierarchie, Quellhinweise, Arbeitsplatzdichte und mobile Lesereihenfolge mit den Produkt- und Analytics-Boards. Die Standortgrafik ist im Demo ausdrücklich schematisch, ohne reale Luftbild-, Maßstabs- oder Flächenermittlungsbehauptung. Beliebige Nutzeradressen erhalten einen Fakten-Fallback. Normative Datenregeln haben Vorrang vor illustrativen Werten auf den Boards.

Konkrete Korrekturen aus Browser-/Sichtprüfung:

- 320-Pixel-Umbruch, sinnvolle Trennstellen langer deutscher Überschriften und Mindestbreite der Hero-Textspalte.
- CSS-Spezifität des hellen Adressfelds, ungewollte Textüberstreichung durch eine Tailwind-Klassenkollision und sichtbarer Routenfokus.
- Landmark für den Demo-Hinweis und korrekte Überschriftenfolge im Check.
- Dichtere Desktop-Projektliste mit eigenem Scrollbereich und erreichbarer Pagination; unter 1280 separate Akte.
- Direkte Sichtbarkeit aller neun Faktoren auf Desktop; mobile Gesamtliste bleibt aufklappbar.
- Eindeutige SVG-Referenzen bei mehreren Standortansichten.
- Explizite Beschriftung des Entscheidungs-Textfelds und Rücksetzen vor einer neuen Aktion.

Ausgewählte Belege: [Landing Desktop](screenshots/landing-1440.png), [Landing 320](screenshots/landing-320.png), [Objektformular](screenshots/check-objekt-1440.png), [Energieformular](screenshots/check-energie-1440.png), [Dokumente](screenshots/check-dokumente-1440.png), [Ergebnis](screenshots/ergebnis-1440.png), [Score mobil](screenshots/score-390.png), [Arbeitsplatz](screenshots/partner-1440.png), [Pipeline mobil](screenshots/pipeline-390.png), [Übermittlungsbeleg](screenshots/beleg-1440.png), [Energiespanne](screenshots/energy-scenario-1280.png), [Text 200 %](screenshots/landing-text-200-touch.png), [Querformatkarte](screenshots/map-landscape-844x390.png). Alle Aufnahmen liegen unter `screenshots/`.

## Repository-Prüfung

Die vorgemerkten Dateien enthalten keine echten `.env`-Dateien, `auth.json`, privaten Schlüssel, `node_modules`, Build-Ausgaben oder Demo-Speicher. Eine Prüfung auf typische Token-/Private-Key-Muster blieb ohne Treffer. `git diff --cached --check` ist für den Implementierungscode sauber; ausschließlich der unverändert übernommene CSV-Block in `03_ANALYTICS_CORE.md` enthält bereits vorhandene CRLF-Zeilen, die Git als Whitespace meldet. Die Handoff-Datei wurde entsprechend der Nutzeranweisung nicht normalisiert.

## Verbleibende Integrationsgrenzen

Das MVP läuft vollständig im ausdrücklich gewählten Demo-Modus. Der dauerhafte lokale Speicher ist auf einen Node-Prozess je Verzeichnis beschränkt. Produktive Authentifizierung, PostgreSQL-Anbindung, Objektspeicher/Dateiprüfung, lizenzierte Geodaten, fachlich validierte Bewertungsprofile, reale Partnerzuordnung und Benachrichtigungszustellung sind nicht angeschlossen. Live-Modus bricht mit einer klaren Fehlermeldung ab und verwendet keinen stillen Demo-Ersatz. Betreiber-/Partnerangaben und rechtliche Produkttexte benötigen konkrete reale Daten.

Keine echte PV-/Statikprüfung, fachliche Dokumentprüfung, E-Mail-Zustellung, Partnerübermittlung, produktive Identitätsprüfung oder Production-Deployment wurde ausgeführt oder als erfolgreich ausgegeben.
