"use client";

import { useState } from "react";
import Link from "next/link";
import { useFundRightStore } from "@/lib/store";
import UserAvatar from "@/components/UserAvatar";

const POST_IMAGE_PRESETS = [
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&h=675&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&h=675&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&h=675&q=80",
] as const;

export default function PostComposer() {
  const currentUserId = useFundRightStore((s) => s.currentUser);
  const user = useFundRightStore((s) => (currentUserId ? s.users[currentUserId] : null));
  const addUserPost = useFundRightStore((s) => s.addUserPost);
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [posting, setPosting] = useState(false);

  const handlePost = () => {
    if (!currentUserId || (!text.trim() && !selectedImageUrl) || posting) return;
    setPosting(true);
    addUserPost(currentUserId, text.trim(), selectedImageUrl ?? undefined);
    setText("");
    setSelectedImageUrl(null);
    setShowPhotoOptions(false);
    setExpanded(false);
    setPosting(false);
  };

  const handleCancel = () => {
    setText("");
    setSelectedImageUrl(null);
    setShowPhotoOptions(false);
    setExpanded(false);
  };

  return (
    <div className="gfm-feed-card p-4">
      <div className="flex items-center gap-3">
        {user && <UserAvatar src={user.avatar} name={user.name} size={44} />}
        {!expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="gfm-feed-input flex-1 px-4 py-2.5 text-left text-[16px] leading-6 text-[#b7b7b6] transition-colors hover:bg-[#efefef]"
            aria-label="Start a post"
          >
            Start a post...
          </button>
        ) : (
          <div className="flex-1 space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              className="gfm-feed-textarea min-h-[112px] w-full resize-none px-4 py-3 text-[16px] leading-6 focus:outline-none focus:ring-2 focus:ring-brand-strong/20 focus:border-brand-strong"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handlePost();
                }
              }}
            />
            {selectedImageUrl && (
              <div className="space-y-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImageUrl}
                    alt="Selected post image"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedImageUrl(null)}
                  className="text-[14px] leading-5 text-brand-strong"
                >
                  Remove photo
                </button>
              </div>
            )}
            {showPhotoOptions && (
              <div className="grid grid-cols-3 gap-3">
                {POST_IMAGE_PRESETS.map((imageUrl, index) => (
                  <button
                    key={imageUrl}
                    type="button"
                    onClick={() => {
                      setSelectedImageUrl(imageUrl);
                      setShowPhotoOptions(false);
                    }}
                    className="overflow-hidden rounded-xl border border-black/5 bg-white text-left shadow-soft transition hover:shadow-medium"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={`Photo preset ${index + 1}`}
                      className="aspect-video w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="gfm-feed-pill-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePost}
                disabled={(!text.trim() && !selectedImageUrl) || posting}
                className="gfm-feed-pill-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-1 border-t border-black/5 pt-3">
        <button className="gfm-feed-action-button flex-1 text-[14px] leading-5" aria-label="Add video">
          <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
          Video
        </button>
        <button
          type="button"
          onClick={() => {
            setExpanded(true);
            setShowPhotoOptions((current) => !current);
          }}
          className="gfm-feed-action-button flex-1 text-[14px] leading-5"
          aria-label="Add photo"
        >
          <svg className="w-4 h-4 text-gfm-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          Photo
        </button>
        <button className="gfm-feed-action-button flex-1 text-[14px] leading-5" aria-label="Write a story">
          <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Story
        </button>
        <Link
          href="/create"
          className="gfm-feed-action-button flex-1 text-[14px] leading-5"
          aria-label="Start a fundraiser"
        >
          <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
          Fundraise
        </Link>
      </div>
    </div>
  );
}
