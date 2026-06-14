# DTEA-MFG-001 — Manufacturing Academy Design Specification
**Version:** 1.0 | **Date:** 2026-06-11 | **Status:** Approved
**Parent documents:** DTEA-ARCH-001 (Module D, §4 D1–D14), DTEA-BOM-001 (manufacturing/post-process codes, per-part process assignments), DTEA-LXD-001 (Module D LXD, competency levels)

---

## 1. Purpose & Scope

The Manufacturing Academy teaches how the Multistrada V4 and its Granturismo engine come into existence — from ore and billet to a motorcycle rolling off the end-of-line dyno. This document specifies all 14 teaching units with their full attribute set (inputs, outputs, machinery, process parameters, defects, quality checks, simulations, animations, learning objectives).

**Truth discipline:** general manufacturing science below (process physics, typical parameter ranges, defect taxonomies) is textbook-verifiable and stated plainly. **Ducati-specific** facts (which supplier, which exact alloy, Borgo Panigale line layout, proprietary parameters) are marked ⚠ — placeholders pending verification or licensed plant data; where unobtainable, units teach the *industry-standard process* with an explicit "representative, not Ducati-confirmed" label. The academy never presents an unverified claim as Ducati fact (ARCH-001 §2).

**Structure — three tiers (the academy's signature design):**
- **Tier P — Process Units (U1–U6):** master one process family each
- **Tier J — Part-Journey Capstones (U7–U10):** follow one real BOM part through its *chain* of processes — where learning compounds
- **Tier F — Factory Units (U11–U14):** assembly at industrial scale, quality systems, end-of-line validation

---

## 2. The Academy Experience

### 2.1 The Virtual Factory Campus
A navigable factory environment with 8 production halls (foundry, forge, machining hall, heat-treatment line, surface-engineering shop, gear cell, engine assembly line, vehicle line) plus a metrology lab and the EOL test field. Learners walk lines in guided or free mode; every machine is inspectable (multi-representation: photoreal / schematic / cutaway per ARCH-001). The campus is persistent — part-journey units physically traverse it, building spatial memory of how a factory flows.

### 2.2 Shared Mechanics (used by every unit)
1. **Parameter Sandbox (SIM core):** each process exposes 3–5 governing parameters on sliders; the learner predicts, then runs, and the physics-lite process model renders consequences (fill behavior, hardness profile, surface finish, distortion) plus a cost/throughput ticker — every parameter choice is also an economic choice.
2. **Defect Detective:** graded galleries of real defect imagery classes (X-ray plates, micrographs, surface photos); learner identifies defect type → root cause → upstream parameter responsible. The academy's assessment backbone.
3. **Virtual Metrology Lab:** CMM probing, surface-roughness tester, hardness testers (HRC/HV), gear analyzer, balance machine — same instrument-interaction grammar as SIM-001 §3.4 (probe → read → interpret).
4. **SPC Mechanic:** live control charts on running processes; learner spots trends/shifts, decides intervene vs. continue (over-adjustment is penalized — the classic SPC lesson).
5. **Accept/Reject Gate:** every unit ends with a graded lot-disposition exercise: 10 parts, mixed conformance, learner dispositions each with justification.

### 2.3 Scoring (per unit, 100 pts)
Prediction accuracy in sandboxes 25 · defect identification & root-causing 25 · metrology readings 20 · disposition decisions (incl. justification quality) 20 · SPC judgment 10. LXD level gates: Level-1 narrative pass (no gates), Level-2 units U1–U6+U13 at ≥75, Level-3 all units ≥80 + process-selection defense battery (LXD-001).

---

## 3. The Fourteen Units

Format: **Inputs → Outputs · Machinery · Parameters · Defects · Quality checks · Simulations · Animations · Learning objectives.**

---

### TIER P — PROCESS UNITS

### UNIT 1 — Raw Material Sourcing
**Inputs → Outputs:** bauxite/scrap aluminum, iron ore/scrap steel, alloying elements → certified ingots, billets, bar stock, wire with mill certificates and full traceability.
**Machinery:** (taught as supply chain, not floor machinery) smelters, continuous casters, rolling mills — shown in documentary-style scenes; the receiving dock's incoming-inspection station is the interactive set.
**Parameters:** alloy composition windows (A356: Si 6.5–7.5%, Mg 0.25–0.45% — textbook), cleanliness class, grain refiner additions, certification level (EN 10204 3.1 class).
**Defects:** composition out-of-window, inclusions, hydrogen content (aluminum), counterfeit/mismatched certificates, mixed stock.
**Quality checks:** optical emission spectrometry (OES) verification melt, reduced-pressure test (H₂ in Al), cert-to-heat-number traceability audit, hardness spot check.
**Simulations:** **Certificate Detective** — learner audits 6 incoming lots (certs + OES readouts), catches the planted mismatch; traceability-chain puzzle (follow one heat number to the finished crankshaft it becomes).
**Animations:** global sourcing map; microstructure zoom (ingot grain structure); OES spark spectroscopy visual.
**Learning objectives:** L1 — why alloy choice matters per BOM material assignments; L2 — read a mill certificate; L3 — composition-property relationships, traceability as a safety system (links D14 supplier-integrator model; Brembo/Bosch/Marzocchi sourcing context ⚠ supplier specifics).

### UNIT 2 — Aluminum Casting
**Inputs → Outputs:** certified ingots, sand cores, die lubricant → crankcase halves (HPDC), cylinder heads (gravity ⚠ process per part), wheels ⚠, raw castings with gates/risers.
**Machinery:** melting/holding furnaces, rotary degasser, high-pressure die-cast cell (locking force class 1,500–2,500 t — representative), gravity tilt-pour station, core shooter, X-ray bay.
**Parameters:** melt temperature (~680–720 °C), die temperature, injection velocity/pressure profile (HPDC), tilt rate (gravity), solidification/cooling rate, degassing time.
**Defects:** gas porosity, shrinkage porosity, cold shuts, misruns, core shift (water-jacket wall thinning — the dangerous one), inclusions, hot tears.
**Quality checks:** real-time X-ray / CT on critical castings, dye penetrant, pressure/leak test (jacketed parts), wall-thickness ultrasonic spot checks, density coupons.
**Simulations:** **fill-and-solidify sandbox** (gate velocity × die temp × pressure → porosity map rendered in the casting CUT-Y); Defect Detective on X-ray plate gallery; core-shift consequence explorer (shift the core 1 mm → see the wall the coolant will eventually breach).
**Animations:** molten fill with turbulence visualization; directional solidification front; porosity formation macro; die open/eject cycle.
**Learning objectives:** L1 — how a crankcase is born; L2 — recognize the five casting defect families on inspection media; L3 — why the crankcase is HPDC but the head is gravity-cast ⚠ (integrity vs. cost trade — links M-module thinking), gate/riser design logic.

### UNIT 3 — Forging
**Inputs → Outputs:** steel billets (crank, rods), aluminum billets (triple clamps, caliper bodies ⚠) → near-net forgings with controlled grain flow + flash.
**Machinery:** induction billet heaters, mechanical/screw presses (tonnage class 1,000–4,000 t representative), closed dies, trim presses, controlled-cool conveyors.
**Parameters:** billet temperature (steel hot forge 1,100–1,250 °C; Al 400–480 °C), die temperature, strike energy/sequence, flash-land geometry, post-forge cooling rate.
**Defects:** laps/folds, underfill, flash-line cracks, decarburization (steel), flow-through defects, die mismatch (parting-line offset).
**Quality checks:** magnetic particle inspection (steel), macro-etch grain-flow sections, dimensional template gauging, hardness after controlled cool.
**Simulations:** **forge sandbox** (billet temp × strike sequence → fill completeness + grain-flow map + die-life cost ticker); grain-flow comparison lab — forged vs. machined-from-billet vs. cast rod under cyclic load (fatigue-life race rendered live: the *why forging* moment).
**Animations:** billet glow + press strike with material flow morph (the BOM D3 grain-flow animation); flash formation and trim; lap-formation wrong-state.
**Learning objectives:** L1 — why cranks and rods are forged; L2 — identify forging defects on MPI/etch media; L3 — grain flow → fatigue performance (links Exemplar B rod fracture-split story), flash-less vs. conventional trade-offs.

### UNIT 4 — CNC Machining
**Inputs → Outputs:** castings/forgings + cutting tools + coolant → finished-dimension components (case decks, head chambers/ports, journal pre-grind, caliper bores).
**Machinery:** 5-axis machining centers, horizontal cells with pallet pools, CNC lathes, honing machines (bores ⚠ integral-bore plating interplay), deburr/wash stations, tool presetters.
**Parameters:** cutting speed, feed per tooth, depth of cut, tool wear state, coolant delivery, fixture clamping sequence (distortion!), thermal compensation.
**Defects:** dimensional drift (tool wear/thermal), chatter marks, burrs, datum errors (everything after is wrong — the GD&T lesson), surface-finish misses, clamping distortion on thin walls.
**Quality checks:** in-process probing, CMM first-article + SPC sampling, surface roughness (Ra per BOM surface functions), thread gauging go/no-go, visual burr audit.
**Simulations:** **speeds-and-feeds sandbox** (speed × feed × depth → finish + tool life + cycle time + cost: the productivity-quality frontier made tangible); fixture-distortion explorer (clamp a thin-wall case wrong → measure the spring-back error); CMM programming-lite exercise (choose probe points to catch a known error mode).
**Animations:** 5-axis toolpath with live material removal on the actual head model; chatter wrong-state with audio (links L5 sound library); datum-error propagation cascade.
**Learning objectives:** L1 — raw casting → precision part; L2 — read Ra callouts and CMM reports (links SIM-001 measurement lab); L3 — datum logic and GD&T stacks (cranktrain tolerance-stack exercise per LXD-001 L3), why cam-cap line boring marries caps to heads (the Station-11 lesson, manufacturing side).

### UNIT 5 — Heat Treatment
**Inputs → Outputs:** machined/forged steel parts → case-hardened gears, induction-hardened journals, quenched-and-tempered fasteners, nitrided cranks ⚠ per-part assignments.
**Machinery:** sealed-quench carburizing furnaces (endothermic atmosphere), induction-hardening cells with scanners, quench tanks (oil/polymer), tempering ovens, gas-nitriding retorts, hardness lab.
**Parameters:** carburizing temp (~920 °C) + carbon potential + time → case depth (0.6–1.2 mm class, per gear spec ⚠); induction frequency/power/scan rate → hardened-layer profile; quench medium/agitation → cooling curve; tempering temp/time → final hardness.
**Defects:** distortion (the heat-treat tax — post-HT grinding exists because of it), quench cracks, soft spots, intergranular oxidation, decarburization, retained austenite excess, case-depth misses.
**Quality checks:** Rockwell/Vickers traverse (case-depth profile from surface inward), microstructure sectioning (martensite quality), distortion measurement vs. pre-HT data, crack inspection (MPI).
**Simulations:** **quench sandbox — the academy's flagship**: steel grade × quench medium × agitation → live CCT-diagram trace → hardness + distortion + crack-risk triple outcome (the learner discovers the hardness-distortion trade-off cannot be escaped, only managed); case-depth designer (set carburizing time/temp, predict the traverse curve, verify in the virtual hardness lab).
**Animations:** **austenite→martensite transformation** at grain scale (BOM D8 animation — the academy's signature visual); induction scan with heat-front penetration; distortion exaggeration morph on a gear post-quench.
**Learning objectives:** L1 — why a gear surface is glass-hard but its core is tough; L2 — read a hardness traverse, identify quench cracks; L3 — TTT/CCT literacy, case-core design logic, why post-HT hard grinding is unavoidable (sets up U9), per-BOM HT-code rationale (HT-C vs HT-I vs HT-N selection defense).

### UNIT 6 — Surface Finishing
**Inputs → Outputs:** heat-treated/machined parts → DLC-coated followers, anodized suspension/engine parts, plated cylinder bores (Nikasil-class ⚠), shot-peened rods/springs, e-coated + painted bodywork (paint taught here; deep-dive in vehicle unit).
**Machinery:** PVD/DLC coating chambers, hard-anodize line (tanks, rectifiers), electroplating line (bore plating ⚠ process owner), shot-peen cabinets with Almen fixtures, e-coat dip line + robotic paint booths.
**Parameters:** PVD chamber pressure/bias/target power → coating thickness & adhesion (DLC 1–3 µm class); anodize current density/bath temp/time → layer thickness; peen intensity (Almen A height) + coverage %; plating current/bath chemistry → deposit thickness/hardness.
**Defects:** coating delamination, thickness non-uniformity, anodize burn, peen coverage gaps (fatigue initiation sites), plating nodules/pits in bores, paint orange peel/inclusions.
**Quality checks:** coating thickness (eddy current/XRF), adhesion scratch test, Almen strip verification, bore surface microscopy + Ra, salt-spray coupons, paint DOI/thickness gauging.
**Simulations:** **peen-coverage exercise** (set intensity/time, inspect coverage map, find the gap that becomes the fatigue crack — links U3 fatigue story); DLC parameter sandbox (bias/pressure → adhesion vs. stress trade); Defect Detective on coating-failure gallery.
**Animations:** PVD plasma deposition at atomic-layer visualization; anodize layer growth CUT-Y; peening impact dimples forming residual-stress color field; e-coat electrophoretic deposition.
**Learning objectives:** L1 — why follower faces are black (DLC) and what it buys (the 60,000 km valve interval enabler — links C2); L2 — verify coating/peen quality; L3 — residual-stress engineering, surface-system selection per BOM post-process codes (defense exercises).

---

### TIER J — PART-JOURNEY CAPSTONES *(each chains Tier-P units on one real BOM part; the learner escorts "their" part through the campus)*

### UNIT 7 — Valve Manufacturing (journey: BOM Exemplar A valves)
**Inputs → Outputs:** alloy bar/wire (stainless class intake; heat-resistant exhaust ⚠ bimetal/sodium-filled per verification) → finished valves, ground, hardened, stem-finished.
**Machinery:** upset-forging machines (head forming by electrical upsetting), friction-welding station (bimetal stem-head joining where applicable ⚠), centerless grinders, seat-face grinders, stem chrome/nitride line ⚠, wafer-tip hardening.
**Process parameters:** upset current/force profile, friction-weld speed/pressure/burn-off, seat-angle grind geometry (typically 3-angle interplay with head seats), stem grind tolerance class (µm-level), tip hardness.
**Defects:** upset folds at the fillet (the fatigue-critical zone), weld-line inclusions (bimetal), seat-face runout vs. stem, stem taper/ovality, soft tips.
**Quality checks:** runout DTI (seat-to-stem — the king check), fillet MPI/eddy current, hardness map (tip/stem/seat), weld-line ultrasonic ⚠, profile projector geometry.
**Simulations:** journey-mode (escort one exhaust valve U1→U3→U5→U6 with decision points at each station); runout consequence lab — install a 0.05 mm-runout valve in the virtual head, watch the seat-contact band fail the SIM-001 Station-9 inspection (the cross-platform payoff).
**Animations:** electrical upsetting glow-and-gather; friction-weld flash; seat-band contact development on grind; CUT-Y of sodium-filled stem ⚠ if confirmed.
**Learning objectives:** L1 — a valve is five manufacturing miracles in one 50 g part; L2 — the checks that guarantee a valve seals at 11,000 rpm; L3 — fillet design vs. upset process limits; why valve runout tolerance is single-digit µm (combustion sealing chain — links C2/Exemplar A).

### UNIT 8 — Crankshaft Manufacturing (journey: BOM Exemplar B crank)
**Inputs → Outputs:** forged steel blank (U3) → finished, hardened, ground, superfinished, balanced counter-rotating crankshaft.
**Machinery:** turning/milling cells (rough journals, webs), deep-hole gun-drilling (oil galleries), induction hardener or nitriding retort ⚠ per spec, CNC crank journal grinders (pin-chasing orbital grind), superfinishing tape station, dynamic balancing machine with material-removal drilling.
**Process parameters:** gun-drill feed/coolant pressure (gallery straightness), hardening profile per journal, grind wheel speed/dress cycle/infeed (burn risk!), superfinish tape grit/dwell, balance tolerance (g·mm class ⚠).
**Defects:** **grind burn** (localized re-tempering — invisible to the eye, fatal in service: the unit's central villain), gallery drill wander/breakthrough burrs, journal taper/ovality, fillet undercut, residual imbalance.
**Quality checks:** Barkhausen noise / nital-etch burn inspection, journal micrometry + roundness machine, gallery borescope + flow test (links SIM-001 Station 1!), fillet profile, balance certificate (the actual spin readout).
**Simulations:** **grind sandbox** (infeed × wheel dress state → finish vs. burn-risk meter — pushing productivity until you burn one is the intended learning failure); balancing exercise (read imbalance vector, choose correction-drill locations); journey-mode full chain U1→U3→U4→U5→U8.
**Animations:** orbital pin-grinding kinematics (mesmerizing and instructive); gun-drill gallery progress CUT-Y; balance-machine polar plot forming live; burn wrong-state (nital-etch reveal moment).
**Learning objectives:** L1 — billet to balanced heart of the engine; L2 — burn inspection and journal metrology (feeds SIM-001 Station 2–3 measurements); L3 — why grinding is the highest-risk step in the chain, balance theory for a counter-rotating crank (links C1/J4/M3).

### UNIT 9 — Gear Manufacturing (journey: gearbox input-shaft gear set)
**Inputs → Outputs:** forged/barstock blanks → finished, carburized, hard-ground, crowned gearbox gears (BOM D9 chain).
**Machinery:** CNC gear hobbers, shaving machines (pre-HT), carburizing line (U5), gear-grinding machines (post-HT profile restoration), crowning/honing, gear analyzer (analytical inspection machine).
**Process parameters:** hob speed/feed/shift strategy, shave stock allowance, case depth spec, grind stock removal + dressing, crown magnitude (µm lead modification), backlash design allowance.
**Defects:** profile error (fa), lead error (fβ), pitch error, nicks/handling dings, HT distortion exceeding grind stock (scrap — the costly chain failure), grind temper.
**Quality checks:** gear analyzer charts (profile/lead/pitch traces — chart-reading is the unit's literacy core), contact-pattern blue check on mating pair, case-depth audit section, nick detection (rolling test + noise).
**Simulations:** **distortion-budget game**: choose shave stock before HT → quench (U5 sandbox states apply) → discover whether grind stock survives distortion (too little = scrap, too much = cost: the integrated planning lesson); contact-pattern lab (adjust crown → load distribution → predicted noise/durability — links the gear-whine latent defect in SIM-001 Station 6).
**Animations:** hobbing generation kinematics (the rolling-generation animation every engineer remembers); shave/grind finishing passes; contact-patch migration under load with crown variations.
**Learning objectives:** L1 — why gears whine or don't; L2 — read analyzer charts, perform contact checks; L3 — the pre-HT/post-HT planning chain (the academy's best systems-thinking exercise), profile/lead tolerancing vs. NVH (links L5 audio diagnostics).

### UNIT 10 — Cylinder Head Manufacturing (journey: BOM Exemplar A head, the vertical-slice asset)
**Inputs → Outputs:** gravity-cast head blank (U2) → fully machined head with pressed seats/guides, 3-angle-cut seats, ready for SIM-001 Station 9 valve assembly.
**Machinery:** 5-axis head cells (chambers, ports, decks, cam bores line-bored with caps fitted — the Station-11 marriage made here), seat/guide press station with LN₂ part chilling, CNC seat-and-guide cutter (single-pointing concentric 3-angle seats), leak-test rigs.
**Process parameters:** line-bore feed with caps torqued to assembly spec (the caps are machined *married*), guide/seat interference fits (typically 0.04–0.08 mm class ⚠), LN₂ chill temperature, seat angles (30/45/60-class ⚠ per spec), port-surface targets.
**Defects:** seat/guide press scoring or cracking (interference too high/chill insufficient), seat-to-guide eccentricity (kills sealing — the valve-runout twin from U7), chamber volume variance (compression-ratio spread), water-jacket breakthrough (core-shift inheritance from U2 — the cross-unit traceback).
**Quality checks:** seat concentricity to guide (the king check, µm-level), chamber cc'ing (volume audit), vacuum-decay seat seal test, CMM deck/cam-bore geometry, leak test of jacket.
**Simulations:** **press-fit sandbox** (interference × chill temp → press force trace: smooth curve vs. scoring spike — same force-judgment grammar as SIM-001 Station 8); seat-cut exercise (cut 3 angles, measure contact-band width against the Station-9 spec — the manufacturing origin of the inspection the learner already performed as a builder); journey-mode U1→U2→U4→U10.
**Animations:** line-boring with caps on (why caps are non-interchangeable — completing the trilogy: BOM Exemplar A metadata → SIM-001 Station 11 assembly → U10 manufacturing origin); LN₂ chill + press CUT-Y; 3-angle seat geometry build-up.
**Learning objectives:** L1 — the most complex machined part on the motorcycle; L2 — seat/guide quality verification; L3 — interference-fit engineering, the chamber-volume → compression-ratio statistical chain, full-loop understanding: *every inspection a technician performs exists because of a manufacturing failure mode* — the academy's thesis, proven on one part.

---

### TIER F — FACTORY UNITS

### UNIT 11 — Engine Assembly (Industrial)
**Inputs → Outputs:** kitted verified components → tested, serialized Granturismo engines. *Pedagogical mirror: the learner has built this engine by hand (SIM-001); this unit shows the same build at takt time.*
**Machinery:** assembly line ⚠ layout (cell vs. line per plant data) with lift-assist fixtures, DC electric torque tools with transducer feedback + position encoding, automatic shim-selection station (measure → pick), bolt-sequence poka-yoke (tool won't fire out of order — the industrial answer to SIM-001's sequence scoring), traceability scanners at every station, sub-assembly cells (heads, clutch).
**Parameters:** takt time, torque-tool calibration intervals, traceability completeness (every safety-critical fastener's torque *curve* stored against the engine serial), kitting accuracy.
**Defects:** missed/NOK torque (caught by tool data), wrong-variant part (caught by scan), FOD (line discipline + final boroscopy ⚠), seal damage at install.
**Quality checks:** 100% torque-trace verification, vision checks at gasket/seal stations, in-line leak tests, end-of-line cold test (next: U14).
**Simulations:** **line-balance exercise** (distribute SIM-001's 17 stations across N workstations to hit takt — surplus/starve dynamics rendered); torque-trace forensics (read 6 stored torque curves, identify the cross-threaded one, the soft-joint one, the re-hit); poka-yoke design challenge (given a classic mistake from SIM-001's error library, design the line feature that makes it impossible).
**Animations:** full line flow timelapse; DC-tool torque-curve forming live during a rundown; shim auto-selection station cycle.
**Learning objectives:** L1 — how 1 engine becomes 100/day; L2 — industrial torque assurance vs. hand wrenching (the technician's bridge); L3 — line balancing, poka-yoke philosophy, why traceability turns recalls from catastrophes into queries (links U1 heat numbers).

### UNIT 12 — Motorcycle Assembly (Vehicle Line)
**Inputs → Outputs:** engines (U11), frames, supplier modules (suspension, brakes, electronics, bodywork) → complete serialized motorcycles ready for EOL.
**Machinery:** frame-engine marriage station (lift/AGV ⚠), harness-routing boards and clip verification, fluid-fill machines (evacuate-and-fill brake/coolant — the industrial version of SIM-001 Stations 13–14 bleed mechanics), wheel/steering alignment rigs, trim cells, software flash-and-configure station (VIN-keyed ⚠).
**Parameters:** marriage-bolt torque program, fill volumes/vacuum levels, alignment specs, flash configuration matrix per market/trim ⚠.
**Defects:** harness mis-routing (chafe — links F8 simulator discipline), trim damage (cosmetic class), fluid underfill/air, wrong-market configuration, missed PDI items.
**Quality checks:** vision-system routing verification, fill-machine cycle logs, electrical full-function test (every lamp/switch/CAN node), squeak-and-rattle audit, pre-EOL checklist.
**Simulations:** marriage-sequence planning (in what order do engine, swingarm, harness, tank go together? — dependency-graph puzzle, vehicle-scale F-module mirror); fill-machine cycle interpretation (vacuum-decay trace = leak found before fluid ever enters); configuration-matrix exercise (flash the right map for the right market or watch the EOL catch it).
**Animations:** frame-engine marriage choreography; evacuate-fill cycle CUT-Y in brake lines (why production bikes have no air without bleeding); line flow from bare frame to rolling vehicle.
**Learning objectives:** L1 — 1,850 parts to one motorcycle in hours; L2 — what PDI actually verifies and why; L3 — supplier-module integration logic (Brembo corner arrives *assembled* ⚠ — define the make-vs-buy boundary; links D14/M-module).

### UNIT 13 — Quality Control (Cross-Cutting)
**Inputs → Outputs:** parts, processes, data streams from U1–U12 → dispositions, capability evidence, corrective actions. *Taught as the system that lives inside every other unit.*
**Machinery:** metrology lab (CMM, roundness machine, optical scanner, surface lab, hardness lab — the academy's instrument home), gauge cribs with calibration tracking, SPC dashboards, supplier-quality desk (PPAP-style submission review ⚠ Ducati's actual gate names).
**Parameters:** sampling plans (AQL classes), control limits vs. spec limits (the distinction is the unit's first exam), gauge R&R thresholds (<10% of tolerance), Cp/Cpk targets (≥1.33 class), calibration intervals.
**Defects (of the QC system itself):** measuring with an uncapable gauge, confusing control and spec limits, over-adjustment (tampering), pencil-whipped inspections, untracked calibration.
**Quality checks:** the unit *is* quality checks — meta-skills: audit a station's QC plan, run a gauge R&R study, review a supplier submission pack.
**Simulations:** **Cpk studio** (given process data, compute capability, decide ship/contain/improve); gauge R&R exercise (3 operators × 10 parts × 2 trials on the virtual instruments — discover that the gauge, not the parts, is the problem); SPC game (live drifting process: intervene too early = tampering penalty, too late = scrap run); supplier-gate review (approve/reject a PPAP pack with one buried nonconformity).
**Animations:** measurement-uncertainty visual (the same part measured 30 times — the distribution IS the gauge); control-chart pattern gallery (trends, shifts, cycles) animated forming.
**Learning objectives:** L1 — quality is a system, not an inspector; L2 — use gauges credibly (R&R), read control charts; L3 — capability statistics, sampling theory, the economics of prevention vs. detection vs. failure (the 1-10-100 rule); designs the QC plan for one Tier-J part as the unit capstone.

### UNIT 14 — End-of-Line Testing
**Inputs → Outputs:** assembled engines (U11) and motorcycles (U12) → validated, signed-off products; reject loop with diagnosis. *The factory's Station 17.*
**Machinery:** engine cold-test stands (motored, no combustion: torque-to-turn, oil pressure, compression signature, noise spectra) and hot-test cells (fired run-in ⚠ Ducati's protocol), vehicle roller dyno booths, brake/ABS test rigs, **ADAS radar calibration bays** (target boards — links F13/G13), water-intrusion booth, audit teardown bench (periodic full disassembly of a sampled engine — the factory checking itself).
**Parameters:** cold-test signature limits (torque ripple, pressure rise time), hot-test run schedule, dyno pass curves (the verified Granturismo reference — same curves as SIM-001 Station 17), brake force thresholds, radar aim tolerance ⚠, leak/noise limits.
**Defects (caught here):** every latent class from the SIM-001 Station-17 table at industrial scale: leaks, noise signatures (chain slap, gear whine — U9's chickens roosting), pressure anomalies, misfire/intermittents, configuration errors, ADAS aim failures.
**Quality checks:** the unit is the check; meta-level: signature-limit maintenance (when does a drifting fleet of cold-test curves mean the *process* upstream moved? — closing the loop to U13 SPC).
**Simulations:** **EOL operator role-play — the academy's capstone simulation**: live cold-test traces stream in; learner dispositions pass/fail/diagnose on each (the trained ear/eye from L5 audio and SIM-001 debrief is the prerequisite — full-stack payoff); reject-diagnosis campaign (a failed engine arrives at your bench: find which upstream unit's defect caused it — the entire academy as a diagnostic search space); audit-teardown exercise (measure a sampled engine's wear-in signatures, compare to limits).
**Animations:** cold-test stand cycle with live signature traces; roller-dyno run with the reference-curve overlay; radar calibration bay alignment sequence; the full factory flow replay — ore to rolling motorcycle in 90 seconds (the academy's closing cinematic).
**Learning objectives:** L1 — nothing ships untested; L2 — read EOL signatures, perform dispositions; L3 — signature-based quality (test data as process sensor), the audit-teardown philosophy, and the integrated thesis: **manufacturing quality is designed in upstream and only *confirmed* at EOL** — the learner who can trace an EOL reject to a U2 core shift has completed the academy.

---

## 4. Cross-Platform Integration

- **SIM-001 mirror-pairs:** Station 2 Plastigauge ↔ U8 journal grinding · Station 9 seat-band inspection ↔ U10 seat cutting · Station 6 gear feel ↔ U9 analyzer charts · Station 17 symptoms ↔ U14 EOL signatures. Each pair is a linked "two sides of one truth" jump (deep links both directions).
- **Module M feed:** every Tier-J journey ends with a make-vs-buy / process-selection reflection that deposits into the M-module trade-study bank.
- **Defect Detective shares its image-gallery infrastructure with Module L** (diagnostics) — one media pipeline, two academies.
- **xAPI/scoring** per LXD-001 §5; unit gates per §2.3 above.

## 5. Production Inventory Summary

- **Environments:** 8 factory halls + metrology lab + EOL field (the largest environment build after the workshop; schematic-mode variants mandatory)
- **Machine assets:** ~35 machine models (Tier-B exterior + schematic internals per BOM sealed-unit policy; 8 hero machines in Tier-A with CUT-Y: die-cast cell, forge press, 5-axis cell, carburizing furnace, crank grinder, gear hobber, seat-and-guide cutter, cold-test stand)
- **Process models (physics-lite):** 9 parameter sandboxes (fill/solidify, forge, speeds-feeds, quench, peen, DLC, grind-burn, press-fit, distortion-budget)
- **Defect media galleries:** ~120 graded items across 8 defect families ⚠ sourcing (licensed imagery or synthesized renders)
- **Animations:** ~40 process animations including the 5 signature pieces (grain-flow morph, austenite→martensite, hobbing generation, orbital crank grind, ore-to-motorcycle cinematic)
- **⚠ register additions:** supplier identities, plant layout/protocols, exact alloy/fit/angle specs, hot-test protocol, radar aim tolerance — all to `docs/data/` tracker; units ship with "representative process" labeling where plant data is unlicensed

---

*DTEA-MFG-001 v1.0 — general manufacturing science stated plainly; Ducati-specific facts marked ⚠ and tracked in `docs/data/`. Units ship with "representative process" labeling wherever plant data is unverified.*
