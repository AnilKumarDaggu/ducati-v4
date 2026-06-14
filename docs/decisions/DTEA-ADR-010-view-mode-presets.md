# DTEA-ADR-010 — View modes are world+representation presets

**Status:** Accepted (2026-06-12) | **Relates to:** UXD-001 §A/§H, ARCH-001 multi-representation, ARCH-002 §3

## Context

ARCH-001 defined multi-representation as material sets (photoreal/schematic/X-ray/thermal). UXD-001 then introduced *worlds* (STUDIO/OFFICINA/TECNICO) and specified that "schematic mode swaps the world to TECNICO" — representation and environment are experientially coupled. Two vocabularies (representations vs. worlds) risked diverging across schemas, UI, and content authoring.

## Decision

One platform vocabulary: a **view mode is a named preset binding a world and a representation**, coordinated by the `ViewModeSystem` (materials + lights + background + environment + shadow treatment change together):

| Preset | World | Representation |
|---|---|---|
| `studio` *(default)* | STUDIO (bianco cove) | photoreal |
| `officina` | OFFICINA (dark workshop) | photoreal |
| `tecnico` | TECNICO (paper drawing-office) | schematic (flat fill + edge line-work) |
| `xray` | STUDIO | ghosted, selection stays solid |

`thermal` joins as a preset when its model ships (V2.0). The `@dtea/data` enums (`viewmode:changed` event, `SceneBookmark.viewMode`) carry the preset names. Content authored before this ADR: none — no migration.

## Consequences

- Lesson scene-bookmarks and tutor `set_view_mode` speak preset names; no separate world API exists or is planned.
- Selection FX are mode-aware (the ViewModeSystem owns them; the viewer delegates).
- Performance guard: TECNICO edge line-work is built lazily and skipped above a mesh/triangle budget — the WebGL2 floor governs.
- Alternative rejected: independent world + representation axes (2 controls, 12 combinations) — more flexible, but UXD-001 names exactly these pairings as the experience, and free combination produces unsupported looks (schematic-in-OFFICINA etc.) we would then have to design.
