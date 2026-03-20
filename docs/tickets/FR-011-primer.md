# FR-011 Primer: Category Browse Page

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 10, 2026
**Status:** COMPLETE
**Previous work:** FR-001 through FR-010 complete. Homepage links to categories.

---

## What Is This Ticket?

FR-011 is the **category browse page** — a filterable directory of fundraisers at `/browse` and `/browse/[category]`. It lets donors discover campaigns by cause category with sorting and filtering.

### Why Does This Exist?

Not every donor arrives with a specific campaign in mind. Category browsing bridges the gap between "I care about wildfire relief" and finding a specific fundraiser. It also ensures newly created fundraisers are immediately discoverable by category.

---

## What Was Built

### Browse Pages
- **`/browse`** — Shows all fundraisers with horizontal category chip bar (All + each unique `causeCategory`)
- **`/browse/[category]`** — Filters by URL-encoded category
- **Sort options:** Most Recent, Most Funded, Closest to Goal, Just Launched
- **Fundraiser grid:** Cards with image, title, progress bar, organizer name (→ `/u/`), community badge (→ `/communities/`); each card links to `/f/[slug]`
- **Empty state:** "No fundraisers in this category yet. Be the first!" with link to `/create`
- **Results count:** "X fundraisers in [Category]" header
- **Browse link** added to Header nav

---

## Key Files

| File | Role |
|------|------|
| `app/browse/page.tsx` | Browse all fundraisers (no filter) |
| `app/browse/[category]/page.tsx` | Browse by specific category |
| `components/BrowsePageContent.tsx` | Shared client component with filters and grid |

---

## Definition of Done (all met)

- [x] Page at `/browse/[category]` with fundraisers filtered by cause category
- [x] Also at `/browse` showing all fundraisers with category chips
- [x] Category filter: horizontal scrollable chip bar, active highlighted
- [x] Fundraiser grid: cards with image, title, progress bar, organizer name, community badge
- [x] Sort options: Most Recent, Most Funded, Closest to Goal, Just Launched
- [x] Empty state with link to create flow
- [x] Results count header
- [x] Each card links to /f/[slug]
