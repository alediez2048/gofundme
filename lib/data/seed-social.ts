/**
 * Social seed data (FR-033).
 * Follow graph, feed events, and engagement data to populate the feed on first load.
 */

import type { Comment, EngagementSummary, FeedEvent, FollowRelationship } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysAgo(d: number, hours = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - d);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

function emptyEngagement(): EngagementSummary {
  return { heartCount: 0, commentCount: 0, shareCount: 0, heartedByUserIds: [], comments: [], bookmarkedByUserIds: [] };
}

function withHearts(eng: EngagementSummary, userIds: string[]): EngagementSummary {
  return { ...eng, heartCount: userIds.length, heartedByUserIds: userIds };
}

function withComments(eng: EngagementSummary, comments: Comment[]): EngagementSummary {
  return { ...eng, commentCount: comments.length, comments };
}

function withShares(eng: EngagementSummary, count: number): EngagementSummary {
  return { ...eng, shareCount: count };
}

// ---------------------------------------------------------------------------
// Follow relationships (~20)
// ---------------------------------------------------------------------------

export const seedFollowRelationships: FollowRelationship[] = [
  // Priya (user-6) follows 5 people
  { followerId: "user-6", followeeId: "user-1", createdAt: daysAgo(28) },
  { followerId: "user-6", followeeId: "user-2", createdAt: daysAgo(27) },
  { followerId: "user-6", followeeId: "user-3", createdAt: daysAgo(25) },
  { followerId: "user-6", followeeId: "user-4", createdAt: daysAgo(20) },
  { followerId: "user-6", followeeId: "user-5", createdAt: daysAgo(18) },
  // Reciprocal follows back to Priya
  { followerId: "user-1", followeeId: "user-6", createdAt: daysAgo(26) },
  { followerId: "user-3", followeeId: "user-6", createdAt: daysAgo(24) },
  { followerId: "user-4", followeeId: "user-6", createdAt: daysAgo(19) },
  // Organizer network
  { followerId: "user-1", followeeId: "user-2", createdAt: daysAgo(30) },
  { followerId: "user-1", followeeId: "user-3", createdAt: daysAgo(29) },
  { followerId: "user-2", followeeId: "user-1", createdAt: daysAgo(30) },
  { followerId: "user-2", followeeId: "user-3", createdAt: daysAgo(28) },
  { followerId: "user-3", followeeId: "user-1", createdAt: daysAgo(28) },
  // Cross-community connections
  { followerId: "user-5", followeeId: "user-3", createdAt: daysAgo(22) },
  { followerId: "user-4", followeeId: "user-5", createdAt: daysAgo(21) },
  { followerId: "user-7", followeeId: "user-1", createdAt: daysAgo(15) },
  { followerId: "user-7", followeeId: "user-6", createdAt: daysAgo(14) },
  { followerId: "user-8", followeeId: "user-4", createdAt: daysAgo(12) },
  { followerId: "user-8", followeeId: "user-5", createdAt: daysAgo(11) },
  { followerId: "user-5", followeeId: "user-8", createdAt: daysAgo(10) },
];

// ---------------------------------------------------------------------------
// Derive follower/following maps for users
// ---------------------------------------------------------------------------

export function buildFollowMaps(): { followerIds: Record<string, string[]>; followingIds: Record<string, string[]> } {
  const followerIds: Record<string, string[]> = {};
  const followingIds: Record<string, string[]> = {};
  for (const r of seedFollowRelationships) {
    if (!followingIds[r.followerId]) followingIds[r.followerId] = [];
    if (!followerIds[r.followeeId]) followerIds[r.followeeId] = [];
    followingIds[r.followerId].push(r.followeeId);
    followerIds[r.followeeId].push(r.followerId);
  }
  return { followerIds, followingIds };
}

// ---------------------------------------------------------------------------
// Feed events (~30)
// ---------------------------------------------------------------------------

const cmt = (id: string, authorId: string, text: string, createdAt: string, parentId?: string): Comment => ({
  id, authorId, text, createdAt, ...(parentId ? { parentId } : {}),
});

export const seedFeedEvents: FeedEvent[] = [
  // --- Fundraiser launches (5) ---
  {
    id: "sevt-1", type: "fundraiser_launch", actorId: "user-1", subjectId: "fund-1", subjectType: "fundraiser",
    metadata: { title: "Real-Time Alerts for Wildfire Safety", goalAmount: 25000, causeCategory: "Disaster Relief & Wildfire Safety" },
    engagement: withHearts(withShares(emptyEngagement(), 5), ["user-2", "user-3", "user-6", "user-7"]),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(28, 6), communityId: "comm-1", fundraiserId: "fund-1",
  },
  {
    id: "sevt-2", type: "fundraiser_launch", actorId: "user-3", subjectId: "fund-2", subjectType: "fundraiser",
    metadata: { title: "Firefighter Equipment Drive", goalAmount: 15000, causeCategory: "Disaster Relief & Wildfire Safety" },
    engagement: withHearts(emptyEngagement(), ["user-1", "user-6", "user-2"]),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(27, 3), communityId: "comm-1", fundraiserId: "fund-2",
  },
  {
    id: "sevt-3", type: "fundraiser_launch", actorId: "user-2", subjectId: "fund-3", subjectType: "fundraiser",
    metadata: { title: "Community Evacuation Hub", goalAmount: 12000, causeCategory: "Disaster Relief & Wildfire Safety" },
    engagement: withHearts(emptyEngagement(), ["user-1", "user-6"]),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(26, 2), communityId: "comm-1", fundraiserId: "fund-3",
  },
  {
    id: "sevt-4", type: "fundraiser_launch", actorId: "user-4", subjectId: "fund-4", subjectType: "fundraiser",
    metadata: { title: "Help the Martinez Family", goalAmount: 20000, causeCategory: "Medical & Healthcare" },
    engagement: withHearts(withShares(emptyEngagement(), 8), ["user-5", "user-6", "user-3", "user-8"]),
    causeCategory: "Medical & Healthcare", createdAt: daysAgo(25, 5), communityId: "comm-2", fundraiserId: "fund-4",
  },
  {
    id: "sevt-5", type: "fundraiser_launch", actorId: "user-5", subjectId: "fund-5", subjectType: "fundraiser",
    metadata: { title: "Cancer Treatment Support Fund", goalAmount: 30000, causeCategory: "Medical & Healthcare" },
    engagement: withHearts(emptyEngagement(), ["user-4", "user-6", "user-8"]),
    causeCategory: "Medical & Healthcare", createdAt: daysAgo(24, 4), communityId: "comm-2", fundraiserId: "fund-5",
  },

  // --- Donation events (15) ---
  {
    id: "sevt-6", type: "donation", actorId: "user-6", subjectId: "fund-1", subjectType: "fundraiser",
    metadata: { amount: 500, donorName: "Priya Sharma", message: "Stay safe out there." },
    engagement: withHearts(emptyEngagement(), ["user-1", "user-7"]),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(20, 8), communityId: "comm-1", fundraiserId: "fund-1",
  },
  {
    id: "sevt-7", type: "donation", actorId: "user-7", subjectId: "fund-1", subjectType: "fundraiser",
    metadata: { amount: 1000, donorName: "Alex Kim", message: "Thank you for doing this." },
    engagement: withHearts(
      withComments(emptyEngagement(), [
        cmt("cmt-s1", "user-1", "Thank you Alex! Every bit helps.", daysAgo(19, 4)),
        cmt("cmt-s2", "user-6", "Amazing generosity!", daysAgo(19, 2)),
      ]),
      ["user-1", "user-2", "user-6"]
    ),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(19, 6), communityId: "comm-1", fundraiserId: "fund-1",
  },
  {
    id: "sevt-8", type: "donation", actorId: "user-3", subjectId: "fund-1", subjectType: "fundraiser",
    metadata: { amount: 2500, donorName: "David Okonkwo", message: "Proud to support." },
    engagement: withHearts(withShares(emptyEngagement(), 3), ["user-1", "user-2", "user-6", "user-7", "user-8"]),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(17, 3), communityId: "comm-1", fundraiserId: "fund-1",
  },
  {
    id: "sevt-9", type: "donation", actorId: "user-6", subjectId: "fund-2", subjectType: "fundraiser",
    metadata: { amount: 1000, donorName: "Priya Sharma" },
    engagement: emptyEngagement(),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(16, 5), communityId: "comm-1", fundraiserId: "fund-2",
  },
  {
    id: "sevt-10", type: "donation", actorId: "user-2", subjectId: "fund-2", subjectType: "fundraiser",
    metadata: { amount: 2000, donorName: "Maya Chen", message: "Critical cause." },
    engagement: withHearts(emptyEngagement(), ["user-3", "user-1"]),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(15, 2), communityId: "comm-1", fundraiserId: "fund-2",
  },
  {
    id: "sevt-11", type: "donation", actorId: "user-6", subjectId: "fund-3", subjectType: "fundraiser",
    metadata: { amount: 1000, donorName: "Priya Sharma", message: "Every community needs this." },
    engagement: withHearts(emptyEngagement(), ["user-2"]),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(14, 7), communityId: "comm-1", fundraiserId: "fund-3",
  },
  {
    id: "sevt-12", type: "donation", actorId: "user-5", subjectId: "fund-4", subjectType: "fundraiser",
    metadata: { amount: 2500, donorName: "James Rivera", message: "We're with you." },
    engagement: withHearts(
      withComments(emptyEngagement(), [
        cmt("cmt-s3", "user-4", "James, this means so much to the family.", daysAgo(12, 3)),
        cmt("cmt-s4", "user-6", "What a generous community we have.", daysAgo(12, 1)),
      ]),
      ["user-4", "user-6", "user-8"]
    ),
    causeCategory: "Medical & Healthcare", createdAt: daysAgo(13, 4), communityId: "comm-2", fundraiserId: "fund-4",
  },
  {
    id: "sevt-13", type: "donation", actorId: "user-6", subjectId: "fund-4", subjectType: "fundraiser",
    metadata: { amount: 500, donorName: "Priya Sharma" },
    engagement: withHearts(emptyEngagement(), ["user-4", "user-5"]),
    causeCategory: "Medical & Healthcare", createdAt: daysAgo(11, 6), communityId: "comm-2", fundraiserId: "fund-4",
  },
  {
    id: "sevt-14", type: "donation", actorId: "user-8", subjectId: "fund-5", subjectType: "fundraiser",
    metadata: { amount: 2000, donorName: "Maria Garcia", message: "Important work." },
    engagement: withHearts(
      withComments(emptyEngagement(), [
        cmt("cmt-s5", "user-5", "Thank you Maria! This fund is growing.", daysAgo(9, 5)),
      ]),
      ["user-5", "user-4", "user-6"]
    ),
    causeCategory: "Medical & Healthcare", createdAt: daysAgo(10, 3), communityId: "comm-2", fundraiserId: "fund-5",
  },
  {
    id: "sevt-15", type: "donation", actorId: "user-1", subjectId: "fund-4", subjectType: "fundraiser",
    metadata: { amount: 1000, donorName: "Janahan Selvakumaran" },
    engagement: withHearts(emptyEngagement(), ["user-4"]),
    causeCategory: "Medical & Healthcare", createdAt: daysAgo(8, 2), communityId: "comm-2", fundraiserId: "fund-4",
  },
  {
    id: "sevt-16", type: "donation", actorId: "user-6", subjectId: "fund-5", subjectType: "fundraiser",
    metadata: { amount: 500, donorName: "Priya Sharma" },
    engagement: emptyEngagement(),
    causeCategory: "Medical & Healthcare", createdAt: daysAgo(7, 5), communityId: "comm-2", fundraiserId: "fund-5",
  },
  {
    id: "sevt-17", type: "donation", actorId: "user-3", subjectId: "fund-5", subjectType: "fundraiser",
    metadata: { amount: 500, donorName: "David Okonkwo" },
    engagement: withHearts(emptyEngagement(), ["user-5"]),
    causeCategory: "Medical & Healthcare", createdAt: daysAgo(5, 3), communityId: "comm-2", fundraiserId: "fund-5",
  },
  {
    id: "sevt-18", type: "donation", actorId: "user-7", subjectId: "fund-3", subjectType: "fundraiser",
    metadata: { amount: 250, donorName: "Alex Kim" },
    engagement: emptyEngagement(),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(3, 4), communityId: "comm-1", fundraiserId: "fund-3",
  },
  {
    id: "sevt-19", type: "donation", actorId: "user-8", subjectId: "fund-1", subjectType: "fundraiser",
    metadata: { amount: 750, donorName: "Maria Garcia" },
    engagement: withHearts(emptyEngagement(), ["user-1", "user-6"]),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(2, 6), communityId: "comm-1", fundraiserId: "fund-1",
  },
  {
    id: "sevt-20", type: "donation", actorId: "user-5", subjectId: "fund-5", subjectType: "fundraiser",
    metadata: { amount: 1500, donorName: "James Rivera", message: "For everyone fighting." },
    engagement: withHearts(
      withComments(withShares(emptyEngagement(), 4), [
        cmt("cmt-s6", "user-4", "James you're incredible!", daysAgo(1, 3)),
        cmt("cmt-s7", "user-8", "This fund is making such a difference.", daysAgo(1, 1)),
      ]),
      ["user-4", "user-6", "user-8", "user-3"]
    ),
    causeCategory: "Medical & Healthcare", createdAt: daysAgo(1, 8), communityId: "comm-2", fundraiserId: "fund-5",
  },

  // --- Milestone events (4) ---
  {
    id: "sevt-21", type: "milestone_reached", actorId: "user-1", subjectId: "fund-1", subjectType: "fundraiser",
    metadata: { percentage: "25%", amount: 6250, goalAmount: 25000 },
    engagement: withHearts(withShares(emptyEngagement(), 6), ["user-2", "user-3", "user-6", "user-7", "user-8"]),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(16, 1), communityId: "comm-1", fundraiserId: "fund-1",
  },
  {
    id: "sevt-22", type: "milestone_reached", actorId: "user-1", subjectId: "fund-1", subjectType: "fundraiser",
    metadata: { percentage: "50%", amount: 12750, goalAmount: 25000 },
    engagement: withHearts(
      withComments(withShares(emptyEngagement(), 10), [
        cmt("cmt-s8", "user-6", "Halfway there! Let's keep pushing!", daysAgo(6, 2)),
        cmt("cmt-s9", "user-3", "Incredible momentum!", daysAgo(6, 1)),
      ]),
      ["user-2", "user-3", "user-6", "user-7", "user-8", "user-4"]
    ),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(6, 4), communityId: "comm-1", fundraiserId: "fund-1",
  },
  {
    id: "sevt-23", type: "milestone_reached", actorId: "user-4", subjectId: "fund-4", subjectType: "fundraiser",
    metadata: { percentage: "50%", amount: 10000, goalAmount: 20000 },
    engagement: withHearts(withShares(emptyEngagement(), 7), ["user-5", "user-6", "user-3", "user-8", "user-1"]),
    causeCategory: "Medical & Healthcare", createdAt: daysAgo(9, 2), communityId: "comm-2", fundraiserId: "fund-4",
  },
  {
    id: "sevt-24", type: "milestone_reached", actorId: "user-3", subjectId: "fund-2", subjectType: "fundraiser",
    metadata: { percentage: "25%", amount: 3750, goalAmount: 15000 },
    engagement: withHearts(emptyEngagement(), ["user-1", "user-2", "user-6"]),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(14, 1), communityId: "comm-1", fundraiserId: "fund-2",
  },

  // --- Community milestones (2) ---
  {
    id: "sevt-25", type: "community_milestone", actorId: "comm-1", subjectId: "comm-1", subjectType: "community",
    metadata: { threshold: "$10K", amount: 10500 },
    engagement: withHearts(withShares(emptyEngagement(), 12), ["user-1", "user-2", "user-3", "user-6", "user-7", "user-8"]),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(12, 2), communityId: "comm-1",
  },
  {
    id: "sevt-26", type: "community_milestone", actorId: "comm-2", subjectId: "comm-2", subjectType: "community",
    metadata: { threshold: "$10K", amount: 11200 },
    engagement: withHearts(withShares(emptyEngagement(), 8), ["user-4", "user-5", "user-6", "user-8", "user-3"]),
    causeCategory: "Medical & Healthcare", createdAt: daysAgo(8, 5), communityId: "comm-2",
  },

  // --- Community join events (3) ---
  {
    id: "sevt-27", type: "community_join", actorId: "user-7", subjectId: "comm-1", subjectType: "community",
    metadata: { communityName: "Watch Duty" },
    engagement: withHearts(emptyEngagement(), ["user-1"]),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(22, 3), communityId: "comm-1",
  },
  {
    id: "sevt-28", type: "community_join", actorId: "user-8", subjectId: "comm-2", subjectType: "community",
    metadata: { communityName: "Medical Relief Network" },
    engagement: emptyEngagement(),
    causeCategory: "Medical & Healthcare", createdAt: daysAgo(20, 1), communityId: "comm-2",
  },
  {
    id: "sevt-29", type: "community_join", actorId: "user-6", subjectId: "comm-2", subjectType: "community",
    metadata: { communityName: "Medical Relief Network" },
    engagement: withHearts(emptyEngagement(), ["user-4", "user-5"]),
    causeCategory: "Medical & Healthcare", createdAt: daysAgo(18, 5), communityId: "comm-2",
  },

  // --- Profile milestone (1) ---
  {
    id: "sevt-30", type: "profile_milestone", actorId: "user-1", subjectId: "user-1", subjectType: "user",
    metadata: { followerCount: 5, threshold: 5 },
    engagement: withHearts(emptyEngagement(), ["user-6", "user-2", "user-3"]),
    causeCategory: "Disaster Relief & Wildfire Safety", createdAt: daysAgo(15, 6),
  },
];

// Priya's bookmarks — 3 events she bookmarked
export const priyaBookmarkedIds = ["sevt-7", "sevt-12", "sevt-22"];
