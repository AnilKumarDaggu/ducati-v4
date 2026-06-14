# Architecture

Platform architecture, technical design, and system specifications for the DTEA platform.

## Documents

| ID | Title | Version | Status |
|---|---|---|---|
| [DTEA-ARCH-001](DTEA-ARCH-001-platform-architecture-v2.0.md) | Platform Architecture (Part I: V1 expert-panel review · Part II: Architecture v2.0) | 2.0 | Approved — §9 amended by RDM-001: RDM-001 is now the product-scope reference; §9 remains the engineering-workstream reference |
| [DTEA-ARCH-002](DTEA-ARCH-002-mvp-implementation-plan-v1.0.md) | MVP Technical Implementation Plan ("The Glass Engine" — stack, frontend/Three.js architecture, schema, tutor, pipeline, 5-phase build sequence) | 1.0 | Approved |

## Scope

- System architecture (client / service / data layers)
- Technology stack decisions and rendering pipeline
- Module hierarchy (Modules A–N) at the architectural level
- AI tutor service design
- Database and analytics architecture
- Performance targets and risk register

## Implementation notes

- **Routes (Sprint 2):** route naming follows the UXD-001 screen inventory — `/esplora/:bomId?` (implemented), `/lezione/:unitId` and `/officina/:stationId` to follow in Sprint 3 — superseding ARCH-002 §2's English route names. The deep-link URL contract (path = location; `vista`/`ciclo`/`esploso` query params = scene state, applied once on arrival) is documented at its implementation, `apps/web/src/routes/Esplora.tsx`, and serves lesson scene-bookmarks and the tutor's `navigate_to` tool.
- **3D stack (Sprint 2):** [DTEA-ADR-012](../decisions/DTEA-ADR-012-vanilla-three-rendering.md) supersedes ARCH-002 §3's "React Three Fiber" line — the 3D core is framework-agnostic vanilla three.js behind an imperative handle; React owns UI only. Unused R3F/drei/gsap deps removed.

## Expected future documents

- DTEA-ARCH-003 — Collaboration service design (Module N, V3.0)
- DTEA-ARCH-004 — Post-MVP architecture deltas (Rapier physics, RAG pipeline, latent-defect engine — MLP scope)
- Rendering & multi-representation pipeline detail is covered by ARCH-002 §3; a standalone deep-dive is only needed if the vertical slice surfaces gaps.
- Architecture v1.0 is superseded and was not retained as a standalone file; its carried-forward sections are referenced within ARCH-001.
