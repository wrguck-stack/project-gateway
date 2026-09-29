# Produktansicht und Hosting-Hinweis · 29. September 2026

## Nutzerauftrag

Die sichtbare Oberfläche soll ohne allgemeine Demo-Auszeichnung gezeigt werden.
Der schwebende „Powered by Netlify“-Hinweis soll in die Fußzeile wandern. Dieser
ausdrückliche Änderungsauftrag ersetzt die früheren Vorgaben zur dauerhaft
sichtbaren Demo-Leiste; die tatsächlichen Integrationen werden dadurch nicht
aktiviert.

## Umsetzung

- Globalen Betriebsmodus-Balken samt ungenutztem CSS entfernt.
- Demo-Zusätze aus Metadaten, Homepage, Standortcheck, Partnerzugang, Listen,
  Projektansicht, Verlauf und Kontaktseiten durch normale Produkttexte ersetzt.
- Erfolgsbelege beschreiben die tatsächlich gespeicherte Projektanfrage.
  Nicht aktivierter externer Versand bleibt am Freigabeschritt benannt.
- Technische Bewertungsgrenzen und Kennzeichnung von Beispielberechnungen bleiben
  nachvollziehbar; keine fachliche Prüfung oder Zustellung wird erfunden.
- Bekannte ältere System- und Seedtexte werden bei der Anzeige gezielt benannt.
  Gespeicherte Auditdaten, interne IDs und eigene Nutzernotizen bleiben erhalten.
- „Powered by Netlify“ als gewöhnlicher Link im gemeinsamen Footer, mit 44 px
  Mindestklickhöhe und flexiblem Umbruch. Keine Überdeckung der Inhalte.
- Browser-Testselektoren an die neuen Beschriftungen angepasst. Der gehostete
  HTTP-Prüfer erkennt die Anwendung ohne Banner und prüft weiterhin über die
  Sitzungsantwort zwingend `mode=demo`, bevor er Entwürfe oder Dateien anlegt.

## Netlify-Einstellung

Die offizielle Dokumentation erlaubt das Abschalten des Badges pro Projekt auch
auf Free. Das Badge wird in einem isolierten Frame eingeblendet; eine Position
im Seitenfooter wird nicht angeboten. Verwendete Lösung: normale Footer-Verlinkung
und offizielles Projektflag `built_with_badge_enabled=false` auf der bestehenden
Site `28b65faa-2f4c-4d99-ae3c-405f4a756885`. Kein Tarifwechsel erforderlich.

Die authentifizierte API-Antwort bestätigt das gespeicherte Flag `false` für
genau diese Site. Produktion bleibt öffentlich; `sso_login=true` und
`sso_login_context=non_production` schützen weiterhin nur die Vorschauen.

Quelle: https://docs.netlify.com/manage/projects/powered-by-netlify-badge/

## Verifikation

- Veröffentlicht: Commit `6ec397b9346e05c1b737bb6abf63d8566f989584` auf
  https://project-gateway-wrguck.netlify.app.
- Produktionsdeploy: `6abc187d69359544437e624c`, vollständiger CLI-Build,
  Veröffentlichung nach 3 Minuten 22 Sekunden erfolgreich (Exit 0).
- 192 Unit-Tests in sieben Dateien, Produktionsbuild und Typecheck bestanden;
  Diff auf Formatfehler geprüft.
- Live-HTTP-Prüfung: `/`, `/beispiel`, `/partner/login`, `/kontakt`,
  `/datenschutz` und `/impressum` liefern HTTP 200. Der frühere Demo-Banner und
  die geprüften technischen Demo-Beschriftungen fehlen im ausgelieferten HTML.
  Homepage zeigt „Beispielbewertung“, Partnerzugang „Arbeitsbereich öffnen“.
- Footer-Link auf allen fünf geprüften öffentlichen Seiten mit bestehendem
  Footer vorhanden. Der Partnerzugang hat gemäß seiner bisherigen Layoutstruktur
  keinen Footer; die zunächst zu weit gefasste HTTP-Prüferwartung wurde anhand
  des Layouts eingeordnet. Dafür wurde kein zusätzlicher Footer in den
  Partnerarbeitsbereich eingeführt.
- Bestehende Sitzungen und Daten wurden nicht migriert oder zurückgesetzt.
  Die vollständige Upload-/Persistenzprüfung des vorherigen Releases bleibt
  separat dokumentiert; für diese Textänderung wurde kein weiterer großer
  Testupload angelegt.
- Keine erneute Browserabnahme: Der zuletzt dokumentierte Cloud-Browser-Blocker
  besteht, eine direkte Playwright-Ausführung wurde noch nicht freigegeben.
  Die vollständige visuelle Abnahme in `design-qa.md` bleibt daher blockiert.
