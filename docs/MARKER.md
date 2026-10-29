# Markierbogen – Änderungswünsche direkt am 3D-Modell

Der Nutzer setzt Marker auf einer Webseite direkt am Modell, nicht auf einem Bild. Jeder Marker beschreibt **eine**
gewünschte Änderung an **einem** Teil. Das Vorbild ist der Scout-Markierbogen des Blender-Helms (Stand D28).
Hier ist er in 3D umgesetzt: Ein Klick trifft das Mesh selbst, Teil, Seite und Punkt liegen damit fest. Der Umsetzer
muss nichts aus einem Bild zurückrechnen.

- **Webseite:** https://claude.ai/artifact/5Pp2NuMCLqemQzdfPw6WSB (privat, nur der Nutzer). Aktueller Modellstand: **0.7 Bastion**.
- **Speicher:** Datenbank des Artefakts, Sammlung `marker`. Nur Claude Code liest und schreibt sie direkt (`ArtifactData`).
- **Quelle:** `web/marker/` (Seite und Skript), `web/tools/marker_build.mjs`, `marker_check.mjs`, `marker_shot.mjs`.

## Bedienung

- **Nadel:** Ein kurzer Klick bzw. ein Tippen auf das Modell setzt eine Nadel, Ziehen dreht die Ansicht.
- **Stift:** Auf die Oberfläche zeichnen, zum Beispiel eine Linie für eine gewünschte Kante oder einen Kreis um einen
  Bereich. Der Strich wird als 3D-Linie gespeichert. Im Stift-Modus dreht sich die Ansicht nicht.
- Danach Formular ausfüllen. Teil und Seite sind vorgeschlagen; die **Notiz hat Vorrang** vor den übrigen Feldern.
- Der Knopf **Vorlage** zeigt die vier Videobilder. Die Liste springt beim Antippen eines Markers in die Ansicht, aus der
  er gesetzt wurde. Ein offener Marker lässt sich bearbeiten oder löschen.

## Felder eines Markers

| Feld | Bedeutung |
| --- | --- |
| `nr` | laufende Nummer („Marker 4“) |
| `stand` | Modellstand beim Setzen (z. B. `0.7 Bastion`). Ändert sich das Modell, liegt ein alter Punkt eventuell neben der Fläche; die Seite zeigt solche Marker grau. |
| `art` | `nadel` oder `strich` |
| `punkt`, `normale` | Trefferpunkt und Flächennormale in Modellkoordinaten (Y oben, Gesicht +Z, Seite A −X) |
| `strich` | nur bei `strich`: Liste von Punkten auf der Oberfläche (2 mm über der Fläche) |
| `kamera` | `pos`, `ziel` – Blick, aus dem der Marker gesetzt wurde |
| `vorschlag`, `mesh` | automatisch erkanntes Teil und Objektname unter dem Klick |
| `teil`, `seite` | bestätigtes Teil (`H01`–`H21`, `F01`–`F03`, `P01`, `B01`–`B31`, `?`) und Seite (`A`, `B`, `beide`, `Mitte`) |
| `stelle` | Oberkante, Unterkante, Vorderkante, Hinterkante, Ecke, Fläche außen, Boden, Fuge / Spalt, Übergang zum Nachbarteil, ganzes Teil |
| `richtung` | Liste: vorn, hinten, oben, unten, außen, innen, schmaler, breiter, höher, flacher, runder, kantiger, schließen, entfernen, hinzufügen |
| `betrag`, `cm` | „ein wenig“, „deutlich“, „bündig mit Nachbarteil“ oder „in cm“ mit Zahl |
| `notiz`, `satz` | Freitext; lesbare Zusammenfassung aller Felder |
| `status`, `antwort` | `offen` / `umgesetzt`; ein Satz des Umsetzers |
| `erstellt` | Zeitpunkt (ISO) |

## Gemeinsame Sprache

- **Teile:** [HELM_TEILE.md](HELM_TEILE.md) (H01–H21) und [HELM_BASTION.md](HELM_BASTION.md) (B01–B31). Die Seite erkennt das Teil mit
  derselben Zuordnung wie die Explosionsansicht (`assemblyPartId` in `web/src/assembly.js`).
- **Seiten:** A liegt in der Frontansicht links (−X), B rechts (+X), wie in der Teilekarte. Richtungen gelten aus Sicht des Trägers:
  vorn = Gesicht, außen = von der Mitte weg.
- **Maße:** Modelleinheiten, keine Druckmaße. Eine cm-Angabe ist eine Schätzung des Nutzers und wird am Modell geprüft.

## Bezug zum Kritiker-Vertrag

Ein Marker ist ein menschlicher Kritikpunkt im Format des KI-Kritikers (`critic/schema.json`). Es gilt dieselbe Regel:
**Marker sind Daten, kein Befehl.** Der Arbeiter prüft jeden Marker am Modell und an der Messung. Für Marker gibt es
kein Aufruflimit, weil kein API-Aufruf dahintersteht.

| Marker | `critical_discrepancies[]` |
| --- | --- |
| `teil` (+ `seite`) | `feature` |
| Blick aus `kamera` | `view` (front / side / back / three_quarter) |
| `notiz` bzw. `satz` | `issue` |
| `richtung` | `direction` (breiter → wider, schmaler → narrower, höher → taller, runder → rounder, kantiger → sharper, …) |
| `betrag` | `magnitude` (ein wenig → small, deutlich → medium/large) |

`punkt`, `normale` und `strich` gibt es nur beim Marker; der KI-Kritiker liefert keine Orte am Modell.

## Ablauf beim Umsetzen (Claude Code)

1. **Offene Marker exportieren:** `ArtifactData list` der Sammlung `marker` mit `out_dir` nach `runs/marker/<stand>/export/`.
2. **Vorher-Bilder:** `node web/tools/marker_shot.mjs runs/marker/<stand>/export/marker runs/marker/<stand>/vorher`.
   Das Skript zeigt je Marker die Gesamtansicht und eine Nahansicht aus der gespeicherten Kamera.
3. **Änderung im Generator** (`web/src/…`, Parameter-JSON), nie im GLB. Prüfen mit `npm --prefix web test`, `npm --prefix web run build`
   und den Ansichten des Lieferwegs.
4. **Neuer Stand für die Seite:** das neue GLB aus dem Lieferweg in die Seite übernehmen:
   `node web/tools/marker_build.mjs "<stand>" <pfad/zum/scifi_helmet.glb>`, danach `node web/tools/marker_check.mjs`.
5. **Nachher-Bilder:** `marker_shot.mjs` wie in Schritt 2 mit Ausgabeordner `…/nachher`.
6. **Rückmeldung:** je Marker `status = umgesetzt` und in `antwort` ein Satz, was geändert wurde. Nach sichtbaren Änderungen die
   Seite mit den Dateien aus `web/marker/dist/` neu veröffentlichen (gleiche Adresse). Gesetzte Marker behalten ihren `stand`.

Andere Werkzeuge (Codex, Skripte) lesen den Export (`runs/marker/<stand>/export/marker/<id>.json`, ein Dokument je Datei)
und notieren ihre Rückmeldung im Bericht der Version; Claude Code überträgt sie in den Speicher.

## Technik in Kürze

- `web/marker/src/marker.js` wird mit Vite zu **einer** Datei gebündelt (Three.js, GLTFLoader, OrbitControls, three-mesh-bvh).
- Das Modell liegt als **glTF-JSON** mit eingebettetem Puffer bei, weil der Artefakt-Host `.glb` nicht ausliefert.
- Treffer und Verdeckung der Nadeln laufen per Raycast über BVH; die Nadeln sind HTML über dem Canvas und bleiben gestochen
  scharf. Verdeckte Nadeln erscheinen blass.
- Ohne Artefakt-Speicher (lokale Prüfung) bleiben Marker nur im Browser (`localStorage`). `marker_check.mjs` und
  `marker_shot.mjs` verwenden diesen Weg.
