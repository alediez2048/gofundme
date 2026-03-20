# FR-005 Primer: Community Page (/communities/[slug])

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 9, 2026
**Status:** COMPLETE
**Previous work:** FR-001 through FR-003 complete (scaffold, data model, store).

---

## What Is This Ticket?

FR-005 is the **community detail page** — the discovery and belonging layer. It renders a community at `/communities/[slug]` with aggregate stats, fundraiser directory, guided discovery modules, FAQ accordion, and member grid.

### Why Does This Exist?

GoFundMe's Community pages aggregate campaigns but don't do enough product work. A donor still has to decide which fundraiser is most relevant. Our community page guides that decision with "most urgent," "closest to goal," and "best match" modules instead of acting as a passive directory.

---

## What Was Built

### Server Component (`app/communities/[slug]/page.tsx`)
- `generateMetadata()` reads seed data for title/description
- Calls `getCauseSummary()` server-side for AI-generated cause intelligence (FR-023)
- Passes community data + cause summary to client component

### Client Component (`components/CommunityPageContent.tsx`)
- **Header:** Banner image, H1, cause category badge, aggregate stats (total raised, donation count, fundraiser count, member count)
- **About This Cause:** AI-generated summary (FR-023) or fallback to `community.description`
- **Fundraiser directory:** Grid of cards (image, title, progress bar, organizer name) sorted by activity; each links to `/f/[slug]`
- **Guided discovery:** "Most urgent" (lowest % funded), "Most momentum" (highest donation count), "Closest to goal" (highest % under 100%)
- **Members:** Avatar grid (first 8) linked to `/u/[username]`, "+X more" overflow
- **FAQ accordion:** Expandable questions from `community.faq` in seed data

### Data Changes
- Added `FAQItem` type and optional `faq` field to Community interface
- Added FAQ data for both seed communities (Watch Duty + Medical Relief Network)

---

## Key Files

| File | Role |
|------|------|
| `app/communities/[slug]/page.tsx` | Server component with metadata + AI cause summary |
| `components/CommunityPageContent.tsx` | Full client-side community detail view |
| `lib/data/types.ts` | FAQItem type, Community.faq field |
| `lib/data/seed.ts` | FAQ data for both communities |
| `lib/ai/cause-intelligence.ts` | AI cause summary generation (FR-023) |

---

## Definition of Done (all met)

- [x] Page at /communities/[slug] with data from store
- [x] Header: banner, H1, cause badge, aggregate stats (from store)
- [x] Fundraiser directory: grid, cards with image/title/progress/organizer, sorted by activity
- [x] Guided discovery (urgency, momentum, closest to goal)
- [x] Direct-answer content (cause, how to help)
- [x] Members: 8 avatars linked to /u/[username], "+X more"
- [x] FAQ accordion 3–5 questions
- [x] Stats computed from store; SEO title/description
