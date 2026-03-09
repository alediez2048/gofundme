import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { seed } from "@/lib/data";
import ProfilePageContent from "@/components/ProfilePageContent";

type Props = { params: { username: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = seed.users.find((u) => u.username === params.username);
  if (!user) return { title: "Profile | FundRight" };
  const title = `${user.name} | FundRight`;
  const description = `${user.bio} Joined ${new Date(user.joinDate).getFullYear()}. ${user.totalDonated > 0 ? `$${user.totalDonated.toLocaleString()} donated.` : ""}`;
  return { title, description };
}

export default async function ProfilePage({ params }: Props) {
  const user = seed.users.find((u) => u.username === params.username);
  if (!user) notFound();
  return <ProfilePageContent username={params.username} />;
}
