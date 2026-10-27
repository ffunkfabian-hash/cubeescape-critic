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
- Rechts oben **lil-gui**: Proportionen, Visierwinkel, Schlauch-Kurvenpunkte, Faltentiefe des Schals, Bloom/AO/Belichtung;
  „Parameter → Konsole“ gibt die aktuellen Werte als JSON aus (zum Übernehmen nach `src/helmetParams.json`).
- Fensterfunktionen: `setCameraView('front'|'left'|'back'|'right')`, `toggleOverlay(true|false, 'normal'|'difference')`,
  `exportGLB()`, `rebuild()`. URL-Parameter: `?view=left`, `?ui=0`, `?overlay=1|diff`, `?turntable=1`,
  `?static=1` (keine Animationsschleife, Bild nur über `renderFrame()` – für Software-GL in Headless-Prüfungen).

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `refs/ref_*.png` | Vorlagenbilder per ffmpeg aus dem Video (0 s, 1,5 s, 3 s, 4,5 s) |
| `src/helmetParams.json` | alle wichtigen Maße (Einheit: Helmhöhe ≈ 1, Y oben, Gesicht +Z, linke Helmseite +X) |
| `src/parts/upperHelmet.js` | `UpperHelmet_Dark`: Kuppel, facettierte Frontplatte, V-Sehschlitze, Mundpartie (CSG) |
| `src/parts/lowerArmor.js` | `LowerArmor_White`: Kern, Kragen, Kinnschutz mit 4 Schrauben, Waben-Lüftungsgitter |
| `src/parts/leftEar.js` | `LeftEar_Cap`: Ohrkappe, Kopfbügel, dunkler Haltebügel |
| `src/parts/rightComms.js` | `RightComms_And_Tube`: Funkmodul, Antenne, Heck-Box, geriffelter Schlauch |
| `src/parts/neckScarf.js` | `Neck_And_Scarf`: Nackenplatten, Büste, Schal (Torus-Lagen mit Simplex-Noise) |
| `src/textures.js` | Canvas-Maps (Waben, Stoff, Schalen-Körnung) |
| `verify_renders.mjs`, `tools/iou.py` | Playwright-Prüfung und Umriss-IoU je Ansicht |

## Abweichungen von den Vorgaben

- `visorGlow.emissiveIntensity` steht auf 1,2 statt 5,0: mit ACES-Tonemapping wird 5,0 reinweiß und der Bloom färbt die
  ganze Frontplatte; der Wert ist in lil-gui (Visier › Leuchtstärke) einstellbar.
- AO über `GTAOPass` aus Three.js statt n8ao (keine zusätzliche Abhängigkeit).
- Die Lüftungsgitter sind eine hellgraue Lochplatte mit dunklen Waben in dunklem Metallrahmen (wie im Video).

## Roboter aus jedem Videoframe (`robot.html`)

Zweite Vorlage `reference/robot/turnaround.mp4` (241 Frames, eine Drehung). Statt von Hand zu modellieren, wird die
Form aus **allen** Frames rekonstruiert:

1. `tools/robot/segment.py` – jeden Frame freistellen (heller Hintergrund, Konturen schließen die Fläche).
2. `tools/robot/hull.py` – Kamera schätzen (Abstand, Neigung, Maßstab, Achse), dann den Drehwinkel **je Frame**
   (das KI-Video dreht ungleichmäßig) und die Visual Hull schnitzen: ein Voxel bleibt, wenn er in ≥ 97 % der Frames
   im Umriss liegt.
3. `tools/robot/mesh.py` – Marching Cubes, Farben je Punkt aus allen Frames (Sichtbarkeit per Z-Puffer, Gewicht
   nach Blickwinkel), GLB nach `public/robot/` (nicht im Repo).
4. `npm run verify:robot` – rendert die Rekonstruktion aus der Kamera **jedes** Frames und misst die Umriss-IoU je
   Frame (`renders/robot_iou.json`, `robot_iou_chart.png`, `robot_compare.png`).

```sh
pip install scipy scikit-image   # einmalig
npm run robot                    # Schritte 1–3 (~3 min)
npm run dev                      # http://127.0.0.1:5173/robot.html
```

Bedienung: Front/Left/Back/Right springen auf den passenden Videoframe, „Turntable (Video)“ spielt die Kamerafahrt des
Videos nach, Regler „Videoframe“ bzw. Pfeiltasten wählen jeden der 241 Frames, O blendet genau diesen Frame ein.
Grenzen der Visual Hull: Mulden, die in keinem Umriss sichtbar sind (Visier, Raum zwischen Beinen von vorn nicht
offen), bleiben gefüllt; die Farben sind aus dem Video übernommen, nicht modelliert.
