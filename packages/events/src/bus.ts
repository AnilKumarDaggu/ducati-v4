import type { DomainEvent, DomainEventType } from '@dtea/data';

type Handler<T extends DomainEventType> = (event: Extract<DomainEvent, { type: T }>) => void;
type AnyHandler = (event: DomainEvent) => void;

/**
 * The platform's single seam between the 3D layer, the UI layer, and every
 * consumer (event log now; xAPI warehouse, score engine, tutor coaching later).
 * One bus, many consumers — ARCH-002 §2.
 */
export class EventBus {
  private handlers = new Map<DomainEventType, Set<AnyHandler>>();
  private wildcard = new Set<AnyHandler>();

  on<T extends DomainEventType>(type: T, handler: Handler<T>): () => void {
    let set = this.handlers.get(type);
    if (!set) {
      set = new Set();
      this.handlers.set(type, set);
    }
    set.add(handler as AnyHandler);
    return () => set.delete(handler as AnyHandler);
  }

  /** Subscribe to every event — used by sinks (event log, future xAPI emitter). */
  onAny(handler: AnyHandler): () => void {
    this.wildcard.add(handler);
    return () => this.wildcard.delete(handler);
  }

  emit(event: DomainEvent): void {
    this.handlers.get(event.type)?.forEach((h) => h(event));
    this.wildcard.forEach((h) => h(event));
  }
}
