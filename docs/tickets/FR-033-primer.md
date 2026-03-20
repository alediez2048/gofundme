# FR-033 Primer: Seed Data Expansion

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete. FR-026–FR-032 build the complete data foundation: types, auth, follows, engagement, event generation, feed algorithm. All the plumbing exists but there's no seed data to populate the feed.

---

## What Is This Ticket?

FR-033 **expands the seed data** to populate the social feed with realistic content on first load. It adds follow relationships between existing users, generates ~30 seed FeedEvents from existing donations and synthetic milestones, seeds engagement data (hearts/comments on select events), scales up donation amounts 10–20x so fundraiser milestones actually trigger, sets the default `currentUser` to `"user-6"` (Priya Sharma), and bumps the persist key to `v5` to force a clean slate for all clients.

### Why Does This Exist?

All the Phase 1 infrastructure (types, store slices, actions, algorithm) means nothing if the feed is empty on first load. An evaluator needs to open FundRight and immediately see a populated, realistic social feed — not a blank page. This ticket is the content layer that brings the data foundation to life.

### Dependencies

- **FR-031 (Event Generation):** MUST be complete — seed data should use the event generation system to create events, or at minimum match the FeedEvent schema it produces
- All Phase 1 tickets (FR-026 through FR-032) should ideally be complete before this ticket, as it exercises the full data model

### Current State

- `lib/data/seed.ts` has: 8 users, 2 communities, 5 fundraisers, 30 donations
- Donation amounts are small (mostly $25–$500 range) — fundraisers are only partially funded
- No follow relationships in seed data
- No FeedEvents in seed data
- No engagement data in seed data
- Store persist key is `"fundright-store-v4"`
- `currentUser` defaults to `"user-6"` (set by FR-028)
- Fundraiser goalAmounts: $500K, $250K, $150K, $200K, $175K — current raisedAmounts are far below these
- Community totalRaised is derived from donations — currently in the low thousands

---

## FR-033 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Follow graph | ~20 FollowRelationship records among the 8 existing users |
| Feed events | ~30 FeedEvent records (mix of donation, fundraiser_launch, milestone_reached, community_milestone, community_join) |
| Engagement data | Hearts and comments on 5–10 events |
| Scaled donations | Increase existing donation amounts 10–20x so milestones (25%/50%/75%) are reachable |
| Default user | `currentUser` set to `"user-6"` (Priya Sharma) |
| Persist key bump | Change from `"fundright-store-v4"` to `"fundright-store-v5"` |
| Realistic timestamps | Events spread over past 2–4 weeks, newest first |
| Diverse causes | Events span all CauseCategories (including new ones from FR-027) |

---

## Deliverables Checklist

### A. Scale Donation Amounts

- [ ] Multiply existing donation amounts by 10–20x
- [ ] Verify fundraisers reach meaningful progress (some at 25%, 50%, 75%+ of goal)
- [ ] Update any hardcoded raisedAmount/totalDonated derivations
- [ ] Ensure community totalRaised crosses at least one milestone threshold ($10K)

### B. Follow Graph (~20 relationships)

- [ ] Create seed follow relationships that form a realistic social graph
- [ ] user-6 (Priya) follows at least 4–5 other users (she's the default viewer)
- [ ] Several users follow Priya back (reciprocal follows)
- [ ] Mix of organizer-to-donor, donor-to-donor, and community-based follows
- [ ] Update user `followerIds` and `followingIds` to match relationships
- [ ] Add follow data to `getInitialState()` or seed module

### C. Seed FeedEvents (~30 events)

- [ ] Generate `donation` events for the scaled-up donations (15–20 events)
- [ ] Generate `fundraiser_launch` events for each fundraiser (5 events)
- [ ] Generate `milestone_reached` events for fundraisers that hit thresholds (3–5 events)
- [ ] Generate `community_milestone` events if communities cross thresholds (1–2 events)
- [ ] Generate `community_join` events (2–3 events)
- [ ] Spread timestamps over past 2–4 weeks (use realistic date offsets)
- [ ] Each event has correct actorId, subjectId, subjectType, causeCategory, metadata
- [ ] Each event has default EngagementSummary (zeroed out, will be populated next)

### D. Engagement Data (on 5–10 events)

- [ ] Add hearts (heartedByUserIds + heartCount) to 5–10 popular events
- [ ] Add 2–3 comments each on 3–5 events (realistic encouraging text)
- [ ] Add some share counts (2–10 range) on a few events
- [ ] Add some bookmarks from user-6 (Priya) so her bookmarks aren't empty

### E. Persist Key Bump

- [ ] Change `name: "fundright-store-v4"` to `name: "fundright-store-v5"` in persist config
- [ ] This forces all existing clients to re-seed with new expanded data

### F. Verify Default User

- [ ] Confirm `currentUser` defaults to `"user-6"` (from FR-028)
- [ ] Verify user-6 has a rich experience: follows people, is followed back, has donations that generated events

---

## Files to Create

| File | Role |
|------|------|
| `lib/data/seed-social.ts` | (Optional) Separate file for social seed data — follow graph, events, engagement — to keep `seed.ts` manageable |

## Files to Modify

| File | Action |
|------|--------|
| `lib/data/seed.ts` | Scale donation amounts 10–20x, add new seed data exports |
| `lib/store/index.ts` | Bump persist key to v5, add feedEvents/followRelationships to getInitialState, update partialize |
| `lib/store/__tests__/store.test.ts` | Update tests if persist key or seed structure changes |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/data/seed.ts` | Full current seed data — all 8 users, 5 fundraisers, 2 communities, 30 donations |
| `lib/store/index.ts` | Store initialization and persist config — understand getInitialState and partialize |
| `lib/data/types.ts` | All types after FR-026/FR-027 — FeedEvent, FollowRelationship, milestones, etc. |
| `lib/feed/eventGenerator.ts` | Event builder helpers from FR-031 — use these to generate seed events if possible |
| `fundright-prd-2.0.md` | PRD sections on seed data and demo experience expectations |

---

## Definition of Done for FR-033

- [ ] Donation amounts scaled 10–20x with realistic fundraiser progress
- [ ] ~20 follow relationships seeded among 8 users
- [ ] ~30 FeedEvents seeded with realistic spread of types and timestamps
- [ ] Hearts/comments/shares on 5–10 events
- [ ] user-6 (Priya) has a rich feed experience as default user
- [ ] Persist key bumped to `"fundright-store-v5"`
- [ ] Store initializes cleanly with expanded seed data
- [ ] Feed algorithm (FR-032) produces a non-empty, well-ranked feed from seed data
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Existing store tests still pass (updated as needed)
- [ ] DEVLOG updated with FR-033 entry
