"""Skin mixer for the robot bodies (0.13 "Skins"): one texture set per skin in the body's fixed UV template.

Inputs are the maps of blender/robot/bake_maps.py (position, normal, object and role per texel, AO) and the recipes in
blender/robot/skins.json. A recipe is a list of layers applied in order to every covered texel; each layer selects texels by
role, part id (fnmatch), assembly, side or facing direction and changes base colour, roughness, metalness and/or emission:

  fill       solid colour                      band       distance to the nearest plate edge in [from_mm, to_mm]
  wear       chipped edges (edge distance × noise)        dirt       cavities from the baked AO, broken up by noise
  scratches  fine stretched streaks            stripes    irregular stripes along an axis (part-local, noise-warped)
  diamond    outline |u| + |v| = r on a part   chevron    repeated V lines on a part
  emblem     ring with rays at a part centre   filigree   thin noise iso-lines (gold scrollwork) inside an edge band

The edge distance is measured in the texture: texels where the shading normal turns by more than EDGE_DEG between neighbours
(sharp edges, bevel strips) and island borders without a matching surface across the seam are edges; every island gets its own
Euclidean distance transform, scaled by the uniform texel density (mm per pixel) of the template.

Output per skin: basecolor.jpg (sRGB), orm.png (R ambient occlusion, G roughness, B metalness; glTF order) and emissive.png,
gaps between islands filled with the nearest island colour (no dark seams in mip levels). Also template.png: islands by assembly
with edges, the sheet to paint on by hand.

  uv run --no-project --with-requirements blender/robot/requirements.txt python -I blender/robot/skins.py \\
    --maps runs/robot/maps/waechter --body waechter [--skin rost] [--size 4096]
"""
import argparse
import fnmatch
import json
import os
import sys
import time

import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.spatial import cKDTree

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
EDGE_DEG = 20.0          # normal turn between neighbouring texels that counts as an edge (bevel strips turn ≥ 30° per texel)
FAR_MM = 1000.0          # edge distance of an island without any edge
ORM_SIZE = 2048          # roughness/metal/AO are smooth enough for half resolution
ASM_COLORS = {'head': '#D9825B', 'upper_body': '#5B8FD9', 'lower_body': '#8E6BD1', 'arms': '#59B97A', 'legs': '#D1B85A'}


def log(msg, t0=[time.time()]):
    print(f'[skins {time.time() - t0[0]:6.1f}s] {msg}', flush=True)


def srgb_to_linear(c):
    c = np.asarray(c, dtype=np.float32)
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def linear_to_srgb(c):
    c = np.clip(c, 0.0, 1.0)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)


def hex_linear(h):
    h = h.lstrip('#')
    return srgb_to_linear([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3 - 2 * t)


# ------------------------------------------------------------------ noise (deterministic, vectorised)

def _hash(ix, iy, iz, seed):
    h = (ix * 73856093) ^ (iy * 19349663) ^ (iz * 83492791) ^ (seed * 2654435761)
    h = (h ^ (h >> 13)) * 1274126177
    return ((h ^ (h >> 16)) & 0xFFFFFF).astype(np.float32) / float(0xFFFFFF)


def value_noise(p, seed=0):
    """3D value noise in [0, 1] at points p (N×3, lattice units)."""
    i = np.floor(p).astype(np.int64)
    f = (p - i).astype(np.float32)
    f = f * f * (3 - 2 * f)
    out = np.zeros(len(p), dtype=np.float32)
    for dx in (0, 1):
        wx = f[:, 0] if dx else 1 - f[:, 0]
        for dy in (0, 1):
            wy = f[:, 1] if dy else 1 - f[:, 1]
            for dz in (0, 1):
                wz = f[:, 2] if dz else 1 - f[:, 2]
                out += wx * wy * wz * _hash(i[:, 0] + dx, i[:, 1] + dy, i[:, 2] + dz, seed)
    return out


def fbm(p, scale, octaves=4, seed=0):
    """Fractal value noise in [0, 1]; p in metres, scale in lattice cells per metre."""
    total, amp, norm = np.zeros(len(p), dtype=np.float32), 1.0, 0.0
    for o in range(octaves):
        total += amp * value_noise(p * (scale * 2 ** o), seed + 101 * o)
        norm += amp
        amp *= 0.5
    return total / norm


# ------------------------------------------------------------------ maps

class Maps:
    def __init__(self, maps_dir, size=None):
        meta = json.load(open(os.path.join(maps_dir, 'maps.json'), encoding='utf-8'))
        g = np.load(os.path.join(maps_dir, 'geometry.npz'))
        self.size = meta['size']
        if size and size != self.size:
            sys.exit(f'skins: maps are {self.size}², requested {size}² (bake the maps at that size)')
        self.roles, self.objects = meta['roles'], meta['objects']
        obj = g['object']
        self.covered = obj > 0
        self.idx = np.flatnonzero(self.covered)                      # covered texels, row-major
        self.obj = obj.ravel()[self.idx].astype(np.int32)
        self.role = g['role'].ravel()[self.idx].astype(np.int32)
        self.pos = g['position'].reshape(-1, 3)[self.idx].astype(np.float32)
        n = g['normal'].reshape(-1, 3)[self.idx].astype(np.float32)
        self.nor = n / np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-6)
        ao = Image.open(os.path.join(maps_dir, 'ao.png')).convert('L').resize((self.size, self.size), Image.BILINEAR)
        self.ao = (np.asarray(ao, dtype=np.float32) / 255.0).ravel()[self.idx]
        self.dir = maps_dir
        self._edge = None

    def mm_per_px(self, surface_m2):
        return float(np.sqrt(surface_m2 / (self.covered.mean() * self.size ** 2)) * 1000)

    # per object: part id, assembly, side
    def attr(self, key):
        return np.array([o[key] if isinstance(o, dict) else '' for o in self.objects], dtype=object)

    def edge_mm(self, mm_px):
        """Distance to the nearest plate edge in mm per covered texel (cached in edge.npz next to the maps)."""
        if self._edge is not None:
            return self._edge
        cache = os.path.join(self.dir, 'edge.npz')
        if os.path.exists(cache):
            c = np.load(cache)
            if float(c['mm_px']) == round(mm_px, 6) and float(c['edge_deg']) == EDGE_DEG:
                self._edge = c['edge'].astype(np.float32)
                return self._edge
        H = W = self.size
        cov = self.covered
        labels, count = ndimage.label(cov)
        nor = np.zeros((H * W, 3), dtype=np.float32)
        nor[self.idx] = self.nor
        nor = nor.reshape(H, W, 3)
        pos = np.zeros((H * W, 3), dtype=np.float32)
        pos[self.idx] = self.pos
        pos = pos.reshape(H, W, 3)
        cos_t = np.cos(np.radians(EDGE_DEG))
        edge = np.zeros((H, W), dtype=bool)
        for axis in (0, 1):
            a = [slice(None)] * 2
            b = [slice(None)] * 2
            a[axis], b[axis] = slice(0, -1), slice(1, None)
            a, b = tuple(a), tuple(b)
            both = cov[a] & cov[b]
            turn = (np.sum(nor[a] * nor[b], axis=2) < cos_t) | (np.linalg.norm(pos[a] - pos[b], axis=2) > 4 * mm_px / 1000)
            e = both & turn
            edge[a] |= e
            edge[b] |= e
        # island borders: an edge unless a surface of another island continues across the seam with a similar normal
        border = cov & ~ndimage.binary_erosion(cov, structure=np.ones((3, 3), bool), border_value=0)
        bi = np.flatnonzero(border)
        bp, bn, bl = pos.reshape(-1, 3)[bi], nor.reshape(-1, 3)[bi], labels.ravel()[bi]
        tree = cKDTree(bp)
        dist, nb = tree.query(bp, k=8, distance_upper_bound=2.0 * mm_px / 1000)
        seam = np.zeros(len(bi), dtype=bool)
        for k in range(1, 8):
            ok = np.isfinite(dist[:, k])
            j = np.where(ok, nb[:, k], 0)
            seam |= ok & (bl[j] != bl) & (np.sum(bn * bn[j], axis=1) > cos_t)
        edge.ravel()[bi[~seam]] = True
        log(f'edges: {count} islands, {edge.sum()} edge texels, {seam.sum()} seam texels')
        out = np.full((H, W), FAR_MM, dtype=np.float32)
        for lab, sl in enumerate(ndimage.find_objects(labels), 1):
            if sl is None:
                continue
            m = labels[sl] == lab
            f = edge[sl] & m
            if f.any():
                d = ndimage.distance_transform_edt(~f).astype(np.float32) * mm_px
                out[sl][m] = d[m]
        self._edge = out.ravel()[self.idx]
        np.savez_compressed(cache, edge=self._edge.astype(np.float16), mm_px=round(mm_px, 6), edge_deg=EDGE_DEG)
        log('edge distance done')
        return self._edge

    def part_frames(self):
        """Per object: centre and half extents (metres) of its covered texels, for part-local patterns."""
        n = len(self.objects)
        lo = np.full((n, 3), np.inf, dtype=np.float32)
        hi = np.full((n, 3), -np.inf, dtype=np.float32)
        np.minimum.at(lo, self.obj, self.pos)
        np.maximum.at(hi, self.obj, self.pos)
        seen = np.isfinite(lo[:, 0])  # index 0 (no surface) and objects without texels
        lo[~seen], hi[~seen] = 0.0, 0.0
        return (lo + hi) / 2, np.maximum((hi - lo) / 2, 1e-4)


# ------------------------------------------------------------------ mixer

class Skin:
    def __init__(self, maps, mm_px):
        self.m, self.mm_px = maps, mm_px
        k = len(maps.idx)
        self.base = np.zeros((k, 3), dtype=np.float32)
        self.rough = np.full(k, 0.6, dtype=np.float32)
        self.metal = np.zeros(k, dtype=np.float32)
        self.emit = np.zeros((k, 3), dtype=np.float32)
        self.part = maps.attr('part')[maps.obj]
        self.asm = maps.attr('asm')[maps.obj]
        self.side = maps.attr('side')[maps.obj]
        self.rolename = np.array(maps.roles, dtype=object)[maps.role]
        self.centre, self.half = maps.part_frames()

    def select(self, L):
        m = np.ones(len(self.m.idx), dtype=bool)
        if 'roles' in L:
            m &= np.isin(self.rolename, L['roles'])
        if 'not_roles' in L:
            m &= ~np.isin(self.rolename, L['not_roles'])
        if 'asm' in L:
            m &= np.isin(self.asm, L['asm'])
        if 'side' in L:
            m &= np.isin(self.side, L['side'])
        for key, keep in (('parts', True), ('not_parts', False)):
            if key in L:
                names = np.unique(self.part)
                hit = [n for n in names if any(fnmatch.fnmatchcase(n, p) for p in L[key])]
                sel = np.isin(self.part, hit)
                m &= sel if keep else ~sel
        if 'facing' in L:  # [x, y, z] or [x, y, z, min cosine]; glTF axes, front +Z
            f = L['facing']
            d = np.asarray(f[:3], dtype=np.float32)
            # einsum, not @: Accelerate's matmul raises spurious floating-point warnings on large float32 arrays
            m &= np.einsum('ij,j->i', self.m.nor, d / np.linalg.norm(d)) > (f[3] if len(f) > 3 else 0.3)
        return m

    def apply(self, L, w):
        """Blend the layer's properties with weight w (0..1 per covered texel)."""
        w = w.astype(np.float32)
        if 'color' in L:
            self.base += (hex_linear(L['color']) - self.base) * w[:, None]
        if 'rough' in L:
            self.rough += (L['rough'] - self.rough) * w
        if 'metal' in L:
            self.metal += (L['metal'] - self.metal) * w
        if 'emit' in L:
            self.emit += (hex_linear(L['emit']) * L.get('emit_strength', 1.0) - self.emit) * w[:, None]
        if L.get('dark', 0):
            self.base *= (1 - L['dark'] * w)[:, None]

    def local(self, L):
        """Part-local coordinates (u across, v up; units of the part's half height) and the part's height in mm."""
        c, h = self.centre[self.m.obj], self.half[self.m.obj]
        p = self.m.pos - c
        mirror = np.where(self.side == 'R', -1.0, 1.0).astype(np.float32) if L.get('mirror', True) else 1.0
        hv = h[:, 1]
        return p[:, 0] * mirror / hv, p[:, 1] / hv, p[:, 2] / hv, hv * 1000

    def line(self, dist_units, half_units, width_mm):
        """Anti-aliased line mask from a distance (part units) and the part's half height in mm."""
        d_mm = np.abs(dist_units) * half_units
        aa = self.mm_px * 0.75
        return 1 - smoothstep(width_mm / 2 - aa, width_mm / 2 + aa, d_mm)

    def layer(self, L):
        t = L['type']
        sel = self.select(L).astype(np.float32)
        if not sel.any():
            log(f'  layer {t}: selects nothing')
            return
        k = np.flatnonzero(sel)
        w = np.zeros(len(sel), dtype=np.float32)
        pos, seed = self.m.pos[k], L.get('seed', 0)
        if t == 'fill':
            w[k] = 1.0
        elif t == 'band':
            e = self.m.edge_mm(self.mm_px)[k]
            aa = self.mm_px * 0.75
            w[k] = smoothstep(L['from_mm'] - aa, L['from_mm'] + aa, e) * (1 - smoothstep(L['to_mm'] - aa, L['to_mm'] + aa, e))
        elif t == 'wear':
            e = self.m.edge_mm(self.mm_px)[k]
            edge = 1 - smoothstep(0, L['radius_mm'], e)
            n = fbm(pos, L.get('noise', 60), 5, seed)
            lo, hi = L.get('threshold', [0.45, 0.52])
            # edge_weight low + contrast high: large chipped patches near edges instead of an even outline
            v = edge * L.get('edge_weight', 0.55) + (n - 0.5) * L.get('contrast', 0.75) + 0.075
            w[k] = smoothstep(lo, hi, v) * L.get('amount', 1.0)
        elif t == 'dirt':
            lo, hi = L.get('ao', [0.4, 0.95])
            cav = 1 - smoothstep(lo, hi, self.m.ao[k])
            n = fbm(pos, L.get('noise', 25), 4, seed)
            w[k] = np.clip(cav * (0.5 + n) + L.get('base', 0.0) * n, 0, 1) * L.get('amount', 0.6)
        elif t == 'scratches':
            s = np.asarray(L.get('stretch', [0.05, 1.0, 1.0]), dtype=np.float32)
            n = fbm(pos * s, L.get('scale', 700), 3, seed)
            lo, hi = L.get('threshold', [0.68, 0.72])
            w[k] = smoothstep(lo, hi, n) * L.get('amount', 0.5)
        elif t in ('stripes', 'diamond', 'chevron', 'emblem'):
            u, v, z, hmm = (a[k] for a in self.local(L))
            if t == 'stripes':
                a = np.radians(L.get('angle', 0))
                axis = v * np.cos(a) + u * np.sin(a)
                warp = (fbm(pos, L.get('warp_scale', 9), 3, seed) - 0.5) * L.get('warp', 1.2)
                f = (axis * L.get('freq', 1.6) + warp) % 1.0
                width = L.get('width', 0.3)
                edge = np.abs(f - 0.5) * 2
                taper = fbm(pos, L.get('warp_scale', 9) * 2.3, 2, seed + 7)
                w[k] = 1 - smoothstep(width * (0.4 + taper) - 0.03, width * (0.4 + taper) + 0.03, edge)
            elif t == 'diamond':
                cu, cv = L.get('center', [0, 0])
                d = np.abs(u - cu) * L.get('aspect', 1.0) + np.abs(v - cv)
                w[k] = sum(self.line(d - r, hmm, L.get('width_mm', 3)) for r in L.get('radii', [0.6]))
            elif t == 'chevron':
                d = (v + np.abs(u) * L.get('slope', 0.8)) * L.get('freq', 2.0)
                w[k] = self.line((d - np.round(d)) / L.get('freq', 2.0), hmm, L.get('width_mm', 6))
            else:  # emblem
                cu, cv = L.get('center', [0, 0])
                ru, rv = u - cu, v - cv
                r = np.hypot(ru, rv)
                R = L.get('radius', 0.35)
                ring = self.line(r - R, hmm, L.get('width_mm', 4))
                ang = np.arctan2(rv, ru) * L.get('rays', 8) / (2 * np.pi)
                rays = self.line((ang - np.round(ang)) * 2 * np.pi * r / L.get('rays', 8), hmm, L.get('width_mm', 4)) \
                    * (r > R * 1.15) * (r < R * L.get('ray_length', 1.7))
                core = (r < R * L.get('core', 0.45)).astype(np.float32)
                w[k] = np.clip(ring + rays + core, 0, 1)
            if 'region' in L:  # only inside [u0, u1] × [v0, v1] of the part
                u0, u1, v0, v1 = L['region']
                w[k] *= (u >= u0) & (u <= u1) & (v >= v0) & (v <= v1)
        elif t == 'filigree':
            e = self.m.edge_mm(self.mm_px)[k]
            band = smoothstep(L['from_mm'] - 1, L['from_mm'], e) * (1 - smoothstep(L['to_mm'], L['to_mm'] + 1, e))
            n = fbm(pos, L.get('scale', 40), 3, seed) * L.get('rings', 9)
            iso = np.abs(n - np.round(n)) / L.get('rings', 9) * 1000 / L.get('scale', 40)  # ≈ mm to the iso line
            w[k] = band * (1 - smoothstep(L.get('width_mm', 1.2) / 2, L.get('width_mm', 1.2) / 2 + self.mm_px, iso))
        else:
            sys.exit(f'skins: unknown layer type {t!r}')
        self.apply(L, w * L.get('opacity', 1.0))

    def images(self, size):
        m = self.m
        nearest = dilation_index(m)
        def image(values, channels):
            full = np.zeros((size * size, channels), dtype=np.float32)
            full[m.idx] = values.reshape(len(m.idx), channels)
            full = full.reshape(size, size, channels)[nearest[0], nearest[1]]
            return full
        base = image(linear_to_srgb(self.base), 3)
        emit = image(linear_to_srgb(np.clip(self.emit, 0, 1)), 3)
        orm = image(np.stack([m.ao, np.clip(self.rough, 0.02, 1), np.clip(self.metal, 0, 1)], axis=1), 3)
        to8 = lambda a: Image.fromarray(np.clip(np.rint(a * 255), 0, 255).astype(np.uint8), 'RGB')
        return to8(base), to8(orm).resize((ORM_SIZE, ORM_SIZE), Image.LANCZOS), to8(emit)


def dilation_index(m):
    """For every texel the index of the nearest covered texel (fills island gaps), cached next to the maps."""
    cache = os.path.join(m.dir, 'dilate.npz')
    if os.path.exists(cache):
        return np.load(cache)['nearest']
    nearest = ndimage.distance_transform_edt(~m.covered, return_distances=False, return_indices=True).astype(np.uint16)
    np.savez_compressed(cache, nearest=nearest)
    return nearest


def template(m, edge):
    """UV template sheet: islands coloured by assembly, edges dark, gaps black."""
    size = m.size
    col = np.zeros((size * size, 3), dtype=np.float32)
    asm = m.attr('asm')[m.obj]
    for a, h in ASM_COLORS.items():
        col[m.idx[asm == a]] = np.asarray([int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)])
    shade = 0.55 + 0.45 * smoothstep(0.0, 6.0, edge)
    col[m.idx] *= shade[:, None]
    img = Image.fromarray(np.rint(col.reshape(size, size, 3) * 255).astype(np.uint8), 'RGB')
    return img.resize((2048, 2048), Image.LANCZOS)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--maps', required=True)
    ap.add_argument('--body', required=True, choices=['waechter', 'paladin', 'mechanik'])
    ap.add_argument('--skin', action='append', help='skin key from skins.json (default: all of the body)')
    ap.add_argument('--out', help='default assets/robot-bodies/<body>/skins')
    ap.add_argument('--size', type=int)
    o = ap.parse_args()
    recipes = json.load(open(os.path.join(HERE, 'skins.json'), encoding='utf-8'))
    manifest = json.load(open(os.path.join(ROOT, 'assets', 'robot-bodies', o.body, 'manifest.json'), encoding='utf-8'))
    out = os.path.abspath(o.out or os.path.join(ROOT, 'assets', 'robot-bodies', o.body, 'skins'))
    m = Maps(o.maps, o.size)
    mm_px = m.mm_per_px(manifest['uv']['surface_m2'])
    log(f'{o.body}: {m.size}², {len(m.idx)} covered texels, {mm_px:.3f} mm per px')
    edge = m.edge_mm(mm_px)
    os.makedirs(out, exist_ok=True)
    template(m, edge).save(os.path.join(out, 'template.png'), optimize=True)
    keys = o.skin or [k for k, r in recipes['skins'].items() if o.body in r.get('bodies', [o.body])]
    index = dict(body=o.body, size=m.size, orm_size=ORM_SIZE, mm_per_px=round(mm_px, 3), template='template.png',
                 source=dict(maps=os.path.relpath(o.maps, ROOT), recipes='blender/robot/skins.json'), skins={})
    old = os.path.join(out, 'skins.json')
    if o.skin and os.path.exists(old):
        index['skins'] = json.load(open(old, encoding='utf-8'))['skins']
    for key in keys:
        r = recipes['skins'][key]
        s = Skin(m, mm_px)
        for L in r['layers']:
            s.layer(L)
        base, orm, emit = s.images(m.size)
        d = os.path.join(out, key)
        os.makedirs(d, exist_ok=True)
        base.save(os.path.join(d, 'basecolor.jpg'), quality=88, optimize=True, subsampling=0)
        orm.save(os.path.join(d, 'orm.png'), optimize=True)
        emit.save(os.path.join(d, 'emissive.png'), optimize=True)
        index['skins'][key] = dict(de=r['de'], energy=r.get('energy'), emissive_intensity=r.get('emissive_intensity', 1.0),
                                   files=dict(basecolor=f'{key}/basecolor.jpg', orm=f'{key}/orm.png', emissive=f'{key}/emissive.png'))
        log(f'skin {key} ({r["de"]}) → {d}')
    json.dump(index, open(old, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
