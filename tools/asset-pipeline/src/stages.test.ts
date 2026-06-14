import { describe, expect, it } from 'vitest';
import { createStandinBolt, STANDIN_COMPONENT_ID } from './standin.js';
import { buildManifestEntry, injectMetadata, lintDocument } from './stages.js';

const catalog = [
  {
    componentId: STANDIN_COMPONENT_ID,
    displayName: 'Stand-in Test Bolt M8',
    hierarchyPath: 'S13/01',
    adl: 'ADL1',
    descriptionShort: 'Synthetic pipeline test article.',
  },
];

describe('asset pipeline stages', () => {
  it('lint passes the stand-in bolt against its catalog record and fastener budget', () => {
    const result = lintDocument(createStandinBolt(), catalog, 'fastener');
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('lint fails a node missing from the catalog', () => {
    const result = lintDocument(createStandinBolt(), [], 'fastener');
    expect(result.ok).toBe(false);
    expect(result.errors.join()).toContain('no record in components.json');
  });

  it('inject writes the full component record into node extras', () => {
    const doc = createStandinBolt();
    const injected = injectMetadata(doc, catalog);
    expect(injected).toEqual([STANDIN_COMPONENT_ID]);

    const node = doc
      .getRoot()
      .listNodes()
      .find((n) => n.getName() === STANDIN_COMPONENT_ID)!;
    expect(node.getExtras()).toMatchObject({
      componentId: STANDIN_COMPONENT_ID,
      displayName: 'Stand-in Test Bolt M8',
    });
  });

  it('manifest entries are content-hashed', () => {
    const a = buildManifestEntry('standin', new Uint8Array([1, 2, 3]), ['X_Y']);
    const b = buildManifestEntry('standin', new Uint8Array([1, 2, 4]), ['X_Y']);
    expect(a.file).not.toEqual(b.file);
    expect(a.file).toMatch(/^standin\.[0-9a-f]{12}\.glb$/);
  });
});
