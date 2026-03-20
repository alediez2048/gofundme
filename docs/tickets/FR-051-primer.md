# FR-051 Primer: Open Graph Tags + Canonical URLs

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete. All detail pages have `generateMetadata()` returning `title` and `description`, but no explicit `openGraph`, `twitter`, or `alternates.canonical` fields. JSON-LD structured data is in place via `lib/schema/index.ts`.

---

## What Is This Ticket?

FR-051 adds explicit Open Graph and Twitter Card meta tags to every `generateMetadata()` function across the app, plus canonical URLs on all detail pages. Currently the metadata only includes `title` and `description` — Next.js does not auto-generate OG tags from those fields.

### Why Does This Exist?

Open Graph tags control how links appear when shared on social media (Facebook, LinkedIn, Slack, iMessage). Twitter Cards control Twitter/X previews. Without explicit `og:image`, `og:type`, and `twitter:card` fields, shared links show generic text-only previews — a massive missed opportunity for fundraiser virality. Canonical URLs prevent duplicate content penalties when pages are accessible via multiple URL patterns. This is the highest-impact SEO ticket with zero dependencies.

### Dependencies

- None — can start immediately. All `generateMetadata()` functions already exist.

### Current State

- `app/f/[slug]/page.tsx`: `generateMetadata()` returns `{ title, description }` only
- `app/u/[username]/page.tsx`: `generateMetadata()` returns `{ title, description, robots }`
- `app/communities/[slug]/page.tsx`: `generateMetadata()` returns `{ title, description }` only
- No `openGraph`, `twitter`, or `alternates` fields anywhere

---

## FR-051 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Fundraiser OG | `og:image` = first fundraiser image, `og:type` = "article", `twitter:card` = "summary_large_image" |
| Community OG | `og:image` = community banner, `og:type` = "website", `twitter:card` = "summary_large_image" |
| Profile OG | `og:image` = user avatar, `og:type` = "profile", `twitter:card` = "summary" |
| Canonical URLs | `alternates.canonical` set on all detail pages (`/f/[slug]`, `/u/[username]`, `/communities/[slug]`) |
| Homepage OG | `og:type` = "website", site-level OG image |
| Browse/Search | Reasonable defaults (og:type = "website") |

---

## Deliverables Checklist

### A. Fundraiser Page OG Tags

- [ ] Add `openGraph` to `generateMetadata()` in `app/f/[slug]/page.tsx`
  - `title`, `description` (reuse existing)
  - `type: "article"`
  - `url`: absolute fundraiser URL
  - `images`: array with first fundraiser image (use `fundraiser.images?.[0]` or hero image)
- [ ] Add `twitter: { card: "summary_large_image", title, description, images }`
- [ ] Add `alternates: { canonical: absoluteUrl(`/f/${slug}`) }`

### B. Community Page OG Tags

- [ ] Add `openGraph` to `generateMetadata()` in `app/communities/[slug]/page.tsx`
  - `type: "website"`
  - `url`: absolute community URL
  - `images`: community banner image
- [ ] Add `twitter: { card: "summary_large_image", title, description, images }`
- [ ] Add `alternates: { canonical: absoluteUrl(`/communities/${slug}`) }`

### C. Profile Page OG Tags

- [ ] Add `openGraph` to `generateMetadata()` in `app/u/[username]/page.tsx`
  - `type: "profile"`
  - `url`: absolute profile URL
  - `images`: user avatar
- [ ] Add `twitter: { card: "summary", title, description, images }`
- [ ] Add `alternates: { canonical: absoluteUrl(`/u/${username}`) }`

### D. Homepage + Other Pages

- [ ] Add `openGraph` to homepage metadata in `app/layout.tsx` or `app/page.tsx`
- [ ] Add reasonable defaults for browse/search pages

### E. Helper Utility

- [ ] Create or reuse `absoluteUrl()` helper (already exists in `lib/schema/index.ts` — consider exporting or duplicating for metadata use)

---

## Files to Create

| File | Role |
|------|------|
| None | All changes are modifications to existing files |

## Files to Modify

| File | Action |
|------|--------|
| `app/f/[slug]/page.tsx` | Add `openGraph`, `twitter`, `alternates.canonical` to `generateMetadata()` |
| `app/u/[username]/page.tsx` | Add `openGraph`, `twitter`, `alternates.canonical` to `generateMetadata()` |
| `app/communities/[slug]/page.tsx` | Add `openGraph`, `twitter`, `alternates.canonical` to `generateMetadata()` |
| `app/layout.tsx` | Add default OG tags to root metadata |
| `app/browse/[category]/page.tsx` | Add OG tags if `generateMetadata()` exists |

### Files to READ for Context

| File | Why |
|------|-----|
| `app/f/[slug]/page.tsx` | Current `generateMetadata()` pattern for fundraisers |
| `app/u/[username]/page.tsx` | Current `generateMetadata()` pattern for profiles |
| `app/communities/[slug]/page.tsx` | Current `generateMetadata()` pattern for communities |
| `lib/schema/index.ts` | `absoluteUrl()` helper and `BASE_URL` constant |
| `lib/data/index.ts` | Fundraiser, User, Community types — find image field names |

---

## Definition of Done for FR-051

- [ ] All detail pages have explicit `openGraph` fields in metadata
- [ ] All detail pages have explicit `twitter` card fields in metadata
- [ ] All detail pages have `alternates.canonical` set
- [ ] OG images point to actual entity images (fundraiser image, community banner, user avatar)
- [ ] Correct `og:type` per page type (article, website, profile)
- [ ] Verify with browser DevTools that `<meta property="og:*">` tags render in HTML head
