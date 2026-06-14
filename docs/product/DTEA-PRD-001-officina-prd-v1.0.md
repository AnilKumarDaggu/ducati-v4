# DTEA-PRD-001 — OFFICINA Product Requirements Document
**Version:** 1.0 | **Date:** 2026-06-12 | **Status:** Approved
**Parent documents:** UXD-001 (experience constitution), RDM-001/002 (scope & sequencing — governs delivery order), ARCH-001/002, LXD-001, SIM-001, MFG-001, AST-001, BOM-001
**Scope note:** the seven phases below are **capability tracks**, not delivery order. Delivery follows RDM-001 (engine-first): each phase's *MVP scope* names the version where its first slice ships. Where this PRD and RDM-001 could be read differently, RDM-001 governs sequencing and this PRD governs requirements.

---

## 0. Personas (from LXD-001, made concrete)

- **Elena** — Multistrada owner, curious enthusiast. Wants to *understand her machine*. Time-poor, quality-sensitive. Level-1 track.
- **Tomáš** — apprentice technician at a dealer group. Needs procedures, torque discipline, diagnostic habits. Level-2 track.
- **Priya** — mechanical-engineering student. Wants the *why*: thermodynamics, materials, manufacturing. Level-3 track.
- **Marco** — riding-school/technical-institute instructor. Needs cohorts, assignments, classroom control. Instructor track.

## 0.1 Capability-to-delivery map

| PRD Phase | Capability | First ships (RDM-001) | Complete |
|---|---|---|---|
| P2 Engine Explorer | STUDIO on the engine | **MVP (Valve Slice → Glass Engine)** | MLP |
| P3 Engine Build Simulator | OFFICINA on the engine | MVP (4 stations) | MLP (17 stations) |
| P6 AI Tutor | The resident colleague | MVP (v1, scene control) | V2.0 (full) |
| P1 Motorcycle Explorer | STUDIO on the full machine | V1.0 | V1.0 |
| P4 Motorcycle Assembly Simulator | OFFICINA at vehicle scale | V2.0 | V2.0 |
| P5 Manufacturing Academy | The factory | V2.0 (theater mode) | V3.0 (campus) |
| P7 Certification Platform | Credentials | MLP (L1) | V3.0 (L4) |

## 0.2 Cross-phase requirements (binding on every phase)

- **Truth discipline:** no unverified value presented as fact; ⚠/PL badges per UXD-001 token spec; tutor cite-or-decline (ARCH-002 §6)
- **Performance floor:** 30 FPS / 2020 integrated GPU / WebGL2; first-interactive < 8s (ARCH-001)
- **Accessibility:** WCAG 2.2 AA program per LXD-001 (mirrored component tree, reduced motion, captions, keyboard parity)
- **Experience bar:** UXD-001 governs every screen; the side-by-side test applies to all photoreal staging
- **Telemetry:** all interactions emit the xAPI-shaped event vocabulary (`@dtea/data` events schema)

---

## PHASE 1 — Ducati Motorcycle Explorer (STUDIO, vehicle scale)

**User stories**
- As **Elena**, I can orbit my motorcycle in a studio and click any visible part to learn what it does in one sentence, so the machine stops being a mystery.
- As Elena, I can toggle systems (electrical / cooling / fuel / brakes) so I see the invisible circulatory systems of my bike.
- As **Priya**, I can switch to X-ray and see *through* the bodywork to the monocoque and engine as stressed member.
- As Elena, I can compare trims (V4 / V4 S / RS) and see exactly what changes — including the RS's desmo engine.
- As any user, I can follow the five signature-innovation callouts (spring valvetrain, counter-rotating crank, Twin Pulse, cylinder deactivation, radar) as a guided tour.

**Screens:** Ingresso → The Reveal (vehicle establishing move) → Esplora (vehicle) with Navigator rail (13 systems), Scheda Tecnica, mode dock; Trim Comparator overlay; Innovation Tour rail.
**Interactions:** UXD-001 §E grammar; system-layer toggles with photographic subject-isolation; breadcrumb-as-camera; innovation tour = authored camera journey chain; radar beam visualization toggle (AN-EL).
**Assets:** full motorcycle ADL1–2 (AST-001 Phase-2 package: bodywork Class-A, chassis, suspension/brake exteriors, wheels); vehicle hero angles authored per system; STUDIO vehicle-scale cove + HDRI.
**Technical dependencies:** sub-GLB streaming at S-level boundaries; LOD governor at vehicle polycount (≤3M LOD1); selection at 1,000+ node scale; framing engine with assembly-level heroes.
**Acceptance criteria:** all 13 systems identifiable and selectable; ≥80 landmark components carry full Scheda Tecnica; X-ray sustains floor FPS; trim comparator diffs render < 500ms; side-by-side test passes on 5 staged views vs reference photography; Elena-proxy testers complete the innovation tour unaided ≥85%.
**MVP scope:** none before V1.0 (engine-first holds). **Future:** V1.0 = all above; V2.0+ adds dynamic states (suspension compression, lean visualization with Module J), accessory configurator (luggage/Rally trim), AR handoff exploration.

## PHASE 2 — Engine Explorer (STUDIO, engine scale) — *the spearhead*

**User stories**
- As **Priya**, I can explode the valve group along its true mechanical paths and scrub the cam through 720° watching valves obey, so timing stops being a diagram and becomes an object.
- As Elena, I can read the desmo-abandonment story while the scene illustrates each beat (Lezione scene-bookmarks).
- As **Tomáš**, I can isolate any part, read its spec with its citation badge, and jump to where it appears in the build procedure.
- As Priya, I can section the head (CUT-Y) and switch STUDIO→TECNICO to compare photoreal truth with schematic clarity.
- As any user, I can ask "show me…" and watch the tutor drive the scene (Phase 6 dependency).

**Screens:** Esplora (engine) · Lezione (C-module units) · Esploso parametric panel (cad.fun grade) · Comparison Lab split-stage (C3 desmo vs spring).
**Interactions:** crank-angle scrubber bound to the global clock; explode slider + axis/depth; section-plane drag with capped geometry; lesson scroll-to-bookmark; flow-particle toggles (MLP: oil/coolant AN-FL).
**Assets:** Valve Slice set (~30 parts ADL4) → Glass Engine (head+cranktrain ADL4, shell ADL2) → MLP full engine ADL3–4 + run animations on the crank-angle clock; material library validated vs reference (UXD §F); TECNICO world kit.
**Technical dependencies:** CrankAngleClock; ViewModeSystem; ExplodeController; framing engine; capped-section toggles; lesson player; D-1 lighting foundation (IBL/ACES) — *the prerequisite for everything*.
**Acceptance criteria:** RDM-002 §9 slice criteria (already gating); plus: scrubbing 0–720° keeps every animated part phase-correct (automated frame-sample test); section planes never show open mesh interiors; C2 lesson completion ≥80% unaided; the "same brand?" side-by-side passes on the staged valve group.
**MVP scope (Valve Slice → Glass Engine):** one head + valve group, C1/C2/C5, 3 view modes, explode, lesson player. **Future:** MLP = full engine, all C-units, comparison lab, flow particles; V2.0 = thermal mode, audio-diagnostic listening posts.

## PHASE 3 — Engine Build Simulator (OFFICINA, engine scale)

**User stories**
- As **Tomáš**, I can perform the valve install with real consequence — if I mis-seat a collet, the verify step catches me and teaches me, so the lesson costs nothing here instead of an engine in the shop.
- As Tomáš, I torque to spec with a wrench that feels honest (band feedback, yield ruin) and builds my torque discipline record.
- As Priya, I can measure (feeler, Plastigauge, micrometer) and make accept/reject decisions against the spec store.
- As Tomáš, at MLP I complete the full 17-station campaign, start the engine I built, and hear it run — or diagnose why it doesn't.
- As any learner, I choose guided or standard difficulty and see exactly why I scored what I scored (decomposed debrief).

**Screens:** Officina (station) · station-select map (campaign) · Debrief instrument panel · (MLP) First-Start bay + dyno console.
**Interactions:** SIM-001 §3 mechanic set staged per UXD §I (room-concentrates lighting, analog torque instrument, macro-framing on precision steps); tool shadow-board; build-sheet audit.
**Assets:** OFFICINA bench environment; tool set (5 → full rack); wrong-state animations (classic-error library); MLP: all 17 stations' assets + dyno cell + the Twin Pulse audio asset.
**Technical dependencies:** `sim-core` state machines + scoring (headless reproducible); SimRig interaction layer; event-bus → tutor coaching stream (Phase 6); spec-store bindings with PL-block on certification modes.
**Acceptance criteria:** RDM-002 §9 (slice) → SIM-001 per-station criteria (MLP); scoring byte-reproducible headless; seeded collet error caught + explanation comprehension ≥75% (beta survey); zero unverified value displayed in any procedure; the torque click ships as THE sound asset at MLP.
**MVP scope:** Stations 5/9/10/11, guided+standard, immediate+inspection-caught errors. **Future:** MLP = E0 teardown, all 17 stations, expert mode, latent defects, First Start, E15/E16; V2.0 = Level-3 cert runs; V3.0 = Level-4 blind-build with seeded defects.

## PHASE 4 — Motorcycle Assembly Simulator (OFFICINA, vehicle scale)

**User stories**
- As **Tomáš**, I assemble the machine around its spine — engine into frame, suspension, brakes, harness — and earn the 270° pass as the bike becomes itself.
- As Tomáš, I route the harness through real clip paths and learn why the loom lives where it lives (chafe/heat zones flagged).
- As Tomáš, I bleed brakes with consequence (air = soft lever at PDI) and calibrate the radar after front-end work (F13).
- As Marco, I assign specific phases to my cohort as homework with score thresholds.

**Screens:** Officina-Bay (two-post lift) · phase map · harness-routing TECNICO overlay mode · PDI checklist screen · Debrief.
**Interactions:** vehicle-scale placement with lift-assist staging; spline-drag routing; bleed lever/valve coordination; radar aim against target board; F-phase camera passes.
**Assets:** vehicle bay environment; full-bike ADL2 with assembly-state variants; harness spline set with routing metadata (AST-001 S10); ADAS calibration kit assets.
**Technical dependencies:** Phase-1 vehicle assets; routing-path validation engine; phase dependency graph; Phase-7 hooks for Level-2-complete certification.
**Acceptance criteria:** SIM-001-grade scoring decomposition at vehicle scale; routing violations detected with explanation; F13 calibration pass/fail with tolerance readout ⚠ procedure verified; full F1–F12 completable at standard ≥85.
**MVP scope:** none (V2.0 capability; direction fixed now per UXD §J). **Future:** V2.0 = F1–F13 complete; V3.0 = collaborative paired assembly (N4) on these phases.

## PHASE 5 — Manufacturing Academy (the factory)

**User stories**
- As **Priya**, I run the quench sandbox and discover the hardness-distortion trade-off by breaking a gear, so metallurgy becomes consequence instead of a chart.
- As Priya, I escort *my* crankshaft from billet to balance (part-journey) and recognize every process from the parts I've already built with.
- As Tomáš, I learn why every inspection I perform exists — by seeing the manufacturing failure mode it guards against (the U10 thesis).
- As Priya, at the capstone I diagnose an EOL reject back to its upstream root cause across the whole academy.

**Screens:** Academy atlas (unit map) · Unit theater (macchina-hero intro + content) · Sandbox instrument panels (TECNICO dialect) · Defect Detective light table · Part-journey tracker · (V3.0) walkable campus halls.
**Interactions:** parameter sandboxes (predict → run → consequence + cost ticker); defect grading; SPC intervention game; journey-mode station decisions; MFG-001 §2.2 mechanics throughout.
**Assets:** theater mode = 9 sandbox models (physics-lite), ~40 process animations incl. the 5 signature pieces, ~120 defect-gallery items ⚠ sourcing; V3.0 = 8 hero machines ADL3 + campus halls.
**Technical dependencies:** sandbox consequence engines (directionally validated); shared media pipeline with Module L galleries; xAPI scoring per MFG-001 §2.3.
**Acceptance criteria:** each sandbox passes a domain-expert directional-truth review (no physically wrong consequence ships); unit gates hit LXD pass-rate bands (60–85% first attempt); the austenite→martensite and grain-flow animations pass the engineering-accuracy fact-gate; capstone reject-diagnosis playable end-to-end (V3.0).
**MVP scope:** none (V2.0 theater mode per RDM-001). **Future:** V2.0 = all 14 units theater-mode with 3→9 sandboxes; V3.0 = walkable campus, hero machines, ore-to-motorcycle keynote cinematic.

## PHASE 6 — AI Tutor (the resident colleague)

**User stories**
- As **Elena**, I ask "what does this do?" about anything I see and get a curator's answer at my level — never jargon-first.
- As any learner, I say "show me how the collets hold the valve" and the tutor *drives the scene* — navigates, explodes, animates — with a change receipt I can revert.
- As **Tomáš**, mid-build, the tutor notices my second over-torque pattern and offers the three-stage explanation *before* I ruin the bolt (MLP coaching).
- As **Priya**, I flip Socratic mode and the tutor makes me earn answers — but never withholds safety-critical facts.
- As any user, when I ask for a spec the tutor cites the source or tells me plainly it's unverified — it never invents a number.

**Screens:** the docked colleague (every screen) · full-screen Conversazione mode · change-receipt toasts · (V2.0) viva room for Level-3 oral defense.
**Interactions:** chat + (MLP) voice; the 5→6 scene tools with re-grounding; "challenge me" quiz mode feeding SRS; coaching interventions styled per UXD (giallo, craftsman's correction, never red).
**Assets:** none 3D-specific; tutor persona voice/copy guide (UXD voice section); curated context block → RAG corpus (MLP).
**Technical dependencies:** stateless proxy → context assembler → Claude tool-use loop (ARCH-002 §6); spec post-processor; eval harness in CI (<2% gate, growing 50→200→500 pairs); MLP: pgvector RAG + event-stream coaching; prompt caching for cost.
**Acceptance criteria:** tool-loop ≥95% success; eval gate green at every release; coaching intervention precision ≥70% rated "helpful, not naggy" in beta; Socratic mode never blocks safety information (red-team test set); per-session cost within budget envelope ⚠ set at MLP pricing.
**MVP scope:** v1 — Q&A + scene control, curated context, slice eval set. **Future:** MLP = RAG, coaching, Socratic, voice; V2.0 = misconception detection, viva conduct, diagnostic co-pilot; V3.0 = multilingual, capstone pre-scoring.

## PHASE 7 — Certification Platform

**User stories**
- As **Tomáš**, I sit a proctored Level-2 battery and earn a credential whose every score component is transparent — and whose scope statement is honest about being simulation-based.
- As an employer, I open a credential URL and verify exactly what was tested, when, and at what difficulty.
- As **Marco**, I see my cohort's gates, pass rates, and item-level analytics; I can assemble assessments from the validated item bank.
- As **Priya**, failing a gate routes me to misconception-mapped remediation and a re-attempt window — not a dead end.

**Screens:** Accademia (programs/progress) · proctored exam shell (tutor disabled, timer, randomized pools) · credential page (public verify) · Marco's cohort dashboard · remediation router.
**Interactions:** LXD-001 §5 assessment item types; proctored simulator runs (single-attempt, seeded scenarios); SRS review loop; certificate share/export.
**Assets:** item banks (≥4× pool ratio per LXD); credential visual design (UXD-001 system — the certificate is a brand artifact); badge set.
**Technical dependencies:** accounts/auth + progress DB (Supabase — enters at MVP-end per ARCH-002 migration note); xAPI warehouse queries; integrity flags; V2.0: human-moderation workflow tooling (Level-3 viva review queue); LTI 1.3 (V3.0).
**Acceptance criteria:** gate pass-rate bands monitored (60–85% first-attempt, LXD §7); zero certification mode runs against unresolved ⚠ bindings (hard block); credential verification page renders score decomposition; Level-3+ never auto-issues (workflow-enforced); integrity randomization audited per cohort.
**MVP scope:** none at slice (no accounts); MLP = Level-1 + engine-scoped Level-2, auto-issued tiers, public verify. **Future:** V1.0 = Level-2 complete; V2.0 = Level-3 + human moderation ops + Marco's dashboards; V3.0 = Level-4 Master program + LTI.

---

## 8. PRD-level success metrics (roll-up)

- **North star:** weekly learners completing ≥1 meaningful unit (lesson / station / case) — target trajectory set at MLP launch
- Slice gate: RDM-002 §9 (already binding) · MLP: ≥40% L1→L2 program start (LXD §7) · Experience: side-by-side test pass on every staged hero; UXD timing-scale audit in every release review
- Truth: zero verified-data incidents (user-reported spec errors against verified values) — the brand metric

*PRD-001 v1.0 — requirements per capability phase; sequencing per RDM-001; feel per UXD-001. The three documents are one product.*
