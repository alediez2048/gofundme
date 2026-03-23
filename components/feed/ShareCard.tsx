"use client";

import { memo } from "react";
import type { FeedEvent } from "@/lib/data";
import { useFundRightStore } from "@/lib/store";
import FundraiserMiniCard from "./FundraiserMiniCard";
import UserPostCard from "./UserPostCard";

interface ShareCardProps {
  event: FeedEvent;
}

export default memo(function ShareCard({ event }: ShareCardProps) {
  const commentary = event.metadata.commentary as string | undefined;
  const sharedEventId = event.metadata.sharedEventId as string | undefined;

  const sharedEvent = useFundRightStore((s) =>
    sharedEventId ? s.feedEvents[sharedEventId] : undefined
  );

  if (!sharedEvent) return null;

  return (
    <div className="space-y-3">
      {commentary && (
        <div className="rounded-xl bg-[#f5f5f5] p-4">
          <p className="gfm-feed-body italic">&ldquo;{commentary}&rdquo;</p>
        </div>
      )}
      {sharedEvent.type === "user_post" && (
        <div className="rounded-xl border border-black/5 bg-white p-4">
          <UserPostCard event={sharedEvent} />
        </div>
      )}
      {sharedEvent.fundraiserId && (
        <FundraiserMiniCard fundraiserId={sharedEvent.fundraiserId} />
      )}
    </div>
  );
});
