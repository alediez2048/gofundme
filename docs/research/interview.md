# Interview Blueprint: Next-Generation GoFundMe Architecture

**Role:** Senior Full-Stack Engineer & UX Product Architect
**Date:** March 8, 2026
**Objective:** Answer 20 critical pre-code questions using first principles, competitive research (BuiltWith + Semrush + Lighthouse), and an uncompromising focus on the real UX problem: fragmented trust, weak fundraiser discovery, and missing continuity between profile, fundraiser, and community pages.

---

## Part 1: Architecture & Stack

---

### Question 1: SPA or Multi-Page?

**The tension:** "Seamless integration" pulls toward SPA. "Fast response times" pulls toward server rendering. The assignment explicitly requires both.

#### Option A: Pure SPA (Vite + React Router)

Client-side routing with a single HTML shell. All navigation happens in-browser with no full page reloads.

- **User Engagement:** Smooth transitions, instant navigation after initial load. Feels like a native app.
- **Performance:** Slow first paint (entire app bundle must load before anything renders). Poor SEO — crawlers see an empty shell. TTFB is fast but LCP is late because content depends on JavaScript execution.
- **Implementation Complexity:** Low. No server infrastructure, no SSR hydration bugs, no edge caching logic.

#### Option B: Traditional MPA (Server-Rendered Pages, No Client Routing)

Each page is a full server render. Clicking a link triggers a full page reload with server-generated HTML.

- **User Engagement:** Every navigation is a hard reload. The "seamless" requirement is dead on arrival. Users see white flashes between pages.
- **Performance:** Excellent first paint — HTML arrives fully rendered. TTFB depends on server speed but LCP is immediate since content is in the initial payload. No JavaScript required for content visibility.
- **Implementation Complexity:** Low. Standard request/response cycle. No hydration, no client-side state management for routing.

#### Option C: Hybrid SSR/SSG with Client-Side Navigation (Next.js App Router)

Pages are statically generated or server-rendered at the edge. After the initial load, Next.js takes over with client-side routing — subsequent navigations are instant SPA-style transitions with prefetched data.

- **User Engagement:** Best of both worlds. First visit is server-fast. Every subsequent navigation is SPA-smooth. Prefetching means hovering over a link starts loading the next page before the click.
- **Performance:** TTFB ≤ 150ms via static generation. LCP ≤ 1.8s because above-the-fold content is in the initial HTML. Client-side transitions after first load are sub-100ms. This directly beats GoFundMe's March 8, 2026 Lighthouse homepage baseline of 5.0s LCP, 2,210ms TBT, and a 45 Performance score.
- **Implementation Complexity:** Medium-high. Requires understanding SSR vs. SSG vs. ISR trade-offs. Hydration mismatches are a real debugging cost. Edge caching configuration is non-trivial.

#### Winner: Option C — Next.js Hybrid (SSR/SSG + Client Navigation)

**Why it matters for the fundraiser:** The donation conversion funnel starts the moment a page loads. A page with 5.0s LCP and 2,210ms TBT does not just feel slow; it feels unreliable. The hybrid approach means the first page load (typically from an external link or search result) is server-fast, and every subsequent navigation within the platform (community → fundraiser → profile) is instant.

**How it will be implemented:**

- Fundraiser pages (`/f/[slug]`): Static Generation (SSG) with Incremental Static Regeneration (ISR) at 60-second intervals. The above-the-fold content (title, goal, donate CTA) is baked into HTML at build time. Donation counts update via client-side fetch after hydration.
- Community pages (`/communities/[slug]`): SSG with ISR. The FAQ section, cause intelligence, and aggregate stats are static. The fundraiser leaderboard updates client-side.
- Profile pages (`/u/[username]`): SSG for verified profiles. Server-side rendering (SSR) for dynamic profiles with recent activity. The giving history loads progressively.
- Navigation: Next.js `<Link>` component with `prefetch={true}` (default). When a user hovers over any internal link, the destination page's data starts loading. By the time they click, the transition is near-instant.

**Expected outcome:** TTFB ≤ 150ms for all three page types. LCP ≤ 1.8s. Full interactive load ≤ 2.2s. Client-side navigation between pages ≤ 100ms perceived latency. These numbers beat GoFundMe's current performance by 3x.

---

### Question 2: Where Does AI Live?

**The tension:** "Use AI to build your own version" is ambiguous. AI as a build tool is invisible to the evaluator. AI as a user-facing feature is visible but risks feeling gimmicky. The prompt says "think outside the box."

#### Option A: AI as Build-Time Tool Only

Use AI (Claude, GPT) to generate the codebase, write copy, create mock data, and design components. The AI is in the development process, not the product.

- **User Engagement:** Zero. The user never sees or interacts with AI. The product is indistinguishable from one built without AI.
- **Performance:** No runtime cost. No API calls, no latency, no token costs.
- **Implementation Complexity:** Lowest. You're just using AI as a development accelerator — no integration needed.

#### Option B: AI as a Single Feature (Fundraiser Story Generator)

One AI-powered feature: paste bullet points about your cause, and AI drafts a compelling fundraiser narrative. Visible, demonstrable, contained.

- **User Engagement:** High for the organizer (the person creating the fundraiser). Zero for the donor. The feature is useful but only touches one user type at one moment in the journey.
- **Performance:** Requires an API call to an LLM. Latency of 2-5 seconds for generation. Can be async/streaming to avoid blocking.
- **Implementation Complexity:** Medium. Requires API key management, prompt engineering, streaming response handling, and a UI for the generation flow.

#### Option C: AI as Content Infrastructure (Three Integrated Features)

AI is embedded across all three page types: (1) Fundraiser Story Generator for organizers, (2) Cause Intelligence summaries on Community pages, and (3) Personalized Fundraiser Recommendations on Profile pages.

- **User Engagement:** High across all user types. Organizers get story drafting. Donors get context about causes. Returning users get personalized discovery. AI touches every page type, which directly serves the "tie them together" requirement.
- **Performance:** Three AI touchpoints means three potential latency sources. Mitigation: Cause Intelligence is pre-generated at build time (SSG), recommendations are computed from local data (no API call), and Story Generator is the only real-time API call — which is user-initiated and expected to take a moment.
- **Implementation Complexity:** High. Three distinct AI features, each with different data requirements and UX patterns. But the payoff is that every page demonstrates AI integration, not just one.

#### Winner: Option C — AI as Content Infrastructure

**Why it matters for the fundraiser:** The donor problem is not just missing content; it is missing confidence and guidance. AI helps on both fronts. Cause Intelligence gives Community pages enough context for a donor to understand why the cause matters now. Personalized recommendations help them choose a fundraiser instead of browsing a flat directory. The Story Generator addresses the organizer-side cold-start problem: many fundraisers underperform because the story is weak, not because the need is weak.

**How it will be implemented:**

- **Cause Intelligence (Community page):** Pre-generated at build time using an LLM prompted with the community's cause category, name, and public data. Output is a 200-300 word contextual summary stored as static content. Regenerated on ISR cycle. No runtime API call — zero performance cost to the donor.
- **Fundraiser Story Generator (Fundraiser creation flow):** A textarea where the organizer enters bullet points. On submit, a streaming API call to Claude/GPT generates a narrative draft. The response streams token-by-token into a preview pane. The organizer can edit, regenerate, or discard. This is the only real-time AI call in the product.
- **Personalized Recommendations (Profile page):** Client-side collaborative filtering based on the user's donation history and community memberships. No LLM API call — this is algorithmic recommendation using the local data graph. "You donated to wildfire relief → here are 3 active wildfire fundraisers in communities you follow." Fast, deterministic, and privacy-preserving.

**Expected outcome:** Every page type demonstrates AI integration. The evaluator sees AI on the Community page (cause context), the Fundraiser page (story generator), and the Profile page (recommendations). This is "outside the box" because it's not a chatbot bolted onto a sidebar — it's AI as a structural content layer that makes each page type more useful.

---

### Question 3: Real Backend or Mock Data?

**The tension:** A real backend proves engineering depth but consumes 60% of project time on infrastructure that's invisible to the user. Mock data ships faster but can feel hollow if interactions don't produce visible results.

#### Option A: Full Backend (PostgreSQL + Prisma + API Routes)

Real database, real ORM, real CRUD operations. Donations are persisted, profiles are mutable, communities have real membership.

- **User Engagement:** Every action has real consequences. Donate, and the progress bar updates permanently. Join a community, and the member count changes. This feels like a real product.
- **Performance:** Database queries add latency. Connection pooling, query optimization, and caching become concerns. Cold starts on serverless are a risk.
- **Implementation Complexity:** Very high. Schema design, migrations, seed data, API route security, error handling, connection management. Easily 40-60% of total development time.

#### Option B: Static/Seeded JSON Data (No Backend)

All data is hardcoded JSON files imported at build time. No API calls, no database. Interactions are visual-only (clicking "donate" shows an animation but changes nothing).

- **User Engagement:** Low. The user quickly realizes nothing is real. Clicking "donate" and seeing no change in the progress bar breaks immersion. The "seamless integration" requirement suffers because cross-page data consistency is faked.
- **Performance:** Maximum. Zero API calls, zero latency. Every page is pure static HTML with embedded data. TTFB approaches zero.
- **Implementation Complexity:** Lowest. Author JSON, import it, render it. No infrastructure, no state, no errors.

#### Option C: In-Memory Reactive Data Layer (Zustand/Context + Seeded Data)

Seed data loaded at app initialization into a client-side store (Zustand or React Context). All interactions mutate the in-memory store. A donation updates the fundraiser's raised amount, the donor's profile history, and the community's aggregate — all in the same session. Data resets on refresh, but during a session, the experience is fully interactive.

- **User Engagement:** High. Every action produces visible cross-page results. Donate $50, navigate to the profile, see it in the giving history. Navigate to the community, see the total raised update. The integration feels real because the data graph is real — it's just not persisted.
- **Performance:** Near-zero latency. All data is in-memory. State updates are synchronous React re-renders. No network calls for data mutations.
- **Implementation Complexity:** Medium. Requires a well-designed store with normalized entities and cross-entity update logic. But no database, no API routes, no connection pooling.

#### Winner: Option C — In-Memory Reactive Data Layer

**Why it matters for the fundraiser:** The assignment evaluates "seamless integration" between three pages. The only way to demonstrate real integration is for actions on one page to produce visible results on another. An in-memory store achieves this without the infrastructure overhead of a real backend. When the evaluator donates on a fundraiser, then navigates to the profile and sees that donation in the giving history, the integration is undeniable. The data resets on refresh — but during a demo walkthrough, it's indistinguishable from a real backend.

**How it will be implemented:**

- **Store:** Zustand with normalized entity slices — `users`, `fundraisers`, `communities`, `donations`. Each entity has a unique ID. Relationships are stored as ID references.
- **Seed data:** A `seed.ts` file containing 3-5 fundraisers, 2 communities, 5-8 user profiles, and 20-30 donations. Enough data to feel populated but not so much that it's overwhelming.
- **Mutations:** `addDonation(fundraiserId, amount, donorId)` updates four things atomically: (1) creates a donation record, (2) increments the fundraiser's `raisedAmount`, (3) adds the donation to the donor's history, (4) increments the parent community's aggregate stats.
- **Persistence (optional):** `zustand/middleware` with `persist` to localStorage. Data survives page refreshes during a demo session. This is a one-line addition that dramatically improves the demo experience.

**Expected outcome:** Full cross-page reactivity with zero backend infrastructure. The evaluator experiences a product where every interaction has consequences visible across all three page types. Implementation time: ~4 hours for the store + seed data, vs. ~20+ hours for a real backend with equivalent cross-page reactivity.

---

## Part 2: Data Model & Page Relationships

---

### Question 4: How Do the Three Pages Actually Connect?

**The tension:** The prompt says "tie them together." A minimal graph (Profile → Fundraiser → Community) satisfies the requirement. A richer graph (with donors, comments, followers) creates a stickier experience but increases complexity.

#### Option A: Minimal Graph (Three Edges)

Profile owns Fundraisers. Community contains Fundraisers. Fundraiser belongs to Profile. Three entities, three relationships.

- **User Engagement:** Functional but flat. You can navigate from a fundraiser to its organizer and from a community to its fundraisers. But there's no social layer — no sense of other people.
- **Performance:** Minimal data fetching. Each page needs at most one join.
- **Implementation Complexity:** Low. Three foreign keys, three relationships. Clean and simple.

#### Option B: Social Graph (Donors as Profiles, Comments, Followers)

Every donor is a Profile. Fundraisers have comment threads. Profiles follow Communities. Donations link donor Profiles to Fundraisers bidirectionally.

- **User Engagement:** High. The community page shows real faces (donor avatars). The fundraiser page has social proof (comments and recent donors). The profile page shows both giving and organizing. The platform feels alive with people.
- **Performance:** More complex queries. A fundraiser page now needs fundraiser data + organizer data + recent donors + comments. Without GraphQL, this is a waterfall. With it, it's one query.
- **Implementation Complexity:** High. Comments need a thread model. Followers need a many-to-many relationship. Donor profiles need to be navigable.

#### Option C: Rich Graph with Prioritized Edges

All three entities are fully interconnected, but with a clear hierarchy of which edges are essential (rendered above the fold) vs. progressive (loaded on scroll or interaction). Donors are profiles. Communities have members. Fundraisers have a donor wall. But comments, followers, and activity feeds are deferred.

- **User Engagement:** High where it matters (social proof, cross-page navigation) without overwhelming the page with secondary features. The donor wall on a fundraiser page creates urgency. Member avatars on a community page create belonging. Both link to profiles, completing the graph.
- **Performance:** Above-the-fold data is minimal (fundraiser + organizer + top 5 donors). Below-the-fold data (full donor list, member directory) loads progressively. This preserves LCP while enriching the page.
- **Implementation Complexity:** Medium. The data model is rich but the rendering is prioritized. Progressive loading means you build the full model but only render critical paths first.

#### Winner: Option C — Rich Graph with Prioritized Edges

**Why it matters for the fundraiser:** Social proof drives donations, but the deeper product goal is to remove hesitation. A fundraiser page showing "Sarah donated $100 2 hours ago" with a clickable link to Sarah's profile creates urgency, trust, and momentum at the same time. A donor can validate the organizer, understand the broader cause, and return to the campaign without losing context. The Semrush audit showed GoFundMe's Profile pages are deindexed; more importantly, it showed that trust is isolated instead of compounding across the journey. Ours does both.

**How it will be implemented:**

- **Entity graph:**
  ```
  User ←→ Donation ←→ Fundraiser ←→ Community ←→ User (member)
       ↕                    ↕
    organizes            belongs to
  ```
- **Critical edges (above-the-fold):** Fundraiser → Organizer (Profile link), Fundraiser → Top 5 Donors (avatar + name + amount), Community → Top 3 Fundraisers (card preview), Profile → Active Fundraisers (card list), Profile → Communities (badge list).
- **Progressive edges (below-the-fold):** Full donor wall (virtualized list), complete member directory, donation history timeline, community activity feed.
- **Navigation flows:** Every entity name/avatar is a link. Click a donor name → their profile. Click a community badge → the community page. Click a fundraiser card → the fundraiser page. The graph is navigable from every node.

**Expected outcome:** A three-page experience where every element invites deeper exploration. Average session depth target: 3+ page views per visit (vs. GoFundMe's likely 1.5-2 due to their broken profile link graph). The evaluator naturally clicks through all three pages because the UI invites it.

---

### Question 5: What's the Minimum Data Schema Per Entity?

**The tension:** Defining too many fields leads to scope creep and empty UI states. Defining too few makes pages feel like wireframes. The goal is the minimum schema that makes each page feel complete.

#### Option A: Bare Minimum (Display-Only Fields)

Each entity has only what's needed to render a static page. No computed fields, no relationships beyond IDs, no metadata.

- **User Engagement:** Pages render but feel like mockups. No dynamic elements, no computed stats, no progressive disclosure.
- **Performance:** Minimal data size. Fast to load, fast to render.
- **Implementation Complexity:** Lowest. 5-8 fields per entity.

#### Option B: Full Production Schema

Every field GoFundMe uses: timestamps, statuses, categories, tags, verification levels, social shares, update histories, media galleries, SEO metadata, and schema.org fields.

- **User Engagement:** Complete. Every UI element has real data behind it. But many fields will be empty in a demo, creating awkward "N/A" states.
- **Performance:** Large data objects. More fields to serialize, more bytes over the wire (even if in-memory).
- **Implementation Complexity:** Very high. 30+ fields per entity. Most time spent on fields that don't improve the demo.

#### Option C: "Demo-Complete" Schema

Every field that's visible in the UI exists in the schema. No hidden fields "for future use." Every field has a value in the seed data. If a UI element needs data, the field exists. If no UI element uses it, the field doesn't exist.

- **User Engagement:** Every page feels complete because every visible element has real data. No empty states, no placeholder text, no "coming soon" sections.
- **Performance:** Right-sized. Typically 12-18 fields per entity — enough for a rich page, small enough for instant in-memory access.
- **Implementation Complexity:** Medium. Requires designing the UI first (or in parallel) to know which fields are needed. This is a feature, not a bug — it forces intentional design.

#### Winner: Option C — Demo-Complete Schema

**Why it matters for the fundraiser:** Empty UI states kill credibility. A fundraiser page with "0 updates" and "No comments yet" tells the evaluator this is a skeleton. A fundraiser with 3 updates, 15 donors, and a 67% funded progress bar tells them this is a product. The schema should be the exact shape of the UI — no more, no less.

**How it will be implemented:**

**User (Profile):**
```typescript
{
  id: string
  username: string
  displayName: string
  avatar: string
  bio: string
  verified: boolean
  joinedDate: string
  socialLinks: { platform: string; url: string }[]
  totalRaised: number          // computed from donations
  totalDonated: number         // computed from donations
  causesSupported: number      // computed from unique fundraisers donated to
  fundraiserIds: string[]      // campaigns they organized
  communityIds: string[]       // memberships
  donationIds: string[]        // giving history
}
```

**Fundraiser:**
```typescript
{
  id: string
  slug: string
  title: string
  story: string               // HTML or markdown
  heroImage: string
  images: string[]
  goalAmount: number
  raisedAmount: number         // computed from donations
  donationCount: number        // computed
  organizerId: string          // links to User
  communityId: string | null   // links to Community
  category: string
  createdDate: string
  lastDonationDate: string
  updates: { date: string; text: string }[]
  donationIds: string[]
  status: 'active' | 'completed' | 'overfunded'
}
```

**Community:**
```typescript
{
  id: string
  slug: string
  name: string
  description: string
  bannerImage: string
  avatar: string
  causeCategory: string
  causeIntelligence: string    // AI-generated context
  totalRaised: number          // computed aggregate
  donationCount: number        // computed
  fundraiserCount: number      // computed
  memberCount: number          // computed
  fundraiserIds: string[]
  memberIds: string[]
  faq: { question: string; answer: string }[]
  createdDate: string
}
```

**Donation:**
```typescript
{
  id: string
  amount: number
  donorId: string
  fundraiserId: string
  message: string | null
  createdDate: string
  isAnonymous: boolean
}
```

**Expected outcome:** Four entities, ~15 fields each, every field used in the UI. Seed data contains 2 communities, 5 fundraisers, 8 users, and 30 donations — enough to feel populated across all pages without being overwhelming.

---

## Part 3: The "Well Instrumented" Requirement

---

### Question 6: What Does "Well Instrumented" Mean Concretely?

**The tension:** Instrumentation can mean performance monitoring, product analytics, business metrics, or all three. The prompt says "explain what metrics you'll capture and why" — meaning the rationale matters as much as the implementation.

#### Option A: Performance Metrics Only (Core Web Vitals)

Track TTFB, LCP, CLS, FID/INP for each page type. Display in a dev overlay or dashboard.

- **User Engagement:** Zero direct impact. Performance metrics are invisible to the end user.
- **Performance:** Minimal overhead. Performance Observer API is native and lightweight.
- **Implementation Complexity:** Low. ~50 lines of code using the Performance Observer API.

#### Option B: Product Analytics Only (Events + Funnels)

Track user actions: page views, button clicks, donation events, navigation patterns. Build a conversion funnel from community → fundraiser → donate.

- **User Engagement:** Indirect. The analytics don't affect the user, but the insights they generate improve the product over time.
- **Performance:** Low overhead if using Beacon API for non-blocking dispatch. Higher if using a third-party SDK.
- **Implementation Complexity:** Medium. Event emitter, event taxonomy, funnel definition, and a way to visualize the data.

#### Option C: Four-Tier Instrumentation (Performance + Product + SEO + Attribution)

Four distinct layers: (1) Performance — Core Web Vitals per page template, (2) Product — conversion funnel events, (3) SEO — schema validation, index readiness, (4) Attribution — multi-page journey tracking from entry to donation. Each tier has a documented "why."

- **User Engagement:** The analytics dashboard itself becomes an engaging page for the evaluator. It tells the story of the platform's health and user behavior in a single view.
- **Performance:** More tracking means more code. Mitigation: all tracking is non-blocking (Beacon API + requestIdleCallback). Total analytics footprint target: < 5KB gzipped.
- **Implementation Complexity:** High. Four systems with different data shapes, different collection methods, and a unified dashboard to display them.

#### Winner: Option C — Four-Tier Instrumentation

**Why it matters for the fundraiser:** The assignment says "well instrumented" and "explain what metrics you'll capture and why." Option A answers the "what" but not the "why." Option B has a story but misses performance. Option C is the only approach that can answer: "How fast does the page load?" (Tier 1), "Are users completing the donation funnel?" (Tier 2), "Will search engines render our schema correctly?" (Tier 3), and "Which entry page drives the most donations?" (Tier 4). Each tier answers a different business question.

**How it will be implemented:**

- **Tier 1 (Performance):** Custom `useWebVitals()` hook wrapping the `web-vitals` library. Reports TTFB, LCP, CLS, INP per page type. Data stored in Zustand analytics slice.
- **Tier 2 (Product):** Custom `track(event, properties)` function. Events: `page_view`, `fundraiser_click`, `donate_intent`, `donation_complete`, `profile_view`, `community_join`. Dispatched via `navigator.sendBeacon()` to avoid blocking the main thread.
- **Tier 3 (SEO):** Build-time validation script that parses each page's JSON-LD output against schema.org specs. Runtime: a dev overlay that shows the current page's structured data with a green/red validation indicator.
- **Tier 4 (Attribution):** Session-level journey tracking. On first page load, assign a session ID and record the entry source (referrer, UTM params, or direct). Every subsequent page view is appended to the session journey. On donation_complete, the full path is recorded: `organic → /communities/watch-duty → /f/wildfire-alerts → donation($50)`.
- **Dashboard:** A `/analytics` route with four panels — one per tier. Real data from the current session. The evaluator can use the product, then visit `/analytics` and see their own journey visualized.

**Expected outcome:** The evaluator spends 5 minutes using the product, then visits the analytics dashboard and sees their own behavior reflected — their page views, their navigation path, the performance of every page they loaded, and the schema validation status. This is a "wow" moment that most submissions won't have.

---

### Question 7: What Tooling?

**The tension:** Third-party analytics SDKs (PostHog, Mixpanel) provide rich features but add 30-100KB to the bundle and create external dependencies. Custom analytics are lightweight but require building the visualization layer.

#### Option A: Third-Party SDK (PostHog Self-Hosted)

Deploy PostHog's open-source analytics. Full session replay, funnels, feature flags, and dashboards out of the box.

- **User Engagement:** Rich analytics dashboard with session replay — impressive to demo.
- **Performance:** PostHog's JS bundle is ~70KB gzipped. This alone could blow the performance budget. Plus, it phones home to a server, adding network requests.
- **Implementation Complexity:** Medium for setup (Docker compose, env config), but low for instrumentation (just call `posthog.capture()`).

#### Option B: Lightweight Third-Party (Plausible / Umami)

Privacy-focused analytics with a ~1KB script. Basic pageviews, referrers, and goals. No session replay, no funnels.

- **User Engagement:** Clean dashboard but limited depth. Can't show funnels or attribution paths.
- **Performance:** Excellent. < 1KB script, single HTTP request per pageview.
- **Implementation Complexity:** Low. Drop in a script tag and configure goals.

#### Option C: Custom Analytics Layer (Zero Dependencies)

Build a bespoke event system: custom `track()` function, in-memory event store (Zustand), Beacon API for dispatch, and a React-based dashboard component.

- **User Engagement:** The dashboard is custom-built to tell exactly the story we want. We control every pixel, every metric, every visualization.
- **Performance:** Minimal. No external scripts. Event collection is ~2KB of custom code. The dashboard component only loads when visiting `/analytics`.
- **Implementation Complexity:** Medium-high. We build the event emitter (~50 lines), the store (~30 lines), and the dashboard (~200 lines of React). Total: ~280 lines of purpose-built analytics code.

#### Winner: Option C — Custom Analytics Layer

**Why it matters for the fundraiser:** The assignment says "explain what metrics you'll capture and why." A third-party tool captures everything and explains nothing. A custom layer captures exactly what we decide matters and forces us to articulate why each metric exists. The dashboard becomes a product artifact, not a vendor dependency. It also adds zero external scripts to the bundle — directly serving the "fast response times" requirement.

**How it will be implemented:**

- **Event emitter:**
  ```typescript
  export function track(event: string, properties?: Record<string, any>) {
    const entry = {
      event,
      properties,
      timestamp: Date.now(),
      page: window.location.pathname,
      sessionId: getSessionId(),
    };
    analyticsStore.getState().addEvent(entry);
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify(entry));
    }
  }
  ```
- **Store:** Zustand slice with `events: AnalyticsEvent[]` array. Dashboard reads from this store directly.
- **Dashboard components:** Four panels rendered with Recharts (already a common Next.js dependency): (1) Performance gauge chart showing CWV scores, (2) Funnel chart showing conversion steps, (3) Schema validation checklist, (4) Sankey diagram showing attribution paths.
- **Total bundle impact:** ~2KB for the event system (loaded on every page). ~15KB for the dashboard (loaded only on `/analytics` via dynamic import). Zero impact on fundraiser/community/profile page performance.

**Expected outcome:** A self-contained analytics system with zero external dependencies, zero privacy concerns, and a dashboard that tells the exact story we want the evaluator to see. Total implementation: ~6 hours.

---

## Part 4: Scope & Differentiation

---

### Question 8: What's Your MVP Cut?

**The tension:** The prompt is open-ended. Building everything risks shipping nothing. Building too little risks looking lazy. The MVP must hit all three requirements (fast, integrated, instrumented) with zero filler.

#### Option A: Three Static Pages + Basic Styling

Each page renders with hardcoded data. No interactions, no state, no analytics. Looks complete at a glance.

- **User Engagement:** Low. It's a brochure. No clicks produce results. The evaluator sees a screenshot, not a product.
- **Performance:** Maximum. Static HTML.
- **Implementation Complexity:** Lowest. ~8 hours total.

#### Option B: Full Feature Build (AI + Payments + Auth + Analytics)

Build everything: real AI integration, simulated payment flow, user authentication, full analytics dashboard, edge cases, tests.

- **User Engagement:** Maximum — if it ships. The risk is that 80% completion of everything looks worse than 100% completion of a focused set.
- **Performance:** Variable. More features means more JavaScript, more API calls, more potential failure points.
- **Implementation Complexity:** Very high. ~80+ hours. Risk of incomplete features that look broken rather than polished.

#### Option C: "Polished Wedge" (Three Interactive Pages + Analytics Dashboard + One AI Feature)

Ship four routes: Community, Fundraiser, Profile, and Analytics Dashboard. Full cross-page interactivity via in-memory store. One AI feature (Cause Intelligence on Community page). Schema markup on all pages. Performance within budget.

- **User Engagement:** High where it counts. Every page is interactive. Cross-page navigation produces visible data changes. The AI feature is tangible. The analytics dashboard provides the "explain your metrics" deliverable.
- **Performance:** Controlled. Four routes, known data shapes, no external APIs except one build-time AI generation.
- **Implementation Complexity:** Medium. ~40 hours. Achievable with focus and discipline.

#### Winner: Option C — Polished Wedge

**Why it matters for the fundraiser:** A polished 80% beats a rough 100% every time. The evaluator will spend 5-10 minutes with the submission. In that time, they'll load a page (is it fast?), click between pages (are they integrated?), and look for instrumentation (is it visible?). The Polished Wedge delivers a "yes" to all three in the first 2 minutes. Additional AI features (Story Generator, Recommendations) are stretch goals layered on after the core is solid.

**How it will be implemented:**

- **Week 1 (Days 1-3):** Project scaffold, data model, seed data, Zustand store, three page layouts with above-the-fold content. Goal: all three pages render with real data and cross-link to each other.
- **Week 1 (Days 4-5):** Donation flow, state mutations, cross-page reactivity. Goal: donate on a fundraiser, see it reflected on the profile.
- **Week 2 (Days 1-2):** Analytics layer — event tracking, CWV collection, dashboard route. Goal: `/analytics` shows real data from the current session.
- **Week 2 (Day 3):** AI integration — Cause Intelligence on Community page. Schema markup on all three page types. Goal: structured data validates, AI content renders.
- **Week 2 (Days 4-5):** Polish — edge cases, responsive design, transitions, skeleton loaders, error states. Performance audit. Goal: every page loads within budget, every edge case is handled.
- **Stretch:** Story Generator, Personalized Recommendations, session persistence, animated transitions.

**Expected outcome:** A submission where every feature that exists is polished and functional. No half-built features, no placeholder sections, no "coming soon" text. The evaluator sees a product, not a prototype.

---

### Question 9: What's Your "Outside the Box" Angle?

**The tension:** "Think outside the box" is an invitation to differentiate. A gimmick (chatbot, AI avatar) is outside the box but adds no value. A structural innovation (indexed profiles, cause intelligence) is subtle but competitively devastating.

#### Option A: AI Chatbot / Donation Assistant

A conversational AI that helps donors choose how much to give, answers questions about the fundraiser, and guides them through the donation flow.

- **User Engagement:** Novel but friction-adding. Most donors know what they want to give. A chatbot adds a step between intent and action.
- **Performance:** Requires real-time LLM API calls. Latency is 1-3 seconds per response. Streaming mitigates perception but not reality.
- **Implementation Complexity:** High. Chat UI, message history, context management, prompt engineering, error handling.

#### Option B: AI-Generated Fundraiser Impact Projections

When a donor enters a dollar amount, AI generates a concrete impact statement: "$50 provides real-time wildfire alerts to 200 families for one month." The impact projection is specific to the fundraiser's cause and scales with the donation amount.

- **User Engagement:** Very high. Converts an abstract dollar amount into a concrete, emotional outcome. This is the exact moment in the donation funnel where motivation wavers — and impact projections address that moment directly.
- **Performance:** Can be pre-computed for common amounts ($25, $50, $100, $250) at build time. Custom amounts use a simple interpolation — no API call needed.
- **Implementation Complexity:** Medium. Requires defining impact metrics per cause category, a mapping function from dollars to outcomes, and a UI component in the donation widget.

#### Option C: Cause Intelligence + Indexed Profiles (Structural SEO Innovation)

Two innovations packaged as one: (1) AI-generated Cause Intelligence summaries on Community pages that fill the content gap the Semrush audit identified, and (2) fully indexed Profile pages with Person schema — exploiting the fact that GoFundMe deliberately deindexes all `/u/` pages, leaving the "organizer credibility" search space completely unoccupied.

- **User Engagement:** Indirect but deep. Cause Intelligence gives donors context they can't get on GoFundMe ("the wildfire funding landscape in 2026"). Indexed profiles mean organizers can be found via Google — a trust signal that compounds over time.
- **Performance:** Cause Intelligence is pre-generated static content. Indexed profiles are SSG pages. Zero runtime performance cost.
- **Implementation Complexity:** Medium. Cause Intelligence requires one AI prompt per community at build time. Profile indexing requires correct meta tags and Person schema — a few hours of implementation for a massive competitive advantage.

#### Winner: Option B + C Combined — Impact Projections + Structural SEO Innovation

**Why it matters for the fundraiser:** Option B wins the moment of donation. Option C wins the discovery layer. Together, they address both ends of the funnel: how donors find fundraisers (indexed profiles + cause intelligence) and what pushes them to give (impact projections). Neither is a gimmick. Both are demonstrable in under 30 seconds. And the Semrush audit proves the competitive opening exists.

**How it will be implemented:**

- **Impact Projections:** Define a `causeImpactMap` with per-category metrics:
  ```typescript
  const causeImpactMap = {
    'wildfire-safety': {
      unit: 'families receive real-time alerts',
      costPerUnit: 0.25,
      timeframe: 'for one month'
    },
    'medical': {
      unit: 'hours of treatment covered',
      costPerUnit: 15,
      timeframe: ''
    }
  };
  ```
  The donation widget computes `Math.floor(amount / costPerUnit)` and renders: "Your $50 means 200 families receive real-time alerts for one month." Pre-computed for $25/$50/$100/$250, interpolated for custom amounts.

- **Cause Intelligence:** One Claude API call per community at build time. Prompt: "Write a 200-word contextual summary of [cause] for potential donors. Include: current state of the issue, why funding matters now, and what impact donations have had." Output cached as static content in the community's seed data.

- **Indexed Profiles:** Remove the `noindex, nofollow` meta tag that GoFundMe uses. Add `Person` + `ProfilePage` JSON-LD schema. Ensure every profile has a canonical URL, proper Open Graph tags, and a descriptive meta description.

**Expected outcome:** Three visible innovations — impact projections in the donation widget (emotional), cause intelligence on community pages (informational), and indexed profiles with Person schema (structural). The evaluator sees all three in a natural walkthrough. The SEO argument is backed by the Semrush data in the README.

---

### Question 10: How Will You Demonstrate Integration Between Pages?

**The tension:** "Seamlessly integrated" could mean linked navigation (minimal) or shared state that reflects actions across pages (maximal). The evaluator can only assess integration they can see.

#### Option A: Linked Navigation Only

Every entity name is a clickable link. Fundraiser → Profile (organizer). Community → Fundraiser (listing). Profile → Community (membership). No shared state beyond navigation.

- **User Engagement:** Functional but passive. The user clicks around but nothing they do changes anything. It's a hyperlinked document, not an integrated experience.
- **Performance:** Excellent. No state synchronization, no re-renders, no data mutations.
- **Implementation Complexity:** Low. `<Link>` components on entity names.

#### Option B: Shared State with Visual Feedback

Donations update the fundraiser progress bar, the profile giving history, and the community aggregate — all visible. Toasts confirm cross-page effects: "Your donation will appear on your profile."

- **User Engagement:** High. The user sees their actions ripple across the system. This is the "integrated" that the prompt is asking for.
- **Performance:** Zustand state updates are synchronous. Re-renders are scoped to subscribed components. No performance penalty.
- **Implementation Complexity:** Medium. Requires the normalized Zustand store from Question 3, plus UI components that subscribe to the right state slices.

#### Option C: Shared State + Cross-Page Breadcrumb Trail + Animated Transitions

Everything in Option B, plus: a persistent breadcrumb showing the user's navigation path (Community → Fundraiser → Profile), animated page transitions using Framer Motion, and skeleton loaders during prefetch.

- **User Engagement:** Maximum. The user's journey is visible (breadcrumb), transitions feel polished (animations), and loading states are handled (skeletons). The experience feels like a consumer product, not a developer demo.
- **Performance:** Framer Motion adds ~25KB to the bundle. Skeleton loaders add rendering complexity. But both are deferred/lazy-loaded — they don't affect LCP.
- **Implementation Complexity:** Medium-high. Breadcrumb requires tracking navigation history. Animations require Framer Motion integration with Next.js page transitions. Skeleton loaders require per-component loading states.

#### Winner: Option B — Shared State with Visual Feedback

**Why it matters for the fundraiser:** Option C is beautiful but the animation polish is diminishing returns vs. Option B's core demonstration of integration. The evaluator's "aha" moment is: "I donated on the fundraiser page, and when I clicked the organizer's profile, my donation was already in their giving history." That moment doesn't need a breadcrumb trail or animated transitions — it needs correct state propagation. Animations are a stretch goal, not a requirement.

**How it will be implemented:**

- **Donation flow:**
  1. User clicks "Donate" on fundraiser page → modal opens with amount input and impact projection
  2. User confirms → `addDonation()` fires, updating Zustand store atomically
  3. Fundraiser page: progress bar animates to new percentage, donor wall adds the new entry, donation count increments
  4. Toast notification: "Donation added! View it on your profile →" (with link)
  5. Profile page: giving history includes the new donation with timestamp
  6. Community page: aggregate stats reflect the new total

- **Navigation integration:**
  - Every organizer name on a fundraiser page links to `/u/[username]`
  - Every community badge on a profile links to `/communities/[slug]`
  - Every fundraiser card on a community page links to `/f/[slug]`
  - Every fundraiser on a profile links to `/f/[slug]`
  - Back navigation preserves scroll position via Next.js scroll restoration

- **Visual feedback:**
  - Progress bar uses CSS transition (0.5s ease) when `raisedAmount` changes
  - Donor wall uses `AnimatePresence` (if Framer Motion is included) or CSS `@keyframes` for new entry animation
  - Toast notification via a lightweight custom component (not a library)

**Expected outcome:** A 30-second demo loop that proves integration: navigate to community → click a fundraiser → donate → see the progress bar update → click the organizer → see the donation in their history → click the community → see the aggregate update. Every step is visible and connected.

---

## Part 5: Design & UX

---

### Question 11: What's the Visual Identity?

**The tension:** Cloning GoFundMe looks unoriginal. Going wildly different looks like you ignored the reference. The sweet spot is "inspired by but better than."

#### Option A: GoFundMe Clone (Green + White + Card-Based)

Match GoFundMe's palette (#02a95c green, white backgrounds, card layouts), fonts (proxima-nova), and spacing. Essentially a reskin.

- **User Engagement:** Familiar but forgettable. The evaluator sees "this looks like GoFundMe" and moves on.
- **Performance:** No impact — it's just colors and fonts.
- **Implementation Complexity:** Low. Copy the visual language, change the content.

#### Option B: Radically Different (Dark Mode, Brutalist, or Magazine-Style)

Go bold — dark backgrounds, large typography, editorial layout, unconventional grid. Stand out immediately.

- **User Engagement:** High attention-grabbing. But fundraising is about trust, and trust requires warmth. A dark, brutalist fundraiser page may create visual distance when the goal is emotional connection.
- **Performance:** No impact.
- **Implementation Complexity:** Medium. Custom design system from scratch.

#### Option C: Warm Modern (Elevated GoFundMe — Softer Palette, Better Typography, More Whitespace)

Take GoFundMe's structural DNA (card-based, progress bars, social proof widgets) but elevate it: a softer color palette (warm greens, subtle gradients), better typography (Inter or Plus Jakarta Sans), more whitespace, and deliberate use of photography over illustrations. Think "GoFundMe redesigned by a premium agency."

- **User Engagement:** High. Familiar enough to feel trustworthy, polished enough to feel premium. The visual upgrade signals that this version cares more about the donor experience.
- **Performance:** Slightly positive — modern system fonts (Inter) load faster than GoFundMe's Typekit-hosted proxima-nova.
- **Implementation Complexity:** Medium. Requires a small design system (color tokens, spacing scale, typography scale) but no radical invention.

#### Winner: Option C — Warm Modern

**Why it matters for the fundraiser:** Trust is the currency of fundraising. Visual polish signals legitimacy. A fundraiser page that looks like it was designed by a professional team is more likely to receive donations than one that looks like a template. The "warm modern" approach keeps the structural patterns donors expect (progress bar, donate button, social proof) while making them feel more premium.

**How it will be implemented:**

- **Color tokens:** Primary: `#059669` (emerald-600, warmer than GoFundMe's green). Background: `#fafaf9` (stone-50, warm white). Accent: `#f59e0b` (amber-500, for CTAs and urgency). Text: `#1c1917` (stone-900). These are all Tailwind defaults — zero custom configuration needed.
- **Typography:** Inter via `next/font/google` (zero layout shift, subset loading). H1: 36px/700. Body: 16px/400. Captions: 14px/500.
- **Spacing:** 4px base unit. Consistent 16px padding on cards, 24px between sections, 32px page margins.
- **Components:** Tailwind CSS utility classes. No component library dependency (no Material UI, no Chakra). Every component is purpose-built for the fundraising context.

**Expected outcome:** A visual identity that feels like GoFundMe's more polished, more premium sibling. The evaluator's first impression is "this looks professional" — which is the foundation for every subsequent interaction feeling trustworthy.

---

### Question 12: Mobile-First or Desktop-First?

**The tension:** GoFundMe's traffic is majority mobile. Fundraiser links are shared via text, social media, and email — all mobile-first channels. But the evaluator likely reviews on a desktop browser.

#### Option A: Desktop-First

Design for 1280px+ viewports. Add responsive breakpoints for tablet and mobile afterward.

- **User Engagement:** Evaluator sees the best version immediately. But mobile experience is an afterthought — cramped donation widgets, overflowing text, tiny tap targets.
- **Performance:** No direct impact, but desktop-first CSS often produces larger stylesheets with more overrides.
- **Implementation Complexity:** Low initially, high for mobile retrofit.

#### Option B: Mobile-First

Design for 375px (iPhone SE) viewport. Add responsive breakpoints for tablet and desktop as enhancements.

- **User Engagement:** The donation flow — the most important interaction — is designed for the context where most real donations happen. But the evaluator's first impression (on desktop) may look sparse with too much whitespace.
- **Performance:** Mobile-first CSS is smaller by default. Base styles are minimal; desktop enhancements are additive.
- **Implementation Complexity:** Medium. Requires thinking about information hierarchy in a single-column constraint first.

#### Option C: Responsive-Concurrent (Design Key Flows at Both Breakpoints Simultaneously)

Design the donation widget, fundraiser card, and navigation at both 375px and 1280px simultaneously. Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) from the start. The mobile and desktop layouts are designed as equals, not as primary/fallback.

- **User Engagement:** Both mobile and desktop feel intentional. The evaluator gets a polished desktop experience. A mobile spot-check reveals an equally polished mobile experience.
- **Performance:** Same as mobile-first — Tailwind's responsive utilities compile to the same CSS size.
- **Implementation Complexity:** Medium. Slightly more upfront design work, but avoids the retrofit cost of either pure approach.

#### Winner: Option C — Responsive-Concurrent

**Why it matters for the fundraiser:** The donation widget is the single most important UI element. If it works beautifully on mobile and desktop from day one, the platform passes the credibility test for both the evaluator (desktop) and real-world use (mobile). Tailwind's responsive prefixes make concurrent design almost free — `flex flex-col md:flex-row` handles the layout shift in a single line.

**How it will be implemented:**

- **Breakpoints:** `sm: 640px` (large phones), `md: 768px` (tablets), `lg: 1024px` (desktops), `xl: 1280px` (large desktops). These are Tailwind defaults.
- **Key layout shifts:**
  - Fundraiser page: single-column stack on mobile → two-column (story left, donation widget right) on `lg:`
  - Community page: full-width fundraiser cards on mobile → 2-column grid on `md:`, 3-column on `lg:`
  - Profile page: stacked sections on mobile → sidebar (badges + stats) + main content on `lg:`
  - Navigation: hamburger menu on mobile → horizontal nav on `md:`
- **Testing:** Chrome DevTools device mode during development. Quick pass through iPhone SE (375px), iPhone 14 (390px), iPad (768px), and 1280px desktop.

**Expected outcome:** Every page looks intentional at every viewport width. The evaluator can resize their browser window and see smooth layout transitions — a subtle but powerful signal of engineering quality.

---

### Question 13: What's the Emotional Arc of Each Page?

**The tension:** Fundraising is emotional. Data without emotion is a spreadsheet. Emotion without data is a scam. Each page type serves a different emotional purpose, and the UI must serve that purpose deliberately.

#### Option A: Data-Forward (Stats, Numbers, Progress)

Lead with metrics: amount raised, donor count, days remaining, goal percentage. Clean, informational, dashboard-like.

- **User Engagement:** Appeals to analytical donors. But most donation decisions are emotional, not analytical. A data-forward page may inform without motivating.
- **Performance:** Lightweight. Numbers render fast.
- **Implementation Complexity:** Low. Data display is straightforward.

#### Option B: Story-Forward (Narrative, Imagery, Testimonials)

Lead with the fundraiser's story, hero imagery, and donor testimonials. Numbers are secondary, placed below the fold.

- **User Engagement:** High emotional engagement. But if the donate button is below the fold, conversion suffers. Users who are ready to give must scroll past the story to find the CTA.
- **Performance:** Image-heavy. Hero photos and testimonials increase page weight.
- **Implementation Complexity:** Medium. Requires careful image optimization and content hierarchy.

#### Option C: Emotion-First with Progressive Data (Hero → CTA → Story → Social Proof)

A deliberate information architecture that mirrors the donation decision process: (1) Hero image + headline creates immediate emotional context, (2) Progress bar + donate CTA is visible without scrolling — capturing ready donors, (3) Story section builds understanding for undecided donors, (4) Social proof (recent donors, updates) creates urgency and trust.

- **User Engagement:** Optimized for conversion. Every scroll position serves a purpose in the decision journey. Ready donors convert above the fold. Undecided donors are persuaded by the story. Skeptical donors are reassured by social proof.
- **Performance:** The above-the-fold content (hero + CTA) is minimal: one image, one heading, one progress bar, one button. Story and social proof load progressively.
- **Implementation Complexity:** Medium. Requires intentional section ordering and possibly a sticky donation widget.

#### Winner: Option C — Emotion-First with Progressive Data

**Why it matters for the fundraiser:** The emotional arc maps directly to the conversion funnel. A fundraiser page isn't a document — it's a persuasion sequence. The hero creates "I care," the CTA creates "I can help," the story creates "I understand why," and the social proof creates "others trust this too." Each section answers the next objection in the donor's mind.

**How it will be implemented:**

**Fundraiser Page Arc:**
1. **Hero** (above fold): Full-width image + title + organizer name (linked to profile). Emotional hook in 2 seconds.
2. **Donation Widget** (above fold, sticky on desktop): Progress bar, goal/raised, donate button, impact projection. Always accessible.
3. **Story** (below fold): The organizer's narrative. Rendered as rich text with embedded images. This is where AI Story Generator output lives.
4. **Social Proof** (below fold): Recent donors (avatar + name + amount + time), updates from organizer, community badge linking to parent community.

**Community Page Arc:**
1. **Banner + Identity**: Community name, avatar, cause category. Creates "this is a tribe I could belong to."
2. **Aggregate Impact**: Total raised, fundraisers active, members. Creates "this community gets things done."
3. **Cause Intelligence**: AI-generated context. Creates "I understand what this is about."
4. **Fundraiser Directory**: Active campaigns ranked by urgency. Creates "here's where I can help right now."
5. **FAQ**: Answers to common questions. Creates "I trust this — my questions are answered."

**Profile Page Arc:**
1. **Identity**: Name, avatar, verified badge, bio. Creates "this is a real person."
2. **Impact Stats**: Total raised, total donated, causes supported. Creates "this person has a track record."
3. **Active Fundraisers**: Current campaigns they're organizing. Creates "here's what they're working on."
4. **Communities**: Badges showing memberships. Creates "they're connected to legitimate groups."
5. **Giving History**: Timeline of past donations. Creates "they practice what they preach."

**Expected outcome:** Each page tells a story through its section ordering. The evaluator doesn't just see data — they experience a deliberate emotional journey that mirrors how real donors, community members, and profile visitors think.

---

## Part 6: Technical Execution

---

### Question 14: How Are You Handling Images?

**The tension:** Fundraiser pages are image-heavy. Images are the #1 factor in page weight and LCP. GoFundMe's 5.2s load time is partly driven by unoptimized image loading.

#### Option A: Placeholder Services (Unsplash / Lorem Picsum)

Random images from placeholder APIs. Different on every load.

- **User Engagement:** Low. Random images that don't match the fundraiser content create cognitive dissonance. A wildfire fundraiser with a random coffee shop photo breaks immersion.
- **Performance:** Variable. External API calls add latency. No control over image dimensions or format.
- **Implementation Complexity:** Lowest. `src="https://picsum.photos/800/400"` and done.

#### Option B: Curated Static Assets

Hand-selected, pre-optimized images stored in `/public/assets/`. Each fundraiser, community, and profile has a specific image assigned in the seed data.

- **User Engagement:** High. Every image matches its content. The wildfire fundraiser shows wildfire imagery. The community page shows community imagery. The experience is coherent.
- **Performance:** Fully controllable. Images are pre-optimized (WebP, correct dimensions), served from the same origin, and cacheable forever.
- **Implementation Complexity:** Medium. Requires sourcing 15-20 royalty-free images, optimizing them, and assigning them to entities.

#### Option C: Curated Static Assets + next/image Optimization

Same curated images as Option B, but served through Next.js `<Image>` component — automatic WebP conversion, responsive `srcset` generation, lazy loading by default, and blur placeholder during load.

- **User Engagement:** Highest. Images load progressively with a blur-up effect (the blurred placeholder appears instantly, then sharpens as the full image loads). This feels polished and eliminates layout shift.
- **Performance:** Best possible. `next/image` generates responsive variants at build time. A 1200px hero image on mobile loads as a 400px variant — 70% smaller. Lazy loading means below-the-fold images don't block LCP.
- **Implementation Complexity:** Medium. Same as Option B for sourcing, plus using the `<Image>` component (which is one prop change from `<img>`).

#### Winner: Option C — Curated Static Assets + next/image

**Why it matters for the fundraiser:** The hero image is the first thing a donor sees. A fundraiser about wildfire safety showing a crisp, properly-sized wildfire image that loads with a smooth blur-up transition creates immediate emotional resonance. A random stock photo or a slowly-loading JPEG does the opposite.

**How it will be implemented:**

- **Asset sourcing:** 15-20 royalty-free images from Unsplash, downloaded and stored in `/public/images/`. Categories: wildfire/disaster (5), medical (3), community (3), people/avatars (8).
- **Optimization:** All images run through `sharp` at build time — converted to WebP, resized to max 1200px width, compressed to quality 80.
- **Implementation:** `<Image src="/images/wildfire-hero.webp" alt="..." width={1200} height={600} placeholder="blur" blurDataURL={blurHash} priority={isAboveFold} />`. The `priority` prop on above-the-fold hero images disables lazy loading, ensuring they load immediately.
- **Avatar handling:** All user avatars are 64x64 WebP files. Loaded with `next/image` at exact dimensions — no oversized downloads for tiny UI elements.

**Expected outcome:** Hero image LCP ≤ 1.5s. Below-the-fold images load on scroll with blur-up transitions. Total image payload on initial load: < 200KB (hero + 5 avatars). This beats GoFundMe's image loading strategy measurably.

---

### Question 15: What's Your State Management Story?

**The tension:** Cross-page reactivity requires shared state. But shared state adds complexity. The question is how much state needs to be shared vs. local to each page.

#### Option A: No Shared State (Props / Server State Only)

Each page fetches its own data independently. No client-side store. Donations don't propagate.

- **User Engagement:** Dead. Donate on a fundraiser, navigate to the profile, see nothing. The "integration" requirement fails.
- **Performance:** Simplest. No store, no subscriptions, no re-renders.
- **Implementation Complexity:** Lowest.

#### Option B: React Context

A single `AppContext` provider wrapping the app with the full data graph. All components consume from context.

- **User Engagement:** Full cross-page reactivity. Same as Zustand for the user.
- **Performance:** React Context triggers re-renders on every consumer when any value changes. A donation updating `raisedAmount` causes every component consuming the context to re-render — including unrelated ones. This creates jank on complex pages.
- **Implementation Complexity:** Medium. But performance optimization (splitting contexts, memoization) adds significant complexity.

#### Option C: Zustand with Normalized Slices

A Zustand store with normalized entity slices (`users`, `fundraisers`, `communities`, `donations`). Components subscribe to specific slices — a fundraiser's progress bar subscribes only to `fundraisers[id].raisedAmount`, not the entire store. Mutations are atomic functions that update all related entities.

- **User Engagement:** Full cross-page reactivity with zero unnecessary re-renders. The progress bar updates, the donor wall updates, the profile updates — all from a single `addDonation()` call.
- **Performance:** Zustand uses external store subscriptions — components only re-render when their specific subscribed value changes. This is fundamentally more performant than React Context for complex state graphs.
- **Implementation Complexity:** Medium. Normalized store requires thinking about entity relationships upfront, but Zustand's API is minimal (~20 lines for the full store definition).

#### Winner: Option C — Zustand with Normalized Slices

**Why it matters for the fundraiser:** The donation is the most important moment in the product. When it happens, four things must update: the fundraiser's progress bar, the fundraiser's donor wall, the donor's profile history, and the community's aggregate stats. Zustand's atomic mutations ensure all four updates happen in a single synchronous operation. Zustand's selective subscriptions ensure only the affected components re-render. The result: instant visual feedback with zero jank.

**How it will be implemented:**

```typescript
// store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  users: Record<string, User>;
  fundraisers: Record<string, Fundraiser>;
  communities: Record<string, Community>;
  donations: Record<string, Donation>;
  addDonation: (fundraiserId: string, amount: number, donorId: string, message?: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: seedUsers,
      fundraisers: seedFundraisers,
      communities: seedCommunities,
      donations: seedDonations,
      addDonation: (fundraiserId, amount, donorId, message) => {
        const id = crypto.randomUUID();
        const donation: Donation = { id, amount, donorId, fundraiserId, message, createdDate: new Date().toISOString(), isAnonymous: false };
        const fundraiser = get().fundraisers[fundraiserId];
        const community = fundraiser.communityId ? get().communities[fundraiser.communityId] : null;

        set((state) => ({
          donations: { ...state.donations, [id]: donation },
          fundraisers: {
            ...state.fundraisers,
            [fundraiserId]: {
              ...fundraiser,
              raisedAmount: fundraiser.raisedAmount + amount,
              donationCount: fundraiser.donationCount + 1,
              donationIds: [...fundraiser.donationIds, id],
            }
          },
          users: {
            ...state.users,
            [donorId]: {
              ...state.users[donorId],
              totalDonated: state.users[donorId].totalDonated + amount,
              donationIds: [...state.users[donorId].donationIds, id],
            }
          },
          communities: community ? {
            ...state.communities,
            [community.id]: {
              ...community,
              totalRaised: community.totalRaised + amount,
              donationCount: community.donationCount + 1,
            }
          } : state.communities,
        }));
      },
    }),
    { name: 'fundright-store' }
  )
);
```

**Expected outcome:** A single `addDonation()` call atomically updates four entity types. Components subscribed to any of those entities re-render immediately. Data persists across page refreshes via localStorage. Total store code: ~80 lines.

---

### Question 16: How Are You Handling Routing and Page Transitions?

**The tension:** "Seamlessly integrated" implies smooth transitions. But Next.js App Router doesn't have built-in page transition animations. Overengineering transitions wastes time. Underengineering them feels jarring.

#### Option A: Default Next.js Navigation (No Transitions)

Standard `<Link>` navigation with Next.js default behavior. Instant page swap with no animation.

- **User Engagement:** Functional but abrupt. The page appears instantly (which is good), but there's no visual continuity between pages.
- **Performance:** Optimal. No transition overhead.
- **Implementation Complexity:** Zero. It's the default.

#### Option B: Full Page Transitions (Framer Motion + Layout Animations)

Animated page transitions using Framer Motion's `AnimatePresence`. Pages fade/slide in and out. Shared elements (like fundraiser cards) animate between positions.

- **User Engagement:** Beautiful. The platform feels like a native app. Shared element transitions (a fundraiser card expanding into a full page) create spatial continuity.
- **Performance:** Framer Motion adds ~25KB gzipped. Transition animations consume GPU cycles. On low-end devices, animations can feel sluggish.
- **Implementation Complexity:** High. Framer Motion + Next.js App Router integration requires careful layout management. Shared element transitions require element position tracking.

#### Option C: Skeleton Loaders + Prefetch + Subtle Fade

Next.js `<Link>` with `prefetch` (default). Skeleton loaders for progressive content. A subtle 150ms opacity fade on page mount. No heavy animation library.

- **User Engagement:** Pages transition with a barely-perceptible fade (feels smooth, not jarring). If data is still loading, skeleton loaders maintain layout stability. The experience feels fast and intentional without being theatrical.
- **Performance:** Negligible overhead. The fade is a CSS transition (3 lines of CSS). Skeleton loaders are lightweight div elements with a CSS shimmer animation. Prefetching means most navigations are effectively instant.
- **Implementation Complexity:** Low. CSS fade animation: 3 lines. Skeleton component: ~20 lines. Prefetch: already default in Next.js `<Link>`.

#### Winner: Option C — Skeleton Loaders + Prefetch + Subtle Fade

**Why it matters for the fundraiser:** "Seamless" doesn't mean "animated." It means "nothing breaks the user's flow." A 150ms fade eliminates the jarring instant-swap. Skeleton loaders eliminate content layout shift. Prefetching eliminates loading spinners. Together, they create a sense of effortless speed that heavy animations can actually undermine (because animations add perceived delay — the user waits for the animation to finish before they can interact).

**How it will be implemented:**

- **Page fade:** A wrapper component on each page:
  ```css
  .page-enter {
    opacity: 0;
    animation: fadeIn 150ms ease-out forwards;
  }
  @keyframes fadeIn {
    to { opacity: 1; }
  }
  ```
- **Skeleton loaders:** A `<Skeleton>` component that renders a pulsing gray rectangle at specified dimensions. Used for: fundraiser cards (while community page loads), donor wall entries, profile stats.
  ```tsx
  const Skeleton = ({ width, height }: { width: string; height: string }) => (
    <div className="animate-pulse bg-stone-200 rounded" style={{ width, height }} />
  );
  ```
- **Prefetching:** Default Next.js behavior. When a `<Link>` enters the viewport, the destination page's JavaScript and data start loading. By click time, the navigation is instant.
- **Scroll restoration:** Next.js App Router handles this automatically — navigating back restores scroll position.

**Expected outcome:** Navigating between pages feels instant and smooth. No loading spinners, no layout jumps, no jarring swaps. The evaluator experiences the platform as a single cohesive product, not three separate pages.

---

## Part 7: Instrumentation Specifics

---

### Question 17: What's the Funnel You're Measuring?

**The tension:** Instrumentation without a funnel is just logging. The funnel defines what success looks like, which determines which metrics matter.

#### Option A: Single Linear Funnel (Visit → View → Donate)

Track three steps: page load, content view, donation complete. Simple, clear, easy to visualize.

- **User Engagement:** Tells a basic story but misses the cross-page dynamics the assignment emphasizes.
- **Performance:** Minimal tracking overhead — three events per session.
- **Implementation Complexity:** Low. Three `track()` calls.

#### Option B: Multi-Entry Funnel (Community OR Fundraiser OR Profile → Donate)

Track the conversion funnel from each possible entry point. Three separate funnels merging at the donation event.

- **User Engagement:** Shows the evaluator that different entry points have different conversion characteristics — a real product insight.
- **Performance:** More events but still lightweight. 5-8 events per session.
- **Implementation Complexity:** Medium. Requires entry point detection and funnel branching logic.

#### Option C: Full Journey Funnel with Trust-Verification Branch

The primary funnel: `Entry → Community → Fundraiser → Donate_Intent → Donation_Complete`. Plus a trust-verification branch: `Fundraiser → Profile_View → Return_to_Fundraiser → Donate`. This branch captures the behavior the Semrush audit identified as GoFundMe's blind spot — donors who check the organizer's profile before giving.

- **User Engagement:** Tells the richest story. The trust-verification branch is a novel metric that most platforms don't track because their profiles are noindexed. Our indexed profiles create a measurable trust signal.
- **Performance:** 8-12 events per session. Still lightweight with Beacon API.
- **Implementation Complexity:** Medium. Requires tracking navigation sequences, not just individual events.

#### Winner: Option C — Full Journey Funnel with Trust-Verification Branch

**Why it matters for the fundraiser:** The trust-verification branch is our unique instrumentation insight. GoFundMe can't measure "did the donor check the organizer's profile before donating?" because their profiles are noindexed and nofollowed. We can. This metric directly proves the business value of indexed profiles — if 30% of donors view the organizer's profile before completing a donation, that's a measurable trust signal that justifies the SEO decision.

**How it will be implemented:**

- **Primary funnel events:**
  1. `session_start` — assigned on first page load with entry source (referrer/UTM/direct)
  2. `community_view` — community page loaded
  3. `fundraiser_view` — fundraiser page loaded
  4. `fundraiser_click_from_community` — fundraiser accessed via community page (vs. direct link)
  5. `donate_intent` — donate button clicked, modal opened
  6. `donation_complete` — donation confirmed with amount

- **Trust-verification branch events:**
  7. `profile_view_from_fundraiser` — organizer profile accessed from fundraiser page
  8. `return_to_fundraiser_from_profile` — user navigated back to fundraiser after viewing profile
  9. `donation_after_profile_view` — donation completed by a user who previously viewed the organizer's profile in this session

- **Dashboard visualization:** A Sankey diagram showing traffic flow:
  ```
  Community ──────→ Fundraiser ──→ Donate Intent ──→ Donation Complete
                        │                                    ▲
                        └──→ Profile View ──→ Return ────────┘
  ```

**Expected outcome:** The analytics dashboard tells a story no other fundraising platform can tell: "X% of donors verified the organizer's identity before giving." This is the single most compelling argument for indexed profiles — and it's backed by real data from the evaluator's own session.

---

### Question 18: How Will You Surface Instrumentation to the Reviewer?

**The tension:** A hidden analytics layer is invisible. The prompt says "explain what metrics you'll capture and why." The explanation needs to be visible and compelling.

#### Option A: Console Logging

`console.log()` every tracked event. The evaluator opens DevTools to see instrumentation.

- **User Engagement:** Minimal. Most evaluators won't open DevTools unless prompted.
- **Performance:** Negligible. Console.log is lightweight.
- **Implementation Complexity:** Lowest. `console.log(event)` after every `track()` call.

#### Option B: Dev Overlay / Debug Panel

A floating panel on every page showing real-time events, performance metrics, and schema validation. Toggle-able with a keyboard shortcut.

- **User Engagement:** Medium. Visible if the evaluator knows to look for it. But it clutters the UI and breaks the "real product" immersion.
- **Performance:** The overlay re-renders on every event. On event-heavy pages, this could cause jank.
- **Implementation Complexity:** Medium. Floating panel component, event subscription, real-time rendering.

#### Option C: Dedicated Analytics Dashboard Route (`/analytics`)

A full-page analytics dashboard at `/analytics` with four panels (one per instrumentation tier). Linked from the main navigation. Shows real session data with clear explanations of what each metric means and why it's tracked.

- **User Engagement:** Highest. It's a real page the evaluator navigates to intentionally. The dashboard itself is a demonstration of product thinking — "we built a tool to understand our users." Each metric includes a one-line explanation of why it matters.
- **Performance:** Zero impact on other pages (separate route, lazy-loaded). The dashboard itself renders charts from in-memory data — fast.
- **Implementation Complexity:** Medium-high. Requires chart components (Recharts), data aggregation from the event store, and explanatory copy for each metric.

#### Winner: Option C — Dedicated Analytics Dashboard

**Why it matters for the fundraiser:** The dashboard is the answer to the assignment's "explain what metrics you'll capture and why." It's not a paragraph in a README — it's a live, interactive page showing real data with annotations. The evaluator uses the product, then visits `/analytics` and sees their own session reflected back to them. Each metric has a label explaining its purpose: "Trust Verification Rate — % of donors who viewed the organizer's profile before donating. Why: Measures whether indexed profiles create trust that converts."

**How it will be implemented:**

- **Route:** `/analytics` — linked in the main navigation with a subtle icon.
- **Four panels:**
  1. **Performance Panel:** Gauge charts showing TTFB, LCP, CLS, INP for each page type. Color-coded: green (good), yellow (needs improvement), red (poor). Benchmarked against GoFundMe's measured values.
  2. **Conversion Funnel Panel:** Horizontal funnel chart showing drop-off at each stage. Numbers from the current session.
  3. **SEO Health Panel:** Checklist showing schema validation status per page type. Green checkmarks for valid JSON-LD. Links to Google's Rich Results Test for each schema type.
  4. **Attribution Panel:** Sankey diagram showing traffic flow from entry points through pages to donation events. The trust-verification branch is highlighted.
- **Annotations:** Every metric has a tooltip or subtitle explaining why it's tracked. Example: "LCP ≤ 1.8s — The donate CTA must render before the donor's attention fades. GoFundMe's LCP: ~3.2s. Ours: target 1.8s."
- **Library:** Recharts for charts (lightweight, React-native, already common in Next.js projects). Dynamic import so it doesn't affect other page bundles.

**Expected outcome:** The evaluator visits `/analytics` and immediately understands: what's being measured, why each metric matters, and how this platform performs. This is the deliverable that separates "I added tracking" from "I built an instrumentation strategy."

---

## Part 8: Delivery & Edge Cases

---

### Question 19: What Happens at the Boundaries?

**The tension:** Happy-path demos hide design weaknesses. Edge cases reveal whether the architecture is robust or brittle. The evaluator may test boundaries deliberately.

#### Option A: Ignore Edge Cases (Happy Path Only)

Build for the expected state: a fundraiser at 67% funded, a community with 15 members, a profile with 3 fundraisers. If the data is always "normal," edge cases never appear.

- **User Engagement:** Fine until the evaluator donates past the goal and sees a progress bar at 110% or beyond. Then trust in the product collapses.
- **Performance:** No impact.
- **Implementation Complexity:** Lowest. But the risk of visible failures is high.

#### Option B: Defensive Coding (Clamp Values, Show Empty States)

Clamp progress bars at 100%. Show "No fundraisers yet" for empty profiles. Handle null values gracefully. Never crash.

- **User Engagement:** Safe but uninspired. Empty states that say "Nothing here yet" feel like placeholders, not design.
- **Performance:** Negligible overhead.
- **Implementation Complexity:** Low-medium. Conditional rendering for each edge case.

#### Option C: Designed Edge Cases (Overfunding Celebrations, Empty State CTAs, Scale Adaptations)

Every edge case is a design opportunity. Overfunded fundraiser? Show a celebration state with confetti and "Goal exceeded!" messaging. Empty profile? Show an onboarding prompt: "Start your first fundraiser." Community with one member? Show "Be among the first" instead of "1 member." Large communities with thousands of members? Virtualized lists with "Show more."

- **User Engagement:** High. Edge cases become delightful moments instead of awkward gaps. The overfunding state makes donors feel like they contributed to something bigger than the goal. The empty profile invites action instead of displaying vacancy.
- **Performance:** Virtualized lists for large datasets prevent DOM bloat. Confetti animation is a lightweight CSS/canvas effect.
- **Implementation Complexity:** Medium. Each edge case needs its own designed state: overfunded (> 100%), completed (= 100%), early (< 10%), empty (0%), and scale (1000+ entries).

#### Winner: Option C — Designed Edge Cases

**Why it matters for the fundraiser:** Overfunding is the most common "edge case" in real fundraising — and it's the most emotionally positive moment. A fundraiser that exceeds its goal means the community rallied beyond expectations. Showing a flat "100%" progress bar for a $15K raise on a $10K goal is a missed opportunity. Showing "150% — Goal Exceeded!" with a visual celebration reinforces the community's impact and encourages further sharing.

**How it will be implemented:**

- **Fundraiser progress states:**
  - `0%`: "Just launched — be the first donor" + prominent CTA
  - `1-25%`: Standard progress bar + "Every dollar counts"
  - `26-75%`: Progress bar + momentum indicator ("$2,500 raised in the last 24 hours")
  - `76-99%`: Progress bar + urgency ("Almost there! $500 to go")
  - `100%`: "Goal reached!" + confetti animation + "Keep the momentum going" CTA (donations still accepted)
  - `> 100%`: Overfunded state — progress bar extends past 100% with a different color, "150% — Goal exceeded!" + stretch goal messaging

- **Empty states:**
  - Empty profile: "Your giving journey starts here. Find a cause you care about." + link to community directory
  - Empty community: "This community is just getting started. Be a founding member." + join CTA
  - No donors: "Be the first to support this cause" + prominent donate button

- **Scale handling:**
  - Donor wall: Show top 10, then "View all X donors" button leading to a virtualized list
  - Community members: Show 8 avatar thumbnails, then "+X more"
  - Fundraiser directory: Paginated or virtualized grid for communities with 50+ fundraisers

**Expected outcome:** The evaluator encounters zero "broken" states. Every boundary condition has been designed, not just handled. If they donate past the goal, they see a celebration. If they visit an empty state, they see an invitation. The platform feels complete because the edges are finished, not just the center.

---

### Question 20: What's Your Testing and QA Plan?

**The tension:** A take-home assignment rarely demands formal testing. But untested code has a way of breaking during demos. The question is: what's the minimum QA investment that prevents embarrassment?

#### Option A: No Formal Testing (Manual Verification Only)

Click through the app before submitting. Check for console errors. Verify links work. Ship.

- **User Engagement:** N/A (testing doesn't affect the user).
- **Performance:** No test overhead.
- **Implementation Complexity:** Lowest. But the risk of shipping broken features is real — especially cross-page state mutations that are easy to miss with manual testing.

#### Option B: Comprehensive Test Suite (Unit + Integration + E2E)

Jest unit tests for the store mutations. React Testing Library integration tests for each page. Playwright E2E tests for the donation flow.

- **User Engagement:** N/A.
- **Performance:** N/A.
- **Implementation Complexity:** Very high. A full test suite can take as long as the feature code itself. For a take-home, this time is better spent on features.

#### Option C: Targeted Tests + Pre-Submit Checklist

Three categories of quality assurance: (1) Unit tests for the Zustand store mutations (the most critical logic), (2) A manual QA checklist covering every page and interaction, (3) A Lighthouse performance audit to verify the performance budget is met.

- **User Engagement:** N/A.
- **Performance:** Lighthouse audit catches performance regressions before submission.
- **Implementation Complexity:** Low-medium. 5-8 unit tests for the store (~1 hour). Manual checklist (~30 minutes). Lighthouse run (~10 minutes).

#### Winner: Option C — Targeted Tests + Pre-Submit Checklist

**Why it matters for the fundraiser:** The store mutation — `addDonation()` — is the most complex piece of logic in the app. It updates four entities atomically. If it breaks, the entire cross-page integration story collapses. Unit testing this one function catches 80% of potential bugs in 20% of the time a full test suite would take.

**How it will be implemented:**

- **Unit tests (Vitest):**
  ```typescript
  describe('addDonation', () => {
    it('increments fundraiser raisedAmount by donation amount');
    it('increments fundraiser donationCount by 1');
    it('adds donation ID to fundraiser donationIds');
    it('adds donation ID to donor donationIds');
    it('increments donor totalDonated');
    it('increments community totalRaised when fundraiser has communityId');
    it('does not modify community when fundraiser has no communityId');
    it('handles donation to a 100%+ funded fundraiser correctly');
  });
  ```

- **Manual QA checklist:**
  ```
  □ All three pages load without console errors
  □ Community → Fundraiser navigation works (click fundraiser card)
  □ Fundraiser → Profile navigation works (click organizer name)
  □ Profile → Community navigation works (click community badge)
  □ Donation flow: click Donate → enter amount → confirm → progress bar updates
  □ After donation: profile page shows donation in giving history
  □ After donation: community page shows updated aggregate
  □ Analytics dashboard loads and shows current session data
  □ Schema JSON-LD validates (run through Google Rich Results Test)
  □ Lighthouse performance score ≥ 90 on all three page types
  □ Mobile responsive: fundraiser page renders correctly at 375px
  □ Edge case: donate past goal → overfunded state renders
  □ Edge case: empty profile displays onboarding prompt, not blank page
  □ All images load (no broken image icons)
  □ No horizontal scroll on any page at any viewport
  ```

- **Lighthouse audit:**
  - Run `lighthouse` CLI on all four routes
  - Performance target: ≥ 90
  - Accessibility target: ≥ 90
  - Best Practices target: ≥ 90
  - SEO target: ≥ 90

**Expected outcome:** 8 unit tests covering the critical state mutation logic. A 15-point manual checklist ensuring every user-facing flow works. A Lighthouse audit confirming performance. Total QA time: ~2 hours. Total bugs caught: every one that matters.

---

## Summary: The Decision Matrix

| # | Question | Winner | Time Estimate |
|---|---|---|---|
| 1 | SPA or Multi-Page? | Next.js Hybrid (SSR/SSG + Client Navigation) | Included in scaffold |
| 2 | Where Does AI Live? | Content Infrastructure (3 integrated features) | 8 hours |
| 3 | Real Backend or Mock? | In-Memory Reactive Data Layer (Zustand) | 4 hours |
| 4 | How Do Pages Connect? | Rich Graph with Prioritized Edges | 3 hours |
| 5 | Minimum Schema? | Demo-Complete (every visible field, nothing more) | 2 hours |
| 6 | What Is "Well Instrumented"? | Four-Tier (Performance + Product + SEO + Attribution) | 6 hours |
| 7 | What Tooling? | Custom Analytics Layer (zero dependencies) | 4 hours |
| 8 | MVP Cut? | Polished Wedge (3 pages + dashboard + 1 AI feature) | Defines scope |
| 9 | Outside the Box? | Impact Projections + Structural SEO Innovation | 4 hours |
| 10 | Demonstrate Integration? | Shared State with Visual Feedback | 3 hours |
| 11 | Visual Identity? | Warm Modern (elevated GoFundMe) | 3 hours |
| 12 | Mobile or Desktop First? | Responsive-Concurrent | Included in build |
| 13 | Emotional Arc? | Emotion-First with Progressive Data | Included in design |
| 14 | Image Handling? | Curated Static + next/image | 2 hours |
| 15 | State Management? | Zustand with Normalized Slices | 3 hours |
| 16 | Routing & Transitions? | Skeleton Loaders + Prefetch + Subtle Fade | 2 hours |
| 17 | Funnel Definition? | Full Journey + Trust-Verification Branch | 2 hours |
| 18 | Surface Instrumentation? | Dedicated Analytics Dashboard | 4 hours |
| 19 | Edge Cases? | Designed Edge Cases (celebrations, CTAs, scale) | 3 hours |
| 20 | Testing & QA? | Targeted Tests + Pre-Submit Checklist | 2 hours |

**Total estimated implementation time: ~55 hours**

This is achievable in a focused 2-week sprint with clear priorities: scaffold and store first (days 1-3), pages and integration second (days 4-7), analytics and AI third (days 8-10), polish and QA last (days 11-14).
