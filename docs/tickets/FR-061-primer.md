# FR-061 Primer: P0 Unit Tests (Feed Events, Engagement, Follows)

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-060 (Test Infrastructure) provides Vitest with jsdom, @testing-library/react, jest-dom matchers, factory functions (`createMockFeedEvent`, `createMockUser`, `createMockFundraiser`, `createMockCommunity`), and localStorage mocking. Existing test: `lib/store/__tests__/store.test.ts` tests `addDonation` with `createFundRightStore()` pattern.

---

## What Is This Ticket?

FR-061 writes ~45 P0 (highest priority) unit tests covering three critical subsystems: feed event generation (~20 tests), engagement state (~15 tests), and follow/unfollow (~10 tests). These test the core flywheel mechanics — the behaviors that make the social feed work.

### Why Does This Exist?

Feed events, engagement, and follows are the core mechanics of the social fundraising flywheel. A donation creates a feed event, users engage with feed cards (heart, comment, share), and follows determine what appears in the "Following" tab. If any of these break, the entire feed experience degrades. P0 tests catch regressions in these critical paths.

### Dependencies

- **FR-031 (Feed Event Generation):** Feed event generation logic must exist to test.
- **FR-030 (Engagement):** Engagement state (heart, comment, share, bookmark) must exist.
- **FR-029 (Follows):** Follow/unfollow logic must exist in the store.

### Current State

- `lib/store/__tests__/store.test.ts` has one test suite (`addDonation`) using `createFundRightStore()` + `beforeEach` pattern
- Test pattern: create store → get initial state → perform action → assert state changes
- Vitest with `describe/it/expect/beforeEach` from `vitest`
- Factory functions available from `lib/test-utils.ts` (after FR-060)

---

## FR-061 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Test count | ~45 tests total |
| Feed events | ~20 tests covering donation→event, milestone detection, community events, edge cases |
| Engagement | ~15 tests covering heart, comment, share, bookmark, persistence |
| Follows | ~10 tests covering follow, unfollow, self-follow prevention, idempotency, feed impact |
| All pass | `npm run test` passes with all tests green |
| Pattern | Follows existing `createFundRightStore()` + `beforeEach` pattern |

---

## Deliverables Checklist

### A. Feed Event Generation Tests (~20 tests)

File: `lib/store/__tests__/feed-events.test.ts` or `lib/feed/__tests__/feed-events.test.ts`

- [ ] Donation creates a FeedEvent of type "donation"
- [ ] FeedEvent includes correct fundraiser, donor, amount, timestamp
- [ ] Milestone auto-detection at 25% funded
- [ ] Milestone auto-detection at 50% funded
- [ ] Milestone auto-detection at 75% funded
- [ ] Milestone auto-detection at 100% funded
- [ ] Community milestone detection (e.g., community reaches funding goal)
- [ ] `fundraiser_launch` event created when new fundraiser is created
- [ ] `community_join` event created when user joins community
- [ ] Edge case: donation triggering multiple events (e.g., donation + milestone)
- [ ] Edge case: milestone not re-triggered if already passed
- [ ] Edge case: zero-amount donation doesn't create event
- [ ] Events ordered by timestamp (most recent first)
- [ ] Event IDs are unique
- [ ] Events reference correct entity IDs
- [ ] Multiple donations create multiple events
- [ ] Events have correct actor (donor) reference
- [ ] Community events reference correct community
- [ ] Large donation crossing multiple thresholds
- [ ] Event creation is atomic with donation

### B. Engagement State Tests (~15 tests)

File: `lib/store/__tests__/engagement.test.ts`

- [ ] Heart toggle: increment count on heart
- [ ] Heart toggle: decrement count on unheart
- [ ] Heart is idempotent (double-heart doesn't double-count)
- [ ] Comment add: increases comment count
- [ ] Comment includes author and text
- [ ] Share: increments share count
- [ ] Bookmark toggle: adds to bookmarks
- [ ] Bookmark toggle: removes from bookmarks
- [ ] Engagement persists across navigation (store survives component unmount)
- [ ] Multiple users can engage with same event
- [ ] Engagement state isolated between different feed events
- [ ] Initial engagement state is zero/empty for new events
- [ ] Heart state is per-user (current user can only heart once)
- [ ] Comment ordering (newest or oldest first, depending on implementation)
- [ ] Engagement on non-existent event handled gracefully

### C. Follow/Unfollow Tests (~10 tests)

File: `lib/store/__tests__/follows.test.ts`

- [ ] Follow updates follower's following list
- [ ] Follow updates target's followers list
- [ ] Unfollow removes from both lists
- [ ] Can't follow self (returns error or no-op)
- [ ] Duplicate follow is idempotent (following same user twice = still following once)
- [ ] Unfollow non-followed user is no-op
- [ ] Follow affects feed content (followed user's events appear in Following tab)
- [ ] Multiple follows work correctly
- [ ] Follow count is accurate after multiple follow/unfollow cycles
- [ ] Follow state persists in store

---

## Files to Create

| File | Role |
|------|------|
| `lib/store/__tests__/feed-events.test.ts` | Feed event generation tests |
| `lib/store/__tests__/engagement.test.ts` | Engagement state tests |
| `lib/store/__tests__/follows.test.ts` | Follow/unfollow tests |

## Files to Modify

| File | Action |
|------|--------|
| None | Pure test additions, no production code changes |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/store/__tests__/store.test.ts` | Existing test patterns to follow |
| `lib/store/index.ts` | Store actions being tested (addDonation, engagement, follow methods) |
| `lib/test-utils.ts` | Factory functions for creating test data |
| `lib/data/index.ts` | Entity types (FeedEvent, User, Fundraiser, etc.) |
| `lib/feed/` | Feed event generation logic (if separate from store) |

---

## Definition of Done for FR-061

- [ ] ~45 tests written across three test files
- [ ] Feed event generation: ~20 tests covering creation, milestones, edge cases
- [ ] Engagement state: ~15 tests covering heart, comment, share, bookmark
- [ ] Follow/unfollow: ~10 tests covering follow, unfollow, idempotency, feed impact
- [ ] All tests pass: `npm run test`
- [ ] Tests follow existing `createFundRightStore()` pattern
- [ ] No flaky tests (deterministic, no timing dependencies)
