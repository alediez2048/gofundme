# FundRight — AI-Powered Fundraising Platform

**Live:** [fundright.vercel.app](https://fundright.vercel.app)

A barebones end-to-end GoFundMe clone that demonstrates a reimagined donor journey — browse, discover, donate, create — with AI-powered cause intelligence and AEO/GEO-optimized structured data.

---

## Quick Start

```bash
git clone https://github.com/alediez2048/gofundme.git
cd gofundme
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

**Optional:** Add an OpenAI API key for AI-generated cause summaries:
```bash
echo 'OPENAI_API_KEY=sk-...' > .env.local
```
Without the key, all AI features fall back to static seed content.

---

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage — trending fundraisers, communities, platform stats |
| `/browse` | Browse all fundraisers with sort and category filters |
| `/browse/[category]` | Category-filtered browse |
| `/communities` | Community directory |
| `/communities/[slug]` | Community detail — AI cause summary, FAQ, fundraiser directory |
| `/f/[slug]` | Fundraiser detail — story, progress, donate, donor wall |
| `/u/[username]` | Profile — trust layer with giving history and impact stats |
| `/create` | Create a new fundraiser |
| `/search?q=` | Full-text search across fundraisers, communities, people |
| `/ai-traces` | AI observability — traces, metrics, fallback rate |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| State | Zustand (normalized slices, localStorage persist) |
| AI | OpenAI gpt-4o-mini via unified service with tracing + fallback |
| Schema | JSON-LD (DonateAction, Organization, FAQPage, Person, WebSite) |
| Testing | Vitest (24 tests) |
| Deploy | Vercel |

---

## Key Differentiators

- **AEO/GEO Citation Readiness** — `@id` cross-referencing between JSON-LD entities (only 4% of sites do this), `sameAs` entity linking, `dateModified` freshness signals, FAQ questions matching real AI query patterns
- **Indexed Profile Pages** — GoFundMe noindexes all `/u/` pages; ours are fully indexed with Person schema
- **Full Structured Data** — DonateAction, FAQPage, Organization with `nonprofitStatus`, BreadcrumbList on every page
- **AI Cause Intelligence** — RAG-powered community summaries with answer-first format, inline citations, and named organizer quotes
- **Edge Case Polish** — Progress-based states (0%, 76-99%, 100%, >100%), skeleton loaders, page transitions, accessibility (focus indicators, reduced motion, ARIA)

---

## Seed Data

2 communities (Watch Duty, Medical Relief Network), 5 fundraisers, 8 users, 30 donations. All data is derived — fundraiser stats and user totals are computed from donation records.

---

## Project Documentation

| Doc | Contents |
|-----|----------|
| [docs/product/FundRight-PRD.md](docs/product/FundRight-PRD.md) | PRD v3.0 — 25 tickets, acceptance criteria, AEO strategy |
| [docs/development/DEVLOG.md](docs/development/DEVLOG.md) | Development log and ticket status |
| [docs/research/](docs/research/) | UX audit, interview blueprint, tech stack audit |
| [docs/seo/SEO.md](docs/seo/SEO.md) | SEO deep scan of GoFundMe |

---

## License

MIT
