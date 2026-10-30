# Roboterkörper aus dem three.js-Generator – Lieferstand 0.18

Die drei Körperstudien Wächter, Paladin und Mechanik, gebaut vom three.js-Generator `web/src/robotgen/` (Übertragung der Ballon-Quelle,
Commit in `web/src/robotgen/data/SOURCE.json`) und geschrieben von `node web/tools/robotgen_export.mjs`. Der Viewer lädt diese Dateien
(Standard). Die Blender-Fassung `assets/robot-bodies/` bleibt als eingefrorene Referenz der Messtests.

| Datei | Inhalt |
| --- | --- |
| `<name>/assembled/<name>.glb` | montierter Körper, Haltung `idle`, ohne Waffe; glTF Y oben, vorn +Z, Meter, Füße auf y = 0 |
| `<name>/parts.json` | fünf Baugruppen mit Explosionsversatz `explode_mm` und Teilen je Seite – inhaltlich gleich der Blender-Fassung (Test) |
| `<name>/manifest.json` | Generator (Eingaben-Hash, Bibliotheken, Plattform), Maße, je Objekt Baugruppe, Teil, Seite, Punkte, Dreiecke, Bounding-Box (Blender-Koordinaten wie bisher) und `digest` der Geometrie |

Aufbau wie die Blender-Pakete: Wurzeln sind die Segmentknoten `SEG_*`/`ARM_*` mit `asm`/`side`, jedes Mesh trägt die `extras` `asm`,
`part`, `part_de`, `side`, `study`; flache Materialien `MT_<rolle>_color`. Explodiert wird im Viewer über die Segmentknoten.

| Körper | Objekte | Punkte | Dreiecke | Größe (mm) | GLB |
| --- | --- | --- | --- | --- | --- |
| Wächter | 408 | 271 833 | 377 735 | 1668 × 866 × 525 | 8,8 MB |
| Paladin | 383 | 255 790 | 353 108 | 1710 × 802 × 500 | 8,2 MB |
| Mechanik | 380 | 254 065 | 353 001 | 1715 × 731 × 457 | 8,2 MB |

**Neu exportieren** nach jeder Änderung in `web/src/robotgen/` (der Test `web/tools/robotgen_export.test.mjs` meldet es):

```bash
node web/tools/robotgen_export.mjs                 # alle Körper und Scout; --model <name>, --check prüft ohne zu schreiben
node web/tools/skin_bake.mjs --model <name>        # Skin-Atlas, wenn sich Meshes geändert haben
```

Zwei Exportläufe ergeben bytegleiche Dateien. Auf einer anderen Plattform als der im Manifest kann three-bvh-csg einzelne Fugen anders
triangulieren; der Test vergleicht dort nur Meshes, Extras und Boxen. [Aufbau](../../docs/ROBOTER_BALLON.md#export-018-prefab) ·
[Prüfbericht](../../docs/versions/0.18.md)
