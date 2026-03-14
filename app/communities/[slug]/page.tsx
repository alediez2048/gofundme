import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { seed } from "@/lib/data";
import { getCauseSummary } from "@/lib/ai/cause-intelligence";
import CommunityPageContent from "@/components/CommunityPageContent";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const community = seed.communities.find((c) => c.slug === params.slug);
  if (!community) return { title: "Community | FundRight" };
  const title = `${community.name} | FundRight`;
  const description =
    `${community.description} $${community.totalRaised.toLocaleString()} raised · ${community.donationCount} donations · ${community.fundraiserCount} active campaigns.`;
  return { title, description };
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

  return (
    <CommunityPageContent
      slug={params.slug}
      causeSummary={causeSummary}
      fundraiserCount={communityFundraisers.length}
    />
  );
}
