import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { seed } from "@/lib/data";
import ProfilePageContent from "@/components/ProfilePageContent";
import JsonLd from "@/components/JsonLd";
import { buildProfileSchema, buildBreadcrumbSchema } from "@/lib/schema";

type Props = { params: { username: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = seed.users.find((u) => u.username === params.username);
  if (!user) return { title: "Profile | FundRight" };
  const title = `${user.name} | FundRight`;
  const description = `${user.bio} Joined ${new Date(user.joinDate).getFullYear()}. ${user.totalDonated > 0 ? `$${user.totalDonated.toLocaleString()} donated.` : ""}`;
  return {
    title,
    description,
    robots: { index: true, follow: true },
  };
}

export default async function ProfilePage({ params }: Props) {
  const user = seed.users.find((u) => u.username === params.username);
  if (!user) notFound();

  const schemas = [
    buildProfileSchema(user),
    buildBreadcrumbSchema([
      { label: "Home", href: "/" },
      { label: user.name },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <ProfilePageContent username={params.username} />
    </>
  );
}
