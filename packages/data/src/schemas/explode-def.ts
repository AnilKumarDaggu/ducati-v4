import { z } from 'zod';

/**
 * Explode definition — ARCH-001 explode-data format (offsets external to GLB, never baked).
 *
 * Authoring contract (consumed by three-engine ExplodeController):
 * - `explodeOffset`: millimetres, in the node's PARENT space (mechanical paths
 *   are authored along real axes — Mechanical Honesty Principle, UXD-001 §G)
 * - `explodeRotation`: DEGREES, applied progressively with level (e.g. a bolt
 *   unthreading: rotation.y = -1440 over its travel)
 * - `duration`/`delay`: SECONDS, defining the stagger window; the controller
 *   normalizes them so both scrubbing and timed playback share one choreography
 * - `ease`: one of 'linear' | 'power2.inOut' | 'power3.inOut' | 'cinematica'
 */
const Vec3 = z.object({ x: z.number(), y: z.number(), z: z.number() });

export const ExplodeComponent = z.object({
  nodeName: z.string(), // must equal a componentId / GLTF node name
  explodeOffset: Vec3,
  explodeRotation: Vec3.optional(),
  duration: z.number().positive().default(1.0),
  ease: z.enum(['linear', 'power2.inOut', 'power3.inOut', 'cinematica']).default('power2.inOut'),
  delay: z.number().nonnegative().default(0),
});

export const ExplodeDef = z.object({
  explodeId: z.string(),
  assemblyId: z.string(),
  epicenter: Vec3,
  components: z.array(ExplodeComponent).min(1),
});
export type ExplodeDef = z.infer<typeof ExplodeDef>;
