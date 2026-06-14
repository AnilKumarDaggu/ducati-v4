# DTEA — Ducati Multistrada V4 Digital Twin Engineering Academy

**Current scope: The Valve Slice** (DTEA-RDM-002) — one cylinder head, one valve group, every platform layer. Sprint plan: [docs/roadmap/DTEA-RDM-003](docs/roadmap/DTEA-RDM-003-valve-slice-sprint-plan-v1.0.md). Full documentation index: [docs/README.md](docs/README.md).

## Setup

```
corepack enable          # provides pnpm 9 (pinned in package.json)
pnpm install
cp .env.example apps/tutor-proxy/.env   # add your ANTHROPIC_API_KEY
pnpm dev                 # web on :5173, tutor-proxy on :8787
```

Requires Node ≥ 22. Verify: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

## Structure

```
apps/web              React 19 + Vite + R3F — the product
apps/tutor-proxy      Fastify, stateless — the entire backend (slice scope)
packages/three-engine RendererManager + scene systems (no React)
packages/sim-core     Station state machines + scoring (pure TS, headless) — Sprint 3
packages/data         zod schemas: the shared shape contract
packages/events       Typed event bus + localStorage event log
packages/ui           Shared components — populated Sprint 2
tools/asset-pipeline  GLB lint → metadata inject → draco/ktx2 → manifest
content/              Authored content as data (components, specs, lessons, stations)
evals/                Tutor factual-QA set + CI gate (<2% error)
docs/                 The full specification stack (10 approved documents)
```

Workspace packages export TypeScript source directly (`main: ./src/index.ts`); Vite compiles in place — no per-package build orchestration at slice scope.

## Engineering rules (binding, from the doc stack)

1. **Truth discipline** — every spec value carries `verificationStatus`; nothing user-facing presents a `placeholder_PL` value as fact. UI badges it; the tutor declines or flags it.
2. **BOM naming** — GLTF node names = `componentId` = BOM convention (`packages/data` enforces the regex; the asset pipeline lints it).
3. **One seam** — 3D layer and UI layer communicate only via stores and the `@dtea/events` bus. No cross-imports of internals.
4. **WebGL2 is the QA floor** — WebGPU runs where available; CI smoke-tests force the fallback.
5. **Scope discipline** — Sprint scope changes require a documented decision against RDM-002's cut list (no silent expansion).

## Version pins

Dependency majors follow ARCH-002 §1. The Sprint-1 kickoff task includes refreshing minor pins to current releases at `pnpm install` time; `three` is pinned to the r171+ line (WebGPURenderer production baseline per ARCH-001).
