# FR-010 Primer: Fundraiser Creation Flow

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 9, 2026
**Status:** COMPLETE
**Previous work:** FR-001 through FR-009 complete. Nav shell has "Start a FundRight" link.

---

## What Is This Ticket?

FR-010 is the **fundraiser creation flow** — a single-page form at `/create` that lets an organizer publish a campaign. On submit, the new fundraiser instantly appears across the platform (homepage, browse, community, profile).

### Why Does This Exist?

Without creation, the platform is read-only. An evaluator needs to experience the organizer journey: create a campaign, see it appear everywhere, receive donations, watch stats update. This closes the loop from "browse and donate" to "create and receive."

---

## What Was Built

### Create Page (`app/create/page.tsx`)
- **Form fields:** Title (max 80 chars), goal amount (min $100), story (min 50 words, 300+ recommended), cause category (required dropdown), community (optional dropdown from existing communities), cover image (5 preset picsum URLs), "Donating as" (organizer selection dropdown)
- **Validation:** Client-side with error messages per field
- **On submit:** `addFundraiser()` in store → generates unique slug → redirect to `/f/[slug]`

### Store Changes (`lib/store/index.ts`)
- **`addFundraiser(params)`:** Creates fundraiser with `fund-${Date.now()}-${random}` ID
- **Slug generation:** `slugify(title)` + `ensureUniqueSlug()` for collision detection
- **Atomic updates:** Creates fundraiser, updates community `fundraiserIds` and `fundraiserCount` when community is selected
- Returns `{ id, slug }` or `null`

### Data Changes
- Added `causeCategory` to Fundraiser type and all seed fundraisers
- Modified `app/f/[slug]/page.tsx` to not `notFound()` on server for unknown slugs (store-only fundraisers are valid)

---

## Key Files

| File | Role |
|------|------|
| `app/create/page.tsx` | Creation form with validation |
| `lib/store/index.ts` | `addFundraiser()` action, slugify, ensureUniqueSlug |
| `lib/data/types.ts` | `causeCategory` on Fundraiser type |
| `app/f/[slug]/page.tsx` | Modified to allow store-only fundraisers |

---

## Definition of Done (all met)

- [x] Start a FundRight in nav and homepage → /create
- [x] Form: title, goal, story, cause category, community (optional), cover preset, Donating as
- [x] addFundraiser() in store; redirect to /f/[slug] on success
- [x] New fundraiser on homepage, community (if linked), organizer profile
- [x] Validation: title required max 80, goal min $100, story min 50 words, category required
- [x] Store mutation atomic: fundraiser + community fundraiserIds/count when applicable
