import type { PerfStats } from '@dtea/three-engine';

/**
 * Performance HUD (dev tooling, UXD-001 30 FPS floor). Toggle with the `perf`
 * query flag (?perf=1). Colour follows the floor: verde ≥55, giallo ≥30, rosso below.
 */
export function PerfHud({ stats }: { stats: PerfStats | null }) {
  if (!stats) return null;
  const color =
    stats.fps >= 55 ? 'text-verde' : stats.fps >= 30 ? 'text-giallo' : 'text-rosso';
  return (
    <div
      data-testid="perf-hud"
      className="panel pointer-events-none absolute left-4 top-4 z-10 rounded border px-2.5 py-1.5"
    >
      <p className={`data text-[11px] font-semibold ${color}`}>{stats.fps} FPS</p>
      <p className="data text-[9px] text-grigio-500">
        {stats.frameMs.toFixed(1)}ms · worst {stats.worstMs.toFixed(0)}ms
      </p>
    </div>
  );
}
