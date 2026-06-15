import { componentById, specById } from '../content/catalog';
import { useSelection } from '../stores/selection';
import { VerificationBadge } from './VerificationBadge';

interface SchedaTecnicaProps {
  onFrame: (componentId: string) => void;
  onSelect: (componentId: string) => void;
  isolated: boolean;
  onToggleIsolate: () => void;
}

/**
 * Scheda Tecnica — the museum placard (UXD-001 §B). Rich card for BOM-mapped
 * parts; an honest "native model part" card for the Path-A Panigale parts that
 * aren't yet mapped to the engineering BOM (no fabricated specs).
 */
export function SchedaTecnica({ onFrame, onSelect, isolated, onToggleIsolate }: SchedaTecnicaProps) {
  const { selectedId, selectedLabel } = useSelection();
  const record = selectedId ? componentById.get(selectedId) : undefined;

  return (
    <aside
      className="panel z-10 hidden w-80 shrink-0 overflow-y-auto border-l md:block xl:w-96"
      aria-label="Technical card"
    >
      <div className="p-5">
        <p className="display-caps mb-4 text-[10px] tracking-[0.2em] text-grigio-400">
          Scheda Tecnica
        </p>

        {!selectedId ? (
          <div className="mt-12 text-center">
            <p className="text-sm text-grigio-500">Seleziona un componente.</p>
            <p className="mt-2 text-xs text-grigio-400">
              Click a part on the stage, or choose one from the navigator.
            </p>
            <p className="mt-6 text-[11px] text-grigio-400">
              Click a part to frame it · click again to isolate it.
            </p>
          </div>
        ) : (
          <>
            {record ? (
              <CatalogCard record={record} onFrame={onFrame} onSelect={onSelect} />
            ) : (
              <NativeCard id={selectedId} label={selectedLabel ?? selectedId} onFrame={onFrame} />
            )}
            <button
              data-testid="isolate-toggle"
              onClick={onToggleIsolate}
              className={`ui-move mt-3 w-full rounded border px-3.5 py-2 text-xs font-medium transition-colors ${
                isolated
                  ? 'border-rosso bg-rosso/15 text-rosso'
                  : 'border-white/20 text-grigio-300 hover:border-white hover:text-white'
              }`}
            >
              {isolated ? 'Esci dall’isolamento' : 'Isola componente'}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

function NativeCard({
  id,
  label,
  onFrame,
}: {
  id: string;
  label: string;
  onFrame: (id: string) => void;
}) {
  return (
    <div data-testid="info-panel" className="space-y-5">
      <h2 className="display text-2xl leading-tight text-white">{label}</h2>
      <p className="text-sm leading-relaxed text-grigio-300">
        A part of the Ducati Panigale V4 model. Engineering metadata —
        function, material, manufacturing, specifications — is added as parts are
        mapped to the BOM. For now this is a native model component.
      </p>
      <span className="data inline-flex items-center gap-1 rounded-sm bg-giallo/15 px-1.5 py-0.5 text-[10px] font-medium text-giallo">
        ⚠ NON MAPPATO
      </span>
      <div className="pt-1">
        <button
          onClick={() => onFrame(id)}
          className="ui-move rounded bg-rosso px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-rosso-scuro"
        >
          Inquadra
        </button>
      </div>
      <p
        data-testid="selected-component"
        className="data border-t border-white/10 pt-3 text-[10px] text-grigio-500"
      >
        {id}
      </p>
    </div>
  );
}

function CatalogCard({
  record,
  onFrame,
  onSelect,
}: {
  record: NonNullable<ReturnType<typeof componentById.get>>;
  onFrame: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <div data-testid="info-panel" className="space-y-5">
      <div>
        <h2 className="display text-2xl leading-tight text-white">{record.displayName}</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="data rounded-sm bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-grigio-300">
            {record.adl}
          </span>
          <span className="data rounded-sm bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-grigio-300">
            {record.hierarchyPath}
          </span>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-grigio-300">{record.descriptionShort}</p>
      {record.specRefs.length > 0 && (
        <div>
          <h3 className="display-caps mb-1.5 text-[9px] tracking-[0.18em] text-grigio-400">
            Specifiche
          </h3>
          <ul className="space-y-2">
            {record.specRefs.map((ref) => {
              const spec = specById.get(ref);
              if (!spec) return null;
              const value =
                spec.value !== undefined
                  ? `${spec.value} ${spec.unit}`
                  : `${spec.min}–${spec.max} ${spec.unit}`;
              return (
                <li key={ref} className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="text-grigio-400">{spec.displayName}</span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span className="data text-white">{value}</span>
                    <VerificationBadge status={spec.verificationStatus} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {record.relatedComponents.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {record.relatedComponents.map((rid) => (
            <button
              key={rid}
              onClick={() => onSelect(rid)}
              className="ui-move rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-grigio-300 transition-colors hover:border-rosso hover:text-rosso"
            >
              {componentById.get(rid)?.displayName ?? rid}
            </button>
          ))}
        </div>
      )}
      <div className="pt-1">
        <button
          onClick={() => onFrame(record.componentId)}
          className="ui-move rounded bg-rosso px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-rosso-scuro"
        >
          Inquadra
        </button>
      </div>
      <p
        data-testid="selected-component"
        className="data border-t border-white/10 pt-3 text-[10px] text-grigio-500"
      >
        {record.componentId}
      </p>
    </div>
  );
}
