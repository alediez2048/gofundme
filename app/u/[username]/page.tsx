import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { seed } from "@/lib/data";
import ProfilePageContent from "@/components/ProfilePageContent";
import JsonLd from "@/components/JsonLd";
import { buildProfileSchema, buildProfileItemListSchema, buildBreadcrumbSchema } from "@/lib/schema";

type Props = { params: { username: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = seed.users.find((u) => u.username === params.username);
  if (!user) return { title: "Profile | FundRight" };
  const title = `${user.name} | FundRight`;
  const description = `${user.bio} Joined ${new Date(user.joinDate).getFullYear()}. ${user.totalDonated > 0 ? `$${user.totalDonated.toLocaleString()} donated.` : ""}`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fundright.vercel.app";
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: `${baseUrl}/u/${user.username}` },
    openGraph: {
      title,
      description,
      type: "profile",
      url: `${baseUrl}/u/${user.username}`,
      images: [{ url: user.avatar, width: 256, height: 256, alt: user.name }],
      siteName: "FundRight",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [user.avatar],
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const user = seed.users.find((u) => u.username === params.username);
  if (!user) notFound();

  // FR-053: use most recent donation timestamp for dateModified
  const userDonations = seed.donations
    .filter((d) => d.donorId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const lastModified = userDonations[0]?.createdAt ?? user.joinDate;

  const schemas: object[] = [
    buildProfileSchema(user, lastModified),
    buildBreadcrumbSchema([
      { label: "Home", href: "/" },
      { label: user.name },
    ]),
  ];

  // FR-052: ItemList of organized fundraisers
  const itemList = buildProfileItemListSchema(user, seed.fundraisers);
  if (itemList) schemas.push(itemList);

  return (
    <>
      <JsonLd data={schemas} />
      <ProfilePageContent username={params.username} />
    </>
  );
}
