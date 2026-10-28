# Helm – technische Übergabe für KI-Agenten

## Status und Bedeutung dieses Dokuments

Stand: 28.10.2026, Version **0.4 „Continuity“**. Dies ist die Beschreibung des erzeugten Modells und der Versuche,
kein eigenständiger Auftrag zur weiteren Änderung. Aktuelle Nutzeranweisungen haben Vorrang.

- **Letzter früherer Lieferexport:** 79 unter `assets/helmet/`, reproduzierbar aus Commit `0a6bda5`.
- **Aktueller Generator:** neue Geometrie 80–84. Ohne URL-Optionen: Originalmaterial und dunkle Schrauben, entsprechend 80.
- **Aktueller Vergleich:** vier Material-/Akzentkombinationen 81–84 plus Formkontrolle 80.
- **Nutzerwahl:** noch offen. Positive Rückmeldungen bedeuten keine eindeutige Auswahl zwischen den Kombinationen.
- **Repo:** Branch `codex/critic-0.4-continuity`, aufgebaut auf dem offenen 0.3-Entwurf. Kein Merge auf `main`.
- **Quelle der Wahrheit:** Generator und Parameter; Exporte und Bilder sind daraus abgeleitete Prüfbelege.

Einstiege: [Stil](HELM_STIL.md), [Teilekennungen](HELM_TEILE.md), [Chronologie](HELM_VERLAUF.md),
[Varianten und Exporte](../assets/helmet-continuity/README.md), [Prüfbericht](versions/0.4.md).

## Nutzerentscheidungen und Grenzen

1. Das Video bleibt die maßgebliche Formreferenz. Meshy ist nur zusätzliche 3D-Referenz, keine importierte Geometrie.
2. Die Augen sind akzeptiert: Lage, Maße, V-Winkel, Tiefe, Cyan und Leuchtwirkung erhalten.
3. Haube und helles Hinterkopfgehäuse sollen rund bleiben. Die früheren eckigen Haubenversuche sind verworfen.
4. Haube und Augenmaske sollen optisch zusammenlaufen; eine auffällige helle Fuge ist unerwünscht.
5. Zwei separate Stirntrapeze sind gewünscht. Sie schließen an die Maske an und laufen jetzt bis zum Hinterkopf.
6. Die Funkmuschel samt Kabel, Halter und Antenne ist auf beide Seiten gespiegelt; der Heckkasten bleibt einmal mittig.
7. Kleine Befestigungen auf dunkler Rüstung dürfen hell werden; schwarze Befestigungen auf hellem Rahmen bleiben erhalten.
8. Metall, Graphit und weiße Streifen sind Materialversuche. Keine Probe stillschweigend zum bestätigten Stil erklären.
9. Alles bleibt prozedural reproduzierbar und in separate Baugruppen gegliedert. Das ist noch keine Fertigungskonstruktion.

Die Punkte 5–8 sind ausdrückliche gestalterische Ergänzungen zur Videovorlage. Eine höhere Silhouetten-IoU ist dafür
kein Abnahmekriterium. Historische Nutzerbilder immer über die Standnummer identifizieren; „Vorher“ allein ist mehrdeutig.

## Szenenaufbau und Datenfluss

Koordinaten: +Y oben, +Z vorn. Seite A = −X = in der Frontansicht links = Kamera `right`.
Seite B = +X = Kamera `left`. Maße sind Modelleinheiten; die Helmhöhe liegt ungefähr bei 1.

```text
helmetParams.json → params.js (D)
                     ↓
helmet.js → UpperHelmet / LowerArmor / HeadBand / Comms / Neck / ForeheadPlates
                     ↓
           Spiegelung der Funkteile → fitHelmet (untere Gesichtsproportionen)
                     ↓
materials.js + finishPresets.js → gezielte Material-/Akzentzuordnung in main.js
                     ↓
verify_renders.mjs → vier Ansichten + GLB + echte PNG-Karten + verification.json
                     ↓
save_pass.py → nummerierter Durchlauf / Vergleichsbild
```

Die Ausgabe enthält **104 Meshes**. Ein Schraubensatz kann als gemeinsames Mesh exportiert sein; nicht jede Schraube
ist ein eigenes Objekt. `fitHelmet` verformt zusammengehörige Unterteile kohärent und wandelt Instanzschrauben dabei
in zusammengefasste Geometrie um. Nicht am exportierten GLB weiterformen und diese Änderung als Generatorstand ausgeben.

| Zuständigkeit | Quelle | Bedeutung |
|---|---|---|
| Kontur/Haube | [headVolume.js](../web/src/parts/headVolume.js) | Loft aus Profilen, getrennte runde Haubenform |
| Maske/Augen/Wangen | [upperHelmet.js](../web/src/parts/upperHelmet.js) | CSG-Flächen, Augensockel, Fasen, Schrauben |
| Scheitelstreifen H20/H21 | [foreheadPlates.js](../web/src/parts/foreheadPlates.js) | Zwei getrennte dünne Schalen aus der tatsächlichen Haube |
| Kiefer/heller Körper | [lowerArmor.js](../web/src/parts/lowerArmor.js) | Untere getrennte Baugruppen und runder Hinterkopf |
| Funktechnik | [rightComms.js](../web/src/parts/rightComms.js), [mirrorComms.js](../web/src/parts/mirrorComms.js) | Original A, geometrisch gespiegelte Kopie B |
| Oberflächen | [materials.js](../web/src/materials.js), [textures.js](../web/src/textures.js) | PBR-Werte und deterministische Canvas-Texturen |
| Varianten | [finishPresets.js](../web/src/finishPresets.js) | Benannte Finish-/Akzentwerte, Eingabevalidierung |

## Geometrische Änderung 0.4

**Problem:** Die Maske war neben den Augen geometrisch geschlossen, wirkte durch abrupte Flächenwechsel aber unterbrochen.
Augenfläche und Seitenfläche verwenden dasselbe Material. Nur „das Licht“ als Ursache zu nennen war unvollständig:
Der Knick der Oberfläche erzeugt den starken Helligkeitswechsel erst.

**Lösung:** Für die beiden seitlichen Facettenpaare ersetzt eine zylindrische tangentiale Rundung die schmale Fase.
`templeRound.radius=0.055`, `segments=10`. Zusätzliche Schnittflächen nähern den Kreisbogen an; analytische radiale
Normalen glätten nur dessen Außenseite. Augensockel werden danach ausgeschnitten, damit ihre scharfen Ränder erhalten
bleiben. Die Rundung setzt sich in den angrenzenden Wangenflächen fort; die übrige kantige Formensprache bleibt bestehen.

**Streifen:** H20/H21 sind keine aufgemalten Linien. Aus der Haubengeometrie werden Außen- und Innenvolumen abgeleitet;
ihre Differenz ergibt eine dünne Schale. Ein seitlich begrenzter Umriss erhält die vordere Trapezform und verlängert
sie über den Scheitel nach hinten. Der Abstand wird radial um die Haube erzeugt, nicht nur nach vorn verschoben.
Die Normalen werden über die inverse transponierte Ableitung der Verformung transportiert, damit keine horizontalen
Schattierungsbänder an CSG-Schnittpunkten entstehen. `wrapToRear=true`; Mittelstreifen und bisheriger Kopfbügel bleiben frei.

Wichtige Parameter: `projection=.007`, `embed=.001`, `joinBlendHeight=.05`, `joinOverlap=.003`, `joinLip=.003`,
`offsetCentreY=.1`, `offsetRadius=.45`. Diese Werte dienen der aktuellen visuellen Form, nicht als Fertigungstoleranzen.

**Prüfgrenze:** Der Bügel liegt außen über den Streifen. Innen besteht lokal etwa .002 Überlappung. Vor realer Montage
müssten Auflage, Wandstärken, Spiel und Befestigung konstruiert werden. Keine „druckfertig“-Aussage aus dem Render ableiten.

## Materialien und Akzente als unabhängige Achsen

| Finish | Farbe / Struktur | Rauheit | Metallanteil | Relief |
|---|---|---:|---:|---|
| `original` | bisherige Hauben-/Maskenmaterialien | unterschiedlich | überwiegend .15 | bisherige Karten |
| `metal` | `#313438`, gleichmäßige Farbe, Masken-Rauheitskarte Seed 11 | .50 | .55 | Haubennormalen Seed 73, Stärke .06 |
| `graphite` | `#313438`, Farb-/Rauheits-/Normalenkarten der Haube Seed 73 | .90 | .15 | feine Lackkörnung, Stärke 1 |

Metall verwendet Umgebungsintensität .7, Graphit .35. Die erste stärker strukturierte Metallprobe war fleckig;
deshalb wurde die Farbmap dort entfernt und das Relief stark reduziert. Innerhalb eines Finishes teilen sich Haube,
Maske, Wangen, Mundschienen und Stirnstreifen die passenden Karten. Technische Anbauten behalten ihren Originalklon.

| Akzent | Wirkung |
|---|---|
| `original` | bisherige dunkle obere Schrauben und dunkle Streifen |
| `light-fasteners` | ausschließlich `Screws_Upper` in `#D6D7D5`, Rauheit .6, Metallanteil .05 |
| `white-strips` | zusätzlich H20/H21 mit bestehendem `whiteArmor` inklusive Rahmen-Texturen |

Nicht `darkMetal` global weiß färben: Das würde auch Kabelanschlüsse, Halter, Funkdetails und Schrauben auf dem weißen
Rahmen verändern. Die Akzentwahl weist nur den benannten Zielobjekten andere Materialien zu; keine Geometrieänderung.
Alle neun Kombinationen aus Finish und Akzent sind technisch unterstützt und getestet. Exportiert wurden:

| Stand | Finish | Akzent | Zweck |
|---|---|---|---|
| 80 | original | original | Formkontrolle gegenüber 79 |
| 81 | metal | light-fasteners | Metall, dunkle Streifen |
| 82 | graphite | light-fasteners | Graphit, dunkle Streifen |
| 83 | graphite | white-strips | Graphit, weiße Streifen |
| 84 | metal | white-strips | Metall, weiße Streifen |

## Visueller Eindruck des umsetzenden Agenten

Dies sind gestalterische Einschätzungen nach Sichtprüfung, keine Messwerte und keine Nutzerfreigabe:

- **Form:** Die durchlaufenden Streifen geben der runden Haube eine erkennbare Längsrichtung. Vorne bleibt die
  Trapezform deutlich, hinten erscheinen zwei kürzere Felder unterhalb des Bügels. Die Rundung neben den Augen
  mildert den harten Übergang, während Reflexe auf der größeren Seitenfläche weiterhin winkelabhängig bleiben.
- **Graphit:** ruhig, geschlossen, eher beschichtete Einsatzrüstung. Die Cyanaugen wirken als stärkster Lichtakzent.
  Dunkle Streifen sind hier zurückhaltend; die Form ist besonders im Streiflicht sichtbar.
- **Metall:** betont Volumen und Kanten stärker. Breite Reflexe machen die runde Haube anschaulich; die Seitenmaske
  wirkt technischer. Es ist ein dunkles Metallfinish, kein Chrom. Die stärkeren Helligkeitswechsel sind Teil dieses Looks.
- **Weiße Streifen:** deutlich grafischer und kontrastreicher. Sie verbinden die Kopfoberseite farblich mit dem
  hellen Kieferrahmen, bleiben aber eigenständige Bauteile. Die Form wird auch ohne günstigen Glanzwinkel lesbar.
- **Helle Schrauben:** verbessern die Lesbarkeit kleiner Befestigungen. Ihre Punktwirkung ist gewollt; sie sollen
  weder leuchten noch zu großen dekorativen Nieten werden.
- **Eigene Tendenz:** Metall mit weißen Streifen betont die technische Form am stärksten; Graphit mit weißen Streifen
  wirkt ruhiger. Beide sind plausibel. Die Entscheidung bleibt beim Nutzer, nicht beim Agenten oder bei der IoU.

## Abnahme, Reproduktion und nächste Schritte

44 Tests: 31 Node-, fünf IoU- und acht Belegsicherungsprüfungen. Build, Projekt-/Dokumentationsprüfung und unabhängige
Codeprüfung gehören zum [Versionsbericht](versions/0.4.md). Der unabhängige Richter hat Freigabe erteilt.
Vier identische Kameras je Variante, gleiche Referenzen, Lichtführung und feste Seeds. Die Umgebung dreht mit dem
Kameraazimut wie bei einer Drehtelleraufnahme; deshalb identische Ansichten vergleichen, nicht beliebige Perspektiven.

Der Exportvergleich belegt 104 geometrisch identische Meshes in allen fünf Varianten und identische Silhouettenmasken.
Gegenüber 79 sind 97 Meshes einschließlich Transformationen bytegleich. Die sieben Abweichungen umfassen Maske,
Wangen, obere Befestigungen, beide Streifen und numerische Rundung an `Visor_L`. Dessen Positionen unterscheiden sich
um höchstens 2.12e−8 Modelleinheiten, die Transformtranslation um 7.30e−9; Normalen/UVs und Augenmaße bleiben erhalten.
Keine Bytegleichheit der gesamten Augenbaugruppe gegenüber 79 behaupten.

Mittlere Silhouetten-IoU aller neuen Varianten: **90,89 %**. Das ist kein Wert für Materialqualität oder gesamte
Referenzähnlichkeit. Prüfumgebung: macOS arm64, Node 24.19.0, Python 3.12.10, Chromium 151.0.7922.34, ANGLE SwiftShader.
Exakte Pakete/Quellhashes/PNG- und GLB-Hashes stehen je Variante in `verification.json`.

Reproduktion und CLI-Beispiele stehen im [Exportverzeichnis](../assets/helmet-continuity/README.md). Normale GLB-Kanäle
übernehmen Farb-/Rauheits-/Normalenkarten; Three.js-Bump-Karten zusätzlich über die gelieferten PNGs zuordnen.
Vor schwerem Lauf die GPU-Sperre verwenden. Kontaktbögen werden aus denselben geprüften Frames zusammengesetzt.

Für die Fortsetzung: zuerst konkrete Standnummer und gewünschte Finish-/Akzentkombination klären. Danach nur den
gewählten Parameterbereich ändern, Augen-/Teile-Invarianten prüfen und bei sichtbaren Änderungen feste Ansichten
vergleichen. Optionaler Körperentwurf und echte Montage-/Druckkonstruktion sind separate Aufgaben.
