"use client";

import { useFundRightStore } from "@/lib/store";
import Header from "@/components/Header";
import FeedHeader from "@/components/feed/FeedHeader";
import Footer from "@/components/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const currentUser = useFundRightStore((s) => s.currentUser);
  const isAuthenticated = currentUser !== null;

  return (
    <>
      {isAuthenticated ? <FeedHeader /> : <Header />}
      <main
        id="main-content"
        className={isAuthenticated ? "" : "mx-auto max-w-content px-4 py-6 sm:py-8"}
        role="main"
      >
        {children}
      </main>
      {!isAuthenticated && <Footer />}
    </>
  );
}
