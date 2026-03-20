# FR-027 Primer: Extend Existing Entity Types

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 0 clone + AI layer). FR-026 adds new feed entity types. This ticket extends the *existing* User, Fundraiser, Community, and Donation interfaces with fields needed by the social feed.

---

## What Is This Ticket?

FR-027 **extends the four existing entity types** — `User`, `Fundraiser`, `Community`, and `Donation` — with additional fields required by the social feed system. It also **expands the `CauseCategory` union** to include four new categories. This is still a types-only ticket — no store logic, no seed data, no UI — but it modifies existing interfaces rather than creating new ones.

### Why Does This Exist?

The current entity types were designed for a transactional donation platform. The social feed requires users to have follower graphs, giving streaks, and cause identities; fundraisers to track velocity and milestones; communities to have leaderboards; and donations to have visibility settings. These fields must exist on the types before any downstream ticket can populate or display them.

### Dependencies

- **FR-026 (New Feed Types):** MUST be complete first. This ticket references `FundraiserMilestone`, `CommunityMilestone`, and `LeaderboardEntry` from FR-026.

### Current State

- `User` has 12 fields: id, username, name, bio, avatar, verified, joinDate, socialLinks, communityIds, donationIds, totalDonated, sameAs
- `Fundraiser` has 11 fields: id, slug, title, story, goalAmount, raisedAmount, donationCount, organizerId, communityId, causeCategory, donationIds, heroImageUrl, updates
- `Community` has 13 fields: id, slug, name, description, causeCategory, bannerImageUrl, memberIds, fundraiserIds, totalRaised, donationCount, fundraiserCount, memberCount, faq, sameAs, nonprofitStatus
- `Donation` has 6 fields: id, amount, donorId, fundraiserId, message, createdAt
- `CauseCategory` is: `"Disaster Relief & Wildfire Safety" | "Medical & Healthcare"`

---

## FR-027 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| User extended | +8 fields: coverPhoto, causeIdentity, stats, highlights, givingStreak, impactSummary, followerIds, followingIds, bookmarkedIds |
| Fundraiser extended | +3 fields: donationVelocity, milestones, status |
| Community extended | +2 fields: milestones, leaderboard |
| Donation extended | +1 field: isPublic |
| CauseCategory expanded | Add 4 new categories to union |
| Backward compatible | All new fields are optional (?) so existing seed data compiles without changes |
| No runtime code | Types only — no functions, no store changes |

---

## Deliverables Checklist

### A. User Extensions (+8 fields)

- [ ] `coverPhoto?: string` — profile banner image URL
- [ ] `causeIdentity?: CauseCategory` — primary cause this user supports
- [ ] `stats?: { totalRaised: number; peopleHelped: number; fundraisersSupported: number }` — aggregated stats object
- [ ] `highlights?: string[]` — fundraiser IDs to feature on profile
- [ ] `givingStreak?: number` — consecutive months of donations
- [ ] `impactSummary?: string` — AI-generated narrative about user's impact
- [ ] `followerIds?: string[]` — users who follow this user
- [ ] `followingIds?: string[]` — users this user follows
- [ ] `bookmarkedIds?: string[]` — feed event IDs bookmarked by user

### B. Fundraiser Extensions (+3 fields)

- [ ] `donationVelocity?: number` — donations per day (rolling average)
- [ ] `milestones?: FundraiserMilestone[]` — percentage milestones reached (from FR-026 type)
- [ ] `status?: "active" | "completed" | "paused"` — fundraiser lifecycle status

### C. Community Extensions (+2 fields)

- [ ] `milestones?: CommunityMilestone[]` — amount milestones reached (from FR-026 type)
- [ ] `leaderboard?: LeaderboardEntry[]` — top donors ranked (from FR-026 type)

### D. Donation Extension (+1 field)

- [ ] `isPublic?: boolean` — whether donation is visible in feed (default true)

### E. CauseCategory Expansion

- [ ] Add `"Education"` to union
- [ ] Add `"Environment & Climate"` to union
- [ ] Add `"Animals & Wildlife"` to union
- [ ] Add `"Community & Neighbors"` to union

---

## Files to Create

| File | Role |
|------|------|
| None | All changes are modifications to existing files |

## Files to Modify

| File | Action |
|------|--------|
| `lib/data/types.ts` | Add optional fields to User, Fundraiser, Community, Donation interfaces; expand CauseCategory union |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/data/types.ts` | Current interface definitions — must understand exact field names and structure before extending |
| `lib/data/seed.ts` | Verify new optional fields won't break existing seed data (all must be `?` optional) |
| `lib/store/index.ts` | See how entities are constructed in `addFundraiser` and `addDonation` — new optional fields shouldn't require changes here |
| `fundright-prd-2.0.md` | PRD sections on User profile, fundraiser velocity, community leaderboards |

---

## Definition of Done for FR-027

- [ ] User interface has 8 new optional fields
- [ ] Fundraiser interface has 3 new optional fields (donationVelocity, milestones, status)
- [ ] Community interface has 2 new optional fields (milestones, leaderboard)
- [ ] Donation interface has 1 new optional field (isPublic)
- [ ] CauseCategory union has 6 total values (2 existing + 4 new)
- [ ] All new fields are optional (`?`) — existing code compiles without changes
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] DEVLOG updated with FR-027 entry
