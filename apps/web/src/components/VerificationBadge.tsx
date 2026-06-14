/**
 * Truth-discipline badge (UXD-001 §B/§F): giallo exclusively for unverified,
 * verde only for verified. Never hidden where a value appears.
 */
export function VerificationBadge({
  status,
}: {
  status: 'verified' | 'placeholder_PL' | 'flagged' | 'pending';
}) {
  if (status === 'verified') {
    return (
      <span className="data inline-flex items-center gap-1 rounded-sm bg-verde/10 px-1.5 py-0.5 text-[10px] font-medium text-verde">
        ✓ VERIFICATO
      </span>
    );
  }
  return (
    <span
      className="data inline-flex items-center gap-1 rounded-sm bg-giallo/15 px-1.5 py-0.5 text-[10px] font-medium text-giallo"
      title="Placeholder value — pending verification against the official workshop manual (ARCH-001 §2)"
    >
      ⚠ {status === 'flagged' ? 'FLAGGED' : 'PLACEHOLDER'}
    </span>
  );
}
