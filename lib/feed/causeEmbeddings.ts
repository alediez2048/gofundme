/**
 * Cause embedding model (FR-032).
 * Hand-crafted similarity matrix that captures semantic relationships between causes.
 * Structured so it could be replaced by real embeddings later.
 */

import type { CauseCategory } from "@/lib/data";
import type { Store } from "@/lib/store";

export type CauseProfile = Record<CauseCategory, number>;

const ALL_CAUSES: CauseCategory[] = [
  "Disaster Relief & Wildfire Safety",
  "Medical & Healthcare",
  "Education",
  "Environment & Climate",
  "Animals & Wildlife",
  "Community & Neighbors",
];

/** Similarity matrix — symmetric, 1.0 on diagonal. */
const SIMILARITY: Record<CauseCategory, Partial<Record<CauseCategory, number>>> = {
  "Disaster Relief & Wildfire Safety": {
    "Environment & Climate": 0.8,
    "Community & Neighbors": 0.6,
    "Medical & Healthcare": 0.4,
    "Animals & Wildlife": 0.3,
    Education: 0.2,
  },
  "Medical & Healthcare": {
    "Community & Neighbors": 0.6,
    Education: 0.5,
    "Disaster Relief & Wildfire Safety": 0.4,
    "Animals & Wildlife": 0.2,
    "Environment & Climate": 0.3,
  },
  Education: {
    "Community & Neighbors": 0.7,
    "Medical & Healthcare": 0.5,
    "Environment & Climate": 0.4,
    "Disaster Relief & Wildfire Safety": 0.2,
    "Animals & Wildlife": 0.3,
  },
  "Environment & Climate": {
    "Disaster Relief & Wildfire Safety": 0.8,
    "Animals & Wildlife": 0.75,
    "Community & Neighbors": 0.5,
    Education: 0.4,
    "Medical & Healthcare": 0.3,
  },
  "Animals & Wildlife": {
    "Environment & Climate": 0.75,
    "Community & Neighbors": 0.4,
    Education: 0.3,
    "Disaster Relief & Wildfire Safety": 0.3,
    "Medical & Healthcare": 0.2,
  },
  "Community & Neighbors": {
    Education: 0.7,
    "Medical & Healthcare": 0.6,
    "Disaster Relief & Wildfire Safety": 0.6,
    "Environment & Climate": 0.5,
    "Animals & Wildlife": 0.4,
  },
};

export function getCauseSimilarity(causeA: CauseCategory, causeB: CauseCategory): number {
  if (causeA === causeB) return 1.0;
  return SIMILARITY[causeA]?.[causeB] ?? 0.1;
}

/** Build a weighted cause profile from donations, community memberships, and hearted events. */
export function computeUserCauseProfile(userId: string, state: Store): CauseProfile {
  const profile: CauseProfile = Object.fromEntries(ALL_CAUSES.map((c) => [c, 0])) as CauseProfile;

  const user = state.users[userId];
  if (!user) return profile;

  // Donation history (amount-weighted)
  for (const donId of user.donationIds) {
    const don = state.donations[donId];
    if (!don) continue;
    const fund = state.fundraisers[don.fundraiserId];
    if (!fund) continue;
    profile[fund.causeCategory] += don.amount;
  }

  // Community memberships
  for (const commId of user.communityIds) {
    const comm = state.communities[commId];
    if (!comm) continue;
    profile[comm.causeCategory] += 50; // baseline weight for membership
  }

  // Hearted events
  for (const evt of Object.values(state.feedEvents)) {
    if (evt.engagement.heartedByUserIds.includes(userId)) {
      profile[evt.causeCategory] += 10;
    }
  }

  // Semantic spreading: donating to "Wildfire" also slightly boosts "Climate"
  const spread = { ...profile };
  for (const cause of ALL_CAUSES) {
    if (profile[cause] <= 0) continue;
    for (const other of ALL_CAUSES) {
      if (other === cause) continue;
      spread[other] += profile[cause] * getCauseSimilarity(cause, other) * 0.2;
    }
  }

  // Normalize to 0–1
  const max = Math.max(...Object.values(spread), 1);
  for (const cause of ALL_CAUSES) {
    spread[cause] = spread[cause] / max;
  }

  return spread;
}

/** Score relevance of an event's cause to a user's profile. */
export function scoreCauseRelevance(userProfile: CauseProfile, eventCause: CauseCategory): number {
  // Weighted dot product with semantic similarity
  let score = 0;
  let norm = 0;
  for (const cause of ALL_CAUSES) {
    const sim = getCauseSimilarity(cause, eventCause);
    score += userProfile[cause] * sim;
    norm += userProfile[cause];
  }
  return norm > 0 ? score / norm : 0.5; // cold start: neutral
}
