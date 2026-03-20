# FR-038 Primer: FeedTabs Component

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 1). Phase 2 data layer (FR-028–FR-033) provides feed data sources.

---

## What Is This Ticket?

FR-038 builds the **FeedTabs** — a tab bar with three options: "For You" (default), "Following", and "Trending". It uses proper ARIA tab semantics (`role="tablist"`, `role="tab"`, `role="tabpanel"`) and controls which data source the FeedColumn (FR-039) uses to fetch events.

### Why Does This Exist?

Different users want different feed experiences. "For You" shows algorithmically curated content, "Following" shows activity from followed users/causes, and "Trending" shows high-momentum items. The tabs let users switch without a page navigation.

### Dependencies

- **None.** Can be built standalone with callback props. FR-039 (FeedColumn) will consume it.

### Current State

- No tab component exists in the codebase.
- The project uses Tailwind for all styling with the design tokens in `tailwind.config.ts`.
- Transition utilities: `transition-hrt` (500ms cubic-bezier), `animate-fadeIn` (150ms ease-out).

---

## FR-038 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Tabs | "For You" (default), "Following", "Trending" |
| ARIA | `role="tablist"` on container, `role="tab"` on each tab, `role="tabpanel"` on content area |
| Keyboard | Arrow keys to navigate between tabs, Enter/Space to select |
| Active indicator | Visual underline or highlight with smooth transition |
| State control | Reports active tab to parent via callback |
| Responsive | Works at all breakpoints, tabs may scroll horizontally on very small screens |

---

## Deliverables Checklist

### A. FeedTabs Component

- [ ] Create `components/feed/FeedTabs.tsx` as `"use client"` component
- [ ] Props: `activeTab`, `onTabChange` callback
- [ ] Tab type: `"for-you" | "following" | "trending"`
- [ ] Three tab buttons with text labels
- [ ] Active tab indicator (underline or background) with CSS transition
- [ ] `role="tablist"` on container, `role="tab"` on each button
- [ ] `aria-selected` on active tab
- [ ] `aria-controls` linking to tabpanel ID

### B. Keyboard Navigation

- [ ] Left/Right arrow keys move between tabs
- [ ] Enter/Space activates the focused tab
- [ ] `tabIndex` management: active tab is `0`, others are `-1`
- [ ] Focus follows selection (roving tabindex pattern)

### C. Styling

- [ ] Clean, minimal tab bar matching feed visual language
- [ ] Active indicator: smooth transition (use `transition-hrt` or similar)
- [ ] Hover state on inactive tabs
- [ ] Consistent typography using `text-body-sm` or `text-body-md`

---

## Files to Create

| File | Role |
|------|------|
| `components/feed/FeedTabs.tsx` | Tab bar for feed filtering |

## Files to Modify

| File | Action |
|------|--------|
| None | FR-039 (FeedColumn) will integrate this |

### Files to READ for Context

| File | Why |
|------|-----|
| `tailwind.config.ts` | Transition utilities, design tokens |
| `components/Header.tsx` | Reference for interactive UI patterns in the project |

---

## Definition of Done for FR-038

- [ ] FeedTabs renders three tabs: For You, Following, Trending
- [ ] Proper ARIA: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`
- [ ] Keyboard navigation with roving tabindex
- [ ] Active tab indicator with smooth transition
- [ ] Reports active tab via `onTabChange` callback
- [ ] DEVLOG updated with FR-038 entry
