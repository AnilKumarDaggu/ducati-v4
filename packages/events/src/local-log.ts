import type { DomainEvent } from '@dtea/data';
import type { EventBus } from './bus.js';

const STORAGE_KEY = 'dtea.eventLog.v1';

/**
 * localStorage event sink (RDM-002 §8): xAPI-shaped payloads so the MVP
 * migration to a statement warehouse is a mapper, not a redesign.
 * Storage interface is injectable for headless tests.
 */
export class LocalEventLog {
  constructor(
    private readonly storage: Pick<Storage, 'getItem' | 'setItem'> = globalThis.localStorage,
  ) {}

  attach(bus: EventBus): () => void {
    return bus.onAny((event) => this.append(event));
  }

  append(event: DomainEvent): void {
    const log = this.read();
    log.push(event);
    this.storage.setItem(STORAGE_KEY, JSON.stringify(log));
  }

  read(): DomainEvent[] {
    const raw = this.storage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DomainEvent[]) : [];
  }

  /** Beta telemetry export — RDM-002 §3. */
  exportJson(): string {
    return JSON.stringify(this.read(), null, 2);
  }
}
