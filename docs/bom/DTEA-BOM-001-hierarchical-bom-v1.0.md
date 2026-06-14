# Ducati Multistrada V4 — Digital Twin Engineering Academy
## Hierarchical Bill of Materials (BOM) — Engineering Document
**Version:** 1.0 | **Date:** 2026-06-11 | **Parent document:** Architecture v2.0 | **Classification:** Engineering BOM / Digital Twin Content Specification

---

## 0. Document Conventions

### 0.1 Purpose and scope

This document defines the complete hierarchical Bill of Materials for the Ducati Multistrada V4 digital twin, structured for the learning platform defined in Architecture v2.0. It serves three functions:

1. **Engineering BOM** — the part hierarchy from complete motorcycle (Level 1) to individual parts (Level 6)
2. **Content specification** — per-part learning attributes (function, materials, manufacturing, learning objectives)
3. **3D production specification** — per-part animation, explode, cutaway, and simulation requirements

**Depth strategy (read first):** The full per-part attribution of all ~1,850 unique parts lives in the platform's component database (Architecture v2.0 §8, `components` JSONB store) — a document cannot be the system of record for ~17,000 attribute cells. This document is the authoring master: it defines the complete hierarchy to **Level 4 (assemblies) for all 13 systems**, the attribute coding standard, and **fully attributed Level 5–6 expansions for four exemplar assemblies** that establish the authoring template every other assembly follows. Per Architecture v2.0 data governance, all specifications are subject to the Verified Data Baseline; values not yet confirmed against the official Ducati workshop manual / parts catalog are marked ⚠.

### 0.2 BOM identification scheme

```
[LEVEL].[SYSTEM].[SUBSYSTEM].[ASSEMBLY].[COMPONENT].[PART]
Example: 6.S01.02.03.04.07
         │  │   │  │  │   └─ Part #7 (e.g., valve spring seat)
         │  │   │  │  └───── Component #4 (e.g., intake valve group)
         │  │   │  └──────── Assembly #3 (e.g., front cylinder head)
         │  │   └─────────── Subsystem #2 (e.g., valvetrain)
         │  └─────────────── System S01 (Powertrain)
         └────────────────── Hierarchy level
```
BOM IDs map 1:1 to the GLTF node naming convention defined in Architecture v2.0 §6 (carried from V1 §7.1).

### 0.3 Attribute coding standard

**Manufacturing process codes**
| Code | Process | Code | Process |
|---|---|---|---|
| CST-D | High-pressure die casting | MACH-T | CNC turning |
| CST-G | Gravity casting | MACH-5 | 5-axis CNC milling |
| CST-S | Sand casting | GRND | Precision grinding |
| FRG-H | Hot forging | HONE | Honing |
| FRG-C | Cold forging/heading | STMP | Stamping/pressing |
| SINT | Powder metallurgy/sintering | EXT | Extrusion |
| INJ | Plastic injection molding | HYD | Hydroforming |
| COMP | Composite layup | WELD | Welded fabrication |
| ROLL | Thread rolling | DRAW | Wire/tube drawing |

**Post-process codes:** HT-C carburize · HT-I induction harden · HT-QT quench & temper · HT-N nitride · ANOD anodize · NIK Nikasil bore plate · DLC diamond-like carbon · SP shot peen · PHOS phosphate · ECOAT+PNT e-coat + paint · CHRM hard chrome

**Animation requirement codes**
| Code | Meaning |
|---|---|
| AN-R | Rotates in running animation (specify axis + ratio to crank) |
| AN-T | Translates/reciprocates in running animation |
| AN-O | Oscillates (rockers, levers) |
| AN-FL | Participates in fluid-flow visualization (oil/coolant/fuel/air path) |
| AN-FX | Flexes/deforms (springs, seals, chains, hoses) |
| AN-EL | Electrical signal/energization visualization |
| AN-S | Static (no running animation; explode/assembly motion only) |

**Explode / cutaway codes:** EXP-I individually exploded · EXP-G exploded with group · CUT-Y sectionable (requires capped cross-section geometry) · CUT-N not sectioned

**Simulation requirement codes**
| Code | Meaning |
|---|---|
| SIM-A | Assembly/teardown simulator part (placement, orientation validation) |
| SIM-TQ | Torque simulation (carries torque spec + sequence) |
| SIM-M | Measurement lab subject (micrometer/bore gauge/Plastigauge/feeler) |
| SIM-D | Diagnostics target (fault scenarios, virtual instruments) |
| SIM-SV | Maintenance workshop procedure part |
| SIM-FL | Fluid simulation participant |
| SIM-N | Reference/visual only |

**Service life classes:** LOE life-of-engine · LOV life-of-vehicle · INSP inspect at interval · WEAR wear part, replace on condition · CONS consumable, replace at service · SAFE safety-critical replacement interval

---

## 1. Part Count Estimate (Summary First)

Estimation method: assembly-by-assembly count of unique part numbers (a bolt used in 12 places = 1 unique part, 12 pieces), calibrated against typical OEM motorcycle parts-catalog density for a premium ADV machine of this complexity. ⚠ Final counts must be reconciled against the official Ducati parts catalog during Phase 0 data verification.

| Level 2 System | Unique parts | Installed pieces | Modeled geometries* |
|---|---|---|---|
| S01 Powertrain (engine, gearbox, clutch) | ~560 | ~1,150 | ~480 |
| S02 Frame & Chassis | ~55 | ~85 | ~50 |
| S03 Front Suspension & Steering | ~95 | ~160 | ~80 |
| S04 Rear Suspension & Swingarm | ~70 | ~110 | ~60 |
| S05 Braking System | ~115 | ~210 | ~85 |
| S06 Wheels & Tires | ~25 | ~45 | ~20 |
| S07 Fuel & Intake | ~85 | ~130 | ~70 |
| S08 Exhaust | ~45 | ~70 | ~40 |
| S09 Cooling | ~60 | ~95 | ~50 |
| S10 Electrical & Electronics | ~340 | ~520 | ~210 |
| S11 Final Drive | ~15 | ~25 | ~14 |
| S12 Bodywork & Ergonomics | ~140 | ~220 | ~125 |
| S13 Common Fasteners & Hardware pool | ~245 | ~2,550 | ~60 |
| **TOTAL (estimate)** | **≈ 1,850 unique parts** | **≈ 5,370 installed pieces** | **≈ 1,344** |

*Modeled geometries < unique parts because: fastener variants share parametric geometry; left/right mirrored parts share meshes; some parts (harness internals, sealed electronics) are modeled as closed units. Installed pieces ≫ unique parts mainly due to fasteners (~2,550 pieces from ~245 types — GPU-instanced per Architecture v2.0).

**Digital twin modeling tiers** (controls cost):
- Tier-A full interior fidelity (CUT-Y, full simulation): ~420 parts — everything in the four exemplar patterns plus engine internals, brake hydraulics, fork cartridges
- Tier-B exterior-accurate, simulation-interactive: ~640 parts
- Tier-C visual/instanced (fasteners, clips, trim): ~284 geometries

---

## 2. Level 1 — Complete Motorcycle

| BOM ID | Item | Notes |
|---|---|---|
| 1.0 | Ducati Multistrada V4 S (2021–2024 baseline configuration) | Radar-equipped V4 S is the modeled trim; base-model and V4 RS deltas tracked as configuration overlays (Architecture v2.0, Module A trim comparison) |

Level-1 attributes: dry mass ~218 kg ⚠ · L×W×H and wheelbase ⚠ per manual · Learning objective: systems integration — how 13 systems package into one vehicle (Modules A, J) · Animation: full running-vehicle state (wheels, suspension, chain, engine) · EXP: master explode into 13 Level-2 systems · CUT-Y: full-vehicle longitudinal section · SIM: top-level node for Modules E, F.

---

## 3. Level 2 — Major Systems (13)

| BOM ID | System | L3 subsystems | Primary modules |
|---|---|---|---|
| 2.S01 | Powertrain | 8 | C, E, M |
| 2.S02 | Frame & Chassis | 3 | A, B, D10, M4 |
| 2.S03 | Front Suspension & Steering | 4 | J5, F4, G7 |
| 2.S04 | Rear Suspension & Swingarm | 3 | J5, F2 |
| 2.S05 | Braking System | 4 | F6, G5, K |
| 2.S06 | Wheels & Tires | 2 | J2, G8 |
| 2.S07 | Fuel & Intake | 3 | C11, F7 |
| 2.S08 | Exhaust | 2 | C11, F10 |
| 2.S09 | Cooling | 3 | C8, G4 |
| 2.S10 | Electrical & Electronics | 7 | K, L, F8–F9 |
| 2.S11 | Final Drive | 1 | G6, G15 |
| 2.S12 | Bodywork & Ergonomics | 4 | F11, D11 |
| 2.S13 | Common Fasteners & Hardware | 1 (pool) | E, F (torque discipline) |

---

## 4. Levels 3–4 — Complete Subsystem & Assembly Hierarchy

Format: each Level-3 subsystem lists its Level-4 assemblies with `(unique parts / default attribute profile)`. The default profile applies to all parts in the assembly unless the component database overrides it. Learning objectives are stated at subsystem level; part-level objectives follow the exemplar template (§5).

### 2.S01 POWERTRAIN — V4 Granturismo (1,158 cc) + 6-speed gearbox

**Subsystem learning objectives:** four-stroke thermodynamics; spring-valvetrain design (the desmo-abandonment story); counter-rotating crank dynamics; Twin Pulse firing; tribology of every bearing surface; manufacturing of every major process family (Modules C, D, E, M).

- **3.S01.01 Crankcase & Structure**
  - 4.S01.01.01 Upper crankcase half (~14 / CST-D A356, MACH-5; LOE; AN-S; EXP-I; CUT-Y; SIM-A, SIM-TQ, SIM-M)
  - 4.S01.01.02 Lower crankcase half (~12 / same profile)
  - 4.S01.01.03 Main bearing supports & shells (~8 / see Exemplar B)
  - 4.S01.01.04 Sump, baffles & pickup (~10 / ⚠ architecture per manual; SIM-FL oil)
  - 4.S01.01.05 Engine covers — alternator, clutch, timing inspection (~12 / CST-D + gaskets CONS)
- **3.S01.02 Cranktrain** → **EXEMPLAR B, fully expanded in §5.2**
  - 4.S01.02.01 Crankshaft assembly (~12)
  - 4.S01.02.02 Connecting rod assemblies ×4 (~7 unique)
  - 4.S01.02.03 Piston assemblies ×4 (~8 unique)
  - 4.S01.02.04 Crank drive idler (counter-rotation gear) (~4 / FRG-H + GRND; LOE; AN-R)
- **3.S01.03 Cylinder Heads & Valvetrain (front + rear banks)** → **EXEMPLAR A, fully expanded in §5.1**
  - 4.S01.03.01 Front cylinder head assembly (~48 unique)
  - 4.S01.03.02 Rear cylinder head assembly (mirrors front; ~6 additional unique parts)
  - 4.S01.03.03 Camshaft drive — chains, tensioners, guides, sprockets (~16 / AN-R, AN-FX; INSP)
  - 4.S01.03.04 Valve covers & gaskets (~8 / CST-D; gaskets CONS)
- **3.S01.04 Lubrication** ⚠ sump architecture per manual
  - 4.S01.04.01 Oil pump assembly (~10 / SINT rotors, MACH; LOE; AN-R; CUT-Y; SIM-A)
  - 4.S01.04.02 Pressure relief & check valves (~6 / MACH-T; AN-T, AN-FL)
  - 4.S01.04.03 Oil filter, cooler & lines (~12 / filter CONS; AN-FL; SIM-SV, SIM-FL)
  - 4.S01.04.04 Internal galleries & jets (piston cooling jets) (~8 / drilled passages — CUT-Y critical; AN-FL)
- **3.S01.05 Gearbox**
  - 4.S01.05.01 Input shaft & gear cluster (~14 / FRG-H + HT-C + GRND, gears D9 processes; LOE; AN-R; SIM-A)
  - 4.S01.05.02 Output shaft & gear cluster (~14 / same)
  - 4.S01.05.03 Shift mechanism — drum, forks, detent, linkage (~16 / STMP + MACH; AN-R, AN-T; SIM-A)
  - 4.S01.05.04 Quickshifter sensor & linkage (DQS) (~5 / AN-EL; SIM-D)
- **3.S01.06 Clutch (wet multiplate slipper)** ⚠ plate counts
  - 4.S01.06.01 Clutch basket & hub (~8 / CST-D + MACH; AN-R; EXP-I; CUT-Y)
  - 4.S01.06.02 Plate stack — friction + steel (~4 unique, ~16 pieces ⚠ / WEAR; AN-R; SIM-A, SIM-M thickness)
  - 4.S01.06.03 Slipper ramps, springs, pressure plate (~9 / AN-T under load; SIM-A, SIM-TQ)
  - 4.S01.06.04 Hydraulic actuation — master, line, slave (~10 / SIM-FL bleed, SIM-SV)
- **3.S01.07 Engine Management Hardware (on-engine)**
  - 4.S01.07.01 Throttle bodies ×2 + ETV actuators (~14 / INJ + MACH; AN-O butterfly, AN-EL; SIM-D)
  - 4.S01.07.02 Injectors, rails, plugs, coils (~12 / CONS plugs; AN-EL, AN-FL; SIM-D, SIM-SV)
  - 4.S01.07.03 Engine sensors — crank, cam, knock, MAP, temp, lambda ×2 (~9 / AN-EL; SIM-D primary targets)
- **3.S01.08 Starting & Charging (engine-mounted)**
  - 4.S01.08.01 Starter motor & sprag clutch (~8 / AN-R; SIM-D)
  - 4.S01.08.02 Alternator rotor/stator (~6 / AN-R, AN-EL; SIM-D charging tests)

### 2.S02 FRAME & CHASSIS
**Learning objectives:** monocoque philosophy, engine as stressed member, stiffness targets, aluminum casting/welding (Modules M4, D10).
- 3.S02.01 Main monocoque frame (4.: monocoque casting ~3 / CST-G + MACH-5 + WELD ⚠; LOV; CUT-Y; SIM-A engine-mount torque sequence)
- 3.S02.02 Subframes (4.: rear subframe ~6; front fairing bracket ~5 / WELD steel trellis ⚠ + STMP)
- 3.S02.03 Footpeg/control mounts & stands (4.: rider pegs, pillion pegs, side stand, center stand ⚠ option — ~24 / CST-D + STMP; SIM-A)

### 2.S03 FRONT SUSPENSION & STEERING
**Learning objectives:** telescopic fork hydraulics, semi-active damping (Skyhook), steering geometry (Modules J1, J5, G7).
- 3.S03.01 Fork legs ×2 (4.: outer tubes, inner tubes CHRM, electronic damping cartridge ⚠ Marzocchi internals, springs, seals — ~38 / AN-T, AN-FX, AN-FL oil; CUT-Y critical; SIM-A oil-fill procedure, SIM-SV seal service)
- 3.S03.02 Triple clamps & steering stem (4.: upper/lower clamps FRG-H + MACH-5, stem, bearings — ~12 / SIM-TQ preload procedure, SIM-M bearing play)
- 3.S03.03 Handlebar & controls (4.: bar, risers, grips, levers, master cylinders mounts, switchgear housings — ~26 / SIM-A, SIM-SV lever adjustment)
- 3.S03.04 Steering damper ⚠ fitment (4.: ~6)

### 2.S04 REAR SUSPENSION & SWINGARM
- 3.S04.01 Swingarm (4.: single/double-sided ⚠ casting, pivot, chain adjusters — ~14 / CST-G + MACH; CUT-Y; SIM-TQ pivot + axle, SIM-SV chain tension)
- 3.S04.02 Shock absorber — Skyhook DSS EVO (4.: body, spring, electronic damper valve, reservoir — ~18 / AN-T, AN-FX, AN-EL; CUT-Y damper internals; SIM-D Skyhook diagnostics)
- 3.S04.03 Linkage (4.: rocker, pull-rods, bearings — ~12 / FRG; AN-O; SIM-A, SIM-TQ)

### 2.S05 BRAKING SYSTEM → front caliper is **EXEMPLAR C, §5.3**
**Learning objectives:** hydraulic principles, cornering ABS, friction materials, heat management (Modules G5, K, J3).
- 3.S05.01 Front brakes (4.: calipers ×2 Brembo Stylema **Exemplar C**; discs 330 mm ×2 floating; master cylinder + lever; lines — ~52)
- 3.S05.02 Rear brake (4.: caliper, disc, master cylinder, pedal, lines — ~28)
- 3.S05.03 ABS hydraulic unit (4.: modulator block, pump motor, valves (sealed unit — Tier-B model + schematic internals), bracket — ~12 / AN-EL, AN-FL; SIM-D fault scenarios; CUT schematic-mode only)
- 3.S05.04 Wheel speed sensors & rings (~8 / AN-EL; SIM-D primary targets)

### 2.S06 WHEELS & TIRES
- 3.S06.01 Front wheel (4.: 19" cast/spoked ⚠ rim, bearings, seals, axle, spacers, tire, valve, ABS ring — ~13 / CST-D or spoked ⚠; AN-R; SIM-A axle torque, SIM-M bearing inspection)
- 3.S06.02 Rear wheel (4.: 17" rim, cush drive ⚠, sprocket carrier, bearings, axle, tire — ~12 / same profile)

### 2.S07 FUEL & INTAKE
- 3.S07.01 Fuel tank & cap (4.: 22 L ⚠ tank STMP/HYD steel or INJ ⚠, locking cap, breather, mounts — ~12 / SIM-A, SIM-SV removal procedure)
- 3.S07.02 Fuel pump module (4.: in-tank pump, level sender, filter, regulator, flange — ~10 / AN-FL, AN-EL; SIM-D pressure test, SIM-FL)
- 3.S07.03 Airbox & intake tract (4.: airbox INJ, filter CONS, intake ducts, velocity stacks ⚠ variable-length verification — ~16 / AN-FL air path; CUT-Y; SIM-SV filter service)

### 2.S08 EXHAUST
- 3.S08.01 Headers & collectors (4.: 4-into-2-into-1 ⚠ stainless tubes, lambda bosses, springs/clamps — ~22 / DRAW + WELD; AN-FL exhaust pulse visualization (Twin Pulse!); SIM-TQ flange sequence)
- 3.S08.02 Catalyst & silencer (4.: cat substrate, valve ⚠, silencer, heat shields — ~18 / AN-FL; CUT-Y cat internals; learning: Euro 5+ — Module M6)

### 2.S09 COOLING
- 3.S09.01 Radiator & fans (4.: radiator core, twin fans, shrouds — ~12 / braze furnace ⚠ process; AN-FL, AN-EL; SIM-D fan circuit)
- 3.S09.02 Water pump & thermostat (4.: pump (engine-driven), thermostat, housings — ~10 / AN-R, AN-FL, AN-T thermostat wax element; CUT-Y; SIM-A)
- 3.S09.03 Hoses, expansion tank, sensors (~18 / AN-FL, AN-FX; SIM-SV coolant flush, SIM-FL fill/bleed)

### 2.S10 ELECTRICAL & ELECTRONICS
**Learning objectives:** CAN architecture, sensor physics, radar systems, power management (Modules K, L).
- 3.S10.01 Wiring harness system (4.: main harness, engine sub-harness, front/rear sub-harnesses, connectors (~90 unique connector/terminal/seal types), grounds, fuse box — ~140 / AN-EL signal-path visualization, AN-FX routing; SIM-A routing simulator (F8), SIM-D voltage-drop)
- 3.S10.02 ECU & control modules (4.: engine ECU, dashboard, ABS ECU (in S05 unit), suspension ECU, keyless module, radar ECU — ~10 sealed units / Tier-B + schematic internals; SIM-D)
- 3.S10.03 Radar system (4.: front radar, rear radar, brackets, calibration references — ~10 / AN-EL FMCW visualization; SIM-A F13 calibration procedure; Module K4)
- 3.S10.04 IMU & chassis sensors (~6 / AN-EL; Module K2, J6)
- 3.S10.05 Lighting (4.: full-LED headlamp w/ cornering function, tail, indicators — ~22 / INJ + AN-EL; SIM-D)
- 3.S10.06 Battery & power distribution (4.: battery (Li ⚠ or AGM), terminals, relays, fuses, regulator/rectifier — ~24 / SIM-D parasitic-drain test, SIM-SV)
- 3.S10.07 HMI (4.: 6.5" TFT ⚠ dash, switchgear, keyless antenna ring — ~18 / AN-EL; SIM-D)

### 2.S11 FINAL DRIVE
- 3.S11.01 Chain drive (4.: chain (sealed), front sprocket, rear sprocket, guard, slider — ~10 / chain: DRAW + HT + sealed assembly; sprockets: STMP/MACH + HT-I; WEAR; AN-R, AN-FX chain articulation; SIM-SV G6 tension/wear measurement, G15 rivet replacement)

### 2.S12 BODYWORK & ERGONOMICS
- 3.S12.01 Front bodywork (4.: beak, fairing panels, windscreen + adjuster mechanism, mirrors — ~36 / INJ + ECOAT+PNT; windscreen: PC injection; AN-T screen adjustment; SIM-A F11)
- 3.S12.02 Tank & side panels (~22 / INJ + PNT; SIM-A)
- 3.S12.03 Tail & luggage interfaces (4.: tail unit, grab rails, pannier mounts ⚠ — ~28)
- 3.S12.04 Seats & ergonomic adjusters (4.: rider seat (height-adjustable mechanism), pillion seat, heated elements ⚠ — ~16 / AN-T adjuster; SIM-SV)

### 2.S13 COMMON FASTENERS & HARDWARE POOL (~245 unique)
Bolt families M5–M12 (flanged, socket, shoulder; steel 8.8/10.9/12.9, some Ti ⚠) · nuts (flange, nyloc, captive) · washers · circlips · dowels · studs · O-rings (~40 sizes) · oil/coolant seals · hose clamps · cable ties/clips · wellnuts/grommets.
Profile: FRG-C + ROLL + plating; CONS-to-LOV by application; AN-S; EXP-G with parent; **SIM-TQ is the core simulation role** — every structural fastener carries torque spec + sequence + lubrication state + reuse policy from the spec store. GPU-instanced (Architecture v2.0).

---

## 5. Levels 5–6 — Fully Attributed Exemplar Expansions

These four exemplars define the authoring template. Every Level-4 assembly in §4 receives this treatment in the component database during content production.

### 5.1 EXEMPLAR A — Front Cylinder Head Assembly (4.S01.03.01)
*The platform's vertical-slice asset (Architecture v2.0, Phase 1). Spring valvetrain — the engine's defining story.*

**Level 5 components:** head casting group · intake valve group ×2 per cyl · exhaust valve group ×2 per cyl · camshaft group ×2 · finger-follower group ⚠ method per manual · sealing group.

**Level 6 parts (per-part attribution):**

| L6 Part (qty/head) | Function | Material | Mfg | Life | Learning objective | Anim | Exp | Cut | Sim |
|---|---|---|---|---|---|---|---|---|---|
| Head casting (1) | Houses combustion chambers, ports, valvetrain; transfers clamp load to cylinder | A356-T6 ⚠ | CST-G + MACH-5 (chambers, ports, cam bores) | LOE | Port/chamber design; why casting + 5-axis finishing (D2, D4) | AN-FL (port air/coolant paths) | EXP-I | CUT-Y (port + chamber + jacket sections) | SIM-A, SIM-TQ (head bolt 3-stage sequence), SIM-M (deck flatness) |
| Intake valve (4) | Admits charge; seals chamber on seat | Stainless ⚠ (vs. Ti on V4 RS — comparison lab C3) | FRG-H + GRND seat face | INSP @60,000 km | Valve geometry, seat angles, heat path through seat (C2) | AN-T (cam-timed lift curve) | EXP-I | CUT-Y | SIM-A (lapping E5), SIM-M (clearance G3) |
| Exhaust valve (4) | Releases exhaust; survives ~800 °C | Heat-resistant steel, possibly sodium-filled ⚠ | FRG-H + GRND | INSP | Exhaust valve thermal management (C2) | AN-T | EXP-I | CUT-Y (sodium core if applicable ⚠) | SIM-A, SIM-M |
| Valve spring (8) ⚠ single/dual | Closes valve; prevents float to 11,000+ rpm | Cr-Si spring steel | DRAW + coil + HT-QT + SP | INSP | **The desmo trade-off**: spring surge, float threshold, why Ducati now trusts springs (C2, C3, M1) | AN-FX (compression cycle) | EXP-I | CUT-N | SIM-A (compressor tool use), SIM-M (free length) |
| Spring seat + retainer + collets (per valve) | Locate spring; lock to stem | Steel / Ti ⚠ retainer | STMP / MACH-T; collets FRG-C | LOE | Collet lock mechanics — why valves don't fall in (C2) | AN-S | EXP-I | CUT-Y assembly section | SIM-A (collet seating — classic build error) |
| Valve guide (8) | Guides stem; conducts heat to head | Sintered bronze ⚠ | SINT + ream | WEAR | Interference fit, stem-guide tribology (D6, C2) | AN-S | EXP-G | CUT-Y | SIM-M (guide wear) |
| Valve seat ring (8) | Sealing + heat sink interface | SINT hard alloy | SINT + press + cut | WEAR | Powder metallurgy — why sintered seats (D8/SINT) | AN-S | EXP-G | CUT-Y | SIM-M (seat width/recession) |
| Stem seal (8) | Meters oil to guide | FKM | INJ (rubber mold) | CONS | Elastomer function/failure → smoking engine (G11 scenario) | AN-S | EXP-I | CUT-Y | SIM-A |
| Intake camshaft (1) | Times/lifts intake valves | Steel, chilled or HT-I lobes ⚠ | CST/FRG ⚠ + GRND lobes | LOE | Lobe geometry → lift curve; fixed timing (no DVT) as a design choice (C2, M1) | AN-R (½ crank speed) | EXP-I | CUT-Y | SIM-A (timing marks E7), SIM-M (lobe wear, journal clearance via Plastigauge) |
| Exhaust camshaft (1) | Times exhaust events | same | same | LOE | Blowdown timing, overlap (C2, C9) | AN-R | EXP-I | CUT-Y | SIM-A, SIM-M |
| Finger follower / tappet ⚠ (8) | Transfers lobe motion to valve | Steel + **DLC** | STMP/MACH + HT + DLC | INSP | DLC tribology — why coatings enable 60,000 km (D5) | AN-O | EXP-I | CUT-N | SIM-A, SIM-M (clearance shim selection — the G3 mini-game) |
| Adjustment shim set ⚠ | Sets valve clearance | Hardened steel, graded sizes | STMP + GRND + sort | Select-on-measure | Tolerance-class selection logic (E15, G3) | AN-S | EXP-I | CUT-N | **SIM-M core part** |
| Cam bearing caps (set) | Locate cams; position-matched | A356, line-bored with head | CST + MACH (matched) | LOE | Why caps are non-interchangeable — line boring (D4, D6) | AN-S | EXP-I | CUT-N | SIM-A (position/orientation validation — classic error), SIM-TQ |
| Head gasket (1) | Seals combustion, oil, coolant between head and cylinder | MLS steel | STMP multi-layer + coat | CONS | MLS sealing mechanics; why torque sequence matters (E4) | AN-S | EXP-I | CUT-Y layers | SIM-A (orientation), linked to SIM-TQ head sequence |
| Head bolts/studs (set) | Clamp head to cylinder/case | 10.9+ alloy steel | FRG-C + ROLL + HT | Replace per policy ⚠ | Bolt stretch, torque-angle method (E4, S13 theory) | AN-S | EXP-G | CUT-N | **SIM-TQ flagship: 3-stage + angle, sequence enforced** |
| Spark plug well seals, dowels, misc (set) | Locate and seal | various | various | CONS/LOE | Datum and dowel theory (D6) | AN-S | EXP-G | CUT-N | SIM-A |

Assembly totals: ~48 unique parts → ~120 installed pieces per head. Rear head adds ~6 unique parts (rear-access components, cylinder-deactivation-relevant sensor differences ⚠).

### 5.2 EXEMPLAR B — Cranktrain (3.S01.02)

| L6 Part (qty) | Function | Material | Mfg | Life | Learning objective | Anim | Exp | Cut | Sim |
|---|---|---|---|---|---|---|---|---|---|
| Crankshaft (1) | Converts gas pressure to torque; **counter-rotating** | Forged alloy steel | FRG-H + HT-N ⚠ + GRND journals + balance (D12) | LOE | Crank throws → Twin Pulse 0-90-290-380; counter-rotation via idler (C1, J4, M3) | AN-R (reference axis, reverse direction!) | EXP-I | CUT-Y (oil drillings visible) | SIM-A (endplay check E2), SIM-M (journal mic + Plastigauge) |
| Main bearing shells (sets) | Hydrodynamic journal bearings | Steel-backed Al-Sn ⚠, graded | STMP + sinter/bond + bore | WEAR | Hydrodynamic film theory; selective grading (C6, E15) | AN-FL (oil wedge visualization) | EXP-I | CUT-Y | **SIM-M flagship: Plastigauge procedure**, SIM-A orientation (tang + oil hole alignment — classic error) |
| Connecting rod (4) | Links piston to crank | Forged steel ⚠ | FRG-H + fracture-split big end + MACH + SP | LOE | Fracture-splitting — why mating faces are never machined (D3, D12) | AN-T+AN-O (compound motion) | EXP-I | CUT-Y | SIM-A (cap matching, orientation), SIM-TQ (rod bolt stretch/angle ⚠ method) |
| Rod bearing shells (8) | Big-end bearings | as mains | as mains | WEAR | Why rod bearings fail first — load cycle (G11 scenario: knock diagnosis) | AN-FL | EXP-I | CUT-Y | SIM-M |
| Piston (4) | Receives combustion pressure; seals bore | Forged 4032/2618-class Al ⚠ | FRG-H + MACH (skirt cam-ground, valve pockets) | LOE | Piston thermal design, 14.0:1 chamber share, skirt ovality (C5, D3) | AN-T | EXP-I | CUT-Y (ring lands, pin boss, oil gallery ⚠) | SIM-A (orientation arrow, bore matching), SIM-M (skirt mic, bore clearance) |
| Ring set (3 per piston) | Compression sealing + oil control | Nodular iron/steel; top ring PVD/CrN ⚠ | Cast/wound + GRND + coat | WEAR | Ring functions trio; gap staggering (E3 — classic error simulated) | AN-T + AN-FX | EXP-I | CUT-Y profile | SIM-A (gap stagger validation), SIM-M (end-gap feeler measurement) |
| Gudgeon pin + circlips (4+8) | Piston-rod joint | Case-hardened steel; DLC ⚠ | MACH-T + HT-C + GRND/DLC | LOE | Fully-floating pin design (C5) | AN-T | EXP-I | CUT-N | SIM-A (circlip seating — classic error) |
| Counter-rotation idler gear (1) | Reverses crank rotation to rear wheel convention; primary drive | HT-C steel | FRG + D9 gear processes + HT-C + GRND | LOE | The cost of counter-rotation: extra mesh, friction (M3) | AN-R | EXP-I | CUT-N | SIM-A (backlash check SIM-M) |

### 5.3 EXEMPLAR C — Front Brake Caliper Assembly (Brembo Stylema, 4.S05.01)

| L6 Part (qty/caliper) | Function | Material | Mfg | Life | Learning objective | Anim | Exp | Cut | Sim |
|---|---|---|---|---|---|---|---|---|---|
| Caliper body (1, monobloc) | Houses pistons; reacts clamp load | 7075-class Al ⚠ | FRG-H or CST ⚠ + MACH-5 from solid bores + ANOD | LOV | Monobloc vs. 2-piece stiffness; supplier engineering — Brembo as Ducati partner (D14) | AN-S | EXP-I | CUT-Y (bores + fluid galleries) | SIM-A, SIM-TQ (mount bolts) |
| Pistons (4, two diameters ⚠) | Convert pressure to pad force | Al/steel, hard-coated ⚠ | MACH-T + coat | WEAR | Differential bore sizing for even pad wear (G5) | AN-T | EXP-I | CUT-Y | SIM-A, SIM-SV (pad change, piston pushback) |
| Piston seals + dust seals (8) | Seal + retract pistons (rollback) | EPDM | INJ | CONS at rebuild | Seal rollback = pad clearance mechanism (G5 — why brakes don't drag) | AN-FX (rollback animation) | EXP-G | CUT-Y | SIM-SV |
| Brake pads (2) | Friction conversion to heat | Sintered metallic | SINT (D8 family) + bond to backplate | **WEAR/SAFE** | Friction material science; bedding; wear indicators (G5, D5) | AN-T + thermal overlay | EXP-I | CUT-Y (material/backplate) | **SIM-SV flagship: pad replacement procedure**, SIM-M (thickness) |
| Pad pin + retainer + shims | Locate pads; anti-rattle | Steel | MACH/STMP | INSP | Pad hardware function (G5) | AN-S | EXP-I | CUT-N | SIM-SV |
| Bleed valves (2) | Air purge points | Plated steel | MACH-T | LOV | Bleeding theory — why air kills feel (F6) | AN-FL | EXP-G | CUT-Y | **SIM-FL flagship: bleed simulation** |
| Mount bolts (2) | Caliper-to-fork attachment | 10.9 steel | FRG-C + ROLL | SAFE-replace ⚠ | Safety-critical fastener discipline | AN-S | EXP-G | CUT-N | SIM-TQ (spec + threadlocker state) |

Supporting L5 in same assembly: 330 mm floating disc (rotor: stainless ⚠ + carrier: Al, STMP + GRND + float buttons — AN-R + thermal gradient overlay; SIM-M runout/thickness), master cylinder group (radial ⚠; CUT-Y bore; SIM-FL), braided/rubber lines ⚠ (AN-FX, SIM-FL).

### 5.4 EXEMPLAR D — Front Radar / ADAS Group (3.S10.03)
*Establishes the template for sealed electronic units.*

| L6 Part | Function | Material | Mfg | Life | Learning objective | Anim | Exp | Cut | Sim |
|---|---|---|---|---|---|---|---|---|---|
| Radar sensor unit (sealed) | FMCW ranging for ACC | PC housing + PCB internals (schematic-modeled) | INJ + SMT electronics (D-electronics overview) | LOV | FMCW principle, beam pattern, world-first context (K4) | AN-EL (beam cone + chirp visualization) | EXP-I | CUT: schematic mode only (stylized internals) | SIM-D (fault scenarios), **SIM-A: F13 calibration procedure** |
| Mounting bracket + aim adjusters | Position radar within aim tolerance | STMP steel / CST-D ⚠ | STMP | LOV | Why mechanical aim matters for a radar (G13) | AN-S | EXP-I | CUT-N | SIM-A (aim adjustment), SIM-TQ |
| Harness pigtail + connector | Power + CAN to radar ECU | Cu/PVC, sealed connector | DRAW + overmold | LOV | Sealed connector anatomy (K1, L7) | AN-EL | EXP-G | CUT-Y connector section | SIM-D (voltage-drop, CAN check) |

**Sealed-unit policy:** ECUs, ABS modulator, dash, radar are modeled Tier-B externally with **schematic-mode stylized internals** (per Architecture v2.0 multi-representation) — teaching internals without fabricating unverifiable PCB detail.

---

## 6. Cross-Cutting Production Rules

1. **Attribute inheritance.** Parts inherit their Level-4 default profile; the component database stores only overrides. Keeps ~1,850-part attribution tractable.
2. **Every structural fastener** binds to a `torque_specs` record (value, stages, sequence, lubrication, reuse policy) — no torque values live in 3D metadata (single source of truth).
3. **CUT-Y parts** require capped cross-section geometry at authoring time (booleans at runtime are prohibited for performance).
4. **AN-R/AN-T parts** carry timing metadata: phase relative to crank angle, ratio, lift/stroke profile reference — so one global crank-angle clock drives the entire running engine.
5. **Classic-error library.** Parts flagged with known assembly mistakes (bearing tang misalignment, ring-gap stacking, collet mis-seating, cap swapping) get explicit wrong-state geometry/detection in the simulator — these errors are the pedagogy.
6. **⚠ items** block content production until resolved against the workshop manual/parts catalog (Phase 0 Verified Data Baseline gate).

## 7. Estimate Confidence & Reconciliation Plan

- Unique-part total (≈1,850) confidence: ±15%. Largest uncertainty: harness/connector granularity (S10) and fastener pool deduplication (S13).
- Reconciliation: Phase 0 ingest of the official Ducati parts catalog → map catalog part numbers onto this hierarchy → freeze BOM v2.0 with real part numbers and corrected counts. The hierarchy and coding standard above are designed to survive that reconciliation unchanged.

---

*BOM v1.0 — authoring master for the DTEA component database. Parent: Architecture v2.0. All specifications subject to the Verified Data Baseline; ⚠ items unresolved pending official documentation.*
