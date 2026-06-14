# Assets

3D, texture, audio, and video asset specifications and sourcing strategy.

## Documents

| ID | Title | Version | Status |
|---|---|---|---|
| [DTEA-AST-001](DTEA-AST-001-asset-acquisition-strategy-v1.0.md) | Asset Acquisition Strategy (channels, ADL classification, per-system budgets, risk ranking, roadmap) | 1.0 | Approved — amended by RDM-001 §2 (donor-**bike** deferred to V1.0) and RDM-002 §2 (week-1 purchase is now one used **cylinder head** ~€500–1,500; salvage **engine** moves to slice-exit); pending AST-001 v1.1 |
| [DTEA-AST-002](DTEA-AST-002-glb-asset-requirements-v1.0.md) | GLB Asset Requirements — the drop-in contract for a real engine model (node/material naming, scale, transforms, clips, content-only swap) | 1.0 | Approved |

## Scope (planned)

Specifications for 3D, texture, audio, and video asset production:

- 3D modeling standards (naming, LOD budgets, metadata schema — currently carried in ARCH-001 §6 referencing the V1 standards)
- Texture and material specifications (photoreal + schematic material sets per component)
- Multi-representation authoring rules (capped cross-section geometry for CUT-Y parts, per BOM-001 §6 rule 3)
- Audio asset specs (diagnostic fault-sound library, ~30 sounds per BOM-001)
- Video/narration production specs

## Source references until documents exist

- Asset requirements and deltas: [ARCH-001 §6](../architecture/DTEA-ARCH-001-platform-architecture-v2.0.md)
- Per-part animation/explode/cutaway codes: [BOM-001 §0.3](../bom/DTEA-BOM-001-hierarchical-bom-v1.0.md)
- Modeling tiers (Tier-A/B/C): [BOM-001 §1](../bom/DTEA-BOM-001-hierarchical-bom-v1.0.md)

Next expected documents:
- DTEA-AST-002 — 3D asset production handbook (Phase 0; consolidates the V1/V2 modeling standards + AST-001 ADL/technical budgets into the standalone reference the contracted modeling studio works from)
- DTEA-AST-003 — Donor-hardware teardown & scanning protocol (the Phase-0 instrumented teardown plan per AST-001 §5–6)
