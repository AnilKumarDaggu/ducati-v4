// @dtea/sim-core — station/step state machine + scoring (SIM-001 §3, RDM-003 S3).
// Pure TS, no React, no three.js: the judge of build correctness, headless and
// byte-reproducible (a Level-3 certification acceptance criterion). The SimRig
// (Sprint 3, asset-dependent) measures; this module decides and scores.
export {
  scoreStation,
  SCORING_WEIGHTS,
  REWORK_CAP,
  type ScoreDimension,
  type ScoreBreakdown,
  type StationScore,
  type StepOutcome,
  type ScoringContext,
} from './scoring.js';
export { torqueVerdict, type TorqueResult, type TorqueVerdict } from './torque.js';
export {
  StationRunner,
  type StationStatus,
  type StepAttempt,
  type AttemptResult,
  type AttemptRejection,
} from './station-runner.js';
