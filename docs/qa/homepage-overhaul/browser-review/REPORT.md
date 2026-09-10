# Browserprüfung der überarbeiteten Homepage

Stand: 10. September 2026 (UTC). Branch: `feat/homepage-professional-pass`.

Die Überarbeitung wurde aus `origin/feat/homepage-professional-pass` übernommen und in Codespaces mit installiertem Chromium geprüft. Die zuvor lokale Änderung an `next-env.d.ts` liegt weiterhin in `stash@{0}` mit dem Namen `Backup before homepage-professional-pass checkout 2026-09-09`.

## Wiederaufnahme nach Sitzungsunterbrechung

Der tatsächliche Stand wurde am 10. September vor weiteren Arbeiten abgeglichen: sauberer Zielbranch, lokaler Commit `fe3eafc`, Remote nach `git fetch` weiterhin auf `d6272bd`. Es gab keine ungesicherten Arbeitsbaumänderungen. Der ursprüngliche Stash blieb erhalten.

Der vorhandene Playwright-HTML-Bericht wurde ausgelesen: 32 erwartungsgemäß bestandene Tests, keine fehlgeschlagenen, übersprungenen oder instabilen Tests; Laufzeit 156,9 Sekunden. Zusammen mit dem vorhandenen Produktionsbuild und den versionierten Screenshots bestätigt dies den bereits abgeschlossenen Desktop- und Mobil-Standortcheck einschließlich Datei-Upload und Demo-Beleg. Die vor der Unterbrechung erfolgreichen Unit-, TypeScript- und Build-Prüfungen wurden beibehalten.

Port 3000 hatte nach der Unterbrechung keinen laufenden Server. Der geprüfte Build wurde erneut in einem weiterlaufenden Terminal mit `npm run start -- --port 3000` gestartet. HTTP 200 und die private Portfreigabe wurden erneut bestätigt.

`node scripts/capture-homepage-review.mjs` wurde danach direkt an dieser Vorschau erneut erfolgreich ausgeführt: sieben Bildschirmbreiten, Desktop- und mobile Touch-Navigation, Standort-Buttons, vier Projektarten, Beispielakte, Check-Vorschau, FAQ, Kontakt und Partner-Login. Keine Browserfehler, kein horizontaler Überlauf, axe-Prüfungen erfolgreich. Die Aufnahmen wurden aktualisiert und visuell kontrolliert. Es waren keine weiteren Änderungen am Anwendungscode erforderlich. Offen war damit nur noch die Sicherung des Wiederaufnahmeprotokolls und der lokalen Commits auf dem Zielbranch.

## Vorschau

Der gebaute Stand läuft mit `npm run start -- --port 3000` in einem weiterlaufenden Terminal auf `0.0.0.0:3000`. Die [Codespaces-Vorschau](https://curly-umbrella-x57j4pw645xrf67g9-3000.app.github.dev) bleibt privat. Die Browserprüfung greift innerhalb des Codespace auf `http://127.0.0.1:3000` zu; der GitHub-Anmeldeweg des privaten Tunnels wird damit nicht als getestet behauptet.

## Geprüfte Wege

| Schritt                        | Prüfung und Ergebnis                                                                                                                                                                                                                                                                                    | Screenshot-Beleg                                                                                                                                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Einstieg                    | Hero-Adresse und Abschlussformular starten einen Demo-Entwurf. Beide Werte bleiben synchron; Fehler erscheinen am betroffenen Formular, ein erneuter Versuch funktioniert. Einstieg bleibt bei normaler Schriftgröße im ersten Bildschirm sichtbar.                                                     | [Desktop](01-home-1440.png), [Mobil](01-home-390.png), [Abschlussformular](05-closing-390.png)                                                                                                                                           |
| 2. Navigation und Buttons      | Ablauf und Projektpartner scrollen zum Ziel. Die Rückkehr von der Beispielseite funktioniert. Das mobile Menü schließt nach Auswahl und per Escape; der Fokus kehrt zum Auslöser zurück. Die beiden Standort-Buttons fokussieren das Adressfeld. Kontakt und Partner-Login öffnen die richtigen Seiten. | [Mobiles Menü](06-menu-390.png), [Ablauf nach Navigation](06-after-process-navigation-390.png), [Kontakt](09-contact-390.png), [Partner-Login](12-partner-login-390.png)                                                                 |
| 3. Projektarten                | Gewerbedach, Erweiterung, Speicher und Freifläche öffnen und schließen ihre Details. Jede Auswahl startet einen gespeicherten Demo-Entwurf mit passenden, editierbaren Vorgaben.                                                                                                                        | [Dach](07-type-1-390.png), [Erweiterung](07-type-2-390.png), [Speicher](07-type-3-390.png), [Freifläche](07-type-4-390.png)                                                                                                              |
| 4. Beispielakte und Vorschau   | Alle drei Tabs funktionieren einschließlich Pfeiltasten/Home/End. Die Check-Vorschau aktualisiert ihre Zusammenfassung ohne Speicherung und ohne Score-Änderung. Die vollständige Beispielakte zeigt alle neun Faktoren mit gemeinsamer Punkteachse.                                                    | [Akte](02-dossier-390.png), [Check-Vorschau](03-check-390.png), [Beispielseite](10-example-390.png), [Neun Faktoren](11-factors-390.png)                                                                                                 |
| 5. Vollständiger Standortcheck | Desktop und mobiler Touch-Viewport durchlaufen Standortbestätigung, Objekt, Energie, Unterlagen mit echtem Testdatei-Upload, Bearbeiten aus der Zusammenfassung, Ergebnis, Zustimmung und simulierte Einreichung. Unbekannte Werte und Nullverbrauch bleiben unterscheidbar.                            | [Objekt](../screenshots/check-objekt-390.png), [Energie](../screenshots/check-energie-390.png), [Datei](../screenshots/check-dokumente-390.png), [Ergebnis](../screenshots/ergebnis-390.png), [Demo-Beleg](../screenshots/beleg-390.png) |
| 6. Weitere Bedienung           | Alle FAQ-Antworten öffnen sich. Partnerfilter, Pagination, Akte, Statusaktionen, Konflikte und Zugriffsschutz werden geprüft. Tastaturbedienung, automatisierte axe-Prüfungen, reduzierte Bewegung und 200 % Textvergrößerung sind abgedeckt.                                                           | [FAQ](08-faq-390.png), [Partneransicht](../screenshots/partner-390.png), [200 % Text](../screenshots/landing-text-200-touch.png), [Karte im Querformat](../screenshots/map-landscape-844x390.png)                                        |

## Korrigierte Fehler

1. **Hero-Schrittnummern:** `flex: 0` ließ die Ziffern vertikal umbrechen. Die Nummern behalten nun ihre natürliche Breite und bleiben zusammen.
2. **Entwicklungsvorschau:** Next blockierte die lokale HMR-Verbindung. `allowedDevOrigins` erlaubt nun `127.0.0.1` und ausschließlich den konkreten Codespaces-Host für Port 3000.
3. **Abschnittsnavigation:** Die URL konnte sich ändern, während die Seite oben blieb. Native Anker steuern die Abschnitte an; die Fokuswiederherstellung des mobilen Dialogs verursacht keinen weiteren Scrollsprung. Zwei neue Browsertests decken Desktop, Mobil und die Rückkehr von der Beispielseite ab.

## Visuelle Abnahme

Die aktuellen Screenshots wurden bei 1440, 1280, 1024, 768, 390, 360 und 320 Pixeln geprüft. Der Vergleich mit `04_PRODUCT_DESIGN_VISUALS.pdf` und `05_ANALYTICS_VISUALS.pdf` bestätigt die Atlas-Grundrichtung: Anthrazit/Amber, IBM Plex Sans Condensed und Mono, rechteckige Komponenten sowie die vorgesehenen responsiven Check- und Partneransichten. Der neue Hero und die unterschiedlichen Projektmotive bleiben als Illustrationen gekennzeichnet. Datenherkunft, Schätzwerte und offene technische Prüfungen sind sichtbar; die normative Punktegeometrie hat Vorrang vor illustrativen PDF-Zahlen.

Kein horizontaler Überlauf in den geprüften Viewports. Auf Mobil stehen Adresse und Hauptaktion vor dem Hero-Bild. Die vollständigen Zahlen und Messwerte stehen in [metrics.json](metrics.json). Die langen Aufnahmen wurden zusätzlich abschnittsweise betrachtet. Unfokussierte Skip-Links werden ausschließlich während der Screenshot-Aufnahme ausgeblendet, weil der Browser sie bei sehr langen Ausschnitten sonst aus ihrer Position oberhalb des tatsächlichen Viewports in das Bild übernehmen kann; das Produktverhalten bleibt dabei unverändert.

## Reproduzierbare Validierung

- `npm ci`: erfolgreich.
- `npm test`: 177 Tests in fünf Dateien bestanden.
- `npm run typecheck`: erfolgreich.
- `NODE_OPTIONS=--max-old-space-size=1024 NEXT_TELEMETRY_DISABLED=1 npm run build -- --webpack`: alle Routen erfolgreich gebaut.
- `GATEWAY_E2E_PORT=3103 GATEWAY_QA_SCREENSHOTS=docs/qa/homepage-overhaul/screenshots npm run test:e2e`: **32 Tests bestanden** in 2,6 Minuten.
- `node scripts/capture-homepage-review.mjs`: **alle sieben Viewports bestanden**, keine Browserfehler; Desktop- und Mobil-Klickwege sowie axe-Prüfungen erfolgreich. Insgesamt liegen 93 neue Screenshots aus den beiden Prüfungen vor.

```sh
# Einmalig bei fehlendem Browser:
npx playwright install chromium

# Produktionsbuild zuerst fertigstellen, bevor die Vorschau gestartet wird.
npm run build -- --webpack
npm run start -- --port 3000

# In weiteren Terminals:
GATEWAY_E2E_PORT=3103 GATEWAY_QA_SCREENSHOTS=docs/qa/homepage-overhaul/screenshots npm run test:e2e
node scripts/capture-homepage-review.mjs
```

Die Tests verwenden Chromium mit Desktop- und mobilen Touch-Viewports. Physische Endgeräte und Safari wurden nicht geprüft. Das Produkt bleibt im ehrlichen Demo-Modus: keine echte Standortanalyse, Partnerzustellung oder E-Mail. Betreiber- und Kontaktdaten sowie Live-Integrationen bleiben die im [Handoff](../design-qa.md) benannten offenen Produktpunkte.
