# FR-052 Primer: ItemList Schema on Profile Pages

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-014 complete — schema builders exist in `lib/schema/index.ts` (`buildFundraiserSchema`, `buildCommunitySchema`, `buildProfileSchema`, `buildHomepageSchema`, `buildBreadcrumbSchema`). Profile page renders `ProfilePage` + `Person` JSON-LD. All schema output piped through `<JsonLd>` component.

---

## What Is This Ticket?

FR-052 adds a new `buildProfileItemListSchema()` function to the schema library that emits a schema.org `ItemList` of fundraisers associated with a user (organized or supported). This targets Google's carousel/list rich result for queries like "[person name] fundraisers."

### Why Does This Exist?

Google renders `ItemList` schemas as carousel cards or numbered lists in SERPs. For a fundraising platform, having a user's fundraisers appear as a rich carousel when someone searches their name dramatically increases click-through rate. This is a high-value AEO signal that most fundraising platforms completely miss.

### Dependencies

- **FR-027 (Extended User Types):** Needs user data that tracks which fundraisers a user has organized/supported. If FR-027 is not yet complete, the builder can fall back to filtering fundraisers by `organizerId`.

### Current State

- `lib/schema/index.ts` has five builders — no `ItemList` support
- `app/u/[username]/page.tsx` renders `ProfilePage` + `Person` + `BreadcrumbList` schemas
- `buildBreadcrumbSchema` already uses `ListItem` internally — similar pattern
- Profile page has access to seed data to find user's fundraisers

---

## FR-052 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| New builder | `buildProfileItemListSchema(user, fundraisers)` exported from `lib/schema/index.ts` |
| Schema type | `@type: "ItemList"` with `itemListElement` array |
| List items | Each item: `@type: "ListItem"`, `position`, `name`, `url` |
| Items included | Fundraisers the user has organized (and optionally supported) |
| Injection | Added to `<JsonLd>` output on profile page |
| Empty state | Returns `null` or empty array when user has no fundraisers |

---

## Deliverables Checklist

### A. Schema Builder

- [ ] Add `buildProfileItemListSchema(user: User, fundraisers: Fundraiser[])` to `lib/schema/index.ts`
- [ ] Return `@type: "ItemList"` with `@context: "https://schema.org"`
- [ ] Set `@id` using `entityId()` pattern: `/u/${username}#itemlist`
- [ ] Map fundraisers to `ListItem` entries with `position` (1-indexed), `name`, `url`
- [ ] Return `null` if fundraisers array is empty (no empty ItemList in output)

### B. Profile Page Integration

- [ ] In `app/u/[username]/page.tsx`, find user's fundraisers from seed data
- [ ] Call `buildProfileItemListSchema(user, userFundraisers)`
- [ ] Add to schemas array (if not null) passed to `<JsonLd>`

### C. SchemaViewer Support

- [ ] Verify `ItemList` renders correctly in the SchemaViewer panel
- [ ] Add color badge for `ItemList` type in `typeColor()` if needed (FR-054 handles this — skip if deferring)

---

## Files to Create

| File | Role |
|------|------|
| None | All changes are modifications to existing files |

## Files to Modify

| File | Action |
|------|--------|
| `lib/schema/index.ts` | Add `buildProfileItemListSchema()` function |
| `app/u/[username]/page.tsx` | Query user fundraisers, call builder, add to JsonLd |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/schema/index.ts` | Existing builder patterns, `entityId()`, `absoluteUrl()` |
| `app/u/[username]/page.tsx` | Current profile page schema injection |
| `lib/data/index.ts` | `User` and `Fundraiser` types, seed data structure |
| `components/JsonLd.tsx` | How schemas are rendered in HTML |

---

## Definition of Done for FR-052

- [ ] `buildProfileItemListSchema()` exported from `lib/schema/index.ts`
- [ ] Profile pages render `ItemList` JSON-LD when user has fundraisers
- [ ] Each `ListItem` has `position`, `name`, and `url`
- [ ] No `ItemList` emitted when user has zero fundraisers
- [ ] Schema visible in SchemaViewer panel on profile pages
