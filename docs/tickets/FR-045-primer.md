# FR-045 Primer: Mobile Bottom Tab Bar

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 1). FR-044 (Layout auth split) must be complete.

---

## What Is This Ticket?

FR-045 builds the **BottomTabBar** — a mobile-only bottom navigation bar for authenticated users. It provides five tabs: Feed (home icon), Communities, +Create (center FAB), Explore, and Profile.

It only renders below the `md:` breakpoint and only for authenticated users.

### Why Does This Exist?

Mobile users need thumb-friendly navigation. The header icons are too small and far away on mobile. A bottom tab bar is the standard mobile pattern for primary navigation, and the center "+Create" FAB gives prominent placement to the fundraiser creation action.

### Dependencies

- **FR-044 (Layout auth split):** The BottomTabBar is added to `app/layout.tsx` conditionally for authenticated users.

### Current State

- `app/layout.tsx` currently renders `<Header />`, `<main>`, `<Footer />`, `<SchemaViewerToggle />`, `<AITracesBadge />`.
- After FR-044, layout will have an auth-conditional shell (likely `AuthLayoutShell.tsx` or similar client component).
- `Header.tsx` has a mobile hamburger drawer with nav links — the BottomTabBar replaces this pattern for authenticated mobile users.
- Routes exist: `/` (feed/home), `/communities`, `/create`, `/browse` (explore), `/u/[username]` (profile).

---

## FR-045 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Tabs | Feed (home), Communities, +Create (center FAB), Explore, Profile |
| Visibility | Only renders below `md:` breakpoint |
| Auth-only | Only shown for authenticated users |
| Active indicator | Highlights current tab based on route |
| +Create | Center FAB style, navigates to `/create` |
| Accessible | `aria-label` on each tab, `role="navigation"` |

---

## Deliverables Checklist

### A. BottomTabBar Component

- [ ] Create `components/feed/BottomTabBar.tsx` as `"use client"` component
- [ ] Fixed to bottom of viewport: `fixed bottom-0 left-0 right-0`
- [ ] `md:hidden` — only visible on mobile
- [ ] Background with top border or shadow for separation from content
- [ ] Safe area padding for notched devices: `pb-safe` or `env(safe-area-inset-bottom)`

### B. Tab Items

- [ ] Feed tab: home icon, "Feed" label, links to `/`
- [ ] Communities tab: people/group icon, "Communities" label, links to `/communities`
- [ ] +Create tab: center FAB (larger, elevated, brand color), links to `/create`
- [ ] Explore tab: compass/search icon, "Explore" label, links to `/browse`
- [ ] Profile tab: user icon, "Profile" label, links to `/u/[username]`

### C. Active State

- [ ] Use `usePathname()` to determine active tab
- [ ] Active tab: brand color icon + label
- [ ] Inactive tabs: muted/secondary color
- [ ] +Create is always brand-colored (it's a CTA, not a navigation state)

### D. Layout Integration

- [ ] Add `<BottomTabBar />` to layout (inside auth-conditional shell)
- [ ] Add bottom padding to main content area on mobile to prevent content being hidden behind tab bar
- [ ] Ensure bottom tab bar doesn't overlap with other floating elements (FAB, back-to-top)

### E. Accessibility

- [ ] `role="navigation"` with `aria-label="Main navigation"`
- [ ] Each tab has `aria-label` with descriptive text
- [ ] `aria-current="page"` on active tab
- [ ] Sufficient touch target size (min 44x44px)

---

## Files to Create

| File | Role |
|------|------|
| `components/feed/BottomTabBar.tsx` | Mobile bottom navigation bar |

## Files to Modify

| File | Action |
|------|--------|
| `app/layout.tsx` | Include BottomTabBar in auth-conditional rendering |
| `components/AuthLayoutShell.tsx` (or equivalent from FR-044) | Add BottomTabBar to authenticated layout |

### Files to READ for Context

| File | Why |
|------|-----|
| `app/layout.tsx` | Where BottomTabBar will be added |
| `components/Header.tsx` | Existing mobile nav patterns, route paths |
| `components/feed/FeedHeader.tsx` | FR-043 output — coordinate with header for consistent nav |
| `tailwind.config.ts` | Design tokens, breakpoints |

---

## Definition of Done for FR-045

- [ ] BottomTabBar renders 5 tabs: Feed, Communities, +Create, Explore, Profile
- [ ] Only visible below `md:` breakpoint
- [ ] Only shown for authenticated users
- [ ] Active tab highlighted based on current route
- [ ] +Create is center FAB linking to `/create`
- [ ] Content area has bottom padding to avoid overlap
- [ ] Accessible: roles, labels, sufficient touch targets
- [ ] DEVLOG updated with FR-045 entry
