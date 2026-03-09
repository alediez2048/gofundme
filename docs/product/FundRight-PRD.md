# FundRight — Product Requirements Document

**AI-Powered Next-Generation Fundraising Platform**

| | |
|---|---|
| **Author** | Alex |
| **Role** | Senior Product Manager |
| **Status** | Draft for Review |
| **Version** | 1.0 |
| **Date** | March 8, 2026 |
| **Sprint Duration** | 2 Weeks (64 hours) |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [Tech Stack Alignment](#3-tech-stack-alignment)
4. [Success Metrics](#4-success-metrics)
5. [Phase Breakdown](#5-phase-breakdown)
6. [Phase 1: MVP — Core Platform](#6-phase-1-mvp--core-platform)
7. [Phase 2: V1.5 — Intelligence Layer](#7-phase-2-v15--intelligence-layer)
8. [Phase 3: Scale — Polish & Ship](#8-phase-3-scale--polish--ship)
9. [Ticket Summary](#9-ticket-summary)
10. [Risks & Mitigations](#10-risks--mitigations)
11. [Appendix: Dependency Map](#11-appendix-dependency-map)

---

## 1. Executive Summary

FundRight is a reimagined fundraising platform built around three interconnected page types — Profile, Fundraiser, and Community — designed to solve the actual donor-experience problem hidden inside GoFundMe's current architecture: trust, discovery, and belonging are fragmented across separate surfaces instead of reinforcing each other.

Competitive research (BuiltWith technology audit + Semrush SEO deep scan + Lighthouse audit) still matters, but it supports a broader product thesis rather than replacing one.

**The platform addresses three critical UX gaps:**

- Donors cannot quickly establish organizer credibility across pages; trust evidence is too page-local
- Community pages aggregate campaigns but do not strongly guide users toward the right fundraiser for them
- Profiles, fundraisers, and causes exist as separate entities, but the identity relationship between them is too weak to create momentum across the journey

**The platform also addresses three structural gaps that amplify those UX problems:**

- GoFundMe's Profile pages are fully deindexed (noindex, nofollow), leaving the "organizer credibility" search space completely unoccupied
- GoFundMe's Community pages have zero structured data — no JSON-LD schema, incorrect og:type, and no semantic content depth
- GoFundMe's Fundraiser pages lack DonateAction schema, missing rich snippet opportunities across 838K ranking keywords

**Two additional growth risks now inform scope:**

- GoFundMe's organic footprint is heavily branded, so non-branded and transactional discovery is underdeveloped
- Keyword erosion is likely tied in part to thin user-generated content, meaning content quality controls must be built into the product experience

This PRD defines three delivery phases: MVP (core platform with cross-page integration), V1.5 (AI features + analytics dashboard), and Scale (performance optimization + accessibility + deployment). Total estimated effort: 64 hours across a 2-week sprint.

---

## 2. Product Vision

### 2.1 Problem Statement

GoFundMe operates as an Authority Score 73 domain with 3.1M monthly organic visits, but its page architecture has a more important product weakness than any single SEO flaw: the donor journey is fragmented. A donor can view a fundraiser, a community, or a profile, but the system does not clearly answer four core questions across those pages:

- Who is this organizer?
- Why does this cause matter right now?
- Which fundraiser is the best next action for me?
- How does this donation fit into a larger community effort?

This fragmentation limits engagement, discoverability, and donor trust. The platform's Profile pages are invisible to search engines, its Community pages are semantically empty, and its Fundraiser pages miss rich snippet opportunities. The site also relies heavily on branded demand instead of systematically capturing non-branded fundraising intent, while thin UGC likely contributes to keyword erosion. Page load times are poor enough that they reinforce the trust problem rather than helping conversion.

### 2.2 Solution

FundRight builds a closed-loop architecture where every page type reinforces every other:

- Profile pages act as the trust layer, surfacing organizer credibility, history, verification, and cause affinity
- Community pages act as the discovery and belonging layer, helping donors understand the larger movement and choose the most relevant fundraiser
- Fundraiser pages act as the conversion layer, combining urgency, social proof, progress, and contextual trust signals
- Content quality controls ensure fundraiser and profile content is substantive enough to support both trust and discovery
- Profile pages are fully indexed with Person schema, creating search surface for organizer credibility queries
- Community pages serve as SEO powerhouses with Organization/NGO schema, FAQ sections, and AI-generated Cause Intelligence
- Fundraiser pages implement DonateAction schema with AI-powered impact projections
- A shared in-memory data layer (Zustand) ensures actions on one page produce visible results on every other

### 2.3 Target Users

| Persona | Role | Primary Need | Key Page |
|---|---|---|---|
| Donor (Dana) | Gives money to causes | Trust that the organizer is legitimate and funds will be used well | Fundraiser → Profile |
| Organizer (Omar) | Creates and manages fundraisers | Easy campaign creation with compelling storytelling tools | Profile → Fundraiser |
| Community Lead (Carla) | Manages a cause community | Aggregate impact visibility, guided discovery, and member growth | Community |
| Evaluator (Eva) | Reviews the submission | Fast load, seamless integration, visible instrumentation | All pages + Analytics |

---

## 3. Tech Stack Alignment

Every technology choice is informed by the BuiltWith audit of GoFundMe's 285 live technologies and the Semrush SEO deep scan. The stack is chosen to match GoFundMe's proven patterns where they work, and diverge where the audit revealed weaknesses.

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | GoFundMe uses Next.js. SSR/SSG + client navigation gives us fast initial rendering and SPA-smooth transitions without their heavy Pages Router script cost. |
| UI Library | React 18 | Matches GoFundMe's primary frontend. No legacy jQuery/Vue/Foundation debt. |
| Styling | Tailwind CSS | Utility-first CSS with responsive-concurrent design. Zero custom CSS files. |
| State Management | Zustand + persist middleware | Normalized entity store with atomic cross-page mutations. Replaces need for a real backend. |
| Data Layer | In-memory seed data (typed) | Demo-complete schema with 2 communities, 5 fundraisers, 8 users, 30 donations. Persists to localStorage. |
| AI Integration | OpenAI API (build-time) + client-side algorithms | Cause Intelligence pre-generated at build time. Impact projections computed client-side. Story Generator live if API key present. |
| Schema/SEO | Custom JSON-LD generators | DonateAction, Person, Organization, FAQPage, BreadcrumbList — everything GoFundMe is missing. |
| Analytics | Custom event layer (zero deps) | Beacon API dispatch, in-memory store, custom dashboard. No third-party SDK tax, which matters because Lighthouse shows GoFundMe's tag load is a major blocker. |
| Charts | Recharts (lazy-loaded) | Dashboard-only dependency. Dynamic import prevents bundle impact on product pages. |
| Images | next/image + curated WebP assets | Blur-up placeholders, responsive srcset, lazy loading. Beats GoFundMe's unoptimized loading. |
| Testing | Vitest (unit) + Lighthouse (perf) | Targeted tests on Zustand mutations. Lighthouse audit for performance/accessibility gates. |
| Deployment | Vercel (primary) + Local setup | Live URL for instant demo. Local fallback with zero-config setup. |

---

## 4. Success Metrics

Every metric has a target value derived from competitive benchmarks (including the March 8, 2026 Lighthouse audit of `gofundme.com`) and industry standards (Google Core Web Vitals). Metrics are organized into four tiers matching the instrumentation architecture.

### 4.1 Tier 1: Performance

| Metric | Target | GoFundMe Baseline | Why It Matters |
|---|---|---|---|
| TTFB | ≤ 150ms | 90ms (homepage Lighthouse) | TTFB is not GoFundMe's primary problem; we still target fast server response while prioritizing render speed. |
| LCP | ≤ 1.8s | 5.0s | The donate CTA must render before the donor's attention fades. |
| CLS | ≤ 0.1 | Unknown | Layout shifts during donation widget loading erode trust. |
| INP | ≤ 200ms | Unknown | Donate button responsiveness directly affects conversion rate. |
| TBT | ≤ 200ms | 2,210ms | The page must not feel frozen during initial interaction. |
| Full Page Load | ≤ 2.2s | 4.3 MB payload / Perf score 45 | Payload and script weight are major causes of poor real-world responsiveness. |
| Lighthouse Score | ≥ 90 (all categories) | 45 Performance / 95 Accessibility / 54 Best Practices / 92 SEO | Composite quality gate for performance, accessibility, SEO, and best practices. |

### 4.2 Tier 2: Conversion Funnel

| Funnel Step | Event Name | Target Rate | Measurement |
|---|---|---|---|
| Entry | session_start | 100% (baseline) | All sessions tracked with source attribution |
| Discovery | community_view | ≥ 40% of sessions | Sessions that reach a community page |
| Interest | fundraiser_view | ≥ 60% of community viewers | Community → Fundraiser click-through rate |
| Intent | donate_intent | ≥ 25% of fundraiser viewers | Donate button click rate |
| Conversion | donation_complete | ≥ 70% of intents | Donation completion rate (post-modal) |
| Trust Check | profile_view_from_fundraiser | ≥ 20% of fundraiser viewers | Donors who verify organizer identity before giving |
| Trust to Action | fundraiser_click_from_profile | ≥ 25% of profile viewers | Profile pages that successfully push users back into a live fundraiser |
| Guided Discovery | recommended_fundraiser_click | ≥ 30% of recommendation exposures | Whether AI-guided recommendations outperform plain directory browsing |

### 4.3 Tier 3: SEO Health

| Metric | Target | Why |
|---|---|---|
| Schema validation pass rate | 100% across all page types | Invalid JSON-LD means no rich snippets in search results |
| Profile index readiness | 100% of profiles have index + follow | GoFundMe is at 0%. This is our primary competitive advantage. |
| Rich snippet eligibility | 3/3 page types schema-eligible | DonateAction, FAQPage, and Person schemas must validate against Google's Rich Results Test |
| Heading hierarchy compliance | Zero skipped heading levels | Proper H1 → H2 → H3 hierarchy improves both SEO and accessibility |
| Non-branded keyword coverage | Community pages target 50+ non-branded keywords each | Reduces dependence on branded search demand |
| Content quality pass rate | 90%+ of indexable fundraisers meet story/update thresholds | Thin UGC is likely part of keyword erosion and trust loss |

### 4.4 Tier 4: Attribution

| Attribution Path | Target | Why |
|---|---|---|
| organic → community → fundraiser → donation | Tracked end-to-end | Proves Community pages drive downstream revenue |
| organic → profile → fundraiser → donation | Tracked end-to-end | Proves indexed Profiles create discoverable trust |
| referral → fundraiser → profile_view → donation | Trust verification rate ≥ 20% | Measures whether donors verify organizers before giving |
| Avg. pages per session | ≥ 3.0 | Proves cross-page integration creates engagement depth |
| community → recommendation → fundraiser → donation | Tracked end-to-end | Proves guided discovery improves campaign selection quality |
| fundraiser → profile → fundraiser → donation | Tracked end-to-end | Proves identity and trust loops help recover hesitant donors |

---

## 5. Phase Breakdown

| Phase | Name | Duration | Hours | Goal |
|---|---|---|---|---|
| Phase 1 | MVP — Core Platform | Days 1–7 | ~30h | Three interactive pages + cross-page state + seed data |
| Phase 2 | V1.5 — Intelligence Layer | Days 8–11 | ~22h | AI features + analytics dashboard + schema markup |
| Phase 3 | Scale — Polish & Ship | Days 12–14 | ~12h | Performance audit + accessibility + deployment + QA |

---

## 6. Phase 1: MVP — Core Platform

**Goal:** Three fully interactive pages with cross-page state management, seed data, and seamless navigation. The evaluator can load any page, navigate between all three, and perform a donation that produces visible results across the entire platform.

**Timeline:** Days 1–7 | **Budget:** ~30 hours | **Tickets:** 10

### 6.1 Foundation & Data Layer

---

#### FR-001: Project Scaffold & Next.js Configuration

| | |
|---|---|
| **User Story** | *As a developer, I want a fully configured Next.js 14 project with App Router, Tailwind CSS, and TypeScript so that I can begin building pages immediately without setup friction.* |
| **Priority** | **P0** · Est: 2h |

**Acceptance Criteria:**

- ✅ Next.js 14 app initializes with App Router and TypeScript strict mode
- ✅ Tailwind CSS configured with custom color tokens (emerald-600 primary, stone palette)
- ✅ File structure matches the project spec: app/, components/, lib/ directories at the **repo root** (not a subdirectory) — docs coexist alongside the Next.js project
- ✅ Root layout includes skip-nav link, semantic HTML landmarks (header, main, footer)
- ✅ Dev server starts with `npm run dev` in under 5 seconds
- ✅ ESLint + Prettier configured and passing
- ✅ `.nvmrc` specifies Node 20. `engines` field in `package.json` enforces it.
- ✅ `package-lock.json` committed for deterministic installs
- ✅ Vercel project connected to `git@github.com:alediez2048/gofundme.git` with auto-deploy on `main` — every push produces a live preview URL from Day 1
- ✅ `.env.example` created with documented optional variables (`OPENAI_API_KEY`, `NEXT_PUBLIC_ANALYTICS_ENABLED`)

**Deployment note:** Vercel is connected during scaffold (FR-001), not during Phase 3. This ensures continuous deployment from the first push. FR-021 handles final production polish (build verification, README live URL, environment hardening).

---

#### FR-002: Data Model & Seed Data

| | |
|---|---|
| **User Story** | *As a developer, I want a typed data model with realistic seed data so that all three pages can render complete, populated content from day one.* |
| **Priority** | **P0** · Est: 2h |

**Acceptance Criteria:**

- ✅ TypeScript interfaces defined for User, Fundraiser, Community, and Donation entities
- ✅ Seed data contains: 2 communities, 5 fundraisers, 8 users, 30 donations
- ✅ Every field in the schema has a non-empty value in the seed data (zero empty states in happy path)
- ✅ Entity relationships are consistent: every fundraiser.organizerId maps to a real user, every fundraiser.communityId maps to a real community
- ✅ Computed fields (totalRaised, donationCount) are derived from donation records, not hardcoded

---

#### FR-003: Zustand Store with Normalized Slices

| | |
|---|---|
| **User Story** | *As a developer, I want a reactive state management layer so that a single action (like a donation) atomically updates all affected entities across all three page types.* |
| **Priority** | **P0** · Est: 3h |

**Acceptance Criteria:**

- ✅ Zustand store initialized with normalized slices: users, fundraisers, communities, donations
- ✅ `addDonation(fundraiserId, amount, donorId, message?)` atomically updates: (1) creates donation record, (2) increments fundraiser raisedAmount and donationCount, (3) adds to donor donationIds and increments totalDonated, (4) increments community aggregate stats
- ✅ Store persists to localStorage via zustand/middleware persist
- ✅ Components subscribe to specific entity fields (not entire store) to prevent unnecessary re-renders
- ✅ Store hydrates from seed data on first load and from localStorage on subsequent loads

---

### 6.2 Page Implementation

---

#### FR-004: Fundraiser Page (/f/[slug])

| | |
|---|---|
| **User Story** | *As a donor, I want to see a compelling fundraiser page with a clear story, progress indicator, and prominent donate button so that I can understand the cause and give with confidence.* |
| **Priority** | **P0** · Est: 4h |

**Acceptance Criteria:**

- ✅ Page renders at `/f/[slug]` with data from Zustand store matching the slug
- ✅ Above-the-fold content: hero image (next/image with blur placeholder), title (H1), organizer name (linked to `/u/[username]`), progress bar with amount raised / goal, and Donate CTA button
- ✅ Trust cues are visible without digging: organizer verification, organizer history snippet, and community context appear before or near the donate CTA
- ✅ Story content meets a quality floor: clear problem, beneficiary/context, and at least 300 words of substantive narrative for the seeded happy path
- ✅ Below-the-fold: fundraiser story (rich text), recent donors wall (top 5 with avatars linked to profiles), organizer updates timeline, parent community badge (linked to `/communities/[slug]`)
- ✅ "Related fundraisers in this community" module links to 3 relevant campaigns
- ✅ Progress bar renders correct percentage derived from raisedAmount / goalAmount
- ✅ All entity names/avatars are clickable links to their respective pages
- ✅ Page title and meta description set correctly for SEO

---

#### FR-005: Community Page (/communities/[slug])

| | |
|---|---|
| **User Story** | *As a potential donor, I want to discover a community's impact and browse its active fundraisers so that I can find a cause to support.* |
| **Priority** | **P0** · Est: 4h |

**Acceptance Criteria:**

- ✅ Page renders at `/communities/[slug]` with data from Zustand store
- ✅ Header section: community banner image, name (H1), cause category badge, aggregate stats (total raised, donation count, fundraiser count, member count)
- ✅ Fundraiser directory: grid of fundraiser cards (image, title, progress bar, organizer name) sorted by most recent activity. Each card links to `/f/[slug]`
- ✅ Guided discovery module helps users choose a campaign by urgency, momentum, or personal relevance instead of only browsing a flat list
- ✅ Community page includes direct-answer content for high-intent questions about the cause, organization, and how to help
- ✅ Member section: avatar grid of community members, each linked to `/u/[username]`. Shows first 8 with "+X more" overflow
- ✅ FAQ section: expandable accordion with 3–5 questions about the cause
- ✅ Aggregate stats are computed from store data (not hardcoded) and update when donations are made

---

#### FR-006: Profile Page (/u/[username])

| | |
|---|---|
| **User Story** | *As a donor checking an organizer's credibility, I want to see their fundraising history, verification status, and community memberships so that I can trust them before donating.* |
| **Priority** | **P0** · Est: 4h |

**Acceptance Criteria:**

- ✅ Page renders at `/u/[username]` with data from Zustand store
- ✅ Identity section: avatar, display name (H1), verified badge (if verified), bio, join date
- ✅ Above-the-fold trust summary explains why this organizer is credible: history, communities, and recent impact at a glance
- ✅ AI-generated impact summary produces 2–3 sentences of unique, privacy-safe narrative based on the organizer's fundraising history
- ✅ Impact stats: total raised (as organizer), total donated (as donor), causes supported count
- ✅ Active fundraisers: card list of campaigns they're organizing, each linked to `/f/[slug]`
- ✅ Community memberships: badge list of communities, each linked to `/communities/[slug]`
- ✅ Giving history: chronological list of donations with amount, fundraiser name (linked), and date
- ✅ All computed values (totalRaised, totalDonated, causesSupported) derive from store data

---

### 6.3 Interaction & Integration

---

#### FR-007: Donation Flow & Modal

| | |
|---|---|
| **User Story** | *As a donor, I want a smooth donation experience that gives me immediate feedback and shows my contribution reflected across the platform.* |
| **Priority** | **P0** · Est: 3h |

**Acceptance Criteria:**

- ✅ Clicking "Donate" on a fundraiser page opens a modal overlay
- ✅ Modal contains: amount input (with preset buttons for $25, $50, $100, $250), optional message field, and Confirm button
- ✅ On confirm: `addDonation()` fires, modal closes, progress bar animates to new percentage (CSS transition 500ms ease), new donation appears at top of donor wall
- ✅ Toast notification appears: "Donation added! View it on your profile →" with link to `/u/[username]`
- ✅ Modal implements focus trap: Tab cycles within modal, Escape closes it, focus returns to Donate button on close
- ✅ Modal has proper ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to modal title

---

#### FR-008: Cross-Page Navigation & Link Graph

| | |
|---|---|
| **User Story** | *As a user, I want every entity name and avatar to be a clickable link so that I can naturally explore the platform by following relationships between people, causes, and communities.* |
| **Priority** | **P0** · Est: 2h |

**Acceptance Criteria:**

- ✅ Fundraiser page: organizer name → `/u/[username]`, donor names → `/u/[username]`, community badge → `/communities/[slug]`
- ✅ Community page: fundraiser cards → `/f/[slug]`, member avatars → `/u/[username]`
- ✅ Profile page: fundraiser cards → `/f/[slug]`, community badges → `/communities/[slug]`, donation history fundraiser names → `/f/[slug]`
- ✅ All links use Next.js `<Link>` with default prefetch behavior
- ✅ No dead links: every entity ID in the store has a corresponding rendered page
- ✅ Navigation between pages shows subtle 150ms opacity fade transition

---

#### FR-009: Responsive Layout (Mobile + Desktop)

| | |
|---|---|
| **User Story** | *As a user on any device, I want the platform to look intentional and polished at every viewport width so that I trust the product regardless of how I access it.* |
| **Priority** | **P0** · Est: 4h |

**Acceptance Criteria:**

- ✅ Fundraiser page: single-column stack on mobile → two-column (story left, donation widget right) on `lg:` breakpoint
- ✅ Community page: full-width cards on mobile → 2-column grid on `md:`, 3-column on `lg:`
- ✅ Profile page: stacked sections on mobile → sidebar (badges + stats) + main content on `lg:`
- ✅ Navigation: hamburger menu on mobile → horizontal nav on `md:`
- ✅ Donation widget is sticky on desktop (`position: sticky, top: 1rem`)
- ✅ No horizontal scroll at any viewport width from 375px to 1440px
- ✅ All tap targets are at least 44x44px on mobile

---

#### FR-010: Skeleton Loaders & Page Transitions

| | |
|---|---|
| **User Story** | *As a user, I want the platform to feel fast and seamless with no loading spinners, layout jumps, or jarring page swaps.* |
| **Priority** | **P1** · Est: 2h |

**Acceptance Criteria:**

- ✅ Skeleton loader component renders pulsing gray rectangles (`animate-pulse`) at specified dimensions
- ✅ Skeletons used for: fundraiser cards (community page), donor wall entries (fundraiser page), profile stats (profile page)
- ✅ Page mount animation: 150ms opacity fade-in via CSS `@keyframes`
- ✅ Next.js scroll restoration preserves scroll position on back navigation
- ✅ No visible loading spinners anywhere in the application
- ✅ Above-the-fold content renders without JavaScript-dependent layout shifts (CLS ≤ 0.1)

---

## 7. Phase 2: V1.5 — Intelligence Layer

**Goal:** Layer AI features, structured data (schema markup), and the analytics dashboard onto the core platform. After this phase, every page demonstrates AI integration, every page has valid JSON-LD, and the `/analytics` route visualizes all four instrumentation tiers.

**Timeline:** Days 8–11 | **Budget:** ~22 hours | **Tickets:** 8

### 7.1 AI Integration

---

#### FR-011: Cause Intelligence (Community Page AI Content)

| | |
|---|---|
| **User Story** | *As a potential donor, I want to understand the broader context of a cause so that I can make an informed decision about where to direct my giving.* |
| **Priority** | **P1** · Est: 3h |

**Acceptance Criteria:**

- ✅ Community page displays a "About This Cause" section with a 200–300 word AI-generated summary
- ✅ Content is pre-generated at build time and stored in seed data (zero runtime API calls)
- ✅ Build script (`scripts/generate-ai-content.ts`) calls OpenAI/Claude with community name + cause category
- ✅ If no API key is configured, pre-generated content from seed data renders identically
- ✅ Content covers: current state of the issue, why funding matters now, and impact of previous donations
- ✅ Section is visually distinct (subtle background, "✨ AI-powered insight" label)

---

#### FR-012: Impact Projections (Donation Widget Enhancement)

| | |
|---|---|
| **User Story** | *As a donor, I want to see what my specific dollar amount will accomplish so that I feel emotionally connected to the impact of my gift.* |
| **Priority** | **P1** · Est: 2h |

**Acceptance Criteria:**

- ✅ Donation modal displays an impact statement below the amount input that updates in real-time as the user types
- ✅ Impact computed from a `causeImpactMap`: `{ unit, costPerUnit, timeframe }` per cause category
- ✅ Example output: "Your $50 means 200 families receive real-time wildfire alerts for one month"
- ✅ Pre-computed for preset amounts ($25, $50, $100, $250). Interpolated for custom amounts.
- ✅ Impact statement is zero-latency (client-side math, no API call)
- ✅ Graceful handling: if amount is $0 or empty, impact statement hides (no "0 families")

---

#### FR-013: Fundraiser Story Generator (Stretch Feature)

| | |
|---|---|
| **User Story** | *As an organizer, I want AI to help me write a compelling fundraiser story from bullet points so that my campaign is more likely to attract donors.* |
| **Priority** | **P2** · Est: 3h |

**Acceptance Criteria:**

- ✅ Fundraiser page includes a "✏️ Draft with AI" button (visible in a demo/edit mode)
- ✅ Clicking opens a panel with a textarea for bullet points and a "Generate" button
- ✅ If API key is present: streaming API call generates a narrative draft, rendering token-by-token
- ✅ If no API key: pre-generated example story renders with a subtle "Example output" label
- ✅ Generated story is editable — user can modify the output before "saving" (updating store)
- ✅ Regenerate button available for iterative drafting

---

### 7.2 Schema & SEO

---

#### FR-014: JSON-LD Schema Generators

| | |
|---|---|
| **User Story** | *As a search engine, I want valid structured data on every page so that I can display rich results (donation cards, person knowledge panels, FAQ accordions) in search results.* |
| **Priority** | **P0** · Est: 3h |

**Acceptance Criteria:**

- ✅ SchemaInjector component renders page-specific JSON-LD in `<script type="application/ld+json">`
- ✅ Fundraiser pages: DonateAction + MonetaryAmount + BreadcrumbList
- ✅ Community pages: Organization (or NGO) + FAQPage + BreadcrumbList + AggregateRating
- ✅ Profile pages: Person + ProfilePage + ItemList (fundraiser list) + BreadcrumbList
- ✅ All schemas validate against Google's Rich Results Test (manual verification in QA checklist)
- ✅ Open Graph tags correctly set per page type (`og:type` = website for community, profile for user, article for fundraiser)
- ✅ Profile pages have `<meta name="robots" content="index, follow">` (explicitly fixing GoFundMe's noindex)

---

### 7.3 Analytics & Instrumentation

---

#### FR-015: Event Tracking System

| | |
|---|---|
| **User Story** | *As a product manager, I want every meaningful user action tracked with a documented rationale so that I can understand how users navigate the platform and where the funnel breaks.* |
| **Priority** | **P0** · Est: 3h |

**Acceptance Criteria:**

- ✅ `track(event, properties)` function dispatches events via `navigator.sendBeacon()` (non-blocking)
- ✅ Events stored in Zustand analytics slice with: event name, properties, timestamp, page path, session ID
- ✅ Session ID assigned on first page load, persisted to sessionStorage
- ✅ Entry source captured: referrer, UTM params, or "direct"
- ✅ Tracked events: `session_start`, `page_view`, `community_view`, `fundraiser_view`, `fundraiser_click_from_community`, `donate_intent`, `donation_complete`, `profile_view_from_fundraiser`, `return_to_fundraiser_from_profile`, `donation_after_profile_view`
- ✅ Total analytics code footprint: < 5KB gzipped

---

#### FR-016: Core Web Vitals Monitoring

| | |
|---|---|
| **User Story** | *As a developer, I want automated performance measurement per page template so that I can verify we meet our performance budget and demonstrate the improvement over GoFundMe.* |
| **Priority** | **P1** · Est: 2h |

**Acceptance Criteria:**

- ✅ `useWebVitals()` hook wraps the `web-vitals` library, reporting: TTFB, LCP, CLS, INP
- ✅ Metrics are tagged with the current page template (fundraiser, community, profile, analytics)
- ✅ Results stored in Zustand analytics slice alongside event data
- ✅ Performance data renders in the analytics dashboard with color-coded gauges (green/yellow/red)
- ✅ GoFundMe baseline values displayed alongside our measurements for comparison

---

#### FR-017: Analytics Dashboard (/analytics)

| | |
|---|---|
| **User Story** | *As an evaluator, I want a dedicated page showing all captured metrics with clear explanations so that I can verify the platform is well-instrumented and understand why each metric matters.* |
| **Priority** | **P1** · Est: 4h |

**Acceptance Criteria:**

- ✅ Dashboard renders at `/analytics`, linked from main navigation
- ✅ Panel 1 (Performance): Gauge charts showing TTFB, LCP, CLS, INP per page type. Color-coded against targets. GoFundMe baselines shown for comparison.
- ✅ Panel 2 (Conversion Funnel): Horizontal funnel chart showing drop-off at each stage from session data
- ✅ Panel 3 (SEO Health): Checklist of schema validation status per page type with green/red indicators
- ✅ Panel 4 (Attribution): Sankey diagram or flow visualization showing traffic paths from entry to donation, with trust-verification branch highlighted
- ✅ Every metric has a subtitle explaining why it's tracked (e.g., "LCP ≤ 1.8s — The donate CTA must render before the donor's attention fades")
- ✅ Dashboard uses Recharts, dynamically imported to avoid bundle impact on product pages
- ✅ Dashboard reflects real data from the evaluator's current session

---

#### FR-018: Session Attribution Tracking

| | |
|---|---|
| **User Story** | *As a product analyst, I want to track the full multi-page journey from entry to donation, including the trust-verification branch, so that I can prove the business value of indexed profiles.* |
| **Priority** | **P1** · Est: 2h |

**Acceptance Criteria:**

- ✅ Session journey tracked as an ordered array of page views with timestamps
- ✅ Attribution path reconstructed on `donation_complete`: full sequence from `session_start` to conversion
- ✅ Trust-verification branch detected: if `profile_view_from_fundraiser` occurs before `donation_complete` in the same session, flag as trust-verified donation
- ✅ Trust verification rate computed: (trust-verified donations / total donations) displayed in attribution panel
- ✅ Journey data feeds the Sankey diagram in the analytics dashboard

---

## 8. Phase 3: Scale — Polish & Ship

**Goal:** Performance optimization, accessibility compliance, edge case handling, deployment, and quality assurance. After this phase, the product is submission-ready with zero known defects, a live URL, and a passing QA checklist.

**Timeline:** Days 12–14 | **Budget:** ~12 hours | **Tickets:** 5

### 8.1 Accessibility

---

#### FR-019: Accessibility Foundation & ARIA Implementation

| | |
|---|---|
| **User Story** | *As a user with a disability, I want to navigate and use the entire platform with a keyboard and screen reader so that I am not excluded from the fundraising experience.* |
| **Priority** | **P1** · Est: 4h |

**Acceptance Criteria:**

- ✅ Skip navigation link visible on focus, jumps to `#main-content`
- ✅ All pages use semantic HTML: `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>` with correct ARIA roles
- ✅ Heading hierarchy is H1 → H2 → H3 with zero skipped levels on every page
- ✅ Donation modal focus trap: Tab cycles within modal, Shift+Tab reverses, Escape closes, focus returns to trigger
- ✅ Progress bar has `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`
- ✅ Toast notifications use `aria-live="polite"` for screen reader announcement
- ✅ All interactive elements have visible focus indicators (2px solid emerald-600, 2px offset)
- ✅ Color contrast ratios meet WCAG AA: primary text 15.3:1, CTA button 4.6:1
- ✅ `prefers-reduced-motion` media query disables all animations
- ✅ Lighthouse accessibility score ≥ 95

---

### 8.2 Edge Cases & Polish

---

#### FR-020: Edge Case Handling & Designed States

| | |
|---|---|
| **User Story** | *As an evaluator testing boundary conditions, I want every edge case to display a designed state (not a broken one) so that the platform feels production-ready.* |
| **Priority** | **P1** · Est: 3h |

**Acceptance Criteria:**

- ✅ Fundraiser at 0% funded: "Just launched — be the first donor" + prominent CTA
- ✅ Fundraiser at 76–99%: urgency messaging ("Almost there! $500 to go")
- ✅ Fundraiser at 100%: "Goal reached!" celebration state with confetti animation
- ✅ Fundraiser > 100%: overfunded state with extended progress bar and "150% — Goal exceeded!"
- ✅ Empty profile: onboarding prompt "Your giving journey starts here" with CTA
- ✅ Community with 1 member: "Be among the first" instead of "1 member"
- ✅ Donor wall overflow: top 10 shown, "View all X donors" button for full list
- ✅ No console errors in any state

---

### 8.3 Deployment & QA

---

#### FR-021: Deployment Finalization & Production Hardening

| | |
|---|---|
| **User Story** | *As an evaluator, I want to click a URL and see the product running in under 5 seconds so that my first impression is the product's quality, not a setup process.* |
| **Priority** | **P0** · Est: 2h |

**Context:** Vercel is connected to the GitHub repo during FR-001 (scaffold), so continuous deployment runs throughout the sprint. This ticket finalizes the production deployment and ensures the submission is bulletproof.

**Acceptance Criteria:**

- ✅ `vercel --prod` run confirms clean production build with zero errors or warnings
- ✅ Environment variables verified in Vercel dashboard: `NEXT_PUBLIC_ANALYTICS_ENABLED=true`
- ✅ AI content pre-generated and committed to seed data (no runtime API key required for the evaluator)
- ✅ README updated with final live URL (linked first, above local setup instructions)
- ✅ Local setup verified: `git clone → npm install → npm run dev` works with zero configuration on a clean machine
- ✅ `.env.example` documents all optional variables with clear comments explaining what each enables
- ✅ Production bundle size verified: total page weight ≤ 800 KiB (5.5x lighter than GoFundMe's 4.3 MB)
- ✅ Live URL responds with correct headers, no console errors, and all pages render

**Deployment Workflow:**

```
Day 1 (FR-001):
  1. Next.js project created at repo root
  2. Vercel project connected via `vercel link` → auto-deploys on every push to main
  3. .env.example committed with optional vars documented
  4. First push produces live preview URL

Days 2–11 (continuous):
  - Every push to main auto-deploys to Vercel preview
  - Preview URLs available for testing throughout development
  - No manual deployment steps required

Day 12 (FR-021):
  1. Run `vercel --prod` to promote latest build to production
  2. Verify environment variables in Vercel dashboard
  3. Confirm production build passes (zero errors/warnings)
  4. Update README with final production URL
  5. Verify local setup works: clone → install → dev on clean machine
  6. Run Lighthouse against live production URL
  7. Cross-check live URL matches local build behavior
```

---

#### FR-022: Unit Tests for Store Mutations

| | |
|---|---|
| **User Story** | *As a developer, I want automated tests covering the critical state mutation logic so that cross-page integration cannot silently break.* |
| **Priority** | **P1** · Est: 2h |

**Acceptance Criteria:**

- ✅ Vitest configured and running via `npm test`
- ✅ Test: `addDonation` increments fundraiser `raisedAmount` by donation amount
- ✅ Test: `addDonation` increments fundraiser `donationCount` by 1
- ✅ Test: `addDonation` adds donation ID to fundraiser `donationIds` array
- ✅ Test: `addDonation` adds donation ID to donor `donationIds` array and increments `totalDonated`
- ✅ Test: `addDonation` increments community `totalRaised` when fundraiser has `communityId`
- ✅ Test: `addDonation` does not modify community when fundraiser has no `communityId`
- ✅ Test: `addDonation` handles overfunding correctly (`raisedAmount > goalAmount`)
- ✅ All tests pass on `npm test` with zero failures

---

#### FR-023: Pre-Submission QA Checklist

| | |
|---|---|
| **User Story** | *As a developer, I want a comprehensive quality gate so that nothing is broken, missing, or underperforming when the evaluator reviews the submission.* |
| **Priority** | **P0** · Est: 1h |

**Acceptance Criteria:**

- ✅ All three pages load without console errors on Chrome, Firefox, and Safari
- ✅ Full navigation loop works: Community → Fundraiser → Profile → Community
- ✅ Donation flow: donate → progress bar updates → profile shows donation → community aggregate updates
- ✅ Analytics dashboard loads with real session data after a walkthrough
- ✅ Schema JSON-LD validates for all three page types (Google Rich Results Test)
- ✅ Lighthouse performance ≥ 90 on all three product pages
- ✅ Lighthouse accessibility ≥ 95 on all three product pages
- ✅ Lighthouse SEO ≥ 90 on all three product pages
- ✅ Mobile responsive: all pages render correctly at 375px viewport width
- ✅ No horizontal scroll at any viewport width 375px–1440px
- ✅ All images load (no broken image icons)
- ✅ Edge case: overfunding state renders correctly
- ✅ Edge case: empty profile displays designed onboarding state
- ✅ Live Vercel URL is accessible and matches local build

---

## 9. Ticket Summary

| ID | Title | Phase | Priority | Est. |
|---|---|---|---|---|
| FR-001 | Project Scaffold & Next.js Configuration | Phase 1 | P0 | 2h |
| FR-002 | Data Model & Seed Data | Phase 1 | P0 | 2h |
| FR-003 | Zustand Store with Normalized Slices | Phase 1 | P0 | 3h |
| FR-004 | Fundraiser Page | Phase 1 | P0 | 4h |
| FR-005 | Community Page | Phase 1 | P0 | 4h |
| FR-006 | Profile Page | Phase 1 | P0 | 4h |
| FR-007 | Donation Flow & Modal | Phase 1 | P0 | 3h |
| FR-008 | Cross-Page Navigation & Link Graph | Phase 1 | P0 | 2h |
| FR-009 | Responsive Layout | Phase 1 | P0 | 4h |
| FR-010 | Skeleton Loaders & Page Transitions | Phase 1 | P1 | 2h |
| FR-011 | Cause Intelligence (AI Content) | Phase 2 | P1 | 3h |
| FR-012 | Impact Projections | Phase 2 | P1 | 2h |
| FR-013 | Fundraiser Story Generator | Phase 2 | P2 | 3h |
| FR-014 | JSON-LD Schema Generators | Phase 2 | P0 | 3h |
| FR-015 | Event Tracking System | Phase 2 | P0 | 3h |
| FR-016 | Core Web Vitals Monitoring | Phase 2 | P1 | 2h |
| FR-017 | Analytics Dashboard | Phase 2 | P1 | 4h |
| FR-018 | Session Attribution Tracking | Phase 2 | P1 | 2h |
| FR-019 | Accessibility Foundation & ARIA | Phase 3 | P1 | 4h |
| FR-020 | Edge Case Handling & Designed States | Phase 3 | P1 | 3h |
| FR-021 | Deployment Finalization & Production Hardening | Phase 3 | P0 | 2h |
| FR-022 | Unit Tests for Store Mutations | Phase 3 | P1 | 2h |
| FR-023 | Pre-Submission QA Checklist | Phase 3 | P0 | 1h |

**Total: 23 tickets · 64 hours · 14 days**

---

## 10. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| AI API key not available during evaluation | High | High | All AI content pre-generated at build time and committed to seed data. Zero runtime dependency on API keys. |
| Vercel deployment goes down after submission | Low | High | Continuous deployment from Day 1 means deployment is battle-tested by submission. Local setup documented and verified (FR-021): evaluator can run `git clone → npm install → npm run dev` as fallback. |
| Performance budget exceeded by analytics code | Medium | Medium | Analytics footprint capped at 5KB. All event dispatch uses non-blocking Beacon API. Dashboard charts dynamically imported. |
| Zustand store mutation introduces cross-page bug | Medium | High | 8 unit tests cover the addDonation function. Manual QA checklist verifies cross-page state after donation. |
| Schema JSON-LD fails Google validation | Low | Medium | Build-time validation script checks schema output. QA checklist includes Rich Results Test verification. |
| Scope creep from stretch features | High | Medium | FR-013 (Story Generator) is explicitly P2. MVP ships without it. Only P0 and P1 tickets are required for submission. |

---

## 11. Appendix: Dependency Map

Tickets must be executed in dependency order within each phase. Cross-phase dependencies are minimal by design — Phase 1 is fully self-contained.

### 11.1 Phase 1 Dependencies

- FR-001 (Scaffold) → blocks all other tickets
- FR-002 (Seed Data) + FR-003 (Zustand Store) → blocks FR-004, FR-005, FR-006
- FR-004 + FR-005 + FR-006 (Pages) → blocks FR-007 (Donation Flow), FR-008 (Navigation)
- FR-009 (Responsive) can run in parallel with FR-007 + FR-008
- FR-010 (Skeletons) depends on FR-004 + FR-005 + FR-006

### 11.2 Phase 2 Dependencies

- FR-011 (Cause Intelligence) depends on FR-005 (Community Page)
- FR-012 (Impact Projections) depends on FR-007 (Donation Modal)
- FR-013 (Story Generator) depends on FR-004 (Fundraiser Page) — can be skipped (P2)
- FR-014 (Schema) can start immediately (only depends on Phase 1 pages existing)
- FR-015 (Event Tracking) can start immediately
- FR-016 (Web Vitals) depends on FR-015
- FR-017 (Dashboard) depends on FR-015 + FR-016
- FR-018 (Attribution) depends on FR-015

### 11.3 Phase 3 Dependencies

- FR-019 (Accessibility) can start immediately (refines existing pages)
- FR-020 (Edge Cases) depends on FR-007 (Donation Flow) + all pages
- FR-021 (Deployment Finalization) depends on FR-001 (Vercel connected during scaffold) + all Phase 2 tickets complete — this ticket verifies the production build, not initial deployment
- FR-022 (Unit Tests) depends on FR-003 (Zustand Store)
- FR-023 (QA Checklist) is the final ticket — depends on everything
