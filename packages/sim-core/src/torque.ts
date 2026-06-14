/**
 * Torque verdict (SIM-001 §3.1). Pure: the SimRig measures applied torque; this
 * judges it. Bands: under <80%, in-spec 80–110% (click at ±5%), yield >110%.
 * Verdict enum matches the `sim:torque_applied` domain event.
 */
export type TorqueVerdict = 'under' | 'in_spec' | 'over' | 'yield';

export interface TorqueResult {
  verdict: TorqueVerdict;
  /** 0–1 accuracy contribution for scoring (peak at target, 0 at/over yield). */
  accuracy: number;
  /** True when the fastener is ruined (>110%) — caller maps to critical-fail on safety parts. */
  yielded: boolean;
}

export function torqueVerdict(appliedNm: number, targetNm: number): TorqueResult {
  if (targetNm <= 0) return { verdict: 'under', accuracy: 0, yielded: false };
  const ratio = appliedNm / targetNm;
  if (ratio > 1.1) return { verdict: 'yield', accuracy: 0, yielded: true };
  if (ratio < 0.8) {
    // Linear ramp from 0 (at 0%) to ~0.6 (at 80%).
    return { verdict: 'under', accuracy: Math.max(0, (ratio / 0.8) * 0.6), yielded: false };
  }
  // 80–110%: peak 1.0 at target, easing to ~0.7 at the band edges.
  const deviation = Math.abs(ratio - 1); // 0 at target, ≤0.1 in-band
  const accuracy = 1 - deviation * 3; // 1.0 → 0.7 across ±0.1
  const verdict: TorqueVerdict = ratio > 1.05 ? 'over' : 'in_spec';
  return { verdict, accuracy: Math.max(0.7, accuracy), yielded: false };
}
