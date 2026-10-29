# Helm im Browser (Three.js)

Prozeduraler Nachbau des Sci-Fi-Helms aus `reference/helm/turnaround.mp4` mit Three.js – Alternative zum Blender-Weg, ohne
lokale 3D-Software. Kein Kritiker-API-Aufruf: der Abgleich läuft über Screenshots, Onion-Overlay und Umriss-IoU.

## Start

Der aktuelle Generator enthält den Formversuch 0.4. `?finish=original` (Standard), `?finish=metal` und
`?finish=graphite` wählen das Finish der dunklen Rüstung. Alle drei bauen dieselbe Geometrie. Stand 79 bleibt
als früherer Export unter `assets/helmet/`; seine Quelle liegt bei Git-Commit `0a6bda5`.
Unabhängig davon wählt `&accents=light-fasteners` helle obere Schrauben; `&accents=white-strips` ergänzt weiße
Stirn-/Scheitelstreifen; `&accents=contrast-strips` wählt anthrazitfarbene Streifen mit zum Finish passendem Glanzkontrast.
Standard ist `accents=original`. Die [exportierten Proben](../assets/helmet-continuity/README.md)
enthalten die genaue Auswahl samt Quell- und Ausgabehashes.
`&strips=off` erzeugt die Haube ohne die beiden Stirn-/Scheitelblenden; Standard ist `on`.
Die entsprechende Runner-Option heißt `--strips=off`. Die kurz erprobten Haubenmuster wurden auf Nutzerwunsch
vollständig entfernt; `--crown-pattern` wird nicht mehr unterstützt.

```sh
cd web
npm ci
python3 -m pip install -r requirements.txt # vorzugsweise in einer virtuellen Umgebung
npx playwright install chromium          # falls kein Chromium vorhanden ist
npm run dev          # http://127.0.0.1:5173 – Live-Reload, Kamera per Maus drehbar
npm run verify       # headless: renders/render_*.png, overlay_*.png, mask_*.png, compare.png, iou.json
```

In der Cloud: `. /workspace/critic-env/venv/bin/activate` und
`export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`; damit wird der vorhandene Browser verwendet.
Node 24 und Python 3.12 sind hier geprüft. Playwright ist als Entwicklungsabhängigkeit gepinnt.
`npm run verify` startet und beendet seinen eigenen Vite-Server, benötigt also keinen zuvor gestarteten Dev-Server.
Zusätzlich wird der tatsächliche Browser-GLB-Export unter `renders/scifi_helmet.glb` geprüft und zusammen mit dem
Laufstatus in `renders/verification.json` protokolliert. Nur `status: passed` bezeichnet einen abgeschlossenen Lauf;
vorhandene Bilder allein können noch aus einem früheren Lauf stammen. `--no-iou` lässt die Messung ausdrücklich aus.

## Scout v3 (0.8)

`?model=scout` zeigt den zweiten Helm **Scout v3**, Stand D29. Er wird in Blender aus `blender/scout/` gebaut und hier als GLB aus
`assets/helmet-scout/` geladen. Kameras, Turntable und Look bleiben gleich, die Geometrie-Regler sind ausgeblendet, weil die Quelle der Blender-Generator bleibt.
`&exploded=1` zeigt die Explosionsansicht mit den Teil-IDs S01–S13. Die Materialien im GLB sind flache Ersatzmaterialien; maßgeblich
sind die Cycles-Ansichten. [Aufbau, Nachbau und Grenzen](../docs/HELM_SCOUT.md).

## Körperstudie

**Aktuell 0.7:** `?body=shoulders&headset=off` zeigt kurzen Hals, kantige Schultergehäuse mit unteren Lamellen,
zentrale Brust und Flanken. 31 separate Körperteile; [Bastion-Aufbau und Reproduktion](../docs/HELM_BASTION.md).
22 separate Körpermeshes, parametrisch reproduzierbar. `?headset=off` blendet beide kompletten Kopfhörer samt Bügel,
Kabeln und Antennen aus; das zentrale Heckmodul bleibt. `?exploded=1&view=assembly` öffnet die beschriftete
Explosionsübersicht. Alle Optionen auch rechts oben unter **Aufbau und Varianten**; die Teileliste nennt offene Anschlüsse.
[Technik, IDs, Parameter und Grenzen](../docs/HELM_AUFBAU.md) · [Geprüfte Exporte](../assets/helmet-assembly/README.md).
Körper-/Explosionsprüfungen benötigen `--no-iou`; ihre Kameras sind nicht mit den Helm-Videobildern vergleichbar.

Mit `http://127.0.0.1:5173/?body=1` erscheint weiterhin die **ältere** Proportionsstudie unter dem Helm. Sie ist ein Entwurf ohne
Körperreferenz, noch keine vollständige Figur. Brust, Rücken, Bauch, Becken, Halsanschluss, Schultern und Gelenke sind
getrennte, benannte Meshes im GLB-Export `scifi_body_study.glb`. Arme und Beine fehlen noch. Ohne `?body=1` bleiben
Helmansicht, Kameras, Export und Silhouettenprüfung unverändert.

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
| `tools/save_pass.py` | Belege eines Durchlaufs: `runs/helm/<Nr>/` (IoU, Vergleichsbilder, Notiz) und `docs/belege/helm/<Nr>.jpg` |

## Parameter (`src/helmetParams.json`)

Einheit: Helmhöhe ≈ 1, Ursprung in der Kopfmitte, Y oben, Gesicht +Z, linke Helmseite +X.

| Schlüssel | Bedeutung |
| --- | --- |
| `shapeFit` | kohärente Verkürzung unter Augenhöhe (`lowerFaceScale`, `lowerFaceAnchor`), einschließlich Befestigungen |
| `comms.symmetric` | Spiegelt den kompletten Kopfhörer von A nach B und ersetzt dort das alte Ohrmodul; `false` reproduziert den asymmetrischen Aufbau |
| `foreheadPlates` | Trapezumriss, Auflagehöhe, Unterseite und auslaufender Maskenanschluss der separaten Stirnblenden H20/H21 |
| `crownTransition` | Neigung und Z-Anker des Übergangs zwischen Haube und Gesichtsmaske |
| `crownRounding` | Stärke und Höhenbereich der Rundung des Haubenquerschnitts |
| `head.tilt` | Neigung der ganzen Grundform um X (Bogenmaß) |
| `profile.front` | halbe Breite je Höhe, `[x, y]` von oben nach unten |
| `profile.sideFront`, `profile.sideBack` | vordere bzw. hintere Kante je Höhe, `[z, y]` von oben nach unten |
| `profile.topHalf` | normierte Draufsicht (rechte Hälfte, `[u, v]`, v = 1 vorn), wird je Höhe skaliert |
| `facets` | Ebenen der Frontplatte `[Punkt, Normale]`: zwei Front-Ebenen (Mittelgrat), Seitenfasen, Stirn, Untergesicht |
| `facetBevels`, `bevelWidth` | Facettenpaare mit Fase an der gemeinsamen Kante, Fasenbreite |
| `capEdgeY`, `maskBackZ` | Unterkante der dunklen Kappe hinten, hintere Kante der Frontplatte an der Seite |
| `visor` | Sehschlitze: Lage `x`/`y`, `width`/`height`, V-Winkel `angleDeg`, Ausrichtung `yawDeg`, Tiefe `socketDepth`/`slitDepth` |
| `core`, `collar`, `neckRing` | weißer Kern, Kragen (mit Neigung), Halsring: Radien, Höhen, Mittelpunkt |
| `band` | Kopfbügel: Lage `z`, halbe Breite |
| `earL`, `earR` | Ohrkappe links bzw. Funkmuschel rechts: Mitte, Außenkante, Größe |
| `antenna.top`, `backBox` | Antennenspitze; Heck-Box Mitte und Größe |
| `tube` | Spiralkabel: Wendel- und Drahtradius, Steigung, Kurvenpunkte (vom Box-Ausgang zur Funkmuschel) |
| `mouth` | Mundaussparung: Umriss `outline` (`[x, y]`), Tiefe, Leistenbreite, Querschlitz (Breite, Höhe) |
| `maskGap` | Verlauf der dunklen Rücksprung-Fuge hinter der Maskenkante (`[z, y]`) |
| `cheekSlot` | Schlitze an den unteren Wangen: Lage, Breite, Höhe, Neigung |
| `collar.dip` | Absenkung in der Oberkante des hinteren Rahmens (`[x, Δy]` relativ zur Oberkante) |
| `collarFront.topZ`, `bottomZ` | schräger vorderer Abschluss des Nackenrahmens unter der Maskenhalterung |
| `collarPanel` | Größe, Lage und Tiefe der tatsächlich ausgeschnittenen Seitenfelder, des kleinen Felds und der Schlitze |

## Über Änderungen sprechen

Die [Teilekarte](../docs/HELM_TEILE.md) vergibt stabile Kennungen H01–H21. Bitte Kennung, Seite und gewünschte Änderung
nennen, etwa „H11 auf Seite B tiefer“. Seit Stand 79 tragen beide Seiten gespiegelte Funkmuscheln, Antennen und Kabel.
Die Seitennamen beziehen sich auf Bauteile und ändern sich beim Drehen nicht.

Gezielte Prüfungen: `npm test` (Prüfablauf und Messung), `npm run build` und `npm run verify` (Browser, Bilder, GLB und IoU).

## Messverlauf (Umriss-IoU)

| Stand | front | left | back | right | Mittel |
| --- | --- | --- | --- | --- | --- |
| Runde 1, mit Schal (alte Messung) | 0,939 | 0,887 | 0,918 | 0,887 | 0,908 |
| Runde 1, gemessen oberhalb der Schalkante | 0,926 | 0,921 | 0,896 | 0,884 | 0,907 |
| Runde 2: Profil-Loft, Facetten, Spiralkabel, ohne Schal | 0,922 | 0,910 | 0,882 | 0,897 | 0,903 |
| Runde 3: spitze Front, Fasen, Augenhöhlen, Details | 0,923 | 0,917 | 0,882 | 0,893 | 0,904 |
| Runde 4: Formbeschreibung (Ausschnitte, Anbauten, Kamera-Licht) | 0,919 | 0,914 | 0,878 | 0,891 | 0,901 |

Kurzfassung je Runde; **alle Durchläufe** mit Änderung, Messwert und Entscheidung: `docs/HELM_VERLAUF.md`.
Die Silhouette ändert sich durch Facetten, Material und Details kaum; Fortschritt zeigt der Nahvergleich
(`python3 tools/pairs.py . out.png`). Lehren: `docs/LESSONS.md`.

## Abweichungen von den Vorgaben

- `visorGlow.emissiveIntensity` steht auf 1,0 statt 5,0 und Bloom auf 0,08: im Video leuchten die Schlitze blass ohne
  Lichthof; beides ist in lil-gui einstellbar.
- Kein Schal (Wunsch des Nutzers); der Umrissvergleich zählt deshalb nur oberhalb der Schalkante.
- AO über `GTAOPass` aus Three.js statt n8ao (keine zusätzliche Abhängigkeit).
- Die Lüftungsgitter sind eine hellgraue Lochplatte mit dunklen Waben in dunklem Metallrahmen (wie im Video).

## Reproduzierbarer Stand 0.2 „Fidelity“

Das Video `reference/helm/turnaround.mp4` bleibt maßgeblich. Die Meshy-GLB ist ausschließlich eine zusätzliche
3D-Referenz; sie ersetzt weder die Referenzbilder noch die Kamerakalibrierung. Ihre doppelte Funkseite ist keine Vorgabe.

Auf einer frischen Kopie mit Node **24.19.0** (`web/.nvmrc`) und Python **3.12**:

```sh
python3 -m venv ../critic-helm-venv
. ../critic-helm-venv/bin/activate
python3 -m pip install -r web/requirements.txt
npm --prefix web ci
cd web
npx playwright install chromium
npm test
npm run build
# Im Projekt mit ce: ../ce lock gpu -- node verify_renders.mjs
npm run verify
```

`renders/verification.json` enthält SHA-256 der Quellen, des maßgeblichen Videos und aller vier Referenzbilder,
Parameter, Kameraposen, tatsächlich verwendete Laufzeit-/Paketversionen sowie Hashes des GLB und der Renderdateien.
Ändert sich eine erfasste Quelldatei während der Prüfung, schlägt der Lauf fehl. Materialien verwenden feste Seeds
(3/11/21); die GTAO-Entrauschung verwendet Seed 47. GLB und PNGs sind auf der dokumentierten Mac-/Chromium-/SwiftShader-
Umgebung wiederholbar zu prüfen. Bytegleichheit auf anderen Browser-, Betriebssystem- oder Treiberversionen wird nicht behauptet.

Die Referenzprüfung benötigt die unveränderte Meshy-Datei (Hash steht in `refs/meshy-reference.json`):

```sh
npm run verify:reference -- /absoluter/pfad/zur/Meshy-Datei.glb
python3 tools/pairs.py . renders/meshy-vergleich.jpg --reference renders/reference
# Vergleich mit gespeicherten Vorher-Bildern:
python3 tools/pairs.py . renders/vorher-nachher.jpg --baseline /pfad/zum/vorher/renders
```

Der Referenzlauf erzeugt Textur- und Geometrieansichten sowie `comparison.json` mit Herkunft und Ausgabehashes.
Die globale Aufstellung ist zur Sichtprüfung angenähert; aus diesen Bildern wird **kein Meshy-IoU** berechnet.
Die Bildausschnitte des Kontaktbogens sind Darstellungszuschnitte, keine Änderung der Helm-Messung.

## Aktueller Lieferstand 79

Nach Nutzerfeedback ist die Haube auch um den Kopfbügel quer und längs gewölbt (`crownDome`).
`crownTransition.blendHeight` führt den Haubenrand weich zur Augenmaske. `rimOverlap` und `rimCover` (je 0,001
Modelleinheiten) schließen den sichtbaren Abstand und decken die helle Schnittkante ab. `clearance` ist dadurch ersetzt.
Der symmetrische Kopfhöreraufbau übernimmt 18 Anbauteile von A nach B, einschließlich Kabel, Halterung und Antenne.
`comms.symmetric = true` ersetzt das bisherige helle Ohrmodul samt eigenem Halter; das Scheitelband und das einzige
mittige Heckmodul bleiben erhalten. Die Reflexion wird in Geometrie und Normalen eingebrannt, Dreiecksorientierung
korrigiert und positive Exportskalierung geprüft. H20/H21 sind weiterhin bis an die Augenmaske verlängert. `foreheadPlates.outline`, `projection` und `embed` steuern ihre Form.
`joinBlendHeight`, `joinOverlap` und `joinLip` führen den Rand flach in die Maske. Die glatten Normalen werden mit
der Verformung transformiert, damit keine Schattierungsstreifen entstehen. Material und Texturen bleiben erhalten.
18 Auflageproben, drei Mittelstreifenproben und zwölf Anschlussproben sichern den Sitz; der alte getrennte Umriss
schlägt als Negativkontrolle fehl.
Der verdeckte Maskenanschluss wird weiterhin mit 33 Strahlen geprüft.
`crownArmor` behält die Graphitgrundfarbe der Maske und den gedämpften Glanz. `crownMaps(seed=73)` erzeugt sichtbare feine
Lackkörnung als Farb-, Normalen- und Rauheitskarte. Die übrigen Materialien bleiben erhalten; die Haubennormalenkarte wird im glTF-Kernkanal exportiert.
Die Haubenversuche 62/63 sind verworfen. Aktuelle Quellen und alle 24 Ausgaben sind über SHA256 dokumentiert.

`lowerArmorEdges.radialSegments = 96` erzeugt die wieder runde, glatt schattierte Gehäuse- und Nackenwand.
Die obere Fase und geraden Eckabschrägungen der Taschen bleiben erhalten. Zwölf Strahlproben prüfen die elliptische
Rundung; die vorherige 16-Flächen-Variante fällt dabei gezielt durch. Die Taschenböden folgen derselben Rundung
wie ihre Träger und bleiben separate Teile. Der Halsring und die kantigen Kieferplatten sind unverändert.
Modellteile werden in `parts/` erzeugt; 104 Meshes sind im GLB enthalten. Die optionale Körperstudie bleibt ein Entwurf.

[Stilbeschreibung und feste Vorgaben](../docs/HELM_STIL.md) · [Lieferdateien](../assets/helmet/README.md).

### Neu erzeugen

```sh
python3 -m venv ../helm-venv
. ../helm-venv/bin/activate
python3 -m pip install -r web/requirements.txt
npm --prefix web ci
cd web
npx playwright install chromium
npm test
npm run build
npm run verify
```

Geprüft mit Node 24.19.0, Python 3.12.10 und Chromium/ANGLE SwiftShader auf macOS arm64; Paketversionen sind gepinnt.
Auf dem gemeinsam genutzten Mac vom Repo-Hauptverzeichnis rendern mit
`./ce lock gpu -- node "$PWD/web/verify_renders.mjs"`.
Der absolute Pfad ist nötig, weil ce den Befehl vom Repo-Hauptverzeichnis startet. Ohne diesen Ressourcenkoordinator
funktionieren Generator und npm-Befehle ebenfalls.

`renders/verification.json` dokumentiert Quellen, Video-/Referenzhashes, Parameter, Kameras, Laufzeit und Ausgabehashes.
`npm run verify` sichert acht Textur-PNGs und `textures/materials.json` mit Materialzuordnung, UV-Wiederholung und Bump-Stärke.
GLB enthält unterstützte Farb-/Rauheitskarten; Reliefkarten beim Import zusätzlich als Höhen-/Bump-Texturen zuordnen,
da glTF Three.js-`bumpMap` nicht direkt übernimmt. Die Texturen entstehen mit festen Seeds ohne externe Bildquelle.

[Lieferdateien gegen einen neuen Lauf prüfen](../assets/helmet/README.md). Bytegleichheit wird für die dokumentierte
Umgebung geprüft; für beliebige Fremdprogramme/Treiber wird sie nicht zugesichert.

Die historischen Formversuche bleiben im [Verlauf](../docs/HELM_VERLAUF.md) und als Vergleichsbilder im Repo erhalten.
Vollständige lokale Quellsicherungen und Reproduktionspakete der verworfenen Varianten bleiben separat archiviert;
der Repo-Generator und `assets/helmet/` repräsentieren ausschließlich den aktuellen Lieferstand.

`tools/save_pass.py` sichert nur vollständige erfolgreiche Läufe mit IoU. Quell- und Ausgabehashes, `iou.json` und
`compare.png` müssen zum Prüfmanifest passen; nach Fehlern oder `--no-iou` wird kein neuer Beleg angelegt.
