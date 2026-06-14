# Decisions — Architecture Decision Records (ADRs)

## Accepted

| ADR | Decision | Date |
|---|---|---|
| [DTEA-ADR-010](DTEA-ADR-010-view-mode-presets.md) | View modes are world+representation presets (studio/officina/tecnico/xray) | 2026-06-12 |
| [DTEA-ADR-011](DTEA-ADR-011-crank-clock-transform-ownership.md) | Crank-angle clock drives motion (ratio + clip bindings); one writer per transform channel | 2026-06-12 |
| [DTEA-ADR-012](DTEA-ADR-012-vanilla-three-rendering.md) | Vanilla three.js rendering core (no React Three Fiber); resolves TD-1 | 2026-06-13 |

## Backlog (reserved 001–009)

## Format

One file per decision: `DTEA-ADR-NNN-<slug>.md` with sections: Context · Decision · Alternatives considered · Consequences · Status (Proposed / Accepted / Superseded by ADR-NNN).

## ADR backlog — the nine V2 rulings

The expert-panel review (ARCH-001 Part I §4) made nine architecture rulings that should be formalized as individual ADRs during Phase 0, so their reasoning survives team growth:

| Future ADR | Decision |
|---|---|
| ADR-001 | Verified Data Baseline + human fact-gate (no unverified content ships) |
| ADR-002 | Single rendering engine: Three.js/R3F + Rapier (Unity WebGL removed) |
| ADR-003 | WebGPU with WebGL2 fallback; fallback is the QA floor |
| ADR-004 | Consolidated data layer: PostgreSQL (+JSONB, pgvector, xAPI) + Redis only |
| ADR-005 | Supabase Auth (Auth0 removed) |
| ADR-006 | Month-5 vertical-slice go/no-go gate before team scale-up |
| ADR-007 | Multi-representation rendering as first-class (photoreal/schematic/X-ray/thermal) |
| ADR-008 | Ducati IP licensing as Workstream 0 with de-badged fallback |
| ADR-009 | Depth-tiered module shipping (every module T1 before any T3) |

A tenth candidate from LXD-001: four-level competency framework superseding T1–T3 (LXD-001 §1.1).
