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
        <div className="rounded-xl bg-[#e9fcce] p-4 text-center">
          <p className="gfm-feed-heading-lg text-brand-strong">{threshold}</p>
          <p className="mt-1 text-[16px] leading-6 text-[#232323]">
            {community?.name ?? "Community"} crossed {threshold} in total funds raised!
          </p>
        </div>
        <p className="text-[14px] leading-5 text-[#b7b7b6]">
          Total raised: <span className="text-[#232323]">${amount?.toLocaleString()}</span>
        </p>
      </div>
    );
  }

  if (event.type === "community_join") {
    const communityName = (event.metadata.communityName as string) ?? community?.name ?? "a community";
    return (
      <div className="flex items-center gap-3 rounded-xl bg-[#f5f5f5] p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ccf88e] text-lg text-brand-strong">
          +
        </div>
        <div>
          <p className="text-[16px] leading-6 text-[#232323]">Joined {communityName}</p>
          {community && (
            <Link href={`/communities/${community.slug}`} className="text-[14px] leading-5 text-[#232323]">
              View community
            </Link>
          )}
        </div>
      </div>
    );
  }

  return null;
});
