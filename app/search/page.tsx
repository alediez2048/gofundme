import type { Metadata } from "next";
import SearchPageContent from "@/components/SearchPageContent";

export const metadata: Metadata = {
  title: "Search | FundRight",
  description: "Search fundraisers, communities, and people on FundRight.",
};

export default function SearchPage() {
  return <SearchPageContent />;
}
