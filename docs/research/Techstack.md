# GoFundMe Technology Stack — BuiltWith Audit

**Source:** BuiltWith technology profile for gofundme.com
**Date:** March 8, 2026
**Technologies detected:** 285 live technologies

---

## Frameworks & Languages

| Technology | Role | Notes |
|---|---|---|
| **Next.js** | Frontend framework | React-based SSR/SSG framework, owned by Vercel |
| **React** | UI library | Core rendering layer |
| **Vue** | UI library | Likely used in isolated legacy or internal pages |
| **jQuery** | DOM manipulation | Legacy dependency, still loaded |
| **Foundation** | CSS framework | Responsive grid system — not Tailwind, not Bootstrap |
| **Java EE** | Backend platform | Server-side application layer |
| **Apollo GraphQL** | Data layer | Client-side GraphQL for API queries |
| **Webpack** | Bundler | Module bundling for frontend assets |

**Takeaway:** The frontend is Next.js/React with Apollo GraphQL, but the presence of jQuery, Vue, and Foundation alongside React signals a legacy codebase with incremental migration rather than a clean greenfield build. Our project can avoid this tech debt entirely.

---

## Analytics & Product Intelligence

### Product Analytics (User Behavior)

| Technology | Purpose |
|---|---|
| **Amplitude** | Mobile and product analytics — event tracking, user journeys, retention |
| **Heap** | Auto-capture analytics — records every user action without manual instrumentation |
| **FullStory** | Session replay — full recording of user interactions for debugging and UX research |
| **Hotjar** | Heatmaps, surveys, feedback forms, and funnel visualization |
| **CrazyEgg** | Click heatmaps and scroll maps — visual optimization |
| **Chartbeat** | Real-time traffic monitoring — live visitor counts and engagement |

### Web Analytics (Traffic & Attribution)

| Technology | Purpose |
|---|---|
| **Google Analytics (GA4)** | Core web analytics — sessions, pageviews, user demographics |
| **Google Universal Analytics** | Legacy analytics (predecessor to GA4, likely in sunset) |
| **Global Site Tag (gtag.js)** | Google's unified tag for GA, Ads, and Floodlight |
| **Google Tag Manager** | Tag management container — deploys all third-party scripts without code changes |
| **New Relic** | Application performance monitoring — server health, error rates, response times |
| **OpenTelemetry** | Vendor-neutral telemetry — traces, metrics, and logs |

### Customer Data & CRM

| Technology | Purpose |
|---|---|
| **mParticle** | Customer data platform — unifies user data across channels without code changes |
| **HubSpot** | CRM + marketing automation — lead management, email campaigns |
| **HubSpot Analytics** | Marketing performance measurement tied to HubSpot CRM |
| **Salesforce** | Enterprise CRM — sales pipeline, donor management |

**Takeaway:** GoFundMe runs 10+ analytics tools simultaneously. This creates significant page weight and explains their 5.2s full page load. The strategic insight: they prioritize data completeness over performance. Our approach uses a single lightweight analytics layer with four tiers of metrics, avoiding the multi-SDK performance tax.

---

## A/B Testing & Optimization

| Technology | Purpose |
|---|---|
| **Optimizely** | A/B testing and personalization — variant serving and conversion measurement |
| **CrazyEgg** | Site optimization via visual analytics |
| **Hotjar** | Conversion optimization via funnel analysis |

**Takeaway:** Optimizely presence confirms GoFundMe actively experiments on page layouts, CTAs, and donation flows. Our instrumentation should at minimum include feature flag readiness and variant-aware event tracking so A/B testing can be added without re-architecture.

---

## Advertising & Conversion Tracking

### Platform Pixels

| Technology | Platform | Purpose |
|---|---|---|
| **Facebook Pixel** | Meta | Conversion tracking for Facebook/Instagram ads |
| **Facebook Custom Audiences** | Meta | Retargeting visitors on Facebook |
| **Facebook Domain Insights** | Meta | Off-platform analytics for Facebook referral traffic |
| **Google AdWords Conversion** | Google | Ad conversion tracking |
| **Google Conversion Linker** | Google | Associates ad clicks with conversions via cookies |
| **Google Remarketing** | Google | Retargeting-based ad serving |
| **Google Floodlight Counter** | Google | Post-click visit counting for DoubleClick campaigns |
| **Google Floodlight Sales** | Google | Sales conversion tracking for Google Marketing Platform |
| **LinkedIn Insights** | LinkedIn | Campaign reporting and visitor insights for LinkedIn ads |
| **Bing Universal Event Tracking** | Microsoft | Conversion tracking for Bing Ads |
| **TikTok Conversion Tracking Pixel** | TikTok | Ad conversion tracking |
| **Twitter/X Conversion Tracking** | X | Ad conversion tracking |
| **Twitter Website Universal Tag** | X | Retargeting and conversion measurement |
| **Reddit Conversion Tracking** | Reddit | Ad conversion tracking |
| **Magellan AI** | Podcast | Podcast advertising campaign analytics |

### Ad Networks

| Technology | Purpose |
|---|---|
| **DoubleClick.Net** | Google's ad serving platform |
| **Google Adsense** | Contextual advertising |
| **Criteo** | Behavioral retargeting for e-commerce |
| **eBay Partner Network** | Affiliate links and images |
| **Reddit Ads** | Social advertising |

**Takeaway:** GoFundMe runs conversion pixels on every major ad platform — Meta, Google, LinkedIn, Bing, TikTok, X, and Reddit. This is a paid acquisition operation at scale. For our project, the relevant insight is that conversion tracking is a first-class concern; our instrumentation should model donation events as conversion endpoints that could feed any downstream ad platform.

---

## Payment & Financial Infrastructure

| Technology | Type | Notes |
|---|---|---|
| **Stripe** | Payment processor | Primary checkout and card processing |
| **PayPal** | Payment processor | Alternative payment method |
| **Venmo** | Digital wallet | Mobile-first payment option (owned by PayPal) |
| **Apple Pay** | Wallet | One-tap mobile payments |
| **Google Pay** | Wallet | One-tap payments |
| **Klarna** | Buy now, pay later | Installment-based giving |
| **Adyen** | Omni-channel payments | 250+ payment methods, 187 currencies |
| **Discover** | Card network | Accepted card type |
| **Visa** | Card network | Accepted card type |
| **Maestro** | Card network | Accepted card type (European debit) |
| **Plaid** | Bank connection | Direct bank account linking |
| **Feroot** | PCI compliance | Payment page security monitoring |
| **Classy (GoFundMe Pro)** | Donation platform | Nonprofit fundraising system, now GoFundMe's enterprise product |
| **Foundant Technologies** | Nonprofit software | Grant and scholarship management |

**Currency support:** USD ($), GBP (£), EUR (€)

**Takeaway:** GoFundMe supports 7+ payment methods across cards, wallets, bank transfers, and buy-now-pay-later. For our demo, we simulate payments with a Stripe test-mode checkout. The key design implication: the donation widget must accommodate multiple payment method logos and a multi-step flow without sacrificing above-the-fold rendering speed.

---

## Authentication & Identity

| Technology | Purpose |
|---|---|
| **Okta** | Enterprise identity management — SSO, MFA |
| **Google Identity Platform** | Google Sign-In |
| **Facebook Login** | Social authentication |
| **WebAuthn** | Passwordless authentication / Passkeys |
| **Gravatar Profiles** | Avatar service tied to email |
| **DocuSign** | Document signature (likely for nonprofit verification) |

**Takeaway:** GoFundMe supports four authentication methods including Passkeys (WebAuthn). For our demo, authentication is mocked — but the Profile page design should account for verification badges and social account linking as trust signals, since these exist in production.

---

## Content Delivery & Infrastructure

### CDN & Edge

| Technology | Purpose |
|---|---|
| **CloudFront (AWS)** | Primary CDN — 30+ edge locations globally |
| **Cloudflare** | Secondary CDN + DDoS protection + automatic optimization |
| **Fastly** | Real-time analytics CDN |
| **Varnish** | Reverse proxy cache (sits in front of origin servers) |
| **nginx** | HTTP server / reverse proxy |

**Edge locations detected:** Miami, Hong Kong, Seattle, Chicago, Milan, Paris, Stockholm, Los Angeles, Montreal, Sydney, Mumbai, Amsterdam, Singapore, Taipei, Helsinki, Ashburn, San Francisco, Denver, Frankfurt, Phoenix, Atlanta, London, Melbourne, Salt Lake City, Dallas, Hillsboro, Zurich, Toronto, Marseille, New York, Madrid, Tel Aviv, Dubai, Vancouver, Kansas City, Muscat, Boston, Chennai, Houston, Philadelphia, Budapest

### Cloud & Hosting

| Technology | Purpose |
|---|---|
| **AWS EC2** | Compute hosting |
| **Amazon S3** | Object storage (images, assets) |
| **Amazon Route 53** | DNS management |
| **Amazon WAF** | Web application firewall |
| **Amazon API Gateway** | API management |

### CMS

| Technology | Purpose |
|---|---|
| **WordPress VIP** | Enterprise WordPress — powers blog/marketing pages |
| **WordPress Multisite** | Multi-site WordPress network |
| **Yoast SEO Premium** | SEO plugin for WordPress content |

**Takeaway:** GoFundMe runs a four-layer caching stack (CloudFront → Cloudflare → Varnish → nginx) on AWS infrastructure, with WordPress VIP for marketing content. Their TTFB of 491ms despite this stack suggests the bottleneck is at the application layer (dynamic API calls for donation counts and social proof), not the CDN. Our static-first rendering approach bypasses this entirely.

---

## Search & Discovery

| Technology | Purpose |
|---|---|
| **Algolia** | Site search — instant search-as-you-type |
| **Sitelinks Search Box** | Google SERP search integration |
| **Google Maps** | Location-based mapping |

**Takeaway:** Algolia powers GoFundMe's search. For our three-page demo, a client-side filter with search input is sufficient, but the architecture should be Algolia-ready (structured data with searchable attributes) if scaling beyond a demo.

---

## Communication & Support

| Technology | Purpose |
|---|---|
| **Ada Support** | AI-powered live chat |
| **Twilio** | SMS/voice API — likely donor notifications |
| **Slack** | Internal team messaging (external integration detected) |
| **Zoom** | Video conferencing integration |
| **Zendesk** | Customer support ticketing |
| **Typeform** | Forms and surveys |

---

## Email Infrastructure

| Technology | Purpose |
|---|---|
| **SparkPost (Bird)** | Transactional email delivery |
| **SendGrid** | Email delivery + campaign management |
| **MailChimp** | Marketing email campaigns |
| **Google Apps for Business** | Corporate email hosting |
| **DMARC (Quarantine)** | Email authentication — quarantine policy for non-matching senders |
| **SPF** | Sender Policy Framework for email validation |
| **Valimail** | Email security / anti-phishing |
| **FreshService** | IT service desk |

---

## Privacy & Compliance

| Technology | Purpose |
|---|---|
| **US Privacy User Signal Mechanism** | CCPA compliance (USP API) |
| **OneTrust** | Privacy management platform |
| **EDAA** | EU online advertising preference management |
| **Do Not Sell** | CCPA opt-out mechanism |
| **Cookie Policy** | Cookie consent documentation |
| **Accessibility Statement** | ADA/WCAG compliance documentation |
| **AdChoices (Canada)** | Canadian digital advertising transparency |
| **reCAPTCHA** | Bot protection |

---

## Security

| Technology | Purpose |
|---|---|
| **Amazon SSL** | TLS certificates |
| **SSL by Default** | HTTPS redirect enforced |
| **HSTS** | HTTP Strict Transport Security |
| **HSTS IncludeSubdomains PreLoad** | Full subdomain HSTS with preload list eligibility |
| **DNSSEC** | DNS Security Extensions — prevents DNS spoofing |
| **Amazon WAF** | Web application firewall |
| **Feroot** | PCI DSS 4 compliance for payment pages |

---

## Social & Media Integrations

| Technology | Purpose |
|---|---|
| **YouTube IFrame API** | Embedded video player with JS control |
| **Vimeo** | Alternative video embedding |
| **YouTube (Privacy Enhanced)** | No-cookie YouTube embeds |
| **Zoom** | Live streaming / webcast |
| **Facebook SDK** | Social sharing, Graph API access |
| **Pinterest** | Social content sharing |
| **Getty Images** | Stock photography source |
| **Stocksy** | Stock photography source |
| **Canva** | Graphic design integration |

---

## Image & Asset Sources

| Technology | Purpose |
|---|---|
| **Getty Images** | Licensed stock photography |
| **Stocksy** | Curated stock photography |
| **Canva** | Graphic design tool |
| **GStatic** | Google static content CDN |
| **CDN JS (Cloudflare)** | JavaScript library CDN |
| **jsDelivr** | Open-source CDN |
| **jQuery CDN** | jQuery hosting |
| **Jetpack Site Accelerator** | WordPress image CDN |

---

## AI

| Technology | Purpose |
|---|---|
| **OpenAI** | Custom GPT and SSO integration |
| **Magellan AI** | Podcast advertising analytics with AI |
| **Ada Support** | AI-powered customer support chat |

**Takeaway:** GoFundMe already uses OpenAI (likely for content generation or support automation) and Ada for AI-powered chat. Our AI integration should go beyond what they've shipped — cause intelligence, story generation, and personalized recommendations target content gaps they haven't addressed.

---

## Key Architectural Patterns

### What GoFundMe Does Well

- **Multi-CDN caching** with CloudFront + Cloudflare + Varnish + nginx ensures global availability
- **Comprehensive payment coverage** across 7+ methods with PCI compliance monitoring
- **Enterprise auth stack** with Okta + social logins + Passkeys
- **Aggressive conversion tracking** across every major ad platform
- **WordPress VIP** for marketing content separate from the application

### What GoFundMe Gets Wrong

- **Analytics bloat**: 10+ tracking tools loading simultaneously, contributing to 5.2s page loads
- **Legacy tech debt**: jQuery, Vue, and Foundation coexist with React/Next.js, indicating incomplete migration
- **No structured data**: Zero JSON-LD on fundraiser and community pages despite 838K ranking keywords
- **Profile pages deindexed**: Deliberately removed from search, eliminating organizer credibility as a search surface
- **Incorrect Open Graph types**: Community pages use proprietary `gofundme:campaign` og:type

### Our Competitive Approach

| Their Pattern | Our Pattern |
|---|---|
| 10+ analytics SDKs | Single custom analytics layer with four tiers |
| Multi-framework frontend (React + Vue + jQuery) | Next.js/React only — zero legacy debt |
| Dynamic server rendering for all content | Static generation for above-the-fold, dynamic below |
| No JSON-LD schema | Full schema stack (DonateAction, FAQPage, Person, Organization) |
| Profile pages noindexed | Fully indexed with Person schema |
| Four-layer CDN (CloudFront + Cloudflare + Varnish + nginx) | Next.js built-in optimization + single CDN |
| WordPress VIP for marketing content | All content in the same Next.js application |
| OpenAI for support/internal use | AI embedded in user-facing features (story gen, cause intelligence, recommendations) |
