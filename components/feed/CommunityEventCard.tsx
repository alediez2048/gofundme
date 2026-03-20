"use client";

import { memo } from "react";
import Link from "next/link";
import type { FeedEvent } from "@/lib/data";
import { useFundRightStore } from "@/lib/store";

interface CommunityEventCardProps {
  event: FeedEvent;
}

export default memo(function CommunityEventCard({ event }: CommunityEventCardProps) {
  const community = useFundRightStore((s) =>
    event.communityId ? s.communities[event.communityId] : undefined
  );

  if (event.type === "community_milestone") {
    const threshold = event.metadata.threshold as string;
    const amount = event.metadata.amount as number;
    return (
      <div className="space-y-3">
        <div className="bg-gradient-to-br from-[#b2f5d8] via-[#6ee7a8] to-gfm-green rounded-card-sm p-4 text-center">
          <p className="text-3xl font-bold text-white">{threshold}</p>
          <p className="text-sm text-white/90 font-medium mt-1">
            {community?.name ?? "Community"} crossed {threshold} in total funds raised!
          </p>
        </div>
        <p className="text-sm text-feed-text-secondary">
          Total raised: <span className="font-semibold text-feed-text-heading">${amount?.toLocaleString()}</span>
        </p>
      </div>
    );
  }

  if (event.type === "community_join") {
    const communityName = (event.metadata.communityName as string) ?? community?.name ?? "a community";
    return (
      <div className="flex items-center gap-3 bg-feed-bg-hover rounded-card-sm p-3">
        <div className="w-10 h-10 rounded-full bg-gfm-green-light flex items-center justify-center text-gfm-green text-lg">
          +
        </div>
        <div>
          <p className="text-sm font-semibold text-feed-text-heading">Joined {communityName}</p>
          {community && (
            <Link href={`/communities/${community.slug}`} className="text-xs text-gfm-green hover:underline">
              View community
            </Link>
          )}
        </div>
      </div>
    );
  }

  return null;
});
