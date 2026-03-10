import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Communities | FundRight",
  description:
    "Browse cause communities — explore fundraisers and join movements you care about.",
};

export default function CommunitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
