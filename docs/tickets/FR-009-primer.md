# FR-009 Primer: Global Navigation Shell

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 9, 2026
**Status:** COMPLETE
**Previous work:** FR-001 through FR-007 complete (Phase 1 MVP).

---

## What Is This Ticket?

FR-009 is the **global navigation shell** — persistent header, footer, mobile menu, and breadcrumb trail on every page. It also subsumes the original FR-008 (Cross-Page Navigation & Link Graph) requirement, ensuring zero dead ends.

### Why Does This Exist?

Without consistent navigation, users hit dead ends. Every page needs clear paths forward: back to home, to communities, to create a fundraiser, or to their profile. The nav shell is the connective tissue that makes the platform feel like one product instead of isolated pages.

---

## What Was Built

### Header (`components/Header.tsx`)
- **Desktop:** FundRight logo (→ `/`), nav links (Discover → `/`, Communities → `/communities`, Browse → `/browse`, Start a FundRight → `/create`), profile avatar dropdown
- **Profile dropdown:** Links to default user profile (`/u/janahan`), My Fundraisers (→ profile), Sign Out (cosmetic — no real auth)
- **Mobile:** Hamburger menu at `md:` breakpoint, slide-out nav drawer with same links
- **Active page indicator:** Current nav item visually highlighted

### Footer (`components/Footer.tsx`)
- Platform description, quick links (About, How It Works, Browse, Communities), copyright

### Breadcrumbs (`components/Breadcrumbs.tsx`)
- Navigation context on detail pages:
  - Fundraiser: Home / [Community] / [Title]
  - Community: Home / Communities / [Name]
  - Profile: Home / [Name]

### Communities Index (`app/communities/page.tsx`)
- Lists all communities from store — no dead `/communities` link

### Link Graph
- All entity names and avatars across the platform are clickable links to their respective pages
- No dead links: every entity ID in the store has a corresponding rendered page

---

## Key Files

| File | Role |
|------|------|
| `components/Header.tsx` | Persistent nav with mobile hamburger |
| `components/Footer.tsx` | Site-wide footer |
| `components/Breadcrumbs.tsx` | Breadcrumb trail for detail pages |
| `app/communities/page.tsx` | Communities index listing |
| `app/communities/layout.tsx` | Communities layout wrapper |
| `app/layout.tsx` | Root layout (Header + Footer wiring) |

---

## Definition of Done (all met)

- [x] Persistent header: logo, nav (Discover, Communities, Start a FundRight), profile dropdown
- [x] Profile dropdown: default user profile, My Fundraisers, Sign Out (cosmetic)
- [x] Footer: description, quick links, copyright
- [x] Mobile: hamburger, slide-out drawer with same links
- [x] Active page indicator
- [x] Entity names/avatars clickable
- [x] No dead links: /communities index added
- [x] Breadcrumbs on Fundraiser, Community, Profile detail pages
