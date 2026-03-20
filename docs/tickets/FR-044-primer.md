# FR-044 Primer: Layout + Homepage Auth Split

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 1). FR-042 (FeedPage) and FR-043 (FeedHeader) must be complete.

---

## What Is This Ticket?

FR-044 wires the authentication split into the app shell. When a user is "logged in" (currentUser exists in store), the homepage shows the FeedPage instead of HomePageContent, and the layout renders FeedHeader instead of Header. It also removes the `max-w-content` constraint from the layout wrapper so the feed page can manage its own width, and adds `max-w-content` back to individual non-feed page components that need it.

### Why Does This Exist?

The platform has two distinct experiences: a public marketing site (browse, donate, learn) and an authenticated social feed. This ticket is the integration point that switches between them based on auth state, without breaking any existing pages.

### Dependencies

- **FR-042 (FeedPage):** The authenticated homepage view.
- **FR-043 (FeedHeader):** The authenticated navigation header.

### Current State

- `app/page.tsx` renders `<HomePageContent />` unconditionally (also includes `<JsonLd>` for SEO schema).
- `app/layout.tsx` renders `<Header />` and wraps `{children}` in `<main className="mx-auto max-w-content px-4 py-6 sm:py-8">`.
- `max-w-content` is `75rem` (defined in `tailwind.config.ts`).
- The layout also renders `<Footer />`, `<SchemaViewerToggle />`, and `<AITracesBadge />`.
- Existing page components (`BrowsePageContent`, `SearchPageContent`, `CommunityPageContent`, `FundraiserPageContent`, `ProfilePageContent`) currently rely on the layout's `max-w-content` wrapper for their width constraint.

---

## FR-044 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Homepage split | `currentUser ? <FeedPage /> : <HomePageContent />` |
| Layout header split | `currentUser ? <FeedHeader /> : <Header />` |
| Width management | Remove `max-w-content` from layout `<main>`, let pages manage own width |
| Non-feed pages | Add `max-w-content` wrapper back to existing page components |
| Suspense | Wrap auth check in Suspense boundary to prevent hydration flash |
| No breakage | All existing pages continue to work identically |

---

## Deliverables Checklist

### A. Homepage Auth Split

- [ ] Modify `app/page.tsx`: conditional render based on `currentUser` state
- [ ] Authenticated: render `<FeedPage />`
- [ ] Unauthenticated: render existing `<HomePageContent />` + `<JsonLd />`
- [ ] Wrap in Suspense with appropriate fallback

### B. Layout Header Split

- [ ] Modify `app/layout.tsx`: conditional header rendering
- [ ] Authenticated: `<FeedHeader />`
- [ ] Unauthenticated: `<Header />`
- [ ] Need a client component wrapper since `layout.tsx` is a server component
- [ ] Create `components/AuthLayoutShell.tsx` or similar client wrapper

### C. Width Management

- [ ] Remove `max-w-content` from `<main>` in `app/layout.tsx`
- [ ] Keep `px-4 py-6 sm:py-8` or adjust as needed
- [ ] Add `max-w-content mx-auto` wrapper to existing page content components:
  - `components/HomePageContent.tsx`
  - `components/BrowsePageContent.tsx`
  - `components/SearchPageContent.tsx`
  - `components/CommunityPageContent.tsx`
  - `components/FundraiserPageContent.tsx`
  - `components/ProfilePageContent.tsx`
- [ ] FeedPage manages its own width (already handled in FR-042)

### D. Footer Handling

- [ ] Consider: hide Footer on feed page? Or keep it?
- [ ] If hiding: conditional render based on auth state
- [ ] If keeping: ensure it works with full-width feed layout

### E. Hydration Safety

- [ ] Suspense boundary around auth-dependent rendering
- [ ] Prevent flash of wrong content during hydration
- [ ] Consider `useEffect`-based client-side check to avoid SSR mismatch

---

## Files to Create

| File | Role |
|------|------|
| `components/AuthLayoutShell.tsx` (or similar) | Client component wrapping auth-conditional header/footer |

## Files to Modify

| File | Action |
|------|--------|
| `app/page.tsx` | Conditional homepage: FeedPage vs HomePageContent |
| `app/layout.tsx` | Remove `max-w-content` from main, conditional header |
| `components/HomePageContent.tsx` | Add `max-w-content` wrapper |
| `components/BrowsePageContent.tsx` | Add `max-w-content` wrapper |
| `components/SearchPageContent.tsx` | Add `max-w-content` wrapper |
| `components/CommunityPageContent.tsx` | Add `max-w-content` wrapper |
| `components/FundraiserPageContent.tsx` | Add `max-w-content` wrapper |
| `components/ProfilePageContent.tsx` | Add `max-w-content` wrapper |

### Files to READ for Context

| File | Why |
|------|-----|
| `app/layout.tsx` | Current layout structure — this is the primary file being modified |
| `app/page.tsx` | Current homepage rendering |
| `components/feed/FeedPage.tsx` | FR-042 output — authenticated homepage |
| `components/feed/FeedHeader.tsx` | FR-043 output — authenticated header |
| `components/HomePageContent.tsx` | Verify structure before adding wrapper |
| `components/Header.tsx` | Existing header to understand what's being conditionally swapped |

---

## Definition of Done for FR-044

- [ ] Authenticated users see FeedPage on homepage, FeedHeader in nav
- [ ] Unauthenticated users see HomePageContent on homepage, Header in nav
- [ ] No `max-w-content` on layout main — each page manages its own width
- [ ] All existing non-feed pages still render correctly with proper width
- [ ] No hydration flash between auth states
- [ ] Suspense boundaries in place
- [ ] All existing routes continue to work
- [ ] DEVLOG updated with FR-044 entry
