# Übergabe – Roboterkörper in three.js, Stand nach 0.15 „Anvil“: Scout und Umstellung

Stand 30.10.2026: **Wächter** (0.14 „Foundry“), **Paladin** und **Mechanik** (0.15 „Anvil“) entstehen ohne Blender in
`web/src/robotgen/` und sind gegen die Blender-GLBs gemessen ([Aufbau und Messung](ROBOTER_BALLON.md#threejs-generator-014-foundry-015-anvil),
[Bericht 0.15](versions/0.15.md)). Skins haben für alle drei generierten Körper eigene Atlanten (`assets/skins/<körper>-three/`).
Nutzerentscheid: three.js ist der Standard, Blender soll ganz raus, auch für die Geometrie. Blender-Dateien erst entfernen, wenn der
Ersatz geprüft ist **und** der Nutzer zustimmt.

## Erledigt

1. ~~Paladin und Mechanik~~ (0.15): Studien in `studies.js`, Referenzen `web/tools/fixtures/robotgen_<name>_spec.json`, alle
   Generator-Tests für drei Körper; IoU 0,9985–0,9995 in vier Ansichten. Die befürchteten Fallen (`hull`/`hulls`/`prism`, `pyRound`
   bei `hz`, `rot`) traten nicht auf: Alle drei Studien nutzen den parametrischen Helm (`style: 'mil'`), Kamm, Antenne, Ohrform und
   `hz` gehen dort gar nicht ein. Neu war eine CSG-Falle (Splitter an der Maske, `mesh.js › CUT_JITTER`).
2. ~~Skin-Atlas aus dem Generator~~ (0.15): `node web/tools/skin_bake.mjs --model all --gen three`; Viewer wählt den Atlas per
   `skinAtlas.js › atlasName`; `verify` prüft alle drei Körper mit `&gen=three`.

## Offen

1. **Scout** (`blender/scout/`, `assets/helmet-scout/`, Viewer `web/src/scout.js`) – eigene Version (geplant 0.16): eigener
   Blender-Generator mit Einstieg `run.py`, Teile S01–S13. Gleiches Vorgehen wie bei den Körpern: Geometrie-Bausteine übertragen,
   gegen den GLB des Lieferpakets messen (Box je Teil, IoU, Nahvergleich), im Viewer zuschaltbar, ohne die GLB-Fassung zu entfernen.
   Prozedurale Materialien gibt es im GLB nur flach (docs/LESSONS.md); die Texturen des Lieferpakets weiter verwenden. Der Scout-Atlas
   (`assets/skins/scout/`) braucht danach ebenfalls eine Generator-Fassung.
2. **Ladezeit vor der Umstellung:** Die Masken-Wiederholungen kosten Paladin ≈ 3 s und Mechanik ≈ 5 s (Node; Headless-Browser 4,2 bzw.
   7,3 s gegen ≈ 1,3 s für den GLB). Möglichkeiten: gefundene Schneider-Stufe je Teil als geprüfte Tabelle mitliefern (Suche nur, wenn
   die Stufe auf einer Plattform nicht schließt), oder die drei Schneider je Auge vorher vereinigen und einmal abziehen (weniger
   Schnittkanten). Messen, dann entscheiden.
3. **Umstellung** – nur mit Ja des Nutzers: Standard auf `gen=three`, danach `blender/robot/` und die Körper-GLBs ins Archiv; die
   GLB-Atlanten (`assets/skins/waechter|paladin|mechanik/`) werden dann durch die `-three`-Atlanten ersetzt (Ordner umbenennen,
   `atlasName` vereinfachen, Tests `skins.test.mjs` zusammenführen). Die Messungen gegen die GLBs (`robotgen.test.mjs`,
   `robotgen_compare.mjs`) brauchen die GLBs – vorher entscheiden, ob sie als Archiv-Referenz bleiben.

## Grenzen

- Skins binden Meshes über den Atlas (`web/src/skinAtlas.js`, Signatur aus Eckenzahl und Box); jede Änderung an Körpern braucht einen
  neuen Bake (`node web/tools/skin_bake.mjs --model <name>` für den GLB, zusätzlich `--gen three` für den Generator).
- Auf Linux (CI) kann three-bvh-csg anders triangulieren: Tests dürfen nicht verlangen, dass ein bestimmter Schnitt offen oder
  geschlossen herauskommt; Atlas-Einträge der CSG-Teile tragen deshalb gebackene Positionen.
- Node auf dem Mac: `~/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin` (kein `npm`: Skripte aus `web/package.json`
  direkt aufrufen); Python mit NumPy/Pillow für `verify` und `robotgen_compare`: `uv venv runs/venv && uv pip install --python
  runs/venv/bin/python -r web/requirements.txt`, dann `runs/venv/bin` vorn in `PATH`.
- Ballon-Quelle für Referenzen: `mkdir -p runs/robot/src && git -C ~/Claude/cubeescape-ballon archive <commit aus blender/robot/SOURCE.json>
  basic tools data | tar -x -C runs/robot/src`.
- Opus `high` (Kernsystem, Formvergleich).
