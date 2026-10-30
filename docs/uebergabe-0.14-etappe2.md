# Übergabe – Roboter und Scout in three.js, Stand nach 0.17 „Outrider“: Umstellung

Stand 30.10.2026: **Wächter** (0.14 „Foundry“), **Paladin** und **Mechanik** (0.15 „Anvil“) und seit 0.17 „Outrider“ auch **Scout**
entstehen ohne Blender in `web/src/robotgen/` und sind gegen die Blender-GLBs gemessen ([Körper](ROBOTER_BALLON.md#threejs-generator-014-foundry-015-anvil),
[Scout](HELM_SCOUT.md#threejs-generator-017-outrider), [Bericht 0.17](versions/0.17.md)). Skins haben für alle generierten Modelle
eigene Atlanten (`assets/skins/<modell>-three/`). Nutzerentscheid: three.js ist der Standard, Blender soll ganz raus, auch für die
Geometrie. Blender-Dateien erst entfernen, wenn der Ersatz geprüft ist **und** der Nutzer zustimmt.

Aufteilung seit Nexogen 1.20.34 (Nutzerentscheid 30.10.2026): Critic macht die Roboter-Konzepte (Körper, Helme, Skins), BALLON nur
Waffen samt Ego-Ansicht und Ego-Armen; Critic übernimmt die Ego-Arme aus BALLON unverändert und gibt dem Ganzkörper eine eigene neutrale
Pose mit Gelenkgrenzen. Formgen v2 entsteht danach auf Basis beider.

## Erledigt

1. ~~Paladin und Mechanik~~ (0.15): Studien in `studies.js`, Referenzen `web/tools/fixtures/robotgen_<name>_spec.json`, alle
   Generator-Tests für drei Körper; IoU 0,9985–0,9995 in vier Ansichten. Die befürchteten Fallen (`hull`/`hulls`/`prism`, `pyRound`
   bei `hz`, `rot`) traten nicht auf: Alle drei Studien nutzen den parametrischen Helm (`style: 'mil'`), Kamm, Antenne, Ohrform und
   `hz` gehen dort gar nicht ein. Neu war eine CSG-Falle (Splitter an der Maske, `mesh.js › CUT_JITTER`).
2. ~~Skin-Atlas aus dem Generator~~ (0.15): `node web/tools/skin_bake.mjs --model all --gen three`; Viewer wählt den Atlas per
   `skinAtlas.js › atlasName`; `verify` prüft alle drei Körper mit `&gen=three`.
3. ~~Scout~~ (0.17): `robotgen/scout.js` baut alle 44 Meshes S01–S13 (Guss aus `guss_2h.npz`, Unterhelm per BSP-Booleans,
   Anbauten); Box je Objekt ≤ 0,09 mm, IoU 0,9990–0,9997; `?model=scout&gen=three`, auch als Helm; Atlas `scout-three`.
4. ~~Ladezeit~~ (0.17): Schneider-Stufe je Teil als geprüfte Tabelle (`cutStages.json`, `robotgen_cut_stages.mjs`), Suche nur als
   Rückfall. Messwerte in [0.17](versions/0.17.md). Variante „Schneider je Auge vereinigen“ gemessen und verworfen: schließt genauso
   zufällig (etwa jede dritte Stufe) und spart je Versuch nur ≈ 25 %.
5. ~~Schultern~~ (0.17, Nutzerwunsch): eigene Baugruppe im Viewer (`robotShoulders.js`), GLB und Generator unverändert.

## Offen

1. **Weg 1 – Generator als Export-Programm (0.18, Ja des Nutzers 30.10.2026):** Der three.js-Generator bleibt die Quelle, ein
   Node-Programm (z. B. `web/tools/robotgen_export.mjs`) baut Körper und Scout vorab und schreibt GLB, `parts.json`, `manifest.json`
   im Format der heutigen Lieferpakete; der Viewer lädt nur noch Dateien (Ladezeit wie GLB statt 11–20 s headless). Ein Test prüft,
   dass die gelieferten GLBs dem Generator entsprechen (Box/Hash je Mesh). Dann Standard ohne `gen`-Schalter; die Skin-Atlanten der
   `-three`-Fassungen werden die einzigen (Ordner umbenennen, `atlasName` vereinfachen, `skins.test.mjs` zusammenführen).
   **Blender (Nutzerentscheid 30.10.2026):** nur noch als optionaler Cycles-Render-Schritt, der die exportierten GLBs liest
   (Präsentation, Drehteller, Vorlagen für Kritiker-Runden); Blender baut keine Geometrie mehr. Die Blender-Generatoren
   `blender/robot/` und `blender/scout/` gehen ins Archiv (Git behält sie). Empfehlung aus 0.17: die heutigen Blender-GLBs als
   eingefrorene Referenz behalten, damit `robotgen.test.mjs`/`scoutgen.test.mjs` weiter gegen Blender messen. `guss_2h.npz` ist Eingabe des Generators und bleibt.
2. **Ladezeit Rest:** Ohne Masken-Wiederholungen kosten die übrigen Fugen (Brust, Schulterpanzer, Knie) und Lofts den Großteil;
   Scout ≈ 2,5 s (Node), davon ≈ 1,7 s der BSP-Schnitt Kern ∩ Kopfvolumen (4 736 Flächen, Baum als Kette). Möglich: Volumen vorher
   auf die Box des Kerns beschneiden (nur gültig, solange das Volumen dort konvex ist – Test gegen das volle Ergebnis).
3. **Ego-Arme aus BALLON** übernehmen (neue Aufteilung, s. o.) – eigener Auftrag.

## Grenzen

- Skins binden Meshes über den Atlas (`web/src/skinAtlas.js`, Signatur aus Eckenzahl und Box); jede Änderung an Körpern braucht einen
  neuen Bake (`node web/tools/skin_bake.mjs --model <name>` für den GLB, zusätzlich `--gen three` für den Generator).
- Auf Linux (CI) kann three-bvh-csg anders triangulieren: Tests dürfen nicht verlangen, dass ein bestimmter Schnitt offen oder
  geschlossen herauskommt; Atlas-Einträge der CSG-Teile tragen deshalb gebackene Positionen. Die Stufentabelle `cutStages.json` wird nur
  auf der Plattform streng geprüft, auf der sie geschrieben wurde (`robotgen_cut_stages.mjs`); anderswo sucht der Generator wie bisher.
- Node auf dem Mac: `~/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin` (kein `npm`: Skripte aus `web/package.json`
  direkt aufrufen); Python mit NumPy/Pillow für `verify` und `robotgen_compare`: `uv venv runs/venv && uv pip install --python
  runs/venv/bin/python -r web/requirements.txt`, dann `runs/venv/bin` vorn in `PATH`.
- Ballon-Quelle für Referenzen: `mkdir -p runs/robot/src && git -C ~/Claude/cubeescape-ballon archive <commit aus blender/robot/SOURCE.json>
  basic tools data | tar -x -C runs/robot/src`.
- Opus `high` (Kernsystem, Formvergleich).
