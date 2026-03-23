"use client";

import { memo } from "react";
import type { FeedEvent } from "@/lib/data";

interface UserPostCardProps {
  event: FeedEvent;
}

export default memo(function UserPostCard({ event }: UserPostCardProps) {
  const text = event.metadata.text as string | undefined;
  const imageUrl = event.metadata.imageUrl as string | undefined;

  return (
    <div className="space-y-3">
      {text && (
        <p className="gfm-feed-body whitespace-pre-wrap">{text}</p>
      )}
      {imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-stone-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
});
