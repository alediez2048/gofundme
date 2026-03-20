FundRight PRD v2 — The Social Philanthropy Platform
Executive Summary
GoFundMe is in the middle of a platform pivot. They're evolving from a transactional donation tool — where people arrive via a shared link, give once, and leave — into a social philanthropy network where giving is an identity, a habit, and a reason to come back. The evidence is visible in their product: Profile pages with follow/following counts, "Inspired X people to help" vanity metrics, cause identity badges, activity feeds with hearts and comments, Community pages with member grids, and an emerging Reels feature for video-based giving stories.
The problem is that GoFundMe's three new surfaces — Profile, Fundraiser, and Community — exist as disconnected experiences. There is no single place where the platform comes alive. No feed. No scroll. No daily reason to open the app when you're not actively donating.
FundRight addresses this by first building all three page types — Profile, Fundraiser, and Community — as fully functional, interconnected surfaces. Then it adds the missing connective tissue: a LinkedIn-style social feed page that unifies all three into a single living product. The feed is a fourth page layered on top of the existing clone, not a replacement for it. Every donation becomes a social moment. Every fundraiser milestone re-enters circulation. Every community breakthrough is a shared celebration. The feed is where recognition happens, where social pressure compounds, and where one-time donors become engaged network participants.
This is not a UX tweak. It is the architectural decision that determines whether GoFundMe's social features become a real network or remain three disconnected pages bolted onto a payment form.
What We Build

Profile Page (/u/[username]) — the existing GoFundMe clone, enhanced with feed integration
Fundraiser Page (/f/[slug]) — the existing GoFundMe clone, enhanced with feed integration
Community Page (/communities/[slug]) — the existing GoFundMe clone, enhanced with feed integration
Feed Page (/) — NEW — the LinkedIn-style homepage that ties everything together

The Homepage Split: Authenticated vs Unauthenticated
The / route serves two different experiences based on authentication state — exactly like LinkedIn:
Logged out → Marketing landing page. The current HomePageContent with hero, trending fundraisers, category browse, search, and "Start a FundRight" CTA. This is the acquisition surface — its job is to convert visitors into sign-ups. It's what Google indexes when someone searches "FundRight."
Logged in → Social feed. The LinkedIn-style three-column feed is your first landing point after authentication. No intermediary. No dashboard. You open FundRight, you see your feed. This is the retention surface — its job is to create the daily habit loop that keeps you engaged.
This mirrors LinkedIn's exact pattern: logged-out visitors see a marketing page with "Join now" CTAs; logged-in users land directly on their personalized feed. The reason it works is that the two audiences have fundamentally different needs. A new visitor needs to understand what FundRight is. A returning user needs a reason to stay.
Technical implementation:
// app/page.tsx
export default function HomePage() {
  const { currentUser } = useFundRightStore()

  if (currentUser) {
    return <FeedPage />        // Authenticated → social feed
  }

  return <HomePageContent />   // Unauthenticated → marketing landing
}
The existing HomePageContent component stays intact — it already works as a public landing page. The FeedPage component is the new LinkedIn-style three-column layout. The routing logic is a single conditional at the page level, not a redirect, so there's no flash or navigation delay.

Current Build Status
Before defining what v2 adds, here is an honest accounting of what the current FundRight build ships today:
What's Built and Working
Three core pages, fully functional:

Profile (/u/[username]) — Green hero with wave, avatar, follow placeholder, "others you may know," top causes, highlights (2-column fundraiser cards), trust strip, impact copy, stat tiles, communities list, recent activity with donation thumbnails.
Fundraiser (/f/[slug]) — Full story, progress bar, donation modal, organizer + community links, trust block (buildTrustSummary), JSON-LD schema injection.
Community (/communities/[slug]) — Community detail, constituent fundraisers, AI cause summary (when API key configured), FAQ/schema patterns.

Additional routes shipped: / (homepage), /browse, /browse/[category], /search, /create, /communities (index), /ai-traces, APIs under /api/ai/*.
Data layer: TypeScript types in lib/data/types.ts, seed data in lib/data/seed.ts. Zustand store (useFundRightStore in lib/store/index.ts) with persist → localStorage. addDonation updates fundraiser progress, user stats, and community totals in a single transaction — cross-page state works without server round-trips.
JSON-LD schema: Implemented via components/JsonLd.tsx + builders in lib/schema/index.ts. Emitted on home, fundraiser, community, and profile pages (DonateAction, Person, Organization, BreadcrumbList, FAQPage).
AI integration (what's real vs heuristic):
CapabilityImplementationBacked ByCause summary (community pages)getCauseSummary → callAI with fallback to static descriptionOpenAI (LLM)Creation assistant/api/ai/creation-assist + lib/ai/creation-assistant.tsOpenAI (LLM)Community discoverydiscoverFundraisers in lib/ai/community-discovery.tsOpenAI with fallback to empty rankingTrust summary (fundraiser)buildTrustSummary in lib/ai/trust-impact.tsTemplate/deterministic (not LLM)Impact projection (donation modal)getImpactProjection — fixed multipliers per cause categoryClient-side math (not LLM)
Component structure: Route-centric — FundraiserPageContent, CommunityPageContent, ProfilePageContent, HomePageContent, plus DonationModal, Header, Footer. No separate files named ConversionZone.tsx, DonationStream.tsx, etc. — those are descriptive names in this PRD, not file names.
What's NOT Built Yet (New Work for v2)
CapabilityStatusNotesFeed page (LinkedIn 3-column layout)Not startedThe entire feed surface is new; replaces HomePageContent for authenticated usersFeedEvent entityNot in data modelNew type with actor, subject, metadata, engagement, causeVectorFeed algorithmNot startedCause affinity scoring, social graph weighting, ranking logicEngagement primitives (heart, comment, share)Not startedNo engagement system exists in the current buildFeed personalization (AI)Not startedEmbedding-based cause affinity model is newImpact summary generator (AI)Not startedProfile-level AI narrative is new; current impact copy is template-basedPersonalized recommendations (AI)Not startedCollaborative filtering on giving graph is newAnalytics / instrumentation layerNot startedNo lib/analytics, no Beacon API integration, no /analytics routedonationVelocity, milestones, causeVector fieldsNot in data modelExtensions to existing Fundraiser/Community/User typesFollow/follower system (functional)Placeholder onlyUI exists but no state management behind it
This PRD defines the target state. Sections below specify both what the clone pages already deliver and what the feed page adds on top.

The Strategic Context
What GoFundMe Is Actually Building
GoFundMe's recent product moves reveal a deliberate strategy to create network effects through social philanthropy:

Profile pages with follower counts, cause badges, and giving history — these are reputation assets, not donor receipts
"Inspired X people to help" as the primary profile metric — a recognition mechanic designed to motivate continued giving
Activity feeds on profiles with hearts, comments, and share buttons — social engagement primitives borrowed from Instagram and LinkedIn
Community pages with member grids and collective statistics — belonging mechanisms
A Reels feature in development — video content loops for emotional, shareable giving moments
"Discover more people" prompts — explicit social graph expansion

This is the LinkedIn playbook applied to philanthropy. LinkedIn made professional identity the product, then monetized the network. GoFundMe is trying to make philanthropic identity the product — and it works because moral vanity is socially acceptable vanity. Nobody will judge you for showing off how much you've given.
Why Search Can't Be the Growth Engine Anymore
Our Semrush analysis reveals why GoFundMe needs this pivot:
MetricPeak (2023)Current (Mar 2026)ChangeOrganic traffic~2.4M/month~1.9M/month-21%Organic keywords~1.25M~547K-56%Non-branded traffic~500K~430K-14%
The traffic decline is structural, not fixable by better SEO:
87% of GoFundMe's traffic is branded. People typing "gofundme" into Google. The homepage alone drives ~1M visits/month (53% of all traffic). This means organic traffic is a proxy for brand awareness, not search performance. When traffic drops, it reflects fewer people searching for the brand — a demand signal, not a rankings signal.
Google's algorithm updates killed the long tail. The Helpful Content Update (Oct 2023) and subsequent Core Updates (Mar 2024) specifically devalued thin, templated UGC pages. GoFundMe has 264K+ campaign pages, most of which are short, templated, and low-quality by Google's standards. Massive rankings losses in the 21-50 and 51-100 position buckets confirm this — the long-tail campaign pages that once brought in new users through search are being swept away.
AI Overviews are eating the funnel. GoFundMe appears in AI Overviews for only 1.4% of its keywords. When "how to raise money for medical bills" triggers an AI Overview with a direct answer, users don't click through. Zero-click search is compressing the top of the funnel.
Competition is irrelevant. Named competitors (Zeffy, SpotFund, Bloomerang) have only 6-11% keyword overlap and drive a tiny fraction of GoFundMe's traffic. The threat isn't competitors stealing rankings — it's Google and AI search stealing clicks.
The conclusion: GoFundMe cannot grow through search. The COVID surge (2020-2022) masked this for years by flooding the platform with UGC and search demand. That surge has normalized. The new growth engine must be social — people bringing other people to the platform through sharing, recognition, and identity investment.
The Performance Debt Compounds the Problem
Our Lighthouse audit of GoFundMe's production pages:
MetricGoFundMe (Measured)FundRight TargetLighthouse Performance Score4590+Largest Contentful Paint5.0s≤1.8sTotal Blocking Time2,210ms≤200msPage Weight4.3 MB≤800 KBThird-Party Scripts15+ SDKs0Third-Party Cookies600
Root cause: 285 live technologies (per BuiltWith audit), 10+ analytics tools loading simultaneously, legacy jQuery/Vue/Foundation alongside React/Next.js. This technical debt directly undermines the social pivot — a feed that takes 5 seconds to load and blocks the main thread for 2.2 seconds cannot support the scroll-and-engage behavior social networks depend on.

Product Vision
The Feed Is the Product
FundRight introduces a social feed as the homepage experience — the single surface that turns three disconnected page types into one living product.
The feed is modeled on LinkedIn's core insight: you don't go to LinkedIn to visit someone's profile. You open LinkedIn, scroll the feed, and content finds you. Profiles, companies, and posts are all content types flowing through a single stream. The feed creates the daily habit loop that makes the platform sticky.
GoFundMe currently has no reason to open the app unless you're actively donating or managing a campaign. The feed changes this by making other people's giving activity the content you consume — creating social pressure, recognition loops, and discovery that compounds into network effects.
The Flywheel
Give → Social moment auto-generated → Appears in followers' feeds
  ↑                                              ↓
  └──── Social pressure + recognition ←── Friends see and engage
Every donation, every fundraiser milestone, every community achievement generates a feed event. These events surface to the right people through algorithmic ranking. Engagement (hearts, comments, shares) amplifies reach. Recognition ("Inspired X people") motivates continued giving. The cycle compounds.
Four Pages: Three Clones + One Innovation
The original assignment asks for three interconnected pages — Profile, Fundraiser, and Community. We build all three as faithful, enhanced clones of GoFundMe's current UX. But we go further by adding a fourth page: a LinkedIn-style social feed that demonstrates what GoFundMe is missing.
The three cloned pages serve as:

Content sources that generate feed events (donations, milestones, updates, achievements)
Detail views you click through to from the feed (deep-dive into a fundraiser, explore someone's giving history, browse a community)
Identity surfaces that accumulate reputation and belonging over time

The feed is the connective tissue. The cloned pages are the depth. Together, they demonstrate both execution skill (the clone) and product vision (the feed).

The Feed — Detailed Specification
Content Taxonomy
Every piece of content in the feed falls into one of these event types:
Donation Moments (highest frequency)
A user donates to a fundraiser. The feed auto-generates a card showing the donor, the fundraiser, and the amount (if the donor opts to share it). The donor can optionally add a why — a short message explaining their motivation. This transforms a transaction receipt into a story. Example: "Alex donated $50 to Watch Duty — 'Every second counts when wildfires threaten our communities.'"
Fundraiser Lifecycle Events (high engagement)
Not just "someone started a fundraiser" — but milestones that re-surface campaigns at emotionally compelling moments:

Fundraiser launched (with organizer's story)
First donation received
25% / 50% / 75% / 100% of goal reached
Organizer posted an update (text, photo, or video)
X donations in 24 hours (momentum signal)
Goal exceeded

Each milestone is a feed moment that re-introduces the fundraiser to people who already care and surfaces it to new people who might.
Community Breakthroughs (collective narrative)
Communities become characters in the feed with their own narrative arcs:

Community crossed a cumulative fundraising milestone ($100K, $1M)
New member joined (when followed users join)
Community added X members this week/month
Top fundraiser within the community hit its goal
Community spotlight: AI-generated summary of the community's recent impact

Profile Milestones (recognition triggers)
These are the vanity moments that keep people investing in their identity:

"Alex just inspired their 50th person"
"Sarah has now supported 10 different causes"
"Jordan joined the Climate Action community"
Giving streak achievements (donated 3 months in a row)
Annual giving summary (end-of-year recap card)

Rich Media Content (video/reels — future integration)

Organizer thank-you videos
Donor story clips
Impact documentation
Community highlight reels
AI-generated giving recap videos

Feed Algorithm
The feed is ranked by a weighted combination of signals, personalized to each user:
Social Graph Signals (strongest weight)

Activity from people you follow
Activity from people followed by people you follow (second-degree discovery)
Activity within communities you belong to

Cause Affinity Signals

Causes you've donated to historically
Cause categories matching your profile badges
AI-inferred cause affinity from giving patterns (e.g., three animal welfare donations → surface wildlife fundraisers)

Engagement Signals

Content with high heart/comment/share ratios surfaces more broadly
Fundraisers with momentum (rapid donation velocity) get boosted
Milestone events (goal reached, community breakthrough) get priority

Recency and Diversity

Time-decay prevents stale content from dominating
Category diversity ensures the feed doesn't become a single-cause echo chamber
Mix of content types (donations, milestones, community events) prevents monotony

Anti-patterns the algorithm avoids:

No paid promotion or boosted fundraisers in v1 (trust-first approach)
No pressure tactics (countdown timers, "only X left" scarcity)
No guilt-based engagement ("Your friend donated, why haven't you?")
Donor amounts are opt-in, never forced into feed visibility

Feed UX — GoFundMe-Native Three-Column Layout
When an authenticated user opens FundRight, the feed is the very first thing they see — no intermediary, no dashboard, no landing page. This is the app's primary surface for returning users.
The layout uses a three-column desktop grid that collapses responsively on mobile — a proven pattern for social network homepages. Unauthenticated visitors see the existing marketing homepage (HomePageContent) instead.

Design Philosophy: GoFundMe-Native Feed
The feed is not a LinkedIn clone reskinned in green. It is a natural extension of GoFundMe's existing design system — the same visual language used on the Profile, Fundraiser, and Community pages — applied to a new three-column feed layout. If a GoFundMe user navigated from a fundraiser page to the feed, it should feel like they never left the product.

What we inherit from GoFundMe's existing pages:
The fundraiser page's progress bar (solid green fill, rounded, #00b964) appears identically inside feed card embeds. The profile page's green gradient banner, circular avatar, "Inspired X people to help" text, "Discover more people" bar with stacked mini-avatars, and pill-shaped Follow button all carry directly into the feed's left sidebar and card headers. The community page's cause icons, member counts, and "Join" button style appear in the right sidebar's Community Spotlight and in inline community suggestion cards. The nav bar uses GoFundMe's existing navigation pattern (Search, Donate, Fundraise, Giving Funds) adapted as Feed, Discover, Fundraise, Giving Funds — not LinkedIn's icon-only bottom-labeled nav.

What we do NOT inherit from LinkedIn:
No #F3F2EF gray page background — we use GoFundMe's #fafafa white. No 8px border-radius corporate cards — we use GoFundMe's 16px rounded cards with subtle shadows. No blue accent color anywhere. No dense, information-heavy layout — GoFundMe's generous whitespace and breathing room carries into the feed. No icon-only navigation with tiny labels underneath. No "reactions" emoji bar — we use GoFundMe's existing heart/comment/share pattern from their profile activity feed.

Visual continuity rule: Every component that appears in the feed must use the same styling as its counterpart on the detail pages. A fundraiser embed card in the feed uses the same progress bar, typography, and green fill as /f/[slug]. A profile avatar in the feed uses the same circular style and size as /u/[username]. When a user clicks through from a feed card to a detail page, the transition should feel like zooming in on something they already saw — not like navigating to a different application.

Reference mockup: fundright-feed-v2.html

Design Tokens
These values are derived from GoFundMe's production UI and must be used consistently across the feed and all three clone pages:

:root {
  /* Brand colors */
  --gfm-green: #00b964;           /* Primary — buttons, progress bars, "Inspired X" text */
  --gfm-green-light: #e6f9f0;     /* Tint — hover states, quote backgrounds, achievement cards */
  --gfm-green-hover: #00a358;     /* Darker green for hover/active states */

  /* Neutrals */
  --gfm-black: #1a1a1a;           /* Primary text, headings */
  --gfm-gray-900: #333;           /* Body text */
  --gfm-gray-600: #6b6b6b;        /* Secondary text, subtitles */
  --gfm-gray-400: #999;           /* Tertiary text, timestamps, placeholders */
  --gfm-gray-200: #e0e0e0;        /* Borders, dividers */
  --gfm-gray-100: #f5f5f5;        /* Hover backgrounds, alternating rows */

  /* Surfaces */
  --gfm-bg: #fafafa;              /* Page background (NOT LinkedIn's #F3F2EF) */
  --gfm-white: #fff;              /* Card backgrounds */

  /* Shape */
  --gfm-radius: 16px;             /* Card border radius (NOT LinkedIn's 8px) */
  --gfm-radius-sm: 10px;          /* Inner card elements, embedded cards */
  --gfm-radius-full: 50px;        /* Buttons, pills, search bar — fully rounded */

  /* Typography */
  --gfm-font: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}

Component Styling Reference
Card Container (all feed cards, sidebar cards): background white, 16px radius, 1px solid rgba(0,0,0,0.06) border, subtle 0 1px 3px rgba(0,0,0,0.04) shadow. NOT LinkedIn's flat bordered cards.

Pill Buttons (Follow, Join, filter tabs): 50px fully rounded, 1.5px border. Follow buttons use black outline that fills black on hover. Join buttons use green outline that fills green on hover.

Primary CTA ("Start a FundRight"): Black background, white text, fully rounded — matches GoFundMe's "Start a GoFundMe" button.

Progress Bar (feed embed cards AND fundraiser page): 8px height, solid #00b964 green fill (NOT a gradient), 4px radius. Identical to /f/[slug] page.

Engagement Bar (heart, comment, share, save): border-top divider, equal-flex buttons, 10px rounded hover target, gray-600 text that darkens on hover. Hearted state is red #e74c3c.

Donor Quote: soft green-light (#e6f9f0) background, 10px radius, 3px solid green left border, italic text.

Identity Card Banner (left sidebar): linear-gradient(135deg, #b2f5d8 0%, #6ee7a8 50%, #00b964 100%) — GoFundMe's signature green gradient, same as profile page covers.

Milestone Banner: same green gradient as identity card, black text on green (NOT white on dark).

"Discover More People" Bar: overlapping 28px circular mini-avatars with 2px white border and -8px margin-left stacking — matches GoFundMe exactly.

Three-Column Grid: max-width 1200px, grid-template-columns 260px 1fr 300px, 24px gap. Both sidebars sticky at top: 88px (64px nav + 24px padding).

How the Feed Connects to Profile, Fundraiser, and Community Pages
The feed is not a standalone surface — it is the hub that routes into the three existing pages. Every interactive element in the feed is a click-through:

- Fundraiser embed card (image + progress bar) → /f/[slug] — Full fundraiser detail
- Donor name/avatar on any card → /u/[username] — Profile with giving history
- Community name on any card → /communities/[slug] — Community detail
- "Trending Fundraisers" sidebar items → /f/[slug] — Direct to fundraiser
- "Community Spotlight" sidebar items → /communities/[slug] — Direct to community
- "People you may know" → /u/[username] — Discover donors and organizers
- "My Communities" sidebar links → /communities/[slug] — Quick-access
- Post composer → "Fundraise" → /create — Existing creation flow
┌──────────────────────────────────────────────────────────────────┐
│  [Logo: FundRight]    [Search bar]    [Nav: Feed | Communities | │
│                                        Notifications | Me]       │
├────────────┬─────────────────────────────┬───────────────────────┤
│            │                             │                       │
│  LEFT      │  CENTER FEED               │  RIGHT SIDEBAR        │
│  SIDEBAR   │                             │                       │
│            │  ┌─── Start a post ───────┐ │  Trending Fundraisers │
│  Avatar    │  │ [📹 Video] [📷 Photo]  │ │  ─────────────────── │
│  Name      │  │ [📝 Story] [🎯 Fund]  │ │  • Wildfire relief    │
│  Headline  │  └────────────────────────┘ │    $1.2M · 2.4K donors│
│            │                             │  • Education fund     │
│  "Inspired │  ┌─ Feed Tabs ────────────┐ │    $890K · 1.1K donors│
│  21 people │  │ For You | Following |  │ │                       │
│  to help"  │  │ Trending               │ │  Community Spotlight  │
│            │  └────────────────────────┘ │  ─────────────────── │
│  Followers │                             │  🔥 Watch Duty        │
│  Following │  ┌─ Feed Card ────────────┐ │     +124 members/wk   │
│            │  │ [Avatar] Sarah M.      │ │  🌍 Climate Action    │
│  ───────── │  │ donated to a fundraiser│ │     crossed $1M       │
│  Profile   │  │                        │ │                       │
│  viewers   │  │ "Every second counts"  │ │  FundRight News       │
│  223       │  │                        │ │  ─────────────────── │
│            │  │ ┌── Fundraiser Card ─┐ │ │  • Google AI Overview │
│  Inspired  │  │ │ 🔥 Wildfire Safety │ │ │    now cites giving   │
│  count     │  │ │ ████████░░ 73%     │ │ │    platforms          │
│  21        │  │ │ $101K of $140K     │ │ │  • Giving Tuesday     │
│            │  │ └────────────────────┘ │ │    2026 trends        │
│  ───────── │  │                        │ │  • Wildfire season     │
│  My        │  │ ♡ 24  💬 3  ↗ Share  │ │    forecast update     │
│  communi-  │  └────────────────────────┘ │                       │
│  ties      │                             │  Suggested People     │
│            │  ┌─ Feed Card ────────────┐ │  ─────────────────── │
│  • Watch   │  │ 🎉 Community Milestone │ │  [Avatar] Karen R.    │
│    Duty    │  │ Climate Action crossed │ │  12 causes · Follow   │
│  • Climate │  │ $1,000,000 raised      │ │  [Avatar] Mike K.     │
│    Action  │  │                        │ │  8 causes · Follow    │
│            │  │ ♡ 189  💬 42  ↗ Share │ │                       │
│  ───────── │  └────────────────────────┘ │                       │
│  Saved     │                             │                       │
│  items     │  [Infinite scroll ↓]        │  [Sticky on scroll]   │
│            │                             │                       │
└────────────┴─────────────────────────────┴───────────────────────┘
Top Navigation Bar
Mirrors LinkedIn's persistent top nav:

Logo (left) — FundRight brand mark
Search bar (center) — "Search fundraisers, communities, people..." — unified search across all entity types
Navigation icons (right) — Feed (home), Communities, Notifications (bell with badge), Me (avatar dropdown)
On mobile: collapses to bottom tab bar (Feed, Communities, +Create, Explore, Profile)

Left Sidebar — Identity Summary Card
A compact version of your Profile page, always visible. Directly modeled on LinkedIn's left sidebar:

Identity block: Avatar, name, headline ("Supporter of 12 causes"), location
Vanity metrics: "Inspired X people to help" (primary), follower/following counts
Quick stats: Profile viewers (last 30 days), post impressions
My communities: List of communities you belong to (clickable → Community page)
Saved items: Bookmarked fundraisers and communities
Links: Saved items, Groups/Communities, Events

This sidebar serves two purposes: (1) it reminds you of your philanthropic identity every time you open the feed, reinforcing investment in the platform, and (2) it provides one-click navigation to your communities and saved content.
Center Column — The Feed
The main content area. Infinite-scroll vertical feed with card-based content:
Post Composer (top, sticky on LinkedIn — we replicate this):

"Start a post" input field with the user's avatar
Action buttons: Video, Photo, Write Story, Start Fundraiser
This is the content creation entry point — users can share giving moments, write about causes, or launch fundraisers directly from the feed

Feed Tabs:

For You — AI-personalized feed (default)
Following — chronological feed from people and communities you follow
Trending — highest-engagement content across the platform

Feed Cards (see Content Taxonomy above for full list):
Each card follows a consistent structure:

Header: Actor avatar + name + action text + timestamp + "..." menu
Body: Content-specific (donor message, milestone banner, fundraiser embed card, media)
Footer: Engagement bar (Heart, Comment, Share, Bookmark)

Infinite Scroll:

Progressive loading with Suspense boundaries
Skeleton cards shown while loading
"Back to top" floating button after scrolling past 10 cards
Feed state preserved when navigating to detail pages and returning

Right Sidebar — Discovery & Trending
Sticky sidebar that scrolls independently, modeled on LinkedIn's right rail:
Trending Fundraisers:

Top 3-5 fundraisers by donation velocity (last 24h)
Shows title, total raised, donor count, momentum indicator
Clickable → Fundraiser page

Community Spotlight:

2-3 communities with notable recent activity
Member growth rate, milestone achievements
"Join" button inline
Clickable → Community page

FundRight News / Cause Updates:

Curated or AI-generated news items relevant to active causes on the platform
Similar to LinkedIn's "LinkedIn News" section
Short headlines with bullet-point format

Suggested People:

Users with cause affinity overlap based on your giving history
Shows name, cause count, "Follow" button
Powered by the cause affinity AI engine

Footer Links:

About, Help, Privacy, Terms (standard footer)

Responsive Behavior
Desktop (≥1024px): Full three-column layout. Left sidebar 240px, center fluid, right sidebar 300px.
Tablet (768-1023px): Two columns. Left sidebar hidden, center feed + right sidebar. Right sidebar collapses to a "Discover" tab above the feed.
Mobile (<768px): Single column. Feed only. Left sidebar content accessible via profile icon in bottom nav. Right sidebar content accessible via Explore tab. Post composer collapses to a floating "+" button (see mobile mockup). Bottom tab bar replaces top nav icons.
Engagement Primitives

Heart — lightweight endorsement (equivalent to LinkedIn's "Like"). One-tap, toggleable.
Comment — text responses on any feed event. Expands inline below the card.
Share — reshare to your own followers' feeds with optional commentary. Also supports copy-link and external share (Twitter, WhatsApp, etc.).
Bookmark — save a fundraiser or community for later. Appears in left sidebar "Saved items."

Feed-to-Page Transitions

Clicking a fundraiser card → Fundraiser detail page (/f/[slug])
Clicking a donor name/avatar → Profile page (/u/[username])
Clicking a community name → Community page (/communities/[slug])
Clicking "X comments" → Expanded card with inline comment thread
Browser back button / swipe back → returns to feed with scroll position preserved


Page Specifications — The Three Clone Pages
These are the three pages the assignment requires: Profile, Fundraiser, and Community. Each is built as an enhanced clone of GoFundMe's existing page type, with two additions: (1) they generate feed events that flow into the Feed page, and (2) they consume feed content where appropriate (e.g., profile-scoped activity feeds, community-scoped activity feeds).
Profile Page (/u/[username])
Role: Reputation Asset + Trust Authority + Feed Contributor
SEO Role: GoFundMe's Profile pages are fully deindexed — the single largest structural vulnerability in their SEO architecture. Our Profile pages are fully indexed with Person + ProfilePage schema, designed to rank for "[person name] fundraiser" queries — the exact moment a potential donor Googles an organizer to verify credibility.
Social Role: The Profile page is a reputation asset that users actively invest in — a public-facing record of their philanthropic identity. It closely mirrors GoFundMe's current profile UX (avatar, cover photo, follower counts, cause badges, activity feed) while enhancing it with giving dashboard stats, AI impact summaries, and tighter feed integration.
Key features:
Identity Header

Name, avatar, cover photo
"Inspired X people to help" metric (primary vanity number)
Follower/following counts with follow button
Top cause badges (self-selected identity signals)
Bio/tagline
Verification badges and linked social accounts

Giving Dashboard

Total donated (aggregate, opt-in visibility)
Causes supported (count + category breakdown)
Communities joined
Giving streak (consecutive months of donations)
AI-generated "Impact Summary" — a personalized narrative of what the user's giving has accomplished, updated monthly
Fundraiser history as a structured ItemList in JSON-LD

Personalized Fundraiser Recommendations

AI-powered suggestions based on giving history and community membership
"People like you also supported..." discovery
Creates the engagement loop the assignment asks for ("tie them together to make an engaging experience")

Activity Feed (Profile-Scoped)

The same feed format as the homepage, but filtered to this user's activity only
Donation moments, fundraiser launches, community joins, milestones
Engagement buttons (heart, comment, share) on each item
This is what visitors see when they check out someone's giving history

Highlights

Pinned fundraisers the user is most proud of supporting
Featured communities
Fundraisers the user has organized

Feed contribution: Every action this user takes (donate, join community, start fundraiser, hit milestone) generates a feed event attributed to their profile. The profile is both a destination and a content engine.
Schema: Person, ProfilePage, ItemList, BreadcrumbList
SERP target: Person Knowledge Card, Sitelinks
Index status: Index + Follow (fixing GoFundMe's noindex decision)
Fundraiser Page (/f/[slug])
Role: Conversion Closer + Social Moment Generator
SEO Role: GoFundMe's fundraiser pages carry the domain's traffic but have zero JSON-LD schema — no DonateAction, no MonetaryAmount, no rich snippet potential. Our fundraiser pages implement the full donation schema stack so that goal amount and progress appear directly in search results.
Social Role: The Fundraiser page is optimized for two things: converting visitors into donors, and generating social moments that flow back into the feed. Every donation, every milestone, every organizer update is a feed event that extends the fundraiser's reach beyond its direct audience.
Key features:
Above-the-Fold Conversion Zone

Headline, goal amount, progress bar, donate CTA — all statically rendered for sub-1.8s LCP
Organizer attribution with link to their Profile (trust signal)
Parent Community link (belonging signal)
Social proof: recent donation activity strip ("Sarah donated $25 · 2 min ago")

Story Section

Organizer's narrative (AI-assisted drafting available)
Photo/video gallery
Impact projections ("Your $50 provides 2 days of wildfire alerts")

Updates Feed

Organizer posts (text, photo, video) displayed as a chronological feed
Each update is also a feed event visible to campaign followers
Engagement buttons on each update

Donation Activity

Real-time donation stream with donor names (linked to profiles), amounts (if public), and messages
Milestone markers ("50% funded!" "100 donors!") visible in the stream

Community Context

Which community this fundraiser belongs to
Other fundraisers in the same community (cross-discovery)
Community stats (total raised across all fundraisers)

Feed contribution: Donations generate donor-attributed feed events. Milestones generate campaign-attributed events. Organizer updates generate content events. A single fundraiser can produce dozens of feed events over its lifecycle, each one re-surfacing the campaign to new audiences.
Schema: DonateAction, MonetaryAmount, BreadcrumbList
SERP target: Donation Rich Card, Sitelinks
Index status: Index + Follow
Community Page (/communities/[slug])
Role: SEO Powerhouse + Belonging Mechanism + Collective Feed
SEO Role: GoFundMe's Community pages are structurally thin — no schema, incorrect og:type (set to proprietary gofundme:campaign), and zero editorial backlinks. Our Community page is the platform's primary organic search entry point, designed to rank for cause-category terms, nonprofit name queries, and event-based giving queries simultaneously.
Social Role: The Community page is where individual giving becomes collective identity. It's not a directory of fundraisers — it's a living group with a shared narrative, membership, and achievements. Think LinkedIn Groups, but oriented around causes rather than professional interests.
Key features:
Community Header

Name, description, cause category
Member count with "Join" button
Collective stats: total raised, total donors, active fundraisers
Community milestone badges (crossed $100K, 1K members, etc.)

Community Feed

A feed scoped to this community's activity: fundraisers launched, milestones reached, donations made to constituent campaigns, member joins
This is the community's heartbeat — the living proof that people are actively engaged
New visitors see collective momentum before they see individual campaigns

Cause Intelligence Section

AI-generated context about the cause: current state of the issue, recent developments, funding landscape, key organizations involved
FAQ section targeting common questions about the cause
This content serves both users (educational context before donating) and search engines (structured, indexable content that GoFundMe lacks)

Fee Transparency Section

Proactive fee comparison attacking GoFundMe's defensive weakness on the "how much does gofundme take" query cluster
Transparent breakdown of where donations go

Fundraiser Directory

Active fundraisers within this community, sorted by momentum (recent donation velocity)
Completed fundraisers with final totals (social proof of community effectiveness)
Aggregate statistics (total raised, donation count, active campaigns)
"Start a fundraiser in this community" CTA

Member Grid

Active members with profile links
Leaderboard: top donors, most-inspiring members (by "inspired X people" metric)
"People you follow in this community" for logged-in users

Feed contribution: Community-level events (milestone crossed, new fundraiser launched, collective donation total updated) generate feed events that surface to all members and to the broader network. The community becomes a character in the feed with its own narrative arc.
Schema: Organization/NGO, FAQPage, BreadcrumbList, AggregateRating
SERP target: Featured Snippet, AI Overview citation, FAQ Rich Result
Index status: Index + Follow

AI Integration — The Feed Intelligence Layer
AI in FundRight is not a content generation gimmick. It is the intelligence layer that makes the social network work. The current build ships two LLM-backed capabilities (cause summaries, creation assistant) and two heuristic/template capabilities (trust summaries, impact projections). v2 adds two new LLM capabilities (feed personalization, impact narrative generation) and one new ML capability (personalized recommendations). Four total AI capabilities in the v2 target state:
1. Feed Personalization Engine (NEW — not in current build)
What it does: Ranks and personalizes each user's feed based on their giving graph, cause affinity, social connections, and engagement patterns.
Why it matters: A chronological feed of every donation on the platform would be noise. The AI layer ensures you see the fundraisers, communities, and giving moments most relevant to you — driving engagement and conversion.
Technical approach: Embedding-based cause affinity model. Each user's giving history generates a cause vector. Each feed event carries a cause vector. Feed ranking scores events by vector similarity weighted by social graph proximity and engagement signals.
Graceful fallback: Without AI, the feed falls back to a chronological stream filtered by direct follows and community memberships. Still functional, less personalized.
2. Cause Intelligence Generator (SHIPPED — lib/ai/cause-intelligence.ts)
What it does: Generates contextual content for Community pages — cause summaries, FAQ sections, impact statistics, recent developments.
Why it matters: GoFundMe's community pages are structurally thin. AI-generated cause intelligence creates the editorial-quality content that fills keyword gaps, supports FAQ schema for rich SERP results, and gives donors educational context before they give.
Technical approach: RAG (Retrieval Augmented Generation) pipeline pulling from curated cause databases, news APIs, and public nonprofit data. Content refreshed periodically, with human review for sensitive topics.
Graceful fallback: Community pages display user-contributed descriptions and manually curated FAQ pairs. Functional but less comprehensive.
3. Impact Summary Generator (NEW — current build uses template/heuristic copy)
What it does: Creates personalized impact narratives for Profile pages and end-of-year giving recaps. "Your donations this year supported wildfire response in 3 states, helped 12 families with medical bills, and contributed to a community that raised $2.3M for animal welfare."
Why it matters: This is the recognition mechanic that keeps people investing in their profile identity. Raw numbers ("you donated $500") are forgettable. A narrative summary of what that $500 accomplished is shareable, emotionally resonant, and motivates continued giving.
Technical approach: Template-based generation with AI filling in impact-specific details based on the fundraisers donated to and their reported outcomes. Tone is warm, specific, and non-performative.
Graceful fallback: Profile pages show raw statistics (total donated, number of causes supported, communities joined) without narrative framing.
4. Personalized Fundraiser Recommendations (NEW — extends existing community-discovery.ts)
What it does: Profile pages and the feed suggest fundraisers based on giving history, community membership, and cause affinity. "People like you also supported..." discovery that creates cross-pollination between causes and communities.
Why it matters: This creates the engagement loop the assignment asks for ("tie them together to make an engaging experience"). Instead of users only finding fundraisers through direct links or search, the platform actively surfaces relevant opportunities — turning passive donors into engaged network participants.
Technical approach: Collaborative filtering on the giving graph. Users who donated to similar fundraisers get cross-recommended. Combined with the cause affinity vector model used in feed ranking.
Graceful fallback: Show fundraisers from the same community or cause category. Simple but functional.

Instrumentation Strategy
Current state: No analytics/instrumentation layer is implemented in the current build. No lib/analytics, no Beacon API integration, no /analytics route. This is entirely new work.
Target state: The instrumentation layer combines page-level metrics (proving the clone pages are well-built) with feed-level metrics (proving the social layer creates the flywheel). GoFundMe runs 10+ analytics tools (Amplitude, Heap, FullStory, Hotjar, CrazyEgg, Google Analytics, New Relic, OpenTelemetry, Chartbeat, Optimizely). We implement a focused, five-tier instrumentation layer with a single custom analytics SDK and can explain why every metric exists.
Tier 1 — Performance (Real-Time)
MetricTargetRationaleTTFB≤150msGoFundMe measures 491ms. Beating this proves our rendering strategy works.LCP≤1.8sThe above-the-fold donate CTA must render before the user bounces.Full Page Load≤2.2sGoFundMe's 5.2s full load is a conversion killer.CLS≤0.1Donation widgets that shift layout erode trust.Feed Scroll FPS60fpsJanky scroll kills engagement — social feeds live or die on smoothness.Time to Interactive≤2.0sEngagement buttons must be responsive immediately.
Implementation: Custom Performance Observer API wrapper reporting Core Web Vitals per page template, plus custom frame-rate monitoring on feed scroll.
Tier 2 — Conversion Funnel (Clone Pages)
EventRationalecommunity_viewEntry point — measures organic discovery effectivenessfundraiser_clickCommunity → Fundraiser transition ratedonate_intentUser clicks the donate button (pre-payment)donation_completeConversion eventprofile_view_from_fundraiserTrust-checking behavior — measures whether donors verify organizers
Implementation: Custom event emitter using the Beacon API for non-blocking dispatch.
Tier 3 — Feed Engagement
EventRationalefeed_viewHow often users open the feed (daily active usage)feed_scroll_depthHow far down users scroll (content quality signal)feed_card_clickWhich card types drive the most click-throughsfeed_heartLightweight engagement ratefeed_commentDeep engagement ratefeed_shareViral distribution rate — the most important metricfeed_to_donateFeed → fundraiser page → donation conversion
Implementation: Same Beacon API event emitter. Events are non-blocking and don't degrade feed scroll performance.
Tier 4 — Network Growth + Content Health
MetricRationalefollow_actionSocial graph expansion ratecommunity_joinBelonging adoption rateprofile_personalizationIdentity investment (users adding cause badges, bio, highlights)return_visit_rateDoes the feed create a daily habit? (the north star)donation_from_feed vs donation_from_directIs the feed driving incremental donations?feed_event_generation_rateToo few = dead feed, too many = noisecontent_type_distributionIs the feed balanced or dominated by one type?engagement_by_content_typeInforms algorithm tuningtime_to_first_engagementOnboarding effectiveness signal
Implementation: Session-level attribution tracking with source tagging. Background analytics aggregation with daily rollup.
Tier 5 — SEO Health
MetricRationaleSchema validation statusConfirms JSON-LD renders correctly per page typeIndex coverage rateOur Profile pages should be 95%+ indexed vs. GoFundMe's 0%Rich snippet acquisitionTracks whether DonateAction and FAQPage schemas trigger SERP features
Implementation: Build-time schema validation + a dev overlay showing structured data status per page.
Attribution Tracking
The strategic differentiator: tracking the full funnel from organic search → community page → fundraiser click → donation, AND from feed → card click → page → donation. GoFundMe cannot model either path.
Attribution PathWhat It Provesorganic_search → community → fundraiser → donationCommunity pages drive revenueorganic_search → profile → fundraiser → donationIndexed Profiles create trust that convertsreferral → fundraiser → profile_view → donationTrust-verification behavior in social trafficfeed → community → fundraiser → donationFeed drives discovery that convertsfeed → fundraiser → donationFeed drives direct conversionfeed → profile → fundraiser → donationFeed + trust loop drives conversion
Implementation: Session-level attribution with source tagging at each page transition. Displayed in the analytics dashboard as a Sankey diagram.
Analytics Dashboard (/analytics)
A built-in route rendering all five tiers in a single view. This makes instrumentation visible to the assignment reviewer without needing DevTools. Key visualizations:

Performance waterfall: Core Web Vitals per page type, feed scroll frame rate
Conversion Sankey: All attribution paths — organic, feed-sourced, direct, referral — flowing through pages to donation
Feed health pulse: Real-time event generation rate, engagement rate, scroll depth distribution
Network graph: Follower connections, community membership overlap, cause affinity clusters
SEO health: Schema validation status, index coverage, rich snippet acquisition per page type


Technical Architecture
Stack
TechnologyRoleJustificationNext.js 14 (App Router)FrameworkSSR for feed (personalized), SSG for public pages, matches GoFundMe's production stackReact 18UI LayerConcurrent rendering for smooth infinite scroll, Suspense for progressive feed loadingZustand + localStorageData LayerNormalized client store (useFundRightStore) with persist — already implemented. Cross-page state (donations update fundraiser progress, profile stats, community totals) works in-client without a server round-trip. No GraphQL/REST API layer in the current build; GoFundMe uses Apollo GraphQL in production, which would be the natural next step for a production data layer.Tailwind CSSStylingUtility-first, no CSS-in-JS runtime cost, critical for feed scroll performanceOpenAI APIAI LayerFeed personalization, cause intelligence, impact summariesBeacon APIAnalyticsNon-blocking event dispatch that doesn't degrade feed performanceVitestTestingUnit and integration tests for feed logic, algorithm, and data transformations
Data Model
Fields marked with [EXISTING] are in the current lib/data/types.ts + lib/store/index.ts. Fields marked with [NEW] are additions for v2.
User (Profile)
├── id, name, bio, avatar, verified           [EXISTING — in types.ts]
├── coverPhoto                                [NEW]
├── causeIdentity: [CauseCategory]            [NEW — identity badges]
├── stats: { inspired, followers, following,
│            totalDonated, causesSupported }   [PARTIAL — totalDonated exists, others NEW]
├── fundraisers: [Fundraiser]                 [EXISTING — via fundraiserIds]
├── donations: [Donation]                     [EXISTING — via donationIds]
├── communities: [Community]                  [EXISTING — via communityIds]
├── highlights: [Fundraiser|Community]        [NEW — pinned items]
├── givingStreak: Number                      [NEW]
└── impactSummary: String                     [NEW — AI-generated narrative]

Fundraiser
├── id, slug, title, story, goalAmount,
│   raisedAmount                              [EXISTING]
├── organizer: User                           [EXISTING — organizerId]
├── community: Community                      [EXISTING — communityId]
├── donations: [Donation]                     [EXISTING — donationIds]
├── updates: [Update]                         [NEW — organizer posts]
├── milestones: [Milestone]                   [NEW — auto at 25/50/75/100%]
├── images: [Image]                           [EXISTING]
├── donationVelocity: Number                  [NEW — momentum signal]
└── status: active | completed | paused       [EXISTING]

Community
├── id, slug, name, description, causeCategory [EXISTING]
├── fundraisers: [Fundraiser]                  [EXISTING]
├── members: [User]                            [EXISTING — memberIds]
├── stats: { totalRaised, donationCount,
│            fundraiserCount, memberCount }    [EXISTING — computed in store]
├── milestones: [CommunityMilestone]           [NEW]
├── faq: [FAQItem]                             [EXISTING]
├── causeIntelligence: String                  [EXISTING — via getCauseSummary]
└── leaderboard: [{ user, amount, inspired }]  [NEW]

FeedEvent                                      [ENTIRELY NEW ENTITY]
├── id, type: EventType, timestamp
├── actor: User
├── subject: Fundraiser | Community | User
├── metadata: {
│     amount?, milestone?, message?,
│     updateContent?, memberCount?
│   }
├── engagement: { hearts, comments, shares }
└── causeVector: Float[]                       // for feed ranking

EventType: donation | fundraiser_launch | fundraiser_milestone |
           organizer_update | community_milestone | community_join |
           profile_milestone | giving_streak

Donation
├── id, amount, donor: User, fundraiser: Fundraiser [EXISTING]
├── message: String                                  [EXISTING]
├── isPublic: Boolean                                [NEW — amount visibility opt-in]
└── timestamp: DateTime                              [EXISTING]
Project Structure
Existing files shown as-is. New files for v2 marked with ← NEW.
/
├── app/
│   ├── layout.tsx                         # Root layout, nav, schema injection
│   ├── page.tsx                           # Homepage → becomes THE FEED in v2
│   ├── u/[username]/page.tsx              # Profile (ProfilePageContent)
│   ├── f/[slug]/page.tsx                  # Fundraiser (FundraiserPageContent)
│   ├── communities/[slug]/page.tsx        # Community (CommunityPageContent)
│   ├── browse/page.tsx                    # Browse / category pages
│   ├── search/page.tsx                    # Search
│   ├── create/page.tsx                    # Create fundraiser flow
│   ├── ai-traces/page.tsx                 # AI debug traces
│   ├── analytics/page.tsx                 # Instrumentation dashboard          ← NEW
│   └── api/ai/*                           # AI API routes (creation-assist, etc.)
├── components/
│   ├── Header.tsx                         # Global nav
│   ├── Footer.tsx                         # Global footer
│   ├── DonationModal.tsx                  # Donation flow modal
│   ├── JsonLd.tsx                         # JSON-LD schema injector
│   ├── feed/                              #                                    ← NEW DIRECTORY
│   │   ├── FeedPage.tsx                   # Three-column LinkedIn layout        ← NEW
│   │   ├── LeftSidebar.tsx                # Identity summary card               ← NEW
│   │   ├── RightSidebar.tsx               # Trending, spotlight, suggestions    ← NEW
│   │   ├── FeedColumn.tsx                 # Center: composer + tabs + scroll    ← NEW
│   │   ├── PostComposer.tsx               # "Start a post" bar                 ← NEW
│   │   ├── FeedCard.tsx                   # Polymorphic card by event type      ← NEW
│   │   ├── EngagementBar.tsx              # Heart, comment, share, bookmark     ← NEW
│   │   └── ...card variants               # DonationCard, MilestoneCard, etc.  ← NEW
│   └── ...existing components
├── lib/
│   ├── store/index.ts                     # Zustand store (useFundRightStore)
│   ├── data/
│   │   ├── types.ts                       # Core TypeScript types
│   │   └── seed.ts                        # Seed/mock data
│   ├── schema/index.ts                    # JSON-LD builders (DonateAction, Person, etc.)
│   ├── ai/
│   │   ├── cause-intelligence.ts          # getCauseSummary (OpenAI + fallback)
│   │   ├── creation-assistant.ts          # Story drafting (OpenAI)
│   │   ├── community-discovery.ts         # Fundraiser ranking (OpenAI + fallback)
│   │   ├── trust-impact.ts               # buildTrustSummary (template, not LLM)
│   │   └── service.ts                     # callAI wrapper
│   ├── feed/                              #                                    ← NEW DIRECTORY
│   │   ├── algorithm.ts                   # Feed ranking logic                 ← NEW
│   │   ├── eventGenerator.ts              # Creates FeedEvents from actions    ← NEW
│   │   └── causeAffinity.ts              # Cause vector similarity            ← NEW
│   └── analytics/                         # Event emitter, Beacon API          ← NEW DIRECTORY
└── public/
Rendering Strategy
PageStrategyRationaleFeed (/, authenticated)SSR with streamingPersonalized per user, Suspense boundaries for progressive loadingHomepage (/, unauthenticated)SSGMarketing landing page, fully cacheable, existing HomePageContentProfile (/u/[username])SSG with ISR (60s)Public page, cacheable, revalidates on donation eventsFundraiser (/f/[slug])SSG with ISR (30s)Donation amounts change frequently, above-fold must be fastCommunity (/communities/[slug])SSG with ISR (300s)Changes less frequently, heavy on AI-generated contentAnalytics (/analytics)Client-side onlyReal-time dashboard, no SEO value needed
Performance Budget
ResourceBudgetEnforcementFirst-party JS≤120 KB (gzipped)Build-time bundle analysisThird-party JS0 KBNo external SDKs — all analytics are first-partyImages per feed card≤50 KB (WebP, lazy-loaded)next/image with quality optimizationTotal page weight (initial load)≤400 KBWell under GoFundMe's 4.3 MBFeed card render time≤16ms per cardMust maintain 60fps scroll
Performance Strategy
GoFundMe's measured performance: 491ms TTFB, 873ms DOM Content Loaded, 5.2s full page load. Our targets and how we hit them:
TechniqueImpactStatic generation for above-the-fold contentTTFB ≤ 150ms — no server-side API calls for initial renderSSR with streaming for the feedPersonalized content loads progressively via Suspense boundariesDeferred third-party scripts (defer / async)Unblocks main thread for critical rendering pathImage optimization via next/image with lazy loadingReduces initial payload by 60-70% on image-heavy fundraiser pagesEdge caching via CDN headersRepeat visits serve from cache with near-zero TTFBSingle analytics layer (no multi-SDK tax)Avoids GoFundMe's problem of loading 10+ tracking scripts simultaneouslyBeacon API for analytics dispatchEvent tracking doesn't block the main threadVirtualized feed renderingOnly visible cards are in the DOM — prevents memory bloat on long scroll sessions

SEO & AEO Strategy (Supporting Role)
SEO is no longer the primary growth thesis — social network effects are. But structured data and indexing still matter for two reasons:

Search validates social sharing. When someone shares a fundraiser link on Twitter and a recipient Googles the organizer's name, an indexed Profile page with Person schema builds trust. Search is downstream of social, not upstream.
AI citation still has value. Community pages with FAQ schema and cause intelligence content are well-positioned for AI Overview citations. This is a brand-building channel, not a traffic channel.

SEO Competitive Advantages
Based on the Semrush and BuiltWith audits, these are the specific gaps we exploit:
GoFundMe WeaknessOur FixProfile pages noindexed (0% index rate)Fully indexed with Person + ProfilePage schemaNo DonateAction schema on fundraiser pagesDonateAction + MonetaryAmount for rich SERP cardsCommunity pages have no structured dataOrganization/NGO + FAQPage + BreadcrumbListBroken internal link loop (profiles are dead zones)Closed three-node link graph passing equity between all page typesNo cause intelligence contentAI-generated cause context on Community pagesDefensive fee transparency ("how much does gofundme take")Proactive fee comparison section on Community pagesNo FAQ schema despite high "People Also Ask" volumeFAQPage schema targeting top cause-related questionsog:type set to proprietary gofundme:campaign on Community pagesStandard Open Graph types (website, profile, article)
AEO/GEO Play
The AEO strategy shifts from "win search traffic" to "win citations that validate the platform's authority." Community pages with FAQ schema, direct-answer blocks, and cause intelligence content are built to be cited by AI Overviews and generative search. When Perplexity answers "best ways to support wildfire relief" and cites a FundRight community page, that's a brand impression that feeds back into the social flywheel — people trust the platform more, share it more, the network grows.

Implementation Plan
Phase 1 — Foundation + Clone Pages (Weeks 1-2, ~30 hours)
Build the three assigned pages first as enhanced GoFundMe clones.
#TicketDescription1Project scaffoldingNext.js 14 App Router, Tailwind, Zustand, folder structure2Data model + seed dataAll entities (User, Fundraiser, Community, FeedEvent, Donation) with demo data3Shared component libraryFundraiserCard, FollowButton, EngagementBar, SchemaInjector, DonationWidget4Profile pageIdentity header, giving dashboard, activity feed, highlights, cause badges5Fundraiser pageAbove-fold conversion zone, donation stream, updates feed, community context6Community pageCommunity header, cause intelligence, fundraiser directory, member grid7Cross-page linkingProfile ↔ Fundraiser ↔ Community closed loop, breadcrumbs, attribution links8JSON-LD schemaPerson, DonateAction, FAQPage, Organization, BreadcrumbList per page type
Phase 2 — The Feed Page (Weeks 2-3, ~20 hours)
Build the LinkedIn-style feed page as the fourth surface layered on top.
#TicketDescription9Homepage auth splitConditional routing on / — authenticated users see FeedPage, unauthenticated see existing HomePageContent10Feed event systemEvent generator that creates FeedEvents from user actions (donate, launch, milestone, join)11Feed page — three-column layoutLinkedIn-style responsive grid: left sidebar, center feed, right sidebar12Left sidebar — identity cardAvatar, stats, vanity metrics, community list, saved items13Center feed — infinite scrollCard rendering by event type, feed tabs (For You / Following / Trending), skeleton loading14Post composer"Start a post" bar with Video, Photo, Story, Start Fundraiser actions15Right sidebar — discoveryTrending fundraisers, community spotlight, suggested people, FundRight News16Feed algorithmCause affinity scoring, social graph weighting, recency decay, diversity mixing17Feed ↔ page transitionsClick-through to detail pages, scroll position preservation on back navigation
Phase 3 — AI + Intelligence (Weeks 3-4, ~15 hours)
#TicketDescription18Feed personalization engineAI-powered "For You" ranking based on cause affinity and social graph19Cause intelligenceRAG pipeline for community page cause summaries and FAQ generation20Impact summariesAI-generated profile narratives from giving history21Fundraiser story assistantAI-assisted story drafting for fundraiser creation
Phase 4 — Instrumentation + Polish (Week 4, ~15 hours)
#TicketDescription22Performance instrumentationCore Web Vitals, feed scroll FPS, TTI tracking23Engagement instrumentationFeed events (view, scroll depth, click, heart, comment, share, donate)24Network growth instrumentationFollow, join, profile personalization, return visit tracking25Attribution trackingFeed-sourced vs. direct-sourced donation attribution with Sankey visualization26Analytics dashboard/analytics route with all five tiers visualized27Performance optimizationBundle analysis, image optimization, scroll performance tuning28Demo scenarioEnd-to-end walkthrough: feed → community → fundraiser → profile → donate → flywheel
Total: 28 tickets, 4 phases, ~82 hours

Demo Scenario: The Social Donation Journey
The demo walks through the complete flywheel in action:

Open the app — as an authenticated user, you land directly on the feed (unauthenticated visitors would see the marketing homepage instead). You see that your friend Sarah donated to a wildfire relief fundraiser, the Climate Action community just crossed $500K total raised, and a fundraiser you donated to last week hit its goal. Your identity card on the left shows your giving stats and communities.
Scroll and discover — three cards down, the feed surfaces the Watch Duty community because your giving history shows cause affinity for environment and disaster relief. You tap to explore.
Browse the community — the Community page shows 200+ members, $1.2M total raised, and a live community feed of recent donations and milestones. The AI-generated cause intelligence section explains the current wildfire season and why funding matters now. You hit "Join."
Click into a fundraiser — "Real-Time Alerts for Wildfire Safety" catches your eye. The fundraiser page shows it's 73% funded, the organizer has 93 followers and has inspired 21 people, and the most recent donation was 4 minutes ago. Momentum is visible.
Check the organizer — you click through to Janahan's profile. His giving dashboard shows 12 causes supported, 3 active communities, and an AI-generated impact summary. He's legit.
Donate — back on the fundraiser page, you donate $50 and add a message: "Every second counts when wildfires threaten our communities."
The flywheel turns — your donation generates a feed event. Your 47 followers see it in their feeds. Two of them click through to the same fundraiser. One donates. The community's total ticks up. A milestone is triggered. The cycle continues.
Analytics capture everything — the dashboard shows the full attribution path: feed → community → fundraiser → profile_view → fundraiser → donation. Feed-sourced conversion tracked, engagement metrics recorded, network growth measured.


Key Differentiators (Interview Talking Points)

You built what they asked for AND showed what's missing. The three clone pages prove execution. The feed page proves product thinking. Most candidates will build a better GoFundMe. You're showing them the LinkedIn-of-philanthropy strategy they're already pursuing — and the missing piece that makes it work.
You understand the platform pivot. GoFundMe isn't optimizing a donation tool — they're building a social network around philanthropic identity. The feed is the missing piece that connects their three new surfaces into a coherent product.
You see what the data actually says. 87% branded traffic, algorithm-killed long tail, AI Overviews eating the funnel — search can't be the growth engine. Social network effects are the strategic bet, and the product architecture must reflect that.
The LinkedIn layout is a deliberate choice. LinkedIn solved the "social network homepage" problem. The three-column layout (identity sidebar + feed + discovery sidebar) is a proven UX pattern for professional/identity-based networks. Applying it to philanthropy isn't copying — it's recognizing the structural similarity between professional identity and philanthropic identity.
The feed solves the retention problem. GoFundMe's current architecture has no daily engagement hook. The feed creates a reason to come back that isn't "I need to donate right now."
AI serves the network, not just content. Feed personalization, cause affinity, impact summaries — AI is the intelligence layer that makes the social network work, not a chatbot bolted onto a donation form.
Performance enables the social experience. A feed that takes 5 seconds to load can't create scroll-and-engage behavior. The performance story isn't about beating GoFundMe's Lighthouse score — it's about enabling the social UX that their tech debt prevents.
Recognition is the growth mechanic. "Inspired X people" is the vanity metric. The feed is where that recognition happens publicly. The profile is where it accumulates. The community is where it compounds. Every piece of the architecture feeds the recognition loop.


Getting Started
bash# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
Navigate to http://localhost:3000 to view the application.
Key routes:

/ — The Feed (LinkedIn-style social homepage)
/communities/watch-duty — Community page (SEO entry point + belonging)
/f/realtime-alerts-for-wildfire-safety — Fundraiser page (conversion + social moments)
/u/janahan — Profile page (trust authority + reputation asset)
/analytics — Instrumentation dashboard (all five tiers visualized)


Key Technical Differentiators

Four pages, not three. The assignment asks for Profile, Fundraiser, and Community. We build all three as enhanced clones — then add a LinkedIn-style Feed page that demonstrates the product vision GoFundMe is working toward but hasn't shipped yet.
Indexed Profile pages. GoFundMe deliberately noindexes all /u/ pages. We index them with Person schema, creating search surface for organizer credibility queries that no fundraising platform currently owns.
Full structured data stack. DonateAction on fundraisers, FAQPage on communities, Person on profiles. GoFundMe implements none of these despite ranking for 547K keywords.
Closed-loop internal linking. Every page reinforces every other page's authority. GoFundMe's Profile pages are dead zones in the link graph; ours pass and receive equity.
AI as network intelligence. Four AI capabilities serving the social network: feed personalization, cause intelligence, impact summaries, and personalized recommendations — not a chatbot bolted on.
Transparent instrumentation. A visible analytics dashboard with five tiers of metrics, each with a documented rationale. The reviewer doesn't have to open DevTools to see that the platform is well-instrumented.
Performance-first rendering. Static generation for above-the-fold content, SSR with streaming for the feed, deferred scripts, optimized images. Targeting TTFB ≤ 150ms vs. GoFundMe's measured 491ms.
The social flywheel. Give → feed event → followers see → engage → give. The feed creates a daily engagement loop that GoFundMe's current architecture cannot support.