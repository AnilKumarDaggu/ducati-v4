import { z } from 'zod';
import { SourceCitation } from './component.js';

/**
 * Verification status — the PL/⚠ regime as data (ARCH-002 §5).
 * UI must badge anything that is not `verified`; certification modes (post-slice)
 * block on unresolved placeholders (SIM-001 §6 rule extension).
 */
export const VerificationStatus = z.enum(['verified', 'placeholder_PL', 'flagged']);
export type VerificationStatus = z.infer<typeof VerificationStatus>;

const TorqueStage = z.object({
  stage: z.number().int().positive(),
  /** Either a torque value in Nm or an angle step in degrees. */
  torqueNm: z.number().positive().optional(),
  angleDeg: z.number().positive().optional(),
  notes: z.string().optional(),
});

export const SpecRecord = z.object({
  specId: z.string(),
  type: z.enum(['torque', 'clearance', 'dimension', 'consumable', 'procedure_value']),
  displayName: z.string(),
  /** Single value or min/max band, unit-qualified. */
  value: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  unit: z.string(),
  stages: z.array(TorqueStage).optional(),
  sequenceNote: z.string().optional(),
  lubricationState: z.string().optional(),
  reusePolicy: z.string().optional(),
  verificationStatus: VerificationStatus,
  citation: SourceCitation.optional(),
});
export type SpecRecord = z.infer<typeof SpecRecord>;

export const SpecStore = z.array(SpecRecord);
