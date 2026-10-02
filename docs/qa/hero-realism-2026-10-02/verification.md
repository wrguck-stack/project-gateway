# Hero-Bild · Fotorealistische Überarbeitung

## Herkunft und Änderung

- Auftrag: vorhandenes, sichtbar künstliches Hero-Motiv möglichst realistisch ersetzen.
- Ergebnis: fotorealistische KI-Visualisierung einer Gewerbehalle bei Tageslicht,
  mit PV, Batteriespeichern und Trafostation in einer vollständigen Umgebung.
- Tool: eingebautes Imagegen, Bearbeitung des bisherigen Bilds als Ausgangsmotiv.
- Vollständiger Prompt: `prompt.txt` in diesem Ordner.
- Asset: `public/energy/gateway-energy-site-v2.webp`, 1536 × 1024, 480924 Byte.
- Kein dokumentarisches Foto, kein behauptetes eigenes Referenzprojekt.
  Nutzerinformation und Alttext benennen die KI-Herkunft.

Das neue Motiv ergänzt natürliche Beleuchtung, Nachbargebäude, Fahrzeuge,
Asphaltspuren und materialtypische Unregelmäßigkeiten. Der freigestellte
Modellcharakter und die großflächige Randvignette entfallen. Der verbleibende
Fokusmodus dunkelt nur auf 56 Prozent ab und zeigt die tatsächlich markierten
Bereiche desselben Motivs. Die Bilddatei wird ohne Beschnitt im Verhältnis 3:2
angezeigt; Hotspots: Netz 29/74 %, Dach 50/26 %, Speicher 83/61 %.

## Prüfung

- Produktionsbuild und Typecheck bestanden.
- Zwei vorhandene Hero-Regressionsprüfungen bestanden: Bildschirmhöhe in
  allen Stationen sowie Tastaturbedienung und reduzierte Bewegung.
- Desktop 1366 × 768, Mobil 390 × 844, schmal 320 × 640, alle vier Stationen:
  Bild geladen, kein Überlauf, Hero vollständig im Viewport, Bildpunkte
  mindestens 44 × 44 Pixel und funktionsfähig, keine JavaScriptfehler.
- Originalmotiv und neues Motiv unabhängig visuell verglichen; anschließend
  eingebettete Gesamtansicht und Fokuszustände kontrolliert.
- Kein neuer Tarif und keine kostenpflichtige Ressource eingerichtet.

Aktueller Screenshot: `desktop-mobile.webp`. Keine anderen Seiteninhalte
oder fachlichen Funktionen geändert.

## Veröffentlichung

Produktionsdeploy und abschließende Live-Prüfung werden nach dem Bildwechsel
auf https://project-gateway-wrguck.netlify.app hier ergänzt.

Lokale Prüfung: bestanden.
