import { describe, expect, it } from 'vitest';
import { EventBus } from './bus.js';
import { LocalEventLog } from './local-log.js';
import type { DomainEvent } from '@dtea/data';

const sample: DomainEvent = {
  type: 'component:selected',
  componentId: 'ENG_VALVETRAIN_INTAKE-VALVE-1',
  timestamp: new Date().toISOString(),
};

describe('EventBus', () => {
  it('delivers typed events to subscribers and sinks', () => {
    const bus = new EventBus();
    const received: string[] = [];
    bus.on('component:selected', (e) => received.push(e.componentId));

    const store = new Map<string, string>();
    const log = new LocalEventLog({
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => void store.set(k, v),
    });
    log.attach(bus);

    bus.emit(sample);

    expect(received).toEqual(['ENG_VALVETRAIN_INTAKE-VALVE-1']);
    expect(log.read()).toHaveLength(1);
  });

  it('unsubscribes cleanly', () => {
    const bus = new EventBus();
    let count = 0;
    const off = bus.on('component:selected', () => count++);
    bus.emit(sample);
    off();
    bus.emit(sample);
    expect(count).toBe(1);
  });
});
