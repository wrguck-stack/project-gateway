# Hero: PV und Speicher im Betrieb · 2. Oktober 2026

## Auswahl und Umfang

Der Nutzer bevorzugt Variante 3 der zuletzt gezeigten, sprachlich geschärften
Entwürfe. Maßgebliche Vorlage: `homepage-overhaul/hero-energy-reference.webp`
(1487 × 1058 Pixel). Headline: „Können PV und Speicher Ihre Stromkosten senken?“.

Die bestehende Next-Anwendung wurde weitergeführt. Der Einstieg hat eine
zweispaltige Textfläche, einen klaren CTA und ein breites Industriebild mit PV,
Speicher und betrieblichem Verbrauch. Das Bild wurde aus der gewählten Vorlage
mit ImageGen als eigenständiges Motiv ohne UI erstellt und als WebP eingebunden.
Überschrift, Beschriftungen, Navigation und Buttons sind echte HTML-Elemente.

Auf schmalen Bildschirmen stehen Überschrift und Einstieg untereinander;
Bildbeschriftungen werden darunter als Text dargestellt. Die gewählten Farben,
IBM-Plex-Schriften, professionellen Kontrollen und der Footer-Hinweis bleiben.

„Meinen Standort prüfen“ öffnet den vorhandenen nativen Dialog mit der
bestehenden Adresseingabe. Auch eine Projektartauswahl öffnet diesen Einstieg.
Adresssuche, Fehleranzeige, Entwurfsfortsetzung und die bestehende API bleiben
angebunden. Die Adresse bleibt nach Schließen erhalten. Escape schließt zuerst
sichtbare Adressvorschläge; anschließend kann der Dialog geschlossen werden.
Das native Dialogverhalten übernimmt Fokusbegrenzung und Fokusrückgabe.

Die öffentliche Navigation lautet „Unser Ansatz“, „Projektbeispiel“, „Kontakt“.
Der Partner-Login ist weiterhin im Footer und im Partnerabschnitt erreichbar.
Metadaten verwenden die konkrete neue Kostenfrage; noindex bleibt erhalten.
Die Texte versprechen weder errechnete Einsparungen noch garantierte Erträge.

## Prüfung und verbleibende Freigaben

- 192 vorhandene Unit-Tests in sieben Dateien bestanden.
- Produktionsbuild und Typecheck bestanden. Build-HTML: exakte Headline,
  Hero-CTA, Abschlussformular, Navigation, Footer-Link und Bildmaße geprüft.
- Bestehende E2E-Szenarien an Dialog, Navigation, Tastatur und mobile Ansichten
  angepasst. Noch nicht ausgeführt, da kein zugelassener Browserweg verfügbar.
- Codeprüfung: Escape-Weitergabe an den nativen Dialog und eine ältere
  Tablet-CSS-Regel korrigiert. Fontmetriken zur Vermeidung unbeabsichtigter
  Desktop-Zeilenumbrüche geprüft; dies ersetzt keine Browseraufnahme.
- Lokale Vorschau per manuellem Next-Dev-Prozess erreichbar (HTTP 200).
  Der Preview-Supervisor blieb erneut nicht aktiv.
- Cloud-Browser: Dokumentation und Browserbindung funktionieren; genau ein
  Navigationsversuch blieb trotz 20-Sekunden-Timeout bis zum Abbruch nach
  602,9 Sekunden hängen. Kein DOM, kein Screenshot, keine visuelle Abnahme.
- Kein nicht freigegebener Wechsel zu Playwright CLI/MCP durchgeführt.
- Netlify CLI 27.10.2 wiederhergestellt; frühere Anmeldung nach der
  Workspace-Bereinigung nicht vorhanden. Kein neuer Deploy durchgeführt.
- Keine Änderung an Hosting-Tarif, Zahlungsdaten oder Ressourcen.

Der zuletzt veröffentlichte Anwendungsstand bleibt `4c936c3` mit Deploy
`6abe89017fcc5f1a4ac2c417` („Erst Klarheit. Dann investieren.“).
