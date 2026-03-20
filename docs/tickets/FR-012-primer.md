# FR-012 Primer: Search

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 10, 2026
**Status:** COMPLETE
**Previous work:** FR-001 through FR-011 complete. Header search bar and homepage search submit to `/search?q=`.

---

## What Is This Ticket?

FR-012 is the **search page** — client-side fuzzy search across fundraisers, communities, and users at `/search?q=[query]`.

### Why Does This Exist?

Users with specific intent ("Watch Duty", "wildfire", "janahan") need a direct path to what they're looking for. Search is the fastest path from intent to action. It also validates the data model — if search works, the entities are well-structured.

---

## What Was Built

### Search Page (`app/search/page.tsx` + `components/SearchPageContent.tsx`)
- **Query:** Reads `?q=[query]` from URL params
- **Fuzzy search:** Matches query words against:
  - Fundraiser titles and stories
  - Community names and descriptions
  - User display names
- **Results grouped by type:** "Fundraisers", "Communities", "People" — each with up to 5 results
- **Links:** Each result links to its respective page (`/f/`, `/communities/`, `/u/`)
- **Empty state:** "No results for '[query]'. Try a different search or browse by category." with link to `/browse`
- **Performance:** Instant — filters Zustand store data client-side, no API calls

---

## Key Files

| File | Role |
|------|------|
| `app/search/page.tsx` | Search page route |
| `components/SearchPageContent.tsx` | Client-side fuzzy search with grouped results |

---

## Definition of Done (all met)

- [x] Search page at `/search?q=[query]`
- [x] Search bar in hero (homepage) submits to `/search?q=`
- [x] Client-side fuzzy search across fundraiser titles/stories, community names/descriptions, user names
- [x] Results grouped: Fundraisers, Communities, People — up to 5 each
- [x] Each result links to respective page
- [x] Empty state with browse fallback
- [x] Search is instant (client-side, no API)
