# FR-018 Primer: Unit Tests for Store Mutations

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 14, 2026
**Status:** COMPLETE
**Previous work:** FR-001 through FR-012 complete. Store actions (addDonation, addFundraiser) fully implemented.

---

## What Is This Ticket?

FR-018 is the **unit test suite** for the Zustand store's critical mutation logic. It ensures `addDonation()` and `addFundraiser()` correctly update all related entities atomically, and that edge cases (overfunding, invalid IDs, zero amounts) are handled gracefully.

### Why Does This Exist?

The store's atomic mutations are the backbone of cross-page state sync. If `addDonation()` silently fails to update a community's aggregate, the community page shows stale data. These tests are the safety net that prevents silent regressions.

---

## What Was Built

### Test Suite (`lib/store/__tests__/store.test.ts`)

**14 tests covering:**

| Test Category | Tests |
|--------------|-------|
| `addDonation` — happy path | Atomic update of fundraiser (raisedAmount, donationCount, donationIds), donor (donationIds, totalDonated), community (totalRaised, donationCount) |
| `addDonation` — overfunding | Correctly allows donations that push past goal |
| `addDonation` — invalid fundraiser ID | Returns null, state unchanged |
| `addDonation` — invalid donor ID | Returns null, state unchanged |
| `addDonation` — zero amount | Returns null, state unchanged |
| `addDonation` — negative amount | Returns null, state unchanged |
| `addDonation` — no community | Updates fundraiser and donor but skips community |
| `addDonation` — multiple sequential | Accumulates correctly across multiple calls |
| `addFundraiser` — happy path | Creates fundraiser, updates community fundraiserIds/count |
| `addFundraiser` — slug uniqueness | Collision detection appends suffix |
| `addFundraiser` — special characters | Slugify handles unicode, special chars |
| `addFundraiser` — no community | Creates fundraiser without community update |

### Utility Tests (`lib/__tests__/utils.test.ts`)

**6 tests covering:**

| Function | Tests |
|----------|-------|
| `calculateProgress()` | Normal (50%), zero goal (0%), overfunding (capped at 100%) |
| `formatCurrency()` | Standard formatting, rounding, zero |

### Configuration (`vitest.config.ts`)
- Vitest configured with jsdom environment
- Run via `npm test` (single run) or `npm run test:watch`

---

## Key Files

| File | Role |
|------|------|
| `lib/store/__tests__/store.test.ts` | 14 store mutation tests |
| `lib/__tests__/utils.test.ts` | 6 utility function tests |
| `vitest.config.ts` | Test runner configuration |

---

## Definition of Done (all met)

- [x] Vitest configured and running via `npm test`
- [x] Tests for addDonation: increments raisedAmount, donationCount, updates donationIds on fundraiser and donor, updates community aggregates
- [x] Tests for addFundraiser: creates fundraiser, updates organizer's fundraiser list, updates community's fundraiserIds
- [x] Test: handles overfunding correctly
- [x] Test: handles missing/invalid entity references gracefully
- [x] All tests pass with zero failures
