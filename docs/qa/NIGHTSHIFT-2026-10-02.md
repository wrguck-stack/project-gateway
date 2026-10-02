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
