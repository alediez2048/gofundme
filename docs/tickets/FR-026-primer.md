# FR-026 Primer: New TypeScript Types for Feed Entities

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 0 clone + AI layer). Core data model has User, Fundraiser, Community, Donation types. Zustand store with persist to localStorage. No feed or engagement types exist yet.

---

## What Is This Ticket?

FR-026 introduces the **new TypeScript types** needed by the social feed system. These are entirely new interfaces — `FeedEvent`, `EventType`, `Comment`, `FollowRelationship`, `FundraiserMilestone`, `CommunityMilestone`, `LeaderboardEntry`, and `EngagementSummary` — that do not exist in the codebase today. They form the type foundation for every Phase 1 ticket that follows.

This is a types-only ticket. No store logic, no UI, no seed data. Just the contracts that the rest of Phase 1 builds against.

### Why Does This Exist?

The feed system requires a rich event model (donations become social moments, milestones re-enter circulation, communities celebrate breakthroughs). None of these concepts have type definitions yet. By defining all new types first in a single ticket, every downstream ticket (FR-027 through FR-033) can import and build against stable contracts without type churn.

### Dependencies

- **None.** This is the first ticket in Phase 1 and has no blockers.

### Current State

- `lib/data/types.ts` defines 7 types/interfaces: `SocialPlatform`, `CauseCategory`, `SocialLink`, `User`, `FundraiserUpdate`, `Fundraiser`, `FAQItem`, `Community`, `Donation`
- No feed-related types exist anywhere in the codebase
- `CauseCategory` is currently a narrow union: `"Disaster Relief & Wildfire Safety" | "Medical & Healthcare"`
- The store (`lib/store/index.ts`) uses `EntityMap<T> = Record<string, T>` for normalized slices

---

## FR-026 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| FeedEvent type | Comprehensive event type with actor, subject, metadata, engagement, timestamps |
| EventType union | Covers: `donation`, `fundraiser_launch`, `milestone_reached`, `community_milestone`, `community_join`, `profile_milestone` |
| Comment type | id, authorId, text, createdAt, optional parentId for threading |
| FollowRelationship | followerId, followeeId, createdAt |
| FundraiserMilestone | type (percentage-based: 25/50/75/100%), reachedAt, amount |
| CommunityMilestone | type (amount-based: $10K/$50K/$100K/$500K/$1M), reachedAt, amount |
| LeaderboardEntry | userId, rank, amount, donationCount (for community leaderboards) |
| EngagementSummary | heartCount, commentCount, shareCount, heartedByUserIds, comments array, bookmarkedByUserIds |
| Exports | All types exported from `lib/data/types.ts` and re-exported from `lib/data/index.ts` |
| No runtime code | Types only — no functions, no store changes, no seed data |

---

## Deliverables Checklist

### A. EventType Union

- [ ] Define `EventType` as string literal union: `"donation" | "fundraiser_launch" | "milestone_reached" | "community_milestone" | "community_join" | "profile_milestone"`

### B. FeedEvent Interface

- [ ] `id: string`
- [ ] `type: EventType`
- [ ] `actorId: string` — the user who triggered the event
- [ ] `subjectId: string` — the entity the event is about (fundraiser, community, user)
- [ ] `subjectType: "fundraiser" | "community" | "user"`
- [ ] `metadata: Record<string, unknown>` — flexible payload per event type (milestone %, amount, etc.)
- [ ] `engagement: EngagementSummary`
- [ ] `causeCategory: CauseCategory`
- [ ] `createdAt: string` — ISO timestamp
- [ ] Optional `communityId?: string`
- [ ] Optional `fundraiserId?: string`

### C. Comment Interface

- [ ] `id: string`
- [ ] `authorId: string`
- [ ] `text: string`
- [ ] `createdAt: string`
- [ ] Optional `parentId?: string` (for reply threading)

### D. FollowRelationship Interface

- [ ] `followerId: string`
- [ ] `followeeId: string`
- [ ] `createdAt: string`

### E. FundraiserMilestone Interface

- [ ] `type: "25%" | "50%" | "75%" | "100%"`
- [ ] `reachedAt: string`
- [ ] `amount: number`

### F. CommunityMilestone Interface

- [ ] `type: "$10K" | "$50K" | "$100K" | "$500K" | "$1M"`
- [ ] `reachedAt: string`
- [ ] `amount: number`

### G. LeaderboardEntry Interface

- [ ] `userId: string`
- [ ] `rank: number`
- [ ] `amount: number`
- [ ] `donationCount: number`

### H. EngagementSummary Interface

- [ ] `heartCount: number`
- [ ] `commentCount: number`
- [ ] `shareCount: number`
- [ ] `heartedByUserIds: string[]`
- [ ] `comments: Comment[]`
- [ ] `bookmarkedByUserIds: string[]`

---

## Files to Create

| File | Role |
|------|------|
| None | All types go into the existing `lib/data/types.ts` |

## Files to Modify

| File | Action |
|------|--------|
| `lib/data/types.ts` | Add all 8 new type definitions below existing types |
| `lib/data/index.ts` | Ensure new types are re-exported |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/data/types.ts` | Current type definitions — understand naming conventions, style, and existing types |
| `lib/data/index.ts` | Current exports — ensure new types follow the same export pattern |
| `lib/store/index.ts` | See how types are imported and used — `EntityMap<T>` pattern |
| `fundright-prd-2.0.md` | PRD sections on FeedEvent entity and engagement primitives for field-level detail |

---

## Definition of Done for FR-026

- [ ] All 8 types/interfaces defined in `lib/data/types.ts`
- [ ] `EventType` union covers all 6 event types
- [ ] `FeedEvent` has actorId, subjectId, subjectType, metadata, engagement, causeCategory, createdAt
- [ ] `EngagementSummary` has heartCount, commentCount, shareCount, heartedByUserIds, comments, bookmarkedByUserIds
- [ ] All new types exported from `lib/data/index.ts`
- [ ] No runtime code — types only
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] DEVLOG updated with FR-026 entry
