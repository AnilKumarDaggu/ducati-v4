import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import {
  createEsploraViewer,
  type EsploraHandle,
  type PerfStats,
  type ViewMode,
} from '@dtea/three-engine';
import { bus } from '../lib/bus';
import { breadcrumbFor, componentById } from '../content/catalog';
import { useSelection } from '../stores/selection';
import { useView } from '../stores/view';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { TopNav } from '../components/TopNav';
import { NavigatorRail } from '../components/NavigatorRail';
import { SchedaTecnica } from '../components/SchedaTecnica';
import { ModeDock } from '../components/ModeDock';
import { PerfHud } from '../components/PerfHud';
import { StatBand } from '../components/StatBand';
import { LoadingOverlay } from '../components/LoadingOverlay';

type AssetStatus = 'loading' | 'loaded' | 'error';

const MODEL_URL = '/models/ducati_panigale_v4.glb';
const VIEW_MODES: ReadonlySet<string> = new Set(['studio', 'officina', 'tecnico', 'xray']);

/**
 * Motorcycle Explorer — the OFFICINA showcase on the real Ducati Panigale V4
 * GLB (Path A). Native materials/textures preserved; parts selectable by node
 * name; premium studio stage, loading curtain, and the OFFICINA UI language.
 *
 * Deep links: /esplora/:partId?vista=studio|officina|tecnico|xray
 */
export function Esplora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<EsploraHandle | null>(null);
  const [status, setStatus] = useState<AssetStatus>('loading');
  const [backend, setBackend] = useState<string>('initializing');
  const [navOpen, setNavOpen] = useState(false);
  const [perf, setPerf] = useState<PerfStats | null>(null);
  const [isolated, setIsolated] = useState(false);
  const showPerf =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('perf');

  const { bomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reducedMotion = useReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const { selectedId, selectedLabel, loadProgress, setSelected, setHovered, setParts, setLoadProgress } =
    useSelection();
  const view = useView();

  const bomIdRef = useRef<string | undefined>(bomId);
  bomIdRef.current = bomId;

  useEffect(() => {
    if (!canvasRef.current) return;
    let disposed = false;

    void createEsploraViewer(canvasRef.current, {
      modelUrl: MODEL_URL,
      reducedMotion: reducedMotionRef.current,
      ...(showPerf ? { onStats: setPerf } : {}),
      onProgress: (f) => setLoadProgress(f),
      onParts: (parts) => setParts(parts),
      onStatus: (s, detail) => {
        setStatus(s);
        if (detail) console.error('[dtea] model load:', detail);
        if (s === 'loaded') applyUrlState();
      },
      onSelect: (hit) => {
        // Prefer the navigator's material-based label over the raw node label.
        const partLabel = hit
          ? (useSelection.getState().parts.find((p) => p.id === hit.componentId)?.label ?? hit.label)
          : null;
        setSelected(hit?.componentId ?? null, partLabel);
        if (hit) {
          bus.emit({
            type: 'component:selected',
            componentId: hit.componentId,
            timestamp: new Date().toISOString(),
          });
        }
        if ((bomIdRef.current ?? null) !== (hit?.componentId ?? null)) {
          void navigate(hit ? `/esplora/${encodeURIComponent(hit.componentId)}` : '/esplora');
        }
      },
      onHover: (id) => setHovered(id),
      onIsolate: (on) => setIsolated(on),
    }).then((h) => {
      if (disposed) h.dispose();
      else {
        viewerRef.current = h;
        setBackend(h.backend);
      }
    });

    function applyUrlState() {
      const h = viewerRef.current;
      const vista = searchParams.get('vista');
      if (vista && VIEW_MODES.has(vista)) {
        view.setMode(vista as ViewMode);
        h?.setViewMode(vista as ViewMode);
      }
      const id = bomIdRef.current;
      if (id) {
        const decoded = decodeURIComponent(id);
        if (componentById.has(decoded)) setSelected(decoded, null);
        h?.selectComponent(decoded);
      }
    }

    return () => {
      disposed = true;
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
  }, []);

  // Back/forward + in-app navigation: the :partId is the source of truth.
  useEffect(() => {
    const id = bomId ? decodeURIComponent(bomId) : null;
    if (id === selectedId) return;
    viewerRef.current?.selectComponent(id);
    // selectedId is intentionally not a trigger: the param is the source of truth.
  }, [bomId]);

  useEffect(() => {
    viewerRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  // Keyboard (a11y): Escape clears selection → pure stage.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && bomIdRef.current) {
        viewerRef.current?.selectComponent(null);
        void navigate('/esplora');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const selectFromUi = (componentId: string) => {
    viewerRef.current?.selectComponent(componentId);
    setNavOpen(false);
  };

  const copyLink = async () => {
    const params = new URLSearchParams({ vista: view.mode });
    const path = selectedId ? `/esplora/${encodeURIComponent(selectedId)}` : '/esplora';
    await navigator.clipboard.writeText(`${window.location.origin}${path}?${params}`);
  };

  const record = selectedId ? componentById.get(selectedId) : undefined;
  const baseCrumb = record
    ? breadcrumbFor(record)
    : selectedId
      ? ['Panigale V4', selectedLabel ?? selectedId]
      : [];
  const breadcrumb = isolated ? [...baseCrumb, 'isolato'] : baseCrumb;

  return (
    <div className="flex h-full flex-col">
      <TopNav
        breadcrumb={breadcrumb}
        backend={backend}
        assetStatus={status}
        onToggleNavigator={() => setNavOpen((v) => !v)}
        onCopyLink={copyLink}
      />
      <div className="relative flex flex-1 overflow-hidden">
        <NavigatorRail open={navOpen} onSelect={selectFromUi} />

        <main className="relative flex min-w-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1">
            <canvas
              ref={canvasRef}
              className="block h-full w-full"
              role="img"
              aria-label="Interactive 3D Ducati Panigale V4 viewer. Use the navigator panel to select parts by keyboard."
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 100% at 50% 38%, transparent 52%, rgba(16,16,20,0.12) 100%)',
              }}
            />
            {!selectedId && (
              <div className="pointer-events-none absolute left-6 top-5 select-none">
                <p className="display-caps text-[11px] tracking-[0.22em] text-rosso">Ducati</p>
                <p className="display text-2xl leading-tight text-nero">Panigale V4</p>
                <p className="text-xs text-grigio-500">Explore the machine</p>
              </div>
            )}
            {showPerf && <PerfHud stats={perf} />}
            <ModeDock
              showEngineControls={false}
              onChange={(mode) => {
                viewerRef.current?.setViewMode(mode);
                bus.emit({ type: 'viewmode:changed', mode, timestamp: new Date().toISOString() });
              }}
              onExplodeScrub={() => {}}
              onExplodePlay={() => {}}
              onCrankScrub={() => {}}
              onCrankRun={() => {}}
            />
            <LoadingOverlay progress={loadProgress} done={status !== 'loading'} />
            {status === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="rounded bg-white/90 px-4 py-2 text-sm text-grigio-600">
                  Model load failed — confirm <code className="data">{MODEL_URL}</code> exists.
                </p>
              </div>
            )}
          </div>
          <StatBand />
        </main>

        <SchedaTecnica
          onFrame={(id) => viewerRef.current?.frameComponent(id)}
          onSelect={selectFromUi}
          isolated={isolated}
          onToggleIsolate={() => viewerRef.current?.setIsolated(!isolated)}
        />
      </div>
    </div>
  );
}
