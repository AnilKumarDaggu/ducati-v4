import { describe, expect, it } from 'vitest';
import {
  AnimationClip,
  AnimationMixer,
  NumberKeyframeTrack,
  Object3D,
  Quaternion,
  Vector3,
} from 'three';
import { CrankAngleClock } from './crank-angle-clock.js';

const Y = new Vector3(0, 1, 0);
const quatY = (deg: number) => new Quaternion().setFromAxisAngle(Y, (deg * Math.PI) / 180);

describe('CrankAngleClock', () => {
  it('drives ratio rotations: cam turns once per 720° cycle, crank twice', () => {
    const clock = new CrankAngleClock();
    const cam = new Object3D();
    const crank = new Object3D();
    clock.bindRotation(cam, 360, 'y');
    clock.bindRotation(crank, 720, 'y');

    clock.setAngle(360); // half cycle
    // Compare quaternions (Euler representations of 180° are ambiguous).
    expect(cam.quaternion.angleTo(quatY(180))).toBeLessThan(1e-6); // cam: half turn
    expect(crank.quaternion.angleTo(quatY(360))).toBeLessThan(1e-6); // crank: full turn
  });

  it('supports counter-rotation and phase (the idler, the rear bank)', () => {
    const clock = new CrankAngleClock();
    const idler = new Object3D();
    clock.bindRotation(idler, -720, 'y', 90);
    clock.setAngle(0);
    expect(idler.rotation.y).toBeCloseTo(Math.PI / 2); // phase only
    clock.setAngle(180); // quarter cycle → −180° + 90° phase
    expect(idler.rotation.y).toBeCloseTo(-Math.PI / 2);
  });

  it('wraps at 720° and advances by rpm in run mode', () => {
    const clock = new CrankAngleClock();
    clock.setAngle(700);
    clock.setRunning(true, 600); // 600 rpm = 3600°/s
    clock.update(10); // +36°
    expect(clock.getAngle()).toBeCloseTo(16); // 736 → 16
    clock.setRunning(false);
    expect(clock.update(1000)).toBe(false); // paused: no motion
    expect(clock.getAngle()).toBeCloseTo(16);
  });

  it('maps angle to clip time for one-cycle clips (never wall-clock)', () => {
    const clock = new CrankAngleClock();
    const node = new Object3D();
    // One-cycle convention: 2 s clip spans 0–720°; position.y ramps 0 → 10.
    const track = new NumberKeyframeTrack('.position[y]', [0, 2], [0, 10]);
    const clip = new AnimationClip('valve-lift', 2, [track]);
    const mixer = new AnimationMixer(node);
    mixer.clipAction(clip).play();
    clock.bindMixer(mixer, 2);

    clock.setAngle(360); // half cycle → half clip → y = 5
    expect(node.position.y).toBeCloseTo(5);
    clock.setAngle(0);
    expect(node.position.y).toBeCloseTo(0);
  });
});
