# Changelog

## 0.0.4 „Sheet Robot“ – 2026-10-28

- Model Sheet des Roboters `reference/robot/sheet/model_sheet.svg` (sechs orthografische Ansichten).
- `web/tools/robot/sheet.py`: Umrisse je Bauteil aus Front-, Seiten- und Draufsicht, Zuordnungskarte Sheet-Pixel →
  Bauteil; `render_svg.mjs` rendert das SVG.
- `web/robot_parts.html`: 23 Bauteile (Front ∩ Seite ∩ Superellipsoid), Zeichnung orthografisch aus den Ansichten
  projiziert, in denen das Teil sichtbar ist, Toon-Konturen, Sheet-Overlay, GLB-Export.
- `npm run verify:parts`: Umriss-IoU gegen das Sheet – Front 0,986, Rücken 0,969, rechts 0,963, links 0,921.
- Bilder: `docs/bilder/roboter_teile_vergleich.jpg`, `roboter_teile_schraeg.jpg`.
- Rückmeldung des Nutzers: Ergebnis entspricht nicht der Erwartung (Arme kastenförmig, Platten nur aufgemalt).

## 0.0.3 „Frame Robot“ – 2026-10-28

- Zweite Vorlage `reference/robot/` (KI-Video eines Ganzkörper-Roboters, 241 Frames).
- `web/tools/robot/`: jeden Frame freistellen, Kamera und Drehwinkel **je Frame** schätzen (das Video dreht
  ungleichmäßig), Visual Hull schnitzen, Netz mit Farben aus allen Frames, GLB (erzeugt, nicht im Repo).
- `web/robot.html`: Kamera exakt auf jeden der 241 Videoframes, Overlay des Frames, Video-Turntable, GLB-Export.
- `npm run verify:robot`: Umriss-IoU gegen jeden einzelnen Frame, Mittel 0,923 (min 0,863).
- Bilder: `docs/bilder/roboter_video_vergleich.jpg`, `roboter_video_iou.png`.

## 0.0.2 „Browser Helmet“ – 2026-10-27

- `web/`: Three.js-Nachbau des Helms ohne lokale 3D-Software – fünf benannte Bauteilgruppen (three-bvh-csg, Schal mit
  simplex-noise), Studio-Licht, GTAO, Bloom nur auf dem Visier, ACES, Canvas-Texturen.
- Ansichten Front/Left/Back/Right wie die Videobilder (`web/refs/`, per ffmpeg), Turntable, Onion-Overlay (Taste O),
  lil-gui auf `helmetParams.json`, GLB-Export `scifi_helmet.glb`.
- `npm run verify`: Playwright-Renders, Overlay- und Umrissbilder, Umriss-IoU je Ansicht (Mittel 0,908 nach 5 Durchläufen).
- Zweite Runde Helm: Grundform als Loft aus drei Profilen, Frontplatte mit ebenen Facetten, Kiefer als Steg unter der
  Platte, Spiralkabel, größere Ohrkappe, Rückplatte und Kragenkerben, mattes Anthrazit und Weiß mit Gebrauchsspuren,
  Augen ohne Lichthof; Schal entfernt, IoU nur oberhalb der Schalkante (Mittel 0,903, vorher 0,907 auf derselben
  Messung).
- Dritte Runde Helm: Front läuft mit Mittelgrat spitz zu (V aus zwei Ebenen), Fasen an allen Facettenkanten, tiefe
  Augenhöhlen mit schrägen Wänden (sattes Cyan, Auge zieht sich auf die Seitenfläche), Wangenmarkierungen,
  Schläfenplatten mit Rippen, Mundschlitz, Schraubenreihen an Krempe und Kiefersteg (IoU 0,904).
- Vierte Runde Helm nach einer Formbeschreibung (GPT 6 Astra): Kinnblock hinter der Braue, Mundaussparung mit Leisten
  und Querschlitz, Rücksprung-Fuge hinter der Maskenkante, Wangenschlitze, Rahmen-Absenkung hinten, dreieckige
  Schläfenvertiefungen, Seitenmodul B kantig, Heck-Box nach Maß, Kabel vom Box-Ausgang, Licht dreht mit der Kamera;
  Belege je Durchlauf unter `runs/helm/` (IoU 0,901).
- CSG-Fix in `geo.js`: Transformationen werden in die Geometrie eingebacken (three-bvh-csg rechnet im lokalen System
  des ersten Körpers; Position und Neigung der Kuppel gingen verloren).
- `check` überspringt `node_modules`, `dist`, `renders`.

## 0.0.1 „Scaffold“ – 2026-10-27

- Grundgerüst aus der Sightline-Sitzung: Regeln, Vorlage Helm (Video und 12 Einzelbilder), Kritiker-Prompt und JSON-Schema,
  Prüfung `check`, PR-Check, Lader `./ce` (Agent Tools 0.24; Bilder in `ce api` ab 0.25).
