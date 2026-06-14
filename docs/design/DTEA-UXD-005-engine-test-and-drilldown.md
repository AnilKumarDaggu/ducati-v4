# DTEA-UXD-005 — Engine Test & Engineering Drill-Down

**Version:** 1.0 | **Date:** 2026-06-14 | **Status:** Engine Test implemented · Drill-down architected
**Relates to:** UXD-001, ADR-010 (view modes), ADR-011 (crank clock), AST-002 (GLB contract)

## Real vs. simulated (the honest ledger)

The imported `ducati_panigale_v4.glb` is a **flat 107-mesh exterior shell with no internals** — no pistons, crank, valves, or systems geometry. Every internal/engineering visualization is therefore an **educational simulation**, clearly labelled in-product:

| Element | Source | Status |
|---|---|---|
| Bike exterior, bodywork, wheels, chassis | Real GLB geometry (native materials) | **Real** |
| Part selection / isolation / X-ray shell-vs-core | Real geometry, classified by material name | **Real geometry, heuristic classification** |
| Engine Test V4 (pistons, rods, crank, bores) | Procedural geometry + real slider-crank math | **Simulated** (representative geometry, accurate motion) |
| 4-stroke cycle, firing order, RPM scaling | Computed from crank angle | **Simulated, kinematically correct** |
| Fuel/air/oil/cooling/spark flows | — | **Not yet built** (architected below) |
| Multi-level BOM drill-down (Engine→Bank→Head→Valve…) | — | **Not yet built** — needs BOM-mapped geometry |

Principle (per brief): *accuracy of behaviour over visual effects.* The piston motion is the exact slider-crank equation `s(θ)=R·cos(θ−φ)+√(L²−R²·sin²(θ−φ))`; conrods track crankpin→wrist-pin each frame; the crank turns 720° per four-stroke cycle; animation scales linearly with rpm. Crank **phasing** is representative even-fire, not the exact Desmosedici Twin-Pulse crank — stated in the UI.

## Capability 2 — Engine Test (IMPLEMENTED)

**Architecture:** `EngineRig` (`packages/three-engine/src/engine-rig.ts`) is a self-contained procedural V4 (crankcase ghost, crank + phased crankpins, 4 transparent bores, 4 pistons, 4 rods). It exposes `update(crankDeg)` (pure function of angle) and `state(deg,rpm,running)` (per-cylinder stroke + firing). The viewer:
- adds the rig hidden; `setViewMode('enginetest')` swaps the bike out, the rig in, applies the dyno stage preset (ADR-010), and frames the rig;
- reuses the **CrankAngleClock** (ADR-011) — `setEngineRunning`/`setEngineRpm` drive `crank.setRunning(rpm)`; each frame `rig.update(crank.getAngle())` and emits `onEngineState` ~6×/s;
- `EngineTestPanel` provides Start/Stop, RPM presets (Idle→Redline), live RPM, and the per-cylinder 4-stroke readout with firing highlight.

This is the 5th tab alongside Studio/Officina/Tecnico/X-Ray.

## Capability 1 — Engineering Drill-Down (ARCHITECTED; partial)

**Shipped (V1.5):** select → frame → click-again-to-isolate → exit; breadcrumb; X-ray reveal of internals. This is single-level.

**The gap:** true multi-level drill-down (Engine→Bank→Head→Valvetrain→Cam→Valve→Spring→Retainer) requires a **hierarchy**, which the flat GLB lacks. Two honest routes:

1. **Procedural educational hierarchy (no new asset):** author a `hierarchy.json` tree of assemblies with synthetic/representative child geometry (reuse the `engine.ts` procedural generator + EngineRig parts). Drill-down navigates the tree; leaves that have no real geometry show representative stand-ins, labelled. Breadcrumb + isolate already exist and generalise to tree nodes. **This is the recommended next increment** — buildable now, no purchase.
2. **BOM-mapped real geometry (Path B, AST-002):** rename/group the GLB (or a real engine GLB) into the `ENG_S01_*` hierarchy in Blender; drill-down then walks real parts. Requires modelling/scan + licensing.

The interaction layer (select/isolate/frame/breadcrumb) is built and tree-ready; the missing piece is the hierarchy **data + child geometry**, not viewer code.

## Next increments (priority)

1. Procedural hierarchy tree → real multi-level drill-down (route 1 above).
2. Engine Test polish: combustion light flash, intake/exhaust valve motion on the heads, tighter cinematic framing, sound-off.
3. Educational flow overlays: fuel/air/spark/oil/cooling as shader/particle paths on the rig (simulation, labelled).
4. Path B: a real engine/cutaway GLB → replaces representative rig geometry (the genuine article).
