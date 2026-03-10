import type { Metadata } from "next";
import { seed } from "@/lib/data";
import FundraiserPageContent from "@/components/FundraiserPageContent";

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
  return { title, description };
}

export default async function FundraiserPage({ params }: Props) {
  return <FundraiserPageContent slug={params.slug} />;
}
