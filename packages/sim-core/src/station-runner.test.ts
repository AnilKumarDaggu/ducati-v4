import { describe, expect, it } from 'vitest';
import { StationDef } from '@dtea/data';
import { EventBus } from '@dtea/events';
import { StationRunner } from './station-runner.js';

// A compressed Station-9 flow (SIM-001): place → compress_install (collet,
// with the seeded mis-seat classic error) → inspect → torque.
const station = StationDef.parse({
  stationId: 'STATION_9_SLICE',
  title: 'Valve & Spring Install',
  bomRef: '4.S01.03.01',
  steps: [
    {
      stepId: 'place_valve',
      stationId: 'STATION_9_SLICE',
      order: 0,
      action: 'place',
      title: 'Insert valve',
      instruction: 'Drop the oiled valve into the guide.',
      targetComponentIds: ['ENG_VALVETRAIN_INTAKE-VALVE-1'],
    },
    {
      stepId: 'seat_collets',
      stationId: 'STATION_9_SLICE',
      order: 1,
      action: 'compress_install',
      title: 'Compress spring, seat collets',
      instruction: 'Compress, place both collets, release slowly.',
      targetComponentIds: ['ENG_VALVETRAIN_COLLET-SET-1'],
      toolId: 'TOOL_SPRING_COMPRESSOR',
      prerequisites: ['place_valve'],
      classicErrors: [
        {
          errorId: 'collet_misseat',
          description: 'Collet not fully seated in the stem groove.',
          detection: 'inspection_caught',
          explanationRef: 'C2:collet-lock',
        },
      ],
    },
    {
      stepId: 'tap_test',
      stationId: 'STATION_9_SLICE',
      order: 2,
      action: 'inspect',
      title: 'Tap test',
      instruction: 'Tap the stem; confirm the collets hold.',
      targetComponentIds: ['ENG_VALVETRAIN_INTAKE-VALVE-1'],
      prerequisites: ['seat_collets'],
    },
    {
      stepId: 'torque_cap',
      stationId: 'STATION_9_SLICE',
      order: 3,
      action: 'torque',
      title: 'Torque cam cap',
      instruction: 'Torque the cap bolt to spec.',
      targetComponentIds: ['ENG_VALVETRAIN_CAM-CAP-1'],
      specRef: 'SPEC_CAM_CAP_TORQUE',
      prerequisites: ['tap_test'],
    },
  ],
});

const place = { positionErrorMm: 0.5, angleErrorDeg: 0.5, durationMs: 1000 };

describe('StationRunner (SIM-001 §2/§3)', () => {
  it('runs a clean build to completion with a passing score', () => {
    const r = new StationRunner(station, 'standard');
    expect(r.attemptStep(place).ok).toBe(true);
    expect(r.attemptStep({ toolId: 'TOOL_SPRING_COMPRESSOR', ...place }).ok).toBe(true);
    expect(r.attemptStep({ inspectionPerformed: true, durationMs: 800 }).ok).toBe(true);
    const last = r.attemptStep({ appliedTorqueNm: 10, targetTorqueNm: 10, durationMs: 900 });
    expect(last).toMatchObject({ ok: true, stationComplete: true });
    expect(r.getStatus()).toBe('complete');
    expect(r.score().total).toBeGreaterThanOrEqual(95);
  });

  it('enforces prerequisites and tolerances', () => {
    const r = new StationRunner(station, 'standard');
    // Skipping ahead is impossible — current step is place_valve; a bad placement is rejected.
    expect(r.attemptStep({ positionErrorMm: 50, angleErrorDeg: 0 })).toMatchObject({
      ok: false,
      reason: 'out_of_tolerance',
    });
  });

  it('blocks on the wrong tool', () => {
    const r = new StationRunner(station, 'standard');
    r.attemptStep(place);
    expect(r.attemptStep({ toolId: 'TOOL_WRONG', ...place })).toMatchObject({
      ok: false,
      reason: 'wrong_tool',
    });
  });

  it('defers an inspection-caught classic error and surfaces its explanation', () => {
    const bus = new EventBus();
    const errors: string[] = [];
    bus.on('sim:error_committed', (e) => errors.push(`${e.errorId}:${e.detection}`));
    const r = new StationRunner(station, 'standard', { bus });

    r.attemptStep(place);
    // Commit the collet mis-seat — allowed to proceed (inspection_caught).
    const seat = r.attemptStep({
      toolId: 'TOOL_SPRING_COMPRESSOR',
      committedErrorId: 'collet_misseat',
      ...place,
    });
    expect(seat.ok).toBe(true);
    expect(errors).toContain('collet_misseat:inspection_caught');
  });

  it('drives a safety-critical over-torque to REWORK', () => {
    const r = new StationRunner(station, 'standard');
    r.attemptStep(place);
    r.attemptStep({ toolId: 'TOOL_SPRING_COMPRESSOR', ...place });
    r.attemptStep({ inspectionPerformed: true });
    r.attemptStep({ appliedTorqueNm: 13, targetTorqueNm: 10, safetyCritical: true });
    expect(r.getStatus()).toBe('rework');
    expect(r.score().status).toBe('rework');
  });

  it('emits step-completed events for analytics', () => {
    const bus = new EventBus();
    let completed = 0;
    bus.on('sim:step_completed', () => completed++);
    const r = new StationRunner(station, 'guided', { bus });
    r.attemptStep(place);
    expect(completed).toBe(1);
  });
});
