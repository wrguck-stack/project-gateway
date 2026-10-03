# Variante 3 — Veröffentlichung und Live-Abnahme

Stand: 3. Oktober 2026. Nach erneuter offizieller Netlify-Anmeldung durch den
Nutzer wurde die geprüfte dritte Gestaltung veröffentlicht.

- Anwendungscommit: `5331e125295eff7f62286d45b19c55c90bcbd03d`.
- Branch: `feat/homepage-professional-pass`.
- Netlify-Site: `28b65faa-2f4c-4d99-ae3c-405f4a756885`.
- Deploy: `6ac105f84f568a375695e16a`, erfolgreich, Exit 0.
- Öffentlich: https://project-gateway-wrguck.netlify.app
- Deploy-Protokoll: https://app.netlify.com/projects/project-gateway-wrguck/deploys/6ac105f84f568a375695e16a
- Konto und Ziel-Site vor Veröffentlichung per API geprüft: `wrguck-stack`,
  `project-gateway-wrguck`, Tarif `Free`.
- Vollständiger Netlify-Build einschließlich 192 Unit-Tests, Produktionsbuild und
  Typecheck erfolgreich; Next Runtime 5.16.1, Gesamtdauer 28,7 Sekunden.
- Keine neue Hostingressource, Tarifänderung oder kostenpflichtige Einrichtung.

## Öffentliche HTTPS-Prüfung

HTTP 200 für `/`, `/beispiel`, `/kontakt` und beide Hero-Bilddateien.
Die öffentliche Homepage enthält die neue `gateway-fieldbook`-Gestaltung und
„PV geplant.“. Die Bilddateien stimmen bytegenau mit den geprüften Dateien überein:

- Desktop-Panorama: 368470 Bytes, SHA-256
  `9001b7fa2bd30f63ab249497890bd5dd9ebe025f8d254b518a70e4e935b6446f`.
- Kompaktes Nachtmotiv: 329796 Bytes, SHA-256
  `b84c699dd2a81a1c5ef1aae46a8704d79417343990fbea897c51a1fff55fe99b`.

## Live-Browserprüfung

Chromium mit frischen Kontexten, ohne gespeicherte Sitzungen, bei reduzierter
Bewegung. Die öffentlichen Produktionsantworten wurden über Node mit der
konfigurierten CA-Vertrauenskette und aktiver TLS-Prüfung an den Browser gereicht.
Kein Zertifikatsbypass. Normale HTTP-Weiterleitungen wurden an den Browser
weitergereicht; ausgehende Ziele blieben auf die eigene Site begrenzt.

| Ansicht              | Dokumentbreite | Unterkante Hero | Foto und Schrift |
| -------------------- | -------------- | --------------- | ---------------- |
| Desktop 1366 × 768   | 1366px         | 768px           | geladen          |
| Smartphone 390 × 844 | 390px          | 844px           | geladen          |

Beide Hero-Aufnahmen visuell geprüft. In beiden Ansichten bestanden:

- Drei Hero-Tabs und Bildmarker; passende Auswahl und Kontextaktionen.
- Standortdialog mit Dach-/Speicher-/offener Projektvorwahl; Schließen mit
  Escape und korrekte Fokusrückgabe. Allgemeiner Einstieg löscht alte Vorwahl.
- Drei Ausgangslagen und drei Projektakten-Tabs mit passenden sichtbaren Panels.
- Desktop-Navigation sowie mobiles Menü und Sprung zur Ausgangslage.
- Keine horizontale Überbreite, JavaScriptfehler oder Transportfehler.

API-Aufrufe, fremde Ziele und schreibende Methoden waren im Prüfbrowser gesperrt;
es gab keine entsprechenden Versuche. Keine Adresse eingegeben, kein Formular
abgesendet, keine Sitzung, kein Projekt und kein Upload angelegt. Vollständige
fachliche Abläufe wurden bereits lokal geprüft; siehe `../../design-qa.md`.

Der nachfolgende Dokumentationscommit verändert die veröffentlichte Anwendung
nicht. Die Live-Anwendung entspricht weiterhin dem oben genannten Commit.

Ergebnis: veröffentlicht und Live-Abnahme bestanden.
