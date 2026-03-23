"use client";

import type { FeedTab } from "@/lib/feed/algorithm";

interface FeedTabsProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

const TABS: Array<{ id: FeedTab; label: string }> = [
  { id: "forYou", label: "For You" },
  { id: "following", label: "Following" },
  { id: "trending", label: "Trending" },
];

export default function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + TABS.length) % TABS.length;
    else return;
    e.preventDefault();
    onTabChange(TABS[next].id);
  };

  return (
    <div
      role="tablist"
      aria-label="Feed tabs"
      className="gfm-feed-card-muted flex gap-1 p-1"
    >
      {TABS.map((tab, idx) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`feed-tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`feed-tabpanel-${tab.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`relative flex-1 rounded-full px-4 py-2.5 text-center text-[16px] leading-6 transition-colors ${
              active
                ? "bg-brand-lime text-brand-strong"
                : "bg-white text-[#232323] hover:bg-[#fafafa]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
