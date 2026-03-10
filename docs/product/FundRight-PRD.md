# FundRight — Product Requirements Document

**Barebones GoFundMe Clone — End-to-End Donor Experience**

| | |
|---|---|
| **Author** | Alex |
| **Role** | Senior Product Manager |
| **Status** | v2.0 — Revised for full-clone approach |
| **Version** | 2.0 |
| **Date** | March 9, 2026 |
| **Sprint Duration** | 2 Weeks (64 hours) |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [What Changed (v1 → v2)](#2-what-changed-v1--v2)
3. [Product Vision](#3-product-vision)
4. [Tech Stack Alignment](#4-tech-stack-alignment)
5. [Success Metrics](#5-success-metrics)
6. [Phase Breakdown](#6-phase-breakdown)
7. [Phase 1: MVP — Core Platform (COMPLETE)](#7-phase-1-mvp--core-platform)
8. [Phase 2: Full Clone — End-to-End Flows](#8-phase-2-full-clone--end-to-end-flows)
9. [Phase 3: Polish & Ship](#9-phase-3-polish--ship)
10. [Ticket Summary](#10-ticket-summary)
11. [Risks & Mitigations](#11-risks--mitigations)
12. [Appendix: Dependency Map](#12-appendix-dependency-map)

---

## 1. Executive Summary

FundRight is a barebones end-to-end clone of GoFundMe that demonstrates how a modern fundraising platform should work when trust, discovery, and belonging are treated as first-class product concerns — not afterthoughts bolted onto isolated pages.

### Why the approach changed

The v1 PRD defined three polished pages (Profile, Fundraiser, Community) plus an AI/analytics layer. That approach produced high-quality individual surfaces, but **required the evaluator to imagine how they fit into a complete product**. A working end-to-end flow — browse → discover → donate → create → manage — tells a far more compelling story because:

- **Demo impact:** "Click through a real flow" beats "here are some styled pages"
- **Architecture proof:** The Zustand store, normalized data model, and cross-page state are validated by actual user journeys, not just static renders
- **Surfaces real problems early:** Auth simulation, form validation, routing, and state sync are exercised through real flows
- **Easier to extend:** A working skeleton with all routes is simpler to flesh out than stitching isolated pages together later

### What this means concretely

Instead of 3 deep pages + AI + analytics dashboard, FundRight now ships as a **complete (barebones) fundraising platform** with:

- **Homepage** with discovery, search, and category browsing
- **Fundraiser creation flow** (form → publishes to store → immediately browsable)
- **Donation flow** with real-time cross-page state updates *(already built)*
- **Three detail pages** — Fundraiser, Community, Profile *(already built)*
- **Global navigation shell** tying everything together
- **Responsive layout** across all pages
- **JSON-LD schema** on every page type
- **Edge case handling** for production-ready feel

The AI features (Cause Intelligence, Impact Projections, Story Generator) and the analytics dashboard are **descoped** to stretch goals. They can be layered on after the core clone is complete, but they are no longer blocking.

---

## 2. What Changed (v1 → v2)

| Dimension | v1 PRD | v2 PRD |
|-----------|--------|--------|
| **Strategy** | 3 deep pages + AI + analytics | End-to-end barebones clone |
| **Demo story** | "Look at these polished pages" | "Click through the entire donor journey" |
| **Homepage** | Not defined | Full discover/browse/search surface |
| **Fundraiser creation** | Not defined | Simple form → publishes to store |
| **Category browsing** | Not defined | Browse by cause category |
| **Navigation** | Cross-page links only (FR-008) | Global nav shell + header/footer on every page |
| **AI features** | Phase 2 (P1) | Stretch goals (P2) — build if time permits |
| **Analytics dashboard** | Phase 2 (P1) | Descoped — not needed for clone demo |
| **Event tracking** | Phase 2 (P0) | Descoped — focus on product flows |
| **Schema/SEO** | Phase 2 | Moved into Phase 3 polish |
| **What's preserved** | FR-001 through FR-007 (done) | All completed work carries forward unchanged |

### Tickets removed or descoped

| Original ID | Title | Disposition |
|---|---|---|
| FR-011 | Cause Intelligence | → Stretch goal (P2) |
| FR-012 | Impact Projections | → Stretch goal (P2) |
| FR-013 | Story Generator | → Stretch goal (P2) |
| FR-015 | Event Tracking System | → Removed (not needed for clone) |
| FR-016 | Core Web Vitals Monitoring | → Removed (Lighthouse manual check suffices) |
| FR-017 | Analytics Dashboard | → Removed (not needed for clone) |
| FR-018 | Session Attribution Tracking | → Removed (not needed for clone) |

### Tickets added

| New ID | Title | Why |
|---|---|---|
| FR-008 | Homepage & Discovery | The entry point — browse, search, category filter |
| FR-009 | Global Navigation Shell | Header, footer, mobile menu on every page |
| FR-010 | Fundraiser Creation Flow | Create → publish → appears in store immediately |
| FR-011 | Category Browse Page | Browse fundraisers filtered by cause category |
| FR-012 | Search | Client-side fuzzy search across fundraisers and communities |

> **Note:** Ticket IDs FR-008+ have been renumbered. The original FR-008 (Cross-Page Navigation) is folded into the new FR-009 (Global Navigation Shell). The original FR-009 (Responsive Layout) is now FR-013. See the full ticket summary in Section 10.

---

## 3. Product Vision

### 3.1 Problem Statement

GoFundMe's donor journey is fragmented. A donor can view a fundraiser, a community, or a profile, but the system does not clearly answer four core questions across those pages:

- Who is this organizer?
- Why does this cause matter right now?
- Which fundraiser is the best next action for me?
- How does this donation fit into a larger community effort?

This fragmentation limits engagement, discoverability, and donor trust. Profile pages are invisible to search engines (noindexed). Community pages are semantically empty. Fundraiser pages miss rich snippet opportunities. Discovery flows terminate exclusively at fundraiser pages — there is no path from the homepage to a community or profile.

**The v1 PRD addressed this with 3 deep pages. The v2 PRD addresses it with a complete platform that lets users experience the full loop.**

### 3.2 Solution

FundRight builds a complete (barebones) fundraising platform where every flow reinforces the others:

- **Homepage** acts as the entry point — trending fundraisers, active communities, category browse, and search
- **Category browse** lets donors discover fundraisers by cause
- **Fundraiser creation** lets organizers publish campaigns that immediately appear across the platform
- **Fundraiser pages** act as the conversion layer — urgency, social proof, progress, contextual trust
- **Community pages** act as the discovery and belonging layer — guided discovery, cause context, member identity
- **Profile pages** act as the trust layer — organizer credibility, history, verification, cause affinity
- **Donation flow** is the single action that touches every page type, with real-time state updates across the entire platform
- **Global navigation** ties everything together so users never hit a dead end

### 3.3 Target Users

| Persona | Role | Primary Need | Key Flow |
|---|---|---|---|
| Donor (Dana) | Gives money to causes | Trust, discovery, and a smooth giving experience | Homepage → Browse → Fundraiser → Donate |
| Organizer (Omar) | Creates and manages fundraisers | Easy campaign creation, visible impact | Create → Manage → Profile |
| Community Lead (Carla) | Manages a cause community | Aggregate impact visibility, guided discovery | Community → Fundraisers → Members |
| Evaluator (Eva) | Reviews the submission | Seamless end-to-end flow, production feel | All flows, start to finish |

---

## 4. Tech Stack Alignment

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR/SSG + client navigation. Matches GoFundMe's stack without their legacy debt. |
| UI Library | React 18 | Standard. No legacy jQuery/Vue/Foundation. |
| Styling | Tailwind CSS | Utility-first with responsive design. Zero custom CSS files. |
| State Management | Zustand + persist middleware | Normalized entity store with atomic cross-page mutations. Replaces need for a real backend. |
| Data Layer | In-memory seed data (typed) | Demo-complete schema with 2 communities, 5 fundraisers, 8 users, 30 donations. Persists to localStorage. |
| Schema/SEO | Custom JSON-LD generators | DonateAction, Person, Organization, FAQPage, BreadcrumbList. |
| Images | next/image + curated WebP assets | Blur-up placeholders, responsive srcset, lazy loading. |
| Testing | Vitest (unit) + Lighthouse (perf) | Targeted tests on Zustand mutations. Lighthouse for performance gates. |
| Deployment | Vercel (primary) + Local setup | Live URL for instant demo. Local fallback with zero-config setup. |

**Removed from v1 stack:** OpenAI API, Recharts, custom analytics layer, Beacon API dispatch. These can be added later as stretch goals but are not part of the core clone.

---

## 5. Success Metrics

Metrics are simplified to focus on what matters for a barebones clone demo.

### 5.1 Core Experience

| Metric | Target | Why |
|---|---|---|
| End-to-end flow completable | Yes | Evaluator can go from homepage → discover → fundraiser → donate → see updates everywhere |
| Create flow completable | Yes | Evaluator can create a fundraiser that appears on homepage, category page, and community |
| Cross-page state sync | Real-time | Donation on fundraiser page instantly reflects on profile, community, homepage stats |
| Zero dead ends | Yes | Every page has clear navigation paths forward. No page requires browser back button. |

### 5.2 Performance

| Metric | Target | GoFundMe Baseline |
|---|---|---|
| LCP | ≤ 1.8s | 5.0s |
| CLS | ≤ 0.1 | Unknown |
| INP | ≤ 200ms | Unknown |
| Lighthouse Score | ≥ 90 (all categories) | 45 Performance |

### 5.3 SEO Health

| Metric | Target |
|---|---|
| Schema validation pass rate | 100% across all page types |
| Profile index readiness | 100% of profiles have index + follow |
| Heading hierarchy compliance | Zero skipped heading levels |

### 5.4 Polish

| Metric | Target |
|---|---|
| Responsive | No horizontal scroll 375px–1440px |
| Accessibility | Lighthouse accessibility ≥ 95 |
| Edge cases | Every state has a designed UI (0%, 100%, overfunded, empty) |
| Console errors | Zero |

---

## 6. Phase Breakdown

| Phase | Name | Duration | Hours | Goal |
|---|---|---|---|---|
| Phase 1 | MVP — Core Platform | Days 1–7 | ~30h | Three detail pages + donation flow + store *(COMPLETE)* |
| Phase 2 | Full Clone — End-to-End Flows | Days 8–11 | ~22h | Homepage, creation, browse, search, nav shell, responsive |
| Phase 3 | Polish & Ship | Days 12–14 | ~12h | Schema, accessibility, edge cases, tests, deployment |

---

## 7. Phase 1: MVP — Core Platform

**Status: COMPLETE (7/7 tickets done)**

**Goal:** Three fully interactive detail pages with cross-page state management, seed data, and a working donation flow.

### Completed Tickets

| ID | Title | Status |
|---|---|---|
| FR-001 | Project Scaffold & Next.js Configuration | ✅ DONE |
| FR-002 | Data Model & Seed Data | ✅ DONE |
| FR-003 | Zustand Store with Normalized Slices | ✅ DONE |
| FR-004 | Fundraiser Page (/f/[slug]) | ✅ DONE |
| FR-005 | Community Page (/communities/[slug]) | ✅ DONE |
| FR-006 | Profile Page (/u/[username]) | ✅ DONE |
| FR-007 | Donation Flow & Modal | ✅ DONE |

### What Phase 1 Delivered

- **Data model:** TypeScript interfaces for User, Fundraiser, Community, Donation with 2 communities, 5 fundraisers, 8 users, 30 donations
- **Zustand store:** Normalized slices with `addDonation()` atomically updating all 4 entity types, persisted to localStorage
- **Fundraiser page** (`/f/[slug]`): Hero, progress bar, story, donor wall, updates, related fundraisers, community badge
- **Community page** (`/communities/[slug]`): Banner, stats, fundraiser directory, guided discovery, FAQ, members grid
- **Profile page** (`/u/[username]`): Identity, trust summary, impact stats, active fundraisers, community memberships, giving history
- **Donation modal:** Preset amounts, custom input, donor selection, real-time state updates, toast notification, focus trap

---

## 8. Phase 2: Full Clone — End-to-End Flows

**Goal:** Transform the three detail pages into a complete platform by adding the homepage, creation flow, discovery, search, and navigation shell. After this phase, an evaluator can experience the entire donor and organizer journey without hitting a dead end.

**Timeline:** Days 8–11 | **Budget:** ~22 hours | **Tickets:** 6

---

### FR-008: Homepage & Discovery

| | |
|---|---|
| **User Story** | *As a donor landing on the platform, I want to browse trending fundraisers, see active communities, and understand what the platform offers so that I can find a cause to support.* |
| **Priority** | **P0** · Est: 4h |

**Acceptance Criteria:**

- ✅ Page renders at `/` (root route, replacing the current placeholder)
- ✅ Hero section: headline, subtitle, and primary CTA ("Start a FundRight" → links to create flow)
- ✅ Platform stats banner: total raised, total donations, active fundraisers, active communities (computed from store)
- ✅ "Trending Fundraisers" section: top 4 fundraisers sorted by donation count, displayed as cards with image, title, progress bar, organizer name. Each links to `/f/[slug]`
- ✅ "Active Communities" section: community cards showing name, banner, cause badge, aggregate stats. Each links to `/communities/[slug]`
- ✅ "Browse by Category" section: grid of cause categories (from seed data), each linking to `/browse/[category]`
- ✅ Search bar in hero section: text input that navigates to `/search?q=` on submit
- ✅ All stats are live — if a donation is made, stats update on return to homepage

---

### FR-009: Global Navigation Shell

| | |
|---|---|
| **User Story** | *As a user on any page, I want consistent navigation so that I can always get to the homepage, browse communities, start a fundraiser, or access my profile without hitting a dead end.* |
| **Priority** | **P0** · Est: 3h |

**Acceptance Criteria:**

- ✅ Persistent header on every page: FundRight logo (links to `/`), nav links (Discover, Communities, Start a FundRight), profile avatar dropdown
- ✅ Profile dropdown: links to a default user profile (`/u/[username]`), "My Fundraisers" (links to profile), "Sign Out" (cosmetic — no real auth)
- ✅ Footer on every page: platform description, quick links (About, How It Works, Browse, Communities), copyright
- ✅ Mobile: hamburger menu on `md:` breakpoint, slide-out nav drawer with same links
- ✅ Active page indicator: current nav item is visually highlighted
- ✅ All entity names and avatars across the platform are clickable links to their respective pages (absorbs the original FR-008 cross-page navigation requirement)
- ✅ No dead links: every entity ID in the store has a corresponding rendered page
- ✅ Breadcrumb trail on detail pages (Fundraiser, Community, Profile) for orientation

**Subsumes:** Original FR-008 (Cross-Page Navigation & Link Graph) is fully covered by this ticket.

---

### FR-010: Fundraiser Creation Flow

| | |
|---|---|
| **User Story** | *As an organizer, I want to create a fundraiser through a simple form so that my campaign immediately appears across the platform and can receive donations.* |
| **Priority** | **P0** · Est: 4h |

**Acceptance Criteria:**

- ✅ "Start a FundRight" button in nav and homepage links to `/create`
- ✅ Creation form (single page, no multi-step wizard): title, goal amount, story (textarea, 300+ word recommendation shown), cause category (dropdown from seed categories), community (optional dropdown from existing communities), cover image (select from curated preset images — no upload needed for MVP)
- ✅ "Donating as" field: dropdown of existing users (simulates auth — the selected user becomes the organizer)
- ✅ On submit: new fundraiser added to Zustand store with generated slug and ID, organizer's profile updated, community's fundraiserIds updated (if community selected)
- ✅ Redirect to the new fundraiser page (`/f/[generated-slug]`) on success
- ✅ New fundraiser immediately appears on: homepage trending (if it qualifies), category browse page, community page (if linked), organizer's profile
- ✅ Form validation: title required (max 80 chars), goal required (min $100), story required (min 50 words), category required
- ✅ Store mutation: `addFundraiser()` action added to Zustand store, atomically creating the fundraiser and updating all related entities

---

### FR-011: Category Browse Page

| | |
|---|---|
| **User Story** | *As a donor interested in a specific cause, I want to browse fundraisers filtered by category so that I can find campaigns aligned with my interests.* |
| **Priority** | **P0** · Est: 3h |

**Acceptance Criteria:**

- ✅ Page renders at `/browse/[category]` with fundraisers filtered by cause category
- ✅ Also renders at `/browse` (no category) showing all fundraisers with category filter chips
- ✅ Category filter: horizontal scrollable chip bar showing all available categories, with active category highlighted
- ✅ Fundraiser grid: cards with image, title, progress bar, organizer name, community badge. Sorted by most recent activity
- ✅ Sort options: "Most Recent", "Most Funded", "Closest to Goal", "Just Launched"
- ✅ Empty state: "No fundraisers in this category yet. Be the first!" with link to create flow
- ✅ Results count: "X fundraisers in [Category]" header
- ✅ Each card links to `/f/[slug]`

---

### FR-012: Search

| | |
|---|---|
| **User Story** | *As a user looking for a specific fundraiser, organizer, or community, I want to search by keyword so that I can quickly find what I'm looking for.* |
| **Priority** | **P1** · Est: 3h |

**Acceptance Criteria:**

- ✅ Search page renders at `/search?q=[query]`
- ✅ Search bar in header (all pages) and hero (homepage) submits to `/search?q=`
- ✅ Client-side fuzzy search across: fundraiser titles and stories, community names and descriptions, user display names
- ✅ Results grouped by type: "Fundraisers", "Communities", "People" — each with up to 5 results and "View all" if more
- ✅ Each result links to its respective page (`/f/`, `/communities/`, `/u/`)
- ✅ Empty state: "No results for '[query]'. Try a different search or browse by category." with link to `/browse`
- ✅ Search is instant (filters store data client-side, no API calls)

---

### FR-013: Responsive Layout

| | |
|---|---|
| **User Story** | *As a user on any device, I want the platform to look intentional and polished at every viewport width so that I trust the product regardless of how I access it.* |
| **Priority** | **P0** · Est: 4h |

**Acceptance Criteria:**

- ✅ Homepage: single-column stack on mobile → multi-column grid on `lg:`
- ✅ Fundraiser page: single-column on mobile → two-column (story left, donation widget right) on `lg:` with sticky donation widget
- ✅ Community page: full-width cards on mobile → 2-column grid on `md:`, 3-column on `lg:`
- ✅ Profile page: stacked sections on mobile → sidebar (badges + stats) + main content on `lg:`
- ✅ Browse page: full-width cards on mobile → responsive grid on `md:`+
- ✅ Create page: centered single-column form, max-width 640px
- ✅ Navigation: hamburger menu on mobile → horizontal nav on `md:`
- ✅ Donation widget is sticky on desktop (`position: sticky, top: 1rem`)
- ✅ No horizontal scroll at any viewport width from 375px to 1440px
- ✅ All tap targets are at least 44x44px on mobile

**Note:** This is the original FR-009, renumbered.

---

## 9. Phase 3: Polish & Ship

**Goal:** Schema markup, accessibility, edge cases, tests, and deployment. After this phase, the product is submission-ready with a live URL, valid structured data, and zero known defects.

**Timeline:** Days 12–14 | **Budget:** ~12 hours | **Tickets:** 6

---

### FR-014: JSON-LD Schema Generators

| | |
|---|---|
| **User Story** | *As a search engine, I want valid structured data on every page so that I can display rich results in search results.* |
| **Priority** | **P1** · Est: 3h |

**Acceptance Criteria:**

- ✅ SchemaInjector component renders page-specific JSON-LD in `<script type="application/ld+json">`
- ✅ Fundraiser pages: DonateAction + MonetaryAmount + BreadcrumbList
- ✅ Community pages: Organization (or NGO) + FAQPage + BreadcrumbList
- ✅ Profile pages: Person + ProfilePage + BreadcrumbList
- ✅ Homepage: WebSite + SearchAction schema
- ✅ All schemas validate against Google's Rich Results Test
- ✅ Profile pages have `<meta name="robots" content="index, follow">`
- ✅ Open Graph tags correctly set per page type

---

### FR-015: Accessibility Foundation & ARIA

| | |
|---|---|
| **User Story** | *As a user with a disability, I want to navigate and use the entire platform with a keyboard and screen reader.* |
| **Priority** | **P1** · Est: 3h |

**Acceptance Criteria:**

- ✅ Skip navigation link visible on focus, jumps to `#main-content`
- ✅ All pages use semantic HTML: `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`
- ✅ Heading hierarchy is H1 → H2 → H3 with zero skipped levels on every page
- ✅ Donation modal focus trap: Tab cycles within modal, Shift+Tab reverses, Escape closes
- ✅ Progress bars have `role="progressbar"` with proper ARIA attributes
- ✅ Toast notifications use `aria-live="polite"`
- ✅ All interactive elements have visible focus indicators
- ✅ Color contrast meets WCAG AA
- ✅ `prefers-reduced-motion` disables animations
- ✅ Lighthouse accessibility ≥ 95

---

### FR-016: Edge Case Handling & Designed States

| | |
|---|---|
| **User Story** | *As an evaluator testing boundary conditions, I want every edge case to display a designed state so that the platform feels production-ready.* |
| **Priority** | **P1** · Est: 3h |

**Acceptance Criteria:**

- ✅ Fundraiser at 0%: "Just launched — be the first donor" + prominent CTA
- ✅ Fundraiser at 76–99%: urgency messaging ("Almost there! $500 to go")
- ✅ Fundraiser at 100%: "Goal reached!" celebration state
- ✅ Fundraiser > 100%: overfunded state with "150% — Goal exceeded!"
- ✅ Empty search results: designed empty state with suggestions
- ✅ Category with no fundraisers: "Be the first!" with link to create flow
- ✅ New fundraiser (just created, 0 donations): welcoming state with share prompt
- ✅ No console errors in any state

---

### FR-017: Skeleton Loaders & Page Transitions

| | |
|---|---|
| **User Story** | *As a user, I want the platform to feel fast and seamless with no loading spinners or layout jumps.* |
| **Priority** | **P1** · Est: 2h |

**Acceptance Criteria:**

- ✅ Skeleton loader component renders pulsing gray rectangles at specified dimensions
- ✅ Skeletons used for: fundraiser cards, donor wall entries, profile stats, browse grid
- ✅ Page mount animation: 150ms opacity fade-in
- ✅ Scroll restoration on back navigation
- ✅ No visible loading spinners
- ✅ CLS ≤ 0.1

---

### FR-018: Unit Tests for Store Mutations

| | |
|---|---|
| **User Story** | *As a developer, I want automated tests covering critical state mutation logic so that cross-page integration cannot silently break.* |
| **Priority** | **P1** · Est: 2h |

**Acceptance Criteria:**

- ✅ Vitest configured and running via `npm test`
- ✅ Tests for `addDonation`: increments raisedAmount, donationCount, updates donationIds on fundraiser and donor, updates community aggregates
- ✅ Tests for `addFundraiser`: creates fundraiser, updates organizer's fundraiser list, updates community's fundraiserIds
- ✅ Test: handles overfunding correctly
- ✅ Test: handles missing/invalid entity references gracefully
- ✅ All tests pass with zero failures

---

### FR-019: Deployment & QA

| | |
|---|---|
| **User Story** | *As an evaluator, I want to click a URL and see the product running immediately.* |
| **Priority** | **P0** · Est: 2h |

**Acceptance Criteria:**

- ✅ `vercel --prod` confirms clean production build with zero errors
- ✅ README updated with final live URL
- ✅ Local setup verified: `git clone → npm install → npm run dev` works with zero configuration
- ✅ Production bundle size ≤ 800 KiB
- ✅ **Full QA walkthrough:**
  - All pages load without console errors
  - Full navigation loop: Homepage → Browse → Fundraiser → Donate → Profile → Community → Homepage
  - Donation flow: donate → progress bar updates → profile shows donation → community aggregate updates
  - Creation flow: create fundraiser → appears on homepage, browse, community, profile
  - Search: returns relevant results for fundraiser titles, community names, user names
  - Schema JSON-LD validates for all page types
  - Lighthouse ≥ 90 performance, ≥ 95 accessibility, ≥ 90 SEO on all pages
  - Mobile responsive: all pages render correctly at 375px
  - No horizontal scroll 375px–1440px
  - Edge cases all display designed states

---

## Stretch Goals (If Time Permits)

These features from the v1 PRD are valuable but not required for the core clone demo. Build them only after all Phase 2 and Phase 3 tickets are complete.

### SG-001: Impact Projections (from v1 FR-012)

Real-time impact statements in the donation modal: "Your $50 means 200 families receive real-time wildfire alerts for one month." Client-side math from a `causeImpactMap`, zero API calls. **Est: 2h**

### SG-002: Cause Intelligence (from v1 FR-011)

AI-generated "About This Cause" section on community pages. Pre-generated at build time, stored in seed data. **Est: 3h**

### SG-003: Story Generator (from v1 FR-013)

AI-assisted fundraiser story writing from bullet points. Streaming token-by-token generation with edit capability. **Est: 3h**

### SG-004: Analytics Dashboard (from v1 FR-017)

Dedicated `/analytics` page with performance gauges, conversion funnel, schema validation status, and attribution flow. Requires event tracking (v1 FR-015) and web vitals (v1 FR-016) as prerequisites. **Est: 8h total**

---

## 10. Ticket Summary

| ID | Title | Phase | Priority | Est. | Status |
|---|---|---|---|---|---|
| FR-001 | Project Scaffold & Next.js Configuration | Phase 1 | P0 | 2h | ✅ DONE |
| FR-002 | Data Model & Seed Data | Phase 1 | P0 | 2h | ✅ DONE |
| FR-003 | Zustand Store with Normalized Slices | Phase 1 | P0 | 3h | ✅ DONE |
| FR-004 | Fundraiser Page (/f/[slug]) | Phase 1 | P0 | 4h | ✅ DONE |
| FR-005 | Community Page (/communities/[slug]) | Phase 1 | P0 | 4h | ✅ DONE |
| FR-006 | Profile Page (/u/[username]) | Phase 1 | P0 | 4h | ✅ DONE |
| FR-007 | Donation Flow & Modal | Phase 1 | P0 | 3h | ✅ DONE |
| **FR-008** | **Homepage & Discovery** | **Phase 2** | **P0** | **4h** | TODO |
| **FR-009** | **Global Navigation Shell** | **Phase 2** | **P0** | **3h** | TODO |
| **FR-010** | **Fundraiser Creation Flow** | **Phase 2** | **P0** | **4h** | TODO |
| **FR-011** | **Category Browse Page** | **Phase 2** | **P0** | **3h** | TODO |
| **FR-012** | **Search** | **Phase 2** | **P1** | **3h** | TODO |
| **FR-013** | **Responsive Layout** | **Phase 2** | **P0** | **4h** | TODO |
| FR-014 | JSON-LD Schema Generators | Phase 3 | P1 | 3h | TODO |
| FR-015 | Accessibility Foundation & ARIA | Phase 3 | P1 | 3h | TODO |
| FR-016 | Edge Case Handling & Designed States | Phase 3 | P1 | 3h | TODO |
| FR-017 | Skeleton Loaders & Page Transitions | Phase 3 | P1 | 2h | TODO |
| FR-018 | Unit Tests for Store Mutations | Phase 3 | P1 | 2h | TODO |
| FR-019 | Deployment & QA | Phase 3 | P0 | 2h | TODO |

**Total: 19 tickets · ~55 hours · 14 days**

*Plus 4 stretch goals (~16h) if time permits.*

---

## 11. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Scope creep on "barebones" | High | High | Each page/flow has a strict MVP definition. No auth, no real payments, no image upload. Preset images for creation flow. |
| Store complexity grows with addFundraiser | Medium | Medium | Follow the same atomic-update pattern as addDonation. Unit tests cover both mutations. |
| Homepage feels empty with only seed data | Medium | Low | Seed data has 5 fundraisers and 2 communities — enough to feel alive. Creation flow lets evaluator add more. |
| Search quality with small dataset | Low | Low | Fuzzy matching on client-side store data. Works well for small datasets. Not competing with Algolia. |
| Responsive retrofit on existing pages | Medium | Medium | Existing pages use Tailwind utility classes. Responsive breakpoints are additive, not destructive. |
| Vercel deployment fails | Low | High | Continuous deployment from Day 1. Local setup documented as fallback. |
| Time pressure from broader scope | Medium | High | Phase 3 tickets are ordered by impact. Schema (FR-014) and accessibility (FR-015) can be reduced in scope. Stretch goals are explicitly optional. |

---

## 12. Appendix: Dependency Map

### 12.1 Phase 1 Dependencies (COMPLETE)

All Phase 1 tickets are done. No remaining dependencies.

### 12.2 Phase 2 Dependencies

- FR-008 (Homepage) → can start immediately (reads from existing store)
- FR-009 (Nav Shell) → can start immediately (wraps existing layout)
- FR-010 (Create Flow) → depends on FR-009 (nav has "Start a FundRight" link) + requires new `addFundraiser` store action
- FR-011 (Category Browse) → depends on FR-008 (homepage links to categories)
- FR-012 (Search) → depends on FR-009 (search bar in header)
- FR-013 (Responsive) → can start in parallel with FR-008/FR-009, but should run after all pages exist

**Recommended execution order:**
1. FR-009 (Nav Shell) — unblocks all pages
2. FR-008 (Homepage) — the new entry point
3. FR-010 (Create Flow) — the new organizer journey
4. FR-011 (Category Browse) + FR-012 (Search) — in parallel
5. FR-013 (Responsive) — final pass across all pages

### 12.3 Phase 3 Dependencies

- FR-014 (Schema) → can start immediately
- FR-015 (Accessibility) → can start immediately
- FR-016 (Edge Cases) → depends on FR-010 (creation flow edge cases)
- FR-017 (Skeletons) → depends on all pages existing
- FR-018 (Unit Tests) → depends on FR-010 (tests for addFundraiser)
- FR-019 (Deployment & QA) → final ticket, depends on everything
