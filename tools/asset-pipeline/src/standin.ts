import { Document } from '@gltf-transform/core';
import { createCylinderPrimitive } from './geometry.js';

export const STANDIN_COMPONENT_ID = 'ENG_STANDIN_TEST-BOLT-M8';

/**
 * Procedural M8-class test bolt (RDM-003 S1 task 6).
 * Dimensions in millimetres (real-world scale rule, BOM-001 §7.1 carried standard).
 * Triangle count sits far inside the AST-001 fastener budget (≤800 tris).
 */
export function createStandinBolt(): Document {
  const doc = new Document();
  doc.createScene('scene_root');

  const steel = doc
    .createMaterial('steel_zinc_plated')
    .setBaseColorFactor([0.62, 0.63, 0.67, 1])
    .setMetallicFactor(1)
    .setRoughnessFactor(0.42);

  const mesh = doc.createMesh(`${STANDIN_COMPONENT_ID}_mesh`);
  // Shaft: M8 → r4 mm, 30 mm long. Head: hex across-flats ≈ 13 mm → r6.5, 5.3 mm tall.
  mesh.addPrimitive(
    createCylinderPrimitive(doc, steel, { radius: 4, height: 30, yOffset: 0, segments: 16 }),
  );
  mesh.addPrimitive(
    createCylinderPrimitive(doc, steel, { radius: 6.5, height: 5.3, yOffset: 30, segments: 6 }),
  );

  // Node name = componentId — the contract the lint stage enforces (BOM naming rule).
  const node = doc.createNode(STANDIN_COMPONENT_ID).setMesh(mesh);
  doc.getRoot().listScenes()[0]!.addChild(node);

  return doc;
}
