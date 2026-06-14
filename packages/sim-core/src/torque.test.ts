import { describe, expect, it } from 'vitest';
import { torqueVerdict } from './torque.js';

describe('torqueVerdict (SIM-001 §3.1)', () => {
  it('peaks at target', () => {
    const r = torqueVerdict(10, 10);
    expect(r.verdict).toBe('in_spec');
    expect(r.accuracy).toBeCloseTo(1);
    expect(r.yielded).toBe(false);
  });

  it('flags under-torque below 80%', () => {
    expect(torqueVerdict(7, 10).verdict).toBe('under');
  });

  it('flags over in the upper band but not yielded', () => {
    const r = torqueVerdict(10.8, 10); // 108%
    expect(r.verdict).toBe('over');
    expect(r.yielded).toBe(false);
  });

  it('yields above 110% with zero accuracy', () => {
    const r = torqueVerdict(12, 10);
    expect(r.verdict).toBe('yield');
    expect(r.accuracy).toBe(0);
    expect(r.yielded).toBe(true);
  });
});
