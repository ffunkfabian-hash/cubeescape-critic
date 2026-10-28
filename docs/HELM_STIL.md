# Helm – Stil- und Formbeschreibung

## Verbindlicher Stand

Aktueller Lieferstand: **Prüflauf 79**. Nach Nutzerfeedback ist der Scheitel nun quer und längs gewölbt;
der Kopfbügel folgt der Haube. Ihr Rand läuft weich zur Augenmaske aus. Das helle Hinterkopfgehäuse und der Nackenrahmen sind wieder rund; die Kieferplatten bleiben kantig.
Zwei separate Stirnblenden ergänzen die Haube gemäß der [Nutzerzeichnung](../reference/helm-forehead-request-20261028/stirnblenden-markierung.jpg).
Die abgeflachten, eckigen Haubenversuche 62/63 wurden vom Nutzer ausdrücklich verworfen.

![Aktueller Helm mit runder Haube](bilder/helm_aktuell.jpg)

Das Video ist die maßgebliche Formreferenz. Vier feste Ansichten unter `web/refs/` und unveränderte Kameras dienen
zum Vergleich. Die Meshy-GLB ist ausschließlich eine zusätzliche 3D-Referenz; ihre Geometrie wird nicht importiert.
Die Zuordnung ist im [Verlauf](HELM_VERLAUF.md) dokumentiert. „Vorher“ bezeichnet keine eindeutige Standnummer.

## Formensprache

- **Schädelhaube H01:** geschlossene, ruhig gewölbte Schale mit fließendem Scheitel. Keine flache Platte oben,
  keine abgeschnittenen hellen Flecken und keine ausgeprägten geraden Schulterflächen. Der Bügel folgt der Rundung.
  Der Übergang zur Augenmaske soll möglichst ohne sichtbare Fugenlinie wirken. Eine minimale verdeckte Überlappung
  und Randabdeckung reduzieren die helle Linie; H01 und H02 bleiben getrennt. Material-/Lichtunterschiede können den Übergang noch zeigen.
- **Stirnblenden H20/H21:** zwei flach aufliegende Trapeze oberhalb der Augen, oben schmaler, mit freiem Mittelstreifen.
  Sie folgen der Haubenrundung und verwenden das Material der Maske. Ihre Unterkanten schließen mit flach auslaufender
  Überlappung direkt an die Augenmaske an; kein freier Haubenstreifen dazwischen. Separate Meshes; die Haube bleibt darunter erhalten.
  Dies ist eine gezielte Nutzerergänzung zur Videovorlage.
- **Gesicht H02–H06:** dunkle, kantige Panzerplatten mit schmalen Fugen, zurückgesetztem trapezförmigem Mitteleinsatz
  und klaren Wangenflächen. Die akzeptierten cyanfarbenen Augen bleiben in Form, Lage und Leuchtwirkung erhalten.
  Die Augenmaske H02 soll optisch durchgängig bis zu den Seiten laufen. Die dunklen Streifen neben den Augen in
  Stand 79 entstehen am abrupten Richtungswechsel der Fläche, verstärkt durch die Beleuchtung; dort ist keine Teilefuge.
  **Vorgeschlagener nächster Schritt, noch nicht umgesetzt:** den seitlichen Übergang breiter und sanfter runden,
  ohne Augenöffnungen, Haubenrundung oder die übrige kantige Formensprache zu verändern.
- **Heller Rahmen H07–H11:** kräftige, asymmetrisch gegliederte technische Konstruktion. Die gewählte Kieferkontur aus
  Stand 46 bleibt erhalten. Seiten-/Hinterkopfgehäuse und Nackenrahmen sind glatt elliptisch gerundet. Die schmale obere Fase und
  gerade abgeschrägten Vertiefungen bleiben; ihre separaten Böden folgen der runden Wand. Keine erneut verschmälerten Kieferplatten wie in den verworfenen Versuchen 51–58.
- **Anbauten H12–H18:** auf ausdrücklichen Nutzerwunsch symmetrische Funkmuscheln auf A und B, einschließlich
  Bedienknöpfen, schwarzen Spiralkabeln, Haltern und Antennen. Die komplette Einheit von A wird an X=0 nach B gespiegelt.
  Das frühere helle Ohrmodul samt seinem Halter entfällt im aktuellen Aufbau. Das mittige Heckmodul bleibt einmal
  vorhanden; beide Kabel nutzen dessen seitliche Anschlüsse. Diese Symmetrie ersetzt die frühere asymmetrische Vorgabe.
- **Halsanschluss H19:** rund und zurückgesetzt. Der schwarze Hals ist ein Präsentationsträger; der Schal aus dem Video
  ist kein Bestandteil des exportierten Helms.

## Material- und Farbpalette

Haube und Maske verwenden dieselbe Graphitgrundfarbe. Die Haube erhält eine sichtbare, feine Lackkörnung aus
prozeduraler Farb-, Normalen- und Rauheitskarte (`crownMaps`, Seed 73). Das Relief verändert die Lichtantwort, nicht die
runde Geometrie. Die Normalenkarte ist im regulären GLB-Materialkanal enthalten. Das Maskenmaterial bleibt unverändert.
Rauheit 0,90, Glanzintensität 0,45 und Umgebungsreflexion 0,35 dämpfen weiterhin breite helle Glanzflecken.
Die grobe, lederartige erste Texturprobe 70 ist verworfen; Stand 71 verwendet ein deutlich flacheres Relief.

Die Werte stammen aus [materials.js](../web/src/materials.js); das Rendering ergänzt Licht, Tonemapping und Texturen.
Die Augenfläche und ihre seitlichen Fortsetzungen gehören zum selben Mesh `Shell` mit demselben Material `darkArmor`
(Rauheit 0,75, Metallanteil 0,15). Ein heller Seitenreflex und dunkle Frontstreifen sind deshalb kein Materialwechsel.
Die Flächenausrichtung sowie das mit der Ansicht gedrehte Licht und die Umgebung bestimmen die Reflexion mit.
Eine spätere Korrektur soll zuerst den geometrischen Übergang prüfen; keinen hellen Streifen in die Farbtextur malen.

| Bereich | Basisfarbe | Wirkung |
|---|---|---|
| Dunkle Panzerung | `#313438` | Graphit, überwiegend matt, leicht metallisch |
| Helles Gehäuse | `#D6D7D5` | Gebrochenes Weiß, dezente Gebrauchsspuren |
| Strukturierte Einlagen | `#A8A9A6` | Feine, matte Oberflächenstruktur |
| Funk-/Heckmodule | `#4A493E` | Gedämpftes Olivgrau |
| Augen | `#5FE3D6` | Cyan, Emission 1,0; Form und Lage bewahren |
| Gummi und Kabel | `#141414` | Dunkel, rau |
| Metallhalter | `#1A1A1A` | Dunkles Metall mit kontrollierten Glanzkanten |

Texturen werden prozedural mit festen Seeds erzeugt. Acht unterschiedliche Karten liegen als PNG-Dateien im [Lieferstand](../assets/helmet/textures/).
`materials.json` enthält Wiederholung und Bump-Stärke. Farb-/Rauheitskarten sind im GLB eingebettet; Three.js-Reliefkarten
zusätzlich als Höhen-/Bump-Texturen zuordnen, da glTF diesen Kanal nicht direkt übernimmt.

## Aufbau und Reproduktion

Quelle ist der Three.js-Generator, keine von Hand geänderte Exportdatei. Formparameter liegen in
[helmetParams.json](../web/src/helmetParams.json); einige Kieferkonturen stehen noch direkt in `parts/lowerArmor.js`. Feste Teilekennungen H01–H21 stehen in [HELM_TEILE.md](HELM_TEILE.md).
Im Generator zeigt +Y nach oben, +Z nach vorn. Seite A liegt bei −X (Kamera `right`), Seite B bei +X (`left`).
Die anders bezeichneten Achsen in der ursprünglichen Formbeschreibung werden nicht mit diesen Arbeitskoordinaten vermischt.

Der GLB enthält **104 Meshes** mit getrennten Baugruppen; Schraubensätze können gemeinsam in einem Mesh liegen.
[parts.json](../assets/helmet/parts.json) listet die tatsächlichen Exportobjekte und Materialien.
Einzelne Meshes sind noch keine Zusicherung fertiger Druckwandstärken, Montagepassungen oder tragbarer Schutzwirkung.

Änderungen einzeln parametrisieren, alle vier Ansichten bei gleichen Kameras prüfen und Bilder mit konkreten
Standnummern beschriften. Messwerte ergänzen die Sichtprüfung; Silhouetten-IoU ist kein Prozentwert für die Gesamtähnlichkeit.
Die optionale Körperstudie (`?body=1`) ist ein separater Proportionsentwurf und nicht als fertige Körperform freigegeben.

[Reproduktionsanleitung](../web/README.md#aktueller-lieferstand-79) · [GLB und Prüfbelege](../assets/helmet/README.md)
