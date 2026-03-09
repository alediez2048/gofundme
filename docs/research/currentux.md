# GoFundMe Current UX Audit — Three Target Pages

**Source:** Live page content from gofundme.com  
**Date:** March 8, 2026  
**Pages audited:**
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

## Cross-Page Analysis: The Journey Gap

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

## Summary: GoFundMe's Three Pages as Isolated Surfaces

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

*This audit provides the empirical UX foundation — alongside the Semrush SEO scan, BuiltWith technology audit, and Lighthouse performance audit — for every page design decision in the FundRight PRD.*
