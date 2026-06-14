import { MathUtils, Quaternion, Vector3, type Object3D } from 'three';
import type { ExplodeDef } from '@dtea/data';

/**
 * ExplodeController — Esploso choreography (UXD-001 §E/§G, RDM-003 Sprint 2).
 *
 * Configuration-driven: consumes the ExplodeDef authoring format (per-component
 * parent-space offsets in mm, rotations in degrees, stagger via delay/duration
 * in seconds). One choreography serves both interactions:
 *  - setLevel(l)  — the slider scrubs the global level directly (the slider IS the hand)
 *  - playTo(l)    — timed playback over the cinematica ease, ticked by update()
 *
 * Mechanical honesty: motion only along authored paths — threads rotate out,
 * parts travel their axes; nothing arcs arbitrarily. View-mode agnostic by
 * construction (pure transforms): TECNICO edge line-work and X-ray ghosts are
 * children/materials of the same nodes and travel with them.
 */

type EaseName = 'linear' | 'power2.inOut' | 'power3.inOut' | 'cinematica';
type EaseFn = (t: number) => number;

const EASES: Record<EaseName, EaseFn> = {
  linear: (t) => t,
  'power2.inOut': (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  'power3.inOut': (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  cinematica: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

const PLAY_MS_PER_UNIT = 1200; // full 0→1 traverse matches the framing-journey tempo (UXD §G)

interface Target {
  node: Object3D;
  basePosition: Vector3;
  baseQuaternion: Quaternion;
  offset: Vector3;
  rotationRad: Vector3;
  /** Normalized stagger window within the global level [start, span]. */
  windowStart: number;
  windowSpan: number;
  ease: EaseFn;
}

export class ExplodeController {
  private targets: Target[] = [];
  private level = 0;
  private playback: { from: number; to: number; start: number; durationMs: number } | null = null;

  constructor(private readonly def: ExplodeDef) {}

  /**
   * Bind definition entries to loaded scene nodes. Missing nodes are reported,
   * not fatal — definitions may reference assets that arrive in later batches.
   */
  bind(lookup: (nodeName: string) => Object3D | undefined): { bound: number; missing: string[] } {
    const total = Math.max(...this.def.components.map((c) => c.delay + c.duration), 0.0001);
    const missing: string[] = [];
    this.targets = [];

    for (const component of this.def.components) {
      const node = lookup(component.nodeName);
      if (!node) {
        missing.push(component.nodeName);
        continue;
      }
      const rotation = component.explodeRotation ?? { x: 0, y: 0, z: 0 };
      this.targets.push({
        node,
        basePosition: node.position.clone(),
        baseQuaternion: node.quaternion.clone(),
        offset: new Vector3(component.explodeOffset.x, component.explodeOffset.y, component.explodeOffset.z),
        rotationRad: new Vector3(
          MathUtils.degToRad(rotation.x),
          MathUtils.degToRad(rotation.y),
          MathUtils.degToRad(rotation.z),
        ),
        windowStart: component.delay / total,
        windowSpan: component.duration / total,
        ease: EASES[component.ease],
      });
    }
    if (missing.length > 0) {
      console.warn('[dtea] explode: nodes not in scene (awaiting assets):', missing);
    }
    return { bound: this.targets.length, missing };
  }

  getLevel(): number {
    return this.level;
  }

  /** Immediate scrub — no easing on the global level; per-component eases still shape the choreography. */
  setLevel(level: number): void {
    this.playback = null;
    this.applyLevel(MathUtils.clamp(level, 0, 1));
  }

  /** Timed playback to a target level (explode/collapse buttons, lesson bookmarks). */
  playTo(target: number): void {
    const to = MathUtils.clamp(target, 0, 1);
    if (to === this.level) return;
    this.playback = {
      from: this.level,
      to,
      start: performance.now(),
      durationMs: Math.max(Math.abs(to - this.level) * PLAY_MS_PER_UNIT, 1),
    };
  }

  /** Tick from the render loop; returns true while a playback is active. */
  update(nowMs: number): boolean {
    if (!this.playback) return false;
    const t = MathUtils.clamp((nowMs - this.playback.start) / this.playback.durationMs, 0, 1);
    const k = EASES.cinematica(t);
    this.applyLevel(this.playback.from + (this.playback.to - this.playback.from) * k);
    if (t >= 1) this.playback = null;
    return this.playback !== null;
  }

  reset(): void {
    this.setLevel(0);
  }

  // ───────────────────────────────────────────────────────────────────────────

  private static readonly tmpQuat = new Quaternion();

  private applyLevel(level: number): void {
    this.level = level;
    for (const target of this.targets) {
      const local =
        target.windowSpan <= 0
          ? level >= target.windowStart
            ? 1
            : 0
          : MathUtils.clamp((level - target.windowStart) / target.windowSpan, 0, 1);
      const p = target.ease(local);

      target.node.position
        .copy(target.basePosition)
        .addScaledVector(target.offset, p);

      target.node.quaternion.copy(target.baseQuaternion);
      if (target.rotationRad.lengthSq() > 0) {
        const q = ExplodeController.tmpQuat;
        // Progressive rotation about local axes (thread-out motion).
        q.setFromAxisAngle(new Vector3(1, 0, 0), target.rotationRad.x * p);
        target.node.quaternion.multiply(q);
        q.setFromAxisAngle(new Vector3(0, 1, 0), target.rotationRad.y * p);
        target.node.quaternion.multiply(q);
        q.setFromAxisAngle(new Vector3(0, 0, 1), target.rotationRad.z * p);
        target.node.quaternion.multiply(q);
      }
    }
  }
}
