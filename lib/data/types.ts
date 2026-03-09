/**
 * FundRight data model — entity types for User, Fundraiser, Community, Donation.
 * Used by seed data and Zustand store (FR-003). All IDs are strings for consistency.
 */

export interface SocialLink {
  platform: string;
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
}

export interface FundraiserUpdate {
  id: string;
  date: string;
  text: string;
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
  donationIds: string[];
  heroImageUrl: string;
  updates: FundraiserUpdate[];
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
  causeCategory: string;
  bannerImageUrl: string;
  memberIds: string[];
  fundraiserIds: string[];
  totalRaised: number;
  donationCount: number;
  fundraiserCount: number;
  memberCount: number;
}

export interface Donation {
  id: string;
  amount: number;
  donorId: string;
  fundraiserId: string;
  message: string;
  createdAt: string;
}
