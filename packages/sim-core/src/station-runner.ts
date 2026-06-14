import type { Difficulty, StationDef, StepDef } from '@dtea/data';
import type { EventBus } from '@dtea/events';
import { scoreStation, type StationScore, type StepOutcome } from './scoring.js';
import { torqueVerdict } from './torque.js';

/**
 * StationRunner — the build-station state machine (SIM-001 §2/§3).
 *
 * The judge, not the renderer: the SimRig (Sprint 3, asset-dependent) produces
 * raw measurements (placement deltas, applied torque, hints, time); this module
 * decides correctness, detects classic errors, advances the step sequence, and
 * scores. Pure and headless — deterministic given identical attempts.
 *
 * Ownership boundary: the runner never touches three.js; the SimRig never scores.
 */

export type StationStatus = 'idle' | 'in_progress' | 'rework' | 'complete';

/** Raw, already-measured attempt for the current step (the SimRig's output). */
export interface StepAttempt {
  toolId?: string;
  consumableId?: string;
  positionErrorMm?: number;
  angleErrorDeg?: number;
  appliedTorqueNm?: number;
  /** Target torque from the spec store (caller resolves spec → value). */
  targetTorqueNm?: number;
  inspectionPerformed?: boolean;
  /** A seeded classic-error id the learner triggered, if any (BOM-001 rule 5). */
  committedErrorId?: string;
  /** True for fasteners flagged safety-critical (yield → critical fail). */
  safetyCritical?: boolean;
  hintsUsed?: number;
  durationMs?: number;
}

export type AttemptResult =
  | { ok: true; advanced: true; stepId: string; stationComplete: boolean }
  | { ok: false; reason: AttemptRejection; stepId: string; explanationRef?: string };

export type AttemptRejection =
  | 'station_done'
  | 'prerequisite_unmet'
  | 'wrong_tool'
  | 'wrong_consumable'
  | 'out_of_tolerance'
  | 'classic_error_immediate';

const DEFAULT_TOLERANCE = { guided: { positionMm: 10, angleDeg: 10 }, standard: { positionMm: 2, angleDeg: 2 } };

export class StationRunner {
  private index = 0;
  private status: StationStatus = 'idle';
  private readonly outcomes: StepOutcome[] = [];
  private readonly completed = new Set<string>();
  /** Classic errors committed but deferred (inspection-caught) until an inspect step. */
  private readonly pendingInspectionErrors: { stepId: string; explanationRef: string }[] = [];

  constructor(
    private readonly station: StationDef,
    private readonly difficulty: Difficulty,
    private readonly opts: { bus?: EventBus; targetMs?: number } = {},
  ) {}

  getStatus(): StationStatus {
    return this.status;
  }
  getCurrentStep(): StepDef | undefined {
    return this.station.steps[this.index];
  }
  getOutcomes(): readonly StepOutcome[] {
    return this.outcomes;
  }

  attemptStep(attempt: StepAttempt): AttemptResult {
    const step = this.station.steps[this.index];
    if (!step) return { ok: false, reason: 'station_done', stepId: '' };
    if (this.status === 'idle') this.status = 'in_progress';

    // Prerequisites.
    for (const pre of step.prerequisites) {
      if (!this.completed.has(pre)) {
        return { ok: false, reason: 'prerequisite_unmet', stepId: step.stepId };
      }
    }

    // Tooling / consumable correctness (process dimension).
    let processCorrect = true;
    if (step.toolId && attempt.toolId !== step.toolId) {
      return { ok: false, reason: 'wrong_tool', stepId: step.stepId };
    }
    if (step.consumableId && attempt.consumableId && attempt.consumableId !== step.consumableId) {
      processCorrect = false; // wrong consumable applied — a scored process error, not a block
    }

    // Classic-error handling (BOM-001 rule 5).
    if (attempt.committedErrorId) {
      const ce = step.classicErrors.find((c) => c.errorId === attempt.committedErrorId);
      if (ce) {
        this.emitError(step.stepId, ce.errorId, ce.detection);
        if (ce.detection === 'immediate') {
          // Blocking: must be corrected to proceed (no outcome recorded).
          return {
            ok: false,
            reason: 'classic_error_immediate',
            stepId: step.stepId,
            explanationRef: ce.explanationRef,
          };
        }
        // inspection_caught: allowed to proceed now, surfaces at an inspect step.
        this.pendingInspectionErrors.push({ stepId: step.stepId, explanationRef: ce.explanationRef });
      }
    }

    // Tolerance check for placement-type steps.
    const tol =
      step.tolerances?.[this.difficulty] ?? DEFAULT_TOLERANCE[this.difficulty];
    let fitmentAccuracy: number | undefined;
    if (isFitmentAction(step)) {
      const posErr = attempt.positionErrorMm ?? 0;
      const angErr = attempt.angleErrorDeg ?? 0;
      if (posErr > tol.positionMm || angErr > tol.angleDeg) {
        return { ok: false, reason: 'out_of_tolerance', stepId: step.stepId };
      }
      fitmentAccuracy =
        1 - 0.5 * (posErr / tol.positionMm) - 0.5 * (angErr / tol.angleDeg);
      fitmentAccuracy = Math.max(0, Math.min(1, fitmentAccuracy));
    }

    // Torque judgment.
    let torqueAccuracy: number | undefined;
    let criticalFail = false;
    if (step.action === 'torque' && attempt.appliedTorqueNm !== undefined) {
      const target = attempt.targetTorqueNm ?? 0;
      const result = torqueVerdict(attempt.appliedTorqueNm, target);
      torqueAccuracy = result.accuracy;
      this.emitTorque(step.stepId, step.specRef ?? '', attempt.appliedTorqueNm, result.verdict);
      if (result.yielded && attempt.safetyCritical) criticalFail = true;
    }

    // Inspection: catch any deferred classic errors here.
    let inspectionPerformed: number | boolean | undefined;
    if (step.action === 'inspect' || step.action === 'measure') {
      inspectionPerformed = attempt.inspectionPerformed ?? true;
    }

    const outcome: StepOutcome = {
      stepId: step.stepId,
      action: step.action,
      processCorrect,
      hintsUsed: attempt.hintsUsed ?? 0,
      durationMs: attempt.durationMs ?? 0,
      errorsCommitted: attempt.committedErrorId ? 1 : 0,
      criticalFail,
      ...(torqueAccuracy !== undefined ? { torqueAccuracy } : {}),
      ...(fitmentAccuracy !== undefined ? { fitmentAccuracy } : {}),
      ...(isLubeAction(step) ? { lubricationCorrect: processCorrect } : {}),
      ...(inspectionPerformed !== undefined ? { inspectionPerformed: !!inspectionPerformed } : {}),
    };
    this.outcomes.push(outcome);
    this.completed.add(step.stepId);
    this.emitStepCompleted(step, outcome);

    this.index += 1;
    const stationComplete = this.index >= this.station.steps.length;
    if (stationComplete) {
      this.status = this.score().status === 'rework' ? 'rework' : 'complete';
    }
    return { ok: true, advanced: true, stepId: step.stepId, stationComplete };
  }

  score(): StationScore {
    return scoreStation(
      [...this.outcomes],
      this.opts.targetMs !== undefined ? { targetMs: this.opts.targetMs } : {},
    );
  }

  // ── Event emission (xAPI-shaped; optional bus) ──────────────────────────────

  private emitStepCompleted(step: StepDef, o: StepOutcome): void {
    this.opts.bus?.emit({
      type: 'sim:step_completed',
      stationId: this.station.stationId,
      stepId: step.stepId,
      score: Math.round((o.torqueAccuracy ?? o.fitmentAccuracy ?? (o.processCorrect ? 1 : 0)) * 100),
      hintCount: o.hintsUsed,
      errorCount: o.errorsCommitted,
      durationMs: o.durationMs,
      timestamp: new Date().toISOString(),
    });
  }

  private emitError(stepId: string, errorId: string, detection: 'immediate' | 'inspection_caught'): void {
    this.opts.bus?.emit({
      type: 'sim:error_committed',
      stationId: this.station.stationId,
      stepId,
      errorId,
      detection,
      timestamp: new Date().toISOString(),
    });
  }

  private emitTorque(
    stepId: string,
    specRef: string,
    appliedNm: number,
    verdict: 'under' | 'in_spec' | 'over' | 'yield',
  ): void {
    this.opts.bus?.emit({
      type: 'sim:torque_applied',
      stepId,
      specRef,
      appliedNm,
      verdict,
      timestamp: new Date().toISOString(),
    });
  }
}

function isFitmentAction(step: StepDef): boolean {
  return step.action === 'place' || step.action === 'orient' || step.action === 'compress_install';
}
function isLubeAction(step: StepDef): boolean {
  return step.action === 'apply_consumable' || step.action === 'clean';
}
