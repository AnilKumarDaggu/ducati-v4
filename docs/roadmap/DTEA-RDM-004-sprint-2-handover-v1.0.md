# DTEA-RDM-004 — Sprint 2 Review & Executive Handover
**Version:** 1.0 | **Date:** 2026-06-13 | **Status:** Approved
**Parent documents:** RDM-003 (sprint plan), ARCH-002 (blueprint), UXD-001 (experience bar), ADR-010/011
**Validation snapshot at handover:** typecheck 8/8 · lint 8/8 · unit tests 3 suites/12 tests green · build clean · e2e 2 specs passed (WebGL2-forced) · running at `pnpm dev`

---

## 1. Current Architecture Summary

A pnpm/Turborepo monorepo implementing ARCH-002's two-layer architecture on the Valve-Slice scope (RDM-002):

- **3D core (`@dtea/three-engine`)** — framework-agnostic (no React). Renderer management (WebGPU → WebGL2 automatic fallback; WebGL2 is the QA floor), the staged viewer (IBL + ACES + studio rig — defect D-1 closed), and three coordinated scene systems: ViewModeSystem (world+representation presets, ADR-010), ExplodeController (config-driven choreography), CrankAngleClock (angle-driven motion, ADR-011, one-writer-per-channel rule).
- **UI layer (`apps/web`)** — React 19 + Vite + react-router; OFFICINA design tokens (Tavolozza Officina); screens are route-mounted dressings over one persistent canvas. UI and 3D meet only through zustand stores and viewer-handle calls.
- **Shared contracts (`@dtea/data`)** — zod schemas as the single shape authority: components (BOM naming regex enforced), specs (verification status as a column — the ⚠/PL regime), step defs, lessons, explode defs, domain events (xAPI-shaped).
- **Event seam (`@dtea/events`)** — typed bus + localStorage sink; every consumer (UI, future tutor coaching, future xAPI warehouse) subscribes to one stream.
- **Backend (`apps/tutor-proxy`)** — stateless Fastify SSE skeleton (Sprint 4 wires Claude tool-use).
- **Asset pipeline (`tools/asset-pipeline`)** — generate → lint (BOM naming + catalog + tri budgets) → metadata injection (catalog is the source of truth, never Blender) → draco optimize → content-hashed manifest. Proven end-to-end on the procedural stand-in bolt.

Deliberate absences (per RDM-002 cuts): no auth/DB (localStorage), no Redis (stateless proxy), no physics engine, no R2 (static assets).

## 2. Folder Structure Summary

```
apps/web                 React app: routes/ (Esplora), components/ (TopNav, NavigatorRail,
                         SchedaTecnica, ModeDock, VerificationBadge), stores/, content/ loader, e2e/
apps/tutor-proxy         Stateless SSE proxy (S4 target)
packages/three-engine    renderer-manager, esplora-viewer, view-mode-system,
                         explode-controller (+tests), crank-angle-clock (+tests)
packages/data            zod schemas (+tests) — the shared shape contract
packages/events          bus + local-log (+tests)
packages/sim-core        boundary stub (Sprint 3 scope)
packages/ui              boundary stub (populated as shared components emerge)
tools/asset-pipeline     CLI stages (+tests), stand-in generator
content/                 components.json, spec_records.json, explode_standin.json (+README)
evals/                   slice_qa.json seed (3 guard pairs) + README
docs/                    14-document specification stack + ADRs (this document is #15)
.github/workflows        CI: verify (lint/typecheck/test/build + asset step) + e2e-smoke
```

## 3. Key Implemented Systems & Responsibilities

| System | Responsibility | Verified by |
|---|---|---|
| RendererManager | WebGPU detect → WebGL2 fallback; one code path | e2e (forced-WebGL2 context) |
| EsploraViewer | Stage (IBL/ACES/cove/contact shadow), AAA camera (damped orbit, dolly-to-cursor, pan, pole clamps, 1.2s cinematica framing journeys), pointer pipeline (hover-intent, click-select, dbl-click focus) | e2e + manual floor-device |
| ViewModeSystem | studio/officina/tecnico/xray presets — materials AND stage together; mode-aware selection FX (subject isolation; rosso edges in TECNICO; solid-subject X-ray); lazy edge build with tri budget | e2e mode cycle |
| ExplodeController | ExplodeDef-driven choreography; scrub + cinematica playback sharing one stagger model; resilient binding (missing nodes warn) | 4 unit tests + e2e |
| CrankAngleClock | 0–720° scalar; ratio rotations (AN-R) + one-cycle clip mapping (AN-T/O); rpm run mode; pure-function-of-angle | 4 unit tests + e2e |
| Deep links | Path=location, query=scene state (`vista/ciclo/esploso`); bookmark recovery; selection-driven history; Copia link snapshot | dedicated e2e spec |
| Scheda Tecnica | UXD §B placard ordering; verification badges on every value; catalog-only parts supported (lessons can link ahead of assets) | e2e |
| Asset pipeline | The four stages + manifest; S1 acceptance criterion | 4 unit tests + CI step |
| Truth discipline | `verificationStatus` in schema → badge in UI → (future) cert-mode block | schema tests + visible UI |

## 4. Technical Debt Register

| # | Item | Severity | Owed to |
|---|---|---|---|
| TD-1 | **R3F divergence:** ARCH-002 names React Three Fiber; the viewer is vanilla three (right call for the slice, but `@react-three/fiber`/`drei`/`gsap` sit unused in package.json). Decide: adopt R3F at SimRig build, or formalize vanilla via ADR and drop deps | Med | Sprint 3 start (ADR required) |
| TD-2 | **Accessibility gap:** no keyboard navigation of the 3D scene, no reduced-motion mode, no mirrored accessible tree — LXD-001/PRD §0.2 commitments not yet implemented | **High** | Sprint 3 (a11y baseline task) |
| TD-3 | Draco decoder from gstatic CDN (offline/enterprise risk) | Low | Asset-CDN story (MVP) |
| TD-4 | No IBL on WebGPU path (analytic rig only — PMREM is WebGL-bound in our three version) | Low | three WebGPU PMREM maturity |
| TD-5 | LOD switching + performance governor unbuilt (no content to exercise) | Med | First real asset batch |
| TD-6 | No visual-regression testing (ARCH-002 names it); e2e is single-browser/viewport, functional only | Med | Before UXD side-by-side gate |
| TD-7 | Subject isolation via material color multiply (approximation of UXD exposure-drop) | Low | Post-pass when bloom/outline lands |
| TD-8 | TECNICO edges = per-mesh LineSegments (fine at slice scale; merge/instance at engine scale) | Low | Engine-scale assets |
| TD-9 | Content via build-time JSON import (no runtime fetch/CMS path) | Low | Content growth (MLP) |
| TD-10 | localStorage event log grows unbounded (no cap/rotation) | Low | Beta hardening (S4) |
| TD-11 | No React error boundary / load-failure UX beyond the asset toast | Low | Beta hardening (S4) |
| TD-12 | Hover label chip (350ms dwell, UXD §E) not implemented | Low | UI polish pass |

### Debt resolution log (post-v0.2.0 autonomous hardening pass, 2026-06-13)

| Item | Status | Resolution |
|---|---|---|
| TD-1 | **Resolved** | ADR-012 formalizes vanilla-three; `@react-three/fiber`, `@react-three/drei`, `gsap` removed |
| TD-2 | **Partially resolved** | Reduced-motion (system-pref reactive), Escape-to-deselect, canvas ARIA shipped; full keyboard 3D navigation + mirrored accessible tree still open |
| TD-11 | **Resolved** | Root `ErrorBoundary` with OFFICINA-styled recovery screen |
| TD-5 | **Instrumented** | `PerfMonitor` + `PerfHud` (`?perf=1`) provide the FPS/frame/worst signal the governor will consume; LOD governor still awaits real assets |
| TD-10 | Open (unchanged) | event-log cap deferred to beta hardening |

## 5. Known Limitations

- **One asset.** Everything is proven on a 96-triangle procedural bolt; multi-part stagger, LOD, draw-call discipline, and the side-by-side brand test all await real content.
- **OFFICINA mode is a lighting preset**, not the workshop environment (bench/tool wall are Sprint-3 assets).
- UI chrome stays light-themed in officina mode (full dressing arrives with the Build screen).
- No mobile device testing (responsive layout works; touch tuning unverified on hardware).
- Tutor-proxy streams canned text only; evals are 3 seed pairs, harness not in CI yet.
- `pnpm dev` on Windows: `corepack enable` needs admin — `npm i -g pnpm@9.15.0` is the working path (documented in README).

## 6. Outstanding Non-Code Dependencies

| Dependency | Status | Impact |
|---|---|---|
| **Used cylinder head + valve hardware (~€500–1,500)** | **NOT ORDERED — was the week-1, day-1 task; now the single critical-path item** | Blocks scan → real assets → Sprint 2 asset goals, Sprint 3 content, the gate |
| Structured-light scan vendor booking | Not booked (depends on head) | Same chain |
| Vercel (web) + Fly.io (proxy) accounts & deploy wiring | Not configured | Blocks beta URL (S4) |
| Anthropic production API key + spend cap | Not configured | Blocks S4 tutor |
| Beta recruit pipeline (45 to seat 30) | Not started (S3 task) | Blocks S4 beta |
| Workstream-0 legal opinion (Ducati IP) | Not started | RDM-001 requires by month 3 |

## 7. Sprint 3 Prerequisites

1. **TD-1 decision (ADR)** before SimRig work begins — the simulator UI is where R3F-vs-vanilla matters most
2. **Asset arrival plan:** head ordered + scan booked, OR an explicit interim decision (model the valve group from photos/manual dims at reduced fidelity, swap post-scan)
3. **Content authoring:** `station_9_slice.json` StepDefs + `lesson_c2_condensed.json` (Content Engineer; spec'd in RDM-002 §8; routes `/lezione`, `/officina` are reserved and ready)
4. `sim-core` has zero dependencies and can start immediately (state machines + scoring, headless)
5. TD-2 accessibility baseline scheduled as a real task, not a hope
6. Workshop-bench environment + tool assets brief to the artist (UXD §I)

## 8. Recommended Git Commit Strategy

**There is no repository yet — initialize now, before Sprint 3 adds parallel workstreams.**

1. `git init` + verify `.gitignore` coverage (`node_modules`, `dist`, `.env`, `apps/web/public/assets/` are already listed; plan files and `.claude/` should be added).
2. **Genesis as a curated sequence** (final-state files, staged by area — reviewable history beats one blob):
   - `docs: specification stack v1 (ARCH/BOM/LXD/SIM/MFG/AST/RDM/UXD/PRD + ADRs)`
   - `chore: monorepo scaffold (pnpm/turbo/ts-strict/CI)`
   - `feat(data,events): shared schemas and event bus`
   - `feat(pipeline): asset CLI + stand-in acceptance article`
   - `feat(three-engine): renderer manager + esplora viewer (D-1 lighting, AAA camera)`
   - `feat(three-engine): view modes (ADR-010), explode controller, crank clock (ADR-011)`
   - `feat(web): OFFICINA esplora — rails, placard, mode dock, deep links`
3. **Going forward:** trunk-based with short-lived branches; Conventional Commits (`feat/fix/docs/chore` + scope); PRs gated on the existing CI (verify + e2e-smoke); commits that change authoring contracts (schemas, ADRs) must reference the ADR id in the body; content changes (`content/`) commit separately from code.
4. Remote + branch protection once the team is >1.

## 9. Recommended Milestone Tag / Version

- **Version: `v0.2.0`** — semver 0.x; minor = sprint milestone (0.1.0 retroactively marks the S1 scaffold commit; 0.2.0 = Sprint 2 complete). Set root `package.json` version accordingly at tag time.
- **Annotated tag:** `v0.2.0` with message `Sprint 2 — Esplora (OFFICINA): staged viewer, view-mode presets, explode, crank clock, deep links. Slice gate pending assets.` Optional alias tag `sprint-2-esplora`.
- Next milestones: `v0.3.0` Sprint 3 (Lezione + Officina build station) · `v0.4.0` Sprint 4 (tutor + beta) · `v0.5.0` = RDM-002 gate pass.

---

*RDM-004 v1.0 — Sprint 2 software scope accepted with TD-5 (LOD/governor) explicitly carried to asset arrival. The project's critical path is now entirely non-code: order the cylinder head.*
