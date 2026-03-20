# FR-053 Primer: dateModified Accuracy

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-014 complete — all schema builders accept an optional `lastModified?: string` parameter. Currently, all callers pass `new Date().toISOString()` (current time) instead of real entity timestamps. JSON-LD output includes `dateModified` but the value is always "now."

---

## What Is This Ticket?

FR-053 replaces the `new Date().toISOString()` calls in schema builders with real timestamps derived from the most recent donation, milestone, or update event for each entity. This makes `dateModified` reflect actual content freshness rather than page render time.

### Why Does This Exist?

Perplexity and other AI answer engines weight `dateModified` at approximately 40% for freshness scoring. A page that says it was modified "just now" on every render looks suspicious — search engines may discount it. Using real timestamps (e.g., the most recent donation to a fundraiser) signals genuine content freshness and improves AEO ranking.

### Dependencies

- **FR-031 (Feed Event Generation):** Provides real timestamps from donation events, milestones, and community activity. These timestamps are the source of truth for `dateModified`.

### Current State

- `app/f/[slug]/page.tsx` line 38: `buildFundraiserSchema(fundraiser, organizer, community, new Date().toISOString())`
- `app/u/[username]/page.tsx` line 27: `buildProfileSchema(user, new Date().toISOString())`
- `app/communities/[slug]/page.tsx` line 34: `buildCommunitySchema(community, community.faq, new Date().toISOString())`
- All three pass current time instead of real last-modified timestamps

---

## FR-053 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Fundraiser dateModified | Most recent donation timestamp or fundraiser creation date |
| Community dateModified | Most recent donation to any community fundraiser, or community creation date |
| Profile dateModified | Most recent activity by user (donation, fundraiser creation) |
| No "now" timestamps | `new Date().toISOString()` removed from all schema builder calls |
| Fallback | If no real timestamp available, use entity creation date |

---

## Deliverables Checklist

### A. Timestamp Resolution Helpers

- [ ] Create helper function(s) to compute real `lastModified` for each entity type
- [ ] Fundraiser: find most recent donation timestamp for that fundraiser, fall back to creation date
- [ ] Community: find most recent donation timestamp across all community fundraisers, fall back to creation date
- [ ] Profile: find most recent donation or fundraiser creation by that user, fall back to join date

### B. Update Schema Builder Calls

- [ ] `app/f/[slug]/page.tsx`: Replace `new Date().toISOString()` with real fundraiser lastModified
- [ ] `app/u/[username]/page.tsx`: Replace `new Date().toISOString()` with real profile lastModified
- [ ] `app/communities/[slug]/page.tsx`: Replace `new Date().toISOString()` with real community lastModified

### C. Data Access

- [ ] Determine where donation timestamps live (seed data `donations` array, Zustand store, or feed events)
- [ ] If feed events from FR-031 are available, use those timestamps
- [ ] If not, compute from seed donation data (`donation.date` or similar field)

---

## Files to Create

| File | Role |
|------|------|
| `lib/schema/timestamps.ts` (optional) | Helper functions for computing real lastModified timestamps |

## Files to Modify

| File | Action |
|------|--------|
| `app/f/[slug]/page.tsx` | Replace `new Date().toISOString()` with real timestamp |
| `app/u/[username]/page.tsx` | Replace `new Date().toISOString()` with real timestamp |
| `app/communities/[slug]/page.tsx` | Replace `new Date().toISOString()` with real timestamp |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/schema/index.ts` | Schema builders and how `lastModified` param is used |
| `lib/data/index.ts` | Donation type — check for timestamp fields |
| `lib/data/seed.ts` | Seed donation data — see what date fields exist |
| `app/f/[slug]/page.tsx` | Current `new Date().toISOString()` usage |
| `app/u/[username]/page.tsx` | Current `new Date().toISOString()` usage |
| `app/communities/[slug]/page.tsx` | Current `new Date().toISOString()` usage |

---

## Definition of Done for FR-053

- [ ] No `new Date().toISOString()` passed to schema builders
- [ ] Fundraiser `dateModified` reflects most recent donation or creation date
- [ ] Community `dateModified` reflects most recent community activity
- [ ] Profile `dateModified` reflects most recent user activity
- [ ] Fallback to entity creation date when no activity exists
- [ ] Schema output verifiable in SchemaViewer panel
