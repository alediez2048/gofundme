# FR-022 Primer: Community Discovery Assistant (RAG)

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 14, 2026
**Previous work:** FR-001 through FR-014 complete (except FR-013). FR-018, FR-020, FR-023 also complete. AI service foundation (`lib/ai/`) is ready. Community page exists. See `docs/development/DEVLOG.md`.

---

## What Is This Ticket?

FR-022 adds a **natural-language discovery assistant** to community pages. Donors can type queries like "show me fundraisers close to their goal" or "who needs help with evacuation" and get AI-ranked, filtered results from the community's fundraisers — or fall back to keyword matching without an API key.

### Why Does This Exist?

Community pages currently show a flat list of fundraisers with preset filters (most urgent, closest to goal). Natural-language search lets donors express nuanced intent that preset filters can't capture. It transforms the community page from a passive directory into an active discovery tool.

### Dependencies

- **FR-020 (AI Service Foundation):** COMPLETE — `callAI()`, retrieval, tracing, fallback all ready
- **FR-005 (Community Page):** COMPLETE — fundraiser directory with guided discovery modules

---

## FR-022 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Search/filter bar | At top of community page's fundraiser section; accepts natural language |
| RAG pipeline | Query → `retrieve()` community fundraisers → LLM generates ranked response |
| Result rendering | Existing fundraiser card grid — filtered and reordered by AI ranking, not separate UI |
| Tracing | Each query traced: input, retrieved context, generated ranking, latency, tokens |
| Fallback (no API key) | Keyword-based client-side filter matching query against titles/stories |
| Opt-in | "Smart Search" toggle or icon — fallback is default experience |
| Scoped | Works within single community's fundraisers only |

---

## Deliverables Checklist

### A. Discovery Search Bar (`components/CommunityPageContent.tsx`)

- [ ] Text input above fundraiser grid: "Search fundraisers in this community..."
- [ ] "Smart Search" toggle (AI-powered) — off by default, keyword search is default
- [ ] Submit on Enter or button click
- [ ] Loading state while AI processes

### B. RAG Pipeline

- [ ] **Retrieve:** Use `buildCommunityContext()` from `lib/ai/retrieval.ts` — pulls fundraiser stories, titles, amounts, progress within this community
- [ ] **Generate:** Send user query + retrieved context to LLM with system prompt:
  - "Given these fundraisers in the [community] community, rank and filter them based on the user's query. Return fundraiser IDs in order of relevance with brief reasoning."
- [ ] **Render:** Reorder the existing fundraiser card grid based on AI's ranking — no separate UI

### C. Fallback (Keyword Search)

- [ ] When Smart Search is off or no API key: client-side keyword filter
- [ ] Match query words against fundraiser titles and story text (case-insensitive)
- [ ] Show matching fundraisers in existing card grid
- [ ] Sort options remain: Closest to Goal, Most Recent, Most Funded, Just Launched
- [ ] Register via `registerFallback('discovery', ...)`

### D. Tracing

- [ ] Each query creates an `AITrace` with:
  - `feature: 'discovery'`
  - Input: user query
  - Context: which fundraiser IDs/snippets were retrieved
  - Output: ranked fundraiser IDs + reasoning
  - Metrics: latency, tokens

---

## Files to Create

| File | Role |
|------|------|
| `lib/ai/discovery.ts` | Discovery assistant logic (RAG query → ranked results) |

## Files to Modify

| File | Action |
|------|--------|
| `components/CommunityPageContent.tsx` | Add search bar, Smart Search toggle, handle AI/keyword results |
| `lib/ai/fallback.ts` | Register discovery fallback |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/ai/service.ts` | callAI() interface |
| `lib/ai/retrieval.ts` | buildCommunityContext() for RAG |
| `lib/ai/cause-intelligence.ts` | Reference: RAG feature using the same pipeline |
| `components/CommunityPageContent.tsx` | Current fundraiser grid and guided discovery UI |

---

## Definition of Done for FR-022

- [ ] Search/filter bar at top of community fundraiser section
- [ ] RAG pipeline: query → retrieve community fundraisers → LLM-ranked response
- [ ] Results render as filtered/reordered fundraiser card grid
- [ ] Each query traced with full RAG context
- [ ] Fallback: keyword-based filter when Smart Search off or no API key
- [ ] Smart Search is opt-in (toggle/icon)
- [ ] Scoped to single community's fundraisers
- [ ] DEVLOG updated with FR-022 entry
