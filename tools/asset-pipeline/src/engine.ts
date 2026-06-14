import { Document, type Material, type Node } from '@gltf-transform/core';
import { createBoxPrimitive, createCylinderPrimitive } from './geometry.js';

/**
 * Procedural engine HERO — a representative V-engine silhouette built from
 * primitives so the full viewer stack (framing, materials, explode, crank,
 * view modes) reads at engine scale before scan data lands.
 *
 * Honest placeholder: clearly "representative geometry", retired when the
 * scanned Granturismo arrives. Material contrast (dark cast / chrome / anodized
 * / Ducati rosso) and a frame-filling mass are what make it read as premium.
 * All nodes carry BOM-style ids present in content/components.json.
 */

export const ENGINE_ASSEMBLY_ID = 'ENG_GRANTURISMO';

export interface EnginePartMeta {
  id: string;
  displayName: string;
}

/** The parts the engine emits — kept in sync with content/components.json (lint enforces). */
export const ENGINE_PARTS: EnginePartMeta[] = [
  { id: 'ENG_S01_CRANKCASE', displayName: 'Crankcase' },
  { id: 'ENG_S01_OIL-SUMP', displayName: 'Oil Sump' },
  { id: 'ENG_S01_FRONT-COVER', displayName: 'Front Timing Cover' },
  { id: 'ENG_S01_CYLINDER-HEAD-FRONT', displayName: 'Front Cylinder Head' },
  { id: 'ENG_S01_CYLINDER-HEAD-REAR', displayName: 'Rear Cylinder Head' },
  { id: 'ENG_S01_CAM-COVER-FRONT', displayName: 'Front Cam Cover' },
  { id: 'ENG_S01_CAM-COVER-REAR', displayName: 'Rear Cam Cover' },
  { id: 'ENG_S01_INTAKE-PLENUM', displayName: 'Intake Plenum' },
  { id: 'ENG_S01_CRANK-PULLEY', displayName: 'Crankshaft Pulley' },
  { id: 'ENG_S01_CLUTCH-COVER', displayName: 'Clutch Cover' },
  { id: 'ENG_S01_EXHAUST-HEADER-1', displayName: 'Exhaust Header 1' },
  { id: 'ENG_S01_EXHAUST-HEADER-2', displayName: 'Exhaust Header 2' },
  { id: 'ENG_S01_EXHAUST-HEADER-3', displayName: 'Exhaust Header 3' },
  { id: 'ENG_S01_EXHAUST-HEADER-4', displayName: 'Exhaust Header 4' },
];

const quatX = (deg: number): [number, number, number, number] => {
  const a = (deg * Math.PI) / 360;
  return [Math.sin(a), 0, 0, Math.cos(a)];
};
const quatZ = (deg: number): [number, number, number, number] => {
  const a = (deg * Math.PI) / 360;
  return [0, 0, Math.sin(a), Math.cos(a)];
};

export function createStandinEngine(): Document {
  const doc = new Document();
  const scene = doc.createScene('scene_root');

  // ── Material library (the contrast that sells the look) ──────────────────
  const cast = doc
    .createMaterial('cast_aluminium')
    .setBaseColorFactor([0.20, 0.21, 0.23, 1])
    .setMetallicFactor(0.9)
    .setRoughnessFactor(0.52);
  const rosso = doc
    .createMaterial('rosso_corsa')
    .setBaseColorFactor([0.62, 0.02, 0.04, 1])
    .setMetallicFactor(0.25)
    .setRoughnessFactor(0.32);
  const chrome = doc
    .createMaterial('chrome')
    .setBaseColorFactor([0.82, 0.84, 0.87, 1])
    .setMetallicFactor(1)
    .setRoughnessFactor(0.12);
  const alu = doc
    .createMaterial('brushed_aluminium')
    .setBaseColorFactor([0.66, 0.68, 0.72, 1])
    .setMetallicFactor(0.85)
    .setRoughnessFactor(0.34);

  const box = (id: string, material: Material, dims: [number, number, number], pos: [number, number, number], rot?: [number, number, number, number]): Node => {
    const mesh = doc.createMesh(`${id}_mesh`).addPrimitive(
      createBoxPrimitive(doc, material, { width: dims[0], height: dims[1], depth: dims[2] }),
    );
    const node = doc.createNode(id).setMesh(mesh).setTranslation(pos);
    if (rot) node.setRotation(rot);
    scene.addChild(node);
    return node;
  };
  const cyl = (id: string, material: Material, radius: number, height: number, pos: [number, number, number], rot?: [number, number, number, number]): Node => {
    const mesh = doc.createMesh(`${id}_mesh`).addPrimitive(
      createCylinderPrimitive(doc, material, { radius, height, yOffset: -height / 2, segments: 28 }),
    );
    const node = doc.createNode(id).setMesh(mesh).setTranslation(pos);
    if (rot) node.setRotation(rot);
    scene.addChild(node);
    return node;
  };

  // ── The assembly (mm; centered on X, base near y=0 for the contact shadow) ──
  // Crankcase: the central mass.
  box('ENG_S01_CRANKCASE', cast, [440, 200, 300], [0, 150, 0]);
  // Oil sump beneath.
  box('ENG_S01_OIL-SUMP', cast, [360, 110, 240], [0, 30, 0]);
  // V heads angled off the crankcase top (90° vee feel: two banks tilted ±28°).
  box('ENG_S01_CYLINDER-HEAD-FRONT', cast, [400, 120, 150], [0, 300, 95], quatX(26));
  box('ENG_S01_CYLINDER-HEAD-REAR', cast, [400, 120, 150], [0, 300, -95], quatX(-26));
  // Rosso cam covers — the Ducati signal.
  box('ENG_S01_CAM-COVER-FRONT', rosso, [410, 56, 120], [0, 372, 150], quatX(26));
  box('ENG_S01_CAM-COVER-REAR', rosso, [410, 56, 120], [0, 372, -150], quatX(-26));
  // Intake plenum nested in the vee.
  box('ENG_S01_INTAKE-PLENUM', alu, [300, 90, 150], [0, 360, 0]);
  // Front covers / rotating faces.
  box('ENG_S01_FRONT-COVER', cast, [60, 240, 280], [-235, 170, 0]);
  cyl('ENG_S01_CRANK-PULLEY', chrome, 70, 46, [-272, 120, 70], quatZ(90));
  cyl('ENG_S01_CLUTCH-COVER', cast, 130, 70, [250, 150, 0], quatZ(90));
  // Chrome exhaust headers sweeping down the front bank.
  const headerRot = quatX(64);
  for (let i = 0; i < 4; i++) {
    const x = -150 + i * 100;
    cyl(`ENG_S01_EXHAUST-HEADER-${i + 1}`, chrome, 22, 230, [x, 250, 200], headerRot);
  }

  return doc;
}
