"use client";

import { useFundRightStore } from "@/lib/store";
import FeedPage from "@/components/FeedPage";
import HomePageContent from "@/components/HomePageContent";
import JsonLd from "@/components/JsonLd";
import { buildHomepageSchema } from "@/lib/schema";

export default function HomePage() {
  const currentUser = useFundRightStore((s) => s.currentUser);

  if (currentUser) {
    return <FeedPage />;
  }

  return (
    <>
      <JsonLd data={buildHomepageSchema()} />
      <HomePageContent />
    </>
  );
}
