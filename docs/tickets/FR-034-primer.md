# FR-034 Primer: EngagementBar Component

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 1). Phase 2 data layer (FR-028–FR-033) assumed complete. Zustand store has engagement actions from FR-030.

---

## What Is This Ticket?

FR-034 builds the **EngagementBar** — a reusable row of social interaction controls (heart, comment, share, bookmark) that appears on every feed card and can be reused in existing page activity sections. Each action uses optimistic UI updates via the Zustand engagement actions defined in FR-030.

The bar handles heart toggling with `aria-pressed`, inline comment expansion, a share menu (copy link + external share), and bookmark toggling. All controls include accessible labels with counts (e.g., "24 hearts, press to heart") and are fully keyboard navigable.

### Why Does This Exist?

Social engagement is the core loop of the feed experience. Every card needs consistent, accessible interaction controls. Building this as a standalone component first means FR-036 (FeedCard) can compose it into the footer of every card variant without duplication.

### Dependencies

- **FR-030 (Feed Engagement Store):** Provides Zustand actions for `toggleHeart`, `addComment`, `toggleBookmark`, and engagement counts per entity.

### Current State

- No `components/feed/` directory exists yet.
- Zustand store (`lib/store/index.ts`) has normalized entity maps for users, fundraisers, communities, donations, and traces. FR-030 should add engagement slices.
- Existing components like `DonationModal.tsx` demonstrate the project's patterns for client components: `"use client"`, Zustand selectors via `useFundRightStore`, ref-based focus management.
- Tailwind config defines the design tokens: `brand-*` colors, `rounded-pill` for circular elements, `shadow-soft`/`shadow-medium` for elevation.

---

## FR-034 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Heart toggle | `aria-pressed` button, optimistic count update, visual fill state |
| Comment expand | Inline expansion showing comment input + recent comments |
| Share menu | Dropdown with "Copy link" + external share options |
| Bookmark toggle | `aria-pressed` button, optimistic state |
| Accessibility | `aria-labels` with counts ("24 hearts, press to heart"), keyboard navigable |
| Optimistic UI | All mutations update immediately via Zustand, no loading spinners |
| Reusable | Works in feed cards AND existing page activity sections |

---

## Deliverables Checklist

### A. EngagementBar Component

- [ ] Create `components/feed/EngagementBar.tsx` as `"use client"` component
- [ ] Props: `entityId`, `entityType`, optional `compact` mode for non-feed usage
- [ ] Read engagement counts from Zustand store (hearts, comments, bookmarks)
- [ ] Heart button: filled/unfilled icon, `aria-pressed`, count, optimistic toggle
- [ ] Comment button: count, toggles inline comment section
- [ ] Share button: opens dropdown menu with "Copy link" and share options
- [ ] Bookmark button: filled/unfilled icon, `aria-pressed`, optimistic toggle

### B. Inline Comment Section

- [ ] Expandable section below the bar when comment button is clicked
- [ ] Text input for new comment with submit button
- [ ] Show 2-3 most recent comments with author avatar + name + text
- [ ] "View all comments" link if more exist

### C. Share Menu

- [ ] Dropdown/popover triggered by share button
- [ ] "Copy link" option with clipboard API + toast confirmation
- [ ] External share options (Twitter/X, Facebook — can be `window.open` with share URLs)
- [ ] Close on outside click or Escape key

### D. Accessibility

- [ ] All buttons have descriptive `aria-label` including count
- [ ] Heart and bookmark use `aria-pressed`
- [ ] Share menu is keyboard navigable (arrow keys, Enter, Escape)
- [ ] Focus management: share menu returns focus to trigger on close

---

## Files to Create

| File | Role |
|------|------|
| `components/feed/EngagementBar.tsx` | Main engagement bar component with heart, comment, share, bookmark |

## Files to Modify

| File | Action |
|------|--------|
| None initially | FR-036 will integrate this into FeedCard footer |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/store/index.ts` | Understand store structure and how to add selectors for engagement data |
| `components/DonationModal.tsx` | Pattern for client components, ref management, focus trapping |
| `components/Header.tsx` | Pattern for dropdown menus with outside-click dismiss |
| `tailwind.config.ts` | Design tokens: colors, spacing, border-radius |

---

## Definition of Done for FR-034

- [ ] EngagementBar renders heart, comment, share, bookmark buttons with counts
- [ ] Heart and bookmark toggle with `aria-pressed` and optimistic state updates
- [ ] Comment button expands inline comment section
- [ ] Share button opens accessible dropdown with copy link + external share
- [ ] All buttons have `aria-label` with counts
- [ ] Fully keyboard navigable
- [ ] Component is reusable across feed cards and existing page sections
- [ ] DEVLOG updated with FR-034 entry
