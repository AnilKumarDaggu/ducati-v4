# DTEA-AST-001 — Asset Acquisition Strategy
**Version:** 1.0 | **Date:** 2026-06-11 | **Status:** Approved
**Parent documents:** DTEA-ARCH-001 (§6 asset requirements, §9 roadmap, §10 risks), DTEA-BOM-001 (system hierarchy, modeling tiers, part counts), DTEA-SIM-001/MFG-001 (environment & machine asset demands)

---

## 1. Purpose & Terminology

This document defines how every 3D asset in the platform will be acquired — sourced, scanned, licensed, or custom-built — with per-system effort estimates, technical budgets, risk ranking, and a phased roadmap.

**Terminology reconciliation (read first).** The brief's five-level classification (LOD0 Overview → LOD4 Manufacturing-grade) describes *asset fidelity/purpose*, while ARCH-001/BOM-001 already use LOD0–LOD4 for *runtime distance-based render levels*. To prevent a documentation collision, this strategy adopts the brief's classes as **Asset Detail Levels (ADL 0–4)**. Each ADL prescribes which render-LODs must be authored:

| ADL | Name (per brief) | Definition | Render-LODs authored | Interior? | CUT-Y? |
|---|---|---|---|---|---|
| ADL0 | Overview | Recognizable silhouette/placement only (background, far context) | LOD3–4 only | No | No |
| ADL1 | External viewing | Photoreal exterior, correct proportions, PBR materials | LOD1–4 | No | No |
| ADL2 | Exploded assemblies | ADL1 + every separable part as a discrete named mesh with hidden faces finished (parts look right *apart*) | LOD1–4 per part | Split surfaces only | No |
| ADL3 | Internal engineering detail | ADL2 + functional internals (galleries, chambers, mechanisms), capped section geometry, schematic material set | LOD0–4 | Yes | Yes |
| ADL4 | Manufacturing-grade educational | ADL3 + process-true features: casting draft & parting lines, machining witness, tool marks in normals, tolerance-class dimensional fidelity for SIM-M measurement scenes | LOD0–4 + metrology variants | Yes | Yes + wear/defect states |

Mapping to BOM-001 modeling tiers: Tier-A ≈ ADL3–4 (~420 parts) · Tier-B ≈ ADL1–2 (~640) · Tier-C ≈ ADL0–1 instanced (~284 geometries).

---

## 2. Acquisition Channels (ranked by preference per asset class)

| # | Channel | What it yields | Cost class | Legal posture |
|---|---|---|---|---|
| C1 | **OEM CAD license (Ducati)** | Ground-truth geometry | Negotiated (Workstream 0) | Clean if granted — the ideal, not the plan-of-record |
| C2 | **Donor hardware acquisition + scan** — one complete used Multistrada V4 S + one salvage Granturismo engine for instrumented teardown | Photogrammetry exteriors; structured-light scans of every internal part; cam-profile, port and gallery ground truth | ~€18–30k one-time (bike ~€12–18k used, salvage engine ~€4–8k, scanning ~€3–5k) ⚠ market prices | Strong: we own the objects; re-creation for education is defensible — confirm with Workstream-0 counsel (design rights ≠ copyright) |
| C3 | **OEM documentation** — parts catalog exploded diagrams (topology + part counts), workshop manual (dimensions, clearances, sections), press kits (dimensioned photography) | Geometry *reference*, not geometry | Catalog/manual purchase ~€500 | Reference use defensible; never trace artwork 1:1 |
| C4 | **Supplier/standard-part CAD** — bearing manufacturers' CAD portals, fastener parametric libraries (ISO/DIN), chain/sprocket generators, O-ring standards | Direct-use geometry for ~350+ parts | Free | Clean (published for engineering use) |
| C5 | **Supplier component reference** — Brembo/Marzocchi/Bosch published mounting drawings & product imagery | Dimensional scaffolds for supplier modules | Free | Reference use; model from dimensions, not from their CAD |
| C6 | **Public CAD repositories** (GrabCAD, Sketchfab, CGTrader fan models) | *Proportional reference only* | Low | **Prohibited as direct-use assets**: fan models of trademarked products carry chain-of-title risk and are dimensionally unreliable; reference-board use only |
| C7 | **Custom modeling** (in-house lead + contracted studio per ARCH-001 team plan) | Everything the above cannot produce | The main budget | Clean — original work from C2/C3 references |

**Plan of record: C2 + C3 + C4 drive ~90% of the asset base, with C7 as the production channel and C1 as an upside if licensing lands.** The donor-hardware purchase is the single highest-leverage spend in the entire asset budget and should be executed in Phase 0, week 1.

---

## 3. Per-System Acquisition Assessment (13 BOM Systems)

Columns: existing CAD availability · public sources · OEM doc value · custom-modeling need · effort (artist-days, incl. texturing + LOD chain + QA) · required ADL.

| System | Existing CAD | Public sources | OEM docs value | Custom need | Effort (a-d) | ADL |
|---|---|---|---|---|---|---|
| S01 Powertrain | **None usable** — no public Granturismo internals exist | Fan engine models (C6, reference only); teardown videos as visual reference | High: manual sections, clearances; parts catalog topology | **Near-total** — the flagship custom effort; engine teardown scan (C2) is the only geometry ground truth | **700** | ADL4 (internals), ADL3 (cases) |
| S02 Frame & Chassis | None | Press-kit geometry photos | Medium (mount dimensions) | High: monocoque exterior via photogrammetry + internal walls custom | 90 | ADL3 |
| S03 Front Suspension | Marzocchi mounting drawings (C5) | Generic USD-fork models (reference) | Medium | High for cartridge internals (proprietary — C2 teardown of fork) | 110 | ADL3 (cartridge ADL4 for SIM oil-fill) |
| S04 Rear Suspension | As S03 | Generic shock references | Medium | High: Skyhook DSS EVO damper internals proprietary — teardown + schematic-internals fallback | 90 | ADL3 (damper: schematic-mode internals if teardown inconclusive) |
| S05 Brakes | Brembo mounting drawings (C5); caliper fan models (reference) | Good external references | Low | Medium: monobloc exterior from scan; hydraulic galleries custom (ADL3) | 120 | ADL3–4 (caliper, master cyl) |
| S06 Wheels & Tires | Tire dimension standards; rim profiles scannable | Tire manufacturer spec sheets | Low | Low-medium: photogrammetry + revolve/array modeling | 35 | ADL2 |
| S07 Fuel & Intake | Injector/pump generic CAD (C4/C5 partial) | — | Medium | Medium: tank Class-A by scan; airbox/tract custom from C2 | 90 | ADL2–3 |
| S08 Exhaust | None | — | Low | Medium: scanned tube runs + custom cat internals (ADL3 CUT) | 60 | ADL2 (ADL3 cat) |
| S09 Cooling | Generic pump/thermostat references | — | Medium | Medium: custom from C2 teardown | 65 | ADL3 |
| S10 Electrical | Connector families on supplier portals (C4!); Bosch radar imagery (C5) | Connector CAD direct-use | High (wiring diagrams → routing) | High for **harness 3D routing** (bike-specific spline paths — only C2 photogrammetry of the routed loom captures truth); sealed ECUs simple | 280 | ADL2 (harness), ADL1 + schematic internals (ECUs/radar) |
| S11 Final Drive | Chain/sprocket generators (C4 direct-use) | Standards-based | Low | Minimal (parametric + articulation rig) | 25 | ADL2 |
| S12 Bodywork | None usable | Fan models (reference only) | Low | High: Class-A surfacing from photogrammetry + manual retopo — specialist skill | 220 | ADL1–2 |
| S13 Fasteners | **Fully solved by C4** parametric libraries | Free ISO/DIN libraries | Torque tables only | Minimal (import, LOD-chain, instance setup) | 40 | ADL1 instanced (ADL3 for the teaching bolt w/ stretch states) |
| **Environments** (workshop, 8 factory halls, metrology lab, EOL field — per SIM-001/MFG-001) | Generic industrial assets purchasable (CGTrader/TurboSquid commercial-licensed — legitimate here: no trademark issue on generic machines) | Good | n/a | Medium: hero machines (8, CUT-Y per MFG-001) custom; rest kit-bashed from licensed packs | 350 | ADL1 (halls), ADL3 (hero machines) |
| **Manufacturing machinery** (35 machines) | Machine-builder marketing CAD occasionally available; mostly custom from imagery | Trade-show footage, builder brochures | n/a | High for 8 hero machines | 250 | ADL3 (hero), ADL1 (rest) |
| **TOTAL** | | | | | **≈ 2,525 a-d** | |

With QA/rework/pipeline overhead (+15%): **≈ 2,900 artist-days ≈ 6 contracted artists × 19 months + internal lead** — consistent with the ARCH-001 team plan (6-artist studio, 18 months) within tolerance.

---

## 4. Per-System Technical Budgets

Polygon budgets are at render-LOD1 (interaction grade), consistent with ARCH-001 totals (full motorcycle ≤3.0 M tris, engine ≤1.5 M at LOD1). Textures follow ARCH-001 §6 resolutions (KTX2/BC7, 4K max on engine internals); every ADL3+ part also ships the schematic material set (BOM multi-representation rule).

| System | Poly budget (LOD1) | Texture notes | Animation requirements | GLTF/GLB requirements | Three.js optimization |
|---|---|---|---|---|---|
| S01 Powertrain | ≤1.5 M | 4K albedo/normal on machined & cast surfaces; tool-mark + casting-texture normal maps (ADL4); wear/defect state variants for SIM | Full AN-R/T/O/FX set on global crank-angle clock; ~45 SIM-001 wrong-state clips; AN-FL oil path | One master GLB + per-assembly sub-GLBs for simulator streaming; node names = BOM IDs; animation clips keyed to crank-angle parameter, not time | Draco geometry; KTX2; bone-free transform animation; frustum-culled sub-assemblies; LOD chain per part; capped-section meshes as toggleable variants (no runtime CSG) |
| S02 Frame | ≤120 k | 2K; weld-bead normals (ADL3) | Static + stress-visualization shader hooks | Single GLB, section variants | Instanced trellis tubes where repeated |
| S03/S04 Suspension | ≤250 k combined | 2K; CHRM/anodize PBR | AN-T stroke on suspension state param; AN-FL fork oil; Skyhook valve AN-EL | Stroke animation as morph-free transform rig; damper internals sub-GLB | Shared fork-leg mesh mirrored; oil particles GPU-instanced |
| S05 Brakes | ≤180 k | 2K + heat-gradient emission map (thermal overlay) | Pad AN-T, seal-rollback AN-FX, AN-FL bleed bubbles | Caliper exploded hierarchy; line splines as extruded curves | Disc instancing (L/R); bubble particle pool |
| S06 Wheels/Tires | ≤90 k | 2K; tread normal vs. geometry trade (normal-mapped tread at LOD1, geo at LOD0) | AN-R wheel speed param | Rim + tire separate (tire swap variants) | Single wheel geo instanced L/R where shared |
| S07 Fuel/Intake | ≤100 k | 2K | AN-FL fuel & air paths; throttle AN-O | Tank Class-A needs vertex-normal care post-Draco (compression artifacts on smooth surfaces — set quantization carefully) | Airbox interior only loads in C11/SIM contexts |
| S08 Exhaust | ≤70 k | 2K + heat-discoloration gradient | AN-FL pulse visualization (Twin Pulse) | Header runs as swept tubes | Emission-map thermal states |
| S09 Cooling | ≤80 k | 2K | AN-FL coolant, AN-T thermostat wax, AN-R pump | Hose splines deformable (AN-FX squeeze in bleed sim) | Particle pool shared with oil system |
| S10 Electrical | ≤200 k | 1–2K; connector macro detail normals | AN-EL signal pulses along harness splines; radar beam cone | **Harness as spline-based mesh with routing-point metadata** (the F8 simulator consumes the spline, not baked geometry); connectors instanced from C4 library | Spline tube tessellation LOD; pulse shader on UV-scroll, not geometry |
| S11 Final Drive | ≤60 k | 2K | Chain articulation: **instanced link on curve** (never skinned mesh — 120 links instanced along spline) | Link + sprocket GLBs; curve in metadata | The canonical instancing showcase |
| S12 Bodywork | ≤350 k | 4K paint with clearcoat PBR (MeshPhysicalMaterial); decal atlas | Windscreen AN-T; panel explode | Class-A: highest vertex-normal fidelity — minimal Draco quantization on these meshes; separate decal UV set | Clearcoat only on bodywork (shader cost gated); panels frustum-cull aggressively |
| S13 Fasteners | ≤800/bolt LOD0, ≤50 LOD3 | Single 1K atlas for all fasteners | Torque-state visuals (stretch wrong-state on the teaching bolt only) | One fastener-library GLB; instances carry per-placement transform + spec-store key | **InstancedMesh mandatory** (~2,550 placements → ~30 draw calls) |
| Environments | ≤800 k workshop / ≤500 k per factory hall | 2K trim-sheet workflow (not unique unwraps) | Hero-machine cycles (8 machines per MFG-001) | Hall-per-GLB streaming; learner never loads two halls | Light-baked + HDRI per ARCH-001; trim-sheet material merging → <100 draw calls/hall |

**Global GLTF/GLB rules (all systems):** node naming per BOM §0.2 IDs · `userData` per BOM metadata schema incl. `source_citation` · separate photoreal + schematic material slots · explode offsets in external JSON (ARCH-001 format), never baked · KTX2 + Draco with per-class quantization presets · sub-GLB streaming boundaries at BOM Level-3 subsystems.

---

## 5. Highest-Risk Assets (custom engineering modeling, ranked)

| Rank | Asset | Why high-risk | Mitigation |
|---|---|---|---|
| 1 | **Cylinder head ports & combustion chambers** (ADL4; vertical-slice asset!) | Port geometry is performance-proprietary; invisible to photogrammetry; wrong shape = wrong education | Salvage-engine teardown: cut one head, structured-light scan ports/chambers (the decisive argument for C2); fallback: representative port modeling labeled per MFG-001 "representative" rule |
| 2 | **Crankcase internal galleries** (ADL4, CUT-Y, SIM-001 Station 1 borescope) | Drilled-gallery network undocumented publicly | Teardown scan + manual's lubrication diagrams; model galleries as verified-topology, representative-route ⚠ |
| 3 | **Gearbox internals** (drum tracks, fork geometry, dog profiles) | Precision kinematics must actually *work* in the shift animation — geometric errors break the simulation visibly | Teardown scan + kinematic rig validation against shift behavior before texturing |
| 4 | **Skyhook DSS EVO damper internals** | Marzocchi proprietary; teardown may destroy non-replaceable valving | Schematic-mode internals only (sealed-unit policy per BOM §5.4) unless teardown succeeds — pre-approved fallback |
| 5 | **Harness 3D routing** | Truth exists only on a real bike, routed; 140 unique parts; F8 simulator depends on path accuracy | Photogrammetry passes on donor bike *before and during* disassembly (capture routing in situ — schedule constraint on the teardown plan) |
| 6 | **Cam lobes & valve-train kinematics** (ADL4) | Lift profiles drive the C2 lift-curve animation; must be measured, not guessed | Cam-profile measurement on teardown (DTI + degree wheel); profile data → animation curves directly |
| 7 | **Slipper-clutch ramps & DQS mechanism** | Small, proprietary, kinematically load-dependent | Teardown macro-scan; animation validated against C-module behavior description ⚠ |
| 8 | **Monocoque frame internal walls** | Airbox-integrated structure; interior inaccessible to scanning without cutting | Borescope + cut-section of damaged frame if obtainable ⚠; else representative internals |
| 9 | **Class-A bodywork surfaces** | Not an information risk — a *craft* risk (reflective surfaces show every retopo flaw) | Specialist automotive surfacing artist in studio contract (named-skill requirement); scan + manual rebuild, never raw scan mesh |
| 10 | **Counter-rotation idler & primary drive layout** | Architecturally unique to this engine family; no generic reference exists | Teardown documentation priority list, item 1 on case opening |

**Single most important mitigation across ranks 1–8: the salvage-engine instrumented teardown.** It converts eight unknowns into measured facts for ~€10k — also feeding the `docs/data/` verification tracker (sump architecture, clutch plate count, spring configuration get *answered* on the bench ⚠ noting self-measured values still need manual cross-check for official specs).

---

## 6. Acquisition Roadmap (aligned to ARCH-001 §9 phases)

| Phase | Window | Asset milestones |
|---|---|---|
| **0 — Foundation** | M1–3 | Week 1: source donor bike + salvage engine. M1: photogrammetry of complete bike (incl. in-situ harness passes). M2: instrumented engine teardown — scan + measure + photograph every part against the BOM checklist; teardown findings → `docs/data/` tracker. M3: pipeline validation — one part (intake valve) through scan → retopo → texture → KTX2/Draco → render-LOD chain → GLB in-engine; fastener library (C4) imported + instanced; studio contract signed with surfacing-specialist named |
| **1 — Vertical slice** | M4–5 | Front cylinder head complete at ADL4 (~48 parts, Exemplar A) + workshop environment ADL1 + tool set for SIM-001 Stations 9–11. The slice proves the ADL4 unit economics: measure actual artist-days vs. the 700-day S01 estimate and re-baseline |
| **2 — Core platform** | M6–11 | Full motorcycle ADL1–2 (Modules A/B need exteriors + explode before internals): bodywork, frame, wheels, suspension exteriors, brakes exteriors, exhaust, tank. Engine exterior ADL2. Spec library needs no geometry. ~40% of total effort lands here |
| **3 — Engine academy** | M12–17 | Engine internals ADL3–4 complete (the 700-day push): cranktrain, gearbox, clutch, lubrication/cooling circuits + all SIM-001 wrong-state variants + measurement-scene metrology fidelity. Factory: foundry + machining + heat-treat halls with 4 of 8 hero machines (MFG-001 U1–U5 need) |
| **4 — Technician track** | M18–22 | Remaining factory halls + hero machines; EOL field; diagnostics bench assets; harness full ADL2 with routing metadata; ADAS/radar group; wear/defect state libraries (~120 Defect Detective items ⚠ licensed imagery vs. rendered) |
| **5 — Polish & scale** | M23+ | V4 RS desmo head (comparison lab); trim-variant overlays; VR-optimized LOD variants; asset-pack refresh cadence established |

**Budget summary:** donor hardware + scanning ~€25k · contracted studio ≈ 2,900 artist-days ≈ €1.0–1.45 M at €350–500/day blended ⚠ market rates · licensed environment packs ~€15k · documentation/catalog purchases ~€1k. **Total asset acquisition ≈ €1.05–1.5 M over 22 months** — the platform's largest cost line after engineering payroll, consistent with ARCH-001's contracted-studio plan.

**Go/no-go coupling:** the Phase-1 vertical slice re-baselines all estimates; if measured ADL4 unit cost exceeds estimate by >40%, descope path is pre-agreed: S01 internals stay ADL4, everything else caps at ADL3, factory hero machines drop to 4.

---

*DTEA-AST-001 v1.0 — ADL classification supersedes any fidelity reading of render-LOD levels; render-LOD (ARCH-001/BOM-001) remains the runtime distance concept. Cost figures marked ⚠ are market-rate estimates pending quotes.*
