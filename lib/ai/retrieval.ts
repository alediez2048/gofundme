/**
 * FR-020: RAG retrieval module — structured queries against the Zustand store.
 * Extracts and generalizes the context-building pattern from cause-intelligence.
 */

import type { Community, Donation, Fundraiser } from "@/lib/data";

const MAX_STORY_CHARS = 800;

export interface RetrievalContext {
  text: string;
  sourceCount: number;
  tokenEstimate: number;
}

/**
 * Build RAG context for a community by pulling fundraiser stories
 * and donor messages. Used by cause-intelligence and discovery features.
 */
export function buildCommunityContext(
  community: Community,
  fundraisers: Fundraiser[],
  donations: Donation[]
): RetrievalContext {
  const fundraiserIds = new Set(community.fundraiserIds ?? []);
  const donationsByFund = new Map<string, Donation[]>();
  for (const d of donations) {
    if (fundraiserIds.has(d.fundraiserId)) {
      const list = donationsByFund.get(d.fundraiserId) ?? [];
      list.push(d);
      donationsByFund.set(d.fundraiserId, list);
    }
  }

  const parts: string[] = [
    `Community: ${community.name}`,
    `Category: ${community.causeCategory}`,
    `Description: ${community.description}`,
    "",
    "--- Fundraiser stories and donor messages ---",
  ];

  let sourceCount = 0;
  for (const f of fundraisers) {
    const storyExcerpt =
      f.story.length > MAX_STORY_CHARS
        ? f.story.slice(0, MAX_STORY_CHARS) + "..."
        : f.story;
    parts.push(`[Fundraiser: ${f.title}]\n${storyExcerpt}`);
    sourceCount++;

    const fundDonations = (donationsByFund.get(f.id) ?? [])
      .filter((d) => d.message)
      .slice(0, 10)
      .map((d) => d.message as string);
    if (fundDonations.length > 0) {
      parts.push("Donor messages: " + fundDonations.join(" | "));
    }
    parts.push("");
  }

  const text = parts.join("\n");
  return {
    text,
    sourceCount,
    tokenEstimate: Math.ceil(text.length / 4),
  };
}

/**
 * Build RAG context for an organizer's trust summary by pulling their
 * fundraiser history and community memberships.
 */
export function buildOrganizerContext(
  organizerId: string,
  fundraisers: Fundraiser[],
  communities: Community[]
): RetrievalContext {
  const orgFundraisers = fundraisers.filter(
    (f) => f.organizerId === organizerId
  );
  const orgCommunityIds = new Set(orgFundraisers.map((f) => f.communityId).filter(Boolean));
  const orgCommunities = communities.filter((c) => orgCommunityIds.has(c.id));

  const totalRaised = orgFundraisers.reduce(
    (sum, f) => sum + f.raisedAmount,
    0
  );
  const totalDonations = orgFundraisers.reduce(
    (sum, f) => sum + f.donationCount,
    0
  );

  const parts: string[] = [
    `Organizer fundraisers: ${orgFundraisers.length}`,
    `Total raised: $${totalRaised.toLocaleString()}`,
    `Total donations received: ${totalDonations}`,
    `Communities: ${orgCommunities.map((c) => c.name).join(", ") || "none"}`,
    "",
    "Fundraiser titles:",
    ...orgFundraisers.map(
      (f) =>
        `- ${f.title} ($${f.raisedAmount.toLocaleString()} of $${f.goalAmount.toLocaleString()})`
    ),
  ];

  const text = parts.join("\n");
  return {
    text,
    sourceCount: orgFundraisers.length,
    tokenEstimate: Math.ceil(text.length / 4),
  };
}
