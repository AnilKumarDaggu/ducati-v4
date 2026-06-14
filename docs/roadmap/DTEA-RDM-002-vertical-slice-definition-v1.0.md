# DTEA-RDM-002 — Vertical Slice Definition: "The Valve Slice"
**Version:** 1.0 | **Date:** 2026-06-12 | **Status:** Approved
**Parent documents:** DTEA-ARCH-002 (implementation blueprint — this slice front-runs its phases on minimal content), DTEA-RDM-001 (MVP scope), DTEA-SIM-001 (Station 9 mechanics), DTEA-BOM-001 (Exemplar A)

---

## 1. What This Is

The smallest buildable product that demonstrates the platform's value. A true vertical slice: a thin cut through **every layer** — 3D viewer, component explorer, lesson content, build simulator, AI tutor — on the smallest content unit that carries the platform's three value propositions:

1. *Explore a real engineering assembly in photorealistic, explodable 3D*
2. *Build it with real workshop discipline (placement, precision, inspection, torque)*
3. *Be taught by an AI that drives the scene while explaining*

**The content unit: one cylinder head, with full interaction depth on one intake-valve group.** SIM-001 Station 9 ("the fiddliest mechanic in the simulator") compressed to a single valve install — which happens to contain the platform's best story (the spring that replaced desmo), its canonical classic error (collet mis-seat), a measurement act (seat-band check), and a satisfying physical skill loop (compressor control).

**Timeline: 10 weeks, 4–5 people.** This *replaces* the front of ARCH-002's schedule: ARCH-002 Phases 1–5 still happen, but each is first exercised here at 1/10th content scale. The slice IS the integration test.

## 2. Complexity Challenges (cuts beyond ARCH-002's MVP)

| ARCH-002 MVP includes | Slice verdict | Why |
|---|---|---|
| Accounts, Supabase Auth, RLS, progress DB | **CUT — localStorage only** | A proof-of-concept needs no user identity. Removes auth flows, RLS policies, and most of the backend. The only server component left is a stateless AI proxy |
| Redis conversation context | **CUT** | Client holds the conversation, sends it each turn. Stateless proxy |
| xAPI statement store | **CUT — local event log** | The event *bus* ships (it's architecture); the statement *warehouse* doesn't |
| Full engine ADL2 shell | **CUT — one head exterior** | The engine shell proves rendering scale, not value. Scale testing returns in MVP Phase 2 |
| 4 build stations | **CUT — one station segment** (Station 9 core + 2-bolt torque coda) | One complete loop of every mechanic class beats four stations of repetition |
| C1/C2/C5 lesson units | **CUT — one unit** (C2 condensed: the desmo-to-spring story + live valve-lift animation) | One great lesson proves the content format |
| Spec Library screen + SRS | **CUT — inline spec cards only** | The citation pattern ships (it's the brand); the library UI doesn't |
| 6 tutor scene tools | **TRIMMED to 5** (drop `open_spec` — spec cards are inline) | |
| Salvage engine (~€4–8k) | **DEFERRED — buy one used cylinder head + valve set from a breaker (~€500–1,500 ⚠)** | The slice needs one head's ground truth, not a whole engine. The engine purchase moves to slice-exit (it gates MVP, not the slice) |
| WebGPU + WebGL2 paths | KEPT (one codebase, fallback automatic) | Free by architecture; QA on WebGL2 floor only |

**What is deliberately NOT cut:** the asset pipeline (BOM naming, metadata injection, draco/ktx2, manifest — full discipline on 30 parts), the typed event bus, the spec store with `verification_status` and visible citations, the eval harness, and the scoring engine. These are the platform's skeleton; the slice exists to prove them.

## 3. Features Included

- **Explore:** head exterior (ADL2) + one intake-valve group at ADL4 (~15 parts); orbit/zoom/focus; hover/select/isolate; click → info card (function, material, citation-flagged specs); photoreal / schematic / X-ray view modes; progressive explode of the valve group
- **Learn:** one lesson unit — "Why Ducati Gave Up Desmo" — markdown blocks with scene bookmarks (camera/explode/view-state pins) + the valve-lift animation driven by a cam-angle scrubber (CrankAngleClock at single-valve scope)
- **Build:** one station segment, guided + standard difficulty:
  1. Clean head check (cleanliness mechanic, minimal)
  2. Stem seal install (push-click placement)
  3. Valve insertion (oil application + orientation)
  4. Spring + seat + retainer placement
  5. **Spring-compressor + collet installation** (the precision mechanic; collet mis-seat = the seeded classic error, caught at the verify step with the teaching explanation)
  6. Tap-test + seat-band inspection (measurement verdict)
  7. **Torque coda:** 2 cam-cap bolts at PL 10 Nm ⚠ — proves the torque mechanic (ramp, click, over-torque yield wrong-state) which Station 9 alone wouldn't exercise
  8. Debrief: decomposed score (SIM-001 §3.6 weights)
- **AI Tutor:** streaming chat panel; 5 scene tools (`navigate_to`, `highlight_component`, `set_view_mode`, `trigger_explode`, `play_valve_cycle`); curated context = the ~30 components + ~10 specs + lesson digest; cite-or-decline guardrail; ~50-pair slice-scoped eval in CI
- **Telemetry:** local event log (bus-emitted), exportable JSON for beta analysis

## 4. Features Excluded (explicit)

Accounts/auth/progress sync · full engine · other stations · teardown · expert difficulty · latent defects · certification · SRS · spec library screen · fluid/thermal/audio systems · voice · RAG · coaching · mobile · all modules beyond this content · any motorcycle-level anything.

## 5. Screens (4)

1. **Landing** — one scroll page: what this is, 60-second concept video placeholder, "Enter" (no signup)
2. **Explorer** — the main 3D canvas + collapsible info panel + view-mode/explode controls + tutor chat panel (slide-in) + "Lesson" and "Build" entry buttons
3. **Lesson** — same canvas, content rail on the left; blocks pin scene state as the learner scrolls; cam-angle scrubber embedded
4. **Build Station** — same canvas in SimRig mode: tool tray, step panel (visibility per difficulty), torque HUD, score ticker; debrief overlay at completion

One canvas, four dressings — no separate 3D contexts.

## 6. User Flows (3 core + 1 demo)

- **F1 Explore-first:** Landing → Explorer → hover/identify parts → isolate valve → explode group → read info cards → (organically) into Lesson
- **F2 Learn-then-build:** Lesson (story + scrubbing the valve cycle) → "Now build it" CTA → Build (guided) → debrief → retry at standard
- **F3 Tutor-led:** any screen → ask "show me how the collets hold the valve" → tutor navigates, explodes, highlights, plays the cycle while narrating → learner asks follow-ups
- **F-demo (the pitch flow, 3 minutes):** Landing → tutor-led collet explanation (F3) → guided collet install with the seeded mis-seat → the catch + explanation → score debrief. This flow is the fundraising/partner demo and gets its own rehearsed polish pass

## 7. Required Assets

- **Geometry (~30 modeled parts, est. 60–80 artist-days):** head casting exterior ADL2 (1) · valve group ADL4 ×1 cylinder: intake valve ×2, stem seals, springs, spring seats, retainers, collets ×4, finger follower ⚠ config, cam section with lobe, cam caps ×2 + bolts (instanced) · ghosted-context valve group (low-detail neighbor cylinder for spatial context)
- **Tools (5):** spring compressor (articulated), oil applicator, torque wrench (2–25 Nm), pick/magnet, soft mallet
- **Environment:** bench + stand corner of the workshop (not the full bay), 1 HDRI, baked floor
- **Animations:** valve-lift cycle (cam→follower→valve, clock-driven) · spring compression · collet seat/mis-seat wrong-states · bolt-yield wrong-state · explode choreography (1 JSON)
- **Source:** one used Granturismo cylinder head + valve hardware from a breaker (~€500–1,500 ⚠) — scan + measure; findings feed the `docs/data/` tracker (answers the valve-spring single/dual ⚠ and follower-type ⚠ items directly)

## 8. Required Data Structures (all per ARCH-002 schemas, file-seeded — no DB at slice scope)

- `components.json` — ~30 records, full BOM-001 metadata schema incl. `source_citation`
- `spec_records.json` — ~10 records (seat-band width, spring free length, clearances, the 2 torque values), every one `placeholder_PL` or `verified` flagged
- `lesson_c2_condensed.json` — content blocks + scene bookmarks
- `station_9_slice.json` — StepDefs with tolerance profiles per difficulty + classic-error triggers + scoring weights
- `explode_valve_group.json` — ARCH-001 explode format
- `tutor_context.md` — the curated knowledge block
- `evals/slice_qa.json` — ~50 factual pairs
- localStorage: progress + event log (schema-matched to future xAPI so migration is a mapper, not a redesign)

## 9. Success Criteria (the gate to MVP continuation)

**Technical:** 30 FPS on 2020 integrated GPU (WebGL2) · first-interactive < 8 s on 50 Mbps · view-mode switch < 100 ms · tutor tool-loop (request → scene action → narration) succeeds ≥ 95% of attempts · slice eval < 2% factual error.
**Learning:** ≥ 80% of ~30 testers complete the guided build without human help · the seeded collet error is caught at verify and its explanation rated "understood" by ≥ 75% · ≥ 60% voluntarily replay at standard difficulty (the engagement signal).
**Economic:** measured artist-days per ADL4 part vs. AST-001 estimate (the >40% descope trigger lives here) · measured tutor cost/session.
**Strategic:** the F-demo flow lands — qualitative, but it's what the MLP launch, partners, and any future Ducati conversation are sold with.
**Gate review:** recorded as DTEA-RDM-003 (renumbering the README's expected docs); pass → ARCH-002 Phases 2–5 proceed at full MVP scope; fail → diagnose per criterion, descope per pre-agreed paths.

## 10. The Recommendation (bottom line)

Build **The Valve Slice** in 10 weeks with 4–5 people and one €1,000 cylinder head — not the 26-week MVP first, and certainly not the engine. It is the cheapest object that can make someone say *"I understand this part of a Ducati engine better than I understand my own car"* — and the cheapest possible test of every architectural bet: the pipeline, the event bus, the sim grammar, the tutor's hands on the scene, and the truth discipline. Everything after it is scaling content through a proven machine.

---

*DTEA-RDM-002 v1.0 — the slice gate review will be recorded as DTEA-RDM-003. Amendment to AST-001 (cylinder-head-only sourcing for the slice; salvage engine at slice-exit) recorded in the assets registry README.*
