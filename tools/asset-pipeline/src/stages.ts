import { createHash } from 'node:crypto';
import type { Document } from '@gltf-transform/core';
import { prune, weld, draco } from '@gltf-transform/functions';
import { ComponentCatalog, type ComponentRecord } from '@dtea/data';

/** AST-001 §4 triangle budgets by component class (slice subset). */
const TRIANGLE_BUDGETS: Record<string, number> = {
  fastener: 800,
  default: 50_000,
};

const BOM_ID_PATTERN = /^[A-Z0-9]+(_[A-Z0-9-]+)+$/;

export interface LintResult {
  ok: boolean;
  errors: string[];
}

/**
 * Stage 1 — lint (ARCH-002 §8): every mesh-bearing node must
 *  (a) follow the BOM naming convention,
 *  (b) exist in the component catalog,
 *  (c) respect its triangle budget.
 */
export function lintDocument(
  doc: Document,
  catalogJson: unknown,
  budgetClass: keyof typeof TRIANGLE_BUDGETS = 'default',
): LintResult {
  const errors: string[] = [];
  const catalog = ComponentCatalog.safeParse(catalogJson);
  if (!catalog.success) {
    return { ok: false, errors: [`components.json invalid: ${catalog.error.message}`] };
  }
  const byId = new Map(catalog.data.map((c) => [c.componentId, c]));
  const budget = TRIANGLE_BUDGETS[budgetClass] ?? TRIANGLE_BUDGETS['default']!;

  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const name = node.getName();

    if (!BOM_ID_PATTERN.test(name)) {
      errors.push(`node "${name}" violates the BOM naming convention`);
    }
    if (!byId.has(name)) {
      errors.push(`node "${name}" has no record in components.json (metadata source of truth)`);
    }
    let triangles = 0;
    for (const prim of mesh.listPrimitives()) {
      const indices = prim.getIndices();
      triangles += indices ? indices.getCount() / 3 : (prim.getAttribute('POSITION')?.getCount() ?? 0) / 3;
    }
    if (triangles > budget) {
      errors.push(`node "${name}": ${triangles} tris exceeds '${budgetClass}' budget of ${budget}`);
    }
  }
  return { ok: errors.length === 0, errors };
}

/**
 * Stage 2 — inject: write the component record into node extras (GLTF userData).
 * Blender never hand-carries metadata; the catalog is the single source (ARCH-002 §8).
 */
export function injectMetadata(doc: Document, catalogJson: unknown): string[] {
  const catalog = ComponentCatalog.parse(catalogJson);
  const byId = new Map<string, ComponentRecord>(catalog.map((c) => [c.componentId, c]));
  const injected: string[] = [];

  for (const node of doc.getRoot().listNodes()) {
    if (!node.getMesh()) continue;
    const record = byId.get(node.getName());
    if (record) {
      node.setExtras(record as unknown as Record<string, unknown>);
      injected.push(record.componentId);
    }
  }
  return injected;
}

/**
 * Stage 3 — optimize: prune → weld → draco.
 * KTX2 texture compression is a no-op until textured assets arrive (Sprint 2 scan
 * deliverables); the stage boundary exists now so it slots in without redesign.
 */
export async function optimizeDocument(doc: Document): Promise<void> {
  await doc.transform(prune(), weld(), draco({ method: 'edgebreaker' }));
}

export interface ManifestEntry {
  assemblyId: string;
  file: string;
  bytes: number;
  hash: string;
  nodes: string[];
}

export interface AssetManifest {
  generatedAt: string;
  assets: ManifestEntry[];
}

/** Stage 4 — manifest: content-hashed filename + loader manifest (ARCH-002 §8). */
export function buildManifestEntry(
  assemblyId: string,
  glb: Uint8Array,
  nodes: string[],
): ManifestEntry {
  const hash = createHash('sha256').update(glb).digest('hex').slice(0, 12);
  return {
    assemblyId,
    file: `${assemblyId}.${hash}.glb`,
    bytes: glb.byteLength,
    hash,
    nodes,
  };
}
