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
    <aside className="gfm-feed-view hidden space-y-4 self-start md:sticky md:top-24 md:block">
      {/* Trending fundraisers */}
      <div className="gfm-feed-card p-4">
        <p className="mb-3 text-[14px] leading-5 uppercase tracking-[0.08em] text-[#6f6f6f]">Trending Fundraisers</p>
        <div className="space-y-3">
          {trendingFundraisers.map((f) => (
            <Link
              key={f.id}
              href={`/f/${f.slug}`}
              className="-mx-2 block rounded-xl p-2 transition-colors hover:bg-[#f5f5f5]"
            >
              <p className="line-clamp-1 text-[16px] leading-6 text-[#232323]">{f.title}</p>
              <ProgressBar raised={f.raisedAmount} goal={f.goalAmount} height="h-1" />
              <p className="gfm-feed-meta mt-1">
                ${f.raisedAmount.toLocaleString()} raised
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Community spotlight */}
      <div className="gfm-feed-card p-4">
        <p className="mb-3 text-[14px] leading-5 uppercase tracking-[0.08em] text-[#6f6f6f]">Community Spotlight</p>
        <div className="space-y-3">
          {spotlightCommunities.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ccf88e] text-[14px] text-brand-strong">
                {c.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/communities/${c.slug}`} className="line-clamp-1 text-[16px] leading-6 text-[#232323] hover:underline">
                  {c.name}
                </Link>
                <p className="gfm-feed-meta">{c.memberCount} members</p>
              </div>
              <Link
                href={`/communities/${c.slug}`}
                className="gfm-feed-pill-secondary shrink-0"
              >
                Join
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested people */}
      {suggestedUsers.length > 0 && (
        <div className="gfm-feed-card p-4">
          <p className="mb-3 text-[14px] leading-5 uppercase tracking-[0.08em] text-[#6f6f6f]">People You May Know</p>
          <div className="space-y-3">
            {suggestedUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <Link href={`/u/${u.username}`} className="flex-shrink-0">
                  <UserAvatar src={u.avatar} size={36} />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/u/${u.username}`} className="block truncate text-[16px] leading-6 text-[#232323] hover:underline">
                    {u.name}
                  </Link>
                  <p className="gfm-feed-meta line-clamp-1">{u.bio}</p>
                </div>
                <button
                  onClick={() => currentUserId && follow(currentUserId, u.id)}
                  className="gfm-feed-pill-secondary shrink-0"
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
        <p className="text-[11px] leading-relaxed text-[#6f6f6f]">
          About &middot; Accessibility &middot; Help Center &middot; Privacy &middot; Terms &middot; Ad Choices
        </p>
        <p className="mt-1 text-[11px] text-[#6f6f6f]">FundRight &copy; 2026</p>
      </div>
    </aside>
  );
}
