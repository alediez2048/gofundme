# FR-019 Primer: Deployment & QA

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 14, 2026
**Previous work:** FR-001 through FR-014 complete (except FR-013 Responsive). FR-018 (Tests) and FR-020 (AI Foundation) also complete. See `docs/development/DEVLOG.md`.

---

## What Is This Ticket?

FR-019 is the **final deployment and QA pass** — production build on Vercel, comprehensive walkthrough of every flow, Lighthouse audit, and verification that everything works end-to-end.

### Why Does This Exist?

This is the last ticket before submission. The evaluator clicks a URL and expects a working product. Every route must load, every flow must complete, and the platform must hit performance targets. This ticket is the quality gate.

### Current State

- Vercel project linked (`.vercel/` directory exists)
- `npm run build` — needs verification
- Dev server runs on port 3001
- No known deployment blockers

---

## FR-019 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Production build | `vercel --prod` confirms clean build with zero errors |
| README | Updated with final live URL |
| Local setup | `git clone → npm install → npm run dev` works with zero configuration |
| Bundle size | Production bundle ≤ 800 KiB |
| Full QA walkthrough | See checklist below |

---

## QA Walkthrough Checklist

### A. Page Load Verification

- [ ] Homepage (`/`) loads without console errors
- [ ] Fundraiser (`/f/realtime-alerts-for-wildfire-safety`) loads
- [ ] Community (`/communities/watch-duty`) loads
- [ ] Profile (`/u/janahan`) loads
- [ ] Browse (`/browse`) loads
- [ ] Browse by category (`/browse/Wildfire%20Relief`) loads
- [ ] Search (`/search?q=wildfire`) loads
- [ ] Create (`/create`) loads
- [ ] Communities index (`/communities`) loads

### B. Flow Testing

- [ ] **Navigation loop:** Homepage → Browse → Fundraiser → Donate → Profile → Community → Homepage
- [ ] **Donation flow:** Donate on fundraiser → progress bar updates → profile shows donation → community aggregate updates → homepage stats update
- [ ] **Creation flow:** Create fundraiser → appears on homepage (if trending), browse page, community page (if linked), organizer profile
- [ ] **Search:** Returns relevant results for "wildfire", "janahan", "Watch Duty"

### C. Schema Validation

- [ ] Fundraiser page: DonateAction JSON-LD present and valid
- [ ] Community page: Organization + FAQPage JSON-LD present and valid
- [ ] Profile page: ProfilePage + Person JSON-LD present and valid
- [ ] Homepage: WebSite + SearchAction JSON-LD present and valid

### D. Performance (Lighthouse)

- [ ] Performance ≥ 90 on all page types
- [ ] Accessibility ≥ 95 on all page types
- [ ] SEO ≥ 90 on all page types
- [ ] Best Practices ≥ 90 on all page types
- [ ] LCP ≤ 1.8s
- [ ] CLS ≤ 0.1

### E. Responsive

- [ ] All pages render at 375px — no horizontal scroll
- [ ] All pages render at 1440px — no horizontal scroll
- [ ] Tap targets ≥ 44px on mobile

### F. Edge Cases

- [ ] All edge case states display designed UI (from FR-016)
- [ ] Zero console errors across all states

---

## Deployment Steps

```bash
# 1. Verify local build
npm run build

# 2. Run tests
npm test

# 3. Deploy to Vercel
vercel --prod

# 4. Verify live URL
# Open the URL and run through QA checklist

# 5. Update README with live URL
```

---

## Files to Modify

| File | Action |
|------|--------|
| `README.md` | Add final live URL |
| `docs/development/DEVLOG.md` | Add FR-019 entry |

### Files You Should NOT Modify

- No code changes — this is QA only
- Fix any bugs found during QA as separate commits

---

## Definition of Done for FR-019

- [ ] `vercel --prod` clean production build
- [ ] README updated with live URL
- [ ] Local setup works: clone → install → dev
- [ ] Bundle size ≤ 800 KiB
- [ ] Full QA walkthrough passes (all checks above)
- [ ] Lighthouse ≥ 90 performance, ≥ 95 accessibility, ≥ 90 SEO
- [ ] Zero console errors
- [ ] DEVLOG updated with FR-019 entry
