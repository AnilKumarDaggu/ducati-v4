import { describe, expect, it } from 'vitest';
import {
  TUTOR_TOOLS,
  TUTOR_TOOL_ARGS,
  validateToolArgs,
  type TutorToolName,
} from './tutor-tools.js';

describe('tutor tool contracts (PRD P6, ARCH-001 §5.3)', () => {
  it('defines exactly the six signature scene-control tools', () => {
    const names = TUTOR_TOOLS.map((t) => t.name).sort();
    expect(names).toEqual(
      [
        'highlight_component',
        'navigate_to',
        'open_spec',
        'set_crank_angle',
        'set_view_mode',
        'trigger_explode',
      ].sort(),
    );
  });

  it('every tool definition has a runtime validator', () => {
    for (const tool of TUTOR_TOOLS) {
      expect(TUTOR_TOOL_ARGS[tool.name]).toBeDefined();
    }
  });

  it('validates correct args and rejects malformed ones', () => {
    expect(validateToolArgs('set_view_mode', { mode: 'tecnico' })).toEqual({ mode: 'tecnico' });
    expect(() => validateToolArgs('set_view_mode', { mode: 'hologram' })).toThrow();
    expect(() => validateToolArgs('trigger_explode', { level: 5 })).toThrow(); // >1
    expect(() => validateToolArgs('set_crank_angle', { angleDeg: 900 })).toThrow(); // >720
  });

  it('every Anthropic definition declares its required object schema', () => {
    for (const tool of TUTOR_TOOLS) {
      expect(tool.input_schema.type).toBe('object');
      expect(tool.input_schema.required.length).toBeGreaterThanOrEqual(1);
      for (const key of tool.input_schema.required) {
        expect(tool.input_schema.properties[key]).toBeDefined();
      }
    }
  });

  it('tool names are a closed set (type guard sanity)', () => {
    const names = Object.keys(TUTOR_TOOL_ARGS) as TutorToolName[];
    expect(names).toContain('navigate_to');
  });
});
