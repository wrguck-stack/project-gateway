# Project Gateway · Vollständiger Product-Design-Handoff

Atlas / verbindliche Variante 1 · Eigenständiger Export 1.0 · 06.09.2026

Dieser Volltext wurde jetzt aus dem vorhandenen Product-Design-Stand vervollständigt. Er ist kein als schon früher ausgegeben behauptetes Chat-Transkript. Die Originalquellen und ergänzten Inhalte sind im Herkunftskapitel dokumentiert.


---

# Project Gateway · Product Design Export · Atlas Variante 1

Export 1.0 · erstellt am 06.09.2026

Dies ist der **eigenständige Product-Design-Export** für die ausgewählte Variante 1 / Atlas. Er wurde jetzt aus den tatsächlich vorhandenen Product-Design-Quellen vervollständigt. Ein vollständiges Product-Design-ZIP lag zuvor noch nicht vor. Herkunft und ergänzte Inhalte sind ausdrücklich dokumentiert.

## Inhalt

| Datei | Inhalt |
| --- | --- |
| 01-DESIGN-CONTRACT.md | Atlas-Identität, Farb-/Schrift-/Spacing-/Grid-Vorgaben, vollständige Landingpage mit Texten/FAQ, zehn Schritte des Standortchecks, Upload und Zusammenfassung |
| 02-SCREEN-FLOWS.md | Analyse, Project-Score-Screen, Projektübermittlung, Bestätigung, Partner-Dashboard, Pipeline, Projektakte und Partnerentscheidungen |
| 03-COMPONENTS-RESPONSIVE-STATES.md | Komponentenbibliothek, Eingaberegeln, eigenständige Mobile-/Tablet-Zustände, Motion, Loading/Empty/Error/Conflict/Offline und Accessibility |
| 04-CODEX-IMPLEMENTATION-SPEC.md | Seiten/Routen, Komponentenkomposition, Persistenz, Integrationsgrenzen, genaue Interaktionen, Do's/Don'ts und spätere Abnahme |
| 05-DESIGN-TOKENS.json | Maschinenlesbare Farb-, Typografie-, Spacing-, Grid-, Radius-, Control-, Motion- und Uploadwerte |
| 06-SOURCE-AND-ANALYTICS-ALIGNMENT.md | Was bereits vorlag, was jetzt ergänzt wurde und welche Vorgaben bei Abweichungen gelten |
| 07-EXPORT-QA.md | Exportabdeckung, tatsächlich ausgeführte Kontrollen und Grenzen der Referenzen |
| Project-Gateway-Product-Design-Atlas-Full-Handoff.md | Vollständiger zusammengeführter Text aller Handoff-Dokumente einschließlich Token-Daten |
| VISUAL-MANIFEST.json | Zuordnung und Herkunft der visuellen Referenzen |
| visuals/ | Fünf ursprüngliche Product-Design-Boards ausschließlich für Atlas |
| references-analytics/ | Drei separat gekennzeichnete vorhandene Analytics-Ansichten als Ergänzung |
| source/ | Unveränderte historische Designbasis und begonnene Detail-Spezifikation |

Der Volltext ist eine bequeme Lesekopie. Bei einer späteren Bearbeitung werden die Einzeldateien und Tokens gepflegt und der Volltext daraus neu zusammengestellt. In diesem Export enthalten beide denselben Stand.

## Mit dem Analytics-Handoff verwenden

Beide Pakete gemeinsam an Codex übergeben. Product Design definiert das Aussehen, die öffentliche Nutzerstrecke, Komponenten und responsive Shells. Analytics definiert Score-Semantik, Datenherkunft, Statusübergänge, Ablehnungsgründe und Kennzahlennenner. Der konkrete Konfliktabgleich in Datei 06 verhindert eine zweite Schrift-/Grid-Welt.

Die Variante 1 wird nicht neu ausgewählt. Die Datenbeispiele sind keine produktive Bewertungsformel; die Oberfläche verwendet reale Integrationen oder die ausdrücklich beschriebenen Fallbacks. Kein produktiver Code, keine Veröffentlichung und kein Versand wurden mit diesem Export ausgeführt.

## Nächster Arbeitsauftrag

Codex liest den vollständigen Product-Design-Vertrag und den vorhandenen Analytics-Handoff, setzt die Atlas-Oberfläche damit um und prüft die tatsächlichen Screens und Interaktionen anhand der enthaltenen Abnahmefälle.


---

# Project Gateway - Design Contract Atlas

Export 1.0 | 06.09.2026 | Visuelle und UX-seitige Definition

Quellenstand: ausgewählte Variante 1, Designbrief und begonnene Detail-Spezifikation vom 05.09.2026. Dieser eigenständige Product-Design-Export wurde am 06.09.2026 vervollständigt. Herkunft und Ergänzungen sind in 06-SOURCE-AND-ANALYTICS-ALIGNMENT.md dokumentiert. Die vollständigen Screens ab Analyse folgen in 02-SCREEN-FLOWS.md.

## 1. Bindung und Produktgrenze

Atlas ist die vom Nutzer verbindlich ausgewählte erste Designrichtung. Maßgeblich sind die dunkle kartografische Arbeitswelt, die markante schmale Schrift, zurückhaltende Amber-Akzente und die Immobilie als visuelles Zentrum. Die neue Ausarbeitung ergänzt fehlende Screens und Zustände innerhalb dieser Identität.

Das Produkt führt gewerbliche Eigentümer, Unternehmen, Landwirtschaft, Immobilienverwalter und Asset Manager von der Adresse zu einer strukturierten Projektvorqualifizierung. Ein benannter Projektentwickler kann die freigegebene Projektakte fachlich prüfen. Project Gateway bleibt eine eigenständige Plattform mit getrenntem Partnerkontext.

Umfang: Landingpage, Standortcheck, Qualifizierung, Analysezustände, Score, Projektübergabe, Partnerpipeline und Projektakte. Kein Monitoring, Stromhandel, Investorenportal, Finanzierung, vollständige Anlagenplanung, Statikberechnung, Solar-CRM oder AI-Chat.

Die Gestaltung ist implementierbar festgelegt. Das Dokument verabschiedet keine fachliche Scoring-Methode. Die im Bild dargestellten 82 Punkte sind ein erklärtes Testbeispiel.

## 2. Unveränderliche visuelle Identität

### 2.1 Flächen, Akzente und Bilder

- Durchgehende dunkle Grundfläche. Abschnitte wechseln über Abstand, Ausrichtung, feine Trennlinien und höchstens eine dunklere oder hellere Graphitstufe.
- Amber markiert Hauptaktionen, aktive Auswahl, Gebäudekontur und relevante Zahlen. Keine vollflächigen Amber-Abschnitte; keine dekorativen Leuchteffekte.
- Große Luftbilder mit plausiblen Gewerbegebäuden, Ladehöfen und Straßen. Flache Perspektive von oben statt Lifestyle- oder Solarmodul-Werbung.
- Technische Ebenen sind lesbare UI: Gebäudekontur, Quelle, Flächenangabe, Maßstab und Koordinaten, sofern die zugrunde liegenden Daten vorliegen.
- Kein Globus, Blatt, Windrad, Pflanzenmotiv, AI-Orb, Glassmorphism oder grüner Climate-Tech-Verlauf. Keine Personenbilder als Vertrauenserzeuger.
- Keine Reihen unabhängiger KPI-Karten. Ein Projekt, eine Arbeitsfläche, zusammenhängende Informationen.

### 2.2 Komposition

Der Desktop-Hero übernimmt die Grundkomposition des ausgewählten Boards: links Wortmarke, markante Überschrift und auffällige helle Adresseingabe; rechts eine große Luftansicht. Die Input-/CTA-Zeile darf auf Desktop in den Bildbereich hineinragen, sofern sie auf einer einheitlich kontrastreichen Fläche liegt.

Der Standortcheck setzt eine konzentrierte Eingabezone neben eine räumliche Kontextzone. Partner arbeiten mit einer schmaleren Pipeline und einer größeren Projektakte. Der Score ist eine Zahl mit zugeordneten Begründungen, kein isoliertes Rundinstrument.

### 2.3 Verbindliche Token-Grundwerte

| Rolle | Wert | Verwendung |
| --- | --- | --- |
| Canvas | #151B20 | Grundfläche |
| Surface | #1B2329 | Abschnitt oder integrierte Zusammenfassung |
| Surface raised | #222B31 | Dropdown, Dialog, aktive Arbeitszone |
| Surface inset | #11171C | Kartenladezustand oder zurückgesetzter Bereich |
| Text primary | #F3F5F6 | Titel und relevante Inhalte |
| Text secondary | #B9C2C8 | Erklärung und Metadaten |
| Text muted | #97A4AD | untergeordnete, weiterhin lesbare Angaben |
| Border subtle | #39454D | rein strukturelle Trennlinien |
| Border control | #697B87 | erkennbare Eingabegrenzen |
| Accent | #E9B64C | Hauptaktion und aktive Markierung |
| Accent hover | #F2C66B | Hover auf Hauptaktionen |
| Accent pressed | #D9A43A | gedrückte Hauptaktion |
| Text on accent | #151B20 | Beschriftung auf Amber |
| Input hero | #F3F5F6 | helle Adresseingabe im Hero |
| Info | #9AB8D0 | Information, ohne eigenständige blaue Markenwelt |
| Success | #A9C5B5 | bestätigte Zustände, kleine semantische Markierung |
| Critical | #F09B93 | Fehler oder Ablehnung, nie großflächiger Hintergrund |

Grünliche Semantik bleibt auf kleine bestätigende Zustandszeichen beschränkt. Status werden immer durch Text und gegebenenfalls ein Symbol ergänzt. Kontrastprüfungen stehen in 07-EXPORT-QA.md; subtile Divider sind keine Ersatzbegrenzung für interaktive Inputs.

### 2.4 Typografie und Größen

Zwei Schriftfamilien: IBM Plex Sans Condensed für Überschriften, Formulare und Fließtext; IBM Plex Mono für Zahlen, Einheiten und kurze technische Metadaten. Keine weitere Serifenschrift und keine Austausch-Grotesk aus einem Admin-Template. Schriften lokal ausliefern; Lade-Fallback darf keine Inhalte verschieben.

| Textrolle | Desktop Größe / Zeilenhöhe / Gewicht | Mobile |
| --- | --- | --- |
| Hero H1 | 72 / 74 / 700 | 42 / 44 / 700; bei 360 px: 38 / 41 |
| Seitenüberschrift | 48 / 52 / 700 | 32 / 36 / 700 |
| Abschnitt H2 | 40 / 44 / 700 | 28 / 32 / 700 |
| Unterüberschrift | 24 / 30 / 600 | 22 / 28 / 600 |
| Hervorgehobener Text | 20 / 28 / 400 | 18 / 26 / 400 |
| Standardtext | 18 / 27 / 400 | 18 / 27 / 400 |
| UI und Feldlabel | 16 / 22 / 500 | 16 / 22 / 500 |
| Metadaten | 14 / 20 / 400 | 14 / 20 / 400 |
| Kurzes Overline | 12 / 16 / 500; Laufweite 0,12 em | 12 / 16 |
| Score | 120 / 120 / 700 | 88 / 88 / 700 |
| Datenzahl | 28 / 34 / 500, Mono | 24 / 30 / 500 |

Keine wesentliche Information in 12-px-Overlines verstecken. Fließtext maximal 62 Zeichen pro Zeile; Hero maximal etwa 12-14 Zeichen je bewusstem Zeilenblock. Umbrüche müssen bei Textvergrößerung natürlich bleiben.

### 2.5 Grid, Abstände und Formen

Spacing-Skala in CSS-Pixeln: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128. Keine zusätzlichen unbenannten Abstände im späteren UI.

- Desktop ab 1280: 12 Spalten; 24 Gutter; maximal 1328 Inhaltsbreite; mindestens 48 seitlicher Rand. Bei 1440 ergibt sich 56 Rand.
- Tablet 768-1279: 8 Spalten; 24 Gutter; 32 Rand.
- Mobile unter 768: 4 Spalten; 16 Gutter; 20 Rand, bei 360: 16 Rand.
- Landing-Abschnitte Desktop 96-128 Abstand, Tablet 80, Mobile 64. Inhaltshöhen flexibel.
- Navigation Desktop 80 hoch, Mobile 64. Hauptinputs und Primärbuttons 56 hoch, kompakte Desktop-Aktionen 44.
- Radius: 0 für große Flächen und Tabellen; 4 für Inputs und Buttons; 8 ausschließlich für Dialoge. Keine Pillen als Standardstatus.
- Größere Inhalte haben keine dekorativen Schatten. Dialoge bekommen einen dunklen, unverwischten Hintergrund-Scrim.

## 3. Vollständige Landingpage

### 3.1 Reihenfolge und konkrete Texte

| Abschnitt | Inhalt | Komposition / Interaktion |
| --- | --- | --- |
| Header | PROJECT GATEWAY; So funktioniert's; Für Projektpartner; Partner-Login | Ankerlinks plus getrennte Partnerroute. Keine weitere dominante CTA im Header. |
| Hero | Wie viel Energiepotenzial steckt in Ihrer Gewerbeimmobilie? | Linke Textzone, rechte Luftansicht. Vollständiger Hero bleibt im ersten Desktop-Viewport erkennbar. |
| Hero Subline | Standort erfassen. Projektpotenzial einordnen. Fachlich prüfen lassen. | Maximal drei kurze Zeilen auf Mobile. |
| Adresse | Sichtbares Label: Adresse Ihrer Immobilie oder Fläche; Placeholder: Straße, Hausnummer, PLZ oder Ort | Helles Feld; Button Standort prüfen. Enter hat dieselbe Wirkung. |
| Prozess | Von der Fläche zum Energieprojekt | Drei nummerierte Textstationen auf einer gemeinsamen Linie; mobil vertikal. |
| Digitaler Check | Ein Standortcheck, der die richtigen Fragen stellt | Bildausschnitt links, Erklärung rechts; drei Datenzeilen. |
| Score-Vorschau | Ein Score. Eine nachvollziehbare Grundlage. | 82/100 als Beispiel, neun nachvollziehbare Faktoren, positive und offene Faktoren; alle Faktoren über Bewertung erklären erreichbar. |
| Projektarten | Welches Projekt steckt in Ihrer Fläche? | Vier großzügige redaktionelle Zeilen, jeweils Titel, kurze Erklärung und kleiner Bildausschnitt. |
| Zielgruppen | Für Flächen mit Verantwortung | Textliste in zwei Spalten, mobil einspaltig. |
| Kompetenz | Digital vorbereitet. Fachlich geprüft. | Aufgabenverteilung und drei nachvollziehbare Vertrauensmerkmale. |
| FAQ | Häufige Fragen | Sechs Accordion-Zeilen, einzeln bedienbar, erste standardmäßig geschlossen. |
| Abschluss | Beginnen wir mit Ihrem Standort. | Zweite Adresseingabe mit gleichem Verhalten und beibehaltenem Entwurf. |
| Footer | PROJECT GATEWAY; Kontakt; Datenschutz; Impressum; Partner-Login | Reale Betreiberinformationen werden vor produktivem Start ergänzt. |

Prozess-Texte:

1. **Standort erfassen:** Geben Sie die Adresse Ihrer Immobilie oder Fläche an und ordnen Sie den Standort zu.
2. **Projekt qualifizieren:** Ergänzen Sie Objekt, Energieprofil und vorhandene Unterlagen. Gateway strukturiert Ihre Angaben und macht offene Punkte sichtbar.
3. **Fachlich prüfen lassen:** Übermitteln Sie Ihre Projektakte gezielt an den angezeigten Fachpartner.

Digitaler Check: **Sie ergänzen die Angaben. Gateway macht die offenen Punkte sichtbar.** Die drei zugehörigen Zeilen lauten Objekt und Fläche / Energieprofil / Vorhandene Unterlagen.

Projektarten:

- **Gewerbedach-PV:** Untersuchen Sie, ob eine gewerbliche Dachfläche für ein PV-Projekt weiter geprüft werden sollte.
- **PV-Erweiterung:** Ordnen Sie zusätzliche Flächen und eine vorhandene Anlage in eine strukturierte Projektanfrage ein.
- **Speicherprojekt:** Stellen Sie Verbrauch, vorhandene Anlagen und Ihr Speicherziel zusammen.
- **Freiflächenprojekt:** Erfassen Sie unbebaute Flächen, Nutzung und Verfügungsrechte für eine erste Einordnung.

Projektarten sind mögliche Einordnungen. Die Landingpage behauptet weder Genehmigungsfähigkeit noch Wirtschaftlichkeit.

Zielgruppen: Eigentümer von Gewerbeimmobilien; Industrieunternehmen; Logistikunternehmen; Landwirtschaft; Gewerbeparks; größere Bestandshalter; Asset Manager. Der Partnerabschnitt spricht Projektentwickler separat an.

Kompetenztext: **Project Gateway bereitet Ihre Projektangaben digital auf. Die fachliche Bewertung und Entscheidung übernimmt der benannte Projektpartner.** Vertrauensmerkmale: Nachvollziehbare Kriterien / Klare Datenherkunft / Benannter Empfänger. Keine erfundenen Referenzen, Partnerlogos, Zertifikate, Bewertungen oder Erfolgszahlen. Ein tatsächliches Partnerprofil kann später belegte Kompetenzen ergänzen.

### 3.2 FAQ - verbindlicher Text

| Frage | Antwort |
| --- | --- |
| Was benötige ich für den Standortcheck? | Die Adresse und erste Angaben zu Objekt, Fläche und Stromverbrauch. Unbekannte Werte und fehlende Unterlagen können Sie kenntlich machen. |
| Ist der Score bereits eine technische Planung? | Nein. Der Score ordnet die vorhandenen Angaben für die Projektvorqualifizierung ein. Statik, Netzanschluss, Planung und Wirtschaftlichkeit werden gegebenenfalls anschließend fachlich geprüft. |
| Was passiert mit meinen Unterlagen? | Vor einer Projektübergabe sehen Sie den Empfänger und die enthaltenen Angaben und Dateien. Erst mit Ihrer ausdrücklichen Übermittlung wird die Projektakte an diesen Partner weitergegeben. |
| Kann ich eine Fläche ohne Gebäude prüfen? | Ja. Wählen Sie Freifläche. Die folgenden Fragen beziehen sich dann auf Fläche, Nutzung und Verfügungsrechte. |
| Kann ich ohne vollständige Unterlagen fortfahren? | Ja. Der Check zeigt, was noch fehlt. Je nach Datenlage ist bereits eine vorläufige Einordnung möglich oder zunächst eine Ergänzung erforderlich. |
| Ist die Übermittlung bereits ein Projektauftrag? | Sie reichen eine Projektanfrage zur fachlichen Prüfung ein. Weitere Vereinbarungen werden gesondert mit dem Projektpartner getroffen. |

### 3.3 Adresseingabe - Zustände

Leer: Label und konkreter Placeholder. Fokus: sichtbarer Amber-Ring, kein Schatten. Suche: echte Suchaktivität mit kleinem Spinner und Status Adresse wird gesucht. Vorschläge: Combobox, maximal fünf Zeilen, Straße/Ort klar getrennt, Tastatur bedienbar. Keine Treffer: Adresse manuell erfassen. Mehrdeutigkeit: Vorschlag auswählen oder PLZ ergänzen. Provider nicht verfügbar: neutraler Hinweis und manuelle Eingabe; keine erfundene Position und kein fremdes Luftbild unter der neuen Adresse. Keine Adresse: nach Submit Feldfehler Bitte geben Sie eine Adresse oder Standortbeschreibung ein. Ein manueller Standort bleibt als ungeprüft gekennzeichnet.

Vor dem Projektcheck kein Pflichtkonto und keine Kontaktabfrage. Ein Rückkehrer kann einen bestehenden Entwurf fortsetzen oder ausdrücklich einen neuen Standort beginnen. Entwurfsdaten dürfen nicht stillschweigend überschrieben werden.

## 4. Standortcheck als digitale Projektanalyse

### 4.1 Gemeinsame Shell

Vier sichtbare Kapitel: Standort / Objekt / Energie / Unterlagen. Zehn Schritte mit kleiner Angabe Schritt X von 10. Bereits besuchte Schritte bleiben erreichbar; ein Sprung vorwärts validiert nur die tatsächlich notwendigen Angaben. Ein unbekannter Wert ist eine zulässige Antwort, wo angegeben.

Desktop: Navigation 80 hoch; Eingabezone 520 breit bei 1440; Kontextzone füllt den Rest. Formularinhalt maximal 440 breit; Abstand zwischen Fragen 24-32. Keine vollständige Datenmaske auf einer Seite. Rechte Zone zeigt das zugehörige Gebäude, die aktuelle fachliche Frage und höchstens drei vorhandene Fakten. Kein ständig wechselnder Score, keine Gamification.

Die Hauptaktion bleibt am Ende des aktuellen Inhalts; bei kurzen Schritten darf sie am unteren Rand der Eingabezone stehen. Zurück links als Sekundäraktion. Fortschritt, Auswahl und Eingaben bleiben beim Zurückgehen erhalten. Quellen sind schreibgeschützte Labels, keine vom Nutzer umschaltbaren Vertrauensstufen.

### 4.2 Schrittdefinitionen

| ID / Kapitel | Überschrift | Felder und Auswahl | Weiter / Bedingungen |
| --- | --- | --- | --- |
| Q01 / Standort | Ist das Ihr Standort? | Adresse oder manuelle Beschreibung; optionale PLZ/Ort und Flurstück; Gebäudekontur auswählen, falls echte Geodaten vorhanden | Standort bestätigen. Mindestens eine verständliche Standortangabe; fehlende Geodaten blockieren die Erfassung nicht. |
| Q02 / Objekt | Was befindet sich am Standort? | Einzelauswahl: Logistikhalle, Industriegebäude, Gewerbeimmobilie, Landwirtschaftliches Gebäude, Gewerbepark / Bestand, Freifläche, Sonstiges | Weiter. Eine Auswahl; bei Sonstiges Beschreibung 3-160 Zeichen. |
| Q03 / Objekt | Welche Fläche steht zur Verfügung? | Dach oder Freifläche; Fläche m²; Genau bekannt / Geschätzt / Noch unbekannt; bedingte Dach- oder Flächenfragen | Weiter. Fläche > 0, wenn angegeben; Unbekannt ausdrücklich möglich. |
| Q04 / Objekt | In welcher Rolle planen Sie das Projekt? | Eigentümer; Mieter / Pächter; Verwaltung / Bevollmächtigt; Andere Rolle. Status der Berechtigung: liegt vor / in Klärung / unbekannt | Weiter. Rolle erforderlich; ungeklärte Berechtigung wird als offener Punkt erfasst. |
| Q05 / Energie | Wie viel Strom nutzt Ihr Standort? | Jahresverbrauch in kWh; Bezugsjahr; Wert aus Abrechnung / geschätzt / unbekannt; Profil tagsüber / rund um die Uhr / saisonal / unbekannt | Weiter. Nicht negativ; bei 0 kurze Bestätigung Der Standort hat derzeit keinen Verbrauch. |
| Q06 / Energie | Gibt es bereits eine PV-Anlage? | Ja / Nein / Unbekannt; bei Ja optional installierte Leistung kWp, Inbetriebnahmejahr, Eigenverbrauch / Einspeisung / unbekannt | Weiter. Leistungswerte > 0, falls vorhanden; Felder bei Nein nicht anzeigen. |
| Q07 / Energie | Ist ein Speicher vorhanden? | Ja / Nein / Unbekannt; bei Ja optional nutzbare Kapazität kWh, Leistung kW und Inbetriebnahmejahr | Weiter. Unbekannte Dimensionen zulässig. Keine Wirtschaftlichkeitsbehauptung. |
| Q08 / Energie | Was soll das Projekt erreichen? | Hauptziel: Eigenverbrauch steigern / Dach oder Fläche bereitstellen / Bestehende PV erweitern / Speicher ergänzen / Möglichkeiten zunächst prüfen; optionale weitere Ziele und Projektbeschreibung | Zu den Unterlagen. Genau ein Hauptziel; kein automatischer technischer Eignungsnachweis. |
| Q09 / Unterlagen | Welche Unterlagen liegen vor? | Dach-/Lageplan, Stromabrechnung, Lastgang, Fotos, Statik, Netzanschlussunterlagen, Sonstige; alternativ Noch keine Unterlagen verfügbar | Dateien hinzufügen oder ohne Upload weiter. Verfügbarkeit ist nicht gleich hochgeladen. |
| Q10 / Unterlagen | Machen Sie das Projekt greifbar. | Uploadliste mit Dateityp, Dokumentkategorie, Größe, Zustand und Entfernen; anschließend Angabenzusammenfassung | Angaben prüfen; dann Projekt qualifizieren. Offene oder fehlgeschlagene Uploads müssen abgeschlossen, entfernt oder ausdrücklich ausgelassen werden. |

Q03 Dach: Dachform Flachdach / Satteldach / sonstige / unbekannt; Dachzustand keine Sanierung bekannt / Sanierung geplant / unbekannt als Nutzerauskunft, keine geprüfte Eignung oder Statik. Teilflächen belegt optional; nutzbare Fläche separat, falls bekannt. Dachmaterial optional; keine fachfremde Schätzung erzwingen.

Q03 Freifläche: verfügbare Fläche m², aktuelle Nutzung und optionale Flurstücksangabe. Dachform und Dachzustand entfallen vollständig. Keine standardmäßige Eignung von Landwirtschaftsflächen unterstellen.

Q04 bei Mieter/Pächter: Kontakt zum Eigentümer besteht / wird geklärt / unbekannt. Bei Verwaltung: Bevollmächtigung vorhanden / in Klärung / unbekannt. Fehlende Berechtigung ist ein sichtbar offener Faktor, keine automatisch verifizierte Ablehnung.

Zahlen werden mit deutscher Darstellung angezeigt, intern mit eindeutiger Einheit gehalten. 4.800 bedeutet 4800; 4,8 bedeutet 4.8. Formatierung erfolgt nach Verlassen des Feldes, nicht während jeder Eingabe. Negative Werte blockieren; auffällige, aber mögliche Größen verlangen eine Bestätigung statt einer willkürlichen harten Grenze. Fehlende Werte bleiben unbekannt und werden niemals in 0 umgewandelt.

### 4.3 Dokumente und Upload

Erlaubt: PDF, JPG/JPEG, PNG, CSV, XLSX. Produktgrenzen: 20 MB je Datei, 15 Dateien je Projekt, 100 MB gesamt. Tatsächliche Backend-Grenzen müssen dieselben Werte erzwingen. Keine Archive, ausführbaren Dateien oder Makrodateien. Keine automatische OCR oder inhaltliche Dokumentprüfung behaupten.

Dokumentkategorien: Lage-/Dachplan, Stromabrechnung, Lastgang, Foto, Statik, Netzanschluss, Sonstiges. Ein Dateiname darf einen Vorschlag auslösen; die Zuordnung bleibt sichtbar und korrigierbar. Die Kategorie sagt nichts über fachliche Validität aus.

Dateizustände: ausgewählt, wird übertragen, Verarbeitung läuft, bereit, fehlgeschlagen, nicht unterstützt, zu groß, entfernt. Prozentwerte sind ausschließlich echte Upload-Fortschritte. Bereit bedeutet technisch für die Projektakte verfügbar, nicht fachlich geprüft. Bei Fehler eine Aktion Erneut hochladen und eine Aktion Entfernen. Teilweise erfolgreiche Uploads bleiben erhalten. Gleiche Dateinamen sind erlaubt; identische Dateien erhalten einen Hinweis Bereits hinzugefügt und werden nicht unbemerkt doppelt eingetragen.

Drag-and-drop ist eine Ergänzung zum sichtbaren Dateiauswahlbutton. Mobile bietet Datei auswählen und Foto aufnehmen, soweit das Gerät dies unterstützt. Kein Kamera-Zwang. Entfernen wirkt auf den noch nicht übermittelten Entwurf; nach Übermittlung gelten sichtbare Versions- und Änderungsregeln.

### 4.4 Zusammenfassung vor der Analyse

Fünf zusammenhängende Abschnitte: Standort / Objekt und Berechtigung / Energie / Ziel / Unterlagen. Pro Abschnitt Bearbeiten führt zum passenden Schritt und danach zurück zur Zusammenfassung. Offene Angaben sind ausdrücklich markiert. Die Hauptaktion heißt Projekt qualifizieren. Eine zweite Prüfung bestätigt nicht erneut jede einzelne Frage.

Beim Speichern erscheinen nur tatsächliche Zustände: Änderungen vorhanden / Wird gespeichert / Gespeichert / Speichern fehlgeschlagen. Ist noch keine dauerhafte Speicherung angebunden, lautet der Hinweis Entwurf nur in dieser Sitzung. Dateien nie als dauerhaft gespeichert ausgeben, solange nur eine lokale Auswahl existiert.


---

# Atlas · Screen- und Flow-Vertrag

Export 1.0 · 06.09.2026 · Ergänzung der vorhandenen Product-Design-Ausarbeitung

Landingpage und die zehn Qualifizierungsschritte stehen vollständig in 01-DESIGN-CONTRACT.md. Dieses Dokument schließt die bisherige Ausarbeitung ab Analyse ab. Die folgenden Detailregeln sind jetzt konsolidierte Implementationsvorgaben, keine als historischer Chat-Export ausgegebenen Zitate.

## 1. Gesamtstrecke und Datenzusammenhang

Adresse → Standort bestätigen → Objekt / Fläche / Rolle → Verbrauch / PV / Speicher / Ziel → Unterlagen → Zusammenfassung → tatsächliche Qualifizierung → Ergebnis → gezielte Projektübermittlung → Bestätigung. Eine übermittelte Akte erscheint im berechtigten Partnerkontext. Dort folgen bewusst begonnene Prüfung, Rückfrage, Übernahme oder begründete Ablehnung.

Der Check braucht vor dem Ergebnis kein Pflichtkonto. Kontakt und Organisation werden bei der Einreichung erfasst. Die Projekt-ID bleibt über Entwurf, Analyse, Ergebnis und Übergabe stabil; mehrere Versionen derselben Angaben erzeugen keine neue Projektanfrage. Ein anderer Standort beginnt nach bewusster Auswahl einen neuen Entwurf.

Die zehn Hauptschritte bleiben Q01–Q10, gebündelt in Standort / Objekt / Energie / Unterlagen. Bedingte Dach-/Freiflächenfragen ändern die Inhalte, nicht die stabile Fortschrittsanzeige. Die Zusammenfassung ist ein eigener Prüfzustand nach Q10, kein überraschender elfter Pflichtfragebogen. Ein Zurücksprung erhält Eingaben und die vorherige Scrollposition.

## 2. Analysezustand

### Aufbau

Desktop: dieselbe Check-Shell mit 80 px Navigation. Links schmale Fortschritts- und Erläuterungszone, rechts das bereits bestätigte Objekt. Die Immobilie bleibt ruhig; Bewegung entsteht allein durch tatsächliche Statuswechsel. Titel: **Ihre Projektqualifizierung wird erstellt.** Subline: **Wir ordnen die vorhandenen Angaben ein und kennzeichnen offene Punkte.**

Mobile: Titel, aktueller Arbeitsschritt und bereits bekannte Projektidentität zuerst. Eine kleine Objektvorschau ist optional und darf den laufenden Arbeitsschritt nicht aus dem sichtbaren Bereich schieben. Abbrechen/Zur Übersicht bleibt erreichbar.

### Tatsächliche Arbeitsschritte

| Schritt | Sichtbarer Status / Bedingung |
| --- | --- |
| Standort zuordnen | Standort bestätigt, sofern Nutzerbestätigung oder echte Zuordnung vorliegt. Ohne Geodaten: Standort manuell erfasst. |
| Objektdaten prüfen | Angaben werden auf Vollständigkeit und Plausibilität geprüft. Nicht automatisch: Gebäude technisch geprüft. |
| Solardaten ergänzen | Nur bei angeschlossenem Dienst. Sonst: Externe Solardaten noch nicht verfügbar. |
| Energiedaten einordnen | Vorhandene Angaben werden strukturiert; Lastgang fehlt bleibt offen. |
| Projektqualifizierung erstellen | Regelmodellversion, tatsächlicher Jobstatus und Erstellung der Befunde. |

Ein echter Dienst kann zusätzlich **Gebäude erkannt** melden, wenn er das tatsächlich geleistet hat. **Solarpotenzial geprüft** oder **Dokument fachlich geprüft** dürfen nicht für einen bloßen Abruf bzw. Dateiupload erscheinen. Keine Mindestwartezeit, zufällige Prozentwerte, fingierte Prüfschritte oder animierte AI-Kugel.

Zustände pro Zeile: wartet / läuft / abgeschlossen / offen wegen fehlender Information / Dienstfehler. Offene Information ist kein technischer Fehler. Nach Abschluss direkt zum Ergebnis, nach Möglichkeit mit dezentem Statuswechsel statt Zwischenfeier. Fokus auf die Ergebnisüberschrift; ein Screenreader erhält eine einmalige Abschlussmeldung.

### Unterbrechungen

- Lange Bearbeitung: **Die Bewertung dauert länger als erwartet. Ihre Angaben bleiben erhalten.** Keine erfundene Restzeit. Erneut prüfen ist erst nach tatsächlichem Jobfehler nötig.
- Anbieterfehler: betroffene Datenebene offen anzeigen; andere Ergebnisse erhalten. Optional ohne diese Daten mit entsprechendem Partial-State fortfahren.
- Gesamter Bewertungsdienst nicht verfügbar: **Bewertung derzeit nicht verfügbar.** Aktionen **Erneut versuchen** und **Angaben ansehen**.
- Entwurf geändert: alte Bewertung als veraltet anzeigen, neue Eingabeversion bewerten. Ein Ergebnis einer alten Version darf die neue nicht überschreiben.
- Browser geschlossen: bei dauerhaft gespeichertem Entwurf Job und letzten Stand wieder aufnehmen. Ohne dauerhafte Speicherung heißt es ausdrücklich **Entwurf nur in dieser Sitzung**.

## 3. Project-Score-Screen

### Desktop-Komposition

Ein durchgehender Ergebnisbereich im 12-Spalten-Grid. Links 7 Spalten mit Überschrift, dominanter Zahl, Datenbasis und Faktorbeiträgen; rechts 5 Spalten mit Objektansicht, wichtigsten Standortfakten und nächster Aktion. Bei Platzmangel stehen Befunde und Aktion unter dem Score, nicht als überlagernde Karte auf dem Luftbild.

Kopf: **Ihre Projektvorqualifizierung**; darunter Standortname / Adresse. Vollständiger Score 120/120 px, Nenner deutlich kleiner, Klasse in Klartext. Datenbasis und wichtige offene Prüfungen unmittelbar darunter. Ein hoher Score ist kein erfolgreich abgeschlossener Prüfauftrag.

Verbindliche Reihenfolge: Identität → Score / Klasse / Verlässlichkeit → bestätigter Blocker bzw. offene Prüfung → konkrete nächste Aktion → Dafür spricht / Zu klären / Angaben ergänzen → neun Faktorbeiträge → Standort-/Energie-Details. Desktop darf Standortdetails parallel zeigen, Mobile folgt dieser Lesereihenfolge.

### Daten und Erklärung

Die vier ursprünglich im Atlas-Board gezeigten Beispielbeiträge werden durch die neun Faktoren des Analytics-Handoffs ersetzt: nutzbare Fläche, Solar-/Ertragspotenzial, Verbrauch/Eigenverbrauch, Eigentum/Entscheidung, Dachzustand, Projektgröße, Bereitschaft, Unterlagen und bestehende Infrastruktur.

| Klasse | Label |
| --- | --- |
| 80–100 | Hohe Priorität |
| 65–79 | Gutes Potenzial |
| 50–64 | Informationen ergänzen |
| 0–49 | Aktuell geringe Priorität |

Eine gerade Skala mit Grenzmarken 50/65/80 ist ergänzend zulässig. Der Hauptwert bleibt eine Zahl. Beiträge stehen auf gemeinsamer Punkteachse, beispielsweise 13/15. Details öffnen tatsächliche Angabe, Herkunft, Regel, Beitrag und Ergänzungsmöglichkeit. Keine Dekorationscharts, keine Optimierungstipps mit garantierten Bonuspunkten.

Beispiel 82: Gewichte 15/15/20/15/10/5/10/5/5; Beiträge 13/12/18/15/6/4/7/3/4. Ausschließlich UI-Prüfdaten. Ohne Solarfaktor: noch kein Gesamtscore, mögliche Spanne 70–85. Unbekannt bleibt null; kein hochgerechneter Score aus den übrigen Faktoren. Anwendbare Faktoren mit Gewicht 0 heißen Nicht gewichtet und erzeugen keinen 0/0-Balken.

### Ergebnisaktionen

| Fall | Hauptaktion | Sekundäraktion |
| --- | --- | --- |
| Übergabe laut tatsächlichen Gates möglich | **Zur fachlichen Prüfung übermitteln** | Angaben bearbeiten |
| Konkrete entscheidungsrelevante Angabe fehlt | **Angaben ergänzen** | Bewertung erklären |
| Daten nur teilweise vorhanden | **Fehlende Angaben ansehen** | Bisherige Angaben bearbeiten |
| Bestätigter Blocker | Passende Klärungsaktion, z. B. **Dachzustand klären** | Bewertungsgrundlage ansehen |
| Geringe Priorität | **Gründe und nächste Schritte ansehen** | Angaben korrigieren |
| Score veraltet | **Bewertung aktualisieren** | Letzte Bewertung ansehen |

Ein niedriger Score allein erzeugt weder REJECTED noch eine ausgeblendete Akte. Eine mögliche Übergabe unterhalb der üblichen Qualifizierungsgrenze wird nur angeboten, wenn der fachliche Workflow dies ausdrücklich erlaubt. Zahl, Datenvollständigkeit, Datenverfügbarkeit und Prozessstatus bleiben vier getrennte Bedeutungen.

Mobile: Score 88 px, Klasse darunter, Datenbasis und Blocker bleiben offen. Zuerst die wichtigsten Befunde, danach **Alle 9 Faktoren ansehen**. In der aufgeklappten Gesamtliste sind alle Beiträge sichtbar; nur Regeltexte einzeln klappbar. Die große Karte wird separat geöffnet. Die untere Aktion reserviert Platz im Dokument und verdeckt keinen Inhalt.

## 4. Projektübermittlung

### Screen

Titel: **Ihr Projekt zur fachlichen Prüfung einreichen.** Subline: **Prüfen Sie den Empfänger und die Angaben, die Sie übermitteln möchten.**

Desktop: 7 Spalten für Kontakt und Übermittlungsumfang, 5 für eine integrierte Aktenzusammenfassung. Mobile: Projektidentität → Empfänger → Umfang → Kontakt → aktive Zustimmung → Absenden. Keine zusätzliche Adresseingabe und kein erneutes Ausfüllen bereits erfasster Objektdaten.

| Bereich | Inhalt / Regel |
| --- | --- |
| Projekt | Projekt-ID, Standort, Art, vorläufiger Score oder Partial-State, Zahl offener Angaben |
| Empfänger | Tatsächlicher Organisationsname, Zuständigkeit, Kontakt-/Datenschutzhinweis. Project Gateway als eigenständige Plattform getrennt darstellen. |
| Enthaltene Daten | Standort-/Objektangaben, Energieprofil, Projektziel, Score mit Erklärung; einzelne Abschnitte einsehbar |
| Enthaltene Dateien | Dateiliste mit Kategorie, Name, Version und Auswahl; unverzichtbare Unterlagen oder Ausschlussfolgen erklären |
| Kontakt | Firma/Organisation, Vorname, Nachname, geschäftliche E-Mail; Telefon optional; Rolle aus Q04 übernehmen |
| Nachricht | Optionaler Projektkommentar, maximal 2.000 Zeichen; keine automatische marketingbezogene Zustimmung |
| Zustimmung | Nicht vorangekreuzt: **Ich möchte die angezeigten Projektangaben und ausgewählten Unterlagen an [Partnername] zur fachlichen Prüfung übermitteln.** |
| Hauptaktion | **Projekt einreichen**; gesetzliche Betreiber-/Datenschutzhinweise müssen produktiv korrekt konfiguriert sein |

Offene Informationen werden mitgesendet und bleiben für den Empfänger erkennbar. Ein qualifiziertes Projekt wird nicht durch Entfernen von Dokumenten stillschweigend als vollständig dargestellt. Eine relevante Änderung markiert den Score gegebenenfalls als veraltet.

### Zustände und Bestätigung

Pending: **Projekt wird eingereicht …**, erneutes Absenden gesperrt. Idempotenter Auftrag verhindert Dubletten. Nach bestätigtem Servererfolg: **Ihre Projektanfrage wurde eingereicht.** Projekt-ID, Empfänger, Zeitpunkt und tatsächlich enthaltener Umfang stehen im Beleg. Hauptaktion **Projektübersicht ansehen**, sekundär **Weiteren Standort prüfen**.

Text zum nächsten Schritt: **Der Projektpartner prüft Ihre Angaben und meldet sich über die angegebene Kontaktadresse.** Keine unvereinbarte 24-Stunden-Zusage, garantierte Annahme oder Vertragsbehauptung.

Fehlende Partnerkonfiguration: **Für dieses Projekt ist noch kein Empfänger hinterlegt.** Angaben bleiben erhalten; kein fingierter Versand. Ein Demo-Erfolg lautet ausdrücklich **Übermittlung simuliert**. Persistente Aktenfreigabe und Nachrichtenversand sind getrennte Vorgänge: scheitert nur eine Benachrichtigung, bleibt eine erfolgreich eingereichte Anfrage eingereicht und der Versand erhält seinen eigenen Fehlerstatus.

Validierungsfehler stehen am Feld, zusätzlich eine fokussierbare Fehlerzusammenfassung. Netzwerkfehler erhält Eingaben. Ein unklarer Sendestatus wird über Auftrags-ID abgefragt, statt eine zweite Anfrage zu erzeugen.

## 5. Partner-Dashboard

### Arbeitsfläche

Atlas bleibt eine breite zusammenhängende Arbeitsfläche. Navigation 80 px, Wortmarke links; Projekte / Pipeline; Organisationskontext rechts. Darunter Titel und eine schmale konkrete Aufgabenzeile. Keine Umsatz-, CO2-, Lead- oder generischen Analytics-Kacheln.

Ab 1280 px: linke Arbeitsliste etwa 440–480 px, 24 px Abstand und verbleibende breite Projektakte. Der Bereich erhält die im Design Contract definierte maximale Inhaltsbreite 1328 px; im Volltabellenmodus nutzt die Liste diese Fläche. Unter 1280 wechseln Liste und Akte in getrennte Zustände; keine winzige geteilte Ansicht.

Die Startfrage ist **Welche Projekte sollte ich jetzt bearbeiten?** Reihenfolge: zugewiesene überfällige Aufgaben, eingegangene Antworten, neu eingereichte Projekte hoher Priorität, weitere fällige Aufgaben, wartende Projekte. Die Sortierung ist explizit; kein zusätzlicher undurchsichtiger Prioritätsindex. Neue Daten verschieben ein gerade gelesenes Projekt erst nach bewusstem Aktualisieren.

### Liste, Filter und Auswahl

Ansichten: Neue Projekte / Hohe Priorität / Informationen fehlen / In Prüfung / Übernommen / Abgelehnt. Diese Mengen können überlappen und werden nicht summiert. Eine Ansicht ist ein sichtbarer Filter, kein neuer Backend-Status.

Jede Zeile zeigt nächste Aktion, Projekt/Ort, Score mit Basiszustand, Projektart, erwartete Größe mit Einheit und Status. Gebäudetyp, Angaben vorhanden/benötigt und letzte fachliche Aktion stehen in einer zweiten kompakten Zeile oder der ausgewählten Akte. Unbekannte Leistung erscheint als **Leistung offen**; belegte Fläche darf separat **ca. 4.800 m² · geschätzt** heißen.

Filter: Status, Klasse, Projektart, Gebäudetyp, Region, Größe mit Einheit, Vollständigkeit, Verantwortlicher und Fälligkeit. Suche nach Projekt-ID oder Standort. Alle Filter bleiben sichtbar zusammengefasst und einzeln entfernbar. Keine gemeinsame Zahlensortierung für m², kWp und kWh.

Zeilenauswahl erhält einen schmalen Amber-Rand und eine Graphitfläche. Sie öffnet die passende Akte, verändert jedoch keinen Status. Auf Desktop kann die Akte optional in voller Breite geöffnet werden; Zurück stellt die ursprüngliche Auswahl wieder her. 50 Projekte je Seite, klarer Bereichszähler und Weiter/Zurück.

### Pipeline

Geordnete Stufentabelle statt elfspaltigem Kanban. Pro Stufe: Bestand, offene und überfällige Aufgaben, Median der bisherigen Aufenthaltsdauer aktueller Projekte. Abgelehnt ist ein eigener Abschlusszweig. Terminale Fälle erhalten keine weiter wachsende Liegezeit.

Status-IDs: NEW, INCOMPLETE, SCORING, QUALIFIED, PARTNER_REVIEW, INFO_REQUESTED, ACCEPTED, DEVELOPMENT, CONTRACTED, REALIZED sowie REJECTED. Die vollständige Semantik und Übergangsmatrix gehören zum Analytics-Handoff. Im MVP liegen die aktiven Partneraktionen bei Prüfung, Rückfrage, Übernahme und Ablehnung; spätere Entwicklungsmeilensteine benötigen kein ausgebautes Projektmanagement-Modul.

Nur eingereichte und für den aktuellen Partner freigegebene Projekte sind sichtbar. Ein Partnerwechsel entfernt die vorherige Auswahl, lädt den neuen berechtigten Kontext und übernimmt keine fremden Dokumente. Der Organisationsumschalter erscheint nur, wenn tatsächlich mehrere Kontexte verfügbar sind.

### Zustände

- Ohne Projekte: **Noch keine Projektanfragen eingegangen.** Kurze Erklärung, wie Projekte in dieser Arbeitsliste erscheinen; keine Demoprojekte als echte Eingänge.
- Filter ohne Treffer: **Keine Projekte für diese Auswahl.** Aktive Filter und **Filter zurücksetzen**.
- Initial Loading: maßgleiche Zeilenstruktur, keine erfundenen Scores oder Statistiken.
- Refresh: Auswahl und letzte gültige Inhalte erhalten, sichtbarer Stand. **Neue Daten verfügbar** lädt einen neuen Snapshot bewusst.
- Fehler: letzte bekannte Inhalte im weiterhin berechtigten Kontext plus **Erneut laden**. Bei entzogenem Zugriff Inhalte ausblenden.

## 6. Projektakte

### Architektur

Kopf: Projektname, Adresse, Projekt-ID, aktueller Status, Score mit Datenbasis und nächste Aktion. Bestätigte Blocker sowie fehlende entscheidungsrelevante Informationen folgen direkt. Die Akte bleibt eine gemeinsame Fläche mit Linien und großzügigen Abständen; einzelne Datenpaare werden nicht zu Karten vervielfacht.

| Bereich | Daten und Darstellungsregel |
| --- | --- |
| Standort | Adresse, Karte/Luftbild, bestätigtes Gebäude, Typ, Gebäudekontur, Nutzfläche und Quellenstand |
| Objekt | Dach-/Flächensituation, Dachzustand als Eingabe oder fachliche Ergänzung, Eigentums-/Entscheidungssituation |
| Energie | Jahresverbrauch, Eigenerzeugung, vorhandene PV-Leistung, Speicherstatus, mögliche Erweiterung und Potenzial mit Quellenlabels |
| Ziel | Hauptziel, optionale Ziele, Projektbeschreibung und Ansprechpartner |
| Score | Gesamtwert/-zustand, neun Beiträge, nachvollziehbare Regeln, Risiken, fehlende Angaben und nächste Ergänzung |
| Dokumente | Kategorie, Datei, Größe, Version, verfügbar/technisch in Verarbeitung/fachlich geprüft, Quelle und Datum |
| Prozess | aktueller Status, letzte fachliche Aktion, offene Anfrage, Ereignisverlauf, Kommentare und Entscheidungssnapshots |

Desktop-Vollakte: Hauptbereich 8 Spalten, Entscheidungsbereich 4. Innerhalb einer Split-View-Akte stapeln sich breite Abschnitte entsprechend dem verfügbaren Platz; keine zweite verschachtelte Split View. Abschnittsnavigation mit Standort / Energie / Score / Dokumente / Verlauf. Das Lesen eines Tabs verändert keine fachliche Bewertung.

Mobile: Kopf, nächste Aktion und Blocker, danach einspaltige Abschnitte. Ein **Entscheidung**-Button öffnet einen eigenen Sheet-/Dialogzustand; keine drei nebeneinander gequetschten Hauptbuttons. Ausführliche Regel- und Quelleninformationen sind klappbar, Kernwerte bleiben lesbar.

### Dokumente und Verlauf

Dokumente öffnen eine berechtigte Vorschau oder einen eindeutigen Download. Dateityp und Größe stehen am Link. Nicht unterstützte Vorschau bedeutet nicht defekte Datei. Keine Roh-Storage-URL mit dauerhaftem Token in der teilbaren Seiten-URL.

Nach Übermittlung verändern Ergänzungen die Aktenversion; die ursprüngliche Einreichung und der Entscheidungssnapshot bleiben nachvollziehbar. Entfernen einer bisher geteilten Datei muss Berechtigung und fachlichen Versionskontext beachten. Die Oberfläche behauptet keine rückwirkende Löschung aus bereits getroffenen Entscheidungen.

Verlauf: neueste fachliche Aktion zuerst, gruppiert nach Datum. Event zeigt Aktion, Akteur, Zeitpunkt, gegebenenfalls Status vorher/nachher und referenzierte Version. Kommentar-Sichtbarkeit **Interne Notiz** und **Nachricht an Projektkontakt** sind getrennte Eingabemodi. Eine interne Notiz löst keinen Versand aus.

## 7. Partnerentscheidungen

### Übernehmen

**Projekt übernehmen** öffnet eine kompakte Bestätigung mit Projektidentität, Organisation und optional Verantwortlichem. Erklärung: **Sie übernehmen die weitere fachliche Bearbeitung dieses Projekts.** Submit **Übernahme bestätigen**, sekundär **Abbrechen**. Erfolg erst nach bestätigter Speicherung; Status ACCEPTED, Verlaufseintrag, aktualisierte nächste Aktion. Keine Gleichsetzung mit Vertrag oder zugesagtem Bau.

### Informationen anfordern

Dialog mit benötigten Feldern/Dokumentkategorien, konkreter Nachricht, tatsächlichem Empfänger und optionaler Fälligkeit. Vorbelegung aus fehlenden Angaben, vom Partner korrigierbar. Submit **Anfrage senden**. Erst tatsächliche bestätigte Übermittlung setzt INFO_REQUESTED. Teilantworten erfüllen nur die beantworteten Anforderungen. Die Folgeaktion **Antwort prüfen** unterscheidet eingegangene Information von fachlich akzeptierter Information.

### Ablehnen

Dialogüberschrift **Projekt begründet ablehnen**. Projekt und aktuelle Scoreversion bleiben sichtbar. Genau ein primärer Reason Code; maximal drei optionale Zusatzgründe; Einschätzungsstand Bestätigt / Nicht ausreichend belegt / Partnerkriterium. Bei Sonstiges ist eine Erklärung erforderlich. Technische Begründungen benötigen einen Beleg oder nachvollziehbaren fachlichen Bezug.

Grundkatalog: Fläche zu klein; Dachzustand; Eigentum/Entscheidung; Verbrauch; Projektgröße; Netz; Statik; Region; Wirtschaftlichkeit; unvollständige Information; Sonstiges. Partnerkapazität, Dublette und Rückzug werden separat klassifiziert. Verbindliche IDs stehen im Analytics-Datenvertrag. Unbekannte Statik darf nicht als bestätigter statischer Mangel gespeichert werden.

Submit **Projekt ablehnen** mit ruhiger kritischer Semantik; Abbrechen gleich gut erreichbar. Erfolg zeigt REJECTED, Primärgrund, Zeitpunkt und Akteur. Score unverändert lassen. Wiederaufnahme ist eine bewusste neue Aktion mit Begründung, kein Löschen der früheren Ablehnung.

Alle Entscheidungen: Pending sperrt Doppelauslösung; Netzwerkfehler erhält Eingaben; Versionskonflikt zeigt den neuen Stand und verlangt eine erneute bewusste Entscheidung. Keine stille Überschreibung einer parallel getroffenen Partnerentscheidung.


---

# Atlas · Komponenten, Responsive und Zustände

Export 1.0 · 06.09.2026

## 1. Kompaktbibliothek

Komponenten bilden die vorhandene Atlas-Gestaltung nach. Ein UI-Framework darf Verhalten unterstützen; seine Standardoberfläche, Abstände und Farben ersetzen nicht diesen Vertrag. Verbindliche Werte stehen in 05-DESIGN-TOKENS.json.

| Komponente | Varianten / Gestalt | Verhalten / wesentliche Zustände |
| --- | --- | --- |
| BrandLockup | Wortmarke Project Gateway, vorhandene eckige Markierung, helle Schrift | Link zur Startseite; kein neues Logo entwerfen |
| PublicHeader | 80 px Desktop, 64 px Mobile | Desktop-Anker und Partner-Login; mobile Menütaste mit Fokus-/Escape-Verhalten |
| PartnerHeader | gleiche Marke, Arbeitsnavigation, realer Organisationskontext | Aktiven Partner klar zeigen; keine fremden Projektinhalte beim Wechsel |
| PrimaryButton | Amber, Text #151B20, Radius 4, Höhe 56 | default / hover / pressed / focus / pending / disabled; ein Hauptziel pro Entscheidungskontext |
| SecondaryButton | dunkle Fläche oder transparent, sichtbarer Control-Rand | gleicher Zielbereich; keine halb lesbare Ghost-Schrift |
| TextAction | unterstrichener Link oder klarer Textbutton mit passendem Icon | Fokus sichtbar; mindestens 44 px Bedienfläche bei kleinen Symbolen |
| CriticalAction | zurückhaltender Fehler-/Ablehnungsfarbton, Text/Umrandung | klare Bezeichnung; nicht wie die normale Amber-Hauptaktion behandeln |
| AddressCombobox | Hero hell, Check dunkel; permanentes Feldlabel | leer / Suche / Treffer / mehrdeutig / manuell / Fehler; maximal fünf Vorschläge |
| FieldGroup | Label, Input, Hilfe, optional Fehler darunter | Feldwerte beim Fehler erhalten; Pflicht nur dort, wo tatsächlich nötig |
| NumericEvidenceInput | Einheit am Feld, zusätzliche Angabe bekannt/geschätzt/unbekannt | deutsche Eingabe normalisieren; keine Umschaltung der Herkunft auf Extern oder Geprüft |
| OptionRow / OptionGroup | rechteckige Zeilen mit Radio-/Checkboxindikator, geringe Rundung | ausgewählt durch Text, Rand und Markierung; keine reinen klickbaren unbeschrifteten Bilder |
| ChapterProgress | vier Kapitel + Schritt X von 10 | besuchte Schritte bedienbar; aktuelle Position zusätzlich als Text |
| StepActions | Zurück / Weiter oder spezifische Hauptaktion | bestehende Eingaben behalten; keine unerreichbare untere Aktion bei Tastatur |
| SiteContext | ruhiges Luftbild/Karte, Kontur und höchstens drei aktuelle Fakten | mit Datenquelle; ohne Geodaten ehrlicher Textfallback, kein fremdes Objekt |
| EvidenceValue | Wert, Einheit, Bezugszeit und Herkunft/Schätzung | unbekannt / geschätzt / nicht anwendbar / veraltet / Quellenfehler getrennt |
| UploadDropzone | technisches Rechteck, sichtbarer Dateiauswahlbutton | Drag-and-drop optional; Mobile Datei oder Foto, kein Kamera-Zwang |
| UploadRow | Name, Kategorie, Größe, Fortschritt, Aktion | gewählt / überträgt / verarbeitet / bereit / fehlgeschlagen / entfernt |
| ReviewSection | zusammenhängende Fakten, eine Bearbeiten-Aktion je Gruppe | Rückkehr zum ursprünglichen Review-Zustand, offene Angaben beschriftet |
| AnalysisStatusList | knappe technische Arbeitsschritte mit Klartextstatus | nur echte Ereignisse und Fortschritte; keine künstliche Verzögerung |
| ScoreSummary | Displayzahl, Nenner, Klasse, Datenbasis und Befund | vollständig / geschätzt / partial / nicht bereit / läuft / veraltet / Fehler |
| ScoreFactorList | neun proportionale Zeilen auf gemeinsamer Punkteachse | Werte direkt; Regeln je Zeile klappbar; keine 0/0- oder Nullbalken für unbekannt |
| FindingList | Dafür spricht / Zu klären / Angaben ergänzen | bestätigter Blocker immer sichtbar; direkte Ergänzungsaktion |
| SubmissionReview | Empfänger, Datenumfang, Dateien, Kontakt und aktive Zustimmung | bereit / ungültig / läuft / bestätigt / unklarer Sendestand / Fehler |
| ProjectQueueRow | nächste Aktion, Standort, Score, Typ, Größe, Status | Auswahl mit Amber-Kante; Lesen verändert keinen Status |
| ProjectTable | geringe Rundung, 0 px Tabellenradius, Linien statt Karten | echte Spaltenüberschriften; Sortierrichtung, Filter, Pagination; 50 Zeilen pro Seite |
| PipelineStageRow | Bestand, Alter und offene Aufgaben | klare Reihenfolge; Abgelehnt separat; Hover nicht für essenzielle Zahlen nötig |
| DossierSection | Überschrift, Fakten und Quellen; gleiche visuelle Fluchten | einzelne fehlende/fehlerhafte Abschnitte blockieren nicht die ganze Akte |
| DocumentList | Kategorie, Version und Verfügbarkeits-/Prüfstatus | technische Verfügbarkeit und fachliche Prüfung getrennt |
| ProjectHistory | vertikale Ereignisliste, neueste fachliche Aktion zuerst | Status vorher/nachher, Akteur, Zeitpunkt, Version; interne Notiz getrennt von Versand |
| DecisionDialog | Radius 8, klare Projektidentität, unverwischter Scrim | Übernahme / Rückfrage / Ablehnung / Konflikt; Werte bei Fehler behalten |
| SourceSheet / FilterSheet | fokussierter Neben-/Vollbildzustand | schließen/abbrechen, Fokus zurückgeben; Filter zusätzlich zurücksetzen/anwenden |
| StatusLabel | kleiner Text mit Linie/Symbol, keine Pillenwolke | Priorität, Workflow und Datenlage nicht im selben Badge vermischen |
| InlineNotice | kurze Aussage, Ursache, konkrete nächste Aktion | information / offen / bestätigt kritisch / technischer Fehler |
| FAQDisclosure | einzelne redaktionelle Zeile mit klarer Öffnungsmarkierung | anfangs geschlossen, mehrere geöffnet zulässig, Tastatur unterstützt |
| Footer | Kontakt, Datenschutz, Impressum, Partner-Login | echte Routen und Betreiberinhalte; kein erfundener Empfänger |

Icons: die vorhandene geradlinige Atlas-Systematik fortsetzen. Falls noch kein konkretes Set im Zielprojekt existiert: Carbon Icons 20/24 px, konsistente Strichstärke. Icons tragen keine neue Bildwelt. Eine bestehende passende Iconbibliothek darf erhalten bleiben. Keine Emoji als Produktstatus oder dekorative Recycling-/Naturzeichen.

## 2. Eingabe- und Auswahlregeln

Inputs verwenden dauerhafte Labels. Placeholder ersetzen weder Label noch Hilfetext. Hilfetext bleibt kurz und erklärt den Zweck der Angabe. Ein Fehler erscheint nach relevantem Blur oder Submit, nicht sofort beim ersten Tastendruck. Nach Submit erhält die erste ungültige Frage Fokus; längere Formulare erhalten zusätzlich eine verlinkte Fehlerzusammenfassung.

Combobox: Pfeiltasten navigieren, Enter wählt, Escape schließt die Vorschläge. Ohne aktiven Treffer startet Enter die gleiche Prüfung wie der Button. Die manuelle Alternative bleibt per Tastatur und Touch erreichbar. Ein verspäteter Suchtreffer darf keine inzwischen weiter eingegebene Adresse überschreiben.

NumericEvidenceInput hält Rohtext während der Eingabe und formatiert erst nach Abschluss. Jahresverbrauch intern in kWh, Anzeige gegebenenfalls MWh; kW, kWp und kWh strikt unterscheiden. Unbekannt setzt den fachlichen Wert auf null und bewahrt die bewusste Antwort. Eine spätere Bearbeitung zeigt den vorherigen Wert nur als vorherige Angabe, nicht als aktuellen Wert unter unbekannt.

Optionen sind native oder gleichwertig semantische Radio-/Checkboxgruppen. Einzelauswahl erhält ein sichtbares Label, Mehrfachauswahl eine klare Anzahl/Anweisung. Die vollständige Zeile darf eine vergrößerte Bedienfläche sein. Auswahl allein führt nicht ungefragt zum nächsten Schritt.

Status ist nie nur Farbe. Eine dokumentierte Einschränkung verwendet Critical-Semantik; eine noch ungeprüfte Frage bleibt als offen beschriftet. Datenquelle ist ein Quellenlabel, kein frei vom Nutzer umschaltbares Vertrauensniveau.

## 3. Responsive-Regeln

| Breite | Grid / Ränder | Landingpage | Standortcheck | Ergebnis / Partner |
| --- | --- | --- | --- | --- |
| ≥1280 | 12 Spalten, 24 Gutter, max. 1328 Inhalt, min. 48 Rand | 5/7 Hero-Komposition; Adresse darf kontrolliert in den Bildbereich reichen | 520 px Eingabezone, übrige Fläche räumlicher Kontext | Score 7/5; Partnerliste 440–480 + 24 Abstand + Akte |
| 768–1279 | 8 Spalten, 24 Gutter, 32 Rand | H1 56/60; bei engem Platz Bild unter Adresse | konzentrierte Hauptspalte, Kontext auf Abruf oder darunter | Score vertikal; Partnerliste und Akte getrennte Zustände |
| 390–767 | 4 Spalten, 16 Gutter, 20 Rand | H1 42/44; Adresse und CTA zuerst, danach Objektvorschau | eine Frage; Navigation 64; Weiter/Zurück erreichbar | Score 88, Befunde/Aktion vor Karte; Listen statt Mini-Tabellen |
| 320–389 | 4 Spalten, 16 Gutter, 16 Rand | H1 38/41, natürliche Umbrüche | gleiche Inhalte, keine versteckten Kernfelder | kein horizontaler Scroll für Text, Formulare oder Faktoraufschlüsselung |

Die Mediengrenzen sind Layoutgrenzen, keine Gerätekategorien. Dazwischen wachsen Flächen flexibel. Bei 1440 px ergeben 1328 px Inhalt genau 56 px Rand. Lange deutsche Bezeichnungen umbrechen; die UI wird nicht durch eine kleinere Grundschrift passend gemacht.

### Mobile Landingpage

Header → Produktfrage → Subline → sichtbares Adresslabel → volle Adresseingabe → vollbreiter 56-px-Button Standort prüfen → kurze Kontext-/Datenzeile → ruhige Objektvorschau. Kein großer Satellitenfilm vor der Adresse. Prozessstationen werden vertikale redaktionelle Zeilen. Score-Vorschau zeigt Wert/Klasse/Datenbasis und einen Verweis zur Erklärung. Zielgruppen und Projektarten werden untereinander gelesen; FAQ bleibt Accordion.

### Mobile Standortcheck

Kapitel und Schrittposition bleiben kompakt sichtbar. Die aktuelle Frage hat eine natürliche Höhe; Formulare dürfen scrollen. Kontextinformationen werden über **Standort ansehen** oder **Warum diese Angabe?** geöffnet. Bereits besuchte Schritte lassen sich über eine Schritteübersicht erreichen. Eine fokussierte Zahleneingabe hat den passenden Tastaturmodus, aber immer weiterhin sichtbare Einheit und Feldbezeichnung.

Die Hauptaktion darf auf kurzen Schritten unten am Viewport stehen, benötigt jedoch Platz im normalen Layout. Bei offener Bildschirmtastatur richtet sie sich nach dem sichtbaren Visual Viewport oder wird gut erreichbar im Inhalt positioniert. Kein überlagerter Button verdeckt den Fokus. Safe Areas werden addiert, nicht als Ersatz für Abstand verwendet.

### Mobile Score und Karte

Score/Klasse/Verlässlichkeit/Blocker/Ergänzung zuerst; drei wichtigste Befunde, dann **Alle 9 Faktoren ansehen**. Jede Faktorzeile hat Name und Beitrag, Balken darunter sowie Quelle/Unsicherheit. Keine horizontal scrollende Punktetabelle.

Karte zunächst 220–260 px hohe passive Vorschau. **Karte öffnen** startet eine eigene Ansicht mit Gebäudeauswahl, Plus/Minus, Fit und Zurück. Normales Scrollen darf nicht von der Vorschau abgefangen werden. Querformat 844×390 bietet Karte und kurze Datenspalte. Die Kernaufgabe muss auch im Portrait ohne Pinch, Drag oder Gerätewechsel lösbar bleiben.

### Mobile Partnerbereich

Desktop ist die primäre Partnerarbeitsfläche; Mobile unterstützt Lesen und die drei Partnerentscheidungen vollständig. Liste und Akte sind eigene Ansichten. Filter im Sheet, aktive Filterzusammenfassung außerhalb. Kein horizontaler Scroll als einzige Möglichkeit, Status oder nächste Aktion zu sehen. Eine optionale vollständige Datentabelle darf breit sein, solange die gleichwertige operative Listenansicht verfügbar bleibt.

## 4. Motion-Vertrag

| Vorgang | Dauer / Charakter | Reduced Motion |
| --- | --- | --- |
| Button/Fokus/kleine Auswahl | 120 ms Farb-/Randwechsel; Fokus sofort erkennbar | sofort |
| Daten- und Statuswechsel | 160–200 ms ruhig einblenden; keine Zahl-Hochzählung | sofort |
| Accordion / Detailabschnitt | 200 ms Höhen-/Opacity-Übergang, ohne Springen der Leserposition | sofort |
| Dialog / Sheet | 200 ms; kleine 8-px-Bewegung optional, keine Feder-/Bounce-Inszenierung | sofort |
| Map Fit | höchstens 250 ms, nur auf explizite Aktion | sofort |
| Upload | echter Fortschritt, ruhig aktualisiert | Werte ohne dekorative Bewegung |
| Analyse | Statuswechsel nach tatsächlichem Event, kein inszeniertes Warten | gleiche Aussage ohne Animation |

Standard-Easing cubic-bezier(0.2,0,0,1). Scroll- oder Parallaxeffekte sind nicht erforderlich. Keine Auto-Rotation, endlosen Grid-Bewegungen, Count-ups oder ständig schwebenden Markierungen. Ein Ladeindikator ist nur während eines realen laufenden Vorgangs sichtbar.

## 5. Gemeinsame Zustandsmatrix

| Zustand | Anzeige und Verhalten |
| --- | --- |
| Erstes Laden | Raum für echte Inhalte reservieren; sprechender Ladetext, keine zufälligen Beispielwerte |
| Aktualisieren | letzten gültigen Stand mit Zeitpunkt erhalten; kein Flackern in die leere Ansicht |
| Wirklich leer | benennen, welche Menge leer ist; passende nächste Handlung |
| Fachlich unbekannt | Noch unbekannt; null statt Nullwert; konkrete Ergänzung ermöglichen |
| Nicht anwendbar | Nicht relevant; aus profilabhängigen Anforderungen ausschließen |
| Geschätzt | ca. oder begründete Spanne, Herkunft und Methode sichtbar |
| Teilweise verfügbar | bekannte Teile nutzbar, fehlende Teile explizit; keine falsche Gesamtsumme |
| Veraltet | letzten Stand benennen und Aktualisierung anbieten |
| Fehler | Ursache verständlich soweit bekannt; Wiederholen/Ändern; Eingaben behalten |
| Offline | bestehende Inhalte als letzter Stand; lokale ungespeicherte Änderungen kennzeichnen |
| Keine Berechtigung | geschützte Daten nicht zeigen; Rückweg zur berechtigten Projektliste |
| Entscheidung läuft | konkrete Aktion benennen, Doppelauslösung sperren, keinen Erfolg vorwegnehmen |
| Versionskonflikt | aktuellen Stand laden und erneute bewusste Entscheidung erlauben |
| Demo | klar gekennzeichnete Beispieldaten und simulierte Aktionen; keine echten Versand-/Prüfbehauptungen |

## 6. Accessibility

Ziel: Textkontrast mindestens 4,5:1, große Schrift und notwendige Control-Grenzen mindestens 3:1. Alle Fokuszustände auf Canvas und heller Hero-Eingabe prüfen. Ein 2-px-Fokusring mit 2-px-Abstand liegt auf kontrastierendem Grund; Amber direkt auf Weiß allein ist keine ausreichende Fokuslösung.

Logische Überschriften, echte Buttons/Links, Feldlabels, Formgruppen, Error-Verknüpfungen, native Tabellen und sortierte Listen einsetzen. Charts bekommen sichtbare Zahlen und ein Text-/Tabellenäquivalent. Bilder besitzen eine sachliche Alternative; dekorative Grid-Linien sind ausgeblendet. Der Kartenkontext ist auch als Adresse und Objektliste verständlich.

Dialoge setzen Fokus auf den Titel bzw. das erste sinnvolle Feld, behalten ihn im Dialog und geben ihn beim Schließen zurück. Escape schließt einen noch nicht gesendeten Dialog; das Schließen einer bereits laufenden Serveraktion wird nicht als erfolgreicher Abbruch ausgegeben. Fortschritt und Abschluss werden angemessen angekündigt, nicht bei jedem Prozentwert erneut.

Zu prüfen: Tastatur ohne Maus, Touch ohne Hover, 200 % Textvergrößerung, 320-px-Reflow, lange Labels und reduced motion. Dieser Vertrag definiert die Abnahme; er behauptet keine bereits getestete Produktimplementierung.


---

# Atlas · Codex Implementation Specification

Export 1.0 · 06.09.2026 · Product Design für die anschließende Umsetzung

## 1. Ziel und Quellenrangfolge

Implementiere Project Gateway innerhalb der ausgewählten Atlas-Identität. Nutze zunächst den vorhandenen Technologie-Stack des Zielprojekts. Wenn noch kein Repository vorliegt, triff die minimale dazu passende technische Entscheidung, nachdem die bereitgestellten Design- und Analytics-Verträge gelesen wurden. Die Wahl einer Bibliothek darf die Oberfläche nicht in ihr Standardtemplate verwandeln.

Lesereihenfolge: 00-READ-ME.md → 01-DESIGN-CONTRACT.md → 02-SCREEN-FLOWS.md → 03-COMPONENTS-RESPONSIVE-STATES.md → 05-DESIGN-TOKENS.json → 06-SOURCE-AND-ANALYTICS-ALIGNMENT.md → dieser Implementationsvertrag. Zusätzlich den separat vorhandenen Analytics-Handoff lesen.

Verbindlich für Farben, Schrift, Komposition, Abstand, Komponentenform und responsive Shell ist dieser Product-Design-Export. Für Scoreberechnung, Datenherkunft, Statusübergänge, Reason Codes und Kennzahlennenner gilt der Analytics-Handoff. Dessen Hinweis auf vorrangige konkrete Product-Design-Tokens wird hier umgesetzt. Genaue Abgleiche stehen in 06-SOURCE-AND-ANALYTICS-ALIGNMENT.md.

Generierte Boards sind visuelle Referenzen, kein auslesbares Fachmodell. Die Texte und Werte dieses Exports bzw. des Analytics-Handoffs haben Vorrang vor Fehlern in Bildbeschriftungen. Kein Board als fertigen UI-Screenshot auf eine Website kleben. Die Oberfläche besteht aus echten, bedienbaren Komponenten.

## 2. Seiten- und Routenstruktur

| Route | Screen / Komponenten | Abschluss / Folgezustand |
| --- | --- | --- |
| `/` | PublicHeader, Hero mit AddressCombobox, Prozess, Check, Score-Vorschau, Projektarten, Zielgruppen, Kompetenz, FAQ, Abschlussadresse, Footer | Standort prüfen beginnt/öffnet einen Entwurf |
| `/standortcheck/:draftId/:step` | CheckShell, ChapterProgress, Q01–Q10, StepActions, SiteContext | Zusammenfassung nach Q10 |
| `/standortcheck/:draftId/zusammenfassung` | fünf ReviewSections, Bearbeiten je Gruppe | Projekt qualifizieren |
| `/standortcheck/:draftId/analyse` | AnalysisStatusList, vorhandene Objektangaben | Ergebnis / Partial / Fehler |
| `/projekte/:id/ergebnis` | ScoreSummary, FindingList, ScoreFactorList, Standort, Energie und fehlende Angaben | gezielte Ergänzung oder Übergabe |
| `/projekte/:id/einreichen` | SubmissionReview mit Kontakt, Empfänger und Zustimmung | bestätigte Einreichung |
| `/projekte/:id/eingereicht` | Beleg mit Projekt, Empfänger, Zeitpunkt und Umfang | berechtigte Projektübersicht oder weiterer Standort |
| `/partner/login` | minimale passende Auth-Oberfläche in Atlas | berechtigte Partnerarbeitsfläche |
| `/partner/projekte` | PartnerHeader, Aufgabenzeile, Ansichten/Filter, WorkQueue, ausgewählte Akte | Auswahl oder volle Akte |
| `/partner/pipeline` | Pipeline-Stufentabelle und verlinkte gefilterte Projekte | Arbeitsliste in gewähltem Status |
| `/partner/projekte/:id` | volle ProjectDossier, Quelle/Dokumente/Verlauf, Partneraktionen | bestätigte Aktion und aktualisierte Akte |
| `/kontakt`, `/datenschutz`, `/impressum` | einfache redaktionelle Atlas-Seiten mit tatsächlich konfigurierten Inhalten | zurück zum Produkt |

Die beiden internen Analytics-Routen für Funnel und Ablehnungsgründe bleiben die spätere, separat berechtigte Erweiterung des Analytics-Handoffs. Sie werden nicht ohne produktive Daten als bereits aktive Geschäftssteuerung ins MVP-Menü aufgenommen.

Projekt-/Draft-IDs in der URL sind keine Zugriffsberechtigung. Eigentümerzugriff erfordert einen echten sicheren Rückkehr-/Sitzungsmechanismus, Partnerzugriff eine tatsächlich berechtigte Sitzung. Fehlende Auth-Anbindung darf in einer Demo sichtbar simuliert werden; sie darf nicht als echte Zugriffskontrolle ausgegeben werden.

## 3. Komponentenkomposition

PublicShell: Marke, öffentliche Navigation, redaktionelle Sektionen und Footer. CheckShell: wiedererkennbare Navigation, vier Kapitel, aktuelle Frage und ruhiger Objektkontext. PartnerShell: Marke, tatsächlicher Organisationskontext, Arbeitsliste und Akte. Gemeinsame Basiskomponenten für Buttons, Inputs, Labels, Dialoge, Tabellen und Hinweise.

Ein ProjectDossier-Modul wird für Split View und Vollakte wiederverwendet, mit explizitem Layoutmodus. Es startet keine eigene zweite Karteninstanz, wenn dieselbe Akte ihre Standortansicht wechselt. Mehrere Karten in Projektzeilen sind nicht vorgesehen.

Score- und Analytics-Komponenten dürfen ihre proportionale Geometrie aus dem Analytics-Vertrag übernehmen. Labels, Typorollen und Oberflächen verwenden jedoch die Design Tokens dieses Exports. Zeilen und Achsen nicht als vollständig unabhängige Miniscreens rendern.

## 4. Zustandsbesitz und Persistenz

| Zustandsbereich | Besitzer / Persistenz |
| --- | --- |
| Aktueller Schritt, offenes FAQ, Dialogentwurf | UI-Zustand; Rücknavigation erhält sinnvolle Position |
| Entwurfsangaben und Uploadreferenzen | Draft-Speicher mit Revision; dauerhafter oder sitzungsbezogener Stand ausdrücklich sichtbar |
| Eingabe-Rohtext | lokaler Feldzustand bis Validierung/Normalisierung |
| Geocoding-Suche | asynchroner Request mit Zuordnung zum aktuellen Suchtext; alte Treffer ignorieren |
| Quellen und Objektgeometrie | versionierte Evidence-Daten; Nutzer kann Herkunft nicht hochstufen |
| Score | versionierte Serviceantwort mit inputVersion und modelVersion, keine zweite versteckte UI-Berechnung |
| Einreichung | idempotenter Auftrag mit bestätigtem Empfänger, Umfang und Zeitstempel |
| Partnerentscheidung | serverseitige Revision, Berechtigung, Request-ID und unveränderlicher Event |
| Projektfilter, Sortierung, Auswahl, Tab | validierte URL-Parameter im berechtigten Kontext |
| Kontakttexte, vertrauliche Dokumentlinks, ungesendete Notizen | nicht in teilbaren URLs speichern |

Dateibytes gehören nicht in LocalStorage. Ein lokaler Dateiname ist kein erfolgreich gespeicherter Upload. Die Oberfläche muss echte Uploadreferenzen und deren Status führen; bei späterer Rückkehr ist ein nicht persistierter lokaler File-Handle erneut auszuwählen.

Beim Schrittwechsel vorhandene Angaben speichern, falls der angeschlossene Speicher dies unterstützt. Eine Überschreibung durch eine andere Revision wird sichtbar gelöst. Ein Profilwechsel zwischen Dach und Freifläche macht nicht anwendbare Felder inaktiv und erklärt gegebenenfalls den Verlust ihrer Relevanz; frühere Angaben können historisch erhalten bleiben, zählen aber nicht in den aktuellen Score.

## 5. Integrationsverträge ohne erfundene Dienste

| Port / Aufgabe | Erwartetes Verhalten | Ehrlicher Fallback |
| --- | --- | --- |
| Standortsuche | Trefferliste mit stabiler ID, Adresse, Quelle und optional Koordinaten | manuelle Adresse/Standortbeschreibung |
| Gebäude-/Kartendaten | zum gewählten Standort passende Geometrie, Datensatz, Datum und Nutzungsrechte | strukturierte Standortdaten ohne vorgetäuschte Karte |
| Entwurf speichern | bestätigte Revision, Speicherzeitpunkt und abrufbare ID | Entwurf nur in dieser Sitzung |
| Upload | Dateiübertragung, echter Fortschritt, Kategorie und technische Verfügbarkeit | Dateiauswahl als noch nicht übertragen markieren |
| Qualifizierung | tatsächlicher Job, Ergebniszustand, neun Faktoren, Regeln und Quellen | Not ready / Partial / Error gemäß Datenlage |
| Projekt einreichen | idempotente Speicherung/Freigabe an den tatsächlichen Empfänger | keine Erfolgsbehauptung; Entwurf erhalten |
| Partnerdaten | berechtigte Projektliste, Filter/Pagination und aktuelle Aktenrevision | leere/fehlerhafte berechtigte Oberfläche |
| Entscheidung / Anfrage | erlaubte Aktion, Konfliktprüfung, Event und gegebenenfalls Versandstatus | Eingaben behalten, Vorgang nicht als erledigt markieren |

Schnittstellennamen sind logische Aufgaben, keine Behauptung, dass bereits bestimmte Backend-Endpunkte existieren. Endpunkte erst an den tatsächlichen Stack und das Datenmodell anschließen. Geodaten, Scoring, E-Mail, Upload und Auth bleiben jeweils austauschbare Integrationsgrenzen.

Keine echte Datenübermittlung oder Benachrichtigung aus einem Demo-Button. Für die UI-Abnahme ausdrücklich aktivierte Prüfdaten verwenden; Demo-/Live-Modus nicht anhand zufälliger fehlender Umgebungsvariablen ineinander übergehen lassen. Keine verdeckten produktiven Nebeneffekte bei Tests.

## 6. Konkrete Interaktionsregeln

1. Hero und Abschlussadresse teilen einen Entwurfszustand. Enter und Standort prüfen sind äquivalent. Kein frühes Kontaktformular vor dem Ergebnis.
2. Q01–Q10 bleiben in Kapitelstruktur bedienbar. Genau eine Hauptfrage pro Schritt; unbekannte Fachwerte zulässig. Keine automatische Weiterleitung allein durch Auswahl.
3. Zusammenfassung führt für Bearbeiten zum Feld und danach zurück. Nicht alle zehn Schritte erneut durchlaufen lassen.
4. Analyse läuft nur so lange wie der tatsächliche Vorgang. Kein Mindesttimer, kein Fake-Fortschritt, keine ungeprüfte Gebäude-/Solarmeldung.
5. Score zeigt Zahl, Klasse, Datenbasis und nächste Aktion. Faktorregeln und Quellen per Tap/Fokus öffnen. Unknown/null und bekannte 0 verschieden darstellen.
6. Übergabe zeigt Empfänger und Umfang vor dem Absenden; aktive Zustimmung; idempotenter Submit; keine unvereinbarten Erfolgs-/Reaktionszeitversprechen.
7. Partnerliste sortiert nach konkreter Arbeit. Auswahl und Filter bleiben bei Aktenrückkehr erhalten. Lesen verändert keinen Status.
8. Übernehmen, Anfordern und Ablehnen sind echte bestätigte Aktionen. Reason Codes und historische Datenversionen nach Analytics-Vertrag verwenden.
9. Je Projekt maximal eine aktive Karteninstanz. Sichtbare Zoom-/Fit-Alternativen; keine Scrollfalle oder Hoverpflicht.
10. Statusänderungen und Re-Scoring getrennt halten. Ein Partnerprojekt in Prüfung bleibt in Prüfung, während eine neue Scoreversion berechnet wird.

## 7. Layout und Typografie als technische Vorgabe

Tokens zentral abbilden, einschließlich der beiden Schriftfamilien IBM Plex Sans Condensed und IBM Plex Mono. Keine ungefragte Ersetzung des Body-Fonts durch eine Standard-SaaS-Grotesk. Schriften lokal bzw. aus dem tatsächlichen kontrollierten Assetbestand ausliefern. Kurze technische Zahlen/Einheiten in Mono, Fließtext und Formlabels in Condensed.

Desktop-Inhalt maximal 1328 px, 12 Spalten, 24 px Gutter; Partner-Split erst ab 1280. Mobile-Ränder 20 px, unter 390 px 16 px. Große Sektionen haben keinen Standard-Card-Radius oder Schatten. Komponentenradien 4, Dialog 8, Tabellen/große Flächen 0.

Werte sind Layoutvorgaben, keine Absolutpositionen einer starren 1440-px-Leinwand. Flexible Höhe, Zeilenumbruch, Textvergrößerung und variable Projekt-/Adresslängen müssen unterstützt werden. Primärbuttons 56 px, kleine Interaktionsziele mindestens 44 px.

## 8. Do's / Don'ts

| Do | Don't |
| --- | --- |
| Standort, Objekt und nächste Aktion als zentrale Inhalte | generische SaaS-Kacheln oder Investor-/CO2-Dashboards ergänzen |
| Bestehende Atlas-Referenzen und Tokens verwenden | eine vierte Designrichtung oder eine gemischte Werkbericht-/Raster-Welt entwickeln |
| Datenquelle, Schätzung und unbekannte Werte sichtbar machen | unbekannt als 0 oder hohe Punktzahl als technische Freigabe behandeln |
| Rechteckige integrierte Bereiche mit feinen Linien | Glassmorphism, große Schatten, Pillen- und Badge-Wolken |
| Reale Objektbilder oder klar gekennzeichnete Demoansichten | beliebige generierte Halle unter einer realen eingegebenen Adresse anzeigen |
| Vollständige mobile Kernaktionen ohne Hover | nur Desktop zusammenschieben oder Gerätewechsel verlangen |
| Echte Zustände und serverbestätigte Entscheidungen | simulierte Übernahme, Upload oder Versand als produktiven Erfolg ausgeben |
| Kleine gezielte SVG-/DOM-Datenmarken | dekorative Tachos, Radar, 3D, Kreischarts oder AI-Orbs |

## 9. Abnahme nach der späteren Implementierung

Die Abnahme ist gegen echte gerenderte Screens und bedienbare Flows durchzuführen; dieses Exportpaket selbst implementiert keine App.

- Durchgehende Strecke: Landingadresse → Q01–Q10 → Review → Analyse → Score → Einreichung → Beleg. Zurück/Bearbeiten erhält Daten.
- Fachliche Verzweigungen: Gewerbedach, Freifläche, PV-Erweiterung, Speicher; unbekannte Werte und 0; fehlende oder nur teilweise hochgeladene Dateien.
- Score: alle sieben Zustände, neun Beiträge, Grenzen 49/50/64/65/79/80/100, veraltet, bestätigter Blocker und 70–85-Teilspanne.
- Partner: Auswahl, Filter, Paging, Wechsel Liste/Akte, Rückfrage/Teilantwort, Übernahme, Ablehnung mit OTHER-Text, Wiederaufnahme und Versionskonflikt.
- Responsive: 1440, 1280, 1024, 768, 390, 360 und 320 CSS-Pixel; Karten-Querformat 844×390; Tastatur und 200 % Textzoom.
- Accessibility: echte Tastaturwege, Screenreader-Labels, Fokus-Rückgabe, Kontrast, sichtbare Quellen, keine essenzielle reine Hoverinformation.
- Visueller Vergleich: Original-Atlas und gerenderter Screen bei derselben Größe gegenüberstellen. Grundkomposition, Schrift, Luftbildfunktion, helle Hero-Adresse, Abstände und Amber-Einsatz beurteilen.
- Betriebsgrenzen: reale Partner-/Betreiberangaben, Datenquellen/Rechte, Auth, Upload, Scoring und Versand tatsächlich angeschlossen oder klarer Fallback. Keine Demo-Freigaben in Live-Ansichten.

Sinnvolle Implementationsfolge: Design Tokens und Shells → Landingpage → Check mit ehrlichen Zuständen → Score/Übergabe → Partnerarbeitsfläche/Akte → mobile und semantische Abnahme. Danach nur konkrete Fehler oder fehlende Abnahmepunkte korrigieren; keine neue visuelle Exploration starten.


---

# Herkunft, Exportstand und Abgleich

Export 1.0 · 06.09.2026

## 1. Was tatsächlich vorher vorlag

Der frühere Product-Design-Stand bestand aus der ausgewählten Atlas-Originaltafel, dem gespeicherten Designbrief, vier weiter ausgearbeiteten visuellen Boards und einer begonnenen Detail-Spezifikation. Die Detail-Spezifikation reichte durch Landingpage, Tokens und Standortcheck bis zur Zusammenfassung vor der Analyse. Ein vollständiges eigenständiges Product-Design-ZIP war noch nicht exportiert.

Der anschließend fertiggestellte 24-seitige PDF-/ZIP-Handoff war der **Analytics-Handoff**. Er deckte Datenbedeutung, Visualisierungen und analytische Komponenten ab. Dieser Export wird hier weder umbenannt noch als ursprünglicher Product-Design-Export ausgegeben.

## 2. Was dieser Export jetzt vervollständigt

Dieser am 06.09.2026 zusammengestellte Product-Design-Export übernimmt die vorhandene Atlas-Identität und die vorhandenen Landing-/Check-Vorgaben. Ergänzt und zusammengeführt wurden Analysezustände, Score-Screen, Projektübermittlung samt Bestätigung, Partner-Dashboard, Projektakte, Partnerentscheidungen, responsive Details, Komponenten, Motion-/Fehlerzustände, maschinenlesbare Tokens und die eigene Codex-Implementationsspezifikation.

Die Detailergänzungen operationalisieren die bereits beauftragte Variante 1. Sie sind nicht als wörtliche frühere Chat-Ausgabe oder als neue, vom Nutzer separat ausgewählte Art Direction zu verstehen. Es wurde kein Anwendungscode implementiert.

| Quelle | Status / Verwendung |
| --- | --- |
| source/Atlas-Designbrief-2026-09-05.md | Unveränderte Kopie der tatsächlich gespeicherten Designbasis; historischer Stand mit vier illustrativen Beiträgen |
| source/Atlas-Working-Draft-2026-09-05.md | Unveränderte Kopie der begonnenen Detail-Spezifikation bis Check-Zusammenfassung; kein vollständiger damaliger Export |
| visuals/00-atlas-original.png | Ursprünglich gewählte Variante 1; maßgeblich für Art Direction |
| visuals/01-landingpage.png | Bereits erstellte vollständige Landingpage-Kompositionsreferenz |
| visuals/02-standort-objekt.png | Bereits erstellte Standort-/Objekt-Referenz |
| visuals/03-energie-projektziel.png | Bereits erstellte Energie-/PV-/Speicher-/Ziel-Referenz |
| visuals/04-dokumente-analyse.png | Bereits erstellte Dokument-/Upload-/Analyse-/Fehler-Referenz |
| references-analytics/ | Klar getrennte spätere Analytics-Referenzen für Score, Mobile-Score und Partnerarbeitsfläche |
| 01 bis 05 dieses Pakets | Jetzt vervollständigter normativer Product-Design-Vertrag |

Alte Quellen dienen der Nachvollziehbarkeit. Ihre vier Beispielbeiträge, unpräzisen Bildtexte oder noch angekündigten nächsten Schritte sind keine zusätzlichen aktuellen Implementationsanforderungen.

## 3. Vorrangige Entscheidungen bei Unterschieden

| Thema | Verbindliche Auflösung |
| --- | --- |
| Visuelle Identität | Atlas / Variante 1. Kein Vermischen mit Werkbericht oder Raster. |
| Body-/UI-Schrift | IBM Plex Sans Condensed gemäß vorhandener Product-Design-Detailvorgabe. Analytics-Beispiele mit IBM Plex Sans sind keine neue Produktfont-Freigabe. Daten/Koordinaten in IBM Plex Mono. |
| Hintergrundrollen | Canvas #151B20; integrierte Surface #1B2329; angehobene Surface #222B31. Analytics verwendete #222B31 als generischen Surface-Wert; in der Produkt-Shell gelten die präziseren drei Rollen. |
| Grenzen | Strukturelle Linie #39454D, Control-Grenze #697B87. Analytics-Vergleichsmarken bleiben quantitativ erkennbar; fachliche Diagrammsemantik wird nicht allein an eine Farbe gebunden. |
| Hero und öffentlicher Score | Hero 72/74 Desktop, 42/44 Mobile bzw. 38/41 unter 390; Score 120 Desktop / 88 Mobile. Kleine Listenscores nutzen den getrennten Inline-Token. |
| Grid | 1328 maximale Inhaltsbreite, 12/8/4 Spalten; Desktop-Split ab 1280. Bei 1440 genau 56 px Rand. Keine ungeklärte zweite 1200-px-Split-Grenze aus einer Illustration. |
| Mobile-Abstände | 20 px Rand ab 390, sonst 16; 16 px Gutter. Analytics-Diagramme passen sich der verfügbaren Inhaltsbreite an. |
| Score-Faktoren | Aktuell neun Faktoren und die im Nutzerbriefing vorgegebenen vier Klassen. Die vier Faktoren aus dem alten Board sind ersetzt. |
| Score-Gewichte | Die 82-Punkte-Darstellung ist ein UI-Testbeispiel. Produktive Regeln werden fachlich/versioniert geliefert, nicht aus Bildern oder diesem Export abgeleitet. |
| Unbekannte Werte | value=null; vom Nutzer angegeben / extern / berechnet oder fachlich ergänzt getrennt von beobachtet / geschätzt / unbekannt / nicht anwendbar. |
| Pipeline | Elf Status-IDs aus dem Analytics-Vertrag; Arbeitsansichten und Prozessstatus bleiben getrennt. |
| Karten | Nur tatsächlich passende lizenzierte Daten. Generierte Hallen, Konturen, Koordinaten und Maßstäbe sind illustrative Designquellen. |
| Dokumente | Verfügbar ist nicht fachlich geprüft. Illustrative Bildtexte, die Prüfung suggerieren, werden nicht übernommen. |
| Partner / Einreichung | Tatsächlicher Empfänger und Berechtigung. Keine erfundenen Firmen, Zusagen oder produktiven Demo-Übermittlungen. |

Diese Auflösung folgt der bereits im Analytics-Handoff festgelegten Rangfolge: konkret vorhandene Product-Design-Tokens haben Vorrang für die Gestaltung; normative Analytics-Regeln steuern Datenbedeutung und proportionale Charts.

## 4. Grenzen der visuellen Dateien

Die fünf Product-Design-Boards sind generierte Rasterreferenzen. Sie zeigen Art Direction und Komposition; sie sind keine pixelgenau vermessenen UI-Bauteile, realen Standortanalysen oder freigegebenen Production Assets. Ihre sichtbaren fachlichen Werte sind Beispiele. Es werden keine realen Dachgrößen oder Erträge daraus abgelesen.

Für Übergabe, Bestätigung und einzelne Partnerdialoge wurden in diesem Export keine neuen Bilder erfunden. Diese Zustände sind jetzt präzise als Screen-, Komponenten- und Zustandsvertrag festgelegt und übernehmen die gemeinsame Atlas-Shell. Die vorhandenen Bilder und diese normativen Regeln dienen gemeinsam der späteren Umsetzung.

Die drei Analytics-Referenzen sind ergänzende bereits vorhandene Ansichten. Ihre Chartgeometrie und Informationshierarchie bleiben nützlich; bei Schrift- und Layoutabständen gelten die oben aufgelösten Product-Design-Werte. Der separate vollständige Analytics-Handoff bleibt für die Implementierung zusätzlich erforderlich.


---

# Atlas · Exportprüfung

Product-Design-Export 1.0 · 06.09.2026

## Abdeckung der angeforderten Inhalte

| Angefordert | Enthalten in |
| --- | --- |
| Finaler Design Contract / Atlas Variante 1 | 01-DESIGN-CONTRACT.md; Quellen- und Ergänzungsstand in Datei 06 |
| Landingpage-Struktur | Datei 01 §3, inklusive Hero, Adresse, Prozess, Check, Score-Vorschau, Projektarten, Zielgruppen, Kompetenz, FAQ und Footer |
| Standortcheck-Flow | Datei 01 §4, Q01–Q10, vier Kapitel, bedingte Fragen, Dokumentupload und Zusammenfassung |
| Project-Score-Screen | Datei 02 §3, neun Faktoren, Befunde, Ergebnisaktionen und sieben Scorezustände |
| Partner-Dashboard | Datei 02 §5, operative Priorisierung, Arbeitsliste/Akte, Filter, Tabelle, Pipeline und Leer-/Fehlerzustände |
| Projektakte | Datei 02 §6/7, Standort, Energie, Ziel, Score, Dokumente, Prozess und Entscheidungen |
| Design Tokens | 05-DESIGN-TOKENS.json; menschenlesbare Basis in Datei 01 |
| Typografie | Datei 01 §2.4 und Token-Datei; konkrete zwei Schriftfamilien und Rollen |
| Spacing/Grid | Datei 01 §2.5 und Datei 03 §3; konkrete Desktop-/Tablet-/Mobile-Werte |
| Komponenten | Datei 03 §1/2; Komposition und Zustandsbesitz in Datei 04 |
| Responsive-Regeln | Datei 03 §3; mobile Landingpage, Check, Score, Karten und Partnerarbeit |
| Motion/States | Datei 03 §4/5/6; Analyse, Upload, Partnerkonflikte und Einreichung in Datei 02 |
| Codex Implementation Specification | Datei 04 vollständig; Routen, Zustände, Integrationsverträge, Do's/Don'ts und spätere Abnahme |

Zusätzlich enthalten: Projektübermittlung samt Bestätigung, FAQ-Texte, Quellenabgleich mit Analytics, unveränderte historische Quellen und die Originalboards.

## Tatsächlich kontrolliert

- Die fünf originalen Product-Design-Boards und drei separat gekennzeichneten Analytics-Referenzen sind vorhanden, als PNG lesbar und unverändert kopiert. Ihre Dateifingerabdrücke stehen im Manifest.
- Die vorhandenen Referenzen wurden gemeinsam visuell betrachtet, um Atlas-Komposition, dunkle Grundfläche, Amber-Akzent, schmale Typografie und passende Zuordnung zu den Screens zu kontrollieren.
- Die historischen Quellen sind als historisch markiert; der jetzt vervollständigte Export wird nicht als damals bereits fertig vorliegend ausgegeben.
- Die aktuellen normativen Vorgaben übernehmen neun Faktoren; vier Beiträge stehen nur noch in der unveränderten historischen Designbasis bzw. illustrativen Bildern.
- Die Token-Datei ist gültiges JSON; ursprüngliche Farb-/Schrift-/Spacing-/Grid-Werte wurden übernommen und fehlende responsive Zustandsrollen explizit ergänzt.
- Der Abgleich löst konkrete Unterschiede gegenüber den Analytics-Illustrationen auf, insbesondere Schriftfamilie, Surface-Rollen, Scoregröße, mobile Ränder und Split-Grenze.
- Alle 13 angefragten Inhaltsbereiche haben einen konkreten Zielabschnitt. Verweise auf weitere fertige Dateien werden auf tatsächlich enthaltene Dateien beschränkt.
- Der vollständige Text wird aus demselben Stand der Einzeldokumente und Token-Daten zusammengeführt. Das ZIP wird auf Dateiintegrität geprüft.

## Kontrastwerte der Product-Design-Tokens

| Kombination | Verhältnis | Mindestziel |
| --- | --- | --- |
| Primärtext / Canvas | 15,88:1 | 4,5:1 |
| Sekundärtext / angehobene Surface | 7,97:1 | 4,5:1 |
| Muted-Text / angehobene Surface | 5,64:1 | 4,5:1 |
| Control-Rand / angehobene Surface | 3,28:1 | 3:1 |
| Beschriftung / Amber | 9,31:1 | 4,5:1 |
| Hero-Eingabetext / heller Input | 15,88:1 | 4,5:1 |
| Hero-Placeholder / heller Input | 9,01:1 | 4,5:1 |

Alle sieben geprüften Kombinationen erfüllen das jeweilige Ziel. Subtile Divider werden nicht als alleinige Eingabegrenze eingesetzt. Fokus auf dem hellen Hero-Input erhält einen kontrastierenden Abstand/Untergrund; Amber auf Weiß allein wird nicht als ausreichender Fokuszustand verwendet.

## Aussagegrenzen

Dies ist eine Prüfung des Exportinhalts und der Designvorgaben. Es wurde keine Anwendung implementiert, kein gerenderter Frontend-Prototyp gegen alle Boards abgeglichen und keine reale Projektqualifizierung ausgeführt. Die vollständige Browser-, Touch-, Screenreader-, Sicherheits- und End-to-End-Abnahme folgt anhand der Checkliste in Datei 04.

Generierte Referenzen enthalten illustrative Bildtexte und Geodaten. Sie beweisen weder reale Gebäudeerkennung noch Dokumentprüfung. Die noch nicht separat bebilderten Übergabe-/Bestätigungs-/Partnerdialogzustände sind als Text-/Komponentenvertrag konkretisiert. Dafür werden keine nachträglich erfundenen historischen Screenshots ausgegeben.

Der bestehende Analytics-Handoff bleibt zusätzlich relevant. Seine 35 Konsistenz-/Kontrastprüfungen sind keine 35 zusätzlichen Tests dieses Product-Design-Exports und werden hier nicht als solche gezählt.


---

# Vollständige Design Tokens

Maschinenlesbare Werte aus 05-DESIGN-TOKENS.json:

```json
{
  "name": "Project Gateway / Atlas / Variante 1",
  "exportVersion": "1.0",
  "exportedAt": "2026-09-06",
  "source": "Product Design working specification 2026-09-05; explicit detail completion 2026-09-06",
  "format": "Semantic design values; not application code",
  "color": {
    "canvas": "#151B20",
    "surface": "#1B2329",
    "surfaceRaised": "#222B31",
    "surfaceInset": "#11171C",
    "textPrimary": "#F3F5F6",
    "textSecondary": "#B9C2C8",
    "textMuted": "#97A4AD",
    "borderSubtle": "#39454D",
    "borderControl": "#697B87",
    "accent": "#E9B64C",
    "accentHover": "#F2C66B",
    "accentPressed": "#D9A43A",
    "onAccent": "#151B20",
    "heroInput": "#F3F5F6",
    "heroInputText": "#151B20",
    "heroInputPlaceholder": "#39454D",
    "info": "#9AB8D0",
    "success": "#A9C5B5",
    "critical": "#F09B93"
  },
  "font": {
    "interface": "IBM Plex Sans Condensed",
    "display": "IBM Plex Sans Condensed",
    "body": "IBM Plex Sans Condensed",
    "data": "IBM Plex Mono",
    "interfaceWeights": [
      400,
      500,
      600,
      700
    ],
    "dataWeights": [
      400,
      500
    ],
    "bodyMaxCharactersPerLine": 62,
    "delivery": "Local controlled font assets; fallbacks only during loading, never intentional redesign"
  },
  "spacingPx": [
    4,
    8,
    12,
    16,
    24,
    32,
    40,
    48,
    64,
    80,
    96,
    128
  ],
  "breakpointsPx": {
    "minReflow": 320,
    "mobileRegular": 390,
    "tablet": 768,
    "desktop": 1280
  },
  "grid": {
    "desktop": {
      "columns": 12,
      "gutterPx": 24,
      "maxContentPx": 1328,
      "minMarginPx": 48
    },
    "tablet": {
      "columns": 8,
      "gutterPx": 24,
      "marginPx": 32
    },
    "mobile": {
      "columns": 4,
      "gutterPx": 16,
      "marginPx": 20
    },
    "mobileSmall": {
      "columns": 4,
      "gutterPx": 16,
      "marginPx": 16
    }
  },
  "layout": {
    "headerPx": {
      "desktop": 80,
      "tablet": 80,
      "mobile": 64
    },
    "sectionGapPx": {
      "desktop": [
        96,
        128
      ],
      "tablet": 80,
      "mobile": 64
    },
    "checkFormZonePx": 520,
    "checkFieldMaxPx": 440,
    "partnerListRangePx": [
      440,
      480
    ],
    "partnerSplitMinWidthPx": 1280,
    "panelGapPx": 24,
    "mapMobilePreviewHeightPx": [
      220,
      260
    ]
  },
  "radiusPx": {
    "largeSurface": 0,
    "table": 0,
    "input": 4,
    "button": 4,
    "dialog": 8
  },
  "borderPx": {
    "divider": 1,
    "control": 1,
    "activeContour": 2,
    "focus": 2,
    "focusOffset": 2
  },
  "controlHeightPx": {
    "primary": 56,
    "input": 56,
    "compactDesktop": 44,
    "minimumHitTarget": 44
  },
  "motion": {
    "fastMs": 120,
    "stateMs": 160,
    "disclosureMs": 200,
    "dialogMs": 200,
    "mapFitMaxMs": 250,
    "easing": "cubic-bezier(0.2,0,0,1)",
    "reducedMotion": "immediate",
    "scoreCountUp": false,
    "decorativeContinuousAnimation": false
  },
  "upload": {
    "maxFilesPerProject": 15,
    "maxBytesPerFile": 20000000,
    "maxBytesTotal": 100000000,
    "displayUnit": "MB (decimal)",
    "acceptedExtensions": [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".csv",
      ".xlsx"
    ],
    "requiresActualUploadProgress": true,
    "readyMeaning": "Technically available; not professionally reviewed"
  },
  "input": {
    "maxOtherBuildingDescription": 160,
    "minOtherBuildingDescription": 3,
    "maxSubmissionComment": 2000,
    "numberLocale": "de-DE",
    "unknownValue": null,
    "annualConsumptionCanonicalUnit": "kWh/year"
  },
  "icon": {
    "preferredIfNoExistingSet": "Carbon",
    "sizesPx": [
      20,
      24
    ],
    "minimumHitTargetPx": 44
  },
  "accessibility": {
    "normalTextContrastMin": 4.5,
    "largeTextContrastMin": 3,
    "essentialGraphicContrastMin": 3,
    "minimumReflowWidthPx": 320,
    "textZoomPercent": 200,
    "hoverRequired": false,
    "colorOnlyMeaning": false
  },
  "precedence": {
    "visual": "These concrete Product Design tokens override illustrative analytics layout values.",
    "analytics": "Use Analytics Handoff for score semantics, unknowns, workflow, reasons and denominators."
  },
  "typography": {
    "hero": {
      "desktop": {
        "sizePx": 72,
        "lineHeightPx": 74,
        "weight": 700
      },
      "tablet": {
        "sizePx": 56,
        "lineHeightPx": 60,
        "weight": 700
      },
      "mobile": {
        "sizePx": 42,
        "lineHeightPx": 44,
        "weight": 700
      },
      "mobileSmall": {
        "sizePx": 38,
        "lineHeightPx": 41,
        "weight": 700
      }
    },
    "pageTitle": {
      "desktop": {
        "sizePx": 48,
        "lineHeightPx": 52,
        "weight": 700
      },
      "mobile": {
        "sizePx": 32,
        "lineHeightPx": 36,
        "weight": 700
      }
    },
    "sectionTitle": {
      "desktop": {
        "sizePx": 40,
        "lineHeightPx": 44,
        "weight": 700
      },
      "mobile": {
        "sizePx": 28,
        "lineHeightPx": 32,
        "weight": 700
      }
    },
    "subheading": {
      "desktop": {
        "sizePx": 24,
        "lineHeightPx": 30,
        "weight": 600
      },
      "mobile": {
        "sizePx": 22,
        "lineHeightPx": 28,
        "weight": 600
      }
    },
    "lead": {
      "desktop": {
        "sizePx": 20,
        "lineHeightPx": 28,
        "weight": 400
      },
      "mobile": {
        "sizePx": 18,
        "lineHeightPx": 26,
        "weight": 400
      }
    },
    "body": {
      "desktop": {
        "sizePx": 18,
        "lineHeightPx": 27,
        "weight": 400
      },
      "mobile": {
        "sizePx": 18,
        "lineHeightPx": 27,
        "weight": 400
      }
    },
    "uiLabel": {
      "desktop": {
        "sizePx": 16,
        "lineHeightPx": 22,
        "weight": 500
      },
      "mobile": {
        "sizePx": 16,
        "lineHeightPx": 22,
        "weight": 500
      }
    },
    "metadata": {
      "desktop": {
        "sizePx": 14,
        "lineHeightPx": 20,
        "weight": 400
      },
      "mobile": {
        "sizePx": 14,
        "lineHeightPx": 20,
        "weight": 400
      }
    },
    "overline": {
      "desktop": {
        "sizePx": 12,
        "lineHeightPx": 16,
        "weight": 500
      },
      "mobile": {
        "sizePx": 12,
        "lineHeightPx": 16,
        "weight": 500
      },
      "trackingEm": 0.12
    },
    "scoreDisplay": {
      "desktop": {
        "sizePx": 120,
        "lineHeightPx": 120,
        "weight": 700
      },
      "mobile": {
        "sizePx": 88,
        "lineHeightPx": 88,
        "weight": 700
      }
    },
    "dataNumber": {
      "desktop": {
        "sizePx": 28,
        "lineHeightPx": 34,
        "weight": 500
      },
      "mobile": {
        "sizePx": 24,
        "lineHeightPx": 30,
        "weight": 500
      }
    },
    "scoreInRow": {
      "desktop": {
        "sizePx": 40,
        "lineHeightPx": 44,
        "weight": 700
      },
      "mobile": {
        "sizePx": 32,
        "lineHeightPx": 36,
        "weight": 700
      }
    }
  }
}
```
