# Assembly 0.5 – Aufbau, Explosionsansicht und Oberkörper

**Historischer Körperstand 0.5/0.5.1.** Die aktuelle Form und Teilezahl B01–B26 stehen in [Cuirass 0.6](HELM_CUIRASS.md); Bedienung und Explosionsmechanik bleiben gültig.

Arbeitsstand vom 28.10.2026. Quelle bleibt der Three.js-Generator. Dies ist eine technische Beschreibung,
kein zusätzlicher Auftrag. Der Helm bleibt an das Video gebunden; der Oberkörper ist ein eigener Formversuch.

## Bedienung und Reproduktion

Im Viewer rechts oben unter **Aufbau und Varianten**: Kopfhörer, Körper, Explosionsabstand und
**Bauteile / Anschlüsse**. Die Teileliste nennt auch die enthaltenen Einzelmeshes und offene Verbindungen.
Alle Optionen sind kombinierbar und bleiben beim Zurücksetzen der Formparameter erhalten.

| Option | Wirkung | Standard |
|---|---|---|
| `headset=on\|off` | Beide Funkmuscheln, Polster, Bedienungen, Antennen, Kabel, Halter und Kopfbügel gemeinsam | `on` |
| `body=none\|shoulders\|legacy` | Helm allein, neue Hals-/Schulterstudie oder ältere Ganzrumpfstudie | `none` |
| `exploded=0..1` | Montierter Zustand bis zur vollständigen Explosionsdarstellung | `0` |
| `labels=0` | Beschriftung der Explosionsansicht ausblenden, nur Darstellung | Beschriftung an |

`body=1` bleibt Alias für die ältere Studie. Die neue Studie verwendet ausdrücklich `body=shoulders`.
Finish, Akzente und `strips=on|off` bleiben unabhängige Optionen. Keine neue Materialwahl wird zum Standard.
Beispiel: `?finish=graphite&accents=light-fasteners&strips=off&headset=off&body=shoulders`.
Für die Explosionsübersicht: `?finish=metal&accents=white-strips&exploded=1&view=assembly`.

```sh
npm --prefix web ci
npm --prefix web test
npm --prefix web run build
./ce check
./ce lock status
./ce lock gpu -- node web/verify_renders.mjs --finish=graphite --accents=light-fasteners --strips=off --headset=off --body=shoulders --no-iou --out=/ABSOLUTER/BELEGPFAD/shoulders
./ce lock gpu -- node web/verify_renders.mjs --finish=metal --accents=white-strips --exploded=1 --no-iou --out=/ABSOLUTER/BELEGPFAD/exploded
```

Der vorhandene Prüflauf startet seinen eigenen Server. Er schreibt GLB, echte Texturkarten, Teileliste
`assembly.json`, Ansichten und `verification.json`. Nur `status: passed` gilt als abgeschlossen.
Körper und Explosionsansicht erfordern `--no-iou`, da ihre Kameras und Silhouetten keine Helm-Videomessung erlauben.
Die Renderquelle wird vor und nach dem Lauf gehasht. [Lieferstände und Quellen](../assets/helmet-assembly/README.md).

## Datenfluss und Teilelogik

`helmet.js` erzeugt den unveränderten Helm. `configureHelmetAssembly` entfernt optional die vollständige
Headsetfamilie (40 Meshes). Maskenhalter H14 und der einmalige Hinterkopfkasten H16 bleiben erhalten.
Bei `body=shoulders` entfällt außerdem der alte Präsentationshals mit sechs Meshes.
Die Finish-Zuordnung erfolgt zuerst am Helm; danach erhält die neue Studie dieselben ausgewählten Materialien.
So bleibt die Oberkörperbasis tatsächlich Graphit beziehungsweise Metall und erhält nicht versehentlich
das unveränderte Zubehörmaterial.

`assemblyInventory` ordnet jedes Mesh einer Teilekennung zu und erzeugt einen eindeutigen Hierarchiepfad.
Die bestehenden H01–H21 bleiben erhalten; A/B bezeichnet getrennte Seiten, F01–F03 bestehende Schraubensätze,
P01 den bisherigen Präsentationshals. Die zwei vorher namenlosen Drahtbügel tragen zusätzlich
`userData.assemblyRole=headset-bail`; ihre Geometrie und Namen ändern sich nicht.

`createExplodedAssembly` kopiert die Meshknoten mit ihren Welttransformationen und verschiebt sie anhand
deterministischer Offsets aus `assembly.js`. Geometrie und Materialien werden geteilt, nicht verformt.
Bei mehrteiligen Gruppen fächert ein kleiner zusätzlicher Offset die enthaltenen Meshes auf.
Im GLB bleiben Herkunftspfad, Teile-ID, montierte Matrix und Explosionsoffset als Metadaten erhalten.
Der Prüflauf importiert das explodierte GLB erneut und vergleicht Geometrie, IDs und Welttransformationen.

Die Bildbeschriftung fasst die Meshes zu 34 lesbaren Helmgruppen zusammen; die aufklappbare Teileliste
nennt jedes Mesh einzeln. SVG-Beschriftungen liegen außerhalb der 3D-Szene und werden nicht als Geometrie
exportiert. Silhouettenbilder enthalten keine Beschriftung. Leitlinien werden wiederverwendet statt pro Bild neu angelegt.

| Konfiguration | Meshes |
|---|---:|
| Helm mit Blenden und Headset | 104 |
| Helm ohne Blenden, mit Headset | 102 |
| Helm ohne Headset, mit / ohne Blenden | 64 / 62 |
| Neue Studie ohne Headset und ohne Blenden | 78 = 102 − 40 − 6 + 22 |
| Neue Studie mit Headset und ohne Blenden | 118 = 102 − 6 + 22 |

## Neue Körperteile B01–B22

Alle 22 Körpermeshes sind getrennte geschlossene Körper mit festen IDs, positiven Volumina und endlichen
UVs/Normalen. Sie entstehen aus Parametern in `shoulderStudyParams.json`, ohne Zufall oder Fremdmesh.

| IDs | Bauteile |
|---|---|
| B01–B02 | Flexibler Hals und Halsrippen |
| B03–B04 | Vorderer und hinterer Kragen |
| B05 | Dunkle Oberkörperbasis |
| B06–B08 | Schulterbasis A, vordere und hintere weiße Schulterkappe A |
| B09–B11 | Spiegelbildliche Schulterteile B |
| B12–B15 | Zwei helle Brustplatten und zwei dunkle Brusteinsätze |
| B16–B18 | Zwei dunkle Rückenplatten und mittlerer heller Rückeneinsatz |
| B19–B22 | Je zwei Brust- und Rückenbefestigungen |

Koordinaten: +Y oben, +Z vorne, A = −X. Maße sind **Modelleinheiten**, keine Millimeter.
Geschlossene Platten entstehen aus Umrissringen mit Vorderseite, Rückseite, Seitenwand und schmaler Fase.
Die Schulterkappen wurden in 0.5.0 vor der Wölbung zweimal unterteilt. 0.5.1 nutzt den unverfeinerten geschlossenen
Plattenaufbau für große Facetten. Projektion entlang der dominanten Flächennormale erzeugt deterministische UVs.
Es werden die vorhandenen gebrochen weißen Schalen, dunklen Zwischenlagen und Befestigungsmaterialien genutzt.

## Rückmeldungen und Formentscheidung

1. Erste Studie: Halslänge 0,49; Breite 1,97. Nutzer: Hals zu lang, Schultern zu schmal und zu wenig stämmig.
2. Oberkörper um 0,18 angehoben, Halsoberkante unverändert bei −0,34: Halslänge nun 0,31.
   Breite auf 2,3198 erweitert (+17,8 %), Brust/Rücken um Faktor 1,1 verbreitert. Kragen mit flacher vorderer Kerbe.
3. Nutzer wünscht mehr Schultermasse nach oben: zusätzlicher Kappenbogen 0,23, weiße Stärke 0,10,
   dunkle Unterlage 0,215. Gemessene Oberkante steigt um etwa 0,15 auf Y ≈ −0,462.
   Außenkappen reichen weiter nach unten; Breite, Hals und Brustposition bleiben wie in Schritt 2.

4. **Patch 0.5.1:** Nutzer: Rumpf in der Tiefe zu schmal, Schultern zu hochgezogen, kantiger gewünscht.
   Kerntiefe 0,53 → 0,72 (+35,8 %); Brust-/Rückenlage +0,308/−0,302 → +0,415/−0,409.
   Äußerer Kragenradius in Z 0,365 → 0,425; Halsaufnahme bleibt gleich. Schulterumrisse in Z rund 22 % tiefer.
   Bogen 0,23 → 0,04, Neigung 0,31 → 0,16, äußerer Abfall 0,14 → 0,085, Unterteilungen 2 → 0.
   Schulteroberkante nun Y ≈ −0,597 (rund 0,135 niedriger), Breite 2,3198 und Schalendicken unverändert.
   Alle 22 IDs erhalten; B01/B02 und die 56 enthaltenen Helm-Meshes geometrisch unverändert.

Die statische Oberflächenprüfung der vier weißen Kappen gegen den Helm ohne Headset **im Stand 0.5.0** ergab
mindestens 0,3018 Abstand; die nächstgelegenen Helmteile sind Kiefer und Halsring.
Das ist eine Prüfung der Ruhepose, keine Freigabe für Kopfbewegung oder Armheben.

**Visueller Eindruck 0.5.1 nach Vier-Ansichten-Prüfung:** Der tiefere Rumpf wirkt seitlich tragfähiger; die niedrigeren
Kappen lesen sich als kantige Schutzplatten mit breiten Dachflächen. Der kurze gerippte Hals bleibt erhalten.
Die dunkle Unterlage macht die Schalendicke deutlich; seitlich bleibt die Teilung in Vorder- und Hinterkappe lesbar.
Der Rücken ist bewusst dunkler als die Brust und erhält nur einen kleinen hellen Mitteleinsatz.
Ohne Oberarme wirken die äußeren Unterlagen noch abstrakt: echte Schultergelenke und Armanschlüsse wären der nächste
Konstruktionsschritt, keine bereits geprüfte Eigenschaft dieser Studie. Die endgültige Nutzerbewertung steht aus.

## Ergänzende Titan-Referenz und Herkunft

Der Nutzer verwies auf `cubeescape-reference`. Die passende Recherche liegt am 28.10.2026 im Worktree
`/Users/ffunk/.codex/worktrees/titan-style/cubeescape-reference`, Branch `codex/ref-0.29-bulwark`,
Basis `4fa6f277dc45a4f631a1e8c8e6852a2ef60e9cb1`. Die beiden ausgewerteten Dateien sind zu diesem Zeitpunkt
**noch uncommittet**; der Basiscommit allein reproduziert ihren Inhalt nicht.

- `docs/titan-robotik.md`: SHA-256 `2f36f770fda426f21fb19d16d3b73f608f7a5617f8a67e796366e3f86562cf76`.
- `data/titan-robotik.json`: SHA-256 `6f1fe420d14c3e8aada0a6771e38c90437629c99deaf7e70cb591be68a611c4e`.
- Gelesen: Status/Methode Zeilen 1–23, Saint-14/Thunderhead/Parade 64–74, Auswahlhilfe 207–217,
  vorläufiger Stilleitfaden und Bauteilübersetzung 219–265.

Die Recherche dokumentiert gerundete geschichtete Schalen bei Legacy’s Oath und Saint-14 sowie große
getrennte Gehäuse bei Mechanized Protector. Ihre Entwurfshilfen empfehlen große lesbare Massen,
dunkle Bewegungszonen und eine begrenzte Zahl von Materialrollen. Sie liefert ausdrücklich **keine vermessene
allgemeine Titan-Schulterbreite**. Diese Aussagen werden hier als ergänzende Gestaltungsanregung genutzt;
die konkreten Zahlen oben stammen aus unserem Modell und dem Nutzerfeedback.
Die zusätzliche Schulterwölbung war vor dem Fund bereits umgesetzt; die Recherche unterstützt diese Richtung,
sie ist keine nachträglich behauptete Maßquelle. Keine Destiny-Geometrie, Logos oder Texturen übernommen.

## Noch zu konstruieren

Die Explosionsansicht zeigt Anordnung und Baugruppen, keine validierte Demontagereihenfolge.
Schrauben sind bislang visualisierte Köpfe; einige bestehende Schrauben und Halsrippen sind gemeinsam
in einem Mesh zusammengefasst. Vollständige Einzelteilfertigung erfordert deren spätere Aufteilung,
reale Wandstärken, Bohrungen, Toleranzen und Gewinde. Die 22 neuen Körpermeshes bleiben einzeln vorhanden.
Offen sind insbesondere Haubenauflage, Maskenbefestigung, Headsetgelenke, Kabelzugentlastung,
Leuchteinsätze, Halslager, Schulteraufnahmen und Bewegungsfreiräume. Arme, Hände, Unterkörper und Rig fehlen.

Der statische Formversuch ist reproduzierbar; Fertigung, Tragbarkeit und Animation sind damit noch nicht geprüft.
