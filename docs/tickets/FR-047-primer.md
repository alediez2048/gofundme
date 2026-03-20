# FR-047 Primer: Impact Summary Generator

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (core platform, AI service layer, traces panel). AI infrastructure (`callAI`, tracing, fallback, retrieval) is production-ready. FR-027 (extended user types) is a dependency.

---

## What Is This Ticket?

FR-047 builds the **Impact Summary Generator** — an AI feature that synthesizes a personalized narrative from a user's giving history. Instead of showing raw donation stats, the platform generates a human-readable summary like "Your donations supported wildfire response in 3 states and helped 12 families access medical care." The summary is generated via the existing `callAI()` pipeline with full tracing, cached on the user object, and regenerated when new donations occur or on manual request.

This follows the exact same architecture as the existing AI features (cause-intelligence, community-discovery) — a new module in `lib/ai/`, a new API route, a RAG context builder in `retrieval.ts`, and a registered fallback for when no API key is available.

### Why Does This Exist?

Impact summaries turn raw numbers into stories. A donor who sees "You've donated $450 to 6 campaigns" gets basic information, but one who reads "Your support helped three wildfire-affected communities rebuild — including the Riverside Emergency Fund that reached its goal last week" gets emotional resonance. This is also a strong AEO/GEO demonstration: the AI takes structured data, retrieves relevant context, and generates a citation-rich narrative.

### Dependencies

- **FR-027 (Extended User Types):** REQUIRED — adds the `impactSummary` field to the User type where the generated summary is cached.

### Current State

- `callAI()` in `lib/ai/service.ts` handles OpenAI calls with tracing and automatic fallback
- `lib/ai/retrieval.ts` has `buildCommunityContext()` — the pattern for RAG context builders (a new `buildDonorContext()` will follow this pattern)
- `lib/ai/fallback.ts` has `registerFallback()` for graceful degradation
- `lib/ai/cause-intelligence.ts` is the closest existing analog — it retrieves context, calls AI, returns structured result
- `ProfilePageContent.tsx` has a `buildImpactSummary()` function (lines 31–57) that generates a basic template-based impact summary from raw stats — this is the current fallback-quality output that FR-047 will upgrade with AI
- User type currently has `totalDonated`, `donationIds`, `communityIds` — but no `impactSummary` field yet (added by FR-027)
- Donation type has `amount`, `donorId`, `fundraiserId`, `message`, `createdAt`
- Traces panel (FR-025) is complete and will automatically display traces from this feature

---

## FR-047 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| AI generation | LLM generates ~300 token narrative from giving history via `callAI()` |
| RAG context | `buildDonorContext(userId)` retrieves structured giving history for prompt |
| Caching | Result stored in `user.impactSummary` field (from FR-027) |
| Regeneration | Regenerated on new donation or manual trigger |
| Fallback | Raw stats template when no API key ("You've donated $X to Y causes across Z communities") |
| Tracing | All AI calls traced via existing `callAI → addTrace` pipeline |
| API route | `/api/ai/impact-summary` POST endpoint |

---

## Deliverables Checklist

### A. RAG Context Builder

- [ ] Add `buildDonorContext(userId)` to `lib/ai/retrieval.ts`
- [ ] Retrieve user's donations from store
- [ ] Map donations → fundraisers → communities and cause categories
- [ ] Build structured context: total donated, per-cause breakdown, per-community breakdown, recent donation messages
- [ ] Return `RetrievalContext` (text, sourceCount, tokenEstimate) following existing pattern

### B. Impact Summary AI Module

- [ ] Create `lib/ai/impact-summary.ts`
- [ ] Follow `cause-intelligence.ts` pattern: feature constant, system prompt, registerFallback, exported async function
- [ ] System prompt: "Generate a 2–3 sentence impact narrative from this donor's giving history. Use specific numbers and cause names from the context. Write in second person ('Your donations...'). AEO-optimized: lead with a 40–60 word answer-first block."
- [ ] Register fallback: template using raw stats ("You've donated $X to Y causes across Z communities")
- [ ] Export `generateImpactSummary(userId)` → returns `{ text, isAiGenerated, trace }`

### C. API Route

- [ ] Create `app/api/ai/impact-summary/route.ts`
- [ ] POST handler: accepts `{ userId }` in body
- [ ] Calls `generateImpactSummary(userId)`
- [ ] Returns `{ text, isAiGenerated }` as JSON
- [ ] Stores result in user's `impactSummary` field in store

### D. Cache & Regeneration

- [ ] After generating, write summary to `user.impactSummary` in Zustand store
- [ ] On new donation (in `addDonation` action or post-donation hook), invalidate cached summary
- [ ] Provide manual regeneration trigger (button on profile or API param `force: true`)

### E. Fallback

- [ ] Register fallback with `registerFallback("impact-summary", ...)`
- [ ] Fallback computes: total donated, number of causes, number of communities from store data
- [ ] Returns template string: "You've donated {amount} to {count} causes across {communities} communities"
- [ ] Existing `buildImpactSummary()` in ProfilePageContent.tsx can inform the template

---

## Files to Create

| File | Role |
|------|------|
| `lib/ai/impact-summary.ts` | Impact summary AI module (generation + fallback) |
| `app/api/ai/impact-summary/route.ts` | API endpoint for generating/retrieving impact summaries |

## Files to Modify

| File | Action |
|------|--------|
| `lib/ai/retrieval.ts` | Add `buildDonorContext(userId)` RAG context builder |
| `lib/store/index.ts` | Add action to update `user.impactSummary` field |
| `components/ProfilePageContent.tsx` | Optionally replace template `buildImpactSummary()` with AI-generated version |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/ai/cause-intelligence.ts` | Closest pattern to follow — RAG + callAI + fallback |
| `lib/ai/service.ts` | `callAI()` interface and AIRequest/AIResponse types |
| `lib/ai/retrieval.ts` | Existing `buildCommunityContext()` pattern for new `buildDonorContext()` |
| `lib/ai/fallback.ts` | `registerFallback()` API |
| `lib/ai/trace.ts` | AITrace type (auto-handled by callAI but good to understand) |
| `lib/store/index.ts` | Store structure, `addDonation` action for regeneration hook |
| `lib/data/types.ts` | User, Donation, Fundraiser, Community type definitions |
| `components/ProfilePageContent.tsx` | Current template-based `buildImpactSummary()` (lines 31–57) |

---

## Definition of Done for FR-047

- [ ] `buildDonorContext(userId)` retrieves structured giving history from store
- [ ] `generateImpactSummary(userId)` produces AI-generated narrative via `callAI()`
- [ ] `/api/ai/impact-summary` POST route works end-to-end
- [ ] Result cached in `user.impactSummary` field
- [ ] Summary regenerated on new donation or manual trigger
- [ ] Fallback produces template-based summary when no API key
- [ ] AI traces appear in traces panel for all impact summary calls
- [ ] No regressions in existing AI features or profile page
- [ ] DEVLOG updated with FR-047 entry
