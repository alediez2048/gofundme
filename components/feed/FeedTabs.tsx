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
      className="flex border-b border-feed-border"
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
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              active
                ? "text-feed-text-heading"
                : "text-feed-text-tertiary hover:text-feed-text-secondary hover:bg-feed-bg-hover"
            }`}
          >
            {tab.label}
            {active && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gfm-green rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
