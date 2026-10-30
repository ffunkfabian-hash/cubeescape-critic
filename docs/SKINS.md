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
   und aus; Ausführung und Akzente tauschen nur Materialien). Seit 0.15 mit `--gen three` auch die Körper aus dem three.js-Generator
   (`buildRobotBody`, Ablage `assets/skins/<körper>-three/`, siehe unten). Alles in Modellmetern: Körper 1, Helm H 0,25 m je Einheit
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
node tools/skin_bake.mjs --model all --gen three   # die drei generierten Körper (0.15) und Scout (0.17), je ≈ 1–5 min
```

**Generierte Körper (0.15 „Anvil“):** `?model=<körper>&gen=three` lädt den Atlas `assets/skins/<körper>-three/`
(`skinAtlas.js › atlasName`), gebacken aus `buildRobotBody(name)`. Die GLB-Atlanten passen nicht: nur einfache Teile (Zylinder)
haben dieselbe Signatur, 128–144 von 380–408 Meshes. Teile mit CSG-Fugen (Maske, Wangen, Brust, Schulterpanzer, Kniekappen,
Schienbeinschalen) behalten ihre gebackenen Positionen wie Helm H: Rechnet eine andere Plattform den Schnitt anders, übernimmt das
Dreieck die UVs des nächsten gebackenen Dreiecks (`transferGeometry`); der Rest des Generators ist reine Arithmetik und wird
exakt nachgebaut. Größe je Körper ≈ 5 MB `atlas.bin` + 3,4 MB `maps.png` wie bei den GLB-Atlanten, Deckung ≈ 50 %
(GLB 46 %). `verify` meldet für alle drei Körper mit `&gen=three` jedes Mesh im Atlas.

**Scout aus dem Generator (0.17 „Outrider“):** eigener Atlas `assets/skins/scout-three/` aus `buildScout`
([Scout](HELM_SCOUT.md#threejs-generator-017-outrider)); geladen, sobald Scout mit `&gen=three` erscheint, allein oder auf einem Körper.
Gebackene Positionen tragen nur die BSP-Teile (Kern, Kragen, Kinnblock, Kieferstücke, Rückmodul) und die Mundwanne (Raycasts); Deckung
57 %, 3,7 MB `atlas.bin`. `verify` prüft Scout aus dem Generator allein und auf Paladin (44/44).

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

## Skins aus generierten Bildern: Bronze und Schrott (30.10.2026)

Ein Bildgenerator, der ein ganzes Atlasbild bemalt (Vorlage: exportierte Basisfarbe), malt jede Insel für sich: Er weiß nicht,
welche Inseln im 3D nebeneinanderliegen. Auf dem Modell wechselt das Material dann fleckig, Muster brechen an Nähten ab, Motive
landen zufällig. Aus solchen Bildern nimmt `web/tools/skin_swatches.py` deshalb nur das **Material**: je Rolle die größte ruhige
Fläche mit typischer Farbe als nahtlose Kachel und die leuchtenden Linienmotive (Runen, Leiterbahnen) als Bogen mit Alpha
(`assets/skins/textures/`). Die Rezepte legen sie nach Rolle und Bauteil auf – im Modellraum, ohne Nähte, für alle Körper und Helme:

- Schicht `tex`: Kachel triplanar im Modellraum (`tile_mm`, Modus `overlay`/`multiply`/`replace`), je Teil versetzt.
- Schicht `decal`: ein Motiv des Bogens je Teil (Wahl über die Teilmitte, links und rechts gleich), Projektion von vorn (`axis: z`)
  oder seitlich (`axis: x`), `glow` macht es leuchtend.
- Grundfarben je Rolle sind die Mediane der jeweiligen Inseln im Nutzerbild; Kantenabrieb, Rost bzw. Grünspan in Vertiefungen und
  Kratzer kommen aus Kantenabstand und AO des Atlas wie bei Rost, Glut, Ornat.
- **Helme mit eigenem Material:** Schichten mit `kinds: ["critic", "scout"]` gelten nur für Helm H und Scout (jede Mesh-Beschreibung
  trägt ihr Modell, `skinParts.js › describeSkinMeshes`). Die Helme haben in Bronze und Schrott eigene Plätze `<skin>_helm_shell`
  (Plattenmaterial außer Maske, Gesicht, Augen, Kinn) und `<skin>_helm_decals`; bis eigene Helmbilder da sind, sind es Kopien des
  Körpermaterials. Eine neue Helmkachel ersetzt einfach die Datei.

Beide Werkzeuge brauchen zusätzlich SciPy; seit 0.17 steht es in `web/requirements.txt` (`scipy==1.18.1`, Python ≥ 3.12), damit
`tools/test_skin_tools.py` auch in CI läuft (ohne SciPy überspringt er sich weiterhin).

```bash
python3 tools/skin_swatches.py <bild> <debug-ordner von skin_bake, z. B. ../runs/skins/waechter> ../assets/skins/textures <name>
```

### Prompts für Nano Banana Pro

**Empfohlen – Kacheln und Motivbögen** (direkt verwendbar, keine Atlas-Vorlage nötig). Je Material ein Bild:

> Seamless tileable texture, 1024 × 1024, of **[Material, z. B. worn grey painted steel armour plate with rust bleeding from
> scratches]** for a sci-fi robot. Flat, evenly lit, orthographic top-down view: no perspective, no shadows, no highlights, no
> objects, no text, no border. The left/right and top/bottom edges must continue exactly, so the image repeats without visible
> seams. Even detail density over the whole square; the square shows about 15 cm of surface.

Materialien je Skin: Panzerplatten (`shell`), dunkler Grundkörper (`graphite`), Gelenke/Kolben (`dark_metal`), Zierkanten (`trim`).
Ablage als `assets/skins/textures/<skin>_<rolle>.jpg`.

> Sprite sheet, 2048 × 2048, a 4 × 4 grid of 16 separate glowing **[cyan circuit-board traces / violet and gold runic glyphs]** on
> a pure black background (#000000). One motif centred in each cell with a wide black margin, nothing touches a cell border. Thin
> emissive lines only – no filled glowing areas, no haze wider than a few pixels. Flat front view, no perspective, no text, no grid
> lines or frames.

Umwandeln mit `python3 tools/skin_swatches.py --decals <bogen> ../assets/skins/textures <skin>` (0.17): jede der 4 × 4 Zellen wird
eine 256²-Zelle von `<skin>_decals.png`, Alpha aus der Helligkeit (Schwarz durchsichtig, ab ≈ 55 % voll), die Farbe durch Alpha
geteilt, damit schwache Linien ihre Farbe behalten; leere Zellen und ein nicht schwarzer Rand werden gemeldet, nicht quadratische Bögen
abgelehnt.

Für die Helme dieselben Prompts mit eigenen Materialien (z. B. „polished gunmetal helmet shell with fine engraving“); Ablage als
`<skin>_helm_shell.jpg` und `<skin>_helm_decals.*`.

**Nur wenn ein ganzes Atlasbild gewünscht ist** – je Modell die Vorlage mitgeben (Rollenfarben je Insel, weiße Inselränder,
magentafarbene Ränder = Motivflächen): `runs/skins/guide/<modell>_guide.png` (quadratisch wie der Atlas) und die Legende
`<modell>_guide_legende.png` als zweites Bild, für Wächter, Helm H (`critic`) und Scout, erzeugt mit
`python3 tools/skin_guide.py <debug-ordner von skin_bake> ../assets/skins/<modell>/maps.png <ziel.png>`. Das Ergebnis muss quadratisch
bleiben; `skin_swatches.py` bricht sonst ab (eine mitgelieferte Legende unter der Karte schneidet es ab):

> Paint a texture for this UV atlas of a sci-fi robot (first image), square, same resolution as the first image. Keep every
> island exactly in place and shape and paint only inside the islands; black areas stay pure black. The flat colour of an island is its material (legend in the
> second image): light grey = armour plates, blue = dark body frame, brown = joints and pistons, green = anodised inlays, yellow = trim
> and bolts, orange = accent stripes, purple = rubber and cables, cyan = glowing lights. All islands of the same colour get the
> same material with identical colour, scale and wear. Glowing motifs (one per island, centred, not touching the border) only in
> islands with a magenta outline, nowhere else. Details smaller than an island, no pattern running across an island border. Do
> not draw the white or magenta outlines, and do not add the legend to the result.

## Viewer

- Navigation **„Lackierung“**: Farbschema (Creme, Weiß-Graphit, Original) *oder* Skin (Rost, Glut, Ornat), für Körper und Helm
  zusammen; „Material gealtert/flach“ wirkt nur beim Farbschema. URL `&skin=rost|glut|ornat` (Farbschema bleibt darunter `&colors=`).
- **Texturen exportieren**: rendert den Mischer im UV-Raum (2048²) und lädt je Atlas Basisfarbe, ORM (glTF-Reihenfolge) und Emission
  als PNG herunter; Lücken zwischen den Inseln mit der nächsten Inselfarbe gefüllt. Der GLB-Export trägt dieselben Texturen.

## Vergleich mit der Blender-Fassung

`web/tools/skin_shots.mjs` rendert beide Fassungen mit derselben Kamera (Blender-Fassung: Commit `f8d1c5b`).
Bilder: `docs/bilder/skins_vergleich_<skin>.jpg`. Muster gleicher Rezepte unterscheiden sich im Zufall (anderes Hashing), nicht in Art
und Dichte. Die wellige Linienführung der Blender-Bänder an UV-Nähten entfällt, weil der Kantenabstand in 3D gemessen wird.
