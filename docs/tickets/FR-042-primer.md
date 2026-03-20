# FR-042 Primer: FeedPage (Three-Column Layout)

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 1). FR-039 (FeedColumn), FR-040 (LeftSidebar), FR-041 (RightSidebar) must be complete.

---

## What Is This Ticket?

FR-042 builds the **FeedPage** — the three-column layout container that assembles LeftSidebar + FeedColumn + RightSidebar into a responsive CSS grid. This is the main authenticated homepage view.

The grid is responsive: three columns on large screens, two columns on medium, and single column on small screens.

### Why Does This Exist?

The three-column layout is the standard social feed pattern. FeedPage is the composition layer that brings together the independently built column components into a cohesive page experience with proper responsive behavior.

### Dependencies

- **FR-039 (FeedColumn):** Center column with feed content.
- **FR-040 (LeftSidebar):** Left column identity card.
- **FR-041 (RightSidebar):** Right column discovery panel.

### Current State

- Current layout in `app/layout.tsx` uses `max-w-content` (75rem) wrapper with `px-4 py-6` padding on `<main>`.
- The feed page will need full-width control — FR-044 will handle removing the `max-w-content` constraint from the layout wrapper.
- No feed page components exist yet. The three column components (FR-039, FR-040, FR-041) will be ready.

---

## FR-042 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Grid layout | `lg:grid-cols-[240px_1fr_300px]`, `md:grid-cols-[1fr_300px]`, `grid-cols-1` |
| Composition | LeftSidebar + FeedColumn + RightSidebar |
| Responsive | 3-col → 2-col → 1-col |
| Page state | Manages overall feed page state if needed |
| Gap | Consistent gap between columns |

---

## Deliverables Checklist

### A. FeedPage Layout Component

- [ ] Create `components/feed/FeedPage.tsx` as `"use client"` component
- [ ] CSS Grid container with responsive columns:
  - `lg:grid-cols-[240px_1fr_300px]` — full three-column
  - `md:grid-cols-[1fr_300px]` — center + right (left sidebar hidden)
  - Default `grid-cols-1` — single column (mobile)
- [ ] Consistent `gap-6` between columns
- [ ] `max-w-[1200px] mx-auto` or similar max-width for the grid

### B. Column Assembly

- [ ] Render `<LeftSidebar />` in first column
- [ ] Render `<FeedColumn />` in center column
- [ ] Render `<RightSidebar />` in right column
- [ ] Proper column ordering for accessibility (content first in DOM if needed)

### C. Page-Level State (if needed)

- [ ] Any shared state between columns (e.g., selected community filter)
- [ ] Context provider if columns need to communicate

---

## Files to Create

| File | Role |
|------|------|
| `components/feed/FeedPage.tsx` | Three-column feed layout container |

## Files to Modify

| File | Action |
|------|--------|
| None | FR-044 will integrate FeedPage into `app/page.tsx` |

### Files to READ for Context

| File | Why |
|------|-----|
| `components/feed/FeedColumn.tsx` | FR-039 output — center column |
| `components/feed/LeftSidebar.tsx` | FR-040 output — left column |
| `components/feed/RightSidebar.tsx` | FR-041 output — right column |
| `app/layout.tsx` | Current layout structure to understand constraints |
| `tailwind.config.ts` | Grid, spacing, max-width tokens |

---

## Definition of Done for FR-042

- [ ] FeedPage renders three-column grid on large screens
- [ ] Responsive: 3-col → 2-col → 1-col based on breakpoint
- [ ] LeftSidebar, FeedColumn, RightSidebar correctly placed
- [ ] Consistent gap and max-width
- [ ] Page renders without layout shifts
- [ ] DEVLOG updated with FR-042 entry
