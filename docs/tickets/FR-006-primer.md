# FR-006 Primer: Profile Page (/u/[username])

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 9, 2026
**Status:** COMPLETE
**Previous work:** FR-001 through FR-003 complete (scaffold, data model, store).

---

## What Is This Ticket?

FR-006 is the **profile page** — the trust layer of the platform. It renders a user's profile at `/u/[username]` with identity, trust summary, impact stats, active fundraisers, community memberships, and giving history.

### Why Does This Exist?

GoFundMe's Profile pages are noindexed and treated as dead zones. FundRight indexes them as first-class trust surfaces. When a donor is about to give, they need fast answers to: who is this person, what have they organized before, and should I believe they can deliver impact?

---

## What Was Built

### Server Component (`app/u/[username]/page.tsx`)
- `generateMetadata()` reads seed data for title/description
- Sets `robots: { index: true, follow: true }` — profiles are indexable (attacking GoFundMe's noindex weakness)
- Uses `notFound()` for unknown usernames

### Client Component (`components/ProfilePageContent.tsx`)
- **Identity:** Avatar (`next/image`), display name (H1), verified badge, bio, join date
- **Trust summary:** "Why trust this organizer" — campaigns organized, total raised, communities, total donated
- **Impact summary:** 2–3 sentence data-derived narrative from organizer stats (no AI in base; Phase 4 can enhance)
- **Impact stats:** Total raised (as organizer), total donated, causes supported count (unique cause categories)
- **Active fundraisers:** Cards linked to `/f/[slug]`
- **Community memberships:** Badges linked to `/communities/[slug]`
- **Giving history:** Chronological list (amount, fundraiser name linked to `/f/[slug]`, date)

All data computed from Zustand store — live updates after donations.

---

## Key Files

| File | Role |
|------|------|
| `app/u/[username]/page.tsx` | Server component with metadata + indexing directives |
| `components/ProfilePageContent.tsx` | Full client-side profile view |
| `components/UserAvatar.tsx` | Avatar with initials fallback |

---

## Definition of Done (all met)

- [x] Page at /u/[username] with data from store
- [x] Identity: avatar, H1, verified badge, bio, join date
- [x] Trust summary: history, communities, recent impact
- [x] Impact summary: 2–3 sentences (derived from fundraising history)
- [x] Impact stats: total raised (organizer), total donated, causes supported
- [x] Active fundraisers linked to /f/[slug]; communities linked to /communities/[slug]
- [x] Giving history: amount, fundraiser link, date; all computed from store
