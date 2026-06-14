# DTEA-UXD-001 — Product Experience Specification: "OFFICINA"
**Version:** 1.0 | **Date:** 2026-06-12 | **Status:** Approved
**Parent documents:** ARCH-001/002, LXD-001, SIM-001, MFG-001, RDM-002/003
**Review panel:** Ducati Chief Product Officer · Ducati Digital Experience Director · AAA Game UI Director · Senior Three.js/WebGPU Architect · Siemens Digital Twin Product Architect · Apple HIG Reviewer
**Governs:** every pixel, camera move, and interaction from Sprint 2 onward. The engineering documents say what the platform does; this document says what it *feels like*.

---

# PART I — GAP ANALYSIS

## 1. What the references establish (the bar)

| Reference | What it teaches us |
|---|---|
| **Ducati studio photography** (bikewale set) | The brand's visual truth: parts presented like jewellery on seamless light backgrounds; shallow depth of field; material honesty (brushed triple clamps, Brembo grey-gold, textured nylon, Rosso paint with real clearcoat depth). Ducati never shows a part in a black void — it shows it in a *studio*. |
| **cad.fun (QDD actuator)** | Digital-twin interaction done right: exploded-view as a first-class *parametric control* (axis X/Y/Z/radial, spacing, depth, merge levels), animation with scrub + speed, named animation states ("Drive 4.5:1 reduction"), per-system visibility toggles, a clean instrument-panel right rail. Calm, white, engineering-confident. |
| **Fusion + Adam (text-to-CAD)** | The AI as a *resident colleague inside the tool* — chat docked in the workspace, actions produce visible scene changes with "5 Changes — Undo all / Keep all" accountability. This is exactly our tutor's scene-control pattern, with a change-receipt UX we should adopt. |
| **Apple HIG lens** | Progressive disclosure; one primary action per moment; motion that explains spatial relationships; typography as hierarchy, not decoration. |

## 2. The current implementation, honestly assessed

The Sprint-1 build is a **successful plumbing test and a failed product impression** — which is acceptable only because impression was never its acceptance criterion. The gap inventory, so nothing is hand-waved:

| # | Gap | Severity |
|---|---|---|
| **D-1 (defect)** | Bolt renders **black** on the WebGPU path: no environment illumination (IBL), no tone mapping configured, metallic material with nothing to reflect. A metal=1 surface without an environment map is physically *correct* to render black — the pipeline is missing its lighting foundation, not just polish | Blocking |
| G-1 | **No stage.** The part floats in a void. No studio sweep, no pedestal, no contact shadow, no depth cue. Ducati photographs everything *in a place* | Blocking |
| G-2 | **No camera.** Auto-rotation only — the user cannot orbit, dolly, or frame. A digital twin you cannot move around is a screensaver | Blocking |
| G-3 | **No hover language.** Zero affordance that anything is interactive until clicked | High |
| G-4 | **Engineering-default UI.** System-dark Tailwind panel, raw monospace IDs at equal weight to the part name, no brand voice, no typographic hierarchy. It reads as a debug overlay | High |
| G-5 | **No identity.** Nothing on screen says Ducati, Italy, premium, or academy. The "OFFICINA" of it is absent | High |
| G-6 | **Information without ceremony.** The info panel dumps fields; a museum placard *presents* them. No part hero treatment, no citation badge rendering, no progressive disclosure | High |
| G-7 | **No motion design.** Things appear; nothing *arrives*. No load reveal, no selection response in the 3D scene (the panel changes, the part doesn't acknowledge being chosen) | Medium |
| G-8 | **Silence.** No audio identity (acceptable at S1; specified below for later) | Low |

## 3. Why it feels like a prototype (the panel's seven reasons)

1. **Light is the product and we shipped none.** Premium 3D is 80% lighting. Every reference image is a lighting exercise first.
2. **The camera has no opinion.** AAA cameras *frame* — they arrive at composed shots. Ours spins.
3. **No materiality.** One grey metal. Ducati is a materials company: the experience must fetishize surface the way the brand does.
4. **UI speaks engineer, not curator.** The data is right; the *presentation order* is wrong. Lead with what it is and why it matters; the part number is a footnote, not a headline.
5. **Nothing responds.** Selection changes a sidebar — the world itself doesn't react. Premium feel = the scene acknowledges you.
6. **No narrative spine on screen.** The doc stack has the best engine story in motorcycling (the desmo abandonment); the screen shows a bolt.
7. **No place.** Brand experiences happen *somewhere* — a studio, an atelier, a workshop in Borgo Panigale. A void is nowhere.

**Assumption challenged #1 — "dark mode default."** Reversed. The Ducati reference photography and cad.fun both prove the premium read is a **light studio environment** (Studio Bianco) as default for exploration; dark belongs to the workshop simulator and cinematic moments. Darkness was hiding our lighting debt.
**Assumption challenged #2 — "info card = metadata list."** Replaced with the *Scheda Tecnica* placard model (§ UI Architecture).
**Assumption challenged #3 — "the bolt is fine as first content."** A bolt can prove a pipeline; it cannot carry a first impression. The valve group must become the demo asset the moment Sprint 2 assets land; until then the bolt gets the full staging treatment (it should look like a *photographed* bolt).

---

# PART II — THE TARGET EXPERIENCE

## A. UX Vision — "OFFICINA"

**The concept:** an Italian R&D design studio you've been given a key to. Not a website about a motorcycle — *the room where the motorcycle is understood*. Three spaces, one language:

- **STUDIO** (exploration) — seamless white-grey infinity cove, museum light. Parts presented like the bikewale photography: jewellery on light. This is Module A/B/C territory.
- **OFFICINA** (the workshop — simulation) — warm dark atelier, tool-wall ambience, focused task lighting on the bench. SIM-001's world. The contrast STUDIO→OFFICINA *is* the lesson transition: "you've seen it; now build it."
- **TECNICO** (schematic/analysis) — the drawing-office mode: blueprint-calm surfaces, engineering line-work, measured annotations. The multi-representation modes (ARCH-001) get a *place*, not just a material swap.

**Voice:** confident, precise, warm — the senior Ducati engineer who loves explaining. Italian terms used as craft vocabulary (Scheda Tecnica, Esploso, Officina), never as decoration. English-first copy; Italian as seasoning.

**The one-sentence bar:** *every frame should be screenshotable into a Ducati keynote.*

## B. UI Architecture

**Layout grammar (all screens):**
- **The Stage** — 3D viewport owns the screen; UI never exceeds ~30% of width, and can always be dismissed to 0 (the "pure stage" gesture).
- **Left: Navigator rail** (collapsible) — where am I in the machine (BOM tree as an elegant systems index, not a file tree).
- **Right: Scheda Tecnica** (the placard) — slides in on selection. Structure, in order: *part hero name → one-line function (the curator's sentence) → material chip + ADL chip + verification badge → the story paragraph → specifications (each with its citation mark) → related parts as visual chips → actions (isolate, explode, lesson link, "ask the tutor")*. Part number lives small, at the bottom, monospace — present, never shouting.
- **Bottom center: Mode dock** — view modes (Photoreal / Schematic / X-ray / Thermal-when-it-exists) as the cad.fun-style segmented control; explode slider; cam-angle scrubber when in motion contexts.
- **Tutor: docked colleague** (Adam pattern) — bottom-right chat dock; when the tutor acts on the scene, a **change receipt** appears ("3 scene changes — Revert / Keep"), giving the AI's hands visible accountability.
- **Verification badges everywhere a number appears:** ✓ Verified (subtle) / ⚠ Placeholder (amber, honest, never hidden) — the truth discipline as a *visible brand promise*.

## C. Screen Inventory (slice + MVP horizon)

1. **Ingresso** (landing) — one full-bleed cinematic render, one sentence, one button. Nothing else.
2. **The Reveal** (first-run) — 12-second establishing camera move around the assembly; skippable; ends at the composed hero frame.
3. **Esplora** (Explorer/STUDIO) — the stage + navigator + placard + mode dock.
4. **Lezione** (Lesson) — content rail left (390px max), stage right; scroll drives scene bookmarks; the cam-angle scrubber embedded at the valve-motion block.
5. **Officina** (Build Station) — the dark workshop: bench, tool wall, step rail left, score ribbon top-right, torque HUD contextual.
6. **Debrief** — decomposed score as an elegant instrument panel, replay moments, "rebuild at Standard" CTA.
7. *(MVP+)* **Garage** (hub/home), **Biblioteca** (spec library), **Accademia** (programs/progress).

## D. Navigation Architecture

- **Spatial model:** one continuous 3D world; screens are *camera positions + UI dressings*, never page reloads. STUDIO→OFFICINA is a lighting-and-environment cross-fade with a camera move (1.8s) — the user never loses the object.
- **Deep links** stay first-class (`/esplora/:bomId`) — the tutor, lessons, and spec library all navigate through them.
- **Breadcrumb = machine location** ("Powertrain / Cylinder Head / Valve Group") — clicking any level reframes the camera to that assembly. Navigation *is* camera.
- **Escape hatch rule (Apple):** any mode exits in one action; the user is never more than two actions from the pure stage.

## E. Camera & Interaction Specification (AAA grade)

- **Orbit:** damped inertial orbit (time-constant ~0.18s), pole clamps at ±80°, dolly on wheel/pinch toward cursor point (never FOV zoom), pan on right-drag/two-finger — all tuned so a flick feels like spinning a well-oiled bearing.
- **Framing engine:** every selectable object carries an authored *hero angle* (azimuth/elevation/padding). Double-click or placard-open flies a 1.2s eased move to the hero frame. Esc returns to previous framing (camera history stack, 10 deep).
- **Hover:** 120ms intent delay → part lifts ~1.5% in luminance + fine edge light (not a gamer outline glow — a *rim light*, like the photographer moved a fill card) → label chip after 350ms dwell.
- **Selection acknowledgment in-world:** selected part gets the rim light held + every other part drops 12% exposure — the photographic "subject isolation" from the reference shots, done live.
- **Explode (Esploso):** cad.fun-grade parametric control — slider 0–1, axis presets (assembly axis default), per-level depth; parts travel their *authored mechanical paths* (valves along stems, bolts unthread with rotation) per BOM explode JSON. Spring-loaded return on double-tap.
- **Idle behavior:** after 45s, a slow museum drift (not a spin) + UI fades to 40%; any input restores instantly.
- **Input parity:** every pointer interaction has keyboard and touch equivalents (LXD-001 accessibility commitments hold here).

## F. Visual Design System — "Tavolozza Officina"

**Color tokens:**
- `nero-carbonio` #101014 (OFFICINA base) · `bianco-studio` #F4F4F2 (STUDIO base) · `grigio-alluminio` ramp (UI neutrals)
- `rosso-corsa` #CC0405 — **the accent is sacred**: primary actions, active states, the brand moment. Never decorative, never backgrounds.
- `giallo-segnale` #E8A013 — exclusively for ⚠/PL/caution (truth discipline color)
- `verde-collaudo` #2E9E6B — verified/pass states only
**Typography:** Display = industrial extended grotesque (Ducati-adjacent voice) for screen titles and part hero names; Text = neutral grotesque, 1.5 line-height, max 64ch; Data = tabular mono for numbers, part IDs, torque values. Type scale: 12/14/16/20/28/40/64. Numbers always tabular — values must align like an instrument panel.
**Materials (3D):** the PBR library is a brand asset: Rosso paint (clearcoat 1.0, authored flake normal), brushed aluminium (anisotropy), Brembo grey-gold anodize, textured PA6 black, CHRM stanchion, zinc-plated fastener. Every material validated against the reference photo set side-by-side.
**Iconography:** 1.5px stroke, engineering-drawing dialect (section lines, datum symbols as motifs).

## G. Motion & Animation Guidelines

- **Timing scale:** 120ms (acknowledge) / 240ms (UI move) / 600ms (camera nudge) / 1200ms (camera journey) / 1800ms (world transition). Nothing between values; rhythm is identity.
- **Easing tokens:** `meccanica` (custom bezier, fast-in confident-out — how a well-made drawer closes) for UI; `cinematica` (slow-in slow-out) for camera; springs only for physical UI (sliders, the explode return).
- **The Mechanical Honesty Principle:** in-scene motion only along physically true paths — threads rotate, valves travel their stems, caps lift normal to their faces. No part ever "teleports" or arcs arbitrarily. (The explode JSON already encodes this; motion design enforces it.)
- **Reduced-motion mode:** crossfades replace journeys (LXD-001 commitment), durations halve.
- **Sound (deferred to MLP, specified now):** UI = muted mechanical taps (tool-on-felt); torque click is THE sound asset; OFFICINA room tone at −38dB. Never music in work modes.

## H. 3D Viewer Experience (the STUDIO, fully specified)

The reference is the bikewale photo set rendered live: **infinity cove, three-point soft studio light + HDRI for reflections, ACES tone mapping, contact-shadow plate, subtle floor reflection (≤8%)**. The part sits on an invisible pedestal at a composed height. Depth of field at f/4-equivalent in hero framings, disabled during interaction. Schematic mode swaps the world to TECNICO (paper-grey cove, line-work materials); X-ray keeps the studio but ghosts non-focus parts to 6% opacity with depth-sorted fresnel. **D-1 closes here**: IBL + tone mapping are Sprint-2 *foundation tickets*, not polish — a metal part without an environment is black, and we now know it.

## I. Engine Build Simulator Experience (OFFICINA dressing on SIM-001)

The mechanics are specified (SIM-001); this defines their *feel*: the bench is warm wood-and-steel under a single honest task light; tools live on a shadow board that visibly misses what you're holding; picking up the torque wrench dims the room half a stop and brings the fastener into focus — *the workshop concentrates with you*. The torque HUD is an analog instrument (needle, spec band in rosso, yield zone hatched), not a number readout. The collet moment gets micro-staging: camera moves to macro framing automatically, breath-held quiet, the seat-click rewarded with the platform's signature sound. Score ribbon stays peripheral until debrief — *the work is the interface*. Errors are presented as a craftsman's correction, never a game-over: red is not used for mistakes (rosso is sacred); corrections speak in giallo + the tutor's voice.

## J. Motorcycle Assembly Experience (MVP+; direction now)

Vehicle scale changes the room: OFFICINA widens to a two-post-lift bay; the frame hangs as the spine and the machine *accretes* around it. Each completed phase earns a slow 270° camera pass — the bike visibly becoming itself is the reward loop. Harness routing renders as the one deliberately stylized system (signal-pulse glow in TECNICO palette) because truthful rendering of black-on-black looms teaches nothing — an honest exception to photoreal, documented as such.

## K. Manufacturing Academy Experience (V2.0; direction now)

The factory is shot like a Ducati corporate film: shallow-DOF machine portraits, motion always purposeful. Each MFG-001 unit opens with a 10s *macchina hero* (the press strike, the orbital grind sparks — restraint, one cycle, no loop). Parameter sandboxes are instrument panels in the TECNICO dialect; the Defect Detective is staged as the metrology lab's light table. The ore-to-motorcycle cinematic is the academy's closing keynote piece and is storyboarded, not generated.

---

# PART III — CONSEQUENCES FOR THE SPRINT PLAN

Sprint 2's task list (RDM-003) is *re-prioritized, not expanded* — the same Explorer scope, built to this bar:

1. **Foundation tickets (close D-1):** HDRI environment + ACES tone mapping + the STUDIO cove + contact shadows land *before* any UI work — lighting is the platform.
2. **Camera system** implements §E (damped orbit, framing engine, hero angles authored per part in content JSON).
3. **Brand tokens** (§F) become the Tailwind theme + material library *before* the placard is built; no more default-styled UI ships.
4. **Scheda Tecnica** replaces the info panel per §B ordering; verification badges rendered per the token spec.
5. The bolt receives full staging (it must look photographed) and is retired from hero duty the day the first valve lands.
6. Acceptance criterion added to Sprint 2: **the side-by-side test** — a screenshot of the staged part next to its bikewale-class reference photo, judged by a non-engineer: "same brand?"

*OFFICINA v1.0 — the experience constitution. Engineering documents define correctness; this defines worth. Both gates must pass.*
