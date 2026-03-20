"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFundRightStore } from "@/lib/store";
import { getFeedForUser, type FeedTab, type ScoredFeedEvent } from "@/lib/feed/algorithm";
import { emit } from "@/lib/analytics/emitter";
import PostComposer from "./PostComposer";
import FeedTabs from "./FeedTabs";
import FeedCard from "./FeedCard";

const BATCH_SIZE = 10;

// FR-058: Module-level cache preserves state across navigations
const feedCache = { tab: "forYou" as FeedTab, count: BATCH_SIZE, scrollY: 0 };

export default function FeedColumn() {
  const currentUserId = useFundRightStore((s) => s.currentUser);
  const state = useFundRightStore((s) => s);

  const [activeTab, setActiveTab] = useState<FeedTab>(feedCache.tab);
  const [visibleCount, setVisibleCount] = useState(Math.max(feedCache.count, BATCH_SIZE));
  const [showBackToTop, setShowBackToTop] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);

  // Get feed items
  const allItems: ScoredFeedEvent[] = currentUserId
    ? getFeedForUser(currentUserId, activeTab, state)
    : [];

  const visibleItems = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  // FR-058: Restore scroll position on mount
  useEffect(() => {
    if (feedCache.scrollY > 0) {
      window.scrollTo(0, feedCache.scrollY);
    }
    emit("feed", "feed_view", { label: activeTab });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // FR-058: Persist state on changes
  useEffect(() => { feedCache.tab = activeTab; }, [activeTab]);
  useEffect(() => { feedCache.count = visibleCount; }, [visibleCount]);

  // Reset on tab switch
  const handleTabChange = useCallback((tab: FeedTab) => {
    setActiveTab(tab);
    setVisibleCount(BATCH_SIZE);
    feedCache.scrollY = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
    emit("feed", "tab_switch", { label: tab });
  }, []);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => c + BATCH_SIZE);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore]);

  // Show "back to top" after scrolling past 10 cards + persist scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 1200);
      feedCache.scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div ref={columnRef} className="space-y-4">
      <PostComposer />

      <div className="bg-feed-bg-card border border-black/[0.06] rounded-card shadow-card overflow-hidden">
        <FeedTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      <div
        role="tabpanel"
        id={`feed-tabpanel-${activeTab}`}
        aria-labelledby={`feed-tab-${activeTab}`}
        className="space-y-4"
      >
        {visibleItems.length === 0 && (
          <div className="bg-feed-bg-card border border-black/[0.06] rounded-card shadow-card p-8 text-center">
            <p className="text-feed-text-secondary text-sm">
              {activeTab === "following"
                ? "Follow people to see their activity here."
                : "No events yet. Check back soon!"}
            </p>
          </div>
        )}

        {visibleItems.map((item) => (
          <FeedCard
            key={item.event.id}
            event={item.event}
            reason={item.reason}
            currentUserId={currentUserId ?? ""}
          />
        ))}

        {hasMore && (
          <div ref={sentinelRef} className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-gfm-green border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-gfm-green text-white w-10 h-10 rounded-full shadow-medium flex items-center justify-center hover:bg-gfm-green-hover transition-colors"
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </div>
  );
}
