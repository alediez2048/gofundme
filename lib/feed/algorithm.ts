/**
 * AI-powered feed scoring engine (FR-032).
 * Multi-signal ranking model: cause relevance + social proximity +
 * engagement momentum + recency + content type balance + exploration.
 */

import type { CauseCategory, FeedEvent } from "@/lib/data";
import type { Store } from "@/lib/store";
import { computeUserCauseProfile, scoreCauseRelevance } from "./causeEmbeddings";
import { generateReason, type ScoredSignals } from "./reasonGenerator";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScoredFeedEvent {
  event: FeedEvent;
  score: number;
  reason: string;
  signals: ScoredSignals;
}

// ---------------------------------------------------------------------------
// Signal weights
// ---------------------------------------------------------------------------

const W = {
  causeRelevance: 0.3,
  socialProximity: 0.25,
  engagementMomentum: 0.2,
  recency: 0.15,
  contentTypeBoost: 0.05,
  explorationBoost: 0.05,
} as const;

// ---------------------------------------------------------------------------
// Signal computation
// ---------------------------------------------------------------------------

function computeSocialProximity(event: FeedEvent, userId: string, state: Store): number {
  const user = state.users[userId];
  if (!user) return 0;
  const following = user.followingIds ?? [];

  // A user's own posts should remain visible in their personalized feed.
  if (event.actorId === userId) return 1.0;

  // Direct follow
  if (following.includes(event.actorId)) return 1.0;

  // 2nd degree — someone you follow follows the actor
  for (const fid of following) {
    const f = state.users[fid];
    if (f?.followingIds?.includes(event.actorId)) return 0.7;
  }

  // Community overlap
  if (event.communityId && user.communityIds.includes(event.communityId)) return 0.4;

  // Same cause category but no social connection
  const userComms = user.communityIds.map((id) => state.communities[id]?.causeCategory).filter(Boolean);
  if (userComms.includes(event.causeCategory)) return 0.1;

  return 0;
}

function computeEngagementMomentum(event: FeedEvent): number {
  const eng = event.engagement;
  const totalEng = eng.heartCount + eng.commentCount * 2 + eng.shareCount * 3;
  const hours = Math.max((Date.now() - new Date(event.createdAt).getTime()) / (1000 * 60 * 60), 0.1);
  return totalEng / hours;
}

function computeRecency(event: FeedEvent): number {
  const hours = (Date.now() - new Date(event.createdAt).getTime()) / (1000 * 60 * 60);
  return Math.exp(-hours / 36); // half-life ~25 hours
}

function computeContentTypeBoost(
  eventType: FeedEvent["type"],
  typeCounts: Record<string, number>,
  total: number
): number {
  if (total === 0) return 0.5;
  const ratio = (typeCounts[eventType] ?? 0) / total;
  // Boost underrepresented types
  return ratio > 0.6 ? 0 : 1 - ratio;
}

// ---------------------------------------------------------------------------
// Core scoring
// ---------------------------------------------------------------------------

function scoreFeedEvent(
  event: FeedEvent,
  userId: string,
  state: Store,
  userProfile: ReturnType<typeof computeUserCauseProfile>,
  typeCounts: Record<string, number>,
  totalScored: number,
  maxVelocity: number
): ScoredFeedEvent {
  const causeRelevance = scoreCauseRelevance(userProfile, event.causeCategory);
  const socialProximity = computeSocialProximity(event, userId, state);
  const rawMomentum = computeEngagementMomentum(event);
  const engagementMomentum = maxVelocity > 0 ? rawMomentum / maxVelocity : 0;
  const recency = computeRecency(event);
  const contentTypeBoost = computeContentTypeBoost(event.type, typeCounts, totalScored);
  const explorationBoost = 0; // set externally for exploration slots

  const signals: ScoredSignals = {
    causeRelevance,
    socialProximity,
    engagementMomentum: Math.min(engagementMomentum, 1),
    recency,
    contentTypeBoost,
    explorationBoost,
  };

  const score =
    causeRelevance * W.causeRelevance +
    socialProximity * W.socialProximity +
    Math.min(engagementMomentum, 1) * W.engagementMomentum +
    recency * W.recency +
    contentTypeBoost * W.contentTypeBoost;

  const reason = generateReason(event, signals, userId, state);

  return { event, score, reason, signals };
}

// ---------------------------------------------------------------------------
// Diversity enforcement
// ---------------------------------------------------------------------------

function enforceDiversity(items: ScoredFeedEvent[]): ScoredFeedEvent[] {
  if (items.length <= 2) return items;
  const result = [...items];

  for (let i = 2; i < result.length; i++) {
    const prev1 = result[i - 1];
    const prev2 = result[i - 2];
    const curr = result[i];

    const sameCause =
      curr.event.causeCategory === prev1.event.causeCategory &&
      curr.event.causeCategory === prev2.event.causeCategory;
    const sameType =
      curr.event.type === prev1.event.type && curr.event.type === prev2.event.type;

    if (sameCause || sameType) {
      // Find next item that breaks the streak
      for (let j = i + 1; j < result.length; j++) {
        const candidate = result[j];
        const breaksCause = candidate.event.causeCategory !== prev1.event.causeCategory;
        const breaksType = candidate.event.type !== prev1.event.type;
        if ((sameCause && breaksCause) || (sameType && breaksType)) {
          // Swap
          result[i] = candidate;
          result[j] = curr;
          break;
        }
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Public API — Feed tabs
// ---------------------------------------------------------------------------

export function getForYouFeed(userId: string, state: Store): ScoredFeedEvent[] {
  const events = Object.values(state.feedEvents);
  if (events.length === 0) return [];

  // Respect isPublic on donations
  const filtered = events.filter((e) => {
    if (e.type === "donation" && e.metadata.amount != null) {
      const donation = Object.values(state.donations).find(
        (d) => d.fundraiserId === e.subjectId && d.donorId === e.actorId && d.amount === e.metadata.amount
      );
      if (donation && donation.isPublic === false) return false;
    }
    return true;
  });

  const userProfile = computeUserCauseProfile(userId, state);

  // Pre-compute max velocity for normalization
  const velocities = filtered.map(computeEngagementMomentum);
  const maxVelocity = Math.max(...velocities, 1);

  const typeCounts: Record<string, number> = {};
  let scored = filtered.map((event) => {
    typeCounts[event.type] = (typeCounts[event.type] ?? 0) + 1;
    return scoreFeedEvent(event, userId, state, userProfile, typeCounts, filtered.length, maxVelocity);
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Exploration: every 5th slot gets content outside user's top 2 causes
  const user = state.users[userId];
  const topCauses = getTopCauses(userProfile, 2);

  for (let i = 4; i < scored.length; i += 5) {
    // Find best exploration candidate after current position
    const explorationIdx = scored.findIndex(
      (s, idx) => idx > i && !topCauses.includes(s.event.causeCategory)
    );
    if (explorationIdx > -1) {
      const item = scored.splice(explorationIdx, 1)[0];
      item.signals.explorationBoost = 0.5;
      item.reason = `Discover: popular in ${item.event.causeCategory}`;
      scored.splice(i, 0, item);
    }
  }

  return enforceDiversity(scored);
}

export function getFollowingFeed(userId: string, state: Store): ScoredFeedEvent[] {
  const user = state.users[userId];
  if (!user) return [];
  const following = new Set(user.followingIds ?? []);
  // Include own posts so users see their content when posting
  following.add(userId);

  return Object.values(state.feedEvents)
    .filter((e) => following.has(e.actorId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((event) => ({
      event,
      score: 0,
      reason: `${state.users[event.actorId]?.name ?? "Someone you follow"} posted this`,
      signals: { causeRelevance: 0, socialProximity: 1, engagementMomentum: 0, recency: 0, contentTypeBoost: 0, explorationBoost: 0 },
    }));
}

export function getTrendingFeed(state: Store): ScoredFeedEvent[] {
  const events = Object.values(state.feedEvents);
  return events
    .map((event) => {
      const momentum = computeEngagementMomentum(event);
      const totalEng = event.engagement.heartCount + event.engagement.commentCount + event.engagement.shareCount;
      return {
        event,
        score: momentum,
        reason: `Trending — ${totalEng} interactions`,
        signals: { causeRelevance: 0, socialProximity: 0, engagementMomentum: momentum, recency: 0, contentTypeBoost: 0, explorationBoost: 0 },
      };
    })
    .sort((a, b) => b.score - a.score);
}

export type FeedTab = "forYou" | "following" | "trending";

export function getFeedForUser(
  userId: string,
  tab: FeedTab,
  state: Store
): ScoredFeedEvent[] {
  switch (tab) {
    case "forYou":
      return getForYouFeed(userId, state);
    case "following":
      return getFollowingFeed(userId, state);
    case "trending":
      return getTrendingFeed(state);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTopCauses(profile: Record<CauseCategory, number>, n: number): CauseCategory[] {
  return (Object.entries(profile) as Array<[CauseCategory, number]>)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([cause]) => cause);
}
