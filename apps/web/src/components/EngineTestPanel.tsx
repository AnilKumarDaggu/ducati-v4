import type { EngineState } from '@dtea/three-engine';

/**
 * Engine Test controls (flagship). Drives the procedural V4 cutaway: start/stop,
 * RPM presets (animation scales with rpm), and a live per-cylinder 4-stroke +
 * firing readout. Honest framing: this is an EDUCATIONAL SIMULATION — real
 * slider-crank motion on representative geometry, not scanned Ducati internals.
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
  intake: 'text-verde',
  compression: 'text-grigio-300',
  power: 'text-rosso',
  exhaust: 'text-giallo',
};

interface EngineTestPanelProps {
  running: boolean;
  rpm: number;
  state: EngineState | null;
  onToggleRun: () => void;
  onRpm: (rpm: number) => void;
}

export function EngineTestPanel({ running, rpm, state, onToggleRun, onRpm }: EngineTestPanelProps) {
  return (
    <div className="panel absolute bottom-5 left-5 z-10 w-72 rounded-xl border p-4 text-grigio-100">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="display-caps text-[10px] tracking-[0.2em] text-rosso">Engine Test</p>
          <p className="display text-sm text-white">Granturismo V4 · dyno</p>
        </div>
        <span className="data text-right">
          <span className="text-2xl font-semibold text-white">{rpm.toLocaleString()}</span>
          <span className="block text-[9px] text-grigio-400">RPM</span>
        </span>
      </div>

      <button
        data-testid="engine-run"
        aria-pressed={running}
        onClick={onToggleRun}
        className={`ui-move mb-3 w-full rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
          running ? 'bg-rosso text-white hover:bg-rosso-scuro' : 'bg-verde text-white hover:opacity-90'
        }`}
      >
        {running ? '■ Stop Engine' : '▶ Start Engine'}
      </button>

      <div className="mb-3 grid grid-cols-3 gap-1.5">
        {RPM_PRESETS.map((p) => (
          <button
            key={p.rpm}
            data-testid={`rpm-${p.rpm}`}
            onClick={() => onRpm(p.rpm)}
            className={`ui-move rounded px-2 py-1.5 text-[11px] font-medium transition-colors ${
              rpm === p.rpm
                ? 'bg-white text-nero'
                : p.redline
                  ? 'bg-rosso/20 text-rosso hover:bg-rosso/30'
                  : 'bg-white/10 text-grigio-200 hover:bg-white/20'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div>
        <p className="display-caps mb-1.5 text-[9px] tracking-[0.16em] text-grigio-400">
          Four-stroke cycle · per cylinder
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {(state?.cylinders ?? []).map((c) => (
            <div
              key={c.index}
              className={`flex items-center justify-between rounded px-2 py-1 text-[11px] ${
                c.firing ? 'bg-rosso/25' : 'bg-white/5'
              }`}
            >
              <span className="data text-grigio-300">
                {c.bank === 'front' ? 'F' : 'R'}
                {c.index}
              </span>
              <span className={`font-medium capitalize ${STROKE_COLOR[c.stroke] ?? 'text-grigio-200'}`}>
                {c.stroke}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[9px] leading-relaxed text-grigio-500">
          Educational simulation — real slider-crank motion on representative geometry.
          Crank phasing is even-fire (representative), not the exact Desmosedici Twin-Pulse crank.
        </p>
      </div>
    </div>
  );
}
