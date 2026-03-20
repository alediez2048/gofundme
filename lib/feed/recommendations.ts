/**
 * Personalized fundraiser recommendations via Jaccard similarity (FR-048).
 * Client-side collaborative filtering on the giving graph.
 */

import type { Fundraiser } from "@/lib/data";
import type { Store } from "@/lib/store";

export interface RecommendedFundraiser {
  fundraiser: Fundraiser;
  score: number;
  reason: string;
}

/**
 * Find fundraisers that similar donors supported but the target user hasn't.
 * Uses Jaccard similarity on donation→fundraiser sets.
 */
export function getRecommendations(userId: string, state: Store, limit = 5): RecommendedFundraiser[] {
  const user = state.users[userId];
  if (!user) return [];

  // Build target user's fundraiser set from donations
  const userFundraiserIds = new Set<string>();
  for (const donId of user.donationIds) {
    const don = state.donations[donId];
    if (don) userFundraiserIds.add(don.fundraiserId);
  }

  if (userFundraiserIds.size === 0) {
    // Cold start: fall back to same-community fundraisers
    return getCommunityFallback(userId, state, limit);
  }

  // Compute Jaccard similarity with all other users
  const similarities: Array<{ userId: string; similarity: number }> = [];

  for (const otherUser of Object.values(state.users)) {
    if (otherUser.id === userId) continue;

    const otherFundraiserIds = new Set<string>();
    for (const donId of otherUser.donationIds) {
      const don = state.donations[donId];
      if (don) otherFundraiserIds.add(don.fundraiserId);
    }

    if (otherFundraiserIds.size === 0) continue;

    // Jaccard: |A ∩ B| / |A ∪ B|
    let intersection = 0;
    userFundraiserIds.forEach((fId) => {
      if (otherFundraiserIds.has(fId)) intersection++;
    });
    const unionSet = new Set(Array.from(userFundraiserIds).concat(Array.from(otherFundraiserIds)));
    const union = unionSet.size;
    const similarity = union > 0 ? intersection / union : 0;

    if (similarity > 0) {
      similarities.push({ userId: otherUser.id, similarity });
    }
  }

  similarities.sort((a, b) => b.similarity - a.similarity);
  const topSimilar = similarities.slice(0, 10);

  // Collect fundraisers from similar users that target hasn't donated to
  const candidateScores = new Map<string, { score: number; recommender: string }>();

  for (const { userId: simUserId, similarity } of topSimilar) {
    const simUser = state.users[simUserId];
    for (const donId of simUser.donationIds) {
      const don = state.donations[donId];
      if (!don) continue;
      if (userFundraiserIds.has(don.fundraiserId)) continue; // already supported

      const existing = candidateScores.get(don.fundraiserId);
      const newScore = similarity;
      if (!existing || newScore > existing.score) {
        candidateScores.set(don.fundraiserId, { score: newScore, recommender: simUser.name });
      }
    }
  }

  // Rank by similarity score × fundraiser momentum
  const results: RecommendedFundraiser[] = [];
  for (const [fundId, { score, recommender }] of Array.from(candidateScores.entries())) {
    const fundraiser = state.fundraisers[fundId];
    if (!fundraiser) continue;
    const momentum = Math.max(fundraiser.donationVelocity ?? 1, 1);
    results.push({
      fundraiser,
      score: score * Math.log2(momentum + 1),
      reason: `People like you also supported this — recommended via ${recommender}`,
    });
  }

  results.sort((a, b) => b.score - a.score);

  if (results.length < limit) {
    // Supplement with community/category fallback
    const fallback = getCommunityFallback(userId, state, limit - results.length, new Set(results.map((r) => r.fundraiser.id)));
    results.push(...fallback);
  }

  return results.slice(0, limit);
}

function getCommunityFallback(
  userId: string,
  state: Store,
  limit: number,
  exclude = new Set<string>()
): RecommendedFundraiser[] {
  const user = state.users[userId];
  if (!user) return [];

  const userFundraiserIds = new Set<string>();
  for (const donId of user.donationIds) {
    const don = state.donations[donId];
    if (don) userFundraiserIds.add(don.fundraiserId);
  }

  // Get fundraisers from user's communities that they haven't donated to
  const results: RecommendedFundraiser[] = [];
  for (const commId of user.communityIds) {
    const community = state.communities[commId];
    if (!community) continue;
    for (const fundId of community.fundraiserIds) {
      if (userFundraiserIds.has(fundId) || exclude.has(fundId)) continue;
      const fundraiser = state.fundraisers[fundId];
      if (!fundraiser) continue;
      results.push({
        fundraiser,
        score: 0.5,
        reason: `From your ${community.name} community`,
      });
    }
  }

  return results.slice(0, limit);
}
