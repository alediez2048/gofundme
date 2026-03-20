/**
 * FundRight Zustand store — normalized slices and atomic addDonation.
 * FR-003: Store hydrates from seed on first load, from localStorage on subsequent loads.
 * Use getStore() or useFundRightStore(selector) in client components for selective subscriptions.
 */

import { persist } from "zustand/middleware";
import { useStore } from "zustand/react";
import { createStore } from "zustand/vanilla";
import type { Comment, Community, CommunityMilestone, Donation, FeedEvent, FollowRelationship, Fundraiser, FundraiserMilestone, User } from "@/lib/data";
import type { CauseCategory } from "@/lib/data";
import { seed } from "@/lib/data";
import type { AITrace } from "@/lib/ai/trace";
import { buildFeedEvent } from "@/lib/feed/eventGenerator";

export type EntityMap<T> = Record<string, T>;

export interface StoreState {
  users: EntityMap<User>;
  fundraisers: EntityMap<Fundraiser>;
  communities: EntityMap<Community>;
  donations: EntityMap<Donation>;
  traces: AITrace[];
  /** ISO timestamp of last store mutation — used for `dateModified` in schema (AEO) */
  lastModified: string;
  /** Simulated auth — ID of the "logged in" demo user, or null for logged-out */
  currentUser: string | null;
  followRelationships: FollowRelationship[];
  feedEvents: EntityMap<FeedEvent>;
}

function toRecord<T extends { id: string }>(arr: T[]): Record<string, T> {
  return Object.fromEntries(arr.map((e) => [e.id, e]));
}

function getInitialState(): StoreState {
  return {
    users: toRecord(seed.users),
    fundraisers: toRecord(seed.fundraisers),
    communities: toRecord(seed.communities),
    donations: toRecord(seed.donations),
    traces: [],
    lastModified: new Date().toISOString(),
    currentUser: "user-6",
    followRelationships: [],
    feedEvents: {},
  };
}

function generateDonationId(): string {
  return `don-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateFundraiserId(): string {
  return `fund-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function generateCommentId(): string {
  return `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "fundraiser";
}

function ensureUniqueSlug(slug: string, existingSlugs: Set<string>): string {
  let candidate = slug;
  let n = 1;
  while (existingSlugs.has(candidate)) {
    candidate = `${slug}-${++n}`;
  }
  return candidate;
}

export interface AddFundraiserParams {
  title: string;
  goalAmount: number;
  story: string;
  organizerId: string;
  causeCategory: CauseCategory;
  communityId?: string;
  heroImageUrl: string;
}

const MAX_TRACES = 50;

export interface StoreActions {
  addFundraiser: (params: AddFundraiserParams) => { id: string; slug: string } | null;
  addDonation: (
    fundraiserId: string,
    amount: number,
    donorId: string,
    message?: string
  ) => string | null;
  addTrace: (trace: AITrace) => void;
  clearTraces: () => void;
  setCurrentUser: (userId: string | null) => void;
  follow: (followerId: string, followeeId: string) => void;
  unfollow: (followerId: string, followeeId: string) => void;
  joinCommunity: (userId: string, communityId: string) => void;
  toggleHeart: (eventId: string, userId: string) => void;
  addComment: (eventId: string, authorId: string, text: string, parentId?: string) => string | null;
  toggleBookmark: (eventId: string, userId: string) => void;
  incrementShare: (eventId: string) => void;
}

export type Store = StoreState & StoreActions;

export const createFundRightStore = () => {
  return createStore<Store>()(
    persist(
      (set) => ({
        ...getInitialState(),

        addFundraiser: (params) => {
          const {
            title,
            goalAmount,
            story,
            organizerId,
            causeCategory,
            communityId = "",
            heroImageUrl,
          } = params;

          let result: { id: string; slug: string } | null = null;

          set((s) => {
            const organizer = s.users[organizerId];
            if (!organizer) return s;

            const existingSlugs = new Set(
              Object.values(s.fundraisers).map((f) => f.slug)
            );
            const baseSlug = slugify(title);
            const slug = ensureUniqueSlug(baseSlug, existingSlugs);
            const id = generateFundraiserId();

            const fundraiser: Fundraiser = {
              id,
              slug,
              title: title.trim(),
              story: story.trim(),
              goalAmount,
              raisedAmount: 0,
              donationCount: 0,
              organizerId,
              communityId,
              causeCategory,
              donationIds: [],
              heroImageUrl,
              updates: [],
            };

            result = { id, slug };

            const launchEvent = buildFeedEvent({
              type: "fundraiser_launch",
              actorId: organizerId,
              subjectId: id,
              subjectType: "fundraiser",
              metadata: { title: title.trim(), goalAmount, causeCategory },
              causeCategory,
              communityId: communityId || undefined,
              fundraiserId: id,
            });

            const next: StoreState & StoreActions = {
              ...s,
              fundraisers: { ...s.fundraisers, [id]: fundraiser },
              feedEvents: { ...s.feedEvents, [launchEvent.id]: launchEvent },
              lastModified: new Date().toISOString(),
            };
            if (communityId && s.communities[communityId]) {
              const community = s.communities[communityId];
              next.communities = {
                ...s.communities,
                [communityId]: {
                  ...community,
                  fundraiserIds: [...community.fundraiserIds, id],
                  fundraiserCount: community.fundraiserCount + 1,
                },
              };
            }
            return next;
          });

          return result;
        },

        addDonation: (fundraiserId, amount, donorId, message) => {
          if (amount <= 0) return null;
          const donationId = generateDonationId();
          const createdAt = new Date().toISOString();
          let valid = false;

          set((state) => {
            const fundraiser = state.fundraisers[fundraiserId];
            const donor = state.users[donorId];
            if (!fundraiser || !donor) return state;
            valid = true;

            const donation: Donation = {
              id: donationId,
              amount,
              donorId,
              fundraiserId,
              createdAt,
              ...(message ? { message } : {}),
            };

            const communityId = fundraiser.communityId;
            const community = communityId ? state.communities[communityId] : undefined;

            const newRaised = fundraiser.raisedAmount + amount;
            const newCommunityRaised = community ? community.totalRaised + amount : 0;

            // --- Emit donation event ---
            const donationEvent = buildFeedEvent({
              type: "donation",
              actorId: donorId,
              subjectId: fundraiserId,
              subjectType: "fundraiser",
              metadata: { amount, message: message ?? null, donorName: donor.name },
              causeCategory: fundraiser.causeCategory,
              communityId: communityId || undefined,
              fundraiserId,
            });
            let newFeedEvents: EntityMap<FeedEvent> = {
              ...state.feedEvents,
              [donationEvent.id]: donationEvent,
            };

            // --- Fundraiser milestone detection ---
            const FUNDRAISER_THRESHOLDS: Array<FundraiserMilestone["type"]> = ["25%", "50%", "75%", "100%"];
            const existingFundMilestones = fundraiser.milestones ?? [];
            const newFundMilestones = [...existingFundMilestones];
            for (const threshold of FUNDRAISER_THRESHOLDS) {
              const pct = parseInt(threshold) / 100;
              const target = fundraiser.goalAmount * pct;
              if (
                newRaised >= target &&
                fundraiser.raisedAmount < target &&
                !existingFundMilestones.some((m) => m.type === threshold)
              ) {
                newFundMilestones.push({ type: threshold, reachedAt: createdAt, amount: newRaised });
                const milestoneEvent = buildFeedEvent({
                  type: "milestone_reached",
                  actorId: fundraiser.organizerId,
                  subjectId: fundraiserId,
                  subjectType: "fundraiser",
                  metadata: { percentage: threshold, amount: newRaised, goalAmount: fundraiser.goalAmount },
                  causeCategory: fundraiser.causeCategory,
                  communityId: communityId || undefined,
                  fundraiserId,
                });
                newFeedEvents = { ...newFeedEvents, [milestoneEvent.id]: milestoneEvent };
              }
            }

            // --- Community milestone detection ---
            const COMMUNITY_THRESHOLDS: Array<{ type: CommunityMilestone["type"]; value: number }> = [
              { type: "$10K", value: 10_000 },
              { type: "$50K", value: 50_000 },
              { type: "$100K", value: 100_000 },
              { type: "$500K", value: 500_000 },
              { type: "$1M", value: 1_000_000 },
            ];
            let updatedCommunity = community;
            if (community && communityId) {
              const existingCommMilestones = community.milestones ?? [];
              const newCommMilestones = [...existingCommMilestones];
              for (const { type, value } of COMMUNITY_THRESHOLDS) {
                if (
                  newCommunityRaised >= value &&
                  community.totalRaised < value &&
                  !existingCommMilestones.some((m) => m.type === type)
                ) {
                  newCommMilestones.push({ type, reachedAt: createdAt, amount: newCommunityRaised });
                  const commEvent = buildFeedEvent({
                    type: "community_milestone",
                    actorId: communityId,
                    subjectId: communityId,
                    subjectType: "community",
                    metadata: { threshold: type, amount: newCommunityRaised },
                    causeCategory: community.causeCategory,
                    communityId,
                  });
                  newFeedEvents = { ...newFeedEvents, [commEvent.id]: commEvent };
                }
              }
              updatedCommunity = {
                ...community,
                totalRaised: newCommunityRaised,
                donationCount: community.donationCount + 1,
                milestones: newCommMilestones,
              };
            }

            return {
              lastModified: new Date().toISOString(),
              feedEvents: newFeedEvents,
              donations: {
                ...state.donations,
                [donationId]: donation,
              },
              fundraisers: {
                ...state.fundraisers,
                [fundraiserId]: {
                  ...fundraiser,
                  raisedAmount: newRaised,
                  donationCount: fundraiser.donationCount + 1,
                  donationIds: [...fundraiser.donationIds, donationId],
                  milestones: newFundMilestones,
                },
              },
              users: {
                ...state.users,
                [donorId]: {
                  ...donor,
                  donationIds: [...donor.donationIds, donationId],
                  totalDonated: donor.totalDonated + amount,
                },
              },
              communities:
                updatedCommunity && communityId
                  ? { ...state.communities, [communityId]: updatedCommunity }
                  : state.communities,
            };
          });

          return valid ? donationId : null;
        },

        addTrace: (trace) => {
          set((state) => ({
            traces: [...state.traces.slice(-(MAX_TRACES - 1)), trace],
          }));
        },

        clearTraces: () => {
          set({ traces: [] });
        },

        setCurrentUser: (userId) => {
          set((state) => {
            if (userId !== null && !state.users[userId]) return state;
            return { currentUser: userId };
          });
        },

        follow: (followerId, followeeId) => {
          set((state) => {
            if (followerId === followeeId) return state;
            const follower = state.users[followerId];
            const followee = state.users[followeeId];
            if (!follower || !followee) return state;
            const exists = state.followRelationships.some(
              (r) => r.followerId === followerId && r.followeeId === followeeId
            );
            if (exists) return state;

            const rel: FollowRelationship = {
              followerId,
              followeeId,
              createdAt: new Date().toISOString(),
            };
            const newFollowerIds = [...(followee.followerIds ?? []), followerId];
            let newFeedEvents = state.feedEvents;

            // Profile milestone at 10/50/100 followers
            const FOLLOWER_THRESHOLDS = [10, 50, 100];
            const prevCount = (followee.followerIds ?? []).length;
            for (const threshold of FOLLOWER_THRESHOLDS) {
              if (newFollowerIds.length >= threshold && prevCount < threshold) {
                const evt = buildFeedEvent({
                  type: "profile_milestone",
                  actorId: followeeId,
                  subjectId: followeeId,
                  subjectType: "user",
                  metadata: { followerCount: newFollowerIds.length, threshold },
                  causeCategory: followee.causeIdentity ?? "Community & Neighbors",
                });
                newFeedEvents = { ...newFeedEvents, [evt.id]: evt };
              }
            }

            return {
              followRelationships: [...state.followRelationships, rel],
              feedEvents: newFeedEvents,
              users: {
                ...state.users,
                [followerId]: {
                  ...follower,
                  followingIds: [...(follower.followingIds ?? []), followeeId],
                },
                [followeeId]: {
                  ...followee,
                  followerIds: newFollowerIds,
                },
              },
            };
          });
        },

        unfollow: (followerId, followeeId) => {
          set((state) => {
            const exists = state.followRelationships.some(
              (r) => r.followerId === followerId && r.followeeId === followeeId
            );
            if (!exists) return state;

            const follower = state.users[followerId];
            const followee = state.users[followeeId];
            return {
              followRelationships: state.followRelationships.filter(
                (r) => !(r.followerId === followerId && r.followeeId === followeeId)
              ),
              users: {
                ...state.users,
                ...(follower
                  ? {
                      [followerId]: {
                        ...follower,
                        followingIds: (follower.followingIds ?? []).filter((id) => id !== followeeId),
                      },
                    }
                  : {}),
                ...(followee
                  ? {
                      [followeeId]: {
                        ...followee,
                        followerIds: (followee.followerIds ?? []).filter((id) => id !== followerId),
                      },
                    }
                  : {}),
              },
            };
          });
        },

        joinCommunity: (userId, communityId) => {
          set((state) => {
            const user = state.users[userId];
            const community = state.communities[communityId];
            if (!user || !community) return state;
            if (community.memberIds.includes(userId)) return state;

            const joinEvent = buildFeedEvent({
              type: "community_join",
              actorId: userId,
              subjectId: communityId,
              subjectType: "community",
              metadata: { communityName: community.name },
              causeCategory: community.causeCategory,
              communityId,
            });

            return {
              feedEvents: { ...state.feedEvents, [joinEvent.id]: joinEvent },
              users: {
                ...state.users,
                [userId]: {
                  ...user,
                  communityIds: [...user.communityIds, communityId],
                },
              },
              communities: {
                ...state.communities,
                [communityId]: {
                  ...community,
                  memberIds: [...community.memberIds, userId],
                  memberCount: community.memberCount + 1,
                },
              },
            };
          });
        },

        toggleHeart: (eventId, userId) => {
          set((state) => {
            const event = state.feedEvents[eventId];
            if (!event) return state;
            const { engagement } = event;
            const hearted = engagement.heartedByUserIds.includes(userId);
            return {
              feedEvents: {
                ...state.feedEvents,
                [eventId]: {
                  ...event,
                  engagement: {
                    ...engagement,
                    heartCount: engagement.heartCount + (hearted ? -1 : 1),
                    heartedByUserIds: hearted
                      ? engagement.heartedByUserIds.filter((id) => id !== userId)
                      : [...engagement.heartedByUserIds, userId],
                  },
                },
              },
            };
          });
        },

        addComment: (eventId, authorId, text, parentId) => {
          const commentId = generateCommentId();
          let valid = false;
          set((state) => {
            const event = state.feedEvents[eventId];
            if (!event) return state;
            valid = true;
            const comment: Comment = {
              id: commentId,
              authorId,
              text,
              createdAt: new Date().toISOString(),
              ...(parentId ? { parentId } : {}),
            };
            return {
              feedEvents: {
                ...state.feedEvents,
                [eventId]: {
                  ...event,
                  engagement: {
                    ...event.engagement,
                    commentCount: event.engagement.commentCount + 1,
                    comments: [...event.engagement.comments, comment],
                  },
                },
              },
            };
          });
          return valid ? commentId : null;
        },

        toggleBookmark: (eventId, userId) => {
          set((state) => {
            const event = state.feedEvents[eventId];
            if (!event) return state;
            const { engagement } = event;
            const bookmarked = engagement.bookmarkedByUserIds.includes(userId);
            const updatedFeedEvents = {
              ...state.feedEvents,
              [eventId]: {
                ...event,
                engagement: {
                  ...engagement,
                  bookmarkedByUserIds: bookmarked
                    ? engagement.bookmarkedByUserIds.filter((id) => id !== userId)
                    : [...engagement.bookmarkedByUserIds, userId],
                },
              },
            };
            const user = state.users[userId];
            const updatedUsers = user
              ? {
                  ...state.users,
                  [userId]: {
                    ...user,
                    bookmarkedIds: bookmarked
                      ? (user.bookmarkedIds ?? []).filter((id) => id !== eventId)
                      : [...(user.bookmarkedIds ?? []), eventId],
                  },
                }
              : state.users;
            return { feedEvents: updatedFeedEvents, users: updatedUsers };
          });
        },

        incrementShare: (eventId) => {
          set((state) => {
            const event = state.feedEvents[eventId];
            if (!event) return state;
            return {
              feedEvents: {
                ...state.feedEvents,
                [eventId]: {
                  ...event,
                  engagement: {
                    ...event.engagement,
                    shareCount: event.engagement.shareCount + 1,
                  },
                },
              },
            };
          });
        },
      }),
      {
        // Bump when seed data (e.g. image URLs) must reset for all clients; old key is left in localStorage unused.
        name: "fundright-store-v4",
        partialize: (state) => ({
          users: state.users,
          fundraisers: state.fundraisers,
          communities: state.communities,
          donations: state.donations,
          lastModified: state.lastModified,
          currentUser: state.currentUser,
          followRelationships: state.followRelationships,
          feedEvents: state.feedEvents,
        }),
      }
    )
  );
};

export type FundRightStore = ReturnType<typeof createFundRightStore>;

let storeInstance: FundRightStore | null = null;

/** Lazy singleton for client use; persist rehydrates from localStorage when present. */
export function getStore(): FundRightStore {
  if (!storeInstance) storeInstance = createFundRightStore();
  return storeInstance;
}

/** Subscribe to specific state (e.g. (s) => s.fundraisers[slug]) to avoid unnecessary re-renders. */
export function useFundRightStore<T>(selector: (state: Store) => T): T {
  return useStore(getStore(), selector);
}

// ---------------------------------------------------------------------------
// Follow selectors (FR-029)
// ---------------------------------------------------------------------------

export function isFollowing(state: Store, followerId: string, followeeId: string): boolean {
  return state.followRelationships.some(
    (r) => r.followerId === followerId && r.followeeId === followeeId
  );
}

export function getFollowers(state: Store, userId: string): User[] {
  const ids = state.users[userId]?.followerIds ?? [];
  return ids.map((id) => state.users[id]).filter(Boolean);
}

export function getFollowing(state: Store, userId: string): User[] {
  const ids = state.users[userId]?.followingIds ?? [];
  return ids.map((id) => state.users[id]).filter(Boolean);
}
