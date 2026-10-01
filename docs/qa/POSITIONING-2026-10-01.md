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

Die Implementierung wird auf `feat/homepage-professional-pass` gesichert.
Eine neue Produktionsveröffentlichung ist noch nicht erfolgt.

Die Netlify-CLI wurde nach dem Wechsel der Arbeitsumgebung außerhalb des Repos
mit Version 27.10.2 wiederhergestellt. `status --json` bestätigt
`loggedIn: false` und `NOT_LOGGED_IN`. Die vorhandene Projektzuordnung stimmt mit
Site `28b65faa-2f4c-4d99-ae3c-405f4a756885` überein; die frühere globale
Anmeldung ist nicht mehr vorhanden. Zur Fortsetzung ist die erneute offizielle
Netlify-Autorisierung nötig. Keine Zugangsdaten wurden im Repository gespeichert.

https://project-gateway-wrguck.netlify.app zeigt bis dahin den bisherigen
Anwendungsstand `320d290`, Deploy `6abc239b2558e2f1c5b52c8c`.
Keine kostenpflichtigen Dienste oder Tarifänderungen wurden eingerichtet.
