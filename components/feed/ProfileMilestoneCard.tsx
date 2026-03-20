"use client";

import { memo } from "react";
import type { FeedEvent } from "@/lib/data";

interface ProfileMilestoneCardProps {
  event: FeedEvent;
}

export default memo(function ProfileMilestoneCard({ event }: ProfileMilestoneCardProps) {
  const followerCount = event.metadata.followerCount as number | undefined;
  const threshold = event.metadata.threshold as number | undefined;

  return (
    <div className="bg-gradient-to-br from-[#b2f5d8] via-[#6ee7a8] to-gfm-green rounded-card-sm p-4 text-center">
      <p className="text-3xl font-bold text-white">{followerCount ?? threshold ?? 0}</p>
      <p className="text-sm text-white/90 font-medium mt-1">
        {followerCount
          ? `Reached ${followerCount} followers!`
          : "Reached a new milestone!"}
      </p>
      <p className="text-xs text-white/70 mt-2">Inspiring more people every day</p>
    </div>
  );
});
