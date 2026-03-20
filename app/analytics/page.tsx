"use client";

import { useState } from "react";
import { getEvents, getEventSummary, clearEvents } from "@/lib/analytics/emitter";
import type { AnalyticsCategory } from "@/lib/analytics/events";

const CATEGORY_LABELS: Record<AnalyticsCategory, { label: string; color: string }> = {
  performance: { label: "Performance", color: "bg-blue-100 text-blue-800" },
  conversion: { label: "Conversion", color: "bg-green-100 text-green-800" },
  feed: { label: "Feed", color: "bg-amber-100 text-amber-800" },
  network: { label: "Network", color: "bg-purple-100 text-purple-800" },
};

export default function AnalyticsPage() {
  const [filter, setFilter] = useState<AnalyticsCategory | "all">("all");
  const [, setRefresh] = useState(0);

  const events = getEvents();
  const summary = getEventSummary();
  const filtered = filter === "all" ? events : events.filter((e) => e.category === filter);
  const total = events.length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-feed-text-heading">Analytics Dashboard</h1>
          <p className="text-sm text-feed-text-secondary mt-1">{total} events collected this session</p>
        </div>
        <button
          onClick={() => { clearEvents(); setRefresh((n) => n + 1); }}
          className="px-4 py-2 text-sm font-semibold text-feed-text-secondary border border-feed-border rounded-pill-gfm hover:bg-feed-bg-hover transition-colors"
        >
          Clear Events
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(Object.entries(CATEGORY_LABELS) as Array<[AnalyticsCategory, { label: string; color: string }]>).map(
          ([cat, { label, color }]) => (
            <button
              key={cat}
              onClick={() => setFilter(filter === cat ? "all" : cat)}
              className={`p-4 rounded-card border transition-colors ${
                filter === cat ? "border-gfm-green bg-gfm-green-light" : "border-black/[0.06] bg-feed-bg-card"
              }`}
            >
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>{label}</span>
              <p className="text-2xl font-bold text-feed-text-heading mt-2">{summary[cat]}</p>
            </button>
          )
        )}
      </div>

      {/* Event log */}
      <div className="bg-feed-bg-card border border-black/[0.06] rounded-card shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-feed-border">
          <h2 className="text-sm font-semibold text-feed-text-heading">
            Event Log {filter !== "all" && `(${CATEGORY_LABELS[filter].label})`}
          </h2>
        </div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-feed-text-secondary">
            No events yet. Navigate around the app to generate analytics events.
          </div>
        ) : (
          <div className="divide-y divide-feed-border max-h-[500px] overflow-y-auto">
            {filtered.slice().reverse().map((event, i) => {
              const catInfo = CATEGORY_LABELS[event.category];
              return (
                <div key={`${event.timestamp}-${i}`} className="px-4 py-3 flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${catInfo.color}`}>
                    {catInfo.label}
                  </span>
                  <span className="text-sm font-medium text-feed-text-heading">{event.action}</span>
                  {event.label && (
                    <span className="text-xs text-feed-text-secondary truncate">{event.label}</span>
                  )}
                  {event.value != null && (
                    <span className="text-xs font-mono text-feed-text-tertiary">{event.value}</span>
                  )}
                  <span className="ml-auto text-[11px] text-feed-text-tertiary flex-shrink-0">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
