// Presentation changes operate after construction. Source geometry and the assembled helmet stay intact.
import * as THREE from 'three';

const part = (label, offset, connection) => ({ label, offset, connection });
export const ASSEMBLY_PARTS = {
  H01: part('Schädelhaube', [0, 0.82, 0], 'Verdeckte Auflage und Befestigung an H09/H03 konstruieren.'),
  H02: part('Brauenkante', [0, 0.30, 0.68], 'Übergang zur Augenmaske; getrennte schmale Kante.'),
  H03: part('Augenmaske', [0, 0.02, 0.72], 'Maskenauflage und lösbare Anschlüsse zum hellen Rahmen.'),
  H04A: part('Auge A', [-0.15, 0.05, 1.12], 'Leuchteinsatz, Halter und elektrische Durchführung fehlen.'),
  H04B: part('Auge B', [0.15, 0.05, 1.12], 'Leuchteinsatz, Halter und elektrische Durchführung fehlen.'),
  H05A: part('Wange A', [-0.48, -0.16, 0.73], 'Fugen und Befestigung zur Augenmaske und zum Kiefer.'),
  H05B: part('Wange B', [0.48, -0.16, 0.73], 'Fugen und Befestigung zur Augenmaske und zum Kiefer.'),
  H06: part('Mitteleinsatz / Schienen', [0, -0.42, 1.05], 'Einsatz und Schienen sind eigene Meshes; Haltepunkte offen.'),
  H07: part('Kinnblock', [0, -0.72, 0.72], 'Seitliche Verbindung zu den Kieferstücken konstruieren.'),
  H08A: part('Kiefer A', [-0.50, -0.55, 0.24], 'Anschluss an Kinn und Seitenrahmen.'),
  H08B: part('Kiefer B', [0.50, -0.55, 0.24], 'Anschluss an Kinn und Seitenrahmen.'),
  H09: part('Seiten- / Heckgehäuse', [0, 0.0, -0.65], 'Träger für Haube, Rahmen und Anbauten; Wandstärken offen.'),
  H10: part('Nacken- / Seitenrahmen', [0, -0.55, -0.18], 'Auflage und Verschraubung des hellen Gehäuses.'),
  H11A: part('Einlagen A', [-0.80, -0.40, 0.12], 'Einlagen und Taschenböden; Aufnahme im Rahmen konstruieren.'),
  H11B: part('Einlagen B', [0.80, -0.40, 0.12], 'Einlagen und Taschenböden; Aufnahme im Rahmen konstruieren.'),
  H12: part('Funkmuschel A', [-1.15, 0.08, -0.05], 'Gehäuse, Polster und Bedienungen; interne Befestigungen offen.'),
  H13: part('Funkmuschel B', [1.15, 0.08, -0.05], 'Spiegelbaugruppe zu A; interne Befestigungen offen.'),
  H14A: part('Maskenhalter A', [-0.76, 0.22, 0.38], 'Gelenk- und Schraubverbindung an der Maske.'),
  H14B: part('Maskenhalter B', [0.76, 0.22, 0.38], 'Gelenk- und Schraubverbindung an der Maske.'),
  H15: part('Kopfhörerband', [0, 1.35, -0.08], 'Band, Mittelstreifen und Klemmen; Verbindung zu Seitenhaltern.'),
  H15A: part('Kopfhörerhalter A', [-1.12, 0.66, -0.05], 'Bügelenden, Gelenk und Drahtauflagen ausarbeiten.'),
  H15B: part('Kopfhörerhalter B', [1.12, 0.66, -0.05], 'Bügelenden, Gelenk und Drahtauflagen ausarbeiten.'),
  H16: part('Hinterkopfmodul', [0, 0.30, -1.24], 'Montageplatte, Kasten und Steckverbinder; Kabeldurchführungen offen.'),
  H17A: part('Antenne A', [-1.35, 0.65, -0.33], 'Antennenfuß mit lösbarem Anschluss.'),
  H17B: part('Antenne B', [1.35, 0.65, -0.33], 'Antennenfuß mit lösbarem Anschluss.'),
  H18A: part('Kabel / Stecker A', [-1.10, -0.58, -0.14], 'Kabelenden, Zugentlastung und Halteklammern.'),
  H18B: part('Kabel / Stecker B', [1.10, -0.58, -0.14], 'Kabelenden, Zugentlastung und Halteklammern.'),
  H19: part('Halsanschluss', [0, -1.03, -0.10], 'Übergang zu flexiblem Hals; Bewegungsfreiraum später prüfen.'),
  H20: part('Stirn- / Scheitelblende A', [-0.42, 0.40, 0.35], 'Dünne separate Schale; verdeckte Auflage und Befestigung offen.'),
  H21: part('Stirn- / Scheitelblende B', [0.42, 0.40, 0.35], 'Dünne separate Schale; verdeckte Auflage und Befestigung offen.'),
  F01: part('Schraubensatz oben', [-0.64, 0.55, 1.13], 'Visualisierte Köpfe; keine konstruierten Gewinde / Bohrungen.'),
  F02: part('Schraubensatz Kinn', [0.55, -0.92, 1.02], 'Visualisierte Köpfe; keine konstruierten Gewinde / Bohrungen.'),
  F03: part('Schraubensatz Rahmen', [-0.56, -0.85, -0.12], 'Visualisierte Köpfe; keine konstruierten Gewinde / Bohrungen.'),
  P01: part('Präsentationshals', [0, -1.35, -0.08], 'Bisheriger Darstellungsunterbau; kein konstruiertes Helmbauteil.'),
};

export function configureHelmetAssembly(model, options) {
  const remove = object => {
    if (!object) return;
    object.removeFromParent();
    object.traverse(child => child.geometry?.dispose());
  };
  if (options.headset === 'off') {
    remove(model.getObjectByName('LeftEar_Cap'));
    remove(model.getObjectByName('MirroredComms_B'));
    const comms = model.getObjectByName('RightComms_And_Tube');
    for (const child of [...(comms?.children ?? [])]) if (child.name !== 'BackBox_Group') remove(child);
  }
  if (options.body === 'shoulders') remove(model.getObjectByName('Neck'));
  return model;
}

function category(mesh) {
  if (mesh.userData.partId && (ASSEMBLY_PARTS[mesh.userData.partId] || /^[BL]/.test(mesh.userData.partId))) return mesh.userData.partId;
  const ancestors = [];
  for (let o = mesh; o; o = o.parent) ancestors.push(o.name);
  const has = name => ancestors.includes(name);
  const n = mesh.name;
  if (has('BodyStudy')) return 'L00';
  if (has('Neck')) return 'P01';
  if (has('BackBox_Group')) return 'H16';
  if (has('Hinge_R')) return 'H14A';
  if (has('Hinge_L')) return 'H14B';
  if (has('LeftEar_Cap')) return 'H15';
  const mirrored = has('MirroredComms_B');
  if (mirrored || has('RightComms_And_Tube')) {
    const side = mirrored ? 'B' : 'A';
    if (has(mirrored ? 'Antenna_B' : 'Antenna')) return `H17${side}`;
    if (has(mirrored ? 'Hose_B' : 'Hose')) return `H18${side}`;
    if (n.startsWith('Yoke') || mesh.userData.assemblyRole === 'headset-bail') return `H15${side}`;
    return mirrored ? 'H13' : 'H12';
  }
  if (/^(CollarSlot|CollarPanel|CollarSocket|Jaw_Insert)/.test(n)) return n.endsWith('_R') ? 'H11A' : 'H11B';
  if (has('CollarDipPlate')) return 'H10';
  const names = { Crown:'H01', Brim:'H02', Shell:'H03', Visor_R:'H04A', Visor_L:'H04B', Cheek_R:'H05A', Cheek_L:'H05B',
    Mouth_Insert:'H06', MouthRail_R:'H06', MouthRail_L:'H06', MaskGap:'H06', Chin:'H07', Jaw_R:'H08A', Jaw_L:'H08B',
    Core:'H09', RearPanel:'H09', Collar:'H10', NeckRing:'H19', ForeheadPlate_R:'H20', ForeheadPlate_L:'H21',
    Screws_Upper:'F01', Screws_Chin:'F02', Screws_Side:'F03' };
  if (names[n]) return names[n];
  throw new Error(`Unclassified assembly mesh ${ancestors.reverse().join('/')}`);
}

const BODY_LABELS = {
  B01:'Flexibler Hals', B02:'Halsrippen', B03:'Kragen vorne', B04:'Kragen hinten', B05:'Oberkörperbasis',
  B06:'Schulterbasis A', B07:'Schulter vorne A', B08:'Schulter hinten A', B09:'Schulterbasis B', B10:'Schulter vorne B', B11:'Schulter hinten B',
  B12:'Brustplatte A', B13:'Brustplatte B', B14:'Brusteinsatz A', B15:'Brusteinsatz B', B16:'Rückenplatte A', B17:'Rückenplatte B', B18:'Rückeneinsatz',
  B19:'Brustbefestigung A', B20:'Brustbefestigung B', B21:'Rückenbefestigung A', B22:'Rückenbefestigung B',
  B23:'Schulterlamelle A', B24:'Schulterlamelle B', B25:'Schultergelenk A', B26:'Schultergelenk B',
  B27:'Brustmitte', B28:'Flankenpanzer A', B29:'Flankenpanzer B', B30:'Schulterdach A', B31:'Schulterdach B',
};

export function assemblyInventory(model) {
  model.updateMatrixWorld(true);
  const entries = [];
  const visit = (object, path) => {
    if (object.isMesh) {
      const id = category(object), box = new THREE.Box3().setFromObject(object, true);
      const center = box.getCenter(new THREE.Vector3());
      const bodyPart = id.startsWith('B');
      const info = ASSEMBLY_PARTS[id] ?? { label: BODY_LABELS[id] ?? object.name.replaceAll('_', ' '),
        offset: [Math.sign(center.x) * 0.65, -0.6, Math.sign(center.z) * 0.42], connection: 'Schulter-/Halsstudie: Aufnahmen und Montage noch konstruieren.' };
      entries.push({ id, label: info.label, connection: info.connection, path, name: object.name || path.split('/').at(-1),
        mesh: object, center: center.toArray(), offset: info.offset, presentationOnly: id === 'P01', study: bodyPart });
    }
    const occurrences = new Map();
    for (const child of object.children) {
      const name = child.name || 'Detail', ordinal = occurrences.get(name) ?? 0;
      occurrences.set(name, ordinal + 1); visit(child, `${path}/${name}[${ordinal}]`);
    }
  };
  visit(model, model.name);
  return entries;
}

export function createExplodedAssembly(model, amount) {
  if (!Number.isFinite(amount) || amount < 0 || amount > 1) throw new Error('Exploded amount must be between 0 and 1');
  const entries = assemblyInventory(model), root = new THREE.Group();
  root.name = 'SciFiHelmet';
  const counts = new Map(), totals = new Map();
  for (const entry of entries) totals.set(entry.id, (totals.get(entry.id) ?? 0) + 1);
  for (const entry of entries) {
    const mesh = entry.mesh.clone(false), index = counts.get(entry.id) ?? 0;
    counts.set(entry.id, index + 1);
    mesh.matrix.copy(entry.mesh.matrixWorld).decompose(mesh.position, mesh.quaternion, mesh.scale);
    const offset = new THREE.Vector3(...entry.offset);
    // Separate constituent meshes a little as well; the label identifies their parent part family.
    if (totals.get(entry.id) > 1) offset.add(new THREE.Vector3(0.025 * index, 0.024 * index, 0.045 * index));
    mesh.position.addScaledVector(offset, amount);
    mesh.name = `${entry.id}_${entry.name}_${index + 1}`;
    mesh.userData = { ...mesh.userData, partId: entry.id, partLabel: entry.label, sourcePath: entry.path,
      connectionNote: entry.connection, presentationOnly: entry.presentationOnly, assembledMatrix: entry.mesh.matrixWorld.toArray(), explosionOffset: offset.toArray() };
    root.add(mesh);
  }
  root.userData.presentation = 'Exploded assembly: offsets illustrate grouping, not a validated disassembly path';
  return root;
}

export function assemblyDescription(model) {
  const groups = new Map();
  for (const entry of assemblyInventory(model)) {
    if (!groups.has(entry.id)) groups.set(entry.id, { id: entry.id, label: entry.label, connection: entry.connection, meshes: [], center: [0,0,0] });
    const group = groups.get(entry.id); group.meshes.push({ name: entry.name, path: entry.path });
    entry.center.forEach((n,i) => { group.center[i] += n; });
  }
  // Labels follow subsequent model motion; store their anchors in model-local space.
  const toLocal = model.matrixWorld.clone().invert();
  return [...groups.values()].map(g => ({ ...g,
    center: new THREE.Vector3(...g.center.map(x => x / g.meshes.length)).applyMatrix4(toLocal).toArray() }));
}

// Shared with the marker page (web/marker): part id of one mesh and the body labels.
export { category as assemblyPartId, BODY_LABELS };
