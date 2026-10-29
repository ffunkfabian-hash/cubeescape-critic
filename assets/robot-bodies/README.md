# Roboterkörper 0.10 – Lieferstand

Drei Körperstudien aus `cubeescape-ballon` (Roboter Runde 5, Commit `14bd78d`, siehe `blender/robot/SOURCE.json`), exportiert mit
`blender/robot/export_robot.py`. Je Ordner `waechter/`, `paladin/`, `mechanik/`:

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
