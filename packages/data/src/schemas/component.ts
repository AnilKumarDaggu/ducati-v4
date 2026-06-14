import { z } from 'zod';

/**
 * Source citation — the truth-discipline core (ARCH-001 §2).
 * Every specification-bearing field traces to an official document or is flagged.
 */
export const SourceCitation = z.object({
  document: z.string(), // e.g. "Ducati Multistrada V4 Workshop Manual 2022 ed."
  page: z.string().optional(),
  verifier: z.string().optional(),
  verifiedAt: z.string().datetime().optional(),
});
export type SourceCitation = z.infer<typeof SourceCitation>;

/** Asset Detail Level per AST-001 §1. */
export const Adl = z.enum(['ADL0', 'ADL1', 'ADL2', 'ADL3', 'ADL4']);

/**
 * Component record — BOM-001 metadata schema (§7.3 of the carried V1 spec, as JSONB shape).
 * `componentId` follows the BOM naming convention and must match the GLTF node name 1:1.
 */
export const ComponentRecord = z.object({
  componentId: z.string().regex(/^[A-Z0-9]+(_[A-Z0-9-]+)+$/, 'must follow BOM ID convention'),
  displayName: z.string(),
  /** BOM hierarchy path, e.g. "S01/03/01" (system/subsystem/assembly). */
  hierarchyPath: z.string(),
  adl: Adl,
  material: z
    .object({
      base: z.string(),
      surface: z.string().optional(),
      citation: SourceCitation.optional(),
    })
    .optional(),
  massGrams: z.number().positive().optional(),
  descriptionShort: z.string(),
  descriptionLongRef: z.string().optional(),
  relatedComponents: z.array(z.string()).default([]),
  moduleLinks: z.array(z.string()).default([]),
  /** Spec records that apply to this component (FK into spec_records.json). */
  specRefs: z.array(z.string()).default([]),
  interactable: z.boolean().default(true),
  citation: SourceCitation.optional(),
});
export type ComponentRecord = z.infer<typeof ComponentRecord>;

export const ComponentCatalog = z.array(ComponentRecord);
