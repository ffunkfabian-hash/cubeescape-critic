# Roboterkörper 0.10 – Blender-Fassung (eingefrorene Referenz)

> Seit 0.18 lädt der Viewer die Körper aus dem three.js-Generator ([`assets/robot-bodies-three/`](../robot-bodies-three/README.md)).
> Diese Dateien bleiben unverändert als Referenz (seit 0.19 Bericht `web/tools/robotgen_reference.mjs`, bis 0.18 Test
> `robotgen.test.mjs`; IoU mit `robotgen_compare.mjs`) und im Viewer
> unter `&gen=blender`; das Exportskript liegt im Archiv (`archive/blender/robot/`).

Drei Körperstudien aus `cubeescape-ballon` (Roboter Runde 5, Commit `14bd78d`, siehe `web/src/robotgen/data/SOURCE.json`), exportiert mit
`archive/blender/robot/export_robot.py`. Je Ordner `waechter/`, `paladin/`, `mechanik/`:

| Datei | Inhalt |
| --- | --- |
| `assembled/<name>.glb` | montierter Körper, Haltung `idle`, ohne Waffe; glTF Y oben, vorn +Z, Meter, Füße auf y = 0 |
| `parts.json` | fünf Baugruppen (`head`, `arms`, `upper_body`, `lower_body`, `legs`) mit Explosionsversatz `explode_mm` und Teilen je Seite |
| `manifest.json` | Quelle, Blender-Version, Maße, Ankerabstände, je Objekt Baugruppe, Teil, Seite, Vertices, Dreiecke, Bounding-Box (Blender-Koordinaten) |

Jedes Mesh trägt die `extras` `asm`, `part`, `part_de`, `side` und `study`. Die GLB-Wurzeln sind die Segmentknoten von Ballon (`SEG_*`, `ARM_*`)
mit `asm`/`side`. Über sie explodiert der Viewer den Körper, deshalb gibt es keinen zweiten GLB. Die Materialien sind die flachen
Gestaltungsfarben der Ballon-Rollen.

Zwei Exportläufe ergeben bytegleiche Dateien. [Aufbau, Export, Viewer](../../docs/ROBOTER_BALLON.md) · [Prüfbericht](../../docs/versions/0.10.md)

![Drei Körper](../../docs/bilder/roster_koerper.jpg)
