# FR-049 Primer: Profile-Scoped Activity Feed

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (core platform, AI service layer, traces panel). Phase 2 work (FR-036 FeedCard) and Phase 3 work (FR-047 impact summary, FR-048 recommendations) are dependencies.

---

## What Is This Ticket?

FR-049 adds an **activity feed section to profile pages** and enhances profiles with new data-driven sections. The activity feed reuses the FeedCard and EngagementBar components (from FR-036) filtered to show only activity where `actorId === userId`. Beyond the feed, this ticket also adds display sections for new profile fields: cover photo banner, cause identity badges, giving streak counter, AI-generated impact summary (from FR-047), pinned highlights, a "People like you also supported..." recommendations section (from FR-048), and an enhanced giving dashboard with visual breakdowns.

This is primarily a UI integration ticket — it assembles existing components and data from earlier tickets into a richer profile experience.

### Why Does This Exist?

A profile page that only shows basic info and a list of organized campaigns misses the story of a donor's journey. The profile-scoped activity feed shows what a user has been doing (donating, creating campaigns, joining communities), while the enhanced sections — impact summary, cause badges, recommendations — turn a static profile into a living dashboard. This is where FR-047 and FR-048 become visible to the user.

### Dependencies

- **FR-036 (FeedCard):** REQUIRED — provides the FeedCard and EngagementBar components to reuse
- **FR-047 (Impact Summary):** REQUIRED — provides the AI-generated impact summary displayed on the profile
- **FR-048 (Recommendations):** REQUIRED — provides the "People like you also supported..." section

### Current State

- `ProfilePageContent.tsx` exists with a working profile layout:
  - `ProfileByUsername` component fetches user, fundraisers, communities, donations from Zustand store
  - `buildImpactSummary()` helper (lines 31–57) generates a template-based impact summary from raw stats
  - `ProfileWaveDivider` SVG component for visual separation
  - `CAUSE_SHIELD` mapping for cause category badges (Medical, Safety & Environment) with emoji + color classes
  - Displays: user avatar, name, bio, verified badge, social links, organized campaigns, communities
- User type has: `totalDonated`, `donationIds`, `communityIds`, `bio`, `avatar`, `verified`, `joinDate`, `socialLinks`
- User type does NOT yet have: `coverPhoto`, `causeIdentity`, `givingStreak`, `impactSummary`, `highlights` — these are added by FR-027 (extended user types)
- No activity feed or FeedCard component on profile pages yet

---

## FR-049 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Activity feed | FeedCard + EngagementBar filtered by `actorId === userId` |
| Cover photo | Banner image at top of profile (from `user.coverPhoto`) |
| Cause identity badges | Display user's cause identity badges from profile data |
| Giving streak | Visual counter showing consecutive giving streak |
| Impact summary | AI-generated summary from FR-047 displayed prominently |
| Highlights | Pinned/highlighted items section |
| Recommendations | "People like you also supported..." section from FR-048 |
| Giving dashboard | `totalDonated`, `causesSupported`, `communitiesJoined` with visual breakdown |

---

## Deliverables Checklist

### A. Profile Activity Feed

- [ ] Add activity feed section to `ProfilePageContent.tsx`
- [ ] Import and reuse FeedCard + EngagementBar components from FR-036
- [ ] Filter feed items where `actorId === userId` (user's own activity)
- [ ] Show recent activity: donations made, campaigns created, communities joined
- [ ] Paginate or "Show more" for long activity lists
- [ ] Empty state: "No activity yet" message

### B. Cover Photo Banner

- [ ] Add cover photo banner section at top of profile
- [ ] Read from `user.coverPhoto` field (from FR-027)
- [ ] Fallback: gradient banner or category-themed default
- [ ] Maintain existing `ProfileWaveDivider` visual transition

### C. Cause Identity Badges

- [ ] Display cause identity badges from user profile data
- [ ] Leverage existing `CAUSE_SHIELD` mapping for styling
- [ ] Show as pill-shaped badges near user name/bio area

### D. Giving Streak Counter

- [ ] Compute or display `givingStreak` from user profile (FR-027 field)
- [ ] Visual counter component (flame icon + number, or similar)
- [ ] Position in stats area of profile

### E. Impact Summary Section

- [ ] Display AI-generated impact summary from `user.impactSummary` (FR-047)
- [ ] Show "AI-generated" indicator badge when `isAiGenerated` is true
- [ ] Fallback to template-based `buildImpactSummary()` when no AI summary cached
- [ ] Optional: "Regenerate" button that triggers FR-047 API

### F. Highlights / Pinned Items

- [ ] Display `user.highlights` array as pinned items section
- [ ] Each highlight links to the referenced fundraiser or community
- [ ] Empty state: section hidden when no highlights

### G. Recommendations Section

- [ ] Import `getRecommendations()` from FR-048
- [ ] Display "People like you also supported..." section
- [ ] Show 3–4 fundraiser cards in horizontal row
- [ ] Only show on own profile or when sufficient data exists

### H. Enhanced Giving Dashboard

- [ ] `totalDonated` with formatted currency
- [ ] `causesSupported` count with category breakdown (pie/bar chart or badge list)
- [ ] `communitiesJoined` count with community name list
- [ ] Visual breakdown: cards or stat blocks with icons

---

## Files to Create

| File | Role |
|------|------|
| `components/ProfileActivityFeed.tsx` | Activity feed section component (optional — could be inline) |
| `components/GivingDashboard.tsx` | Enhanced giving stats with visual breakdown (optional — could be inline) |

## Files to Modify

| File | Action |
|------|--------|
| `components/ProfilePageContent.tsx` | Add all new sections: activity feed, cover photo, badges, streak, impact summary, highlights, recommendations, giving dashboard |

### Files to READ for Context

| File | Why |
|------|-----|
| `components/ProfilePageContent.tsx` | Current profile layout — insertion points for new sections |
| `lib/data/types.ts` | User type fields (current + extended from FR-027) |
| `lib/store/index.ts` | Store structure for accessing user, donations, fundraisers |
| FeedCard component (from FR-036) | Component API to reuse for activity feed |
| EngagementBar component (from FR-036) | Component API to reuse for activity feed |
| `lib/ai/impact-summary.ts` | FR-047 API for generating/retrieving impact summaries |
| `lib/ai/recommendations.ts` | FR-048 API for getting personalized recommendations |

---

## Definition of Done for FR-049

- [ ] Activity feed section shows user's activity filtered by `actorId === userId`
- [ ] Cover photo banner renders with fallback
- [ ] Cause identity badges display correctly
- [ ] Giving streak counter is visible
- [ ] AI-generated impact summary displays with AI indicator
- [ ] Highlights/pinned items section renders when data exists
- [ ] "People like you also supported..." recommendations section works
- [ ] Enhanced giving dashboard shows totalDonated, causesSupported, communitiesJoined
- [ ] All sections have appropriate empty/fallback states
- [ ] No regressions in existing profile page functionality
- [ ] DEVLOG updated with FR-049 entry
