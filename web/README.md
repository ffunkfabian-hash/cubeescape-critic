# Helm im Browser (Three.js)

Prozeduraler Nachbau des Sci-Fi-Helms aus `reference/helm/turnaround.mp4` mit Three.js – Alternative zum Blender-Weg, ohne
lokale 3D-Software. Kein Kritiker-API-Aufruf: der Abgleich läuft über Screenshots, Onion-Overlay und Umriss-IoU.

## Start

```sh
cd web
npm install
npm run dev          # http://127.0.0.1:5173 – Live-Reload, Kamera per Maus drehbar
npm run verify       # headless: renders/render_*.png, overlay_*.png, mask_*.png, compare.png, iou.json
```

## Bedienung

- Leiste unten: **Front, Left, Back, Right** (Blickwinkel wie die Videobilder), **Turntable** (360° in 12 s),
  **Overlay** (Taste **O**), **GLB-Export** (`scifi_helmet.glb`).
- Rechts oben **lil-gui**: Kuppelneigung, Visierwinkel, Spiralkabel (Wendel, Steigung, Kurvenpunkte), Bloom/AO/Belichtung;
  „Parameter → Konsole“ gibt die aktuellen Werte als JSON aus (zum Übernehmen nach `src/helmetParams.json`).
- Fensterfunktionen: `setCameraView('front'|'left'|'back'|'right')`, `toggleOverlay(true|false, 'normal'|'difference')`,
  `exportGLB()`, `rebuild()`. URL-Parameter: `?view=left`, `?ui=0`, `?overlay=1|diff`, `?turntable=1`,
  `?static=1` (keine Animationsschleife, Bild nur über `renderFrame()` – für Software-GL in Headless-Prüfungen).

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `refs/ref_*.png` | Vorlagenbilder per ffmpeg aus dem Video (0 s, 1,5 s, 3 s, 4,5 s) |
| `src/helmetParams.json` | alle wichtigen Maße (Einheit: Helmhöhe ≈ 1, Y oben, Gesicht +Z, linke Helmseite +X) |
| `src/parts/headVolume.js` | Grundform als Loft aus Front-, Seiten- und Draufsicht-Profil (`profile` in den Parametern) |
| `src/parts/upperHelmet.js` | `UpperHelmet_Dark`: Kuppel, Frontplatte mit ebenen Facetten (`facets`), V-Sehschlitze, Mundpartie (CSG) |
| `src/parts/lowerArmor.js` | `LowerArmor_White`: Kern, Kragen, Kinnschutz mit 4 Schrauben, Waben-Lüftungsgitter |
| `src/parts/leftEar.js` | `LeftEar_Cap`: Ohrkappe, Kopfbügel, dunkler Haltebügel |
| `src/parts/rightComms.js` | `RightComms_And_Tube`: Funkmodul, Antenne, Heck-Box, Spiralkabel |
| `src/parts/neck.js` | `Neck`: Hals mit Nackenplatten (der Schal des Videos ist nicht Teil des Modells) |
| `src/textures.js` | Canvas-Maps (Waben, Gebrauchsspuren, Schalen-Körnung) |
| `verify_renders.mjs`, `tools/iou.py` | Playwright-Prüfung und Umriss-IoU je Ansicht (nur oberhalb der Schalkante der Vorlage) |
| `tools/pairs.py` | Nahvergleich Vorlage/Render je Ansicht |

## Abweichungen von den Vorgaben

- `visorGlow.emissiveIntensity` steht auf 0,75 statt 5,0 und Bloom auf 0: im Video leuchten die Schlitze blass ohne
  Lichthof; beides ist in lil-gui einstellbar.
- Kein Schal (Wunsch des Nutzers); der Umrissvergleich zählt deshalb nur oberhalb der Schalkante.
- AO über `GTAOPass` aus Three.js statt n8ao (keine zusätzliche Abhängigkeit).
- Die Lüftungsgitter sind eine hellgraue Lochplatte mit dunklen Waben in dunklem Metallrahmen (wie im Video).
