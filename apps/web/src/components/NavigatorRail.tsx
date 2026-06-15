import { useEffect, useMemo, useState } from 'react';
import { useSelection } from '../stores/selection';

interface NavigatorRailProps {
  open: boolean;
  onSelect: (componentId: string) => void;
}

/** Part buckets, in display order. First matching rule wins; `Altro` is the catch-all. */
const CATEGORIES: Array<{ key: string; label: string; dot: string; match: (l: string) => boolean }> = [
  { key: 'body', label: 'Body & Paint', dot: '#cc0405', match: (l) => /paint|body|carros|fairing|tank/.test(l) },
  { key: 'carbon', label: 'Carbon', dot: '#3c3c3a', match: (l) => /carbon/.test(l) },
  { key: 'metal', label: 'Metal & Chrome', dot: '#c9c9c5', match: (l) => /chrome|metal|steel|alumin|alloy|exhaust|fork/.test(l) },
  { key: 'glass', label: 'Glass', dot: '#86b5d6', match: (l) => /glass|lens|screen|light/.test(l) },
  { key: 'mirror', label: 'Mirrors', dot: '#a8c4d8', match: (l) => /mirror/.test(l) },
  { key: 'rubber', label: 'Rubber & Tyres', dot: '#2b2b30', match: (l) => /rubber|tyre|tire|caucho|seal|grip/.test(l) },
  { key: 'plastic', label: 'Plastic', dot: '#7d828a', match: (l) => /plastic|abs|cover/.test(l) },
  { key: 'other', label: 'Altro', dot: '#7d7d79', match: () => true },
];

function categoryOf(label: string): string {
  const l = label.toLowerCase();
  return (CATEGORIES.find((c) => c.match(l)) ?? CATEGORIES[CATEGORIES.length - 1]!).key;
}

/**
 * Navigator rail (UXD-001 §B): the machine as an index. The model's parts are
 * bucketed into material families (Body, Glass, Plastic, Rubber, Mirror…) and
 * shown as collapsible groups so 100+ parts stay legible. Selecting frames and
 * highlights the part on the stage.
 */
export function NavigatorRail({ open, onSelect }: NavigatorRailProps) {
  const { selectedId, parts } = useSelection();

  const groups = useMemo(() => {
    const byKey = new Map<string, typeof parts>();
    for (const part of parts) {
      const key = categoryOf(part.label);
      const list = byKey.get(key) ?? [];
      list.push(part);
      byKey.set(key, list);
    }
    return CATEGORIES.map((c) => ({ ...c, items: byKey.get(c.key) ?? [] })).filter((g) => g.items.length);
  }, [parts]);

  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});

  // Open the first group by default so parts are immediately discoverable.
  useEffect(() => {
    if (groups.length === 0) return;
    setOpenKeys((o) => (Object.keys(o).length === 0 ? { [groups[0]!.key]: true } : o));
  }, [groups]);

  // Auto-expand the group that holds the active selection.
  useEffect(() => {
    if (!selectedId) return;
    const part = parts.find((p) => p.id === selectedId);
    if (part) setOpenKeys((o) => ({ ...o, [categoryOf(part.label)]: true }));
  }, [selectedId, parts]);

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
          <div className="space-y-1">
            {groups.map((g) => {
              const expanded = openKeys[g.key] ?? false;
              const hasActive = g.items.some((p) => p.id === selectedId);
              return (
                <div key={g.key}>
                  <button
                    data-testid={`nav-group-${g.key}`}
                    aria-expanded={expanded}
                    onClick={() => setOpenKeys((o) => ({ ...o, [g.key]: !expanded }))}
                    className="ui-move flex w-full items-center gap-2 rounded px-2 py-2 text-left transition-colors hover:bg-white/[0.06]"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: g.dot }} />
                    <span
                      className={`display-caps flex-1 text-[10px] tracking-[0.12em] ${
                        hasActive ? 'text-rosso' : 'text-grigio-200'
                      }`}
                    >
                      {g.label}
                    </span>
                    <span className="data text-[10px] text-grigio-500">{g.items.length}</span>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      className={`shrink-0 text-grigio-500 transition-transform ui-move ${expanded ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M3.5 2l4 3-4 3" />
                    </svg>
                  </button>

                  {expanded && (
                    <ul className="mb-1 ml-3 border-l border-white/10 pl-2">
                      {g.items.map((part) => {
                        const active = selectedId === part.id;
                        return (
                          <li key={part.id}>
                            <button
                              onClick={() => onSelect(part.id)}
                              className={`ui-move group flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[13px] transition-colors ${
                                active
                                  ? 'bg-rosso/15 font-medium text-rosso'
                                  : 'text-grigio-300 hover:bg-white/[0.06] hover:text-white'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? 'bg-rosso' : 'bg-grigio-600'}`}
                              />
                              <span className="truncate">{part.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
