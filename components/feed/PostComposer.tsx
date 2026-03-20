"use client";

import Link from "next/link";
import { useFundRightStore } from "@/lib/store";
import UserAvatar from "@/components/UserAvatar";

export default function PostComposer() {
  const currentUserId = useFundRightStore((s) => s.currentUser);
  const user = useFundRightStore((s) => (currentUserId ? s.users[currentUserId] : null));

  return (
    <div className="bg-feed-bg-card border border-black/[0.06] rounded-card shadow-card p-4">
      <div className="flex items-center gap-3">
        {user && <UserAvatar src={user.avatar} size={44} />}
        <button
          className="flex-1 text-left text-sm text-feed-text-tertiary border border-feed-border rounded-pill-gfm px-4 py-2.5 hover:bg-feed-bg-hover transition-colors"
          aria-label="Start a post"
        >
          Start a post...
        </button>
      </div>
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-feed-border">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-card-sm text-xs font-semibold text-feed-text-secondary hover:bg-feed-bg-hover transition-colors" aria-label="Add video">
          <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
          Video
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-card-sm text-xs font-semibold text-feed-text-secondary hover:bg-feed-bg-hover transition-colors" aria-label="Add photo">
          <svg className="w-4 h-4 text-gfm-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          Photo
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-card-sm text-xs font-semibold text-feed-text-secondary hover:bg-feed-bg-hover transition-colors" aria-label="Write a story">
          <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Story
        </button>
        <Link
          href="/create"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-card-sm text-xs font-semibold text-feed-text-secondary hover:bg-feed-bg-hover transition-colors"
          aria-label="Start a fundraiser"
        >
          <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
          Fundraise
        </Link>
      </div>
    </div>
  );
}
