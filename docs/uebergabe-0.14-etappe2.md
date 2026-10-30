# Übergabe – Roboter und Scout in three.js, Stand nach 0.19 „Whetstone“: Generator ist die Quelle, Formtests

Stand 30.10.2026 (nach 0.19): **Wächter**, **Paladin**, **Mechanik** (0.14–0.15) und **Scout** (0.17) entstehen ohne Blender in `web/src/robotgen/`.
Seit 0.18 ist der Generator ein Export-Programm: `node web/tools/robotgen_export.mjs` schreibt die Lieferpakete
`assets/robot-bodies-three/` und `assets/helmet-scout-three/`, der Viewer lädt sie (Ladezeit wie GLB statt 11–20 s headless,
[Bericht 0.18](versions/0.18.md)). Blender baut keine Geometrie mehr: Die Blender-Generatoren liegen in `archive/blender/`, ihre GLBs
(`assets/robot-bodies/`, `assets/helmet-scout/`) bleiben als eingefrorene Referenz, `blender/cycles_render.py` rendert
optional mit Cycles aus den exportierten GLBs. Ein Skin-Atlas je Modell (`assets/skins/<modell>/`), gebacken aus den exportierten GLBs.
Seit 0.19 ([Bericht](versions/0.19.md)): alle Normalen Länge 1, Live-Aufbau = Export bis in die Normalen, Aufbau 2–3-mal schneller
(bytegleich), Tests gegen das eigene Paket statt gegen Blender – der Generator darf jetzt weitergeformt werden.

Aufteilung seit Nexogen 1.20.34 (Nutzerentscheid 30.10.2026): Critic macht die Roboter-Konzepte (Körper, Helme, Skins), BALLON nur
Waffen samt Ego-Ansicht und Ego-Armen; Critic übernimmt die Ego-Arme aus BALLON unverändert und gibt dem Ganzkörper eine eigene neutrale
Pose mit Gelenkgrenzen. Formgen v2 entsteht danach auf Basis beider.

## Ablauf nach einer Formänderung

1. Generator in `web/src/robotgen/` ändern (Eingaben in `data/`). `robotgen_form.test.mjs` zeigt, was sich gegenüber dem eigenen Paket
   geändert hat (Teileliste, Segmente, Boxen, Öffnungen, Normalen) – bei gewollter Formänderung ist das erwartet.
2. `node web/tools/robotgen_export.mjs` (alle oder `--model <name>`); `robotgen_export.test.mjs` ist rot, bis das geschehen ist. Danach
   prüfen die Formtests gegen das neue Paket; neue Öffnungen der Scout-Haube in `KNOWN_OPENINGS` bewusst eintragen.
3. Haben sich Meshes geändert: `node web/tools/skin_bake.mjs --model <name>` (Atlas aus dem neuen GLB).
4. `verify`, Sichtprüfung; Abstand zur Blender-Referenz bei Bedarf `node web/tools/robotgen_reference.mjs [--iou]` (Bericht, keine
   Sperre); optional Cycles-Bilder mit `blender/cycles_render.py`.
5. Nur Tempo geändert (gleiche Form)? Dann muss `robotgen_export.mjs` die GLBs als `unchanged` melden – nur der Eingaben-Hash im Manifest
   ändert sich; `robotgen_speed.test.mjs` vergleicht die schnellen Wege mit den 0.18-Fassungen.

## Erledigt

1. ~~Paladin und Mechanik~~ (0.15), ~~Skin-Atlas aus dem Generator~~ (0.15), ~~Scout~~ (0.17), ~~Masken-Stufentabelle~~ (0.17),
   ~~Schultern als Baugruppe~~ (0.17) – Einzelheiten in den Berichten [0.15](versions/0.15.md), [0.17](versions/0.17.md).
2. ~~Weg 1 – Generator als Export-Programm~~ (0.18): Lieferpakete, Konsistenztest Export ↔ Generator, Viewer lädt Dateien
   (`&gen=export|three|blender`), ein Atlas je Modell, Blender-Generatoren archiviert, Cycles-Renderskript.
3. ~~Live-Aufbau schneller~~ (0.19): Node warm Wächter 1,5–1,8 → 0,6 s, Paladin 1,4–1,6 → 0,5 s, Mechanik 1,3–1,4 → 0,45 s, Scout
   0,76–0,78 → 0,4 s, bytegleich (Zahlen-Hashes statt Text-Schlüssel, Blockboxen im BSP-Baum, Schattierung ohne Zwischenarrays). Die
   Box-Beschneidung des Kopfvolumens hätte andere Polygonteile ergeben und den Export verändert – nicht umgesetzt.
4. ~~Normalen der CSG-Teile~~ (0.19): Es waren Nullnormalen an entarteten Dreiecken (Körper: Maske, Schienbeinschalen, Schulterpanzer;
   Scout: 12 022 flächenlose Guss-Flächen der Haube); jetzt Mittel der Nachbarflächen, alle |n| = 1 ± 5·10⁻⁸; Export und Atlanten neu.
5. ~~Messtests auf Formtests~~ (0.19): `robotgen_form.test.mjs` gegen das eigene Paket; Blender/Ballon nur noch Bericht
   `robotgen_reference.mjs`.

## Offen

1. **Ego-Arme aus BALLON** übernehmen (neue Aufteilung, s. o.) – eigener Auftrag.
2. Tempo, falls nötig: Bei den Körpern liegt jetzt gut die Hälfte in three-bvh-csg selbst (Halbkanten-Tabelle mit Text-Schlüsseln
   je Schnitt, `HalfEdgeMap.updateFrom`); schneller nur mit Änderung an der Bibliothek oder weniger Schnitten (dann neue Form).
3. Wenn die Körper weitergeformt werden: Neuexport und Bake (Ablauf oben); der Referenzbericht zeigt den Abstand zur Blender-Fassung.

## Grenzen

- Skins binden Meshes über den Atlas (`web/src/skinAtlas.js`, Signatur aus Eckenzahl und Box); jede Änderung an Körpern braucht einen
  neuen Export und Bake (`node web/tools/robotgen_export.mjs --model <name>`, dann `node web/tools/skin_bake.mjs --model <name>`).
- Auf Linux (CI) kann three-bvh-csg anders triangulieren: Tests dürfen nicht verlangen, dass ein bestimmter Schnitt offen oder
  geschlossen herauskommt; Atlas-Einträge der CSG-Teile tragen deshalb gebackene Positionen. Die Stufentabelle `cutStages.json` wird nur
  auf der Plattform streng geprüft, auf der sie geschrieben wurde (`robotgen_cut_stages.mjs`); anderswo sucht der Generator wie bisher.
- Node auf dem Mac: `~/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin` (kein `npm`: Skripte aus `web/package.json`
  direkt aufrufen); Python mit NumPy/Pillow für `verify` und `robotgen_compare`: `uv venv runs/venv && uv pip install --python
  runs/venv/bin/python -r web/requirements.txt`, dann `runs/venv/bin` vorn in `PATH`.
- Ballon-Quelle für Referenzen: `mkdir -p runs/robot/src && git -C ~/Claude/cubeescape-ballon archive <commit aus web/src/robotgen/data/SOURCE.json>
  basic tools data | tar -x -C runs/robot/src`.
- Der Export ist nur auf der Plattform des Manifests (`darwin-arm64 node 24`) bytegleich wiederholbar; auf Linux-CI vergleicht
  `robotgen_export.test.mjs` Meshes, Extras und Boxen. Exportieren daher auf dem Mac.
- Opus `high` (Kernsystem, Formvergleich).
