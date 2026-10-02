# Hero-Bild · Fotorealistische Nachtkulisse

## Herkunft und Änderung

- Auftrag: zunächst das sichtbar künstliche Hero-Motiv möglichst realistisch
  ersetzen; anschließend ausdrücklich dieselbe Kulisse bei Nacht zeigen.
- Ergebnis: fotorealistische KI-Visualisierung derselben Gewerbehalle bei Nacht,
  mit unveränderter Perspektive, PV, Batteriespeichern und Trafostation.
- Tool: eingebautes Imagegen. Zuerst Umgebung und Materialien fotorealistisch
  überarbeitet, anschließend gezieltes Nacht-/Beleuchtungsedit dieser Tagesfassung.
- Prompts: `prompt.txt` (Tagesfassung), `prompt-night.txt` (Nachtedit).
- Aktuelles Asset: `public/energy/gateway-energy-site-v3-night.webp`,
  1536 × 1024, 329796 Byte. Tagesfassung bleibt als v2 erhalten.
- Kein dokumentarisches Foto, kein behauptetes eigenes Referenzprojekt.
  Nutzerinformation und Alttext benennen die KI-Herkunft.

Das Motiv zeigt ein zusammenhängendes Gewerbegebiet mit natürlichen Materialien,
Fahrzeugen, Straßenflicken und Gebrauchsspuren. Zur Nachtfassung wurden Himmel
und Beleuchtung geändert: Fassadenlampen, Innenräume und entfernte Gewerbeleuchten.
Geometrie und Bildpunkte bleiben gleich. Solarmodule sind bei Nacht dunkel.
Die Randvignette entfällt. Der Fokusmodus dunkelt nur auf 72 Prozent ab, damit
auch die Nachtkulisse nachvollziehbar bleibt. Anzeige ohne Beschnitt in 3:2;
Hotspots: Netz 29/74 %, Dach 50/26 %, Speicher 83/61 %.

## Prüfung

- Produktionsbuild und Typecheck der Nachtfassung bestanden.
- Zwei vorhandene Hero-Regressionsprüfungen für die vorausgehende Bildintegration
  bestanden: vollständige Bildschirmhöhe und Tastatur-/Reduced-Motion-Bedienung.
  Das Nachtedit ändert keine Struktur, Geometrie oder Interaktionslogik.
- Finale Nachtaufnahme auf 1366 × 768, 390 × 844 und 320 × 640, je vier Stationen:
  Asset geladen, kein Überlauf, Hero vollständig im Viewport, alle Bildpunkte
  mindestens 44 × 44 Pixel und funktionsfähig, keine JavaScriptfehler.
- Nachtmotiv mit Tagesquelle unabhängig visuell verglichen: Perspektive,
  Gebäude, Ausstattung und Markierungspositionen erhalten, keine offenen
  visuellen Blocker. Eingebettete Gesamtansicht und Fokuszustände kontrolliert.
- Keine Tarifänderung und keine neue kostenpflichtige Ressource.

Aktueller Screenshot: `night-desktop-mobile.webp`. Tagesbeleg:
`desktop-mobile.webp`. Sonstige Inhalte und fachliche Funktionen unverändert.

## Veröffentlichung und Live-Prüfung

Status: bestanden.

- Anwendungscommit: `416ed65bb0c72f904beaa2a617f00da85c2371b4`.
- Branch: `feat/homepage-professional-pass`.
- Netlify-Deploy: `6ac02b638f35b18dcc992fc6`.
- Produktion: https://project-gateway-wrguck.netlify.app
- Fester Deploy: https://6ac02b638f35b18dcc992fc6--project-gateway-wrguck.netlify.app

Der erste Veröffentlichungsversuch scheiterte vor dem Upload an übrig gebliebenen
Next-Build-Dateien (ENOTEMPTY). Nach Bereinigung ausschließlich des generierten
`.next`-Verzeichnisses wurde derselbe unveränderte Quellstand sauber gebaut und
veröffentlicht. 192 Tests, Produktionsbuild und Typecheck bestanden.

Strikte HTTPS-Prüfung: Homepage, neues Nachtbild, Projektbeispiel und Kontakt
liefern HTTP 200. Das Bild stimmt bytegenau mit dem committeten Asset überein:
SHA-256 `b84c699dd2a81a1c5ef1aae46a8704d79417343990fbea897c51a1fff55fe99b`.

Live auf Desktop 1366 × 768 und Mobil 390 × 844 geprüft: Nachtmotiv geladen,
alle vier Stationen und drei Bildpunkte funktionsfähig, Hero vollständig im
Viewport, reale Webfonts, drei passende Einstiegspfade, Dialog-/Fokusrückgabe,
keine Überbreite und keine JavaScriptfehler. Die Prüfung war lesend, ohne
Formularversand; Schreibrequests waren gesperrt und es gab keine Schreibversuche.
Ein lokaler Proxy-Zertifikatsbypass war ausschließlich auf den Wegwerfbrowser
beschränkt; die unabhängige HTTPS-Prüfung nutzte strikte Zertifikatsvalidierung.

final result: passed
