import type { EngineState } from '@dtea/three-engine';

/**
 * Engine Test Console — the right-panel control surface (replaces the floating
 * overlay so the viewport stays fully dedicated to the engine). Ducati-grade:
 * dark technical ground, rosso accents, high-contrast white type, minimal
 * controls. Drives the procedural V4 (educational simulation).
 */

const RPM_PRESETS: Array<{ label: string; rpm: number; redline?: boolean }> = [
  { label: 'Idle', rpm: 1200 },
  { label: '3,000', rpm: 3000 },
  { label: '6,000', rpm: 6000 },
  { label: '9,000', rpm: 9000 },
  { label: '12,000', rpm: 12000 },
  { label: 'Redline', rpm: 14000, redline: true },
];

const STROKE_COLOR: Record<string, string> = {
  intake: 'text-[#5fa8ff]',
  compression: 'text-grigio-300',
  power: 'text-rosso',
  exhaust: 'text-giallo',
};

export interface ConsoleToggles {
  combustion: boolean;
  cutaway: boolean;
  air: boolean;
  fuel: boolean;
  oil: boolean;
  sound: boolean;
}

interface EngineConsoleProps {
  running: boolean;
  rpm: number;
  state: EngineState | null;
  toggles: ConsoleToggles;
  onToggleRun: () => void;
  onRpm: (rpm: number) => void;
  onToggle: (key: keyof ConsoleToggles, value: boolean) => void;
}

const REDLINE = 14000;

export function EngineConsole({
  running,
  rpm,
  state,
  toggles,
  onToggleRun,
  onRpm,
  onToggle,
}: EngineConsoleProps) {
  const sweep = Math.min(rpm / REDLINE, 1);

  return (
    <aside
      className="z-10 hidden w-80 shrink-0 overflow-y-auto border-l border-white/10 bg-nero text-white md:block xl:w-96"
      aria-label="Engine Test console"
    >
      <div className="p-5">
        <p className="display-caps text-[10px] tracking-[0.24em] text-rosso">Engine Test</p>
        <h2 className="display text-xl text-white">Granturismo V4</h2>
        <p className="text-[11px] text-grigio-400">Dyno cell · educational simulation</p>

        {/* RPM readout + sweep */}
        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-baseline justify-between">
            <span className="data text-4xl font-semibold tabular-nums text-white">
              {rpm.toLocaleString()}
            </span>
            <span className="display-caps text-[10px] tracking-[0.2em] text-grigio-400">rpm</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-[width] duration-200"
              style={{
                width: `${sweep * 100}%`,
                background: sweep > 0.82 ? 'var(--color-rosso)' : '#e6e6e6',
              }}
            />
          </div>
        </div>

        {/* Start / Stop */}
        <button
          data-testid="engine-run"
          aria-pressed={running}
          onClick={onToggleRun}
          className={`ui-move mt-4 w-full rounded-lg px-4 py-3 text-sm font-bold tracking-wide transition-colors ${
            running
              ? 'bg-rosso text-white hover:bg-rosso-scuro'
              : 'bg-verde text-white hover:brightness-110'
          }`}
        >
          {running ? '■  STOP ENGINE' : '▶  START ENGINE'}
        </button>

        {/* RPM slider */}
        <div className="mt-5">
          <p className="display-caps mb-2 text-[9px] tracking-[0.18em] text-grigio-400">Throttle</p>
          <input
            data-testid="rpm-slider"
            type="range"
            min={1000}
            max={REDLINE}
            step={100}
            value={rpm}
            onChange={(e) => onRpm(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-rosso"
            aria-label="Engine RPM"
          />
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {RPM_PRESETS.map((p) => (
              <button
                key={p.rpm}
                data-testid={`rpm-${p.rpm}`}
                onClick={() => onRpm(p.rpm)}
                className={`ui-move rounded px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                  rpm === p.rpm
                    ? 'bg-white text-nero'
                    : p.redline
                      ? 'bg-rosso/20 text-rosso hover:bg-rosso/30'
                      : 'bg-white/8 text-grigio-200 hover:bg-white/16'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* System visualizations */}
        <div className="mt-6">
          <p className="display-caps mb-2 text-[9px] tracking-[0.18em] text-grigio-400">
            Systems
          </p>
          <div className="space-y-1.5">
            <ToggleRow label="Combustion" dot="#ff5a1e" on={toggles.combustion} onChange={(v) => onToggle('combustion', v)} testid="toggle-combustion" />
            <ToggleRow label="Cutaway" dot="#8fb8d8" on={toggles.cutaway} onChange={(v) => onToggle('cutaway', v)} testid="toggle-cutaway" />
            <ToggleRow label="Airflow" dot="#5fa8ff" on={toggles.air} onChange={(v) => onToggle('air', v)} testid="toggle-air" />
            <ToggleRow label="Fuel flow" dot="#ff5a3c" on={toggles.fuel} onChange={(v) => onToggle('fuel', v)} testid="toggle-fuel" />
            <ToggleRow label="Oil circulation" dot="#e0a022" on={toggles.oil} onChange={(v) => onToggle('oil', v)} testid="toggle-oil" />
          </div>
        </div>

        {/* Audio */}
        <div className="mt-6">
          <p className="display-caps mb-2 text-[9px] tracking-[0.18em] text-grigio-400">Audio</p>
          <ToggleRow
            label={toggles.sound ? 'Engine sound' : 'Engine sound · muted'}
            dot="#ff2a1e"
            on={toggles.sound}
            onChange={(v) => onToggle('sound', v)}
            testid="toggle-sound"
          />
          <p className="mt-1.5 text-[9px] leading-relaxed text-grigio-500">
            Synthesized V4 voice (not a recording) — pitch &amp; tone track the RPM.
          </p>
        </div>

        {/* Live four-stroke */}
        <div className="mt-6">
          <p className="display-caps mb-2 text-[9px] tracking-[0.18em] text-grigio-400">
            Four-stroke · per cylinder
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {(state?.cylinders ?? []).map((c) => (
              <div
                key={c.index}
                className={`flex items-center justify-between rounded px-2.5 py-1.5 text-[11px] transition-colors ${
                  c.firing ? 'bg-rosso/30' : 'bg-white/5'
                }`}
              >
                <span className="data text-grigio-400">
                  {c.bank === 'front' ? 'F' : 'R'}
                  {c.index}
                </span>
                <span className={`font-semibold capitalize ${STROKE_COLOR[c.stroke] ?? 'text-grigio-200'}`}>
                  {c.stroke}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[9px] leading-relaxed text-grigio-500">
          Educational simulation — real slider-crank motion on representative geometry.
          Crank phasing is even-fire (representative), not the exact Desmosedici Twin-Pulse crank.
          Flow paths are illustrative, not CFD.
        </p>
      </div>
    </aside>
  );
}

function ToggleRow({
  label,
  dot,
  on,
  onChange,
  testid,
}: {
  label: string;
  dot: string;
  on: boolean;
  onChange: (v: boolean) => void;
  testid: string;
}) {
  return (
    <button
      data-testid={testid}
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={`ui-move flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-[13px] transition-colors ${
        on ? 'border-white/20 bg-white/[0.06] text-white' : 'border-white/8 text-grigio-400 hover:bg-white/[0.03]'
      }`}
    >
      <span className="flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full" style={{ background: on ? dot : '#3a3a3e' }} />
        {label}
      </span>
      <span
        className={`relative h-4 w-7 rounded-full transition-colors ${on ? 'bg-rosso' : 'bg-white/15'}`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${on ? 'left-3.5' : 'left-0.5'}`}
        />
      </span>
    </button>
  );
}
