# FR-017 Primer: Skeleton Loaders & Page Transitions

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 14, 2026
**Previous work:** FR-001 through FR-014 complete (except FR-013 Responsive). FR-018 (Tests) and FR-020 (AI Foundation) also complete. See `docs/development/DEVLOG.md`.

---

## What Is This Ticket?

FR-017 adds **skeleton loaders and page transitions** — pulsing gray placeholders during data loading and smooth opacity transitions between pages. The goal is perceived performance: the platform should feel fast even during hydration.

### Why Does This Exist?

Zustand hydrates from localStorage on mount, which means there's a brief flash where components render with default state before the persisted data loads. Skeleton loaders mask this hydration gap. Page transitions add polish that makes navigation feel seamless rather than jarring.

### Current State

- No skeleton loaders anywhere — components render empty or with seed data directly
- No page mount animation — pages appear instantly (which is fine, but lacks polish)
- `next/image` already uses blur placeholders for images (set up in FR-004)
- CLS is likely already low due to fixed layouts, but needs verification

---

## FR-017 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Skeleton component | Pulsing gray rectangles at specified dimensions |
| Skeleton usage | Fundraiser cards, donor wall entries, profile stats, browse grid |
| Page mount animation | 150ms opacity fade-in |
| Scroll restoration | On back navigation |
| No loading spinners | Zero visible spinners |
| CLS | ≤ 0.1 |

---

## Deliverables Checklist

### A. Skeleton Component

- [ ] Create `components/Skeleton.tsx` — reusable component with configurable width, height, and shape (rectangular, circular, text-line)
- [ ] Uses Tailwind `animate-pulse` with `bg-stone-200` / `bg-stone-300`
- [ ] Variants: `SkeletonCard` (image + text lines), `SkeletonText` (line), `SkeletonAvatar` (circle)

### B. Skeleton Integration

- [ ] **Fundraiser cards** (Homepage, Browse, Community, Profile): Show SkeletonCard while store is hydrating
- [ ] **Donor wall** (Fundraiser page): SkeletonText lines for donor entries
- [ ] **Profile stats** (Profile page): Skeleton blocks for stat values
- [ ] **Browse grid** (Browse page): Grid of SkeletonCards
- [ ] **Community stats** (Community page): Skeleton blocks for aggregate numbers

### C. Hydration Detection

- [ ] Create a `useHydrated()` hook that returns `false` on server/first render, `true` after Zustand hydration completes
- [ ] Components show skeletons when `!hydrated`, real content when `hydrated`
- [ ] Alternative: use Zustand's `onRehydrateStorage` callback

### D. Page Transitions

- [ ] Page mount animation: 150ms opacity fade-in using Tailwind `animate-` or CSS transition
- [ ] Can be implemented via a wrapper component in layout or per-page
- [ ] Respect `prefers-reduced-motion` (skip animation if set) — coordinate with FR-015

### E. Scroll Restoration

- [ ] Verify Next.js handles scroll restoration on back navigation (it does by default with App Router)
- [ ] If not working, add `experimental.scrollRestoration: true` to `next.config.js`

---

## Files to Create

| File | Role |
|------|------|
| `components/Skeleton.tsx` | Reusable skeleton loader components |

## Files to Modify

| File | Action |
|------|--------|
| `components/HomePageContent.tsx` | Skeleton cards for trending/communities |
| `components/FundraiserPageContent.tsx` | Skeleton for donor wall, related fundraisers |
| `components/CommunityPageContent.tsx` | Skeleton for stats, fundraiser grid |
| `components/ProfilePageContent.tsx` | Skeleton for stats, fundraisers, history |
| `components/BrowsePageContent.tsx` | Skeleton grid |
| `app/layout.tsx` | Page transition wrapper (if global approach) |

### Files You Should NOT Modify

- `lib/` — no logic changes needed
- Schema generators — no visual impact

---

## Definition of Done for FR-017

- [ ] Skeleton component with pulse animation, configurable dimensions
- [ ] Skeletons used for: fundraiser cards, donor wall, profile stats, browse grid
- [ ] Page mount animation: 150ms opacity fade-in
- [ ] Scroll restoration on back navigation
- [ ] No visible loading spinners
- [ ] CLS ≤ 0.1
- [ ] DEVLOG updated with FR-017 entry
