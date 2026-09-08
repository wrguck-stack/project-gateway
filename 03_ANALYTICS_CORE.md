# Project Gateway — Analytics Core Handoff

Consolidated normative analytics sources for implementation. The very large synthetic journeys fixture is intentionally omitted from this repository bootstrap because it is QA fixture data, not a normative product contract.


---

# FILE: Project-Gateway-Visualization-Specification.md
# Project Gateway - Visualization Implementation Specification

Version 1.0 | 05.09.2026 | Verbindliche visuelle Basis: Atlas / Variante 1

## 0. Auftrag, Geltung und Lieferumfang

Dieser Handoff ergänzt die ausgewählte Product-Design-Richtung ausschließlich um analytische Semantik, Datenvisualisierungen und deren Interaktion. Anthrazit, Amber, schmale markante Typografie, Luftbildbezug und die zusammenhängende Arbeitsfläche von Atlas bleiben erhalten. Es entsteht kein neues Dashboard-Template.

Die neun Score-Faktoren, vier Bewertungsklassen und elf Prozessstatus des jüngsten Nutzerbriefings sind maßgeblich. Sie ersetzen die früheren vier rein illustrativen Score-Beiträge und das verkürzte Statusmodell. Die vorhandene Atlas-Originalreferenz und der gespeicherte Designbrief sind die gestalterischen Quellen. Die Diagramme dieses Pakets verwenden ausdrücklich synthetische Prüfdaten, keine Ergebnisse realer Energieprojekte.

Lieferumfang: diese fachliche Spezifikation, ein vollständiger Komponentenvertrag, maschinenlesbare Datenverträge und Testbeispiele, exakt aus diesen Beispielen erzeugte Diagramme, Desktop-/Mobile-Kompositionen und ein PDF. Kein produktiver Anwendungscode und keine live angebundenen Datenquellen.

Lesereihenfolge für Codex: diese Datei; COMPONENT-CONTRACTS.md; DATA-CONTRACT.json; EXAMPLE-DATA.json; QA-REPORT.md; die zugeordneten Visualisierungen. Normative Texte und Datenwerte haben bei Beschriftungsabweichungen Vorrang vor generierten Layoutbildern. Der visuelle Charakter des ausgewählten Atlas-Boards bleibt verbindlich.

## 1. Analytische Architektur

Die zentrale Eigentümerfrage lautet: Welche Einordnung erlaubt die vorhandene Datenbasis und was muss ich als Nächstes ergänzen? Die zentrale Partnerfrage lautet: Welches Projekt braucht jetzt meine Aufmerksamkeit und welche Entscheidung kann ich begründet treffen?

| Ebene | Hauptform | Entscheidung |
| --- | --- | --- |
| Project Score | Große Zahl mit Klassenlabel; darunter gewichtete horizontale Faktorbeiträge | Projektpriorität verstehen |
| Datenbasis | Direkte Quellenlabels und Angaben vorhanden / erforderlich | Belastbarkeit einordnen |
| Risiken und Lücken | Kurze priorisierte Befundliste mit konkreter Folgeaktion | Nächsten Schritt wählen |
| Standort | Ortsbezogenes Luftbild mit unabhängigen Vektorebenen | Gebäude und verfügbare Fläche unterscheiden |
| Energie | Beschriftete Jahreswerte; bei Vergleichbarkeit horizontale Balken und Intervalle | Größenordnungen und Datenbedarf erkennen |
| Partnerarbeit | Priorisierte Projektliste und ausgewählte Akte | Bearbeiten statt Kennzahlen betrachten |
| Pipeline | Geordnete Stufenliste mit Bestand, Alter und offenen Aktionen | Engpässe finden |
| Ablehnungen | Horizontale Häufigkeitsbalken plus Nenner | Gründe vergleichen |
| Interner Funnel | Kohortentabelle mit Balken, Stufenkonversion und Nicht-Erreichern | Verluststellen im Prozess lokalisieren |

Primäre Umsetzungsroute: semantisches HTML/DOM und SVG für die kleinen, beschriftungsreichen Visualisierungen. Fallback ist eine gleichwertige beschriftete Tabelle. Ein Kartenrenderer wird ausschließlich für die räumliche Ansicht benötigt. Kein allgemeines Analytics-Framework muss die Product-Design-Shell ersetzen.

### 1.1 Vier voneinander unabhängige Bedeutungen

1. **Score-Klasse:** Priorität aus einem definierten Bewertungsmodell.
2. **Score-Datenbasis:** Welche anwendbaren Faktoren sind bewertet, geschätzt oder unbekannt?
3. **Angaben-Vollständigkeit:** Wie viele aktuell benötigte Datenfelder oder Unterlagen sind vorhanden?
4. **Prozessstatus:** Wo befindet sich das Projekt im Arbeitsablauf?

82 Punkte sind nicht 82 % Datenvollständigkeit. Ein vollständiger Datensatz ist nicht automatisch ein gutes Projekt. QUALIFIED bedeutet Vorqualifizierung, nicht Vertragsabschluss. Ein hoher Score hebt einen bestätigten fachlichen Blocker nicht auf.

## 2. Project Score

### 2.1 Gesamtwert und Bewertungsklassen

Ein kompakter Kopf zeigt Projektname, Score, Klassenlabel, Datenbasis und aktuelle Handlungsaufforderung. Die Zahl ist dominant; eine gerade 0-100-Skala dient optional der Einordnung. Sie hat explizite Grenzmarken 50, 65 und 80. Keine Tachonadel, kein Donut, kein Radar und keine animierte Hochzählung.

| Score als Integer | Primäres Klassenlabel | Bedeutung / Handlung |
| --- | --- | --- |
| 80-100 | Hohe Priorität | Sehr interessantes Projekt; nächste fachliche Prüfung priorisieren. |
| 65-79 | Gutes Potenzial | Weitere fachliche Prüfung sinnvoll. |
| 50-64 | Informationen ergänzen | Zusätzliche Informationen oder Klärung erforderlich. |
| 0-49 | Aktuell geringe Priorität | Gründe und alternative nächste Schritte zeigen; keine automatische Ablehnung. |

Die Klassengrenzen stammen vom Nutzer. Der Bewertungsdienst liefert einen einzigen gerundeten Integer; Klasse und Anzeige werden aus genau diesem Wert abgeleitet. Rundung: mathematisch auf den nächsten Integer, .5 aufwärts. Niemals 79,6 als 80 anzeigen und zugleich die Klasse 65-79 verwenden. Außerhalb 0-100 liegende Payloads werden als Datenfehler verworfen und nicht heimlich korrigiert.

### 2.2 Neun Faktoren und Gewichtungsdisziplin

| Faktor-ID | Inhalt | Abgrenzung gegen Doppelzählung |
| --- | --- | --- |
| USABLE_AREA | Tatsächlich nutzbare Dach- oder Grundstücksfläche | Bewertet verfügbare Fläche und Einschränkungen; nicht nochmals dieselbe Größe als Ertrag. |
| SOLAR_YIELD | Standortbezogenes Solar-/Ertragspotenzial | Bewertet spezifischen Standort-/Ertragskontext mit Modellannahmen; keine nochmalige Belohnung großer Dächer. |
| CONSUMPTION_SELF_USE | Verbrauch und zeitliche Passung zum Erzeugungsprofil | Jahresverbrauch allein beweist keine Eigenverbrauchsquote. |
| DECISION_AUTHORITY | Eigentums-, Vertretungs- und Entscheidungssituation | Herkunft einer Angabe bleibt von fachlicher Bestätigung getrennt. |
| ROOF_CONDITION | Zustand, Sanierungsbedarf und bekannte Einschränkungen | Bei Freiflächen nicht anwendbar; nicht mit 0 bestrafen. Statik bleibt eigene fachliche Prüfung. |
| PROJECT_SCALE | Passung zur Projektgrößenklasse des Partners | Bewertet das Partnersegment, nicht dieselbe Fläche ein zweites Mal. Ohne eigene Regel Gewicht 0. |
| READINESS | Zielklarheit, Zuständigkeit und Projektbereitschaft | Nicht die Anzahl hochgeladener Dateien bewerten. |
| DOCUMENTATION | Verfügbarkeit und fachlich relevanter Stand benötigter Unterlagen | Nicht dieselbe Information zusätzlich als bestätigtes technisches Faktum zählen. |
| ENERGY_INFRASTRUCTURE | Bestehende PV, Speicher und bekannte Anschluss-/Erweiterungssituation | Keine PV oder kein Speicher sind nicht automatisch negative Faktoren. |

Produktionsgewichte und Faktorregeln werden durch eine versionierte, fachlich verantwortete Konfiguration geliefert. Codex baut die Visualisierung dynamisch für diese Gewichte und darf keine Eignungsgrenzen aus dem UI ableiten. Es erfolgt keine automatische Lernkorrektur aus Ablehnungsdaten.

**Ausschließlich für die UI-Prüfdaten** verwenden wir Maximalbeiträge 15 / 15 / 20 / 15 / 10 / 5 / 10 / 5 / 5. Die Beispielbeiträge 13 / 12 / 18 / 15 / 6 / 4 / 7 / 3 / 4 summieren sich exakt auf 82. Diese Zahlen sind keine fachlich validierte Bewertungsformel.

Jedes Projekt gehört zu einem Profil, beispielsweise Gewerbedach-PV, PV-Erweiterung, Speicher oder Freifläche. Anwendbarkeit und Gewichte werden vor der Berechnung aus dem Profil bestimmt. Anwendbare Gewichte summieren sich zu 100. Nicht anwendbare Faktoren zeigen Nicht relevant; fehlende Faktoren zeigen Noch unbekannt. Beides darf nicht vermischt werden. Ein Profilwechsel erzeugt eine neue Bewertungsversion.

Ein anwendbarer Faktor mit Maximalgewicht 0 heißt Nicht gewichtet und erhält keinen 0/0-Balken. Für Score-Abdeckung und PARTIAL zählen ausschließlich anwendbare Faktoren mit positivem Gewicht. Eine fehlende Angabe in einem ungewichteten Faktor macht die Bewertung daher nicht künstlich unvollständig; fachliche Informations-/Blockerregeln bleiben davon unabhängig.

### 2.3 Faktoraufschlüsselung

Neun beschriftete Zeilen mit gemeinsamer Punkteachse. Die maximale Achse entspricht dem größten Faktor-Maximum im aktiven Modell, im Beispiel 20 Punkten. Pro Zeile: Name, gefüllter Beitrag, dünn umrahmter möglicher Maximalbeitrag, Wert beispielsweise 13 / 15 Punkte, Datenherkunft und ein öffnender Detailbutton. So sind Beiträge quantitativ vergleichbar. Nicht jede Zeile künstlich auf 100 % Breite auffüllen.

Reihenfolge nach fachlicher Logik, nicht wechselnd nach Tageswert: Fläche, Solar, Verbrauch, Entscheidung, Dach, Größe, Bereitschaft, Unterlagen, Infrastruktur. Eine explizite Sortieroption Nach Beitrag kann im Partnerbereich ergänzt werden; die Standardreihenfolge bleibt stabil.

Der geöffnete Faktor erklärt: zugrunde liegende Angabe; Quelle und Zeitpunkt; angewendete Regel-ID/-Version; Beitrag und Maximum; Einschränkungen; konkrete Ergänzungsmöglichkeit. Erklärungen müssen aus tatsächlichen Regelergebnissen stammen. Keine frei generierte nachträgliche Begründung.

### 2.4 Fehlende Faktoren, Schätzungen und Score-Zustände

| Score-Zustand | Anzeige | Bedeutung |
| --- | --- | --- |
| READY | 82 / 100 und Klasse | Alle anwendbaren Faktoren bewertbar; keine Aussage über eine technische Freigabe. |
| ESTIMATED | 82 / 100; Vorläufig - enthält Schätzwerte | Alle Beiträge vorhanden, einzelne Eingaben oder Regeln beruhen auf ausgewiesenen Schätzungen. |
| PARTIAL | Noch kein Gesamtscore; mögliche Spanne 70-85 | Mindestens ein Faktor ist unbekannt. Kein renormalisierter Punktwert. |
| NOT_READY | Noch nicht bewertbar | Standort/Profil oder mehrere notwendige Grundlagen fehlen. |
| SCORING | Qualifizierung wird erstellt | Tatsächlicher Auftrag in Bearbeitung, kein Zufallsfortschritt. |
| STALE | Letzte Bewertung 82; Aktualisierung erforderlich | Relevante Angaben oder das Modell haben sich verändert. |
| ERROR | Bewertung derzeit nicht verfügbar | Dienst oder Payload ungültig; vorhandene Angaben bleiben sichtbar. |

Für PARTIAL: bekannte Beiträge K plus Gewicht unbekannter Faktoren U ergeben die rechnerische Spanne [K, K+U]. Im Beispiel ist Solar unbekannt: K=70, U=15, also 70-85. Das ist eine mögliche Punktespanne, **kein statistisches Konfidenzintervall**. Bekannte Beiträge werden nicht durch ihre Restgewichte dividiert, um einen künstlich hohen Score zu erzeugen. Eine finale Klasse bleibt offen, auch wenn die Spanne überwiegend in einer Klasse liegt. Schätzungsintervalle einzelner bewerteter Faktoren müssen gegebenenfalls zusätzlich berücksichtigt werden; sie dürfen nicht als exakt bekannt in K eingehen.

Eine berechenbare, aber auf Schätzungen beruhende Bewertung bleibt sichtbar vorläufig. Kritische ungeklärte Fragen erscheinen immer neben dem Score. Ein regelbasierter Blocker kann die Übergabe oder Übernahme verhindern, ohne die Zahl heimlich zu ändern.

### 2.5 Positive Faktoren, Risiken und nächste Schritte

Drei klare Gruppen unter dem Score: Dafür spricht / Zu klären / Angaben ergänzen. Maximal zwei wichtigste Einträge jeder Gruppe zunächst sichtbar; Gesamtzahl und Weitere anzeigen bleiben verfügbar. Ein bestätigter Blocker wird nie eingeklappt.

- Positiv: beispielsweise Zusammenhängende nutzbare Fläche angegeben; Entscheidungsträger benannt.
- Kritisch bestätigt: beispielsweise Sanierung vor Installation erforderlich, mit Quelle und Bestätigung.
- Ungeklärt: Netzanschluss nicht geprüft oder Tragfähigkeit unbekannt. Das ist kein festgestellter Mangel.
- Fehlend: Lastgang fehlt, zusammen mit Lastgang ergänzen als direkter Aktion.

Verbesserungstexte beschreiben den Informationsgewinn: Lastgang ergänzen, damit die zeitliche Verbrauchspassung geprüft werden kann. Keine garantierten Bonuspunkte oder manipulierbaren Optimierungstipps wie Datei hochladen für +10 Punkte.

## 3. Datenherkunft und Unsicherheit

### 3.1 Herkunft und Messcharakter sind zwei getrennte Achsen

Ein extern berechneter Wert kann zugleich geschätzt sein. Eine Nutzereingabe kann einen abgelesenen Messwert oder eine grobe Vermutung enthalten. Deshalb nicht alles in eine einzige exklusive Quelle-Enumeration pressen.

| Herkunft | Sichtbares Label | Erforderliche Metadaten |
| --- | --- | --- |
| USER | Vom Nutzer angegeben | Eingabezeit, Person/Rolle falls bekannt, optionale Dokumentreferenz |
| EXTERNAL | Extern ermittelt | Anbieter, Datensatz, Version, Bezugszeit, Abrufzeit, Methode |
| PARTNER | Fachlich ergänzt | Partner/Rolle, Zeitpunkt, Beleg oder Kommentar |
| DERIVED | Berechnet | Eingangsreferenzen, Formel-/Modellversion und Berechnungszeit |

Messcharakter: OBSERVED, ESTIMATED, UNKNOWN oder NOT_APPLICABLE. Anzeige beispielsweise Extern ermittelt · geschätzt. UNKNOWN hat value=null und keine erfundene 0. Ein Fehler ist ein Abrufzustand, nicht UNKNOWN. Fehlende, veraltete, widersprüchliche und nicht anwendbare Werte werden getrennt dargestellt.

Schätzungen nutzen ca. oder ein plausibles Intervall. Physische Angaben werden auf eine zur Datenqualität passende Stufe gerundet: grobe Fläche beispielsweise auf 100 m², grober Jahresertrag auf 10 MWh. Originalpräzision bleibt in den Metadaten, wird aber nicht als Scheingenauigkeit hervorgehoben. Intervalle erhalten Methode und Bedeutung; keine automatisch erfundenen ±10 %.

### 3.2 Vollständigkeit

Standardanzeige: 16 von 20 benötigten Angaben vorhanden. Optional ergänzend 80 %. Der Nenner ist profil- und schrittabhängig versioniert. Nicht anwendbare Felder sind ausgeschlossen; explizit unbekannte Werte zählen nicht als fachlich vorhandene Information. Die Frage kann beantwortet sein, während die Information weiterhin fehlt.

Dokumente separat: 2 von 3 derzeit benötigten Unterlagen vorhanden. Eine beliebige zusätzliche Datei erhöht die Vollständigkeit nicht. Ein vorhandenes Dokument ist nicht automatisch fachlich geprüft.

Score-Abdeckung separat in der Detailansicht: beispielsweise 8 von 9 Faktoren bewertbar; 85 von 100 Gewichtspunkten abgedeckt. Keine Zusammenfassung dieser unterschiedlichen Größen zu einem einzigen angeblichen Confidence-Prozentwert.

## 4. Standort- und Objektpotenzial

### 4.1 Analytischer Zweck und Ebenen

Die Karte beantwortet: Ist es das richtige Gebäude, welche Teilfläche gehört zum Projekt und welche Geometrie liegt den Größenangaben zugrunde? Sie wird nicht zur Priorisierung nicht räumlicher Sachverhalte verwendet.

| Ebene | Darstellung | Bedingung |
| --- | --- | --- |
| Basiskarte / Luftbild | Ruhiger, dunkler Kontext; Umschalter Karte / Luftbild | Lizenzierte, dem Standort zugeordnete Quelle; Datum und Attribution sichtbar |
| Adresse | Kleiner Locator am tatsächlich zugeordneten Punkt | Geocoding-Treffer oder bestätigte Nutzerposition |
| Gebäudekontur | Dünne Amber-Linie; Bildschirmbreite konstant | Georeferenzierte Kontur mit Quellenkennzeichnung |
| Projekt-/Nutzfläche | Helle Umrandung plus dezente Schraffur | Eigene oder geprüfte Nutzflächengeometrie; nicht mit Gebäudegrundriss gleichsetzen |
| Ausgeschlossene Fläche | Neutrale Kreuzschraffur mit Label | Tatsächlich bekannte Einschränkungen; keine aus dem Bild erfundene Statik |
| Solar-/Ertragsdaten | Zur ausgewählten Fläche gehörende Zahl oder Intervall im Datenbereich | Modell, Datensatz, räumliche Auflösung und Annahmen vorhanden |
| Bestand / Erweiterung | Getrennte beschriftete Umrisse, falls Daten vorhanden | Keine nachträglich erfundenen Module oder Batteriestandorte |

Adresse, Gebäudetyp, mögliche Projektklasse, vorhandene PV und Speicherstatus stehen als strukturierte Angaben unmittelbar neben bzw. unter der Karte. Dachgrundriss, tatsächliche Dachoberfläche und nutzbare Modulfläche sind verschiedene Größen. Eine Karte darf die letzte Größe nicht aus einem sichtbaren Rechteck vortäuschen.

Koordinaten werden technisch in WGS84 (Längengrad, Breitengrad) gehalten. Flächenberechnung erfolgt geodätisch oder in einer geeigneten lokalen Projektion, nicht aus Web-Mercator-Bildpixeln. MapLibre darf Web Mercator zur Anzeige nutzen; daraus folgt keine zulässige Flächenmessung im Bildschirmraum.

### 4.2 Daten- und Funktionsgrenzen

PVGIS liefert standortbezogene Solarstrahlungs- und PV-Modellergebnisse; die Oberfläche muss Eingangsdaten und Modellkontext erhalten. Solche Werte ersetzen keine gebäudespezifische Statik-, Verschattungs- oder Anschlussprüfung. [JRC: PVGIS-Nutzerhandbuch](https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/using-pvgis-5/pvgis-5-user-manual_en)

Im MVP bleiben nicht angebundene Ebenen ausdrücklich Nicht verfügbar. Keine farbige Potenzial-Heatmap aus einem beliebigen Luftbild. Die generierte Atlas-Immobilie ist ausschließlich eine gekennzeichnete Demoansicht und darf nie unter einer beliebigen real eingegebenen Adresse erscheinen.

Empfohlene Kartenkomponente: SiteEvidenceMap auf MapLibre GL JS mit getrennten Raster-/Vektorquellen, 2D-Ansicht und deaktivierter perspektivischer Rotation. Ein statischer, lizenzierter Kartenausschnitt mit derselben Quellenzeile ist der Fallback; ohne Quelle erscheinen Adress-/Objektdaten und Standort manuell bestätigen. [MapLibre-Dokumentation](https://maplibre.org/maplibre-gl-js/docs/)

### 4.3 Interaktion

Desktop: Gebäude auswählen, Fit-to-building, Plus/Minus, Ebene ein-/ausblenden, Quelle öffnen. Wesentliche Daten bleiben ohne Hover lesbar. Ein Polygonklick selektiert die zugehörigen Angaben; Auswahl ist noch keine Zustimmung zur Richtigkeit.

Mobile: zunächst 220-260 px hohe nicht scrollfangende Karte; Karte öffnen startet eine fokussierte Vollbildansicht. Dort funktionieren Touch-Auswahl, explizite Zoomknöpfe und Zurück zum Projekt. Kein Zwang zu Drag oder Pinch. In Querformat stehen Karte und kurze Datenspalte nebeneinander. Verweigerte Geolokalisierung ist irrelevant, weil die Immobilienadresse und nicht der Aufenthaltsort des Nutzers benötigt wird.

## 5. Energieprofil

### 5.1 Erste Ansicht

Zuerst die drei wichtigsten Größen: jährlicher Verbrauch; vorhandene jährliche Eigenerzeugung; geschätztes zusätzliches Jahreserzeugungspotenzial. Jede Größe trägt Einheit, Bezugszeit und Herkunft. Vorhandene PV-Leistung in kWp wird nicht als Jahreserzeugung behandelt. Speicherkapazität kWh und Leistung kW bleiben getrennt.

Wenn mindestens zwei Werte in vergleichbaren Jahreszeiträumen vorliegen: drei horizontale, direkt beschriftete Größen auf einer gemeinsamen Nullachse in MWh/Jahr. Beispieldaten: Verbrauch 620; vorhandene Eigenerzeugung 180; zusätzliches Potenzial 350-450. Das Potenzial wird als Intervall mit Endmarken dargestellt. Die Werte werden weder übereinandergestapelt noch als ausgeglichene Energiebilanz ausgegeben.

Bei nur einem belastbaren Wert genügt die Zahl mit Quelle und zwei beschrifteten offenen Zeilen. Keine leeren Diagrammachsen und keine Nullbalken für fehlende Größen.

### 5.2 Eigenverbrauch und Speicher

Jahressummen allein erlauben keine belastbare Aussage, wann Erzeugung und Verbrauch zusammenfallen. Ohne kompatible Last- und Erzeugungszeitreihen: Eigenverbrauchspotenzial noch nicht belastbar; Lastgang und Erzeugungsprofil ergänzen. Keine Prozentzahl aus dem Verhältnis Jahresverbrauch / Jahreserzeugung erzeugen.

Mit geeigneten Zeitreihen kann später eine begrenzte zeitliche Gegenüberstellung ergänzt werden. Eine ungespeicherte zeitgleiche Nutzung wäre je Intervall das Minimum aus Last- und Erzeugungsenergie; deren Summe geteilt durch Erzeugung ist eine entsprechend modellierte Eigenverbrauchsquote. Zeitraster, Zeitzone, Datenlücken, Messzeitraum und Modellannahmen müssen passen. Das ist noch keine Speicheroptimierung.

Speichereignung erhält einen begründeten Prüfstatus: Daten fehlen / Fachliche Prüfung sinnvoll / Fachlich eingeschätzt / Bestätigte Einschränkung. Der Jahresverbrauch alleine löst weder Geeignet noch Ungeeignet aus. Kosten, Tarife, Lastspitzen, Betriebsstrategie und zeitliche Profile wären für eine belastbare Speicherbewertung zusätzlich nötig. Zeitreihen und Annahmen sind auch in professionellen Integrationsmodellen zentrale Eingaben. [NREL: REopt-Modellbeschreibung](https://docs.nlr.gov/docs/fy17osti/70022.pdf)

Keine Sankey-Energiebilanz, solange Energieflüsse und Zeitbezug nicht vollständig bekannt sind. Keine Autarkiequote ohne passende Daten. Keine aus Flächengröße abgeleitete Batteriegröße.

## 6. Operatives Partner-Dashboard

### 6.1 Hierarchie und Standardansicht

Die Atlas-Komposition bleibt eine zusammenhängende Projektarbeitsfläche. Oben: Organisation, Projektpipeline, Suche, Aktualisierungsstand. Darunter eine schmale Aufgabenzeile, beispielsweise 8 Rückfragen überfällig. Links eine priorisierte Projektliste; rechts die ausgewählte Akte. Keine gleichwertigen Umsatz-, Ertrags-, CO2- oder Lead-KPI-Karten.

Die Liste zeigt je Projekt sofort: Score oder ehrlichen Nicht-bewertbar-Zustand; Standort; Projektart; geschätzte Größe mit Einheit; Prozessstatus; nächste Aktion. Gebäudetyp, Angaben vorhanden / benötigt und Zeitpunkt der letzten fachlichen Aktion stehen in einer zweiten kompakten Zeile oder in der ausgewählten Akte. Ein vollständiger Tabellenmodus erweitert die Liste innerhalb derselben Arbeitsfläche; er ersetzt nicht die Atlas-Shell.

| Priorität der Arbeitsliste | Sortierung innerhalb der Gruppe |
| --- | --- |
| 1. Zugeordnete überfällige Aktionen | Fälligkeit aufsteigend |
| 2. Eingegangene Antworten zur Prüfung | Eingang aufsteigend |
| 3. Neue eingereichte Projekte mit Hoher Priorität | Score absteigend, dann Eingangszeit aufsteigend |
| 4. Weitere fällige / bearbeitbare Projekte | Fälligkeit, dann Wartezeit |
| 5. Wartende Projekte | Letzte fachliche Aktion; nicht künstlich durch Scores nach oben schieben |

Bestätigte Blocker erscheinen sichtbar beim Projekt und im Arbeitsauftrag. Sie sind kein zusätzlicher unbekannter Algorithmus für einen angeblichen Prioritätsindex. Überfälligkeit wird nur aus einer tatsächlichen Fälligkeit berechnet; fehlende SLA-Konfiguration bedeutet keine automatische rote Warnung.

### 6.2 Ansichten und Filter

Ansichten: Neue Projekte / Hohe Priorität / Informationen fehlen / In Prüfung / Übernommen / Abgelehnt. Hohe Priorität ist ein Scorefilter, Informationen fehlen ein Informationsfilter; beide können sich mit Prozessstatus überschneiden. Die Ansichtszahlen werden deshalb nicht zu einer Gesamtsumme addiert.

Filter: Status (Mehrfachauswahl), Klasse, Projektart, Gebäudetyp, Region, Größenintervall und Einheit, Vollständigkeit, Verantwortlicher, nächste Aktion/Fälligkeit. Suche nach Projekt-ID und Standort. Standardsortierung bleibt Nächste Aktion; Änderungen sind sichtbar und zurücksetzbar.

Projektgröße zeigt bevorzugt eine belegte erwartete Leistung in kWp oder MWp, mit Quelle und gegebenenfalls Intervall. Liegt sie nicht vor: ca. 4.800 m² Fläche · Leistung offen. Flächengröße und elektrische Leistung dürfen nicht gemeinsam numerisch sortiert oder addiert werden. Speichergrößen sind kWh/MWh, keine kWp.

Nur eingereichte und dem Partner freigegebene Projekte erscheinen. Auswahl allein verändert keinen Status. Eine neue Antwort oder Hintergrundaktualisierung darf die gerade gelesene Zeile nicht automatisch verschieben; Hinweis Neue Daten verfügbar, dann bewusst aktualisieren. Partnerwechsel verwirft Auswahl und Daten des vorherigen Kontexts sichtbar und lädt die berechtigte Arbeitsliste neu.

## 7. Projektpipeline

### 7.1 Darstellung

Eine geordnete Stufentabelle ist die Standardansicht. Jede Zeile enthält deutschen Namen, aktuellen Bestand, einen horizontalen Mengenbalken auf gemeinsamer Nullachse, Zahl offener Aktionen, überfällige Aktionen und typische bisherige Aufenthaltsdauer der aktuell dort befindlichen Projekte. Terminale Status zeigen Abschlusszahlen statt immer weiter wachsender Liegezeiten.

Vier visuelle Gruppen: Erfassung (NEW, INCOMPLETE, SCORING), Vorqualifizierung und Prüfung (QUALIFIED, PARTNER_REVIEW, INFO_REQUESTED), Entwicklung (ACCEPTED, DEVELOPMENT, CONTRACTED, REALIZED), Abgelehnt (REJECTED) als eigener Seiten-/Abschlussbereich. REJECTED ist kein normaler letzter Erfolgsschritt.

Keine Schläuche, kein breites Kanban, keine elf kleinen Spalten. Die Liste macht auch zwei Engpässe mit gleicher Projektanzahl, aber unterschiedlicher Wartezeit unterscheidbar. Klick auf Bestand oder Überfällig filtert die Projektliste exakt auf diese Menge. Engpassanzeigen beruhen auf Rückstau plus Alter/Fälligkeit; Bestandszahlen allein beweisen keinen Engpass.

### 7.2 Statusmodell und Anzeige

| Status | Label | Eintritt / Bedeutung | Nächste zulässige Schritte |
| --- | --- | --- | --- |
| NEW | Neu | Erfasst, noch nicht zur fachlichen Partnerprüfung eingeordnet; kann auch fertig bewertete geringe Priorität enthalten | INCOMPLETE, SCORING; REJECTED nur durch bewusste begründete Entscheidung |
| INCOMPLETE | Angaben fehlen | Benötigte Informationen oder konkrete Klärung fehlen | SCORING; REJECTED nur bewusst, nicht wegen Timeout |
| SCORING | Bewertung läuft | Initiale Bewertung tatsächlich in Bearbeitung | QUALIFIED bei erfüllten Regeln; INCOMPLETE bei Informationsbedarf; NEW bei vollständig bewerteter geringer Priorität |
| QUALIFIED | Vorqualifiziert | Vorqualifizierungsregeln erfüllt; Sichtbarkeit beim Partner setzt Übermittlung voraus | PARTNER_REVIEW, INFO_REQUESTED, ACCEPTED oder REJECTED durch autorisierte Aktion |
| PARTNER_REVIEW | In Prüfung | Fachliche Prüfung ausdrücklich begonnen | INFO_REQUESTED, ACCEPTED, REJECTED |
| INFO_REQUESTED | Rückfrage offen | Strukturierte Anfrage an den Projektkontakt gestellt | PARTNER_REVIEW nach beantworteter Anfrage oder bewusster Wiederaufnahme; REJECTED begründet |
| ACCEPTED | Übernommen | Partner übernimmt die weitere Bearbeitung; kein Vertragsabschluss | DEVELOPMENT; REJECTED nur mit dokumentiertem späterem Abbruch |
| DEVELOPMENT | In Entwicklung | Projektentwicklung tatsächlich begonnen | CONTRACTED oder REJECTED |
| CONTRACTED | Vertrag geschlossen | Tatsächlicher Vertragsmeilenstein dokumentiert | REALIZED; nachvertragliche Störung als separates Ereignis, nicht rückwirkend als verlorener Auftrag |
| REALIZED | Realisiert | Realisierungs-/Inbetriebnahmemeilenstein bestätigt | Terminal; Korrektur nur als nachvollziehbare administrative Berichtigung |
| REJECTED | Abgelehnt | Aktive Entscheidung mit Reason Code und Zeitpunkt | Wiederaufnahme ausschließlich explizit und begründet; ursprüngliche Entscheidung bleibt im Verlauf |

Vorgeschlagene vorläufige Qualifizierungsregel für den später konfigurierten Workflow: Score mindestens 65, notwendige Basisangaben vorhanden und kein aktiv sperrender bestätigter Blocker. Diese Workflow-Grenze ist ein Implementationsvorschlag, keine zusätzliche fachliche Behauptung. Die vier Scoreklassen selbst sind verbindlich. Ein Score 50-64 führt zu einer konkreten Klärungsaufgabe; unter 50 entsteht keine automatische Ablehnung.

Während einer laufenden Partnerprüfung bleibt der Geschäftsstatus erhalten, wenn neue Daten eine Neubewertung auslösen. Dann lautet der separate Score-Zustand SCORING bzw. STALE; die Akte springt nicht zurück in die Erfassung. Ein fehlgeschlagener Bewertungsjob wird als technische Störung mit nächster Aktion gezeigt und bleibt nicht unbegrenzt als angeblich laufende Analyse stehen.

Eine manuelle Statuskorrektur erzeugt einen eigenen korrigierenden Event. Frühere Übergänge werden nicht überschrieben. Zustandsänderung, Actor, Zeitpunkt, Grund und vorige Version bilden eine atomare Entscheidung. Veraltete Browserstände führen zu Neu laden und prüfen, nicht zu einem stillen Überschreiben.

### 7.3 MVP und spätere Meilensteine

NEW bis ACCEPTED sowie REJECTED gehören zur aktiven MVP-Strecke. DEVELOPMENT, CONTRACTED und REALIZED sind im Datenmodell und der Pipeline definiert. Im MVP genügen berechtigte, dokumentierte Meilensteinupdates; es entstehen keine zusätzlichen Vertrags-, Finanzierungs- oder Projektmanagementmodule. Nicht genutzte Folgestufen dürfen eingeklappt sein, bleiben aber im Gesamtmodell sichtbar.

## 8. Projektakte und Partnerentscheidung

### 8.1 Informationsarchitektur

| Reihenfolge | Inhalt | Immer sichtbar / Detail |
| --- | --- | --- |
| Kopf | Projektname, Standort, Projektart, Status, Verantwortlicher, nächste Aktion | Immer; kein großer Marketing-Hero |
| Entscheidungskern | Score, Klasse, Datenbasis, bestätigte Blocker, offene wichtigste Fragen | Immer vor Detailtabs |
| Standort | Adresse, Luftbild/Karte, Konturen, Gebäude, nutzbare Fläche und Quellen | Standortabschnitt; Kartendetails auf Abruf |
| Energie | Verbrauch, PV-Leistung und Erzeugung getrennt, Speicher, Potenzial und Unsicherheit | Jahreswerte direkt; Zeitreihen nur bei geeigneter Datenbasis |
| Score-Faktoren | Neun Zeilen, Regeln, Beiträge, positive/negative/fehlende Informationen | Beiträge sichtbar; Regeln und Quellen aufklappbar |
| Dokumente | Stromrechnung, Dachplan, Statik, Fotos, weitere Unterlagen | Datei, Kategorie, Quelle, Stand, Version; technisch verfügbar ist nicht fachlich geprüft |
| Prozess | Aktueller Status, Statushistorie, Kommentare, letzte Aktion | Letztes relevantes Ereignis direkt; vollständiger Verlauf erreichbar |
| Partnerentscheidung | Übernehmen, Informationen anfordern, Ablehnen | Im Kontext der Akte erreichbar, nie Hover-only |

Der Kopf bleibt beim Scrollen kompakt sichtbar. Innerhalb der Akte sind Standort / Energie / Score / Dokumente / Verlauf Anker oder Tabs. Ein direkter Link kann ein Dokument oder einen Faktor öffnen, sofern der aufrufende Nutzer berechtigt ist.

### 8.2 Übernehmen

Projekt übernehmen öffnet eine kurze Bestätigung mit Projekt, Organisation und optional zuständiger Person. Nach erfolgreicher Speicherung lautet der Status ACCEPTED. Bei bestätigtem sperrendem Blocker wird erklärt, welche autorisierte Klärung vor einer Übernahme nötig ist. Das UI ändert den Score nicht. In einer Demo heißt der Erfolg Übernahme simuliert.

### 8.3 Informationen anfordern

Auswählbare fehlende Felder/Dokumentkategorien, konkrete Frage, benannter Empfänger, optional Fälligkeit. Eine Anfrage-ID verbindet Nachricht, Antwort und erledigte Anforderungen. Vor dem tatsächlichen Versand Vorschau des empfangenden Kontakts und des Inhalts. Erst bestätigte Übermittlung setzt INFO_REQUESTED. Teilantworten erledigen nur die tatsächlich beantworteten Punkte.

Interne Kommentare und anfrageseitige Nachrichten sind getrennte Sichtbarkeiten. Eine Antwort erzeugt einen Verlaufseintrag und die nächste Aktion Antwort prüfen. Keine Kommentare oder Dokumente über Mandantengrenzen zeigen.

### 8.4 Ablehnen

Ablehnen öffnet einen Dialog mit genau einem erforderlichen primären Reason Code, bis zu drei optionalen ergänzenden Gründen, einer Erläuterung und dem Einschätzungsstand Bestätigt / Nicht ausreichend belegt / Partnerkriterium. Die zugehörigen IDs sind CONFIRMED / INSUFFICIENT_EVIDENCE / PARTNER_SCOPE_DECISION. Sonstiges benötigt einen Text. Bei technischer Begründung muss ein fachlicher Beleg oder eine nachvollziehbare Begründung referenziert werden; ein unbekannter Zustand ist kein bestätigter Mangel.

Die letzte Aktion lautet Projekt ablehnen. Abbrechen verwirft nur den Dialogentwurf. Nach Erfolg erscheinen REJECTED, der strukturierte Grund, Zeitpunkt und Actor. Die numerische Bewertung wird nicht automatisch nach unten korrigiert. Wiederaufnahme erzeugt einen neuen Event; die ursprüngliche Ablehnung bleibt für Auswertung und Versionsnachvollziehbarkeit erhalten.

## 9. Rejection und Learning Data

### 9.1 Reason-Code-Katalog

| Code | Label | Abgrenzung |
| --- | --- | --- |
| AREA_TOO_SMALL | Nutzbare Fläche zu klein | Konkrete verfügbare Fläche, nicht allgemeine Partnergröße |
| ROOF_CONDITION | Dachzustand ungeeignet | Bestätigter Zustand oder ausgewiesene fachliche Einschätzung |
| OWNERSHIP_AUTHORITY | Eigentums-/Entscheidungsproblem | Rechte, Vollmacht oder fehlende Entscheidungsmöglichkeit |
| LOW_CONSUMPTION | Verbrauch für dieses Modell zu gering | Abhängig vom Projektmodell; kein generelles PV-Ausschlusskriterium |
| PROJECT_SCALE_MISMATCH | Projektgröße passt nicht | Partnersegment, Mindest-/Maximalgröße oder wirtschaftliche Projektklasse |
| GRID_CONSTRAINT | Netzsituation | Bestätigtes Anschlussproblem bzw. dokumentierte Einschätzung |
| STRUCTURAL_CONSTRAINT | Statik | Fachlich dokumentierte Tragfähigkeits-/Statikfrage |
| REGION_OUT_OF_SCOPE | Region außerhalb des Fokus | Partner-/Organisationskriterium, keine physische Eignung |
| ECONOMICS | Wirtschaftlichkeit | Zugehörige Annahmen und Prüfreferenz nennen |
| MISSING_INFORMATION | Informationen unvollständig | Nachvollziehbarer Informationsbedarf; nicht als technischer Mangel ausgeben |
| OTHER | Sonstiges | Erläuterung erforderlich |
| PARTNER_CAPACITY | Partnerkapazität | Organisatorischer Grund; nicht als negativer technischer Score-Lernwert verwenden |
| DUPLICATE | Dublette | Administrativ, aus Eignungslernquoten ausschließen |
| WITHDRAWN | Vom Anfragenden zurückgezogen | Separater Abgang, nicht mit fachlicher Ablehnung vermischen |

Technische/fachliche, Partnerfit-, Informations- und administrative Gründe werden getrennt gruppiert. Die IDs bleiben stabil; Labeländerungen erzeugen keine neuen Codes. Im Backend wird der tatsächlich verfügbare Katalog versioniert.

### 9.2 Aggregation

Standard: nach Häufigkeit sortierte horizontale Balken für primäre Gründe. Direkt am Balken stehen Anzahl und Anteil, beispielsweise 18 / 80 · 22,5 %. Der Nenner lautet gültige fachliche/Partnerfit-Ablehnungsentscheidungen in der gewählten Kohorte; administrative Dubletten und Rückzüge sind als ausgeschlossene Anzahl ausgewiesen. Bei mehreren Entscheidungsrevisionen zählt eine definierte effektive Entscheidung pro Projekt und Partner, nicht jeder Klick.

Filter: Partner/Organisation, Projektart, Region, Eingangs- oder Entscheidungskohorte, Bewertungsmodellversion und Zeitraum. Der Modus Eingangs-Kohorte versus Entscheidungen im Zeitraum ist sichtbar und darf nicht unbemerkt wechseln.

Sekundäre Gründe sind eine separate Mehrfachnennungsauswertung. Deren Anteile dürfen zusammen über 100 % liegen und werden ausdrücklich so beschriftet. Keine Vermischung mit dem additiven Hauptgrunddiagramm.

Drill-down öffnet die zugehörigen Projekte und ihre Entscheidungssnapshots. Als spätere Ergänzung genügt eine Kreuztabelle Reason Code × Projektklasse mit n und Ablehnungsquote pro definierter Vergleichsgruppe. Kein automatisch erzeugtes Kausaldiagramm.

### 9.3 Lernfähigkeit ohne Scheinschluss

Jede Entscheidung speichert Score, Faktorbeiträge, Model-/Regelversion, Datenherkunft, Vollständigkeit, Partnerkriterienversion, Stage, Gründe, Belege und Zeitpunkte im Entscheidungssnapshot. Spätere Dokumente überschreiben diesen Zustand nicht.

Eine häufige Ablehnung beweist keine falsche Gewichtung. Partnerselektion, nur untersuchte Projekte, Kapazität, Regionen und ungleiche Datenqualität können die Zahlen verschieben. Änderungen an Gewichten werden fachlich geprüft und gegen zeitlich getrennte Fälle verglichen. Kleine Gruppen werden mit n und dem Hinweis Kleine Datenbasis gezeigt; kein automatisches Ranking oder Scheingenauigkeit aus zwei Fällen. Es erfolgt kein selbständiges Nachtrainieren eines AI-Scores im MVP.

## 10. Funnel und Business Analytics

### 10.1 Darstellung und Kohorte

Internes, separat berechtigtes Modul. Die einfachste Form ist eine senkrechte Stufentabelle mit horizontalen, linksbündigen Balken auf gemeinsamer Nullachse. Jede Zeile enthält Menge, Konversion von der vorherigen Stufe, Anteil am Start und Nicht-Erreicher zur nächsten Stufe. Keine perspektivisch verjüngten Trichterflächen.

Stufen: Besucher / Standortcheck gestartet / Standortcheck abgeschlossen / Projekt eingereicht / qualifiziert / Partner angenommen / Projektentwicklung / Vertrag / realisiert.

Damit die ersten Stufen nicht anonyme Sitzungen mit späteren Projektzahlen vermischen, zählt der Akquisitionsfunnel durchgehend **messbare Journeys**. Eine Journey ist ein zurechenbarer Besuch mit einem primären Projekt, falls ein Check gestartet wird. Mehrere Projekte eines Besuchs zählen hier nur über das erste primäre Projekt; alle tatsächlichen Projekte fließen separat in die Projekt-Kennzahlen ein. Das Label lautet Besucher (messbare Besuche), nicht angeblich eindeutige natürliche Personen. Nicht messbare oder nicht verknüpfbare Besuche sind als Messlücke ausgewiesen.

Kohorte: Journey-Start im gewählten Zeitraum; Auswertung bis zu einem festen Beobachtungshorizont H. Ein später eingegangenes Ereignis wird seinem ursprünglichen Projekt/Journey zugeordnet. Eine Momentaufnahme aktueller Statusbestände ist kein Funnel.

Der Handoff-Prüfdatensatz nutzt 01.01.-28.02.2026 mit H=180 Tagen und Stand 05.09.2026. Die Mengen lauten 10.000 / 1.200 / 720 / 360 / 252 / 126 / 90 / 45 / 18. Sie sind vollständig synthetisch. H=180 ist ein Testparameter, keine behauptete typische Projektdauer.

### 10.2 Reihenfolge und Qualification-Event

Ein Score kann schon vor der Einreichung berechnet werden. Für den Funnel gilt die Stufe qualifiziert erst, wenn Einreichung **und** gültige Vorqualifizierung vorliegen. Der daraus abgeleitete Funnel-Zeitpunkt ist das Maximum aus Einreichungszeit und Zeitpunkt der betreffenden Vorqualifizierung. Er wird als abgeleitetes Merkmal gespeichert; es wird kein gefälschter fachlicher Event erzeugt.

Eine Journey zählt pro Stufe höchstens einmal. Wiederholte Analyse, erneute Einreichung, Zurück-/Vor-Navigation und Webhook-Retries erhöhen die Menge nicht. Meilensteine gelten als erreicht, auch wenn ein Projekt später in eine Rückfrage zurückgeht. Ein vorhandener Vertrag bleibt historisch erreicht, auch bei einer späteren Vertragsstörung.

### 10.3 Formeln und Nicht-Erreicher

Stufenkonversion C_i = N_i / N_(i-1). Nicht-Erreicher D_i = N_i - N_(i+1). Anteil am Start = N_i / N_0. Nur bei gleichem Grain, gleicher Kohorte und gleichem Horizont vergleichen.

Nicht erreicht bedeutet nicht automatisch endgültig verloren. Ausweisen: noch offen / ausdrücklich ausgeschieden / innerhalb H nicht weitergekommen. Bei jungen Kohorten Hinweis Beobachtungsfenster noch offen. Kein endgültiger Drop-off aus Projekten, deren Prüfung noch läuft. Ein leerer Nenner ergibt Nicht berechenbar, nicht 0 %.

Im synthetischen Beispiel ist der größte absolute Abstand 8.800 zwischen messbaren Besuchen und gestarteten Checks. Im Partnerabschnitt sind von 252 qualifizierten Projekten 126 angenommen; die übrigen 126 bestehen im Beispiel aus 80 Ablehnungen und 46 offenen Entscheidungen. Diese 46 dürfen nicht als abgelehnt bezeichnet werden.

### 10.4 Drei gesonderte Projekt-Kennzahlen

Diese Quoten zählen Projekte, nicht Journeys. Im Beispiel hat jede relevante Journey genau ein Projekt, deshalb stimmen die Mengen zufällig überein. Im Produkt ist diese Gleichheit nicht vorauszusetzen.

| Kennzahl | Verbindlicher Nenner / Zähler | Beispiel | Ergänzende Offenlegung |
| --- | --- | --- | --- |
| Qualification Rate | Qualifizierte eingereichte Projekte / alle eingereichten Projekte derselben Kohorte | 252 / 360 = 70,0 % | Zahl noch nicht bewerteter und nicht qualifizierter Projekte zeigen |
| Partner Acceptance Rate | Erste positive Partnerentscheidung / erste positive oder negative Partnerentscheidung für zugewiesene Projekte | 126 / (126+80) = 61,2 % | 46 Entscheidungen offen; Entscheidungsabdeckung 206 / 252 = 81,7 % |
| Project Win Rate | Projekte mit Vertragsmeilenstein / Projekte mit Vertrag oder endgültiger Ablehnung vor Vertrag innerhalb derselben qualifizierten Projektkohorte | 45 / (45+80) = 36,0 % | 127 qualifizierte Projekte noch ohne terminales Vertragsresultat |

Der Zähler der Partner Acceptance Rate bleibt die erste Entscheidung, damit eine spätere Entwicklungsablehnung nicht die damalige Annahme rückwirkend löscht. Für Win Rate zählt das aktuelle effektive geschlossene Ergebnis bis zum Horizont; wiederaufgenommene Fälle sind offen, solange kein neuer Abschluss vorliegt. Administrative Dubletten/Rückzüge sind separat auszuweisen und nicht unbemerkt in technische Verlustquoten einzurechnen.

Zusätzlich möglich: eingereicht → Vertrag = 45 / 360 = 12,5 %, ausdrücklich Gesamt-Vertragskonversion genannt. Diese Kennzahl nicht ebenfalls Win Rate nennen. Keine Vermischung von je Partner entschiedenen Zuweisungen und global deduplizierten Projekten. In Multi-Tenant-Auswertungen trägt jede Kennzahl ihren Geltungsbereich.

## 11. Mobile als eigenständiger Zustand

| Oberfläche | Sofort sichtbar | Aufklappbar / nachgelagert |
| --- | --- | --- |
| Landingpage | Produktfrage, Adresseingabe, Standort prüfen, kurze Aussage zum Check | Große Karte, vertiefte Methodik, vollständige Score-Vorschau |
| Standortcheck | Aktuelle Frage, aktueller Wert, Unbekannt-Option, Quelle soweit nötig, Weiter/Zurück | Kontextkarte, Warum diese Angabe?, bisherige Fakten |
| Score | Gesamtwert oder ehrlicher Partial-State, Klasse, Vorläufigkeit, bestätigter Blocker, wichtigste fehlende Information, nächste Aktion | Alle neun Faktorregeln, volle Quellenhistorie, große Standortkarte |
| Partnerliste | Nächste Aktion, Projekt, Score, Ort und Status | Sekundärfilter, restliche Spalten, volle Akte |
| Interne Analysen | Aussage, Kohorte, wichtigste Werte und Nenner | Filter in Sheet, lange Detailtabellen, einzelne Reason-Projekte |

390 × 844 CSS-Pixel ist der primäre Portrait-Prüfzustand, zusätzlich 360 × 800. Karten bekommen einen Querformatzustand 844 × 390. Niemand muss das Gerät drehen, um eine Kernaufgabe zu erledigen.

Faktoraufschlüsselung: Name und Beitrag auf einer Zeile, gemeinsamer proportionaler Punktebalken darunter, Quellen-/Unsicherheitslabel in derselben Gruppe. Erst drei wichtigste Befunde, anschließend Alle Faktoren (9). In der geöffneten Gesamtliste bleiben alle neun Beiträge sichtbar, nur Regeltexte sind einzeln eingeklappt. Kein horizontaler Scroll für Faktorlabels.

Tap und Tastaturfokus ersetzen Hover. Kleine Markierungen haben mindestens 44 × 44 px Bedienfläche; Primäraktionen 48-56 px. Ein Sheet hat Übernehmen / Abbrechen / Zurücksetzen und führt anschließend zum betroffenen Diagramm zurück. Aktive Filter und Unsicherheit bleiben außerhalb des Sheets erkennbar.

Die Bildschirmtastatur darf die einzige Weiter-/Schließen-Aktion nicht verdecken. Die Visual-Viewport-Höhe bestimmt mobile Overlays; sichere Ränder werden berücksichtigt. Maps fangen normalen einhändigen Seitenscroll nicht ab. Verbindungsunterbrechungen behalten den letzten bekannten Stand mit sichtbarem Zeitstempel.

## 12. Darstellung, Accessibility und Performance

### 12.1 Farbrollen und Beschriftung

Atlas-Canvas #151B20; Surface #222B31; Text #F3F5F6; sekundär #B9C2C8; Amber #E9B64C. Amber ist Fokus/aktive Priorität, nicht universell Gefahr. Bestätigte kritische Befunde erhalten Text und ein zurückhaltendes Warnsymbol; neutrale Schraffur kennzeichnet fehlende/geschätzte Bereiche. Kein Verlauf als Größenlegende.

Direkte Labels vor Legenden. Punkte beginnen bei 0; Jahreswerte haben eine gemeinsame geeignete Einheit; Anteile nennen den Nenner. Für jede Figure existieren eine Textaussage und eine Datentabelle. Wesentliche Information ist ohne Farbe, Hover und Animation verfügbar. [W3C: zugängliche komplexe Bilder](https://www.w3.org/WAI/tutorials/images/complex/)

Zielwerte: mindestens 4,5:1 für normalen Text und 3:1 für große Schrift sowie wesentliche grafische Objekte/Control-Grenzen. Fokus ist sichtbar und wird nicht durch klebende Elemente verdeckt. Die größere Atlas-Touch-Zielgröße ist eine Produktvorgabe; WCAG 2.2 beschreibt Mindestgrößen und Ausnahmen gesondert. [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/)

### 12.2 Zustände und Aktualisierung

Alle relevanten Komponenten unterscheiden Initial Loading, echte leere Menge, fachliche Unbekanntheit, partielle Daten, Datenfehler, Abruffehler und veraltete Daten. Ein Refresh löscht den letzten gültigen Inhalt nicht. Der Zeitstempel bleibt neben der Aussage sichtbar.

Partnerdaten: initialer Snapshot, danach bedarfsweise und maximal alle 60 Sekunden bei sichtbarer Registerkarte aktualisieren; konkrete Aktualisierungsstrategie später an API anpassen. Kein Echtzeitstrom erforderlich. Keine automatische Neuordnung beim Lesen. Nach einer eigenen bestätigten Aktion darf die betroffene Zeile aktualisiert werden.

Analyse-Motion: Statuswechsel 150-200 ms, Ein-/Ausklappen 200 ms. Keine Score-Hochzählung und keine zufälligen Fortschrittswerte. Bei reduced motion sofortiger Zustandswechsel. Optionales Map-fit sofort bzw. höchstens 250 ms, niemals eine Kamerafahrt über die Erde.

### 12.3 Renderer und Kosten

- Score, Faktoren, Vollständigkeit, Pipeline, Rejections und Funnel: HTML/DOM und kleine SVG-Marken. Höchstens etwa 10-15 Faktoren/Gründe pro Ansicht; keine WebGL-Chartbibliothek.
- Karten: maximal eine aktive MapLibre-Instanz pro Akte; Vorschaubilder in Listen. Schweren Renderer erst beim Öffnen laden. Attribution bleibt erhalten.
- Partnerliste: 50 Zeilen pro Seite; serverseitige Filter bei größeren Datenmengen. Keine hunderten Karten-/Chartinstanzen in Tabellenzellen.
- Spätere Zeitreihen: SVG nur für verdichtete Ansichten; Datenraster und Aggregation bleiben offengelegt. Keine ungeprüften 15-Minuten-Jahreswerte ungefiltert rendern.
- URL-Zustand: Projekt-ID, Tab, gültige Filter, Sortierung, Kohorte und Horizont. Kein Freitext mit Kontaktdaten oder geheime Dokument-URLs in geteilten Links. Hover und ungefertigte Eingaben bleiben lokal.
- Rückwärtsnavigation stellt Auswahl und Filter wieder her. Ungültige Filter erhalten einen sichtbaren Fallback; keine stillschweigende Auswahl eines fremden Partners.

## 13. Was gebaut wird und was entfallen kann

| Priorität | Bauen | Bewusst nicht nötig |
| --- | --- | --- |
| MVP | Scorekopf, Faktorbeiträge, Befunde, Quellenlabels, Vollständigkeit | Donut, Tacho, Radar, Confidence-Orb |
| MVP | Standortkarte mit unabhängigen Konturen und ehrlichem Datenfallback | 3D-Gebäude, Globus, erfundene Solar-Heatmap |
| MVP | Jahreswerte und bedingter einfacher Vergleich | Sankey, fiktive Tageskurve, Autarkie-/Speicherprognose ohne Daten |
| MVP | Arbeitsliste, ausgewählte Akte, Statusfilter, nächste Aktion | Generische KPI-Kachelwand, Umsatz-/CO2-Widgets |
| MVP | Stufenübersicht mit Bestand, Alter und Aktionen | Elfspaltiges Kanban, dekorative Prozessanimation |
| MVP | Reason-Code-Erfassung und nachvollziehbare Entscheidungssnapshots | Automatisches Nachtrainieren oder Gewichtsänderung |
| Später intern | Rejection-Balken und Kohortenfilter | Pie-/Donut-Verteilung und doppelte Achsen |
| Später intern | Funnel-Tabelle und drei exakt definierte Projektquoten | Perspektivischer Trichter, irreführendes Addieren von Statusbeständen |
| Später bei Daten | Zeitliche Last-/Erzeugungsgegenüberstellung | Speicheroptimierung, Wirtschaftlichkeitsplanung oder Monitoring im MVP |

Für spätere Module werden Datenfelder und Events jetzt vorgesehen; ihre Oberfläche darf nicht als bereits live verfügbare Analyse ausgegeben werden.

## 14. Abnahme und operative Anschlussstellen

Der Handoff ist für die Implementierung der Oberfläche einschließlich aller Testzustände vollständig. Reale Modellgewichte/-regeln, Partnerkriterien, Geodatenquellen mit Rechten, fachliche Prüfungen, Tracking-Zulässigkeit und backendseitige Zugriffskontrolle sind produktive Anschlussstellen. Ein nicht angeschlossener Dienst aktiviert den spezifizierten Fallback und keine simulierte Erfolgsmeldung.

Abnahme: Alle neun Faktoren; Grenzfälle 49/50/64/65/79/80/100; fehlend versus 0; nicht anwendbar versus unbekannt; Spanne 70-85; Summen und Gewichte; gemischte Einheiten; veralteter Score; Quellenwechsel; alle elf Status; Teilantwort; Wiederaufnahme; duplizierte Events; null Nenner; offene Kohorten; unterschiedliche Partner; Mobile ohne Hover und mit Tastatur; sichtbare statische Datenäquivalente. Die vollständigen Komponentenverträge stehen in COMPONENT-CONTRACTS.md.


---

# FILE: COMPONENT-CONTRACTS.md
# Project Gateway · Analytics Component Contracts

Version 1.0 · 05.09.2026 · Ergänzung zu Atlas / Variante 1

Dieser Vertrag definiert Verhalten und Datenbedeutung. Bestehende Atlas-Shell, Typografie und Bildsprache bleiben verbindlich. Maße sind CSS-Pixel für die spätere Anwendung, keine aus den generierten Tafeln zu messenden Pixel. SVGs im Paket sind maßhaltige Datenreferenzen; die generierte Tafel ist ausschließlich eine Kompositionsreferenz.

## Gemeinsamer Vertrag

- Leseweg: Aussage → wesentliche Werte → Quelle/Unsicherheit → nächste Handlung → vertiefende Details. Informationen zur Verlässlichkeit stehen beim Wert.
- `initialLoading`: Layout reservieren, Text „Daten werden geladen“, keine Beispielwerte. `refreshing`: gültigen letzten Stand erhalten. `empty`: fachlich keine Datensätze; `unknown`: konkreter Sachverhalt unbekannt. `error`: Abruf-/Validierungsfehler; `stale`: veralteter Stand mit Zeitstempel. Diese Zustände sind nicht austauschbar.
- Alle Aktionen haben Idle, Pending, Success und Error. Mutierende Aktionen sind während Pending gegen Doppelauslösung gesperrt, die UI zeigt den konkreten Vorgang. Bei Fehler bleiben Eingaben erhalten. Keine optimistischen Partnerentscheidungen ohne Serverbestätigung.
- Jeder Visualisierung entsprechen sichtbare Direktlabels, eine kurze Textaussage und eine aufrufbare semantische Datentabelle. Essenzielle Werte sind keine Tooltips. SVG-Dekorationen sind für Assistenztechnik ausgeblendet, wenn HTML bereits dieselben Daten erklärt.
- Interaktive Ziele mindestens 44 × 44, Primäraktionen 48–56 hoch. Sichtbarer Fokus mit Abstand. Aktive Auswahl besitzt zusätzlich zu Farbe Rahmen und Text. Kein Element verlangt Hover, Drag, Pinch oder Farbsehen.
- Motion: 150–200 ms für Zustandswechsel, 200 ms für Details; reduced motion = sofort. Kein Score-Count-up, keine Fake-Analyse, keine unaufgeforderte Kartebewegung.
- Keine Datenquelle angeschlossen: expliziter Fallback. Keine generierten Fotodaten als reale Analyse, keine automatisch behauptete Dokumenten-/Statikprüfung.
- Quelle und Stand bleiben in PDF/CSV-Exporten erhalten. Aktive Filter, Tenant, Kohorte, Nenner und Modellversion gehören zur exportierten Aussage.

## V01 · ScoreSummary

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | Projektpriorität mit Grenzen verstehen: „Wie ist dieses Projekt eingeordnet und kann ich der Einordnung folgen?“ |
| Visualisierungstyp | Große Integer-Zahl, ausgeschriebene Klasse, gerade 0–100-Skala mit Marken 50/65/80; optional, wenn Platz sinnvoll genutzt wird. |
| Daten | `score.state`, `displayScore`, `class`, `modelVersion`, `calculatedAt`, `inputVersion`, `bounds`, `estimatedFactorCount`, `blockers`. |
| Hierarchie | Zahl/Klasse → Vorläufigkeit bzw. fehlende Gesamtbewertung → bestätigter Blocker → nächster Schritt. |
| Desktop | Zahl 88–104 px; Textspalte mindestens 360 breit. Karte als benachbarte Standortinformation, nicht als Score-Hintergrund. |
| Mobile | Zahl 72–88 px; Klasse in eigener Zeile. Datenbasis, Blocker und wichtigste Folgeaktion vor langer Faktor-/Kartenansicht. Bei 200 % Textzoom darf der Kopf wachsen. |
| Interaktion | „Bewertung erklären“ öffnet V02; „Angaben ergänzen“ führt zum konkreten Feld. Klasse ist keine anklickbare Freigabe. |
| Empty | NOT_READY: „Noch nicht bewertbar“ und benötigte Basisangaben; kein 0/100. |
| Loading | SCORING nur bei tatsächlichem Bewertungsauftrag. Letzten Score bei Re-Scoring mit „veraltet“ zeigen; keine hochzählende Zahl. |
| Error | „Bewertung derzeit nicht verfügbar“, erneut versuchen; bekannte Eingaben bleiben. Ungültige Summe/Range ist Datenfehler. |
| Unsicherheit | ESTIMATED: „Vorläufig · enthält Schätzwerte“. PARTIAL: „Noch kein Gesamtscore“, Spanne 70–85, fehlender Faktor benannt; kein Klassenbadge. |
| Accessibility | Klarer Satz, z. B. „82 von 100 Punkten. Hohe Priorität. Vorläufige Bewertung.“ Skala rein ergänzend. Kein progressbar-Rollenmissbrauch für eine Bewertung. |
| Komponente | `ScoreSummary` + `ScoreScale` als DOM/kleines SVG, `ScoreStateNotice`, `BlockingFinding`. Keine Gauge-Bibliothek. |

## V02 · ScoreFactorBreakdown

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Welche Beiträge ergeben zusammen die Bewertung?“ |
| Visualisierungstyp | Neun horizontale Punktbeiträge, gemeinsame Nullachse; dünner Maximalrahmen pro Faktor. |
| Daten | Faktor-ID, Name, Beitrag, Maximalgewicht, Anwendbarkeit, Basiszustand, Quellen-IDs, Regel-ID/-Version, Erklärung, Ergänzungsaktion. |
| Hierarchie | Faktorname + Beitrag/Maximum → proportionaler Balken → Quelle/Unsicherheit → Regeltext. Summe im Fuß. |
| Desktop | Etwa 200 px Label, flexibel mindestens 200 px Balken, 92 px Zahlen; Detailbereich unter betroffener Zeile. Maximalachse = größtes Faktor-Maximum. |
| Mobile | Name/Wert auf einer Zeile, Balken darunter. Alle neun Zeilen vertikal lesbar; lange Namen umbrechen. Nur Erklärungstexte einzeln klappbar. |
| Interaktion | Zeilenbutton mit `aria-expanded` öffnet Regel, Eingabewert, Datum, Quelle und passende Ergänzung. Reihenfolge bleibt stabil. |
| Empty | Nicht anwendbar: „Nicht relevant“, kein Balken. Maximalgewicht 0: „Nicht gewichtet“, kein 0/0-Balken und kein Beitrag zur Score-Abdeckung. Unbekannter aktiv gewichteter Faktor: leer schraffierter Maximalrahmen und „Noch unbekannt“. |
| Loading | Beim ersten Abruf nur Zeilenstruktur. Beim Nachladen alte Regeln sichtbar als veraltet kennzeichnen. |
| Error | Fehlerhafte Faktorwerte nicht zeichnen. Gesamtscore erhält ERROR, sofern die Summe nicht verifizierbar ist. Einzelne ausgefallene Quellen bleiben mit Quellenfehler sichtbar. |
| Unsicherheit | Geschätzte Beiträge mit Textlabel und abgesetzter/gestrichelter Kante. Beitragsspannen als Intervall, nicht als scheinpräziser Mittelpunkt. |
| Accessibility | Native Tabelle bzw. Liste mit Text „13 von maximal 15 Punkten“; Balken redundant. Keyboard bedient Detailbuttons, nicht jeden dekorativen SVG-Pfad. |
| Komponente | `ScoreFactorList`, `FactorContribution`, `FactorRuleDisclosure`, `EvidenceValue`. Kleine SVG-/DOM-Marken, keine gleich breiten 100-%-Tracks. |

## V03 · FindingsAndNextActions

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Was spricht dafür, was ist kritisch, was kann ich ergänzen?“ |
| Visualisierungstyp | Drei priorisierte Textgruppen: Dafür spricht / Zu klären / Angaben ergänzen. |
| Daten | Befund-ID, Typ POSITIVE/UNRESOLVED/CONFIRMED_RISK/MISSING, Schwere, Blocker-Flag, Quelle, regelbasierter Text, Zielaktion, Zuständiger. |
| Hierarchie | Bestätigter Blocker zuerst; danach bis zu zwei wichtigste Einträge je Gruppe. Keine Liste gleichgewichtiger Statuschips. |
| Desktop | Unter Score oder in Entscheidungsrail; Länge nach inhaltlicher Dringlichkeit, nicht drei identische Kacheln. |
| Mobile | Blocker und wichtigste fehlende Angabe sichtbar; „Weitere 3 Hinweise“ öffnet Rest. Überschriften und Anzahl bleiben. |
| Interaktion | Direkter Link zu Eingabe, Upload oder fachlicher Prüfung. Keine suggerierten garantierten Bonuspunkte. |
| Empty | „Keine bestätigten Risiken dokumentiert“ mit Abgrenzung „Offene Prüfungen siehe unten“; nicht „risikofrei“. |
| Loading | Befunde werden abgeglichen; bei Refresh letzte Befunde mit Stand erhalten. |
| Error | „Hinweise derzeit nicht vollständig verfügbar“; bestehende Blocker nicht entfernen. |
| Unsicherheit | Offene Statik/Netzsituation ist UNRESOLVED, keine bestätigte Untauglichkeit. Quelle und fachlicher Stand sichtbar. |
| Accessibility | Text + Icon + ggf. Rahmen. Keine Farbe als einzige Bedeutung. Fokus nach Ergänzung zur betroffenen Meldung. |
| Komponente | `ProjectFindings`, `FindingRow`, `MissingEvidenceAction`. |

## V04 · EvidenceValue / ProvenanceDisclosure

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Woher stammt dieser Wert und wie belastbar ist er?“ |
| Visualisierungstyp | Wert, Einheit, Bezugszeit und kurze Herkunfts-/Unsicherheitszeile; Quellenblatt bei Bedarf. |
| Daten | Wert oder null, Einheit, Zeitraum, Herkunft, Messcharakter, Intervalle, Methode, Quellenreferenz, Datenstand, Konflikt-/Abrufzustand. |
| Hierarchie | Wert → Einheit/Zeitraum → „Vom Nutzer angegeben · geschätzt“ → vollständige Metadaten. |
| Desktop | Quellenbutton unmittelbar am Wert. Quellenblatt als Side Panel; ursprüngliche Kennzahl bleibt im Kontext. |
| Mobile | Quellenlabel unter Wert, Tap öffnet Sheet mit Schlussbutton und Fokus-Rückgabe. Kein abgeschnittenes essenzielles Quellenlabel. |
| Interaktion | Quelle öffnen, berechtigte Nutzerangabe bearbeiten, widersprüchliche Werte fachlich auswählen; alle Änderungen versionieren. |
| Empty | „Noch unbekannt“ mit Ergänzungsaktion. Bestätigte 0 separat als „0 MWh · keine Eigenerzeugung angegeben“. Nicht anwendbar ausdrücklich benennen. |
| Loading | „Quelle wird geladen“; zuletzt bestätigte Quelle bleibt bestehen. |
| Error | Abruffehler separat vom fachlichen Wert; „Quelle nicht erreichbar · letzter Stand …“. Ohne bekannten Stand kein erfundener Wert. |
| Unsicherheit | Ursprung und Schätzung sind zwei Achsen; Intervalle mit Bedeutung und Methode. Konflikt nicht automatisch mitteln. |
| Accessibility | Quellenlabel als Text; Dialog beschriftet, Fokus begrenzt und nach Schließen zurückgegeben. Kopieren nur nicht sensible Metadaten. |
| Komponente | `EvidenceValue`, `ProvenanceLabel`, `SourceSheet`, `DataConflictNotice`. |

## V05 · SiteEvidenceMap

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Ist das richtige Gebäude erfasst, und welche Fläche ist gemeint?“ |
| Visualisierungstyp | 2D-Karte/Luftbild mit getrennten Vektorebenen für Gebäude, Projekt-/Nutzfläche, Ausschlüsse, belegten Bestand. |
| Daten | Bestätigte Adresse, lng/lat, Geometrie+CRS, Quellen-/Lizenzdaten, Aufnahmezeit, geometrische Flächenart, ausgewählte Feature-ID, verfügbare Layer. |
| Hierarchie | Objektidentität → Gebäudekontur und Projektfläche → zugehörige Größe/Quelle → ergänzende Potenzialangaben. |
| Desktop | 440–560 px hoch im Standortabschnitt; zugeordnete Datenspalte mindestens 280 px. Keine datenlosen großflächigen Satellitenhintergründe. |
| Mobile | 220–260 px passive Vorschau, Button „Karte öffnen“. Vollbild mit Zoom-/Fit-Knöpfen. Querformat 844 × 390: Karte + etwa 280 px Datenpanel, bedienbar ohne Drehen. |
| Interaktion | Gebäude auswählen, Ebene umschalten, Fit, Plus/Minus, Standort bestätigen. Karte/Objektliste sind gekoppelt. Kein ungewolltes Scroll-Trapping. |
| Empty | Adresse vorhanden, Geodaten fehlen: Objektfakten und „Kartendaten nicht verfügbar“. Mehrdeutige Adresse: Kandidatenliste, kein still gewählter Standort. |
| Loading | Adresse/Fakten zuerst; Kartenskelett „Kartenausschnitt wird geladen“. Gebäudeerkennung nur bei echtem bestätigtem Dienstereignis. |
| Error | Lizenzierter statischer Ausschnitt falls verfügbar; sonst Adress-/Objektliste mit Retry. Keine andere Immobilie als Ersatz. |
| Unsicherheit | Aufnahmedatum, unbestätigte Kontur, nur geschätzte Größe und Datensatzauflösung sichtbar. Nutzfläche nicht automatisch gleich Gebäudegrundriss. |
| Accessibility | Gleichwertige Objektauswahl per Liste; Zoom/Fit/Layer mit Tastatur. Karte hat sprechenden Namen und Textalternative. Attribution bleibt lesbar. |
| Komponente | `SiteEvidenceMap` mit MapLibre GL JS, `MapLayerControl`, `SiteFacts`, `BuildingCandidateList`; höchstens eine aktive Instanz. |

## V06 · EnergyProfile

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Welche energetischen Größenordnungen sind belegt und was fehlt für Eigenverbrauch/Speicher?“ |
| Visualisierungstyp | Drei Jahreswerte; bei vergleichbarem Zeitraum horizontale Nullachsen-Balken und ein ausdrücklich beschriftetes Potenzialintervall. |
| Daten | Verbrauch, jährliche Eigenerzeugung, zusätzliches Jahrespotenzial mit Zeitbezug/Quellen; PV-Leistung separat; Status und Datenanforderungen für Selbstverbrauch/Speicher. |
| Hierarchie | Verbrauch → Bestand → zusätzliches Potenzial → Grenzen der Aussage → Lastgang/Profil ergänzen. |
| Desktop | 640–840 px breite Vergleichsfläche; Einheiten links im Achsentitel, direkte Werte rechts an Zeilen. Keine gestapelte Energiebilanz. |
| Mobile | Name + Wert + Quelle, darunter proportionaler Balken; gemeinsame Nullachse und gleiche Skalierung. Ein Einzelwert erhält keinen leeren Vergleichschart. |
| Interaktion | Quelle öffnen, Bezugszeit wählen, vorhandene Messdatei ergänzen. Bei ungleichen Zeiträumen erst Faktenliste, kein direkter Vergleich. |
| Empty | Offene Zeile „Eigenerzeugung noch unbekannt“. Verlässlich keine PV ≠ automatisch sämtliche Eigenerzeugung 0; andere Quellen berücksichtigen. |
| Loading | Bekannte Jahreswerte erhalten; Profilprüfung nur bei echtem Job. Keine generierte Tageskurve. |
| Error | Teilweise Daten weiterhin zeigen; unpassende Einheit/Zeiträume markiert, Vergleich unterdrücken. |
| Unsicherheit | Intervall-Enden direkt beschriftet, „geschätzt“ und Methode. Keine Speichergröße oder Eigenverbrauchsquote allein aus Jahreswerten. |
| Accessibility | HTML-Datentabelle, alle Werte/Spannen ohne Hover. Schätzung nicht ausschließlich gestrichelt kodieren. |
| Komponente | `EnergyProfile`, `AnnualEnergyComparison`, `EstimateRange`, `EnergyReadinessNotice`. Spätere Zeitreihe ist separate Erweiterung. |

## V07 · PriorityWorkQueue

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Welches Projekt soll ich jetzt ansehen oder bearbeiten?“ |
| Visualisierungstyp | Priorisierte Projektliste mit explizitem Arbeitsauftrag, daneben ausgewählte Projektakte. Optional vollständige Tabelle. |
| Daten | Projekt-/Assignment-ID, Tenant, Scorezustand, Ort, Projektart, Gebäudetyp, Größe+Einheit, Vollständigkeit, Status, nächste Aktion, Fälligkeit, Zuständiger, letzte Aktion. |
| Hierarchie | Schmale Aufgabenzeile → Ansichten/Filter → nächste Aktion je Projekt → entscheidungsrelevante Fakten. Keine KPI-Kartenwand. |
| Desktop | ≥1200 px: Liste 460–520 px, Akte flexibel mindestens 520 px; 24 px Gutter. Zeilen etwa 112–132 px. Tabellenmodus stellt bis 10 bewusst gewählte Spalten dar. |
| Mobile | Aufgabenzeile + Listenzeilen; Tap öffnet eigenständige Akte. Keine zusammengeschobene Split View. Filter als Sheet; Auswahl und Scrollposition bei Zurück wiederherstellen. |
| Interaktion | Ansicht, Suche, Filter, Sortierung, Projekt auswählen. Keine Statusänderung durch Lesen. Aktualisieren verändert Reihenfolge nur bewusst. |
| Empty | Kein Bestand: „Noch keine eingereichten Projekte“. Filter leer: aktive Filter + „Filter zurücksetzen“. Kein erfundener Demodatensatz. |
| Loading | Erste Liste mit reservierter Höhe; Refresh hält Liste/Selektion. Partnerwechsel entfernt alten berechtigten Kontext, bevor neuer geladen wird. |
| Error | Erneut laden, letzter Stand sichtbar sofern noch im selben erlaubten Kontext. Unberechtigte Akte weder kurz zeigen noch im Cache weiterreichen. |
| Unsicherheit | Größe mit Quelle/Intervall; Score PARTIAL/STALE direkt. Fehlende Fälligkeit erzeugt keine Überfälligkeit. Datenvollständigkeit ist keine Priorität. |
| Accessibility | Echte Linkziele für Akten; Filterlabels; Sortierrichtung bei Tabelle; Status als Text. Tastatur bedient dieselbe Projektmenge. |
| Komponente | `PartnerWorkspace`, `PriorityWorkQueue`, `ProjectQueueRow`, `ProjectTable`, `WorkQueueFilters`, `UpdateNotice`. 50 Zeilen pro Seite. |

## V08 · PipelineOverview

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Wo liegen Projekte und wo warten tatsächlich Aufgaben zu lange?“ |
| Visualisierungstyp | Geordnete Stufentabelle: Bestand mit gemeinsam skaliertem horizontalem Balken, offene Aktionen, überfällig, Median bisheriger Aufenthaltsdauer. REJECTED separat. |
| Daten | As-of-Snapshot, Projektanzahl je Status, offene/überfällige Aktionen, aktuelle Status-Eintrittszeiten, Anzahl Fälle mit bekannter Fälligkeit, Scope/Tenant. |
| Hierarchie | Engpassaussage → Stufenfolge → Bestand/Alter/Fälligkeit → gefilterte Einzelprojekte. |
| Desktop | Zeilen 56–64 px; vier Gruppen mit Trennlinien. Mengenachse ab 0, kein perspektivischer Trichter. |
| Mobile | Stufenname/Bestand auf erster Zeile, Alter und Aufgaben darunter; gleiche Stufenreihenfolge. Terminale Abschlüsse nach aktiven Stufen. |
| Interaktion | Bestand öffnet Projekte dieses Status; Überfällig öffnet genau überfällige Aktionen. Gruppen klappbar, aktive Engpasszeile sichtbar. |
| Empty | Alle Status mit 0 bzw. „Noch keine Projekte“. Alter bei leerer Menge „— · keine Fälle“, nicht 0 Tage. |
| Loading | Snapshotdatum sichtbar; paralleles Laden einzelner Stufen nicht als 0 ausgeben. |
| Error | Unvollständiger Snapshot als partiell markieren; keine Gesamtsumme aus fehlenden Stufen. |
| Unsicherheit | Median ist Alter aktueller Fälle, keine abgeschlossene Durchlaufzeit. Fehlende Fristen = unbekannter SLA-Stand. Terminale Fälle ohne wachsende Liegezeit. |
| Accessibility | Native Tabelle mit eindeutigen Spaltennamen und Textaussage. Aktiv-/Abschlussgruppen mit Überschrift, Balken redundant. |
| Komponente | `PipelineOverview`, `PipelineStageRow`, `ActionAgeSummary`. Zählung nach `projectId` innerhalb Scope, nicht nach Events. |

## V09 · ProjectDossier

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Habe ich eine belastbare Grundlage für die nächste fachliche Entscheidung?“ |
| Visualisierungstyp | Zusammenhängende Objektakte mit Entscheidungszusammenfassung und geordneten Evidenzabschnitten. |
| Daten | Berechtigtes Projekt, alle Evidence-Referenzen, Scoreversion, Dokumente, Status, Verlauf, offene Aufgaben, Partnerassignment. |
| Hierarchie | Identität/Status/Score/nächste Aktion → Blocker/Lücken → Standort → Energie → Score-Details → Dokumente → Verlauf. |
| Desktop | Header 96–128 px; 12-Spalten-Inhalt. Hauptbereich 8, Entscheidungsrail 4 Spalten. Tabs verankern Aktenabschnitte; eine aktive Karte. |
| Mobile | Header und Aktion zuerst; Aktenbereiche als vertikale Abschnittslinks. Entscheidungssheet über Button, nicht sechs schmale Tabs. |
| Interaktion | Abschnitte, Quellen, Dokumentvorschau, fachliche Ergänzung und V10-Entscheidung. Verlinkte Akten-ID/Tab in URL, sensible Dateilinks nicht. |
| Empty | Einzelne Abschnitte zeigen konkreten Datenbedarf. Kein generischer „Keine Daten“-Gesamtbildschirm für ein teilweise gefülltes Projekt. |
| Loading | Identität/Status zuerst, Sektionen unabhängig. Keine Fremdprojektinhalte beim Wechsel. |
| Error | Fehlende Sektion separat mit Retry; Partnerentscheidung blockieren, wenn entscheidungsnotwendiger Stand fehlt. |
| Unsicherheit | Nachweis versus Eingabe, Schätzung versus Prüfung, Dateiverfügbarkeit versus fachliche Freigabe bleiben getrennt. |
| Accessibility | Logische Heading-Hierarchie, Skip Links zur Akte und Entscheidung, sichtbarer Fokus, Dokumente als Links mit Typ/Größe. |
| Komponente | `ProjectDossier`, `DossierHeader`, `DossierSectionNav`, `DocumentEvidenceList`, zusammengesetzte V01–V06/V10/V14/V15. |

## V10 · PartnerDecisionPanel

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Übernehmen, Rückfrage stellen oder begründet ablehnen?“ |
| Visualisierungstyp | Ein priorisiertes Aktionspanel mit drei klaren Aktionen; strukturierte Dialoge statt Symbolmenü. |
| Daten | Aktueller Status+Revision, erlaubte Aktionen, Rolle/Tenant, Aufgaben, Reason-Code-Katalogversion, Entscheidungsbegründung, erwartete neue Revision. |
| Hierarchie | Nächste sinnvolle Aktion primär; Alternativen sichtbar. Ablehnen besitzt eine ruhige kritische Text-/Rahmenbehandlung, nicht den Amber-Primärstil. |
| Desktop | Rail 300–360 px oder Zeile im Header; Dialog 560–640 px, mit unverwechselbarer Projektidentität. |
| Mobile | „Entscheidung“ öffnet Sheet; Aktionen und Gründe im eigenen vertikalen Flow. Bestätigungsbutton bleibt über Tastatur erreichbar. |
| Interaktion | Übernehmen: bewusste Bestätigung. Rückfrage: benötigte Felder/Dokumente, Nachricht und optional echte Fälligkeit. Ablehnen: genau ein Primärgrund, optional höchstens drei Zusatzgründe, Einschätzungsstand; OTHER verlangt Text. |
| Empty | Noch keine erlaubte Entscheidung: Grund und nächste Voraussetzung zeigen. Kein deaktivierter Button ohne Erklärung. |
| Loading | „Entscheidung wird gespeichert“; Submit gesperrt; idempotente Request-ID. Rückfrage erst als versandt markieren, wenn tatsächlicher Versand bestätigt ist. |
| Error | Eingaben behalten; 409-Konflikt zeigt neuen Projektstand und fordert erneute bewusste Entscheidung. Kein stilles Überschreiben. |
| Unsicherheit | Ablehnungsgrund zwischen bestätigt und nicht hinreichend klärbar unterscheiden. Unbekannte Statik nicht als bestätigte statische Untauglichkeit speichern. |
| Accessibility | Dialogtitel, Fokusmanagement, Fehler am Feld, Fehlersummary, native Radios/Select. Erfolg einmal dezent angekündigt. |
| Komponente | `PartnerDecisionPanel`, `AcceptProjectDialog`, `RequestInformationDialog`, `RejectProjectDialog`, `DecisionConflictNotice`. |

## V11 · RejectionInsights · später intern

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Welche dokumentierten Gründe erklären Ablehnungen in dieser Vergleichsgruppe?“ |
| Visualisierungstyp | Absteigend sortierte horizontale Häufigkeitsbalken mit n und Anteil; primäre Gründe additiv, sekundäre separat. |
| Daten | Unveränderliche Entscheidungssnapshots, Primär-/Zusatzgründe, Zeitpunkt, Partner, Region, Projektklasse, damaliger Score/Modellstand, Evidenzsicherheit; explizite Ausschlüsse. |
| Hierarchie | Kohorte/Scope/Nenner → größter dokumentierter Grund → Gründe-Ranking → einzelne Fälle. |
| Desktop | 11–14 Zeilen, etwa 40–48 px je Zeile; Filter darüber. Optional Vergleich zweier Kohorten als getrennte Panels mit eigenen Nennern. |
| Mobile | Name, n/Anteil, Balken in vertikalen Zeilen; Filter im Sheet. Keine Side-by-side-Tabelle mit winziger Schrift. |
| Interaktion | Grund öffnet berechtigte abgelehnte Projekte. Toggle Primärgründe/Zusatzgründe ändert Titel und Nennererklärung. Modell-/Partnerfilter sichtbar. |
| Empty | „Keine Ablehnungen in dieser Auswahl“, kein 0-%-Ranking. Unbekannter Legacy-Grund eigene Kategorie, nicht OTHER umcodieren. |
| Loading | Letzte gültige Kohorte erhalten, Filter bis Ergebnis als ausstehend kennzeichnen. |
| Error | Analyse nicht verfügbar; letzte Werte mit Stand. Partielle Partnerdaten nicht zu Gesamtnenner erklären. |
| Unsicherheit | Kleine Fallzahl sichtbar (Produktflag n<30 als Lesehilfe, keine statistische Signifikanzgrenze). Fehlende Gründe und selektierte Partnerstichprobe ausdrücklich nennen. Keine Kausal-/Lernbehauptung. |
| Accessibility | Direkte Zahlen und Tabelle. Keine reine Farbzuordnung für Gründe; sortierte Liste mit lesbaren Bezeichnungen. |
| Komponente | `RejectionInsights`, `ReasonFrequencyChart`, `AnalyticsCohortControls`, `RejectionCaseTable`. |

## V12 · CohortFunnel · später intern

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Wie weit kommen dieselben messbaren Journeys innerhalb eines festgelegten Horizonts?“ |
| Visualisierungstyp | Geordnete Tabelle mit neun Stufen, absolutem n, Nullachsen-Mengenbalken, Konversion aus Vorstufe und Nicht-Erreichern zur Folgestufe. |
| Daten | Journey-Kohorte, primäres Projekt, Stage-Reach-Timestamps, deduplizierte Meilensteine, Tracking-Abdeckung, H180 oder anderer Horizont, Reifestatus, offene/geschlossene Fälle. |
| Hierarchie | Kohorte/Horizont/Messlücken → Stage-Zahlen → Übergangskonversion → größte Nicht-Erreichung. |
| Desktop | Menge und Stufenkonversion getrennte Spalten. Große Besuchszahl darf nachfolgende Mengenbalken klein machen; Direktwerte erhalten Präzision. Keine verborgene Log-Skalierung. |
| Mobile | Je Stufe n, „x % der Vorstufe“ und Status der Noch-nicht-Erreicher untereinander. Balken ergänzend. Kohorte/Horizont nicht im Filter verstecken. |
| Interaktion | Stufe/Übergang öffnet zugehörige Journeys; Zeitraum/Kohorte und Horizont getrennt ändern. Vergleich nur gleicher Definitionen. |
| Empty | Keine messbaren Journeys; Nenner 0 => Rate unbekannt/„—“, nicht 0 %. |
| Loading | Auswertungsstand und angefragte Kohorte sichtbar; kein Mischen alter und neuer Zeilen. |
| Error | Nicht monotone Stage-Zahlen im gewählten Grain: Validierungsfehler statt willkürlich korrigierter Balken. Attributionslücken separat berichten. |
| Unsicherheit | „Noch nicht erreicht“ ist kein endgültiger Verlust; unreife Kohorten und laufende Fälle markieren. Besucher hier messbare Besuche, keine eindeutigen Menschen. |
| Accessibility | Vollständige Tabelle mit Nennern und Text zum größten Übergang. SVG rein redundant. Keine konische Flächenmetapher nötig. |
| Komponente | `CohortFunnelTable`, `StageReachBar`, `CohortMaturityNotice`, `AttributionCoverage`. |

## V13 · BusinessRateSummary · später intern

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Wie häufig qualifizieren, akzeptieren und gewinnen wir – bezogen auf welche Fälle?“ |
| Visualisierungstyp | Drei beschriftete Kennzahlzeilen mit Bruch, Rate und offenen Fällen; keine drei dominanten KPI-Karten. |
| Daten | Qualified/submitted; first accepted/(first accepted+first rejected); contracted/(contracted+effective pre-contract lost); Scope, Kohorte, Horizont, offene Fälle. |
| Hierarchie | Kennzahlname → Anteil → Zähler/Nenner → Definition und offene Fälle. |
| Desktop | Zusammenhängender Kennzahlenblock unter Funnel oder im Methodikabschnitt; gleiche Text-/Zahlenfluchten. |
| Mobile | Drei vertikale Zeilen, jeder Nenner ausgeschrieben. Definitionsdetails klappbar, Nenner selbst immer sichtbar. |
| Interaktion | „Definition“ und „Fälle ansehen“. Keine umbenannten Gesamt-Konversionen unter denselben KPI-Namen. |
| Empty | Nenner 0: „Noch keine entschiedenen Fälle“; Rate null. |
| Loading | Ganzer Berechnungs-Snapshot gemeinsam; keine zueinander veralteten Zähler/Nenner. |
| Error | Zähler größer als Nenner bzw. unpassende Kohorte: Datenfehler. Keine Begrenzung auf 100 %, die Fehler verdeckt. |
| Unsicherheit | Offene Fälle und Entscheidungsabdeckung zeigen; kleine Gruppen kennzeichnen. Partner-Assignments nicht mit globalen Projekten mischen. |
| Accessibility | Sprechende Brüche, z. B. „126 von 206 Erstentscheidungen, 61,2 Prozent“. Keine Mini-Pies. |
| Komponente | `BusinessRateSummary`, `DefinedRateRow`, `MetricDefinitionDisclosure`. |

## V14 · ProjectHistory

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Was hat sich geändert, durch wen, und auf welcher Datenbasis wurde entschieden?“ |
| Visualisierungstyp | Vertikale chronologische Ereignisliste mit expliziten Statuswechseln und Kommentaren. |
| Daten | Unveränderliche Events mit ID, Zeitpunkt/Zeitzone, Akteur, Aktion, vorher/nachher, Input-/Scoreversion, Reason-Snapshot, Kommentar-Sichtbarkeit. |
| Hierarchie | Letzte fachliche Aktion zuerst; Statuswechsel mit Vorher/Nachher; Quellen-/Revisionsdetails nachgelagert. |
| Desktop | Eine Zeitachse, keine parallelen Swimlanes. Filter Alle/Entscheidungen/Daten/Kommentare. |
| Mobile | Kurze Gruppen nach Tag; Zeit und Akteur umbrechen. Ereignisdetails per Disclosure. |
| Interaktion | Ereignis öffnen, zu damaligem Score-Snapshot wechseln, berechtigten Kommentar verfassen. Interne Notiz und Nachricht an Kontakt klar getrennt. |
| Empty | „Noch keine fachlichen Aktivitäten“; Erfassungsevent kann trotzdem sichtbar sein. |
| Loading | Neuere Events nachladen ohne Leserposition zu verschieben. |
| Error | „Verlauf unvollständig geladen“ mit Retry; keine falsche Behauptung, es habe keine Entscheidung gegeben. |
| Unsicherheit | Unbekannte historische Akteure/Zeiten als solche; keine rekonstruierten Events ohne Herkunft. |
| Accessibility | Geordnete Liste, ausgeschriebene Aktionen, lokale Zeit plus eindeutiger Zeitbezug. Tastatur bedient Filter und Details. |
| Komponente | `ProjectHistory`, `HistoryEventRow`, `DecisionSnapshot`, `CommentComposer`. |

## V15 · CompletenessIndicator

| Eigenschaft | Verbindliche Definition |
| --- | --- |
| Zweck / Nutzerfrage | „Welche aktuell benötigten Angaben oder Unterlagen fehlen noch?“ |
| Visualisierungstyp | Zähler „16 von 20 benötigten Angaben“, optional dünner gerader Balken. Dokumente separat 2 von 3. |
| Daten | Requirement-Profil/-Version, erforderliche anwendbare Feld-IDs, vorhandene fachliche Werte, explizit unbekannte Werte, Dokumentkategorien und verfügbare Dateien. |
| Hierarchie | Vorhanden/benötigt → fehlende Items → Ergänzungsaktion. Score-Faktorabdeckung separat im Score-Bereich. |
| Desktop | Kompakte Zeile in Liste/Akte, detaillierte Checkliste auf Abruf. |
| Mobile | Zähler und wichtigste Lücke direkt unter Ergebnis; Tap öffnet Liste mit direkten Feld-/Uploadlinks. |
| Interaktion | Zu fehlendem Feld springen; Anforderungen bei Profilwechsel neu berechnen und Änderung erklären. |
| Empty | Keine anwendbaren Anforderungen: „Keine Angaben erforderlich“, keine Division durch 0. Profil unbekannt: „Anforderungen noch nicht bestimmt“. |
| Loading | „Anforderungen werden ermittelt“, nicht 0 %. |
| Error | Requirement-Dienstfehler separat; letzte versionierte Anforderungen sichtbar als veraltet. |
| Unsicherheit | Beantwortete Frage mit „unbekannt“ zählt als bearbeitet, nicht als vorhandener Fachwert. Datei vorhanden ≠ fachlich geprüft. |
| Accessibility | Bruch als Klartext; Checkliste nutzt Textstatus und native Links. Farbe allein zeigt keinen Erfüllungsgrad. |
| Komponente | `CompletenessIndicator`, `MissingRequirementsList`, `DocumentRequirementStatus`. |

## Seitenintegration und responsive Regeln

| Route / Oberfläche | Zusammensetzung | Verbindliches Verhalten |
| --- | --- | --- |
| `/` | Bestehende Atlas-Landingpage, Adresse; kleine V01/V02-Vorschau | Nur gekennzeichnete Beispieldaten. Mobile Adresse und Startaktion vor Detailvisualisierung. |
| `/standortcheck/:draftId/:step` | Bestehender Analyseflow + V04/V05/V15 nach Bedarf | Eine Hauptfrage. Kontextkarte nachgelagert, Unbekannt statt erzwungener Fantasiewerte. Verlauf/Entwurf behalten. |
| `/projekte/:id/ergebnis` | V01 → V03 → V02 → V05/V06 → V15 | Mobil Befunde vor großer Karte; Übergabeaktion gemäß tatsächlichen Gates. |
| `/partner/projekte` | V07 + ausgewählte V09 | Ab 1200 Split View; 768–1199 Liste und Akte als getrennte Zustände; darunter mobile Arbeitsliste. |
| `/partner/pipeline` | V08, verlinkte V07 | Scope und Snapshot konsistent. Filter in URL; kein Funnel aus Statusbeständen. |
| `/partner/projekte/:id` | V09 mit V10/V14 | Vollständige Akte, Entscheidung serverbestätigt. Browser Zurück stellt vorherige Arbeitsliste wieder her. |
| `/admin/analysen/ablehnungen` | V11 und Methodik | Späterer interner Bereich, nur berechtigte Cohorts. |
| `/admin/analysen/funnel` | V12/V13 | Späterer interner Bereich, Kohortenbasis/Horizont/Nenner immer sichtbar. |

Desktop-Grid: 12 Spalten, 24 px Gutter, 48 px äußere Ränder bei 1440 px; große Arbeitsflächen dürfen bis 1600 px wachsen, keine zentrierte Marketingkarte um die gesamte Partneranwendung. Tablet: 8 Spalten, 24 px Ränder. Mobile: 4 Spalten, 16 px Ränder, 12 px Gutter. Tabellenlabels werden nicht unter 14 px verkleinert; Body 16 px, Hilfstext normalerweise 14 px. 320 px Reflow und 200 % Zoom sind zusätzliche Abnahmekriterien, auch wenn visuelle Referenzen bei 390 px vorliegen.

Eine klebende mobile Aktion reserviert eigenen Seitenabstand und Safe Area, verdeckt keinen fokussierten Inhalt und klappt bei Bildschirmtastatur in einen erreichbaren Inline-/Viewportzustand. Desktop-/Mobile-Datenbedeutung ist identisch; die Reihenfolge und Offenlegung passen sich an.

## Tokens und Semantik

| Token / Rolle | Wert / Verwendung |
| --- | --- |
| `color.canvas` | #151B20 · durchgehende Atlas-Arbeitsfläche |
| `color.surface` | #222B31 · angehobene Fläche, sparsam |
| `color.text.primary` | #F3F5F6 |
| `color.text.secondary` | #B9C2C8 |
| `color.accent.energy` | #E9B64C · ausgewählte Daten, Primäraktion, Fokus |
| `color.onAccent` | #151B20 · Text auf Amber |
| `color.border.subtle` | #3B474F · dekorative Abschnittstrennung; nicht alleinige Control-Grenze |
| `color.border.control` | #81909A · notwendige Eingabe-/Grafikgrenze auf dunklem Grund |
| `font.display` | IBM Plex Sans Condensed · bestehende Atlas-Wirkung, 600/700 |
| `font.body` | IBM Plex Sans · 400/500/600 |
| `font.data` | IBM Plex Mono · 400/500, tabellarische Zahlen |
| `size.display` | Desktop 48–64, Mobile 32–40; Score Desktop 88–104, Mobile 72–88 |
| `size.body/meta` | 16/24 und 14/20; Datentabellen nicht auf unlesbare 10 px pressen |
| `space` | 4, 8, 12, 16, 24, 32, 48, 64 |
| `radius` | 2–4 px für Controls/Flächen; keine Pill-Wolke |
| `stroke` | 1 px Trennung; 2 px aktive Kontur/Fokus; Schraffur für fehlende Bereiche |
| `icons` | Bestehende geradlinige Atlas-Icons; falls noch keine Bibliothek festliegt, Carbon 20/24 px. Kein zusätzlicher Illustrationsstil. |

Die Tokens konkretisieren die Atlas-Referenz und ersetzen keine weiter konkretisierten bestehenden Design-Contract-Werte. Falls im bestehenden Vertrag ein Token exakt anders festgelegt wurde, gilt dessen Wert bei gleicher analytischer Rolle. Semantik, Kontrastziele und proportionale Chartgeometrie aus diesem Handoff bleiben verbindlich. Keine Einführung neuer grüner, gläserner oder generischer Admin-Themes.

## Analytische Mini-Briefs und lokale Fachprüfungen

| Ebene / Aufgabe | Primäre Fachroute | Kernaussage und Annotation | Fallback | Fresh Pass |
| --- | --- | --- | --- | --- |
| Score / gewichtete Beiträge | Statistical & uncertainty + strategy | Beiträge summieren sich, unbekannt ist nicht 0; Modell-/Quellenzeile | Faktor-Tabelle | Lokal, Summen/Teilscore/Grenzen geprüft |
| Standort / räumliche Evidenz | Geospatial | Kontur, Nutzfläche und Quelle sind getrennte Objekte | Adress-/Objektliste | Lokal, analytischer Layernutzen und Fallback geprüft |
| Energie / vergleichbare Größen | Statistical & uncertainty | Jahreswerte ohne erfundene zeitliche Deckung | Werteliste | Lokal, Einheiten/Intervalle/Nullsemantik geprüft |
| Partner / operative Auswahl | Dashboards & operational workspace | Nächste Aktion vor gleichwertigen Kennzahlen | Priorisierte Liste | Lokal, stabile Selektion/Fristen/Scope geprüft |
| Pipeline / Zustand | UML & software structure + dashboard | Aktueller Bestand ist kein Durchsatz | Status-Tabelle | Lokal, Übergänge und Abschlusszweig geprüft |
| Rejection / Häufigkeit | Statistical & strategy | Dokumentierte Primärgründe im benannten Nenner | Grund-Tabelle | Lokal, Additivität/Mehrfachgründe/kleines n geprüft |
| Funnel / Kohorten | Statistical & strategy | Gleiche Journeys und Horizont, offen ≠ verloren | Kohortentabelle | Lokal, Grain/Denominator/Monotonie geprüft |
| Mobile / Assistenztechnik | Accessibility & inclusive | Essenzielle Aussage ohne Hover/Farbe | Semantischer Text | Lokal, unabhängiger Leseweg/Targets/Reflow spezifiziert |
| Export / Referenzgrafiken | Reports, PDFs & slide automation | Jeder Export trägt Quelle, Scope und Einschränkung | Markdown/JSON | Lokal, PDF gerendert und kontrolliert; siehe QA-REPORT |

Es wurde keine unabhängige menschliche oder agentische Fachvalidierung behauptet. Die lokalen Prüfungen beziehen sich auf die interne Konsistenz des Design-/Datenvertrags, nicht auf die wirtschaftliche oder technische Eignung realer Projekte.


---

# FILE: DATA-CONTRACT.json
{
  "contractVersion": "1.0",
  "kind": "normative_design_data_contract_not_application_code",
  "locale": "de-DE",
  "displayTimezone": "Europe/Berlin",
  "timestampStorage": "ISO 8601 UTC",
  "identity": {
    "globalProjectKey": "projectId",
    "tenantProjectKey": [
      "tenantId",
      "projectId"
    ],
    "assignmentKey": "partnerAssignmentId",
    "authorization": "Server enforces all tenant, role, project and document access. Client filters are not access control."
  },
  "enums": {
    "projectStatus": [
      "NEW",
      "INCOMPLETE",
      "SCORING",
      "QUALIFIED",
      "PARTNER_REVIEW",
      "INFO_REQUESTED",
      "ACCEPTED",
      "DEVELOPMENT",
      "CONTRACTED",
      "REALIZED",
      "REJECTED"
    ],
    "scoreState": [
      "READY",
      "ESTIMATED",
      "PARTIAL",
      "NOT_READY",
      "SCORING",
      "STALE",
      "ERROR"
    ],
    "origin": [
      "USER",
      "EXTERNAL",
      "PARTNER",
      "DERIVED"
    ],
    "nature": [
      "OBSERVED",
      "ESTIMATED",
      "UNKNOWN",
      "NOT_APPLICABLE"
    ],
    "loadState": [
      "IDLE",
      "INITIAL_LOADING",
      "READY",
      "REFRESHING",
      "PARTIAL",
      "ERROR",
      "STALE",
      "OFFLINE"
    ],
    "findingType": [
      "POSITIVE",
      "UNRESOLVED",
      "CONFIRMED_RISK",
      "MISSING"
    ],
    "factorId": [
      "USABLE_AREA",
      "SOLAR_YIELD",
      "CONSUMPTION_SELF_USE",
      "DECISION_AUTHORITY",
      "ROOF_CONDITION",
      "PROJECT_SCALE",
      "READINESS",
      "DOCUMENTATION",
      "ENERGY_INFRASTRUCTURE"
    ],
    "rejectionReason": [
      "AREA_TOO_SMALL",
      "ROOF_CONDITION",
      "OWNERSHIP_AUTHORITY",
      "LOW_CONSUMPTION",
      "PROJECT_SCALE_MISMATCH",
      "GRID_CONSTRAINT",
      "STRUCTURAL_CONSTRAINT",
      "REGION_OUT_OF_SCOPE",
      "ECONOMICS",
      "MISSING_INFORMATION",
      "OTHER",
      "PARTNER_CAPACITY",
      "DUPLICATE",
      "WITHDRAWN"
    ],
    "assessmentCertainty": [
      "CONFIRMED",
      "INSUFFICIENT_EVIDENCE",
      "PARTNER_SCOPE_DECISION"
    ],
    "projectProfile": [
      "COMMERCIAL_ROOF_PV",
      "GROUND_PV",
      "PV_EXTENSION",
      "STORAGE"
    ],
    "supportedUnits": [
      "m2",
      "kW",
      "kWp",
      "MWp",
      "kWh",
      "MWh",
      "kWh/year",
      "MWh/year",
      "kWh/kWp/year",
      "percent"
    ]
  },
  "records": {
    "EvidenceValue": {
      "id": "string",
      "value": "finite number|string|boolean|null; unknown and not applicable require null",
      "unit": "supported unit or null for categorical value",
      "origin": "origin enum or null when no source exists",
      "nature": "nature enum",
      "period": "{start,end,timezone,coverageRatio} or null; energy comparisons require compatible annual periods",
      "interval": "{lower,upper,kind,methodRef} or null; kind=SCENARIO_RANGE|MODEL_RANGE|MEASUREMENT_RANGE; never invent confidence level",
      "sourceRef": "string|null",
      "asOf": "ISO timestamp|null",
      "recordedAt": "ISO timestamp",
      "methodVersion": "string|null",
      "inputRefs": "array of EvidenceValue IDs",
      "resolution": "source spatial/temporal resolution or null",
      "conflict": "null|{candidateEvidenceIds,reason,resolvedBy,resolvedAt}",
      "loadState": "separate fetch state"
    },
    "Source": {
      "id": "string",
      "origin": "origin enum",
      "provider": "string|null",
      "dataset": "string|null",
      "version": "string|null",
      "sourceDate": "ISO timestamp|null",
      "retrievedAt": "ISO timestamp|null",
      "method": "string|null",
      "license": "string|null",
      "attribution": "string|null",
      "documentRef": "authorized reference|null"
    },
    "FactorAssessment": {
      "factorId": "factor enum",
      "applicable": "boolean",
      "maxPoints": "nonnegative finite number",
      "contribution": "finite number in [0,maxPoints] or null",
      "contributionBounds": "{lower,upper} or null",
      "basisState": "OBSERVED|ESTIMATED|UNKNOWN|NOT_APPLICABLE",
      "evidenceRefs": "array",
      "ruleId": "string",
      "ruleVersion": "string",
      "explanation": "rule-derived structured text, never post-hoc AI reasoning",
      "improvementAction": "{actionType,targetId,label}|null"
    },
    "ScoreAssessment": {
      "assessmentId": "string",
      "projectId": "string",
      "modelVersion": "string",
      "profileId": "string",
      "inputVersion": "string",
      "calculatedAt": "ISO timestamp",
      "state": "scoreState",
      "displayScore": "integer [0,100]|null",
      "class": "HIGH_PRIORITY|GOOD_POTENTIAL|MORE_INFORMATION|LOW_PRIORITY|null",
      "bounds": "{lower,upper,meaning:POSSIBLE_POINTS}|null",
      "factors": "FactorAssessment[]",
      "blockingFindingIds": "array",
      "previousAssessmentId": "string|null"
    },
    "RequirementCoverage": {
      "profileVersion": "string",
      "requiredApplicableFieldIds": "array",
      "availableFieldIds": "subset array",
      "answeredUnknownFieldIds": "subset array; not included in available",
      "documents": "{requiredCategoryIds,availableCategoryIds,reviewedCategoryIds}; separate counts, no arbitrary-file bonus"
    },
    "SiteGeometry": {
      "type": "GeoJSON geometry",
      "coordinates": "WGS84 longitude then latitude",
      "geometryRole": "BUILDING_FOOTPRINT|ROOF_SURFACE|USABLE_AREA|EXCLUDED_AREA|EXISTING_PV",
      "sourceRef": "string",
      "confirmed": "boolean",
      "areaM2": "number|null",
      "areaMethod": "geodesic or named suitable local projection; never display pixel area"
    },
    "ProjectSnapshot": {
      "projectId": "string",
      "tenantId": "string",
      "partnerAssignmentId": "string|null",
      "status": "projectStatus",
      "revision": "monotonic integer",
      "submittedAt": "ISO timestamp|null; separate from status",
      "statusEnteredAt": "ISO timestamp",
      "scoreAssessmentId": "string|null",
      "scoreJobState": "IDLE|QUEUED|RUNNING|FAILED|SUCCEEDED; independent of review status during recalculation",
      "nextAction": "{type,label,ownerId,dueAt,createdAt}|null",
      "projectSize": "EvidenceValue; do not sort/add unlike units"
    },
    "DecisionEvent": {
      "eventId": "unique string",
      "requestId": "idempotency string",
      "tenantId": "string",
      "projectId": "string",
      "partnerAssignmentId": "string",
      "actorId": "string",
      "occurredAt": "ISO timestamp",
      "fromStatus": "projectStatus",
      "toStatus": "projectStatus",
      "primaryReasonCode": "one code for rejection, else null",
      "secondaryReasonCodes": "unique array <=3 excluding primary",
      "reasonCatalogVersion": "string",
      "note": "string; required for OTHER",
      "assessmentCertainty": "enum",
      "evidenceRefs": "array",
      "scoreAssessmentIdAtDecision": "string|null",
      "inputVersionAtDecision": "string",
      "modelVersionAtDecision": "string|null",
      "supersedesEventId": "string|null; immutable prior snapshot"
    },
    "Journey": {
      "journeyId": "unique measurable visit ID, not a person ID",
      "startedAt": "ISO timestamp",
      "primaryProjectId": "one attributed project|null",
      "stageReachAt": "map of stage to timestamp|null",
      "trackingScope": "measurable visits only",
      "attributionStatus": "ATTRIBUTED|UNATTRIBUTED|NOT_STARTED",
      "horizonDays": "integer",
      "cohortAnchor": "startedAt"
    },
    "StatusEvent": {
      "eventId": "unique string",
      "projectId": "string",
      "assignmentId": "string|null",
      "occurredAt": "ISO timestamp",
      "from": "enum|null",
      "to": "enum",
      "actorId": "string",
      "reasonRef": "string|null",
      "previousRevision": "integer",
      "nextRevision": "integer"
    }
  },
  "scoringRules": {
    "productionWeightPolicy": "Provided by versioned professionally owned profile configuration; example weights must not be enabled as production defaults.",
    "weightsInvariant": "Applicable maxPoints sum to exactly 100. N/A excluded by profile, not silently renormalized at render time.",
    "rounding": "Service rounds total once to integer, decimal half up; class uses same display integer.",
    "partialPolicy": "Unknown contributions remain null. Lower=sum known lower bounds; upper=sum known upper bounds+unknown maxima. No scalar score or class in PARTIAL.",
    "blockerPolicy": "Explicit documented gates independent of numeric score; never hidden point deductions.",
    "classes": [
      {
        "id": "HIGH_PRIORITY",
        "min": 80,
        "max": 100,
        "label": "Hohe Priorität"
      },
      {
        "id": "GOOD_POTENTIAL",
        "min": 65,
        "max": 79,
        "label": "Gutes Potenzial"
      },
      {
        "id": "MORE_INFORMATION",
        "min": 50,
        "max": 64,
        "label": "Informationen ergänzen"
      },
      {
        "id": "LOW_PRIORITY",
        "min": 0,
        "max": 49,
        "label": "Aktuell geringe Priorität"
      }
    ],
    "activeFactorPolicy": "Only applicable factors with maxPoints > 0 count in score coverage and PARTIAL. Applicable maxPoints=0 renders Not weighted, never 0/0; information/blocker rules remain independent."
  },
  "statusTransitions": {
    "NEW": [
      "INCOMPLETE",
      "SCORING",
      "REJECTED"
    ],
    "INCOMPLETE": [
      "SCORING",
      "REJECTED"
    ],
    "SCORING": [
      "QUALIFIED",
      "INCOMPLETE",
      "NEW"
    ],
    "QUALIFIED": [
      "PARTNER_REVIEW",
      "INFO_REQUESTED",
      "ACCEPTED",
      "REJECTED"
    ],
    "PARTNER_REVIEW": [
      "INFO_REQUESTED",
      "ACCEPTED",
      "REJECTED"
    ],
    "INFO_REQUESTED": [
      "PARTNER_REVIEW",
      "REJECTED"
    ],
    "ACCEPTED": [
      "DEVELOPMENT",
      "REJECTED"
    ],
    "DEVELOPMENT": [
      "CONTRACTED",
      "REJECTED"
    ],
    "CONTRACTED": [
      "REALIZED"
    ],
    "REALIZED": [],
    "REJECTED": [
      "PARTNER_REVIEW"
    ]
  },
  "transitionGuards": {
    "anyMutation": "Authorization + expected revision + idempotency key; server confirms result.",
    "toREJECTED": "Explicit authorized action + primary reason + certainty + event snapshot; not timeout or automatic low-score rule.",
    "REJECTED_to_PARTNER_REVIEW": "Explicit authorized reopen with explanation; retain rejection event.",
    "SCORING_to_QUALIFIED": "Configured prequalification gates satisfied. Suggested starting workflow >=65, complete required basis, no active confirmed blocker; proposal, not validated scoring model.",
    "INFO_REQUESTED_to_PARTNER_REVIEW": "Response confirmed or authorized explicit resumption. Partial answer leaves unmet requirements visible.",
    "CONTRACTED_to_REALIZED": "Confirmed actual milestone; post-contract disturbances use separate events, not retroactive pre-contract loss."
  },
  "analytics": {
    "pipeline": {
      "grain": "unique project within selected tenant/scope",
      "time": "current as-of snapshot",
      "counts": "each project exactly one status",
      "age": "median current status age of nonterminal projects, not historical throughput time",
      "overdue": "dueAt exists and is before asOf and action open"
    },
    "funnel": {
      "grain": "same measurable journey cohort, at most one primary project per journey",
      "stageOrder": [
        "VISIT",
        "CHECK_STARTED",
        "CHECK_COMPLETED",
        "SUBMITTED",
        "QUALIFIED",
        "PARTNER_ACCEPTED",
        "DEVELOPMENT",
        "CONTRACTED",
        "REALIZED"
      ],
      "qualifiedStageReach": "max(submittedAt, valid qualifiedAt); analytical derived timestamp, not fabricated workflow event",
      "withinStageRate": "N(stage)/N(previous)",
      "notReachedNext": "N(stage)-N(next) with still open vs closed distinction",
      "zeroDenominator": "null",
      "horizon": "relative to every journey start, not one arbitrary calendar snapshot",
      "maturity": "all included journeys have elapsed horizon; otherwise visibly provisional",
      "eventDedup": "unique eventId plus stage/project idempotency; never count retries as new reaches"
    },
    "qualificationRate": {
      "numerator": "submitted projects qualified within horizon",
      "denominator": "all submitted projects in cohort"
    },
    "partnerAcceptanceRate": {
      "numerator": "first partner decisions accepted",
      "denominator": "first partner decisions accepted + rejected",
      "pending": "qualified assigned projects without first decision, separate"
    },
    "projectWinRate": {
      "numerator": "projects contracted within horizon",
      "denominator": "contracted + effective closed pre-contract rejections within the qualified cohort",
      "pending": "qualified projects without effective closed outcome; reopened cases are open"
    },
    "reasons": {
      "grain": "one effective rejection primary reason per case in stated rejection decision cohort",
      "secondary": "separate many-to-many frequency; sum can exceed 100%",
      "excludedFromTechnicalLearning": [
        "DUPLICATE",
        "WITHDRAWN"
      ],
      "nontechnical": [
        "PARTNER_CAPACITY",
        "DUPLICATE",
        "WITHDRAWN"
      ],
      "legacyMissing": "explicit uncoded category, never silently OTHER"
    }
  },
  "uiState": {
    "url": [
      "projectId",
      "tab",
      "tenantScopeId",
      "validated filters",
      "sort",
      "cohortStart",
      "cohortEnd",
      "horizonDays"
    ],
    "local": [
      "hover",
      "unsubmitted input",
      "map transient viewport"
    ],
    "server": [
      "project versions",
      "decisions",
      "requirements",
      "scores"
    ],
    "doNotPutInUrl": [
      "contact free text",
      "document access tokens",
      "unsubmitted notes"
    ],
    "backgroundRefresh": "at most 60s while visible; preserve current ordering until user accepts new snapshot"
  },
  "validation": [
    "reject NaN/Infinity",
    "unknown value is null",
    "zero is valid observed quantity",
    "bounds lower<=upper",
    "all points within maxima",
    "applicable weights total 100",
    "sum known contributions agrees with integer score after single rounding",
    "status allowed and guarded",
    "numerators<=denominators",
    "funnel monotone at same grain/horizon",
    "no mixed-unit aggregation",
    "respect tenant scope",
    "duplicate events not double counted"
  ]
}


---

# FILE: EXAMPLE-DATA.json
{
  "meta": {
    "synthetic": true,
    "seed": 20260905,
    "createdAt": "2026-09-05",
    "purpose": "Deterministic visual/semantic acceptance fixture; no real projects, no validated scoring model.",
    "separateScopes": [
      "Score fixture PG-DEMO-SCORE",
      "Energy fixture PG-DEMO-ENERGY with existing generation",
      "Operational snapshot of 140 projects",
      "Independent Jan-Feb journey cohort of 10000 measurable visits"
    ],
    "rawCohortFile": "fixtures/journeys.json",
    "rawDecisionsFile": "fixtures/decisions.json",
    "rawPipelineFile": "fixtures/pipeline-projects.json"
  },
  "scoreFull": {
    "assessmentId": "ASSESS-DEMO-82",
    "projectId": "PG-DEMO-SCORE",
    "projectName": "Beispielobjekt · Karlsruhe",
    "modelVersion": "DEMO-ROOF-1",
    "inputVersion": "fixture-1",
    "profileId": "COMMERCIAL_ROOF_PV",
    "state": "ESTIMATED",
    "displayScore": 82,
    "class": "HIGH_PRIORITY",
    "calculatedAt": "2026-09-05T08:00:00Z",
    "factors": [
      {
        "factorId": "USABLE_AREA",
        "label": "Nutzbare Fläche",
        "applicable": true,
        "maxPoints": 15,
        "contribution": 13,
        "basisState": "ESTIMATED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_USABLE_AREA",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_USABLE_AREA"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "SOLAR_YIELD",
        "label": "Solar-/Ertragspotenzial",
        "applicable": true,
        "maxPoints": 15,
        "contribution": 12,
        "basisState": "ESTIMATED",
        "origin": "DERIVED",
        "ruleId": "DEMO_RULE_SOLAR_YIELD",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_SOLAR_YIELD"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "CONSUMPTION_SELF_USE",
        "label": "Verbrauch / Eigenverbrauch",
        "applicable": true,
        "maxPoints": 20,
        "contribution": 18,
        "basisState": "ESTIMATED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_CONSUMPTION_SELF_USE",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_CONSUMPTION_SELF_USE"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "DECISION_AUTHORITY",
        "label": "Entscheidungssituation",
        "applicable": true,
        "maxPoints": 15,
        "contribution": 15,
        "basisState": "OBSERVED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_DECISION_AUTHORITY",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_DECISION_AUTHORITY"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "ROOF_CONDITION",
        "label": "Dachzustand",
        "applicable": true,
        "maxPoints": 10,
        "contribution": 6,
        "basisState": "ESTIMATED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_ROOF_CONDITION",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_ROOF_CONDITION"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "PROJECT_SCALE",
        "label": "Projektgröße",
        "applicable": true,
        "maxPoints": 5,
        "contribution": 4,
        "basisState": "ESTIMATED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_PROJECT_SCALE",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_PROJECT_SCALE"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "READINESS",
        "label": "Projektbereitschaft",
        "applicable": true,
        "maxPoints": 10,
        "contribution": 7,
        "basisState": "OBSERVED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_READINESS",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_READINESS"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "DOCUMENTATION",
        "label": "Unterlagen",
        "applicable": true,
        "maxPoints": 5,
        "contribution": 3,
        "basisState": "OBSERVED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_DOCUMENTATION",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_DOCUMENTATION"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "ENERGY_INFRASTRUCTURE",
        "label": "Energieinfrastruktur",
        "applicable": true,
        "maxPoints": 5,
        "contribution": 4,
        "basisState": "OBSERVED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_ENERGY_INFRASTRUCTURE",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_ENERGY_INFRASTRUCTURE"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      }
    ],
    "estimatedFactorCount": 5,
    "bounds": null,
    "blockingFindingIds": [],
    "unresolvedFindings": [
      "Netzanschluss nicht geprüft",
      "Tragfähigkeit noch unbekannt"
    ],
    "positiveFindings": [
      "Zusammenhängende nutzbare Fläche angegeben",
      "Entscheidungsträger benannt"
    ],
    "missingInformation": [
      "Lastgang ergänzen"
    ],
    "coverage": {
      "fieldsAvailable": 16,
      "fieldsRequired": 20,
      "documentsAvailable": 2,
      "documentsRequired": 3,
      "factorsAssessable": 9,
      "factorsApplicable": 9,
      "weightCovered": 100
    }
  },
  "scorePartial": {
    "assessmentId": "ASSESS-DEMO-PARTIAL",
    "projectId": "PG-DEMO-SCORE",
    "projectName": "Beispielobjekt · Karlsruhe",
    "modelVersion": "DEMO-ROOF-1",
    "inputVersion": "fixture-1",
    "profileId": "COMMERCIAL_ROOF_PV",
    "state": "PARTIAL",
    "displayScore": null,
    "class": null,
    "calculatedAt": "2026-09-05T08:00:00Z",
    "factors": [
      {
        "factorId": "USABLE_AREA",
        "label": "Nutzbare Fläche",
        "applicable": true,
        "maxPoints": 15,
        "contribution": 13,
        "basisState": "ESTIMATED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_USABLE_AREA",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_USABLE_AREA"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "SOLAR_YIELD",
        "label": "Solar-/Ertragspotenzial",
        "applicable": true,
        "maxPoints": 15,
        "contribution": null,
        "basisState": "UNKNOWN",
        "origin": null,
        "ruleId": "DEMO_RULE_SOLAR_YIELD",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "CONSUMPTION_SELF_USE",
        "label": "Verbrauch / Eigenverbrauch",
        "applicable": true,
        "maxPoints": 20,
        "contribution": 18,
        "basisState": "ESTIMATED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_CONSUMPTION_SELF_USE",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_CONSUMPTION_SELF_USE"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "DECISION_AUTHORITY",
        "label": "Entscheidungssituation",
        "applicable": true,
        "maxPoints": 15,
        "contribution": 15,
        "basisState": "OBSERVED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_DECISION_AUTHORITY",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_DECISION_AUTHORITY"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "ROOF_CONDITION",
        "label": "Dachzustand",
        "applicable": true,
        "maxPoints": 10,
        "contribution": 6,
        "basisState": "ESTIMATED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_ROOF_CONDITION",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_ROOF_CONDITION"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "PROJECT_SCALE",
        "label": "Projektgröße",
        "applicable": true,
        "maxPoints": 5,
        "contribution": 4,
        "basisState": "ESTIMATED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_PROJECT_SCALE",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_PROJECT_SCALE"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "READINESS",
        "label": "Projektbereitschaft",
        "applicable": true,
        "maxPoints": 10,
        "contribution": 7,
        "basisState": "OBSERVED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_READINESS",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_READINESS"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "DOCUMENTATION",
        "label": "Unterlagen",
        "applicable": true,
        "maxPoints": 5,
        "contribution": 3,
        "basisState": "OBSERVED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_DOCUMENTATION",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_DOCUMENTATION"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      },
      {
        "factorId": "ENERGY_INFRASTRUCTURE",
        "label": "Energieinfrastruktur",
        "applicable": true,
        "maxPoints": 5,
        "contribution": 4,
        "basisState": "OBSERVED",
        "origin": "USER",
        "ruleId": "DEMO_RULE_ENERGY_INFRASTRUCTURE",
        "ruleVersion": "fixture-1",
        "evidenceRefs": [
          "DEMO_EVIDENCE_ENERGY_INFRASTRUCTURE"
        ],
        "explanation": "Synthetisches Regelergebnis für die UI-Abnahme; keine fachlich validierte Eignungsschwelle."
      }
    ],
    "estimatedFactorCount": 4,
    "bounds": {
      "lower": 70,
      "upper": 85,
      "meaning": "POSSIBLE_POINTS"
    },
    "blockingFindingIds": [],
    "unresolvedFindings": [
      "Netzanschluss nicht geprüft",
      "Tragfähigkeit noch unbekannt"
    ],
    "positiveFindings": [
      "Zusammenhängende nutzbare Fläche angegeben",
      "Entscheidungsträger benannt"
    ],
    "missingInformation": [
      "Lastgang ergänzen"
    ],
    "coverage": {
      "fieldsAvailable": 16,
      "fieldsRequired": 20,
      "documentsAvailable": 2,
      "documentsRequired": 3,
      "factorsAssessable": 8,
      "factorsApplicable": 9,
      "weightCovered": 85
    }
  },
  "energy": {
    "projectId": "PG-DEMO-ENERGY",
    "scope": "Separate synthetic example with existing generation; not the score/map demo property.",
    "period": {
      "start": "2025-01-01",
      "end": "2025-12-31",
      "timezone": "Europe/Berlin"
    },
    "values": [
      {
        "id": "CONSUMPTION",
        "label": "Jährlicher Stromverbrauch",
        "value": 620,
        "unit": "MWh/year",
        "origin": "USER",
        "nature": "OBSERVED",
        "source": "Synthetische Jahresabrechnung 2025"
      },
      {
        "id": "EXISTING_GENERATION",
        "label": "Vorhandene Eigenerzeugung",
        "value": 180,
        "unit": "MWh/year",
        "origin": "USER",
        "nature": "OBSERVED",
        "source": "Synthetischer Jahreszähler 2025"
      },
      {
        "id": "ADDITIONAL_POTENTIAL",
        "label": "Zusätzliches Erzeugungspotenzial",
        "value": null,
        "unit": "MWh/year",
        "origin": "DERIVED",
        "nature": "ESTIMATED",
        "interval": {
          "lower": 350,
          "upper": 450,
          "kind": "SCENARIO_RANGE",
          "methodRef": "DEMO_SCENARIO_RANGE"
        },
        "source": "Synthetische Jahresszenario-Spanne, keine PVGIS-Abfrage"
      }
    ],
    "selfUse": {
      "value": null,
      "state": "INSUFFICIENT_DATA",
      "missing": [
        "Kompatibler Lastgang",
        "Zeitgleiches Erzeugungsprofil"
      ]
    },
    "storage": {
      "value": null,
      "state": "INSUFFICIENT_DATA",
      "label": "Daten für Speicherprüfung ergänzen"
    }
  },
  "site": {
    "projectId": "PG-DEMO-SITE",
    "address": "Musteradresse · Demoobjekt",
    "coordinates": null,
    "buildingType": "Logistikhalle",
    "illustrativeRoofAreaM2": 4800,
    "areaNature": "ESTIMATED",
    "roofGeometry": null,
    "usableGeometry": null,
    "solarPotential": null,
    "existingPV": "UNKNOWN",
    "extensionPotential": "UNKNOWN",
    "storagePotential": "UNKNOWN",
    "drawingNote": "Layer diagram is schematic and not georeferenced. No metric area or real satellite attribution may be inferred."
  },
  "pipeline": {
    "scope": "Separate current operational portfolio, not the historical funnel cohort",
    "tenantId": "DEMO-PARTNER",
    "asOf": "2026-09-05T08:00:00Z",
    "totalProjects": 140,
    "rows": [
      {
        "status": "NEW",
        "label": "Neu",
        "count": 8,
        "medianCurrentAgeDays": 1,
        "openActions": 2,
        "overdueActions": 0
      },
      {
        "status": "INCOMPLETE",
        "label": "Angaben fehlen",
        "count": 24,
        "medianCurrentAgeDays": 7,
        "openActions": 15,
        "overdueActions": 7
      },
      {
        "status": "SCORING",
        "label": "Bewertung läuft",
        "count": 3,
        "medianCurrentAgeDays": 0.007,
        "openActions": 1,
        "overdueActions": 1
      },
      {
        "status": "QUALIFIED",
        "label": "Vorqualifiziert",
        "count": 15,
        "medianCurrentAgeDays": 2,
        "openActions": 10,
        "overdueActions": 3
      },
      {
        "status": "PARTNER_REVIEW",
        "label": "In Prüfung",
        "count": 20,
        "medianCurrentAgeDays": 6,
        "openActions": 12,
        "overdueActions": 4
      },
      {
        "status": "INFO_REQUESTED",
        "label": "Rückfrage offen",
        "count": 18,
        "medianCurrentAgeDays": 12,
        "openActions": 14,
        "overdueActions": 8
      },
      {
        "status": "ACCEPTED",
        "label": "Übernommen",
        "count": 12,
        "medianCurrentAgeDays": 4,
        "openActions": 5,
        "overdueActions": 0
      },
      {
        "status": "DEVELOPMENT",
        "label": "In Entwicklung",
        "count": 9,
        "medianCurrentAgeDays": 21,
        "openActions": 4,
        "overdueActions": 0
      },
      {
        "status": "CONTRACTED",
        "label": "Vertrag geschlossen",
        "count": 5,
        "medianCurrentAgeDays": 17,
        "openActions": 1,
        "overdueActions": 0
      },
      {
        "status": "REALIZED",
        "label": "Realisiert",
        "count": 4,
        "medianCurrentAgeDays": null,
        "openActions": 0,
        "overdueActions": 0
      },
      {
        "status": "REJECTED",
        "label": "Abgelehnt",
        "count": 22,
        "medianCurrentAgeDays": null,
        "openActions": 0,
        "overdueActions": 0
      }
    ]
  },
  "rejection": {
    "scope": "First rejection decisions in qualified Jan-Feb cohort within H180",
    "denominator": 80,
    "reasonMode": "PRIMARY_ONLY",
    "rows": [
      {
        "code": "AREA_TOO_SMALL",
        "label": "Fläche zu klein",
        "count": 18
      },
      {
        "code": "ROOF_CONDITION",
        "label": "Dachzustand ungeeignet",
        "count": 12
      },
      {
        "code": "OWNERSHIP_AUTHORITY",
        "label": "Eigentum / Entscheidung",
        "count": 10
      },
      {
        "code": "LOW_CONSUMPTION",
        "label": "Verbrauch zu gering",
        "count": 8
      },
      {
        "code": "PROJECT_SCALE_MISMATCH",
        "label": "Projektgröße unpassend",
        "count": 7
      },
      {
        "code": "GRID_CONSTRAINT",
        "label": "Netzsituation",
        "count": 7
      },
      {
        "code": "STRUCTURAL_CONSTRAINT",
        "label": "Statik",
        "count": 6
      },
      {
        "code": "REGION_OUT_OF_SCOPE",
        "label": "Region außerhalb Fokus",
        "count": 5
      },
      {
        "code": "ECONOMICS",
        "label": "Wirtschaftlichkeit",
        "count": 4
      },
      {
        "code": "MISSING_INFORMATION",
        "label": "Informationen unvollständig",
        "count": 2
      },
      {
        "code": "OTHER",
        "label": "Sonstiges",
        "count": 1
      }
    ],
    "missingReasonCount": 0,
    "technicalExclusions": [
      "DUPLICATE",
      "WITHDRAWN"
    ]
  },
  "funnel": {
    "cohortStart": "2026-01-01",
    "cohortEndInclusive": "2026-02-28",
    "asOf": "2026-09-05",
    "horizonDays": 180,
    "mature": true,
    "grain": "measurable journey / first primary project",
    "rows": [
      {
        "stage": "VISIT",
        "label": "Messbare Besuche",
        "count": 10000,
        "conversionFromPrevious": null,
        "notReachedNext": 8800
      },
      {
        "stage": "CHECK_STARTED",
        "label": "Standortcheck gestartet",
        "count": 1200,
        "conversionFromPrevious": 0.12,
        "notReachedNext": 480
      },
      {
        "stage": "CHECK_COMPLETED",
        "label": "Standortcheck abgeschlossen",
        "count": 720,
        "conversionFromPrevious": 0.6,
        "notReachedNext": 360
      },
      {
        "stage": "SUBMITTED",
        "label": "Projekt eingereicht",
        "count": 360,
        "conversionFromPrevious": 0.5,
        "notReachedNext": 108
      },
      {
        "stage": "QUALIFIED",
        "label": "Vorqualifiziert",
        "count": 252,
        "conversionFromPrevious": 0.7,
        "notReachedNext": 126
      },
      {
        "stage": "PARTNER_ACCEPTED",
        "label": "Partner angenommen",
        "count": 126,
        "conversionFromPrevious": 0.5,
        "notReachedNext": 36
      },
      {
        "stage": "DEVELOPMENT",
        "label": "Projektentwicklung",
        "count": 90,
        "conversionFromPrevious": 0.7142857142857143,
        "notReachedNext": 45
      },
      {
        "stage": "CONTRACTED",
        "label": "Vertrag",
        "count": 45,
        "conversionFromPrevious": 0.5,
        "notReachedNext": 27
      },
      {
        "stage": "REALIZED",
        "label": "Realisiert",
        "count": 18,
        "conversionFromPrevious": 0.4,
        "notReachedNext": null
      }
    ],
    "qualifiedToAcceptanceNotReached": {
      "total": 126,
      "firstRejected": 80,
      "pending": 46
    },
    "rates": {
      "qualification": {
        "numerator": 252,
        "denominator": 360,
        "rate": 0.7
      },
      "partnerAcceptance": {
        "numerator": 126,
        "denominator": 206,
        "rate": 0.6116504854368932,
        "pending": 46,
        "decisionCoverage": 0.8174603174603174
      },
      "projectWin": {
        "numerator": 45,
        "denominator": 125,
        "rate": 0.36,
        "unresolvedQualified": 127
      },
      "submittedToContract": {
        "numerator": 45,
        "denominator": 360,
        "rate": 0.125
      }
    }
  },
  "edgeCases": [
    {
      "id": "KNOWN_ZERO",
      "nature": "OBSERVED",
      "origin": "USER",
      "value": 0,
      "expected": "Show valid 0, no unknown label"
    },
    {
      "id": "UNKNOWN",
      "nature": "UNKNOWN",
      "origin": null,
      "value": null,
      "expected": "Noch unbekannt; no zero bar"
    },
    {
      "id": "NOT_APPLICABLE",
      "nature": "NOT_APPLICABLE",
      "origin": null,
      "value": null,
      "expected": "Nicht relevant; exclude from active requirement denominator"
    },
    {
      "id": "ZERO_DENOMINATOR",
      "numerator": 0,
      "denominator": 0,
      "expectedRate": null
    },
    {
      "id": "STALE_REVIEW",
      "projectStatus": "PARTNER_REVIEW",
      "scoreState": "STALE",
      "previousScore": 82,
      "scoreJobState": "RUNNING",
      "expected": "Keep review status; mark old score stale"
    },
    {
      "id": "INVALID_SCORE",
      "displayScore": 103,
      "expected": "ERROR, no clamping"
    },
    {
      "id": "CONFIRMED_BLOCKER_HIGH_SCORE",
      "score": 82,
      "blocker": true,
      "expected": "High score visible; gated action explained and blocked"
    },
    {
      "id": "REOPENED_REJECTION",
      "history": [
        "QUALIFIED",
        "PARTNER_REVIEW",
        "REJECTED",
        "PARTNER_REVIEW"
      ],
      "expected": "Retain first decision for acceptance rate; reopened outcome pending for win rate"
    },
    {
      "id": "MIXED_UNITS",
      "values": [
        {
          "value": 4800,
          "unit": "m2"
        },
        {
          "value": 500,
          "unit": "kWp"
        }
      ],
      "expected": "No combined numeric size sort or sum"
    },
    {
      "id": "PARTIAL_RESPONSE",
      "remainingRequired": [
        "LOAD_PROFILE"
      ],
      "expected": "Response event visible; missing requirement persists"
    },
    {
      "id": "DUPLICATE_EVENT",
      "eventIds": [
        "EV-1",
        "EV-1"
      ],
      "expectedDistinctEvents": 1
    }
  ],
  "scoreEvidence": [
    {
      "id": "DEMO_EVIDENCE_USABLE_AREA",
      "value": 4800,
      "unit": "m2",
      "origin": "USER",
      "nature": "ESTIMATED",
      "sourceRef": "DEMO_SOURCE_USABLE_AREA",
      "asOf": "2026-09-05T08:00:00Z",
      "recordedAt": "2026-09-05T08:00:00Z",
      "interval": null,
      "inputRefs": [],
      "loadState": "READY",
      "note": "Geschätzte zusammenhängende Nutzfläche, keine geometrisch ermittelte Modulfläche."
    },
    {
      "id": "DEMO_EVIDENCE_SOLAR_YIELD",
      "value": 980,
      "unit": "kWh/kWp/year",
      "origin": "DERIVED",
      "nature": "ESTIMATED",
      "sourceRef": "DEMO_SOURCE_SOLAR_YIELD",
      "asOf": "2026-09-05T08:00:00Z",
      "recordedAt": "2026-09-05T08:00:00Z",
      "interval": null,
      "inputRefs": [],
      "loadState": "READY",
      "note": "Synthetischer spezifischer Jahresertrag, keine externe Abfrage."
    },
    {
      "id": "DEMO_EVIDENCE_CONSUMPTION_SELF_USE",
      "value": 620,
      "unit": "MWh/year",
      "origin": "USER",
      "nature": "OBSERVED",
      "sourceRef": "DEMO_SOURCE_CONSUMPTION_SELF_USE",
      "asOf": "2026-09-05T08:00:00Z",
      "recordedAt": "2026-09-05T08:00:00Z",
      "interval": null,
      "inputRefs": [],
      "loadState": "READY",
      "note": "Synthetische Jahresverbrauchsangabe. Zeitliche Passung noch ungeprüft."
    },
    {
      "id": "DEMO_EVIDENCE_DECISION_AUTHORITY",
      "value": "Eigentümer als Entscheidungsträger benannt",
      "unit": null,
      "origin": "USER",
      "nature": "OBSERVED",
      "sourceRef": "DEMO_SOURCE_DECISION_AUTHORITY",
      "asOf": "2026-09-05T08:00:00Z",
      "recordedAt": "2026-09-05T08:00:00Z",
      "interval": null,
      "inputRefs": [],
      "loadState": "READY",
      "note": "Nutzerauskunft, kein Eigentumsnachweis."
    },
    {
      "id": "DEMO_EVIDENCE_ROOF_CONDITION",
      "value": "Keine Sanierung bekannt",
      "unit": null,
      "origin": "USER",
      "nature": "ESTIMATED",
      "sourceRef": "DEMO_SOURCE_ROOF_CONDITION",
      "asOf": "2026-09-05T08:00:00Z",
      "recordedAt": "2026-09-05T08:00:00Z",
      "interval": null,
      "inputRefs": [],
      "loadState": "READY",
      "note": "Ungeprüfte Nutzervermutung zum Dachzustand."
    },
    {
      "id": "DEMO_EVIDENCE_PROJECT_SCALE",
      "value": "Gewerbedach-PV im Demo-Partnersegment",
      "unit": null,
      "origin": "USER",
      "nature": "ESTIMATED",
      "sourceRef": "DEMO_SOURCE_PROJECT_SCALE",
      "asOf": "2026-09-05T08:00:00Z",
      "recordedAt": "2026-09-05T08:00:00Z",
      "interval": null,
      "inputRefs": [],
      "loadState": "READY",
      "note": "Fiktiver Partnerfit, keine produktive Mindestgröße."
    },
    {
      "id": "DEMO_EVIDENCE_READINESS",
      "value": "Eigenverbrauch senken; Ansprechpartner benannt",
      "unit": null,
      "origin": "USER",
      "nature": "OBSERVED",
      "sourceRef": "DEMO_SOURCE_READINESS",
      "asOf": "2026-09-05T08:00:00Z",
      "recordedAt": "2026-09-05T08:00:00Z",
      "interval": null,
      "inputRefs": [],
      "loadState": "READY",
      "note": "Synthetische Projektziel- und Zuständigkeitsangabe."
    },
    {
      "id": "DEMO_EVIDENCE_DOCUMENTATION",
      "value": 2,
      "unit": null,
      "origin": "USER",
      "nature": "OBSERVED",
      "sourceRef": "DEMO_SOURCE_DOCUMENTATION",
      "asOf": "2026-09-05T08:00:00Z",
      "recordedAt": "2026-09-05T08:00:00Z",
      "interval": null,
      "inputRefs": [],
      "loadState": "READY",
      "note": "Zwei von drei aktuell benötigten Unterlagen vorhanden; nicht fachlich geprüft."
    },
    {
      "id": "DEMO_EVIDENCE_ENERGY_INFRASTRUCTURE",
      "value": "Keine bestehende PV angegeben; Anschlussprüfung offen",
      "unit": null,
      "origin": "USER",
      "nature": "OBSERVED",
      "sourceRef": "DEMO_SOURCE_ENERGY_INFRASTRUCTURE",
      "asOf": "2026-09-05T08:00:00Z",
      "recordedAt": "2026-09-05T08:00:00Z",
      "interval": null,
      "inputRefs": [],
      "loadState": "READY",
      "note": "Fehlende PV ist kein pauschaler Nachteil."
    }
  ],
  "scoreSources": [
    {
      "id": "DEMO_SOURCE_USABLE_AREA",
      "origin": "USER",
      "provider": "Synthetischer UI-Prüfdatensatz",
      "dataset": "Gateway Analytics Fixture",
      "version": "fixture-1",
      "sourceDate": "2026-09-05T08:00:00Z",
      "retrievedAt": null,
      "method": "Geschätzte zusammenhängende Nutzfläche, keine geometrisch ermittelte Modulfläche.",
      "license": null,
      "attribution": "Beispieldaten, keine realen Projektinformationen",
      "documentRef": null
    },
    {
      "id": "DEMO_SOURCE_SOLAR_YIELD",
      "origin": "DERIVED",
      "provider": "Synthetischer UI-Prüfdatensatz",
      "dataset": "Gateway Analytics Fixture",
      "version": "fixture-1",
      "sourceDate": "2026-09-05T08:00:00Z",
      "retrievedAt": null,
      "method": "Synthetischer spezifischer Jahresertrag, keine externe Abfrage.",
      "license": null,
      "attribution": "Beispieldaten, keine realen Projektinformationen",
      "documentRef": null
    },
    {
      "id": "DEMO_SOURCE_CONSUMPTION_SELF_USE",
      "origin": "USER",
      "provider": "Synthetischer UI-Prüfdatensatz",
      "dataset": "Gateway Analytics Fixture",
      "version": "fixture-1",
      "sourceDate": "2026-09-05T08:00:00Z",
      "retrievedAt": null,
      "method": "Synthetische Jahresverbrauchsangabe. Zeitliche Passung noch ungeprüft.",
      "license": null,
      "attribution": "Beispieldaten, keine realen Projektinformationen",
      "documentRef": null
    },
    {
      "id": "DEMO_SOURCE_DECISION_AUTHORITY",
      "origin": "USER",
      "provider": "Synthetischer UI-Prüfdatensatz",
      "dataset": "Gateway Analytics Fixture",
      "version": "fixture-1",
      "sourceDate": "2026-09-05T08:00:00Z",
      "retrievedAt": null,
      "method": "Nutzerauskunft, kein Eigentumsnachweis.",
      "license": null,
      "attribution": "Beispieldaten, keine realen Projektinformationen",
      "documentRef": null
    },
    {
      "id": "DEMO_SOURCE_ROOF_CONDITION",
      "origin": "USER",
      "provider": "Synthetischer UI-Prüfdatensatz",
      "dataset": "Gateway Analytics Fixture",
      "version": "fixture-1",
      "sourceDate": "2026-09-05T08:00:00Z",
      "retrievedAt": null,
      "method": "Ungeprüfte Nutzervermutung zum Dachzustand.",
      "license": null,
      "attribution": "Beispieldaten, keine realen Projektinformationen",
      "documentRef": null
    },
    {
      "id": "DEMO_SOURCE_PROJECT_SCALE",
      "origin": "USER",
      "provider": "Synthetischer UI-Prüfdatensatz",
      "dataset": "Gateway Analytics Fixture",
      "version": "fixture-1",
      "sourceDate": "2026-09-05T08:00:00Z",
      "retrievedAt": null,
      "method": "Fiktiver Partnerfit, keine produktive Mindestgröße.",
      "license": null,
      "attribution": "Beispieldaten, keine realen Projektinformationen",
      "documentRef": null
    },
    {
      "id": "DEMO_SOURCE_READINESS",
      "origin": "USER",
      "provider": "Synthetischer UI-Prüfdatensatz",
      "dataset": "Gateway Analytics Fixture",
      "version": "fixture-1",
      "sourceDate": "2026-09-05T08:00:00Z",
      "retrievedAt": null,
      "method": "Synthetische Projektziel- und Zuständigkeitsangabe.",
      "license": null,
      "attribution": "Beispieldaten, keine realen Projektinformationen",
      "documentRef": null
    },
    {
      "id": "DEMO_SOURCE_DOCUMENTATION",
      "origin": "USER",
      "provider": "Synthetischer UI-Prüfdatensatz",
      "dataset": "Gateway Analytics Fixture",
      "version": "fixture-1",
      "sourceDate": "2026-09-05T08:00:00Z",
      "retrievedAt": null,
      "method": "Zwei von drei aktuell benötigten Unterlagen vorhanden; nicht fachlich geprüft.",
      "license": null,
      "attribution": "Beispieldaten, keine realen Projektinformationen",
      "documentRef": null
    },
    {
      "id": "DEMO_SOURCE_ENERGY_INFRASTRUCTURE",
      "origin": "USER",
      "provider": "Synthetischer UI-Prüfdatensatz",
      "dataset": "Gateway Analytics Fixture",
      "version": "fixture-1",
      "sourceDate": "2026-09-05T08:00:00Z",
      "retrievedAt": null,
      "method": "Fehlende PV ist kein pauschaler Nachteil.",
      "license": null,
      "attribution": "Beispieldaten, keine realen Projektinformationen",
      "documentRef": null
    }
  ],
  "scoreStateExamples": [
    {
      "state": "READY",
      "displayScore": 82,
      "description": "Vollständig bewertbar, ohne ausgewiesene Schätzungen; separate Fixture-Variante."
    },
    {
      "state": "ESTIMATED",
      "displayScore": 82,
      "description": "Vollständig bewertbar; Schätzungen sichtbar."
    },
    {
      "state": "PARTIAL",
      "displayScore": null,
      "description": "Unbekannter Faktor; mögliche Spanne 70-85."
    },
    {
      "state": "NOT_READY",
      "displayScore": null,
      "description": "Standort oder Profil noch nicht festgelegt."
    },
    {
      "state": "SCORING",
      "displayScore": null,
      "description": "Echter initialer Job in Arbeit, keine Prozentbehauptung."
    },
    {
      "state": "STALE",
      "displayScore": 82,
      "description": "Letzte Bewertung sichtbar, geänderte Eingangsdaten."
    },
    {
      "state": "ERROR",
      "displayScore": null,
      "description": "Dienst-/Payloadfehler, Eingaben behalten."
    }
  ]
}


---

# FILE: fixtures/decisions.json
{
  "synthetic": true,
  "decisions": [
    {
      "eventId": "DEC-00001",
      "projectId": "COHORT-00001",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-16T09:27:47Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00002",
      "projectId": "COHORT-00002",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-15T15:38:20Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00003",
      "projectId": "COHORT-00003",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-13T13:25:50Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00004",
      "projectId": "COHORT-00004",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-10T12:26:21Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00005",
      "projectId": "COHORT-00005",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-10T11:35:48Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00006",
      "projectId": "COHORT-00006",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-09T08:14:48Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00007",
      "projectId": "COHORT-00007",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-21T15:32:11Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00008",
      "projectId": "COHORT-00008",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-17T13:03:00Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00009",
      "projectId": "COHORT-00009",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-22T11:29:36Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00010",
      "projectId": "COHORT-00010",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-07T15:49:00Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00011",
      "projectId": "COHORT-00011",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-09T14:59:25Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00012",
      "projectId": "COHORT-00012",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-21T13:03:24Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00013",
      "projectId": "COHORT-00013",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-27T11:36:44Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00014",
      "projectId": "COHORT-00014",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-14T13:10:26Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00015",
      "projectId": "COHORT-00015",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-26T10:38:32Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00016",
      "projectId": "COHORT-00016",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-12T14:00:47Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00017",
      "projectId": "COHORT-00017",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-21T11:41:54Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00018",
      "projectId": "COHORT-00018",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-13T09:42:59Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00019",
      "projectId": "COHORT-00019",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-04T13:47:39Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00020",
      "projectId": "COHORT-00020",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-14T11:50:15Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00021",
      "projectId": "COHORT-00021",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-18T12:57:20Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00022",
      "projectId": "COHORT-00022",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-25T15:35:49Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00023",
      "projectId": "COHORT-00023",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-30T09:52:03Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00024",
      "projectId": "COHORT-00024",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-20T09:00:35Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00025",
      "projectId": "COHORT-00025",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-19T15:48:02Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00026",
      "projectId": "COHORT-00026",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-03T08:28:17Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00027",
      "projectId": "COHORT-00027",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-21T15:26:50Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00028",
      "projectId": "COHORT-00028",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-17T10:34:09Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00029",
      "projectId": "COHORT-00029",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-15T09:06:45Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00030",
      "projectId": "COHORT-00030",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-23T13:51:53Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00031",
      "projectId": "COHORT-00031",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-19T15:50:01Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00032",
      "projectId": "COHORT-00032",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-04T10:51:31Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00033",
      "projectId": "COHORT-00033",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-18T08:58:50Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00034",
      "projectId": "COHORT-00034",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-01T12:46:28Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00035",
      "projectId": "COHORT-00035",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-21T15:53:00Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00036",
      "projectId": "COHORT-00036",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-21T10:34:59Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00037",
      "projectId": "COHORT-00037",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-10T13:41:12Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00038",
      "projectId": "COHORT-00038",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-02T15:25:31Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00039",
      "projectId": "COHORT-00039",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-10T12:56:04Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00040",
      "projectId": "COHORT-00040",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-05T12:55:40Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00041",
      "projectId": "COHORT-00041",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-12T09:20:28Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00042",
      "projectId": "COHORT-00042",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-28T12:37:49Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00043",
      "projectId": "COHORT-00043",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-02T08:49:33Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00044",
      "projectId": "COHORT-00044",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-03T11:02:04Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00045",
      "projectId": "COHORT-00045",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-31T09:00:09Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00046",
      "projectId": "COHORT-00046",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-13T10:01:18Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00047",
      "projectId": "COHORT-00047",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-27T12:48:08Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00048",
      "projectId": "COHORT-00048",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-04T14:58:31Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00049",
      "projectId": "COHORT-00049",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-10T08:13:28Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00050",
      "projectId": "COHORT-00050",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-10T12:05:11Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00051",
      "projectId": "COHORT-00051",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-06T08:52:17Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00052",
      "projectId": "COHORT-00052",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-19T09:33:28Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00053",
      "projectId": "COHORT-00053",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-07T14:39:50Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00054",
      "projectId": "COHORT-00054",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-20T13:10:43Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00055",
      "projectId": "COHORT-00055",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-24T15:36:30Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00056",
      "projectId": "COHORT-00056",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-18T13:36:07Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00057",
      "projectId": "COHORT-00057",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-10T12:22:53Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00058",
      "projectId": "COHORT-00058",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-27T09:53:51Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00059",
      "projectId": "COHORT-00059",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-16T14:36:51Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00060",
      "projectId": "COHORT-00060",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-23T12:57:24Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00061",
      "projectId": "COHORT-00061",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-07T08:16:23Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00062",
      "projectId": "COHORT-00062",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-13T13:27:27Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00063",
      "projectId": "COHORT-00063",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-31T14:05:08Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00064",
      "projectId": "COHORT-00064",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-28T14:31:49Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00065",
      "projectId": "COHORT-00065",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-12T12:19:08Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00066",
      "projectId": "COHORT-00066",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-10T08:54:52Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00067",
      "projectId": "COHORT-00067",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-07T11:06:42Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00068",
      "projectId": "COHORT-00068",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-21T14:00:19Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00069",
      "projectId": "COHORT-00069",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-21T10:30:03Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00070",
      "projectId": "COHORT-00070",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-11T13:40:37Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00071",
      "projectId": "COHORT-00071",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-23T10:11:06Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00072",
      "projectId": "COHORT-00072",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-09T09:23:43Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00073",
      "projectId": "COHORT-00073",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-21T10:27:39Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00074",
      "projectId": "COHORT-00074",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-25T13:58:22Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00075",
      "projectId": "COHORT-00075",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-16T14:42:47Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00076",
      "projectId": "COHORT-00076",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-04T13:38:38Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00077",
      "projectId": "COHORT-00077",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-12T15:55:16Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00078",
      "projectId": "COHORT-00078",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-12T08:07:13Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00079",
      "projectId": "COHORT-00079",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-17T11:41:16Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00080",
      "projectId": "COHORT-00080",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-06T12:41:11Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00081",
      "projectId": "COHORT-00081",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-30T14:54:08Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00082",
      "projectId": "COHORT-00082",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-17T14:47:21Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00083",
      "projectId": "COHORT-00083",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-25T10:00:51Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00084",
      "projectId": "COHORT-00084",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-09T09:37:21Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00085",
      "projectId": "COHORT-00085",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-05T12:33:43Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00086",
      "projectId": "COHORT-00086",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-25T10:43:14Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00087",
      "projectId": "COHORT-00087",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-12T13:12:12Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00088",
      "projectId": "COHORT-00088",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-24T13:48:13Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00089",
      "projectId": "COHORT-00089",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-23T12:26:35Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00090",
      "projectId": "COHORT-00090",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-05T08:49:48Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00091",
      "projectId": "COHORT-00091",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-28T14:13:11Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00092",
      "projectId": "COHORT-00092",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-10T08:21:49Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00093",
      "projectId": "COHORT-00093",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-07T13:54:11Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00094",
      "projectId": "COHORT-00094",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-05T12:35:59Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00095",
      "projectId": "COHORT-00095",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-06T12:06:48Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00096",
      "projectId": "COHORT-00096",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-15T12:09:55Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00097",
      "projectId": "COHORT-00097",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-21T08:57:13Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00098",
      "projectId": "COHORT-00098",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-21T14:08:15Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00099",
      "projectId": "COHORT-00099",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-22T15:11:38Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00100",
      "projectId": "COHORT-00100",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-01T08:11:42Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00101",
      "projectId": "COHORT-00101",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-17T15:00:59Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00102",
      "projectId": "COHORT-00102",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-20T13:09:01Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00103",
      "projectId": "COHORT-00103",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-18T12:23:18Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00104",
      "projectId": "COHORT-00104",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-24T12:52:06Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00105",
      "projectId": "COHORT-00105",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-27T14:22:29Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00106",
      "projectId": "COHORT-00106",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-07T13:00:49Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00107",
      "projectId": "COHORT-00107",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-12T09:16:51Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00108",
      "projectId": "COHORT-00108",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-02T13:12:24Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00109",
      "projectId": "COHORT-00109",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-20T14:54:29Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00110",
      "projectId": "COHORT-00110",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-03T10:57:18Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00111",
      "projectId": "COHORT-00111",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-03T13:32:45Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00112",
      "projectId": "COHORT-00112",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-16T15:55:09Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00113",
      "projectId": "COHORT-00113",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-21T10:55:32Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00114",
      "projectId": "COHORT-00114",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-14T12:34:43Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00115",
      "projectId": "COHORT-00115",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-09T14:31:24Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00116",
      "projectId": "COHORT-00116",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-13T11:15:27Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00117",
      "projectId": "COHORT-00117",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-19T14:03:48Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00118",
      "projectId": "COHORT-00118",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-17T12:13:01Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00119",
      "projectId": "COHORT-00119",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-24T13:22:39Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00120",
      "projectId": "COHORT-00120",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-24T10:53:31Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00121",
      "projectId": "COHORT-00121",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-05T09:08:41Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00122",
      "projectId": "COHORT-00122",
      "decision": "ACCEPTED",
      "occurredAt": "2026-01-18T11:13:35Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00123",
      "projectId": "COHORT-00123",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-23T08:46:08Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00124",
      "projectId": "COHORT-00124",
      "decision": "ACCEPTED",
      "occurredAt": "2026-03-08T11:30:45Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00125",
      "projectId": "COHORT-00125",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-07T10:40:41Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00126",
      "projectId": "COHORT-00126",
      "decision": "ACCEPTED",
      "occurredAt": "2026-02-27T11:33:57Z",
      "primaryReasonCode": null,
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00127",
      "projectId": "COHORT-00127",
      "decision": "REJECTED",
      "occurredAt": "2026-01-28T14:55:26Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00128",
      "projectId": "COHORT-00128",
      "decision": "REJECTED",
      "occurredAt": "2026-02-25T09:42:20Z",
      "primaryReasonCode": "OWNERSHIP_AUTHORITY",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00129",
      "projectId": "COHORT-00129",
      "decision": "REJECTED",
      "occurredAt": "2026-02-13T11:46:09Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00130",
      "projectId": "COHORT-00130",
      "decision": "REJECTED",
      "occurredAt": "2026-01-28T14:42:48Z",
      "primaryReasonCode": "LOW_CONSUMPTION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00131",
      "projectId": "COHORT-00131",
      "decision": "REJECTED",
      "occurredAt": "2026-01-26T10:50:35Z",
      "primaryReasonCode": "STRUCTURAL_CONSTRAINT",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00132",
      "projectId": "COHORT-00132",
      "decision": "REJECTED",
      "occurredAt": "2026-03-14T14:29:08Z",
      "primaryReasonCode": "ROOF_CONDITION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00133",
      "projectId": "COHORT-00133",
      "decision": "REJECTED",
      "occurredAt": "2026-01-23T10:17:11Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00134",
      "projectId": "COHORT-00134",
      "decision": "REJECTED",
      "occurredAt": "2026-02-26T12:00:18Z",
      "primaryReasonCode": "ROOF_CONDITION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00135",
      "projectId": "COHORT-00135",
      "decision": "REJECTED",
      "occurredAt": "2026-03-03T14:01:21Z",
      "primaryReasonCode": "STRUCTURAL_CONSTRAINT",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00136",
      "projectId": "COHORT-00136",
      "decision": "REJECTED",
      "occurredAt": "2026-02-06T13:07:55Z",
      "primaryReasonCode": "PROJECT_SCALE_MISMATCH",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "PARTNER_SCOPE_DECISION",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00137",
      "projectId": "COHORT-00137",
      "decision": "REJECTED",
      "occurredAt": "2026-02-05T13:43:25Z",
      "primaryReasonCode": "MISSING_INFORMATION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "INSUFFICIENT_EVIDENCE",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00138",
      "projectId": "COHORT-00138",
      "decision": "REJECTED",
      "occurredAt": "2026-02-14T15:47:19Z",
      "primaryReasonCode": "ROOF_CONDITION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00139",
      "projectId": "COHORT-00139",
      "decision": "REJECTED",
      "occurredAt": "2026-02-19T11:45:40Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00140",
      "projectId": "COHORT-00140",
      "decision": "REJECTED",
      "occurredAt": "2026-01-30T14:16:46Z",
      "primaryReasonCode": "OWNERSHIP_AUTHORITY",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00141",
      "projectId": "COHORT-00141",
      "decision": "REJECTED",
      "occurredAt": "2026-03-09T09:55:12Z",
      "primaryReasonCode": "ROOF_CONDITION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00142",
      "projectId": "COHORT-00142",
      "decision": "REJECTED",
      "occurredAt": "2026-03-02T11:47:28Z",
      "primaryReasonCode": "ECONOMICS",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00143",
      "projectId": "COHORT-00143",
      "decision": "REJECTED",
      "occurredAt": "2026-02-18T09:49:18Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00144",
      "projectId": "COHORT-00144",
      "decision": "REJECTED",
      "occurredAt": "2026-02-16T10:02:44Z",
      "primaryReasonCode": "PROJECT_SCALE_MISMATCH",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "PARTNER_SCOPE_DECISION",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00145",
      "projectId": "COHORT-00145",
      "decision": "REJECTED",
      "occurredAt": "2026-02-15T11:52:16Z",
      "primaryReasonCode": "REGION_OUT_OF_SCOPE",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "PARTNER_SCOPE_DECISION",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00146",
      "projectId": "COHORT-00146",
      "decision": "REJECTED",
      "occurredAt": "2026-02-20T11:52:47Z",
      "primaryReasonCode": "LOW_CONSUMPTION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00147",
      "projectId": "COHORT-00147",
      "decision": "REJECTED",
      "occurredAt": "2026-03-04T14:25:21Z",
      "primaryReasonCode": "REGION_OUT_OF_SCOPE",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "PARTNER_SCOPE_DECISION",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00148",
      "projectId": "COHORT-00148",
      "decision": "REJECTED",
      "occurredAt": "2026-02-05T08:00:45Z",
      "primaryReasonCode": "OTHER",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "Synthetisches sonstiges Prüfhindernis",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00149",
      "projectId": "COHORT-00149",
      "decision": "REJECTED",
      "occurredAt": "2026-02-12T15:18:37Z",
      "primaryReasonCode": "REGION_OUT_OF_SCOPE",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "PARTNER_SCOPE_DECISION",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00150",
      "projectId": "COHORT-00150",
      "decision": "REJECTED",
      "occurredAt": "2026-01-26T11:13:18Z",
      "primaryReasonCode": "PROJECT_SCALE_MISMATCH",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "PARTNER_SCOPE_DECISION",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00151",
      "projectId": "COHORT-00151",
      "decision": "REJECTED",
      "occurredAt": "2026-03-08T09:32:45Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00152",
      "projectId": "COHORT-00152",
      "decision": "REJECTED",
      "occurredAt": "2026-01-28T15:39:59Z",
      "primaryReasonCode": "OWNERSHIP_AUTHORITY",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00153",
      "projectId": "COHORT-00153",
      "decision": "REJECTED",
      "occurredAt": "2026-02-01T14:35:39Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00154",
      "projectId": "COHORT-00154",
      "decision": "REJECTED",
      "occurredAt": "2026-03-10T11:58:50Z",
      "primaryReasonCode": "STRUCTURAL_CONSTRAINT",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00155",
      "projectId": "COHORT-00155",
      "decision": "REJECTED",
      "occurredAt": "2026-01-28T09:54:23Z",
      "primaryReasonCode": "OWNERSHIP_AUTHORITY",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00156",
      "projectId": "COHORT-00156",
      "decision": "REJECTED",
      "occurredAt": "2026-01-31T14:57:10Z",
      "primaryReasonCode": "STRUCTURAL_CONSTRAINT",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00157",
      "projectId": "COHORT-00157",
      "decision": "REJECTED",
      "occurredAt": "2026-02-05T14:59:52Z",
      "primaryReasonCode": "REGION_OUT_OF_SCOPE",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "PARTNER_SCOPE_DECISION",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00158",
      "projectId": "COHORT-00158",
      "decision": "REJECTED",
      "occurredAt": "2026-01-23T08:42:07Z",
      "primaryReasonCode": "OWNERSHIP_AUTHORITY",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00159",
      "projectId": "COHORT-00159",
      "decision": "REJECTED",
      "occurredAt": "2026-01-28T13:33:00Z",
      "primaryReasonCode": "LOW_CONSUMPTION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00160",
      "projectId": "COHORT-00160",
      "decision": "REJECTED",
      "occurredAt": "2026-03-01T11:10:00Z",
      "primaryReasonCode": "ROOF_CONDITION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00161",
      "projectId": "COHORT-00161",
      "decision": "REJECTED",
      "occurredAt": "2026-03-04T14:13:12Z",
      "primaryReasonCode": "OWNERSHIP_AUTHORITY",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00162",
      "projectId": "COHORT-00162",
      "decision": "REJECTED",
      "occurredAt": "2026-03-12T09:27:40Z",
      "primaryReasonCode": "LOW_CONSUMPTION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00163",
      "projectId": "COHORT-00163",
      "decision": "REJECTED",
      "occurredAt": "2026-02-01T11:38:15Z",
      "primaryReasonCode": "PROJECT_SCALE_MISMATCH",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "PARTNER_SCOPE_DECISION",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00164",
      "projectId": "COHORT-00164",
      "decision": "REJECTED",
      "occurredAt": "2026-02-19T14:24:27Z",
      "primaryReasonCode": "OWNERSHIP_AUTHORITY",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00165",
      "projectId": "COHORT-00165",
      "decision": "REJECTED",
      "occurredAt": "2026-03-06T10:09:40Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00166",
      "projectId": "COHORT-00166",
      "decision": "REJECTED",
      "occurredAt": "2026-03-19T09:37:45Z",
      "primaryReasonCode": "PROJECT_SCALE_MISMATCH",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "PARTNER_SCOPE_DECISION",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00167",
      "projectId": "COHORT-00167",
      "decision": "REJECTED",
      "occurredAt": "2026-03-04T10:15:17Z",
      "primaryReasonCode": "ROOF_CONDITION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00168",
      "projectId": "COHORT-00168",
      "decision": "REJECTED",
      "occurredAt": "2026-02-23T13:41:59Z",
      "primaryReasonCode": "STRUCTURAL_CONSTRAINT",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00169",
      "projectId": "COHORT-00169",
      "decision": "REJECTED",
      "occurredAt": "2026-02-10T12:43:23Z",
      "primaryReasonCode": "ROOF_CONDITION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00170",
      "projectId": "COHORT-00170",
      "decision": "REJECTED",
      "occurredAt": "2026-02-12T14:38:12Z",
      "primaryReasonCode": "PROJECT_SCALE_MISMATCH",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "PARTNER_SCOPE_DECISION",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00171",
      "projectId": "COHORT-00171",
      "decision": "REJECTED",
      "occurredAt": "2026-02-19T14:13:21Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00172",
      "projectId": "COHORT-00172",
      "decision": "REJECTED",
      "occurredAt": "2026-02-09T13:09:20Z",
      "primaryReasonCode": "ECONOMICS",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00173",
      "projectId": "COHORT-00173",
      "decision": "REJECTED",
      "occurredAt": "2026-02-12T11:59:11Z",
      "primaryReasonCode": "ROOF_CONDITION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00174",
      "projectId": "COHORT-00174",
      "decision": "REJECTED",
      "occurredAt": "2026-02-28T12:50:58Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00175",
      "projectId": "COHORT-00175",
      "decision": "REJECTED",
      "occurredAt": "2026-03-09T15:41:02Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00176",
      "projectId": "COHORT-00176",
      "decision": "REJECTED",
      "occurredAt": "2026-02-24T12:38:08Z",
      "primaryReasonCode": "GRID_CONSTRAINT",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00177",
      "projectId": "COHORT-00177",
      "decision": "REJECTED",
      "occurredAt": "2026-01-22T11:22:47Z",
      "primaryReasonCode": "LOW_CONSUMPTION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00178",
      "projectId": "COHORT-00178",
      "decision": "REJECTED",
      "occurredAt": "2026-02-11T10:52:39Z",
      "primaryReasonCode": "ROOF_CONDITION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00179",
      "projectId": "COHORT-00179",
      "decision": "REJECTED",
      "occurredAt": "2026-03-06T10:39:42Z",
      "primaryReasonCode": "LOW_CONSUMPTION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00180",
      "projectId": "COHORT-00180",
      "decision": "REJECTED",
      "occurredAt": "2026-02-16T08:57:11Z",
      "primaryReasonCode": "GRID_CONSTRAINT",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00181",
      "projectId": "COHORT-00181",
      "decision": "REJECTED",
      "occurredAt": "2026-03-13T12:10:08Z",
      "primaryReasonCode": "PROJECT_SCALE_MISMATCH",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "PARTNER_SCOPE_DECISION",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00182",
      "projectId": "COHORT-00182",
      "decision": "REJECTED",
      "occurredAt": "2026-02-03T13:15:43Z",
      "primaryReasonCode": "MISSING_INFORMATION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "INSUFFICIENT_EVIDENCE",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00183",
      "projectId": "COHORT-00183",
      "decision": "REJECTED",
      "occurredAt": "2026-01-21T10:18:42Z",
      "primaryReasonCode": "GRID_CONSTRAINT",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00184",
      "projectId": "COHORT-00184",
      "decision": "REJECTED",
      "occurredAt": "2026-02-25T08:51:18Z",
      "primaryReasonCode": "LOW_CONSUMPTION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00185",
      "projectId": "COHORT-00185",
      "decision": "REJECTED",
      "occurredAt": "2026-03-05T09:14:29Z",
      "primaryReasonCode": "OWNERSHIP_AUTHORITY",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00186",
      "projectId": "COHORT-00186",
      "decision": "REJECTED",
      "occurredAt": "2026-02-26T11:50:46Z",
      "primaryReasonCode": "REGION_OUT_OF_SCOPE",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "PARTNER_SCOPE_DECISION",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00187",
      "projectId": "COHORT-00187",
      "decision": "REJECTED",
      "occurredAt": "2026-03-05T10:07:15Z",
      "primaryReasonCode": "GRID_CONSTRAINT",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00188",
      "projectId": "COHORT-00188",
      "decision": "REJECTED",
      "occurredAt": "2026-01-28T14:43:56Z",
      "primaryReasonCode": "GRID_CONSTRAINT",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00189",
      "projectId": "COHORT-00189",
      "decision": "REJECTED",
      "occurredAt": "2026-03-12T12:45:13Z",
      "primaryReasonCode": "GRID_CONSTRAINT",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00190",
      "projectId": "COHORT-00190",
      "decision": "REJECTED",
      "occurredAt": "2026-03-02T12:53:35Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00191",
      "projectId": "COHORT-00191",
      "decision": "REJECTED",
      "occurredAt": "2026-03-19T12:27:21Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00192",
      "projectId": "COHORT-00192",
      "decision": "REJECTED",
      "occurredAt": "2026-03-10T08:46:39Z",
      "primaryReasonCode": "ROOF_CONDITION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00193",
      "projectId": "COHORT-00193",
      "decision": "REJECTED",
      "occurredAt": "2026-01-28T10:52:02Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00194",
      "projectId": "COHORT-00194",
      "decision": "REJECTED",
      "occurredAt": "2026-03-01T09:11:43Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00195",
      "projectId": "COHORT-00195",
      "decision": "REJECTED",
      "occurredAt": "2026-03-11T08:35:47Z",
      "primaryReasonCode": "ROOF_CONDITION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00196",
      "projectId": "COHORT-00196",
      "decision": "REJECTED",
      "occurredAt": "2026-01-22T10:16:13Z",
      "primaryReasonCode": "OWNERSHIP_AUTHORITY",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00197",
      "projectId": "COHORT-00197",
      "decision": "REJECTED",
      "occurredAt": "2026-02-04T11:07:08Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00198",
      "projectId": "COHORT-00198",
      "decision": "REJECTED",
      "occurredAt": "2026-01-21T14:57:40Z",
      "primaryReasonCode": "ROOF_CONDITION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00199",
      "projectId": "COHORT-00199",
      "decision": "REJECTED",
      "occurredAt": "2026-02-19T12:36:49Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00200",
      "projectId": "COHORT-00200",
      "decision": "REJECTED",
      "occurredAt": "2026-03-10T09:09:20Z",
      "primaryReasonCode": "GRID_CONSTRAINT",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00201",
      "projectId": "COHORT-00201",
      "decision": "REJECTED",
      "occurredAt": "2026-02-21T12:37:17Z",
      "primaryReasonCode": "LOW_CONSUMPTION",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00202",
      "projectId": "COHORT-00202",
      "decision": "REJECTED",
      "occurredAt": "2026-03-05T12:12:14Z",
      "primaryReasonCode": "STRUCTURAL_CONSTRAINT",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00203",
      "projectId": "COHORT-00203",
      "decision": "REJECTED",
      "occurredAt": "2026-01-31T09:25:31Z",
      "primaryReasonCode": "ECONOMICS",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00204",
      "projectId": "COHORT-00204",
      "decision": "REJECTED",
      "occurredAt": "2026-02-03T15:30:25Z",
      "primaryReasonCode": "AREA_TOO_SMALL",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00205",
      "projectId": "COHORT-00205",
      "decision": "REJECTED",
      "occurredAt": "2026-01-30T09:24:25Z",
      "primaryReasonCode": "OWNERSHIP_AUTHORITY",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    },
    {
      "eventId": "DEC-00206",
      "projectId": "COHORT-00206",
      "decision": "REJECTED",
      "occurredAt": "2026-01-21T15:30:42Z",
      "primaryReasonCode": "ECONOMICS",
      "secondaryReasonCodes": [],
      "assessmentCertainty": "CONFIRMED",
      "note": "",
      "scoreModelAtDecision": "DEMO-ROOF-1",
      "inputVersionAtDecision": "fixture-1"
    }
  ]
}


---

# FILE: fixtures/pipeline-projects.json
{
  "synthetic": true,
  "asOf": "2026-09-05T08:00:00Z",
  "projects": [
    {
      "projectId": "SNAPSHOT-NEW-001",
      "status": "NEW",
      "statusEnteredAt": "2026-09-04T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-NEW-002",
      "status": "NEW",
      "statusEnteredAt": "2026-09-04T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-NEW-003",
      "status": "NEW",
      "statusEnteredAt": "2026-09-04T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-NEW-004",
      "status": "NEW",
      "statusEnteredAt": "2026-09-04T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-NEW-005",
      "status": "NEW",
      "statusEnteredAt": "2026-09-04T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-NEW-006",
      "status": "NEW",
      "statusEnteredAt": "2026-09-04T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-NEW-007",
      "status": "NEW",
      "statusEnteredAt": "2026-09-04T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-NEW-008",
      "status": "NEW",
      "statusEnteredAt": "2026-09-04T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-001",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-002",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T05:36:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-003",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T03:12:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-004",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T00:48:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-005",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-03T22:24:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-006",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-03T20:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-007",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-03T17:36:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-008",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-009",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-010",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-011",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-012",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-013",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-014",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-015",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-016",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-017",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-018",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-019",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-020",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-021",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-022",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-023",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-INCOMPLETE-024",
      "status": "INCOMPLETE",
      "statusEnteredAt": "2026-08-29T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-SCORING-001",
      "status": "SCORING",
      "statusEnteredAt": "2026-09-05T07:49:55.200000Z",
      "nextAction": {
        "dueAt": "2026-09-04T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-SCORING-002",
      "status": "SCORING",
      "statusEnteredAt": "2026-09-05T07:49:55.200000Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-SCORING-003",
      "status": "SCORING",
      "statusEnteredAt": "2026-09-05T07:49:55.200000Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-001",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-002",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T05:36:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-003",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T03:12:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-004",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-005",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-006",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-007",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-008",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-009",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-010",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-011",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-012",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-013",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-014",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-QUALIFIED-015",
      "status": "QUALIFIED",
      "statusEnteredAt": "2026-09-03T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-001",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-002",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T05:36:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-003",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T03:12:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-004",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T00:48:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-005",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-006",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-007",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-008",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-009",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-010",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-011",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-012",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-013",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-014",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-015",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-016",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-017",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-018",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-019",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-PARTNER_REVIEW-020",
      "status": "PARTNER_REVIEW",
      "statusEnteredAt": "2026-08-30T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-001",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-002",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T05:36:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-003",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T03:12:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-004",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-04T00:48:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-005",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-03T22:24:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-006",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-03T20:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-007",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-03T17:36:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-008",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-03T15:12:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-009",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-010",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-011",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-012",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-013",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-014",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-015",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-016",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-017",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-INFO_REQUESTED-018",
      "status": "INFO_REQUESTED",
      "statusEnteredAt": "2026-08-24T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-ACCEPTED-001",
      "status": "ACCEPTED",
      "statusEnteredAt": "2026-09-01T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-ACCEPTED-002",
      "status": "ACCEPTED",
      "statusEnteredAt": "2026-09-01T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-ACCEPTED-003",
      "status": "ACCEPTED",
      "statusEnteredAt": "2026-09-01T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-ACCEPTED-004",
      "status": "ACCEPTED",
      "statusEnteredAt": "2026-09-01T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-ACCEPTED-005",
      "status": "ACCEPTED",
      "statusEnteredAt": "2026-09-01T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-ACCEPTED-006",
      "status": "ACCEPTED",
      "statusEnteredAt": "2026-09-01T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-ACCEPTED-007",
      "status": "ACCEPTED",
      "statusEnteredAt": "2026-09-01T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-ACCEPTED-008",
      "status": "ACCEPTED",
      "statusEnteredAt": "2026-09-01T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-ACCEPTED-009",
      "status": "ACCEPTED",
      "statusEnteredAt": "2026-09-01T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-ACCEPTED-010",
      "status": "ACCEPTED",
      "statusEnteredAt": "2026-09-01T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-ACCEPTED-011",
      "status": "ACCEPTED",
      "statusEnteredAt": "2026-09-01T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-ACCEPTED-012",
      "status": "ACCEPTED",
      "statusEnteredAt": "2026-09-01T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-DEVELOPMENT-001",
      "status": "DEVELOPMENT",
      "statusEnteredAt": "2026-08-15T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-DEVELOPMENT-002",
      "status": "DEVELOPMENT",
      "statusEnteredAt": "2026-08-15T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-DEVELOPMENT-003",
      "status": "DEVELOPMENT",
      "statusEnteredAt": "2026-08-15T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-DEVELOPMENT-004",
      "status": "DEVELOPMENT",
      "statusEnteredAt": "2026-08-15T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-DEVELOPMENT-005",
      "status": "DEVELOPMENT",
      "statusEnteredAt": "2026-08-15T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-DEVELOPMENT-006",
      "status": "DEVELOPMENT",
      "statusEnteredAt": "2026-08-15T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-DEVELOPMENT-007",
      "status": "DEVELOPMENT",
      "statusEnteredAt": "2026-08-15T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-DEVELOPMENT-008",
      "status": "DEVELOPMENT",
      "statusEnteredAt": "2026-08-15T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-DEVELOPMENT-009",
      "status": "DEVELOPMENT",
      "statusEnteredAt": "2026-08-15T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-CONTRACTED-001",
      "status": "CONTRACTED",
      "statusEnteredAt": "2026-08-19T08:00:00Z",
      "nextAction": {
        "dueAt": "2026-09-07T08:00:00Z",
        "open": true
      }
    },
    {
      "projectId": "SNAPSHOT-CONTRACTED-002",
      "status": "CONTRACTED",
      "statusEnteredAt": "2026-08-19T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-CONTRACTED-003",
      "status": "CONTRACTED",
      "statusEnteredAt": "2026-08-19T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-CONTRACTED-004",
      "status": "CONTRACTED",
      "statusEnteredAt": "2026-08-19T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-CONTRACTED-005",
      "status": "CONTRACTED",
      "statusEnteredAt": "2026-08-19T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REALIZED-001",
      "status": "REALIZED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REALIZED-002",
      "status": "REALIZED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REALIZED-003",
      "status": "REALIZED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REALIZED-004",
      "status": "REALIZED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-001",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-002",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-003",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-004",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-005",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-006",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-007",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-008",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-009",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-010",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-011",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-012",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-013",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-014",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-015",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-016",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-017",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-018",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-019",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-020",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-021",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    },
    {
      "projectId": "SNAPSHOT-REJECTED-022",
      "status": "REJECTED",
      "statusEnteredAt": "2026-08-16T08:00:00Z",
      "nextAction": null
    }
  ]
}


---

# FILE: VALIDATION-RESULTS.json
{
  "generatedAt": "2026-09-06",
  "scope": "Design-data consistency and token contrast; no implemented app or browser test",
  "checks": [
    {
      "name": "Nine factors, weights 100, sum 82",
      "pass": true,
      "detail": ""
    },
    {
      "name": "All factor contributions in their ranges",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Partial score 70-85, no scalar or class",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Evidence coverage independent of fields",
      "pass": true,
      "detail": ""
    },
    {
      "name": "All class boundaries",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Round half up once",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Exactly eleven workflow statuses",
      "pass": true,
      "detail": ""
    },
    {
      "name": "All transition targets valid",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Reopening explicit; realized terminal",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Unique journey, decision and snapshot project IDs",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Every reached milestone within H180",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Mature cohort as of 05 Sep 2026",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Funnel aggregates from 10000 raw journeys",
      "pass": true,
      "detail": "[10000, 1200, 720, 360, 252, 126, 90, 45, 18]"
    },
    {
      "name": "Funnel monotone",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Stage reach times ordered",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Stage conversions recompute exactly",
      "pass": true,
      "detail": ""
    },
    {
      "name": "First partner decisions 126 accept + 80 reject",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Qualification rate 252/360",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Acceptance denominator excludes 46 pending",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Win rate 45/(45+80), 127 unresolved",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Rejection reasons recompute from snapshots",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Exactly one primary reason per rejection",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Other reason has explanatory text",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Pipeline 140 projects matches raw snapshot",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Actual due dates drive overdue/action counts",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Energy interval and unavailable derived metrics",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Known zero / unknown / N-A / zero denominator distinct",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Fifteen component contracts include all requested fields",
      "pass": true,
      "detail": ""
    },
    {
      "name": "Contrast: Primary on canvas",
      "pass": true,
      "detail": "15.88:1"
    },
    {
      "name": "Contrast: Secondary on canvas",
      "pass": true,
      "detail": "9.60:1"
    },
    {
      "name": "Contrast: Secondary on surface",
      "pass": true,
      "detail": "7.97:1"
    },
    {
      "name": "Contrast: Amber on canvas",
      "pass": true,
      "detail": "9.31:1"
    },
    {
      "name": "Contrast: Text on amber",
      "pass": true,
      "detail": "9.31:1"
    },
    {
      "name": "Contrast: Control boundary on surface",
      "pass": true,
      "detail": "4.38:1"
    },
    {
      "name": "Contrast: Control boundary on canvas",
      "pass": true,
      "detail": "5.28:1"
    }
  ],
  "passed": 35,
  "total": 35,
  "contrast": [
    {
      "pair": "Primary on canvas",
      "ratio": 15.88,
      "target": 4.5
    },
    {
      "pair": "Secondary on canvas",
      "ratio": 9.6,
      "target": 4.5
    },
    {
      "pair": "Secondary on surface",
      "ratio": 7.97,
      "target": 4.5
    },
    {
      "pair": "Amber on canvas",
      "ratio": 9.31,
      "target": 4.5
    },
    {
      "pair": "Text on amber",
      "ratio": 9.31,
      "target": 4.5
    },
    {
      "pair": "Control boundary on surface",
      "ratio": 4.38,
      "target": 3
    },
    {
      "pair": "Control boundary on canvas",
      "ratio": 5.28,
      "target": 3
    }
  ]
}


---

# FILE: QA-REPORT.md
# Project Gateway · Analytics Handoff QA

Abgeschlossen am 06.09.2026 · geprüfter Datensatzstand 05.09.2026

## Tatsächlich geprüft

**35 von 35 automatisierten Daten-/Kontrastprüfungen bestanden.** Einzelresultate: VALIDATION-RESULTS.json. Die Prüfungen betreffen die Konsistenz dieses Handoffs und seiner synthetischen Daten. Eine produktive App, echte Browserinteraktionen oder reale technische Eignungsbewertungen wurden nicht getestet, weil sie in diesem Schritt nicht implementiert wurden.

| Prüfung | Ergebnis / Evidenz |
| --- | --- |
| Faktoren | Neun Faktoren, Maximalgewichte 100, Beiträge exakt 82; jeder Beitrag im erlaubten Bereich |
| Partial Score | Bekannte Beiträge 70, unbekanntes Gewicht 15, mögliche Spanne 70–85; kein Punktwert oder Klassenlabel |
| Klassengrenzen | 0/49/50/64/65/79/80/100 sowie einmalige .5-Aufrundung geprüft |
| Vollständigkeit | Felder 16/20, Unterlagen 2/3 und Score-Abdeckung 85/100 bleiben unterschiedliche Größen |
| Status | Alle elf IDs, gültige Übergangszielwerte, explizite Wiederaufnahme und terminale Realisierung |
| Funnel | Alle neun Stufen aus 10.000 Roh-Journeys rekonstruiert; monoton, eindeutige IDs, geordnete Events und H180 eingehalten |
| Reife | Letzte eingeschlossene Journey hat ihren 180-Tage-Horizont bis zum Datenstand vollständig durchlaufen |
| Partnerquote | 126 Erstannahmen + 80 Erstablehnungen = 206 Entscheidungen; 46 Entscheidungen offen |
| Win Rate | 45 / (45 + 80) = 36,0 %; 127 qualifizierte Fälle ohne geschlossenen Ausgang |
| Rejections | Primärgründe addieren sich auf 80; aus den Entscheidungssnapshots rekonstruiert; OTHER enthält Text |
| Pipeline | 140 eindeutige Projekte; alle Statusbestände, offenen und überfälligen Aktionen aus Rohdaten rekonstruiert |
| Energie | Vergleichbare Jahreswerte, explizite Spanne 350–450, unbekannte Eigenverbrauchs-/Speicheraussage bleibt null |
| Datenzustände | Bekannte 0, unbekannt, nicht anwendbar, leerer Quotennenner und veraltete Bewertung getrennt |
| Komponenten | Alle 15 Verträge enthalten sämtliche verlangten Einzelkriterien |

## Kontrastprüfung

| Paar | Verhältnis | Ziel |
| --- | --- | --- |
| Primärtext / Canvas | 15,88:1 | ≥4,5:1 |
| Sekundärtext / Canvas | 9,60:1 | ≥4,5:1 |
| Sekundärtext / Surface | 7,97:1 | ≥4,5:1 |
| Amber / Canvas bzw. Text auf Amber | 9,31:1 | ≥4,5:1 |
| Control-Grenze / Surface | 4,38:1 | ≥3:1 |
| Control-Grenze / Canvas | 5,28:1 | ≥3:1 |

Subtile Trenner #3B474F sind keine alleinigen notwendigen Control-Grenzen. Alle Zustände besitzen Text; Schraffur, Kontur und Icon sind redundant. Diese Tokenprüfung ersetzt keine spätere Prüfung des gerenderten Produkts.

## Visuelle Kontrolle

Die neun exakten Referenzen wurden als PNG betrachtet; die SVGs enthalten dieselben proportionalen Geometrien. Das PDF wurde mit Poppler gerendert und anschließend auf Textüberläufe, Tabellenabstände, sichtbare Quellenzeilen und lesbare Zustände geprüft. Seitenanzahl: 24. Die PDF ist eine visuelle Review-Fassung; semantische Text-/Datenäquivalente stehen in Markdown, JSON und CSV zur Verfügung. Es wird keine PDF/UA-Zertifizierung behauptet.

Die generierte Desktop-/Mobile-Tafel ist ausdrücklich **keine** präzise Chart-/Geodatenreferenz. Einzelne Balkenlängen, Bildbeschriftungen, Maßstäbe oder Koordinaten können illustrativ abweichen. Verbindlich sind die exakten SVGs, Datenwerte und Komponentenverträge. Die genaue mobile Score-Referenz zeigt einen ehrlichen Ergänzungsschritt, statt eine fachliche Freigabe zu suggerieren.

Art-Direction-Prüfung: durchgehende Atlas-Farben, schmale markante Headlines, direkte Datenbeschriftung, zusammenhängende Arbeitsliste/Akte; keine SaaS-Kartenwüste, grüne Gradients, Solar-Stockmotive, Orbs oder dekorative Kreisdiagramme.

## Abdeckung der elf Nutzeranforderungen

| Anforderung | Normative Definition / sichtbare Referenz |
| --- | --- |
| 1 Project Score | Hauptspec §2; V01–V03; Figures 01/02/07 |
| 2 Standort-/Objektpotenzial | §4; V04/V05; Figure 08 und Desktop-/Mobile-Komposition |
| 3 Energieprofil | §5; V06; Figure 03 |
| 4 Partner-Dashboard | §6; V07; Figure 09 |
| 5 Pipeline | §7; V08; Figure 04; Übergangsmatrix im Datenvertrag |
| 6 Projektakte | §8; V09/V10/V14; PDF Aktenarchitektur und Partneransicht |
| 7 Rejection / Learning | §9; V11; Figure 05; Reason-Katalog und Snapshots |
| 8 Funnel / Business Analytics | §10; V12/V13; Figure 06; Brüche/Quoten im PDF |
| 9 Mobile | §11; Desktop-/Mobile-Regeln aller Verträge; Figure 07 und Komposition |
| 10 Prinzipien | §12/13; Tokens, Accessibility, Unsicherheit und ausgeschlossene Charts |
| 11 Codex-Handoff | Hauptspec, alle 15 Komponentenverträge, JSON-Verträge/Prüfdaten und README |

## Konkrete Abnahme nach Implementierung

- Score-Boundaries, N/A, unbekannt, veraltet, Partial-Intervall und bestätigten Blocker im tatsächlich gerenderten Produkt prüfen. Kein anderer Prozessstatus allein wegen Score-Neuberechnung.
- Proportionen der neun Faktortracks auf gemeinsamer Punkteachse; Summe, Quelle und Regeln ohne Hover zugänglich.
- 390×844 und 360×800 Portrait, 844×390 Karten-Querformat, 320 px Reflow und 200 % Textzoom; Bildschirmtastatur, Safe Areas, Fokus und Rücknavigation prüfen.
- Karte mit mehreren Kandidaten, fehlender Geometrie, verweigerter Ortung, unzugänglichem Anbieter und fehlender Lizenzquelle; nie eine falsche Immobilie anzeigen.
- Partnerkontext wechseln, Berechtigungen serverseitig prüfen, Aktualisierung während Lesen/Entscheidung, 409-Konflikt und doppelte Submit-Auslösung behandeln.
- Dokumente vorhanden versus fachlich geprüft; Teilantworten; abgelehntes Projekt wiederaufnehmen; historischen Entscheidungssnapshot erhalten.
- Analytics mit leerem Nenner, unkodierten Gründen, Mehrfachgründen, Dubletten/Rückzügen, unreifer Kohorte, Mess-/Attributionslücken und abweichendem Partner-Scope prüfen.
- Tastatur und Screenreader mit echten semantischen Elementen testen; Quellen-/Filter-Sheets geben Fokus zurück. Kein essenzieller Text nur im Canvas.

## Produktive Anschlussstellen

Fachlich verantwortete Modellgewichte und Regeln, echte Partnerkriterien, lizenzierte Karten-/Solardaten, Dokumentenzugriffe und nachvollziehbare Prüfprozesse, gültige Tracking-/Attributionsgrundlage und backendseitige Mandantentrennung. Das sind konkrete Integrations-/Betriebsaufgaben, keine Begründung für erfundene Demo-Ergebnisse in einem Live-Produkt.


---

# FILE: README.md
# Project Gateway · Atlas Analytics Handoff

Version 1.0 · finalisiert am 06.09.2026 · Variante 1 bleibt verbindlich

Dieses Paket definiert die datengetriebenen Bestandteile von Project Gateway für die anschließende Codex-Implementierung. Es ergänzt den Product-Design-Vertrag. Es enthält keinen produktiven Anwendungscode, keine neue Designrichtung und keine angebundenen Live-Daten.

## Schnellstart

1. **Project-Gateway-Analytics-Handoff.pdf**: 24-seitiger visueller Überblick mit Score, Karte, Energieprofil, Partnerarbeit, Pipeline, Mobile und internen Analysen.
2. **Project-Gateway-Visualization-Specification.md**: normativer fachlicher Vertrag. Hier stehen Berechnungsbedeutung, Scorezustände, Statusmodell, Reason Codes und Kennzahldefinitionen.
3. **COMPONENT-CONTRACTS.md**: vollständiger UX-/Implementationsvertrag für 15 Komponenten, inklusive Desktop, Mobile, Interaktion und aller verlangten Daten-/UI-Zustände.
4. **DATA-CONTRACT.json**: maschinenlesbarer Datenvertrag mit Feldbedeutungen, Einheiten, Nullsemantik, Enums und erlaubten Prozessübergängen. Dies ist eine Design-Vertragsstruktur, kein ausführbarer JSON-Schema-Validator oder fertiger API-Client.
5. **EXAMPLE-DATA.json**: konsistente Beispiele für 82 Punkte, Partial-Score 70–85, Energieintervalle, Pipeline, Ablehnungen, Funnel, Quellen und Grenzfälle.
6. **QA-REPORT.md / VALIDATION-RESULTS.json**: tatsächlich geprüfte Konsistenz und konkrete spätere Abnahmefälle.

## Referenzen und Daten

- `figures/`: neun präzise Diagramm-/UI-Referenzen, jeweils SVG und PNG. SVG-Pfade bewahren Typografie und proportionale Geometrie. `chart-data.csv` ist das einfache Datenäquivalent.
- `references/Atlas-Original-Variante-1.png`: gewählte Art Direction.
- `references/Atlas-Analytics-Desktop-Mobile.png`: generierte Kompositionsreferenz für Desktop und beide Mobile-Orientierungen; keine messgenaue Geodaten-/Chartquelle.
- `fixtures/`: 10.000 synthetische Journeys, 206 Erstentscheidungen und ein davon getrennter operativer Snapshot mit 140 Projekten. Diese schlanken Analytics-Ledger dienen der Aggregationsprüfung; sie sind keine vollständigen produktiven API-Responses.
- `VISUAL-MANIFEST.json`: Zweck, Quellen, Bedeutung, Grenzen und mobile Zuordnung jeder Grafik.

Alle Prüfdaten sind synthetisch und deterministisch mit Seed 20260905 aufgebaut. Datensatzstand ist 05.09.2026; die Fertigstellung des Handoffs am 06.09.2026 verändert diese Vergleichsbasis nicht. Es wurde keine reale Immobilienadresse analysiert und kein externer Solardienst abgefragt.

## Rangfolge bei der Umsetzung

Die ausgewählte Atlas-Art-Direction und bereits konkretisierte Product-Design-Tokens bleiben für die visuelle Identität verbindlich. Für analytische Semantik gelten die jüngste Nutzeranforderung, die fachliche Spezifikation und die Komponentenverträge. Exakte Datenwerte/Diagrammgeometrien gehen generierten Layoutbildern vor. Versehentliche Bildtexte, illustrative Maßstäbe, Platzhalterkoordinaten oder uneinheitliche Balkenlängen werden nicht in die Anwendung übernommen.

Das 82-Punkte-Beispiel verwendet die UI-Testgewichte 15/15/20/15/10/5/10/5/5 und Beiträge 13/12/18/15/6/4/7/3/4. Diese Gewichte sind ausdrücklich **kein fachlich validiertes Produktionsmodell**. Das UI verarbeitet versionierte Profile und Regeln; produktive Werte kommen vom fachlich verantwortlichen Modell-/Partnerprozess.

## Konkret bauen

MVP: erklärbarer Score, Faktorbeiträge, Befunde, Datenherkunft, Vollständigkeit, analytische Standortkarte mit Fallback, Jahresenergieprofil, Partnerarbeitsliste, Pipeline, Projektakte und strukturierte Partnerentscheidungen. Rejection-Erfassung und Analytics-Events werden von Beginn an vorgesehen.

Später intern: Rejection-Aggregationen, Journey-Funnel und definierte Projektquoten. Die UX-/Datenverträge dafür sind enthalten; diese Module werden nicht als bereits verfügbare Funktionen ausgegeben.

Bewusst nicht nötig: Tachos/Donuts/Radar, dekorative 3D-Charts, KPI-Kachelwände, elfspaltiges Kanban, Solar-Heatmaps ohne Daten, erfundene Lastkurven, Speicheroptimierung ohne Daten und automatisches Score-Nachtraining.

## Codex-Arbeitsauftrag

Implementiere die analytischen Komponenten nach diesen Verträgen innerhalb der bestehenden Atlas-Shell. Verwende zunächst explizit aktivierte Prüfdaten für die UI-Abnahme und die definierten Fallbacks für noch nicht angebundene Dienste. Erhalte die visuelle Identität. Berechne Priorität, Datenbasis, Vollständigkeit und Prozessstatus getrennt. Übernimm keine fachlichen Produktionsgewichte aus dem Beispiel. Prüfe anschließend die in QA-REPORT.md genannten tatsächlichen Browser-, Mobile- und Zustandsfälle.

Dieser Arbeitsauftrag beschreibt den nächsten Implementationsschritt; während der Erstellung dieses Pakets wurde er nicht produktiv ausgeführt.


---

# FILE: VISUAL-MANIFEST.json
{
  "version": "1.0",
  "artDirection": "Atlas / selected Variante 1",
  "allExampleDataSynthetic": true,
  "renderMethod": "Deterministic plotting, SVG paths and PNG exports; no application code",
  "references": [
    {
      "id": "01-score-contributions",
      "svg": "figures/01-score-contributions.svg",
      "png": "figures/01-score-contributions.png",
      "component": "ScoreSummary / ScoreFactorBreakdown",
      "userQuestion": "Warum ergibt die Bewertung 82 Punkte?",
      "visualizationType": "Weighted horizontal point contributions",
      "dataSource": "EXAMPLE-DATA.json#/scoreFull",
      "meaningAndLimits": "Common maximum axis 20; row maxima 15/15/20/15/10/5/10/5/5; sum 82.",
      "primarySpecialist": "Statistical & uncertainty",
      "freshPass": "local specialist pass; exact values and composition visually checked",
      "mobileBehavior": "390 portrait: label/value, bar below, rules disclosed",
      "accessibility": "Direct labels plus component text contract and chart-data.csv; essential information independent of hover/color",
      "scope": "synthetic design acceptance fixture",
      "sourceDate": "2026-09-05"
    },
    {
      "id": "02-score-partial",
      "svg": "figures/02-score-partial.svg",
      "png": "figures/02-score-partial.png",
      "component": "ScoreSummary PARTIAL",
      "userQuestion": "Welche Punktespanne erlaubt die unvollständige Datenbasis?",
      "visualizationType": "Known contribution plus unknown-point interval",
      "dataSource": "EXAMPLE-DATA.json#/scorePartial",
      "meaningAndLimits": "70 known + [0,15] unknown = [70,85]; no scalar score or class.",
      "primarySpecialist": "Statistical & uncertainty",
      "freshPass": "local specialist pass; exact values and composition visually checked",
      "mobileBehavior": "Range, missing factor, next action before any long details",
      "accessibility": "Direct labels plus component text contract and chart-data.csv; essential information independent of hover/color",
      "scope": "synthetic design acceptance fixture",
      "sourceDate": "2026-09-05"
    },
    {
      "id": "03-energy-profile",
      "svg": "figures/03-energy-profile.svg",
      "png": "figures/03-energy-profile.png",
      "component": "EnergyProfile",
      "userQuestion": "Welche Jahresgrößen sind belegt und was bleibt offen?",
      "visualizationType": "Zero-based annual comparisons plus range segment",
      "dataSource": "EXAMPLE-DATA.json#/energy",
      "meaningAndLimits": "620 and 180 MWh/year; estimated 350-450 range. No balance or self-use inference.",
      "primarySpecialist": "Statistical & uncertainty",
      "freshPass": "local specialist pass; exact values and composition visually checked",
      "mobileBehavior": "Name/value/source per row; no hover; keep compatible periods",
      "accessibility": "Direct labels plus component text contract and chart-data.csv; essential information independent of hover/color",
      "scope": "synthetic design acceptance fixture",
      "sourceDate": "2026-09-05"
    },
    {
      "id": "04-pipeline-overview",
      "svg": "figures/04-pipeline-overview.svg",
      "png": "figures/04-pipeline-overview.png",
      "component": "PipelineOverview",
      "userQuestion": "Wo warten echte Aufgaben zu lange?",
      "visualizationType": "Ordered current-stage table with bars and ages",
      "dataSource": "fixtures/pipeline-projects.json",
      "meaningAndLimits": "140 current projects; 8 overdue in INFO_REQUESTED; age is current median, not throughput.",
      "primarySpecialist": "Dashboards & operational workspaces",
      "freshPass": "local specialist pass; exact values and composition visually checked",
      "mobileBehavior": "Stage/count row with age/actions below; terminal cases separated",
      "accessibility": "Direct labels plus component text contract and chart-data.csv; essential information independent of hover/color",
      "scope": "synthetic design acceptance fixture",
      "sourceDate": "2026-09-05"
    },
    {
      "id": "05-rejection-reasons",
      "svg": "figures/05-rejection-reasons.svg",
      "png": "figures/05-rejection-reasons.png",
      "component": "RejectionInsights",
      "userQuestion": "Welche primären Gründe sind dokumentiert?",
      "visualizationType": "Descending horizontal frequency bars",
      "dataSource": "fixtures/decisions.json",
      "meaningAndLimits": "One primary reason per 80 first rejections; secondary reasons and exclusions separate.",
      "primarySpecialist": "Statistical & strategy",
      "freshPass": "local specialist pass; exact values and composition visually checked",
      "mobileBehavior": "Vertical name/count/share rows; filter sheet; denominator visible",
      "accessibility": "Direct labels plus component text contract and chart-data.csv; essential information independent of hover/color",
      "scope": "synthetic design acceptance fixture",
      "sourceDate": "2026-09-05"
    },
    {
      "id": "06-cohort-funnel",
      "svg": "figures/06-cohort-funnel.svg",
      "png": "figures/06-cohort-funnel.png",
      "component": "CohortFunnel",
      "userQuestion": "Wie weit kommen dieselben messbaren Journeys?",
      "visualizationType": "Ordered cohort table with counts, rate and non-reachers",
      "dataSource": "fixtures/journeys.json",
      "meaningAndLimits": "Jan-Feb 2026, H180, 10000 journeys; no status-snapshot mixing; 46 pending partner decisions.",
      "primarySpecialist": "Statistical & strategy",
      "freshPass": "local specialist pass; exact values and composition visually checked",
      "mobileBehavior": "Count, prior-stage rate, caveat per stage; same grain and horizon",
      "accessibility": "Direct labels plus component text contract and chart-data.csv; essential information independent of hover/color",
      "scope": "synthetic design acceptance fixture",
      "sourceDate": "2026-09-05"
    },
    {
      "id": "07-mobile-score",
      "svg": "figures/07-mobile-score.svg",
      "png": "figures/07-mobile-score.png",
      "component": "Mobile ScoreSummary composition",
      "userQuestion": "Welche Einordnung und nächste Aktion sind sofort nötig?",
      "visualizationType": "Exact 390x844 UI reference",
      "dataSource": "EXAMPLE-DATA.json#/scoreFull",
      "meaningAndLimits": "Score, provisional basis, unresolved questions and missing input remain visible.",
      "primarySpecialist": "Accessibility & inclusive visualization",
      "freshPass": "local specialist pass; exact values and composition visually checked",
      "mobileBehavior": "Primary portrait state; secondary factors and large map disclosed",
      "accessibility": "Direct labels plus component text contract and chart-data.csv; essential information independent of hover/color",
      "scope": "synthetic design acceptance fixture",
      "sourceDate": "2026-09-05"
    },
    {
      "id": "08-site-layer-reference",
      "svg": "figures/08-site-layer-reference.svg",
      "png": "figures/08-site-layer-reference.png",
      "component": "SiteEvidenceMap layer mechanics",
      "userQuestion": "Welches Gebäude und welche verfügbare Teilfläche sind gemeint?",
      "visualizationType": "Schematic geometry/layer diagram",
      "dataSource": "EXAMPLE-DATA.json#/site",
      "meaningAndLimits": "Not georeferenced, no real coordinates, no scale or metric area inference.",
      "primarySpecialist": "Geospatial & cartographic",
      "freshPass": "local specialist pass; exact values and composition visually checked",
      "mobileBehavior": "Passive preview then dedicated map view; explicit zoom/fit controls",
      "accessibility": "Direct labels plus component text contract and chart-data.csv; essential information independent of hover/color",
      "scope": "synthetic design acceptance fixture",
      "sourceDate": "2026-09-05"
    },
    {
      "id": "09-partner-workspace",
      "svg": "figures/09-partner-workspace.svg",
      "png": "figures/09-partner-workspace.png",
      "component": "PartnerWorkspace / ProjectDossier",
      "userQuestion": "Welches Projekt bearbeite ich jetzt und warum?",
      "visualizationType": "Exact 1440x1024 operational composition",
      "dataSource": "EXAMPLE-DATA.json#/scoreFull; illustrative queue subset",
      "meaningAndLimits": "Overdue action, received response, new high-priority project, other due work, waiting. Selected project remains stable.",
      "primarySpecialist": "Dashboards & operational workspaces",
      "freshPass": "local specialist pass; exact values and composition visually checked",
      "mobileBehavior": "Separate list and dossier states; preserve filters and scroll on back",
      "accessibility": "Direct labels plus component text contract and chart-data.csv; essential information independent of hover/color",
      "scope": "synthetic design acceptance fixture",
      "sourceDate": "2026-09-05"
    }
  ],
  "compositionOnly": [
    {
      "path": "references/Atlas-Original-Variante-1.png",
      "role": "selected visual identity",
      "exactDataReference": false
    },
    {
      "path": "references/Atlas-Analytics-Desktop-Mobile.png",
      "role": "generated desktop/mobile placement board",
      "exactDataReference": false,
      "limitations": "Illustrative chart geometry, coordinates, scale and satellite attribution must not be copied as analytical evidence."
    }
  ]
}


---

# FILE: figures/chart-data.csv
figure,category,value,maximum_or_upper,unit
score,Nutzbare Fläche,13,15,points
score,Solar-/Ertragspotenzial,12,15,points
score,Verbrauch / Eigenverbrauch,18,20,points
score,Entscheidungssituation,15,15,points
score,Dachzustand,6,10,points
score,Projektgröße,4,5,points
score,Projektbereitschaft,7,10,points
score,Unterlagen,3,5,points
score,Energieinfrastruktur,4,5,points
pipeline,Neu,8,,projects
pipeline,Angaben fehlen,24,,projects
pipeline,Bewertung läuft,3,,projects
pipeline,Vorqualifiziert,15,,projects
pipeline,In Prüfung,20,,projects
pipeline,Rückfrage offen,18,,projects
pipeline,Übernommen,12,,projects
pipeline,In Entwicklung,9,,projects
pipeline,Vertrag geschlossen,5,,projects
pipeline,Realisiert,4,,projects
pipeline,Abgelehnt,22,,projects
rejection,Fläche zu klein,18,80,rejections
rejection,Dachzustand ungeeignet,12,80,rejections
rejection,Eigentum / Entscheidung,10,80,rejections
rejection,Verbrauch zu gering,8,80,rejections
rejection,Projektgröße unpassend,7,80,rejections
rejection,Netzsituation,7,80,rejections
rejection,Statik,6,80,rejections
rejection,Region außerhalb Fokus,5,80,rejections
rejection,Wirtschaftlichkeit,4,80,rejections
rejection,Informationen unvollständig,2,80,rejections
rejection,Sonstiges,1,80,rejections
funnel,Messbare Besuche,10000,,journeys
funnel,Standortcheck gestartet,1200,,journeys
funnel,Standortcheck abgeschlossen,720,,journeys
funnel,Projekt eingereicht,360,,journeys
funnel,Vorqualifiziert,252,,journeys
funnel,Partner angenommen,126,,journeys
funnel,Projektentwicklung,90,,journeys
funnel,Vertrag,45,,journeys
funnel,Realisiert,18,,journeys
energy,Jährlicher Stromverbrauch,620,,MWh/year
energy,Vorhandene Eigenerzeugung,180,,MWh/year
energy,Zusätzliches Erzeugungspotenzial,350,450,MWh/year
