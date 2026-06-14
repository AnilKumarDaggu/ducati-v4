import { EventBus, LocalEventLog } from '@dtea/events';

/**
 * App-wide bus singleton + the localStorage event-log sink (RDM-002 §8).
 * Every consumer (UI, future tutor context, future xAPI emitter) subscribes here.
 */
export const bus = new EventBus();
export const eventLog = new LocalEventLog();
eventLog.attach(bus);
