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
    default:
      return null;
  }
}

function MilestoneCardOrLaunch({ event }: { event: FeedEvent }) {
  if (event.type === "fundraiser_launch") {
    const title = event.metadata.title as string | undefined;
    const goalAmount = event.metadata.goalAmount as number | undefined;
    return (
      <div className="space-y-2">
        <div className="bg-gfm-green-light rounded-card-sm p-4">
          <p className="text-lg font-bold text-feed-text-heading">{title ?? "New Fundraiser"}</p>
          {goalAmount != null && (
            <p className="text-sm text-feed-text-secondary mt-1">
              Goal: <span className="font-semibold">${goalAmount.toLocaleString()}</span>
            </p>
          )}
        </div>
        {event.fundraiserId && (
          <Link href={`/f/${event.fundraiserId}`} className="text-sm text-gfm-green font-semibold hover:underline">
            View fundraiser
          </Link>
        )}
      </div>
    );
  }
  return <MilestoneCard event={event} />;
}

export default function FeedCard({ event, reason, currentUserId }: FeedCardProps) {
  const actor = useFundRightStore((s) => s.users[event.actorId]);
  const fundraiser = useFundRightStore((s) =>
    event.fundraiserId ? s.fundraisers[event.fundraiserId] : undefined
  );

  // For fundraiser_launch, link to the fundraiser slug
  const launchSlug = event.type === "fundraiser_launch" && fundraiser ? fundraiser.slug : null;

  return (
    <article className="bg-feed-bg-card border border-black/[0.06] rounded-card shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 pb-0">
        {actor ? (
          <Link href={`/u/${actor.username}`} className="flex-shrink-0">
            <UserAvatar src={actor.avatar} size={44} />
          </Link>
        ) : (
          <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {actor ? (
              <Link href={`/u/${actor.username}`} className="text-sm font-semibold text-feed-text-heading hover:underline truncate">
                {actor.name}
              </Link>
            ) : (
              <span className="text-sm font-semibold text-feed-text-heading">Someone</span>
            )}
            <span className="text-xs text-feed-text-tertiary flex-shrink-0">{relativeTime(event.createdAt)}</span>
          </div>
          <p className="text-xs text-feed-text-secondary">{ACTION_TEXT[event.type]}</p>
        </div>
      </div>

      {/* Reason badge */}
      {reason && (
        <div className="px-4 pt-2">
          <span className="text-[11px] text-feed-text-tertiary">{reason}</span>
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
