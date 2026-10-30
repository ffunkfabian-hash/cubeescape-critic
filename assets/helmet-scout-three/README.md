# Scout aus dem three.js-Generator – Lieferstand 0.18

Scout v3 (Stand D29), gebaut vom three.js-Generator `web/src/robotgen/scout.js` (Guss und Parameter in `web/src/robotgen/data/`) und
geschrieben von `node web/tools/robotgen_export.mjs --model scout`. Der Viewer lädt diese Dateien (Standard). Die Blender-Fassung
`assets/helmet-scout/` bleibt als eingefrorene Referenz der Messtests.

| Datei | Inhalt |
| --- | --- |
| `assembled/scout.glb` | montierter Helm, 44 Meshes, 182 438 Dreiecke; glTF Y oben, vorn +Z, Höhe ≈ 1,0 (4,2 MB) |
| `exploded/scout_exploded.glb` | dieselben Meshes, je Teil um den Explosionsversatz verschoben |
| `parts.json` | 18 Gruppen S01–S13 (seitige Teile je R/L) mit Objekten und Versatz – gleich der Blender-Fassung (Test) |
| `manifest.json` | Generator (Eingaben-Hash, Bibliotheken, Plattform), je Objekt Teil, Punkte, Dreiecke, Bounding-Box (Blender-Koordinaten), `digest` |

Jedes Mesh trägt die `extras` `part_id`, `part_label`, `side`, `source_object`. Die Materialien sind die flachen Ersatzmaterialien des
Blender-Pakets (`web/src/robotgen/scoutMaterials.json`). Cycles-Ansichten: `blender/cycles_render.py` liest diesen GLB.

[Aufbau](../../docs/HELM_SCOUT.md#threejs-generator-017-outrider) · [Prüfbericht](../../docs/versions/0.18.md)
