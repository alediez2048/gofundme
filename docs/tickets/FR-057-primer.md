# FR-057 Primer: Performance Optimization

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete. App uses Next.js 14 with Tailwind CSS. Feed page exists from FR-042 with card-based rendering. Images served via `next/image` with remote patterns for ui-avatars.com, picsum.photos, images.unsplash.com, i.pravatar.cc.

---

## What Is This Ticket?

FR-057 optimizes runtime performance: virtualized feed rendering so only visible cards are in the DOM, bundle analysis with `@next/bundle-analyzer`, image optimization audit (WebP, lazy loading, explicit dimensions), and meeting strict performance budgets.

### Why Does This Exist?

Long feed scroll sessions can degrade to <30fps if hundreds of cards are in the DOM. Bundle bloat from unoptimized imports increases initial load time. Image optimization is the lowest-hanging fruit for page weight reduction. Meeting performance budgets (≤16ms per card render, ≤120KB first-party JS, ≤400KB initial load) ensures the app feels native-quality.

### Dependencies

- **FR-042 (FeedPage):** The feed page must exist to virtualize and optimize.

### Current State

- Feed renders all cards into the DOM (no virtualization)
- `next.config.js` has `reactStrictMode: true` and `experimental.scrollRestoration: true`
- No `@next/bundle-analyzer` configured
- Images use `next/image` with remote patterns but no explicit WebP enforcement or dimension auditing
- No performance budgets enforced

---

## FR-057 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Virtualized feed | Only visible cards in DOM during scroll |
| Bundle analysis | `@next/bundle-analyzer` configured and runnable |
| Image audit | WebP format, lazy loading, explicit width/height on all images |
| Card render target | ≤16ms per feed card for 60fps scroll |
| JS budget | First-party JS ≤120KB gzipped |
| Page weight | ≤400KB initial load |

---

## Deliverables Checklist

### A. Virtualized Feed Rendering

- [ ] Implement windowed/virtualized list for feed cards
- [ ] Options: custom IntersectionObserver approach, or lightweight virtualization
- [ ] Only render cards within viewport + buffer (e.g., 3 cards above/below)
- [ ] Maintain correct scroll position and height estimation
- [ ] Placeholder/skeleton for cards outside viewport

### B. Bundle Analysis

- [ ] Install `@next/bundle-analyzer` as devDependency
- [ ] Configure in `next.config.js` with `ANALYZE=true` env toggle
- [ ] Add npm script: `"analyze": "ANALYZE=true next build"`
- [ ] Run analysis and document any large imports to optimize
- [ ] Identify and fix any barrel import issues (importing entire modules when only one function is needed)

### C. Image Optimization Audit

- [ ] Audit all `<Image>` and `<img>` tags across components
- [ ] Ensure all images have explicit `width` and `height` (or `fill` with `sizes`)
- [ ] Verify `loading="lazy"` on below-fold images
- [ ] Confirm Next.js is serving WebP format (default behavior with `next/image`)
- [ ] Check for any raw `<img>` tags that bypass Next.js optimization

### D. Performance Budgets

- [ ] Measure initial page weight with DevTools Network tab
- [ ] Measure first-party JS bundle size (gzipped)
- [ ] Profile feed card render time in React DevTools Profiler
- [ ] Document current vs. target metrics
- [ ] Fix any violations found

### E. General Optimizations

- [ ] Review component re-renders during feed scroll (React.memo where needed)
- [ ] Check for unnecessary Zustand selector re-renders
- [ ] Lazy load heavy components (analytics dashboard, schema viewer) with `dynamic()`

---

## Files to Create

| File | Role |
|------|------|
| `components/VirtualizedFeed.tsx` (or similar) | Windowed feed card renderer |

## Files to Modify

| File | Action |
|------|--------|
| `next.config.js` | Add `@next/bundle-analyzer` configuration |
| `package.json` | Add `@next/bundle-analyzer` devDep + `analyze` script |
| Feed page component | Switch from flat list to virtualized rendering |
| Various image-using components | Add explicit dimensions, ensure lazy loading |

### Files to READ for Context

| File | Why |
|------|-----|
| `next.config.js` | Current Next.js configuration |
| `package.json` | Current dependencies and scripts |
| Feed page component | Current card rendering approach |
| `components/Skeleton.tsx` | Existing skeleton loader patterns |
| `tailwind.config.ts` | Design system for placeholder styling |

---

## Definition of Done for FR-057

- [ ] Feed uses virtualized rendering — DOM only contains visible cards + buffer
- [ ] `@next/bundle-analyzer` configured and `npm run analyze` works
- [ ] All images use `next/image` with explicit dimensions and lazy loading
- [ ] Feed card render time ≤16ms (profiled)
- [ ] First-party JS ≤120KB gzipped
- [ ] Total initial page weight ≤400KB
- [ ] No raw `<img>` tags bypassing optimization
