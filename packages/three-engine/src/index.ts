// @dtea/three-engine — framework-agnostic 3D core (ARCH-002 §3, vanilla three per ADR-012).
// Sprint 2 complete: EsploraViewer (STUDIO stage, D-1 lighting, AAA camera, framing),
// ViewModeSystem (ADR-010), ExplodeController, CrankAngleClock (ADR-011), PerfMonitor.
export { RendererManager, type RendererInfo, type RendererOptions } from './renderer-manager.js';
export {
  createEsploraViewer,
  type ComponentHit,
  type EsploraHandle,
  type EsploraViewerOptions,
  type ScenePart,
} from './esplora-viewer.js';
export { ViewModeSystem, type ViewMode } from './view-mode-system.js';
export { ExplodeController } from './explode-controller.js';
export { CrankAngleClock, type RotationAxis } from './crank-angle-clock.js';
export { PerfMonitor, type PerfStats } from './perf-monitor.js';
export { EngineRig, type EngineState, type CylinderState } from './engine-rig.js';
