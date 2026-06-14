import { useSelection } from '../stores/selection';

interface NavigatorRailProps {
  open: boolean;
  onSelect: (componentId: string) => void;
}

/**
 * Navigator rail (UXD-001 §B): the machine as an index. Driven by the loaded
 * model's own parts (Path A — native node names, humanized). Selecting frames
 * and highlights the part on the stage.
 */
export function NavigatorRail({ open, onSelect }: NavigatorRailProps) {
  const { selectedId, parts } = useSelection();

  return (
    <aside
      className={`panel z-10 w-72 shrink-0 overflow-y-auto border-r transition-transform ui-move max-lg:absolute max-lg:inset-y-14 max-lg:left-0 max-lg:shadow-xl ${
        open ? 'translate-x-0' : 'max-lg:-translate-x-full'
      }`}
      aria-label="Component navigator"
    >
      <div className="p-4">
        <p className="display-caps mb-1 text-[10px] tracking-[0.2em] text-grigio-400">Navigatore</p>
        <h3 className="mb-3 flex items-baseline gap-2">
          <span className="display-caps text-[10px] tracking-[0.16em] text-rosso">Panigale V4</span>
          <span className="data text-[10px] text-grigio-400">{parts.length} parti</span>
        </h3>

        {parts.length === 0 ? (
          <p className="text-xs text-grigio-400">Loading model…</p>
        ) : (
          <ul>
            {parts.map((part) => {
              const active = selectedId === part.id;
              return (
                <li key={part.id}>
                  <button
                    onClick={() => onSelect(part.id)}
                    className={`ui-move group flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[13px] transition-colors ${
                      active
                        ? 'bg-rosso/8 font-medium text-rosso'
                        : 'text-grigio-700 hover:bg-grigio-100 hover:text-nero'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? 'bg-rosso' : 'bg-grigio-400'}`}
                    />
                    <span className="truncate">{part.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
