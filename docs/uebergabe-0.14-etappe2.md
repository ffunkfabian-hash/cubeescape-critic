# Übergabe – Roboter und Scout in three.js, Stand nach 0.18 „Prefab“: Generator ist die Quelle

Stand 30.10.2026: **Wächter**, **Paladin**, **Mechanik** (0.14–0.15) und **Scout** (0.17) entstehen ohne Blender in `web/src/robotgen/`.
Seit 0.18 ist der Generator ein Export-Programm: `node web/tools/robotgen_export.mjs` schreibt die Lieferpakete
`assets/robot-bodies-three/` und `assets/helmet-scout-three/`, der Viewer lädt sie (Ladezeit wie GLB statt 11–20 s headless,
[Bericht 0.18](versions/0.18.md)). Blender baut keine Geometrie mehr: Die Blender-Generatoren liegen in `archive/blender/`, ihre GLBs
(`assets/robot-bodies/`, `assets/helmet-scout/`) bleiben als eingefrorene Referenz der Messtests, `blender/cycles_render.py` rendert
optional mit Cycles aus den exportierten GLBs. Ein Skin-Atlas je Modell (`assets/skins/<modell>/`), gebacken aus den exportierten GLBs.

Aufteilung seit Nexogen 1.20.34 (Nutzerentscheid 30.10.2026): Critic macht die Roboter-Konzepte (Körper, Helme, Skins), BALLON nur
Waffen samt Ego-Ansicht und Ego-Armen; Critic übernimmt die Ego-Arme aus BALLON unverändert und gibt dem Ganzkörper eine eigene neutrale
Pose mit Gelenkgrenzen. Formgen v2 entsteht danach auf Basis beider.

## Ablauf nach einer Formänderung

1. Generator in `web/src/robotgen/` ändern (Eingaben in `data/`), Tests `robotgen.test.mjs`/`scoutgen.test.mjs` zeigen die Abweichung
   von der Blender-Referenz.
2. `node web/tools/robotgen_export.mjs` (alle oder `--model <name>`); `robotgen_export.test.mjs` ist rot, bis das geschehen ist.
3. Haben sich Meshes geändert: `node web/tools/skin_bake.mjs --model <name>` (Atlas aus dem neuen GLB).
4. `verify`, Sichtprüfung; optional Cycles-Bilder mit `blender/cycles_render.py`.

## Erledigt

1. ~~Paladin und Mechanik~~ (0.15), ~~Skin-Atlas aus dem Generator~~ (0.15), ~~Scout~~ (0.17), ~~Masken-Stufentabelle~~ (0.17),
   ~~Schultern als Baugruppe~~ (0.17) – Einzelheiten in den Berichten [0.15](versions/0.15.md), [0.17](versions/0.17.md).
2. ~~Weg 1 – Generator als Export-Programm~~ (0.18): Lieferpakete, Konsistenztest Export ↔ Generator, Viewer lädt Dateien
   (`&gen=export|three|blender`), ein Atlas je Modell, Blender-Generatoren archiviert, Cycles-Renderskript.

## Offen

1. **Ego-Arme aus BALLON** übernehmen (neue Aufteilung, s. o.) – eigener Auftrag.
2. **Live-Aufbau schneller** (nur noch für `&gen=three` und den Export wichtig): Scout ≈ 2,5 s (Node), davon ≈ 1,7 s der BSP-Schnitt
   Kern ∩ Kopfvolumen (4 736 Flächen, Baum als Kette). Möglich: Volumen vorher auf die Box des Kerns beschneiden (nur gültig, solange
   das Volumen dort konvex ist – Test gegen das volle Ergebnis). Bei den Körpern kosten die übrigen Fugen und Lofts den Großteil.
3. **Normalen der CSG-Teile** sind nicht überall Länge 1 (Maske, Schienbein, Schulterpanzer); der GLTFExporter normiert sie. Wer
   Export und Live-Aufbau bis in die Normalen gleich will, normiert im Generator (dann Export und Atlas neu).
4. Blender-Referenz und alte Messtests: Sobald der Nutzer die Körper im Generator weiterformt, verlieren `robotgen.test.mjs`/`scoutgen.test.mjs`
   ihren Sinn als Gleichheitsprüfung – dann auf Formtests (Geschlossenheit, Teileliste, Boxen gegen das eigene Manifest) umstellen.

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
