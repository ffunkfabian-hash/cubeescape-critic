#!/usr/bin/env python3
"""Step 3: visual hull -> smooth mesh with colours projected back from every frame -> GLB.

Marching cubes on the lightly smoothed occupancy grid gives the surface. Each vertex is coloured from all 241 frames:
per frame a point-splat z-buffer decides visibility, the sample weight is (n · view)^8 so the frames that look straight
at a surface dominate (keeps the toon panel lines sharp), and the weighted mean is stored as vertex colour.
Writes web/public/robot/robot_hull.glb (unlit, vertex colours). Usage: python3 mesh.py [repo-root]
"""
import json
import os
import struct
import sys
import time

import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage.measure import marching_cubes

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hull import azimuth, project  # noqa: E402


def view_dir(cam, i):
    phi = azimuth(cam, i)
    e = cam['e']
    return np.array([np.sin(phi) * np.cos(e), np.sin(e), np.cos(phi) * np.cos(e)], np.float32)


def subdivide(verts, faces):
    """One midpoint subdivision (4 triangles per triangle): more colour samples, same shape."""
    edges = np.sort(np.concatenate([faces[:, [0, 1]], faces[:, [1, 2]], faces[:, [2, 0]]]), 1)
    uniq, inv = np.unique(edges, axis=0, return_inverse=True)
    mid = len(verts) + inv.reshape(3, -1).T  # midpoint index of edges (01, 12, 20) per face
    verts = np.concatenate([verts, (verts[uniq[:, 0]] + verts[uniq[:, 1]]) / 2])
    a, b, c = faces.T
    m01, m12, m20 = mid.T
    faces = np.concatenate([np.stack([a, m01, m20], 1), np.stack([m01, b, m12], 1), np.stack([m20, m12, c], 1), np.stack([m01, m12, m20], 1)])
    return verts, faces


def vertex_normals(verts, faces):
    fn = np.cross(verts[faces[:, 1]] - verts[faces[:, 0]], verts[faces[:, 2]] - verts[faces[:, 0]])
    n = np.zeros_like(verts)
    for k in range(3):
        np.add.at(n, faces[:, k], fn)
    return n / np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-12)


def write_glb(path, pos, nrm, col, idx):
    """Minimal glTF 2.0 binary: one unlit mesh with POSITION, NORMAL, COLOR_0 (linear float RGB) and u32 indices."""
    pos, nrm, col = pos.astype(np.float32), nrm.astype(np.float32), col.astype(np.float32)
    idx = idx.astype(np.uint32).ravel()
    blobs = [pos.tobytes(), nrm.tobytes(), col.tobytes(), idx.tobytes()]
    offs, buf = [], b''
    for b in blobs:
        offs.append(len(buf))
        buf += b + b'\0' * (-len(b) % 4)
    views = [dict(buffer=0, byteOffset=o, byteLength=len(b)) for o, b in zip(offs, blobs)]
    views[3]['target'] = 34963
    for v in views[:3]:
        v['target'] = 34962
    acc = [
        dict(bufferView=0, componentType=5126, count=len(pos), type='VEC3', min=pos.min(0).tolist(), max=pos.max(0).tolist()),
        dict(bufferView=1, componentType=5126, count=len(nrm), type='VEC3'),
        dict(bufferView=2, componentType=5126, count=len(col), type='VEC3'),
        dict(bufferView=3, componentType=5125, count=len(idx), type='SCALAR'),
    ]
    gltf = dict(
        asset=dict(version='2.0', generator='cubeescape-critic robot/mesh.py'),
        extensionsUsed=['KHR_materials_unlit'],
        scene=0, scenes=[dict(nodes=[0])], nodes=[dict(name='Robot_VisualHull', mesh=0)],
        materials=[dict(name='robotBaked', pbrMetallicRoughness=dict(baseColorFactor=[1, 1, 1, 1], metallicFactor=0, roughnessFactor=1),
                        extensions=dict(KHR_materials_unlit={}))],
        meshes=[dict(name='Robot', primitives=[dict(attributes=dict(POSITION=0, NORMAL=1, COLOR_0=2), indices=3, material=0)])],
        buffers=[dict(byteLength=len(buf))], bufferViews=views, accessors=acc,
    )
    js = json.dumps(gltf, separators=(',', ':')).encode()
    js += b' ' * (-len(js) % 4)
    with open(path, 'wb') as f:
        f.write(struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(buf)))
        f.write(struct.pack('<II', len(js), 0x4E4F534A) + js)
        f.write(struct.pack('<II', len(buf), 0x004E4942) + buf)


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    run = os.path.join(root, 'runs', 'robot')
    t0 = time.time()
    cam = json.load(open(os.path.join(run, 'camera.json')))
    h = np.load(os.path.join(run, 'hull.npz'))
    occ, axes = h['occ'], [h['x'], h['y'], h['z']]
    vox = float(axes[0][1] - axes[0][0])
    field = ndi.gaussian_filter(np.pad(occ, 2).astype(np.float32), 1.0)
    verts, faces, normals, _ = marching_cubes(field, 0.5)
    verts = (verts - 2) * vox + np.array([a[0] for a in axes])
    # Orient normals outwards, then make the triangle winding agree with them (front faces = outside).
    if np.mean(np.sum(normals * (verts - verts.mean(0)), 1)) < 0:
        normals = -normals
    a, b, c = verts[faces[:, 0]], verts[faces[:, 1]], verts[faces[:, 2]]
    if np.mean(np.sum(np.cross(b - a, c - a) * normals[faces[:, 0]], 1)) < 0:
        faces = faces[:, ::-1]
    verts, faces = subdivide(verts, faces)
    normals = vertex_normals(verts, faces)
    print(f'Netz: {len(verts)} Punkte, {len(faces)} Dreiecke ({time.time() - t0:.0f} s)')

    frames = sorted(f for f in os.listdir(os.path.join(run, 'frames')) if f.endswith('.png'))
    P = verts.astype(np.float32)
    acc = np.zeros((len(P), 3), np.float64)
    wsum = np.zeros(len(P), np.float64)
    zs = 0.5  # z-buffer at half resolution
    for i, f in enumerate(frames):
        img = np.asarray(Image.open(os.path.join(run, 'frames', f)).convert('RGB')).astype(np.float32)
        H, W = img.shape[:2]
        d = view_dir(cam, i)
        u, v = project(P, cam, i, 1.0)
        depth = P @ d
        bu, bv = np.clip((u * zs).astype(np.int32), 0, int(W * zs) - 1), np.clip((v * zs).astype(np.int32), 0, int(H * zs) - 1)
        key = bv * int(W * zs) + bu
        zbuf = np.full(int(W * zs) * int(H * zs), -1e9, np.float32)
        np.maximum.at(zbuf, key, depth)
        # Neighbourhood max closes pin holes of the point splat.
        zimg = ndi.maximum_filter(zbuf.reshape(int(H * zs), int(W * zs)), size=3).ravel()
        visible = depth >= zimg[key] - 2.5 * vox
        facing = np.clip(normals @ d, 0, None)
        w = facing ** 8 * visible
        ui, vi = np.clip(np.round(u).astype(np.int32), 0, W - 1), np.clip(np.round(v).astype(np.int32), 0, H - 1)
        acc += w[:, None] * img[vi, ui]
        wsum += w
    srgb = np.where(wsum[:, None] > 1e-6, acc / np.maximum(wsum, 1e-6)[:, None], 235).clip(0, 255) / 255
    col = np.where(srgb <= 0.04045, srgb / 12.92, ((srgb + 0.055) / 1.055) ** 2.4)  # glTF vertex colours are linear
    print(f'Farben aus {len(frames)} Frames, ohne Treffer: {(wsum <= 1e-6).sum()} Punkte ({time.time() - t0:.0f} s)')
    out = os.path.join(root, 'web', 'public', 'robot')
    os.makedirs(out, exist_ok=True)
    write_glb(os.path.join(out, 'robot_hull.glb'), verts, normals, col, faces)
    # Camera per frame and small JPEG copies of all frames for the in-app overlay.
    json.dump({k: v for k, v in cam.items() if k != 'hull_iou_per_frame'}, open(os.path.join(out, 'camera.json'), 'w'))
    os.makedirs(os.path.join(out, 'frames'), exist_ok=True)
    for f in frames:
        Image.open(os.path.join(run, 'frames', f)).convert('RGB').save(os.path.join(out, 'frames', f[:-4] + '.jpg'), quality=82)
    print(f'GLB: {os.path.getsize(os.path.join(out, "robot_hull.glb")) / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
