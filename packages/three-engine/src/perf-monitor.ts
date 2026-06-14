/**
 * PerfMonitor — frame-time instrumentation (RDM-004 TD-5 groundwork; UXD-001
 * performance floor of 30 FPS on the WebGL2 path).
 *
 * Pure and headless-testable: feed it frame deltas, read smoothed FPS, frame
 * time, and a rolling 1%-low (worst recent frame) — the metric that actually
 * exposes hitching, which average FPS hides. The viewer samples this each frame
 * and emits to the UI on an interval; the governor (post-asset) will read it to
 * bias LOD when the budget is missed.
 */
export interface PerfStats {
  fps: number;
  /** Exponentially smoothed frame time, ms. */
  frameMs: number;
  /** Worst frame in the rolling window, ms (the "1% low" felt as a hitch). */
  worstMs: number;
  /** True while sustained FPS sits below the floor — the governor's trigger. */
  belowFloor: boolean;
}

export class PerfMonitor {
  private smoothedMs = 16.67;
  private window: number[] = [];
  private readonly windowSize: number;
  private readonly smoothing: number;
  private readonly floorFps: number;

  constructor(opts: { windowSize?: number; smoothing?: number; floorFps?: number } = {}) {
    this.windowSize = opts.windowSize ?? 120; // ~2 s at 60 fps
    this.smoothing = opts.smoothing ?? 0.1;
    this.floorFps = opts.floorFps ?? 30;
  }

  /** Record one frame delta (ms). Ignores pathological deltas (tab-switch stalls). */
  sample(deltaMs: number): void {
    if (deltaMs <= 0 || deltaMs > 1000) return;
    this.smoothedMs += (deltaMs - this.smoothedMs) * this.smoothing;
    this.window.push(deltaMs);
    if (this.window.length > this.windowSize) this.window.shift();
  }

  stats(): PerfStats {
    const worstMs = this.window.length > 0 ? Math.max(...this.window) : this.smoothedMs;
    const fps = this.smoothedMs > 0 ? 1000 / this.smoothedMs : 0;
    return {
      fps: Math.round(fps),
      frameMs: Math.round(this.smoothedMs * 100) / 100,
      worstMs: Math.round(worstMs * 100) / 100,
      belowFloor: fps < this.floorFps,
    };
  }

  reset(): void {
    this.smoothedMs = 16.67;
    this.window = [];
  }
}
