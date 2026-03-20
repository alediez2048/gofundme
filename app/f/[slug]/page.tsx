import type { Metadata } from "next";
import { seed } from "@/lib/data";
import FundraiserPageContent from "@/components/FundraiserPageContent";
import JsonLd from "@/components/JsonLd";
import {
  buildFundraiserSchema,
  buildBreadcrumbSchema,
} from "@/lib/schema";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fundraiser = seed.fundraisers.find((f) => f.slug === params.slug);
  if (!fundraiser) {
    return { title: "Fundraiser | FundRight" };
  }
  const organizer = seed.users.find((u) => u.id === fundraiser.organizerId);
  const title = `${fundraiser.title} | FundRight`;
  const description =
    organizer?.name && organizer.name.length > 0
      ? `Support ${fundraiser.title} by ${organizer.name}. ${fundraiser.raisedAmount.toLocaleString()} raised of ${fundraiser.goalAmount.toLocaleString()} goal.`
      : `Support ${fundraiser.title}. ${fundraiser.raisedAmount.toLocaleString()} raised of ${fundraiser.goalAmount.toLocaleString()} goal.`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fundright.vercel.app";
  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/f/${fundraiser.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${baseUrl}/f/${fundraiser.slug}`,
      images: [{ url: fundraiser.heroImageUrl, width: 1200, height: 630, alt: fundraiser.title }],
      siteName: "FundRight",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fundraiser.heroImageUrl],
    },
  };
}

export default async function FundraiserPage({ params }: Props) {
  const fundraiser = seed.fundraisers.find((f) => f.slug === params.slug);
  const organizer = fundraiser
    ? seed.users.find((u) => u.id === fundraiser.organizerId)
    : undefined;
  const community =
    fundraiser?.communityId
      ? seed.communities.find((c) => c.id === fundraiser.communityId)
      : undefined;

  const schemas: object[] = [];
  if (fundraiser && organizer) {
    // FR-053: use most recent donation timestamp for dateModified
    const fundDonations = seed.donations
      .filter((d) => d.fundraiserId === fundraiser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const lastModified = fundDonations[0]?.createdAt ?? new Date().toISOString();
    schemas.push(buildFundraiserSchema(fundraiser, organizer, community, lastModified));
  }
  schemas.push(
    buildBreadcrumbSchema([
      { label: "Home", href: "/" },
      ...(community
        ? [{ label: community.name, href: `/communities/${community.slug}` }]
        : []),
      { label: fundraiser?.title ?? "Fundraiser" },
    ])
  );

  return (
    <>
      <JsonLd data={schemas} />
      <FundraiserPageContent slug={params.slug} />
    </>
  );
}
