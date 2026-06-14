# Data — Verified Data Baseline

**Placeholder — no documents yet. This folder becomes critical at Phase 0.**

## Scope (planned)

The documentation home of the Verified Data Baseline defined in [ARCH-001 §2](../architecture/DTEA-ARCH-001-platform-architecture-v2.0.md):

- **Source registry** — catalog of official documents (workshop manual editions, parts catalogs, technical bulletins) with edition/revision identification (mirrors the `spec_sources` table, ARCH-001 §8)
- **⚠ Verification tracker** — the master list of all values currently marked ⚠ VERIFY across ARCH-001, BOM-001, and LXD-001, with verification status, verifier, and date
- **Verification procedure** — the fact-gate process: who verifies, against what, sign-off rules

## Why this exists

The V1 expert-panel review (ARCH-001 Part I) found the original architecture was built on incorrect engine data. The platform's core promise is verified accuracy; this folder is where that promise is operationally tracked. **No content ships against an unresolved ⚠ item** (BOM-001 §6 rule 6; LXD-001 §5 truth discipline).

## Known ⚠ items to seed the tracker (from existing documents)

Sump architecture (wet vs. semi-dry) · clutch plate counts and ratios · valve spring configuration (single/dual) · valve clearance procedure detail · suspension travel figures · wheel construction per trim · fuel tank capacity · dash size · engine mass · rear brake spec · per-model-year electronics matrix · ADAS calibration procedure · frame welding process specifics · variable-intake presence

First expected document: DTEA-DATA-001 — Source registry and verification procedure (Phase 0, blocking gate for content production).
