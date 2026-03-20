"use client";

import { memo } from "react";
import type { FeedEvent } from "@/lib/data";
import FundraiserMiniCard from "./FundraiserMiniCard";

interface DonationCardProps {
  event: FeedEvent;
}

export default memo(function DonationCard({ event }: DonationCardProps) {
  const { metadata } = event;
  const amount = metadata.amount as number | undefined;
  const message = metadata.message as string | null | undefined;

  return (
    <div className="space-y-3">
      {amount != null && (
        <p className="text-2xl font-bold text-gfm-green">${amount.toLocaleString()}</p>
      )}
      {message && (
        <div className="bg-gfm-green-light p-3 rounded-card-sm border-l-[3px] border-gfm-green">
          <p className="text-sm text-feed-text-body italic">&ldquo;{message}&rdquo;</p>
        </div>
      )}
      {event.fundraiserId && <FundraiserMiniCard fundraiserId={event.fundraiserId} />}
    </div>
  );
});
