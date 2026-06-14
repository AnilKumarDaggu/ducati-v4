import { z } from 'zod';

/**
 * Scene bookmark — a lesson block can pin viewer state (ARCH-002 §4: LessonUnit).
 * The lesson player applies these as the learner scrolls (RDM-002 screen 3).
 */
export const SceneBookmark = z.object({
  cameraTarget: z.string().optional(), // componentId to frame
  explode: z.object({ assemblyId: z.string(), level: z.number().min(0).max(1) }).optional(),
  // World+representation presets per DTEA-ADR-010.
  viewMode: z.enum(['studio', 'officina', 'tecnico', 'xray']).optional(),
  camAngleDeg: z.number().min(0).max(720).optional(), // CrankAngleClock position
  playClip: z.string().optional(),
});
export type SceneBookmark = z.infer<typeof SceneBookmark>;

export const LessonBlock = z.object({
  blockId: z.string(),
  markdown: z.string(),
  bookmark: SceneBookmark.optional(),
});

export const LessonUnit = z.object({
  unitId: z.string(),
  title: z.string(),
  moduleRef: z.string(), // e.g. "C2"
  blocks: z.array(LessonBlock).min(1),
});
export type LessonUnit = z.infer<typeof LessonUnit>;
