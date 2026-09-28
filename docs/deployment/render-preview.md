# Dauerhafte Demo-Vorschau auf Render

Stand: 28.09.2026. `render.yaml` ist eine vorbereitete Bereitstellungsvorlage,
kein bereits eingerichteter Dienst. Render ist in dieser Arbeitsumgebung noch
nicht verbunden. Es wurde kein Dienst angelegt, keine Zahlung ausgelöst und
kein Deployment ausgeführt. Die Vorlage besteht die lokale Validierung mit
`Draft202012Validator` gegen das am 28.09.2026 von Render abgerufene offizielle
JSON-Schema. Eine serverseitige Render-Blueprint-/Kontovalidierung und der Test
auf tatsächlicher Render-Infrastruktur stehen aus.

## Vorgesehene Konfiguration

| Einstellung              | Wert                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| Repository / Branch      | `wrguck-stack/project-gateway` / `feat/homepage-professional-pass`       |
| Laufzeit                 | Native Node, exakt `24.19.0`                                             |
| Region                   | Frankfurt                                                                |
| Compute-Plan             | `0.5c-512mb` (0,5 CPU / 512 MB)                                          |
| Instanzen                | Genau eine; kein Autoscaling, kein Clusterbetrieb                        |
| Persistentes Volume      | 1 GB, `/var/data/gateway`                                                |
| Datenverzeichnis         | `GATEWAY_DATA_DIR=/var/data/gateway`                                     |
| Modus                    | `APP_MODE=demo`                                                          |
| Build                    | `npm ci --include=dev && npm test && npm run build && npm run typecheck` |
| Start                    | `npm run start -- --port $PORT`                                          |
| Healthcheck              | `/` - ausschließlich HTTP-Liveness der Startseite                        |
| Automatische Deployments | Aus (`autoDeployTrigger: off`)                                           |

Der Einstiegspreis beträgt laut Render zum Prüfdatum 7 USD/Monat für den
Compute-Plan plus 0,25 USD/GB/Monat für das Volume: bei 1 GB zusammen **7,25
USD/Monat**, vor Steuern, Zusatzverbrauch und gegebenenfalls Workspace-Kosten.
Die tatsächliche Kostenübersicht bei Einrichtung ist maßgeblich. 512 MB sind
ein Vorschau-Einstieg, keine unter Last bestätigte Kapazität. Ein größerer Plan
würde zusätzliche Kosten verursachen und wird nicht automatisch eingerichtet.

## Speicher- und Freigabegrenzen

Die Anwendung benötigt einen dauerhaften Node-Prozess mit beschreibbarem
Dateisystem. `src/server/store.ts` speichert Projekte und Sitzungen in
`demo-store.json`; `src/server/services.ts` speichert Dateibytes im Unterordner
`documents/`. Beide liegen im Volume und müssen gemeinsam gesichert werden.
Die synchrone Dateitransaktion ist nur innerhalb eines App-Prozesses abgesichert.
Keine weitere Instanz, Worker-Cluster oder parallele App mit diesem Volume starten.

Render bindet ein persistentes Volume nur an eine Instanz und führt damit keine
Deployments ohne Unterbrechung durch. Kurze Unterbrechungen bei Neustart oder
Deployment bleiben möglich. Dateien außerhalb des Mountpfads sind nicht dauerhaft.
Der Build hat keinen Zugriff auf das Laufzeitvolume. Das Healthcheck-Ergebnis
allein bestätigt weder dessen Schreibbarkeit noch funktionierende Sessions/Uploads.

Eine neue Einrichtung startet mit einem leeren Volume und den gekennzeichneten
Demo-Beispielen. **Keine bestehende `.gateway` aus Codespaces oder einer lokalen
Arbeitskopie übertragen.** Das Volume ist kein öffentliches Assetverzeichnis.
Ein später gewünschter Datenumzug braucht eine getrennte, ausdrücklich bestätigte
Migration. GitHub sichert den Quellcode, nicht das Laufzeitvolume.

Der Dienst wäre nach Einrichtung über eine öffentliche HTTPS-Adresse erreichbar;
`autoDeployTrigger: off` bedeutet keine automatische Übernahme weiterer Commits,
verhindert aber nicht die erste Bereitstellung bei Blueprint-Einrichtung. Die
Vorschau bleibt Demo-only: Der Partnerzugang ist absichtlich simuliert und offen.
Nur synthetische Angaben und Testdateien verwenden; keine echten Kundendaten.
Einrichtung und kostenpflichtige Veröffentlichung erfolgen erst nach Freigabe
der konkreten Konfiguration und Anbindung des Render-Kontos.

Live-Authentifizierung, PostgreSQL-Services, Objektspeicher, echter Versand und
Partnerzustellung bleiben unverbunden. `APP_MODE=live` aktiviert diese Dienste
nicht. Betreiber-/Kontaktwerte nur mit bestätigten Angaben über die vorhandenen
`GATEWAY_OPERATOR_*` / `GATEWAY_CONTACT_*` Variablen konfigurieren.

## Lokale Prüfung vor der Einrichtung

Mit vorhandenem, aktuellem Produktionsbuild:

```sh
npm run verify:preview
```

Nach Änderungen am Anwendungscode zuvor `npm run build` ausführen.
`scripts/verify-preview.mjs` startet denselben Next-Produktionsserver lokal auf
einem freien Loopback-Port mit einem eigenen temporären Datenverzeichnis.
Es prüft per HTTP:

- eine synthetische Eigentümersitzung und einen neuen Entwurf;
- Upload und bytegleichen Download einer kleinen synthetischen CSV;
- vollständiges Beenden und Neustarten des Serverprozesses;
- unveränderte Projekt-/Dokumentdaten und weiter gültiges ursprüngliches Cookie;
- abgewiesenen Zugriff eines anderen Eigentümers und ohne Sitzung vor und nach
  dem Neustart.

Das Skript akzeptiert keine Ziel-URL und verwendet keine vorhandene `.gateway`.
Es beendet nur seinen eigenen Server und entfernt nur sein eigenes temporäres
Datenverzeichnis. Es prüft keine Browserdarstellung, keine komplette fachliche
Nutzerstrecke und keinen externen Hostingdienst.

## Prüfung nach einer später freigegebenen Einrichtung

Die Render-Vorlage und angebotenen Kosten im verbundenen Konto serverseitig
validieren. Danach die tatsächlich vergebene HTTPS-Adresse und den ausgerollten
Commit kontrollieren. Auf dieser Adresse mit synthetischen Daten die Kernstrecke,
Dateiupload und einen manuellen Neustart prüfen; anschließend denselben Entwurf
mit derselben Browsersitzung wieder öffnen. HTTPS-Cookies (`Secure`, `HttpOnly`,
`SameSite=Lax`), Origin-Prüfung hinter dem Proxy und Dateizugriff separat prüfen.
Desktop- und Mobile-Browserabnahme bleibt erforderlich. Volume-Auslastung und
ein abgestimmter Sicherungs-/Wiederherstellungsweg müssen vor regelmäßiger
Vorführung feststehen; aktuell gibt es keine automatische Datenbereinigung.

## Offizielle Quellen

- [Render Blueprint-Felder und aktuelle Plan-IDs](https://render.com/docs/blueprint-spec)
- [Render Preise](https://render.com/pricing)
- [Render persistente Volumes und Einschränkungen](https://render.com/docs/disks)
- [Render Blueprint-JSON-Schema](https://render.com/schema/render.yaml.json)

Die installierte Next.js-Dokumentation zu Deployment und Self-Hosting wurde
ebenfalls berücksichtigt (`node_modules/next/dist/docs/01-app/`).
