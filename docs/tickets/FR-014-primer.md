# FR-014 Primer: JSON-LD Schema Generators

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 14, 2026
**Status:** COMPLETE
**Previous work:** FR-001 through FR-012 complete. FR-013 (Responsive) pending. FR-018 (Tests) and FR-020 (AI Foundation) also complete.

---

## What Is This Ticket?

FR-014 is the **JSON-LD structured data layer** — schema generators for every page type that output valid `<script type="application/ld+json">` tags. This is the SEO competitive advantage: DonateAction on fundraisers, FAQPage on communities, Person on profiles — none of which GoFundMe implements.

### Why Does This Exist?

GoFundMe ranks for 838K keywords but has zero structured data on Community pages, no DonateAction schema on fundraisers, and noindexed profiles. FundRight attacks every one of these gaps with valid JSON-LD that targets rich results: Donation Rich Cards, FAQ Rich Results, Person Knowledge Cards.

---

## What Was Built

### Schema Builders (`lib/schema/index.ts`)

| Builder | Schema Types | Used On |
|---------|-------------|---------|
| `buildFundraiserSchema(fundraiser, organizer, community?)` | `DonateAction`, `MonetaryAmount` | `/f/[slug]` |
| `buildCommunitySchema(community, faqItems?)` | `Organization` + optional `FAQPage` | `/communities/[slug]` |
| `buildProfileSchema(user)` | `ProfilePage` + nested `Person` | `/u/[username]` |
| `buildHomepageSchema()` | `WebSite` + `SearchAction` | `/` |
| `buildBreadcrumbSchema(items)` | `BreadcrumbList` | All detail pages |

### JsonLd Component (`components/JsonLd.tsx`)
- Accepts single schema or array of schemas
- Renders as `<script type="application/ld+json">` tags
- Used server-side in page `generateMetadata()` and directly in page components

### URL Resolution
- `BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fundright.vercel.app"`
- All schema URLs are absolute

### Integration
- Each page's server component calls the appropriate builder and injects JSON-LD
- Profile pages set `robots: { index: true, follow: true }`
- Open Graph tags set per page type via `generateMetadata()`

---

## Key Files

| File | Role |
|------|------|
| `lib/schema/index.ts` | All JSON-LD builder functions |
| `components/JsonLd.tsx` | `<script>` tag renderer component |
| `app/f/[slug]/page.tsx` | DonateAction + Breadcrumb injection |
| `app/communities/[slug]/page.tsx` | Organization + FAQPage + Breadcrumb injection |
| `app/u/[username]/page.tsx` | ProfilePage/Person + Breadcrumb injection |
| `app/page.tsx` | WebSite + SearchAction injection |

---

## Definition of Done (all met)

- [x] SchemaInjector renders page-specific JSON-LD in `<script type="application/ld+json">`
- [x] Fundraiser pages: DonateAction + MonetaryAmount + BreadcrumbList
- [x] Community pages: Organization + FAQPage + BreadcrumbList
- [x] Profile pages: Person + ProfilePage + BreadcrumbList
- [x] Homepage: WebSite + SearchAction schema
- [x] All schemas validate against Google's Rich Results Test
- [x] Profile pages have `robots: index, follow`
- [x] Open Graph tags correctly set per page type
