# FR-037 Primer: PostComposer Component

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 1). Phase 2 data layer (FR-028–FR-033) provides currentUser concept.

---

## What Is This Ticket?

FR-037 builds the **PostComposer** — a "Start a post" bar at the top of the feed that mimics the LinkedIn/social media post creation prompt. It shows the current user's avatar alongside an input field and action buttons for Video, Photo, Write Story, and Start Fundraiser.

On mobile, the full composer collapses to a floating "+" FAB (Floating Action Button) that expands to show the same options.

### Why Does This Exist?

The PostComposer anchors the top of the feed and signals to the user that this is an interactive social platform, not a static listing. "Start Fundraiser" links to `/create`, giving prominent placement to the primary conversion action. Other action buttons are placeholder for the demo.

### Dependencies

- **None.** Can be built with mock data or the existing default user pattern from `Header.tsx`.

### Current State

- `Header.tsx` demonstrates how to access the current user: looks up `DEFAULT_PROFILE_USERNAME = "janahan"` in the users map from Zustand.
- No `components/feed/` directory exists yet (earlier tickets may create it).
- The `/create` route exists for fundraiser creation.

---

## FR-037 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Layout | Current user avatar + "Start a post" input field + action row |
| Actions | Video, Photo, Write Story, Start Fundraiser buttons with icons |
| Start Fundraiser | Links to `/create` route |
| Other actions | Placeholder (toast or no-op for demo) |
| Mobile | Collapses to floating "+" FAB |
| FAB behavior | Tap opens action menu with same options |
| Accessible | Buttons labeled, FAB has `aria-label` |

---

## Deliverables Checklist

### A. Desktop PostComposer

- [ ] Create `components/feed/PostComposer.tsx` as `"use client"` component
- [ ] Current user avatar (read from store, fallback to default)
- [ ] "Start a post" input field (visual only — clicking could open a modal or be no-op)
- [ ] Action button row: Video (camera icon), Photo (image icon), Write Story (pencil icon), Start Fundraiser (heart/plus icon)
- [ ] "Start Fundraiser" navigates to `/create`
- [ ] Other buttons show placeholder behavior (toast or subtle feedback)

### B. Mobile FAB

- [ ] Below `md:` breakpoint, hide the full composer
- [ ] Show floating "+" button (bottom-right, above any bottom nav)
- [ ] Tap opens a small action menu with the same 4 options
- [ ] Menu dismisses on outside click or Escape
- [ ] `aria-label="Create new post"` on FAB

### C. Styling

- [ ] Card-like container (`hrt-card` or similar) with subtle shadow
- [ ] Consistent with feed visual language
- [ ] Avatar uses existing circular avatar patterns

---

## Files to Create

| File | Role |
|------|------|
| `components/feed/PostComposer.tsx` | Post creation prompt bar + mobile FAB |

## Files to Modify

| File | Action |
|------|--------|
| None | FR-039 (FeedColumn) will integrate this at the top of the feed |

### Files to READ for Context

| File | Why |
|------|-----|
| `components/Header.tsx` | Pattern for accessing current user from Zustand store |
| `lib/store/index.ts` | Store structure, user data access |
| `tailwind.config.ts` | Design tokens for styling |
| `app/create/page.tsx` | Verify the create route exists |

---

## Definition of Done for FR-037

- [ ] PostComposer renders avatar + input + action buttons on desktop
- [ ] "Start Fundraiser" navigates to `/create`
- [ ] Other actions have placeholder behavior
- [ ] Mobile: collapses to floating "+" FAB with action menu
- [ ] FAB menu dismisses on outside click / Escape
- [ ] Accessible labels on all interactive elements
- [ ] DEVLOG updated with FR-037 entry
