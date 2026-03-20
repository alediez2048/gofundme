/**
 * FundRight data model — entity types for User, Fundraiser, Community, Donation.
 * Used by seed data and Zustand store (FR-003). All IDs are strings for consistency.
 */

export type SocialPlatform =
  | "Twitter"
  | "LinkedIn"
  | "Instagram"
  | "Facebook"
  | "GitHub";

export type CauseCategory =
  | "Disaster Relief & Wildfire Safety"
  | "Medical & Healthcare"
  | "Education"
  | "Environment & Climate"
  | "Animals & Wildlife"
  | "Community & Neighbors";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  verified: boolean;
  joinDate: string;
  socialLinks: SocialLink[];
  communityIds: string[];
  donationIds: string[];
  totalDonated: number;
  /** External profile URLs for Person schema `sameAs` (AEO) */
  sameAs?: string[];
  // --- Feed extensions (FR-027) ---
  coverPhoto?: string;
  causeIdentity?: CauseCategory;
  stats?: { totalRaised: number; peopleHelped: number; fundraisersSupported: number };
  highlights?: string[];
  givingStreak?: number;
  impactSummary?: string;
  followerIds?: string[];
  followingIds?: string[];
  bookmarkedIds?: string[];
}

export interface FundraiserUpdate {
  id: string;
  date: string;
  text: string;
  /** Named organizer quote for AEO citation visibility (+37%) */
  quote?: string;
}

export interface Fundraiser {
  id: string;
  slug: string;
  title: string;
  story: string;
  goalAmount: number;
  raisedAmount: number;
  donationCount: number;
  organizerId: string;
  communityId: string;
  causeCategory: CauseCategory;
  donationIds: string[];
  heroImageUrl: string;
  updates: FundraiserUpdate[];
  // --- Feed extensions (FR-027) ---
  donationVelocity?: number;
  milestones?: FundraiserMilestone[];
  status?: "active" | "completed" | "paused";
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
  causeCategory: CauseCategory;
  bannerImageUrl: string;
  memberIds: string[];
  fundraiserIds: string[];
  totalRaised: number;
  donationCount: number;
  fundraiserCount: number;
  memberCount: number;
  faq?: FAQItem[];
  /** External org URLs for Organization schema `sameAs` (AEO) */
  sameAs?: string[];
  /** For Organization schema `nonprofitStatus` (AEO) */
  nonprofitStatus?: string;
  // --- Feed extensions (FR-027) ---
  milestones?: CommunityMilestone[];
  leaderboard?: LeaderboardEntry[];
}

export interface Donation {
  id: string;
  amount: number;
  donorId: string;
  fundraiserId: string;
  message?: string;
  createdAt: string;
  // --- Feed extensions (FR-027) ---
  isPublic?: boolean;
}

// ---------------------------------------------------------------------------
// Feed & Engagement types (FR-026)
// ---------------------------------------------------------------------------

export type EventType =
  | "donation"
  | "fundraiser_launch"
  | "milestone_reached"
  | "community_milestone"
  | "community_join"
  | "profile_milestone";

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
  parentId?: string;
}

export interface EngagementSummary {
  heartCount: number;
  commentCount: number;
  shareCount: number;
  heartedByUserIds: string[];
  comments: Comment[];
  bookmarkedByUserIds: string[];
}

export interface FeedEvent {
  id: string;
  type: EventType;
  actorId: string;
  subjectId: string;
  subjectType: "fundraiser" | "community" | "user";
  metadata: Record<string, unknown>;
  engagement: EngagementSummary;
  causeCategory: CauseCategory;
  createdAt: string;
  communityId?: string;
  fundraiserId?: string;
}

export interface FollowRelationship {
  followerId: string;
  followeeId: string;
  createdAt: string;
}

export interface FundraiserMilestone {
  type: "25%" | "50%" | "75%" | "100%";
  reachedAt: string;
  amount: number;
}

export interface CommunityMilestone {
  type: "$10K" | "$50K" | "$100K" | "$500K" | "$1M";
  reachedAt: string;
  amount: number;
}

export interface LeaderboardEntry {
  userId: string;
  rank: number;
  amount: number;
  donationCount: number;
}

// ---------------------------------------------------------------------------
// Feed algorithm types (FR-032)
// ---------------------------------------------------------------------------

export type CauseProfile = Record<CauseCategory, number>;

export interface UserBehaviorSignals {
  donatedCauses: Record<string, number>;
  heartedCauses: Record<string, number>;
  clickedCauses: Record<string, number>;
  skippedCauses: Record<string, number>;
  lastInteractionTimes: Record<string, string>;
}
