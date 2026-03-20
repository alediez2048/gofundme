# FR-041 Primer: RightSidebar (Discovery & Trending)

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 1). FR-032 (trending algorithm) and FR-033 (feed seed data) should be complete.

---

## What Is This Ticket?

FR-041 builds the **RightSidebar** — a discovery panel in the right column of the feed layout. It contains four sections: Trending Fundraisers, Community Spotlight, FundRight News, and Suggested People.

On desktop it is sticky-positioned with independent scroll. On tablet it collapses to a "Discover" tab. On mobile it is hidden (accessible via Explore tab).

### Why Does This Exist?

The right sidebar drives discovery and re-engagement. Trending fundraisers surface high-momentum campaigns. Community spotlight encourages community joining. Suggested people expand the user's social graph. This mirrors proven social platform patterns.

### Dependencies

- **FR-032 (Trending Algorithm):** Provides `donationVelocity` and ranking logic for trending fundraisers.
- **FR-033 (Feed Seed Data):** Provides curated news items and sufficient data for suggestions.

### Current State

- Zustand store has `fundraisers: EntityMap<Fundraiser>` and `communities: EntityMap<Community>`.
- Fundraiser type includes `raised`, `goal`, `donorCount`, and potentially `donationVelocity` (from FR-032).
- Community type includes `memberCount` and growth data.
- No sidebar components exist yet.
- `ProgressBar` component available for fundraiser progress display.

---

## FR-041 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Trending Fundraisers | Top 3-5 by donationVelocity, title + raised + donors + momentum indicator, clickable |
| Community Spotlight | 2-3 communities with growth rate, inline "Join" button |
| FundRight News | 3-4 curated news items (static seed data) |
| Suggested People | Users with cause affinity overlap, inline "Follow" button |
| Desktop | Sticky position, independent scroll |
| Tablet | Collapses to "Discover" tab |
| Mobile | Hidden (Explore tab) |

---

## Deliverables Checklist

### A. Trending Fundraisers Section

- [ ] Read fundraisers from store, sort by `donationVelocity` (or fallback to recent donation count)
- [ ] Display top 3-5: title, amount raised, donor count, momentum indicator (arrow/flame icon)
- [ ] Each item clickable → `/f/[slug]`
- [ ] Compact card format

### B. Community Spotlight Section

- [ ] Select 2-3 communities with highest growth rate
- [ ] Display: community name, member count, growth indicator
- [ ] Inline "Join" button (optimistic UI update)
- [ ] Each item clickable → `/communities/[slug]`

### C. FundRight News Section

- [ ] 3-4 static news items (hardcoded or from seed data)
- [ ] Each item: headline, brief description, "Read more" (can be no-op link)
- [ ] Simple list format

### D. Suggested People Section

- [ ] Select users with cause affinity overlap to current user
- [ ] Display: avatar, name, brief reason ("Also supports Education causes")
- [ ] Inline "Follow" button (optimistic UI update)
- [ ] Each item clickable → `/u/[username]`

### E. Responsive Behavior

- [ ] `sticky top-20` with `overflow-y-auto max-h-[calc(100vh-5rem)]` on desktop
- [ ] On tablet (`md:` to `lg:`): collapse to "Discover" tab or compact mode
- [ ] `hidden lg:block` on mobile (or accessible via separate Explore route)

---

## Files to Create

| File | Role |
|------|------|
| `components/feed/RightSidebar.tsx` | Right column discovery panel |

## Files to Modify

| File | Action |
|------|--------|
| None | FR-042 (FeedPage) will place this in the grid |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/store/index.ts` | Fundraiser and community data, trending selectors |
| `components/ProgressBar.tsx` | Compact progress display for trending fundraisers |
| `components/BrowsePageContent.tsx` | Existing fundraiser listing patterns |
| `tailwind.config.ts` | Design tokens |

---

## Definition of Done for FR-041

- [ ] Trending Fundraisers section shows top 3-5 by velocity with momentum indicator
- [ ] Community Spotlight shows 2-3 communities with growth rate and Join button
- [ ] FundRight News shows 3-4 curated items
- [ ] Suggested People shows users with affinity overlap and Follow button
- [ ] Sticky with independent scroll on desktop
- [ ] Responsive collapse on tablet, hidden on mobile
- [ ] DEVLOG updated with FR-041 entry
