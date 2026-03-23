"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFundRightStore } from "@/lib/store";
import UserAvatar from "@/components/UserAvatar";

interface EngagementBarProps {
  eventId: string;
  currentUserId: string;
  compact?: boolean;
}

export default function EngagementBar({ eventId, currentUserId, compact }: EngagementBarProps) {
  const event = useFundRightStore((s) => s.feedEvents[eventId]);
  const users = useFundRightStore((s) => s.users);
  const toggleHeart = useFundRightStore((s) => s.toggleHeart);
  const addComment = useFundRightStore((s) => s.addComment);
  const addSharePost = useFundRightStore((s) => s.addSharePost);
  const toggleBookmark = useFundRightStore((s) => s.toggleBookmark);
  const incrementShare = useFundRightStore((s) => s.incrementShare);

  const [showComments, setShowComments] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [shareCommentary, setShareCommentary] = useState("");
  const [showShareComposer, setShowShareComposer] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareRef = useRef<HTMLDivElement>(null);
  const shareBtnRef = useRef<HTMLButtonElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Close share menu on outside click or Escape (must be before early return)
  useEffect(() => {
    if (!showShareMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShowShareMenu(false);
        shareBtnRef.current?.focus();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowShareMenu(false);
        shareBtnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showShareMenu]);

  if (!event) return null;

  const { engagement } = event;
  const hearted = engagement.heartedByUserIds.includes(currentUserId);
  const bookmarked = engagement.bookmarkedByUserIds.includes(currentUserId);

  const handleHeart = () => toggleHeart(eventId, currentUserId);
  const handleBookmark = () => toggleBookmark(eventId, currentUserId);

  const handleComment = () => {
    setShowComments((v) => !v);
    if (!showComments) {
      setTimeout(() => commentInputRef.current?.focus(), 50);
    }
  };

  const handleSubmitComment = () => {
    const text = commentText.trim();
    if (!text) return;
    addComment(eventId, currentUserId, text);
    setCommentText("");
  };

  const handleShare = () => setShowShareMenu((v) => !v);

  const handleShareToFeed = () => {
    if (!currentUserId) return;
    const result = addSharePost(currentUserId, eventId, shareCommentary);
    if (!result) return;
    setShareCommentary("");
    setShowShareComposer(false);
    setShowShareMenu(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      incrementShare(eventId);
      setTimeout(() => {
        setCopied(false);
        setShowShareMenu(false);
      }, 1500);
    } catch {
      setShowShareMenu(false);
    }
  };

  const handleExternalShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this fundraiser on FundRight!");
    let shareUrl = "";
    if (platform === "twitter") shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    if (platform === "facebook") shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
    incrementShare(eventId);
    setShowShareMenu(false);
  };

  const recentComments = engagement.comments.slice(-3);

  const btnBase = compact
    ? "gfm-feed-action-button gap-1 px-2 text-[14px] leading-5"
    : "gfm-feed-action-button flex-1 text-[14px] leading-5";

  return (
    <div>
      {/* Action buttons */}
      <div className={`flex ${compact ? "gap-1" : "gap-1"} border-t border-black/5 pt-3`}>
        {/* Heart */}
        <button
          onClick={handleHeart}
          aria-pressed={hearted}
          aria-label={`${engagement.heartCount} hearts, press to ${hearted ? "unheart" : "heart"}`}
          className={`${btnBase} ${hearted ? "bg-[#e9fcce] text-brand-strong" : "text-[#232323]"}`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={hearted ? "currentColor" : "none"} stroke="currentColor" strokeWidth={hearted ? 0 : 2}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {engagement.heartCount > 0 && <span>{engagement.heartCount}</span>}
        </button>

        {/* Comment */}
        <button
          onClick={handleComment}
          aria-label={`${engagement.commentCount} comments, press to comment`}
          className={`${btnBase} text-[#232323]`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {engagement.commentCount > 0 && <span>{engagement.commentCount}</span>}
        </button>

        {/* Share */}
        <div className="relative" ref={shareRef}>
          <button
            ref={shareBtnRef}
            onClick={handleShare}
            aria-label={`${engagement.shareCount} shares, press to share`}
            aria-expanded={showShareMenu}
            className={`${btnBase} text-[#232323]`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            {engagement.shareCount > 0 && <span>{engagement.shareCount}</span>}
          </button>

          {showShareMenu && (
            <div className="gfm-feed-card absolute bottom-full left-0 z-10 mb-2 min-w-[180px] py-1">
              <button
                onClick={() => {
                  setShowShareComposer((current) => !current);
                  setShowShareMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-[14px] leading-5 hover:bg-[#f5f5f5]"
              >
                Share to feed
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-2 text-left text-[14px] leading-5 hover:bg-[#f5f5f5]"
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
              <button
                onClick={() => handleExternalShare("twitter")}
                className="w-full px-4 py-2 text-left text-[14px] leading-5 hover:bg-[#f5f5f5]"
              >
                Share on X
              </button>
              <button
                onClick={() => handleExternalShare("facebook")}
                className="w-full px-4 py-2 text-left text-[14px] leading-5 hover:bg-[#f5f5f5]"
              >
                Share on Facebook
              </button>
            </div>
          )}
        </div>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          aria-pressed={bookmarked}
          aria-label={`press to ${bookmarked ? "remove bookmark" : "bookmark"}`}
          className={`${btnBase} ${bookmarked ? "bg-[#e9fcce] text-brand-strong" : "text-[#232323]"}`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* Inline comments */}
      {showComments && (
        <div className="mt-3 space-y-3 rounded-xl bg-[#f5f5f5] p-4">
          {recentComments.map((c) => {
            const author = users[c.authorId];
            return (
              <div key={c.id} className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                  {author && <UserAvatar src={author.avatar} size={28} />}
                </div>
                <div className="min-w-0">
                  <span className="text-[14px] leading-5 text-[#232323]">{author?.name ?? "User"}</span>
                  <p className="text-[14px] leading-5 text-[#232323]">{c.text}</p>
                </div>
              </div>
            );
          })}
          {engagement.commentCount > 3 && (
            <button className="text-[14px] leading-5 text-brand-strong">
              View all {engagement.commentCount} comments
            </button>
          )}
          <div className="flex gap-2">
            <input
              ref={commentInputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
              placeholder="Add a comment..."
              className="gfm-feed-input flex-1 px-4 py-2 text-[14px] leading-5 focus:border-brand-strong focus:outline-none"
            />
            <button
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
              className="gfm-feed-pill-primary disabled:opacity-40"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {showShareComposer && (
        <div className="mt-3 space-y-3 rounded-xl bg-[#f5f5f5] p-4">
          <textarea
            value={shareCommentary}
            onChange={(e) => setShareCommentary(e.target.value)}
            placeholder="Add a thought before you share..."
            className="gfm-feed-textarea min-h-[88px] w-full resize-none px-4 py-3 text-[14px] leading-5 focus:border-brand-strong focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShareCommentary("");
                setShowShareComposer(false);
              }}
              className="gfm-feed-pill-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleShareToFeed}
              className="gfm-feed-pill-primary"
            >
              Share post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
