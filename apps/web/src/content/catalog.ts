import { ComponentCatalog, SpecStore, type ComponentRecord, type SpecRecord } from '@dtea/data';
import componentsRaw from '@content/components.json';
import specsRaw from '@content/spec_records.json';

/**
 * Authored content, schema-validated at module load (fail fast and loud —
 * bad content must never render as truth).
 */
export const catalog: ComponentRecord[] = ComponentCatalog.parse(componentsRaw);
export const specs: SpecRecord[] = SpecStore.parse(specsRaw);

export const componentById = new Map(catalog.map((c) => [c.componentId, c]));
export const specById = new Map(specs.map((s) => [s.specId, s]));

/** BOM Level-2 system names (BOM-001 §3) for navigator grouping + breadcrumb. */
export const SYSTEM_NAMES: Record<string, string> = {
  S01: 'Powertrain',
  S02: 'Frame & Chassis',
  S03: 'Front Suspension',
  S04: 'Rear Suspension',
  S05: 'Brakes',
  S06: 'Wheels & Tires',
  S07: 'Fuel & Intake',
  S08: 'Exhaust',
  S09: 'Cooling',
  S10: 'Electrical',
  S11: 'Final Drive',
  S12: 'Bodywork',
  S13: 'Fasteners & Hardware',
};

export interface SystemGroup {
  systemCode: string;
  systemName: string;
  components: ComponentRecord[];
}

/** Catalog grouped by Level-2 system, in BOM order. */
export function groupBySystem(records: ComponentRecord[]): SystemGroup[] {
  const groups = new Map<string, ComponentRecord[]>();
  for (const record of records) {
    const code = record.hierarchyPath.split('/')[0] ?? 'S00';
    const list = groups.get(code) ?? [];
    list.push(record);
    groups.set(code, list);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([systemCode, components]) => ({
      systemCode,
      systemName: SYSTEM_NAMES[systemCode] ?? systemCode,
      components,
    }));
}

/** Breadcrumb path for a component: "Powertrain / S01-03-01 / Intake Valve #1". */
export function breadcrumbFor(record: ComponentRecord): string[] {
  const [system, ...rest] = record.hierarchyPath.split('/');
  const systemName = SYSTEM_NAMES[system ?? ''] ?? system ?? '';
  return rest.length > 0
    ? [systemName, rest.join(' · '), record.displayName]
    : [systemName, record.displayName];
}
