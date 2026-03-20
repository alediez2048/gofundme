"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFundRightStore } from "@/lib/store";
import UserAvatar from "@/components/UserAvatar";

export default function FeedHeader() {
  const router = useRouter();
  const currentUserId = useFundRightStore((s) => s.currentUser);
  const user = useFundRightStore((s) => (currentUserId ? s.users[currentUserId] : null));
  const setCurrentUser = useFundRightStore((s) => s.setCurrentUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close menu on outside click
  useEffect(() => {
    if (!showProfileMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showProfileMenu]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-feed-border">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center h-16 gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 text-lg font-bold text-gfm-green">
          FundRight
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto hidden sm:block">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-feed-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-9 pr-4 py-2 text-sm bg-feed-bg-hover border border-transparent rounded-pill-gfm focus:bg-white focus:border-gfm-green focus:outline-none transition-colors"
              aria-label="Search FundRight"
            />
          </div>
        </form>

        {/* Icon nav */}
        <nav className="flex items-center gap-1" aria-label="Feed navigation">
          <NavIcon href="/" label="Feed" active>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </NavIcon>
          <NavIcon href="/communities" label="Communities">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </NavIcon>
          <NavIcon href="/browse" label="Discover">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </NavIcon>
        </nav>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu((v) => !v)}
            className="flex items-center gap-1 p-1 rounded-full hover:bg-feed-bg-hover transition-colors"
            aria-label="Profile menu"
            aria-expanded={showProfileMenu}
          >
            {user && <UserAvatar src={user.avatar} size={32} />}
          </button>

          {showProfileMenu && user && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-feed-border rounded-card-sm shadow-medium py-1 min-w-[200px] z-50">
              <div className="px-4 py-2 border-b border-feed-border">
                <p className="text-sm font-semibold text-feed-text-heading">{user.name}</p>
                <p className="text-xs text-feed-text-tertiary">@{user.username}</p>
              </div>
              <Link
                href={`/u/${user.username}`}
                onClick={() => setShowProfileMenu(false)}
                className="block px-4 py-2 text-sm text-feed-text-body hover:bg-feed-bg-hover"
              >
                View Profile
              </Link>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-feed-text-body hover:bg-feed-bg-hover"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavIcon({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center px-3 py-1 rounded-card-sm transition-colors ${
        active
          ? "text-feed-text-heading"
          : "text-feed-text-tertiary hover:text-feed-text-secondary hover:bg-feed-bg-hover"
      }`}
      aria-label={label}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        {children}
      </svg>
      <span className="text-[10px] mt-0.5">{label}</span>
    </Link>
  );
}
