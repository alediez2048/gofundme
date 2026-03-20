# FR-064 Primer: Performance + Accessibility Audit

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-060 (Test Infrastructure) provides @lhci/cli, @axe-core/playwright, @next/bundle-analyzer, and Playwright configuration. FR-057 (Performance Optimization) handles runtime optimizations. FR-042 (FeedPage) provides the feed to audit.

---

## What Is This Ticket?

FR-064 creates the automated performance and accessibility audit pipeline: Lighthouse CI assertions for Core Web Vitals, bundle size checks, axe-core WCAG 2.1 AA scans on all page types, feed-specific accessibility attributes, and CI pipeline configuration (GitHub Actions).

### Why Does This Exist?

Performance and accessibility are not one-time tasks — they regress over time as features are added. Automated audits in CI catch regressions before they ship: a new component that breaks keyboard navigation, an import that bloats the bundle, a layout shift from a new image. The feed has specific a11y requirements (role="feed", aria-busy, keyboard navigation) that manual testing easily misses.

### Dependencies

- **FR-057 (Performance Optimization):** Performance optimizations should be in place before asserting budgets.
- **FR-042 (FeedPage):** Feed exists to audit for a11y.
- FR-060 (Test Infrastructure) must be complete.

### Current State

- @lhci/cli, @axe-core/playwright installed from FR-060
- `lighthouserc.js` exists from FR-060 with basic config
- Playwright configured for E2E tests
- No axe-core integration in tests yet
- No CI pipeline configuration (no `.github/workflows/`)
- No feed-specific a11y attributes

---

## FR-064 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Lighthouse CI | LCP ≤ 1.8s, CLS ≤ 0.1, TBT ≤ 200ms on key pages |
| Bundle size | First-party JS ≤ 120KB gzipped |
| axe-core | WCAG 2.1 AA compliance on all page types |
| Feed a11y | `role="feed"`, `aria-busy`, `aria-pressed` on hearts, `aria-live` for new content, keyboard navigation |
| CI pipeline | GitHub Actions (or similar) configuration |

---

## Deliverables Checklist

### A. Lighthouse CI Assertions

- [ ] Update `lighthouserc.js` with assertions:
  - LCP ≤ 1800 (warn), ≤ 2500 (error)
  - CLS ≤ 0.1 (warn), ≤ 0.25 (error)
  - TBT ≤ 200 (warn), ≤ 300 (error)
- [ ] Configure URLs: homepage, fundraiser detail, community detail, profile page, feed page
- [ ] Add `npm run lighthouse` or `npm run audit:perf` script
- [ ] Verify assertions pass on current build

### B. Bundle Size Check

- [ ] Create script or CI step to check first-party JS bundle size
- [ ] Use `@next/bundle-analyzer` output or `next build` stats
- [ ] Assert ≤ 120KB gzipped for first-party JavaScript
- [ ] Document current bundle size for baseline

### C. axe-core Accessibility Scans

- [ ] Create `e2e/accessibility.spec.ts` (Playwright + axe-core)
- [ ] Scan all major page types:
  - Homepage (unauthenticated)
  - Feed page (authenticated)
  - Fundraiser detail page
  - Community detail page
  - Profile page
  - Browse page
  - Search page
- [ ] Assert zero WCAG 2.1 AA violations (or document known exceptions)
- [ ] Add `npm run test:a11y` script

### D. Feed-Specific Accessibility

- [ ] Add `role="feed"` to feed container element
- [ ] Add `aria-busy="true"` during feed loading/refresh
- [ ] Add `aria-pressed` to heart/like buttons (reflects toggle state)
- [ ] Add `aria-live="polite"` region for new feed content notifications
- [ ] Keyboard navigation: Tab through feed cards, Enter to open, arrow keys between cards
- [ ] Focus management: focus returns to feed after closing detail page
- [ ] Screen reader: feed cards have meaningful `aria-label` or `aria-describedby`

### E. CI Pipeline Configuration

- [ ] Create `.github/workflows/ci.yml` (or similar)
- [ ] Jobs:
  1. `lint`: Run ESLint
  2. `test`: Run Vitest unit tests
  3. `build`: Run `next build` (catches type errors)
  4. `e2e`: Run Playwright E2E tests
  5. `lighthouse`: Run Lighthouse CI assertions
  6. `a11y`: Run axe-core accessibility scans
- [ ] Trigger on: push to main, pull request to main
- [ ] Cache node_modules and .next for performance
- [ ] Upload Playwright trace artifacts on failure

---

## Files to Create

| File | Role |
|------|------|
| `e2e/accessibility.spec.ts` | axe-core accessibility scans for all pages |
| `.github/workflows/ci.yml` | CI pipeline configuration |

## Files to Modify

| File | Action |
|------|--------|
| `lighthouserc.js` | Add detailed assertions and URL list |
| `package.json` | Add audit scripts (test:a11y, audit:perf, audit:bundle) |
| Feed page component | Add `role="feed"`, `aria-busy`, `aria-live` |
| Feed card component | Add `aria-pressed` on hearts, `aria-label` on cards |
| Heart/like button component | Add `aria-pressed` reflecting toggle state |

### Files to READ for Context

| File | Why |
|------|-----|
| `lighthouserc.js` | Current Lighthouse CI config from FR-060 |
| `playwright.config.ts` | Playwright config for adding a11y tests |
| `package.json` | Current scripts to extend |
| Feed page component | Where to add `role="feed"` and `aria-busy` |
| Feed card component | Where to add `aria-pressed` and `aria-label` |
| `components/DonationModal.tsx` | Modal a11y (focus trap, aria-modal) |

---

## Definition of Done for FR-064

- [ ] Lighthouse CI passes with LCP ≤ 1.8s, CLS ≤ 0.1, TBT ≤ 200ms
- [ ] Bundle size ≤ 120KB gzipped first-party JS
- [ ] axe-core scans pass on all major page types (WCAG 2.1 AA)
- [ ] Feed has `role="feed"`, `aria-busy`, `aria-live` attributes
- [ ] Heart buttons have `aria-pressed` reflecting state
- [ ] Feed cards are keyboard navigable
- [ ] CI pipeline configuration exists and runs all checks
- [ ] `npm run test:a11y` passes
