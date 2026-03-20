/**
 * FR-055: Analytics event emitter with Beacon API dispatch.
 * Non-blocking, fire-and-forget analytics collection.
 * Events are stored in-memory for the analytics dashboard.
 */

import { createEvent, type AnalyticsCategory, type AnalyticsEvent } from "./events";

const MAX_EVENTS = 500;
let events: AnalyticsEvent[] = [];
let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  return sessionId;
}

/** Emit an analytics event. Stored in-memory and optionally dispatched via Beacon API. */
export function emit(
  category: AnalyticsCategory,
  action: string,
  opts?: { label?: string; value?: number; metadata?: Record<string, unknown> }
): void {
  const event = createEvent(category, action, getSessionId(), opts);
  events.push(event);

  // Trim old events
  if (events.length > MAX_EVENTS) {
    events = events.slice(-MAX_EVENTS);
  }

  // Beacon API dispatch (non-blocking, works even on page unload)
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    try {
      navigator.sendBeacon("/api/analytics", JSON.stringify(event));
    } catch {
      // Beacon failed — event is still stored in memory
    }
  }
}

/** Get all collected events (for the analytics dashboard). */
export function getEvents(): AnalyticsEvent[] {
  return events;
}

/** Get events filtered by category. */
export function getEventsByCategory(category: AnalyticsCategory): AnalyticsEvent[] {
  return events.filter((e) => e.category === category);
}

/** Clear all events. */
export function clearEvents(): void {
  events = [];
}

/** Get summary stats. */
export function getEventSummary(): Record<AnalyticsCategory, number> {
  const summary: Record<string, number> = { performance: 0, conversion: 0, feed: 0, network: 0 };
  for (const e of events) {
    summary[e.category] = (summary[e.category] ?? 0) + 1;
  }
  return summary as Record<AnalyticsCategory, number>;
}
