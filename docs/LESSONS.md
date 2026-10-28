# Lehren (Critic)
≤ 60 Zeilen, eine Zeile je Lehre, Link zur Langform. Verlauf aller Helm-Durchläufe: [HELM_VERLAUF.md](HELM_VERLAUF.md).

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
