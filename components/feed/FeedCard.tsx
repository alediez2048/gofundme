"use client";

import Link from "next/link";
import type { FeedEvent } from "@/lib/data";
import { useFundRightStore } from "@/lib/store";
import UserAvatar from "@/components/UserAvatar";
import EngagementBar from "./EngagementBar";
import DonationCard from "./DonationCard";
import MilestoneCard from "./MilestoneCard";
import CommunityEventCard from "./CommunityEventCard";
import ProfileMilestoneCard from "./ProfileMilestoneCard";
import UserPostCard from "./UserPostCard";
import ShareCard from "./ShareCard";
import FundraiserMiniCard from "./FundraiserMiniCard";

interface FeedCardProps {
  event: FeedEvent;
  reason?: string;
  currentUserId: string;
}

const ACTION_TEXT: Record<FeedEvent["type"], string> = {
  donation: "donated to a fundraiser",
  fundraiser_launch: "launched a fundraiser",
  milestone_reached: "reached a milestone",
  community_milestone: "community milestone",
  community_join: "joined a community",
  profile_milestone: "reached a milestone",
  user_post: "shared a post",
  share: "shared",
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}

function CardBody({ event }: { event: FeedEvent }) {
  switch (event.type) {
    case "donation":
      return <DonationCard event={event} />;
    case "milestone_reached":
    case "fundraiser_launch":
      return <MilestoneCardOrLaunch event={event} />;
    case "community_milestone":
    case "community_join":
      return <CommunityEventCard event={event} />;
    case "profile_milestone":
      return <ProfileMilestoneCard event={event} />;
    case "user_post":
      return <UserPostCard event={event} />;
    case "share":
      return <ShareCard event={event} />;
    default:
      return null;
  }
}

function MilestoneCardOrLaunch({ event }: { event: FeedEvent }) {
  if (event.type === "fundraiser_launch") {
    return (
      <div className="space-y-2">
        {event.fundraiserId && <FundraiserMiniCard fundraiserId={event.fundraiserId} />}
      </div>
    );
  }
  return <MilestoneCard event={event} />;
}

export default function FeedCard({ event, reason, currentUserId }: FeedCardProps) {
  const actor = useFundRightStore((s) => s.users[event.actorId]);
  const reasonText = reason?.replace(/^Discover:\s*/i, "").replace(/^Trending\s+[—-]\s*/i, "");

  return (
    <article className="gfm-feed-card overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 pb-0">
        {actor ? (
          <Link href={`/u/${actor.username}`} className="flex-shrink-0">
            <UserAvatar src={actor.avatar} name={actor.name} size={44} />
          </Link>
        ) : (
          <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {actor ? (
              <Link href={`/u/${actor.username}`} className="truncate text-[16px] leading-6 text-[#232323]">
                {actor.name}
              </Link>
            ) : (
              <span className="text-[16px] leading-6 text-[#232323]">Someone</span>
            )}
            <span className="gfm-feed-meta shrink-0">{relativeTime(event.createdAt)}</span>
          </div>
          <p className="gfm-feed-meta">{ACTION_TEXT[event.type]}</p>
        </div>
      </div>

      {/* Reason badge */}
      {reasonText && (
        <div className="px-4 pt-2">
          <span className="gfm-feed-badge text-[14px] leading-5">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 10v5" />
              <path d="M12 7.5h.01" />
            </svg>
            Inspired by {reasonText}
          </span>
        </div>
      )}

      {/* Body */}
      <div className="px-4 py-3">
        <CardBody event={event} />
      </div>

      {/* Footer */}
      <div className="px-4 pb-3">
        <EngagementBar eventId={event.id} currentUserId={currentUserId} />
      </div>
    </article>
  );
}
