/**
 * Loading experience — a branded curtain over the stage while the 17 MB model
 * streams. Fades when loaded. Shows real download progress (viewer onProgress).
 */
export function LoadingOverlay({ progress, done }: { progress: number; done: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a0c] transition-opacity duration-700 ${
        done ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden={done}
    >
      <p className="display-caps text-[11px] tracking-[0.28em] text-rosso">Ducati</p>
      <p className="display mb-6 text-3xl text-white">Panigale V4</p>
      <div className="h-px w-56 overflow-hidden bg-white/15">
        <div
          className="h-full bg-rosso transition-[width] duration-200 ease-out"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <p className="data mt-3 text-[10px] text-grigio-400">
        {progress < 1 ? `Caricamento · ${Math.round(progress * 100)}%` : 'Pronto'}
      </p>
    </div>
  );
}
