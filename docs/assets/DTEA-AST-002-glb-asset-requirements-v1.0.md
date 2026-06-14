# DTEA-AST-002 — GLB Asset Requirements (drop-in spec for the engine model)

**Version:** 1.0 | **Date:** 2026-06-13 | **Status:** Approved
**Parent:** AST-001 (acquisition strategy), ARCH-002 §8 (pipeline), ADR-010/011/012
**Purpose:** the exact contract a real (scanned, commissioned, or purchased) Ducati engine GLB must satisfy to replace the representative procedural engine **with no code changes** — only `content/` data. Everything here is already enforced or consumed by the existing pipeline and viewer.

## 0. The drop-in promise

The viewer loads whatever the manifest points to and binds behaviour by **node name** and **material name**. Match these conventions and a new GLB works immediately: explode, crank spin, view modes, selection, the Scheda Tecnica, and the spec band all light up with zero TypeScript edits.

## 1. Format & compression

- **Container:** binary glTF 2.0 (`.glb`), single file per assembly.
- **Compression:** Draco (the pipeline applies it; if pre-compressed, the lint/optimize stages still pass it through). KTX2/Basis for textures when textured (AST-001 §4).
- **Run it through the pipeline** (`dtea-assets`): lint → metadata-inject → optimize → manifest. Do not hand-place files; the content-hashed manifest is the loader's source of truth.

## 2. Node naming = component identity (REQUIRED)

- Every selectable mesh node's **name MUST equal a `componentId`** in `content/components.json` and follow the BOM regex `^[A-Z0-9]+(_[A-Z0-9-]+)+$` (e.g. `ENG_S01_CYLINDER-HEAD-FRONT`). The lint stage rejects any mesh node that has no catalog record.
- One node per BOM part. Sub-meshes of a part may be children, but the **metadata-bearing node** is the one named with the `componentId` (selection walks up to it).
- Non-selectable decorative geometry: name with a `_DECOR` suffix and omit from the catalog (lint skips non-mesh and explicitly-decor nodes) — or include it as a child of a real part.

## 3. Material naming = look (REQUIRED for the PBR upgrade)

The viewer upgrades materials to physically-based by **material name** (`packages/three-engine/src/materials.ts`). Use these names so reflections/clearcoat/anisotropy apply automatically:

| Material name | Applied treatment |
|---|---|
| `cast_aluminium` | metalness 0.65, roughness 0.55 — cast surfaces (block, heads, covers) |
| `chrome` | metalness 1.0, roughness 0.08, high env response — headers, polished steel |
| `brushed_aluminium` | metalness 0.9, roughness 0.3, anisotropy 0.7 — machined/brushed faces |
| `rosso_corsa` | clearcoat 1.0 over red — painted covers (the Ducati signal) |

New material classes are a one-line addition to the `switch` in `materials.ts` — extend the table rather than renaming geometry. When real PBR texture maps exist (albedo/roughness/metalness/normal/AO), keep these names and the upgrade will respect the maps (it copies color/metalness/roughness and layers clearcoat/anisotropy).

## 4. Scale, units, orientation (REQUIRED)

- **Units: millimetres.** The full V4 engine should be ~400–500 mm across (the stage, lights, and shadow camera are sized for this).
- **Up axis: +Y.** Front of engine: **+Z** (heads/intake face +Z in the representative model; match real orientation to the BOM convention).
- **Grounding:** the assembly's lowest point near **y = 0** so the contact-shadow plate (at y = −2) reads correctly. The viewer auto-frames the bounding sphere, so absolute centering on X/Z is not required — but center roughly on origin for predictable framing.

## 5. Per-node transforms (REQUIRED for motion — ADR-011)

- **Each part's geometry centered on its own node origin**, with the node `translation` placing it in the assembly. This lets the CrankAngleClock spin a part in place (crank pulley, cams) and the ExplodeController translate it cleanly. Geometry baked at world coordinates with a zero-origin node will orbit instead of spinning and explode from the wrong pivot.
- Rotating parts (crank, pulley, cams, idler) must have their **spin axis through the node origin**.

## 6. Animation clips (OPTIONAL — ADR-011 one-cycle convention)

- If the model ships valvetrain/piston motion as GLTF `AnimationClip`s, **each clip's duration must span exactly one 720° engine cycle.** The viewer maps crank angle → clip time (`mixer.setTime(angle/720 × duration)`); it never plays clips on wall-clock time. Multiple clips share the longest duration as the cycle length.
- Ratio-driven rotations (crank 720°/cycle, cams 360°, counter-rotating idler −720°) are bound in code via `bindCrankRotation(componentId, degPerCycle, axis)` — no clip needed; just name the node.

## 7. Geometry quality targets (AST-001 §4)

- Triangle budgets per part class; the engine assembly target ≤ ~1.5 M tris at interaction LOD. The lint stage enforces a per-asset budget (`default` 50 k/part placeholder; raise per AST-001 for real parts).
- **Weighted-normal bevels / chamfers on all visible edges** — the single biggest realism lever for machined parts (hard 90° edges are the "LEGO" tell the representative model has).
- Cooling fins, bolt heads, ports, fillets where they exist on the real part. Closed manifold meshes; no inverted normals (one rear-cam-cover face in the placeholder shows a winding artifact — avoid).
- For CUT-Y sectionable parts (future): supply capped cross-section geometry as a sibling node `<id>_SECTION` (runtime CSG is prohibited per BOM rule 3).

## 8. Materials → photoreal (when authored)

PBR map sets keyed to the §3 names: albedo / roughness / metalness / normal / AO, plus a clearcoat-roughness map for `rosso_corsa`. A real studio `.hdr` replaces `makeStudioEnvironment()` at one call site for accurate reflections. These are the V3 "Ducati materials" phase of the visual roadmap.

## 9. Content files to update (the ONLY changes needed per new GLB)

1. `content/components.json` — a record per node name (function, material name, ADL, hierarchyPath, descriptionShort, specRefs).
2. `content/explode_*.json` — per-part offsets (parent space, mm) + stagger; assemblyId.
3. `content/spec_records.json` — any new spec values (with `verificationStatus`).
4. Run `dtea-assets engine --components content/components.json` (or a new command cloning it) → writes the GLB + manifest.

No changes to `packages/three-engine`, the routes, or the stores. That is the drop-in contract.

## 10. Acceptance: the swap test

A new GLB is "drop-in correct" when, after only the §9 content edits: every part selects and shows its card; explode and crank run; all four view modes render; the spec band and breadcrumb populate; and `pnpm lint && pnpm typecheck && pnpm build && pnpm --filter @dtea/web e2e` stay green (update the e2e's selected part id if the chosen probe part changes).

---

*AST-002 v1.0 — the representative procedural engine (`engine.ts`) is the reference implementation of this contract; a real model that matches it replaces the placeholder with content edits alone.*
