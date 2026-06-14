# content/

Authored content as versioned data (ARCH-002 §7). All files validate against `@dtea/data` schemas — CI enforces this from Sprint 1.

| File | Schema | Sprint | Status |
|---|---|---|---|
| `components.json` | `ComponentCatalog` | S1 draft → S2 complete (~30 records) | 3 seed records (template pattern) |
| `spec_records.json` | `SpecStore` | S1 draft → S3 complete (~10 records) | 3 seed records — **all `placeholder_PL`** |
| `station_9_slice.json` | `StationDef` | S3 | pending |
| `lesson_c2_condensed.json` | `LessonUnit` | S3 | pending |
| `explode_valve_group.json` | `ExplodeDef` | S2 | pending |
| `explode_standin.json` | `ExplodeDef` | S2 interim | translation-only per ADR-011 (the clock owns the bolt's rotation channel); retired with the bolt |
| `tutor_context.md` | (curated knowledge block) | S4 | pending |

**Truth discipline (binding):** every spec value here is `placeholder_PL` until verified against the official workshop manual or head-teardown measurement. The UI badges anything non-`verified`. Teardown findings update `docs/data/` tracker items (valve-spring configuration, follower type) — see DTEA-RDM-002 §7.
