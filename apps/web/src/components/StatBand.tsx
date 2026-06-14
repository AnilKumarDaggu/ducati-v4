/**
 * Spec band — the "this is a Ducati" signal for the Panigale V4 showcase.
 * These are representative Panigale V4 figures, NOT from the verified ARCH-001
 * baseline (that documents the Multistrada V4 Granturismo), so the band carries
 * a representative flag — truth discipline holds even in the showcase.
 */
const STATS: Array<{ label: string; value: string; unit: string }> = [
  { label: 'Displacement', value: '1,103', unit: 'cc' },
  { label: 'Configuration', value: 'V4', unit: '90°' },
  { label: 'Power', value: '~215', unit: 'hp' },
  { label: 'Torque', value: '~124', unit: 'Nm' },
  { label: 'Valvetrain', value: 'Desmo', unit: 'DOHC' },
  { label: 'Engine', value: 'Desmosedici', unit: 'Stradale' },
];

export function StatBand() {
  return (
    <section className="panel z-10 shrink-0 border-t" aria-label="Motorcycle specifications">
      <div className="flex items-stretch gap-px overflow-x-auto">
        <div className="flex min-w-56 flex-col justify-center px-5 py-3">
          <p className="display-caps text-[10px] tracking-[0.18em] text-rosso">Ducati</p>
          <p className="display text-sm text-nero">Panigale V4</p>
          <p className="data text-[10px] text-giallo">⚠ representative figures</p>
        </div>
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-1 flex-col justify-center px-4 py-3">
            <p className="display-caps text-[9px] tracking-[0.16em] text-grigio-400">{s.label}</p>
            <p className="flex items-baseline gap-1">
              <span className="data text-xl font-semibold text-nero">{s.value}</span>
              <span className="data text-[11px] text-grigio-500">{s.unit}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
