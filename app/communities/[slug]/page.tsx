import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { seed } from "@/lib/data";
import { getCauseSummary } from "@/lib/ai/cause-intelligence";
import CommunityPageContent from "@/components/CommunityPageContent";
import JsonLd from "@/components/JsonLd";
import { buildCommunitySchema, buildBreadcrumbSchema } from "@/lib/schema";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const community = seed.communities.find((c) => c.slug === params.slug);
  if (!community) return { title: "Community | FundRight" };
  const title = `${community.name} | FundRight`;
  const description = `${community.description} $${community.totalRaised.toLocaleString()} raised · ${community.donationCount} donations · ${community.fundraiserCount} active campaigns.`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fundright.vercel.app";
  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/communities/${community.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/communities/${community.slug}`,
      images: [{ url: community.bannerImageUrl, width: 1200, height: 630, alt: community.name }],
      siteName: "FundRight",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [community.bannerImageUrl],
    },
  };
}

export default async function CommunityPage({ params }: Props) {
  const community = seed.communities.find((c) => c.slug === params.slug);
  if (!community) notFound();

  const fundraiserIds = new Set(community.fundraiserIds ?? []);
  const communityFundraisers = seed.fundraisers.filter((f) =>
    fundraiserIds.has(f.id)
  );
  const causeSummary = await getCauseSummary(
    community,
    communityFundraisers,
    seed.donations
  );

  // FR-053: use most recent community donation timestamp for dateModified
  const communityDonations = seed.donations
    .filter((d) => communityFundraisers.some((f) => f.id === d.fundraiserId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const lastModified = communityDonations[0]?.createdAt ?? new Date().toISOString();

  const schemas = [
    ...buildCommunitySchema(community, community.faq, lastModified),
    buildBreadcrumbSchema([
      { label: "Home", href: "/" },
      { label: "Communities", href: "/communities" },
      { label: community.name },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <CommunityPageContent
        slug={params.slug}
        causeSummary={causeSummary}
        fundraiserCount={communityFundraisers.length}
      />
    </>
  );
}
