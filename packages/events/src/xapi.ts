import type { DomainEvent } from '@dtea/data';

/**
 * xAPI mapper — analytics foundation (RDM-002 §8, ARCH-001 §9.4).
 *
 * Converts the platform's domain events into xAPI 1.0.3 statements so the
 * slice's localStorage log migrates to a real LRS via this mapper, not a
 * redesign. Pure and deterministic; the `actor` is injected by the caller
 * (anonymous local id at slice scope, real account at MVP).
 */

const VERB_BASE = 'http://adlnet.gov/expapi/verbs';
const ACTIVITY_BASE = 'https://dtea.ducati.academy/xapi/activities';

export interface XapiActor {
  /** Account name or anonymous local id. */
  name: string;
  mbox?: string;
}

export interface XapiStatement {
  actor: { objectType: 'Agent'; name: string; mbox?: string };
  verb: { id: string; display: { 'en-US': string } };
  object: {
    objectType: 'Activity';
    id: string;
    definition?: { type?: string; name?: { 'en-US': string } };
  };
  result?: {
    score?: { raw: number };
    completion?: boolean;
    success?: boolean;
    duration?: string;
    extensions?: Record<string, unknown>;
  };
  context?: { extensions: Record<string, unknown> };
  timestamp: string;
}

const verb = (slug: string, display: string) => ({
  id: `${VERB_BASE}/${slug}`,
  display: { 'en-US': display },
});
const activity = (path: string) => `${ACTIVITY_BASE}/${path}`;
/** ISO-8601 duration from milliseconds (xAPI result.duration). */
const iso8601 = (ms: number) => `PT${(ms / 1000).toFixed(2)}S`;

export function toXapiStatement(event: DomainEvent, actor: XapiActor): XapiStatement {
  const base = {
    actor: { objectType: 'Agent' as const, name: actor.name, ...(actor.mbox ? { mbox: actor.mbox } : {}) },
    timestamp: event.timestamp,
  };

  switch (event.type) {
    case 'component:selected':
      return {
        ...base,
        verb: verb('experienced', 'experienced'),
        object: { objectType: 'Activity', id: activity(`component/${event.componentId}`) },
      };
    case 'component:isolated':
      return {
        ...base,
        verb: verb('interacted', 'isolated'),
        object: { objectType: 'Activity', id: activity(`component/${event.componentId}`) },
      };
    case 'viewmode:changed':
      return {
        ...base,
        verb: verb('interacted', 'changed view mode'),
        object: { objectType: 'Activity', id: activity(`viewmode/${event.mode}`) },
      };
    case 'explode:changed':
      return {
        ...base,
        verb: verb('interacted', 'exploded'),
        object: { objectType: 'Activity', id: activity(`assembly/${event.assemblyId}`) },
        context: { extensions: { [activity('ext/explode-level')]: event.level } },
      };
    case 'lesson:block_viewed':
      return {
        ...base,
        verb: verb('progressed', 'viewed'),
        object: { objectType: 'Activity', id: activity(`lesson/${event.unitId}/${event.blockId}`) },
      };
    case 'sim:step_completed':
      return {
        ...base,
        verb: verb('completed', 'completed'),
        object: { objectType: 'Activity', id: activity(`station/${event.stationId}/step/${event.stepId}`) },
        result: {
          score: { raw: event.score },
          completion: true,
          duration: iso8601(event.durationMs),
        },
        context: {
          extensions: {
            [activity('ext/hint-count')]: event.hintCount,
            [activity('ext/error-count')]: event.errorCount,
          },
        },
      };
    case 'sim:error_committed':
      return {
        ...base,
        verb: verb('failed', 'committed error'),
        object: { objectType: 'Activity', id: activity(`error/${event.errorId}`) },
        result: { success: false },
        context: {
          extensions: {
            [activity('ext/station')]: event.stationId,
            [activity('ext/detection')]: event.detection,
          },
        },
      };
    case 'sim:torque_applied':
      return {
        ...base,
        verb: verb('interacted', 'applied torque'),
        object: { objectType: 'Activity', id: activity(`spec/${event.specRef}`) },
        result: {
          success: event.verdict === 'in_spec',
          extensions: { [activity('ext/applied-nm')]: event.appliedNm, [activity('ext/verdict')]: event.verdict },
        },
      };
    case 'tutor:tool_executed':
      return {
        ...base,
        verb: verb('interacted', 'tutor tool'),
        object: { objectType: 'Activity', id: activity(`tutor/tool/${event.tool}`) },
        result: { success: event.success },
      };
  }
}
