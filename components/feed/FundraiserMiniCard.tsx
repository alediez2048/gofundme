"use client";

import Link from "next/link";
import { useFundRightStore } from "@/lib/store";
import ProgressBar from "@/components/ProgressBar";

const CAUSE_BADGE: Record<string, { label: string; className: string }> = {
  "Disaster Relief & Wildfire Safety": { label: "Wildfire Relief", className: "bg-emerald-100 text-emerald-800" },
  "Medical & Healthcare": { label: "Medical", className: "bg-violet-100 text-violet-800" },
  Education: { label: "Education", className: "bg-blue-100 text-blue-800" },
  "Environment & Climate": { label: "Environment", className: "bg-green-100 text-green-800" },
  "Animals & Wildlife": { label: "Animals", className: "bg-amber-100 text-amber-800" },
  "Community & Neighbors": { label: "Community", className: "bg-orange-100 text-orange-800" },
};

function formatCurrency(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  return `$${amount.toLocaleString()}`;
}

interface FundraiserMiniCardProps {
  fundraiserId: string;
}

export default function FundraiserMiniCard({ fundraiserId }: FundraiserMiniCardProps) {
  const fundraiser = useFundRightStore((s) => s.fundraisers[fundraiserId]);

  if (!fundraiser) return null;

  const badge = CAUSE_BADGE[fundraiser.causeCategory] ?? { label: fundraiser.causeCategory, className: "bg-gray-100 text-gray-800" };

  return (
    <Link
      href={`/f/${fundraiser.slug}`}
      aria-label={`${fundraiser.title} — ${formatCurrency(fundraiser.raisedAmount)} raised of ${formatCurrency(fundraiser.goalAmount)} goal`}
      className="block bg-feed-bg-hover border border-feed-border rounded-card-sm p-3 hover:shadow-card transition-shadow"
    >
      <p className="text-sm font-semibold text-feed-text-heading line-clamp-2 mb-2">
        {fundraiser.title}
      </p>
      <ProgressBar raised={fundraiser.raisedAmount} goal={fundraiser.goalAmount} height="h-1.5" />
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-feed-text-secondary">
          <span className="font-semibold text-feed-text-heading">{formatCurrency(fundraiser.raisedAmount)}</span>
          {" "}raised of {formatCurrency(fundraiser.goalAmount)}
        </span>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.className}`}>
          {badge.label}
        </span>
      </div>
    </Link>
  );
}
