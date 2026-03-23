import type { Metadata } from "next";
import BrowsePageContent from "@/components/BrowsePageContent";

export const metadata: Metadata = {
  title: "All Fundraisers | FundRight",
  description:
    "Explore all fundraisers by cause category. Find campaigns aligned with your interests and give with confidence.",
};

export default function BrowsePage() {
  return <BrowsePageContent />;
}
