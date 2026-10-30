# Archiv: Blender-Generatoren (bis 0.17)

Seit 0.18 „Prefab“ baut Blender keine Geometrie mehr (Nutzerentscheid 30.10.2026). Körper und Scout entstehen im three.js-Generator
`web/src/robotgen/`, das Export-Programm `web/tools/robotgen_export.mjs` schreibt die Lieferpakete `assets/robot-bodies-three/` und
`assets/helmet-scout-three/`. Blender bleibt nur als optionaler Cycles-Render-Schritt aus diesen GLBs (`blender/cycles_render.py`).

| Ordner | Inhalt | Ergebnis (eingefroren, Referenz der Messtests) |
|---|---|---|
| `robot/export_robot.py` | Export der drei Körperstudien aus Ballon (Commit in `web/src/robotgen/data/SOURCE.json`) | `assets/robot-bodies/<körper>/` |
| `scout/` | Scout-Generator D29 (`run.py`, `helm_*.py`, Markierbogen-Werkzeuge) | `assets/helmet-scout/` |

Die Blender-GLBs bleiben als Referenz: `web/tools/robotgen.test.mjs`, `scoutgen.test.mjs` und `robotgen_compare.mjs` messen den
three.js-Generator weiter gegen sie; im Viewer zeigt `&gen=blender` sie an.

**Eingaben verschoben:** `guss_2h.npz`, `helm_params.json` (Scout) und `SOURCE.json` (Ballon-Pin) sind Eingaben des three.js-Generators
und liegen jetzt in `web/src/robotgen/data/`. Wer den archivierten Scout-Generator noch einmal ausführen will, kopiert die beiden
Scout-Dateien zurück nach `archive/blender/scout/` (die Skripte lesen sie aus ihrem eigenen Ordner). Die Geschichte der Dateien bleibt in
Git (`git log --follow`).
