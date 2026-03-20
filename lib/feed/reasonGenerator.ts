/**
 * Feed reason generator (FR-032).
 * Template-based "why you see this" explanations.
 */

import type { FeedEvent } from "@/lib/data";
import type { Store } from "@/lib/store";

export interface ScoredSignals {
  causeRelevance: number;
  socialProximity: number;
  engagementMomentum: number;
  recency: number;
  contentTypeBoost: number;
  explorationBoost: number;
}

/**
 * Generate a human-readable reason for why a feed event was surfaced.
 * Uses the highest signal to determine the primary reason.
 */
export function generateReason(
  event: FeedEvent,
  signals: ScoredSignals,
  userId: string,
  state: Store
): string {
  // Exploration override
  if (signals.explorationBoost > 0) {
    return `Discover: popular in ${event.causeCategory}`;
  }

  // Find the dominant signal
  const signalEntries: Array<[string, number]> = [
    ["cause", signals.causeRelevance],
    ["social", signals.socialProximity],
    ["momentum", signals.engagementMomentum],
    ["recency", signals.recency],
  ];
  signalEntries.sort((a, b) => b[1] - a[1]);
  const dominant = signalEntries[0][0];

  switch (dominant) {
    case "social": {
      // Check if direct follow
      const actor = state.users[event.actorId];
      const user = state.users[userId];
      if (user?.followingIds?.includes(event.actorId) && actor) {
        return `${actor.name} posted this — you follow them`;
      }
      // Second degree
      if (actor) {
        const mutualFollower = (user?.followingIds ?? []).find((fid) => {
          const f = state.users[fid];
          return f?.followingIds?.includes(event.actorId);
        });
        if (mutualFollower) {
          const mutual = state.users[mutualFollower];
          return `${mutual?.name ?? "Someone you follow"} follows ${actor.name}`;
        }
      }
      // Community overlap
      if (event.communityId) {
        const comm = state.communities[event.communityId];
        if (comm) return `From the ${comm.name} community`;
      }
      return `Because you support ${event.causeCategory}`;
    }
    case "momentum": {
      const totalEng = event.engagement.heartCount + event.engagement.commentCount + event.engagement.shareCount;
      return `Trending — ${totalEng} interactions`;
    }
    case "recency":
      return "Just now";
    case "cause":
    default:
      return `Because you support ${event.causeCategory}`;
  }
}
