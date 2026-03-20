# FR-025 Primer: AI Traces Panel

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 14, 2026
**Previous work:** FR-001 through FR-014 complete (except FR-013). FR-018, FR-020, FR-023 also complete. AI service foundation (`lib/ai/`) is ready and tracing infrastructure exists. See `docs/development/DEVLOG.md`.

---

## What Is This Ticket?

FR-025 is the **AI traces panel** — a visible dashboard showing every AI interaction the platform made. An evaluator can see what was asked, what tools were called, what context was retrieved, how long it took, and whether it used real AI or a fallback.

### Why Does This Exist?

The traces panel is the proof that the AI system is intentional, not bolted-on. An evaluator doesn't have to open DevTools or trust claims in a README — they can click a button and see every AI call with its full trace: input, output, latency, tokens, tool chain, fallback reason. This is the observability story.

### Dependencies

- **FR-020 (AI Service Foundation):** COMPLETE — trace infrastructure exists, `AITrace` type defined, traces logged to stdout
- **Other AI features (FR-021–FR-024):** The panel shows traces from whatever features are complete. Best saved for last to capture all traces.

### Current State

- `AITrace` type defined in `lib/ai/trace.ts`
- Traces are logged to stdout as JSON
- No Zustand `traces` slice yet (needs to be added or may exist)
- No UI for viewing traces

---

## FR-025 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Access | Dev-mode floating "AI" badge (bottom-right) or `/ai-traces` route |
| Trace list | All traces from store, most recent first |
| Trace detail | Feature name, timestamp, status, input, tool calls, RAG context, output, metrics, fallback reason |
| Summary stats | Total traces, avg latency, total tokens, fallback rate |
| Filters | By feature, status, date range |
| Clear button | Reset all traces |
| Works without API key | Shows fallback traces when AI unavailable |

---

## Deliverables Checklist

### A. Traces Store (Zustand)

- [ ] Add `traces: Record<id, AITrace>` slice to Zustand store (or dedicated store)
- [ ] `addTrace(trace: AITrace)` action
- [ ] Cap at 100 traces (FIFO — remove oldest when limit hit)
- [ ] Persist to localStorage (or keep ephemeral — evaluator preference)
- [ ] Wire `callAI()` in `service.ts` to call `addTrace()` after each AI interaction

### B. Traces Panel UI

**Option A: Floating badge + overlay**
- [ ] Floating "AI" badge in bottom-right corner (all pages)
- [ ] Click opens slide-out panel or modal with trace list
- [ ] Badge shows trace count

**Option B: Dedicated route**
- [ ] `/ai-traces` page
- [ ] Link in footer or dev toolbar

**Recommended:** Do both — badge for quick access, route for full view.

### C. Trace List View

- [ ] **Summary stats bar:** Total traces, avg latency (ms), total tokens used, fallback rate (%)
- [ ] **List:** Each trace as expandable card:
  - Feature name (color-coded badge: creation-assistant, discovery, cause-intelligence, trust-summary)
  - Timestamp (relative: "2 minutes ago")
  - Status badge: success (green), fallback (amber), error (red)
  - Collapsed: one-line summary
  - Expanded: full detail (see below)
- [ ] **Filters:** Dropdown for feature, status, date range picker
- [ ] **Clear button:** "Clear all traces" with confirmation

### D. Trace Detail View (expanded)

- [ ] **Input:** The prompt or user action that triggered the AI call
- [ ] **Tool calls:** Ordered list with name, inputs, outputs for each
- [ ] **RAG context:** Retrieved entity IDs, snippets, source count
- [ ] **Output:** Final generated text or structured response
- [ ] **Metrics:** Latency (ms), input tokens, output tokens, total tokens, tool call count
- [ ] **Fallback reason:** If status is "fallback" — why (no API key, timeout, error)

### E. Edge Cases

- [ ] Zero traces: "No AI traces yet. Use an AI feature to see traces here."
- [ ] All fallbacks: "All interactions used fallback (no API key configured)"
- [ ] Works with and without API key

---

## Files to Create

| File | Role |
|------|------|
| `app/ai-traces/page.tsx` | Traces panel route |
| `components/TracesPanel.tsx` | Trace list + detail UI |
| `components/TracesBadge.tsx` | Floating badge component (optional) |

## Files to Modify

| File | Action |
|------|--------|
| `lib/store/index.ts` | Add traces slice + addTrace action (if not separate store) |
| `lib/ai/service.ts` | Wire callAI() to store traces via addTrace() |
| `lib/ai/trace.ts` | Export types needed by UI |
| `app/layout.tsx` | Add floating TracesBadge (if using badge approach) |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/ai/trace.ts` | AITrace type definition |
| `lib/ai/service.ts` | Where traces are created |
| `lib/store/index.ts` | Current store structure for adding traces slice |

---

## Definition of Done for FR-025

- [ ] Traces panel accessible via floating badge or /ai-traces route
- [ ] Lists all traces, most recent first
- [ ] Each trace shows: feature, timestamp, status, input, tool calls, RAG context, output, metrics, fallback reason
- [ ] Summary stats: total traces, avg latency, total tokens, fallback rate
- [ ] Filter by feature, status, date range
- [ ] Clear traces button
- [ ] Works without API key (shows fallback traces)
- [ ] DEVLOG updated with FR-025 entry
