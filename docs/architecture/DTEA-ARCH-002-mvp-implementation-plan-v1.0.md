# DTEA-ARCH-002 — MVP Technical Implementation Plan ("The Glass Engine")
**Version:** 1.0 | **Date:** 2026-06-12 | **Status:** Approved
**Parent documents:** DTEA-RDM-001 (MVP scope definition — governs), DTEA-ARCH-001 (platform architecture), DTEA-BOM-001 (component model), DTEA-SIM-001 (Stations 5/9/10/11 mechanics), DTEA-AST-001 (asset pipeline targets)
**Scope:** MVP only — months 1–6, closed beta. Everything outside RDM-001's MVP feature list is explicitly out of scope here.

---

## 0. MVP Scope Recap (from RDM-001, binding)

**In:** Engine Explorer (ADL2 engine shell; ADL3/4 cylinder head + cranktrain) · explode · click-to-learn · photoreal/schematic/X-ray view modes · crank-angle clock · Deep-Dive content C1/C2/C5 · Build Simulator Stations 5, 9, 10, 11 (guided + standard) · AI Tutor v1 (curated context, 6 scene-control tools, no RAG) · Spec Library (engine subset, citations) · SRS flashcards · accounts, progress, xAPI.
**Out:** full motorcycle, all other modules, teardown E0, latent defects, expert difficulty, certification, fluid particles, thermal mode, voice, mobile optimization, RAG, real-time coaching, instructor features.
**QA floor:** WebGL2 on 2020-era integrated GPU @ 30 FPS. WebGPU runs where available but is not formally QA'd at MVP (RDM-001 §2.6).

---

## 1. Recommended Technology Stack (MVP-pinned)

| Concern | Choice | MVP-specific rationale |
|---|---|---|
| Language | TypeScript 5.x (strict) | Non-negotiable at this domain complexity |
| UI framework | React 19 | Per ARCH-001 |
| Build tool | Vite 6 | Fast iteration; library mode for packages |
| 3D | Three.js r17x + React Three Fiber + drei | WebGPURenderer with automatic WebGL2 fallback from one codebase |
| Physics | **None (deferred)** | MVP simulator is authored constraint logic — snap-zones, tolerance checks, torque ramps. Rapier (ARCH-001) enters post-MVP only if a mechanic genuinely needs rigid-body simulation. Removes a WASM dependency and a skill requirement |
| Animation | GSAP (explode/UI timelines) + custom crank-angle clock driving GLTF clips | Clips keyed to crank-angle parameter, not wall time (BOM rule 4) |
| State | Zustand (domain slices) + TanStack Query (server state) | Clean 3D↔UI separation |
| Styling/UI | Tailwind CSS 4 + Radix primitives | Per ARCH-001 |
| Backend API | Node.js 22 + Fastify | AI proxy, xAPI ingestion, spec-store reads |
| DB / Auth | Supabase (PostgreSQL 16 + Supabase Auth + RLS) | Per ARCH-001 consolidated layer |
| Cache/session | Upstash Redis | Tutor conversation context, session state |
| Asset CDN | Cloudflare R2 + CDN, content-hashed URLs | Per AST-001 |
| AI | Claude API server-side: claude-sonnet-4-6 (tutor), claude-haiku-4-5 (eval-suite grading runs) | Tool use for scene control; no RAG at MVP |
| Asset toolchain | Blender (masters) + glTF-Transform CLI (draco/ktx2/prune/metadata) | §8 pipeline |
| Monorepo | pnpm workspaces + Turborepo | Lighter than ARCH-001's full setup; sufficient at MVP team size |
| CI/CD | GitHub Actions → Vercel (web) + Fly.io (api) | Per ARCH-001 |
| Testing | Vitest (unit) · Playwright (e2e + WebGL2 visual regression) · custom AI eval harness | Visual regression on the WebGL2 floor only |
| Monitoring | Sentry (errors) + simple Datadog-lite metrics | Full APM deferred |

## 2. Frontend Architecture

**Two-layer principle:** the React DOM layer (panels, navigation, chat, spec library) and the R3F canvas layer (scene) never import each other's internals; they communicate exclusively through Zustand stores and a typed event bus. This is the seam that later lets the tutor, the simulator, and multiplayer (V3) all drive the same scene.

**Zustand store slices:**
- `sceneStore` — loaded assemblies, view mode, explode state, camera target, crank angle
- `selectionStore` — hovered/selected component (BOM ID), isolation state
- `buildStore` — active station, step state machine, fastener states, tool-in-hand, score ledger
- `tutorStore` — conversation, streaming state, pending tool calls
- `userStore` — profile, progress, SRS queue (server-synced via TanStack Query)

**Typed event bus (`@dtea/events`):** simulator and explorer emit domain events (`component:selected`, `torque:applied`, `step:completed`, `error:committed`); subscribers include the xAPI emitter, the score engine, and (Phase 5) the tutor context assembler. One bus, many consumers — the ARCH-001 "event stream" realized.

**Routing:** `/explore`, `/explore/:bomId` (deep links — also the tutor's navigation target), `/learn/:unitId` (C1/C2/C5), `/build/:stationId`, `/specs/:specId`, `/review` (SRS). Deep links are first-class: every tutor scene-control tool resolves to a route + store mutation.

## 3. Three.js Architecture

```
RendererManager
 ├─ WebGPU detect → WebGPURenderer | fallback WebGL2Renderer (one code path, capability flags)
 ├─ Performance governor: DPR scaling + LOD bias when frame budget exceeded (30 FPS floor)
SceneRoot
 ├─ EnvironmentRig (workshop HDRI, baked AO floor, 3-light studio rig)
 ├─ EngineAssemblyRoot  ← scene-graph hierarchy = BOM hierarchy (node names = BOM IDs)
 │   ├─ per-part LOD groups (render-LOD1–3 at MVP; LOD0 close-up only for exemplar parts)
 │   └─ capped-section variants (CUT-Y meshes toggled, never runtime CSG)
 ├─ SelectionSystem (raycast layer masks; hover/select/isolate; outline pass)
 ├─ ViewModeSystem (material-slot swap: photoreal PBR / schematic flat / X-ray fresnel)
 ├─ ExplodeController (GSAP timelines from external explode-JSON, per ARCH-001 format)
 ├─ CrankAngleClock (single scalar 0–720°; drives all AN-R/T/O clips via clip-time remapping)
 └─ SimRig (Phase 4: tool gizmos, snap-zone volumes, torque HUD, measurement overlays)
```

Key disciplines: **< 100 draw calls** (fastener InstancedMesh per AST-001; material merging on schematic mode) · all assets through the §8 pipeline only (no ad-hoc imports) · `userData` carries the BOM metadata contract (selection system reads `componentId`, never mesh names directly) · disposal manager for sub-assembly streaming (head and cranktrain sub-GLBs load on demand).

## 4. Data Model (MVP entities)

```
Component        — BOM ID (PK), display name, hierarchy path, ADL tier, metadata JSONB
                   (BOM-001 schema incl. source_citation), media refs, module links
SpecRecord       — spec ID, type (torque|clearance|consumable), value(s)+unit, stage data,
                   PL/⚠ status flag, source_doc FK, verifier, verified_at
SpecSource       — document registry (manual edition, page-level citation anchors)
LessonUnit       — C1/C2/C5 content blocks (markdown + scene-state bookmarks:
                   a content block can pin camera/explode/view-mode state)
BuildStation     — station def (5/9/10/11): ordered StepDefs
StepDef          — step ID, action type (place|orient|torque|measure|apply|inspect),
                   target component(s), spec FK, tolerance profile per difficulty,
                   classic-error triggers, scoring weights
BuildSession     — user run: station, step states, fastener ledger, score decomposition, status
UserProgress     — per unit/station: status, best score, attempts, time
SRSCard          — spec-derived flashcard (FK to SpecRecord), SM-2 scheduling state
XapiStatement    — append-only event log (ARCH-001 §9.4 format)
TutorSession     — conversation ID, turns, tool-call log (Redis-hot, PG-archived)
```

## 5. Database Schema (MVP subset of ARCH-001 §8)

**PostgreSQL (Supabase, RLS on all user tables):**
- `users`, `user_preferences` — per ARCH-001, minus VR/locale fields
- `components` (JSONB doc per BOM schema; GIN index on hierarchy path + keywords)
- `spec_records`, `spec_sources` — **with `verification_status` enum (verified | placeholder_PL | flagged)**; the simulator's certification-block rule reads this column (at MVP: UI badge only, since certification is out of scope)
- `lesson_units` (JSONB content blocks with scene-bookmark objects)
- `build_stations`, `step_defs` (authored content, versioned via `content_rev`)
- `build_sessions` (JSONB step-state; one row per run)
- `module_progress`, `srs_cards`, `srs_reviews`
- `xapi_statements` (JSONB, BRIN on timestamp; partitioned later, not at MVP)
- `tutor_sessions` (archive of Redis conversations, for eval mining)

**Redis keys:** `session:{userId}` · `tutor_ctx:{userId}` (last N turns + current scene state snapshot, TTL 2 h) · `build_active:{userId}` (live sim state autosave, TTL 7 d).

## 6. AI Tutor Architecture (v1 — no RAG)

```
Client chat UI ──SSE──► Fastify /tutor endpoint
                          │
                          ▼
                 Context Assembler
                  ├─ system prompt: role, guardrails (cite-or-decline on specs,
                  │   verify-against-manual framing, scope limits)
                  ├─ CURATED KNOWLEDGE BLOCK: the engine-scoped verified spec set +
                  │   C1/C2/C5 content digests (fits in context — this is why no RAG at MVP)
                  ├─ scene state snapshot (from client: route, selected BOM ID, view mode,
                  │   explode state, active station/step if building)
                  └─ conversation history (Redis)
                          │
                          ▼
                 Claude API (claude-sonnet-4-6, tool use enabled)
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
        text stream → SSE       tool calls → client executes → result → continue
```

**The 6 scene-control tools (client-executed):** `navigate_to(route|bomId)` · `highlight_component(bomId)` · `set_view_mode(mode)` · `trigger_explode(assemblyId, level)` · `set_crank_angle(deg) / play_cycle()` · `open_spec(specId)`. Tool results return the *actual* resulting scene state, re-grounding the model.

**Guardrail enforcement:** spec values in responses are post-processed — any numeric torque/clearance claim is matched against `spec_records`; unmatched values trigger a regeneration with a stricter instruction, then a decline. **Eval harness is MVP infrastructure:** ~200-pair engine-scoped factual QA set (grown toward 500 post-MVP), run in CI on every prompt change; <2% error is a merge gate. Haiku grades; flagged disagreements human-reviewed.

## 7. File/Folder Structure (monorepo)

```
dtea/
├── apps/
│   ├── web/                    # React app
│   │   └── src/{app,routes,components,stores,events,hooks,styles}
│   └── api/                    # Fastify
│       └── src/{routes,tutor,xapi,specs,plugins}
├── packages/
│   ├── three-engine/           # RendererManager, SceneRoot systems (§3) — framework-agnostic core + R3F bindings
│   ├── sim-core/               # station/step state machines, scoring engine, tolerance logic (pure TS, fully unit-testable)
│   ├── data/                   # shared types, zod schemas (Component, SpecRecord, StepDef, xAPI), DB types
│   ├── events/                 # typed event bus + xAPI mapping
│   ├── ui/                     # shared Radix/Tailwind components
│   └── content/                # lesson units, station defs, explode JSON (authored content as versioned data)
├── tools/
│   └── asset-pipeline/         # glTF-transform scripts, BOM-naming linter, budget checker, manifest builder
├── supabase/                   # migrations, RLS policies, seed
├── evals/                      # tutor QA pairs + harness
└── docs/                       # (this documentation tree)
```

`sim-core` and `three-engine` deliberately have no React dependency — simulator logic is testable headless, and the render layer is replaceable.

## 8. Asset Pipeline (MVP)

```
Salvage-engine teardown (AST-001 C2)
  → scans + photos + measurements (→ docs/data tracker)
  → Blender master files  [naming = BOM IDs; collections = BOM hierarchy;
                           photoreal + schematic material slots; CUT-Y capped variants;
                           LOD1–3 meshes; clips keyed to crank-angle convention]
  → GLB export (per Level-3 subsystem boundary: head.glb, cranktrain.glb, engine-shell.glb)
  → tools/asset-pipeline:
      1. lint: BOM-ID naming, hierarchy match against components DB, budget check (tri counts, draw-call estimate)
      2. metadata injection: userData from components DB (single source of truth — Blender never hand-carries metadata)
      3. optimize: prune → weld → draco (per-class quantization presets) → ktx2 (BC7)
      4. manifest: content-hash filenames + manifest.json (assembly → URL + byte size + LOD map)
  → R2 upload (immutable, hash-addressed)
  → web app loads via manifest (versioned; rollback = manifest pointer swap)
```

Pipeline acceptance test (Phase 1 exit): one intake valve travels scan → master → pipeline → renders in-app with correct metadata, selection, and all three view modes.

## 9. Build Sequence — Five Phases (26 weeks, overlapping waves)

### Phase 1 — Foundation (weeks 1–6)
Monorepo + CI/CD + environments · Supabase schema + RLS + auth flows · spec-store seeded with PL-flagged engine specs + citation UI pattern · asset pipeline built and proven (valve acceptance test) · RendererManager with WebGPU→WebGL2 fallback proven on floor hardware · event bus + xAPI emitter skeleton · **salvage engine purchased week 1; teardown scanning underway (critical path for Phase 3/4 assets)**.
**Exit:** valve-in-app acceptance test passes on integrated GPU; auth + progress round-trip works; CI runs lint/unit/e2e.

### Phase 2 — 3D Viewer (weeks 5–10)
Engine ADL2 shell loaded via manifest (streaming sub-GLBs) · orbit/zoom/focus camera with part-framing transitions · LOD switching + performance governor hitting 30 FPS floor · workshop environment + HDRI rig · view-mode system (photoreal/schematic/X-ray) · DPR scaling tested on the QA floor device set.
**Exit:** full engine shell at 30 FPS on 2020 integrated GPU; view modes switch < 100 ms; draw calls < 100.

### Phase 3 — Component Explorer (weeks 9–16)
Selection system (hover/select/isolate, outline pass) wired to `components` DB info panels · deep-link routes · ExplodeController with authored explode JSON for head + cranktrain · CrankAngleClock + running-engine clips on the modeled subset · C1/C2/C5 lesson units with scene-bookmark blocks (content pins camera/explode/view state) · spec library subset + SRS flashcards live.
**Exit:** a learner can find, isolate, explode, and read about every head/cranktrain part; C2 lesson plays the valve-lift animation against the clock; SRS review loop works end-to-end.

### Phase 4 — Engine Simulator (weeks 15–22)
`sim-core` state machines + scoring engine (decomposed per SIM-001 §3.6, headless-tested) · SimRig: tool gizmos, snap-zones, torque mechanic (ramp/click/yield states), placement + orientation tolerance, feeler-gauge + Plastigauge measurement interactions (the station-required subset) · consumable application (oil sheen, moly) visual states · **Stations 5, 9, 10, 11** authored as StepDef content, guided + standard difficulty · classic-error immediate/inspection-caught classes (latent class deferred per RDM-001) · build sessions autosaved; xAPI decomposed scoring events.
**Exit:** all four stations completable at both difficulties; scoring reproducible in headless tests; a seeded wrong-collet attempt is caught at the inspection point with the teaching explanation.

### Phase 5 — AI Tutor (weeks 21–26)
Fastify tutor endpoint + SSE streaming chat UI · context assembler with curated knowledge block + scene-state snapshot · the 6 scene-control tools end-to-end (model → client execution → re-grounding) · spec post-processor guardrail · eval harness in CI at the <2% gate · beta hardening: error budgets, Sentry triage, load test (500 concurrent), onboarding flow + the 3-minute guided tour.
**Exit:** "show me how the valve spring is compressed during assembly" produces correct navigation + explode + animation + narration; eval gate green; closed beta (100 users) opens.

**Dependencies to watch:** teardown scanning (P1) feeds exemplar modeling that lands mid-P3 — the asset track runs parallel to all five phases and is the schedule's long pole (per AST-001 vertical-slice economics, re-baselined at P3 exit).

---

*DTEA-ARCH-002 v1.0 — implementation blueprint for RDM-001's MVP only. Post-MVP additions (Rapier, RAG, latent defects, remaining stations) re-enter via the parent documents' designs; nothing here forecloses them.*
