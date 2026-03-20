"use client";

import Link from "next/link";
import { useFundRightStore } from "@/lib/store";
import UserAvatar from "@/components/UserAvatar";

export default function LeftSidebar() {
  const currentUserId = useFundRightStore((s) => s.currentUser);
  const user = useFundRightStore((s) => (currentUserId ? s.users[currentUserId] : null));
  const communities = useFundRightStore((s) => s.communities);
  const feedEvents = useFundRightStore((s) => s.feedEvents);

  if (!user) return null;

  const followerCount = user.followerIds?.length ?? 0;
  const followingCount = user.followingIds?.length ?? 0;
  const bookmarkedCount = user.bookmarkedIds?.length ?? 0;

  // Count people "inspired" (unique users who hearted events by this user)
  const inspiredSet = new Set<string>();
  for (const evt of Object.values(feedEvents)) {
    if (evt.actorId === user.id) {
      for (const uid of evt.engagement.heartedByUserIds) {
        if (uid !== user.id) inspiredSet.add(uid);
      }
    }
  }

  const userCommunities = user.communityIds
    .map((id) => communities[id])
    .filter(Boolean);

  return (
    <aside className="space-y-4 hidden lg:block">
      {/* Identity card */}
      <div className="bg-feed-bg-card border border-black/[0.06] rounded-card shadow-card overflow-hidden">
        {/* Banner gradient */}
        <div className="h-16 bg-gradient-to-br from-[#b2f5d8] via-[#6ee7a8] to-gfm-green" />
        <div className="px-4 pb-4 -mt-6">
          <Link href={`/u/${user.username}`}>
            <UserAvatar src={user.avatar} size={56} className="border-2 border-white" />
          </Link>
          <Link href={`/u/${user.username}`} className="block mt-2">
            <p className="text-sm font-semibold text-feed-text-heading hover:underline">{user.name}</p>
          </Link>
          <p className="text-xs text-feed-text-secondary mt-0.5 line-clamp-2">{user.bio}</p>
          {inspiredSet.size > 0 && (
            <p className="text-xs text-gfm-green font-semibold mt-2">
              Inspired {inspiredSet.size} {inspiredSet.size === 1 ? "person" : "people"} to help
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="border-t border-feed-border px-4 py-3 grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-bold text-feed-text-heading">{followerCount}</p>
            <p className="text-[11px] text-feed-text-tertiary">Followers</p>
          </div>
          <div>
            <p className="text-sm font-bold text-feed-text-heading">{followingCount}</p>
            <p className="text-[11px] text-feed-text-tertiary">Following</p>
          </div>
        </div>

        {/* Bookmarks */}
        {bookmarkedCount > 0 && (
          <div className="border-t border-feed-border px-4 py-3">
            <p className="text-xs font-semibold text-feed-text-secondary">
              <svg className="w-3.5 h-3.5 inline mr-1" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={0}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {bookmarkedCount} saved items
            </p>
          </div>
        )}
      </div>

      {/* My communities */}
      {userCommunities.length > 0 && (
        <div className="bg-feed-bg-card border border-black/[0.06] rounded-card shadow-card p-4">
          <p className="text-xs font-semibold text-feed-text-secondary uppercase tracking-wider mb-3">My Communities</p>
          <div className="space-y-2">
            {userCommunities.map((c) => (
              <Link
                key={c.id}
                href={`/communities/${c.slug}`}
                className="flex items-center gap-2 py-1.5 px-2 rounded-card-sm hover:bg-feed-bg-hover transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gfm-green-light flex items-center justify-center text-gfm-green text-xs font-bold">
                  {c.name[0]}
                </div>
                <span className="text-xs font-medium text-feed-text-heading truncate">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
