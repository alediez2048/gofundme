/**
 * FR-014: JSON-LD schema generators for structured data.
 * Each builder returns a plain object ready for JSON.stringify in <script type="application/ld+json">.
 */

import type { Community, FAQItem, Fundraiser, User } from "@/lib/data";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://fundright.vercel.app";

function absoluteUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

// ---------------------------------------------------------------------------
// Fundraiser: DonateAction + MonetaryAmount
// ---------------------------------------------------------------------------

export function buildFundraiserSchema(
  fundraiser: Fundraiser,
  organizer: User,
  community?: Community
) {
  return {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    name: fundraiser.title,
    description: fundraiser.story.slice(0, 200),
    url: absoluteUrl(`/f/${fundraiser.slug}`),
    agent: {
      "@type": "Person",
      name: organizer.name,
      url: absoluteUrl(`/u/${organizer.username}`),
    },
    ...(community
      ? {
          recipient: {
            "@type": "Organization",
            name: community.name,
            url: absoluteUrl(`/communities/${community.slug}`),
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
  faqItems?: FAQItem[]
) {
  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: community.name,
      description: community.description,
      url: absoluteUrl(`/communities/${community.slug}`),
    },
  ];

  if (faqItems && faqItems.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
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

export function buildProfileSchema(user: User) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl(`/u/${user.username}`),
    mainEntity: {
      "@type": "Person",
      name: user.name,
      description: user.bio,
      url: absoluteUrl(`/u/${user.username}`),
      ...(user.avatar
        ? { image: user.avatar }
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
