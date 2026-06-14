# Ducati Multistrada V4 — Digital Twin Engineering Academy
## Learning Experience Design (LXD) Specification
**Version:** 1.0 | **Date:** 2026-06-11 | **Parent documents:** Architecture v2.0, BOM v1.0 | **Classification:** Curriculum & Experience Design

---

## 1. Design Philosophy

This specification turns the platform defined in Architecture v2.0 into a **structured engineering academy** — not a content library the learner wanders through, but a designed progression with the rigor of a technical university and the engagement of a AAA simulation.

**Five governing principles** (inherited from Architecture v2.0 and made operational here):

1. **Do, then understand, then explain.** Every concept is encountered three times: in the hands (simulation), in the head (theory), and out loud (teach-back/assessment). A learner who can torque a head bolt, explain bolt stretch, and justify the 3-stage sequence owns the knowledge.
2. **The machine is the curriculum.** Every abstract topic (thermodynamics, tribology, control theory) is taught through a specific part the learner can touch in 3D — anchored to BOM IDs. No floating theory.
3. **Errors are content.** The BOM's classic-error library (ring-gap stacking, bearing tang misalignment, collet mis-seating) is the backbone of practical assessment — learners are deliberately led into instructive failure in the simulator, where it costs nothing.
4. **Earned depth.** Competency gates are real: higher levels unlock by demonstrated performance, never by time spent. Certificates must mean something to an employer.
5. **Truth discipline.** Assessment answer keys derive exclusively from the Verified Data Baseline. No assessment item ships against a ⚠ unverified value.

### 1.1 Competency framework reconciliation

This document **supersedes Architecture v2.0's three-tier T1–T3 proficiency model** with four named competency levels. Mapping for continuity: T1 → Level 1 (Enthusiast), T2 → Level 2 (Technician), T3 → Level 3 (Engineer), and **Level 4 (Master Engineer) is new** — it extends beyond T3 into design evaluation, original analysis, and teaching ability. All module depth-tiers in the V2 roadmap map unchanged.

---

## 2. The Competency Ladder

```
LEVEL 4 — MASTER ENGINEER   "Could argue with the designers"     EVALUATE / CREATE (Bloom 5–6)
LEVEL 3 — ENGINEER          "Knows why every part is shaped       ANALYZE (Bloom 4)
                             the way it is"
LEVEL 2 — TECHNICIAN        "Could service this motorcycle        APPLY (Bloom 3)
                             tomorrow"
LEVEL 1 — ENTHUSIAST        "Understands their machine"           REMEMBER / UNDERSTAND (Bloom 1–2)
```

### 2.1 Level 1 — ENTHUSIAST (est. 25–35 learning hours)

**Identity:** The informed owner/rider. Knows what every visible system is, what it does, and why the Multistrada V4 is engineered the way it is.

**Knowledge requirements**
- Identify all 13 Level-2 BOM systems and ~80 designated landmark components on the 3D model
- Explain in plain language: 4-stroke cycle, why a V4, the desmo-abandonment story, counter-rotating crank benefit, what the radar does, what Skyhook does
- Recall owner-relevant specifications: fluids and capacities, service intervals (oil 15,000 km, valves 60,000 km), tire pressures ⚠
- Recognize the function of every ride mode and electronic aid

**Practical exercises**
- Guided full-motorcycle exploration with checkpointed "find and explain" tasks (Module A)
- Systems-overlay scavenger hunts (trace the path of fuel, coolant, electrical power across the 3D model)
- Comparison lab walkthrough: Granturismo vs. Desmosedici Stradale head (C3, observation level)

**Simulator exercises**
- Guided-mode owner procedures only: chain tension check, oil level check, tire pressure, windscreen/suspension mode adjustments (G-module subset, full hints)
- One guided assembly experience: install a wheel with correct axle torque (supervised SIM-TQ introduction)

**Certification criteria — "Certified Multistrada V4 Enthusiast"**
- Component identification exam: 60 items, ≥80%, randomized from landmark pool
- Concept quiz bank: ≥75% across all Level-1 module quizzes
- Complete 4 guided owner procedures with zero unresolved errors (hints permitted, unlimited retries)
- No time pressure; unlimited attempts; designed for a motivated owner to complete in 3–4 weeks of evenings

### 2.2 Level 2 — TECHNICIAN (est. 90–130 hours; prerequisite: Level 1)

**Identity:** Workshop-ready. Can execute documented service and assembly procedures correctly, with the right tools, torques, and discipline.

**Knowledge requirements**
- All torque-discipline theory: preload, stretch, torque-angle, sequence logic, threadlocker/lubrication states, reuse policies (S13 pool)
- Complete service schedule and every G-module procedure's steps, tools, and acceptance criteria
- Measurement competence: read micrometer, bore gauge, feeler gauge, Plastigauge, DTI to instrument resolution
- Diagnostic fundamentals: fault-code workflow, voltage-drop testing, live-data basics, when ADAS recalibration is mandatory
- Safety: hydraulic, thermal, electrical, and lithium-battery hazards; safety-critical fastener policy

**Practical exercises**
- Full teardown of the engine top end with fastener-tray discipline (E0)
- All 16 maintenance procedures (G1–G16) to standard difficulty
- Measurement lab battery: 20 graded measurement tasks across the four BOM exemplars (E15)
- Wiring-harness routing and connector service (F8 subset)

**Simulator exercises (standard difficulty: no auto-snap, tolerance 2 mm/2°, hints scored)**
- Engine Build Simulator E1–E14 complete, each step ≥85 score
- Valve clearance measurement and shim selection (G3 mini-game) — 3 consecutive correct outcomes
- Brake pad replacement + full bleed (SIM-FL) without introducing simulated air
- Chain replacement with rivet tool (G15)
- Diagnostic Center L1–L4: complete 6 scripted scenario cases

**Certification criteria — "Certified V4 Service Technician (Digital)"**
- Summative theory exam: 80 items, ≥80%, proctoring mode (timed, no tutor access)
- **Timed practical:** complete a randomized minor service (G2) + one randomized repair scenario in expert simulator difficulty (no hints, 0.5 mm/0.5° tolerance), ≥90 score, within procedure-realistic time windows
- Torque-discipline record: across the entire certification attempt, zero over-torque yield events on safety-critical fasteners
- Measurement audit: 10 randomized measurement tasks, ≥9 within tolerance-class accuracy
- Certificate explicitly states: *digital simulation credential; does not replace OEM hands-on authorization*

### 2.3 Level 3 — ENGINEER (est. 160–220 hours; prerequisite: Level 2)

**Identity:** Understands the *why* behind every design and process choice. Can analyze novel failures, explain physics quantitatively, and trace any requirement to its engineering driver.

**Knowledge requirements**
- Thermodynamics: ideal vs. real cycle, 14.0:1 compression implications, knock limits, volumetric efficiency, Twin Pulse gas-exchange consequences
- Mechanics: valve-spring dynamics and float threshold math; bearing hydrodynamics; fatigue and the role of shot peening/fillet rolling; fracture-split rod rationale
- Vehicle dynamics: full Module J content quantitatively — trail/rake effects, load transfer computation, gyroscopic moments of the counter-rotating crank, Skyhook control law concept
- Manufacturing science: all 14 D-module sections — process selection rationale (why this part is cast vs. forged), heat-treatment metallurgy, GD&T and tolerance stacks, SPC interpretation
- Electronics: CAN arbitration, sensor physics, ride-by-wire arbitration chain, FMCW radar principles, control strategy concepts

**Practical exercises**
- Process-selection justifications: for 12 designated BOM parts, defend the documented material + process against two plausible alternatives
- Failure analysis cases: given simulated evidence packages (oil analysis, bearing wear photos, data logs), produce root-cause chains (L6 campaigns, engineer scoring rubric)
- Tolerance-stack exercise on the cranktrain (Exemplar B): compute clearance ranges from part tolerance classes; validate via simulated Plastigauge
- Dyno lab investigations (E16): predict, then measure, the effect of parameter changes on the power/torque curves

**Simulator exercises**
- Full engine build E0–E16 in expert difficulty, single attempt scoring ≥90 overall
- Diagnostic Center L6: 8 unscripted scenario campaigns scored on diagnostic efficiency (evidence-cost penalties) — average efficiency ≥80%
- Electronic Intervention Theater (J6): predict intervention type and timing in 10 scenarios, ≥8 correct
- Trade-off sandbox (M5): produce 3 documented parameter studies with correct directional predictions before simulation reveal

**Certification criteria — "V4 Systems Engineer (Digital)"**
- Summative exam: 100 items including quantitative problems, ≥80%, proctored mode
- Two written failure-analysis reports scored by rubric (root-cause validity, evidence chain, corrective action) — AI-prescored, human-moderated ⚠ instructor availability per deployment
- Expert-mode full engine build certification run (above)
- Oral-style defense: 20-minute AI-tutor-conducted structured viva on two randomly selected systems; transcript scored on rubric, flagged sessions human-reviewed

### 2.4 Level 4 — MASTER ENGINEER (est. 250–350 hours; prerequisite: Level 3)

**Identity:** Operates at design-review level. Can evaluate engineering decisions against alternatives, quantify trade-offs, construct original analyses, and teach others.

**Knowledge requirements**
- Everything in Level 3, integrated across systems: e.g., trace how Euro 5+ shaped cam timing, catalyst placement, intake design, and mapping simultaneously
- Design-decision fluency: full command of Modules M1–M6 — able to reconstruct the desmo decision, the V4 configuration choice, and the counter-rotating crank trade study from first principles with quantitative arguments
- Comparative architecture: Granturismo vs. Desmosedici Stradale vs. Testastretta — when each architecture wins and why
- Pedagogy basics: how to structure an explanation, diagnose a misconception, sequence a demonstration (because Masters teach)

**Practical exercises**
- **Capstone trade study:** a substantial original document — e.g., "Propose and defend a 7,500 km-interval variant of the Granturismo: what changes, what it costs, what it buys" or "Design the service-access strategy for the rear cylinder bank" — using platform data only, with explicit assumptions where data is ⚠
- Cross-system failure cascade analysis: one complex multi-system scenario (e.g., chronic low-voltage condition: trace effects through ECU behavior, Skyhook, radar, riding safety)
- Critique exercise: find and argue the three weakest points of a presented (deliberately flawed) redesign proposal

**Simulator exercises**
- Diagnostic Grand Rounds: 5 expert-difficulty unscripted campaigns including one no-fault-found case and one intermittent fault — composite efficiency ≥85%
- Blind build: full engine assembly in expert mode **with randomized component defects seeded** (wrong-grade bearing shell, out-of-spec shim in the tray) — learner must detect and reject defective parts via measurement before installation
- **Teach-back module:** record (or live-deliver in Instructor Suite) a 15-minute lesson on an assigned system to Level-1 learners; scored on accuracy, structure, misconception handling

**Certification criteria — "Master Engineer, V4 Platform (Digital)"**
- Capstone trade study scored by rubric: technical validity 40%, quantitative rigor 25%, completeness of trade-space 20%, communication 15%; pass ≥75% — human-moderated review mandatory
- Blind-build with seeded defects: 100% defect detection, build score ≥90
- Diagnostic Grand Rounds composite ≥85%
- Teach-back scored ≥80% on rubric
- Award reviewed and countersigned by a human (platform academic lead) — Level 4 is never auto-issued

---

## 3. Per-Module LXD Specifications

Format per module: **Goals → Interactions → Animations (BOM codes) → Simulations (BOM codes) → Assessment → Paths** (B = Beginner/Enthusiast entry, I = Intermediate/Technician entry, E = Expert/Engineer+ entry). Animations and simulations reference the BOM v1.0 coding standard; only module-distinctive items are listed (standard orbit/zoom/select/explode per Architecture v2.0 applies everywhere).

---

### MODULE A — Motorcycle Explorer

**Goals:** name and locate all 13 systems and landmark components; explain each system's function in one sentence; articulate the five signature innovations (spring valvetrain, counter-rotating crank, Twin Pulse, cylinder deactivation, radar).
**Interactions:** free orbit/zoom; system-layer toggles; component click → info card; landmark checklist mode; trim comparator (V4/V4 S/RS); four view modes (photoreal/schematic/X-ray/thermal).
**Animations:** full running-vehicle state (all AN-R/AN-T at vehicle level); system-isolation fade sequences; radar beam visualization (AN-EL); cylinder-deactivation idle state with thermal overlay.
**Simulations:** none (exploration module) — SIM-N throughout.
**Assessment:** per-system micro-quizzes (5 items); landmark identification challenge (timed click-to-find, 3 difficulty rings: 20/50/80 components); innovation explanation items (select-best-explanation format).
**Paths — B:** guided fly-through → system-by-system tour in fixed order (powertrain last, as climax) → landmark hunt ring 1 → quiz. **I:** self-directed with landmark ring 2 gate; comparison-mode tasks. **E:** ring-3 landmark speed challenge; X-ray-mode-only identification (no photoreal cues); used as warm-up, not gated.

### MODULE B — Exploded View Explorer

**Goals:** understand assembly hierarchy (the BOM made visible); read a 3D parts diagram; relate part position to function; internalize fastener density and joining patterns.
**Interactions:** progressive-explosion slider per assembly; sub-assembly isolation; BOM-panel↔3D bidirectional sync (click row ↔ highlight part); part-number overlay; "reassembly preview" (reverse explosion at chosen speed).
**Animations:** authored EXP-I/EXP-G choreography per the BOM explode-data format; sequenced sub-explosions (system → assembly → component).
**Simulations:** none directly; serves as reference surface for E/F (deep links both ways).
**Assessment:** "what's missing" challenges (one part hidden from exploded state — name it); hierarchy ordering items (drag assemblies into BOM tree positions); count estimation calibration items (teaches reading assembly complexity).
**Paths — B:** full-vehicle master explode → 3 curated assemblies (wheel, brake caliper, clutch). **I:** all S01 powertrain explosions with BOM-panel tasks; what's-missing ring 1. **E:** full BOM-tree reconstruction exercises; randomized what's-missing across all 13 systems.

### MODULE C — Engine Deep Dive

**Goals:** full gas-exchange and combustion understanding; valvetrain dynamics and the desmo trade-off; cranktrain mechanics including counter-rotation; lubrication/cooling circuits; clutch and gearbox operating principles.
**Interactions:** RPM-scrubber on running cutaway (idle→11,000); crank-angle scrubber (single-degree stepping through Twin Pulse cycle); flow-particle toggles (oil/coolant/charge/exhaust — AN-FL paths); comparison-lab split screen (C3); cylinder-deactivation toggle with live firing-order readout.
**Animations:** the **global crank-angle clock** (BOM rule 4) driving every AN-R/AN-T/AN-O part in phase; valve lift curves rendered live beside moving followers; oil-wedge formation in bearing close-up (AN-FL flagship); slipper-clutch ramp engagement under back-torque; thermostat wax-element actuation.
**Simulations:** embedded predict-then-observe probes (set the crank angle where intake valve closes; predict which bank fires next) — light SIM, full simulation lives in E.
**Assessment:** crank-angle reasoning problems; firing-order and overlap items; quantitative items at Level 3 (mean piston speed, spring frequency vs. rpm); C3 comparison essay item (Level 3+, rubric-scored).
**Paths — B:** C1→C2 conceptual layer only (animations + plain-language cards), skip quantitative; gate: concept quiz. **I:** full C1–C10 with service-relevant emphasis (what wears, what's measured); gate: 75% module exam. **E:** full content including C11 + quantitative problem sets + C3 written comparison; feeds Level-3 certification.

### MODULE D — Manufacturing Academy

**Goals:** for every BOM manufacturing code, know the process physics, why it's chosen, its tolerances and failure modes; understand quality systems and the supplier-integrator model.
**Interactions:** process-scene walkthroughs (foundry, forge, 5-axis cell, heat-treat line, paint line); part-journey timelines (follow a crankshaft from billet to balanced assembly — D3→D8→D12→D6 chain); microstructure viewer (zoom from part to grain level); SPC chart interactives.
**Animations:** molten-metal fill and solidification (D2); forging grain-flow morphing (D3); cutting-tool paths with surface-finish reveal (D4); austenite→martensite transformation (D8); robotic weld and paint sequences (D10/D11); CMM probing routine (D6).
**Simulations:** process-parameter sandboxes (quench rate → hardness/distortion trade-off; cutting speed → finish/tool-life); virtual CMM inspection tasks (SIM-M variant); go/no-go gauging exercises.
**Assessment:** process-selection justification items ("this part needs X — choose process and defend"); micrograph identification; tolerance/finish matching (Ra values to surfaces); SPC interpretation cases.
**Paths — B:** "how it's made" narrative pass through D1–D7 scenes, no gates. **I:** D1–D8 with quality emphasis; gauging exercises; gate per section. **E:** all 14 sections; parameter sandboxes; process-selection defense battery (feeds Level-3 practical).

### MODULE E — Engine Build Simulator

**Goals:** execute complete teardown and assembly to professional discipline: sequence, orientation, torque, measurement, cleanliness, defect detection.
**Interactions:** tool-tray and parts-tray management; torque-wrench mechanic (hold-to-torque, click feedback); measurement-instrument manipulation (probe placement); procedure panel with acceptance criteria; difficulty selector (guided/standard/expert per Architecture v2.0 tolerances).
**Animations:** assembly-motion guides (guided mode only); wrong-state consequences (bolt-yield stretch, gasket pinch, mis-seated circlip pop-out — the classic-error library rendered); fluid fill levels (SIM-FL).
**Simulations:** the module IS the simulation — E0 teardown, E1–E14 build, E15 measurement battery, E16 first-start/dyno; all SIM-A/SIM-TQ/SIM-M/SIM-FL flagship implementations per BOM exemplars; seeded-defect variant at Level 4.
**Assessment:** per-step scoring (torque accuracy, sequence, orientation, time, hints); E15 measurement audits; certification runs are proctored single attempts.
**Paths — B:** E0 teardown of top end + guided E3 piston/ring experience (the visceral hook) — guided mode only. **I:** full E0–E14 standard difficulty, sequential unlock, ≥85/step; E15 battery. **E:** expert difficulty full run (Level-3 cert); blind-build with seeded defects (Level-4).

### MODULE F — Motorcycle Assembly Simulator

**Goals:** vehicle-level assembly competence: heavy-component handling order, torque discipline at chassis scale, harness routing, fluid systems, ADAS hardware.
**Interactions:** as Module E, plus: spline-drag harness routing with clip targets; brake-bleed lever/valve coordination; radar aim-adjustment mechanic against virtual target board.
**Animations:** engine-into-frame insertion path (clearance choreography); fork oil-fill and purge; bleed-line bubble flow (AN-FL); steering-head bearing preload feel rendered as visual dial.
**Simulations:** F1–F13 complete; harness routing scored on path correctness, clip usage, exclusion-zone violations (heat/chafe); ADAS calibration procedure (F13) ⚠ procedure verification.
**Assessment:** phase scoring as Module E; routing-violation analysis; F13 calibration pass/fail with tolerance readout.
**Paths — B:** wheel + bodywork phases only (guided). **I:** full F1–F12 standard; gate ≥85/phase. **E:** F13 + expert-mode full vehicle (Level-3 elective, mandatory for technician-track Level-3 specialization).

### MODULE G — Maintenance Workshop

**Goals:** all 16 service procedures to professional standard; symptom-driven thinking; documentation discipline.
**Interactions:** service-schedule planner (build the work order from km/age inputs); procedure execution as E/F mechanics; customer-scenario dialogue cards (G11); virtual service-record completion (G16).
**Animations:** wear-state visualizations (pad thickness, chain stretch, disc thickness at limits); fluid condition states (fresh vs. degraded oil color); seal rollback (G5).
**Simulations:** all SIM-SV flagships: pad change + bleed, valve clearance check (G3 mini-game), chain service (G6/G15), coolant flush (SIM-FL), parasitic-drain test (G12, SIM-D), radar recalibration trigger-recognition cases (G13).
**Assessment:** work-order construction items (what does a 30,000 km bike need?); procedure scoring; G11 scenario trees scored on diagnostic path quality; safety-step omission = automatic fail on safety-critical procedures.
**Paths — B:** owner subset (chain, oil level, tire, windscreen) guided. **I:** all G1–G16 standard difficulty — the heart of Level-2 certification. **E:** randomized timed procedures, expert difficulty, no procedure panel (recall-only) — Level-3 technician specialization.

### MODULE H — AI Tutor

**Goals (as a learning experience):** the learner knows how to ask, can use Socratic dialogue productively, builds the habit of verifying claims against the spec library.
**Interactions:** chat + voice; scene-control requests ("show me…"); Socratic toggle; flashcard generation requests; "challenge me" mode (tutor quizzes learner adaptively); citation links on every factual claim.
**Animations:** tutor-driven scene choreography (the agentic tool-use set from Architecture v2.0 §5.3).
**Simulations:** real-time coaching overlay on Modules E/F/G (intervention prompts); diagnostic-scenario co-pilot mode in L (tutor as junior partner the learner must direct — reverses roles, tests learner's diagnostic leadership).
**Assessment:** none directly; tutor interactions feed misconception detection that routes remediation; "challenge me" results feed SRS scheduling.
**Paths — B:** tutor proactively offers; Socratic off by default; plain-language register. **I:** Socratic default; tutor withholds spec values, requiring learner to cite the spec library themselves. **E:** tutor in adversarial-review register (challenges learner claims, demands justification) — trains for Level-3/4 vivas.

### MODULE I — Technical Specification Library

**Goals:** fluency in finding, reading, and applying specifications; understanding tolerance notation; spec-citation discipline.
**Interactions:** full-text + faceted search; deep links ↔ 3D components; printable job cards; personal annotations; SRS flashcard subscription per spec category.
**Animations:** none (reference module).
**Simulations:** none directly; the authoritative source for all SIM-TQ/SIM-M acceptance values.
**Assessment:** spec-retrieval speed drills (find the value, cite the source); tolerance-notation reading items; SRS retention tracking (torque values, clearances, intervals — the platform's memorization layer).
**Paths — B:** owner data subset; guided search tutorial. **I:** full library; job-card building; SRS mandatory deck (40 core specs). **E:** full SRS deck (120 specs); closed-book recall threshold for Level-3 timed practicals.

### MODULE J — Vehicle Dynamics Lab

**Goals:** quantitative grasp of chassis geometry, tire behavior, load transfer, gyroscopic effects, suspension control, and electronic intervention logic.
**Interactions:** geometry sandbox sliders (rake/trail/wheelbase) with live stability-agility readout; grip-circle manipulator; braking scenario player with adjustable inputs; Skyhook on/off A-B comparison rides; J6 prediction interface (commit prediction before replay reveal).
**Animations:** load-transfer arrows and contact-patch deformation under braking/cornering; counter-rotating vs. conventional crank lean-response side-by-side (J4 — links C1); suspension stroke traces over virtual road profiles; intervention replays with IMU data ribbons.
**Simulations:** physics-lite parameterized models (lookup + simplified dynamics per Architecture v2.0 §7) — geometry sandbox, braking distance scenarios, suspension tuning sandbox (change clickers/preload → observe sag and response).
**Assessment:** directional-prediction items (increase trail → what happens to…); load-transfer computations (Level 3); J6 prediction accuracy; suspension-setup case ("180 cm rider, luggage, gravel — set up the bike and defend it").
**Paths — B:** narrative layer — why bikes don't fall over, what the electronics save you from (J3/J6 highlights). **I:** J1–J5 with setup procedures (links G7). **E:** full quantitative treatment; J6 battery; setup-defense cases — core Level-3 content.

### MODULE K — Electrical & Electronics Deep Dive

**Goals:** read the vehicle's electrical architecture; sensor physics; CAN literacy; radar and ride-by-wire chains; charging/starting systems.
**Interactions:** interactive CAN topology map (click node → role, messages, failure symptoms); signal-path tracer (twist throttle → watch request propagate K3); circuit highlighting on 3D harness (links BOM 3.S10.01); FMCW radar visualizer with adjustable target scenarios.
**Animations:** AN-EL signal-flow pulses along harness; relay/contactor actuation; alternator field rotation with waveform output; radar chirp/echo timing diagram synchronized to beam cone.
**Simulations:** virtual multimeter exercises on live circuits (voltage-drop hunts); CAN message-flow sandbox (disconnect a node → observe degradation); charging-system test sequence (SIM-D).
**Assessment:** circuit-tracing items; symptom-to-circuit mapping; waveform identification (links L3); CAN reasoning cases (which functions survive if node X dies?).
**Paths — B:** K4 radar + K6 lighting/dash stories (high-interest entry). **I:** K1, K2, K6, K7 with test procedures — feeds G12 and L. **E:** full K1–K7 including control-strategy concepts (K5) — prerequisite for L7 and Level-3.

### MODULE L — Diagnostics Center

**Goals:** professional diagnostic methodology: evidence-driven, cost-aware, documented; instrument mastery; the discipline of verifying the fix.
**Interactions:** virtual DDS tool UI ⚠; instrument bench (select, connect, read); evidence board (pin findings, build causal chains); test-cost ledger (every test "costs" — efficiency scoring); fix-verification step mandatory before case close.
**Animations:** waveform rendering (L3); fault-state behaviors on the 3D model (misfire shake, fan failure overheat progression); audio-library playback with spectrogram view (L5).
**Simulations:** the diagnostic scenario engine (Architecture v2.0 §7) — scripted cases (Level 2), unscripted campaigns (Level 3), Grand Rounds with intermittents and no-fault-found (Level 4); virtual instruments SIM-D battery; L7 CAN fault-finding exercises.
**Assessment:** scenario scoring = accuracy × efficiency × documentation quality; audio identification quizzes; instrument-reading audits; methodology rubric (did the learner verify the fix?).
**Paths — B:** spectate mode — watch annotated master-diagnosis replays (engaging detective content). **I:** L1–L4 + 6 scripted cases — Level-2 requirement. **E:** L5–L7 + unscripted campaigns → Grand Rounds — the spine of Level-3/4 diagnostic certification.

### MODULE M — Design Studio: Engineering Decisions

**Goals:** think in trade-spaces; argue from constraints; understand that every part is a negotiated compromise between performance, durability, cost, manufacturability, and regulation.
**Interactions:** trade-study walkthroughs with decision-tree navigation (M1–M4, M6); M5 sandboxes (parameter sliders → multi-axis consequence radar charts); "you decide" checkpoints (commit to a choice before seeing Ducati's, then compare reasoning).
**Animations:** consequence visualizations (raise compression → knock-margin thermometer + octane requirement + torque curve shift); desmo vs. spring mechanism side-by-side at redline (links C3).
**Simulations:** M5 trade-off sandboxes (compression, gearing, spring rates, service-interval design) with modeled consequence engines (physics-lite, directionally verified ⚠ model validation in Phase 0).
**Assessment:** trade-study reasoning items (rank these four constraints for this decision); "defend the opposite" essays (argue *for* keeping desmo — tests genuine trade-space understanding); Level-4 capstone hosted here.
**Paths — B:** M1 desmo story as narrative (the platform's best story, told accessibly). **I:** M1–M4 walkthroughs with you-decide checkpoints. **E:** M5 sandboxes + M6 + defend-the-opposite battery → Level-4 capstone.

### MODULE N — Instructor & Classroom Suite

**Goals (learner-facing):** collaborative workshop skills — procedure communication, role discipline, peer verification (mirrors real shop practice where one tech reads, one wrenches).
**Interactions:** synchronized-view sessions; pointer/annotation; N4 paired assembly (reader role: procedure + spec access, no manipulation; builder role: manipulation, no procedure panel — communication is the bridge); role swap at midpoint.
**Animations:** none additional (broadcasts existing module content).
**Simulations:** N4 collaborative variant of E/F phases with shared scoring (both learners receive the build score — aligned incentives).
**Assessment (learner):** collaborative builds scored on communication quality proxies (error rate vs. solo baseline, clarification requests); peer-review exercises. **Assessment (instructor-facing):** N3 builder with item-bank quality rules (every custom item must cite spec store or module content).
**Paths — B:** join instructor-led guided tours. **I:** N4 paired builds (counts toward Level-2 practical hours). **E:** lead role in N4 with a Level-1/2 partner; Level-4 teach-back delivered here.

---

## 4. Academy Programs (Cross-Module Curriculum Maps)

The levels above define *what* must be demonstrated; programs define *the recommended route*. Learners may test out of any gate.

**Program 1 — Owner's Academy (→ Level 1, ~8 weeks part-time)**
A(B) → B(B) → C(B) → J(B) → G(B) → M1 story → I(B) → L spectate → **Level-1 certification exam**

**Program 2 — Technician Pathway (→ Level 2, ~5 months part-time)**
Level 1 + I(I) with SRS core deck → S13 torque theory unit → E(I): E0 teardown first → E1–E14 → E15 → G(I) all procedures → F(I) → K(I) → L(I) scripted cases → N4 paired builds → **Level-2 certification battery**

**Program 3 — Engineering Degree-Track (→ Level 3, ~9 months part-time)**
Level 2 + C(E) full quantitative → D(E) all 14 sections → J(E) → K(E) → M(I→E) → L(E) unscripted campaigns → E expert-mode cert run → **Level-3 battery incl. viva**

**Program 4 — Master's Program (→ Level 4, cohort-based, ~6 months)**
Level 3 + M5/M6 advanced → cross-system cascade cases → Diagnostic Grand Rounds → blind-build → teach-back residency (N) → **capstone trade study + human-moderated award**

---

## 5. Assessment System Design

**Item types:** 3D identification (click-target) · select-best-explanation · sequence ordering · numeric entry with tolerance bands · spec-retrieval-with-citation · simulation-embedded probes · scenario trees · rubric-scored written/oral (AI-prescored, human-moderated at Levels 3–4).

**Integrity model:** certification attempts run in **proctored mode** — timed, AI-tutor disabled, spec library closed-book where specified, randomized item/scenario selection from pools (≥4× pool-to-test ratio), simulation parameters randomized (torque specs displayed values stay true — *sequences and scenarios* randomize). Formative practice is unlimited and un-proctored by design: the gap between practice freedom and exam discipline is itself pedagogical.

**Scoring transparency:** every simulator score decomposes visibly (torque accuracy / sequence / orientation / time / hints / errors) per the xAPI extension fields defined in Architecture v2.0 §9.4. Learners always see *why* they scored what they scored.

**Remediation loop:** failed gates trigger misconception-mapped remediation (Module H detection → targeted content prescription → SRS reinforcement → re-attempt after cooling period: 24 h Levels 1–2, 7 days Levels 3–4).

**Truth discipline:** every answer key entry binds to a `spec_sources`-verified record. Items touching ⚠ values are blocked from publication (BOM rule 6 extended to assessment).

---

## 6. Credential Architecture

| Credential | Issued | Verification |
|---|---|---|
| Module badges | Auto, per module path completion | Public hash URL |
| Level 1 — Certified Multistrada V4 Enthusiast | Auto on battery pass | Public hash URL |
| Level 2 — Certified V4 Service Technician (Digital) | Auto + integrity review on flags | Hash + decomposed score transcript |
| Level 3 — V4 Systems Engineer (Digital) | Auto-scored + human-moderated viva/reports | Hash + transcript + artifact links |
| Level 4 — Master Engineer, V4 Platform (Digital) | **Human countersigned, never automatic** | Hash + capstone published to learner portfolio |

All digital credentials carry the explicit scope statement: *simulation-based credential on the DTEA platform; complements but does not replace OEM hands-on authorization.* LinkedIn/Credly export per Architecture v2.0 Phase 5.

---

## 7. LXD Success Metrics

- Gate pass-rate bands: target 60–85% first-attempt at every gate (below 60% = content/difficulty defect; above 85% = gate too soft) — reviewed quarterly from xAPI data
- SRS retention: ≥90% recall on core spec deck at 30 days post-Level-2
- Simulation transfer proxy: expert-mode scores on *never-practiced* randomized procedures ≥80% of practiced-procedure scores (measures understanding vs. memorized choreography)
- Level-3 viva inter-rater reliability (AI prescore vs. human moderator): κ ≥ 0.7, reviewed per cohort
- Completion funnel: ≥40% of Level-1 completers begin Level 2; ≥25% of Level-2 completers begin Level 3

---

*LXD v1.0 — defines the academy built on Architecture v2.0 and BOM v1.0. The four-level competency framework supersedes the V2 T1–T3 model (mapping in §1.1). All assessment content subject to the Verified Data Baseline.*
