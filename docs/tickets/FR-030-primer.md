# FR-030 Primer: Engagement Actions

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete. FR-026 defines `Comment` and `EngagementSummary` types on `FeedEvent`. No engagement system exists in the current build.

---

## What Is This Ticket?

FR-030 implements **engagement primitives** — the heart, comment, bookmark, and share actions that users perform on feed events. These are Zustand store actions that modify the `EngagementSummary` embedded in each `FeedEvent`. Hearts and bookmarks are toggleable (store user IDs for toggle state). Comments are append-only. Shares are count-only (no user tracking).

### Why Does This Exist?

Engagement data serves two purposes: (1) it's the visible social proof on each feed event (heart counts, comment threads, share counts), and (2) it's a signal for the feed algorithm — the engagement factor (0.15 weight) in FR-032 uses heart/comment/share counts to boost popular events. Without engagement actions, feed events are static cards with no interactivity.

### Dependencies

- **FR-026 (New Feed Types):** MUST be complete — `Comment`, `EngagementSummary`, and `FeedEvent` types must be defined

### Current State

- No engagement system exists anywhere in the codebase
- `FeedEvent` type will have an `engagement: EngagementSummary` field (from FR-026)
- `EngagementSummary` will have: heartCount, commentCount, shareCount, heartedByUserIds, comments, bookmarkedByUserIds
- The store has no `feedEvents` slice yet — this will need to be added (or FR-031 adds it)
- No `Comment` creation logic exists

---

## FR-030 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Store slice | `feedEvents: EntityMap<FeedEvent>` in StoreState (if not already added) |
| toggleHeart | Toggle heart on a feed event — adds/removes userId from heartedByUserIds, increments/decrements heartCount |
| addComment | Append a Comment to a feed event's engagement.comments array, increment commentCount |
| toggleBookmark | Toggle bookmark — adds/removes userId from bookmarkedByUserIds |
| incrementShare | Increment shareCount on a feed event (count-only, no user tracking) |
| Idempotent hearts | Hearting twice = unheart (toggle behavior) |
| Idempotent bookmarks | Bookmarking twice = unbookmark (toggle behavior) |
| Comment IDs | Auto-generated unique IDs for new comments |

---

## Deliverables Checklist

### A. Store State

- [ ] Add `feedEvents: EntityMap<FeedEvent>` to `StoreState` (if not already present)
- [ ] Initialize as empty `{}` in `getInitialState()`
- [ ] Add `feedEvents` to `partialize` config

### B. Store Actions

- [ ] `toggleHeart: (eventId: string, userId: string) => void`
  - [ ] If userId in heartedByUserIds → remove + decrement heartCount
  - [ ] If userId not in heartedByUserIds → add + increment heartCount
  - [ ] No-op if event doesn't exist

- [ ] `addComment: (eventId: string, authorId: string, text: string, parentId?: string) => string | null`
  - [ ] Generate unique comment ID
  - [ ] Create Comment object with id, authorId, text, createdAt, optional parentId
  - [ ] Append to event's engagement.comments array
  - [ ] Increment commentCount
  - [ ] Return comment ID or null if event doesn't exist

- [ ] `toggleBookmark: (eventId: string, userId: string) => void`
  - [ ] If userId in bookmarkedByUserIds → remove
  - [ ] If userId not in bookmarkedByUserIds → add
  - [ ] Also update user's `bookmarkedIds` array (if FR-027 added this field)
  - [ ] No-op if event doesn't exist

- [ ] `incrementShare: (eventId: string) => void`
  - [ ] Increment shareCount by 1
  - [ ] No-op if event doesn't exist

### C. Helper

- [ ] `generateCommentId(): string` — e.g., `cmt-${Date.now()}-${random}`

### D. Tests

- [ ] toggleHeart adds userId and increments count
- [ ] toggleHeart removes userId and decrements count (second call)
- [ ] addComment creates comment with correct fields
- [ ] addComment increments commentCount
- [ ] toggleBookmark toggles correctly
- [ ] incrementShare increments count
- [ ] All actions are no-ops for non-existent events

---

## Files to Create

| File | Role |
|------|------|
| None | All logic goes in existing store file |

## Files to Modify

| File | Action |
|------|--------|
| `lib/store/index.ts` | Add feedEvents slice, engagement actions, update partialize |
| `lib/store/__tests__/store.test.ts` | Add engagement action test cases |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/store/index.ts` | Store structure — follow the existing action patterns |
| `lib/data/types.ts` | FeedEvent, Comment, EngagementSummary types (after FR-026) |
| `lib/store/__tests__/store.test.ts` | Existing test patterns |
| `fundright-prd-2.0.md` | PRD engagement primitives section |

---

## Definition of Done for FR-030

- [ ] `feedEvents` slice exists in store state
- [ ] `toggleHeart` correctly toggles heart state and count
- [ ] `addComment` creates comment with auto-generated ID
- [ ] `toggleBookmark` correctly toggles bookmark state
- [ ] `incrementShare` increments share count
- [ ] All actions are no-ops for non-existent events
- [ ] `feedEvents` persisted to localStorage
- [ ] Tests pass for all 4 engagement actions
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] DEVLOG updated with FR-030 entry
