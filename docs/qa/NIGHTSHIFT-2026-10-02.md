# Night Shift · Variante 3 · 2. Oktober 2026

Die vom Nutzer ausgewählte dritte Night-Shift-Variante wurde auf der öffentlichen
Project-Gateway-Homepage umgesetzt. Der ursprüngliche Anwendungsstand lag auf
`669fc6601b52d1ece09047b854302c80a23ff42a` im Branch
`feat/homepage-professional-pass`.

Die Seite verwendet ein durchgehendes Navy-/Eisblau-System mit Arimo und Gelasio,
ein bildfüllendes Gewerbe-PV-Motiv, die Frage „Können PV und Speicher Ihre
Stromkosten senken?“, bedienbare Stationen Erzeugen / Speichern / Nutzen,
versetzte Detailbilder und angepasste bestehende Inhaltsabschnitte. Navigation,
Standortdialog, Formulare und Footer sind professionell erkennbar bedienbar.
Der Netlify-Verweis bleibt in der Fußnote.

Drei neue WebP-Motive liegen unter `public/energy/`. Fonts werden lokal
bereitgestellt; keine zusätzlichen externen Fontabrufe. Primärquellen für die
freien Fontalternativen: https://github.com/googlefonts/arimo und
https://github.com/sorkintype/Gelasio.

Build, Typecheck und die 24 relevanten E2E-Szenarien sind bestanden. Vier gezielte
Nachtests bestätigen die Korrektur von 200-%-Reflow, Dialog, Webfonts und Motion.
Siehe `design-qa.md` für Vorher-/Nachher-Befunde und Bildbelege.

Vorhandene APIs, Datenhaltung, Score-Verträge und Berechtigungen wurden nicht
verändert. Der Standortcheck bleibt eine strukturierte Vorbereitung mit der
bestehenden Integrations- und Beispielsemantik. Es wurden keine neuen Aussagen
über garantierte Wirtschaftlichkeit, Gesetze oder reale Partnerlieferungen
hinzugefügt.

Die bestehende Netlify-Free-Site wird unverändert als Hostingziel genutzt.

## Veröffentlichung und Live-Kontrolle

- Anwendungscommit: `3d583743c3bc65e9082eeb7ec76eed62c09c9b6e`.
- Netlify-Deploy: `6abfcb1c2650ff8893a9e308`, erfolgreich, Exit 0.
- Öffentlich: https://project-gateway-wrguck.netlify.app
- Eindeutiger Deploy: https://6abfcb1c2650ff8893a9e308--project-gateway-wrguck.netlify.app
- Vollständiger Netlify-Build in 35,7 Sekunden. 192 Unit-Tests, Produktionsbuild
  und Typecheck bestanden.
- HTTPS: HTTP 200 für Homepage, alle drei neuen Bilddateien, Projektbeispiel
  und Kontakt. Neue Hero-Klasse, Bildquelle, Headline und CTA ausgeliefert.
- Live-Browserprüfung auf Desktop 1440 × 1000 und Mobil 390 × 844 bestanden.
  Beide Ansichten sowie der mobile Standortdialog wurden visuell geprüft.
- Arimo Regular/Bold und Gelasio Italic tatsächlich als Webfonts gerendert.
  Keine horizontale Überbreite; Dokumentbreite 1440 bzw. 390 Pixel.
- Stationswechsel Speichern / Nutzen, passender sichtbarer Bildtext,
  Dialog öffnen/schließen und Fokusrückgabe funktionieren.
- Keine JavaScript-Laufzeitfehler und keine schreibenden Requests beim Livecheck.
- Der isolierte Browser benötigte für das lokale Prüfproxy-Zertifikat
  `ignoreHTTPSErrors`. Die zusätzlichen Node-HTTPS-Abrufe verwendeten keinen
  Zertifikatsbypass. Die Browseraufnahme ersetzt keine TLS-Prüfung.
- Keine neue Ressource, Tarifänderung oder kostenpflichtige Einrichtung.
  Bestehende Datenhaltung und Produktionskonfiguration weiterverwendet.

Die finalen lokalen Referenz-/Umsetzungsbelege sind unter
`docs/qa/nightshift-2026-10-02/` versioniert. Der einzige nachträgliche Commit
dokumentiert diese Veröffentlichung; die veröffentlichte Anwendung bleibt
identisch mit dem oben genannten Anwendungscommit.

## Nachkorrektur: Hero vollständig im Viewport

Auf Nutzerhinweis wurde die zu große Mindesthöhe korrigiert. Die vollständige
erste Ansicht richtet sich nun nach `100svh`; Typografie und Abstände passen
sich auch der Bildschirmhöhe an. Bei 200 % Text wächst der Inhalt bei Bedarf
zugunsten der Lesbarkeit. Keine Bestandteile werden ausgeblendet.

- Anwendungscommit: `c33641a8d775aeea6e2757c0de3ee4d7398ab52e`.
- Deploy: `6ac0182cdbc4b5ece031615c`, erfolgreich, 31,9 Sekunden.
- 192 Unit-Tests, Build und Typecheck bestanden.
- 16 Browserfälle bestanden: acht Bildschirmgrößen jeweils bei normaler und
  200-%-Textgröße. Alle normalen Heros entsprechen exakt der Viewporthöhe.
- Live geprüft: Desktop 1366 × 768 und Mobile 390 × 844, vollständiger Hero
  einschließlich Zeitleiste sichtbar, Stationswechsel und Standortdialog
  funktionieren, Webfonts geladen, keine JavaScriptfehler oder Überbreite.
- Visueller Beleg: `nightshift-2026-10-02/hero-viewport-fit.webp`.
- Keine kostenpflichtige Einrichtung oder Änderung der Datenhaltung.
