# DTEA-RDM-001 — Product Versioning & Scope Strategy
**Version:** 1.0 | **Date:** 2026-06-12 | **Status:** Approved
**Parent documents:** all six approved documents (ARCH-001, BOM-001, LXD-001, SIM-001, MFG-001, AST-001)
**Supersedes:** the phase framing of ARCH-001 §9 as the *product* roadmap (ARCH-001 §9 remains the engineering-workstream reference; this document defines what ships to whom, when)

---

## 1. The 80/20 Analysis (read before the version table)

Where does the educational value actually live, measured against what each piece costs?

| Capability | Educational value | Cost (effort + asset) | Value/cost verdict |
|---|---|---|---|
| **Interactive Granturismo engine** (explore, explode, deep-dive, build) | The crown jewels — nothing like it exists anywhere | High but bounded (~700 a-d assets + sim engine) | **THE product. Build first.** |
| **AI tutor with scene control** | Transformative differentiation | Low (API + 6 tools + curated context) | **Extreme leverage. Build first.** |
| Spec library + SRS flashcards | High, daily-use utility | Trivial | **Build first.** |
| Full motorcycle ADL1–2 | Moderate — breadth and beauty, but closest to "what a website does" | High (~900 a-d incl. Class-A bodywork craft risk + donor bike) | Defer to V1.0 |
| Maintenance Workshop (G) | High for technician/owner segments | Medium, depends on full-bike assets | V1.0 |
| Diagnostics Center (L) | High, flagship for technicians | High (scenario engine + instruments + audio library) | V2.0 |
| Walkable factory campus + 35 machines | Moderate — the *concepts* carry the value, not the walkable halls | **Very high** (~600 a-d environments/machines) | **Cut from launch path entirely; V3.0** |
| Manufacturing concepts (sandboxes, part journeys, animations) | High | Medium (9 physics-lite models + ~40 animations) | V2.0 in "theater mode" (no walkable halls) |
| Vehicle Dynamics (J), Electrical (K) | High for engineer segment | Medium | V1.0 (T1–T2 depth) |
| Full assembly simulator (F) | Moderate (E already teaches the discipline) | High | V2.0 |
| Instructor Suite (N), collaborative CRDT builds | Moderate, B2B enabler | High (real-time infra) | V3.0 |
| Level 3/4 certification (human-moderated vivas, capstones) | High prestige, low volume | **High operational cost forever** (human moderation staffing) | V2.0 (L3) / V3.0 (L4) |
| Voice mode, thermal view, WebXR, localization | Polish | Medium each | V2.0+ |

**The 80/20 conclusion:** a learner who can explore, explode, understand, tear down, and rebuild the Granturismo engine — coached by an AI tutor that drives the 3D scene — receives roughly 80% of the platform's unique educational value. That requires the engine asset, the simulator, the tutor, and the spec library. It does **not** require the motorcycle, the factory, the diagnostics center, or the classroom.

---

## 2. Scope Challenges (what the current vision gets wrong)

1. **Fourteen modules is a portfolio, not a product.** ARCH-001 v2 already worried about this (depth-tiered shipping); this document goes further: the launch product is *one module family done completely* (the engine), not all modules at Tier 1.
2. **The full motorcycle is prestige, not pedagogy-first.** Bodywork is the single largest craft-risk asset line (AST-001 risk #9) and teaches the least per artist-day. **Defer the donor-bike purchase to V1.0** — Phase 0 buys only the salvage engine (~€8–13k with scanning instead of ~€25k). This contradicts AST-001 §6 week-1 plan; AST-001 should be amended on approval of this document.
3. **The walkable factory is the most expensive way to teach manufacturing.** The quench sandbox, the grain-flow animation, and the part-journey narrative teach the concepts; the navigable halls (~600 a-d) add immersion, not understanding. Manufacturing launches in **theater mode** (V2.0); the campus is a V3.0 luxury.
4. **Certification Levels 3–4 create a permanent staffing obligation** (human-moderated vivas, countersigned capstones) that must not be incurred before revenue proves the demand. L1 ships at MLP; L2 completes at V1.0; L3 at V2.0; L4 at V3.0.
5. **Flagship visual systems are over-specified for launch.** Fluid particle systems, thermal view mode, and the audio fault library are MLP-or-later polish; simplified fills and two view modes (photoreal + schematic) carry the MVP.
6. **Dual-renderer QA is premature.** Build on Three.js WebGPURenderer with automatic WebGL2 fallback, but formally QA only the WebGL2 floor until V1.0 — one QA matrix, not two.
7. **The LXD's four academy programs presuppose the full module set.** Until V2.0 there is one program: the Engine Program (L1 → engine-scoped L2).

---

## 3. The Five Versions

Effort = engineering person-months (pm) + artist-days (a-d), *incremental* per version. Team basis: 8-person core (per ARCH-001 Phase-0 team) growing to ~14 from V1.0 — deliberately below ARCH-001's 18, consistent with the reduced launch scope.

---

### MVP — "The Glass Engine" (Months 1–6, closed beta)

**One sentence:** the Granturismo engine, fully explorable and partially buildable, with an AI tutor that drives the scene.

**Included:**
- Engine Explorer: engine at ADL2 exterior + **ADL3/4 for cylinder head and cranktrain only** (exactly the two BOM exemplars); explode; click-to-learn; photoreal + schematic + X-ray (cheap fresnel) view modes; global crank-angle clock on the modeled subset
- Engine Deep Dive: C1, C2, C5 content (V4 architecture/counter-rotation, spring valvetrain story, pistons & rods) with the running-cutaway animation
- Build Simulator: **Stations 9–11 + Station 5** (valve sub-assembly, head install, cams, piston/rings bench — the vertical slice grown by one station), guided + standard difficulty, torque/placement/measurement core mechanics (SIM-001 §3.1–3.4), no latent defects
- AI Tutor v1: Claude (claude-sonnet-4-6), curated verified-spec context (no RAG), **the 6 scene-control tools** — the demo moment that sells the platform
- Spec Library (engine subset, citations visible) + SRS flashcards
- Accounts, progress, xAPI events

**Excluded:** everything else — full motorcycle, modules F/G/J/K/L/M/N/D, teardown E0, latent defects, certification, fluid particles, thermal mode, audio library, voice, mobile optimization, instructor anything.

**Effort:** ~48 pm + ~500 a-d (salvage-engine teardown + exemplar assets + workshop env at ADL1).
**Educational value:** high per-user but narrow — proves the core loop (explore → understand → build) on the highest-value content.
**Technical risk:** medium-high — this version *retires* the platform's three hardest risks: rendering pipeline at budget on floor hardware, simulator interaction grammar, tutor tool-use reliability. That's its job.
**Assets:** salvage engine + instrumented teardown (AST-001 C2, engine only); ~120 modeled parts; workshop bench environment; no bodywork, no bike.
**AI:** sonnet-class Q&A + scene control; hallucination eval suite (the 500-pair set, engine-scoped) operational from day one — the eval is MVP infrastructure, not polish.
**Beta gate to proceed:** ≥100 testers; task completion without navigation support; tutor factual error rate <2%; ADL4 asset unit-economics within 40% of AST-001 estimate (the pre-agreed descope trigger).

---

### MLP — "Build Your Whole Engine" (Months 7–11, **commercial launch**)

**One sentence:** the complete emotional arc — tear down and rebuild the entire engine, start it, and hear it run.

**Included (incremental):**
- **Full engine at ADL3–4** (the 700 a-d push completes)
- **All 17 SIM-001 stations + E0 teardown + E15 measurement lab + Station 17 First Start & dyno** — including the **latent-defect engine and the shutdown-judgment mechanic** (the soul of the product ships here)
- Expert difficulty; the classic-error library complete
- Engine Deep Dive complete (C1–C11) incl. C3 comparison lab in schematic mode (no RS physical asset — schematic desmo head suffices ⚠ upgrade in V3)
- M1 "The Desmo Decision" as narrative content (the platform's best story, cheap to ship)
- Fluid-fill mechanics + simplified oil/coolant flow visualization (full particle flagships deferred)
- AI Tutor v2: RAG over pgvector, real-time simulation coaching, Socratic mode
- **Level-1 certification + engine-scoped Level-2** (auto-issued tiers only)
- Payments, subscription tiers

**Excluded:** full motorcycle, F/G/J/K/L/N/D modules, walkable anything, L3/4 certification, voice, mobile, thermal.

**Effort:** +40 pm + ~800 a-d.
**Educational value:** the complete engine education — defensibly the best interactive engine course in the world at launch. The "lovable" element is Station 17: learners *earn* the running engine.
**Technical risk:** medium — latent-defect state tracking and the dyno model are new but bounded; rendering/tutor risks already retired.
**Assets:** complete engine internals + wrong-state variants + dyno cell environment.
**AI:** RAG corpus (verified data baseline), coaching event-stream integration; eval suite extended to coaching interventions.
**This is the launch. Revenue starts month ~11–12** against ARCH-001's original month-11 MVP — same timeline, but shipping a *finished deep product* instead of a broad shallow one.

---

### Version 1.0 — "The Complete Motorcycle" (Months 12–18)

**Included (incremental):**
- Donor-bike purchase + photogrammetry (deferred from Phase 0 by §2.2)
- **Full motorcycle ADL1–2:** Motorcycle Explorer (A) and Exploded Views (B) complete; bodywork, chassis, suspension/brakes exteriors, wheels, exhaust
- **Maintenance Workshop (G): 8 of 16 procedures** — the owner + core-service set (oil/filter, chain, pads+bleed, coolant, valve check, battery, storage, software-awareness)
- Vehicle Dynamics (J) at T1–T2 (geometry sandbox, J6 intervention theater lite) and Electrical (K) at T1 (CAN map, radar story, sensor tour)
- **Level-2 certification complete** (technician scope incl. G procedures)
- Mobile/tablet interaction pass; dual-renderer QA matrix activated (WebGPU formally supported)
- Educator-lite: cohort progress view (read-only — not the N suite)

**Excluded:** F assembly sim, L diagnostics center, D manufacturing, N suite, L3/4, factory, voice, VR.

**Effort:** +50 pm + ~900 a-d.
**Educational value:** broadens to the owner and technician segments fully; the marketing surface ("the whole bike in your browser") arrives with a mature product behind it.
**Technical risk:** low-medium — Class-A bodywork craft risk (AST-001 #9) is the main line item; mitigated by the named-specialist contract clause.
**Assets:** the AST-001 Phase-2 package (full bike exteriors).
**AI:** tutor context extended to vehicle systems; misconception library v1.

---

### Version 2.0 — "The Technician Platform" (Months 19–26)

**Included (incremental):**
- **Diagnostics Center (L) complete** — scenario engine, virtual instruments, audio fault library, DDS-equivalent tool ⚠, scripted + unscripted campaigns
- Maintenance Workshop complete (16/16 incl. ADAS calibration G13)
- **Motorcycle Assembly Simulator (F)** complete incl. harness routing + F13
- **Manufacturing Academy in theater mode:** all 14 MFG-001 units via sandboxes (start with 3: quench, fill-and-solidify, speeds-and-feeds; grow to 9), part-journey narratives, the ~40 process animations, Defect Detective galleries — **no walkable halls**
- **Level-3 certification** (human-moderation ops stood up — the staffing decision is made here, against real demand data)
- Voice mode; thermal view mode; full fluid particle systems (the deferred flagships)
- Educator dashboards full; xAPI export

**Excluded:** walkable factory campus, N synchronized/collaborative suite, L4, VR, localization.

**Effort:** +60 pm + ~600 a-d.
**Educational value:** the professional-training value proposition completes; B2B (dealer groups, technical schools) becomes sellable.
**Technical risk:** medium — the diagnostic scenario engine is the largest new system; audio library sourcing ⚠.
**AI:** diagnostic co-pilot mode; viva-conducting capability (L3 oral defense); adversarial register.

---

### Version 3.0 — "The Academy" (Months 27+)

**Included (incremental):**
- **Walkable factory campus** + 8 hero machines (the MFG-001 §2.1 vision, finally affordable)
- **Instructor Suite (N) complete** — synchronized sessions, collaborative CRDT builds, assessment builder, LTI 1.3
- **Level-4 Master Engineer program** (capstones, blind builds, teach-back, human countersigned)
- M5 trade-off sandboxes complete; V4 RS desmo head physical asset (C3 upgrade)
- Localization wave 1 (IT/DE/FR/ES); WebXR pilot (Quest 3, engine explorer + 3 build stations)
- LMS partner program; white-label exploration

**Effort:** +60 pm + ~600 a-d.
**Educational value:** the full ARCH-001 vision realized — institution-grade.
**Technical risk:** low-medium (real-time collab infra is the main new system).
**AI:** multilingual tutor; capstone pre-scoring; instructor-assist features.

---

## 4. Reconciliation & Numbers

- **Cumulative effort:** ≈258 pm + ≈3,400 a-d through V3.0. Asset total exceeds AST-001's 2,900 baseline by ~500 a-d because V3.0 includes items AST-001 listed as Phase-5 extras (RS head, VR variants, full campus) — consistent, not contradictory.
- **Amendments triggered by this document on approval:** AST-001 §6 (donor-bike purchase moves Phase 0 → V1.0; salvage engine stays week 1) · LXD-001 §4 (programs gated per version) · ARCH-001 §9 (this document becomes the product-scope reference).
- **Cash exposure to first revenue:** ~11 months × ~9 FTE + ~1,300 a-d of studio work + ~€10k hardware — roughly **40–45% lower** than the original ARCH-001 path to the same revenue date, because nothing motorcycle- or factory-shaped is built before launch.

## 5. Recommended Path to Launch (the bottom line)

1. **Build the MVP in 6 months, engine-only, and treat it as a risk-retirement instrument** — it exists to prove the rendering budget, the simulator grammar, the tutor's scene control, and the ADL4 asset unit cost. Closed beta, free, ~100+ users.
2. **Launch commercially at MLP (month ~11) as "the world's most complete interactive engine course"** — a finished, deep, emotionally satisfying product (teardown → build → First Start) rather than a broad shallow platform. Engine enthusiasts, students, and gearheads are a real, reachable launch market; the full-motorcycle and B2B segments arrive in V1/V2 with revenue already flowing.
3. **Hold the line on the three big deferrals** — donor bike to V1.0, walkable factory to V3.0, human-moderated certification to V2.0+. Each has a pre-agreed trigger to *accelerate* if beta/launch data demands it; none may creep forward on enthusiasm alone.
4. **The unchanged constants:** the Verified Data Baseline gate, the truth-discipline (⚠/PL) regime, and the hallucination eval suite ship in the MVP — accuracy infrastructure is never deferred, because it is the brand.

---

*DTEA-RDM-001 v1.0 — the product-scope reference for the DTEA platform. Amendments to AST-001 (donor-bike deferral), LXD-001 (program gating), and ARCH-001 (scope reference) are recorded in the affected category READMEs pending each document's next minor revision.*
