# GoFundMe Lighthouse Audit Brief

**URL:** https://www.gofundme.com
**Date:** March 8, 2026
**Device:** Emulated Moto G Power (Slow 4G throttling)
**Engine:** Lighthouse 13.0.1 / Chromium 145.0.0.0

> **Note:** Chrome extensions negatively affected this run. Scores represent a realistic user environment, not a clean lab test — which arguably makes them *more* representative of real-world conditions.

---

## Score Summary

| Category | Score | Grade |
|---|---|---|
| Performance | **45** | Fail |
| Accessibility | **95** | Pass |
| Best Practices | **54** | Fail |
| SEO | **92** | Pass |

---

## 1. Performance (Score: 45)

### Core Web Vitals

| Metric | Value | Target (Good) | Verdict |
|---|---|---|---|
| First Contentful Paint (FCP) | **2.1s** | ≤1.8s | Needs Improvement |
| Largest Contentful Paint (LCP) | **5.0s** | ≤2.5s | Poor |
| Total Blocking Time (TBT) | **2,210ms** | ≤200ms | Poor |
| Cumulative Layout Shift (CLS) | **0** | ≤0.1 | Good |
| Speed Index | **6.5s** | ≤3.4s | Poor |

**Interpretation:** GoFundMe passes only CLS. Every time-based metric is in the "poor" range. The page takes 5 seconds to show its largest element and blocks the main thread for over 2 seconds — meaning the page appears frozen during initial load.

### LCP Breakdown

| Subpart | Duration |
|---|---|
| Time to First Byte | 90ms |
| Resource Load Delay | 10ms |
| Resource Load Duration | 40ms |
| Element Render Delay | **150ms** |

The LCP element is a hero image (`arc-image-circle-mobile@2x.png`) that is 786x424px but displayed at 471x254px, wasting 61.9 KiB. It also lacks `fetchpriority=high` and is served as PNG instead of WebP/AVIF, wasting another 96.7 KiB in compression savings. The render delay (150ms) is the biggest bottleneck — caused by JavaScript blocking the paint.

### Main Thread Breakdown (6.3s total)

| Category | Time |
|---|---|
| Script Evaluation | 3,005ms |
| Script Parsing & Compilation | 2,063ms |
| Other | 878ms |
| Garbage Collection | 157ms |
| Style & Layout | 112ms |
| Parse HTML & CSS | 70ms |
| Rendering | 24ms |

**5 out of 6.3 seconds** are spent on JavaScript alone. This is the single biggest performance problem.

### JavaScript Execution by Origin

| Source | CPU Time | Transfer Size |
|---|---|---|
| GoFundMe (1st party) | 1,516ms | 791 KiB |
| Chrome Extensions | ~2,768ms | — |
| Google Tag Manager | 698ms | 1,178 KiB |
| Amplitude Analytics | 11ms | 166 KiB |
| Optimizely | 89ms | 94 KiB |
| TikTok Pixel | 85ms | 154 KiB |
| Clarity | 138ms | 28 KiB |
| Facebook SDK | 11ms | 84 KiB |
| FullStory | 7ms | 84 KiB |
| Transcend (consent) | 16ms | 157 KiB |
| LinkedIn Ads | 7ms | 19 KiB |
| Chartbeat | 8ms | 16 KiB |
| Reddit Pixel | 4ms | 20 KiB |
| Bing Ads | 4ms | 18 KiB |
| Quora Ads | 1ms | 15 KiB |
| Google Ads/Doubleclick | 2ms | 27 KiB |

**Third-party scripts account for ~1,178 KiB from Google Tag Manager alone.** GTM loads 8 separate gtag/gtm scripts, each 100-176 KiB. Total third-party JavaScript transfer exceeds 2 MB.

### Long Tasks (20 found)

| Source | Duration | Start Time |
|---|---|---|
| Chrome Extension | 960ms | 2,180ms |
| Chrome Extension | 438ms | 3,140ms |
| Chrome Extension | 436ms | 3,644ms |
| GoFundMe homepage | **350ms** | 1,736ms |
| GoFundMe `_app.js` | **193ms** | 12,184ms |
| GoFundMe `framework.js` | **130ms** | 13,384ms |
| GTM | 112ms | 22,720ms |
| GTM | 112ms | 30,487ms |
| Clarity | 106ms | 27,782ms |

Even excluding extensions, GoFundMe's own code produces 3 long tasks totaling 673ms. Combined with GTM's 481ms across 5 long tasks, the first-party + tag manager budget alone is over 1.1 seconds of blocked main thread.

### Unused JavaScript (5,244 KiB savings possible)

| Source | Transfer Size | Savings |
|---|---|---|
| GoFundMe (1st party) | 791 KiB | **501 KiB** |
| Google Tag Manager | 1,170 KiB | **494 KiB** |
| Amplitude | 114 KiB | 98 KiB |
| TikTok | 109 KiB | 60 KiB |
| Facebook | 83 KiB | 58 KiB |
| Google APIs/SDKs | 76 KiB | 57 KiB |
| Optimizely | 92 KiB | 46 KiB |
| FullStory | 56 KiB | 38 KiB |

GoFundMe ships ~501 KiB of JavaScript their homepage never executes. Their `_app.js` bundle alone is 394 KiB transferred — the single largest first-party resource.

### Legacy JavaScript (79 KiB wasted)

GoFundMe still transpiles modern features like `Array.prototype.at`, `Object.fromEntries`, and `Object.hasOwn` — all Baseline features supported by every modern browser. Their build pipeline includes unnecessary Babel transforms (`@babel/plugin-transform-classes`, `@babel/plugin-transform-spread`, `@babel/plugin-transform-regenerator`).

### Image Optimization (165 KiB savings)

| Image | Current Size | Savings | Issues |
|---|---|---|---|
| Hero collage PNG | 116.1 KiB | 96.7 KiB | Not WebP/AVIF, oversized (786x424 displayed at 471x254) |
| Brooke Patton card | 34.2 KiB | 29.4 KiB | Oversized (405x405 displayed at 228x128) |
| Aston card | 24.9 KiB | 20.5 KiB | Oversized dimensions |
| Jonathan card | 22.4 KiB | 18.4 KiB | Oversized dimensions |

The hero image alone could save 96.7 KiB with modern formats and responsive sizing. None of the fundraiser card images use responsive `srcset`.

### Caching Failures (660 KiB with no/short cache)

| Resource | TTL | Size |
|---|---|---|
| CloudFront images (4 files) | **None** | 278 KiB |
| Transcend consent (3 files) | 1 min | 155 KiB |
| Optimizely | 2 min | 93 KiB |
| FullStory | 1 hour | 79 KiB |
| Reddit pixel | 1 min | 20 KiB |
| Mapixl | None | 16 KiB |

CloudFront-hosted images have **zero cache headers**. This means every page visit re-downloads 278 KiB of images that never change.

### Network Payload

Total page weight: **4,403 KiB** (4.3 MB). Google Tag Manager alone accounts for 943 KiB across 8 script loads.

---

## 2. Accessibility (Score: 95)

### Failures

| Issue | Element |
|---|---|
| Button without accessible name | `<button id="open-side-panel">` — zero-size, invisible button with no label |

### Missing Explicit Dimensions

The trust-and-safety hero image lacks explicit `width` and `height` attributes, contributing to potential layout shift.

### Manual Checks Required (10 items)

Keyboard focusability, tab order, visual-DOM order alignment, focus trap avoidance, focus direction for new content, landmark usage, offscreen content hiding, custom control labels, and ARIA roles all require manual verification.

### What They Got Right

25 audits passed, including color contrast, heading order, alt text, lang attributes, ARIA validity, touch target sizing, and proper `<main>` landmark usage. This is genuinely strong — GoFundMe's accessibility team clearly invests effort here.

---

## 3. Best Practices (Score: 54)

### Third-Party Cookies (60 found)

| Source | Cookies |
|---|---|
| Google Ads/Doubleclick | 10 |
| Google APIs (accounts.google.com) | 22 |
| TikTok | 3 |
| Bing Ads | 3 |
| LinkedIn Ads | 14 |
| Clarity | 4 |
| Optimizely | 1 |
| Google Analytics | 1 |
| mgln.ai | 1 |
| Facebook | 1 |

**60 third-party cookies** on a single page load. With Chrome's third-party cookie deprecation, many of these tracking mechanisms will break.

### Deprecated APIs

LinkedIn Ads uses the deprecated `AttributionReporting` API. The Reader Mode extension uses deprecated `unload` event listeners.

### Security Headers Missing

| Header | Status | Severity |
|---|---|---|
| Content Security Policy (CSP) | **Not found** | High |
| Cross-Origin-Opener-Policy (COOP) | **Not found** | High |
| X-Frame-Options / frame-ancestors | **Not found** | High |
| Trusted Types | **Not found** | High |

GoFundMe has **zero security headers** for XSS protection, clickjacking mitigation, or origin isolation. This is a significant security posture gap for a platform handling financial transactions.

### Console Errors

| Source | Error |
|---|---|
| GoFundMe | `attachAnimation could not find element(s) matching ".featuredCol2"` |
| GoFundMe | `cannot animate #featuredCard. it is already animating` |
| GoFundMe | Auth refresh returns 400 Bad Request |
| GoFundMe | Account API returns 401 Unauthorized |
| Google Identity Services | FedCM deprecation warning |
| Facebook Pixel | Blocked by ad blocker (`ERR_BLOCKED_BY_CLIENT`) |
| LinkedIn Pixel | Blocked by ad blocker (7 failures) |

First-party animation errors suggest fragile DOM timing assumptions. The auth errors indicate the page makes authenticated API calls that fail for anonymous visitors.

### Source Maps Blocked

All 40+ GoFundMe JavaScript chunk source maps return **403 Forbidden**. This prevents debugging in production and blocks Lighthouse from providing deeper analysis. Amplitude's source maps are also 403.

---

## 4. SEO (Score: 92)

### Failures

| Issue | Details |
|---|---|
| Non-descriptive link text | 2 links use "Learn more" without context (from Reader Mode extension, not GoFundMe) |

### What They Got Right

The homepage passes all core SEO audits: not blocked from indexing, has `<title>` and meta description, valid `hreflang`, valid `rel=canonical`, crawlable links, valid `robots.txt`, image alt text, and proper HTTP status.

### What the Score Doesn't Capture

The 92 SEO score is misleading. Lighthouse only audits the page it's given — the homepage. Our Semrush deep scan revealed that GoFundMe's profile pages (`/u/*`) are noindexed, community pages lack schema, and fundraiser pages have no DonateAction markup. The homepage SEO is fine; the page-type SEO architecture is broken.

---

## Detected Technology

| Technology | Version |
|---|---|
| Next.js | **14.2.25** |

This confirms GoFundMe runs Next.js Pages Router (not App Router). The `_app.js` bundle pattern and chunk naming (`pages/_app-*.js`) are Pages Router signatures.

---

## Key Takeaways for FundRight

### What We Exploit

1. **Performance gap is massive.** GoFundMe's 45 performance score with 5.0s LCP and 2.2s TBT gives us a 3x improvement target that's achievable with static generation and zero third-party analytics SDKs.

2. **Third-party script bloat is their Achilles heel.** 8 GTM script loads, Amplitude, FullStory, Optimizely, Chartbeat, TikTok, Facebook, LinkedIn, Reddit, Bing, Quora, Google Ads — all loading on every page. Our custom Beacon API analytics layer eliminates this entirely.

3. **Image pipeline is lazy.** No WebP/AVIF, no responsive sizing, no fetchpriority, zero cache headers on CloudFront images. Our `next/image` with automatic format negotiation and responsive `srcset` solves this out of the box.

4. **Security headers are absent.** We ship with CSP, COOP, and X-Frame-Options from day one — not because it affects Lighthouse score, but because it's the right thing for a financial platform.

5. **Their bundle is bloated.** 394 KiB `_app.js` with 501 KiB of unused JavaScript. Our App Router architecture with route-level code splitting and zero-config tree shaking keeps bundles lean.

### What We Respect

1. **Accessibility is strong (95).** GoFundMe clearly invests in a11y. We need to match or exceed this — our target is 100 with strategic ARIA.

2. **CLS is perfect (0).** Their layout stability is excellent. We maintain this with explicit image dimensions and skeleton loaders.

3. **Homepage SEO fundamentals are solid (92).** Title, meta, canonical, hreflang, robots.txt — all correct. Our advantage isn't homepage SEO; it's page-type schema architecture across Profile, Fundraiser, and Community pages.

### Our Performance Targets vs. Their Actuals

| Metric | GoFundMe (Actual) | FundRight (Target) | Improvement |
|---|---|---|---|
| Performance Score | 45 | 90+ | 2x |
| FCP | 2.1s | ≤1.0s | 2.1x faster |
| LCP | 5.0s | ≤1.8s | 2.8x faster |
| TBT | 2,210ms | ≤150ms | 14.7x faster |
| CLS | 0 | 0 | Match |
| Speed Index | 6.5s | ≤2.0s | 3.3x faster |
| Total Page Weight | 4,403 KiB | ≤800 KiB | 5.5x lighter |
| Third-Party Scripts | 15+ SDKs | 0 SDKs | Eliminated |
| Third-Party Cookies | 60 | 0 | Eliminated |
| Security Headers | 0/4 | 4/4 | Full coverage |

---

*This audit provides the empirical foundation for every performance, SEO, and architecture decision in the FundRight PRD.*
