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
    <aside className="gfm-feed-view hidden space-y-4 self-start lg:sticky lg:top-24 lg:block">
      {/* Identity card */}
      <div className="gfm-feed-card overflow-hidden">
        {/* Banner gradient */}
        <div className="h-[132px] bg-gradient-to-br from-[#9af2ba] via-brand to-brand-strong" />
        <div className="px-4 pb-4 -mt-6">
          <Link href={`/u/${user.username}`}>
            <UserAvatar src={user.avatar} size={96} className="border-4 border-white shadow-medium" />
          </Link>
          <Link href={`/u/${user.username}`} className="block mt-2">
            <p className="gfm-feed-heading-sm text-[#232323] hover:underline">{user.name}</p>
          </Link>
          <p className="gfm-feed-meta mt-1 line-clamp-2">{user.bio}</p>
          {inspiredSet.size > 0 && (
            <p className="mt-3 text-[16px] leading-6 text-brand">
              Inspired {inspiredSet.size} {inspiredSet.size === 1 ? "person" : "people"} to help
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 border-t border-black/5 px-4 py-3">
          <div>
            <p className="text-[16px] leading-6 text-[#232323]">{followerCount}</p>
            <p className="gfm-feed-meta">Followers</p>
          </div>
          <div>
            <p className="text-[16px] leading-6 text-[#232323]">{followingCount}</p>
            <p className="gfm-feed-meta">Following</p>
          </div>
        </div>

        {/* Bookmarks */}
        {bookmarkedCount > 0 && (
          <div className="border-t border-black/5 px-4 py-3">
            <p className="text-[14px] leading-5 text-[#232323]">
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
        <div className="gfm-feed-card p-4">
          <p className="mb-3 text-[14px] leading-5 uppercase tracking-[0.08em] text-[#6f6f6f]">My Communities</p>
          <div className="space-y-2">
            {userCommunities.map((c) => (
              <Link
                key={c.id}
                href={`/communities/${c.slug}`}
                className="flex items-center gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-[#f5f5f5]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ccf88e] text-[14px] text-brand-strong">
                  {c.name[0]}
                </div>
                <span className="truncate text-[16px] leading-6 text-[#232323]">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
