# FR-043 Primer: FeedHeader (Authenticated Navigation)

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 1). Existing `Header.tsx` handles unauthenticated navigation.

---

## What Is This Ticket?

FR-043 builds the **FeedHeader** — a new navigation bar for authenticated users. It replaces the existing `Header.tsx` when a user is logged in. The layout is: Logo (left) → Search bar (center, inline) → Icon navigation (right: Feed, Communities, Notifications, Me).

The profile dropdown includes links to profile, settings, and sign out. The notifications bell shows a badge with unread count derived from feed events.

### Why Does This Exist?

Authenticated users need a different navigation experience. The public-facing header emphasizes "Search", "Donate", "Fundraise" CTAs. The feed header prioritizes quick navigation between feed, communities, and notifications — the daily-use actions of an engaged user.

### Dependencies

- **No hard dependencies.** Can be built with mock data for notification counts and current user. FR-044 will wire it into the layout.

### Current State

- `Header.tsx` exists at `components/Header.tsx` — a `"use client"` component with desktop nav links, mobile hamburger drawer, profile dropdown, and "About FundRight" dropdown. Uses `useFundRightStore` for user data and `usePathname` for active link highlighting.
- `Header.tsx` has `MOBILE_NAV_LINKS` array and `DEFAULT_PROFILE_USERNAME = "janahan"`.
- The header uses outside-click-dismiss pattern with `useRef` + `useEffect` for dropdowns.
- Layout in `app/layout.tsx` renders `<Header />` unconditionally.

---

## FR-043 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Layout | Logo (left) → Search bar (center) → Icon nav (right) |
| Icon nav | Feed, Communities, Notifications, Me — with labels below icons |
| Profile dropdown | Profile link, Settings link, Sign out |
| Notifications | Bell icon with badge showing unread count |
| Search | Inline search bar (can reuse existing search functionality) |
| Separate | Does NOT modify existing `Header.tsx` — coexists alongside it |
| Mobile | Collapses appropriately (bottom tab bar is FR-045) |

---

## Deliverables Checklist

### A. FeedHeader Component

- [ ] Create `components/feed/FeedHeader.tsx` as `"use client"` component
- [ ] Full-width header bar with subtle bottom border or shadow
- [ ] Left section: FundRight logo (link to `/`)
- [ ] Center section: inline search input (styled, links to `/search` on submit)
- [ ] Right section: icon navigation buttons

### B. Icon Navigation

- [ ] Feed icon (home) — links to `/` (feed)
- [ ] Communities icon — links to `/communities`
- [ ] Notifications bell — shows badge with unread count
- [ ] Me/Profile icon — opens dropdown
- [ ] Active state highlighting based on current route
- [ ] Small text labels below each icon on desktop

### C. Profile Dropdown

- [ ] Triggered by Me icon click
- [ ] Current user avatar + name at top
- [ ] Links: "View Profile" → `/u/[username]`, "Settings" (placeholder), "Sign Out" (placeholder)
- [ ] Outside-click dismiss (reuse pattern from `Header.tsx`)
- [ ] Keyboard: Escape to close

### D. Notifications Badge

- [ ] Count derived from unread feed events (simple threshold or mock)
- [ ] Red/brand badge with number
- [ ] Hide badge when count is 0

### E. Responsive

- [ ] On mobile: hide search bar, show only logo + essential icons
- [ ] Bottom tab bar (FR-045) handles mobile navigation separately

---

## Files to Create

| File | Role |
|------|------|
| `components/feed/FeedHeader.tsx` | Authenticated user navigation header |

## Files to Modify

| File | Action |
|------|--------|
| None | FR-044 will conditionally render FeedHeader vs Header in layout |

### Files to READ for Context

| File | Why |
|------|-----|
| `components/Header.tsx` | Existing header patterns: dropdowns, mobile menu, user access, outside-click |
| `app/layout.tsx` | Where header is rendered |
| `lib/store/index.ts` | User data access |
| `tailwind.config.ts` | Design tokens |

---

## Definition of Done for FR-043

- [ ] FeedHeader renders logo, search bar, icon nav (Feed, Communities, Notifications, Me)
- [ ] Profile dropdown with view profile, settings, sign out
- [ ] Notifications bell with unread count badge
- [ ] Active route highlighting on nav icons
- [ ] Outside-click and Escape dismiss on dropdowns
- [ ] Separate from existing Header.tsx (no modifications to it)
- [ ] DEVLOG updated with FR-043 entry
