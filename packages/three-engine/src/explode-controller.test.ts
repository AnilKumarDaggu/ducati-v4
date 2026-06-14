import { describe, expect, it } from 'vitest';
import { Object3D } from 'three';
import { ExplodeController } from './explode-controller.js';
import { ExplodeDef } from '@dtea/data';

const def = ExplodeDef.parse({
  explodeId: 'test',
  assemblyId: 'ASM_TEST',
  epicenter: { x: 0, y: 0, z: 0 },
  components: [
    {
      nodeName: 'PART_A',
      explodeOffset: { x: 0, y: 40, z: 0 },
      explodeRotation: { x: 0, y: -720, z: 0 },
      ease: 'linear',
      duration: 1,
      delay: 0,
    },
    {
      nodeName: 'PART_B',
      explodeOffset: { x: 20, y: 0, z: 0 },
      ease: 'linear',
      duration: 1,
      delay: 1, // staggered: starts at global level 0.5
    },
  ],
});

function makeScene() {
  const a = new Object3D();
  a.name = 'PART_A';
  const b = new Object3D();
  b.name = 'PART_B';
  b.position.set(5, 0, 0);
  const lookup = (name: string) => (name === 'PART_A' ? a : name === 'PART_B' ? b : undefined);
  return { a, b, lookup };
}

describe('ExplodeController', () => {
  it('binds nodes and reports missing ones without failing', () => {
    const { lookup } = makeScene();
    const controller = new ExplodeController(def);
    const result = controller.bind((n) => (n === 'PART_B' ? undefined : lookup(n)));
    expect(result.bound).toBe(1);
    expect(result.missing).toEqual(['PART_B']);
    controller.setLevel(1); // must not throw with partial binding
  });

  it('scrubs offsets along authored paths with stagger windows', () => {
    const { a, b, lookup } = makeScene();
    const controller = new ExplodeController(def);
    controller.bind(lookup);

    controller.setLevel(0.5); // A's window [0,0.5] complete; B's [0.5,1] not started
    expect(a.position.y).toBeCloseTo(40);
    expect(b.position.x).toBeCloseTo(5);

    controller.setLevel(1);
    expect(b.position.x).toBeCloseTo(25); // base 5 + offset 20

    controller.reset();
    expect(a.position.y).toBeCloseTo(0);
    expect(b.position.x).toBeCloseTo(5);
  });

  it('applies progressive rotation (thread-out motion)', () => {
    const { a, lookup } = makeScene();
    const controller = new ExplodeController(def);
    controller.bind(lookup);

    controller.setLevel(0.25); // A local progress 0.5 → -360° ≡ identity-ish full turn
    // Quarter of the window earlier: check a non-identity intermediate instead.
    controller.setLevel(0.125); // A local progress 0.25 → -180° about Y
    const e = a.rotation;
    expect(Math.abs(Math.abs(e.y) - Math.PI) < 0.01 || Math.abs(e.x) > 3).toBe(true);
  });

  it('timed playback reaches the target and settles', () => {
    const { a, lookup } = makeScene();
    const controller = new ExplodeController(def);
    controller.bind(lookup);

    controller.playTo(1);
    const start = performance.now();
    controller.update(start + 600);
    expect(controller.getLevel()).toBeGreaterThan(0);
    expect(controller.getLevel()).toBeLessThan(1);
    controller.update(start + 5000);
    expect(controller.getLevel()).toBe(1);
    expect(a.position.y).toBeCloseTo(40);
    expect(controller.update(start + 6000)).toBe(false);
  });
});
