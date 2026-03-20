# FR-016 Primer: Edge Case Handling & Designed States

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 14, 2026
**Previous work:** FR-001 through FR-014 complete (except FR-013 Responsive). FR-018 (Tests) and FR-020 (AI Foundation) also complete. See `docs/development/DEVLOG.md`.

---

## What Is This Ticket?

FR-016 is the **edge case and designed states pass** — every boundary condition (0%, 100%, overfunded, empty results, new fundraiser) must display a purposeful, designed UI instead of a broken or empty view.

### Why Does This Exist?

An evaluator will test boundary conditions. If a fundraiser at 0% shows a sad empty state instead of "Be the first donor!", the product feels incomplete. Designed states for every edge case are what separate a prototype from a production-ready platform.

### Current State

Some edge cases are partially handled (e.g., empty search results have a message, overfunding works in the store), but the UI doesn't differentiate between states like "just launched" vs. "almost there" vs. "goal reached" vs. "overfunded."

---

## FR-016 Contract (from PRD)

### Acceptance Criteria

| State | Expected UI |
|-------|------------|
| Fundraiser at 0% | "Just launched — be the first donor" + prominent CTA |
| Fundraiser at 76–99% | Urgency messaging ("Almost there! $500 to go") |
| Fundraiser at 100% | "Goal reached!" celebration state |
| Fundraiser > 100% | Overfunded state with "150% — Goal exceeded!" |
| Empty search results | Designed empty state with suggestions |
| Category with no fundraisers | "Be the first!" with link to create flow |
| New fundraiser (0 donations) | Welcoming state with share prompt |
| No console errors | Zero console errors in any state |

---

## Deliverables Checklist

### A. Fundraiser Progress States (`components/FundraiserPageContent.tsx`)

- [ ] **0% (just launched):** Replace generic progress with "Just launched — be the first donor!" banner, prominent Donate CTA, no donor wall (or "No donations yet" placeholder)
- [ ] **1–75% (in progress):** Standard progress bar + donor wall (current behavior)
- [ ] **76–99% (almost there):** Urgency badge near progress: "Almost there! Only $X to go" in amber/orange
- [ ] **100% (goal reached):** Green celebration banner: "Goal reached! Thank you to X donors" — Donate button still functional but labeled "Donate more" or similar
- [ ] **> 100% (overfunded):** Progress bar shows overfill (e.g., emerald gradient extends beyond bar), text: "150% — Goal exceeded!" — Donate still works

### B. Empty / Zero States

- [ ] **Empty search results** (`components/SearchPageContent.tsx`): Already has message — verify it includes category browse suggestions
- [ ] **Category with no fundraisers** (`components/BrowsePageContent.tsx`): Already has "Be the first!" — verify link to `/create` works
- [ ] **Community with no fundraisers:** Graceful empty state in fundraiser directory section
- [ ] **Profile with no donations:** "No giving history yet" placeholder
- [ ] **Profile with no fundraisers:** "No campaigns yet — start one!" with link to `/create`

### C. New Fundraiser State

- [ ] **Just created (0 donations, 0 raised):** Welcoming banner: "Your fundraiser is live! Share it to get your first donation." Optional: copy-link button or social share prompts

### D. Console Errors

- [ ] Test all edge case states in browser — zero console errors
- [ ] Check for missing key props, undefined access, NaN rendering

---

## Files to Modify

| File | Action |
|------|--------|
| `components/FundraiserPageContent.tsx` | Progress state variants (0%, 76–99%, 100%, >100%) |
| `components/ProgressBar.tsx` | Overfunded visual (>100% display) |
| `components/BrowsePageContent.tsx` | Verify empty state |
| `components/SearchPageContent.tsx` | Verify empty state |
| `components/CommunityPageContent.tsx` | Empty fundraiser directory state |
| `components/ProfilePageContent.tsx` | Empty donations/fundraisers states |

### Files You Should NOT Modify

- `lib/store/` — store already handles overfunding correctly
- `lib/data/` — seed data is the happy path; edge cases are UI-only

### Files to READ for Context

| File | Why |
|------|-----|
| `docs/product/FundRight-PRD.md` | FR-016 acceptance criteria |
| `lib/store/__tests__/store.test.ts` | Tests confirm overfunding and edge case store behavior |
| `lib/utils.ts` | `calculateProgress()` handles 0 goal and overfunding |

---

## Definition of Done for FR-016

- [ ] Fundraiser at 0%: "Just launched — be the first donor" + prominent CTA
- [ ] Fundraiser at 76–99%: urgency messaging
- [ ] Fundraiser at 100%: "Goal reached!" celebration
- [ ] Fundraiser > 100%: overfunded state
- [ ] Empty search results: designed state with suggestions
- [ ] Category with no fundraisers: "Be the first!" with create link
- [ ] New fundraiser (0 donations): welcoming state
- [ ] Zero console errors in any state
- [ ] DEVLOG updated with FR-016 entry
