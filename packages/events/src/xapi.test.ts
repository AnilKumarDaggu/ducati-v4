import { describe, expect, it } from 'vitest';
import type { DomainEvent } from '@dtea/data';
import { toXapiStatement, type XapiActor } from './xapi.js';

const actor: XapiActor = { name: 'anon-local-1' };
const ts = '2026-06-13T10:00:00.000Z';

describe('toXapiStatement (RDM-002 §8 analytics migration path)', () => {
  it('maps a step completion to a completed statement with score and duration', () => {
    const event: DomainEvent = {
      type: 'sim:step_completed',
      stationId: 'STATION_9_SLICE',
      stepId: 'seat_collets',
      score: 92,
      hintCount: 1,
      errorCount: 0,
      durationMs: 4200,
      timestamp: ts,
    };
    const s = toXapiStatement(event, actor);
    expect(s.verb.id).toMatch(/completed$/);
    expect(s.result?.score?.raw).toBe(92);
    expect(s.result?.duration).toBe('PT4.20S');
    expect(s.object.id).toContain('STATION_9_SLICE');
    expect(s.actor.name).toBe('anon-local-1');
    expect(s.timestamp).toBe(ts);
  });

  it('maps a committed error to a failed statement carrying detection mode', () => {
    const event: DomainEvent = {
      type: 'sim:error_committed',
      stationId: 'STATION_9_SLICE',
      stepId: 'seat_collets',
      errorId: 'collet_misseat',
      detection: 'inspection_caught',
      timestamp: ts,
    };
    const s = toXapiStatement(event, actor);
    expect(s.verb.id).toMatch(/failed$/);
    expect(s.result?.success).toBe(false);
    expect(JSON.stringify(s.context)).toContain('inspection_caught');
  });

  it('maps every domain-event type without throwing (exhaustive)', () => {
    const samples: DomainEvent[] = [
      { type: 'component:selected', componentId: 'X', timestamp: ts },
      { type: 'component:isolated', componentId: 'X', timestamp: ts },
      { type: 'viewmode:changed', mode: 'tecnico', timestamp: ts },
      { type: 'explode:changed', assemblyId: 'A', level: 0.5, timestamp: ts },
      { type: 'lesson:block_viewed', unitId: 'C2', blockId: 'b1', timestamp: ts },
      { type: 'sim:torque_applied', stepId: 's', specRef: 'SPEC', appliedNm: 10, verdict: 'in_spec', timestamp: ts },
      { type: 'tutor:tool_executed', tool: 'highlight_component', success: true, timestamp: ts },
    ];
    for (const e of samples) {
      const s = toXapiStatement(e, actor);
      expect(s.actor.objectType).toBe('Agent');
      expect(s.verb.id).toMatch(/^http/);
      expect(s.object.id).toMatch(/^http/);
    }
  });
});
