# Ducati Multistrada V4 — Digital Twin Engineering Academy
## Architecture Version 2.0 — Incorporating Expert Panel Review
**Date:** 2026-06-11 | **Supersedes:** Version 1.0 | **Classification:** Product Architecture

---

# PART I — CRITICAL REVIEW OF VERSION 1.0

Review panel: Ducati Chief Engineer · Ducati Manufacturing Engineer · Ducati Service Technician Trainer · Mechanical Engineering Professor · AAA Simulation Game Director

## 1. Review Verdict Summary

| Dimension | V1 Grade | Core Problem |
|---|---|---|
| Technical accuracy | **FAIL** | Engine specifications describe the wrong engine; modules built on false architecture |
| Module coverage | C+ | Vehicle dynamics (explicitly requested) absent; no diagnostics center; no electronics deep-dive |
| Simulation depth | B− | Assembly-only; no disassembly, no dyno, no measurement, no virtual instruments |
| Manufacturing coverage | C | Missing heat treatment, welding, gear manufacturing, injection molding, balancing, paint, EOL test |
| Maintenance realism | C+ | Missing diagnostic workflows, ADAS calibration, software updates, troubleshooting trees |
| AI tutor design | B− | Q&A-centric; no Socratic mode, no scene control, no real-time coaching, no misconception detection |
| Technical architecture | B− | Dual-engine (React+Unity) doubles cost; 6 data stores premature; no WebGL2 fallback |
| Risk management | D | Ducati IP licensing treated as a table row; no fact-verification process; no risk register |

## 2. Critical Factual Errors in V1 (Chief Engineer)

This is the most serious finding. V1's Appendix C and Modules C3, E6, E8, and G3 were built on incorrect data:

| Parameter | V1 (WRONG) | Correct (V4 Granturismo, 2021–2024 baseline) |
|---|---|---|
| Displacement | 937 cc | **1,158 cc** |
| Bore × stroke | 88 × 76.6 mm | **83 × 53.5 mm** |
| Compression ratio | 13.8:1 | **14.0:1** |
| Valve actuation | Desmodromic | **Conventional valve springs** — the first non-desmo Ducati engine in decades; THE headline engineering story of this motorcycle |
| Valve service interval | (not stated) | **60,000 km** — industry-leading, the direct consequence of dropping desmo |
| Variable valve timing | DVT, 0–25° | **No DVT.** DVT belongs to the Testastretta DVT twins (Multistrada V2/1260). The Granturismo V4 has fixed timing |
| Peak power | 157 bhp @ 10,500 | **170 hp @ 10,500 rpm** |
| Peak torque | 119 Nm @ 8,000 | **125 Nm @ 8,750 rpm** |
| Firing order | 0°-180°-360°-540° | **Twin Pulse: 0°, 90°, 290°, 380°** |
| Crankshaft | (unremarkable) | **Counter-rotating** — reduces gyroscopic effect, aids agility and anti-wheelie; signature MotoGP-derived feature |
| Cylinder deactivation | (absent) | **Rear bank deactivates at standstill/idle** to reduce heat to rider — a defining Multistrada V4 feature |
| Front/rear radar | (absent) | **World's first production motorcycle with front + rear radar** (Bosch): Adaptive Cruise Control + Blind Spot Detection |
| Suspension (V4 S) | Showa BPF / Sachs-Öhlins | **Marzocchi 50 mm electronic fork + Skyhook DSS EVO** |

V1's research conflated the **Testastretta 11°/DVT twins** (937/1260 cc, desmo, DVT) with the **V4 Granturismo**. Note the deliberate family exception: the **Multistrada V4 RS** uses the 1,103 cc Desmosedici Stradale, which IS desmodromic — an outstanding comparison-teaching opportunity that V2 captures (Module C3, M1).

**Systemic implication:** the platform's core promise is "Always Correct," but V1 had no process guaranteeing correctness. V2 mandates a **Verified Data Baseline** — every specification ingested only from official Ducati workshop manual / parts catalog, each datum carrying a source citation and verifier, with a human technical fact-gate (Ducati consultant sign-off) before any content ships. Items in this document not yet manual-verified are marked ⚠ VERIFY.

## 3. Gap Analysis — The Seven Requested Categories

### 3.1 Missing Modules
1. **Vehicle Dynamics Lab** — explicitly in the original brief ("vehicle dynamics"); V1 never gave it a module. Chassis geometry, tire physics, weight transfer, electronic intervention.
2. **Electrical & Electronics Deep Dive** — the Multistrada V4 is among the most electronically advanced motorcycles ever made (radar, 6-axis IMU, CAN architecture, ride-by-wire); V1 scattered this across other modules.
3. **Diagnostics Center** — the single biggest gap for technician training: virtual diagnostic tool, troubleshooting trees, virtual instruments. V1 had one sub-section (G9) where a flagship module is needed.
4. **Design Studio (Engineering Decisions)** — "design rationale" was in the original brief; V1 reduced it to a metadata field. Trade-off engineering deserves a module.
5. **Instructor & Classroom Suite** — V1 names educators as a target audience, then gives them only an analytics dashboard at month 24.

### 3.2 Missing Simulations
- **Disassembly/teardown** — V1 was assembly-only. Real training starts with teardown: removal order, fastener mapping to trays, inspection on removal.
- **Dyno laboratory** — run the built engine; power/torque/AFR curves; parameter effects.
- **Precision measurement lab** — micrometers, bore gauges, Plastigauge, dial indicators; accept/reject decisions against spec.
- **Virtual instruments** — multimeter, oscilloscope, manometer, compression/leak-down testers.
- **Thermal behavior** — warm-up, heat soak, cylinder-deactivation logic visualized.
- **Suspension setup sandbox** — change preload/damping, observe response.
- **Failure/wear progression** — consequences of skipped maintenance made visible.

### 3.3 Missing Educational Experiences
Comparison labs (desmo vs. spring valves; V4 vs. V2 twin; counter- vs. forward-rotating crank) · Socratic dialogue · Scenario-based learning ("a customer walks in with this complaint") · Collaborative two-learner assembly · Instructor-led synchronized sessions · Spaced-repetition flashcards from day one (V1 deferred to month 21) · Visual glossary · Note-taking on 3D views · **Accessibility** — V1 was nearly silent on screen readers, color-blind-safe highlighting, reduced motion, captions; this is both an ethical and a legal (EU accessibility requirements) obligation for an education product.

### 3.4 Missing Manufacturing Processes (Manufacturing Engineer)
- **Heat treatment** (carburizing, induction hardening, quench & temper, nitriding) — inexcusable omission; nothing in a gearbox survives without it
- **Gear manufacturing** (hobbing, shaving, grinding, crowning, gear metrology)
- **Welding & joining** (frame TIG/robotic welding, structural adhesives, weld inspection)
- **Plastic injection molding** (bodywork, airbox) and **paint/coating line** (e-coat, robotic paint, decals)
- **Balancing** (crankshaft, wheels) and selective bearing fitting
- **Powder metallurgy/sintering** (valve seats, oil pump rotors)
- **Engine EOL hot-test and vehicle roll-off validation**
- **Electronics manufacturing** overview (ECU SMT, conformal coating)
- **Supply chain & supplier quality** — Ducati is an integrator (Brembo, Bosch, Marzocchi); supplier quality gates are core to how the bike is actually made
- **Sustainability & Euro 5+ compliance** as manufacturing constraints

### 3.5 Missing Maintenance Workflows (Service Trainer)
Symptom-driven troubleshooting trees (the heart of real service work) · **Radar/ADAS calibration after front-end service** — safety-critical and entirely new territory for motorcycle technicians · ECU/dashboard software updates and key programming · Lithium battery service and parasitic-drain testing · Storage/winterization and return-to-service · Steering head bearing service · Chain replacement with rivet tooling · Spark plug service (rear bank access is notoriously involved on the V4) · Service documentation, warranty procedures, technical bulletin awareness.

### 3.6 Missing Diagnostics Capabilities
Virtual Ducati diagnostic system (DDS-equivalent): fault memory, live data, actuator tests, guided functions ⚠ VERIFY tool capabilities · Live-data interpretation training (what a degrading lambda sensor looks like in data) · Audio diagnostics library (cam chain rattle vs. clutch chatter vs. detonation — sound identification) · Electrical fault-finding methodology (voltage-drop testing, wiggle tests, connector inspection) · CAN bus fault-finding exercises · Oil analysis interpretation · Compression/leak-down interpretation · DTC → root-cause flowcharts.

### 3.7 Missing AI Tutor Capabilities
- **Agentic scene control** — the tutor should drive the 3D scene (navigate, explode, highlight) while explaining. The highest-value AI upgrade available.
- **Real-time simulation coaching** — observe the learner's assembly attempts and intervene on error patterns.
- **Socratic mode** — guide with questions instead of always answering.
- **Misconception detection** — map wrong-answer patterns to known misconceptions and address the underlying mental model.
- **Voice conversation mode** — hands-busy learning during simulations.
- **Personalized curriculum generation** feeding a spaced-repetition system.
- **Safety guardrails** — never invent torque values (cite the spec store or decline); safety-critical real-world work (brakes, ADAS) always framed with verify-against-manual language.
- **Multilingual-ready architecture** from day one.

## 4. Challenged Assumptions — Rulings

| # | V1 Assumption | Challenge | V2 Ruling |
|---|---|---|---|
| 1 | Research data is trustworthy | Engine specs were flat wrong | **Verified Data Baseline + human fact-gate; nothing ships unverified** |
| 2 | React/Three.js + Unity WebGL hybrid | Two engines = two asset pipelines, two skill sets, fragile iframe state-sync, ~35 MB extra payload | **Single engine: Three.js/R3F + Rapier WASM for everything.** Snap-zones + authored constraints don't need PhysX. Cuts ~30% engineering cost |
| 3 | WebGPU as primary renderer | Safari/iOS and older institutional hardware coverage incomplete | **WebGPU with automatic WebGL2 fallback; the fallback is the QA floor** |
| 4 | 6 data stores (PG, Mongo, Redis, Pinecone, ClickHouse, Learning Locker) | Massive ops burden for an unlaunched product | **PostgreSQL (JSONB content + pgvector RAG + xAPI table) + Redis.** ClickHouse/dedicated LRS are scale-triggered (>50k MAU) |
| 5 | Auth0 + Supabase together | Redundant — Supabase includes auth | **Supabase Auth only** |
| 6 | MVP at month 9; 20-person team from day one | 9 months of spend before any user validation | **Playable vertical slice at month 5** (one cylinder head: explore + explode + teardown + assemble + AI scene control) as go/no-go gate; 8-person core team until the gate passes |
| 7 | Photorealism everywhere | Photorealism ≠ pedagogy; schematic, X-ray, and cutaway views often teach better | **Multi-representation rendering: photoreal / schematic / X-ray / thermal as first-class view modes on every system** |
| 8 | Ducati licensing = one risk-table row | Trademark + CAD + manual copyright is existential, not operational | **Elevated to Workstream 0** with explicit fallback: independently produced educational content under nominative use, or de-badged "Italian V4 adventure platform" |
| 9 | All modules reach full depth in 24 months | Scope ≈ 3–4× the budgeted capacity | **Depth-tiered shipping:** every module ships Tier-1 (explore + learn) before any module ships Tier-3 (full simulation) |

---

# PART II — ARCHITECTURE VERSION 2.0

## 1. Product Vision (Revised)

Platform identity, mission, audiences, and differentiation carry forward from V1, with two new pillars and one new audience:

**Pillar — Verified Truth.** Every specification, torque value, clearance, and procedure carries a citation to official Ducati documentation and passes a human fact-gate before publication. Authority is the product. The V1 review demonstrated why: plausible-sounding wrong data is the default failure mode of research-driven content, and a learner who catches one wrong spec stops trusting all of them.

**Pillar — Teach the Real Story.** The Multistrada V4's true engineering narrative outclasses V1's fiction: Ducati *abandoned* desmodromics — its 65-year signature technology — for this engine, trading peak-rpm headroom for a 60,000 km valve interval, then injected MotoGP DNA elsewhere (counter-rotating crankshaft, Twin Pulse firing order, rear-bank cylinder deactivation). That decision story is the spine of the Design Studio module and the comparison labs.

**New audience:** riding schools and technical institutes, served by the Instructor & Classroom Suite (Module N).

## 2. Verified Technical Baseline (NEW)

The canonical specification sheet. Items marked ⚠ require workshop-manual verification before content production begins.

| Parameter | Specification |
|---|---|
| Engine | V4 Granturismo — 90° V4, liquid-cooled, DOHC, 16 valves |
| Valve actuation | **Spring-actuated** (deliberately non-desmodromic) |
| Displacement | 1,158 cc |
| Bore × stroke | 83 mm × 53.5 mm |
| Compression ratio | 14.0:1 |
| Power / torque | 170 hp @ 10,500 rpm / 125 Nm @ 8,750 rpm |
| Crankshaft | Counter-rotating |
| Firing order | Twin Pulse — 0°, 90°, 290°, 380° |
| Cylinder deactivation | Rear bank at standstill/idle (rider thermal comfort); extended deactivation on later model years ⚠ |
| Engine mass | ≈ 66.7 kg ⚠ |
| Lubrication | Sump architecture ⚠ VERIFY (semi-dry vs. wet) against workshop manual — V1 asserted dry-sump without a source |
| Service intervals | Oil 15,000 km / 24 months; **valve check 60,000 km** |
| Gearbox / clutch | 6-speed, DQS up/down; wet multiplate slipper clutch ⚠ plate counts and ratios |
| Frame | Aluminum monocoque; engine as stressed member |
| Suspension (V4 S) | Marzocchi 50 mm electronically adjusted USD fork + Skyhook DSS EVO monoshock; base model manually adjustable ⚠ travel figures |
| Brakes | Brembo Stylema monobloc, 330 mm twin front discs, cornering ABS ⚠ rear spec |
| Wheels | 19" front / 17" rear |
| Electronics | Bosch 6-axis IMU; cornering ABS; traction, wheelie, and engine-brake control; ride modes; Vehicle Hold Control ⚠ per-model-year feature matrix |
| Radar (V4 S) | Front + rear Bosch radar — Adaptive Cruise Control + Blind Spot Detection; world-first on a production motorcycle |
| Dash / fuel | 6.5" TFT ⚠ · 22 L tank ⚠ |
| Family exception | Multistrada V4 RS: 1,103 cc Desmosedici Stradale, desmodromic — exploited in comparison labs |

**Data governance:** a single specification store is the only source modules and the AI tutor may read. Every record = value + unit + source document + page + verifier + verification date. Public-facing spec views display citations. An error-report button sits on every specification surface.

## 3. Learning Architecture (Revised)

V1's Bloom/constructivist/mastery framework, T1–T3 competency tiers, and assessment architecture carry forward. Additions:

- **Multi-representation principle.** Every system is teachable in four render modes — photoreal, schematic (simplified color-coded geometry), X-ray, and thermal/flow overlay. Learners toggle freely; assessments may prescribe a mode.
- **Compare-to-learn.** Structured comparison labs as a first-class content type: desmo vs. spring valvetrain; V4 vs. V2 twin; counter- vs. forward-rotating crank; chain vs. shaft final drive.
- **Scenario pedagogy.** Technician-track content framed as customer cases with presenting symptoms, not procedure recitals.
- **Teardown-before-build.** Disassembly precedes assembly in the simulators, mirroring real apprenticeship.
- **Spaced repetition from MVP.** Torque values, clearances, and intervals feed an SRS flashcard engine from launch, not Phase 4.
- **Accessibility (WCAG 2.2 AA).** Mirrored accessible component tree (screen-reader-navigable path through the 3D hierarchy); color-blind-safe highlight palette with pattern redundancy; reduced-motion mode (crossfades replace explode animations); captions/transcripts on all media; full keyboard operation of 3D scenes.

User journey, onboarding, and the three learning paths carry forward from V1, with the Technician's Track re-sequenced to lead through the new Diagnostics Center (Module L).

## 4. Module Hierarchy — Version 2 (14 Modules)

### Module A — Motorcycle Explorer *(carried forward, corrected)*
As V1, plus: multi-representation view modes; radar/ADAS callouts; A4 "Key Innovations" now teaches the real ones — spring valvetrain decision, counter-rotating crank, Twin Pulse, cylinder deactivation, radar; trim comparison includes the V4 RS desmo contrast.

### Module B — Exploded View Explorer *(carried forward)*
V1's B1–B8, plus **B9: Radar & ADAS components exploded view**.

### Module C — Engine Deep Dive *(heavily corrected)*
- C1: V4 Architecture — 90° vee, Twin Pulse firing order, **counter-rotating crankshaft physics** with an interactive gyroscopic-moment demonstration
- C2: Cylinder Head & Spring Valvetrain — **why Ducati dropped desmo here**: spring dynamics, valve float threshold, finger followers, the 60,000 km interval
- C3: **Comparison Lab — Desmo vs. Spring** *(replaces V1's DVT module)*: Desmosedici Stradale (V4 RS) head side-by-side with the Granturismo head; trade-offs quantified
- C4: **Cylinder Deactivation System** — rear-bank shutdown logic, injector/ignition strategy, thermal rationale
- C5–C10: Pistons & rods · Crankshaft & bearings · Lubrication (architecture per verified manual ⚠) · Cooling · Combustion analysis · Gearbox & slipper clutch — V1 scope, corrected data
- C11: Intake & Exhaust — airbox design, exhaust packaging, Euro 5+ catalysts ⚠ variable-intake verification

### Module D — Manufacturing Academy *(expanded: 7 → 14 sections)*
D1 Raw materials · D2 Casting · D3 Forging · D4 CNC machining · D5 Surface engineering · D6 Quality & metrology · D7 Assembly line *(all carried forward)*, plus:
- **D8 Heat Treatment** — carburizing (gears), induction hardening (journals), quench & temper, nitriding; austenite→martensite microstructure animations; case-depth specifications
- **D9 Gear Manufacturing** — hobbing, shaving, grinding, crowning; gear metrology
- **D10 Welding & Joining** — robotic TIG on frame ⚠ process specifics; weld inspection; structural adhesives
- **D11 Plastics, Composites & Paint** — injection molding (airbox, panels), carbon layup, e-coat, robotic paint line, decal application
- **D12 Balancing & Precision Assembly** — crankshaft balancing, wheel balancing, selective bearing fitting
- **D13 End-of-Line Validation** — engine hot-test stand, vehicle dyno roll-off, brake/ABS test, electronics flash-and-test
- **D14 Supply Chain & Sustainability** — Ducati as integrator (Brembo, Bosch, Marzocchi supplier quality gates), component traceability, Euro 5+ and recycling as manufacturing constraints

### Module E — Engine Build Simulator *(expanded)*
V1's E1–E14 with all desmo content corrected to spring-valvetrain procedures ⚠ (clearance method per manual), plus:
- **E0: Engine Teardown** — full disassembly precedes assembly: correct removal order, fastener mapping to labeled trays, inspection and measurement checkpoints on removal
- **E15: Measurement Lab** — micrometer, bore gauge, Plastigauge, dial-indicator runout, feeler gauges; reading-interpretation mini-games; accept/reject decisions against the spec store
- **E16: First Start & Dyno** — pre-oiling, first-start checklist, break-in schedule, dyno pull with live power/torque/AFR traces

### Module F — Motorcycle Assembly Simulator *(carried forward, plus)*
V1's F1–F12, plus **F13: ADAS Hardware & Calibration** — radar bracket mounting and torque, aiming-target setup, calibration procedure ⚠ verification.

### Module G — Maintenance Workshop *(expanded: 10 → 16 procedures)*
V1's G1–G10 (G3 corrected: spring-valvetrain clearance check at 60,000 km, including the rear-bank access reality), plus:
- **G11 Symptom-Driven Troubleshooting** — customer-complaint scenarios with diagnostic trees (no-start; running hot; vibration; warning lights)
- **G12 Software & Electronics Service** — ECU/dash updates, key programming, lithium battery service, parasitic-drain testing
- **G13 ADAS Service** — radar calibration after fork service or crash repair; safety-critical framing
- **G14 Storage & Return-to-Service** — winterization, fuel stabilization, recommissioning
- **G15 Chain Replacement** — rivet-link tooling, alignment verification
- **G16 Documentation & Warranty** — service records, technical bulletins, recall checks

### Module H — AI Tutor *(substantially expanded — see §5.3)*

### Module I — Technical Specification Library *(carried forward)*
V1's I1–I10, now backed by the Verified Data Baseline with visible source citations on every entry, plus **I11: per-model-year specification matrix** (2021–current, including V4 S and V4 RS).

### Module J — Vehicle Dynamics Lab *(NEW — closes the original-brief gap)*
- J1: Chassis Geometry — rake, trail, wheelbase, CoG; interactive sandbox (change values, observe stability/agility response)
- J2: Tire Physics — contact patch, slip angle, grip circle, temperature; the 19" front wheel rationale
- J3: Weight Transfer & Braking — load-transfer animation, trail braking, lowside/highside mechanics
- J4: Counter-Rotating Crank Dynamics — gyroscopic effects demonstrated interactively (links to C1)
- J5: Suspension Dynamics — spring-damper theory, Skyhook control logic, semi-active vs. passive comparison sandbox
- J6: Electronic Intervention Theater — replayed scenarios (cornering-ABS save, traction-control intervention, wheelie control) with IMU data overlaid on the 3D motorcycle; learner predicts the intervention before the reveal
- J7: Aerodynamics & Thermal Comfort — windscreen design, heat routing around the rider, the comfort rationale for cylinder deactivation

### Module K — Electrical & Electronics Deep Dive *(NEW)*
- K1: System Architecture — power distribution, interactive CAN bus topology map
- K2: Sensors — IMU, wheel speed, TPS, lambda, MAP, temperature: the physics of each
- K3: Ride-by-Wire — throttle request → ECU arbitration → throttle-valve actuation chain
- K4: Radar Systems — FMCW radar principles, ACC control loop, BSD logic, world-first context
- K5: ECU & Control Strategy — maps, closed-loop fueling, traction-control concepts
- K6: Lighting, Dash & HMI — LED/cornering lights, TFT architecture, connectivity
- K7: Charging & Starting — alternator, regulator, starter circuit, lithium battery characteristics

### Module L — Diagnostics Center *(NEW — flagship of the technician track)*
- L1: Virtual Diagnostic Tool — DDS-equivalent interface: fault memory read/clear, live data, actuator tests, guided functions ⚠ capability verification
- L2: Live Data Interpretation — healthy vs. degraded sensor signatures; trend reading
- L3: Virtual Instruments — multimeter (voltage-drop, continuity), oscilloscope (injector/coil/crank-sensor waveforms), manometer
- L4: Mechanical Diagnostics — compression test, leak-down test with interpretation, oil-analysis reports
- L5: Audio Diagnostics Library — ~30 fault sounds (cam chain rattle, bearing rumble, clutch chatter, detonation); identification quizzes
- L6: Diagnostic Scenario Campaigns — complete cases from customer complaint → evidence gathering → diagnosis → repair plan → verification; scored on accuracy and efficiency (unnecessary tests penalized)
- L7: CAN Bus Fault-Finding — bus-off conditions, terminating resistors, wiggle testing

### Module M — Design Studio: Engineering Decisions *(NEW)*
- M1: The Desmo Decision — full trade study of abandoning desmodromics: service cost vs. rpm ceiling vs. brand identity
- M2: Why a V4? — V4 vs. V2 vs. inline-4: packaging, balance, character
- M3: The Counter-Rotating Crank — what it costs (idler gear, friction) vs. what it buys
- M4: Monocoque vs. Trellis — frame philosophy, stiffness targets
- M5: Trade-Off Sandboxes — learner adjusts design parameters (compression ratio, gearing, spring rates) and sees modeled consequences across performance/durability/cost/emissions axes
- M6: Regulation as a Design Input — Euro 5+, noise, ADAS regulation shaping the engineering

### Module N — Instructor & Classroom Suite *(NEW)*
- N1: Synchronized Sessions — instructor drives the 3D view on all student screens; pointer and annotation broadcast
- N2: Class Management — cohorts, assignments, due dates, progress dashboards
- N3: Assessment Builder — compose quizzes and simulation challenges from the item bank
- N4: Collaborative Assembly — two learners share one simulation (one reads procedure and torque specs, one executes; roles swap), mirroring real workshop pairing
- N5: LMS Integration — LTI 1.3 + xAPI export to institutional LMS platforms

## 5. Technical Architecture — Version 2

### 5.1 Headline changes from V1
1. **Single rendering engine.** Unity WebGL removed. All simulation (teardown, assembly, instruments, harness routing) runs in Three.js / React Three Fiber with Rapier (WASM) physics. Assembly validation uses authored snap-zones and constraint rules — a solved problem that doesn't require PhysX. One asset pipeline, one codebase, no iframe bridge, ~35 MB payload saved, one less specialist discipline.
2. **Renderer fallback.** WebGPURenderer where available with automatic WebGL2 fallback from one codebase. Both paths covered by CI visual-regression tests; the WebGL2 path on 2020-era integrated GPUs at 30 FPS is the hard performance floor (institutional lab hardware reality).
3. **Consolidated data layer.** PostgreSQL 16 (Supabase) becomes the single primary store: relational core + JSONB documents (component catalog, BOM, torque specs — replacing MongoDB) + pgvector (RAG embeddings — replacing Pinecone) + xAPI statements table (replacing Learning Locker at launch). Redis (Upstash) for sessions, AI context, leaderboards, collaboration pub/sub. ClickHouse and a dedicated LRS are scale-triggered additions (>50k MAU), not launch infrastructure.
4. **Auth:** Supabase Auth (Auth0 removed).
5. **Multi-representation pipeline.** Photoreal PBR and schematic material sets authored per component; X-ray (fresnel transparency) and thermal/flow overlays generated at runtime via shaders; view mode switched globally or per-assembly.
6. **Real-time collaboration service** (new, for Module N): WebSocket service (Fastify + Redis pub/sub) synchronizing camera, selection, annotation, and simulation state; simulation state CRDT-synchronized for two-learner sessions.

### 5.2 Stack summary

| Concern | Technology |
|---|---|
| UI | React 19 + TypeScript, Zustand, React Router, Radix UI + Tailwind |
| 3D | React Three Fiber + Three.js r171+ (WebGPU → WebGL2 fallback), GSAP, Rapier WASM |
| Assets | GLB + Draco + KTX2 via Cloudflare R2 / CDN |
| API | Node.js 22 + Fastify (REST + WebSocket) |
| Data | PostgreSQL 16 on Supabase (auth, relational, JSONB content, pgvector, xAPI) + Redis (Upstash) |
| AI | Claude API server-side (claude-sonnet-4-6 standard / claude-opus-4-8 complex analysis), RAG over pgvector |
| Analytics | xAPI → PostgreSQL at launch; ClickHouse + dedicated LRS at >50k MAU |
| Monitoring | Datadog |

V1's rendering pipeline (load → cull → LOD → instancing → post-processing) and interaction pipeline (raycast → metadata → selection state) carry forward unchanged.

### 5.3 AI Tutor service v2 (Module H)

Carried forward from V1: context assembly, RAG retrieval, streaming, confidence tagging. New capabilities:

1. **Agentic scene control (tool use).** The tutor is given tools — `navigate_to_module`, `highlight_component(id)`, `set_view_mode(mode)`, `trigger_explode(assembly)`, `play_animation(id)`, `open_spec(id)`. "Show me how the slipper clutch works" → the tutor navigates to the clutch, explodes it, switches to schematic mode, and plays the animation while narrating. Implemented via Claude tool use; each tool result re-grounds the conversation in actual scene state. This is the platform's signature AI feature.
2. **Real-time simulation coaching.** The simulator emits an event stream (errors, hesitation dwell-times, hint requests) into tutor context; the tutor intervenes proactively on detected patterns ("That's the second over-torque on this bearing cap — want the three-stage sequence explained before the bolt yields?").
3. **Socratic mode.** Opt-in (default for the student role): conceptual questions answered with guided questioning before reveal. Never withholds safety-critical facts or specification values.
4. **Misconception detection.** Wrong-answer patterns mapped to a curated misconception library (e.g., "believes higher compression always means more power"); the tutor targets the underlying mental model.
5. **Curriculum generation.** Personalized study plans from diagnostic and performance data; feeds the SRS flashcard engine.
6. **Voice mode.** Web Speech API input + TTS output for hands-busy simulation learning.
7. **Safety guardrails.** System-prompt enforced: the tutor never invents specification values — it cites the spec store or declines; real-world brake/ADAS/fuel answers always carry verify-against-official-manual framing; clearly dangerous real-world shortcuts are refused.
8. **Hallucination evaluation.** An automated suite of 500+ factual QA pairs (drawn from the verified spec store) runs on every prompt or model change; <2% error rate is a release gate.
9. **Multilingual-ready** prompt and content architecture from day one (launch English-only).

## 6. Asset & 3D Model Requirements (Deltas from V1)

V1's modeling standards, naming convention, scene hierarchy, LOD specification (LOD0–LOD4 with polygon budgets), texture specifications, metadata schema, and explode-data JSON format all carry forward, with these changes:

- **Corrected scope:** valvetrain assets are spring-type; DVT solenoid assets removed; add the Desmosedici Stradale cylinder head (comparison lab); add radar units, ADAS brackets, and calibration targets
- **New assets:** dyno cell environment; virtual instrument set (multimeter, oscilloscope, compression/leak-down testers, micrometers, bore gauges, Plastigauge); heat-treatment furnace and microstructure visualization scenes; gear-hobbing machine; paint-line scene; parts trays and fastener boards for teardown; audio library of ~30 diagnostic fault sounds
- **Multi-representation:** every component ships with photoreal + schematic material sets (X-ray and thermal are runtime shaders)
- **Metadata additions:** `source_citation` (document, page, verifier, date) on every specification field; `view_modes_supported`; `audio_diagnostic_refs`; `aria_label`/`aria_description` on every interactable node feeding the mirrored accessible tree

## 7. Simulation Requirements (Deltas from V1)

Carried forward: torque-wrench mechanics with staged sequences, tolerance zones by difficulty (guided/standard/expert), fluid simulation, harness routing, valve-clearance mini-game (procedure corrected to spring valvetrain ⚠). All simulation now runs in Three.js/Rapier; V1's React↔Unity postMessage protocol becomes an internal event bus with the same message shapes. New systems:

- **Teardown engine** — reverse-order dependency graph; fastener-to-tray mapping with labeling discipline; inspection checkpoints with measurement mini-games on component removal
- **Virtual instruments framework** — one shared interaction pattern: probe/tool placement on the 3D model → realistic instrument readout → interpretation question
- **Dyno simulation** — physics-lite engine model (lookup-table torque curves from verified data + parameter perturbation) rendering live power/torque/AFR traces
- **Thermal visualization** — temperature-field shader on engine and cooling components driven by a simplified thermal model (warm-up, heat soak, cylinder-deactivation effects)
- **Diagnostic scenario engine** — declarative case definitions (symptom set, hidden fault, evidence model, cost-per-test) powering Module L campaigns and scoring
- **Collaboration sync** — CRDT-synchronized simulation state for two-learner sessions (N4)

## 8. Database Requirements (Consolidated)

Single PostgreSQL instance (Supabase) plus Redis:

- **Relational core** *(carried forward from V1)*: `users`, `user_preferences`, `module_progress`, `assessment_results`, `certificates`, `bookmarks`
- **Content as JSONB** *(replaces MongoDB)*: `components`, `torque_specs`, `bom`, `diagnostic_cases`, `misconception_library` — V1's document schemas carry forward as JSONB shapes, with the mandatory addition of `source_citation` objects on every specification value
- **pgvector** *(replaces Pinecone)*: `knowledge_chunks (id, content, embedding, source_doc, page, verified_by)` for AI RAG
- **xAPI statements table** *(replaces Learning Locker at launch)*: JSONB statement column indexed on actor/verb/activity; V1's statement format unchanged; export-compatible with any LRS added later
- **New tables:** `spec_sources` (document registry: manual editions, parts catalogs, verification status), `classrooms`, `class_assignments`, `collab_sessions`, `srs_cards`, `srs_reviews`
- **Redis:** V1 key patterns carried forward, plus `collab:{sessionId}` pub/sub channels

## 9. Development Roadmap — Version 2

Restructured around early validation and depth-tiered shipping. **Depth tiers:** T1 explore + learn → T2 interact + assess → T3 full simulation. Every module reaches T1 before any reaches T3.

| Phase | Months | Gate / Deliverables |
|---|---|---|
| **0 — Foundation & Truth** | 1–3 | **Workstream 0: Ducati licensing resolved or fallback adopted** (legal opinion required; de-badged/nominative-use strategy ready). Verified Data Baseline built from official manual; spec store populated with citations; fact-gate process operating. Asset pipeline, design system, monorepo, Supabase + Redis. Core team of 8 |
| **1 — Vertical Slice** | 4–5 | **Go/no-go gate:** one cylinder head (~40 components) working end-to-end — photoreal + schematic modes, explode, click-to-learn, teardown + assembly with torque mechanics, AI tutor with scene control over this assembly. 100-user test. Kills all integration risk before content production scales |
| **2 — Core Platform** | 6–11 | Modules A, B, I at T2; C at T1–T2 (corrected content); H v1 (Q&A + scene control); J at T1. Accounts, progress, xAPI, SRS flashcards, accessibility baseline. **Public MVP at month 11** |
| **3 — Engine Academy** | 12–17 | Full engine asset (150+ components). C complete; E complete including teardown (E0) and measurement lab (E15); D1–D8; K at T1–T2; H v2 (RAG, real-time coaching, Socratic mode) |
| **4 — Technician Track** | 18–22 | F and G complete; **L Diagnostics Center complete** (flagship); D9–D14; M at T1–T2; certification system live |
| **5 — Classroom & Intelligence** | 23–26 | N Instructor Suite (synchronized sessions, collaborative assembly, LTI 1.3); adaptive learning engine; M complete with trade-off sandboxes; E16 dyno |
| **6 — Scale** | 27+ | WebXR (Quest 3); localization (IT/DE/FR/ES/JA); V4 RS as desmo-comparison platform; LMS partner program; ClickHouse + LRS migration at >50k MAU |

**Team:** 8 core through the vertical-slice gate, scaling to ~18 after it passes. Changes from V1: Unity engineer removed; accessibility specialist and second instructional designer added; Ducati technical consultant's fact-gate role made mandatory in the content pipeline, not advisory.

## 10. Risk Register (NEW)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Ducati IP/licensing not obtainable | Medium | **Existential** | Workstream 0; legal opinion by month 3; fallback: independent educational content under nominative use, or de-badged platform |
| Technical data errors reaching learners | Medium | Critical — accuracy is the brand | Verified Data Baseline, per-datum citations, human fact-gate, error-report button on every spec surface |
| CAD source unavailable | Medium | High | Photogrammetry + manual-dimension remodeling pipeline as the planned fallback |
| WebGPU instability on target browsers | Medium | Medium | WebGL2 fallback is the QA floor; CI visual regression on both paths |
| Scope overrun (14 modules) | High | High | Depth-tiered shipping; vertical-slice gate; T3 simulations only after T1/T2 validated by usage data |
| AI tutor hallucinating specifications | Medium | Critical | Cite-or-decline rule; 500+ factual QA eval suite on every prompt/model change; <2% error release gate |
| Institutional hardware can't run the platform | Medium | Medium | 2020-era integrated GPU @ 30 FPS as the hard performance floor |
| Single-engine bet (no Unity) proves insufficient for a future simulation | Low | Medium | Rapier covers planned scope; revisit only if a future module needs soft-body/cloth physics |

---

*Architecture Version 2.0 — produced from the V1 expert-panel review. V1 is superseded. V1 sections explicitly carried forward (modeling standards, naming conventions, LOD and texture tables, metadata and explode-data schemas, xAPI statement format, interaction paradigms, rendering/interaction pipelines) remain authoritative as referenced.*
