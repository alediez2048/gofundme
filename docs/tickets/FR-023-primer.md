# FR-023 Primer: Cause Intelligence (RAG + Generation)

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 10, 2026
**Status:** COMPLETE (delivered early — before Phase 3)
**Previous work:** FR-001 through FR-012 complete. FR-020 (AI Foundation) complete.

---

## What Is This Ticket?

FR-023 is the **cause intelligence feature** — an AI-generated "About This Cause" summary on community pages. It uses RAG to synthesize a 2–3 paragraph summary grounded in the community's actual fundraiser stories and donation messages.

### Why Does This Exist?

GoFundMe's community pages are semantically empty — they aggregate campaigns without explaining why the cause matters. Cause intelligence fills that gap: a donor landing on the Watch Duty community page sees a contextual summary of wildfire relief efforts, what's been accomplished, and what's still needed — all derived from real platform data, not generic content.

---

## What Was Built

### Cause Intelligence Module (`lib/ai/cause-intelligence.ts`)
- **`getCauseSummary(community, fundraisers, donations)`** — Main entry point
- Uses `buildCommunityContext()` from `retrieval.ts` to extract fundraiser stories + donor messages
- Sends context to `callAI()` with system prompt guiding 2–3 paragraph synthesis
- Focus areas: what the cause is, why it matters now, what's accomplished, what's needed
- **Fallback:** Returns `community.description` as-is when no API key

### Integration (`app/communities/[slug]/page.tsx`)
- Called server-side in the page component (async)
- Passes result to `CommunityPageContent` client component
- AI content labeled "AI-generated summary" with source attribution ("Based on N active fundraisers")
- Fallback content has no "AI-generated" label

### RAG Context
- Retrieves all fundraiser stories within the community
- Includes donor messages for sentiment/urgency signals
- Returns `{ text, sourceCount, tokenEstimate }` for context window management

---

## Key Files

| File | Role |
|------|------|
| `lib/ai/cause-intelligence.ts` | getCauseSummary() — RAG + generation |
| `lib/ai/retrieval.ts` | buildCommunityContext() — RAG retrieval |
| `lib/ai/service.ts` | callAI() — unified AI service with tracing |
| `app/communities/[slug]/page.tsx` | Server-side AI call integration |
| `components/CommunityPageContent.tsx` | Renders AI summary with attribution label |

---

## Definition of Done (all met)

- [x] "About This Cause" section on community pages, below stats bar
- [x] RAG pipeline: retrieve fundraiser stories + donation messages → LLM cause summary
- [x] Content covers: what the cause is, why it matters now, what's accomplished, what's needed
- [x] Source attribution when AI: "Based on N active fundraisers in this community"
- [x] Fallback (no API key): static community.description, no "AI-generated" label
- [x] AI-generated content has subtle "AI-generated summary" label
