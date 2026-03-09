# FundRight — AI-Powered Fundraising Platform

A reimagined fundraising experience built around three interconnected page types — **Profile**, **Fundraiser**, and **Community** — designed to solve a deeper UX problem in GoFundMe's current experience: trust, discovery, and belonging are trapped inside separate pages instead of working together as one donor journey.

## Project Context

This project is a response to an open-ended assignment: reverse-engineer GoFundMe's Profile, Fundraiser, and Community pages, then build a better version using AI. The assignment evaluates three things — page load performance, seamless integration between pages, and instrumentation with a clear rationale for every metric captured.

Rather than cloning GoFundMe's UI, this project is informed by three layers of research:

- **BuiltWith Technology Audit** — a full inventory of GoFundMe's 285+ technologies across analytics, CDN, payments, frameworks, and infrastructure
- **Semrush SEO Deep Scan** — a reverse-engineering of GoFundMe's search architecture revealing that its Profile pages are fully deindexed, Community pages have zero structured data, and Fundraiser pages lack DonateAction schema
- **Lighthouse Audit Brief** — a March 8, 2026 mobile Lighthouse run showing a 45 Performance score, 5.0s LCP, 2,210ms TBT, and a 4.3 MB payload on `gofundme.com`

Those findings matter, but they are not the product thesis by themselves. The real product insight is that GoFundMe's page types do not form a coherent experience:

- **Fundraiser pages convert in isolation** but provide limited organizer and cause context
- **Community pages aggregate activity** but do not strongly guide a donor toward the most relevant next action
- **Profile pages show identity** but are not treated as a first-class trust layer in the donor journey

FundRight treats the three page types as a connected system:

- **Profile = trust layer**
- **Fundraiser = conversion layer**
- **Community = discovery and belonging layer**

Every architectural decision below is designed to strengthen those roles and the transitions between them.

Two additional strategy implications now shape the build:

- **GoFundMe's search moat is heavily branded**, which means the biggest growth opportunity is non-branded and transactional discovery such as "fundraise for wildfire relief" or "help pay medical bills"
- **Thin user-generated content is likely part of the keyword erosion problem**, so content quality controls matter as much as indexability

---

## Documentation

All project docs are in **[docs/](docs/)**:

| Category | Contents |
|----------|----------|
| [docs/product/](docs/product/) | [FundRight-PRD.md](docs/product/FundRight-PRD.md) — PRD, tickets (FR-001–FR-023), acceptance criteria |
| [docs/development/](docs/development/) | [DEVLOG.md](docs/development/DEVLOG.md) — dev log, ticket status, dependencies |
| [docs/research/](docs/research/) | UX audit, interview blueprint, BuiltWith tech stack audit |
| [docs/seo/](docs/seo/) | SEO deep scan, page architecture |
| [docs/audits/](docs/audits/) | Lighthouse audit brief |

See [docs/README.md](docs/README.md) for the full index.

---

## Architecture Decisions

### Stack: Next.js + React

GoFundMe runs Next.js with React in production. We match this choice deliberately — not out of imitation, but because Next.js gives us SSR/SSG, file-based routing, built-in image optimization, and edge caching, all of which directly serve the "fast response times" requirement. The framework is proven at GoFundMe's scale, which removes stack risk from the equation and lets us focus on what we do differently.

### Data Layer: GraphQL (Apollo)

GoFundMe uses Apollo GraphQL. For a platform where a single page view often needs data from multiple entity types (a Community page shows fundraisers, organizers, aggregate stats, and cause context), GraphQL eliminates the waterfall of REST calls. A single query can hydrate an entire Community page with its fundraisers, organizer profiles, and donation statistics.

### Three-Page Closed-Loop Architecture

The core innovation is a **closed trust and discovery graph** that makes each page answer a different donor question:

```
Profile ──────► Community ──────► Fundraiser
   ▲                                    │
   └────────────────────────────────────┘
```

- **Profile → Community**: "What causes does this person consistently show up for?"
- **Community → Fundraiser**: "Which campaign should I support right now?"
- **Fundraiser → Profile**: "Why should I trust this organizer?"

GoFundMe breaks this loop by treating these pages as loosely related surfaces instead of one connected journey. We fix that with persistent identity, visible relationships between people and causes, and instrumentation across every transition. Keeping all three page types indexable supports this strategy, but search is a consequence of better information architecture, not the sole objective.

---

## Page Specifications

### Profile Page (`/u/[username]`)

**Product Role: Trust Layer**

GoFundMe's Profile pages are the missing trust surface. When a donor lands on a fundraiser, they need fast answers to: who is this person, what have they organized before, how are they connected to this cause, and should I believe they can deliver impact? Our profile page is designed to answer those questions in one place.

**Key features:**
- Giving identity dashboard (total raised, causes supported, communities joined)
- Verification badges and linked social accounts
- AI-generated impact summary that turns fundraising history into unique, crawlable trust content
- Fundraiser history as a structured `ItemList` in JSON-LD
- Community memberships with clear cause affinity
- Trust evidence modules: organizer history, updates posted, and repeat support signals

**Schema:** `Person`, `ProfilePage`, `ItemList`, `BreadcrumbList`
**SERP target:** Person Knowledge Card, Sitelinks
**Index status:** Index + Follow

### Fundraiser Page (`/f/[slug]`)

**Product Role: Conversion Layer**

GoFundMe's fundraiser pages are good at presenting a single campaign, but the surrounding trust and context are thin. Our fundraiser page is designed to convert while making credibility and next-step exploration obvious, not hidden.

**Key features:**
- Above-the-fold static render (headline, goal, donate CTA) for sub-1.8s LCP
- Content-quality guardrails: strong story structure, freshness via updates, and a minimum-quality content threshold
- Donation progress with real-time updates via shared state
- AI-generated impact projections ("Your $50 provides 2 days of wildfire alerts")
- Organizer attribution linking back to their indexed Profile
- Parent Community link with descriptive anchor text
- Related fundraisers in the same community to strengthen discovery and internal linking
- Related trust signals: recent donors, organizer activity, and reason-this-campaign-now context

**Schema:** `DonateAction`, `MonetaryAmount`, `BreadcrumbList`
**SERP target:** Donation Rich Card, Sitelinks
**Index status:** Index + Follow

### Community Page (`/communities/[slug]`)

**Product Role: Discovery and Belonging Layer**

GoFundMe's Community pages aggregate campaigns, but they do not do enough product work. A donor still has to decide what the cause is, why it matters now, which fundraiser is most relevant, and how this campaign fits the broader movement. Our community page is designed to guide that decision instead of acting as a passive directory.

**Key features:**
- AI-powered "Cause Intelligence" section with contextual information about the cause
- FAQ section with `FAQPage` schema targeting top questions about the cause
- Fundraiser directory with aggregate statistics (total raised, donation count, active campaigns)
- Guided discovery modules such as "most urgent," "closest to goal," and "best match for your interests"
- Direct-answer blocks for high-intent queries such as "how to help," "how to start," and fee/transparency questions
- Fee transparency section attacking GoFundMe's defensive weakness on the "how much does gofundme take" query cluster
- Leaderboard of top fundraisers and donors

**Schema:** `Organization`/`NGO`, `FAQPage`, `BreadcrumbList`, `AggregateRating`
**SERP target:** Featured Snippet, AI Overview citation, FAQ Rich Result
**Index status:** Index + Follow

---

## AI Integration

The assignment requires using AI to "think outside the box." Rather than bolting on a chatbot, AI is embedded where it reduces donor uncertainty or organizer friction:

1. **Fundraiser Story Generator** — Given bullet points about a cause, AI drafts a compelling fundraiser narrative and lifts thin user-generated copy toward a stronger quality baseline. This addresses the cold-start problem (most fundraisers fail because the story is poorly written) and supports long-term discoverability.

2. **Cause Intelligence Summaries** — Community pages feature AI-generated context about the cause (funding landscape, recent developments, impact statistics). This helps donors understand the bigger picture before choosing a fundraiser.

3. **Personalized Fundraiser Recommendations** — Community and Profile pages suggest fundraisers based on giving history, urgency, and cause affinity. This turns the experience from browsing a list into getting guided toward the next best action.

---

## Instrumentation Strategy

The assignment requires being "well instrumented" with an explanation of what metrics are captured and why. GoFundMe runs 10+ analytics tools (Amplitude, Heap, FullStory, Hotjar, CrazyEgg, Google Analytics, New Relic, OpenTelemetry, Chartbeat, Optimizely). We implement a focused, four-tier instrumentation layer that captures not just traffic, but whether the three pages work together to build trust and drive action.

### Tier 1 — Performance (Real-Time)

| Metric | Target | Why |
|---|---|---|
| TTFB | ≤ 150ms | Lighthouse shows homepage TTFB is not the primary bottleneck; this target preserves fast navigation while we focus on render performance. |
| LCP | ≤ 1.8s | The above-the-fold donate CTA must render before the user bounces. |
| TBT | ≤ 200ms | GoFundMe's 2,210ms TBT shows the page feels blocked even after bytes arrive. |
| Full Page Load | ≤ 2.2s | GoFundMe's 45 Lighthouse performance score and 4.3 MB payload indicate severe load-time inefficiency. |
| CLS | ≤ 0.1 | Donation widgets that shift layout erode trust. |

**Implementation:** Custom Performance Observer API wrapper reporting Core Web Vitals per page template.

### Tier 2 — Conversion Funnel

| Event | Why |
|---|---|
| `community_view` | Entry point — measures whether the cause hub is actually being used |
| `fundraiser_click` | Community → Fundraiser transition rate |
| `donate_intent` | User clicks the donate button (pre-payment) |
| `donation_complete` | Conversion event |
| `profile_view_from_fundraiser` | Trust-checking behavior — measures whether donors verify organizers |
| `fundraiser_click_from_profile` | Measures whether profile pages create enough trust to drive action |
| `recommended_fundraiser_click` | Measures whether guided discovery is more effective than raw directories |

**Implementation:** Custom event emitter using the Beacon API for non-blocking dispatch. Events stored in-memory and rendered in a visible analytics dashboard.

### Tier 3 — SEO Health

| Metric | Why |
|---|---|
| Schema validation status | Confirms JSON-LD renders correctly per page type |
| Index coverage rate | Our Profile pages should be 95%+ indexed vs. GoFundMe's 0% |
| Rich snippet acquisition | Tracks whether DonateAction and FAQPage schemas trigger SERP features |
| Non-branded keyword reach | Confirms the experience can win discovery beyond existing brand demand |
| Content quality pass rate | Confirms fundraiser pages meet minimum story and freshness thresholds before indexing |

**Implementation:** Build-time schema validation + a dev overlay showing structured data status per page.

### Tier 4 — Journey Attribution

The strategic differentiator: tracking the full funnel from landing page → trust check → fundraiser choice → donation. Search attribution still matters, but the primary product question is whether connected pages improve donor confidence and session depth.

| Attribution Path | Why |
|---|---|
| `organic_search → community → fundraiser → donation` | Proves Community pages drive revenue |
| `organic_search → profile → fundraiser → donation` | Proves indexed Profiles create trust that converts |
| `referral → fundraiser → profile_view → donation` | Measures trust-verification behavior in social traffic |
| `community → recommendation_click → fundraiser → donation` | Measures whether AI guidance improves discovery quality |

**Implementation:** Session-level attribution tracking with source tagging at each page transition. Displayed in the analytics dashboard as a Sankey diagram of traffic flow.

### Analytics Dashboard

A built-in `/analytics` route renders all four tiers in a single view, making instrumentation visible to the reviewer rather than hidden in console logs. This is a deliberate choice — the presentation of metrics matters as much as collecting them.

---

## Performance Strategy

GoFundMe's March 8, 2026 Lighthouse homepage audit measured a 45 Performance score, 5.0s LCP, 2,210ms TBT, and a 4.3 MB payload. The important takeaway is that JavaScript and third-party tags, not raw backend response time, are the dominant bottleneck. Our targets and how we hit them:

| Technique | Impact |
|---|---|
| Static generation for above-the-fold content | Keeps first paint fast and avoids waiting on dynamic API calls for critical content |
| Deferred third-party scripts (`defer` / `async`) | Unblocks main thread for critical rendering path |
| Image optimization via `next/image` with lazy loading | Reduces initial payload by 60-70% on image-heavy fundraiser pages |
| Edge caching via CDN headers | Repeat visits serve from cache with near-zero TTFB |
| Single analytics layer (no multi-SDK tax) | Avoids GoFundMe's problem of loading 10+ tracking scripts and 2s+ of main-thread blocking |
| Beacon API for analytics dispatch | Event tracking doesn't block the main thread |

---

## SEO Competitive Advantages

Based on the Semrush audit, these are the specific gaps we exploit:

| GoFundMe Weakness | Our Fix |
|---|---|
| Profile pages noindexed (0% index rate) | Fully indexed with Person + ProfilePage schema |
| No DonateAction schema on fundraiser pages | DonateAction + MonetaryAmount for rich SERP cards |
| Community pages have no structured data | Organization/NGO + FAQPage + BreadcrumbList |
| Broken internal link loop (profiles are dead zones) | Closed three-node link graph passing equity between all page types |
| Over-reliance on branded discovery | Community pages target non-branded and transactional cause queries |
| Thin user-generated fundraiser copy | AI story generation + content-quality guardrails + updates feed |
| No cause intelligence content | AI-generated cause context on Community pages |
| Defensive fee transparency ("how much does gofundme take") | Proactive fee comparison section on Community pages |
| No FAQ schema despite high "People Also Ask" volume | FAQPage schema targeting top cause-related questions |
| `og:type` set to proprietary `gofundme:campaign` on Community pages | Standard Open Graph types (`website`, `profile`, `article`) |

---

## Data Model

```
User (Profile)
├── id, name, bio, avatar, verified, socialLinks
├── fundraisers: [Fundraiser]        // campaigns they organized
├── donations: [Donation]             // their giving history
└── communities: [Community]          // memberships

Fundraiser
├── id, slug, title, story, goalAmount, raisedAmount
├── organizer: User                   // links to Profile
├── community: Community              // links to parent Community
├── donations: [Donation]
├── images: [Image]
└── updates: [Update]

Community
├── id, slug, name, description, causeCategory
├── fundraisers: [Fundraiser]         // constituent campaigns
├── members: [User]                   // linked Profiles
├── faq: [FAQItem]                    // for FAQPage schema
├── causeIntelligence: String          // AI-generated cause context
└── stats: { totalRaised, donationCount, fundraiserCount }

Donation
├── id, amount, donor: User, fundraiser: Fundraiser
├── message: String
└── timestamp: DateTime
```

---

## Project Structure

```
/
├── app/
│   ├── layout.tsx                    # Root layout with nav + schema injection
│   ├── page.tsx                      # Homepage / discovery
│   ├── u/[username]/page.tsx         # Profile page
│   ├── f/[slug]/page.tsx             # Fundraiser page
│   ├── communities/[slug]/page.tsx   # Community page
│   └── analytics/page.tsx            # Instrumentation dashboard
├── components/
│   ├── DonationWidget.tsx
│   ├── FundraiserCard.tsx
│   ├── CommunityLeaderboard.tsx
│   ├── ProfileBadge.tsx
│   ├── CauseIntelligence.tsx         # AI-powered cause context
│   ├── StoryGenerator.tsx            # AI fundraiser story drafting
│   ├── SchemaInjector.tsx            # JSON-LD generator per page type
│   └── AnalyticsDashboard.tsx
├── lib/
│   ├── schema/                       # JSON-LD builders (Person, DonateAction, FAQPage, etc.)
│   ├── analytics/                    # Event emitter, Beacon API dispatcher, attribution tracker
│   ├── ai/                           # AI integration (story generation, cause intelligence, recommendations)
│   └── data/                         # Mock data + GraphQL resolvers
├── docs/                 # All project documentation (see docs/README.md)
├── public/
│   └── assets/
└── README.md
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

Navigate to `http://localhost:3000` to view the application.

**Key routes:**
- `/communities/watch-duty` — Community page (SEO entry point)
- `/f/realtime-alerts-for-wildfire-safety` — Fundraiser page (conversion)
- `/u/janahan` — Profile page (trust authority)
- `/analytics` — Instrumentation dashboard

---

## Demo Scenario: Wildfire Relief

All three pages are built around a wildfire relief theme to demonstrate the integrated experience:

1. A visitor discovers the **Watch Duty Community** page via organic search for "wildfire relief fundraising"
2. They browse active fundraisers and click into the **Real-Time Alerts for Wildfire Safety** fundraiser
3. Before donating, they click the organizer's name to view **Janahan's Profile** — seeing their giving history, verification badges, and community memberships
4. They return to the fundraiser and complete a donation
5. The **Analytics Dashboard** tracks this full attribution path: `organic → community → fundraiser → profile_view → donation`

This flow demonstrates seamless integration, the trust-building value of indexed profiles, and the instrumentation capturing every transition.

---

## Key Technical Differentiators

1. **Indexed Profile pages** — GoFundMe deliberately noindexes all `/u/` pages. We index them with Person schema, creating search surface for organizer credibility queries that no fundraising platform currently owns.

2. **Full structured data stack** — DonateAction on fundraisers, FAQPage on communities, Person on profiles. GoFundMe implements none of these despite ranking for 838K keywords.

3. **Closed-loop internal linking** — Every page reinforces every other page's authority. GoFundMe's Profile pages are dead zones in the link graph; ours pass and receive equity.

4. **AI as content infrastructure** — AI generates cause intelligence, fundraiser stories, and personalized recommendations — not as a gimmick but as content that fills the keyword gaps the SEO audit identified.

5. **Transparent instrumentation** — A visible analytics dashboard with four tiers of metrics, each with a documented rationale. The reviewer doesn't have to open DevTools to see that the platform is well-instrumented.

6. **Performance-first rendering** — Static generation for above-the-fold content, deferred scripts, optimized images. Targeting ≤ 1.8s LCP and ≤ 200ms TBT vs. GoFundMe's measured 5.0s LCP and 2,210ms TBT.

---

## License

MIT
