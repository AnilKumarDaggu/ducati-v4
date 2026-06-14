import { z } from 'zod';

/** Difficulty modes per SIM-001 §2.3 / RDM-002 (slice ships guided + standard only). */
export const Difficulty = z.enum(['guided', 'standard']);
export type Difficulty = z.infer<typeof Difficulty>;

const ToleranceProfile = z.object({
  positionMm: z.number().positive(),
  angleDeg: z.number().positive(),
  autoSnapMm: z.number().positive().optional(), // guided only
});

/** Classic-error trigger per BOM-001 rule 5 — seeded wrong-states the simulator must detect. */
const ClassicError = z.object({
  errorId: z.string(),
  description: z.string(),
  detection: z.enum(['immediate', 'inspection_caught']), // 'latent' arrives post-slice (RDM-002 §4)
  explanationRef: z.string(),
});

export const StepAction = z.enum([
  'clean',
  'place',
  'orient',
  'apply_consumable',
  'compress_install', // the spring-compressor precision mechanic
  'torque',
  'measure',
  'inspect',
]);
export type StepAction = z.infer<typeof StepAction>;

export const StepDef = z.object({
  stepId: z.string(),
  stationId: z.string(),
  order: z.number().int().nonnegative(),
  action: StepAction,
  title: z.string(),
  instruction: z.string(),
  targetComponentIds: z.array(z.string()).min(1),
  toolId: z.string().optional(),
  consumableId: z.string().optional(),
  /** FK into spec store — torque/clearance acceptance values live there, never here (BOM-001 rule 2). */
  specRef: z.string().optional(),
  tolerances: z.record(Difficulty, ToleranceProfile).optional(),
  classicErrors: z.array(ClassicError).default([]),
  /** Scoring weights per SIM-001 §3.6; station-level defaults apply when omitted. */
  scoringWeights: z
    .object({
      torque: z.number().optional(),
      process: z.number().optional(),
      fitment: z.number().optional(),
      lubrication: z.number().optional(),
      inspection: z.number().optional(),
    })
    .optional(),
  prerequisites: z.array(z.string()).default([]),
});
export type StepDef = z.infer<typeof StepDef>;

export const StationDef = z.object({
  stationId: z.string(),
  title: z.string(),
  bomRef: z.string(),
  steps: z.array(StepDef).min(1),
});
export type StationDef = z.infer<typeof StationDef>;
