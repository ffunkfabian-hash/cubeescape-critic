// Polygon booleans with BSP trees (after csg.js by Evan Wallace, MIT): exact plane splits in double precision on convex polygons,
// for the Scout lower helmet (0.17), whose parts are cut from prisms, boxes and lofts like Blender's exact boolean does. Chained
// three-bvh-csg results open up there (sliver triangles in float32). Polygons: { v: [[x, y, z], …], n, w } (plane n·x = w).
const EPS = 1e-7;

function plane(v) {
  const [a, b, c] = v, u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], t = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  let n = [u[1] * t[2] - u[2] * t[1], u[2] * t[0] - u[0] * t[2], u[0] * t[1] - u[1] * t[0]];
  const l = Math.hypot(...n);
  n = [n[0] / l, n[1] / l, n[2] / l];
  return { n, w: n[0] * a[0] + n[1] * a[1] + n[2] * a[2] };
}
export const polygon = v => ({ v, ...plane(v) });
const flip = p => ({ v: p.v.slice().reverse(), n: [-p.n[0], -p.n[1], -p.n[2]], w: -p.w });

// Split polygon p by plane pl into the four lists (coplanar polygons go to front or back by orientation).
function split(pl, p, cf, cb, f, b) {
  const types = p.v.map(x => { const t = pl.n[0] * x[0] + pl.n[1] * x[1] + pl.n[2] * x[2] - pl.w; return t < -EPS ? 2 : t > EPS ? 1 : 0; });
  const kind = types.reduce((a, t) => a | t, 0);
  if (kind === 0) (pl.n[0] * p.n[0] + pl.n[1] * p.n[1] + pl.n[2] * p.n[2] > 0 ? cf : cb).push(p);
  else if (kind === 1) f.push(p);
  else if (kind === 2) b.push(p);
  else {
    const fv = [], bv = [], n = p.v.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, ti = types[i], tj = types[j], vi = p.v[i], vj = p.v[j];
      if (ti !== 2) fv.push(vi);
      if (ti !== 1) bv.push(vi);
      if ((ti | tj) === 3) {
        const t = (pl.w - (pl.n[0] * vi[0] + pl.n[1] * vi[1] + pl.n[2] * vi[2])) / (pl.n[0] * (vj[0] - vi[0]) + pl.n[1] * (vj[1] - vi[1]) + pl.n[2] * (vj[2] - vi[2]));
        const m = [vi[0] + (vj[0] - vi[0]) * t, vi[1] + (vj[1] - vi[1]) * t, vi[2] + (vj[2] - vi[2]) * t];
        fv.push(m); bv.push(m);
      }
    }
    if (fv.length >= 3) f.push({ v: fv, n: p.n, w: p.w });
    if (bv.length >= 3) b.push({ v: bv, n: p.n, w: p.w });
  }
}

// BSP node; recursion replaced by explicit stacks (convex lofts make trees as deep as they have faces).
class Node {
  constructor(polys) { this.plane = null; this.front = null; this.back = null; this.polys = []; if (polys) this.build(polys); }
  build(polys) {
    const work = [[this, polys]];
    while (work.length) {
      const [node, list] = work.pop();
      if (!list.length) continue;
      if (!node.plane) node.plane = { n: list[0].n, w: list[0].w };
      const f = [], b = [];
      for (const p of list) split(node.plane, p, node.polys, node.polys, f, b);
      if (f.length) { node.front ??= new Node(); work.push([node.front, f]); }
      if (b.length) { node.back ??= new Node(); work.push([node.back, b]); }
    }
  }
  nodes() { const out = [], st = [this]; while (st.length) { const n = st.pop(); out.push(n); if (n.front) st.push(n.front); if (n.back) st.push(n.back); } return out; }
  invert() {
    for (const n of this.nodes()) {
      n.polys = n.polys.map(flip);
      n.plane = { n: [-n.plane.n[0], -n.plane.n[1], -n.plane.n[2]], w: -n.plane.w };
      [n.front, n.back] = [n.back, n.front];
    }
  }
  // Parts of polys outside this solid (in front of every leaf).
  clipPolygons(polys) {
    const out = [], st = [[this, polys]];
    while (st.length) {
      const [node, list] = st.pop();
      if (!node.plane) { out.push(...list); continue; }
      const f = [], b = [];
      for (const p of list) split(node.plane, p, f, b, f, b);
      if (node.front) st.push([node.front, f]); else out.push(...f);
      if (node.back) st.push([node.back, b]);
    }
    return out;
  }
  clipTo(bsp) { for (const n of this.nodes()) n.polys = bsp.clipPolygons(n.polys); }
  all() { return this.nodes().flatMap(n => n.polys); }
}

export function union(A, B) {
  const a = new Node(A), b = new Node(B);
  a.clipTo(b); b.clipTo(a); b.invert(); b.clipTo(a); b.invert(); a.build(b.all());
  return a.all();
}
export function subtract(A, B) {
  const a = new Node(A), b = new Node(B);
  a.invert(); a.clipTo(b); b.clipTo(a); b.invert(); b.clipTo(a); b.invert(); a.build(b.all()); a.invert();
  return a.all();
}
export function intersect(A, B) {
  const a = new Node(A), b = new Node(B);
  a.invert(); b.clipTo(a); b.invert(); a.clipTo(b); b.clipTo(a); a.build(b.all()); a.invert();
  return a.all();
}
