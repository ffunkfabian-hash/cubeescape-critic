# Skins (0.13) – Lackierungen für Körper und Helme in three.js

Drei Skins nach dem Referenzbild des Nutzers vom 29.10.2026: **Rost** (Orange und Navy, Streifen, abgeplatzter Lack), **Glut**
(Schwarz mit roten Leuchtlinien, Chevrons, Rauten, Emblem) und **Ornat** (Weiß, Violett und Gold mit Filigran). Sie gelten für
alle drei Körper (Wächter, Paladin, Mechanik) und beide Helme (Helm H, Scout), auf dem Roboter und beim Helm allein.
Die Werkzeugkette läuft ohne Blender: Atlas und Karten in Node, Mischer als Shader im Viewer.

## Ablauf

```text
Mesh-Quelle ──► Atlas (xatlas) ──► Karten im UV-Raum ──► Kantenabstand + AO ──► assets/skins/<modell>/
 (GLB, Helm H                         (Position, Normale,      (three-mesh-bvh)        atlas.json, atlas.bin, maps.png
  aus dem Generator)                   Teile-/Rollen-ID)                                       │
                                                                                               ▼
                          Viewer: Rezept aus skins.json ──► Shader je Fragment ──► live, Texturexport, GLB
```

1. **Quelle** (`web/tools/skin_bake.mjs`): Körper- und Scout-GLB, Helm H direkt aus dem Generator (`buildHelmet`, Stirnblenden an
   und aus; Ausführung und Akzente tauschen nur Materialien). Alles in Modellmetern: Körper 1, Helm H 0,25 m je Einheit
   (`helmetFrameMeters`), Scout über seine Einpassung (`scoutFit`) ebenso.
2. **Atlas** (`web/tools/skinXatlas.mjs`, xatlasjs 0.2.0, WASM): Punkte werden nur verschweißt, wenn auch die Schattierungsnormalen
   übereinstimmen (≤ 20°) – CSG-Dreiecke wachsen zu Flächen zusammen, harte Kanten bleiben Kartengrenzen. Diagramme einmal
   berechnet, dann mit korrigierter Dichte neu gepackt, bis der Atlas in 2048² passt; Rand 2 px. Deterministisch (zwei Läufe
   bytegleich).
3. **Karten im UV-Raum**: jedes Dreieck wird in seinen Atlas-UVs gerastert (Texelmitte, Baryzentrik) – Position und Normale in
   Modellmetern, Mesh-, Teile- und Rollen-ID. Diese Karten liegen als Bilder in `runs/skins/<modell>/` (nicht im Repo) zur Kontrolle.
4. **Kantenabstand in mm**: je Mesh die Kanten einer Platte in 3D – offene Ränder, Normalensprünge über 20° und gerundete Streifen,
   deren Normalen sich schneller als 18°/mm drehen (wie die Blender-Fassung: 20° zwischen Texeln von 1,1 mm). Je Texel der
   kürzeste Abstand dazu (`MeshBVH.closestPointToPoint`), bis 64 mm. Gemessen in 3D statt im Bild: keine Sprünge an UV-Nähten.
5. **AO**: 32 kosinusgewichtete Strahlen je Texel bis 15 mm gegen das ganze Modell (`MeshBVH.raycastFirst`), 3×3 entrauscht.
   Kantenabstand und AO laufen in Worker-Threads (Wächter ≈ 35 s auf 9 Kernen).
6. **Ablage** `assets/skins/<modell>/`: `atlas.json` (je Mesh Schlüssel, Signatur, Bake-Matrix), `atlas.bin` (je Mesh Quellpunkt,
   UV, Dreiecke) und `maps.png` (R AO, G Kantenabstand als √-Code, B Deckung). Der Atlas ersetzt die Geometrie nicht, er bildet
   die Punkte jedes Meshes neu ab – darum funktioniert er auch für Meshes, die erst zur Laufzeit entstehen.

```bash
node tools/skin_bake.mjs --model all        # aus web/; je Modell 1–2 min, Karten zur Kontrolle in ../runs/skins/
```

## Mischer (`web/src/skinShader.js`)

Ein Rezept (`web/src/skins.json`, aus der Blender-Fassung übernommen) ist eine Folge von Schichten: fill, band, wear, dirt, scratches,
stripes, diamond, chevron, emblem, filigree. Es wird zu GLSL übersetzt und je Fragment in Modellmetern ausgewertet; nur AO und
Kantenabstand kommen aus `maps.png`. Muster bleiben dadurch auch ganz nah scharf. Rauschen ist nach der Pixelgröße bandbegrenzt
(Oktaven feiner als etwa ein Pixel blenden zum Mittelwert), Schwellen werden um ihre Bildschirmableitung geweitet.

- **Auswahl je Mesh** (CPU, `skinLayerMask`): Rolle, Teil (Glob), Baugruppe, Seite. Körper liefern glTF-Extras `asm`, `part`,
  `side` und Rollenmaterialien `MT_<role>_color` – jede Mesh-Quelle mit dieser Konvention funktioniert, auch künftige three.js-Körper.
  Helme: Rollen aus `robotHelmetColors.json` wie bei den Farbschemata, Teile über `skins.json › aliases` (z. B. H01 → `cap`).
- **Auswahl je Fragment**: Blickrichtung (`facing`), Muster im Teilrahmen (Mitte und halbe Höhe des Meshes, Seite R gespiegelt).
- Meshes ohne passenden Atlas-Eintrag (anderer Parameterstand) werden ohne Karten gemalt, mit Warnung in der Konsole.

## Viewer

- Navigation **„Lackierung“**: Farbschema (Creme, Weiß-Graphit, Original) *oder* Skin (Rost, Glut, Ornat), für Körper und Helm
  zusammen; „Material gealtert/flach“ wirkt nur beim Farbschema. URL `&skin=rost|glut|ornat` (Farbschema bleibt darunter `&colors=`).
- **Texturen exportieren**: rendert den Mischer im UV-Raum (2048²) und lädt je Atlas Basisfarbe, ORM (glTF-Reihenfolge) und Emission
  als PNG herunter; Lücken zwischen den Inseln mit der nächsten Inselfarbe gefüllt. Der GLB-Export trägt dieselben Texturen.

## Vergleich mit der Blender-Fassung

`web/tools/skin_shots.mjs` rendert beide Fassungen mit derselben Kamera (Blender-Fassung: Commit `f8d1c5b`).
Bilder: `docs/bilder/skins_vergleich_<skin>.jpg`. Muster gleicher Rezepte unterscheiden sich im Zufall (anderes Hashing), nicht in Art
und Dichte. Die wellige Linienführung der Blender-Bänder an UV-Nähten entfällt, weil der Kantenabstand in 3D gemessen wird.
