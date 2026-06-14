# DTEA-ADR-011 — Crank-angle clock drives motion; one writer per transform channel

**Status:** Accepted (2026-06-12) | **Relates to:** BOM-001 rule 4, UXD-001 §G, ADR-010, SIM-001 §3.7

## Context

BOM-001 rule 4 mandates a single global crank-angle clock (0–720°, the four-stroke cycle) driving every animated part in phase. Scene motion must be **angle-driven, not time-driven**: scrubbing the cycle and running it (rpm) are the same choreography sampled differently — exactly the scrub/play duality already established for the ExplodeController. Two scene systems now write node transforms (ExplodeController, CrankAngleClock); unmanaged, both writing one node's rotation corrupts state.

## Decision

1. **Two binding types on the `CrankAngleClock`:**
   - **Rotation bindings** for AN-R parts — `degreesPerCycle` ratio + phase (crank = 720°/cycle, cams = 360°/cycle, counter-rotating idler = −720°/cycle). This is the BOM ratio metadata made executable.
   - **Clip bindings** for AN-T/AN-O parts — GLTF `AnimationClip`s authored to the convention: *clip duration spans exactly one 720° cycle*; the clock maps angle→clip time via `mixer.setTime(angle/720 × duration)`. Clips are never played on wall-clock time.
2. **Transform-channel ownership rule (authoring contract):** the clock owns the **rotation** channel of nodes it binds; the ExplodeController owns **translation** everywhere and may use rotation only on nodes the clock does not bind. Explode definitions for clock-bound parts are translation-only. The asset pipeline lints this once both metadata sources exist (backlog).
3. **Run mode** advances angle by `rpm/60 × 360° × dt`, wrapping at 720° — scene progression is a pure function of angle in both scrub and run.

Consequence for the interim stand-in: its explode definition drops the unthreading rotation (translation-only) and the bolt demonstrates a cam-ratio rotation binding (360°/cycle) instead — each system owns one clean channel.

## Consequences

- The Lezione cam-angle scrubber (RDM-002) and the tutor's `set_crank_angle` tool bind to this one API.
- Artists export AN-T/O clips against the one-cycle convention (third working target delivered before scan assets).
- Alternative rejected: per-system timelines synchronized at runtime — drifts under scrubbing and breaks BOM rule 4's single-clock guarantee.
