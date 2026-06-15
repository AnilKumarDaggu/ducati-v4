import { useState } from 'react';

interface TopNavProps {
  breadcrumb: string[];
  backend: string;
  assetStatus: string;
  onToggleNavigator: () => void;
  /** Snapshots full scene state (location + vista/ciclo/esploso) into a shareable URL. */
  onCopyLink: () => Promise<void> | void;
}

/**
 * OFFICINA top navigation (UXD-001 §B/§D): brand left, machine-location
 * breadcrumb center (navigation IS camera — wired via selection), status right.
 */
export function TopNav({
  breadcrumb,
  backend,
  assetStatus,
  onToggleNavigator,
  onCopyLink,
}: TopNavProps) {
  const [copied, setCopied] = useState(false);

  return (
    <header className="panel z-20 flex h-14 shrink-0 items-center gap-4 border-b px-4">
      <button
        onClick={onToggleNavigator}
        className="ui-move rounded p-1.5 text-grigio-400 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
        aria-label="Toggle navigator"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 4.5h14M2 9h14M2 13.5h14" />
        </svg>
      </button>

      <h1 className="flex items-baseline gap-3">
        <span className="display-caps text-sm text-white">
          Offi<span className="text-rosso">ci</span>na
        </span>
        <span className="hidden text-xs text-grigio-400 sm:inline">
          Ducati Panigale V4 · Motorcycle Explorer
        </span>
      </h1>

      <nav className="mx-auto hidden items-center gap-2 text-xs text-grigio-400 md:flex" aria-label="Machine location">
        {breadcrumb.length === 0 ? (
          <span className="display-caps text-[11px] tracking-[0.18em] text-grigio-500">
            Esplora · Studio
          </span>
        ) : (
          breadcrumb.map((segment, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-grigio-600">/</span>}
              <span className={i === breadcrumb.length - 1 ? 'font-medium text-white' : ''}>
                {segment}
              </span>
            </span>
          ))
        )}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button
          data-testid="copy-link"
          onClick={() => {
            void Promise.resolve(onCopyLink()).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            });
          }}
          className="ui-move hidden rounded-sm px-2 py-1 text-[10px] text-grigio-400 transition-colors hover:bg-white/10 hover:text-white sm:block"
          title="Copy a link to this exact scene (part, view, cycle, explode)"
        >
          {copied ? 'Copiato ✓' : 'Copia link'}
        </button>
        <span className="data rounded-sm bg-white/[0.06] px-2 py-1 text-[10px] text-grigio-400">
          <span data-testid="renderer-backend">renderer: {backend}</span>
        </span>
        <span className="data rounded-sm bg-white/[0.06] px-2 py-1 text-[10px] text-grigio-400">
          <span data-testid="asset-status">asset: {assetStatus}</span>
        </span>
      </div>
    </header>
  );
}
