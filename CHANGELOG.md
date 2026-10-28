# Changelog

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
- CSG-Fix in `geo.js`: Transformationen werden in die Geometrie eingebacken (three-bvh-csg rechnet im lokalen System
  des ersten Körpers; Position und Neigung der Kuppel gingen verloren).
- `check` überspringt `node_modules`, `dist`, `renders`.

## 0.0.1 „Scaffold“ – 2026-10-27

- Grundgerüst aus der Sightline-Sitzung: Regeln, Vorlage Helm (Video und 12 Einzelbilder), Kritiker-Prompt und JSON-Schema,
  Prüfung `check`, PR-Check, Lader `./ce` (Agent Tools 0.24; Bilder in `ce api` ab 0.25).
