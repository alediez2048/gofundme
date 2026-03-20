# FR-035 Primer: FundraiserMiniCard Component

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 1). Existing `ProgressBar` component and fundraiser data model are ready.

---

## What Is This Ticket?

FR-035 builds a **FundraiserMiniCard** — a compact, clickable fundraiser preview that shows the title, progress bar, amount raised vs. goal, and a category badge. It links to the full fundraiser page at `/f/[slug]`.

This component is embedded inside feed cards (e.g., DonationCard shows which fundraiser was donated to) and anywhere a compact fundraiser reference is needed.

### Why Does This Exist?

Feed cards reference fundraisers frequently (donations, milestones, community spotlights). A dedicated mini-card provides a consistent, compact preview that encourages click-through without cluttering the feed with full-size cards.

### Dependencies

- **None.** Uses existing fundraiser data from the Zustand store and the existing `ProgressBar` component.

### Current State

- `ProgressBar` component exists at `components/ProgressBar.tsx` — accepts `raised`, `goal`, `height`, `animate` props. Uses `hrt-progress-track`/`hrt-progress-fill` CSS classes with `role="progressbar"` and proper ARIA attributes.
- Fundraiser type is defined in `lib/data/types.ts` with fields: `id`, `slug`, `title`, `raised`, `goal`, `category`, etc.
- Existing skeleton pattern: `FundraiserCardSkeleton` in `components/Skeleton.tsx` uses `hrt-card` class, `Skeleton` base component with `animate-pulse rounded-xl bg-surface-medium`.
- No `components/feed/` directory exists yet.

---

## FR-035 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Display | Title, progress bar, "$X raised of $Y", category badge |
| Progress bar | Reuses existing `ProgressBar` component |
| Clickable | Entire card links to `/f/[slug]` |
| Category badge | Colored badge matching cause category |
| Compact | Fits inline within a feed card body |
| Responsive | Adapts gracefully at all breakpoints |

---

## Deliverables Checklist

### A. FundraiserMiniCard Component

- [ ] Create `components/feed/FundraiserMiniCard.tsx`
- [ ] Props: `fundraiserId` (string) — reads fundraiser data from Zustand store
- [ ] Display fundraiser title (truncated if long, max 2 lines)
- [ ] Reuse `ProgressBar` component with compact height (`h-1.5` or similar)
- [ ] Show "$X raised of $Y goal" with formatted currency
- [ ] Category badge with appropriate color

### B. Link Behavior

- [ ] Wrap in Next.js `Link` to `/f/[slug]`
- [ ] Hover state: subtle elevation or background change
- [ ] Accessible: meaningful link text via `aria-label`

### C. Edge Cases

- [ ] Handle missing fundraiser (fundraiserId not in store) — render nothing or minimal placeholder
- [ ] Handle very long titles — truncate with ellipsis

---

## Files to Create

| File | Role |
|------|------|
| `components/feed/FundraiserMiniCard.tsx` | Compact fundraiser preview card |

## Files to Modify

| File | Action |
|------|--------|
| None initially | FR-036 DonationCard will embed this |

### Files to READ for Context

| File | Why |
|------|-----|
| `components/ProgressBar.tsx` | Reuse this component for the progress display |
| `lib/store/index.ts` | How to read fundraiser data from store |
| `lib/data/index.ts` | Fundraiser type exports |
| `components/Skeleton.tsx` | Existing card and skeleton patterns (`hrt-card` class) |
| `tailwind.config.ts` | Design tokens for colors, spacing, typography |

---

## Definition of Done for FR-035

- [ ] FundraiserMiniCard renders title, progress bar, raised/goal, category badge
- [ ] Clicking navigates to `/f/[slug]`
- [ ] Reuses existing `ProgressBar` component
- [ ] Handles missing fundraiser gracefully
- [ ] Compact enough to embed inline in feed cards
- [ ] DEVLOG updated with FR-035 entry
