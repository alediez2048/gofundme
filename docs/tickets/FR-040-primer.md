# FR-040 Primer: LeftSidebar (Identity Card)

**For:** New Cursor Agent session
**Project:** FundRight — AI-Powered Fundraising Platform
**Date:** Mar 19, 2026
**Previous work:** FR-001 through FR-025 complete (Phase 1). FR-028 (currentUser concept in store) must be complete.

---

## What Is This Ticket?

FR-040 builds the **LeftSidebar** — a compact identity card that sits in the left column of the feed layout. It shows the current user's profile summary, vanity metrics, quick stats, community list, and saved/bookmarked items.

On desktop it is sticky-positioned. On mobile it is hidden (accessible via the profile icon in the header/bottom nav).

### Why Does This Exist?

The left sidebar gives users a persistent sense of identity and quick access to their communities and saved items. The vanity metrics ("Inspired X people to help") reinforce engagement. It mirrors the LinkedIn-style layout that users expect from social feeds.

### Dependencies

- **FR-028 (currentUser in store):** Needs the `currentUser` concept to display profile data.

### Current State

- Zustand store (`lib/store/index.ts`) has `users: EntityMap<User>` with user data including `displayName`, `username`, `avatarUrl`, `location`, `bio`, etc.
- `Header.tsx` demonstrates accessing a default user: `DEFAULT_PROFILE_USERNAME = "janahan"` looked up in the users map.
- Community data exists in `communities: EntityMap<Community>`.
- No sidebar components exist yet.

---

## FR-040 Contract (from PRD)

### Acceptance Criteria

| Criterion | Detail |
|-----------|--------|
| Profile summary | Avatar, name, headline ("Supporter of X causes"), location |
| Vanity metrics | "Inspired X people to help", follower/following counts |
| Quick stats | Profile viewers (mock), post impressions (mock) |
| My communities | Clickable list linking to community pages |
| Saved items | Bookmarked fundraisers/communities |
| Desktop | Sticky position in left column |
| Mobile | Hidden, accessible via profile icon |

---

## Deliverables Checklist

### A. Identity Card

- [ ] Create `components/feed/LeftSidebar.tsx` as `"use client"` component
- [ ] Read `currentUser` from Zustand store
- [ ] Avatar (circular, existing avatar patterns)
- [ ] Display name and username
- [ ] Headline: "Supporter of X causes" (derive from user's donation history)
- [ ] Location (if available)

### B. Metrics Section

- [ ] "Inspired X people to help" counter
- [ ] Follower / Following counts
- [ ] Profile viewers (mock number)
- [ ] Post impressions (mock number)
- [ ] Each metric as a small stat row

### C. My Communities

- [ ] List of communities the user belongs to
- [ ] Each item clickable → `/communities/[slug]`
- [ ] Community icon/avatar + name
- [ ] "See all" link if more than 5

### D. Saved Items

- [ ] Bookmarked fundraisers (from engagement store)
- [ ] Each item clickable → `/f/[slug]`
- [ ] Compact display: title + mini progress indicator

### E. Responsive Behavior

- [ ] `sticky top-20` positioning on desktop (below header)
- [ ] `hidden md:block` — hidden on mobile
- [ ] Appropriate max-height with scroll if content overflows

---

## Files to Create

| File | Role |
|------|------|
| `components/feed/LeftSidebar.tsx` | Left column identity card + communities + saved items |

## Files to Modify

| File | Action |
|------|--------|
| None | FR-042 (FeedPage) will place this in the grid |

### Files to READ for Context

| File | Why |
|------|-----|
| `lib/store/index.ts` | User data, community data, currentUser access |
| `components/Header.tsx` | Pattern for accessing current user |
| `components/ProfilePageContent.tsx` | Existing profile display patterns |
| `tailwind.config.ts` | Design tokens, spacing |

---

## Definition of Done for FR-040

- [ ] LeftSidebar shows current user avatar, name, headline, location
- [ ] Vanity metrics displayed (inspired count, followers/following)
- [ ] Quick stats shown (mock viewers, impressions)
- [ ] My communities list with clickable links
- [ ] Saved items section with bookmarked fundraisers
- [ ] Sticky on desktop, hidden on mobile
- [ ] DEVLOG updated with FR-040 entry
