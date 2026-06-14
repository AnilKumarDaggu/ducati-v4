# DTEA-SIM-001 — Engine Build Simulator Design Specification
**Version:** 1.0 | **Date:** 2026-06-11 | **Status:** Approved
**Parent documents:** DTEA-ARCH-001 (Module E, §7), DTEA-BOM-001 (S01 hierarchy, exemplars A/B, coding standard), DTEA-LXD-001 (Module E LXD, competency levels)

---

## 1. Purpose & Scope

This document is the complete design specification for the **Engine Build Simulator**: the learner assembles a Ducati V4 Granturismo engine from a bare crankcase to a running, validated engine. It is the platform's flagship simulation — the SIM-TQ, SIM-A, SIM-M, and SIM-FL mechanics defined abstractly in ARCH-001 §7 and assigned per-part in BOM-001 are made concrete here, station by station.

**Truth discipline notice (governs every number in this document):** All torque values, clearances, and fluid specifications below are **engineering-realistic placeholders marked `PL ⚠`** — correct in magnitude class and method, pending replacement by verified values from the official Ducati workshop manual during Phase 0 data verification (ARCH-001 §2). The simulator reads all such values from the spec store at runtime (BOM-001 rule 2); none are hard-coded. The *design* (mechanics, sequences, failure logic, scoring) is final; the *numbers* are placeholders.

**Assembly-order corrections:** The brief's step order has been professionally re-sequenced to match horizontally-split-case reality: the **gearbox installs before crankcase closure** (it lives between the case halves), and **valves install into the heads on the bench before the heads go on the engine**. The simulator teaches correct order; the dependency graph below is the design baseline (exact sequence ⚠ verify against the assembly manual).

---

## 2. The Experience

### 2.1 Environment

A photorealistic workshop bay (per ARCH-001 asset requirements): adjustable-height bench with rotating engine stand (360° roll + 90° pitch — the learner *will* need to flip the engine), tool wall (shadow board — missing tools are visible at a glance), parts shelving with labeled trays, consumables cabinet (oils, sealants, threadlockers), measurement station (granite plate, instrument drawer), torque wrench rack (4 ranges), overhead task lighting that follows the active work zone, and a wall-mounted procedure display (visibility depends on difficulty mode).

**Persistent UI elements:** crank-angle indicator (once the crank is in), cleanliness meter for the active part, station progress map, score ticker (decomposed live per LXD-001 §5 scoring transparency), AI tutor coach toggle.

### 2.2 The Three Loops

Every station runs the same loop triad:
1. **Prepare** — clean parts, gather tools, stage consumables, perform pre-checks. Skipping preparation is possible and consequential (contamination, wrong-part installs).
2. **Execute** — the assembly actions: place, orient, fasten, torque, lubricate, seal.
3. **Verify** — inspection points: measurements, rotation checks, visual confirmations. The simulator never auto-confirms success; the learner must *prove* the step is right, exactly as a workshop QC sheet demands.

### 2.3 Difficulty Modes (per ARCH-001 §7, operationalized)

| | Guided | Standard | Expert |
|---|---|---|---|
| Procedure display | Full step-by-step + target highlights | Step list, no highlights | Hidden — recall only |
| Placement | Auto-snap ≤10 mm | Tolerance 2 mm / 2° | Tolerance 0.5 mm / 0.5° |
| Torque display | Target value shown on wrench | Value in procedure only | Learner must cite from memory or open spec library (logged, scored) |
| Wrong part pickup | Blocked with explanation | Allowed, fails at fitment | Allowed, may fit and fail later (latent defects) |
| Hints | Free | −5 pts each | Unavailable |
| Seeded defects | Never | Never | Certification & Level-4 runs only |
| Tutor coaching | Proactive | On-request | Disabled (cert runs) |

**The Expert-mode latent-defect principle:** in Expert mode, certain mistakes (unstaggered ring gaps, missed oil-hole alignment, dry cam lobes) do **not** fail at the step — they fail at First Start (Station 17) with realistic symptoms. This is the simulator's most important teaching mechanic: consequences arrive when they would in life.

---

## 3. Shared Mechanics (referenced by every station)

### 3.1 Torque mechanic (SIM-TQ)
Wrench selection matters: using a 40–200 Nm wrench on a 10 Nm fastener fails the accuracy scoring band (real workshops size wrenches to the job). Click-and-hold ramps applied torque; release at target. Feedback: blue <80% · green 80–105% · click animation + audio at target ±5% · red >110% with bolt-yield consequence (fastener scrapped, replacement fetched, score penalty, and on safety-critical fasteners a logged safety event). **Angle method:** after seating torque, an angle gauge overlay appears; the learner drags through the specified degrees. **Sequence enforcement:** multi-bolt patterns display no numbering in Standard/Expert — the learner must know (or look up) the pattern; out-of-sequence torquing triggers the distortion consequence model (gasket leak / warpage flags that surface at inspection or First Start).

### 3.2 Lubricant & sealant application mechanic
Consumables are *applied*, not assumed. The learner selects the consumable and applies it to a highlighted-on-hover surface; the simulator validates substance + location + quantity:
- **Engine oil (assembly):** bearing shells, piston skirts/rings, cam journals, threads where spec'd. Applied via oil can; surfaces show wet sheen (the visual state IS the record — a dry shell is visibly dry).
- **Moly assembly paste:** cam lobes, follower pads, gudgeon pins. Distinct gray appearance.
- **Threadlocker (medium-strength class, PL ⚠ grade per fastener):** specified fasteners only. Applying threadlocker to a fastener spec'd for oil = process error.
- **Case sealant (anaerobic/RTV class PL ⚠):** the **bead mini-game** — the learner traces the sealing path on the case half with a controlled bead; scoring evaluates continuity (gaps = leak), width (too thick = squeeze-out into oil galleries → a latent defect that fails as blocked oil jet at First Start), and path correctness around bolt holes and oil passages.
- **Silicone grease:** O-rings before installation (dry O-ring = pinch risk roll on insertion).
- **Coolant (spec PL ⚠ ethylene-glycol pre-mix):** fill mechanic with air-bleed (Station 14).

### 3.3 Cleanliness mechanic
Every part carries a contamination state (new-in-box parts are oiled/preserved, not clean). Bench-mounted parts washer + lint-free wipes + compressed air. Installing a contaminated part (e.g., preservative-coated bearing shell, gritty case half) is permitted in Standard/Expert and creates latent defects. Gallery cleanliness: the learner must blow through and visually verify oil galleries in Station 1; skipping is the classic cause of the simulated spun bearing.

### 3.4 Measurement instruments (SIM-M — full instrument set per BOM-001 E15)
Outside micrometers (0–25/25–50/50–75 mm), bore gauge, Plastigauge (the flagship: cut strip → lay on journal → torque cap to spec → remove → compare width to scale card), feeler gauges, DTI + magnetic base (runout, endplay, backlash), valve-spring gauge ⚠, straightedge (deck flatness). Every instrument has a reading-interpolation interaction — the learner reads the scale themselves; the simulator never displays the number for them in Standard/Expert.

### 3.5 Failure & consequence engine
Three failure classes:
- **Immediate (blocking):** wrong part won't fit, cross-thread (wrong-angle start + force), over-torque yield. Visible at once; must be corrected to proceed.
- **Inspection-caught:** out-of-spec measurement, missed verification. Caught if the learner performs the inspection point; silently latent if skipped.
- **Latent (Expert):** surfaces at First Start or dyno with realistic symptomology (see Station 17 fault table). The post-run debrief traces every symptom back to the causal step with a replay clip — closing the learning loop.

### 3.6 Scoring system (global)
Per station, 100 points:

| Component | Weight | Notes |
|---|---|---|
| Torque accuracy & sequence | 30 | Per-fastener band scoring; sequence violations −5 each |
| Process order & method | 25 | Step order, correct tool, correct consumable |
| Fitment & orientation | 15 | Placement accuracy, orientation flags |
| Lubrication & cleanliness | 10 | Dry/contaminated installs penalized |
| Inspection diligence | 10 | Performed + correctly interpreted verification points |
| Time efficiency | 5 | Generous window; penalizes only gross dawdling/rushing |
| Tutor independence | 5 | Full marks at zero hints |

**Critical-fail overrides (station score capped at 40, "REWORK" status):** safety-critical fastener yielded · engine rotation check seized/locked · contamination event on a bearing surface left uncorrected · sealant in an oil gallery. **Campaign score** = weighted station mean; certification thresholds per LXD-001 (≥85/station Level-2 standard; ≥90 overall expert single-attempt Level-3).
All events emit xAPI statements with the decomposed extension fields (ARCH-001 §9.4).

### 3.7 Animation conventions
All animations use BOM-001 codes. The **global crank-angle clock** (BOM rule 4) activates from Station 3 onward — whenever the learner rotates the crank (a recurring verification act), every installed AN-R/AN-T/AN-O part moves in correct phase. Wrong-state animations (yield stretch, circlip pop-out, gasket pinch) come from the classic-error library (BOM rule 5).

---

## 4. The Build Campaign — 17 Stations

Format per station: **Covers** (brief topic) · **Steps** · **Tools** · **Torque (PL ⚠)** · **Consumables** · **Inspection points** · **Failure conditions** · **Classic mistakes (seeded error library)** · **Animations** · **Simulation mechanics**. Scoring follows §3.6 with noted overrides.

---

### STATION 1 — Crankcase Preparation
**Covers:** crankcase preparation. **BOM:** 4.S01.01.01/.02
**Steps:** unpack & inspect both case halves → parts-washer clean → blow through and borescope-verify all oil galleries → chase critical threads → install locating dowels → install piston-cooling oil jets → verify integral cylinder bores ⚠ (bore surface inspection — Nikasil-class coating ⚠, scratch check) → mount upper case to engine stand.
**Tools:** parts washer, compressed air, borescope, thread chasers, dowel drift, plastic mallet, bore light.
**Torque:** oil jet retainers PL 10 Nm ⚠.
**Consumables:** cleaning solvent, light oil mist on bores after inspection.
**Inspection:** gallery continuity (borescope mini-game: navigate to 3 checkpoints), bore surface grading (accept/reject 4 presented bore states), deck flatness with straightedge + feeler.
**Failures:** missed gallery verification (latent: oil starvation), damaged-bore acceptance (latent: compression loss), missing dowel (immediate at Station 6: cases won't align).
**Classic mistakes:** skipping gallery blow-through; installing oil jets backwards (jet aims wrong — latent piston overheat); over-torquing jet retainer (PL yield).
**Animations:** AN-FL gallery-path highlight; borescope camera view; CUT-Y case section showing gallery network.
**Simulation:** SIM-A, SIM-M (flatness), cleanliness mechanic debut, borescope navigation mechanic.

### STATION 2 — Main Bearing Installation & Measurement
**Covers:** bearing installation. **BOM:** Exemplar B, 4.S01.01.03
**Steps:** read crank journal codes + case bore codes → select bearing grade from graded trays (selective fitting) → clean shells (remove preservative) → install with tang-in-notch + oil-hole alignment → oil film application → **Plastigauge clearance verification** (lay strip, fit cap, torque to spec, measure) → record clearances on the virtual build sheet.
**Tools:** Plastigauge, torque wrench (10–60 Nm), angle gauge, micrometer (journal verification), lint-free wipes.
**Torque:** main cap/case bolts PL stage 1: 20 Nm → stage 2: 45 Nm → stage 3: +90° ⚠, sequence center-out cross-pattern ⚠.
**Consumables:** engine oil (shell faces only — backs stay DRY: oiled backs = classic mistake).
**Inspection:** Plastigauge result vs. clearance spec PL 0.020–0.044 mm ⚠ per journal; tang seating visual.
**Failures:** wrong grade selected (caught by Plastigauge if performed; latent rumble at dyno if skipped), oil hole misaligned (latent: oil starvation — the simulator's signature catastrophic fail), oiled shell back (spun-bearing latent).
**Classic mistakes:** tang/notch mismatch; mixing up upper (grooved/holed) and lower (plain) shells ⚠ configuration; forgetting to remove Plastigauge before final assembly (caught at rotation check — crank binds).
**Animations:** AN-FL oil-wedge formation close-up (the hydrodynamic teaching moment); Plastigauge flattening macro view; wrong-state: tang standing proud.
**Simulation:** **SIM-M flagship station.** Grade-selection logic puzzle + full Plastigauge procedure.

### STATION 3 — Crankshaft Installation
**Covers:** crankshaft installation. **BOM:** 4.S01.02.01/.04
**Steps:** final journal micrometer check → lower crank into upper case → mesh **counter-rotation idler gear with timing marks aligned** (the V4's signature — marks must index; this gear also drives the cam chain ⚠ layout) → verify thrust bearing seating → temporary cap fit → **endplay measurement with DTI** → rotation check (smooth, no binding).
**Tools:** micrometers, DTI + magnetic base, crank-handling fixture, torque wrench + angle gauge.
**Torque:** as Station 2 caps (re-used spec).
**Consumables:** engine oil on journals.
**Inspection:** endplay PL 0.10–0.30 mm ⚠; idler timing mark alignment (zoom verification); rotation torque feel (drag readout PL <X Nm ⚠).
**Failures:** idler mistimed by one tooth (latent: cam timing impossible at Station 12 — the simulator lets you proceed and discover it, then teaches the costly teardown lesson), Plastigauge left in (binds), endplay out of spec (thrust washer ⚠ selection redo).
**Classic mistakes:** ignoring the idler marks ("it's just a gear"); rotating the crank with caps at stage-1 torque only.
**Animations:** AN-R crank + idler counter-rotation demo (the J4/C1 link rendered live); DTI needle physics; global crank-angle clock activates.
**Simulation:** SIM-A, SIM-M (endplay), first rotation-check mechanic.

### STATION 4 — Connecting Rods
**Covers:** connecting rods. **BOM:** Exemplar B rods
**Steps:** match fracture-split caps to rods (witness-mark pairing puzzle — caps are NOT interchangeable) → big-end bearing shells (grade selection as Station 2) → orient rods (front/rear bank orientation marks) → fit to crank pins → **rod bolt torque: stretch/angle method PL 20 Nm + 90° ⚠, new bolts only** → side-clearance feeler check → rotation check.
**Tools:** rod-cap matching jig, feeler gauges, torque wrench, angle gauge.
**Torque:** rod bolts PL 20 Nm + 90° ⚠ — **single-use bolts: re-torquing a used bolt = process error.**
**Consumables:** engine oil (shells, threads, under bolt heads per spec ⚠).
**Inspection:** cap witness marks aligned; side clearance PL 0.10–0.25 mm ⚠; Plastigauge on one pin (audit sample).
**Failures:** swapped caps (immediate: fracture faces don't seat — visible step at the joint + teaching moment on fracture-splitting), reversed rod (latent: oil squirt misdirection ⚠), re-used stretch bolt (latent: bolt failure at dyno — dramatic).
**Classic mistakes:** cap 180° flip; mixing rods between cylinders; skipping the side-clearance check.
**Animations:** fracture-face macro (interlocking crystal surfaces — the D3 manufacturing link); AN-T+AN-O rod motion on crank rotation; bolt-stretch visualization (exaggerated elastic elongation with strain readout).
**Simulation:** SIM-A (matching puzzle), SIM-TQ (angle method debut), SIM-M.

### STATION 5 — Pistons & Rings (Bench Sub-Assembly)
**Covers:** pistons and rings. **BOM:** Exemplar B pistons
**Steps:** **ring end-gap measurement in bore** (place ring square in bore with piston crown, feeler-measure gap PL: top 0.20–0.35 mm ⚠) → install rings on pistons in order (oil rail assembly → 2nd → top; orientation dots UP) → **stagger ring gaps 120°** → verify piston-bore pairing (graded bores ⚠) → fit gudgeon pin (oiled) + new circlips with open-end positioning ⚠ → confirm piston front-arrow orientation per bank.
**Tools:** ring expander (fingers = ring breakage risk), feeler gauges, circlip pliers, piston tray.
**Torque:** none (this station is pure fitment + measurement).
**Consumables:** engine oil (rings, pin), moly paste (pin bore ⚠).
**Inspection:** all 12 ring gaps measured & logged; gap stagger diagram check; circlip fully seated in groove (audible/visual click).
**Failures:** ring installed upside-down (latent: oil consumption — smoking at dyno), gaps aligned (latent: blow-by, low compression at leak-down), snapped ring from hand-spreading (consumable cost + score), loose circlip (latent: catastrophic bore scoring — the simulator's most expensive lesson).
**Classic mistakes:** the four above are the canonical classic-error set (BOM rule 5); plus 2nd/top ring swap (similar profiles — must read markings).
**Animations:** ring cross-section profiles (CUT-Y) with function explainer; AN-FX ring compression; wrong-state circlip pop-out under simulated load.
**Simulation:** SIM-M (gap battery), SIM-A with the most orientation-sensitive parts in the build.

### STATION 6 — Gearbox Installation *(re-sequenced: before case closure — it lives between the halves)*
**Covers:** gearbox. **BOM:** 3.S01.05
**Steps:** assemble shift drum + forks into lower case → lay input & output shaft clusters in mesh → engage fork pins in drum tracks → verify gear engagement sequence by rotating drum through all 6 gears + neutral → shaft endfloat shim check ⚠ → backlash DTI sample check.
**Tools:** DTI, shim gauge set, fork-pin alignment tool ⚠ SST.
**Torque:** detent plunger housing PL 18 Nm ⚠; drum bearing retainer PL 10 Nm + threadlocker ⚠.
**Consumables:** engine oil on all journals/bushes, moly on fork pads, threadlocker (retainer only).
**Inspection:** full 6-speed sweep with visual dog engagement check at each position; neutral find; fork-wear visual on pads.
**Failures:** fork in wrong drum track (immediate: two gears at once — locked drivetrain at rotation check), missed shim (latent: gear whine + jump-out at dyno), threadlocker omitted on retainer (latent: retainer backs out — debris event).
**Classic mistakes:** drum track confusion (tracks look similar); shaft cluster swap front/back; rotating drum with force when dogs clash (should rotate shafts to align).
**Animations:** AN-R/AN-T full shift choreography (drum rotation → fork translation → dog engagement) — one of the platform's most instructive animations; CUT-Y mesh view.
**Simulation:** SIM-A (the most spatially complex placement task in the build), sequencing logic, SIM-M (backlash).

### STATION 7 — Crankcase Closure
**Covers:** (transition step the brief implies between cases). **BOM:** 4.S01.01
**Steps:** final cavity FOD check (the simulator inventories: any tool/part left inside = fail) → **sealant bead mini-game** on case joint (§3.2) → lower case onto dowels → perimeter bolt pattern torque in spiral sequence PL: M8 25 Nm, M6 10 Nm ⚠ → rotation check + gear sweep re-verify → wipe squeeze-out.
**Tools:** sealant applicator, torque wrenches (both ranges), FOD mirror.
**Torque:** as above; main studs already final from Station 2/3.
**Consumables:** case sealant (anaerobic class PL ⚠) — bead continuity scored.
**Inspection:** rotation drag re-measure (compare to Station 3 baseline — increased drag = something wrong inside), all 6 gears re-sweep, sealant squeeze-out uniformity.
**Failures:** FOD left inside (critical fail — rework: case split, huge time cost: the lesson), bead gap (latent: oil weep at dyno), bead overflow into gallery (latent: oil-jet blockage → piston seizure at dyno — the worst-case chain).
**Classic mistakes:** sealant on the wrong half's surface; bolting before dowel seating (case hangs proud — torque feels wrong); skipping the rotation re-check.
**Animations:** bead application close-up with width gauge overlay; squeeze-out behavior; case-mating choreography.
**Simulation:** the bead mini-game (precision-path mechanic), SIM-TQ spiral sequence, FOD-check mechanic debut.

### STATION 8 — Pistons Into Bores & Bore Closure ⚠
**Covers:** cylinder assembly. **BOM:** S01 bores (integral ⚠)
*Design note: with integral bores the piston-installation access path is dictated by the manual (⚠ — through-bore from deck with rod connection at pin, or pre-assembled at Station 4/5; the dependency graph carries both variants until verified). Baseline: pistons enter from the deck with ring compressors; gudgeon pins connect through side access ⚠.*
**Steps:** oil bores → fit ring compressor → guide piston in (alignment-angle mechanic: misalignment >2° = ring catch) → tap-in with hammer handle (force-feedback: resistance spike = STOP, ring caught) → connect to rod (per verified path ⚠) → repeat ×4 → rotation check with all four reciprocating.
**Tools:** ring compressors (correct diameter), hammer handle, bore oiler.
**Torque:** per pin/rod variant ⚠.
**Consumables:** generous engine oil (bores, skirts).
**Inspection:** each piston at TDC/BDC smoothly; deck-height sample check with DTI PL ⚠.
**Failures:** ring snap on forced entry (immediate: audible crack + compression latent if ignored — but the simulator makes the learner *diagnose* which cylinder later via leak-down: superb teaching), piston bank swap (front/rear arrows).
**Classic mistakes:** forcing past the resistance spike (the #1 real-world ring killer); dry bore install.
**Animations:** ring-compressor mechanics CUT-Y; the resistance-spike haptic-visual moment; AN-T all four pistons phased per Twin Pulse on rotation.
**Simulation:** SIM-A with force-feedback judgment (the "feel" mechanic — proceeding vs. stopping on resistance is scored).

### STATION 9 — Cylinder Head Sub-Assembly: Valves & Springs *(bench — before head installation)*
**Covers:** valves. **BOM:** Exemplar A (the vertical-slice asset)
**Steps:** per head: clean head, inspect seats & guides → lap sample valve (paste figure-8 mechanic, check seat band contact pattern) → install stem seals (push-click) → drop valves (oiled stems) → fit springs + seats + retainers → **spring-compressor + collet installation** (the fiddliest mechanic in the simulator: compress, place both collets, release slowly, verify seating) → tap stems to confirm collet lock → repeat ×8 per head ×2 heads.
**Tools:** valve spring compressor, lapping stick + paste, magnet pick-up (collets), bore light.
**Torque:** none.
**Consumables:** lapping paste (then full clean-off — residue = abrasive contamination latent), engine oil (stems), silicone grease optional on seals ⚠.
**Inspection:** seat contact band (gray ring continuity + width PL 1.0–1.5 mm ⚠), seal seated square, collet lock check per valve, post-assembly: solvent-in-port leak test (pour, watch for seepage past seats).
**Failures:** lapping-paste residue left (latent: accelerated wear flag), collet not seated (latent: **dropped valve at dyno — the engine-destroyer**; Expert mode lets it happen), seal pushed in cocked (latent: smoking).
**Classic mistakes:** collet mis-seat (THE classic per BOM Exemplar A); spring upside down where progressive-wound ⚠; mixing intake/exhaust valves (different head diameters — won't seat right).
**Animations:** collet-lock CUT-Y macro (why valves don't fall in — C2 link); AN-FX spring compression; lap-pattern development; wrong-state: collet skip + valve drop consequence replay.
**Simulation:** SIM-A precision mechanic (compressor control), SIM-M (seat band grading), leak-test SIM-FL.

### STATION 10 — Cylinder Head Installation
**Covers:** cylinder heads. **BOM:** 4.S01.03.01/.02
**Steps:** verify deck & head surfaces clean/flat → place new MLS head gaskets (orientation: "TOP/FRONT" marks — gaskets are bank-specific ⚠) → seat heads on dowels → **head bolt 3-stage torque PL 20 Nm → 40 Nm → +90° ⚠ in spiral-out sequence ⚠, threads oiled per spec ⚠** → rear head: restricted-access teaching moment (the rear bank's notorious reach — tool clearance mechanic) → repeat for both banks.
**Tools:** torque wrench + angle gauge, gasket inspection light, extension/swivel set (rear bank).
**Torque:** as above; new bolts per reuse policy ⚠.
**Consumables:** engine oil (bolt threads + under-head ⚠) — NO sealant on MLS gaskets (applying any = process error: a deliberately seeded misconception).
**Inspection:** gasket orientation confirmed before head drops (point of no return warning), post-torque: sequence completeness audit on the virtual build sheet.
**Failures:** gasket flipped (latent: coolant-oil mixing at dyno — milky oil symptom), sequence violation (latent: head-gasket weep), stage skipped (latent: same).
**Classic mistakes:** sealant on MLS gasket; old bolts re-used; rear-bank bolts under-torqued due to awkward access (the access mechanic makes this *physically* harder, as in life).
**Animations:** MLS layer function CUT-Y; clamping-force distribution heat-map during sequence (why the spiral matters — rendered live); torque-angle bolt-stretch readout.
**Simulation:** **SIM-TQ flagship station** (per BOM Exemplar A); access-constraint mechanic debut.

### STATION 11 — Camshafts & Followers
**Covers:** camshafts. **BOM:** Exemplar A cams/followers
**Steps:** fit finger followers / tappets ⚠ with moly on pads → lay camshafts in journals (intake/exhaust identification per bank — 8 cams look-alike hazard ⚠ 4 cams) → **cam cap placement: position-matched caps, numbered, arrow-forward** → cap torque PL 10 Nm ⚠ in alternating sequence → journal oil-clearance Plastigauge sample → DO NOT rotate yet (chain not timed — rotating now risks valve-piston contact: the simulator warns once, then lets Expert learners make the mistake).
**Tools:** torque wrench (2–25 Nm), Plastigauge, moly applicator.
**Torque:** cam caps PL 10 Nm ⚠ — **the over-torque trap: M6 caps yield easily; this station teaches small-fastener respect.**
**Consumables:** moly paste (lobes, follower pads), engine oil (journals).
**Inspection:** cap number/arrow audit (every cap), lobe-to-follower contact visual, Plastigauge PL 0.040–0.080 mm ⚠ sample.
**Failures:** caps swapped/reversed (immediate if audit done: line-bore mismatch binds cam — rotation drag check catches it; latent seizure if not), intake/exhaust cam swap (caught at timing — marks won't align), dry lobes (latent: lobe scuffing flag at dyno teardown report).
**Classic mistakes:** cap swap (THE line-boring lesson per BOM Exemplar A); over-torqued M6; premature crank rotation.
**Animations:** AN-R cam at ½ crank speed with live lift-curve trace beside the follower (C2 link); line-boring explainer CUT-Y (why caps are married to the head).
**Simulation:** SIM-A (matched-set logic), SIM-TQ (small-fastener band), SIM-M.

### STATION 12 — Cam Chain & Timing
**Covers:** timing system. **BOM:** 4.S01.03.03
**Steps:** set crank to TDC cylinder 1 (crank-angle UI + locking pin SST ⚠) → feed cam chains over crank drive ⚠ layout → align cam sprocket timing marks to head datum marks (per-bank) → fit chain guides → install tensioners (released per procedure ⚠) → remove lock, **rotate two full crank revolutions by hand** → re-verify all marks return to index → valve clearance audit sample (feeler PL: intake 0.10–0.15 / exhaust 0.15–0.20 mm ⚠, shim-swap loop if out).
**Tools:** crank locking pin ⚠ SST, timing light marks overlay, feeler gauges, shim micrometer + graded shim tray, tensioner reset tool ⚠.
**Torque:** cam sprocket bolts PL 24 Nm + threadlocker ⚠; tensioner body PL 12 Nm ⚠.
**Consumables:** threadlocker (sprocket bolts), oil (chain).
**Inspection:** marks at index after 2 revolutions (the canonical timing verification), clearance audit, tensioner extension within range.
**Failures:** one tooth off (the simulator's premier diagnostic teaching fail: runs rough at start, learner must re-check timing — Expert), valve-piston contact on forced rotation with mistimed cams (critical fail: bent-valve consequence, head-off rework), tensioner not released (latent: chain slap audio at start — links L5 audio diagnostics).
**Classic mistakes:** counting teeth instead of using marks; rotating backwards (tensioner side-loading); forgetting the 2-revolution re-verify; idler mistiming from Station 3 surfaces HERE (marks can't align — the deferred lesson lands).
**Animations:** full AN-R timing-train choreography against the crank-angle clock; mark-alignment zoom states; wrong-state valve-piston contact CUT-Y (the nightmare rendered safely).
**Simulation:** SIM-A precision (chain-over-sprocket tooth indexing), the **G3 shim-selection mini-game** embedded, 2-revolution verification ritual.

### STATION 13 — Lubrication System
**Covers:** lubrication system. **BOM:** 3.S01.04
**Steps:** install oil pump (prime with oil before fitting — dry pump = no pickup at start) → pressure relief valve (orientation!) → pickup + strainer → sump with gasket PL sequence ⚠ → oil cooler + lines → filter (oil the seal ring, hand-tight + ¾ turn PL ⚠) → fill PL 4.0 L ⚠ via the SIM-FL fill mechanic → **pre-pressurization: spin pump externally / crank-without-ignition mechanic until pressure gauge registers ⚠ method**.
**Tools:** filter wrench, oil pressure test gauge (SST port ⚠), funnel.
**Torque:** pump bolts PL 10 Nm + threadlocker ⚠; sump M6 PL 10 Nm spiral ⚠; drain plug + new crush washer PL 20 Nm ⚠.
**Consumables:** engine oil (spec class PL 15W-50 ⚠, quantity PL ⚠), new crush washer, filter-seal oil film.
**Inspection:** relief-valve orientation, pressure-gauge reading at pre-crank PL ≥X bar ⚠, no weep at filter/drain after pressurization, oil level window between marks.
**Failures:** dry pump (latent: 8-second oil-starvation window at First Start — bearing damage flag), relief valve backwards (latent: over/under pressure symptom), double-gasketed filter seal (old seal stuck — the classic: massive leak at start), missed crush washer (drip).
**Classic mistakes:** all four above; overfill (breather smoke symptom).
**Animations:** **AN-FL flagship: full oil-path particle flow** from pickup through galleries to jets and cam journals, pressure-coded by color; CUT-Y pump rotors; filter bypass-valve function.
**Simulation:** SIM-FL fill + pressure verification, SIM-TQ, the pre-oiling procedure ritual.

### STATION 14 — Cooling System
**Covers:** cooling system. **BOM:** 3.S09 (engine-side)
**Steps:** water pump with new mechanical seal ⚠ → thermostat (jiggle-pin/bleed orientation UP ⚠) → coolant manifolds + new O-rings (silicone grease) → hoses + clamps (position + orientation per routing diagram) → **fill with pre-mix PL 50/50 ethylene glycol ⚠, bleed sequence: fill slow → squeeze hoses → open bleed screws until bubble-free ⚠ → top up** → **pressure test: hand pump to PL 1.1 bar ⚠, hold 10 min, watch gauge**.
**Tools:** cooling system pressure tester, hose-clamp pliers, bleed key.
**Torque:** pump cover PL 10 Nm ⚠; thermostat housing PL 10 Nm ⚠; drain PL 12 Nm ⚠.
**Consumables:** coolant (spec PL ⚠), silicone grease (O-rings), new O-rings/seals.
**Inspection:** pressure hold (gauge-watching mechanic — a slow needle drop = find the leak: inspection hunt), thermostat orientation, hose clamp positions.
**Failures:** trapped air (latent: localized rear-head hot spot at dyno — links the cylinder-deactivation thermal story), thermostat upside down (latent: overheat), pinched O-ring from dry install (immediate weep at pressure test).
**Classic mistakes:** rushing the bleed; clamp on the hose bulge; reusing a flattened O-ring.
**Animations:** AN-FL coolant-path particles with temperature gradient; thermostat wax-element CUT-Y actuation; bubble behavior during bleed.
**Simulation:** SIM-FL bleed mechanic (bubble physics), pressure-hold test, leak-hunt inspection.

### STATION 15 — Clutch
**Covers:** clutch. **BOM:** 3.S01.06
**Steps:** primary-driven basket onto input shaft → inner hub with **new tab washer ⚠** → **hub center nut PL 190 Nm ⚠ with holding tool SST ⚠** (the big-torque moment — wrench range lesson) → slipper ramp assembly orientation ⚠ → alternate friction/steel plate stack starting+ending per spec ⚠ (count enforced; plates pre-soaked in oil 10 min — a timed mechanic) → pressure plate + spring bolts PL 10 Nm cross-pattern ⚠ → actuation check (lever-to-lift verification).
**Tools:** clutch holding tool ⚠ SST, torque wrench (40–200 Nm), oil soak tray.
**Torque:** hub nut PL 190 Nm ⚠ (+ tab washer stake); spring bolts PL 10 Nm ⚠ cross-pattern.
**Consumables:** engine oil (plate pre-soak), new tab washer.
**Inspection:** stack height vs. spec ⚠, plate order/count audit, lift uniformity at lever pull (visual gap check around pressure plate).
**Failures:** dry friction plates (latent: glazing/judder symptom at dyno launch), stack order wrong (immediate: stack height off), hub nut under-torqued without stake (latent: nut backs off — major), holding tool skipped + crank used to react torque (process error: loads the gear train).
**Classic mistakes:** first/last plate position wrong (special plate ⚠); spring bolts torqued one-down (warped pressure plate → drag); forgetting the soak.
**Animations:** AN-R basket/hub relative motion; slipper ramp engagement under simulated back-torque (C-module link); plate stack CUT-Y with friction/steel alternation; lever→lift AN-T chain.
**Simulation:** SIM-A (stack logic + count), SIM-TQ (high-torque band + cross-pattern), the soak-timer mechanic.

### STATION 16 — Covers, Ancillaries & Final Assembly
**Covers:** covers and final assembly. **BOM:** 4.S01.01.05, 3.S01.07/.08
**Steps:** alternator rotor (keyed, nut PL 130 Nm ⚠) + stator (cable routing clip path) → starter + sprag → clutch cover, alternator cover, valve covers with new gaskets PL 10 Nm patterns ⚠ → throttle bodies + injectors (O-ring care) → all sensors (crank, cam ×4 ⚠, MAP, temp, knock, lambda bosses) with connector-keying validation → spark plugs PL 12 Nm ⚠ (anti-seize per spec ⚠ — many manuals say NONE: a seeded look-it-up moment) → final walk-around: the **virtual build sheet audit** (every torque, every measurement, every inspection signed).
**Tools:** rotor holding tool ⚠, full wrench set, gap gauge (plugs pre-gapped — verify only ⚠).
**Torque:** as listed PL ⚠; cover patterns spiral.
**Consumables:** new gaskets/O-rings, dielectric grease (connectors ⚠), threadlocker per fastener table ⚠.
**Inspection:** cable/hose routing vs. diagram (chafe-zone check — links F8 discipline), connector click-lock audit, plug torque, build-sheet completeness (incomplete sheet blocks Station 17).
**Failures:** sensor connector half-seated (latent: intermittent at dyno — links L-module intermittent diagnosis), valve-cover gasket pinch (weep), rotor key sheared by impact-gun habit (process error).
**Classic mistakes:** plug anti-seize against spec; routing across a hot zone; leaving the build sheet incomplete (in real factories: no sign-off, no test — the simulator enforces the same).
**Animations:** AN-EL sensor-signal visualization on connector mate; routing-path validation overlay; cover gasket compression CUT-Y.
**Simulation:** SIM-A breadth station (many small placements), routing mechanic, the build-sheet audit ritual.

### STATION 17 — First Start & Validation (E16)
**Covers:** the payoff. **BOM/LXD:** E14 prep + E16
**Steps:** pre-start checklist (oil level/pressure-prime, coolant level, fuel supply rig, battery rig, throttle/kill function) → compression test all 4 PL 12–14 bar ⚠ → **leak-down test** (any Station-5/8/9 ring or valve sins surface here, per-cylinder %) → crank-without-ignition until oil pressure → **FIRST START** → idle observation phase (oil pressure, temperature climb, thermostat opening event, cylinder-deactivation engagement at idle ⚠, listening: the L5 audio library live — learner flags any abnormal sound) → warm-up cycle → **dyno pull with live power/torque/AFR vs. the reference Granturismo curves PL 170 hp/125 Nm ⚠** → post-run debrief.
**Tools:** compression tester, leak-down tester, stethoscope, dyno console.
**Failure surfacing (the latent-defect harvest):** every uncorrected latent defect from Stations 1–16 manifests here with realistic symptomology:

| Latent defect | First-start symptom |
|---|---|
| Dry oil pump / starved gallery | Pressure lag → bearing knock onset (shutdown window mechanic: learner must kill the engine in time) |
| Ring gaps aligned / snapped ring | Low compression cyl-N, leak-down % high at rings (hiss in crankcase breather) |
| Collet mis-seat | Valve drop — catastrophic stop (replay traces to Station 9) |
| One-tooth cam timing | Rough idle, AFR skew, power deficit on dyno |
| Sealant in gallery | Oil-jet blockage → piston temp flag → seizure countdown |
| Air in cooling | Rear-head temp spike at idle |
| Dry clutch plates | Judder on dyno launch |
| Half-seated connector | Intermittent misfire (links Module L) |

**Scoring:** Station 17 is scored on *diagnosis and response*, not just outcomes: correct abnormality identification, correct shutdown decisions, correct causal attribution in the debrief. A perfect build = a clean, glorious dyno pull with the Twin Pulse soundtrack — the emotional reward the whole campaign builds toward.
**Animations:** full running engine, all systems live on the crank-angle clock; AN-FL oil + coolant in operation; thermal field evolution; dyno trace rendering.
**Simulation:** SIM-D debut (instruments on a running engine), the shutdown-judgment mechanic, dyno physics-lite model (ARCH-001 §7).

---

## 5. Campaign Structure, Certification & Tutor Integration

- **Sequential unlock** (Standard): stations unlock in order; each requires ≥85 (LXD-001 Level-2 gate). **Free practice:** any completed station replayable in isolation with state snapshots.
- **Certification runs** (proctored, LXD-001 §5): Level-2 = randomized station subset, standard difficulty; Level-3 = full E0–E16 expert single attempt ≥90; Level-4 = blind build with seeded defective parts (wrong-grade shells, out-of-spec shims in trays — 100% detection required via measurement).
- **Teardown (E0)** runs this campaign in reverse with inspection-on-removal and is a prerequisite for the build (LXD-001 teardown-before-build principle); its station specs mirror these with removal-order logic.
- **AI tutor coaching** (ARCH-001 §5.3): event stream per station (errors, dwell, hint requests); intervention scripts keyed to the classic-mistake library; Socratic mode answers "what torque?" with "where would you find it?" in Standard.
- **xAPI:** every fastener, measurement, and inspection emits statements with decomposed extensions; the build sheet is the human-readable mirror of the xAPI trail.

## 6. Production Inventory Summary

- **New animation assets:** ~45 station-specific (wrong-states included), on top of the BOM AN-coded running-engine set
- **New mechanics to build:** bead-application path tool · borescope navigation · force-feedback resistance judgment · soak/wait timers · gauge-watching (pressure hold) · shutdown-judgment window · build-sheet audit UI
- **Spec-store bindings:** ~140 torque records, ~35 clearance records, ~12 consumable specs — all PL ⚠ pending Phase 0 verification; simulator blocks certification modes on any unresolved ⚠ in its binding set (extends BOM rule 6)
- **Vertical-slice scope (ARCH-001 Phase 1):** Stations 9–11 on the front cylinder head asset — already aligned with the Exemplar A vertical-slice plan

---

*DTEA-SIM-001 v1.0 — design final; all `PL ⚠` values are placeholders pending Phase 0 verification against the official Ducati workshop manual. Certification modes are blocked on unresolved ⚠ bindings.*
