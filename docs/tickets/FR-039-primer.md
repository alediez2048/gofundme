# FR-039 Primer: FeedColumn (Center Column with Infinite Scroll)

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 1). FR-034 (EngagementBar), FR-035 (FundraiserMiniCard), FR-036 (FeedCard variants), FR-037 (PostComposer), FR-038 (FeedTabs) must be complete.

---

## What Is This Ticket?

FR-039 builds the **FeedColumn** — the center column of the three-column feed layout. It orchestrates the PostComposer (FR-037) at the top, FeedTabs (FR-038) below it, and an infinite-scrolling list of FeedCards (FR-036).

Infinite scroll uses `IntersectionObserver` on a sentinel element to trigger loading the next batch (10 cards per batch). Each batch is wrapped in a Suspense boundary with `FeedCardSkeleton` fallback. A "Back to top" floating button appears after scrolling past 10 cards.

### Why Does This Exist?

The center column is the primary content area of the feed. Infinite scroll keeps users engaged without pagination friction. Suspense boundaries per batch ensure smooth loading without blocking the entire feed.

### Dependencies

- **FR-036 (FeedCard + Variants):** The cards rendered in the list.
- **FR-037 (PostComposer):** Placed at the top of the column.
- **FR-038 (FeedTabs):** Tab bar controlling which feed source to display.

### Current State

- FR-036 should provide `FeedCard` and `FeedCardSkeleton`.
- FR-037 provides `PostComposer`.
- FR-038 provides `FeedTabs`.
- The Zustand store (FR-030–FR-032) should provide a `getFeedForUser` selector that returns feed events filtered by tab type.
- No infinite scroll implementation exists in the codebase yet.

---

## FR-039 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Composition | PostComposer → FeedTabs → Card list (top to bottom) |
| Infinite scroll | IntersectionObserver on sentinel triggers next batch |
| Batch size | 10 cards per batch |
| Loading states | Suspense boundary with FeedCardSkeleton fallback per batch |
| Back to top | Floating button appears after scrolling past 10 cards |
| Tab switching | Resets feed offset and reloads from new data source |
| Feed state | `feedOffset` + `feedBatchSize` in local component state |
| Data source | Reads from `getFeedForUser` store selector based on active tab |

---

## Deliverables Checklist

### A. FeedColumn Component

- [ ] Create `components/feed/FeedColumn.tsx` as `"use client"` component
- [ ] Render `PostComposer` at the top
- [ ] Render `FeedTabs` below PostComposer
- [ ] Render card list below tabs
- [ ] Local state: `feedOffset` (number), active tab

### B. Infinite Scroll

- [ ] Sentinel `<div>` at bottom of the card list
- [ ] `IntersectionObserver` watches sentinel, triggers loading next 10 cards
- [ ] Append new cards to existing list (don't replace)
- [ ] Stop loading when no more events available
- [ ] Cleanup observer on unmount

### C. Suspense & Loading

- [ ] Each batch of cards wrapped in Suspense boundary
- [ ] Fallback: 2-3 `FeedCardSkeleton` components
- [ ] Initial load shows skeletons before first batch arrives

### D. Back to Top Button

- [ ] Floating button (bottom-right area, above any FAB)
- [ ] Appears when user scrolls past 10 cards
- [ ] Smooth scroll to top on click
- [ ] `aria-label="Back to top"`
- [ ] Fade in/out transition

### E. Tab Integration

- [ ] Tab change resets `feedOffset` to 0
- [ ] Clears current card list
- [ ] Loads fresh batch from new data source
- [ ] Smooth transition between tab content

---

## Files to Create

| File | Role |
|------|------|
| `components/feed/FeedColumn.tsx` | Center column orchestrator with infinite scroll |

## Files to Modify

| File | Action |
|------|--------|
| `components/Skeleton.tsx` | Ensure `FeedCardSkeleton` exists (may be added in FR-036) |

### Files to READ for Context

| File | Why |
|------|-----|
| `components/feed/FeedCard.tsx` | FR-036 output — cards to render in the list |
| `components/feed/PostComposer.tsx` | FR-037 output — top of column |
| `components/feed/FeedTabs.tsx` | FR-038 output — tab bar |
| `lib/store/index.ts` | Store selectors for feed data |
| `components/Skeleton.tsx` | Skeleton patterns for loading states |

---

## Definition of Done for FR-039

- [ ] FeedColumn renders PostComposer → FeedTabs → card list
- [ ] Infinite scroll loads 10 cards per batch via IntersectionObserver
- [ ] Suspense boundaries with skeleton fallbacks per batch
- [ ] "Back to top" button appears after scrolling past 10 cards
- [ ] Tab switching resets and reloads feed
- [ ] Clean observer lifecycle (setup/teardown)
- [ ] DEVLOG updated with FR-039 entry
