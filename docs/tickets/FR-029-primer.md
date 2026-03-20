# FR-029 Primer: Follow/Unfollow System

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete. FR-026 defines `FollowRelationship` type. FR-027 adds `followerIds` and `followingIds` optional fields to User. FR-028 adds `currentUser` to store.

---

## What Is This Ticket?

FR-029 implements the **follow/unfollow system** — the social graph that powers the "Following" feed tab and social proximity scoring. It adds a `followRelationships` array to the Zustand store, `follow` and `unfollow` actions that atomically update both users' follower/following lists and the relationships array, and selectors for querying the graph.

### Why Does This Exist?

The feed algorithm (FR-032) weights events from followed users via a `socialProximity` factor (0.3 weight). The "Following" tab shows a chronological feed filtered to followed users only. Profile pages display follower/following counts. Without a functional follow system, the feed has no social dimension — it's just a global activity stream.

### Dependencies

- **FR-027 (Extend Entity Types):** MUST be complete — `followerIds` and `followingIds` fields must exist on `User`
- **FR-026 (New Feed Types):** MUST be complete — `FollowRelationship` type must be defined

### Current State

- Profile pages have follow button UI but it's non-functional (placeholder only)
- No `followRelationships` slice in the store
- No follow/unfollow actions in `StoreActions`
- `User.followerIds` and `User.followingIds` don't exist yet (added by FR-027)
- `FollowRelationship` type doesn't exist yet (added by FR-026)
- The store persist key is `"fundright-store-v4"` — this ticket should not bump it

---

## FR-029 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Store slice | `followRelationships: FollowRelationship[]` in StoreState |
| Follow action | `follow(followerId, followeeId)` — creates relationship, updates both users' followerIds/followingIds |
| Unfollow action | `unfollow(followerId, followeeId)` — removes relationship, updates both users' lists |
| Idempotent | Following someone you already follow is a no-op; unfollowing someone you don't follow is a no-op |
| Atomic | Single `set()` call updates relationships array + both user entities |
| isFollowing selector | `isFollowing(followerId, followeeId): boolean` |
| getFollowers selector | `getFollowers(userId): User[]` — returns full User objects |
| getFollowing selector | `getFollowing(userId): User[]` — returns full User objects |
| Persisted | `followRelationships` included in `partialize` |

---

## Deliverables Checklist

### A. Store State

- [ ] Add `followRelationships: FollowRelationship[]` to `StoreState`
- [ ] Initialize as empty array `[]` in `getInitialState()`
- [ ] Add `followRelationships` to `partialize` config

### B. Store Actions

- [ ] `follow: (followerId: string, followeeId: string) => void`
  - [ ] Guard: no-op if followerId === followeeId (can't follow yourself)
  - [ ] Guard: no-op if relationship already exists
  - [ ] Guard: no-op if either user doesn't exist
  - [ ] Create `FollowRelationship` with createdAt timestamp
  - [ ] Add followeeId to follower's `followingIds`
  - [ ] Add followerId to followee's `followerIds`
  - [ ] All updates in single `set()` call

- [ ] `unfollow: (followerId: string, followeeId: string) => void`
  - [ ] Guard: no-op if relationship doesn't exist
  - [ ] Remove relationship from array
  - [ ] Remove followeeId from follower's `followingIds`
  - [ ] Remove followerId from followee's `followerIds`
  - [ ] All updates in single `set()` call

### C. Selectors (exported functions)

- [ ] `isFollowing(state, followerId, followeeId): boolean`
- [ ] `getFollowers(state, userId): User[]`
- [ ] `getFollowing(state, userId): User[]`

### D. Tests

- [ ] Follow creates relationship and updates both users
- [ ] Unfollow removes relationship and updates both users
- [ ] Double-follow is idempotent
- [ ] Self-follow is prevented
- [ ] Selectors return correct data

---

## Files to Create

| File | Role |
|------|------|
| None | All logic goes in existing store file |

## Files to Modify

| File | Action |
|------|--------|
| `lib/store/index.ts` | Add followRelationships slice, follow/unfollow actions, selectors, update partialize |
| `lib/store/__tests__/store.test.ts` | Add follow/unfollow test cases |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/store/index.ts` | Full store — understand existing action patterns (addDonation atomic update is the model) |
| `lib/data/types.ts` | User interface (after FR-027) — followerIds/followingIds field definitions |
| `lib/store/__tests__/store.test.ts` | Existing test patterns to follow |
| `fundright-prd-2.0.md` | PRD sections on social graph and Following tab |

---

## Definition of Done for FR-029

- [ ] `followRelationships` array exists in store state
- [ ] `follow(followerId, followeeId)` action works atomically
- [ ] `unfollow(followerId, followeeId)` action works atomically
- [ ] Both actions are idempotent and guard against self-follow
- [ ] `isFollowing`, `getFollowers`, `getFollowing` selectors work correctly
- [ ] `followRelationships` persisted to localStorage
- [ ] Tests pass for follow/unfollow/selectors
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] DEVLOG updated with FR-029 entry
