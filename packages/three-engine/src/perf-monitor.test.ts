import { describe, expect, it } from 'vitest';
import { PerfMonitor } from './perf-monitor.js';

describe('PerfMonitor', () => {
  it('reports ~60 FPS for 16.67ms frames', () => {
    const m = new PerfMonitor();
    for (let i = 0; i < 200; i++) m.sample(16.67);
    const s = m.stats();
    expect(s.fps).toBeGreaterThanOrEqual(59);
    expect(s.fps).toBeLessThanOrEqual(61);
    expect(s.belowFloor).toBe(false);
  });

  it('flags belowFloor when sustained frame time exceeds the 30 FPS budget', () => {
    const m = new PerfMonitor();
    for (let i = 0; i < 200; i++) m.sample(50); // 20 FPS
    const s = m.stats();
    expect(s.fps).toBeLessThan(30);
    expect(s.belowFloor).toBe(true);
  });

  it('captures the worst frame in the window (the felt hitch)', () => {
    const m = new PerfMonitor({ windowSize: 10 });
    for (let i = 0; i < 9; i++) m.sample(16);
    m.sample(120); // one big hitch
    expect(m.stats().worstMs).toBeCloseTo(120);
  });

  it('ignores pathological deltas (tab-switch stalls)', () => {
    const m = new PerfMonitor();
    for (let i = 0; i < 50; i++) m.sample(16.67);
    m.sample(5000); // ignored
    m.sample(-3); // ignored
    expect(m.stats().fps).toBeGreaterThanOrEqual(59);
  });
});
