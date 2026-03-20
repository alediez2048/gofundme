/**
 * FR-055: Typed analytics event definitions.
 */

export type AnalyticsCategory = "performance" | "conversion" | "feed" | "network";

export interface AnalyticsEvent {
  category: AnalyticsCategory;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  timestamp: string;
  sessionId: string;
}

// Performance events
export type PerformanceAction = "lcp" | "ttfb" | "cls" | "fid" | "page_load";

// Conversion events
export type ConversionAction = "community_view" | "fundraiser_click" | "donate_intent" | "donation_complete";

// Feed engagement events
export type FeedAction = "feed_view" | "scroll_depth" | "card_click" | "card_heart" | "card_comment" | "card_share" | "card_bookmark" | "tab_switch";

// Network growth events
export type NetworkAction = "follow" | "unfollow" | "community_join" | "profile_view";

export function createEvent(
  category: AnalyticsCategory,
  action: string,
  sessionId: string,
  opts?: { label?: string; value?: number; metadata?: Record<string, unknown> }
): AnalyticsEvent {
  return {
    category,
    action,
    label: opts?.label,
    value: opts?.value,
    metadata: opts?.metadata,
    timestamp: new Date().toISOString(),
    sessionId,
  };
}
