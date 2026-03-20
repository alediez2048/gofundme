# FR-021 Primer: Creation Assistant with Tool Calling

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 14, 2026
**Previous work:** FR-001 through FR-014 complete (except FR-013). FR-018, FR-020, FR-023 also complete. AI service foundation (`lib/ai/`) is ready. Create flow (`/create`) exists. See `docs/development/DEVLOG.md`.

---

## What Is This Ticket?

FR-021 adds an **AI-powered creation assistant** to the fundraiser creation form. When "AI Assist" is toggled on, the assistant offers tool-backed suggestions: goal amount recommendations, story enhancement, category assignment, and similar fundraiser discovery — all rendered inline in the form, not in a chat window.

### Why Does This Exist?

Most fundraisers fail because the story is poorly written or the goal is unrealistic. The creation assistant addresses the cold-start problem by giving organizers data-driven suggestions grounded in the platform's own fundraisers. It's the most visible AI feature because it directly improves content quality.

### Dependencies

- **FR-020 (AI Service Foundation):** COMPLETE — `callAI()`, tool registry, tracing, fallback all ready
- **FR-010 (Create Flow):** COMPLETE — form at `/create` with `addFundraiser()` action

---

## FR-021 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| AI Assist toggle | On the create page; when enabled, AI tools available alongside manual form |
| Tool: `suggestGoalAmount` | Input: category, community. Retrieves similar fundraisers, returns suggested goal with reasoning |
| Tool: `enhanceStory` | Input: raw story. Returns clarity score, missing elements, rewritten paragraphs (targeted, not full rewrite) |
| Tool: `assignCategory` | Input: title + story. Returns suggested category with confidence and reasoning |
| Tool: `searchSimilarFundraisers` | Input: title + story. Returns top 3 similar + differentiation suggestions |
| Tracing | Each tool call traced automatically (input, output, latency, tokens) |
| Fallback (no API key) | Static tips inline; category defaults to dropdown; no goal suggestion; no similar search |
| Inline rendering | Tool results render in the form — not in a chat window |

---

## Deliverables Checklist

### A. Tool Definitions (`lib/ai/tools.ts` or new file)

- [ ] **`suggestGoalAmount`** — Retrieves fundraisers in same category/community from store via `retrieval.ts`, calculates average/median, sends to LLM for reasoning. Returns `{ suggestedAmount, reasoning, similarFundraisers[] }`
- [ ] **`enhanceStory`** — Sends story to LLM with system prompt for analysis. Returns `{ clarityScore, missingElements[], suggestions[], enhancedParagraphs[] }`
- [ ] **`assignCategory`** — Sends title + story to LLM. Returns `{ category, confidence, reasoning }`
- [ ] **`searchSimilarFundraisers`** — Keyword overlap search against store fundraisers, sends top matches to LLM for differentiation tips. Returns `{ similarFundraisers[], differentiationTips[] }`

### B. Create Page Integration (`app/create/page.tsx`)

- [ ] "AI Assist" toggle switch (default off)
- [ ] When toggled on and user has filled relevant fields, trigger appropriate tools:
  - After category selected → `suggestGoalAmount` (auto-trigger or button)
  - After story written (on blur or button) → `enhanceStory`
  - After title + story filled → `assignCategory` suggestion
  - After title + story filled → `searchSimilarFundraisers`
- [ ] Inline result panels below each form field showing AI suggestions
- [ ] User can accept/dismiss each suggestion
- [ ] Loading states while AI processes

### C. Fallback UI

- [ ] When `AI Assist` is on but no API key: show static tips inline
  - "Fundraisers with stories over 300 words raise 2x more"
  - "Include how funds will be used for higher donor trust"
  - Category defaults to manual dropdown (already exists)
- [ ] Register fallback functions via `registerFallback('creation-assistant', ...)`

### D. Tracing

- [ ] Each tool call creates an `AITrace` entry automatically (via `callAI()`)
- [ ] Traces include: feature='creation-assistant', tool name, input, output, latency, tokens

---

## Files to Create

| File | Role |
|------|------|
| `lib/ai/creation-tools.ts` | Tool definitions for suggestGoalAmount, enhanceStory, assignCategory, searchSimilarFundraisers |

## Files to Modify

| File | Action |
|------|--------|
| `app/create/page.tsx` | AI Assist toggle, tool trigger points, inline result panels |
| `lib/ai/tools.ts` | Register creation tools |
| `lib/ai/fallback.ts` | Register creation-assistant fallback |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/ai/service.ts` | callAI() interface and tracing |
| `lib/ai/retrieval.ts` | buildCommunityContext for similar fundraiser retrieval |
| `lib/ai/cause-intelligence.ts` | Reference implementation of a feature using callAI() |
| `app/create/page.tsx` | Current form structure and validation |

---

## Definition of Done for FR-021

- [ ] AI Assist toggle on create page
- [ ] suggestGoalAmount tool: retrieves similar, returns suggestion with reasoning
- [ ] enhanceStory tool: clarity score, missing elements, targeted improvements
- [ ] assignCategory tool: suggested category with confidence
- [ ] searchSimilarFundraisers tool: top 3 similar + differentiation tips
- [ ] Each tool call traced automatically
- [ ] Fallback: static tips when no API key
- [ ] Tool results render inline in the form
- [ ] DEVLOG updated with FR-021 entry
