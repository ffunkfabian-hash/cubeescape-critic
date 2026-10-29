# Übergabe 0.14 „Foundry“ → Etappe 2: Paladin, Mechanik, Scout in three.js

Stand nach Etappe 1 (29.10.2026): Der **Wächter** entsteht ohne Blender in `web/src/robotgen/` und ist gegen den Blender-GLB gemessen
([Aufbau und Messung](ROBOTER_BALLON.md#threejs-generator-014-foundry)). Nutzerentscheid: three.js ist der Standard, Blender soll ganz
raus, auch für die Geometrie. Blender-Dateien erst entfernen, wenn der Ersatz geprüft ist **und** der Nutzer zustimmt.

## Ziel der Etappe

1. **Paladin und Mechanik** auf derselben Basis. Der Formbaukasten `body.js` enthält schon alle Zweige von Ballons `body.py`
   (z. B. `vribs`, `spine`, `split`, `panel`, `shoulder_pistons`, `thigh_piston`, `calf_piston`, `knee_pistons`, `crest`, `antenna`),
   ungeprüft, weil der Wächter sie nicht nutzt. Zu tun:
   - `runs/robot/src` aus Ballon entpacken (Befehl in `web/tools/robotgen_dump_spec.py`), Referenz abziehen:
     `python3 -I web/tools/robotgen_dump_spec.py runs/robot/src b_paladin web/tools/fixtures/robotgen_paladin_spec.json` (ebenso `c_mechanik`).
   - Studienparameter aus `basic/robot/studies/b_paladin.py` und `c_mechanik.py` nach `web/src/robotgen/studies.js` übertragen
     (Muster: `waechter`), `NAMES` in `web/tools/robotgen.test.mjs` und `GENERATED` in `web/src/robotBodies.js` erweitern.
   - Prüfen wie beim Wächter: `node --test tools/robotgen.test.mjs` (Teileliste identisch, Segmente, Box je Objekt < 1 mm, `parts.json`),
     `node tools/robotgen_compare.mjs --model=paladin|mechanik` (IoU vier Ansichten, Nahvergleich, Explosion), Sichtprüfung gealtert.
   - Mögliche Fallen: Formen `hull`/`hulls`/`prism`, die der Wächter nicht nutzt (`prism` fehlt in `mesh.js`), `pyRound` bei `hz`,
     `rot` an weiteren Teilen.
2. **Scout** (`blender/scout/`, `assets/helmet-scout/`, Viewer `web/src/scout.js`): eigener Blender-Generator mit Einstieg `run.py`,
   Teile S01–S13. Gleiches Vorgehen: Geometrie-Bausteine übertragen, gegen den GLB des Lieferpakets messen (Box je Teil, IoU,
   Nahvergleich), im Viewer zuschaltbar ohne die GLB-Fassung zu entfernen. Prozedurale Materialien gibt es im GLB nur flach
   (docs/LESSONS.md); die Texturen des Lieferpakets weiter verwenden. Eher eigene Version (zwei Hauptziele je Auftrag).
3. Danach mit Ja des Nutzers: Standard auf `gen=three` umstellen, `blender/robot/` und die Körper-GLBs ins Archiv.

## Grenzen

- Parallele Sitzung 0.13 „Skins“ (Branch `claude/critic-0.13-skins`): nicht anfassen `web/src/robotSkins.js`, Skin- und Navigationsteile
  von `web/src/main.js`, `blender/robot/skins*`, `uv_template.py`, `bake_maps.py`. Der Generator liefert dafür Meshes mit `asm`, `part`,
  `side` und Rollenmaterialien `MT_<rolle>_color` wie der GLB; UV-Koordinaten erzeugt er noch nicht (Skins brauchen ggf. einen Atlas).
- Node auf dem Mac: `~/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`; Python mit NumPy/Pillow für `verify` und
  `robotgen_compare`: `uv venv runs/venv && uv pip install --python runs/venv/bin/python -r web/requirements.txt`, dann `runs/venv/bin` vorn in `PATH`.
- Opus `high` (Kernsystem, Formvergleich).
