# FR-007 Primer: Donation Flow & Modal

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 9, 2026
**Status:** COMPLETE
**Previous work:** FR-001 through FR-006 complete (scaffold, data, store, all three pages).

---

## What Is This Ticket?

FR-007 is the **donation flow** — the single action that touches every page type with real-time state updates. Clicking "Donate" on a fundraiser page opens a modal, and confirming a donation atomically updates the fundraiser, donor profile, and community aggregates.

### Why Does This Exist?

The donation flow is the proof that cross-page state management works. A donation made on the fundraiser page must instantly reflect on the donor's profile, the community's aggregate stats, and the homepage totals. This is the core UX promise of the platform.

---

## What Was Built

### DonationModal Component (`components/DonationModal.tsx`)
- **Amount selection:** Preset buttons ($25, $50, $100, $250) + custom amount input
- **Optional message:** Text input for donor message
- **Donor selection:** "Donating as" dropdown of existing users (simulates auth)
- **Actions:** Cancel (closes modal) / Confirm (triggers `addDonation()`, closes modal)
- **Accessibility:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap (Tab/Shift+Tab cycles within modal, Escape closes)
- **Animation:** Progress bar uses CSS transition 500ms ease-out on update

### Integration in FundraiserPageContent
- Donate button opens modal; on confirm, `addDonation()` runs
- Focus returns to Donate button after modal close
- Toast notification: "Donation added! View it on your profile →" with link to `/u/[donorUsername]`
- Toast uses `aria-live="polite"`, auto-dismisses after 4s
- Donor wall updates immediately from store (new donation appears at top)

---

## Key Files

| File | Role |
|------|------|
| `components/DonationModal.tsx` | Modal overlay with amount presets, focus trap, ARIA |
| `components/FundraiserPageContent.tsx` | Modal state management, toast, Donate button wiring |
| `lib/store/index.ts` | `addDonation()` atomic mutation |

---

## Definition of Done (all met)

- [x] Donate opens modal overlay
- [x] Modal: amount presets, custom input, optional message, Confirm
- [x] On confirm: addDonation(), modal closes, progress animates (500ms), new donation at top of donor wall
- [x] Toast with profile link; focus trap and Escape; ARIA dialog
