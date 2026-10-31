// Screen-space labels stay outside the exported model. Every mesh is listed in its stable part family.
import * as THREE from 'three';
export function createAssemblyLabels() {
  const layer = document.createElement('div'); layer.id = 'assembly-labels'; layer.hidden = true; // shown by update()
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); layer.appendChild(svg);
  const title = document.createElement('div'); title.className = 'assembly-heading';
  title.textContent = 'EXPLOSIONSANSICHT · BAUTEILE'; layer.appendChild(title);
  const note = document.createElement('div'); note.className = 'assembly-footnote';
  note.textContent = 'H = Helmbereich · A/B = Seite · F = Schraubensatz · P = Präsentation · Abstände nur zur Darstellung'; layer.appendChild(note);
  document.body.appendChild(layer);
  const panel = document.createElement('aside'); panel.id = 'assembly-parts'; panel.hidden = true; document.body.appendChild(panel);
  let groups = [], labels = [], leaders = [];
  return {
    setGroups(value) {
      groups = value;
      labels.forEach(x => x.remove()); svg.replaceChildren(); panel.replaceChildren();
      leaders = groups.map(() => {
        const path = document.createElementNS(svg.namespaceURI, 'path');
        const dot = document.createElementNS(svg.namespaceURI, 'circle'); dot.setAttribute('r', 2.5);
        svg.append(path, dot); return { path, dot };
      });
      const heading = document.createElement('h2'); heading.textContent = 'Bauteile und Anschlüsse'; panel.appendChild(heading);
      const close = document.createElement('button'); close.textContent = 'Schließen'; close.onclick = () => { panel.hidden = true; }; panel.appendChild(close);
      labels = groups.map(group => {
        const label = document.createElement('div'); label.className = 'assembly-label';
        const id = document.createElement('b'); id.textContent = group.id;
        const text = document.createElement('span'); text.textContent = group.label;
        label.append(id, text); label.title = group.connection; layer.appendChild(label);
        const section = document.createElement('details'), summary = document.createElement('summary');
        summary.textContent = `${group.id} · ${group.label} (${group.meshes.length} Meshes)`; section.appendChild(summary);
        const desc = document.createElement('p'); desc.textContent = group.connection; section.appendChild(desc);
        const list = document.createElement('ul');
        for (const mesh of group.meshes) { const row = document.createElement('li'); row.textContent = mesh.path; list.appendChild(row); }
        section.appendChild(list); panel.appendChild(section);
        return label;
      });
    },
    togglePanel() { panel.hidden = !panel.hidden; },
    update(camera, model, show) {
      layer.hidden = !show;
      if (!show) return;
      model.updateMatrixWorld(true); camera.updateMatrixWorld(true);
      const width = layer.clientWidth || innerWidth, height = layer.clientHeight || innerHeight, labelWidth = Math.min(234, width * .22), margin = 16;
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      const points = groups.map((g,i) => {
        const projected = new THREE.Vector3(...g.center).applyMatrix4(model.matrixWorld).project(camera);
        return { i, x:(projected.x+1)*width/2, y:(1-projected.y)*height/2, side:projected.x<0?-1:1 };
      });
      for (const side of [-1,1]) {
        const sorted = points.filter(p => p.side===side).sort((a,b)=>a.y-b.y);
        const top = 66, bottom = height-78, gap = Math.min(31,(bottom-top)/Math.max(1,sorted.length-1));
        let previous = top-gap;
        for (let j=0;j<sorted.length;j++) {
          const point = sorted[j], maximum=bottom-(sorted.length-j-1)*gap;
          point.ly=Math.max(previous+gap,Math.min(maximum,Math.max(top,point.y))); previous=point.ly;
        }
        for (const point of sorted) {
          const label=labels[point.i], x=side<0?margin:width-margin-labelWidth;
          label.style.cssText=`left:${x}px;top:${point.ly-12}px;width:${labelWidth}px;height:${Math.min(24,gap-1)}px;font-size:${gap<24?9:11}px;padding:2px 7px`;
          const { path, dot } = leaders[point.i];
          const anchor=side<0?x+labelWidth:x;
          path.setAttribute('d',`M ${point.x} ${point.y} L ${anchor+(side<0?12:-12)} ${point.ly} L ${anchor} ${point.ly}`);
          dot.setAttribute('cx',point.x);dot.setAttribute('cy',point.y);
        }
      }
    },
  };
}
