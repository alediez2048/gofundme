# FR-036 Primer: FeedCard + Card Variants

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 1). FR-034 (EngagementBar) and FR-035 (FundraiserMiniCard) must be complete before starting this ticket.

---

## What Is This Ticket?

FR-036 builds the **polymorphic FeedCard** and its four variant sub-components. `FeedCard.tsx` dispatches to the correct variant based on `FeedEvent.type`. All cards share a consistent structure: **Header** (actor avatar + name + action text + timestamp + "..." menu) → **Body** (variant-specific content) → **Footer** (EngagementBar from FR-034).

The four variants are:
- **DonationCard** — donor message + embedded FundraiserMiniCard (FR-035)
- **MilestoneCard** — progress visualization + celebration banner
- **CommunityEventCard** — community milestone, join, or spotlight events
- **ProfileMilestoneCard** — inspired count, streak, personal achievements

### Why Does This Exist?

The feed is a heterogeneous stream of events. A polymorphic card system lets each event type render specialized content while maintaining visual consistency. `React.memo` on each variant ensures the virtualized feed performs well.

### Dependencies

- **FR-034 (EngagementBar):** Used in the footer of every card.
- **FR-035 (FundraiserMiniCard):** Embedded in DonationCard body.

### Current State

- No `components/feed/` directory exists yet (FR-034 and FR-035 will create it).
- `FeedEvent` type should be defined in FR-029 (data types) with a `type` discriminator field.
- Existing component patterns: `"use client"`, Zustand selectors, `hrt-card` CSS class for card containers.
- `Skeleton.tsx` has `FundraiserCardSkeleton` as a reference for card skeleton patterns.

---

## FR-036 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Polymorphic dispatch | `FeedCard` renders correct variant based on `FeedEvent.type` |
| Consistent structure | All cards: Header (avatar, name, action, timestamp, menu) → Body → Footer (EngagementBar) |
| DonationCard | Shows donor message + FundraiserMiniCard embed |
| MilestoneCard | Progress visualization + celebration banner |
| CommunityEventCard | Community milestone/join/spotlight content |
| ProfileMilestoneCard | Inspired count, streak, achievements |
| Performance | Each card variant wrapped in `React.memo` |
| Accessibility | Semantic markup, meaningful alt text, keyboard-navigable menu |

---

## Deliverables Checklist

### A. FeedCard (Dispatcher)

- [ ] Create `components/feed/FeedCard.tsx`
- [ ] Props: `event: FeedEvent`
- [ ] Switch on `event.type` to render correct variant
- [ ] Shared card header: actor avatar, display name, action description text, relative timestamp, "..." overflow menu
- [ ] Shared card footer: `<EngagementBar>` from FR-034
- [ ] Card wrapper with `hrt-card` styling

### B. DonationCard Variant

- [ ] Create `components/feed/DonationCard.tsx`
- [ ] Display donor's message/note
- [ ] Embed `FundraiserMiniCard` showing which fundraiser received the donation
- [ ] Show donation amount if public
- [ ] `React.memo` wrapped

### C. MilestoneCard Variant

- [ ] Create `components/feed/MilestoneCard.tsx`
- [ ] Progress visualization (percentage reached, e.g., "50% funded!")
- [ ] Celebration banner with appropriate visual treatment
- [ ] Context: which fundraiser hit the milestone
- [ ] `React.memo` wrapped

### D. CommunityEventCard Variant

- [ ] Create `components/feed/CommunityEventCard.tsx`
- [ ] Handle sub-types: community milestone, new member join, community spotlight
- [ ] Show community name, event description, relevant stats
- [ ] `React.memo` wrapped

### E. ProfileMilestoneCard Variant

- [ ] Create `components/feed/ProfileMilestoneCard.tsx`
- [ ] Display: inspired count, donation streak, personal achievements
- [ ] Celebratory visual treatment
- [ ] `React.memo` wrapped

### F. Card Header Component

- [ ] Reusable card header sub-component (or inline in FeedCard)
- [ ] Actor avatar (circular, using existing avatar patterns)
- [ ] Actor display name (linked to profile)
- [ ] Action text ("donated to", "reached a milestone", etc.)
- [ ] Relative timestamp ("2h ago", "yesterday")
- [ ] "..." overflow menu with report/hide options

---

## Files to Create

| File | Role |
|------|------|
| `components/feed/FeedCard.tsx` | Polymorphic dispatcher with shared header/footer |
| `components/feed/DonationCard.tsx` | Donation event variant |
| `components/feed/MilestoneCard.tsx` | Milestone event variant |
| `components/feed/CommunityEventCard.tsx` | Community event variant |
| `components/feed/ProfileMilestoneCard.tsx` | Profile milestone variant |

## Files to Modify

| File | Action |
|------|--------|
| `components/Skeleton.tsx` | Add `FeedCardSkeleton` export for loading states |

### Files to READ for Context

| File | Why |
|------|-----|
| `components/feed/EngagementBar.tsx` | FR-034 output — used in card footer |
| `components/feed/FundraiserMiniCard.tsx` | FR-035 output — embedded in DonationCard |
| `lib/store/index.ts` | Store structure, user/fundraiser data access |
| `components/Skeleton.tsx` | Existing skeleton patterns to extend |
| `tailwind.config.ts` | Design tokens |

---

## Definition of Done for FR-036

- [ ] FeedCard dispatches to correct variant based on event type
- [ ] All four variants render with consistent header/body/footer structure
- [ ] DonationCard embeds FundraiserMiniCard
- [ ] MilestoneCard shows progress visualization + celebration
- [ ] CommunityEventCard handles multiple community event sub-types
- [ ] ProfileMilestoneCard shows personal achievements
- [ ] All variants wrapped in `React.memo`
- [ ] FeedCardSkeleton added to Skeleton.tsx
- [ ] DEVLOG updated with FR-036 entry
