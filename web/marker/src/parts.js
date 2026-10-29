// Part ids for markers: the stable ids of docs/HELM_TEILE.md (H01–H21, F01–F03, P01) and the body study B01–B31,
// resolved from the hit mesh with the same classification the assembly view uses (src/assembly.js).
import { ASSEMBLY_PARTS, BODY_LABELS, assemblyPartId } from '../../src/assembly.js';

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
