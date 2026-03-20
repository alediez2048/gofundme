# FR-024 Primer: Trust Summaries & Impact Projections

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 14, 2026
**Previous work:** FR-001 through FR-014 complete (except FR-013). FR-018, FR-020, FR-023 also complete. AI service foundation (`lib/ai/`) is ready. Fundraiser page and donation modal exist. See `docs/development/DEVLOG.md`.

---

## What Is This Ticket?

FR-024 adds two features: **trust summaries** on fundraiser pages (inline organizer credibility narratives near the Donate CTA) and **impact projections** in the donation modal (dynamic statements showing what the donor's money will accomplish).

### Why Does This Exist?

Trust is the biggest barrier to donation. A donor about to click "Donate" needs instant reassurance: "This organizer has raised $12K across 3 campaigns and is active in the Watch Duty community." Impact projections ("Your $50 provides wildfire alerts to 200 families") translate abstract dollar amounts into tangible outcomes, increasing conversion.

### Dependencies

- **FR-020 (AI Service Foundation):** COMPLETE — callAI(), retrieval, tracing, fallback
- **FR-004 (Fundraiser Page):** COMPLETE — Donate CTA area exists
- **FR-007 (Donation Modal):** COMPLETE — Amount selection UI exists

---

## FR-024 Contract (from PRD)

### Trust Summaries (Fundraiser Page)

| Criterion | Detail |
|-----------|--------|
| Placement | Inline near the Donate CTA |
| Content | "Janahan has organized 3 fundraisers raising $12,400 total. Verified organizer since 2024. Active in the Watch Duty community." |
| Structured retrieval | Pull organizer's full history from store: all fundraisers, total raised, communities, verification |
| Enhanced (with API key) | LLM generates natural-language trust narrative from retrieved data, traced |
| Fallback (no API key) | Template: "{name} has organized {count} fundraisers raising {total}. Member of {communities}." |

### Impact Projections (Donation Modal)

| Criterion | Detail |
|-----------|--------|
| Placement | Below amount input in donation modal |
| Content | Dynamic: "Your $50 provides wildfire alerts to 200 families for one month" |
| Data source | `causeImpactMap` in seed data — maps cause categories to impact units and rates |
| No LLM | Pure client-side math with template strings |
| Updates dynamically | Recalculates as donor changes amount |

---

## Deliverables Checklist

### A. Trust Summaries

- [ ] **Retrieval function** (`lib/ai/trust-summary.ts` or similar):
  - Use `buildOrganizerContext()` from `retrieval.ts` to get organizer's fundraisers, total raised, communities, verification
  - Format as structured input for LLM or template
- [ ] **Enhanced (AI):** System prompt: "Given this organizer's history, write a 1–2 sentence trust summary for a potential donor. Be specific with numbers."
- [ ] **Fallback (template):** "{name} has organized {count} fundraiser(s) raising {formatCurrency(total)} total. {verified ? 'Verified organizer.' : ''} Member of {communities}."
- [ ] **UI:** Render inline near Donate CTA in `FundraiserPageContent.tsx` — subtle trust badge/card with the summary text
- [ ] **Tracing:** AI version creates AITrace with feature='trust-summary'

### B. Impact Projections

- [ ] **Cause impact map** in seed data (`lib/data/seed.ts` or `lib/data/impact.ts`):
  ```typescript
  const causeImpactMap: Record<string, { unit: string; rate: number; template: string }> = {
    'Wildfire Relief': { unit: 'families with wildfire alerts', rate: 4, template: 'Your ${amount} provides wildfire alerts to {impact} families for one month' },
    'Medical': { unit: 'medical supplies kits', rate: 0.1, template: 'Your ${amount} funds {impact} medical supply kits' },
    // ...
  };
  ```
- [ ] **Calculation:** `impact = Math.floor(amount * rate)` — pure client-side math
- [ ] **UI:** Render below amount input in `DonationModal.tsx` — updates as amount changes
- [ ] **Edge cases:** $0 or very small amounts show no projection; unknown categories show generic "Your donation makes a difference"

### C. Data Changes

- [ ] Add `causeImpactMap` to seed data or create dedicated impact data file
- [ ] Ensure each seed cause category has an entry in the map

---

## Files to Create

| File | Role |
|------|------|
| `lib/ai/trust-summary.ts` | Trust summary generation (AI + fallback) |
| `lib/data/impact.ts` (optional) | Cause impact map data |

## Files to Modify

| File | Action |
|------|--------|
| `components/FundraiserPageContent.tsx` | Inline trust summary near Donate CTA |
| `components/DonationModal.tsx` | Impact projection below amount input |
| `lib/ai/fallback.ts` | Register trust-summary fallback |
| `lib/data/seed.ts` | Add causeImpactMap (if not separate file) |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/ai/service.ts` | callAI() interface |
| `lib/ai/retrieval.ts` | buildOrganizerContext() for trust data |
| `lib/ai/cause-intelligence.ts` | Reference: RAG feature pattern |
| `components/FundraiserPageContent.tsx` | Donate CTA area where trust summary goes |
| `components/DonationModal.tsx` | Amount input area where projection goes |

---

## Definition of Done for FR-024

- [ ] Trust summary inline near Donate CTA on fundraiser pages
- [ ] Structured retrieval: organizer history, fundraisers, communities, verification
- [ ] Enhanced (AI): natural-language trust narrative, traced
- [ ] Fallback: template-based trust summary (no API key)
- [ ] Impact projection below amount in donation modal
- [ ] Impact from causeImpactMap — pure client-side math
- [ ] Dynamic update as donor changes amount
- [ ] DEVLOG updated with FR-024 entry
