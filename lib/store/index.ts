/**
 * FundRight Zustand store — normalized slices and atomic addDonation.
 * FR-003: Store hydrates from seed on first load, from localStorage on subsequent loads.
 * Use getStore() or useFundRightStore(selector) in client components for selective subscriptions.
 */

import { persist } from "zustand/middleware";
import { useStore } from "zustand/react";
import { createStore } from "zustand/vanilla";
import type { Community, Donation, Fundraiser, User } from "@/lib/data";
import type { CauseCategory } from "@/lib/data";
import { seed } from "@/lib/data";

export type EntityMap<T> = Record<string, T>;

export interface StoreState {
  users: EntityMap<User>;
  fundraisers: EntityMap<Fundraiser>;
  communities: EntityMap<Community>;
  donations: EntityMap<Donation>;
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
  };
}

function generateDonationId(): string {
  return `don-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateFundraiserId(): string {
  return `fund-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
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

export interface StoreActions {
  addFundraiser: (params: AddFundraiserParams) => { id: string; slug: string } | null;
  addDonation: (
    fundraiserId: string,
    amount: number,
    donorId: string,
    message?: string
  ) => string | null;
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

            const next: StoreState & StoreActions = {
              ...s,
              fundraisers: { ...s.fundraisers, [id]: fundraiser },
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

          set((state) => {
            const fundraiser = state.fundraisers[fundraiserId];
            const donor = state.users[donorId];
            if (!fundraiser || !donor) return state;

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

            return {
              donations: {
                ...state.donations,
                [donationId]: donation,
              },
              fundraisers: {
                ...state.fundraisers,
                [fundraiserId]: {
                  ...fundraiser,
                  raisedAmount: fundraiser.raisedAmount + amount,
                  donationCount: fundraiser.donationCount + 1,
                  donationIds: [...fundraiser.donationIds, donationId],
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
                community && communityId
                  ? {
                      ...state.communities,
                      [communityId]: {
                        ...community,
                        totalRaised: community.totalRaised + amount,
                        donationCount: community.donationCount + 1,
                      },
                    }
                  : state.communities,
            };
          });

          return donationId;
        },
      }),
      {
        name: "fundright-store",
        partialize: (state) => ({
          users: state.users,
          fundraisers: state.fundraisers,
          communities: state.communities,
          donations: state.donations,
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
