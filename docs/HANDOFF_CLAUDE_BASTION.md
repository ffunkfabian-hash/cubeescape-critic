# Übergabe an Claude Code – Bastion 0.7

bereit – Modell und Lieferpaket sind geprüft und gepusht; Nutzer-Sichtabnahme sowie PR-/CI-Abschluss stehen aus.

> **Überholt am 29.10.2026:** Draft-PR #10 existiert; die Brust wurde danach mit Fugen und mehr Tiefe nachgearbeitet
> (Quellenpin `b8e6726`). Aktuellen Stand aus `docs/versions/0.7.md` und `assets/helmet-bastion/README.md` lesen.

## Startauftrag für eine frische Sitzung

**Claude Opus, high – Grund: visuelle Modellgestaltung und Beurteilung räumlicher Formen.**
Übernimm den bestehenden Helm-/Oberkörperauftrag in einer **frischen Sitzung ohne übernommenen Chatverlauf**.
Arbeite auf dem Mac im vorhandenen Repository. Lies zunächst die globalen Regeln über Nexogen, dann dieses
Dokument, `AGENTS.md` und `docs/LESSONS.md`. Prüfe Git-Status und Ressourcensperren neu.
Keine andere Sitzung anschreiben oder beobachten; diese Übergabe ist eigenständig.

Der Nutzer hat zuletzt eine Übergabe angefordert. Die bisherigen Arbeiten sind gesichert. Zuerst den aktuellen
Stand und die beiden Facettenreferenzen öffnen, dann den noch offenen Lieferabschluss bearbeiten. Keine
ungefragte Erweiterung auf ganze Arme/Beine, Rig, Fertigung oder einen neuen Materialstil.

## Verifizierter Stand am 28.10.2026

- Repository/Arbeitsverzeichnis: `/Users/ffunk/cubeescape-critic`.
- Remote: `https://github.com/ffunkfabian-hash/cubeescape-critic.git`.
- Aktiver Branch: **`codex/critic-0.7-bastion`**; bestehende Versionsreservierung weiterverwenden.
- Modellquelle: **`c445de50b758710962b32097a61202cea534ad97`**.
- Liefer-/Dokumentationscommit vor dieser Übergabedatei: **`38574f1c8ddc5333d6250368d24ea3b3514fce07`**.
- `git ls-remote` bestätigte diesen Liefercommit auf `origin/codex/critic-0.7-bastion`; Arbeitsbaum war sauber.
  Diese Übergabedatei wird anschließend separat committed und gepusht. Den aktuellen HEAD deshalb live lesen.
- Basis: `8bd048c0df0ca5cfda84a859e56cf7c5e929b0d0`, Branch `codex/critic-0.6-cuirass`.
- Für Bastion wurde **noch kein PR erstellt**; GitHub-Suche nach dem Headbranch ergab keinen Treffer.
  Vor Erstellung nochmals prüfen, damit kein Duplikat entsteht.
- Vorgänger: [PR #9 – Cuirass](https://github.com/ffunkfabian-hash/cubeescape-critic/pull/9),
  davor [PR #8 – Bulkhead](https://github.com/ffunkfabian-hash/cubeescape-critic/pull/8).
  Ihre aktuellen Zustände bei Bedarf live prüfen. Kein Merge, Tag oder Release wurde beauftragt.

## Was der Nutzer tatsächlich möchte

1. Der Helm bleibt an das ursprüngliche Video gebunden. Meshy-GLB nur zusätzliche Referenz.
   Akzeptierte Augen, runde Haube und runder heller Hinterkopf erhalten. Frühere Haubenmuster sind verworfen.
2. Oberkörper: kurzer Hals, kräftiger Rumpf auch in der Tiefe, Schultern nicht zum Helm hochziehen.
   Weiß/Graphit und dunkle Gelenkbereiche passend zum Helm. Kopfhörer samt Band in der Körperprobe ausblenden;
   die bestehenden Optionen und anderen Materialproben bleiben verfügbar.
3. Neue Rüstungsbilder führten zu kantigen, tiefen Schultergehäusen, gestaffelten Platten und einer
   durchgehenden Brustmitte mit separaten Flanken. **Danach korrigierte der Nutzer ausdrücklich:**
   „Vielleicht sind die Schultern etwas zu kantig … aber gut, ich warte ab“ und
   „Von der Seite sieht das so drauf gedrückt aus, so platt. Etwas mehr Volumen bei der Brust mit Struktur“.
4. Dazu zeigte er zwei Bilder mit erhabenen polygonalen Facetten, das zweite mit weicheren Kanten und
   deutlicheren Trennlinien. Gemeint ist körperliche Struktur/Volumen an der Brust, nicht bloß ein Texturmuster.
   Die Bilder wurden am Ende erneut ohne zusätzlichen Text gesendet. **Das ist keine Sichtabnahme.**
5. Alles prozedural reproduzierbar, Teile einzeln vorhanden, Aufbau/Stil/Agenteneinschätzung dokumentieren.
   Upload ins Repository ist bereits autorisiert; keine Freigabe für Merge oder Veröffentlichung als Release.

## Zuerst visuell ansehen

- [Flache Zwischenprobe links / neue Volumenprobe rechts](bilder/helm_bastion_volumenvergleich.jpg).
- [Vier Ansichten des aktuellen Stands](bilder/helm_bastion_vier_ansichten.jpg).
- [Cuirass / Bastion](bilder/helm_bastion_vergleich.jpg).
- [Beschriftete Explosionsansicht](bilder/helm_bastion_explosion.jpg).

Die beiden wichtigsten lokalen Nutzerbilder (temporäre Pfade, beim Start auf Existenz prüfen):

```text
/tmp/codex-remote-attachments/01a181de-e15a-7651-810b-431c03ff1d9a/1AB9D607-9ED0-46E5-A5EE-07B9743A76E5/1-Eingefügtes-Bild-1.jpg
/tmp/codex-remote-attachments/01a181de-e15a-7651-810b-431c03ff1d9a/91DE0E47-C261-4F11-B5D9-8203C30C050B/1-Eingefügtes-Bild-1.jpg
```

Alle sechs Referenzen sind mit Inhalt, Anhangskennung und SHA-256 in [HELM_BASTION.md](HELM_BASTION.md)
dokumentiert. Vier frühere Rüstungsbilder liegen unter demselben temporären Stammordner mit Kennungen
`DFB5F730-087F-4A40-B775-B06188A4F2AD`, `EE0180F4-4DBB-4CDA-B444-B9F2564B3D40`,
`6A77F235-226B-45AF-B5C5-B6D9AECFF9C7`, `E63FDD72-1760-4770-A1F5-B1D533A0DDD7`
und jeweils Dateiname `1-Eingefügtes-Bild-1.jpg`. Die Bilder nicht ungefragt ins öffentliche Repo kopieren.

## Umsetzung und ihre Grenzen

**Der vorhandene Three.js-Generator ist die Quelle. Kein Wechsel auf Blender.** Der lokale Repo-Auftrag
überschreibt hier die allgemeine Blender-Skill-Vorgabe. Keine Handbearbeitung eines GLB als neue Quelle.

- `web/src/parts/shoulderStudy.js`: geschlossene Platten mit Fasen, Schulterkästen, Brust, Flanken und Gelenkplatzhalter.
- `web/src/shoulderStudyParams.json`: aktuelles Preset Bastion.
- `web/src/assembly.js`: stabile Teile-IDs und Explosionszuordnung.
- B01–B26 behalten ihre Kennungen. Neu: **B27 Brustmitte, B28/B29 Flanken, B30/B31 Schulterdächer**.
- Insgesamt **31 separate Körpermeshes**, in der aktuellen Probe **87 Meshes = 56 Helm + 31 Körper**,
  53 beschriftete Gruppen. Mit Stirnstreifen 89, mit Headset ohne Streifen 127.
- B12/B13 sind jetzt seitliche Brustsegmente; ihre internen alten Namen `ClavicleArmor_R/L` bleiben stabil.
- Schultern: Front-/Rückplatte plus gefaltetes Dach/äußere Wand. Nach letzter Korrektur kleinere Kontur,
  etwas niedrigere Dachpunkte und Fasenparameter 0,024 statt 0,012; nicht behaupten, sie seien schon weich gerundet.
- B27: acht Randpunkte und zwei innere Scheitel, 0,16 bzw. 0,20 vor der Grundebene; zehn explizite Dreiecke.
  Das gibt große **symmetrische** Facetten. Kein exakt kopiertes, unregelmäßiges Muster der Nutzerbilder.
- Optionale Reliefkappe in `beveledPlate`: Randumkehr bei der Triangulation berücksichtigt; Rückseite/Fasen bleiben geschlossen.
- `centerSlopeOrigin = -0.84`: Formel `Y - centerSlopeOrigin`, also unverändert `Y + 0.84`.
- Gemessen: Außenbreite 2,0700; vorderster Punkt Z 0,6435; gesamte Bautiefe 1,0685.
  Halslänge 0,3100 und Rumpfkerntiefe 0,7200 unverändert. Modelleinheiten, keine fertigen Druckmaße.
- Gegenüber Cuirass unverändert: 56 Helmmeshes, zwölf Körpermeshes einschließlich Hals/Kragen/Kern/Gelenken,
  elf Texturkarten und die montierten Kameras. Siehe [comparison.json](../assets/helmet-bastion/comparison.json).

**Noch offen:** Ob dem Nutzer die Schulterhärte und die neue Bruststruktur gefallen. Die letzte geometrische
Korrektur ist getestet, aber nicht ausdrücklich visuell bestätigt. Gelenke sind Platzhalter; keine fertigen
Armaufnahmen, Bohrungen, Passungen, Bewegungsfreiräume oder Fertigungstoleranzen.

## Gesicherte Lieferung und Prüfung

- [Lieferindex](../assets/helmet-bastion/README.md), [Aufbau und Stil](HELM_BASTION.md),
  [Versionsbericht als vorbereitete PR-Beschreibung](versions/0.7.md).
- `assets/helmet-bastion/assembled/`: GLB, vier Ansichten, Texturen, Teileliste, Prüfmanifest.
- `assets/helmet-bastion/exploded/`: GLB, fünf Ansichten, Texturen, Teileliste, Rückimportprüfung.
- Beide Quellenmanifeste und alle Ausgabehashes gegen Quellcommit `c445de5` verifiziert.
- **59 Tests** bestanden: 46 Node, fünf IoU-Fixturetests, acht Belegsicherungsprüfungen.
  Danach **14 gezielte Tests** nach der Reviewkorrektur bestanden; Build, `./ce check`, `./ce docs` grün.
- Historische Cuirass-Tests verwenden `web/tools/fixtures/cuirass.json`, bytegleich zum Parameterstand aus
  `8bd048c`, mit festem Hash im Test. Generische Oberflächen-/Determinismustests prüfen weiterhin Bastion.
- Browserprüfung: Moduswechsel/Reset, 53 kollisionsfreie Labels, alle projizierten Meshpunkte in fünf
  Explosionskameras im Bild. GLB-Rückimport erhält alle 87 Meshes, Positionen, IDs und Transformationen.
- Kein neuer Körper-Video-IoU-Wert. Die Testausgabe `IoU=1` betrifft synthetische Fixtures, nicht Modellähnlichkeit.
- Bekannte Warnungen: Vite-Bundle >500 kB, BVH-`maxLeafSize`-Deprecation; keine neuen Fehler daraus ableiten.

Unabhängiger Richter: `claude-opus-5-5` über `./ce api`, weil zu Versionsbeginn nur 4 % Codex-Wochenrest.
Erster hoher Befund: Fixture im gelieferten Diff nicht sichtbar. Im Quellcommit enthalten und Hash-Test ergänzt;
Folgeprüfung erteilt Freigabe ohne blockierende Befunde. Niedrige Frage zum Vorzeichen von `centerSlopeOrigin`
durch identische Formel und neun bytegleiche Renderbilder vor/nach der Parametrisierung belegt.
Beide Rohantworten liegen im Lieferordner. Zwei Aufrufe, zusammen 0,122080 USD. Limits nicht verändert.
Bei Fortsetzung derselben Version nicht unnötig erneut Kontingent oder unveränderte schwere Tests abfragen.

## Lokale Ausführung

Bei Übergabe lauschte ein Node-Previewserver auf `127.0.0.1:5205` (PID 61587). Live prüfen, keinen fremden Prozess beenden.
Viewer: `http://127.0.0.1:5205/?finish=graphite&accents=light-fasteners&strips=off&headset=off&body=shoulders`.
Für Explosion ergänzen: `&exploded=1&view=assembly`.

```sh
cd /Users/ffunk/cubeescape-critic
git status --short --branch
./ce lock status
export PATH='/Users/ffunk/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/tmp/critic-helm-venv/bin:'"$PATH"
node /tmp/critic-npm/package/bin/npm-cli.js --prefix web test
node /tmp/critic-npm/package/bin/npm-cli.js --prefix web run build
./ce check
./ce docs
```

Nur wenn neue Geometrie geprüft werden muss:

```sh
./ce lock gpu -- node web/verify_renders.mjs --finish=graphite --accents=light-fasteners --strips=off --headset=off --body=shoulders --no-iou --out=/ABSOLUTER/NEUER/BELEGPFAD
./ce lock gpu -- node assets/helmet-bastion/browser-qa.mjs
```

Belegcache: `/Users/ffunk/Library/Caches/Critic/helm-bastion-20261028/`.
`delivery-assembled/` und `delivery-exploded/` sind die finalen Quellen der Repo-Lieferung.
`final/` ist entgegen seinem Namen die **verworfene plane Zwischenprobe**!
`relief/` und `exploded-relief/` sind bildgleiche Vorgänger der finalen Lieferung vor der reinen Review-/Parameterkorrektur.
Frühere Caches `helm-cuirass-20261028`, `helm-bulkhead-20261028`, `helm-assembly-20261028` nicht löschen.
Pillow/numpy sind in `/tmp/critic-helm-venv/bin/python3`; nicht im normalen System-Python voraussetzen.

## Nächste Schritte, in dieser Reihenfolge

1. Lokalen/Remote-Stand prüfen und aktuelle Vergleichsbilder plus die beiden Facettenreferenzen öffnen.
2. Dem Nutzer den tatsächlich gelieferten Volumenstand zeigen. Erneutes Zusenden der Referenzbilder nicht als
   Zustimmung verbuchen. Weitere Geometrie nur anhand konkreter Korrektur oder eines klar belegten Mangels ändern.
3. Den bereits autorisierten Repo-Abschluss vervollständigen: falls weiterhin kein PR existiert, Draft-PR
   **Head `codex/critic-0.7-bastion`, Base `codex/critic-0.6-cuirass`**, Beschreibung aus `docs/versions/0.7.md`.
   Relative Bild-/Dokulinks im PR auf den tatsächlichen GitHub-Commit auflösen. Den PR-Check am aktuellen Head prüfen.
4. Keine automatische Zusammenführung. Bei neuer Geometrie erst gezielte Tests und vergleichbare Ansichten;
   Quelle/Exporthashes erneut konsistent sichern. Kein erneutes Komplettprogramm für reine Übergabedokumentation.

Die vorige Sitzung hat sich mit dieser Datei abgekoppelt. Nicht den langen Chat forken und keine Beobachterschleife starten.
