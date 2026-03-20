# FR-054 Primer: Feed Page SEO (noindex + Schema Viewer Updates)

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-014 complete — SchemaViewer exists in `components/SchemaViewer.tsx` with `typeColor()` mapping and JSON-LD parsing. SchemaViewerToggle provides the floating button. Feed page exists from FR-042.

---

## What Is This Ticket?

FR-054 handles SEO hygiene for the feed page (auth-gated content should not be indexed) and enhances the SchemaViewer with richer metadata: an `ItemList` color badge, "Rich Result Eligibility" summary, and validation status indicators.

### Why Does This Exist?

Auth-gated content that gets indexed creates a poor search experience — users click through and hit a login wall. Adding `noindex` tells search engines to skip the feed page. The SchemaViewer enhancements make it a more powerful evaluation tool: an interviewer or evaluator can see at a glance which rich results each schema qualifies for and whether the data is valid.

### Dependencies

- **FR-042 (FeedPage):** The feed page must exist to add noindex to it.
- **FR-052 (ItemList Schema):** The `ItemList` type needs a color badge in the SchemaViewer.

### Current State

- `components/SchemaViewer.tsx` has `typeColor()` with badges for: DonateAction, Organization, FAQPage, ProfilePage, Person, WebSite, BreadcrumbList
- No `ItemList` badge exists
- No validation indicators or rich result eligibility summary
- Feed page has no `robots` metadata

---

## FR-054 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Feed noindex | Feed page renders `<meta name="robots" content="noindex">` via Next.js metadata |
| ItemList badge | `typeColor()` returns a distinct color for `ItemList` type |
| Rich Result summary | SchemaViewer shows which Google rich result each schema type qualifies for |
| Validation indicators | Green check for valid schemas, red X for invalid/incomplete schemas |

---

## Deliverables Checklist

### A. Feed Page noindex

- [ ] In feed page metadata (or layout), add `robots: { index: false, follow: true }`
- [ ] Verify `<meta name="robots" content="noindex, follow">` appears in page head

### B. SchemaViewer: ItemList Badge

- [ ] Add `case "ItemList":` to `typeColor()` in `components/SchemaViewer.tsx`
- [ ] Choose a distinct color that doesn't clash with existing badges

### C. SchemaViewer: Rich Result Eligibility Summary

- [ ] Add a summary section above or below the schema list
- [ ] Map each detected schema type to its Google rich result:
  - `DonateAction` → Donation Card
  - `FAQPage` → FAQ Rich Result
  - `Organization` → Knowledge Panel
  - `ProfilePage` → Profile Rich Result
  - `BreadcrumbList` → Breadcrumb Trail
  - `ItemList` → Carousel / List
  - `WebSite` + `SearchAction` → Sitelinks Search Box
- [ ] Show as a compact list with type name → eligible rich result

### D. SchemaViewer: Validation Indicators

- [ ] For each schema entry, check required fields are present:
  - `DonateAction`: needs `name`, `agent`, `priceSpecification`
  - `Organization`: needs `name`, `url`
  - `FAQPage`: needs `mainEntity` with at least one Question
  - `ProfilePage`: needs `mainEntity` with Person
  - `BreadcrumbList`: needs `itemListElement` with at least one ListItem
  - `ItemList`: needs `itemListElement`
- [ ] Show green checkmark if valid, red X if missing required fields
- [ ] Display validation error message on hover or inline

---

## Files to Create

| File | Role |
|------|------|
| None | All changes are modifications to existing files |

## Files to Modify

| File | Action |
|------|--------|
| `components/SchemaViewer.tsx` | Add ItemList badge, rich result summary, validation indicators |
| Feed page file (e.g., `app/feed/page.tsx`) | Add `robots: { index: false }` to metadata |

### Files to READ for Context

| File | Why |
|------|-----|
| `components/SchemaViewer.tsx` | Current `typeColor()` and schema parsing logic |
| `components/SchemaViewerToggle.tsx` | How the viewer is mounted |
| `lib/schema/index.ts` | All schema builders — know what fields are emitted |
| Feed page file | Current metadata export (if any) |

---

## Definition of Done for FR-054

- [ ] Feed page has `noindex` meta tag in rendered HTML
- [ ] `ItemList` schemas show a distinct color badge in SchemaViewer
- [ ] Rich Result Eligibility summary shows which rich results each schema qualifies for
- [ ] Validation indicators (green check / red X) appear for each schema entry
- [ ] All existing schema types still render correctly in SchemaViewer
