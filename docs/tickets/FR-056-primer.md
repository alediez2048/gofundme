# FR-056 Primer: Analytics Dashboard

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-055 (Analytics Event Layer) provides typed events, Beacon API emitter, and local event storage. The app uses Next.js 14 with Tailwind CSS and Zustand state management.

---

## What Is This Ticket?

FR-056 creates an analytics dashboard at `/analytics` that visualizes the four tiers of events collected by the analytics event layer (FR-055). It includes a performance waterfall, conversion sankey, feed health pulse, network graph, and SEO health panel. This is a client-side-only page with no SEO value.

### Why Does This Exist?

The analytics dashboard proves the platform's flywheel is measurable. An evaluator can see real-time performance metrics, conversion funnels, and engagement patterns. It demonstrates that the platform doesn't just collect data — it presents actionable insights about how the social feed drives donations and community growth.

### Dependencies

- **FR-055 (Analytics Event Layer):** Must be complete — the dashboard reads from the analytics store/events.

### Current State

- No `/analytics` route exists
- No `AnalyticsDashboard` component
- FR-055 event layer provides the data source (once implemented)

---

## FR-056 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Route | `/analytics` accessible from navigation |
| 5-tier visualization | Performance waterfall, Conversion Sankey, Feed health pulse, Network graph, SEO health |
| Client-side only | No SSR, no SEO indexing needed |
| Reads from analytics | Consumes events from FR-055's analytics store |
| Responsive | Works on desktop and tablet viewports |

---

## Deliverables Checklist

### A. Route + Page Shell

- [ ] Create `app/analytics/page.tsx` with client-side rendering
- [ ] Add `robots: { index: false }` metadata (no SEO value)
- [ ] Import and render `AnalyticsDashboard` component
- [ ] Add navigation link (footer or header dev tools section)

### B. Analytics Dashboard Component

- [ ] Create `components/AnalyticsDashboard.tsx` as `"use client"` component
- [ ] Tab or card layout for the five visualization tiers
- [ ] Time range selector (last 1h, 24h, 7d, all time)
- [ ] Auto-refresh toggle for live updates

### C. Tier 1: Performance Waterfall

- [ ] Display LCP, TTFB, CLS, feed scroll FPS as metric cards
- [ ] Color-coded thresholds: green (good), yellow (needs improvement), red (poor)
- [ ] LCP: green ≤2.5s, yellow ≤4s, red >4s
- [ ] CLS: green ≤0.1, yellow ≤0.25, red >0.25
- [ ] TTFB: green ≤800ms, yellow ≤1800ms, red >1800ms
- [ ] Optional: timeline/waterfall chart of page load sequence

### D. Tier 2: Conversion Sankey/Funnel

- [ ] Funnel visualization: community_view → fundraiser_click → donate_intent → donation_complete
- [ ] Show drop-off rates between each step
- [ ] Total counts and conversion percentages
- [ ] Can be a simple horizontal funnel (no need for full Sankey library)

### E. Tier 3: Feed Health Pulse

- [ ] Feed engagement metrics: views, scroll depth distribution, card clicks, hearts, comments, shares
- [ ] Feed-to-donate conversion rate
- [ ] Engagement rate per content type (donation, milestone, community event)

### F. Tier 4: Network Graph

- [ ] Follow actions, community joins, profile personalizations
- [ ] Return visit frequency
- [ ] Simple counters/trend lines (no need for full force-directed graph)

### G. Tier 5: SEO Health

- [ ] Count of pages with JSON-LD schemas
- [ ] Schema types distribution
- [ ] Pages missing canonical URLs or OG tags
- [ ] Rich result eligibility summary (mirrors SchemaViewer data)

---

## Files to Create

| File | Role |
|------|------|
| `app/analytics/page.tsx` | Analytics dashboard route |
| `components/AnalyticsDashboard.tsx` | Main dashboard component with 5-tier visualization |

## Files to Modify

| File | Action |
|------|--------|
| `components/Footer.tsx` or `components/Header.tsx` | Add link to `/analytics` |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/analytics/events.ts` | Event type definitions to consume |
| `lib/analytics/emitter.ts` | How to read stored events |
| `lib/store/index.ts` | Zustand patterns if analytics uses a store slice |
| `components/SchemaViewer.tsx` | Visual patterns for data display panels |
| `app/ai-traces/page.tsx` | Pattern for dev-tool style pages |

---

## Definition of Done for FR-056

- [ ] `/analytics` route renders the dashboard
- [ ] Performance metrics displayed with color-coded thresholds
- [ ] Conversion funnel shows drop-off rates
- [ ] Feed engagement metrics visible
- [ ] Network growth counters present
- [ ] SEO health summary panel works
- [ ] Page is `noindex` (not crawled)
- [ ] Responsive layout on desktop and tablet
