# FR-062 Primer: P1 Unit Tests (Algorithm, Affinity, Auth Split)

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-060 (Test Infrastructure) provides Vitest with jsdom, factory functions, localStorage mocking. FR-061 (P0 Tests) covers feed events, engagement, and follows. Existing test pattern: `createFundRightStore()` + `beforeEach` in `lib/store/__tests__/store.test.ts`.

---

## What Is This Ticket?

FR-062 writes ~40 P1 unit tests covering three subsystems: feed algorithm ranking (~25 tests), cause affinity scoring (~10 tests), and auth split behavior (~5 tests). These test the intelligence layer that makes the feed personalized and the routing that splits authenticated vs. unauthenticated users.

### Why Does This Exist?

The feed algorithm determines what users see and in what order — it's the most impactful code for user engagement. Cause affinity ensures users see fundraisers matching their interests. The auth split is the entry point for the entire app experience. P1 tests ensure these systems work correctly and don't regress when other features change.

### Dependencies

- **FR-032 (Feed Algorithm):** Algorithm ranking logic must exist to test.
- **FR-046 (Personalization / Cause Affinity):** Affinity scoring must exist.
- **FR-044 (Auth Split):** Authenticated vs. unauthenticated routing must exist.

### Current State

- FR-061 tests cover feed events, engagement, follows
- Algorithm, affinity, and auth split logic exist in codebase (from Phase 3)
- Test infrastructure from FR-060 is ready

---

## FR-062 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Test count | ~40 tests total |
| Algorithm | ~25 tests covering ranking factors, tab filtering, anti-patterns |
| Affinity | ~10 tests covering vector generation, similarity scoring, defaults |
| Auth split | ~5 tests covering routing, hydration, flash prevention |
| All pass | `npm run test` passes with all tests green |

---

## Deliverables Checklist

### A. Feed Algorithm Ranking Tests (~25 tests)

File: `lib/store/__tests__/algorithm.test.ts` or `lib/feed/__tests__/algorithm.test.ts`

- [ ] Social graph weighting: events from followed users rank higher
- [ ] Second-degree discovery: events from friends-of-friends appear
- [ ] Second-degree events rank lower than first-degree
- [ ] Cause affinity scoring affects ranking
- [ ] Recency decay: newer events rank higher than older ones
- [ ] Recency decay rate is reasonable (not too aggressive)
- [ ] Category diversity: feed doesn't become all one category
- [ ] Content type mixing: donations, milestones, joins are interleaved
- [ ] Anti-pattern: same fundraiser doesn't dominate feed
- [ ] Anti-pattern: same user doesn't dominate feed
- [ ] Tab filtering — "For You": personalized algorithm applies
- [ ] Tab filtering — "Following": only followed users' events
- [ ] Tab filtering — "Trending": sorted by engagement metrics
- [ ] Empty following list: For You tab still returns events
- [ ] New user (no history): gets reasonable default feed
- [ ] Feed with zero events: returns empty array, no errors
- [ ] Large event set: algorithm doesn't time out or degrade
- [ ] Events with equal scores maintain stable sort order
- [ ] Fundraiser from followed user + matching cause = highest rank
- [ ] Old event from followed user vs. new event from stranger
- [ ] Algorithm respects page size / limit parameter
- [ ] Offset/pagination works correctly
- [ ] Algorithm output is deterministic for same inputs
- [ ] Trending tab uses engagement count (hearts + comments + shares)
- [ ] Trending tab has time window (not all-time)

### B. Cause Affinity Tests (~10 tests)

File: `lib/store/__tests__/affinity.test.ts` or `lib/feed/__tests__/affinity.test.ts`

- [ ] Vector generation from donation history (donating to medical creates medical affinity)
- [ ] Similarity scoring between user affinity and fundraiser category
- [ ] High similarity = higher score
- [ ] Low similarity = lower score
- [ ] New user defaults: reasonable starting affinity (not all zeros)
- [ ] Single-cause edge case: user only donated to one category
- [ ] Multiple donations to same cause strengthen affinity
- [ ] Affinity updates after new donation
- [ ] Cross-category similarity (e.g., medical and health are related)
- [ ] Affinity vector is normalized (doesn't grow unbounded)

### C. Auth Split Tests (~5 tests)

File: `lib/store/__tests__/auth-split.test.ts` or `components/__tests__/auth-split.test.ts`

- [ ] Unauthenticated user sees HomePageContent (marketing page)
- [ ] Authenticated user (currentUser set) sees FeedPage
- [ ] No flash of wrong content on hydration
- [ ] Switching from unauthenticated to authenticated shows FeedPage
- [ ] Switching from authenticated to unauthenticated shows HomePageContent

---

## Files to Create

| File | Role |
|------|------|
| `lib/store/__tests__/algorithm.test.ts` | Feed algorithm ranking tests |
| `lib/store/__tests__/affinity.test.ts` | Cause affinity scoring tests |
| `lib/store/__tests__/auth-split.test.ts` | Auth split routing tests |

## Files to Modify

| File | Action |
|------|--------|
| None | Pure test additions, no production code changes |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/store/__tests__/store.test.ts` | Existing test patterns |
| `lib/store/index.ts` | Store actions and selectors being tested |
| Feed algorithm file | Algorithm implementation to test |
| Cause affinity file | Affinity scoring implementation |
| `app/page.tsx` or root layout | Auth split routing logic |
| `lib/test-utils.ts` | Factory functions for test data |

---

## Definition of Done for FR-062

- [ ] ~40 tests written across three test files
- [ ] Algorithm: ~25 tests covering ranking, tabs, diversity, anti-patterns
- [ ] Affinity: ~10 tests covering vectors, scoring, defaults, edge cases
- [ ] Auth split: ~5 tests covering routing and hydration
- [ ] All tests pass: `npm run test`
- [ ] Tests are deterministic (no flakiness)
- [ ] Tests follow existing store test patterns
