/**
 * FR-014: JSON-LD schema generators for structured data.
 * Each builder returns a plain object ready for JSON.stringify in <script type="application/ld+json">.
 *
 * AEO enhancements:
 * - `@id` URIs on all entities for cross-referencing (only 4% of sites do this)
 * - `sameAs` for entity linking to external profiles/orgs
 * - `dateModified` for freshness signals (Perplexity weighs ~40%)
 * - `nonprofitStatus` on Organization schemas
 */

import type { Community, FAQItem, Fundraiser, User } from "@/lib/data";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://fundright.vercel.app";

function absoluteUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

/** Build a stable @id URI for cross-referencing between JSON-LD entities. */
function entityId(path: string, fragment: string): string {
  return `${absoluteUrl(path)}#${fragment}`;
}

// ---------------------------------------------------------------------------
// Fundraiser: DonateAction + MonetaryAmount
// ---------------------------------------------------------------------------

export function buildFundraiserSchema(
  fundraiser: Fundraiser,
  organizer: User,
  community?: Community,
  lastModified?: string
) {
  const personId = entityId(`/u/${organizer.username}`, "person");

  return {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    "@id": entityId(`/f/${fundraiser.slug}`, "donate"),
    name: fundraiser.title,
    description: fundraiser.story.slice(0, 200),
    url: absoluteUrl(`/f/${fundraiser.slug}`),
    ...(lastModified ? { dateModified: lastModified } : {}),
    agent: {
      "@type": "Person",
      "@id": personId,
      name: organizer.name,
      url: absoluteUrl(`/u/${organizer.username}`),
      ...(organizer.sameAs && organizer.sameAs.length > 0
        ? { sameAs: organizer.sameAs }
        : {}),
    },
    ...(community
      ? {
          recipient: {
            "@type": "Organization",
            "@id": entityId(`/communities/${community.slug}`, "org"),
            name: community.name,
            url: absoluteUrl(`/communities/${community.slug}`),
            ...(community.sameAs && community.sameAs.length > 0
              ? { sameAs: community.sameAs }
              : {}),
            ...(community.nonprofitStatus
              ? { nonprofitStatus: community.nonprofitStatus }
              : {}),
          },
        }
      : {}),
    priceSpecification: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: fundraiser.goalAmount,
    },
    result: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: fundraiser.raisedAmount,
    },
  };
}

// ---------------------------------------------------------------------------
// Community: Organization + FAQPage
// ---------------------------------------------------------------------------

export function buildCommunitySchema(
  community: Community,
  faqItems?: FAQItem[],
  lastModified?: string
) {
  const orgId = entityId(`/communities/${community.slug}`, "org");

  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": orgId,
      name: community.name,
      description: community.description,
      url: absoluteUrl(`/communities/${community.slug}`),
      ...(lastModified ? { dateModified: lastModified } : {}),
      ...(community.sameAs && community.sameAs.length > 0
        ? { sameAs: community.sameAs }
        : {}),
      ...(community.nonprofitStatus
        ? { nonprofitStatus: community.nonprofitStatus }
        : {}),
    },
  ];

  if (faqItems && faqItems.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": entityId(`/communities/${community.slug}`, "faq"),
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return schemas;
}

// ---------------------------------------------------------------------------
// Profile: Person + ProfilePage
// ---------------------------------------------------------------------------

export function buildProfileSchema(user: User, lastModified?: string) {
  const personId = entityId(`/u/${user.username}`, "person");

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": entityId(`/u/${user.username}`, "profile"),
    url: absoluteUrl(`/u/${user.username}`),
    ...(lastModified ? { dateModified: lastModified } : {}),
    mainEntity: {
      "@type": "Person",
      "@id": personId,
      name: user.name,
      description: user.bio,
      url: absoluteUrl(`/u/${user.username}`),
      ...(user.avatar ? { image: user.avatar } : {}),
      ...(user.sameAs && user.sameAs.length > 0
        ? { sameAs: user.sameAs }
        : {}),
    },
  };
}

// ---------------------------------------------------------------------------
// Homepage: WebSite + SearchAction
// ---------------------------------------------------------------------------

export function buildHomepageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}#website`,
    name: "FundRight",
    url: BASE_URL,
    description:
      "Discover fundraisers, join communities, and support organizers you can trust.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}
