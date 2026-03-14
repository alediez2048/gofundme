import type { Metadata } from "next";
import BrowsePageContent from "@/components/BrowsePageContent";

type Props = { params: { category: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  return {
    title: `${category} Fundraisers | FundRight`,
    description: `Browse fundraisers in ${category}. Find campaigns and give with confidence.`,
  };
}

export default function BrowseCategoryPage({ params }: Props) {
  return <BrowsePageContent activeCategory={params.category} />;
}
