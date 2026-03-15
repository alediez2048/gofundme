# FundRight — 7-Minute Demo Video Script

**Total runtime:** 7:00
**Format:** Screen recording with voiceover (Loom, OBS, or similar)
**Setup:** Browser at `localhost:3001` (or live Vercel URL), clean localStorage (fresh seed state)

> **Before recording:** Clear localStorage (`fundright-store` key) so stats show clean seed data. Make sure OPENAI_API_KEY is set in `.env.local` for AI features (or plan to show fallback mode). Two floating buttons are visible in bottom-right: "Schema" and "AI" — you'll use both during the demo.

---

## INTRO — The Problem [0:00–0:45]

**Screen:** Title slide or presentation slide

> **Script:**

"GoFundMe is the dominant fundraising platform — 838,000 ranking keywords, Authority Score 73, 3.1 million organic visits a month. But our research uncovered structural weaknesses beneath those numbers.

Their keyword portfolio is eroding — down 6.5% — and their traffic depends heavily on branded searches. When we ran a Semrush deep scan, a Lighthouse audit, and a full UX teardown, we found three critical gaps:

**First**, their Profile pages are deliberately noindexed — zero percent of organizer credibility queries are served by any fundraising platform.

**Second**, they have zero structured data where it matters — no DonateAction on fundraisers, no FAQPage on communities, nothing for AI Overviews or rich results to cite.

**Third**, their three page types don't form a coherent donor journey. Discovery ends at the fundraiser page. Profiles are dead ends. Communities are flat directories.

FundRight fixes all three. Let me show you."

---

## THE HOMEPAGE — Discovery Hub [0:45–1:15]

**Screen:** Navigate to `/` (Homepage)

> **Script:**

"This is the FundRight homepage — the discovery entry point.

*(scroll slowly)*

Live platform stats — total raised, donations, active fundraisers, communities — all computed in real time from the Zustand store. Trending Fundraisers shows top campaigns by donation activity. Active Communities surfaces our cause hubs.

Everything is reactive. If I donate somewhere and come back, these numbers update instantly — no refresh, no API call.

*(click the Schema button in bottom-right)*

And here's what search engines see. This page emits WebSite schema with a SearchAction — that's what triggers the Google sitelinks search box. GoFundMe has this. We do too. But watch what happens on the other pages."

*(close Schema panel)*

**Action:** Click "Watch Duty" community card.

---

## COMMUNITY PAGE — AEO Powerhouse [1:15–2:15]

**Screen:** `/communities/watch-duty`

> **Script:**

"The community page — this is where AEO starts to differentiate us.

*(point to breadcrumbs)* Breadcrumbs for navigation context — also BreadcrumbList schema.

*(point to stats bar)* Aggregate stats computed live from the store.

*(scroll to About This Cause)*

This 'About This Cause' section is AI-generated cause intelligence. A RAG pipeline pulls fundraiser stories and donor messages from this community, then synthesizes a summary in AEO-optimized format — answer-first block in the opening, inline source citations, and a named organizer quote. If no API key is set, it falls back gracefully to the static description.

*(scroll to Smart Search bar)*

New: the fundraiser directory has Smart Search. Watch — I'll type 'who needs help with evacuation.'

*(toggle Smart Search on, type query, press Search)*

The AI ranks fundraisers by relevance and adds a one-sentence explanation for each — answer-first format that AI engines can extract and cite. Without the API key, it falls back to keyword matching with sort options.

*(click Schema button)*

Now look at the structured data. **Two schemas**: Organization with `@id`, `sameAs` for entity linking, `nonprofitStatus`, and `dateModified` for freshness. Plus FAQPage — every FAQ question is mapped as a Question/Answer pair.

See these highlighted fields — `@id` cross-referencing between the Organization and FAQPage. Only 4% of websites do this. It tells search engines and AI systems these are the same entity described in different ways.

*(close Schema panel)*

*(scroll to FAQ)* These FAQ questions are written to match real AI query patterns — 'How do I donate to wildfire relief near me?' not 'How do I donate?' That's what triggers FAQ rich results and AI Overview citations."

**Action:** Click "Real-Time Alerts for Wildfire Safety" fundraiser card.

---

## FUNDRAISER PAGE — Trust & Conversion [2:15–3:15]

**Screen:** `/f/realtime-alerts-for-wildfire-safety`

> **Script:**

"The fundraiser page — the conversion surface.

*(point to above-fold)* Hero image with blur-up placeholder, title as H1, organizer linked to their profile.

*(point to trust cues near CTA)* Trust cues are near the Donate button, not buried at the bottom. Verified badge, community affiliation.

*(point to trust summary block)*

New: this trust summary is an AEO-optimized extractable block — 40 to 60 words that an AI engine can quote verbatim. 'Janahan has organized 3 fundraisers raising $12,400 total across 2 communities. Verified organizer since 2023.' Every claim is derived from real platform data.

*(click Schema button)*

DonateAction schema — the organizer as `agent` with their own `@id` and `sameAs` linking to their Twitter and LinkedIn. The community as `recipient` with `@id`, `sameAs`, and `nonprofitStatus`. `dateModified` for freshness. Goal as `priceSpecification`, raised amount as `result`.

This is the `@id` cross-referencing in action — the Person `@id` here matches the Person `@id` on the profile page. Search engines connect these as the same entity across pages.

*(close Schema panel)*

Let me make a donation."

**Action:** Click "Donate" button.

---

## DONATION FLOW — Impact Projections [3:15–4:00]

**Screen:** Donation modal opens

> **Script:**

"Preset amounts, custom input, optional message. Full accessibility — focus trap, Escape to close, aria-modal.

*(select $50)*

Watch the impact projection appear: 'Your $50 provides wildfire alerts to 200 families.' This updates dynamically as you change the amount — pure client-side math from a cause impact map, no LLM needed.

*(change to $100)*

'Your $100 provides wildfire alerts to 400 families.'

*(click Confirm)*

Progress bar animates. Toast notification links to the donor's profile. The donor wall updates instantly."

**Action:** Click the profile link in the toast.

---

## PROFILE PAGE — The Indexed Trust Layer [4:00–4:40]

**Screen:** `/u/janahan`

> **Script:**

"The profile page — the trust layer GoFundMe hides from search engines.

*(point to identity)* Avatar, name, verified badge, bio, join date.

*(point to trust summary)* Campaign history, total raised, total donated, causes supported.

*(scroll to giving history)* The $50 donation we just made — already here. Real-time cross-page state sync.

*(click Schema button)*

ProfilePage with a nested Person entity — both have `@id` URIs. `sameAs` links to external social profiles. `dateModified` for freshness.

The critical difference: this page has `robots: index, follow`. GoFundMe noindexes all their profile pages. We own the organizer credibility search space they've abandoned.

*(close Schema panel)*"

---

## AI CREATION ASSISTANT [4:40–5:40]

**Screen:** Navigate to `/create`

> **Script:**

"The creation flow — and this is where AI tool calling comes in.

*(toggle AI Assist on)*

When AI Assist is enabled, four tools become available alongside the manual form. Let me fill in a title.

*(type: 'Emergency Medical Relief for Rural Communities')*

*(click 'Suggest category')*

The AI analyzes the title and story, returns a category with a confidence score and reasoning. I can apply it with one click.

*(click 'Find similar campaigns')*

It searches existing fundraisers by keyword overlap and returns differentiation advice — 'Focus on what makes your campaign unique.'

*(fill in a goal amount area, click 'Suggest goal amount')*

Analyzes similar fundraisers in the same category, returns a suggested goal with reasoning: 'Similar fundraisers average $X.'

*(type a short story, click 'Get story suggestions')*

Clarity score, missing elements, specific suggestions, and AEO prompts: 'Add a specific number — how many families will be helped?' 'Include a direct quote from someone affected.'

Every tool result renders inline — not in a chat window. And every call is traced."

---

## AI TRACES — Observability [5:40–6:15]

**Screen:** Click the "AI" badge in bottom-right, or navigate to `/ai-traces`

> **Script:**

"Every AI interaction is traced. The AI badge shows the count. Let me open the traces panel.

*(click AI badge → navigates to /ai-traces)*

Summary stats at top: total traces, average latency, total tokens used, fallback rate.

*(expand a trace card)*

Each trace shows: the feature name, status — success, fallback, or error — the input prompt, the output, and full metrics: latency in milliseconds, input tokens, output tokens.

*(point to a fallback trace if visible)*

When there's no API key, traces still record with status 'fallback' and the reason. You can see exactly what the AI layer attempted and what the user actually got.

*(switch to Schema tab)*

And this Schema tab shows the JSON-LD on any page you've visited — with AEO-specific fields highlighted. `@id`, `sameAs`, `dateModified`, `nonprofitStatus` — all called out."

---

## CLOSE — What We Built [6:15–7:00]

**Screen:** Back to the homepage

> **Script:**

"To recap: FundRight turns three disconnected page types into one trust-driven conversion loop. Profile for trust, Community for discovery, Fundraiser for conversion.

The AEO/GEO strategy isn't cosmetic — it's structural:
- `@id` cross-referencing between entities so AI engines connect the dots across pages — only 4% of sites do this
- `sameAs` entity linking to external profiles for knowledge graph association
- `dateModified` freshness signals on every entity — Perplexity weighs this at ~40%
- FAQ questions matching real AI query patterns for AI Overview citations
- Answer-first content blocks that AI engines can extract and quote verbatim

On top of that: an AI intelligence layer with creation tools, RAG-powered discovery, trust summaries, impact projections, and full trace observability — all with graceful fallback.

25 tickets. Research-driven. PRD-first. Built with Next.js 14, Zustand, Tailwind, and OpenAI gpt-4o-mini.

Thanks for watching."

---

## RECORDING CHECKLIST

### Before Recording
- [ ] Clear localStorage: DevTools → Application → Storage → Clear `fundright-store`
- [ ] Verify OPENAI_API_KEY is set (or plan to demo fallback mode)
- [ ] Browser at 1280px+ width, no bookmarks bar
- [ ] Close unrelated tabs, silence notifications
- [ ] Confirm both floating buttons visible: "Schema" (top) and "AI" (bottom)

### Key Moments to Nail
- [ ] **1:15** — Schema button click on homepage shows WebSite + SearchAction
- [ ] **1:45** — "About This Cause" AI summary is visible, pause on it
- [ ] **2:00** — Smart Search demo with natural language query
- [ ] **2:15** — Schema button on community page shows @id cross-referencing
- [ ] **2:45** — Trust summary block near Donate CTA on fundraiser page
- [ ] **3:00** — Schema button on fundraiser shows DonateAction with nested @id/sameAs
- [ ] **3:30** — Impact projection updates dynamically in donation modal
- [ ] **4:15** — Profile schema shows Person with sameAs, page is indexed
- [ ] **5:00** — AI Assist toggle, all 4 tools demonstrated
- [ ] **5:50** — AI Traces panel with expandable cards and metrics

### Pacing Notes
- Scroll slowly — let the viewer read section headers
- When clicking Schema, pause 2-3 seconds so viewer can see the AEO features summary
- The Schema panel is the proof layer — use it on community, fundraiser, and profile pages
- Don't rush the AI Assist demo — show each tool result appearing inline
- Zoom to 125% when showing Schema/Traces detail

### If Something Goes Wrong
- **Store shows stale data:** Clear localStorage and refresh
- **AI features show fallback:** Mention "this is the graceful fallback — all AI features work without an API key"
- **Schema panel empty:** You're on a page without JSON-LD (search, browse). Navigate to a fundraiser/community/profile
- **Smart Search returns no AI results:** Falls back to keyword — mention "the keyword fallback with sort options is the default experience"

---

## OPTIONAL: Extended Sections

### Browse & Search (~30s)
- Navigate to `/browse` → category chips, sort options, fundraiser grid
- Search for "wildfire" → grouped results (Fundraisers, Communities, People)

### Mobile Responsive (~20s)
- Toggle DevTools device toolbar to 375px
- Show homepage, fundraiser page, hamburger menu

### Fallback Mode (~30s)
- Remove API key, restart
- Show: static tips on create page, keyword search on community, static cause description
- Open AI Traces → show fallback traces with "no-api-key" reason
