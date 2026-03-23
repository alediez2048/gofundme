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
        <p className="gfm-feed-heading-md text-brand">${amount.toLocaleString()} donated</p>
      )}
      {message && (
        <div className="rounded-xl bg-[#f5f5f5] p-4">
          <p className="gfm-feed-body italic">&ldquo;{message}&rdquo;</p>
        </div>
      )}
      {event.fundraiserId && <FundraiserMiniCard fundraiserId={event.fundraiserId} />}
    </div>
  );
});
