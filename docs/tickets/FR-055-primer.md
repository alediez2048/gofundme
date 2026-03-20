# FR-055 Primer: Analytics Event Layer

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete. No analytics infrastructure exists yet. The app uses Zustand for state management (`lib/store/index.ts`). Feed page exists from FR-042.

---

## What Is This Ticket?

FR-055 builds the analytics event layer — a typed, non-blocking event dispatch system using the Beacon API. It defines four tiers of events (Performance, Conversion, Feed Engagement, Network Growth) and includes session-level attribution tagging. This is the data collection foundation that FR-056 (Analytics Dashboard) will visualize.

### Why Does This Exist?

A fundraising platform needs to measure its flywheel: do users discover fundraisers, engage with them, donate, and come back? Without instrumented events at each stage, there's no way to identify drop-off points or prove the social feed drives conversions. The tiered structure ensures the most critical metrics (performance, conversion) are always captured while engagement and growth metrics provide deeper insight.

### Dependencies

- **FR-042 (FeedPage):** The feed page must exist to instrument feed engagement events.

### Current State

- No `lib/analytics/` directory
- No event tracking of any kind
- Zustand store handles state but has no analytics middleware
- No Performance Observer usage

---

## FR-055 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Event emitter | Beacon API dispatcher in `lib/analytics/emitter.ts` — non-blocking, fire-and-forget |
| Typed events | All events defined with TypeScript types in `lib/analytics/events.ts` |
| Tier 1: Performance | LCP, TTFB, CLS, feed scroll FPS via Performance Observer |
| Tier 2: Conversion | `community_view`, `fundraiser_click`, `donate_intent`, `donation_complete` |
| Tier 3: Feed engagement | `feed_view`, `scroll_depth`, `card_click`, `heart`, `comment`, `share`, `feed_to_donate` |
| Tier 4: Network growth | `follow_action`, `community_join`, `profile_personalization`, `return_visit` |
| Attribution | Session-level source tagging at page transitions in `lib/analytics/attribution.ts` |

---

## Deliverables Checklist

### A. Event Emitter (`lib/analytics/emitter.ts`)

- [ ] `emit(event: AnalyticsEvent): void` — fire-and-forget via `navigator.sendBeacon()` or fetch keepalive
- [ ] Queue events in memory (array buffer) and flush periodically or on `visibilitychange`
- [ ] Fallback to `fetch` with `keepalive: true` if Beacon API unavailable
- [ ] Each event includes: `eventName`, `timestamp`, `sessionId`, `userId` (if available), `pageUrl`, `tier`
- [ ] Export as singleton for easy import across components

### B. Typed Event Definitions (`lib/analytics/events.ts`)

- [ ] Base `AnalyticsEvent` type with common fields
- [ ] Tier 1 — Performance events:
  - `perf_lcp`: { value: number }
  - `perf_ttfb`: { value: number }
  - `perf_cls`: { value: number }
  - `perf_feed_fps`: { value: number }
- [ ] Tier 2 — Conversion events:
  - `community_view`: { communityId: string }
  - `fundraiser_click`: { fundraiserId: string, source: string }
  - `donate_intent`: { fundraiserId: string }
  - `donation_complete`: { fundraiserId: string, amount: number }
- [ ] Tier 3 — Feed engagement events:
  - `feed_view`: { tab: string }
  - `scroll_depth`: { percent: number }
  - `card_click`: { eventId: string, cardType: string }
  - `heart`: { eventId: string }
  - `comment`: { eventId: string }
  - `share`: { eventId: string }
  - `feed_to_donate`: { fundraiserId: string }
- [ ] Tier 4 — Network growth events:
  - `follow_action`: { targetUserId: string }
  - `community_join`: { communityId: string }
  - `profile_personalization`: { action: string }
  - `return_visit`: { daysSinceLast: number }

### C. Performance Observer (`lib/analytics/performance.ts`)

- [ ] Set up `PerformanceObserver` for `largest-contentful-paint`, `navigation` (TTFB), `layout-shift` (CLS)
- [ ] Auto-emit Tier 1 events when metrics are captured
- [ ] Guard with `typeof window !== 'undefined'` for SSR safety

### D. Attribution (`lib/analytics/attribution.ts`)

- [ ] Generate or retrieve `sessionId` from sessionStorage
- [ ] Tag session source from URL params (`utm_source`, `utm_medium`, `ref`) on first page load
- [ ] Attach attribution to all emitted events
- [ ] Track page transitions (Next.js `usePathname` changes)

### E. Analytics Store (optional)

- [ ] Consider a lightweight Zustand slice or standalone store for local event aggregation
- [ ] Enables FR-056 (Dashboard) to read events client-side without a backend

---

## Files to Create

| File | Role |
|------|------|
| `lib/analytics/emitter.ts` | Beacon API event dispatcher |
| `lib/analytics/events.ts` | Typed event definitions for all tiers |
| `lib/analytics/performance.ts` | Performance Observer setup + auto-emit |
| `lib/analytics/attribution.ts` | Session-level source tagging |
| `lib/analytics/index.ts` | Public API barrel export |

## Files to Modify

| File | Action |
|------|--------|
| `lib/store/index.ts` | Optionally add analytics slice for local event storage |
| Components that emit events | Wire up `emit()` calls at interaction points (can be done incrementally) |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/store/index.ts` | Current Zustand store pattern for adding slices |
| `lib/data/index.ts` | Entity types for event payloads |
| `components/DonationModal.tsx` | Where `donation_complete` event would fire |
| `components/FundraiserPageContent.tsx` | Where `fundraiser_click` and `donate_intent` fire |

---

## Definition of Done for FR-055

- [ ] `lib/analytics/` directory created with emitter, events, performance, attribution modules
- [ ] All four tiers of events are typed and exportable
- [ ] Beacon API emitter works non-blocking with flush-on-hide
- [ ] Performance Observer captures LCP, TTFB, CLS automatically
- [ ] Session attribution tags source on first load
- [ ] Events can be stored locally for FR-056 dashboard consumption
- [ ] No runtime errors in SSR (all browser APIs guarded)
