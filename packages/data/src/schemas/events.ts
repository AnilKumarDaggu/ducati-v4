import { z } from 'zod';

/**
 * Domain events — the typed event bus vocabulary (ARCH-002 §2).
 * Payloads are xAPI-shaped (RDM-002 §8) so the slice's localStorage log
 * migrates to a real LRS via a mapper, not a redesign.
 */
export const DomainEvent = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('component:selected'),
    componentId: z.string(),
    timestamp: z.string().datetime(),
  }),
  z.object({
    type: z.literal('component:isolated'),
    componentId: z.string(),
    timestamp: z.string().datetime(),
  }),
  z.object({
    type: z.literal('viewmode:changed'),
    // World+representation presets per DTEA-ADR-010 (+ enginetest, the V4 dyno).
    mode: z.enum(['studio', 'officina', 'tecnico', 'xray', 'enginetest']),
    timestamp: z.string().datetime(),
  }),
  z.object({
    type: z.literal('explode:changed'),
    assemblyId: z.string(),
    level: z.number().min(0).max(1),
    timestamp: z.string().datetime(),
  }),
  z.object({
    type: z.literal('lesson:block_viewed'),
    unitId: z.string(),
    blockId: z.string(),
    timestamp: z.string().datetime(),
  }),
  z.object({
    type: z.literal('sim:step_completed'),
    stationId: z.string(),
    stepId: z.string(),
    score: z.number().min(0).max(100),
    hintCount: z.number().int().nonnegative(),
    errorCount: z.number().int().nonnegative(),
    durationMs: z.number().nonnegative(),
    timestamp: z.string().datetime(),
  }),
  z.object({
    type: z.literal('sim:error_committed'),
    stationId: z.string(),
    stepId: z.string(),
    errorId: z.string(),
    detection: z.enum(['immediate', 'inspection_caught']),
    timestamp: z.string().datetime(),
  }),
  z.object({
    type: z.literal('sim:torque_applied'),
    stepId: z.string(),
    specRef: z.string(),
    appliedNm: z.number(),
    verdict: z.enum(['under', 'in_spec', 'over', 'yield']),
    timestamp: z.string().datetime(),
  }),
  z.object({
    type: z.literal('tutor:tool_executed'),
    tool: z.string(),
    success: z.boolean(),
    timestamp: z.string().datetime(),
  }),
]);
export type DomainEvent = z.infer<typeof DomainEvent>;
export type DomainEventType = DomainEvent['type'];
