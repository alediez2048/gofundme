/**
 * FundRight Zustand store — normalized slices and atomic addDonation.
 * FR-003: Store hydrates from seed on first load, from localStorage on subsequent loads.
 * Use getStore() or useFundRightStore(selector) in client components for selective subscriptions.
 */

import { persist } from "zustand/middleware";
import { useStore } from "zustand/react";
import { createStore } from "zustand/vanilla";
import type { Community, Donation, Fundraiser, User } from "@/lib/data";
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

export interface StoreActions {
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

        addDonation: (fundraiserId, amount, donorId, message = "") => {
          let donationId: string | null = null;
          const createdAt = new Date().toISOString();

          set((state) => {
            const fundraiser = state.fundraisers[fundraiserId];
            const donor = state.users[donorId];
            if (!fundraiser || !donor) return state;

            donationId = generateDonationId();

            const donation: Donation = {
              id: donationId,
              amount,
              donorId,
              fundraiserId,
              message,
              createdAt,
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
