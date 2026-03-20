# FR-060 Primer: Test Infrastructure Setup

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** Vitest is already configured (`"test": "vitest run"`, `"test:watch": "vitest"` in package.json). One test file exists: `lib/store/__tests__/store.test.ts` using `describe/it/expect/beforeEach` from Vitest with `createFundRightStore()`. No component testing or E2E testing infrastructure.

---

## What Is This Ticket?

FR-060 sets up the complete test infrastructure for the project: installs testing libraries (@testing-library/react, @testing-library/jest-dom, @playwright/test, @axe-core/playwright, @lhci/cli, @next/bundle-analyzer), configures Vitest for component testing with jsdom, creates factory functions for test data, and sets up localStorage mocking for Zustand persist.

### Why Does This Exist?

The project has one unit test file but no component testing, no E2E testing, and no accessibility/performance audit tooling. Before writing the P0/P1 tests (FR-061, FR-062) and E2E tests (FR-063), the infrastructure must be in place: jsdom environment for React component rendering, test factories for consistent mock data, and localStorage mocking so Zustand persist doesn't break tests.

### Dependencies

- None — can start immediately. This is foundational infrastructure.

### Current State

- `package.json` has Vitest 4.1.0 as devDependency
- `"test": "vitest run"` and `"test:watch": "vitest"` scripts exist
- One test file: `lib/store/__tests__/store.test.ts`
- Test file uses `createFundRightStore()` pattern — creates fresh store per test via `beforeEach`
- No `vitest.config.ts` or `vitest.workspace.ts` found (may use config in `vite.config.ts` or inline)
- No @testing-library packages installed
- No Playwright installed
- No axe-core or Lighthouse CI installed

---

## FR-060 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Dependencies | @testing-library/react, @testing-library/jest-dom, @playwright/test, @axe-core/playwright, @lhci/cli, @next/bundle-analyzer installed |
| Vitest config | jsdom environment configured for component tests |
| Test utils | `lib/test-utils.ts` with factory functions for all entity types |
| Factories | `createMockFeedEvent`, `createMockUser`, `createMockFundraiser`, `createMockCommunity` |
| localStorage mock | Zustand persist works in test environment without errors |
| Existing tests pass | `lib/store/__tests__/store.test.ts` still passes after changes |

---

## Deliverables Checklist

### A. Install Dependencies

- [ ] `npm install -D @testing-library/react @testing-library/jest-dom`
- [ ] `npm install -D @playwright/test @axe-core/playwright`
- [ ] `npm install -D @lhci/cli`
- [ ] `npm install -D @next/bundle-analyzer`
- [ ] Verify all install without conflicts

### B. Vitest Configuration for Component Testing

- [ ] Create or update `vitest.config.ts` (or config section)
- [ ] Set `environment: 'jsdom'` for component test files
- [ ] Configure `setupFiles` to include jest-dom matchers
- [ ] Create `lib/test-setup.ts`:
  - Import `@testing-library/jest-dom`
  - Mock `localStorage` (or use jsdom's built-in)
  - Mock `window.matchMedia` if needed
  - Mock `IntersectionObserver` if needed
- [ ] Ensure path aliases (`@/`) resolve correctly in tests

### C. Test Factory Functions (`lib/test-utils.ts`)

- [ ] `createMockUser(overrides?: Partial<User>): User`
  - Sensible defaults: id, username, name, bio, avatar, joinDate, totalDonated
- [ ] `createMockFundraiser(overrides?: Partial<Fundraiser>): Fundraiser`
  - Sensible defaults: id, slug, title, story, goalAmount, raisedAmount, organizerId, communityId
- [ ] `createMockCommunity(overrides?: Partial<Community>): Community`
  - Sensible defaults: id, slug, name, description, totalRaised, donationCount, fundraiserCount
- [ ] `createMockFeedEvent(overrides?: Partial<FeedEvent>): FeedEvent`
  - Sensible defaults: id, type, timestamp, actor, content
- [ ] Each factory uses incrementing IDs to avoid collisions
- [ ] Export a `renderWithProviders()` wrapper if components need context

### D. localStorage Mock for Zustand

- [ ] Ensure Zustand persist middleware works in jsdom
- [ ] If jsdom's localStorage is sufficient, document that
- [ ] If not, create a mock implementation in test-setup
- [ ] Verify existing store tests still pass: `npm run test`

### E. Playwright Configuration

- [ ] Create `playwright.config.ts` with:
  - Base URL pointing to dev server
  - Test directory: `e2e/` or `tests/e2e/`
  - Browser: chromium (minimum)
  - Screenshot on failure
- [ ] Create `e2e/` directory with a placeholder test
- [ ] Add npm script: `"test:e2e": "playwright test"`
- [ ] Add `"test:e2e:ui": "playwright test --ui"` for visual debugging

### F. Lighthouse CI Configuration

- [ ] Create `lighthouserc.js` or `.lighthouserc.json` with:
  - URLs to audit (homepage, fundraiser page, community page, profile page)
  - Assertions: LCP ≤ 1.8s, CLS ≤ 0.1, TBT ≤ 200ms
- [ ] Add npm script: `"test:lighthouse": "lhci autorun"`

---

## Files to Create

| File | Role |
|------|------|
| `lib/test-utils.ts` | Factory functions and test helpers |
| `lib/test-setup.ts` | Vitest setup file (jest-dom, mocks) |
| `vitest.config.ts` | Vitest configuration (if not already present) |
| `playwright.config.ts` | Playwright E2E configuration |
| `e2e/smoke.spec.ts` | Placeholder E2E test |
| `lighthouserc.js` | Lighthouse CI configuration |

## Files to Modify

| File | Action |
|------|--------|
| `package.json` | Add devDependencies + test:e2e, test:lighthouse scripts |
| `next.config.js` | Add @next/bundle-analyzer wrapping (conditional on ANALYZE env) |

### Files to READ for Context

| File | Why |
|------|-----|
| `package.json` | Current deps and scripts |
| `lib/store/__tests__/store.test.ts` | Existing test patterns — must not break |
| `lib/store/index.ts` | Store creation pattern, persist middleware usage |
| `lib/data/index.ts` | Entity types for factory functions |
| `next.config.js` | Current config to add bundle-analyzer |

---

## Definition of Done for FR-060

- [ ] All dependencies installed and `npm install` succeeds
- [ ] Vitest configured with jsdom for component tests
- [ ] `lib/test-utils.ts` exports all four factory functions
- [ ] `lib/test-setup.ts` configures jest-dom and localStorage mock
- [ ] Existing store tests pass: `npm run test`
- [ ] Playwright config exists with placeholder test
- [ ] Lighthouse CI config exists with performance assertions
- [ ] Bundle analyzer configured in next.config.js
- [ ] `npm run test:e2e` runs without configuration errors
