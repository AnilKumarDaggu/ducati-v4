# OFFICINA — Visual Gap Analysis

**Date:** 2026-06-13 · **Benchmark:** MechLab engine explorer, cad.fun, Unigine CAD viewer, Ducati studio photography
**Verdict:** technically complete, visually a scaffold. Scored against the intended product, not the code.

## Score

| | Score /100 | Why |
|---|---|---|
| **Current** | **12** | A single 96-tri bolt on a flat white void. No hero, no depth, no material story, no spec context, controls floating in empty space. Reads as a debug harness. |
| **Target** | **90** | Frame-filling engine hero, cinematic studio light, material contrast (dark cast / chrome / rosso), grounded shadow + reflection, spec band, exploded + animated cycle — a viewer Ducati could show on a stand. |

The gap is dominated by **one missing thing: a hero object**, then by lighting/material/composition. MechLab is *not* using real Ducati assets either — it ships generic engines made to look premium through framing and light. We can close most of the gap now, before scan data.

## Top 20 visual & UX gaps (current → benchmark)

1. **No hero.** A lone bolt vs. an engine that fills 55–65% of the frame. *The single biggest gap.*
2. **Dead empty viewport** — vast white nothing; the object reads as an afterthought, not the subject.
3. **Flat white background** — no gradient, vignette, or horizon; no sense of a studio "room."
4. **No material story** — one grey metal vs. dark cast + chrome + anodized alu + Ducati rosso contrast.
5. **Weak grounding** — faint shadow, no reflection plate; the object floats instead of sitting on a surface.
6. **No depth cues** — no DOF, no ambient occlusion read, no atmospheric falloff.
7. **Timid camera framing** — object small and centered; no dramatic 3/4 hero angle, no fill.
8. **No idle life** — static until dragged; premium viewers breathe with a slow drift.
9. **No spec context** — nothing says "Ducati," "1,158 cc," "V4," "170 hp." MechLab's stat band is half its impact.
10. **No identity in the stage** — the scene doesn't say engineering lab, atelier, or Ducati anywhere.
11. **Controls float in a void** — the dock sits over emptiness instead of anchoring a composed scene.
12. **Selection is invisible at distance** — rim-light is lost because the object is tiny and unlit.
13. **No focus payoff** — selecting a part doesn't compose a satisfying close-up shot.
14. **Explode has nothing to explode** — one part; the marquee CAD interaction is inert.
15. **Crank cycle is abstract** — a bolt spinning means nothing; needs reciprocating, recognizable motion.
16. **No view-mode drama** — X-ray/Tecnico on a single bolt is imperceptible; needs an assembly to ghost.
17. **No entrance** — the app pops in cold; no reveal, no establishing move.
18. **Placard leads with emptiness** — "Seleziona un componente" over a blank stage = nothing to invite the click.
19. **No scale reference** — the bolt could be 8 mm or 8 m; no bench, grid, or context for size.
20. **No "wow" frame** — there is no single screenshot here that could go in a keynote. The benchmark has a dozen.

## Top 10 improvements, ranked by impact

| # | Improvement | Impact | Effort | Priority |
|---|---|---|---|---|
| 1 | **Engine hero asset** (procedural, ~14 parts, material contrast incl. rosso) replacing the bolt | ★★★★★ | M | P1 |
| 2 | **Cinematic lighting** — stronger key + warm rim, real contact shadow, ground reflection | ★★★★★ | S | P1 |
| 3 | **Studio backdrop** — radial gradient cove + vignette, not flat white | ★★★★☆ | S | P1 |
| 4 | **Hero framing** — fill ~60%, 3/4 angle, lowered target, gentle idle drift | ★★★★☆ | S | P1 |
| 5 | **Ducati spec band** — verified V4 Granturismo stats with citations | ★★★★☆ | S | P1 |
| 6 | **Material system** — dark cast / chrome / anodized / rosso PBR with clearcoat | ★★★★☆ | S | P1 |
| 7 | **Multi-part explode + reciprocating crank motion** (now meaningful) | ★★★★☆ | M | P2 |
| 8 | **Focus framing on select** — compose a close-up shot, dim the rest | ★★★☆☆ | S | P2 |
| 9 | **Entrance reveal** — 2.5 s establishing orbit to the hero frame | ★★★☆☆ | S | P2 |
| 10 | **Title overlay** — "MULTISTRADA V4 · GRANTURISMO" hero lockup over the stage | ★★★☆☆ | S | P3 |

**This pass implements #1–6 (all of P1).** They convert the empty void into a lit, grounded, spec-contextualized engine hero — the change from 12 → a credible product impression — without any external asset.

---

## V1 outcome (2026-06-13) — code-only cinematic pass

**Shipped & visually verified** (screenshots inspected; build/lint/test/e2e green):
- **Engine hero** (14-part procedural assembly, material contrast incl. rosso) — replaces the bolt.
- **Studio HDR environment** (procedural equirect via PMREM) → **real reflections on every material** on the WebGL2 path. Renderer now prefers WebGL2 for the hero (`RendererManager.preferWebGL2`).
- **Physically-based materials** keyed by name (`materials.ts`): clearcoat rosso, anisotropic brushed alu, chrome, cast — flat fills became surfaces.
- **Premium lighting** (warm key + cool fill + back rim, engine-scale soft shadows) + contact shadow + DOM vignette for depth.
- **Frosted premium UI** (backdrop-blur panels, tabular/figure type features), hero lockup, spec band.
- **Cinematic camera** (framing journeys, idle museum drift) + **selection = photographic subject isolation** + auto close-up framing + populated Scheda Tecnica.

**Deferred — post-processing rendered the viewport black** under this three version's colour management (EffectComposer + OutputPass double-encode). A correct image outranks effects, so these are pulled pending a dedicated colour-managed composer pass:
- **SSAO ambient occlusion** (was the worst offender), **bloom**, **OutlinePass selection glow**, **DOF**.
- Re-introduce via a carefully colour-managed `EffectComposer` (verify RenderPass→OutputPass tone-map/sRGB once, not twice) or the WebGPU node post-pipeline when mature.

**Honest score after V1:** ~25 → **~45**. Reflections + PBR + lighting + premium UI landed; AO/bloom/outline did not. The ceiling remains geometry: this is a beautifully-lit *representative* engine. The next real leap is **V2 — a true engine GLB** (see [DTEA-AST-002](docs/assets/DTEA-AST-002-glb-asset-requirements-v1.0.md), the drop-in contract), which is a purchase/scan, not code.
