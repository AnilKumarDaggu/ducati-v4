import { describe, expect, it } from 'vitest';
import { REWORK_CAP, scoreStation, type StepOutcome } from './scoring.js';

const perfectTorque: StepOutcome = {
  stepId: 's1',
  action: 'torque',
  processCorrect: true,
  torqueAccuracy: 1,
  hintsUsed: 0,
  durationMs: 1000,
  errorsCommitted: 0,
};

describe('scoreStation (SIM-001 §3.6)', () => {
  it('is byte-reproducible: identical outcomes → identical score', () => {
    const a = scoreStation([perfectTorque]);
    const b = scoreStation([{ ...perfectTorque }]);
    expect(a).toEqual(b);
  });

  it('awards near-100 for a flawless single-step station', () => {
    const score = scoreStation([perfectTorque]);
    expect(score.total).toBe(100);
    expect(score.status).toBe('pass');
  });

  it('re-weights over applicable dimensions only (no torque step ≠ penalty)', () => {
    const inspect: StepOutcome = {
      stepId: 's1',
      action: 'inspect',
      processCorrect: true,
      inspectionPerformed: true,
      hintsUsed: 0,
      durationMs: 500,
      errorsCommitted: 0,
    };
    expect(scoreStation([inspect]).total).toBe(100);
  });

  it('caps at REWORK on a critical fail and flags the step', () => {
    const score = scoreStation([{ ...perfectTorque, criticalFail: true }]);
    expect(score.total).toBeLessThanOrEqual(REWORK_CAP);
    expect(score.status).toBe('rework');
    expect(score.criticalFails).toEqual(['s1']);
  });

  it('penalizes hints via the independence dimension', () => {
    const clean = scoreStation([perfectTorque]).total;
    const hinted = scoreStation([{ ...perfectTorque, hintsUsed: 3 }]).total;
    expect(hinted).toBeLessThan(clean);
  });

  it('scores the time dimension only when a target is provided', () => {
    const withTarget = scoreStation([perfectTorque], { targetMs: 1000 });
    const timeDim = withTarget.breakdown.find((b) => b.dimension === 'time');
    expect(timeDim?.applicable).toBe(true);
    const without = scoreStation([perfectTorque]);
    expect(without.breakdown.find((b) => b.dimension === 'time')?.applicable).toBe(false);
  });

  it('always returns a full decomposition (transparency, LXD-001 §5)', () => {
    const score = scoreStation([perfectTorque]);
    expect(score.breakdown).toHaveLength(7);
  });
});
