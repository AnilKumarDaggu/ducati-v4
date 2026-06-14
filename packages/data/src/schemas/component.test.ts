import { describe, expect, it } from 'vitest';
import { ComponentRecord } from './component.js';

describe('ComponentRecord schema', () => {
  it('accepts a valid BOM-convention record', () => {
    const result = ComponentRecord.safeParse({
      componentId: 'ENG_VALVETRAIN_INTAKE-VALVE-1',
      displayName: 'Intake Valve #1',
      hierarchyPath: 'S01/03/01',
      adl: 'ADL4',
      descriptionShort: 'Admits intake charge; seals combustion chamber on its seat.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects componentIds that violate the BOM naming convention', () => {
    const result = ComponentRecord.safeParse({
      componentId: 'intake valve 1',
      displayName: 'Bad',
      hierarchyPath: 'S01/03/01',
      adl: 'ADL4',
      descriptionShort: 'x',
    });
    expect(result.success).toBe(false);
  });
});
