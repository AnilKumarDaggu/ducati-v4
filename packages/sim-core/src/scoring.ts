import type { StepAction } from '@dtea/data';

/**
 * ScoringEngine — SIM-001 §3.6 decomposed station scoring.
 *
 * Pure and byte-reproducible (a Level-3 certification acceptance criterion):
 * identical outcomes always yield an identical decomposition. The seven buckets
 * are dynamically re-weighted over the dimensions actually applicable to a
 * station's steps, so a station with no torque step isn't unfairly capped.
 *
 * Decomposition is always returned (LXD-001 §5 scoring transparency).
 */

export const SCORING_WEIGHTS = {
  torque: 30,
  process: 25,
  fitment: 15,
  lubrication: 10,
  inspection: 10,
  time: 5,
  independence: 5,
} as const;

export type ScoreDimension = keyof typeof SCORING_WEIGHTS;

/** Critical-fail cap (SIM-001 §3.6): a yielded safety fastener, contamination, etc. */
export const REWORK_CAP = 40;

/** One step's judged contributions (the SimRig produces these; numbers are 0–1). */
export interface StepOutcome {
  stepId: string;
  action: StepAction;
  processCorrect: boolean; // right order, tool, consumable — applies to every step
  torqueAccuracy?: number; // torque steps
  fitmentAccuracy?: number; // place / orient / compress_install
  lubricationCorrect?: boolean; // apply_consumable / clean
  inspectionPerformed?: boolean; // measure / inspect
  hintsUsed: number;
  durationMs: number;
  errorsCommitted: number;
  criticalFail?: boolean;
}

export interface ScoreBreakdown {
  dimension: ScoreDimension;
  weight: number;
  fraction: number; // 0–1 achieved
  points: number; // weight × fraction (pre-normalization)
  applicable: boolean;
}

export interface StationScore {
  total: number; // 0–100
  status: 'pass' | 'rework';
  breakdown: ScoreBreakdown[];
  criticalFails: string[]; // stepIds that tripped a critical fail
}

const FITMENT_ACTIONS: ReadonlySet<StepAction> = new Set(['place', 'orient', 'compress_install']);
const LUBE_ACTIONS: ReadonlySet<StepAction> = new Set(['apply_consumable', 'clean']);
const INSPECT_ACTIONS: ReadonlySet<StepAction> = new Set(['measure', 'inspect']);

export interface ScoringContext {
  /** Optional target time; when omitted, the time dimension is not scored. */
  targetMs?: number;
}

export function scoreStation(outcomes: StepOutcome[], ctx: ScoringContext = {}): StationScore {
  const criticalFails = outcomes.filter((o) => o.criticalFail).map((o) => o.stepId);

  // Per-dimension numerator/denominator over applicable steps.
  const acc: Record<ScoreDimension, { sum: number; n: number }> = {
    torque: { sum: 0, n: 0 },
    process: { sum: 0, n: 0 },
    fitment: { sum: 0, n: 0 },
    lubrication: { sum: 0, n: 0 },
    inspection: { sum: 0, n: 0 },
    time: { sum: 0, n: 0 },
    independence: { sum: 0, n: 0 },
  };

  let totalHints = 0;
  let totalDuration = 0;

  for (const o of outcomes) {
    acc.process.sum += o.processCorrect ? 1 : 0;
    acc.process.n += 1;

    if (o.action === 'torque' && o.torqueAccuracy !== undefined) {
      acc.torque.sum += o.torqueAccuracy;
      acc.torque.n += 1;
    }
    if (FITMENT_ACTIONS.has(o.action) && o.fitmentAccuracy !== undefined) {
      acc.fitment.sum += o.fitmentAccuracy;
      acc.fitment.n += 1;
    }
    if (LUBE_ACTIONS.has(o.action) && o.lubricationCorrect !== undefined) {
      acc.lubrication.sum += o.lubricationCorrect ? 1 : 0;
      acc.lubrication.n += 1;
    }
    if (INSPECT_ACTIONS.has(o.action) && o.inspectionPerformed !== undefined) {
      acc.inspection.sum += o.inspectionPerformed ? 1 : 0;
      acc.inspection.n += 1;
    }
    totalHints += o.hintsUsed;
    totalDuration += o.durationMs;
  }

  // Independence: full marks at zero hints; ~3 hints zeroes it.
  acc.independence.sum = Math.max(0, 1 - totalHints * 0.34);
  acc.independence.n = 1;

  // Time: generous window — full marks within [0.5, 2]× target, degrading outside.
  if (ctx.targetMs && ctx.targetMs > 0) {
    const ratio = totalDuration / ctx.targetMs;
    let frac = 1;
    if (ratio < 0.5) frac = Math.max(0, ratio / 0.5);
    else if (ratio > 2) frac = Math.max(0, 1 - (ratio - 2) / 2);
    acc.time.sum = frac;
    acc.time.n = 1;
  }

  const breakdown: ScoreBreakdown[] = (Object.keys(SCORING_WEIGHTS) as ScoreDimension[]).map(
    (dim) => {
      const { sum, n } = acc[dim];
      const applicable = n > 0;
      const fraction = applicable ? sum / n : 0;
      return {
        dimension: dim,
        weight: SCORING_WEIGHTS[dim],
        fraction: Math.round(fraction * 1000) / 1000,
        points: applicable ? SCORING_WEIGHTS[dim] * fraction : 0,
        applicable,
      };
    },
  );

  const applicableWeight = breakdown
    .filter((b) => b.applicable)
    .reduce((s, b) => s + b.weight, 0);
  const achieved = breakdown.reduce((s, b) => s + b.points, 0);
  let total = applicableWeight > 0 ? Math.round((achieved / applicableWeight) * 100) : 0;

  let status: StationScore['status'] = 'pass';
  if (criticalFails.length > 0) {
    total = Math.min(total, REWORK_CAP);
    status = 'rework';
  }

  return { total, status, breakdown, criticalFails };
}
