# FR-048 Primer: Personalized Fundraiser Recommendations

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (core platform, AI service layer, traces panel). Phase 2 work (FR-029 follow system, FR-033 seed data) are dependencies.

---

## What Is This Ticket?

FR-048 builds a **client-side collaborative filtering engine** for personalized fundraiser recommendations. The algorithm uses Jaccard similarity on users' giving graphs: for user A, it finds similar users B, C, D (those who donated to overlapping fundraisers), then surfaces fundraisers those similar users supported that A hasn't donated to yet. Results are ranked by `similarity score x fundraiser momentum (donationVelocity)`.

This is pure client-side math — no LLM calls needed. Recommendations are displayed in two places: on Profile pages ("People like you also supported...") and in the RightSidebar ("Suggested Fundraisers"). When insufficient data exists for collaborative filtering, the system falls back to same-community or same-category fundraisers.

### Why Does This Exist?

Recommendations are the connective tissue of a giving platform. By showing donors what similar people support, FundRight creates a discovery loop that benefits both donors (they find relevant causes) and fundraisers (they reach pre-qualified audiences). The Jaccard similarity approach is well-understood, transparent, and works with the small dataset sizes of a demo — no training data or ML infrastructure required.

### Dependencies

- **FR-029 (Follow System):** REQUIRED — provides the social graph that enriches recommendations (users who follow similar people likely have similar interests)
- **FR-033 (Seed Data):** REQUIRED — provides enough donation relationships across users to make collaborative filtering meaningful

### Current State

- User type has `donationIds: string[]` linking to Donation entities
- Donation type has `donorId` and `fundraiserId` fields — these form the bipartite giving graph
- Fundraiser type has `causeCategory`, `communityId`, `raisedAmount`, `donationCount` for ranking signals
- Zustand store has normalized `users`, `fundraisers`, `donations` maps — all data needed for client-side computation
- No recommendation engine or collaborative filtering exists yet
- No `donationVelocity` field exists on Fundraiser — may need to compute from donation timestamps or be added by FR-033

---

## FR-048 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Jaccard similarity | Compare user donation→fundraiser sets to find similar users |
| Recommendation generation | Surface fundraisers supported by similar users but not by target user |
| Ranking | Score by `similarityScore x fundraiserMomentum` |
| Profile display | "People like you also supported..." section on Profile pages |
| Sidebar display | "Suggested Fundraisers" section in RightSidebar |
| Fallback | Same-community or same-category fundraisers when insufficient data |
| Client-side | All computation happens in the browser, no API calls |

---

## Deliverables Checklist

### A. Collaborative Filtering Engine

- [ ] Create `lib/ai/recommendations.ts`
- [ ] `jaccardSimilarity(setA, setB)`: compute |A ∩ B| / |A ∪ B| for two donation→fundraiser ID sets
- [ ] `findSimilarUsers(userId, allUsers, allDonations)`: return top N users by Jaccard similarity on giving graphs
- [ ] `getRecommendations(userId)`: full pipeline — find similar users → collect their fundraisers → filter out user's own → rank by similarity × momentum
- [ ] Momentum computation: `donationVelocity` or computed from recent `donationCount` / time window
- [ ] Cap at 6–10 recommendations
- [ ] Memoize or cache results per session

### B. Fallback Strategy

- [ ] Cold start (no donations): recommend fundraisers from user's communities
- [ ] No community membership: recommend fundraisers in same cause categories as any they've viewed/bookmarked, or top trending
- [ ] Insufficient similar users (< 2): blend collaborative results with category-based recommendations

### C. Profile Page Integration

- [ ] Add "People like you also supported..." section to `ProfilePageContent.tsx`
- [ ] Show when viewing own profile (personalized) or other profiles (based on that user's giving)
- [ ] Display as horizontal card row or grid (3–4 fundraiser cards)
- [ ] Each card links to fundraiser page

### D. Sidebar Integration

- [ ] Add "Suggested Fundraisers" section to RightSidebar component (from Phase 2)
- [ ] Show top 3 recommendations in compact card format
- [ ] Refresh on navigation or new donation

---

## Files to Create

| File | Role |
|------|------|
| `lib/ai/recommendations.ts` | Jaccard similarity engine + recommendation pipeline |

## Files to Modify

| File | Action |
|------|--------|
| `components/ProfilePageContent.tsx` | Add "People like you also supported..." section |
| RightSidebar component (from Phase 2) | Add "Suggested Fundraisers" section |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/data/types.ts` | User, Donation, Fundraiser types — the giving graph edges |
| `lib/store/index.ts` | Store structure for accessing normalized entities |
| `components/ProfilePageContent.tsx` | Current profile layout — where to insert recommendations |
| `lib/ai/trust-impact.ts` | Example of client-side computation module in `lib/ai/` |

---

## Definition of Done for FR-048

- [ ] `jaccardSimilarity()` correctly computes set similarity
- [ ] `findSimilarUsers()` returns ranked similar users from giving graph
- [ ] `getRecommendations()` produces relevant fundraiser recommendations
- [ ] Ranking incorporates both similarity score and fundraiser momentum
- [ ] "People like you also supported..." section renders on Profile pages
- [ ] "Suggested Fundraisers" renders in RightSidebar
- [ ] Fallback to community/category-based recommendations when insufficient data
- [ ] All computation is client-side with no blocking API calls
- [ ] No regressions in existing profile or sidebar functionality
- [ ] DEVLOG updated with FR-048 entry
