# FR-050 Primer: Community-Scoped Activity Feed

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (core platform, AI service layer, traces panel). Phase 2 work (FR-036 FeedCard, FR-033 seed data) are dependencies.

---

## What Is This Ticket?

FR-050 adds an **activity feed section to community pages** along with community-specific engagement features. The activity feed reuses FeedCard and EngagementBar components (from FR-036) filtered to show only events related to the community (donations to community fundraisers, new fundraisers created, member joins). Beyond the feed, this ticket adds a member leaderboard (top donors + most-inspiring members), community milestone badges (e.g., "Crossed $100K", "1K Members"), and a "People you follow in this community" section for authenticated users.

### Why Does This Exist?

Community pages currently show fundraisers and an AI-generated cause summary, but lack the social activity layer that makes communities feel alive. An activity feed shows real-time engagement — who donated, who launched a new campaign, who just joined. The leaderboard and milestones add gamification that drives participation. The "people you follow" section leverages the social graph (FR-029) to create personal connection within the community context.

### Dependencies

- **FR-036 (FeedCard):** REQUIRED — provides the FeedCard and EngagementBar components to reuse
- **FR-033 (Seed Data):** REQUIRED — provides sufficient community membership and donation data

### Current State

- `CommunityPageContent.tsx` exists with a working community page layout:
  - `FundraiserCard` internal component renders individual fundraiser cards
  - `FundraiserSearch` component with query, sort, smart search (AI-powered via `keywordFilter`)
  - Displays: community banner, name, description, member count, fundraiser count, total raised
  - AI-powered cause summary via `CauseSummaryResult` from `lib/ai/cause-intelligence.ts`
  - AI-powered fundraiser discovery via `keywordFilter` from `lib/ai/community-discovery.ts`
  - Sort options: popular, closest to goal, most funded, just launched
- Community type has: `memberIds`, `fundraiserIds`, `totalRaised`, `donationCount`, `fundraiserCount`, `memberCount`, `causeCategory`, `faq`
- User type has: `communityIds`, `donationIds`
- No activity feed, leaderboard, or milestone badges on community pages yet

---

## FR-050 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Activity feed | FeedCard + EngagementBar filtered by community-related events |
| Member leaderboard | Top donors + most-inspiring members (by "inspired X people") |
| Milestone badges | Community achievements: crossed $100K, 1K members, etc. |
| Follow integration | "People you follow in this community" for authenticated users |
| Seed data support | Works with FR-033 seed data |

---

## Deliverables Checklist

### A. Community Activity Feed

- [ ] Add activity feed section to `CommunityPageContent.tsx`
- [ ] Import and reuse FeedCard + EngagementBar components from FR-036
- [ ] Filter feed items by community relevance:
  - Donations to fundraisers in this community
  - New fundraisers created in this community
  - New members joining this community
- [ ] Chronological ordering, most recent first
- [ ] Paginate or "Show more" for long feeds
- [ ] Empty state: "No recent activity in this community"

### B. Member Leaderboard

- [ ] Add leaderboard section to community page
- [ ] **Top Donors:** Rank members by total donated to this community's fundraisers
  - Compute per-member donation total scoped to community fundraiser IDs
  - Show top 5–10 with avatar, name, total donated
- [ ] **Most Inspiring:** Rank by "inspired X people" metric
  - Compute from donation chain or referral data if available
  - Fallback: rank by number of donations made (engagement proxy)
- [ ] Tab or toggle between "Top Donors" and "Most Inspiring"
- [ ] Each entry links to user profile

### C. Community Milestone Badges

- [ ] Compute milestone achievements from community stats:
  - Total raised milestones: $10K, $50K, $100K, $500K, $1M
  - Member count milestones: 100, 500, 1K, 5K, 10K
  - Fundraiser count milestones: 10, 50, 100
- [ ] Display as badge row (icon + label) near community header or stats area
- [ ] Visually distinct styling (gold/silver badges, achievement icons)
- [ ] Only show achieved milestones (not upcoming)

### D. "People You Follow in This Community"

- [ ] For authenticated users, show members they follow who are in this community
- [ ] Uses follow system from FR-029
- [ ] Display as avatar row with names
- [ ] Link each to user profile
- [ ] Hidden when user follows no one in this community
- [ ] Hidden for unauthenticated users

### E. Layout Integration

- [ ] Position activity feed below fundraiser listings or in a tabbed view
- [ ] Leaderboard in sidebar or dedicated section
- [ ] Milestone badges near community header stats
- [ ] "People you follow" near the top for social proof

---

## Files to Create

| File | Role |
|------|------|
| `components/CommunityLeaderboard.tsx` | Top donors + most-inspiring leaderboard (optional — could be inline) |
| `components/CommunityMilestones.tsx` | Milestone badges display (optional — could be inline) |

## Files to Modify

| File | Action |
|------|--------|
| `components/CommunityPageContent.tsx` | Add activity feed, leaderboard, milestones, follow section |

### Files to READ for Context

| File | Why |
|------|-----|
| `components/CommunityPageContent.tsx` | Current community page layout — insertion points for new sections |
| `lib/data/types.ts` | Community, User, Donation, Fundraiser type definitions |
| `lib/store/index.ts` | Store structure for accessing community members, donations, fundraisers |
| FeedCard component (from FR-036) | Component API to reuse for activity feed |
| EngagementBar component (from FR-036) | Component API to reuse for activity feed |
| Follow system (from FR-029) | API for checking who the user follows |

---

## Definition of Done for FR-050

- [ ] Activity feed shows community-scoped events (donations, new fundraisers, new members)
- [ ] Member leaderboard displays top donors and most-inspiring members
- [ ] Community milestone badges render for achieved milestones
- [ ] "People you follow in this community" section works for authenticated users
- [ ] All sections have appropriate empty/fallback states
- [ ] Layout integrates naturally with existing community page structure
- [ ] No regressions in existing community page functionality (search, sort, cause summary)
- [ ] DEVLOG updated with FR-050 entry
