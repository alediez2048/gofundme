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
    <div className="rounded-xl bg-[#e9fcce] p-4 text-center">
      <p className="gfm-feed-heading-lg text-brand-strong">{followerCount ?? threshold ?? 0}</p>
      <p className="mt-1 text-[16px] leading-6 text-[#232323]">
        {followerCount
          ? `Reached ${followerCount} followers!`
          : "Reached a new milestone!"}
      </p>
      <p className="mt-2 text-[14px] leading-5 text-[#232323]">Inspiring more people every day</p>
    </div>
  );
});
