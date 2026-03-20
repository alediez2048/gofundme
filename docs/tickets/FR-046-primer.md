# FR-046 Primer: Feed Personalization Engine

**Status:** MERGED INTO FR-032 — Do not implement separately.

FR-046's scope (cause affinity vectors, feed scoring enhancement, "For You" tab personalization, optional AI explanations) has been fully absorbed into FR-032 (AI-Powered Feed Algorithm). The algorithm IS the personalization — separating them was a false boundary.

See `docs/tickets/FR-032-primer.md` for the unified specification.

---

## Original Description (archived)

FR-046 builds the **Feed Personalization Engine** — a client-side cause affinity ranking system that powers a "For You" tab in the feed. Instead of showing a generic chronological feed, the engine computes a cause affinity vector from each user's giving history (frequency distribution over `CauseCategory` values) and uses it to boost relevant fundraisers and feed items.

The core engine is pure math — no LLM required. An optional AI enhancement adds a `/api/ai/feed-explain` route that generates natural language "why you see this" explanations for individual feed items (~500 tokens per load). When the user has no giving history or affinity data, the feed falls back to a chronological view filtered by community membership.

### Why Does This Exist?

A personalized feed is the difference between a platform users visit and one they return to. By ranking content based on what causes a donor actually cares about, FundRight demonstrates that AI-powered features can go beyond generation — they can make the core product smarter. The cause affinity engine also feeds into FR-048 (recommendations) and FR-047 (impact summaries), making it a foundational building block for the entire AI + Integration phase.

### Dependencies

- **FR-032 (Feed Algorithm):** REQUIRED — provides the base `lib/feed/algorithm.ts` scoring pipeline that this ticket enhances with affinity vectors. Must be complete before starting.

### Current State

- `CauseCategory` type exists in `lib/data/types.ts` with two values: `"Disaster Relief & Wildfire Safety"` and `"Medical & Healthcare"`
- User type has `donationIds: string[]` and `totalDonated: number` fields for giving history
- Donation type links to `fundraiserId`, which links to `causeCategory` on Fundraiser
- AI service foundation (`lib/ai/service.ts`) is complete with `callAI()`, tracing, and fallback infrastructure
- `lib/ai/retrieval.ts` has `buildCommunityContext()` — the pattern for RAG context builders
- `lib/ai/fallback.ts` has `registerFallback()` for graceful degradation
- No `lib/feed/` directory exists yet (created by FR-032)

---

## FR-046 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Cause affinity computation | Compute cause vector from user giving history (frequency over CauseCategory) |
| Feed scoring integration | Enhance feed algorithm scoring with real cause affinity vectors |
| "For You" tab | Personalized feed tab using affinity-boosted ranking |
| AI explanation (optional) | `/api/ai/feed-explain` route generates "why you see this" (~500 tokens/load) |
| Fallback behavior | Chronological feed filtered by community membership when no history |
| Performance | Affinity computation is client-side, no blocking API calls for core feed |

---

## Deliverables Checklist

### A. Cause Affinity Engine

- [ ] Create `lib/feed/causeAffinity.ts`
- [ ] `computeCauseVector(userId)`: analyze user's donations → fundraiser causeCategories → frequency distribution
- [ ] Return a `Record<CauseCategory, number>` normalized to 0–1 range
- [ ] Handle cold-start (no donations): return uniform distribution
- [ ] Memoize or cache result per user session

### B. Feed Algorithm Enhancement

- [ ] Modify `lib/feed/algorithm.ts` (from FR-032) to accept cause affinity vector
- [ ] Add affinity boost factor to scoring: multiply base score by (1 + affinityWeight * causeMatch)
- [ ] Configurable affinity weight (default 0.3–0.5)
- [ ] Preserve existing scoring factors (recency, momentum, etc.)

### C. "For You" Tab UI

- [ ] Add "For You" / "Latest" tab toggle to feed view
- [ ] "For You" uses affinity-boosted scoring
- [ ] "Latest" uses chronological with community filter
- [ ] Tab state persisted in URL or local state

### D. AI Feed Explanation (Optional)

- [ ] Create `/api/ai/feed-explain/route.ts`
- [ ] Accepts feed item ID + user cause vector
- [ ] Uses `callAI()` with prompt: "Explain in 1 sentence why this fundraiser matches this donor's interests"
- [ ] ~500 tokens per load budget
- [ ] Register fallback: template-based explanation ("You support {category} causes")
- [ ] Wire trace through existing `callAI → addTrace` pipeline

### E. Fallback Behavior

- [ ] No giving history: show chronological feed filtered by user's community memberships
- [ ] No community memberships: show global chronological feed
- [ ] Graceful transition as user starts donating (affinity builds over time)

---

## Files to Create

| File | Role |
|------|------|
| `lib/feed/causeAffinity.ts` | Cause affinity vector computation from giving history |
| `app/api/ai/feed-explain/route.ts` | Optional AI explanation endpoint |

## Files to Modify

| File | Action |
|------|--------|
| `lib/feed/algorithm.ts` | Add cause affinity boost to scoring pipeline (FR-032 must exist first) |
| Feed UI component (from FR-032) | Add "For You" / "Latest" tab toggle |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/data/types.ts` | CauseCategory type, User/Donation/Fundraiser relationships |
| `lib/store/index.ts` | Store structure, how to access user donations and fundraisers |
| `lib/ai/service.ts` | `callAI()` pattern for the optional AI explanation route |
| `lib/ai/retrieval.ts` | RAG context builder pattern to follow |
| `lib/ai/fallback.ts` | `registerFallback()` for graceful degradation |
| `lib/feed/algorithm.ts` | Base feed scoring pipeline (from FR-032) |

---

## Definition of Done for FR-046

- [ ] `computeCauseVector(userId)` returns correct affinity distribution from giving history
- [ ] Feed algorithm scoring incorporates cause affinity boost
- [ ] "For You" tab shows affinity-ranked feed items
- [ ] Fallback to chronological feed when no giving history
- [ ] Optional: `/api/ai/feed-explain` generates natural language explanations
- [ ] Optional: AI traces appear in traces panel for explanation calls
- [ ] No regressions in existing feed functionality (FR-032)
- [ ] DEVLOG updated with FR-046 entry
