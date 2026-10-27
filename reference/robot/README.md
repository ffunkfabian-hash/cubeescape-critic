# Vorlage: Sci-Fi-Roboter

- Quelle: Nutzer, 27.10.2026, KI-Video (`video-grok-imagine-…mp4`), 10,04 s, 1280×720, 24 Bilder/s = 241 Frames.
- Inhalt: Ganzkörper-Roboter/Rüstung in A-Pose, weiß mit hellblauen Facettenpanels und dunkelgrauen Gelenken,
  Toon-Shading mit schwarzen Konturen, fast weißer Studiohintergrund (≈ 250), eine 360°-Drehung (nicht gleichmäßig).
- Merkmale: Helm mit dunklem Visier und Ohrscheiben; Brust mit rundem Leuchtkern; große facettierte Schulterpanzer;
  Gürtel mit Taschen; Knie- und Schienbeinplatten; Stiefel mit dunklen Sohlen.
- Nutzung: `web/tools/robot/` verwendet **jeden Frame** (Freistellung, Drehwinkel je Frame, Visual Hull, Farben); die
  Einzelbilder werden aus dem Video erzeugt und nicht eingecheckt (`runs/robot/`).

## Model Sheet

- `sheet/model_sheet.svg` – Nutzer, 27.10.2026: vektorisiertes Model Sheet desselben Roboters, sechs orthografische
  Ansichten (Front, Rücken, rechte und linke Seite, oben, unten), weiß/hellblau/dunkelgrau, schwarze Konturen,
  4572 Farbflächen. Grundlage des Bauteil-Roboters (`web/tools/robot/sheet.py`). Die Draufsicht zeigt die Arme nach
  vorn, die Seitenansichten hängend – dort widerspricht sich die Zeichnung.
