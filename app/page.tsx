import HomePageContent from "@/components/HomePageContent";
import JsonLd from "@/components/JsonLd";
import { buildHomepageSchema } from "@/lib/schema";

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildHomepageSchema()} />
      <HomePageContent />
    </>
  );
}
