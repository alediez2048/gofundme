"use client";

import { usePathname } from "next/navigation";
import { useFundRightStore } from "@/lib/store";
import Header from "@/components/Header";
import FeedHeader from "@/components/feed/FeedHeader";
import BottomTabBar from "@/components/feed/BottomTabBar";
import Footer from "@/components/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const currentUser = useFundRightStore((s) => s.currentUser);
  const pathname = usePathname();
  const isAuthenticated = currentUser !== null;

  // Only the homepage feed gets the full-bleed layout; all other pages keep the content wrapper
  const isFeedPage = isAuthenticated && pathname === "/";

  return (
    <>
      {isAuthenticated ? <FeedHeader /> : <Header />}
      <main
        id="main-content"
        className={`${isFeedPage ? "" : "mx-auto max-w-content px-4 py-6 sm:py-8"} ${isAuthenticated ? "pb-20 md:pb-0" : ""}`}
        role="main"
      >
        {children}
      </main>
      <Footer />
      {isAuthenticated && <BottomTabBar />}
    </>
  );
}
