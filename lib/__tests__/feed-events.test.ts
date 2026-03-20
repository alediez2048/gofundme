/**
 * FR-061: P0 Unit Tests — Feed event generation, engagement, follows.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createFundRightStore } from "@/lib/store";
import { TEST_HERO_IMAGE_URL } from "@/lib/data";

let store: ReturnType<typeof createFundRightStore>;
const getState = () => store.getState();

beforeEach(() => {
  store = createFundRightStore();
});

// ---------------------------------------------------------------------------
// Event generation from donations (~10 tests)
// ---------------------------------------------------------------------------
describe("donation event generation", () => {
  function createTestFundraiser(goalAmount = 1000) {
    const organizer = Object.values(getState().users)[0];
    return getState().addFundraiser({
      title: "Event Gen Test",
      goalAmount,
      story: "Testing",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });
  }

  it("addDonation creates a donation FeedEvent", () => {
    const result = createTestFundraiser();
    const donor = Object.values(getState().users)[1];
    const prevEventCount = Object.keys(getState().feedEvents).length;

    getState().addDonation(result!.id, 100, donor.id, "Test");

    const newEvents = Object.values(getState().feedEvents).filter(
      (e) => e.type === "donation" && e.subjectId === result!.id
    );
    expect(newEvents.length).toBeGreaterThan(0);
    expect(Object.keys(getState().feedEvents).length).toBeGreaterThan(prevEventCount);
  });

  it("donation event has correct metadata", () => {
    const result = createTestFundraiser();
    const donor = Object.values(getState().users)[1];

    getState().addDonation(result!.id, 250, donor.id, "For the cause");

    const events = Object.values(getState().feedEvents).filter(
      (e) => e.type === "donation" && e.metadata.amount === 250
    );
    expect(events.length).toBeGreaterThanOrEqual(1);
    const evt = events[events.length - 1];
    expect(evt.actorId).toBe(donor.id);
    expect(evt.metadata.donorName).toBe(donor.name);
    expect(evt.metadata.message).toBe("For the cause");
  });

  it("donation event has default engagement (zeroed)", () => {
    const result = createTestFundraiser();
    const donor = Object.values(getState().users)[1];

    getState().addDonation(result!.id, 50, donor.id);

    const events = Object.values(getState().feedEvents).filter(
      (e) => e.type === "donation" && e.subjectId === result!.id
    );
    const evt = events[events.length - 1];
    expect(evt.engagement.heartCount).toBe(0);
    expect(evt.engagement.comments).toHaveLength(0);
  });

  it("25% milestone triggers at correct threshold", () => {
    const result = createTestFundraiser(100);
    const donor = Object.values(getState().users)[1];

    getState().addDonation(result!.id, 25, donor.id);

    const milestones = getState().fundraisers[result!.id].milestones ?? [];
    expect(milestones.some((m) => m.type === "25%")).toBe(true);
  });

  it("multiple milestones trigger in single large donation", () => {
    const result = createTestFundraiser(100);
    const donor = Object.values(getState().users)[1];

    getState().addDonation(result!.id, 80, donor.id);

    const milestones = getState().fundraisers[result!.id].milestones ?? [];
    expect(milestones.some((m) => m.type === "25%")).toBe(true);
    expect(milestones.some((m) => m.type === "50%")).toBe(true);
    expect(milestones.some((m) => m.type === "75%")).toBe(true);
  });

  it("100% milestone triggers when goal reached", () => {
    const result = createTestFundraiser(100);
    const donor = Object.values(getState().users)[1];

    getState().addDonation(result!.id, 100, donor.id);

    const milestones = getState().fundraisers[result!.id].milestones ?? [];
    expect(milestones.some((m) => m.type === "100%")).toBe(true);
  });

  it("milestone events are emitted as FeedEvents", () => {
    const result = createTestFundraiser(100);
    const donor = Object.values(getState().users)[1];

    getState().addDonation(result!.id, 50, donor.id);

    const milestoneEvents = Object.values(getState().feedEvents).filter(
      (e) => e.type === "milestone_reached" && e.subjectId === result!.id
    );
    expect(milestoneEvents.length).toBeGreaterThan(0);
  });

  it("addFundraiser emits fundraiser_launch event", () => {
    const prevEvents = Object.values(getState().feedEvents).filter((e) => e.type === "fundraiser_launch");
    createTestFundraiser();
    const newEvents = Object.values(getState().feedEvents).filter((e) => e.type === "fundraiser_launch");
    expect(newEvents.length).toBeGreaterThan(prevEvents.length);
  });
});

// ---------------------------------------------------------------------------
// Engagement actions (~10 tests)
// ---------------------------------------------------------------------------
describe("engagement actions", () => {
  function seedEvent(id: string) {
    const event = {
      id,
      type: "donation" as const,
      actorId: Object.values(getState().users)[0].id,
      subjectId: Object.values(getState().fundraisers)[0]?.id ?? "fund-1",
      subjectType: "fundraiser" as const,
      metadata: {},
      engagement: { heartCount: 0, commentCount: 0, shareCount: 0, heartedByUserIds: [] as string[], comments: [] as any[], bookmarkedByUserIds: [] as string[] },
      causeCategory: "Medical & Healthcare" as const,
      createdAt: new Date().toISOString(),
    };
    store.setState((s) => ({ feedEvents: { ...s.feedEvents, [id]: event } }));
  }

  it("toggleHeart increments on first call", () => {
    seedEvent("e1");
    getState().toggleHeart("e1", "user-1");
    expect(getState().feedEvents["e1"].engagement.heartCount).toBe(1);
  });

  it("toggleHeart decrements on second call", () => {
    seedEvent("e1");
    getState().toggleHeart("e1", "user-1");
    getState().toggleHeart("e1", "user-1");
    expect(getState().feedEvents["e1"].engagement.heartCount).toBe(0);
  });

  it("multiple users can heart same event", () => {
    seedEvent("e1");
    getState().toggleHeart("e1", "user-1");
    getState().toggleHeart("e1", "user-2");
    expect(getState().feedEvents["e1"].engagement.heartCount).toBe(2);
  });

  it("addComment returns comment ID", () => {
    seedEvent("e1");
    const id = getState().addComment("e1", "user-1", "Nice!");
    expect(id).toBeTruthy();
    expect(id!.startsWith("cmt-")).toBe(true);
  });

  it("addComment increments count", () => {
    seedEvent("e1");
    getState().addComment("e1", "user-1", "A");
    getState().addComment("e1", "user-2", "B");
    expect(getState().feedEvents["e1"].engagement.commentCount).toBe(2);
  });

  it("toggleBookmark adds and removes", () => {
    seedEvent("e1");
    getState().toggleBookmark("e1", "user-1");
    expect(getState().feedEvents["e1"].engagement.bookmarkedByUserIds).toContain("user-1");
    getState().toggleBookmark("e1", "user-1");
    expect(getState().feedEvents["e1"].engagement.bookmarkedByUserIds).not.toContain("user-1");
  });

  it("incrementShare is additive", () => {
    seedEvent("e1");
    getState().incrementShare("e1");
    getState().incrementShare("e1");
    getState().incrementShare("e1");
    expect(getState().feedEvents["e1"].engagement.shareCount).toBe(3);
  });

  it("engagement on nonexistent event is no-op", () => {
    const before = getState().feedEvents;
    getState().toggleHeart("nope", "user-1");
    expect(getState().feedEvents).toEqual(before);
  });
});

// ---------------------------------------------------------------------------
// Follow system (~8 tests)
// ---------------------------------------------------------------------------
describe("follow system edge cases", () => {
  it("follow creates bidirectional relationship", () => {
    getState().follow("user-4", "user-7");
    expect(getState().users["user-4"].followingIds).toContain("user-7");
    expect(getState().users["user-7"].followerIds).toContain("user-4");
  });

  it("unfollow cleans up both sides", () => {
    getState().follow("user-4", "user-7");
    getState().unfollow("user-4", "user-7");
    expect((getState().users["user-4"].followingIds ?? []).includes("user-7")).toBe(false);
    expect((getState().users["user-7"].followerIds ?? []).includes("user-4")).toBe(false);
  });

  it("cannot follow self", () => {
    const before = getState().followRelationships.length;
    getState().follow("user-1", "user-1");
    expect(getState().followRelationships.length).toBe(before);
  });

  it("joinCommunity adds user to community", () => {
    const comm = Object.values(getState().communities)[0];
    const outsider = Object.values(getState().users).find((u) => !comm.memberIds.includes(u.id));
    if (!outsider) return;

    getState().joinCommunity(outsider.id, comm.id);
    expect(getState().communities[comm.id].memberIds).toContain(outsider.id);
    expect(getState().users[outsider.id].communityIds).toContain(comm.id);
  });

  it("joinCommunity emits community_join event", () => {
    const comm = Object.values(getState().communities)[0];
    const outsider = Object.values(getState().users).find((u) => !comm.memberIds.includes(u.id));
    if (!outsider) return;

    const before = Object.values(getState().feedEvents).filter((e) => e.type === "community_join").length;
    getState().joinCommunity(outsider.id, comm.id);
    const after = Object.values(getState().feedEvents).filter((e) => e.type === "community_join").length;
    expect(after).toBeGreaterThan(before);
  });

  it("currentUser defaults to user-6", () => {
    expect(getState().currentUser).toBe("user-6");
  });

  it("setCurrentUser validates user exists", () => {
    getState().setCurrentUser("nonexistent");
    expect(getState().currentUser).toBe("user-6"); // unchanged
  });

  it("setCurrentUser accepts null for logout", () => {
    getState().setCurrentUser(null);
    expect(getState().currentUser).toBeNull();
  });
});
