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

## Veröffentlichung

Die Tagesfassung wurde als Commit `1fa0b0295192cf0ddef7614b1f656420ae01e020`
veröffentlicht und öffentlich geprüft. Der Nutzer verlangte danach die Nachtfassung.
Deren Produktionsdeploy und Live-Prüfung werden nach der Veröffentlichung unter
https://project-gateway-wrguck.netlify.app hier ergänzt.

Lokale Prüfung: bestanden.
