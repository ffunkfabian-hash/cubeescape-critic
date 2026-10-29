// Pure validation helpers shared by the browser runner and its focused tests.
export function subprocessExitCode(result) {
  if (result.error || result.signal || !Number.isInteger(result.status)) return 1;
  return result.status;
}

export function inspectGLB(bytes) {
  if (bytes.length < 20 || bytes.readUInt32LE(0) !== 0x46546c67) throw new Error('Invalid GLB magic');
  if (bytes.readUInt32LE(4) !== 2) throw new Error('Expected GLB version 2');
  if (bytes.readUInt32LE(8) !== bytes.length) throw new Error('Truncated or oversized GLB');
  let json;
  for (let offset = 12; offset < bytes.length;) {
    if (offset + 8 > bytes.length) throw new Error('Truncated GLB chunk header');
    const length = bytes.readUInt32LE(offset);
    const type = bytes.readUInt32LE(offset + 4);
    if (length % 4 || offset + 8 + length > bytes.length) throw new Error('Invalid GLB chunk size');
    if (offset === 12 && type !== 0x4e4f534a) throw new Error('Missing initial GLB JSON chunk');
    if (type === 0x4e4f534a) {
      if (json) throw new Error('Duplicate GLB JSON chunk');
      json = JSON.parse(bytes.subarray(offset + 8, offset + 8 + length).toString('utf8'));
    }
    offset += 8 + length;
  }
  if (json?.asset?.version !== '2.0' || !json.meshes?.length || !json.nodes?.length || !json.scenes?.length) {
    throw new Error('GLB contains no model scene');
  }
  if (!json.materials?.length) throw new Error('GLB lost the model materials');
  for (const mesh of json.meshes) {
    if (!mesh.primitives?.length) throw new Error('GLB contains an empty mesh');
    for (const primitive of mesh.primitives) {
      const position = json.accessors?.[primitive.attributes?.POSITION];
      if (!position || position.type !== 'VEC3' || position.count < 3) throw new Error('GLB mesh has no positions');
      if (!json.materials[primitive.material]) throw new Error('GLB primitive has no material');
    }
  }
  return { bytes: bytes.length, meshes: json.meshes.length, nodes: json.nodes.length,
    materials: json.materials.length, images: json.images?.length || 0 };
}
