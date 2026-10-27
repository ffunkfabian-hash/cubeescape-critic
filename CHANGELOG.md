# Changelog

## 0.0.2 „Browser Helmet“ – 2026-10-27

- `web/`: Three.js-Nachbau des Helms ohne lokale 3D-Software – fünf benannte Bauteilgruppen (three-bvh-csg, Schal mit
  simplex-noise), Studio-Licht, GTAO, Bloom nur auf dem Visier, ACES, Canvas-Texturen.
- Ansichten Front/Left/Back/Right wie die Videobilder (`web/refs/`, per ffmpeg), Turntable, Onion-Overlay (Taste O),
  lil-gui auf `helmetParams.json`, GLB-Export `scifi_helmet.glb`.
- `npm run verify`: Playwright-Renders, Overlay- und Umrissbilder, Umriss-IoU je Ansicht (Mittel 0,908 nach 5 Durchläufen).
- `check` überspringt `node_modules`, `dist`, `renders`.

## 0.0.1 „Scaffold“ – 2026-10-27

- Grundgerüst aus der Sightline-Sitzung: Regeln, Vorlage Helm (Video und 12 Einzelbilder), Kritiker-Prompt und JSON-Schema,
  Prüfung `check`, PR-Check, Lader `./ce` (Agent Tools 0.24; Bilder in `ce api` ab 0.25).
