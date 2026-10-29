# Lehren (Critic)
≤ 60 Zeilen, eine Zeile je Lehre, Link zur Langform. Verlauf aller Helm-Durchläufe: [HELM_VERLAUF.md](HELM_VERLAUF.md).

- Geschlossene Einzelmeshes können sich sichtbar durchdringen: Gelenke nach vier Ansichten prüfen und auffällige Stellen mit Sichtstrahlen absichern. [Cuirass](HELM_CUIRASS.md#geometrie-und-datenfluss).
- Explosionsbilder nach stabilen Teile-IDs gruppieren, alle enthaltenen Meshpfade zusätzlich ausgeben; Weltmatrix und Herkunft im GLB erhalten. [Assembly](HELM_AUFBAU.md#datenfluss-und-teilelogik).
- Schultermasse getrennt über Breite, obere Wölbung und Schalendicke steuern; Halsverkürzung durch Anheben des Oberkörpers bei festem Helm. Referenzstil ist kein vermessenes Körpermaß. [Formentscheidung](HELM_AUFBAU.md#rückmeldungen-und-formentscheidung).

- three-bvh-csg liefert das Ergebnis im lokalen System des **ersten** Körpers – Transformationen vorher in die Geometrie einbacken (`web/src/geo.js` › `brush`), sonst verschwinden Position/Neigung still.
- Headless-Chromium hat nur Software-GL (SwiftShader): Animationsschleife + GTAO/Bloom lässt Screenshots in den Timeout laufen – Einzelbild-Modus `?static=1` mit `renderFrame()` (`web/verify_renders.mjs`).
- Umrisse aus drei Profilen per Schnitt ergeben Kisten (jeder waagerechte Schnitt = Draufsicht); ein Loft (Draufsicht je Höhe auf Breite/Tiefe skaliert) trifft alle drei Profile und verjüngt weich (`web/src/parts/headVolume.js`).
- Glatte Flächen lesen sich nicht als Hard-Surface: ebene Facetten plus schmale Fasen an den Kanten (`facets`, `facetBevels` in `helmetParams.json`).
- Leuchtende Schlitze bündig auf der Fläche wirken wie Aufkleber; Augenhöhle mit schrägen Wänden und Leuchtkörper am Grund (`visor.socketDepth`).
- Emission 5,0 unter ACES wird reinweiß und der Bloom färbt die Umgebung; Video-Look: ~1,0, sattes Cyan, Bloom fast aus.
- Umriss-IoU misst nur die Silhouette: Facetten, Material und Details ändern sie kaum – Fortschritt zusätzlich im Nahvergleich (`web/tools/pairs.py`) prüfen.
- Teile, die nicht Teil des Modells sind (Schal), aus der Messung ausschneiden (`CUT` in `web/tools/iou.py`), sonst bestraft jeder Durchlauf das Fehlen.
- KI-Turntable-Videos drehen ungleichmäßig und driften: Drehwinkel je Frame schätzen statt konstanter Rate; mehr Frames derselben Kreisfahrt bringen kaum etwas, andere Blickhöhen schon (Branch `claude/robot-hull`).
- Generierte Dateien (`web/public/robot/`) gehören in `.gitignore`, bevor ein anderer Branch sie erzeugt – sonst landen sie beim nächsten `git add -A` im Commit.
- Drehteller-Videos: das Licht bleibt beim Betrachter – Licht-Rig und Umgebung mit der Kamera drehen (`lightRig`, `environmentRotation` in `web/src/main.js`), sonst sind Seiten und Rücken flach.
- Neue Grundprofile können innere Teile freilegen (weißer Kern durch die Stirn) – innere Volumen auf ihren sichtbaren Bereich beschneiden.
- Fremde Formbeschreibungen sind Startwerte: ein zu stark zurückweichendes Gesicht (15°) verschlechterte Seiten-IoU und Augen – Teile einzeln übernehmen und je Durchlauf messen ([HELM_VERLAUF.md](HELM_VERLAUF.md) #22–#25).
- Vertiefungen mit identischer Außenfläche von Grundkörper und CSG-Cutter können koplanare Reste erzeugen; Cutter über die Wand hinausführen und Boden/Rand per Strahltest prüfen ([HELM_VERLAUF.md](HELM_VERLAUF.md), #30).

- Oberflächen-Einlagen aus einer dünnen Schicht des Trägers ableiten: passende Eckpunkte allein verhindern Durchdringung zwischen den Dreiecken nicht ([Fidelity](versions/0.2.md)).
- GTAO-Denoising erzeugt ohne festen Seed bei jedem Laden andere Pixel; neben Geometrie-/Textur-Seeds auch Postprocessing prüfen ([Reproduktion](../web/README.md#reproduzierbarer-stand-02-fidelity)).
- Three.js-`bumpMap` wird nicht als glTF-Kernkanal exportiert: verwendete Relief-PNGs samt UV-/Materialzuordnung separat sichern, statt den GLB als vollständige Materialreproduktion auszugeben ([Sidework](versions/0.3.md)).
- Beim Verschieben eines Anbauteils beide Enden seiner Halterung an realen Flächen neu bestimmen und geometrisch prüfen; ein mitbewegtes Gehäuse allein trennt sonst die Verbindung ([Sidework](versions/0.3.md)).

- „Vorher“ ist keine Versionskennung: Nutzerbilder zuerst gegen gespeicherte Vergleichsbilder identifizieren und bei Wiederherstellungen alle Ansichten/GLB gegen die gewählte Quelle prüfen ([Fehlzuordnung 50 statt 46](HELM_VERLAUF.md#runde-12--tatsächliche-mittlere-variante-wiederhergestellt-28102026)).
- Radial verformte CSG-Schalen brauchen mit der inversen transponierten Ableitung transportierte Normalen; bloße Neuberechnung kann sichtbare Bänder an Schnittpunkten erzeugen ([Continuity-Aufbau](HELM_AGENTEN.md#geometrische-änderung-04)).
- Transparente Bemalungsträger beim Silhouettenrender ausblenden und danach den vorherigen Sichtbarkeitszustand wiederherstellen; sonst misst der Test die Trägerfläche statt der Grundform ([historischer, später verworfener Musterversuch](https://github.com/ffunkfabian-hash/cubeescape-critic/blob/caf7a79dc46269b9f02801587b909d5c947f73d8/docs/HELM_AGENTEN.md#optionale-haube-ohne-blenden-und-spielerische-muster)).

- Prozedurale Blender-Materialien (Rauschen/Mix vor dem Base Color) exportiert glTF als Weiß: für den GLB flache Ersatzmaterialien aus `diffuse_color` erzeugen ([Scout](HELM_SCOUT.md#viewer), `blender/scout/export_scout.py`).
- Per `exec(open(…).read())` geladene Blender-Skripte kennen kein `__file__`: Pfade einmal im Einstieg setzen (`SCOUT_DIR`/`SCOUT_REF`/`SCOUT_RUNS` in `blender/scout/run.py`), nie absolute Arbeitsordner-Pfade im Generator ([Scout](HELM_SCOUT.md#nachbau)).
- Der Artefakt-Host liefert kein `.glb` aus: Modell für Webseiten als glTF-JSON mit eingebettetem Puffer (`web/tools/marker_build.mjs`); Vite-Abhängigkeitsscan auf `index.html` begrenzen, sonst meldet der Dev-Server die erst gebaute Markierseite als fehlenden Import ([MARKER.md](MARKER.md)).
