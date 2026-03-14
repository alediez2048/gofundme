# FR-013 Primer: Responsive Layout

**For:** New Cursor Agent session  
**Project:** FundRight — AI-Powered Fundraising Platform  
**Date:** Mar 10, 2026  
**Previous work:** FR-001 through FR-012 complete. Category Browse and Search done. Cause Intelligence (FR-023) delivered early. See `docs/development/DEVLOG.md`.

---

## What Is This Ticket?

FR-013 is the **responsive layout pass** across all FundRight pages. Every route must look intentional and polished from **375px to 1440px**, with correct breakpoint behavior, no horizontal scroll, and tap targets ≥ 44×44px on mobile. This ticket closes out Phase 2 (Full Clone).

### Why Does This Exist?

The PRD requires the platform to work on any device so evaluators and donors trust the product regardless of how they access it. Layouts are already built with Tailwind; this ticket enforces consistent breakpoints, sticky donation widget on desktop, and mobile-first grids so the app feels production-ready.

### Current State

| Component | Status |
|-----------|--------|
| `app/page.tsx` (Homepage) | Exists — needs breakpoint audit (single-column → multi-column on `lg:`) |
| `components/FundraiserPageContent.tsx` | Exists — needs two-column layout on `lg:` + sticky donation widget |
| `components/CommunityPageContent.tsx` | Exists — needs 2-col `md:`, 3-col `lg:` grid |
| `components/ProfilePageContent.tsx` | Exists — needs sidebar + main on `lg:` |
| `components/BrowsePageContent.tsx` | Exists — needs responsive grid `md:`+ |
| `app/create/page.tsx` | Exists — needs max-width 640px, centered |
| `components/Header.tsx` | Hamburger on mobile, horizontal nav on `md:` — already present |
| Donation widget (in FundraiserPageContent) | Not yet sticky on desktop |

---

## What Was Already Done

- All pages exist and render; Tailwind is the only styling system
- Header already has hamburger + slide-out drawer on mobile and horizontal nav on `md:` (FR-009)
- Root layout has skip-nav, `<main>`, semantic landmarks
- Breakpoints in use elsewhere: `sm:`, `md:`, `lg:` — FR-013 standardizes and completes them
- No new routes or components required — layout and utility-class changes only

---

## FR-013 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Homepage | Single-column stack on mobile → multi-column grid on `lg:` |
| Fundraiser page | Single-column on mobile → two-column (story left, donation widget right) on `lg:` with **sticky donation widget** |
| Community page | Full-width cards on mobile → 2-column grid on `md:`, 3-column on `lg:` |
| Profile page | Stacked sections on mobile → sidebar (badges + stats) + main content on `lg:` |
| Browse page | Full-width cards on mobile → responsive grid on `md:`+ |
| Create page | Centered single-column form, **max-width 640px** |
| Navigation | Hamburger on mobile → horizontal nav on `md:` (already done) |
| Donation widget | **Sticky on desktop:** `position: sticky; top: 1rem` |
| Viewport | No horizontal scroll at 375px–1440px |
| Touch | All tap targets ≥ 44×44px on mobile |

### Tailwind Breakpoints (reference)

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

Use `lg:` for the main “desktop” layout shifts (two-column fundraiser, profile sidebar, multi-column homepage grid).

---

## Deliverables Checklist

### A. Page-by-page layout

- [ ] **Homepage** (`app/page.tsx`): single-column on default, grid `lg:grid-cols-2` or `lg:grid-cols-4` for trending/communities/categories as per design
- [ ] **Fundraiser** (`components/FundraiserPageContent.tsx`): wrapper `lg:grid lg:grid-cols-[1fr,320px]` or similar; donation column `lg:sticky lg:top-4`; story and widget in correct columns
- [ ] **Community** (`components/CommunityPageContent.tsx`): fundraiser grid `md:grid-cols-2 lg:grid-cols-3`
- [ ] **Profile** (`components/ProfilePageContent.tsx`): `lg:grid lg:grid-cols-[240px_1fr]` (or similar); sidebar = badges + stats, main = fundraisers + history
- [ ] **Browse** (`components/BrowsePageContent.tsx`): grid `md:grid-cols-2 lg:grid-cols-3` for cards
- [ ] **Create** (`app/create/page.tsx`): container `max-w-[640px] mx-auto` (or `max-w-xl`)

### B. Global

- [ ] Donation widget: `position: sticky; top: 1rem` (e.g. `lg:sticky lg:top-4`) in fundraiser page only
- [ ] Audit all pages at 375px and 1440px: no horizontal scroll (fix overflow, max-width, or padding)
- [ ] Audit interactive elements (buttons, links, form controls) on mobile: min height/width or padding so tap target ≥ 44×44px

### C. Repo housekeeping

- [ ] Update `docs/development/DEVLOG.md` with FR-013 entry
- [ ] Feature branch pushed

---

## Branch & Merge Workflow

```bash
git switch main && git pull
git switch -c feature/FR-013-responsive-layout
# ... implement ...
git push -u origin feature/FR-013-responsive-layout
```

Use Conventional Commits: `feat:`, `fix:`, `style:`.

---

## Important Context

### Files to Modify

| File | Action |
|------|--------|
| `app/page.tsx` | Homepage grid breakpoints |
| `components/FundraiserPageContent.tsx` | Two-column layout + sticky donation widget |
| `components/CommunityPageContent.tsx` | Grid `md:` / `lg:` |
| `components/ProfilePageContent.tsx` | Sidebar + main on `lg:` |
| `components/BrowsePageContent.tsx` | Responsive grid |
| `app/create/page.tsx` | Max-width 640px, centered |
| `docs/development/DEVLOG.md` | Add FR-013 entry |

### Files You Should NOT Modify

- `lib/` (data, store, ai) — no logic changes
- New routes or new top-level components (no new pages)
- Header/nav structure beyond existing Tailwind classes (already responsive)

### Files to READ for Context

| File | Why |
|------|-----|
| `docs/product/FundRight-PRD.md` | FR-013 acceptance criteria (Section 8) |
| `tailwind.config.ts` | Breakpoints and theme (primary, stone palette) |
| `.cursor/rules/tech-stack.mdc` | Tailwind, Next.js 14, no new dependencies |

---

## Definition of Done for FR-013

- [ ] Homepage: single-column on mobile, multi-column grid on `lg:`
- [ ] Fundraiser page: two-column on `lg:` with sticky donation widget
- [ ] Community page: 2-col `md:`, 3-col `lg:` for fundraiser grid
- [ ] Profile page: sidebar + main on `lg:`
- [ ] Browse page: responsive grid `md:`+
- [ ] Create page: centered, max-width 640px
- [ ] Donation widget sticky on desktop (`lg:sticky lg:top-4` or equivalent)
- [ ] No horizontal scroll 375px–1440px on any page
- [ ] Tap targets ≥ 44×44px on mobile
- [ ] DEVLOG updated with FR-013 entry
- [ ] Feature branch pushed; build and lint pass

---

## After FR-013

Phase 2 is complete. Next:

- **FR-014** (JSON-LD Schema Generators) or **FR-015** (Accessibility Foundation & ARIA) can start — Phase 3.
- See `docs/development/DEVLOG.md` for Phase 3 dependencies and order.
