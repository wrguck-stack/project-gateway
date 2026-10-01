# Entscheidungssicherheit als Einstieg · 1. Oktober 2026

## Auftrag und Umsetzung

Der Nutzer hat die vorgeschlagene Positionierung „Erst Klarheit. Dann
investieren.“ zur Umsetzung freigegeben. Photovoltaik, Speicher und der
bestehende Netzanschluss werden gemeinsam betrachtet. Keine politische
Bewertung oder Renditegarantie wurde ergänzt.

- Hero mit freigegebener Überschrift, Begleittext, „Meine Möglichkeiten prüfen“
  und „So prüfen wir Ihren Standort“. Direkt darunter wird der Standortcheck
  als Vorbereitung der fachlichen Prüfung eingeordnet.
- Die drei Antworten „Was ist möglich?“, „Was kann sich rechnen?“ und „Was
  passiert als Nächstes?“ stehen unmittelbar nach dem Hero. Sie ersetzen den
  früheren Prozessabschnitt; `#ablauf` bleibt als Navigationsziel erhalten.
- Die drei Hero-Verweise führen zu den jeweiligen Antworten. Projektakte,
  Projektarten, Eigentümerbereich und Abschluss greifen die neue Positionierung
  auf. Zwei zusätzliche FAQ erläutern Wirtschaftlichkeit und Netzanschluss.
- Die vorhandene Atlas-Gestaltung, Bilddatei, Bildmaske und Interaktionszustände
  bleiben erhalten. Die Schriftgrößen sind für die längere neue Überschrift
  angepasst, mobil mit fließender Skalierung und erlaubtem Umbruch bei Zoom.
- Seitentitel und Beschreibung aktualisiert. Exakte CTA-Selektoren in den
  vorhandenen Browsertests und im HTTP-Prüfer angepasst.
- Keine Änderung an Speicher-, Sitzungs-, Upload-, Bewertungs- oder
  Freigabelogik. Der Standortcheck ersetzt weiterhin keine technische,
  rechtliche oder wirtschaftliche Fachprüfung.

## Verifikation

- 192 Unit-Tests in sieben Dateien bestanden.
- Produktionsbuild und Typecheck bestanden; Format- und Diffprüfung bestanden.
- Das erzeugte Homepage-HTML enthält die neue Überschrift, genau zwei neue
  Einstiegsbuttons, eindeutige IDs, gültige interne Sprungziele, die neue
  Abschnittsreihenfolge und passende Metadaten.
- Separater Code-Review ohne verbleibenden konkreten Regressionsfund.
  Mobile Schriftgröße anhand der vorhandenen Fontmetriken angepasst. Dies ist
  keine Messung eines gerenderten Browserlayouts.
- Cloud-Browser: Dokumentation, Inventar und Bindung erfolgreich. Einzige
  Navigation zur öffentlichen Site trotz Tooltimeout 45.000 ms nach 232,3 s
  ohne Seitenzustand abgebrochen. Keine Screenshots oder Interaktionsabnahme.
  Keine Wiederholung und kein Wechsel zur nicht freigegebenen Playwright-CLI.

## Veröffentlichungsstand

Die Implementierung ist mit Commit `4c936c3fd40b99e5d63e17502516fccdf9a4b506`
auf `feat/homepage-professional-pass` gesichert und veröffentlicht.

Nach dem Wechsel der Arbeitsumgebung fehlte zunächst die Netlify-Anmeldung.
Die CLI 27.10.2 wurde außerhalb des Repos wiederhergestellt. Der Nutzer hat die
erneute offizielle Anmeldung bestätigt; `login --check` meldete `authorized`.
Keine Zugangsdaten wurden im Repository gespeichert.

- Bestehende Site: `28b65faa-2f4c-4d99-ae3c-405f4a756885`.
- Produktionsdeploy: `6abe89017fcc5f1a4ac2c417`, Exit 0, vollständiger CLI-Build
  und Veröffentlichung in 2 Minuten 38 Sekunden, Next.js Runtime 5.16.1.
- Im Veröffentlichungsbuild erneut 192 Tests, Produktionsbuild und Typecheck
  bestanden.
- Live-HTTP: `/`, `/beispiel`, `/partner/login` und `/kontakt` liefern HTTP 200.
  Die Homepage enthält die neue H1 und den neuen Seitentitel, beide
  Einstiegsbuttons, die drei Antwortabschnitte vor der Projektakte, alle vier
  zugehörigen Sprungziele samt Links und die neue Netzanschluss-FAQ.
- Beide Stylesheets liefern HTTP 200; die neue mobile Hero-Skalierung ist
  enthalten. Bestehendes Hero-Bild und Netlify-Footer-Verweis sind vorhanden.
- Diese Nachweise betreffen HTTPS und ausgeliefertes HTML/CSS. Die visuelle
  Browserabnahme bleibt aus dem oben dokumentierten Grund offen.

Öffentliche Adresse: https://project-gateway-wrguck.netlify.app.
Keine kostenpflichtigen Dienste oder Tarifänderungen wurden eingerichtet.
