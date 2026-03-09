# FundRight — Development Log

**Project:** FundRight — AI-Powered Next-Generation Fundraising Platform  
**Sprint:** Mar 8–21, 2026 (Phase 1: MVP) | Mar 15–18 (Phase 2: Intelligence) | Mar 19–21 (Phase 3: Polish & Ship)  
**Developer:** JAD  
**AI Assistant:** Claude (Cursor Agent)

---

## Timeline

| Phase | Days | Target |
|-------|------|--------|
| Phase 1 — MVP Core Platform | Days 1–7 (~30h) | Three interactive pages + cross-page state + seed data + donation flow |
| Phase 2 — Intelligence Layer | Days 8–11 (~22h) | AI features + analytics dashboard + schema markup |
| Phase 3 — Polish & Ship | Days 12–14 (~12h) | Performance audit + accessibility + deployment + QA |

---

## Phase 1: MVP — Core Platform (FR-001 → FR-010)

The following tickets are **required** to pass the MVP gate — three fully interactive pages with cross-page state management, seed data, responsive layouts, and seamless navigation:

| Ticket | Title | MVP Role | Priority | Est. | Status |
|--------|-------|----------|----------|------|--------|
| FR-001 | Project Scaffold & Next.js Configuration | **Foundation** — nothing works without this | P0 | 2h | DONE |
| FR-002 | Data Model & Seed Data | **Foundation** — typed entities + realistic population | P0 | 2h | TODO |
| FR-003 | Zustand Store with Normalized Slices | **Foundation** — reactive cross-page state | P0 | 3h | TODO |
| FR-004 | Fundraiser Page (`/f/[slug]`) | **Core** — conversion-optimized donation destination | P0 | 4h | TODO |
| FR-005 | Community Page (`/communities/[slug]`) | **Core** — SEO powerhouse + discovery entry point | P0 | 4h | TODO |
| FR-006 | Profile Page (`/u/[username]`) | **Core** — trust authority + organizer credibility | P0 | 4h | TODO |
| FR-007 | Donation Flow & Modal | **Core** — cross-page state mutation via donation | P0 | 3h | TODO |
| FR-008 | Cross-Page Navigation & Link Graph | **Core** — closed-loop internal linking | P0 | 2h | TODO |
| FR-009 | Responsive Layout (Mobile + Desktop) | **Core** — responsive-concurrent at 375px–1440px | P0 | 4h | TODO |
| FR-010 | Skeleton Loaders & Page Transitions | **Polish** — perceived performance + seamless navigation | P1 | 2h | TODO |

### Phase 1 Dependencies

- FR-001 (Scaffold) → blocks all other tickets
- FR-002 (Seed Data) + FR-003 (Zustand Store) → blocks FR-004, FR-005, FR-006
- FR-004 + FR-005 + FR-006 (Pages) → blocks FR-007 (Donation Flow), FR-008 (Navigation)
- FR-009 (Responsive) can run in parallel with FR-007 + FR-008
- FR-010 (Skeletons) depends on FR-004 + FR-005 + FR-006

---

## FR-001: Project Scaffold & Next.js Configuration ✅

### Plain-English Summary
- Next.js 14 app created at repo root with App Router, TypeScript strict, Tailwind (emerald-600 primary, stone palette).
- Root layout has skip-nav link and semantic landmarks (header, main, footer). `app/`, `components/`, `lib/` exist alongside `docs/`.
- ESLint (Next config), Prettier, `.nvmrc` (20), `engines` in package.json, `.env.example` with optional vars.

### Metadata
- **Status:** Complete
- **Date:** 2026-03-09
- **Ticket:** FR-001
- **Branch:** develop

### Scope
- Scaffold only; no pages beyond homepage placeholder. Vercel connection is a manual step (see below).

### Key Achievements
- Build and lint pass. `npm run dev` starts dev server; `npm run build` succeeds.

### Technical Implementation
- Manual scaffold (no create-next-app) due to npm naming restrictions in directory name. package.json name: `fundright`. Paths: `@/*` → repo root.

### Files Changed
- **Created:** package.json, tsconfig.json, next.config.js, tailwind.config.ts, postcss.config.mjs, .eslintrc.json, .prettierrc, .nvmrc, next-env.d.ts, .env.example, app/layout.tsx, app/page.tsx, app/globals.css, components/.gitkeep, lib/.gitkeep
- **Updated:** docs/development/DEVLOG.md — this entry

### Acceptance Criteria
- [x] Next.js 14 App Router + TypeScript strict
- [x] Tailwind with emerald-600 primary, stone palette
- [x] app/, components/, lib/ at repo root; docs alongside
- [x] Root layout: skip-nav, header, main, footer
- [x] ESLint + Prettier configured and passing
- [x] .nvmrc Node 20, engines in package.json
- [x] package-lock.json (from npm install)
- [ ] Vercel project connected — **manual step for you** (see below)
- [x] .env.example with OPENAI_API_KEY, NEXT_PUBLIC_ANALYTICS_ENABLED

### Next Steps
- FR-002 (Data Model & Seed Data), then FR-003 (Zustand Store).

---

## Phase 2: Intelligence Layer (FR-011 → FR-018)

AI features, structured data, and the analytics dashboard. After this phase, every page demonstrates AI integration, every page has valid JSON-LD, and `/analytics` visualizes all four instrumentation tiers.

| Ticket | Title | Phase Role | Priority | Est. | Status |
|--------|-------|------------|----------|------|--------|
| FR-011 | Cause Intelligence (Community Page AI Content) | **AI** — pre-generated cause context | P1 | 3h | TODO |
| FR-012 | Impact Projections (Donation Widget Enhancement) | **AI** — real-time impact statements | P1 | 2h | TODO |
| FR-013 | Fundraiser Story Generator | **AI** — streaming narrative drafting (stretch) | P2 | 3h | TODO |
| FR-014 | JSON-LD Schema Generators | **SEO** — DonateAction, Person, FAQPage, Organization | P0 | 3h | TODO |
| FR-015 | Event Tracking System | **Analytics** — custom event layer + Beacon API | P0 | 3h | TODO |
| FR-016 | Core Web Vitals Monitoring | **Analytics** — TTFB, LCP, CLS, INP per page template | P1 | 2h | TODO |
| FR-017 | Analytics Dashboard (`/analytics`) | **Analytics** — four-tier instrumentation dashboard | P1 | 4h | TODO |
| FR-018 | Session Attribution Tracking | **Analytics** — multi-page journey + trust-verification branch | P1 | 2h | TODO |

### Phase 2 Dependencies

- FR-011 (Cause Intelligence) depends on FR-005 (Community Page)
- FR-012 (Impact Projections) depends on FR-007 (Donation Modal)
- FR-013 (Story Generator) depends on FR-004 (Fundraiser Page) — can be skipped (P2)
- FR-014 (Schema) can start immediately (only depends on Phase 1 pages existing)
- FR-015 (Event Tracking) can start immediately
- FR-016 (Web Vitals) depends on FR-015
- FR-017 (Dashboard) depends on FR-015 + FR-016
- FR-018 (Attribution) depends on FR-015

---

## Phase 3: Polish & Ship (FR-019 → FR-023)

Performance optimization, accessibility compliance, edge case handling, deployment, and quality assurance. After this phase, the product is submission-ready.

| Ticket | Title | Phase Role | Priority | Est. | Status |
|--------|-------|------------|----------|------|--------|
| FR-019 | Accessibility Foundation & ARIA Implementation | **A11y** — keyboard nav, ARIA, focus management | P1 | 4h | TODO |
| FR-020 | Edge Case Handling & Designed States | **Polish** — overfunding, empty states, boundaries | P1 | 3h | TODO |
| FR-021 | Vercel Deployment & Environment Configuration | **Deployment** — live URL, env vars, zero-config local | P0 | 2h | TODO |
| FR-022 | Unit Tests for Store Mutations | **QA** — Vitest suite for addDonation atomicity | P1 | 2h | TODO |
| FR-023 | Pre-Submission QA Checklist | **Gate** — final quality gate before submission | P0 | 1h | TODO |

### Phase 3 Dependencies

- FR-019 (Accessibility) can start immediately (refines existing pages)
- FR-020 (Edge Cases) depends on FR-007 (Donation Flow) + all pages
- FR-021 (Deployment) can start immediately
- FR-022 (Unit Tests) depends on FR-003 (Zustand Store)
- FR-023 (QA Checklist) is the final ticket — depends on everything

---

## Entry Format Template

Each ticket entry follows this standardized structure:

```
## FR-XXX: [Title] [Status Emoji]

### Plain-English Summary
- What was done
- What it means
- Success looked like
- How it works (simple)

### Metadata
- **Status:** Complete / In Progress / TODO
- **Date:** [date]
- **Time:** [actual] vs [estimate]
- **Ticket:** FR-XXX
- **Branch:** feature/fr-xxx-short-name

### Scope
- What was planned/built

### Key Achievements
- Notable accomplishments and highlights

### Technical Implementation
- Architecture decisions, code patterns, infrastructure

### Issues & Solutions
- Problems encountered and fixes applied

### Errors / Bugs / Problems
- All errors, bugs, unexpected behaviors, and blockers encountered
- Include: what happened, what was tried, what fixed it (or didn't)
- This section is the honest record — document what DIDN'T work, not just what did

### Testing
- Automated and manual test results

### Files Changed
- **Created:** file — description
- **Modified:** file — description
- **Updated:** docs/development/DEVLOG.md — this entry

### Acceptance Criteria
- [x] / [ ] Checklist from PRD

### Performance
- Metrics, benchmarks, observations

### Next Steps
- What comes next

### Learnings
- Key takeaways and insights
```

---

## Ticket Summary

| ID | Title | Phase | Priority | Est. | Status |
|----|-------|-------|----------|------|--------|
| FR-001 | Project Scaffold & Next.js Configuration | Phase 1 | P0 | 2h | DONE |
| FR-002 | Data Model & Seed Data | Phase 1 | P0 | 2h | TODO |
| FR-003 | Zustand Store with Normalized Slices | Phase 1 | P0 | 3h | TODO |
| FR-004 | Fundraiser Page | Phase 1 | P0 | 4h | TODO |
| FR-005 | Community Page | Phase 1 | P0 | 4h | TODO |
| FR-006 | Profile Page | Phase 1 | P0 | 4h | TODO |
| FR-007 | Donation Flow & Modal | Phase 1 | P0 | 3h | TODO |
| FR-008 | Cross-Page Navigation & Link Graph | Phase 1 | P0 | 2h | TODO |
| FR-009 | Responsive Layout | Phase 1 | P0 | 4h | TODO |
| FR-010 | Skeleton Loaders & Page Transitions | Phase 1 | P1 | 2h | TODO |
| FR-011 | Cause Intelligence (AI Content) | Phase 2 | P1 | 3h | TODO |
| FR-012 | Impact Projections | Phase 2 | P1 | 2h | TODO |
| FR-013 | Fundraiser Story Generator | Phase 2 | P2 | 3h | TODO |
| FR-014 | JSON-LD Schema Generators | Phase 2 | P0 | 3h | TODO |
| FR-015 | Event Tracking System | Phase 2 | P0 | 3h | TODO |
| FR-016 | Core Web Vitals Monitoring | Phase 2 | P1 | 2h | TODO |
| FR-017 | Analytics Dashboard | Phase 2 | P1 | 4h | TODO |
| FR-018 | Session Attribution Tracking | Phase 2 | P1 | 2h | TODO |
| FR-019 | Accessibility Foundation & ARIA | Phase 3 | P1 | 4h | TODO |
| FR-020 | Edge Case Handling & Designed States | Phase 3 | P1 | 3h | TODO |
| FR-021 | Vercel Deployment & Environment Config | Phase 3 | P0 | 2h | TODO |
| FR-022 | Unit Tests for Store Mutations | Phase 3 | P1 | 2h | TODO |
| FR-023 | Pre-Submission QA Checklist | Phase 3 | P0 | 1h | TODO |

**Total: 23 tickets · 64 hours · 14 days**

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI API key not available during evaluation | High | High | All AI content pre-generated at build time and committed to seed data. Zero runtime dependency on API keys. |
| Vercel deployment goes down after submission | Low | High | Local setup documented and tested. Evaluator can run `npm install && npm run dev` as fallback. |
| Performance budget exceeded by analytics code | Medium | Medium | Analytics footprint capped at 5KB. All event dispatch uses non-blocking Beacon API. Dashboard charts dynamically imported. |
| Zustand store mutation introduces cross-page bug | Medium | High | 8 unit tests cover the addDonation function. Manual QA checklist verifies cross-page state after donation. |
| Schema JSON-LD fails Google validation | Low | Medium | Build-time validation script checks schema output. QA checklist includes Rich Results Test verification. |
| Scope creep from stretch features | High | Medium | FR-013 (Story Generator) is explicitly P2. MVP ships without it. Only P0 and P1 tickets are required for submission. |
