# FR-063 Primer: E2E Integration Tests (Playwright)

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-060 (Test Infrastructure) provides Playwright configuration in `playwright.config.ts`, with chromium browser and `e2e/` test directory. FR-061 and FR-062 cover unit tests. The app runs on `localhost:3001` (`"dev": "next dev -p 3001"`).

---

## What Is This Ticket?

FR-063 writes ~5 end-to-end Playwright tests that exercise the full application flow: the donation flywheel, community discovery, follow flow, auth split, and cross-page state consistency. These tests run in a real browser against the running Next.js dev server.

### Why Does This Exist?

Unit tests verify individual functions work correctly, but they can't catch integration issues: does clicking a "Donate" button actually update the feed? Does following a user actually change the Following tab? E2E tests verify the critical user journeys work end-to-end, from click to state update to UI reflection across multiple pages.

### Dependencies

- **FR-044 (Auth Split):** Full app must be functional with auth split routing.
- FR-060 (Test Infrastructure) must be complete (Playwright configured).

### Current State

- Playwright config exists from FR-060 with `e2e/` directory
- A placeholder `e2e/smoke.spec.ts` may exist
- App runs on port 3001
- State is managed client-side via Zustand (no backend API calls)
- Authentication is simulated via `currentUser` in Zustand store

---

## FR-063 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Test count | ~5 E2E scenarios |
| Full flywheel | Login → feed → scroll → click fundraiser → donate → verify feed event → verify engagement |
| Community discovery | Feed → sidebar community → join → verify member count → verify feed events |
| Follow flow | Feed → click avatar → follow → verify Following tab |
| Auth split | Unauthenticated = marketing page, authenticated = FeedPage |
| Cross-page state | Donate → check profile stats → check community stats → check feed event |
| All pass | `npm run test:e2e` passes |

---

## Deliverables Checklist

### A. Test Setup and Helpers

- [ ] Create `e2e/helpers.ts` with common utilities:
  - `loginAsUser(page, username)`: set `currentUser` in localStorage/store to simulate auth
  - `navigateToFeed(page)`: navigate and wait for feed to load
  - `waitForStoreUpdate(page)`: wait for Zustand state to settle
- [ ] Configure `playwright.config.ts` `webServer` to auto-start dev server if not running

### B. Test 1: Full Flywheel

File: `e2e/flywheel.spec.ts`

- [ ] Set currentUser to simulate login
- [ ] Navigate to feed page
- [ ] Scroll through feed cards
- [ ] Click a fundraiser card → navigates to fundraiser detail page
- [ ] Click "Donate" → donation modal opens
- [ ] Complete donation (enter amount, submit)
- [ ] Verify donation appears in fundraiser's donation list or progress updates
- [ ] Navigate back to feed
- [ ] Verify a new feed event appears for the donation
- [ ] Verify engagement counts reflect the donation

### C. Test 2: Community Discovery

File: `e2e/community-discovery.spec.ts`

- [ ] Set currentUser
- [ ] Navigate to feed page
- [ ] Find community in right sidebar (or community link)
- [ ] Click community → navigates to community page
- [ ] Join community (click join button)
- [ ] Verify member count incremented
- [ ] Navigate back to feed
- [ ] Verify community join event appears in feed

### D. Test 3: Follow Flow

File: `e2e/follow-flow.spec.ts`

- [ ] Set currentUser
- [ ] Navigate to feed page
- [ ] Click a user avatar on a feed card → navigates to profile page
- [ ] Click "Follow" button
- [ ] Verify follow state (button changes to "Following" or similar)
- [ ] Navigate back to feed
- [ ] Switch to "Following" tab
- [ ] Verify followed user's activity appears in Following tab

### E. Test 4: Auth Split

File: `e2e/auth-split.spec.ts`

- [ ] Without currentUser set: navigate to `/`
- [ ] Verify marketing/homepage content is displayed (not feed)
- [ ] Set currentUser in store/localStorage
- [ ] Navigate to `/` again
- [ ] Verify FeedPage content is displayed (not marketing page)

### F. Test 5: Cross-Page State

File: `e2e/cross-page-state.spec.ts`

- [ ] Set currentUser
- [ ] Navigate to a fundraiser and make a donation
- [ ] Navigate to profile page → verify total donated updated
- [ ] Navigate to community page → verify community total raised updated
- [ ] Navigate to feed → verify donation event exists

---

## Files to Create

| File | Role |
|------|------|
| `e2e/helpers.ts` | Shared test utilities (login, navigation) |
| `e2e/flywheel.spec.ts` | Full flywheel E2E test |
| `e2e/community-discovery.spec.ts` | Community discovery E2E test |
| `e2e/follow-flow.spec.ts` | Follow flow E2E test |
| `e2e/auth-split.spec.ts` | Auth split E2E test |
| `e2e/cross-page-state.spec.ts` | Cross-page state consistency E2E test |

## Files to Modify

| File | Action |
|------|--------|
| `playwright.config.ts` | Add webServer config if not present |

### Files to READ for Context

| File | Why |
|------|-----|
| `playwright.config.ts` | Current Playwright configuration |
| `lib/store/index.ts` | Store shape — how to set currentUser, read state |
| `app/page.tsx` | Auth split routing (what renders for auth vs. unauth) |
| `components/DonationModal.tsx` | Donation flow UI (selectors for E2E interaction) |
| `components/FundraiserPageContent.tsx` | Fundraiser page structure |
| `components/ProfilePageContent.tsx` | Profile page structure |
| Feed page component | Feed card structure, tab navigation |

---

## Definition of Done for FR-063

- [ ] 5 E2E test files created in `e2e/` directory
- [ ] Full flywheel test: login → feed → donate → verify event
- [ ] Community discovery test: feed → join community → verify
- [ ] Follow flow test: feed → follow user → verify Following tab
- [ ] Auth split test: unauth = marketing, auth = feed
- [ ] Cross-page state test: donate → verify across profile, community, feed
- [ ] All tests pass: `npm run test:e2e`
- [ ] Tests are not flaky (proper waits, no race conditions)
