# Project Gateway auf Netlify Free

Stand: 28.09.2026. Der Nutzer hat die Umstellung auf Netlify Free freigegeben.
Es dürfen keine kostenpflichtigen Tarife, Datenbanken, Add-ons oder Upgrades
eingerichtet werden. Die vorherige Render-Vorlage ist nicht das gewählte Ziel.

## Einrichtung

1. Bei Netlify anmelden bzw. ein kostenloses Konto selbst registrieren.
2. **Free** als Team-Tarif wählen, keinen Test eines kostenpflichtigen Tarifs.
3. Das bestehende Repository `wrguck-stack/project-gateway` importieren und
   **`feat/homepage-professional-pass` als Produktionsbranch** einstellen.
   `main` enthält einen älteren Anwendungsstand.
4. Die eingecheckte `netlify.toml` verwenden: Node 24.19.0, Build inklusive Tests,
   Publish-Verzeichnis `.next`. Der Next.js-Adapter wird von Netlify automatisch
   bereitgestellt. Keine statische Exportkonfiguration wählen.
5. Keine separate Datenbank provisionieren. Der Code nutzt den integrierten,
   privaten Netlify-Blobs-Speicher mit automatisch bereitgestellten Zugangsdaten.
   Keine Zugangsschlüssel in Git, Client-Code oder Chat eintragen.
6. Nach einem erfolgreichen ersten Build mit synthetischen Daten prüfen und erst
   dann die Demo über die bereitgestellte Netlify-Adresse veröffentlichen.
   Automatische weitere Builds anschließend stoppen; gezielte Updates manuell
   freigeben, um das kostenlose Kontingent zu schonen.

`netlify.toml` kann den Kontotarif und die Veröffentlichung nicht festlegen.
Diese Einstellungen müssen im Konto geprüft werden. Ein GitHub-Zugriff für
Netlify kann eine separate Benutzerfreigabe erfordern. Die Demo-Partneranmeldung
ist weiterhin simuliert; ausschließlich Testdaten verwenden.

Die am 29.09.2026 geprüfte Option `netlify deploy --allow-anonymous` ist für
dieses Projekt ungeeignet: Die CLI erlaubt dabei keine Serverless- oder
Edge-Funktionen. Ohne bestätigte Kontoanmeldung kann diese Next.js-Anwendung
deshalb nicht mit ihrem privaten Speicher veröffentlicht werden. Ein statischer
Export wäre keine funktional gleichwertige Bereitstellung.

## Kosten und Grenzen

Laut den am 28.09.2026 geprüften offiziellen Netlify-Angaben kostet Free 0 USD
pro Monat mit einem harten Limit von 300 Credits. Bei Ausschöpfung pausieren
Projekte; Free hat keine kostenpflichtige automatische Aufladung. Build zur
Produktionsadresse: 15 Credits, Datenverkehr: 20 Credits/GB, Compute:
10 Credits/GB-Stunde, Anfragen: 2 Credits/10.000. Credits werden gemeinsam genutzt.
Es wird kein zusätzlicher Netlify-Database-Dienst eingerichtet.

Free bedeutet keine garantierte Verfügbarkeit. Große oder häufige Testuploads
und Downloads verbrauchen Kontingent. Die kostenlose Konfiguration verspricht
keinen Frankfurt-Standort; eine freie Wahl der Functions-Region setzt einen
kostenpflichtigen Tarif voraus. Dies ist eine Demo, keine Freigabe für einen
produktiven Kundenbetrieb.

## Dauerhafte Daten

- Lokal: `GATEWAY_STORAGE=local`, bisherige `.gateway` oder `GATEWAY_DATA_DIR`.
- Netlify-Build: Backend `netlify-blobs`, Basis `project-gateway-demo-v1`.
- Produktion: stabiler Store `project-gateway-demo-v1-production`, unabhängig
  von Deploy-ID und Serverneustarts.
- Vorschauen: eigener Store je Kontext und gehashter Review-/Branch-Kennung.
  Eine Vorschau erhält keine Produktionssitzungen oder Produktionsprojekte.
- Speicherfehler führen zu einem Fehler, niemals zu einem unbemerkten lokalen
  Ersatzspeicher oder automatischen Zurücksetzen.

`next.config.ts` übernimmt ausschließlich nicht geheime Backend-/Kontextwerte
in den Build, weil Umgebungswerte aus `netlify.toml` zur Laufzeit von Functions
nicht automatisch vorhanden sind. Blobs-Zugangsdaten bleiben ausschließlich in
der Netlify-Laufzeit. `APP_MODE` bleibt über `gateway.config.json` explizit Demo;
eine spätere Live-Anbindung erfordert eigene Implementierung.

Projekte, Sitzungen, Revisionen und Historie werden als zusammenhängender
Demodatenbestand mit starker Konsistenz gelesen. Bedingte Schreibvorgänge prüfen
den ETag; konkurrierende Änderungen werden neu gelesen und fachlich geprüft,
veraltete Projektänderungen liefern 409. Lesende Zugriffe schreiben nicht.
Dieses Modell ist für eine begrenzte Demo ausgelegt, nicht als skalierbare
Produktionsdatenbank. Vor regulärem Pilotbetrieb sind Datenaufbewahrung,
Backups/Wiederherstellung und echte Anmeldung gesondert zu implementieren.

Keine bestehende lokale `.gateway` wird automatisch übertragen. Die erste
Installation startet mit gekennzeichneten synthetischen Beispielen.

## Dateien

Die fachlichen Grenzen bleiben 20.000.000 Bytes/Datei, 15 Dateien und
100.000.000 Bytes/Projekt. Der Browser überträgt Dateien in authentifizierten
Abschnitten von höchstens 2.000.000 Bytes. Dadurch bleiben Anfragen unter dem
serverlosen Request-Limit. Erst nach vollständiger Inhaltsprüfung und dauerhaft
gespeicherten Bytes wird ein Dokument als verfügbar markiert.

Downloads werden nach Rechteprüfung gestreamt. Ein Netlify-Blobs-Key allein
veröffentlicht keine Datei. Abschlüsse lassen sich mit derselben Übertragungs-ID
wiederholen, ohne eine zweite Dokumentkopie anzulegen.

Zwischenstände laufen nach einer Stunde ab. Eine begrenzte Bereinigung beim
nächsten Upload entfernt abgelaufene Daten nach zusätzlicher Race-Schutzfrist.
Ohne weiteren Upload bleiben sie bis zu einem späteren Bereinigungslauf privat
liegen. Reservierungen sind auf 100 MB je Eigentümer und 500 MB insgesamt
begrenzt. Keine kostenpflichtige oder periodische Hintergrundfunktion angelegt.

## Prüfung

```sh
npm ci
npm test
npm run build
npm run typecheck
npm run verify:preview
npm run verify:netlify
```

Der Netlify-Prüfbefehl startet ausschließlich eigene lokale Prozesse und den
offiziellen Blobs-Emulator mit temporären synthetischen Daten. Er nimmt keine
Ziel-URL und keine echten Zugangsdaten entgegen. Ein Neustart der Anwendung,
ein Upload über 6 MB, bytegleicher Streaming-Download, Sitzungen, Rechte und
Vorschau-Isolation werden geprüft.

Den normalen `npm run build` ohne `NETLIFY=true` verwenden. Ein Netlify-Build
legt den Speicherkontext bereits beim Bauen fest; der lokale Prüflauf muss
zwischen Produktion und Vorschau wechseln können.

Der offizielle Emulator aus `@netlify/blobs` 11.1.1 liefert bei GET und HEAD
keinen ETag. Der Prüfbefehl verwendet deshalb eine ausschließlich lokale
HTTP-Weiterleitung: Für den gelesenen Demodatenbestand ergänzt sie den echten
ETag aus dem LIST-Ergebnis desselben Emulator-Stores. Der Test meldet diese
Ergänzung ausdrücklich. Anwendungscode und Abhängigkeiten werden dafür nicht
verändert; die Anwendung verweigert weiterhin Schreibzugriffe ohne gültigen
ETag. Dieses Vorgehen ist nur im sequenziellen Test zulässig, kein Ersatz für
einen atomaren Lesezugriff im Produktivbetrieb.

Außerdem führt der Emulator konkurrierende bedingte Schreibvorgänge nicht
atomar aus. Deshalb prüft der HTTP-Lauf dort die Ablehnung einer bereits
veralteten Revision; überlappende CAS-Szenarien werden separat in
`tests/netlify-storage.test.ts` gegen einen atomaren Testadapter geprüft.
Ein erfolgreicher lokaler Lauf bestätigt weder den Netlify-Adapterbuild noch
die gehosteten Functions oder deren tatsächliches Speicherverhalten.

Separat erfolgreich geprüft wurde am 28.09.2026 der Offline-Adapterbuild mit
`NETLIFY=true CONTEXT=production BRANCH=feat/homepage-professional-pass npx netlify-cli build --offline`.
Netlify Build 37.3.2 und Next Runtime 5.16.0 paketierten die Serverfunktion;
der erzeugte Build enthält das Blobs-Backend und den Produktionskontext.
Dieser Prüfschritt legt keine Site an. Die tatsächliche Bereitstellung ist noch
offen, weil die Kontoanmeldung nicht bestätigt werden konnte.

Nach der Bereitstellung: tatsächlichen Commit, Free-Tarif, HTTPS-Cookies,
Upload/Download bis zur 20-MB-Grenze, Daten über erneutes Deployment hinweg,
parallele Änderungen und die Browseroberfläche prüfen. Erst dann gilt die
gehostete Demo als abgenommen.

Für die HTTP-Prüfung ist ein gezielter Befehl vorbereitet:

```sh
npm run verify:hosted -- https://DIE-EIGENE-SITE.netlify.app
```

Er akzeptiert nur eine ausdrücklich angegebene Netlify-HTTPS-Adresse ohne
Zugangsdaten, Pfad oder Weiterleitungen. Nach der Demo-Prüfung legt er zwei
synthetische Eigentümersitzungen, einen Entwurf und eine exakt 20.000.000 Byte
große CSV-Datei an. Er prüft Cookieattribute, Zugriffstrennung, Speichern,
Abschnittsübertragung, wiederholbaren Abschluss, bytegleichen Streaming-Download
und Ablehnung einer veralteten Revision. Die Testdaten bleiben privat auf der
Site gespeichert; der Lauf verbraucht deren normales Hostingkontingent. Cookies
und Zugangsdaten werden nicht ausgegeben. Es gibt keine automatische Zielsuche.

Der Befehl ist am 29.09.2026 syntaktisch geprüft, aber noch nicht gegen eine
veröffentlichte Site ausgeführt. Browserprüfung, konkurrierende Schreibzugriffe
und Persistenz über ein erneutes Deployment sind separate offene Prüfschritte.

## Offizielle Referenzen

- https://www.netlify.com/pricing/
- https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- https://docs.netlify.com/build/data-and-storage/netlify-blobs/
- https://docs.netlify.com/build/functions/configuration/
- https://docs.netlify.com/build/environment-variables/overview/
