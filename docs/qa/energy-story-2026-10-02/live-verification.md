# Live-Verifikation · Energiekonzept

Status: bestanden am 02.10.2026.

- Anwendung: `62c64f6dca679c6231a0de7df049b03e0c5a7aea`
- Branch: `feat/homepage-professional-pass`
- Netlify-Deploy: `6ac023ffbba1b65911b193fe`
- Produktion: https://project-gateway-wrguck.netlify.app
- Unveränderlicher Deploy: https://6ac023ffbba1b65911b193fe--project-gateway-wrguck.netlify.app
- Bestehende Site und Free-Plan, kein Upgrade und keine neue kostenpflichtige Ressource.

Der Netlify-Produktionsbuild hat 192 Tests, Next-Build und Typecheck erfolgreich
ausgeführt. Der GitHub-Dateibaum wurde vor dem Deploy mit dem lokal geprüften
Dateibaum vollständig abgeglichen.

## Live-Prüfung

Homepage, neues Bild, Projektbeispiel und Kontakt liefern HTTP 200 mit strenger
HTTPS-Zertifikatsprüfung. Das öffentlich geladene Bild stimmt bytegenau mit dem
committeten Asset überein (SHA-256
`b363a0448e81892fd7d880e6f1e70a4d80dc16dc36ac67ef53994d91aa5092c4`).

Im Browser bei 1366 × 768 und 390 × 844 geprüft:

- Neue Überschrift und Architekturmotiv sichtbar und geladen.
- Hero, CTA und Zeitleiste passen in allen Stationen vollständig in den Viewport.
- Arimo/Gelasio werden tatsächlich als Webfonts gerendert.
- Vier Stationsschalter und drei Bildpunkte aktualisieren Zustand und Erklärung.
- Drei Einstiege öffnen den passenden Dialog mit korrekter Projektart;
  „Hoher Stromverbrauch“ löscht eine zuvor gewählte Art.
- Dialoge sind schließbar und geben den Fokus an den jeweiligen Auslöser zurück.
- Keine horizontalen Überläufe, JavaScriptfehler oder unerwarteten Schreibversuche.

Die Live-Browserprüfung war ausschließlich lesend; Schreibrequests waren gesperrt.
Vollständige Formularabläufe wurden zuvor lokal mit isolierten Testdaten geprüft.
Der temporäre Browser konnte wegen des Umgebungsproxys dessen Zertifikat
ignorieren; die unabhängige HTTPS-Prüfung oben verwendete strikte Validierung.

```json
[
  {
    "viewport": "desktop",
    "width": 1366,
    "heroHeight": 768,
    "controls": 7,
    "entryPaths": 3,
    "realWebfonts": true,
    "dialogAndFocusReturn": true,
    "javascriptErrors": [],
    "blockedWriteAttempts": []
  },
  {
    "viewport": "mobile",
    "width": 390,
    "heroHeight": 844,
    "controls": 7,
    "entryPaths": 3,
    "realWebfonts": true,
    "dialogAndFocusReturn": true,
    "javascriptErrors": [],
    "blockedWriteAttempts": []
  }
]
```

final result: passed
