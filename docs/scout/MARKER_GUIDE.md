> Übernommen aus dem Arbeitsordner `trialanderror` (Stand D29, 29.10.2026). Dateinamen ohne Pfad beziehen sich jetzt auf `blender/scout/`; Bilder auf `assets/helmet-scout/`; `durchlaeufe/` und Marker-Exporte blieben im Arbeitsordner.

# Marker-System „Scout Markierbogen“ – Kurzanleitung für andere Werkzeuge

Für Agenten/Tools (Codex, Gemini, Skripte), die Änderungswünsche des Nutzers am Helm **Scout v3** umsetzen sollen.
Der Nutzer setzt Marker in einer Webseite; jeder Marker beschreibt **eine** gewünschte Änderung an **einem** Teil.

## 1. Woher kommen die Marker?
- **Webseite (Eingabe):** die Markierungsseite des aktuellen Stands (Liste in `STAENDE.md`; je Stand eine eigene Seite mit eigenem Protokoll) – vier Ansichten (vorn, Seite R,
  Dreiviertel, hinten); Klick setzt einen Marker, Teil/Seite/Höhe werden vorgeschlagen, der Nutzer ergänzt den Rest.
- **Speicher:** Datenbank des Artefakts, Sammlung `marker`. Nur Claude Code liest/schreibt sie direkt (`Artifact read_db / write_db`).
- **Für andere Tools:** Export als JSON unter `marker_export/D<stand>/marker/<id>.json` (je Markierungsseite ein Ordner) (ein Dokument je Datei, Feld `data` = Marker).
  Den Export erzeugt Claude Code auf Anfrage neu; er ist eine Momentaufnahme.

## 2. Felder eines Markers
| Feld | Bedeutung |
| --- | --- |
| `nr` | laufende Nummer (so spricht der Nutzer: „Marker 4“) |
| `ansicht` | `vorn` (0°), `seite` (−90°, zeigt Seite R), `dreiviertel` (−40°), `hinten` (180°) |
| `u`, `v` | Klickstelle im Ansichtsbild, 0…1, **v von oben** |
| `hoehe_cm` | Höhe über der Helmunterkante (Helm = 30 cm, 1 H = 30 cm, Z 0…1) |
| `vorschlag` | automatisch erkanntes Teil unter der Klickstelle, z. B. `S07 Kieferstück R` |
| `teil`, `seite` | vom Nutzer bestätigtes Teil (S01–S13, `?` = unklar) und Seite (`R`, `L`, `beide`, leer) |
| `stelle` | Oberkante, Unterkante, Vorderkante, Hinterkante, Ecke, Fläche außen, Boden, Fuge / Spalt, Übergang zum Nachbarteil, ganzes Teil |
| `richtung` | Liste: vorn, hinten, oben, unten, außen, innen, schmaler, breiter, höher, flacher, runder, kantiger, schließen, entfernen, hinzufügen |
| `betrag`, `cm` | „ein wenig“, „deutlich“, „bündig mit Nachbarteil“ oder „in cm“ + Zahl |
| `notiz` | Freitext – **hat Vorrang**, wenn er den anderen Feldern widerspricht |
| `satz` | lesbare Zusammenfassung aller Felder |
| `status`, `antwort` | `offen` / `umgesetzt`; kurze Rückmeldung des Umsetzers |
| `stand` | Modellstand beim Setzen (z. B. `D27`) – ist das Modell seitdem geändert, Marker erst am aktuellen Stand prüfen |

Viele Felder sind optional; oft steht alles Wesentliche in `notiz` (z. B. „gilt auch für die andere Seite“).

## 3. Gemeinsame Sprache
- **Teile S01–S13:** `HELM_TEILE_SCOUT.md`, Bilder `helm_explosion_vorn/hinten.png`, `helm_teilekarte.png`.
- **Seiten:** R = +X = in der Frontansicht **rechts im Bild**, L = −X. Objektnamen in Blender sind historisch nicht einheitlich
  (`Kiefer_L`, `Auge_L` liegen bei +X) – Seite immer aus der Lage bestimmen, nie aus dem Namen.
- **Richtungen** gelten aus Sicht des Trägers: vorn = Gesicht, hinten = Nacken, außen = von der Mitte weg.
- **Maße:** 0,01 H ≈ 3 mm. Achsen in Blender: +Z oben, −Y vorn.

## 4. Marker → 3D-Punkt (Blender)
Kamera `cam_praesentation` mit **Brennweite × 0,75**, Bild 1080 × 1080, `HELM_ROOT` um Z gedreht (vorn 0°, seite −90°,
dreiviertel −40°, hinten 180°). Strahl von der Kamera durch den Bildpunkt (u, 1−v) schießen, erster Treffer = Teil und Punkt;
Punkt mit `HELM_ROOT.matrix_world.inverted()` in Helm-Koordinaten umrechnen. Funktion dafür: `helm_explosion.py`
(gleiche Kameraeinstellung wie `teilekarte()`).

## 5. Ablauf beim Umsetzen
1. Offene Marker lesen (`status != umgesetzt`), je Marker 3D-Punkt bestimmen und die Stelle vergrößert rendern.
2. Änderung **im Generator** vornehmen (`helm_params.json`, `helm_csg.py`, `helm_bauen.py`) – nie nur in der .blend.
3. Durchlauf (`helm_durchlauf.py`), Ansichten prüfen, Nachbau aus leerer Datei (`bauen_lauf6b()`) muss identisch sein.
4. Rückmeldung: `status = umgesetzt`, `antwort` = ein Satz, was geändert wurde (Claude Code schreibt das in den Speicher;
   andere Tools notieren es in `testlog.md`, Claude Code überträgt es).
5. Nach sichtbaren Änderungen Teilekarte und Markierbogen neu bauen, sonst passen Bild und Teile-Raster nicht: in Blender
   `helm_explosion.py` → `markierbogen_daten(scratch)`, JPEGs als Assets hochladen, dann
   `python3 markierbogen_bauen.py <scratch> <Stand> <4 Asset-URLs>` und die Seite neu veröffentlichen (nur Claude Code).
   Für jeden neuen Stand eine **neue** Seite veröffentlichen (eigene Datei, z. B. `markierbogen_D29.html`) und in `STAENDE.md`
   eintragen; die alte Seite bleibt als Archiv mit ihren Markern. Dazu `python3 stand_sichern.py <nr> <seiten-url>`.
