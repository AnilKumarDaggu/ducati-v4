# DTEA Documentation — Master Index

**Project:** Ducati Multistrada V4 Digital Twin Engineering Academy (DTEA)
**Last updated:** 2026-06-11

This is the system of record for all DTEA planning and specification documents. Start here.

---

## Document Registry

| ID | Title | Version | Status | Location |
|---|---|---|---|---|
| DTEA-ARCH-001 | Platform Architecture (incl. V1 expert-panel review) | 2.0 | Approved | [architecture/](architecture/DTEA-ARCH-001-platform-architecture-v2.0.md) |
| DTEA-BOM-001 | Hierarchical Bill of Materials | 1.0 | Approved | [bom/](bom/DTEA-BOM-001-hierarchical-bom-v1.0.md) |
| DTEA-LXD-001 | Learning Experience Design Specification | 1.0 | Approved | [learning/](learning/DTEA-LXD-001-learning-experience-design-v1.0.md) |
| DTEA-SIM-001 | Engine Build Simulator Design (17 stations) | 1.0 | Approved | [simulation/](simulation/DTEA-SIM-001-engine-build-simulator-v1.0.md) |
| DTEA-MFG-001 | Manufacturing Academy Design (14 units) | 1.0 | Approved | [manufacturing/](manufacturing/DTEA-MFG-001-manufacturing-academy-v1.0.md) |
| DTEA-AST-001 | Asset Acquisition Strategy | 1.0 | Approved | [assets/](assets/DTEA-AST-001-asset-acquisition-strategy-v1.0.md) |
| DTEA-RDM-001 | Product Versioning & Scope Strategy (MVP → V3.0) | 1.0 | Approved | [roadmap/](roadmap/DTEA-RDM-001-product-versioning-v1.0.md) |
| DTEA-ARCH-002 | MVP Technical Implementation Plan ("The Glass Engine") | 1.0 | Approved | [architecture/](architecture/DTEA-ARCH-002-mvp-implementation-plan-v1.0.md) |
| DTEA-RDM-002 | Vertical Slice Definition — "The Valve Slice" | 1.0 | Approved | [roadmap/](roadmap/DTEA-RDM-002-vertical-slice-definition-v1.0.md) |
| DTEA-RDM-003 | Valve Slice Sprint Plan (4 sprints, 10 weeks) | 1.0 | Approved | [roadmap/](roadmap/DTEA-RDM-003-valve-slice-sprint-plan-v1.0.md) |
| DTEA-UXD-001 | Product Experience Specification — "OFFICINA" | 1.0 | Approved | [design/](design/DTEA-UXD-001-experience-specification-v1.0.md) |
| DTEA-PRD-001 | OFFICINA Product Requirements Document (7 phases) | 1.0 | Approved | [product/](product/DTEA-PRD-001-officina-prd-v1.0.md) |
| DTEA-RDM-004 | Sprint 2 Review & Executive Handover | 1.0 | Approved | [roadmap/](roadmap/DTEA-RDM-004-sprint-2-handover-v1.0.md) |
| DTEA-AST-002 | GLB Asset Requirements (drop-in engine-model contract) | 1.0 | Approved | [assets/](assets/DTEA-AST-002-glb-asset-requirements-v1.0.md) |

**Document dependency chain:** ARCH-001 (what to build) → BOM-001 (what to model) → LXD-001 (what learners do with it). Read in that order.

---

## Folder Map

| Folder | Scope | State |
|---|---|---|
| [architecture/](architecture/) | Platform architecture, technical design, system specifications | Active |
| [bom/](bom/) | Bill of materials, part hierarchies, component attribution | Active |
| [learning/](learning/) | Curriculum, competency frameworks, assessment design | Active |
| [manufacturing/](manufacturing/) | Manufacturing process specifications (D-module content) | Active |
| [simulation/](simulation/) | Simulation engine design specifications | Active |
| [roadmap/](roadmap/) | Product versioning and phase planning | Active |
| [data/](data/) | Verified Data Baseline: spec sources, verification tracker | Placeholder |
| [decisions/](decisions/) | Architecture Decision Records (ADRs) | Backlog seeded |
| [design/](design/) | Product experience, UX/UI, visual design system, motion language | Active |
| [product/](product/) | Product requirements and feature specifications | Active |
| [assets/](assets/) | 3D model, texture, audio, and video asset specifications | Active |

---

## Documentation Conventions

### Naming

```
DTEA-<CAT>-<NNN>-<slug>-v<MAJOR.MINOR>.md
```

| CAT | Category | CAT | Category |
|---|---|---|---|
| ARCH | Architecture | RDM | Roadmap |
| BOM | Bill of Materials | DATA | Data verification |
| LXD | Learning design | ADR | Decision record |
| MFG | Manufacturing | AST | Asset specification |
| SIM | Simulation | UXD | Experience design |
| PRD | Product requirements | | |

- `NNN` is a category-scoped sequence number, never reused.
- Filename carries **major.minor** version; minor edits update the version in the document header and filename together only on re-approval. Working edits between approvals do not bump the filename.

### Status lifecycle

`Draft → In Review → Approved → Superseded`

- Every document states its status in the header block.
- Superseded documents move to a `superseded/` subfolder inside their category — **never deleted** (audit trail).
- A new major version supersedes the old one explicitly ("Supersedes: …" in the header).

### Rules

1. **No duplication.** Content lives in exactly one document; everything else links. Category READMEs index and point — they never restate content.
2. **One document, one owner-category.** Cross-cutting topics link across categories rather than copy.
3. **Truth discipline.** Technical specifications follow the Verified Data Baseline (ARCH-001 §2): unverified values carry the ⚠ marker, and nothing user-facing ships against a ⚠ value. The verification tracker lives in [data/](data/).
4. **Update this registry** whenever a document is added, re-versioned, or superseded.
