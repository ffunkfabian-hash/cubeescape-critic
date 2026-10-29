# Scout v3 – Blender-Helm (Version 0.8)

Scout v3 ist ein zweiter Helm neben dem three.js-Helm. Gebaut wird er nicht im Browser, sondern in **Blender** aus einem
eigenen Python-Generator. Er entstand im Arbeitsordner `trialanderror` mit derselben Kritiker-Arbeitsweise wie dieses Repo:
feste Ansichten, nummerierte Durchläufe, ein unabhängiger Kritiker und Messung per IoU. Die Nutzerkorrekturen kamen über
markierte Bilder und den Markierbogen. Abgenommen ist der **Stand D29** vom 29.10.2026. Er wird hier eingefroren und ist aus dem Generator nachbaubar.

![Scout D29 – vier Ansichten](bilder/scout_d29_ansichten.jpg)

## Aufbau

Der Helm entsteht hybrid aus zwei Quellen:

- **Haube und Gesicht (S01–S04):** ein dunkler Guss aus dem früheren Lauf 2h, bestehend aus Kuppel, Augen, Gesichtsplatte mit Fugen und Krempe.
  Er liegt gebacken in `blender/scout/guss_2h.npz` und wird mit `guss_2h_einsetzen()` eingesetzt.
- **Unterhelm (S05–S09):** CSG nach dem Vorbild dieses Repos (`helm_csg.py`). Ein Kopfvolumen wird aus drei Profilen geloftet,
  daraus werden Kern, Kragen, Kiefer und Kinnblock geschnitten. Dazu kommen die Mundvertiefung in der Gesichtsplatte und eine Kerbe im Kinnblock.
- **Anbauten (S10–S13):** Funkmuscheln mit Bügel, Antennen, Rückmodul und Spiralkabel.

Alle Maße stehen in `blender/scout/helm_params.json`. Die Einheit ist H = 1,0 für die Helmhöhe, das entspricht etwa 30 cm.
In Blender zeigt +Z nach oben und −Y nach vorn. Die Teile tragen feste Kennungen **S01–S13** ([Teileliste](scout/HELM_TEILE_SCOUT.md)).
Die Seite R liegt bei +X und erscheint in der Frontansicht rechts im Bild. Für die Seite zählt immer die Lage, nie der Objektname.

## Nachbau

```bash
# Repo-Wurzel; baut D29 aus leerer Szene (~2,5 min) und schreibt GLB, Teileliste und Manifest
./ce lock blender -- /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup \
  --python blender/scout/run.py -- --build --save runs/scout/scout_build.blend --export assets/helmet-scout
# vier Cycles-Ansichten aus der gespeicherten Szene
./ce lock gpu -- /Applications/Blender.app/Contents/MacOS/Blender -b runs/scout/scout_build.blend \
  --python blender/scout/run.py -- --views runs/scout/views/scout
```

In einem laufenden Blender (MCP): `p = '<repo>/blender/scout/run.py'; g = {'__file__': p}; exec(open(p).read(), g)`, danach
`g['scout']['bauen_lauf6b']()`, `g['scout']['ansichten'](…)`, `g['scout_export']['export_all'](…)`. `bauen_lauf6b()` braucht eine
leere Szene, also vorher `bpy.ops.wm.read_homefile(use_empty=True)` aufrufen, und zwar direkt, nicht in einem Timer.
Alle Pfade setzt `run.py` über die Umgebungsvariablen `SCOUT_DIR`, `SCOUT_REF` (`reference/scout/`) und `SCOUT_RUNS` (`runs/scout/`, nicht im Repo).

**Nachweis 0.8:** Der Nachbau aus dem Repo ist identisch mit der abgenommenen Szene D29. Er hat dieselben 44 Objekte, dieselben 91 905 Vertices
und die gleichen Bounding-Boxen auf 1e−4 genau; Prüfung mit `--manifest` gegen die Szene aus dem Arbeitsordner.
Die Meshy-Vorlage `meshy_v2.glb` (49 MB) ist nicht im Repo. Der Generator lädt sie nur als Hilfsreferenz und überspringt sie,
wenn sie fehlt. Die Geometrie von `bauen_lauf6b()` hängt nicht von ihr ab; nur die alten Messhelfer `kinn_kontur()`/`kinn_band_messen()` in `helm_build7.py` brauchen sie.

## Viewer

`web/` zeigt Scout mit `?model=scout`, zum Beispiel `http://127.0.0.1:5173/?model=scout&view=left`. Mit `&exploded=1` (Scout kennt nur 0 oder 1; jeder Wert über 0 zeigt die volle Explosion) erscheint
die Explosionsansicht mit Etiketten S01–S13. Der Viewer lädt `assets/helmet-scout/assembled/scout.glb` und
`exploded/scout_exploded.glb` und skaliert Scout auf den Rahmen des three.js-Helms, damit die Kameraansichten passen.
Die Geometrie lässt sich im Viewer nicht ändern, denn Quelle bleibt der Blender-Generator.

**Grenze:** Die Blender-Materialien sind prozedural (Rauschen, Schmutz, Abrieb). glTF übernimmt davon nur flache Ersatzmaterialien
mit der mittleren Farbe des Materials, dazu Rauheit, Metall und Leuchten. Der GLB ist deshalb glatter als die Cycles-Bilder.
Maßgeblich für das Aussehen sind die Cycles-Ansichten.

## Stände und Marker

- [Stände D01–D29](scout/STAENDE.md): Index aller Durchläufe mit IoU und Markierbogen-Seiten. Die Durchlauf-Ordner mit
  Vergleichsbögen und Stand-Snapshots (212 MB) bleiben im Arbeitsordner `trialanderror/durchlaeufe/`.
- [Stil und Entscheidungen](scout/STIL_SCOUT_V3.md), [Protokoll](scout/testlog.md).
- [Marker-System](scout/MARKER_GUIDE.md): Der Nutzer klickt in eine Ansicht, Teil, Seite und Höhe werden vorgeschlagen, und die Markierung wird gespeichert.
  Die Werkzeuge dazu sind `blender/scout/markierbogen_vorlage.html` und `markierbogen_bauen.py`, das Raster kommt aus `helm_explosion.py` › `markierbogen_daten()`.

## Offene Punkte (Stand D29)

- Kleine helle Stufe, wo der Kragen auf S07 trifft; S07 wirkt etwas klobig.
- Spiralkabel sind symmetrisch (die Vorlage zeigt nur eine Seite); Antennen bewusst asymmetrisch (L lang, R Stummel).
