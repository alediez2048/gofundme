# FR-008 Primer: Homepage & Discovery

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 9, 2026
**Status:** COMPLETE
**Previous work:** FR-001 through FR-007 complete (Phase 1 MVP). FR-009 (Nav Shell) complete.

---

## What Is This Ticket?

FR-008 is the **homepage and discovery hub** — the entry point for the entire platform. It replaced the placeholder root route with a full discovery surface featuring trending fundraisers, active communities, category browsing, and search.

### Why Does This Exist?

Without a homepage, the platform has no entry point. A donor needs to land somewhere that shows what's available, what's trending, and how to find the right cause. The homepage answers "what should I look at?" before the donor has any specific intent.

---

## What Was Built

### Homepage (`app/page.tsx`)
- **Hero section:** Headline, subtitle, primary CTA "Start a FundRight" → `/create`, search bar → `/search?q=`
- **Platform stats banner:** Total raised, total donations, active fundraisers, active communities — all computed live from Zustand store
- **Trending Fundraisers:** Top 4 by donation count; cards with image, title, progress bar, organizer name; each links to `/f/[slug]`
- **Active Communities:** Community cards with name, banner, cause badge, aggregate stats; each links to `/communities/[slug]`
- **Browse by Category:** Grid of cause categories derived from communities; each links to `/browse/[category]` (URL-encoded)

All stats are live — donating on a fundraiser page and returning to the homepage shows updated totals.

---

## Key Files

| File | Role |
|------|------|
| `app/page.tsx` | Homepage server component (delegates to client) |
| `components/HomePageContent.tsx` | Full client-side homepage with store-driven stats |

---

## Definition of Done (all met)

- [x] Page at `/` replacing placeholder
- [x] Hero: headline, subtitle, CTA "Start a FundRight" → /create
- [x] Platform stats: total raised, donations, active fundraisers, active communities (from store)
- [x] Trending Fundraisers: top 4 by donation count, cards → /f/[slug]
- [x] Active Communities: cards with name, banner, cause badge, stats → /communities/[slug]
- [x] Browse by Category: cause categories → /browse/[category]
- [x] Search bar in hero → /search?q= on submit
- [x] Stats live (store-driven)
