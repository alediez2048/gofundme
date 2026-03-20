/**
 * Feed event construction helpers (FR-031).
 * Pure functions — no store dependency. The store imports these to build FeedEvents.
 */

import type {
  CauseCategory,
  EngagementSummary,
  EventType,
  FeedEvent,
} from "@/lib/data";

export function generateEventId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createDefaultEngagement(): EngagementSummary {
  return {
    heartCount: 0,
    commentCount: 0,
    shareCount: 0,
    heartedByUserIds: [],
    comments: [],
    bookmarkedByUserIds: [],
  };
}

export interface BuildFeedEventParams {
  type: EventType;
  actorId: string;
  subjectId: string;
  subjectType: "fundraiser" | "community" | "user";
  metadata: Record<string, unknown>;
  causeCategory: CauseCategory;
  communityId?: string;
  fundraiserId?: string;
}

export function buildFeedEvent(params: BuildFeedEventParams): FeedEvent {
  return {
    id: generateEventId(),
    type: params.type,
    actorId: params.actorId,
    subjectId: params.subjectId,
    subjectType: params.subjectType,
    metadata: params.metadata,
    engagement: createDefaultEngagement(),
    causeCategory: params.causeCategory,
    createdAt: new Date().toISOString(),
    communityId: params.communityId,
    fundraiserId: params.fundraiserId,
  };
}
