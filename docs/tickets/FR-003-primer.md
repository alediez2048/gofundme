# FR-003 Primer: Zustand Store with Normalized Slices

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 9, 2026
**Status:** COMPLETE
**Previous work:** FR-001 (Scaffold) and FR-002 (Data Model) complete.

---

## What Is This Ticket?

FR-003 is the **reactive state management layer** for the entire platform. It provides a Zustand store with normalized entity slices, atomic cross-page mutations, and localStorage persistence.

### Why Does This Exist?

FundRight is a client-rendered platform with no backend. The Zustand store is the single source of truth — every page reads from it, and mutations (donations, fundraiser creation) propagate instantly across all pages. Without this, cross-page state sync would require prop drilling or a real API.

---

## What Was Built

### Store Architecture (`lib/store/index.ts`)

- **Normalized slices:** `Record<id, Entity>` for users, fundraisers, communities, donations — O(1) lookups
- **Persist middleware:** `zustand/middleware` → localStorage (key: `fundright-store`), partializes entity slices only
- **Initial state:** Seed data on first load; localStorage hydration on subsequent loads
- **Selector pattern:** `useFundRightStore(selector)` for granular subscriptions to avoid unnecessary re-renders
- **Lazy singleton:** `getStore()` for server-safe access

### Core Actions

**`addDonation(fundraiserId, amount, donorId, message?)`**
- Atomically updates 4 slices in one `set()` call:
  1. Creates Donation record with `don-${Date.now()}-${random}` ID
  2. Updates Fundraiser: `raisedAmount`, `donationCount`, `donationIds`
  3. Updates User (donor): `donationIds`, `totalDonated`
  4. Updates Community (if fundraiser has `communityId`): `totalRaised`, `donationCount`
- Returns donation ID or `null` (invalid inputs, zero/negative amounts)

**`addFundraiser(params)`** *(added in FR-010)*
- Creates fundraiser with auto-generated unique slug (slugify + collision detection)
- Updates community `fundraiserIds` and `fundraiserCount` when applicable
- Returns `{ id, slug }` or `null`

---

## Key Files

| File | Role |
|------|------|
| `lib/store/index.ts` | Store definition, actions, selectors |
| `lib/store/__tests__/store.test.ts` | 14 unit tests (added in FR-018) |
| `lib/data/seed.ts` | Initial state hydration source |
| `lib/data/types.ts` | TypeScript interfaces for all entities |

---

## Definition of Done (all met)

- [x] Normalized slices: users, fundraisers, communities, donations
- [x] addDonation atomically updates donation, fundraiser, donor, community
- [x] Persist to localStorage via zustand persist
- [x] useFundRightStore(selector) for selective subscriptions
- [x] Hydrates from seed first load, localStorage thereafter
