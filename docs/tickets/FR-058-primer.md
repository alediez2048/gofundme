# FR-058 Primer: Scroll Position Preservation

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-042 (FeedPage) complete — feed page exists with card-based rendering and tab navigation. `next.config.js` has `experimental.scrollRestoration: true` enabled. App uses Next.js 14 with `next/link` for client-side navigation.

---

## What Is This Ticket?

FR-058 ensures the feed scroll position is maintained when a user navigates to a detail page (fundraiser, profile, community) and returns. It also preserves active tab and loaded card count, and works with browser back button, Next.js Link navigation, and swipe back gestures.

### Why Does This Exist?

Losing scroll position is one of the most frustrating UX patterns on feed-based apps. A user scrolls through 50 cards, clicks one, reads it, goes back — and is dumped at the top of the feed. This breaks the browsing flow and discourages exploration. Proper scroll preservation makes the feed feel like a native app.

### Dependencies

- **FR-042 (FeedPage):** The feed page must exist to preserve its scroll state.

### Current State

- `next.config.js` has `experimental: { scrollRestoration: true }` — this helps with browser back but doesn't cover all cases
- No explicit scroll position storage in the app
- No tab or loaded-card-count preservation
- Feed likely re-renders from initial state on mount

---

## FR-058 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Scroll position | Feed scroll position maintained when navigating away and returning |
| Active tab | Currently selected feed tab (For You / Following / Trending) preserved |
| Loaded cards | Number of loaded/rendered cards preserved (no re-fetch from zero) |
| Browser back | Works with browser back button |
| Link navigation | Works with Next.js `<Link>` component navigation |
| Swipe back | Works with mobile/trackpad swipe-back gesture |

---

## Deliverables Checklist

### A. Scroll Position Storage

- [ ] Use `useRef` to store scroll position before navigation
- [ ] Store in sessionStorage or Zustand (survives component unmount)
- [ ] Restore scroll position on feed page mount/return
- [ ] Key by route so multiple pages don't conflict

### B. Active Tab Preservation

- [ ] Store active feed tab (For You / Following / Trending) in sessionStorage or Zustand
- [ ] Restore active tab on feed remount
- [ ] Don't persist across full page reloads (sessionStorage is appropriate)

### C. Loaded Card Count Preservation

- [ ] Track how many cards have been loaded/rendered (if using infinite scroll or pagination)
- [ ] On return, load the same number of cards before restoring scroll position
- [ ] Avoid visual jump from loading fewer cards than scroll position expects

### D. Navigation Event Handling

- [ ] Hook into Next.js router events or `usePathname` changes to detect navigation away
- [ ] Save state before navigation starts
- [ ] Restore state after navigation back
- [ ] Handle edge cases: direct URL entry (don't restore), fresh tab (don't restore)

### E. Testing Scenarios

- [ ] Click fundraiser card → back button → scroll position restored
- [ ] Click fundraiser card → Next.js Link back → scroll position restored
- [ ] Switch to "Following" tab → click card → back → "Following" tab still active
- [ ] Scroll deep → navigate away → return → same number of cards loaded
- [ ] Swipe back gesture on trackpad → scroll position restored

---

## Files to Create

| File | Role |
|------|------|
| `lib/hooks/useScrollPreservation.ts` (optional) | Reusable scroll position hook |

## Files to Modify

| File | Action |
|------|--------|
| Feed page component | Add scroll position save/restore logic |
| Feed tab component | Persist and restore active tab |

### Files to READ for Context

| File | Why |
|------|-----|
| `next.config.js` | `experimental.scrollRestoration` already enabled |
| Feed page component | Current scroll and tab behavior |
| `lib/store/index.ts` | If using Zustand for scroll state |
| `components/Skeleton.tsx` | Loading state while cards are being restored |

---

## Definition of Done for FR-058

- [ ] Scroll position restored after browser back button
- [ ] Scroll position restored after Next.js Link navigation back
- [ ] Active feed tab preserved across navigation
- [ ] Loaded card count preserved (no visual jump)
- [ ] Works with swipe-back gesture
- [ ] No scroll restoration on direct URL entry or fresh tab
- [ ] No flash of wrong position during restoration
