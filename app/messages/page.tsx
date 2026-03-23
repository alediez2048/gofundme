import type { Metadata } from "next";
import MessagesPageContent from "@/components/MessagesPageContent";

export const metadata: Metadata = {
  title: "Messages | FundRight",
  description: "Stay in touch with organizers and communities on FundRight.",
};

export default function MessagesPage() {
  return <MessagesPageContent />;
}
