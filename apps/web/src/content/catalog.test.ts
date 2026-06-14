import { describe, expect, it } from 'vitest';
import { breadcrumbFor, catalog, componentById, groupBySystem, specs } from './catalog';

describe('catalog content (schema-validated at load)', () => {
  it('loads components and specs without schema errors', () => {
    expect(catalog.length).toBeGreaterThan(0);
    expect(specs.length).toBeGreaterThan(0);
  });

  it('every spec value carries an explicit verification status (truth discipline)', () => {
    for (const spec of specs) {
      expect(['verified', 'placeholder_PL', 'flagged']).toContain(spec.verificationStatus);
    }
  });

  it('groups components by BOM Level-2 system in order', () => {
    const groups = groupBySystem(catalog);
    expect(groups.length).toBeGreaterThan(0);
    const codes = groups.map((g) => g.systemCode);
    expect([...codes]).toEqual([...codes].sort((a, b) => a.localeCompare(b)));
    // Every catalog component appears exactly once across groups.
    const total = groups.reduce((n, g) => n + g.components.length, 0);
    expect(total).toBe(catalog.length);
  });

  it('builds a human breadcrumb ending in the display name', () => {
    const valve = componentById.get('ENG_VALVETRAIN_INTAKE-VALVE-1');
    expect(valve).toBeDefined();
    const crumb = breadcrumbFor(valve!);
    expect(crumb[0]).toBe('Powertrain'); // S01
    expect(crumb.at(-1)).toBe(valve!.displayName);
  });
});
