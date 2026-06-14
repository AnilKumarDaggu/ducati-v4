import type { ViewMode } from '@dtea/three-engine';
import { useView } from '../stores/view';

const MODES: Array<{ id: ViewMode; label: string; hint: string }> = [
  { id: 'studio', label: 'Studio', hint: 'Photoreal — the white cove' },
  { id: 'officina', label: 'Officina', hint: 'The workshop, under the task light' },
  { id: 'tecnico', label: 'Tecnico', hint: 'Drawing-office schematic' },
  { id: 'xray', label: 'X-Ray', hint: 'Ghost the shell, reveal the mechanicals' },
  { id: 'enginetest', label: 'Engine Test', hint: 'Run the V4 on the dyno (educational simulation)' },
];

interface ModeDockProps {
  onChange: (mode: ViewMode) => void;
  onExplodeScrub: (level: number) => void;
  onExplodePlay: (target: number) => void;
  onCrankScrub: (angleDeg: number) => void;
  onCrankRun: (running: boolean) => void;
  /** Ciclo + Esploso are engine concepts; hidden for the motorcycle showcase. */
  showEngineControls?: boolean;
}

/**
 * Mode dock (UXD-001 §B): bottom-center control cluster over the stage —
 * view-mode presets (ADR-010), the Esploso slider, and the Ciclo scrubber
 * (the global 0–720° crank-angle clock, ADR-011).
 */
export function ModeDock({
  onChange,
  onExplodeScrub,
  onExplodePlay,
  onCrankScrub,
  onCrankRun,
  showEngineControls = true,
}: ModeDockProps) {
  const {
    mode,
    setMode,
    explodeLevel,
    setExplodeLevel,
    crankAngle,
    setCrankAngle,
    crankRunning,
    setCrankRunning,
  } = useView();

  return (
    <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
      {showEngineControls && (
      <>
      <div className="panel flex items-center gap-2 rounded-full border py-1 pl-4 pr-1 shadow-lg shadow-black/5">
        <span className="display-caps text-[9px] tracking-[0.18em] text-grigio-400">Ciclo</span>
        <input
          data-testid="crank-slider"
          type="range"
          min={0}
          max={720}
          value={Math.round(crankAngle)}
          disabled={crankRunning}
          onChange={(e) => {
            const angle = Number(e.target.value);
            setCrankAngle(angle);
            onCrankScrub(angle);
          }}
          className="h-1 w-36 cursor-pointer accent-rosso disabled:opacity-40"
          aria-label="Crank angle, degrees"
        />
        <span className="data w-12 text-right text-[10px] text-grigio-500">
          {Math.round(crankAngle)}°
        </span>
        <button
          data-testid="crank-run"
          aria-pressed={crankRunning}
          onClick={() => {
            const next = !crankRunning;
            setCrankRunning(next);
            onCrankRun(next);
          }}
          className={`ui-move rounded-full px-3 py-1.5 text-xs transition-colors ${
            crankRunning
              ? 'bg-nero font-semibold text-white'
              : 'text-grigio-600 hover:bg-grigio-100 hover:text-nero'
          }`}
        >
          {crankRunning ? 'Pausa' : 'Avvia'}
        </button>
      </div>

      <div className="panel flex items-center gap-2 rounded-full border py-1 pl-4 pr-1 shadow-lg shadow-black/5">
        <span className="display-caps text-[9px] tracking-[0.18em] text-grigio-400">Esploso</span>
        <input
          data-testid="explode-slider"
          type="range"
          min={0}
          max={100}
          value={Math.round(explodeLevel * 100)}
          onChange={(e) => {
            const level = Number(e.target.value) / 100;
            setExplodeLevel(level);
            onExplodeScrub(level);
          }}
          className="h-1 w-36 cursor-pointer accent-rosso"
          aria-label="Exploded view level"
        />
        <button
          data-testid="explode-toggle"
          onClick={() => {
            const target = explodeLevel < 0.5 ? 1 : 0;
            setExplodeLevel(target);
            onExplodePlay(target);
          }}
          className="ui-move rounded-full px-3 py-1.5 text-xs text-grigio-600 transition-colors hover:bg-grigio-100 hover:text-nero"
        >
          {explodeLevel < 0.5 ? 'Apri' : 'Chiudi'}
        </button>
      </div>
      </>
      )}

      <div className="panel flex rounded-full border p-1 shadow-lg shadow-black/5">
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              data-testid={`mode-${m.id}`}
              aria-pressed={active}
              title={m.hint}
              onClick={() => {
                setMode(m.id);
                onChange(m.id);
              }}
              className={`ui-move rounded-full px-3.5 py-1.5 text-xs transition-colors ${
                active
                  ? 'bg-nero font-semibold text-white'
                  : 'text-grigio-600 hover:bg-grigio-100 hover:text-nero'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
