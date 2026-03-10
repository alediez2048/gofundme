# GoFundMe Current UX Audit

**Source:** Live page content from gofundme.com + GoFundMe Help Center
**Date:** March 8–9, 2026
**Scope:** Complete platform UX flows + deep audit of three target page types

---

## Table of Contents

1. [Complete UX Flows](#complete-ux-flows)
   - [Sign Up / Login](#flow-1-sign-up--login)
   - [Profile Setup & Update](#flow-2-profile-setup--update)
   - [Fundraiser Creation](#flow-3-fundraiser-creation)
   - [Donation Flow](#flow-4-donation-flow)
   - [Community / Nonprofit Pages](#flow-5-community--nonprofit-pages)
   - [Fundraiser Management](#flow-6-fundraiser-management)
   - [Discovery & Browse](#flow-7-discovery--browse)
   - [Social Actions](#flow-8-social-actions)
2. [Flow Map: Where Our Target Pages Sit](#flow-map-where-our-target-pages-sit)
3. [Target Page Deep Audit](#target-page-deep-audit)
   - [Community Page](#community-page-communitieswatch-duty)
   - [Fundraiser Page](#fundraiser-page-frealtime-alerts-for-wildfire-safety-r5jkk)
   - [Profile Page](#profile-page-ujanahan)
4. [Cross-Page Analysis](#cross-page-analysis-the-journey-gap)
5. [Summary](#summary-gofundmes-three-pages-as-isolated-surfaces)

---

# Complete UX Flows

## Flow 1: Sign Up / Login

### Steps

| # | Screen | What Happens |
|---|--------|-------------|
| 1 | Landing / any page | User clicks "Sign up" or hits an action requiring auth |
| 2 | Sign-up form | **Two paths:** email (name + email + password) or OAuth (Google, Facebook, Apple) |
| 3 | Email verification | Verification email sent within ~10 min. Click "Verify email" to confirm |
| 4 | Done | Redirected back. No onboarding wizard, no forced profile setup |

### Key Details

- **No phone number required** at signup
- **No onboarding flow** — platform pushes straight to "Start a GoFundMe"
- **Profile defaults to Private** — users must proactively opt into Public
- **Email verification is deferred** — required for bank transfers but NOT for browsing, creating a fundraiser draft, or donating
- **Guest donations fully supported** — no account needed to give money

### Friction Points

- If a user forgets which OAuth provider they used, they must contact that provider directly
- No forced profile completion means most profiles stay empty and private

### Where Our Pages Intersect

- `/u/` profile is created at signup but **defaults to Private** and empty — this is why GoFundMe profiles are so thin

> **VALIDATE:** Does the sign-up form show any category/interest selection? Is there a welcome email with next steps beyond verification?

---

## Flow 2: Profile Setup & Update

### Steps

| # | Screen | What Happens |
|---|--------|-------------|
| 1 | Account settings | User navigates to settings from profile or menu |
| 2 | Profile photo | Tap "Change" to upload from device. Propagates across entire account |
| 3 | Profile name | Separate from account name — only displays on profile page |
| 4 | Bio | 160-character limit |
| 5 | Custom URL | Set once (e.g., `/u/janahan`). Changes require contacting support |
| 6 | Visibility toggle | Private (default) → Public |
| 7 | Pin fundraiser | Can pin one fundraiser to top of profile |

### What the Profile Displays (When Public)

- Fundraisers created
- Fundraisers donated to (unless anonymous)
- Nonprofit pages supported
- Activity feed showing giving history
- Followers / following counts

### Verification (for withdrawals)

- **Identity (KYC):** Legal name, DOB, address, government-issued photo ID. Some locations require selfie/liveness check
- **Bank verification:** Account details must match government ID; may require bank statement or voided check
- **90-day deadline:** Must verify within 90 days of first donation or all unwithdrawn funds are returned to donors

### Friction Points

- **Custom URL is one-shot** — creates anxiety, no way to change without support
- **No cover photo / banner image** option
- **No location field** on profile (location is per-fundraiser only, for withdrawal)
- **160-char bio** is extremely constrained
- **Default Private** means most users never make profiles public

### Where Our Pages Intersect

- The profile IS the `/u/` page. Its emptiness and private default is the root cause of GoFundMe's profile weakness
- No connection between profile setup and community membership — communities aren't surfaced during profile creation

> **VALIDATE:** Is there a profile completion percentage or prompt? Can you add social links (Twitter, LinkedIn, etc.)? What does the settings page layout look like exactly?

---

## Flow 3: Fundraiser Creation

### Two Paths

**Path A — AI Fundraising Coach (~10 min):**

| # | Step | What Happens |
|---|------|-------------|
| 1 | Beneficiary | Choose: Yourself / Someone else / Charity |
| 2 | Location | Where funds will be withdrawn (sets currency) |
| 3 | Category | AI auto-selects based on conversation |
| 4 | Story | Conversational — AI asks clarifying questions, generates title + story |
| 5 | Goal | AI suggests based on similar fundraisers; editable |
| 6 | Photo | Upload photos; AI gives feedback on best option |
| 7 | Preview & Launch | Review everything, publish |

**Path B — Manual step-by-step:**

| # | Step | Required? | Details |
|---|------|-----------|---------|
| 1 | Beneficiary | Yes | Yourself / Someone else / Charity |
| 2 | Location | Yes | Sets currency for withdrawals |
| 3 | Category | Yes | 18 flat categories (Medical, Memorial, Emergency, Nonprofit, Education, Animal, Environment, Business, Community, Competition, Creative, Event, Faith, Family, Sports, Travel, Volunteer, Wishes) |
| 4 | Title | Yes | 60-character max. Platform suggests titles. Action verbs recommended |
| 5 | Story | Yes | Minimum 50 words. "Enhance" button provides AI suggestions for grammar, tone, formatting. Recommended 550+ characters |
| 6 | Media | No | Main image or video. Videos must be **public YouTube links** (no direct upload). Images featuring people perform better |
| 7 | Goal | Yes | Platform suggests based on similar fundraisers in same location/category over past 12 months. Editable anytime |
| 8 | Preview & Publish | — | Review and go live |

### Post-Publish "Four Key Actions"

1. Share immediately
2. Post an update within first week
3. Add bank information for withdrawals
4. Thank early donors

### Key Details

- **No bank info required to publish** — dramatically reduces creation friction
- **Goal can be changed at any time** — no lock-in
- **"Enhance" button** is a lightweight AI integration that doesn't require the full coach
- **No draft sharing** or preview-with-friends before publishing
- **No subcategories** — 18 flat categories only

### Friction Points

- **Video requires YouTube link** — cannot upload video files directly. Major friction
- **No collaborative drafting** — co-organizers can only be added post-publish
- **50-word story minimum** is very low — leads to thin content

### Where Our Pages Intersect

- The published fundraiser becomes the `/f/` page
- The organizer's `/u/` profile shows the fundraiser in their activity feed
- If fundraiser is for a charity, it links to the charity's nonprofit page (closest analog to `/communities/`)

> **VALIDATE:** Walk through both paths (AI coach + manual). How many total screens/clicks? What does the category picker look like? Is there a "team fundraising" option during creation?

---

## Flow 4: Donation Flow

### Steps

| # | Screen | What Happens |
|---|--------|-------------|
| 1 | Fundraiser page (`/f/`) | Donor sees hero, story, progress, social proof |
| 2 | Click "Donate now" | Prominent CTA, above the fold |
| 3 | Frequency | Choose: One-time or Monthly recurring |
| 4 | Amount | Free-form entry (no preset buttons documented) |
| 5 | GoFundMe tip | **Defaults to 15%** — opt-out, not opt-in. Slider adjustable to $0 |
| 6 | Payment method | Credit/debit, PayPal, Apple Pay, Google Pay, Venmo, ACH/bank transfer. Digital wallets only show if active on device |
| 7 | Options | Anonymous donation checkbox + "Words of support" text field (both optional) |
| 8 | Complete payment | Confirm and pay |
| 9 | Confirmation | Receipt email sent. Sharing prompt encourages donor to amplify |

### Guest vs Logged-In

| Capability | Guest | Logged In |
|-----------|-------|-----------|
| Donate | Yes | Yes |
| Track donations in "Your Impact" | No | Yes |
| Manage recurring donations | No | Yes |
| Edit words of support (14-day window) | No | Yes |
| Resend receipts | No | Yes |

### Recurring Donations

- Monthly on same calendar day
- **5% fee** on recurring (in addition to standard transaction fee)
- Cancel anytime from monthly email receipt or account settings
- Payment methods: credit/debit, PayPal, bank transfer only (no digital wallets)

### Fees (deducted from donation, not charged to donor)

- US: **2.9% + $0.30** per donation
- **No platform fee** to organizers
- Fees auto-deducted before funds reach organizer

### Friction Points

- **15% default tip is a dark pattern** — opt-out, not opt-in. Well-documented public criticism
- **Words of support editable only 14 days**, only if logged in
- **No preset donation amounts** visible in help docs — free-form only

### Where Our Pages Intersect

- Flow starts on `/f/` fundraiser page (this is the conversion surface)
- Donor activity appears on their `/u/` profile (if public and logged in)
- Donation count/amount updates on the `/communities/` page aggregate stats
- **The donation is the single action that touches all three page types**

> **VALIDATE:** Are there preset amount buttons ($25, $50, $100, etc.) or just free-form? What does the tip slider look like exactly? Is there a confirmation modal or does it go straight to payment processing? What does the post-donation sharing prompt look like?

---

## Flow 5: Community / Nonprofit Pages

### Important Context

**GoFundMe does not have user-created communities.** The `/communities/` URL pattern maps to **Nonprofit Pages** — organization-specific landing pages that are opt-in for verified nonprofits.

### What Exists

| Feature | Description |
|---------|-------------|
| **Nonprofit Pages** | Opt-in for verified nonprofits. Shows supporters, fundraisers for the org, donation totals |
| **Follow system** | Users can follow friends, organizers, nonprofits. Get notifications and weekly digest |
| **Team Fundraising** | Groups co-fundraise under a shared campaign. Co-organizers can share, update, thank |
| **Giving Funds (DAF)** | Personal donor-advised fund ($5 min, no fees). Structured giving to nonprofits |
| **Community Forum** | `community.gofundme.com` — separate help/discussion forum, NOT integrated into product |

### What Does NOT Exist

- No user-created communities or groups
- No community feeds or shared spaces (beyond nonprofit pages)
- No way for donors with shared interests to find each other around a cause
- No community discovery (cannot browse communities by topic or cause)
- No community creation flow for non-nonprofits

### How to Join/Follow

| # | Step | What Happens |
|---|------|-------------|
| 1 | Find nonprofit page | Via search, fundraiser link, or direct URL |
| 2 | Click "Follow" | Adds to your following list |
| 3 | Notifications | Get updates when the nonprofit posts |
| 4 | Weekly digest | Email summary of activity from followed accounts |

### Where Our Pages Intersect

- Nonprofit Pages are the closest analog to our `/communities/` concept
- **This is the biggest whitespace** — GoFundMe is campaign-centric, not community-centric
- The social graph (following) connects `/u/` profiles but without community context
- No discovery path leads from the homepage to community-style pages

> **VALIDATE:** Navigate to a few `/communities/` URLs. Are they all nonprofit pages, or do some appear user-created? Can a regular user create a community page? What does the "Start a community" flow look like (if it exists)?

---

## Flow 6: Fundraiser Management

### Dashboard Features

| Feature | Details |
|---------|---------|
| **Post updates** | Text, photo, video. Emailed to all subscribers. Recommended: within 7 days of launch, then weekly. Data shows updates help raise 3x more |
| **Withdraw funds** | Click "Withdraw" from dashboard. Does NOT require reaching goal. All received donations are withdrawable. Does not affect progress meter. Multiple days for processing |
| **Thank donors** | "Automatically thank donors" toggle with custom message. Manual: click "Thank" next to each donor, type message, send. Next unthanked auto-populates |
| **Share** | Built-in share buttons for Facebook, Instagram, TikTok, WhatsApp, Nextdoor, email. Auto-generated captions and images. QR code generation. Unique share links for attribution |
| **Edit fundraiser** | Change title, story, photo/video, goal amount at any time. Story and Details tabs control page |
| **Add co-organizers** | Post-publish only. Co-organizers can share, update, thank with their own accounts. Fundraisers with co-organizers raise up to 3x more |
| **Embed button** | Embeddable donate button with progress bar for external websites/blogs |

### Friction Points

- **90-day verification cliff** — verify within 90 days of first donation or all unwithdrawn funds returned to donors
- **Video still requires YouTube links** even for updates
- **No scheduled update posting**
- **No collaborative drafting** before co-organizer is added

### Where Our Pages Intersect

- Management dashboard lives behind the `/f/` page (organizer-only view)
- Updates posted appear on the public `/f/` page
- Organizer actions reflect on their `/u/` profile activity feed
- Community aggregate stats update when fundraiser receives donations

> **VALIDATE:** What does the organizer dashboard look like? Is it a separate URL or a mode toggle on the `/f/` page? Can you see donation analytics (traffic sources, conversion rate)?

---

## Flow 7: Discovery & Browse

### Homepage Layout

| Section | Content |
|---------|---------|
| **Nav bar** | "Donate" (Categories, Crisis relief, Social Impact Funds, Supporter Space, Nonprofits) + "Fundraise" (How to start, Categories, Team fundraising, Blog, Charity fundraising) |
| **Hero** | "No fee to start fundraising" headline with imagery |
| **Social proof** | "More than $50 million raised every week" |
| **How it works** | Three steps: Create → Share → Receive |
| **Featured topics** | Medical, funerals, memorials, etc. |
| **Trust** | GoFundMe Giving Guarantee |
| **Search** | Magnifying glass icon at top of nav |

### Search

- Search by **person's name, location, or fundraiser title**
- Powered by **Algolia**
- Filters: category, proximity ("near you"), close to goal, location, amount raised, date created

### Category Browsing

- **18 flat categories** (Medical, Memorial, Emergency, Nonprofit, Education, Animal, Environment, Business, Community, Competition, Creative, Event, Faith, Family, Sports, Travel, Volunteer, Wishes)
- No subcategories, no faceted filtering on browse pages

### Special Sections

- **Crisis relief:** Verified emergency fundraisers (editorially curated)
- **Social Impact Funds:** Directed support for urgent needs
- **Trending:** In-the-news fundraisers (appears editorially curated, not algorithmic)
- **Supporter Space:** Articles, charity lists, GoFundMe Heroes spotlights

### What's Weak / Missing

- **No personalized "for you" feed** — discovery is category-first, not algorithm-driven
- **No social discovery** ("your friends donated to...")
- **No geographic discovery** beyond search filters
- **No recommendation engine**
- **No discovery path to `/u/` profiles or `/communities/` pages** — only to `/f/` fundraisers

### Where Our Pages Intersect

- Discovery leads **exclusively** to `/f/` fundraiser pages
- **Zero discovery paths lead to `/u/` profiles or `/communities/` pages**
- This means community and profile pages are only reachable via cross-links from fundraisers — reinforcing their isolation

> **VALIDATE:** Try the search. Does it autocomplete? What do the search results look like? Are there any "recommended for you" sections if logged in? Does the homepage change when logged in vs logged out?

---

## Flow 8: Social Actions

### Following

| Action | Details |
|--------|---------|
| Follow a user | From their `/u/` profile — friends, organizers, nonprofits |
| Notifications | Get alerts when followed users share updates |
| Weekly digest | Email summary of followed activity |
| Notification preferences | Can edit per followed user |
| Follow-back | Notified when someone follows you |

### Sharing

| Channel | Features |
|---------|----------|
| Facebook, Instagram, TikTok, WhatsApp, Nextdoor, Reddit, Twitch, Email | All supported |
| Auto-generated content | Captions and images generated per platform |
| QR codes | For offline / physical sharing |
| Unique share links | Attribution tracking per sharer |
| Embed button | Donate button with progress bar for external sites |
| Facebook special | Clickable donate button + goal progress in shared posts (qualified nonprofits) |

### Words of Support

- Donors leave messages during donation flow
- Visible on the fundraiser page
- **Editable within 14 days only, must be logged in**
- **One-way messages** — no replies, no threading

### Activity Feed

- Profile-scoped (on `/u/` pages), not a central home feed
- Shows: donations made, fundraisers started, follows
- No standalone "home feed" like a social network

### What's Weak / Missing

- **No threaded comments** or replies on fundraiser pages
- **No direct messaging** between users
- **No likes/reactions** on individual donations or updates
- **No social proof notifications** ("X people you know donated to this")
- **Activity feed is profile-scoped**, not a central home feed
- **Social graph is very shallow** compared to social platforms

### Where Our Pages Intersect

- Following connects `/u/` profiles to each other
- Sharing originates from `/f/` pages
- Words of support live on `/f/` pages
- **No social actions originate from or target `/communities/` pages**

> **VALIDATE:** Is there a "heart" or "like" button on fundraisers? Can you react to updates? What does the notification bell show? Is there a central activity feed anywhere (not profile-scoped)?

---

# Flow Map: Where Our Target Pages Sit

This diagram shows how the three pages we're redesigning fit within GoFundMe's complete UX:

```
                    ┌─────────────────────────────────────────────┐
                    │              ENTRY POINTS                   │
                    │  Homepage · Search · Social Share · Direct  │
                    └──────────────────┬──────────────────────────┘
                                       │
                              ┌────────▼────────┐
                              │   DISCOVERY      │
                              │   Categories     │
                              │   Search results │
                              │   Trending       │
                              └────────┬─────────┘
                                       │
                                       │ (only path)
                                       ▼
                    ┌──────────────────────────────────────┐
                    │  ★ FUNDRAISER PAGE  /f/[slug]        │ ◄── Our FR-004
                    │                                      │
                    │  Hero · Progress · Story · Donate    │
                    │  Organizer name (link) · Tax status  │
                    └──┬────────────────┬──────────────┬───┘
                       │                │              │
                       │ (donate)       │ (org link)   │ (charity link)
                       ▼                ▼              ▼
              ┌────────────┐  ┌─────────────────┐  ┌──────────────────────┐
              │ DONATION    │  │ ★ PROFILE PAGE  │  │ ★ COMMUNITY PAGE     │
              │ MODAL       │  │   /u/[username] │  │   /communities/[slug]│
              │             │  │                 │  │                      │
              │ Amount      │  │ ◄── Our FR-006  │  │ ◄── Our FR-005       │
              │ Tip (15%)   │  │                 │  │                      │
              │ Payment     │  │ Activity feed   │  │ Flat fundraiser list │
              │ Confirm     │  │ Followers       │  │ Aggregate stats      │
              └──────┬──────┘  │ Highlights      │  │ Activity feed        │
                     │         │                 │  │                      │
                     │         │ ✗ No link to    │  │ Links to /f/ pages   │
                     ▼         │   communities   │  │ ✗ No guided discovery│
              ┌────────────┐  │ ✗ No trust       │  │ ✗ No cause context   │
              │ THANK YOU   │  │   summary       │  │ ✗ No structured data │
              │ + Share     │  │ ✗ Noindexed     │  │                      │
              │   prompt    │  └─────────────────┘  └──────────────────────┘
              └────────────┘
                                       │
                    ┌──────────────────────────────────────┐
                    │         MANAGEMENT (organizer)        │
                    │  Dashboard · Updates · Withdrawals    │
                    │  Thank donors · Share tools · Edit    │
                    └──────────────────────────────────────┘
```

### Critical Observation

**All discovery flows terminate at `/f/` fundraiser pages.** The profile and community pages are secondary surfaces reachable only via cross-links from fundraisers. There is no homepage path, no search path, and no browse path that leads to a profile or community. This is the structural root of their isolation.

---

# Target Page Deep Audit

*Pages audited live:*
- `/communities/watch-duty`
- `/f/realtime-alerts-for-wildfire-safety-r5jkk`
- `/u/janahan`

---

## Community Page: `/communities/watch-duty`

### What It Looks Like

- Banner photo at the top, community name ("Watch Duty") as the H1, and a short description paragraph acting as both mission statement and CTA
- 63 followers, two small avatar circles, and a "Follow" button
- Three aggregate stats in a horizontal row: $38.8K raised · 488 donations · 167 fundraisers
- A leaderboard showing the top 3 fundraisers by amount raised (Tim Cadogan at $16,344, Arnie Katz at $4,842, Janahan at $2,102), with a "See all" link
- Three tab-style sections: **Activity**, **Fundraisers**, **About** — defaulting to Activity
- The Activity feed is a social-media-style timeline: community members posting updates, sharing progress, and commenting. It's the most alive part of the page
- The Fundraisers tab shows a flat list of 168 campaigns sorted by amount raised, each showing organizer name, title, amount raised, and goal. 30 shown with a "Show more" button
- The About tab just repeats the description paragraph plus community guidelines (be helpful, be respectful, be authentic, be safe, be responsible)
- A "Start a GoFundMe" CTA button appears twice

### What's Missing

| Gap | Impact | FundRight Fix |
|-----|--------|---------------|
| **No guided discovery** | The fundraiser list is a flat directory sorted by amount. No "closest to goal," "most urgent," "just launched," or "best match." Donors must browse linearly through 168 campaigns. | FR-005 adds guided discovery modules (urgency, momentum, personal relevance) |
| **No cause intelligence** | Zero contextual content about wildfires, Watch Duty as an organization, or why funding matters right now. The page tells you *what* the community raised but not *why it matters*. | FR-011 adds AI-generated cause context ("About This Cause" section) |
| **No FAQ section** | Despite "Watch Duty" being a searchable term with informational intent, there's no FAQ accordion and no FAQPage schema. High-intent questions like "how does Watch Duty work" go unanswered. | FR-005 adds FAQ accordion + FR-014 adds FAQPage schema |
| **No structured data** | Zero JSON-LD on this page. No Organization, no NGO, no AggregateRating. The `og:type` is set to the proprietary `gofundme:campaign`, which tells crawlers nothing meaningful. | FR-014 adds Organization/NGO + FAQPage + BreadcrumbList + standard Open Graph types |
| **No direct-answer content** | High-intent queries like "how to help with wildfires" or "how much does GoFundMe take" have no content surface on this page. | FR-005 adds direct-answer blocks for cause/organization/transparency questions |
| **No fee transparency** | The "how much does gofundme take" query (6.6K monthly volume) has no answer surface here. Donor skepticism goes unaddressed. | Community page includes proactive fee transparency section |
| **Weak member representation** | Only 2 avatar circles shown for 63 followers. No sense of community scale or member identity. | FR-005 shows avatar grid of first 8 members with "+X more" overflow, each linked to profiles |

### What Works

- Aggregate stats ($38.8K raised, 488 donations, 167 fundraisers) give a quick sense of community impact
- The Activity feed is genuinely social — real people posting updates, celebrating progress, and encouraging each other. This is the strongest UX element on the page
- The leaderboard creates competitive motivation for organizers
- The fundraiser list does show progress toward each campaign's goal, which helps donors assess urgency at a glance

---

## Fundraiser Page: `/f/realtime-alerts-for-wildfire-safety-r5jkk`

### What It Looks Like

- A progress indicator at the very top (displays "0% complete" in the scraped content, though the campaign is at ~70% — likely a rendering state issue)
- "$2,102 raised of $3K" with "21 donations" below it
- Share and "Donate now" buttons prominently placed
- A row of 5 donor avatars (anonymized circles)
- Organizer attribution: "Janahan Gofundme Vivekanandan for Watch Duty" with the Watch Duty name linked to the charity page
- The H1 is "Real-Time Alerts for Wildfire Safety"
- A subtitle: "Watch Duty's alerts fund 24/7 wildfire monitoring, clearer updates, wider coverage"
- A "Read story" link that expands the story section below — story is collapsed by default
- The story itself is 3 short paragraphs (~150 words). It explains the cause but is thin: no specifics about impact, no data, no images embedded in the story
- The story is structured as: (1) why this matters, (2) what Watch Duty does, (3) call to action
- "Tax deductible" label and beneficiary (Watch Duty) shown clearly
- A "Donations" section showing 21 donors with avatars
- An "Organizer" card at the bottom: Janahan's name, "Los Altos, CA," the beneficiary, date (February 14, 2026), category (Other), and tax-deductible status
- A generic GoFundMe trust block at the very bottom: "Easy, Powerful, Trusted" — three marketing sentences about the platform, not the fundraiser

### What's Missing

| Gap | Impact | FundRight Fix |
|-----|--------|---------------|
| **No above-fold trust cues** | The organizer's verification status, history, and community context are buried at the bottom of the page. A donor seeing the fundraiser for the first time has to scroll past the story to find any organizer credibility signal. | FR-004 puts trust signals (organizer history, verified badge, community affiliation) near the donate CTA above the fold |
| **Thin story content** | ~150 words, no images, no structured impact data, no updates. The narrative is generic enough to apply to any wildfire fundraiser. | FR-004 requires a 300+ word content-quality floor; FR-013 adds AI Story Generator to help organizers write better |
| **No impact projections** | The donor sees "$2,102 of $3K" but has no idea what their specific dollar amount accomplishes. The donation decision is abstract, not concrete. | FR-012 adds real-time impact statements ("Your $50 means 200 families receive real-time wildfire alerts for one month") |
| **No related fundraisers** | The page links to Watch Duty (the charity) but not to other Watch Duty fundraisers. A donor who isn't compelled by this specific campaign has nowhere to go but away. | FR-004 adds a "Related fundraisers in this community" module linking to 3 relevant campaigns |
| **No DonateAction schema** | Zero JSON-LD on this page. No DonateAction, no MonetaryAmount, no rich snippet eligibility. The page title format ("Fundraiser by [Name] : [Campaign Title]") is also poorly structured for clean SERP display. | FR-014 adds DonateAction + MonetaryAmount + BreadcrumbList |
| **No organizer updates** | The fundraiser page itself has no updates section. Campaign updates only appear in the *community* Activity feed, which means donors who land directly on the fundraiser never see them. | FR-004 adds an organizer updates timeline on the fundraiser page itself |
| **Story collapsed by default** | The "Read story" link requires an explicit click to expand. Donors who don't click see only the subtitle, progress bar, and donate button — no narrative context. | FR-004 renders the story expanded by default below the fold |
| **Generic platform trust block** | The "Easy, Powerful, Trusted" section at the bottom is GoFundMe brand marketing, not fundraiser-specific trust evidence. It doesn't help a donor trust *this* organizer or *this* campaign. | FR-004 replaces generic marketing with organizer-specific trust evidence: activity history, community membership, verification status |

### What Works

- The Share and Donate buttons are prominent and above the fold
- Progress toward goal ($2,102 of $3K) is clear and creates a sense of momentum
- The organizer-to-beneficiary relationship ("Janahan for Watch Duty") is clearly stated
- "Tax deductible" labeling is visible and builds institutional trust
- The donor avatar row provides lightweight social proof without being overwhelming

---

## Profile Page: `/u/janahan`

### What It Looks Like

- The H1 is "Janahan Vivekanandan"
- 89 followers, 9 following, with a "Follow" button
- A "Discover more people" section (appears sparse or empty in the current state)
- A "Top causes" section (also appears minimal)
- A "Highlights" section showing 3 fundraisers — but these are *other people's campaigns* that Janahan bookmarked (Keep Sandy on Ossabaw at $66K, Saving Eliza at $2M, Andy Ritchie's Big Headache at $102K), not campaigns he organized. These are curated social content, not an organizer track record
- An Activity feed showing two items:
  1. Janahan donated $200 to his own fundraiser
  2. Janahan started the "Real-Time Alerts for Wildfire Safety" fundraiser (showing the full story text as part of the activity item)
- A CTA at the bottom: "Show what matters most to you by personalizing your profile"
- No bio, no avatar (or default avatar), no location, no verification badge visible in the content

### What's Missing

| Gap | Impact | FundRight Fix |
|-----|--------|---------------|
| **Noindexed** | The page carries `<meta name="robots" content="noindex, nofollow">`. Google never sees this page. No organizer credibility queries can land here. This is GoFundMe's single largest structural SEO vulnerability. | FR-014 explicitly sets `<meta name="robots" content="index, follow">` + Person + ProfilePage schema |
| **No trust summary** | There's no "total raised," "causes supported," or "communities joined" dashboard. A donor checking organizer credibility before donating gets almost nothing actionable from this page. | FR-006 adds above-fold trust summary with total raised, total donated, causes supported, and community memberships |
| **No giving identity** | The profile is a social activity feed, not a credibility surface. It shows *what Janahan did* (started a fundraiser, donated $200) but not *who he is as an organizer* (track record, verified status, cause affinity). | FR-006 structures the page around organizer credibility: verification badges, impact stats, community memberships as trust signals |
| **No AI-generated impact summary** | No unique, crawlable narrative about this organizer's fundraising history. The page is thin from both a trust and an SEO perspective. | FR-006 adds 2–3 sentences of AI-generated, privacy-safe impact narrative based on organizer history |
| **Highlights are curated, not earned** | The "Highlights" section shows campaigns Janahan bookmarked, not campaigns he organized or contributed to. This doesn't build organizer trust — it's social content without trust value. | FR-006 replaces curated highlights with organizer's own fundraiser history as a structured ItemList |
| **Person schema is wasted** | GoFundMe does implement `schema.org/Person` JSON-LD on this page, but since it's noindexed, the schema has zero SEO value. The investment in structured data is entirely negated by the noindex directive. | FR-014 keeps Person schema *and* makes the page indexable — the schema actually reaches Google |
| **No community memberships** | There's no visible connection between Janahan and the Watch Duty community. A donor who arrived from the Watch Duty fundraiser and clicked to check the organizer's profile sees no community context. | FR-006 shows community memberships as badges, each linked to `/communities/[slug]` |
| **No verification badge** | No visible verification status. The only trust signals are follower count (89) and the activity feed. | FR-006 shows verification badges prominently in the identity section |

### What Works

- The Activity feed does show real actions (started a fundraiser, made a donation) — this is a form of social proof, even if it's not structured for trust
- The follower/following count provides a minimal social graph signal
- The "Highlights" concept (surfacing campaigns you care about) is interesting even if it's not implemented in a trust-building way
- The page does render Person JSON-LD (even though it's wasted on a noindexed page), showing GoFundMe has some awareness of structured data for profiles

---

# Cross-Page Analysis: The Journey Gap

The biggest UX problem isn't any single page — it's the transitions between them.

### Community → Fundraiser

The community page's fundraiser list links to individual campaigns, but there's no guidance about *which* campaign to choose. A donor must scroll through up to 168 fundraisers sorted only by amount raised. There's no urgency signal, no "almost there" indicator in the list view, and no personalization. The transition is a cold directory browse, not a guided discovery.

### Fundraiser → Profile

The organizer's name on the fundraiser page links to their profile, but the profile doesn't answer the trust question the donor is asking: "Should I trust this person with my money?" The profile shows social activity, not organizer credibility. A donor who clicks through to check the organizer's background comes back with social signals (followers, bookmarks) instead of trust signals (track record, verification, community standing).

### Profile → Community

There is no visible link from Janahan's profile to the Watch Duty community. The profile shows that Janahan *started* a Watch Duty fundraiser (in the activity feed), but there's no structured community membership, no badge, and no direct link back to `/communities/watch-duty`. The closed loop that our PRD requires (Profile → Community → Fundraiser → Profile) is broken at this edge.

### Profile → Fundraiser (Return Path)

A donor who visits the profile to check credibility and then wants to return to the fundraiser must use browser back navigation. There's no prominent "Currently organizing: Real-Time Alerts for Wildfire Safety" card that would let the donor return with one click. The trust-verification loop (fundraiser → profile → fundraiser → donate) requires the donor to manage their own navigation.

---

# Summary: GoFundMe's Three Pages as Isolated Surfaces

| Dimension | Community | Fundraiser | Profile |
|-----------|-----------|------------|---------|
| **Primary function** | Social feed + flat directory | Conversion page | Social timeline |
| **Trust signals** | Aggregate stats only | Platform-level ("GoFundMe Giving Guarantee") | Follower count only |
| **Discovery help** | None (sorted by amount) | None (no related campaigns) | None (highlights are curated, not contextual) |
| **Cause context** | Description paragraph only | 150-word generic story | None |
| **Structured data** | None | None | Person (wasted — noindexed) |
| **Index status** | Indexed | Indexed | **Noindexed** |
| **Cross-page linking** | Links to fundraisers | Links to organizer + beneficiary | Links to own fundraiser (in activity feed only) |
| **Guided next action** | "Start a GoFundMe" (organizer-facing) | "Donate now" | "Personalize your profile" (self-facing) |

The pages work as isolated surfaces. The community page is a social feed plus flat directory. The fundraiser page converts but provides minimal trust context. The profile page is a social timeline invisible to search engines. None of them strongly guide the donor through the trust → discovery → conversion loop that FundRight is built around.

---

## What GoFundMe Does Well (Platform-Wide)

These are strengths we should respect, not compete against:

- **Extremely low friction to start** — no account needed to donate, no bank info needed to publish
- **AI Fundraising Coach** — genuine differentiator that lowers the story-writing barrier
- **Comprehensive sharing tools** — auto-generated captions, QR codes, unique attribution links
- **Guest donation support** — removes the biggest conversion barrier
- **"Four Key Actions" post-publish guidance** — clear and actionable
- **The "Enhance" button** — lightweight AI integration that doesn't require the full coach

## What GoFundMe Gets Wrong (Platform-Wide)

These are the structural weaknesses our three pages exploit:

- **Community features are essentially nonexistent** — no groups, no shared spaces, no community discovery
- **Social layer is bolted on, not core** — profiles default to private, activity feed is minimal
- **Discovery is category-based only** — no personalization, no social signals, no recommendations
- **15% default tip is a dark pattern** — erodes the trust they need most
- **No threaded discussions** — words of support are one-way, no replies
- **Profile pages are noindexed** — the entire organizer credibility search space is unoccupied
- **Video requires YouTube links** — major content creation friction
- **90-day verification cliff** — hard deadline with fund-loss consequences

---

*This audit provides the empirical UX foundation — alongside the Semrush SEO scan, BuiltWith technology audit, and Lighthouse performance audit — for every page design decision in the FundRight PRD.*

*Items marked with* **VALIDATE** *require hands-on walkthrough of the live GoFundMe product to confirm or correct.*
