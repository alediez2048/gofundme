# FR-015 Primer: Accessibility Foundation & ARIA

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 14, 2026
**Previous work:** FR-001 through FR-014 complete (except FR-013 Responsive). FR-018 (Tests) and FR-020 (AI Foundation) also complete. See `docs/development/DEVLOG.md`.

---

## What Is This Ticket?

FR-015 is the **accessibility pass** across the entire platform. Every page must be navigable by keyboard and screen reader, with proper semantic HTML, ARIA attributes, heading hierarchy, focus management, and color contrast.

### Why Does This Exist?

The PRD requires Lighthouse accessibility ≥ 95. Beyond the score, accessibility is a trust signal — if a fundraising platform can't be used by everyone, it fails its mission. Several a11y foundations already exist (skip-nav, focus trap on modal, semantic landmarks); this ticket completes the gaps.

### Current State

| Feature | Status |
|---------|--------|
| Skip-to-content link | Done (FR-001) — in root layout |
| Semantic landmarks (`<nav>`, `<main>`, `<footer>`) | Done (FR-001, FR-009) |
| Donation modal focus trap | Done (FR-007) — Tab/Shift+Tab cycles, Escape closes |
| `aria-live="polite"` on donation toast | Done (FR-007) |
| `role="dialog"` + `aria-modal` on modal | Done (FR-007) |
| Heading hierarchy audit | Needs pass — verify H1 → H2 → H3 with zero skipped levels |
| Progress bar ARIA | Needs `role="progressbar"` + `aria-valuenow/min/max` |
| Visible focus indicators | Needs audit — ensure all interactive elements have them |
| Color contrast WCAG AA | Needs audit — verify emerald-600 on white meets 4.5:1 |
| `prefers-reduced-motion` | Not yet implemented |

---

## FR-015 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Skip navigation | Visible on focus, jumps to `#main-content` |
| Semantic HTML | `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>` on all pages |
| Heading hierarchy | H1 → H2 → H3, zero skipped levels on every page |
| Modal focus trap | Tab cycles within modal, Shift+Tab reverses, Escape closes |
| Progress bars | `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Toast notifications | `aria-live="polite"` |
| Focus indicators | All interactive elements have visible focus ring |
| Color contrast | WCAG AA (4.5:1 for text, 3:1 for large text) |
| Reduced motion | `prefers-reduced-motion` disables animations |
| Lighthouse | Accessibility ≥ 95 |

---

## Deliverables Checklist

### A. Heading Hierarchy Audit

- [ ] **Homepage** (`components/HomePageContent.tsx`): Verify single H1, H2 for sections, H3 for cards
- [ ] **Fundraiser** (`components/FundraiserPageContent.tsx`): H1 = title, H2 for Story/Donors/Updates/Related
- [ ] **Community** (`components/CommunityPageContent.tsx`): H1 = name, H2 for sections
- [ ] **Profile** (`components/ProfilePageContent.tsx`): H1 = name, H2 for sections
- [ ] **Browse** (`components/BrowsePageContent.tsx`): H1 = Browse, H2 for results
- [ ] **Search** (`components/SearchPageContent.tsx`): H1 = Search Results, H2 per group
- [ ] **Create** (`app/create/page.tsx`): H1 = Start a FundRight

### B. ARIA Attributes

- [ ] `ProgressBar.tsx`: Add `role="progressbar"`, `aria-valuenow={raised}`, `aria-valuemin={0}`, `aria-valuemax={goal}`, `aria-label`
- [ ] FAQ accordion: `aria-expanded`, `aria-controls` on toggle buttons
- [ ] Mobile nav drawer: `aria-expanded` on hamburger, `aria-hidden` on drawer when closed
- [ ] Profile dropdown: `aria-expanded`, `aria-haspopup="menu"`

### C. Focus Management

- [ ] Visible focus ring on all buttons, links, form inputs (Tailwind `focus-visible:ring-2`)
- [ ] Skip-nav link: verify it works and is visible on focus
- [ ] Tab order is logical on every page

### D. Color & Motion

- [ ] Verify emerald-600 (#059669) on white background meets AA (contrast ratio ~4.6:1 — borderline, may need emerald-700)
- [ ] Add `@media (prefers-reduced-motion: reduce)` to disable transitions/animations
- [ ] Check stone-500 text on stone-50 background (secondary text contrast)

### E. Semantic Elements

- [ ] Wrap fundraiser cards in `<article>` where appropriate
- [ ] Add `<aside>` for sidebar content (donation widget on desktop, profile stats)
- [ ] Ensure `<nav>` has `aria-label` (e.g., "Main navigation", "Breadcrumb")

---

## Files to Modify

| File | Action |
|------|--------|
| `components/ProgressBar.tsx` | Add progressbar role + ARIA attributes |
| `components/Header.tsx` | aria-expanded on hamburger/dropdown, aria-label on nav |
| `components/CommunityPageContent.tsx` | aria-expanded on FAQ toggles, heading audit |
| `components/FundraiserPageContent.tsx` | Heading audit, article wrapping |
| `components/ProfilePageContent.tsx` | Heading audit, aside for stats |
| `components/HomePageContent.tsx` | Heading audit |
| `components/BrowsePageContent.tsx` | Heading audit |
| `components/SearchPageContent.tsx` | Heading audit |
| `app/create/page.tsx` | Heading audit, form labels |
| `app/globals.css` | prefers-reduced-motion media query |
| `components/Breadcrumbs.tsx` | aria-label="Breadcrumb" on nav |

### Files You Should NOT Modify

- `lib/` (data, store, ai) — no logic changes
- Schema generators — no a11y relevance

### Files to READ for Context

| File | Why |
|------|-----|
| `docs/product/FundRight-PRD.md` | FR-015 acceptance criteria |
| `components/DonationModal.tsx` | Already has focus trap + ARIA — reference implementation |
| `app/layout.tsx` | Skip-nav link and landmark structure |

---

## Definition of Done for FR-015

- [ ] Skip navigation visible on focus, jumps to #main-content
- [ ] Semantic HTML on all pages (nav, main, article, aside, footer)
- [ ] Heading hierarchy H1 → H2 → H3 with zero skipped levels
- [ ] Modal focus trap (already done — verify)
- [ ] Progress bars have role="progressbar" with ARIA attributes
- [ ] Toast uses aria-live="polite" (already done — verify)
- [ ] All interactive elements have visible focus indicators
- [ ] Color contrast meets WCAG AA
- [ ] prefers-reduced-motion disables animations
- [ ] Lighthouse accessibility ≥ 95
- [ ] DEVLOG updated with FR-015 entry
