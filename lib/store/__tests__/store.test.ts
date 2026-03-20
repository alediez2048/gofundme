import { describe, it, expect, beforeEach } from "vitest";
import { TEST_HERO_IMAGE_URL } from "@/lib/data";
import { createFundRightStore, isFollowing, getFollowers, getFollowing, type Store } from "@/lib/store";

let store: ReturnType<typeof createFundRightStore>;
const getState = () => store.getState();

/** Helpers to grab known seed entities. */
function firstFundraiser() {
  return Object.values(getState().fundraisers)[0];
}
function firstUser() {
  return Object.values(getState().users)[0];
}
function secondUser() {
  return Object.values(getState().users)[1];
}

beforeEach(() => {
  store = createFundRightStore();
});

// ---------------------------------------------------------------------------
// addDonation
// ---------------------------------------------------------------------------
describe("addDonation", () => {
  it("creates a donation and updates fundraiser, donor, and community atomically", () => {
    const fund = firstFundraiser();
    const donor = secondUser();
    const community = fund.communityId
      ? getState().communities[fund.communityId]
      : undefined;

    const prevRaised = fund.raisedAmount;
    const prevDonorTotal = donor.totalDonated;
    const prevCommunityRaised = community?.totalRaised ?? 0;
    const prevDonationCount = fund.donationCount;

    const donationId = getState().addDonation(fund.id, 75, donor.id, "Great cause!");

    expect(donationId).toBeTruthy();

    const state = getState();

    // Donation exists
    const donation = state.donations[donationId!];
    expect(donation).toBeDefined();
    expect(donation.amount).toBe(75);
    expect(donation.donorId).toBe(donor.id);
    expect(donation.fundraiserId).toBe(fund.id);
    expect(donation.message).toBe("Great cause!");
    expect(donation.createdAt).toBeTruthy();

    // Fundraiser updated
    const updatedFund = state.fundraisers[fund.id];
    expect(updatedFund.raisedAmount).toBe(prevRaised + 75);
    expect(updatedFund.donationCount).toBe(prevDonationCount + 1);
    expect(updatedFund.donationIds).toContain(donationId);

    // Donor updated
    const updatedDonor = state.users[donor.id];
    expect(updatedDonor.totalDonated).toBe(prevDonorTotal + 75);
    expect(updatedDonor.donationIds).toContain(donationId);

    // Community updated (if applicable)
    if (fund.communityId) {
      const updatedCommunity = state.communities[fund.communityId];
      expect(updatedCommunity.totalRaised).toBe(prevCommunityRaised + 75);
      expect(updatedCommunity.donationCount).toBeGreaterThan(0);
    }
  });

  it("handles overfunding — raisedAmount can exceed goalAmount", () => {
    const fund = firstFundraiser();
    const donor = secondUser();
    const overfundAmount = fund.goalAmount * 2;

    const donationId = getState().addDonation(fund.id, overfundAmount, donor.id);

    expect(donationId).toBeTruthy();
    const updatedFund = getState().fundraisers[fund.id];
    expect(updatedFund.raisedAmount).toBeGreaterThan(fund.goalAmount);
  });

  it("returns null for invalid fundraiser ID", () => {
    const donor = firstUser();
    const prevState = getState();

    const result = getState().addDonation("nonexistent-fund", 50, donor.id);

    expect(result).toBeNull();
    // State unchanged — same fundraiser count
    expect(Object.keys(getState().donations).length).toBe(
      Object.keys(prevState.donations).length
    );
  });

  it("returns null for invalid donor ID", () => {
    const fund = firstFundraiser();
    const prevState = getState();

    const result = getState().addDonation(fund.id, 50, "nonexistent-user");

    expect(result).toBeNull();
    expect(Object.keys(getState().donations).length).toBe(
      Object.keys(prevState.donations).length
    );
  });

  it("returns null for zero amount", () => {
    const fund = firstFundraiser();
    const donor = firstUser();

    expect(getState().addDonation(fund.id, 0, donor.id)).toBeNull();
  });

  it("returns null for negative amount", () => {
    const fund = firstFundraiser();
    const donor = firstUser();

    expect(getState().addDonation(fund.id, -10, donor.id)).toBeNull();
  });

  it("creates donation without message when message is omitted", () => {
    const fund = firstFundraiser();
    const donor = secondUser();

    const donationId = getState().addDonation(fund.id, 25, donor.id);

    expect(donationId).toBeTruthy();
    const donation = getState().donations[donationId!];
    expect(donation.message).toBeUndefined();
  });

  it("does not update community when fundraiser has no communityId", () => {
    // Create a fundraiser without a community
    const organizer = firstUser();
    const result = getState().addFundraiser({
      title: "Solo Fundraiser",
      goalAmount: 1000,
      story: "A test fundraiser with no community.",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });
    expect(result).toBeTruthy();

    const communitySnapshot = { ...getState().communities };
    const donor = secondUser();

    getState().addDonation(result!.id, 50, donor.id);

    // Communities should be unchanged
    for (const [id, community] of Object.entries(getState().communities)) {
      if (communitySnapshot[id]) {
        expect(community.totalRaised).toBe(communitySnapshot[id].totalRaised);
      }
    }
  });

  it("handles multiple sequential donations correctly", () => {
    const fund = firstFundraiser();
    const donor = secondUser();
    const initialRaised = fund.raisedAmount;
    const initialCount = fund.donationCount;

    getState().addDonation(fund.id, 10, donor.id);
    getState().addDonation(fund.id, 20, donor.id);
    getState().addDonation(fund.id, 30, donor.id);

    const updated = getState().fundraisers[fund.id];
    expect(updated.raisedAmount).toBe(initialRaised + 60);
    expect(updated.donationCount).toBe(initialCount + 3);
  });
});

// ---------------------------------------------------------------------------
// addFundraiser
// ---------------------------------------------------------------------------
describe("addFundraiser", () => {
  it("creates a fundraiser with correct initial values", () => {
    const organizer = firstUser();

    const result = getState().addFundraiser({
      title: "Test Campaign",
      goalAmount: 5000,
      story: "This is a test fundraiser story.",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });

    expect(result).toBeTruthy();
    expect(result!.id).toBeTruthy();
    expect(result!.slug).toBe("test-campaign");

    const fund = getState().fundraisers[result!.id];
    expect(fund.title).toBe("Test Campaign");
    expect(fund.goalAmount).toBe(5000);
    expect(fund.raisedAmount).toBe(0);
    expect(fund.donationCount).toBe(0);
    expect(fund.donationIds).toEqual([]);
    expect(fund.organizerId).toBe(organizer.id);
    expect(fund.causeCategory).toBe("Medical & Healthcare");
  });

  it("updates community fundraiserIds and count when communityId provided", () => {
    const organizer = firstUser();
    const community = Object.values(getState().communities)[0];
    const prevCount = community.fundraiserCount;
    const prevIds = community.fundraiserIds.length;

    const result = getState().addFundraiser({
      title: "Community Fundraiser",
      goalAmount: 2000,
      story: "A fundraiser for the community.",
      organizerId: organizer.id,
      causeCategory: community.causeCategory,
      communityId: community.id,
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });

    expect(result).toBeTruthy();
    const updatedCommunity = getState().communities[community.id];
    expect(updatedCommunity.fundraiserCount).toBe(prevCount + 1);
    expect(updatedCommunity.fundraiserIds.length).toBe(prevIds + 1);
    expect(updatedCommunity.fundraiserIds).toContain(result!.id);
  });

  it("returns null for invalid organizer ID", () => {
    const prevCount = Object.keys(getState().fundraisers).length;

    const result = getState().addFundraiser({
      title: "Bad Organizer",
      goalAmount: 1000,
      story: "Should not be created.",
      organizerId: "nonexistent-user",
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });

    expect(result).toBeNull();
    expect(Object.keys(getState().fundraisers).length).toBe(prevCount);
  });

  it("generates unique slugs for duplicate titles", () => {
    const organizer = firstUser();
    const params = {
      title: "Duplicate Title",
      goalAmount: 1000,
      story: "First fundraiser.",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare" as const,
      heroImageUrl: TEST_HERO_IMAGE_URL,
    };

    const first = getState().addFundraiser(params);
    const second = getState().addFundraiser({ ...params, story: "Second fundraiser." });

    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    expect(first!.slug).toBe("duplicate-title");
    expect(second!.slug).toBe("duplicate-title-2");
    expect(first!.slug).not.toBe(second!.slug);
  });

  it("handles title with special characters in slug", () => {
    const organizer = firstUser();

    const result = getState().addFundraiser({
      title: "Help! Save the $100 cats & dogs!!!",
      goalAmount: 500,
      story: "Testing special characters.",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });

    expect(result).toBeTruthy();
    // Slug should only contain lowercase letters, numbers, and hyphens
    expect(result!.slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("trims whitespace from title and story", () => {
    const organizer = firstUser();

    const result = getState().addFundraiser({
      title: "  Spacey Title  ",
      goalAmount: 1000,
      story: "  Spacey story.  ",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });

    expect(result).toBeTruthy();
    const fund = getState().fundraisers[result!.id];
    expect(fund.title).toBe("Spacey Title");
    expect(fund.story).toBe("Spacey story.");
  });
});

// ---------------------------------------------------------------------------
// follow / unfollow (FR-029)
// ---------------------------------------------------------------------------
describe("follow / unfollow", () => {
  it("creates relationship and updates both users", () => {
    const u1 = firstUser();
    const u2 = secondUser();

    getState().follow(u1.id, u2.id);

    const state = getState();
    expect(state.followRelationships).toHaveLength(1);
    expect(state.followRelationships[0].followerId).toBe(u1.id);
    expect(state.followRelationships[0].followeeId).toBe(u2.id);
    expect(state.users[u1.id].followingIds).toContain(u2.id);
    expect(state.users[u2.id].followerIds).toContain(u1.id);
  });

  it("unfollow removes relationship and updates both users", () => {
    const u1 = firstUser();
    const u2 = secondUser();

    getState().follow(u1.id, u2.id);
    getState().unfollow(u1.id, u2.id);

    const state = getState();
    expect(state.followRelationships).toHaveLength(0);
    expect(state.users[u1.id].followingIds ?? []).not.toContain(u2.id);
    expect(state.users[u2.id].followerIds ?? []).not.toContain(u1.id);
  });

  it("double-follow is idempotent", () => {
    const u1 = firstUser();
    const u2 = secondUser();

    getState().follow(u1.id, u2.id);
    getState().follow(u1.id, u2.id);

    expect(getState().followRelationships).toHaveLength(1);
  });

  it("self-follow is prevented", () => {
    const u1 = firstUser();

    getState().follow(u1.id, u1.id);

    expect(getState().followRelationships).toHaveLength(0);
  });

  it("follow with invalid user is a no-op", () => {
    const u1 = firstUser();

    getState().follow(u1.id, "nonexistent");
    getState().follow("nonexistent", u1.id);

    expect(getState().followRelationships).toHaveLength(0);
  });

  it("unfollow non-existing relationship is a no-op", () => {
    const u1 = firstUser();
    const u2 = secondUser();

    getState().unfollow(u1.id, u2.id);

    expect(getState().followRelationships).toHaveLength(0);
  });

  it("selectors return correct data", () => {
    const u1 = firstUser();
    const u2 = secondUser();

    getState().follow(u1.id, u2.id);

    const state = getState();
    expect(isFollowing(state, u1.id, u2.id)).toBe(true);
    expect(isFollowing(state, u2.id, u1.id)).toBe(false);
    expect(getFollowers(state, u2.id).map((u) => u.id)).toContain(u1.id);
    expect(getFollowing(state, u1.id).map((u) => u.id)).toContain(u2.id);
  });
});

// ---------------------------------------------------------------------------
// Engagement actions (FR-030)
// ---------------------------------------------------------------------------

import type { FeedEvent } from "@/lib/data";

/** Insert a minimal test FeedEvent directly into the store. */
function seedFeedEvent(id: string): FeedEvent {
  const event: FeedEvent = {
    id,
    type: "donation",
    actorId: firstUser().id,
    subjectId: firstFundraiser().id,
    subjectType: "fundraiser",
    metadata: {},
    engagement: {
      heartCount: 0,
      commentCount: 0,
      shareCount: 0,
      heartedByUserIds: [],
      comments: [],
      bookmarkedByUserIds: [],
    },
    causeCategory: "Medical & Healthcare",
    createdAt: new Date().toISOString(),
  };
  store.setState((s) => ({
    feedEvents: { ...s.feedEvents, [id]: event },
  }));
  return event;
}

describe("engagement actions", () => {
  it("toggleHeart adds userId and increments count", () => {
    seedFeedEvent("evt-1");
    const userId = firstUser().id;

    getState().toggleHeart("evt-1", userId);

    const eng = getState().feedEvents["evt-1"].engagement;
    expect(eng.heartCount).toBe(1);
    expect(eng.heartedByUserIds).toContain(userId);
  });

  it("toggleHeart removes userId on second call (unheart)", () => {
    seedFeedEvent("evt-1");
    const userId = firstUser().id;

    getState().toggleHeart("evt-1", userId);
    getState().toggleHeart("evt-1", userId);

    const eng = getState().feedEvents["evt-1"].engagement;
    expect(eng.heartCount).toBe(0);
    expect(eng.heartedByUserIds).not.toContain(userId);
  });

  it("addComment creates comment with correct fields and increments count", () => {
    seedFeedEvent("evt-1");
    const authorId = firstUser().id;

    const commentId = getState().addComment("evt-1", authorId, "Great cause!");

    expect(commentId).toBeTruthy();
    const eng = getState().feedEvents["evt-1"].engagement;
    expect(eng.commentCount).toBe(1);
    expect(eng.comments).toHaveLength(1);
    expect(eng.comments[0].authorId).toBe(authorId);
    expect(eng.comments[0].text).toBe("Great cause!");
    expect(eng.comments[0].id).toBe(commentId);
  });

  it("addComment supports parentId for threading", () => {
    seedFeedEvent("evt-1");
    const authorId = firstUser().id;

    const parentId = getState().addComment("evt-1", authorId, "Parent");
    const replyId = getState().addComment("evt-1", authorId, "Reply", parentId!);

    const eng = getState().feedEvents["evt-1"].engagement;
    expect(eng.comments[1].parentId).toBe(parentId);
    expect(replyId).toBeTruthy();
  });

  it("toggleBookmark toggles correctly", () => {
    seedFeedEvent("evt-1");
    const userId = firstUser().id;

    getState().toggleBookmark("evt-1", userId);
    expect(getState().feedEvents["evt-1"].engagement.bookmarkedByUserIds).toContain(userId);
    expect(getState().users[userId].bookmarkedIds).toContain("evt-1");

    getState().toggleBookmark("evt-1", userId);
    expect(getState().feedEvents["evt-1"].engagement.bookmarkedByUserIds).not.toContain(userId);
    expect(getState().users[userId].bookmarkedIds ?? []).not.toContain("evt-1");
  });

  it("incrementShare increments count", () => {
    seedFeedEvent("evt-1");

    getState().incrementShare("evt-1");
    getState().incrementShare("evt-1");

    expect(getState().feedEvents["evt-1"].engagement.shareCount).toBe(2);
  });

  it("all actions are no-ops for non-existent events", () => {
    const prevState = getState();

    getState().toggleHeart("nope", "user-1");
    getState().toggleBookmark("nope", "user-1");
    getState().incrementShare("nope");
    const commentResult = getState().addComment("nope", "user-1", "text");

    expect(commentResult).toBeNull();
    expect(getState().feedEvents).toEqual(prevState.feedEvents);
  });
});

// ---------------------------------------------------------------------------
// FeedEvent generation (FR-031)
// ---------------------------------------------------------------------------
describe("feed event generation", () => {
  it("addDonation emits a donation FeedEvent", () => {
    const fund = firstFundraiser();
    const donor = secondUser();

    getState().addDonation(fund.id, 50, donor.id, "Love it");

    const events = Object.values(getState().feedEvents);
    const donationEvents = events.filter((e) => e.type === "donation");
    expect(donationEvents.length).toBeGreaterThanOrEqual(1);
    const evt = donationEvents[donationEvents.length - 1];
    expect(evt.actorId).toBe(donor.id);
    expect(evt.subjectId).toBe(fund.id);
    expect(evt.metadata.amount).toBe(50);
  });

  it("addFundraiser emits a fundraiser_launch FeedEvent", () => {
    const organizer = firstUser();

    const result = getState().addFundraiser({
      title: "Launch Test",
      goalAmount: 1000,
      story: "Testing launch event",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });

    expect(result).toBeTruthy();
    const events = Object.values(getState().feedEvents);
    const launchEvents = events.filter((e) => e.type === "fundraiser_launch");
    expect(launchEvents.length).toBeGreaterThanOrEqual(1);
    expect(launchEvents[launchEvents.length - 1].actorId).toBe(organizer.id);
  });

  it("detects fundraiser milestones at 25/50/75/100%", () => {
    const organizer = firstUser();
    const donor = secondUser();

    const result = getState().addFundraiser({
      title: "Milestone Test",
      goalAmount: 100,
      story: "Testing milestones",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });
    const fundId = result!.id;

    // Donate 25 → 25% milestone
    getState().addDonation(fundId, 25, donor.id);
    expect(getState().fundraisers[fundId].milestones).toHaveLength(1);
    expect(getState().fundraisers[fundId].milestones![0].type).toBe("25%");

    // Donate 25 more → 50% milestone
    getState().addDonation(fundId, 25, donor.id);
    expect(getState().fundraisers[fundId].milestones).toHaveLength(2);

    // Donate 50 more → 75% and 100% milestones
    getState().addDonation(fundId, 50, donor.id);
    expect(getState().fundraisers[fundId].milestones).toHaveLength(4);

    // Verify milestone events were emitted
    const milestoneEvents = Object.values(getState().feedEvents).filter(
      (e) => e.type === "milestone_reached" && e.subjectId === fundId
    );
    expect(milestoneEvents).toHaveLength(4);
  });

  it("does not emit duplicate milestones", () => {
    const organizer = firstUser();
    const donor = secondUser();

    const result = getState().addFundraiser({
      title: "No Dup Test",
      goalAmount: 100,
      story: "Test",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });
    const fundId = result!.id;

    getState().addDonation(fundId, 30, donor.id); // crosses 25%
    getState().addDonation(fundId, 5, donor.id);  // still above 25%, no new milestone

    expect(getState().fundraisers[fundId].milestones).toHaveLength(1);
  });

  it("joinCommunity emits community_join event", () => {
    const users = Object.values(getState().users);
    const community = Object.values(getState().communities)[0];
    // Find a user not already in this community
    const outsider = users.find((u) => !community.memberIds.includes(u.id));
    if (!outsider) return; // skip if all users are members

    const prevMembers = community.memberCount;
    getState().joinCommunity(outsider.id, community.id);

    expect(getState().communities[community.id].memberCount).toBe(prevMembers + 1);
    const joinEvents = Object.values(getState().feedEvents).filter(
      (e) => e.type === "community_join" && e.actorId === outsider.id
    );
    expect(joinEvents).toHaveLength(1);
  });

  it("joinCommunity is idempotent for existing members", () => {
    const community = Object.values(getState().communities)[0];
    const existingMember = community.memberIds[0];

    const prevCount = community.memberCount;
    getState().joinCommunity(existingMember, community.id);

    expect(getState().communities[community.id].memberCount).toBe(prevCount);
  });
});
