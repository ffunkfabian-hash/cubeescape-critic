// Part ids for markers: the stable ids of docs/HELM_TEILE.md (H01–H21, F01–F03, P01) and the body study B01–B31,
// resolved from the hit mesh with the same classification the assembly view uses (src/assembly.js).
import { ASSEMBLY_PARTS, assemblyPartId } from '../../src/assembly.js';

// Part names of the former body studies 0.7/0.9 (removed from the viewer in 0.12); the marker sheet keeps them for its markings.
const BODY_LABELS = {
  B01:'Flexibler Hals', B02:'Halsrippen', B03:'Kragen vorne', B04:'Kragen hinten', B05:'Oberkörperbasis',
  B06:'Schulterbasis A', B07:'Schulter vorne A', B08:'Schulter hinten A', B09:'Schulterbasis B', B10:'Schulter vorne B', B11:'Schulter hinten B',
  B12:'Brustplatte A', B13:'Brustplatte B', B14:'Brusteinsatz A', B15:'Brusteinsatz B', B16:'Rückenplatte A', B17:'Rückenplatte B', B18:'Rückeneinsatz',
  B19:'Brustbefestigung A', B20:'Brustbefestigung B', B21:'Rückenbefestigung A', B22:'Rückenbefestigung B',
  B23:'Schulterlamelle A', B24:'Schulterlamelle B', B25:'Schultergelenk A', B26:'Schultergelenk B',
  B27:'Brustmitte', B28:'Flankenpanzer A', B29:'Flankenpanzer B', B30:'Schulterdach A', B31:'Schulterdach B',
  B32:'Bauchlamelle 1', B33:'Bauchlamelle 2', B34:'Bauchlamelle 3', B35:'Beckengurt', B36:'Becken-/Taillenkern',
  B37:'Hüftplatte A', B38:'Hüftplatte B', B39:'Oberarm A', B40:'Oberarm B', B41:'Ellbogen A', B42:'Ellbogen B',
  B43:'Unterarm A', B44:'Unterarm B', B45:'Hand A', B46:'Hand B', B47:'Hüftgelenk A', B48:'Hüftgelenk B',
  B49:'Oberschenkel A', B50:'Oberschenkel B', B51:'Knie A', B52:'Knie B', B53:'Knieschutz A', B54:'Knieschutz B',
  B55:'Unterschenkel A', B56:'Unterschenkel B', B57:'Fuß A', B58:'Fuß B',
};

const base = (id) => (/^H\d\d[AB]$/.test(id) ? id.slice(0, 3) : id);
const plain = (label) => label.replace(/ [AB]$/, '');

export const PARTS = [];
for (const [id, p] of Object.entries(ASSEMBLY_PARTS)) {
  const b = base(id);
  if (!PARTS.some((q) => q.id === b)) PARTS.push({ id: b, name: b === id ? p.label : plain(p.label) });
}
for (const [id, label] of Object.entries(BODY_LABELS)) PARTS.push({ id, name: label });
PARTS.sort((a, b) => a.id.localeCompare(b.id, 'de', { numeric: true }));

// Part under a hit: the first object up the hierarchy that the assembly classification knows.
export function partOf(object) {
  for (let o = object; o; o = o.parent) {
    try {
      const id = assemblyPartId(o);
      if (id === 'L00') continue;
      return PARTS.find((p) => p.id === base(id)) || { id, name: id };
    } catch {
      /* not a classified mesh: try the parent */
    }
  }
  return null;
}

// Sides as in docs/HELM_TEILE.md: A = −X (left in the front view), B = +X (right in the front view).
export function sideOf(point) {
  if (point.x < -0.03) return 'A';
  if (point.x > 0.03) return 'B';
  return 'Mitte';
}

export const STELLEN = ['Oberkante', 'Unterkante', 'Vorderkante', 'Hinterkante', 'Ecke', 'Fläche außen', 'Boden', 'Fuge / Spalt',
  'Übergang zum Nachbarteil', 'ganzes Teil'];
export const RICHTUNGEN = ['vorn', 'hinten', 'oben', 'unten', 'außen', 'innen', 'schmaler', 'breiter', 'höher', 'flacher', 'runder',
  'kantiger', 'schließen', 'entfernen', 'hinzufügen'];
export const BETRAEGE = ['ein wenig', 'deutlich', 'bündig mit Nachbarteil', 'in cm'];
