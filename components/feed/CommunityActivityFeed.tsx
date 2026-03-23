"use client";

import Link from "next/link";
import { useFundRightStore } from "@/lib/store";
import UserAvatar from "@/components/UserAvatar";
import FeedCard from "./FeedCard";

interface CommunityActivityFeedProps {
  communityId: string;
}

export default function CommunityActivityFeed({ communityId }: CommunityActivityFeedProps) {
  const currentUserId = useFundRightStore((s) => s.currentUser);
  const feedEvents = useFundRightStore((s) => s.feedEvents);
  const community = useFundRightStore((s) => s.communities[communityId]);
  const users = useFundRightStore((s) => s.users);
  const donations = useFundRightStore((s) => s.donations);

  if (!community) return null;

  // Filter events related to this community
  const communityEvents = Object.values(feedEvents)
    .filter((e) => e.communityId === communityId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Build leaderboard from community donations
  const donorTotals = new Map<string, number>();
  for (const don of Object.values(donations)) {
    const fund = community.fundraiserIds.includes(don.fundraiserId) ? don : null;
    if (!fund) continue;
    donorTotals.set(don.donorId, (donorTotals.get(don.donorId) ?? 0) + don.amount);
  }
  const leaderboard = Array.from(donorTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([userId, amount], idx) => ({
      user: users[userId],
      amount,
      rank: idx + 1,
    }))
    .filter((e) => e.user);

  // People you follow in this community
  const currentUser = currentUserId ? users[currentUserId] : null;
  const followingInCommunity = currentUser
    ? (currentUser.followingIds ?? [])
        .filter((fid) => community.memberIds.includes(fid))
        .map((fid) => users[fid])
        .filter(Boolean)
    : [];

  // Community milestones
  const milestones = community.milestones ?? [];

  return (
    <div className="gfm-feed-view mt-6 space-y-6">
      {/* Milestone badges */}
      {milestones.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {milestones.map((m) => (
            <div
              key={m.type}
              className="gfm-feed-badge"
            >
              Crossed {m.type}
            </div>
          ))}
        </div>
      )}

      {/* People you follow in this community */}
      {followingInCommunity.length > 0 && (
        <div className="gfm-feed-card p-4">
          <h3 className="gfm-feed-meta mb-3 uppercase tracking-[0.08em]">
            People you follow here
          </h3>
          <div className="flex gap-3 flex-wrap">
            {followingInCommunity.map((u) => (
              <Link key={u.id} href={`/u/${u.id ? u.username : ""}`} className="flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-[#f5f5f5]">
                <UserAvatar src={u.avatar} size={32} />
                <span className="text-[16px] leading-6 text-[#232323]">{u.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="gfm-feed-card p-4">
          <h3 className="gfm-feed-meta mb-3 uppercase tracking-[0.08em]">
            Top Donors
          </h3>
          <div className="space-y-2">
            {leaderboard.map(({ user: u, amount, rank }) => (
              <div key={u!.id} className="flex items-center gap-3">
                <span className="w-6 text-center text-[14px] leading-5 text-[#b7b7b6]">
                  {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
                </span>
                <Link href={`/u/${u!.username}`} className="flex-shrink-0">
                  <UserAvatar src={u!.avatar} size={32} />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/u/${u!.username}`} className="block truncate text-[16px] leading-6 text-[#232323]">
                    {u!.name}
                  </Link>
                </div>
                <span className="text-[16px] leading-6 text-brand">${amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity feed */}
      {communityEvents.length > 0 && (
        <div>
          <h3 className="gfm-feed-heading-md mb-3 text-[#232323]">Community Activity</h3>
          <div className="space-y-4">
            {communityEvents.map((event) => (
              <FeedCard
                key={event.id}
                event={event}
                currentUserId={currentUserId ?? ""}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
