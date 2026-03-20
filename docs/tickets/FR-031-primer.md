# FR-031 Primer: FeedEvent Generation System

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete. FR-026/FR-027 define feed types and extend entities. FR-030 adds engagement actions and the feedEvents store slice. Store actions `addDonation`, `addFundraiser` exist but don't generate events.

---

## What Is This Ticket?

FR-031 is the **event generation system** — the bridge between store mutations and the social feed. It adds a `_emitFeedEvent` helper that creates `FeedEvent` objects and inserts them into the `feedEvents` store slice. Then it enhances existing store actions (`addDonation`, `addFundraiser`) and new actions (`joinCommunity`, `followUser` via FR-029) to automatically emit events when something noteworthy happens. It also detects milestones (fundraiser percentage thresholds and community amount thresholds) and emits additional milestone events.

### Why Does This Exist?

The feed is only as good as its events. Without automatic event generation, every donation, fundraiser launch, and community milestone would need manual feed insertion. This ticket makes the feed self-populating: every meaningful platform action produces a FeedEvent that the algorithm (FR-032) can rank and display.

### Dependencies

- **FR-027 (Extend Entity Types):** MUST be complete — fundraiser `milestones` and `status` fields, community `milestones` field must exist
- **FR-030 (Engagement Actions):** MUST be complete — `feedEvents` slice must exist in store

### Current State

- `addDonation` in store: updates fundraiser raisedAmount/donationCount, donor donationIds/totalDonated, community totalRaised/donationCount — but generates NO feed events
- `addFundraiser` in store: creates fundraiser, links to community — but generates NO feed events
- No `joinCommunity` action exists (users are assigned to communities in seed data)
- No milestone detection logic exists anywhere
- `feedEvents` slice will be added by FR-030
- `FeedEvent`, `FundraiserMilestone`, `CommunityMilestone` types will exist from FR-026

---

## FR-031 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Event helper | `_emitFeedEvent(state, params)` creates FeedEvent with engagement defaults and inserts into feedEvents |
| Donation events | Every `addDonation` call emits a `donation` FeedEvent |
| Fundraiser milestones | Auto-detect when raisedAmount crosses 25%/50%/75%/100% of goalAmount → emit `milestone_reached` event |
| Community milestones | Auto-detect when community totalRaised crosses $10K/$50K/$100K/$500K/$1M → emit `community_milestone` event |
| Fundraiser launch | `addFundraiser` emits `fundraiser_launch` event |
| Community join | New `joinCommunity` action emits `community_join` event |
| Profile milestones | `follow` action (FR-029) emits `profile_milestone` at follower thresholds (10/50/100) |
| Milestone tracking | Fundraiser and community `milestones` arrays updated when milestones are reached |
| No duplicate milestones | Each milestone is only emitted once (check existing milestones array before emitting) |

---

## Deliverables Checklist

### A. Event Generator Module

- [ ] Create `lib/feed/eventGenerator.ts`
- [ ] `generateEventId(): string` — e.g., `evt-${Date.now()}-${random}`
- [ ] `createDefaultEngagement(): EngagementSummary` — zeroed-out engagement object
- [ ] `buildFeedEvent(params): FeedEvent` — constructs a FeedEvent with defaults

### B. _emitFeedEvent Helper (in store)

- [ ] `_emitFeedEvent(state, { type, actorId, subjectId, subjectType, metadata, causeCategory, communityId?, fundraiserId? })` → returns updated feedEvents map
- [ ] Auto-generates event ID and timestamp
- [ ] Creates default EngagementSummary (all zeros, empty arrays)

### C. Enhance addDonation

- [ ] After updating fundraiser/donor/community, emit `donation` FeedEvent
  - actorId = donorId, subjectId = fundraiserId, subjectType = "fundraiser"
  - metadata: `{ amount, message, donorName }`
- [ ] Check if new raisedAmount crosses 25%/50%/75%/100% thresholds
  - [ ] Only emit if milestone not already in fundraiser's `milestones` array
  - [ ] Emit `milestone_reached` FeedEvent with metadata: `{ percentage, amount, goalAmount }`
  - [ ] Add `FundraiserMilestone` to fundraiser's `milestones` array
- [ ] Check if new community totalRaised crosses $10K/$50K/$100K/$500K/$1M
  - [ ] Only emit if milestone not already in community's `milestones` array
  - [ ] Emit `community_milestone` FeedEvent with metadata: `{ threshold, amount }`
  - [ ] Add `CommunityMilestone` to community's `milestones` array

### D. Enhance addFundraiser

- [ ] After creating fundraiser, emit `fundraiser_launch` FeedEvent
  - actorId = organizerId, subjectId = fundraiser.id, subjectType = "fundraiser"
  - metadata: `{ title, goalAmount, causeCategory }`

### E. New joinCommunity Action

- [ ] `joinCommunity: (userId: string, communityId: string) => void`
- [ ] Add userId to community.memberIds, increment memberCount
- [ ] Add communityId to user.communityIds
- [ ] Emit `community_join` FeedEvent
  - actorId = userId, subjectId = communityId, subjectType = "community"

### F. Enhance follow Action (FR-029)

- [ ] After follow completes, check followee's new followerIds length
- [ ] If reaches 10, 50, or 100 → emit `profile_milestone` FeedEvent
  - actorId = followeeId, subjectId = followeeId, subjectType = "user"
  - metadata: `{ followerCount, threshold }`

---

## Files to Create

| File | Role |
|------|------|
| `lib/feed/eventGenerator.ts` | Event construction helpers — buildFeedEvent, generateEventId, createDefaultEngagement |

## Files to Modify

| File | Action |
|------|--------|
| `lib/store/index.ts` | Enhance addDonation/addFundraiser, add joinCommunity, enhance follow, add _emitFeedEvent |
| `lib/store/__tests__/store.test.ts` | Add tests for event generation and milestone detection |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/store/index.ts` | Current addDonation and addFundraiser implementations — understand the set() patterns |
| `lib/data/types.ts` | FeedEvent, FundraiserMilestone, CommunityMilestone types (after FR-026/FR-027) |
| `lib/data/seed.ts` | Current fundraiser goalAmounts and community totalRaised — understand what milestone thresholds are realistic |
| `fundright-prd-2.0.md` | PRD sections on event generation and milestone detection |

---

## Definition of Done for FR-031

- [ ] `_emitFeedEvent` helper works and creates well-formed FeedEvents
- [ ] Every `addDonation` call produces a `donation` FeedEvent
- [ ] Fundraiser milestone detection works at 25%/50%/75%/100% thresholds
- [ ] Community milestone detection works at $10K/$50K/$100K/$500K/$1M thresholds
- [ ] No duplicate milestones (each threshold fires once)
- [ ] `addFundraiser` produces a `fundraiser_launch` FeedEvent
- [ ] `joinCommunity` action works and produces a `community_join` FeedEvent
- [ ] `follow` action emits `profile_milestone` at 10/50/100 follower thresholds
- [ ] `lib/feed/eventGenerator.ts` created with helper functions
- [ ] Tests pass for event generation and milestone detection
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] DEVLOG updated with FR-031 entry
