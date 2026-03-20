/**
 * FR-060: Test data factory functions.
 * Creates mock entities for unit testing without depending on seed data.
 */

import type {
  CauseCategory,
  Comment,
  Community,
  Donation,
  EngagementSummary,
  FeedEvent,
  Fundraiser,
  User,
} from "@/lib/data";

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-test-${++counter}`;
}

export function createMockUser(overrides: Partial<User> = {}): User {
  const id = overrides.id ?? uid("user");
  return {
    id,
    username: `user_${id}`,
    name: `Test User ${id}`,
    bio: "Test bio",
    avatar: "https://i.pravatar.cc/256?img=1",
    verified: false,
    joinDate: "2024-01-01",
    socialLinks: [],
    communityIds: [],
    donationIds: [],
    totalDonated: 0,
    ...overrides,
  };
}

export function createMockFundraiser(overrides: Partial<Fundraiser> = {}): Fundraiser {
  const id = overrides.id ?? uid("fund");
  return {
    id,
    slug: `test-fundraiser-${id}`,
    title: `Test Fundraiser ${id}`,
    story: "Test story",
    goalAmount: 10000,
    raisedAmount: 0,
    donationCount: 0,
    organizerId: "user-1",
    communityId: "comm-1",
    causeCategory: "Medical & Healthcare",
    donationIds: [],
    heroImageUrl: "https://placehold.co/800x400",
    updates: [],
    ...overrides,
  };
}

export function createMockCommunity(overrides: Partial<Community> = {}): Community {
  const id = overrides.id ?? uid("comm");
  return {
    id,
    slug: `test-community-${id}`,
    name: `Test Community ${id}`,
    description: "Test description",
    causeCategory: "Medical & Healthcare",
    bannerImageUrl: "https://placehold.co/1200x400",
    memberIds: [],
    fundraiserIds: [],
    totalRaised: 0,
    donationCount: 0,
    fundraiserCount: 0,
    memberCount: 0,
    ...overrides,
  };
}

export function createMockDonation(overrides: Partial<Donation> = {}): Donation {
  return {
    id: overrides.id ?? uid("don"),
    amount: 100,
    donorId: "user-1",
    fundraiserId: "fund-1",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockEngagement(overrides: Partial<EngagementSummary> = {}): EngagementSummary {
  return {
    heartCount: 0,
    commentCount: 0,
    shareCount: 0,
    heartedByUserIds: [],
    comments: [],
    bookmarkedByUserIds: [],
    ...overrides,
  };
}

export function createMockFeedEvent(overrides: Partial<FeedEvent> = {}): FeedEvent {
  return {
    id: overrides.id ?? uid("evt"),
    type: "donation",
    actorId: "user-1",
    subjectId: "fund-1",
    subjectType: "fundraiser",
    metadata: {},
    engagement: createMockEngagement(),
    causeCategory: "Medical & Healthcare" as CauseCategory,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: overrides.id ?? uid("cmt"),
    authorId: "user-1",
    text: "Test comment",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/** Reset the counter between test suites if needed. */
export function resetFactoryCounter(): void {
  counter = 0;
}
