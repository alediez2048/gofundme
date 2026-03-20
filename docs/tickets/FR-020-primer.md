# FR-020 Primer: AI Service Foundation & Trace Infrastructure

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 14, 2026
**Status:** COMPLETE
**Previous work:** FR-001 through FR-012 complete. This ticket was built early (before Phase 3 polish) to unblock Phase 4 AI features.

---

## What Is This Ticket?

FR-020 is the **unified AI service layer** — the foundation that all other AI features (FR-021 through FR-025) build on. It provides a single `callAI()` entry point wrapping OpenAI, with automatic tracing, fallback to non-AI alternatives, and RAG-style retrieval from the Zustand store.

### Why Does This Exist?

Without a shared AI infrastructure, each AI feature would reinvent its own OpenAI client, error handling, fallback logic, and observability. FR-020 ensures every AI interaction is traced, every feature degrades gracefully without an API key, and the architecture is consistent.

---

## What Was Built

### Service Layer (`lib/ai/service.ts`)
- **`callAI(request, fallbackInput): Promise<AIResponse>`** — Main entry point
- Handles OpenAI chat completion with tracing
- Automatic fallback if API key missing or call fails
- Returns `{ text, isAiGenerated, trace }`

### Configuration (`lib/ai/config.ts`)
- Environment detection: checks `OPENAI_API_KEY`
- Exports `aiConfig` with provider, model (`gpt-4o-mini` default), maxTokens (400), temperature (0.4), enabled flag

### Fallback Registry (`lib/ai/fallback.ts`)
- **`registerFallback(feature, fn)`** — Maps feature names to non-AI functions
- **`getFallback(feature)`** — Returns fallback when API unavailable
- Pattern: register at module load, retrieve at call time

### Trace Logger (`lib/ai/trace.ts`)
- **`AITrace`** type: id, timestamp, feature, input, output, metrics (latencyMs, tokens, toolCallCount), status, fallbackReason
- Traces logged to stdout as JSON (Vercel-compatible)
- Max 50 traces stored (ring buffer)

### RAG Retrieval (`lib/ai/retrieval.ts`)
- **`buildCommunityContext(community, fundraisers, donations)`** — Extracts fundraiser stories + donor messages
- **`buildOrganizerContext(organizerId, fundraisers, communities)`** — Organizer trust summary
- Returns `{ text, sourceCount, tokenEstimate }`

### Tool Registry (`lib/ai/tools.ts`)
- **`registerTool(tool)`** — Register typed tool definitions
- **`getTool(name)`** — Lookup by name
- **`getToolsForOpenAI()`** — Convert to OpenAI function-calling format
- Framework only; specific tools registered by feature tickets (FR-021)

---

## Key Files

| File | Role |
|------|------|
| `lib/ai/service.ts` | Unified AI service with tracing + fallback |
| `lib/ai/config.ts` | Environment config and feature flags |
| `lib/ai/fallback.ts` | Fallback function registry |
| `lib/ai/trace.ts` | Trace logging and types |
| `lib/ai/retrieval.ts` | RAG context building from store data |
| `lib/ai/tools.ts` | Tool definition registry |
| `lib/ai/cause-intelligence.ts` | First consumer (FR-023) |

---

## Architecture

```
Feature (e.g., cause-intelligence)
    │
    ▼
callAI(request, fallbackInput)
    │
    ├─ AI enabled? ──► OpenAI chat completion ──► trace(success)
    │                                              │
    │                                              ▼
    │                                         AIResponse { text, isAiGenerated: true, trace }
    │
    └─ AI disabled? ──► getFallback(feature) ──► trace(fallback)
                                                    │
                                                    ▼
                                               AIResponse { text, isAiGenerated: false, trace }
```

---

## Definition of Done (all met)

- [x] `lib/ai/service.ts`: unified wrapper with `callAI()`, tracing, fallback
- [x] `lib/ai/tools.ts`: Tool definition registry with typed objects
- [x] `lib/ai/retrieval.ts`: RAG retrieval with structured store queries
- [x] `lib/ai/trace.ts`: Trace logger with AITrace type, stored traces
- [x] `lib/ai/fallback.ts`: Fallback registry for graceful degradation
- [x] `lib/ai/config.ts`: Environment detection, aiEnabled flag
- [x] All modules typed, zero `any`
