# DTEA-ADR-012 — Vanilla three.js rendering core (no React Three Fiber)

**Status:** Accepted (2026-06-13) | **Relates to:** ARCH-002 §3, RDM-004 TD-1, ADR-010/011

## Context

ARCH-002 §3 named React Three Fiber (R3F) + drei as the 3D stack. Sprint 2 instead built the scene core (`@dtea/three-engine`) as **framework-agnostic vanilla three.js** with an imperative handle the React layer calls. This proved correct in practice:

- The core has zero React dependency, so its systems (RendererManager, ViewModeSystem, ExplodeController, CrankAngleClock) are unit-testable headless — already four passing suites.
- Imperative control matched the domain: a single persistent canvas, a render-loop owning camera journeys + clock ticks, and a one-writer-per-transform-channel rule (ADR-011) that React's declarative reconciliation would have fought.
- The seam (stores + viewer handle) is the same seam multiplayer (V3) and the tutor (S4) will use.

`@react-three/fiber`, `@react-three/drei`, and `gsap` remained in `apps/web` dependencies but are imported nowhere (verified by grep). This is the TD-1 divergence.

## Decision

The platform's 3D core is **vanilla three.js**, framework-agnostic, exposed to React through an imperative handle (`EsploraHandle` and successors). React owns DOM/UI only; it never reconciles scene-graph nodes.

- Remove the unused `@react-three/fiber`, `@react-three/drei`, and `gsap` from `apps/web`.
- Animation/tweening is hand-rolled in the core (camera journeys, explode playback, the clock) using the UXD-001 §G easing tokens — no GSAP dependency.
- New 3D work (SimRig in Sprint 3) follows this pattern: imperative systems in `@dtea/three-engine`, thin React bindings in `apps/web`.

## Consequences

- ARCH-002 §3's "React Three Fiber" line is superseded by this ADR (noted in the architecture README).
- Smaller dependency surface and bundle; one mental model for all 3D.
- Cost: no R3F ecosystem components (drei helpers) — we implement what we need. Accepted; the needs are bounded and domain-specific.
- If a future module genuinely benefits from declarative scene composition, this ADR can be revisited per-module without unwinding the core.
