# Simulation

Simulation engine and experience design specifications.

## Documents

| ID | Title | Version | Status |
|---|---|---|---|
| [DTEA-SIM-001](DTEA-SIM-001-engine-build-simulator-v1.0.md) | Engine Build Simulator Design (17 stations, E0–E16; includes the Phase-1 vertical-slice scope) | 1.0 | Approved |

## Scope (planned)

Detailed design specifications for the simulation systems defined in ARCH-001 §7:

- Teardown engine (reverse-dependency graph, fastener-tray mapping)
- Torque simulation mechanics and tolerance-zone model
- Virtual instruments framework (multimeter, oscilloscope, gauges, Plastigauge)
- Dyno simulation (physics-lite engine model)
- Diagnostic scenario engine (declarative case format, evidence/cost model)
- Thermal visualization model
- Collaboration sync (CRDT state for paired builds, Module N4)
- Classic-error library implementation (wrong-state geometry and detection rules per BOM-001 §6 rule 5)

## Source references until documents exist

- Simulation requirements: [ARCH-001 §7](../architecture/DTEA-ARCH-001-platform-architecture-v2.0.md)
- Per-part simulation codes (SIM-A/TQ/M/D/SV/FL): [BOM-001 §0.3](../bom/DTEA-BOM-001-hierarchical-bom-v1.0.md)
- Simulator exercise requirements per competency level: [LXD-001 §2](../learning/DTEA-LXD-001-learning-experience-design-v1.0.md)

Next expected documents:
- DTEA-SIM-002 — Teardown campaign (E0) detailed station specs (mirrors SIM-001 in reverse with inspection-on-removal)
- DTEA-SIM-003 — Diagnostic scenario engine design (Module L case format)
- The Phase-1 vertical slice is covered by SIM-001 §6 (Stations 9–11 on the front cylinder head asset).
