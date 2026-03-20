# FR-004 Primer: Fundraiser Page (/f/[slug])

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 9, 2026
**Status:** COMPLETE
**Previous work:** FR-001 through FR-003 complete (scaffold, data model, store).

---

## What Is This Ticket?

FR-004 is the **fundraiser detail page** — the conversion layer of the platform. It renders a single fundraiser at `/f/[slug]` with hero image, progress tracking, organizer trust cues, story, donor wall, updates, and related fundraisers.

### Why Does This Exist?

The fundraiser page is the primary conversion surface. A donor landing here needs to instantly see: what this campaign is about, how close it is to its goal, who organized it, and why they should trust it. This page must convert while making credibility and next-step exploration obvious.

---

## What Was Built

### Server Component (`app/f/[slug]/page.tsx`)
- `generateMetadata()` reads seed data for title/description per fundraiser
- Passes slug to client component `FundraiserPageContent`
- Originally used `notFound()` for unknown slugs; modified in FR-010 to allow store-only fundraisers (just-created ones)

### Client Component (`components/FundraiserPageContent.tsx`)
- **Above-the-fold:** Hero image (`next/image` with blur placeholder), H1 title, organizer name linked to `/u/[username]`, progress bar (raised/goal), Donate CTA button
- **Trust cues:** Verified badge, community count, community badge linked to `/communities/[slug]`
- **Below-the-fold:** Story (paragraphs + `**bold**` rendering), recent donors (top 5 with avatars linked to profiles), updates timeline, parent community badge, related fundraisers (3 from same community)
- **Donation modal:** Wired in FR-007 — opens on Donate click, triggers `addDonation()`, shows toast with profile link

---

## Key Files

| File | Role |
|------|------|
| `app/f/[slug]/page.tsx` | Server component with metadata generation |
| `components/FundraiserPageContent.tsx` | Full client-side fundraiser detail view |
| `components/DonationModal.tsx` | Donation modal overlay (FR-007) |
| `components/ProgressBar.tsx` | Visual progress bar component |

---

## Definition of Done (all met)

- [x] Page at /f/[slug] with data from store by slug
- [x] Hero (next/image blur), H1, organizer link, progress bar, Donate CTA
- [x] Trust cues: verification, community context before/near CTA
- [x] Story quality (seed has 300+ words); below-fold story, donor wall top 5, updates, community badge, related 3
- [x] Progress from raisedAmount/goalAmount; all names/avatars link; title and meta for SEO
