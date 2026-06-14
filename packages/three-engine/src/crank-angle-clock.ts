import { MathUtils, Quaternion, Vector3, type AnimationMixer, type Object3D } from 'three';

/**
 * CrankAngleClock — the single global cycle clock (BOM-001 rule 4, DTEA-ADR-011).
 *
 * One scalar, 0–720° (the four-stroke cycle), drives all engine motion:
 *  - rotation bindings (AN-R parts): degreesPerCycle ratio + phase
 *    (crank 720°/cycle, cams 360°/cycle, counter-rotating idler −720°/cycle)
 *  - clip bindings (AN-T/AN-O parts): GLTF clips authored to the one-cycle
 *    convention; angle maps to clip time — never wall-clock time.
 *
 * Scrub (`setAngle`) and run (`setRunning` + rpm) sample the same choreography;
 * scene progression is a pure function of angle. Ownership rule: this clock
 * owns the ROTATION channel of bound nodes (ExplodeController owns translation).
 */

export type RotationAxis = 'x' | 'y' | 'z';

const CYCLE_DEG = 720;

const AXES: Record<RotationAxis, Vector3> = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1),
};

interface RotationBinding {
  node: Object3D;
  baseQuaternion: Quaternion;
  axis: Vector3;
  degreesPerCycle: number;
  phaseDeg: number;
}

interface ClipBinding {
  mixer: AnimationMixer;
  cycleDuration: number;
}

export class CrankAngleClock {
  private angleDeg = 0;
  private running = false;
  private rpm = 300;
  private rotations: RotationBinding[] = [];
  private clips: ClipBinding[] = [];
  private static readonly tmpQuat = new Quaternion();

  getAngle(): number {
    return this.angleDeg;
  }

  /** Scrub: set the cycle position directly (lesson scrubber, tutor tool). */
  setAngle(angleDeg: number): void {
    this.angleDeg = MathUtils.euclideanModulo(angleDeg, CYCLE_DEG);
    this.apply();
  }

  isRunning(): boolean {
    return this.running;
  }

  /** Run mode: advance by rpm (default 300 — a slow, readable idle). */
  setRunning(running: boolean, rpm?: number): void {
    this.running = running;
    if (rpm !== undefined) this.rpm = Math.max(rpm, 0);
  }

  /** Tick from the render loop; advances only in run mode. Returns true if the scene moved. */
  update(deltaMs: number): boolean {
    if (!this.running || deltaMs <= 0) return false;
    // rpm → crank degrees: one revolution = 360°; the cycle wraps at 720°.
    const advance = (this.rpm / 60) * 360 * (deltaMs / 1000);
    this.angleDeg = MathUtils.euclideanModulo(this.angleDeg + advance, CYCLE_DEG);
    this.apply();
    return true;
  }

  /** AN-R binding: ratio-driven rotation about a local axis (BOM ratio metadata, executable). */
  bindRotation(
    node: Object3D,
    degreesPerCycle: number,
    axis: RotationAxis = 'y',
    phaseDeg = 0,
  ): void {
    this.rotations.push({
      node,
      baseQuaternion: node.quaternion.clone(),
      axis: AXES[axis],
      degreesPerCycle,
      phaseDeg,
    });
    this.apply();
  }

  /**
   * AN-T/AN-O binding: a mixer whose active clips are authored to the
   * one-cycle convention (clip duration spans exactly 0–720°).
   */
  bindMixer(mixer: AnimationMixer, cycleDuration: number): void {
    this.clips.push({ mixer, cycleDuration });
    this.apply();
  }

  /** Re-sample all bindings at the current angle (pure function of angle). */
  apply(): void {
    const cycleT = this.angleDeg / CYCLE_DEG;
    for (const binding of this.rotations) {
      const deg = binding.degreesPerCycle * cycleT + binding.phaseDeg;
      const q = CrankAngleClock.tmpQuat.setFromAxisAngle(binding.axis, MathUtils.degToRad(deg));
      binding.node.quaternion.copy(binding.baseQuaternion).multiply(q);
    }
    for (const clip of this.clips) {
      clip.mixer.setTime(cycleT * clip.cycleDuration);
    }
  }
}
