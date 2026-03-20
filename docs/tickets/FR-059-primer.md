# FR-059 Primer: Build-Time Schema Validation

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-014 complete — five schema builders in `lib/schema/index.ts` (fundraiser, community, profile, homepage, breadcrumb). FR-052 adds ItemList. All schemas rendered via `<JsonLd>` component into `<script type="application/ld+json">` tags.

---

## What Is This Ticket?

FR-059 creates a build-time validation system for JSON-LD output. A `validateSchema()` function checks all structured data against schema.org type requirements, and a postbuild npm script renders each page type with seed data, extracts JSON-LD, and validates — failing the build on malformed or missing required fields.

### Why Does This Exist?

Invalid JSON-LD silently degrades SEO — Google won't show rich results for malformed schemas, but you get no error at build time. A postbuild validation step catches regressions before deployment: if someone removes a required field from a schema builder, the build fails instead of silently losing rich result eligibility.

### Dependencies

- **FR-052 (ItemList Schema):** All schema builders should be finalized before building validation against them.

### Current State

- `lib/schema/index.ts` has five builders with no validation
- No `lib/schema/validate.ts` exists
- `package.json` has `"build": "next build"` — no postbuild script
- Vitest is configured for unit tests (`"test": "vitest run"`)

---

## FR-059 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Validation function | `validateSchema(type, data)` in `lib/schema/validate.ts` |
| Schema.org compliance | Validates required fields per schema.org type definitions |
| Postbuild script | npm script that renders each page type, extracts JSON-LD, validates |
| Build failure | Fails build on malformed or missing required fields |
| All types covered | DonateAction, Organization, FAQPage, ProfilePage, Person, WebSite, BreadcrumbList, ItemList |

---

## Deliverables Checklist

### A. Validation Functions (`lib/schema/validate.ts`)

- [ ] `validateSchema(type: string, data: Record<string, unknown>): ValidationResult`
- [ ] `ValidationResult`: `{ valid: boolean, errors: string[] }`
- [ ] Required field checks per type:
  - `DonateAction`: `@context`, `@type`, `name`, `agent` (with `name`), `priceSpecification`
  - `Organization`: `@context`, `@type`, `name`, `url`
  - `FAQPage`: `@context`, `@type`, `mainEntity` (array with ≥1 Question)
  - `ProfilePage`: `@context`, `@type`, `mainEntity` (Person with `name`)
  - `Person`: `@context`, `@type`, `name`
  - `WebSite`: `@context`, `@type`, `name`, `url`
  - `BreadcrumbList`: `@context`, `@type`, `itemListElement` (array with ≥1 ListItem)
  - `ItemList`: `@context`, `@type`, `itemListElement` (array with ≥1 ListItem)
- [ ] `validateAllSchemas(schemas: object[]): ValidationResult` — validates an array of schemas
- [ ] Export all functions

### B. Postbuild Validation Script

- [ ] Create `scripts/validate-schemas.ts` (or `.js`)
- [ ] Import seed data and all schema builders
- [ ] Call each builder with representative seed data
- [ ] Run `validateSchema()` on each output
- [ ] Print results (pass/fail for each schema type)
- [ ] Exit with code 1 if any validation fails

### C. npm Script Integration

- [ ] Add `"postbuild": "npx tsx scripts/validate-schemas.ts"` to `package.json` (or similar)
- [ ] Or add `"validate:schema": "npx tsx scripts/validate-schemas.ts"` as standalone script
- [ ] Ensure it runs after `next build` in CI

### D. Unit Tests

- [ ] Test `validateSchema` with valid data → returns `{ valid: true, errors: [] }`
- [ ] Test with missing required field → returns `{ valid: false, errors: [...] }`
- [ ] Test each schema type at least once
- [ ] Add to `lib/schema/__tests__/validate.test.ts`

---

## Files to Create

| File | Role |
|------|------|
| `lib/schema/validate.ts` | Schema validation functions |
| `scripts/validate-schemas.ts` | Postbuild validation script |
| `lib/schema/__tests__/validate.test.ts` | Unit tests for validation |

## Files to Modify

| File | Action |
|------|--------|
| `package.json` | Add postbuild or validate:schema npm script |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/schema/index.ts` | All schema builders — know what fields they emit |
| `lib/data/index.ts` | Types for seed data used in validation script |
| `lib/data/seed.ts` | Actual seed data to use as test inputs |
| `package.json` | Current scripts and dependencies |
| `lib/store/__tests__/store.test.ts` | Test patterns (Vitest, describe/it/expect) |

---

## Definition of Done for FR-059

- [ ] `validateSchema()` function validates all schema.org types used in the app
- [ ] Postbuild script renders schemas from seed data and validates
- [ ] Build fails if any schema is malformed or missing required fields
- [ ] All 8 schema types have validation rules
- [ ] Unit tests cover valid and invalid cases for each type
- [ ] `npm run build` triggers validation (via postbuild hook or CI step)
