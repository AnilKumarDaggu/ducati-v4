import { z } from 'zod';

/**
 * Tutor scene-control tool contracts (ARCH-001 §5.3, PRD P6, ADR-012 imperative
 * handle). The shared agreement between the stateless proxy (which hands these
 * to Claude as tool definitions) and the client (which executes them against the
 * EsploraHandle and returns the resulting scene state to re-ground the model).
 *
 * Pure schemas — no API key, no network. The actual Claude call is Sprint 4;
 * these contracts are buildable and testable now.
 */

export const NavigateToArgs = z.object({ bomId: z.string() });
export const HighlightComponentArgs = z.object({ bomId: z.string() });
export const SetViewModeArgs = z.object({
  mode: z.enum(['studio', 'officina', 'tecnico', 'xray']),
});
export const TriggerExplodeArgs = z.object({ level: z.number().min(0).max(1) });
export const SetCrankAngleArgs = z.object({ angleDeg: z.number().min(0).max(720) });
export const OpenSpecArgs = z.object({ specId: z.string() });

/** Runtime validators keyed by tool name (client validates before executing). */
export const TUTOR_TOOL_ARGS = {
  navigate_to: NavigateToArgs,
  highlight_component: HighlightComponentArgs,
  set_view_mode: SetViewModeArgs,
  trigger_explode: TriggerExplodeArgs,
  set_crank_angle: SetCrankAngleArgs,
  open_spec: OpenSpecArgs,
} as const;

export type TutorToolName = keyof typeof TUTOR_TOOL_ARGS;

/** Anthropic tool-use definition shape (proxy passes these to the API). */
export interface TutorToolDefinition {
  name: TutorToolName;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

/** The six tools, as Anthropic tool definitions (UXD-001 §B, the signature AI feature). */
export const TUTOR_TOOLS: TutorToolDefinition[] = [
  {
    name: 'navigate_to',
    description: 'Select and frame a component by its BOM id, navigating the URL to it.',
    input_schema: {
      type: 'object',
      properties: { bomId: { type: 'string', description: 'BOM component id, e.g. ENG_VALVETRAIN_INTAKE-VALVE-1' } },
      required: ['bomId'],
    },
  },
  {
    name: 'highlight_component',
    description: 'Highlight a component without changing the camera (point while explaining).',
    input_schema: {
      type: 'object',
      properties: { bomId: { type: 'string' } },
      required: ['bomId'],
    },
  },
  {
    name: 'set_view_mode',
    description: 'Switch the world+representation preset: studio, officina, tecnico, or xray.',
    input_schema: {
      type: 'object',
      properties: { mode: { type: 'string', enum: ['studio', 'officina', 'tecnico', 'xray'] } },
      required: ['mode'],
    },
  },
  {
    name: 'trigger_explode',
    description: 'Set the exploded-view level from 0 (assembled) to 1 (fully exploded).',
    input_schema: {
      type: 'object',
      properties: { level: { type: 'number', minimum: 0, maximum: 1 } },
      required: ['level'],
    },
  },
  {
    name: 'set_crank_angle',
    description: 'Set the crank-angle clock, 0–720°, to show the engine cycle at a position.',
    input_schema: {
      type: 'object',
      properties: { angleDeg: { type: 'number', minimum: 0, maximum: 720 } },
      required: ['angleDeg'],
    },
  },
  {
    name: 'open_spec',
    description: 'Open a specification record by id in the technical card (cite a value).',
    input_schema: {
      type: 'object',
      properties: { specId: { type: 'string' } },
      required: ['specId'],
    },
  },
];

/** Validate a tool call's arguments against its contract. Throws on mismatch. */
export function validateToolArgs(name: TutorToolName, args: unknown): unknown {
  return TUTOR_TOOL_ARGS[name].parse(args);
}
