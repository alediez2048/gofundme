# FR-032 Primer: AI-Powered Feed Algorithm

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 20, 2026
**Previous work:** FR-001 through FR-025 complete. FR-026–FR-031 build the data foundation: types, auth state, follow system, engagement actions, event generation. The store has feedEvents, followRelationships, and currentUser.

---

## What Is This Ticket?

FR-032 is the **AI-powered feed algorithm** — the intelligence layer that makes FundRight a genuinely AI-driven experience. This is not a simple sorting function. It is the core AI feature that connects Profile, Fundraiser, and Community pages into a personalized, intelligent experience for each user.

The algorithm decides: what you see, in what order, from which page types, and why. It learns from your behavior (donations, clicks, hearts, skips), models cause relationships as semantic embeddings (so "wildfire relief" and "climate action" are recognized as related even though they're different categories), balances exploration vs. exploitation (surfacing content outside your comfort zone to prevent filter bubbles), and generates the feed narrative by deciding what *type* of content you need right now (social proof, urgency, recognition, discovery).

This is the feature that makes someone say "this platform gets me" — and it's what differentiates FundRight from a well-designed web app with links between pages.

### Why Does This Exist?

The original assignment asks for an AI-powered experience that reimagines Profile, Fundraiser, and Community pages. The feed algorithm is *how* AI connects these three page types. Without it, the feed is just a chronological list of events. With it, the feed becomes an intelligent surface that:

- Surfaces a **fundraiser** you'd care about based on your giving history (Fundraiser page connection)
- Shows you a **community milestone** from a group aligned with your values (Community page connection)
- Highlights a **profile achievement** from someone in your network (Profile page connection)

The algorithm is the product. Everything else — the three-column layout, the card variants, the engagement buttons — is just the container.

### Dependencies

- **FR-029 (Follow System):** MUST be complete — social graph signals need real follow relationships
- **FR-031 (Event Generation):** MUST be complete — the algorithm ranks FeedEvents from the store
- **FR-027 (Extended Types):** MUST be complete — causeCategory expansion, donationVelocity, milestones

### Current State

- `feedEvents` slice exists in store (from FR-030/FR-031)
- `followRelationships` array exists in store (from FR-029)
- `currentUser` field exists in store (from FR-028)
- User entities have `donationIds` and `causeCategory` data from seed
- Fundraiser entities have `causeCategory` field
- AI service layer (`lib/ai/service.ts`) with `callAI()`, tracing, fallbacks is complete
- No feed algorithm, cause affinity, or ranking logic exists anywhere

---

## FR-032 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| AI-powered ranking | Feed items ranked by a multi-signal model, not simple sorting |
| Cause embedding model | Semantic cause vectors where related causes (wildfire/climate) have high similarity |
| Behavioral learning | User actions (donate, heart, click, skip) update their preference model |
| Social graph intelligence | Events weighted by follow distance (direct > 2nd degree > community overlap > stranger) |
| Engagement momentum | Content with high velocity (rapid recent engagement) gets boosted |
| Exploration vs. exploitation | 20% of feed slots reserved for discovery (content outside user's history) |
| Content type balancing | Algorithm ensures mix of donations, milestones, community events, profile moments |
| Cross-page intelligence | Algorithm explicitly connects content across Profile, Fundraiser, and Community pages |
| "For You" tab | Full AI-powered ranking |
| "Following" tab | Chronological feed from followed users only |
| "Trending" tab | Engagement-momentum ranked (velocity, not just total counts) |
| Explainability | Each feed item carries a `reason` field explaining why it was surfaced |
| Cold start handling | New users get a reasonable feed from trending + community content |
| Fallback | Without AI/history: chronological feed filtered by community membership |

---

## Deliverables Checklist

### A. Cause Embedding Model (`lib/feed/causeEmbeddings.ts`)

The core AI insight: causes aren't independent categories — they have semantic relationships. "Wildfire Relief" is closer to "Climate Action" than to "Medical & Healthcare." The embedding model captures this.

- [ ] Define a cause similarity matrix — hand-crafted for the demo categories, but structured so it could be replaced by real embeddings later:
  ```
  Disaster Relief ↔ Environment & Climate: 0.8 (high similarity)
  Medical & Healthcare ↔ Community & Neighbors: 0.6
  Education ↔ Community & Neighbors: 0.7
  Animals & Wildlife ↔ Environment & Climate: 0.75
  ```
- [ ] `getCauseSimilarity(causeA, causeB): number` — returns 0–1 similarity score
- [ ] `computeUserCauseProfile(userId, state): CauseProfile` — builds a weighted vector from:
  - Donation history (amount-weighted, recency-weighted)
  - Community memberships (causes of joined communities)
  - Engagement signals (hearted events by cause)
  - Returns a normalized `Record<CauseCategory, number>` with semantic spreading (donating to "Wildfire" also slightly boosts "Climate")
- [ ] `scoreCauseRelevance(userProfile, eventCause): number` — dot product with semantic similarity, not just exact match
- [ ] Handle cold start: new users get uniform distribution + slight boost from any community memberships

### B. Behavioral Learning Model (`lib/feed/behaviorModel.ts`)

The algorithm learns from what you do, not just what you've donated to.

- [ ] `UserBehaviorSignals` type:
  ```typescript
  interface UserBehaviorSignals {
    donatedCauses: Record<CauseCategory, number>;    // amount-weighted
    heartedCauses: Record<CauseCategory, number>;    // count-weighted
    clickedCauses: Record<CauseCategory, number>;    // count-weighted
    skippedCauses: Record<CauseCategory, number>;    // negative signal
    lastInteractionTimes: Record<CauseCategory, string>; // recency per cause
  }
  ```
- [ ] `updateBehaviorSignals(userId, action, eventId, state)` — called when user interacts with feed
  - `action: 'donate' | 'heart' | 'click' | 'skip' | 'bookmark' | 'share'`
  - Each action type has different weight: donate (1.0) > share (0.7) > bookmark (0.6) > heart (0.4) > click (0.2) > skip (-0.1)
- [ ] Signals stored in Zustand (per-user, persisted to localStorage)
- [ ] Decay function: older signals matter less (exponential decay over 30 days)

### C. Feed Scoring Engine (`lib/feed/algorithm.ts`)

The multi-signal ranking model that powers "For You."

- [ ] `scoreFeedEvent(event, userId, state): ScoredFeedEvent`
  ```typescript
  interface ScoredFeedEvent {
    event: FeedEvent;
    score: number;
    reason: string;           // "Because you support wildfire relief"
    signals: {
      causeRelevance: number;   // 0–1, from cause embedding model
      socialProximity: number;  // 0–1, from social graph
      engagementMomentum: number; // 0–1, velocity not just total
      recency: number;          // 0–1, time decay
      contentTypeBoost: number; // 0–1, balancing signal
      explorationBoost: number; // 0 or bonus, for discovery slots
    };
  }
  ```
- [ ] **Cause relevance (weight: 0.30)** — from cause embedding model, semantic similarity between user profile and event cause
- [ ] **Social proximity (weight: 0.25)** — graduated scoring:
  - 1.0: direct follow
  - 0.7: 2nd degree (followed by someone you follow)
  - 0.4: shares a community with you
  - 0.1: same cause category but no social connection
  - 0.0: no connection
- [ ] **Engagement momentum (weight: 0.20)** — not just total hearts, but *velocity*:
  - `velocity = engagementCount / hoursSinceCreation`
  - Normalized against the current feed's max velocity
  - Fundraisers with rapid recent donations get boosted (momentum signal)
- [ ] **Recency (weight: 0.15)** — exponential decay: `Math.exp(-hoursSince / 36)` (half-life ~25 hours)
- [ ] **Content type balancing (weight: 0.05)** — boost underrepresented content types:
  - Track ratio of donation/milestone/community/profile events in scored results
  - If >60% of top results are one type, boost other types
- [ ] **Exploration factor (weight: 0.05)** — 20% of feed slots reserved for discovery:
  - Every 5th slot: pick highest-scored event from OUTSIDE user's top 2 cause categories
  - This prevents filter bubbles and introduces users to new causes

### D. Reason Generation (`lib/feed/reasonGenerator.ts`)

Each feed item carries a human-readable explanation of why it was surfaced. This is the visible AI intelligence.

- [ ] `generateReason(scoredEvent, userProfile, state): string`
- [ ] Template-based with smart variable filling (no LLM needed for core):
  - Cause match: "Because you support {causeCategory}"
  - Social: "Shared by {followerName}, who you follow"
  - 2nd degree: "{followerName} follows {actorName}"
  - Community: "From the {communityName} community you're part of"
  - Momentum: "Trending — {velocity} donations in the last hour"
  - Exploration: "Discover: popular in {causeCategory}"
  - Milestone: "{fundraiserName} just hit {milestone} — you donated to this"
- [ ] Optional LLM enhancement via `/api/ai/feed-explain` route:
  - Takes scored event + user profile
  - Generates a 1-sentence natural language explanation
  - ~50 tokens per explanation, batch 10 per feed load = ~500 tokens
  - Fallback: template-based reason (always works without API key)
  - Traced via `callAI()` pipeline

### E. Feed Tabs

- [ ] `getForYouFeed(userId, state): ScoredFeedEvent[]`
  - Full AI-powered scoring, sorted descending
  - Exploration slots injected every 5th position
  - Content type balancing applied
  - Each item carries a `reason`
- [ ] `getFollowingFeed(userId, state): FeedEvent[]`
  - Filter to events where actorId is in user's following list
  - Sort by createdAt descending (chronological)
  - No AI scoring — this is the "raw" view
- [ ] `getTrendingFeed(state): ScoredFeedEvent[]`
  - All events sorted by engagement momentum (velocity, not total)
  - Reason: always "Trending" + momentum stat
- [ ] `getFeedForUser(userId, tab, state): ScoredFeedEvent[] | FeedEvent[]`
  - Router to appropriate tab function

### F. Diversity & Anti-Pattern Enforcement

- [ ] No 3+ consecutive events from the same causeCategory
- [ ] No 3+ consecutive events of the same eventType (all donations, all milestones)
- [ ] No guilt-based content patterns (skip events that could read as "your friend donated, why haven't you?")
- [ ] Donor amounts respect `isPublic` flag — never surface amounts for private donations
- [ ] Greedy reordering pass after scoring: swap violations while preserving approximate score order

### G. Tests

- [ ] Cause embedding similarity returns expected values for related/unrelated causes
- [ ] User cause profile correctly weights donations, hearts, community memberships
- [ ] Cold start user gets reasonable feed (trending + community content)
- [ ] Behavioral signals update correctly on user actions
- [ ] Social proximity scores correctly for direct/2nd-degree/community/stranger
- [ ] Engagement momentum favors velocity over raw totals
- [ ] Exploration slots appear every ~5th position with out-of-profile content
- [ ] Content type balancing prevents single-type domination
- [ ] "For You" feed is ordered by composite score
- [ ] "Following" feed only includes events from followed users, chronological
- [ ] "Trending" feed is ordered by momentum
- [ ] Diversity rules prevent consecutive same-cause and same-type events
- [ ] Reason generation produces appropriate explanations for each signal type
- [ ] Feed degrades gracefully: no history → community filter → global chronological

---

## Files to Create

| File | Role |
|------|------|
| `lib/feed/causeEmbeddings.ts` | Cause similarity matrix, user cause profile, semantic scoring |
| `lib/feed/behaviorModel.ts` | User behavior signals, learning from actions, signal decay |
| `lib/feed/algorithm.ts` | Multi-signal feed scoring engine |
| `lib/feed/reasonGenerator.ts` | "Why you see this" explanation generation |
| `app/api/ai/feed-explain/route.ts` | Optional LLM-powered feed explanations |

## Files to Modify

| File | Action |
|------|--------|
| `lib/store/index.ts` | Add `getFeedForUser` selector, `behaviorSignals` state, `updateBehaviorSignals` action |
| `lib/data/types.ts` | Add `ScoredFeedEvent`, `UserBehaviorSignals`, `CauseProfile` types |
| `lib/store/__tests__/store.test.ts` | Add comprehensive algorithm tests |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/store/index.ts` | Store structure — feedEvents, followRelationships, currentUser |
| `lib/data/types.ts` | FeedEvent, CauseCategory, User, Donation, Fundraiser types |
| `lib/data/seed.ts` | User donation patterns for testing cause affinity |
| `lib/ai/service.ts` | `callAI()` pattern for optional LLM explanation route |
| `lib/ai/retrieval.ts` | RAG context builder pattern |
| `fundright-prd-2.0.md` | PRD feed algorithm section — scoring, tabs, diversity |

---

## Architecture Decision: Why Client-Side AI?

The Zustand store has all the data needed to compute cause profiles, social proximity, and engagement momentum. For the demo dataset (~10 users, ~30 events, ~5 fundraisers), all computations are instant client-side. This means:

- **Zero latency** — feed renders immediately, no API round-trip for ranking
- **Works offline** — algorithm runs on cached localStorage data
- **No API key required** for core ranking — only the optional LLM explanations need OpenAI
- **Transparent** — every score and signal is inspectable in the browser

For production scale, this would move server-side. But for the demo, client-side AI is the right call — it proves the algorithm works without infrastructure dependencies.

---

## What This Subsumes

This ticket absorbs **FR-046 (Feed Personalization Engine)**. FR-046 was originally a separate Phase 3 ticket that added cause affinity to the algorithm. That separation was wrong — the algorithm without AI personalization is just a sorting function, and the AI personalization without the algorithm has nothing to enhance. They are one feature.

FR-046 should be marked as "merged into FR-032" and skipped during implementation.

---

## Definition of Done for FR-032

- [ ] Cause embedding model computes semantic similarity between cause categories
- [ ] User cause profiles built from donations, hearts, community memberships (weighted, decayed)
- [ ] Behavioral learning updates user signals on donate/heart/click/skip/bookmark/share
- [ ] Feed scoring uses 6-signal model: causeRelevance + socialProximity + engagementMomentum + recency + contentTypeBalance + exploration
- [ ] Each feed item carries a human-readable `reason` explaining why it was surfaced
- [ ] "For You" tab returns AI-ranked events with exploration slots and diversity enforcement
- [ ] "Following" tab returns chronological events from followed users
- [ ] "Trending" tab returns momentum-ranked events
- [ ] Cold start users get a reasonable feed (trending + community content)
- [ ] Diversity rules enforced (no 3+ consecutive same-cause or same-type)
- [ ] Optional LLM explanation route works with fallback to templates
- [ ] All scoring signals are testable and tested
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] DEVLOG updated with FR-032 entry
