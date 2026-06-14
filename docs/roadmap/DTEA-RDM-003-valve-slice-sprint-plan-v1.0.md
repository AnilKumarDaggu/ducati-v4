# DTEA-RDM-003 — Valve Slice Sprint Plan
**Version:** 1.0 | **Date:** 2026-06-12 | **Status:** Approved
**Parent documents:** DTEA-RDM-002 (slice definition — governs scope), DTEA-ARCH-002 (technical blueprint), DTEA-SIM-001 (Station 9 mechanics), DTEA-AST-001 (pipeline targets)

---

## 0. Frame

**10 weeks = 4 sprints × 2.5 weeks.** Team of 5: Lead Engineer (3D/full-stack), Frontend Engineer, Technical 3D Artist (+ contracted scanning), Content Engineer (50%, authors data files/lesson/steps from the doc stack), Product/QA (50%). The **asset track runs in parallel across all sprints** — it is the schedule's long pole and is tracked per-sprint below.

**Cadence:** weekly live demo against the RDM-002 user flows (F1–F3, F-demo) — demos are the working product, never slides. Sprint reviews measure against acceptance criteria below; the slice ends in the RDM-002 §9 gate review (to be recorded as DTEA-RDM-004).

**Slice-scope simplifications confirmed:** no DB, no auth (localStorage), stateless tutor proxy, **assets served static from the web deploy (no R2 until MVP)**.

---

## SPRINT 1 — Foundation & Scaffold (weeks 1–2.5)

### Objectives
A deployed, CI-protected skeleton that proves the architecture end-to-end on stand-in content; the cylinder head procured and the scan booked; the asset pipeline working on one test part.

### Repository structure (slice-trimmed from ARCH-002 §7)
```
dtea/
├── apps/
│   ├── web/                  # Vite + React 19 app (the product)
│   └── tutor-proxy/          # Fastify, stateless — the entire backend
├── packages/
│   ├── three-engine/         # RendererManager, scene systems (no React dep)
│   ├── sim-core/             # state machines + scoring (pure TS, headless-tested)
│   ├── data/                 # zod schemas + types (Component, SpecRecord, StepDef, LessonUnit, ExplodeDef, events)
│   ├── events/               # typed event bus + local event-log sink
│   └── ui/                   # shared Tailwind/Radix components
├── tools/asset-pipeline/     # CLI: lint → metadata-inject → draco/ktx2 → manifest
├── content/                  # components.json, spec_records.json, station JSON, lesson JSON, explode JSON, tutor_context.md
├── evals/                    # slice_qa.json + harness
└── .github/workflows/        # CI
```

### Development environment
Node 22 LTS (corepack-pinned pnpm 9) · TypeScript 5 strict everywhere · ESLint + Prettier shared config · Vitest (unit) + Playwright (e2e, runs on a WebGL2-forced context) · `.env` convention: `ANTHROPIC_API_KEY` server-side only (tutor-proxy), never bundled · VS Code workspace settings + recommended extensions committed · Artist environment: Blender 4.x with the project naming/export preset file (BOM IDs, material slots, clip conventions) checked into `tools/`.

### Initial dependencies (pinned at sprint start)
`react@19`, `three@r17x`, `@react-three/fiber`, `@react-three/drei`, `zustand`, `gsap`, `tailwindcss@4`, Radix primitives, `react-router`, `zod` · API: `fastify`, `@anthropic-ai/sdk` · Pipeline: `@gltf-transform/core+functions+cli`, `sharp` (KTX2 via toktx) · Dev: `vite@6`, `vitest`, `playwright`, `turbo`. **Not installed (deliberately):** TanStack Query (no server state at slice), Rapier (no physics), Supabase client (no DB), Redis client (stateless proxy).

### Project scaffolding tasks
1. Monorepo init, workspace graph, Turbo pipeline, CI (lint/typecheck/unit/e2e-smoke, <10 min budget), Vercel preview deploys + Fly.io for tutor-proxy
2. `three-engine`: RendererManager — WebGPU detect → WebGL2 fallback, stats overlay, floor-hardware perf harness page
3. `data`: all zod schemas authored from ARCH-002 §4/§5 shapes
4. `events`: bus + localStorage event-log sink (xAPI-shaped payloads per RDM-002 §8)
5. `asset-pipeline` v0: BOM-naming linter, metadata injection from `components.json`, draco/ktx2, manifest emit
6. Stand-in part (procedurally modeled bolt) through the full pipeline into the deployed app — selectable with metadata visible
7. `tutor-proxy` hello-world: streams a canned response over SSE end-to-end
8. **Week 1, day 1: order the used Granturismo cylinder head + valve hardware (~€500–1,500 ⚠); book structured-light scan vendor for week 3**
9. Content Engineer: draft `components.json` (~30 records) + `spec_records.json` from BOM Exemplar A; draft Station-9 StepDefs

### Deliverables
Deployed skeleton URL · pipeline CLI with acceptance test green · all schemas · CI/CD live · head ordered (ideally in hand) · seed content drafted.

### Dependencies
Anthropic API key · Vercel/Fly accounts · breaker/parts-supplier shortlist (prepared before sprint).

### Acceptance criteria
App boots on the floor device (2020 integrated GPU) in both renderer paths · stand-in part flows scan→pipeline→app with correct metadata and selection · CI green under 10 minutes · tutor-proxy streams.

### Risks
Head sourcing delay (mitigation: day-1 order, 3-vendor shortlist, modeling can start from photos + manual dimensions if hardware slips a week) · WebGPU fallback edge cases on the device matrix (mitigation: WebGL2 is the QA floor — WebGPU issues are logged, not blocking).

---

## SPRINT 2 — Viewer & Explorer (weeks 2.5–5)

### Objectives
Explorer screen feature-complete; first real scanned assets in-app; the F1 flow (explore → identify → explode → read) walkable end-to-end.

### Tasks
Camera system (orbit/zoom + focus-framing transitions) · SelectionSystem (raycast layers, hover outline, click-select, double-click isolate) · info-card panel bound to `components.json` with **citation badges and PL/⚠ flags visible** · ViewModeSystem (photoreal/schematic/X-ray material-slot swap) · ExplodeController + authored `explode_valve_group.json` · bench-corner environment, HDRI, baked floor · LOD switching + performance governor (DPR scaling) · deep-link routes (`/explore/:bomId`) · **Asset track:** scan executed (week 3); head exterior ADL2 + first valve-group parts (valve ×2, springs, seats, retainers, collets) retopo'd, textured, through pipeline by sprint end; **ADL4 artist-day actuals logged per part from the first part onward** (the economics measurement starts here, not at gate time).

### Deliverables
Explorer screen complete on partial real assets · F1 flow demo · environment lit and graded · first ADL4 economics datapoints.

### Dependencies
Sprint-1 pipeline and schemas · scan vendor delivery (the sprint's critical input).

### Acceptance criteria
30 FPS on floor hardware with all loaded assets · view-mode switch <100 ms · select/isolate/explode work on ≥10 real scanned parts · every info card shows function, material, and citation-flagged specs · F1 demo runs without dev intervention.

### Risks
Scan→retopo slower than estimated (mitigation: artist prioritizes the 6 parts the build station needs; ghosted-context parts can stay scan-mesh temporarily) · Draco quantization artifacts on machined surfaces (mitigation: per-class quantization presets already in pipeline; tune on first real part).

---

## SPRINT 3 — Lesson & Build Station (weeks 5–7.5)

### Objectives
The F2 flow complete: the lesson teaches, then the learner builds the valve with every mechanic class working at both difficulties.

### Tasks
`sim-core`: station/step state machines + decomposed scoring engine (SIM-001 §3.6 weights), fully headless-tested · SimRig: tool tray, tool-in-hand gizmos, step panel (difficulty-gated visibility), score ticker, debrief overlay · mechanics: placement/orientation tolerance (guided snap ≤10 mm / standard 2 mm/2°), oil-application wet-sheen state, **spring-compressor precision mechanic** (compress-place-release control loop), **collet seat/mis-seat classic error** with verify-step catch + teaching explanation, tap-test + seat-band inspection verdict, **torque mechanic** (ramp, click-at-spec, over-torque yield wrong-state) on the 2-bolt coda · Lesson player: content rail, scene-bookmark blocks (pin camera/explode/view state on scroll), cam-angle scrubber driving the valve-lift clip · **Asset track:** follower, cam section + lobe, cam caps + bolts (instanced), 5 tools, wrong-state animations (mis-seat, bolt yield), valve-lift + spring-compression clips.

### Deliverables
Lesson + Build screens complete · full 30-part asset set in-app · F2 flow demo at both difficulties · headless scoring test suite.

### Dependencies
Sprint-2 selection/camera systems · wrong-state animation assets (artist's sprint-3 priority) · finalized StepDef content from Content Engineer.

### Acceptance criteria
Both difficulties completable start-to-debrief · the seeded collet mis-seat is catchable at verify with the explanation shown · scoring reproducible byte-identical in headless runs · over-torque yields the bolt with the wrong-state animation and score consequence · lesson bookmarks drive the scene correctly while scrolling · valve-lift animation stays synced to the scrubber.

### Risks
**Precision-mechanic feel** — "fiddly" must read as skill, not frustration (mitigation: playtest with 5 outsiders in week 6, tune tolerance/assist curves; this is the sprint's primary design risk) · clock-driven clip plumbing complexity (mitigation: single-valve scope keeps it small; the convention is what's being proven).

---

## SPRINT 4 — Tutor, Hardening & Gate (weeks 7.5–10)

### Objectives
The F3 and F-demo flows live; 30-user beta executed; gate review written. The slice ships.

### Tasks
Tutor-proxy complete: context assembler (curated knowledge block from `tutor_context.md` + client-sent scene snapshot + client-held history), Claude tool-use round trip, SSE streaming · client execution of the 5 scene tools with re-grounding returns · cite-or-decline post-processor (numeric claims matched against `spec_records.json`) · eval harness: 50-pair `slice_qa.json` in CI, <2% merge gate · Landing page + 60-second onboarding tour · event-log export (JSON download) · **F-demo polish pass**: the rehearsed 3-minute flow (tutor explains collets → guided install with seeded error → catch → debrief) tuned until it lands reliably · beta: 30 recruits (sourced during Sprint 3), structured tasks + survey, telemetry analysis · ADL4 unit-economics report (actuals vs. AST-001, the >40% descope trigger evaluated) · author the gate review (DTEA-RDM-004) against RDM-002 §9 criteria.

### Deliverables
Deployed public slice · beta results pack (completion rates, replay rate, error-catch comprehension, tutor transcripts) · economics report · DTEA-RDM-004 gate review.

### Dependencies
All prior sprints · beta recruits confirmed by end of Sprint 3 · Anthropic API production key + spend cap configured.

### Acceptance criteria
Tutor tool-loop (request → scene action → narration) ≥95% success across the test battery · eval <2% factual error · "show me how the collets hold the valve" produces correct navigate+explode+highlight+animate+narrate unaided · F-demo lands in 3 consecutive rehearsals with external viewers · all RDM-002 §9 criteria **measured** (green or red — the gate review reports truth, not optimism).

### Risks
Tool-call loop reliability on slow networks (mitigation: optimistic UI + tool-timeout fallbacks to text-only answers) · tutor latency/cost per session above target (mitigation: prompt-cache the curated block; measure from week 8) · beta recruitment shortfall (mitigation: recruit 45 to seat 30; motorcycle forums + engineering-student channels lined up in Sprint 3).

---

## Cross-Sprint Tracks

| Track | S1 | S2 | S3 | S4 |
|---|---|---|---|---|
| **Assets** | Head ordered; scan booked; Blender preset; stand-in part | Scan done; head + 6 core valve parts in-app; economics logging starts | Remaining parts, tools, wrong-states, clips | Polish, LOD audit, perf trim |
| **Content** | components/spec drafts | Info-card copy; lesson draft | StepDefs final; lesson final | tutor_context final; eval pairs final |
| **Truth discipline** | PL/⚠ flags in schema | Citations visible in UI | Spec-store-only values in sim | Head measurements → `docs/data/` tracker updates ⚠ items |
| **Risk watch** | Head sourcing | Scan quality / retopo rate | Mechanic feel playtest | Tool-loop reliability; beta |

---

*DTEA-RDM-003 v1.0 — execution plan for the Valve Slice. The slice gate review will be recorded as DTEA-RDM-004; sprint scope changes require a documented decision against RDM-002's cut list, never silent expansion.*
