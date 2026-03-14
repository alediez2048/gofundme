import type { Metadata } from "next";
import BrowsePageContent from "@/components/BrowsePageContent";

export const metadata: Metadata = {
  title: "Browse Fundraisers | FundRight",
  description:
    "Explore fundraisers by cause category. Find campaigns aligned with your interests and give with confidence.",
};

export default function BrowsePage() {
  return <BrowsePageContent />;
}
