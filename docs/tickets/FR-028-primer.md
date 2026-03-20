# FR-028 Primer: Authentication State

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 0 clone + AI layer). FR-026 adds new feed entity types. The Zustand store has no concept of a "current user" — all actions take explicit userId parameters.

---

## What Is This Ticket?

FR-028 adds a **simulated authentication state** to the Zustand store. This is not real auth — it's a `currentUser: string | null` field that stores the ID of the "logged in" demo user, plus a `setCurrentUser(userId)` action to switch between users. The feed experience requires knowing *who* is viewing to personalize content, filter by follows, and track engagement.

### Why Does This Exist?

The feed algorithm (FR-032) needs to know who the current user is to compute cause affinity, filter by social graph, and personalize rankings. Every engagement action (heart, comment, bookmark) needs an actor. The profile page needs to distinguish "my profile" from "someone else's profile." Without a `currentUser` in the store, every component would need to pass userId as a prop or hardcode it.

The PRD specifies that `/` shows a marketing page for unauthenticated users and the social feed for authenticated users. This field enables that conditional rendering.

### Dependencies

- **FR-026 (New Feed Types):** Should be complete first so the store type imports are stable. However, this ticket only touches `StoreState` and `StoreActions`, not the new feed types directly.

### Current State

- `StoreState` in `lib/store/index.ts` has 5 fields: `users`, `fundraisers`, `communities`, `donations`, `traces`, `lastModified`
- `StoreActions` has 4 actions: `addFundraiser`, `addDonation`, `addTrace`, `clearTraces`
- No `currentUser` field exists
- Actions like `addDonation` take `donorId` as an explicit parameter
- The persist key is `"fundright-store-v4"` with `partialize` that saves users, fundraisers, communities, donations, lastModified

---

## FR-028 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| State field | `currentUser: string \| null` added to `StoreState` |
| Action | `setCurrentUser(userId: string \| null)` added to `StoreActions` |
| Default value | Initializes to a demo user ID (e.g., `"user-6"` — Priya Sharma) so the feed works immediately |
| Persisted | `currentUser` included in `partialize` so it survives page refreshes |
| Selector | `getCurrentUser()` convenience selector or direct store access pattern |
| No UI changes | No login/logout UI in this ticket — just the state plumbing |

---

## Deliverables Checklist

### A. Store State

- [ ] Add `currentUser: string | null` to `StoreState` interface
- [ ] Set default to `"user-6"` in `getInitialState()` (Priya Sharma — a donor, not an organizer, for natural feed perspective)
- [ ] Add `currentUser` to `partialize` in persist config

### B. Store Action

- [ ] Add `setCurrentUser: (userId: string | null) => void` to `StoreActions` interface
- [ ] Implement action: `setCurrentUser: (userId) => set({ currentUser: userId })`
- [ ] Validate userId exists in `state.users` before setting (or allow null for "logged out")

### C. Type Exports

- [ ] Ensure `StoreState` and `StoreActions` changes are reflected in `Store` type (already `StoreState & StoreActions`)

---

## Files to Create

| File | Role |
|------|------|
| None | All changes are in the existing store file |

## Files to Modify

| File | Action |
|------|--------|
| `lib/store/index.ts` | Add `currentUser` to state, `setCurrentUser` to actions, update `partialize` |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/store/index.ts` | Full store structure — understand StoreState, StoreActions, getInitialState, partialize config |
| `lib/data/seed.ts` | Verify user-6 exists and is Priya Sharma — confirm she's a good default demo user |
| `lib/data/types.ts` | User type — understand what fields the current user entity has |
| `fundright-prd-2.0.md` | PRD section on authenticated vs unauthenticated homepage split |

---

## Definition of Done for FR-028

- [ ] `currentUser: string | null` exists in StoreState
- [ ] `setCurrentUser(userId)` action exists in StoreActions
- [ ] Default value is `"user-6"` (or another appropriate demo user)
- [ ] `currentUser` is persisted via `partialize`
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Existing store tests still pass (`npm test`)
- [ ] DEVLOG updated with FR-028 entry
