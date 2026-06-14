import type { Document, Material, Primitive } from '@gltf-transform/core';

/**
 * Procedural geometry for representative stand-in assets. Real geometry comes
 * from the scan pipeline; these primitives let the viewer and the full
 * interaction stack be exercised at engine scale before scan data lands.
 * All geometry is built centered on the local origin so nodes can spin in place
 * (CrankAngleClock) and translate cleanly (ExplodeController).
 */

interface CylinderSpec {
  radius: number;
  height: number;
  yOffset: number;
  segments: number;
}

interface BoxSpec {
  width: number;
  height: number;
  depth: number;
}

/** Axis-aligned box centered on the local origin, with per-face flat normals. */
export function createBoxPrimitive(
  doc: Document,
  material: Material,
  { width, height, depth }: BoxSpec,
): Primitive {
  const hx = width / 2;
  const hy = height / 2;
  const hz = depth / 2;
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  // Six faces, each as a quad with a constant normal.
  const faces: Array<{ n: [number, number, number]; v: Array<[number, number, number]> }> = [
    { n: [0, 0, 1], v: [[-hx, -hy, hz], [hx, -hy, hz], [hx, hy, hz], [-hx, hy, hz]] },
    { n: [0, 0, -1], v: [[hx, -hy, -hz], [-hx, -hy, -hz], [-hx, hy, -hz], [hx, hy, -hz]] },
    { n: [1, 0, 0], v: [[hx, -hy, hz], [hx, -hy, -hz], [hx, hy, -hz], [hx, hy, hz]] },
    { n: [-1, 0, 0], v: [[-hx, -hy, -hz], [-hx, -hy, hz], [-hx, hy, hz], [-hx, hy, -hz]] },
    { n: [0, 1, 0], v: [[-hx, hy, hz], [hx, hy, hz], [hx, hy, -hz], [-hx, hy, -hz]] },
    { n: [0, -1, 0], v: [[-hx, -hy, -hz], [hx, -hy, -hz], [hx, -hy, hz], [-hx, -hy, hz]] },
  ];
  for (const face of faces) {
    const base = positions.length / 3;
    for (const vert of face.v) {
      positions.push(...vert);
      normals.push(...face.n);
    }
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }

  const buffer = doc.getRoot().listBuffers()[0] ?? doc.createBuffer();
  return doc
    .createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(positions)).setBuffer(buffer))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(normals)).setBuffer(buffer))
    .setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint16Array(indices)).setBuffer(buffer))
    .setMaterial(material);
}

/** Builds an indexed cylinder primitive (smooth-shaded sides + flat caps). */
export function createCylinderPrimitive(
  doc: Document,
  material: Material,
  { radius, height, yOffset, segments }: CylinderSpec,
): Primitive {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  const y0 = yOffset;
  const y1 = yOffset + height;

  // Side wall: (segments + 1) columns of bottom/top vertex pairs, radial normals.
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const nx = Math.cos(angle);
    const nz = Math.sin(angle);
    positions.push(radius * nx, y0, radius * nz, radius * nx, y1, radius * nz);
    normals.push(nx, 0, nz, nx, 0, nz);
  }
  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }

  // Caps: dedicated vertices so cap normals stay flat.
  for (const [y, ny] of [
    [y0, -1],
    [y1, 1],
  ] as const) {
    const centerIndex = positions.length / 3;
    positions.push(0, y, 0);
    normals.push(0, ny, 0);
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      positions.push(radius * Math.cos(angle), y, radius * Math.sin(angle));
      normals.push(0, ny, 0);
    }
    for (let i = 0; i < segments; i++) {
      const ring = centerIndex + 1 + i;
      if (ny > 0) indices.push(centerIndex, ring, ring + 1);
      else indices.push(centerIndex, ring + 1, ring);
    }
  }

  const buffer = doc.getRoot().listBuffers()[0] ?? doc.createBuffer();
  const position = doc
    .createAccessor()
    .setType('VEC3')
    .setArray(new Float32Array(positions))
    .setBuffer(buffer);
  const normal = doc
    .createAccessor()
    .setType('VEC3')
    .setArray(new Float32Array(normals))
    .setBuffer(buffer);
  const index = doc
    .createAccessor()
    .setType('SCALAR')
    .setArray(new Uint16Array(indices))
    .setBuffer(buffer);

  return doc
    .createPrimitive()
    .setAttribute('POSITION', position)
    .setAttribute('NORMAL', normal)
    .setIndices(index)
    .setMaterial(material);
}
