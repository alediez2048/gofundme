"use client";

import Link from "next/link";
import { useFundRightStore } from "@/lib/store";
import UserAvatar from "@/components/UserAvatar";
import ProgressBar from "@/components/ProgressBar";

export default function RightSidebar() {
  const fundraisers = useFundRightStore((s) => s.fundraisers);
  const communities = useFundRightStore((s) => s.communities);
  const users = useFundRightStore((s) => s.users);
  const currentUserId = useFundRightStore((s) => s.currentUser);
  const follow = useFundRightStore((s) => s.follow);

  const currentUser = currentUserId ? users[currentUserId] : null;
  const currentFollowing = new Set(currentUser?.followingIds ?? []);

  // Trending fundraisers — top 3 by raised/goal ratio
  const trendingFundraisers = Object.values(fundraisers)
    .sort((a, b) => b.raisedAmount / b.goalAmount - a.raisedAmount / a.goalAmount)
    .slice(0, 3);

  // Community spotlight — 2 communities
  const spotlightCommunities = Object.values(communities).slice(0, 2);

  // Suggested people — users not followed yet
  const suggestedUsers = Object.values(users)
    .filter((u) => u.id !== currentUserId && !currentFollowing.has(u.id))
    .slice(0, 3);

  return (
    <aside className="space-y-4 hidden md:block">
      {/* Trending fundraisers */}
      <div className="bg-feed-bg-card border border-black/[0.06] rounded-card shadow-card p-4">
        <p className="text-xs font-semibold text-feed-text-secondary uppercase tracking-wider mb-3">Trending Fundraisers</p>
        <div className="space-y-3">
          {trendingFundraisers.map((f) => (
            <Link
              key={f.id}
              href={`/f/${f.slug}`}
              className="block hover:bg-feed-bg-hover rounded-card-sm p-2 -mx-2 transition-colors"
            >
              <p className="text-sm font-semibold text-feed-text-heading line-clamp-1">{f.title}</p>
              <ProgressBar raised={f.raisedAmount} goal={f.goalAmount} height="h-1" />
              <p className="text-[11px] text-feed-text-tertiary mt-1">
                ${f.raisedAmount.toLocaleString()} raised
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Community spotlight */}
      <div className="bg-feed-bg-card border border-black/[0.06] rounded-card shadow-card p-4">
        <p className="text-xs font-semibold text-feed-text-secondary uppercase tracking-wider mb-3">Community Spotlight</p>
        <div className="space-y-3">
          {spotlightCommunities.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gfm-green-light flex items-center justify-center text-gfm-green font-bold text-sm flex-shrink-0">
                {c.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/communities/${c.slug}`} className="text-sm font-semibold text-feed-text-heading hover:underline line-clamp-1">
                  {c.name}
                </Link>
                <p className="text-[11px] text-feed-text-tertiary">{c.memberCount} members</p>
              </div>
              <Link
                href={`/communities/${c.slug}`}
                className="px-3 py-1 rounded-pill-gfm border border-gfm-green text-gfm-green text-xs font-bold hover:bg-gfm-green hover:text-white transition-colors flex-shrink-0"
              >
                Join
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested people */}
      {suggestedUsers.length > 0 && (
        <div className="bg-feed-bg-card border border-black/[0.06] rounded-card shadow-card p-4">
          <p className="text-xs font-semibold text-feed-text-secondary uppercase tracking-wider mb-3">People You May Know</p>
          <div className="space-y-3">
            {suggestedUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <Link href={`/u/${u.username}`} className="flex-shrink-0">
                  <UserAvatar src={u.avatar} size={36} />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/u/${u.username}`} className="text-sm font-semibold text-feed-text-heading hover:underline truncate block">
                    {u.name}
                  </Link>
                  <p className="text-[11px] text-feed-text-tertiary line-clamp-1">{u.bio}</p>
                </div>
                <button
                  onClick={() => currentUserId && follow(currentUserId, u.id)}
                  className="px-3 py-1 rounded-pill-gfm border border-feed-text-heading text-feed-text-heading text-xs font-bold hover:bg-feed-text-heading hover:text-white transition-colors flex-shrink-0"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer links */}
      <div className="px-2">
        <p className="text-[10px] text-feed-text-tertiary leading-relaxed">
          About &middot; Accessibility &middot; Help Center &middot; Privacy &middot; Terms &middot; Ad Choices
        </p>
        <p className="text-[10px] text-feed-text-tertiary mt-1">FundRight &copy; 2026</p>
      </div>
    </aside>
  );
}
