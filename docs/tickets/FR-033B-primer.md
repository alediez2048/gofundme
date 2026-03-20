# FR-033B Primer: GoFundMe-Native Design Tokens

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 20, 2026
**Previous work:** FR-001 through FR-025 complete. Visual redesign (commit 25425e0) updated Tailwind config with custom theme. This ticket audits and aligns those tokens with GoFundMe's exact production values.

---

## What Is This Ticket?

FR-033B establishes the **GoFundMe-native design token system** that every feed component must use. It audits the existing `tailwind.config.ts` against GoFundMe's production CSS values and ensures exact parity — so the feed feels like a natural extension of the Profile, Fundraiser, and Community pages, not a LinkedIn clone.

This is a **gatekeeper ticket** — all Phase 2 UI tickets (FR-034 through FR-045) depend on these tokens being correct before components are built.

### Why Does This Exist?

The feed must feel like GoFundMe, not LinkedIn. If the feed uses 8px border-radius while fundraiser pages use 16px, or if the feed background is LinkedIn's #F3F2EF instead of GoFundMe's #fafafa, the visual break destroys the "one product" illusion. This ticket ensures every component built in Phase 2 uses the same visual language as the existing clone pages.

### Dependencies

- None — this can start immediately

### Current State

- `tailwind.config.ts` has a custom theme with 50+ semantic color tokens, custom spacing, and typography scales
- The visual redesign (commit 25425e0) moved toward GoFundMe styling but may not match exact production values
- `app/globals.css` has global styles
- No CSS custom properties (`:root` variables) for the GoFundMe design tokens
- Components use Tailwind classes, not CSS variables — tokens must be in the Tailwind config

---

## FR-033B Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Brand colors | `--gfm-green: #00b964`, `--gfm-green-light: #e6f9f0`, `--gfm-green-hover: #00a358` mapped to Tailwind |
| Neutrals | `#1a1a1a` (headings), `#333` (body), `#6b6b6b` (secondary), `#999` (tertiary), `#e0e0e0` (borders), `#f5f5f5` (hover bg) |
| Surfaces | Page bg `#fafafa` (NOT LinkedIn's `#F3F2EF`), card bg `#fff` |
| Border radius | Cards `16px` (NOT LinkedIn's `8px`), inner elements `10px`, buttons/pills `50px` |
| Typography | DM Sans as primary font |
| Progress bar | 8px height, solid `#00b964` fill, 4px radius — identical to fundraiser page |
| Engagement bar | Gray-600 buttons, 10px rounded hover, red `#e74c3c` for hearted state |
| Green gradient | `linear-gradient(135deg, #b2f5d8 0%, #6ee7a8 50%, #00b964 100%)` for identity card + milestones |
| Visual continuity | Feed components match their detail page counterparts exactly |

---

## Deliverables Checklist

### A. Audit Existing Tailwind Config

- [ ] Read current `tailwind.config.ts` and map each token to GoFundMe production values
- [ ] Identify mismatches between current config and GoFundMe's exact values
- [ ] Document which tokens need updating vs. which are correct

### B. Update Tailwind Design Tokens

- [ ] **Colors** — ensure these exact values exist in the Tailwind theme:
  - `brand.green` / `primary`: `#00b964`
  - `brand.green-light`: `#e6f9f0`
  - `brand.green-hover`: `#00a358`
  - `text.heading`: `#1a1a1a`
  - `text.body`: `#333`
  - `text.secondary`: `#6b6b6b`
  - `text.tertiary`: `#999`
  - `border.default`: `#e0e0e0`
  - `bg.hover`: `#f5f5f5`
  - `bg.page`: `#fafafa`
  - `bg.card`: `#ffffff`
  - `engagement.heart`: `#e74c3c`
- [ ] **Border radius** — ensure these values:
  - `rounded-card`: `16px` (feed cards, sidebar cards)
  - `rounded-card-sm`: `10px` (inner elements, embedded cards, hover targets)
  - `rounded-pill`: `50px` (buttons, pills, search bar)
- [ ] **Spacing** — feed-specific layout values:
  - Feed grid: `max-w-[1200px]`, columns `260px 1fr 300px`, gap `24px`
  - Sidebar sticky top: `88px` (64px nav + 24px padding)
- [ ] **Shadows** — card shadow: `0 1px 3px rgba(0, 0, 0, 0.04)` (subtle, NOT LinkedIn's flat)

### C. Add CSS Custom Properties (Optional)

- [ ] Add `:root` variables in `app/globals.css` for the GoFundMe design tokens
- [ ] These serve as a reference and can be used alongside Tailwind classes
- [ ] NOT required if all values are properly in the Tailwind config

### D. Create Component Style Guide Reference

- [ ] Document Tailwind class recipes for common patterns:
  - **Card**: `bg-white rounded-[16px] border border-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]`
  - **Follow button**: `px-4 py-1.5 rounded-full border-[1.5px] border-black text-xs font-bold hover:bg-black hover:text-white`
  - **Join button**: `px-4 py-1.5 rounded-full border-[1.5px] border-green-600 text-green-600 text-xs font-bold hover:bg-green-600 hover:text-white`
  - **Progress bar**: `h-2 bg-gray-100 rounded-[4px]` with fill `bg-[#00b964] rounded-[4px]`
  - **Engagement button**: `flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-[10px] text-[13px] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900`
  - **Donor quote**: `bg-[#e6f9f0] p-3 rounded-[10px] border-l-[3px] border-[#00b964] italic text-sm`
  - **Identity banner gradient**: `bg-gradient-to-br from-[#b2f5d8] via-[#6ee7a8] to-[#00b964]`
  - **Discover avatars**: `w-7 h-7 rounded-full border-2 border-white -ml-2`

### E. Visual Continuity Verification

- [ ] Verify existing ProgressBar component uses `#00b964` solid fill (not gradient)
- [ ] Verify existing profile avatar sizing matches feed avatar sizing (44px circular)
- [ ] Verify existing card radius on fundraiser/community pages matches 16px
- [ ] Fix any mismatches found

---

## Files to Modify

| File | Action |
|------|--------|
| `tailwind.config.ts` | Update/add color tokens, border-radius, shadow values to match GoFundMe production |
| `app/globals.css` | Optionally add `:root` CSS custom properties |

### Files to READ for Context

| File | Why |
|------|-----|
| `tailwind.config.ts` | Current theme — audit against GoFundMe values |
| `app/globals.css` | Current global styles |
| `components/ProgressBar.tsx` | Verify progress bar uses correct green |
| `components/ProfilePageContent.tsx` | Verify avatar/banner styling |
| `components/FundraiserPageContent.tsx` | Verify card radius and typography |
| `components/Header.tsx` | Current nav pattern |
| `fundright-prd-2.0.md` | Design tokens section for exact values |

---

## Definition of Done for FR-033B

- [ ] All GoFundMe brand colors are in `tailwind.config.ts` with exact hex values
- [ ] Card border-radius is 16px (not 8px) everywhere
- [ ] Page background is #fafafa (not LinkedIn's #F3F2EF)
- [ ] Progress bar uses solid #00b964 green fill
- [ ] Button pills use 50px fully rounded radius
- [ ] Component style guide recipes documented (Tailwind class patterns for common components)
- [ ] Existing clone pages still look correct after token updates (no visual regression)
- [ ] TypeScript compiles without errors
