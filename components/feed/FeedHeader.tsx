"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useFundRightStore } from "@/lib/store";
import { getUnreadMessageCount } from "@/lib/data/seed-messages";
import UserAvatar from "@/components/UserAvatar";

export default function FeedHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const currentUserId = useFundRightStore((s) => s.currentUser);
  const user = useFundRightStore((s) => (currentUserId ? s.users[currentUserId] : null));
  const setCurrentUser = useFundRightStore((s) => s.setCurrentUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const unreadMessages = currentUserId ? getUnreadMessageCount(currentUserId) : 0;

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
    <header className="gfm-feed-view sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-heading-lg shrink-0 tracking-tight text-brand-strong transition-opacity duration-hrt ease-hrt hover:opacity-90"
        >
          fund<span className="font-bold">right</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="mx-auto hidden max-w-md flex-1 sm:block">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f6f6f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="gfm-feed-input w-full py-2 pl-9 pr-4 text-[16px] leading-6 focus:border-brand-strong focus:bg-white focus:outline-none"
              aria-label="Search FundRight"
            />
          </div>
        </form>

        {/* Icon nav */}
        <nav className="flex items-center gap-1" aria-label="Feed navigation">
          <NavIcon href="/" label="Feed" active={pathname === "/"}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </NavIcon>
          <NavIcon
            href="/messages"
            label="Messages"
            active={pathname.startsWith("/messages")}
            badge={unreadMessages}
          >
            <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </NavIcon>
          <NavIcon
            href="/communities"
            label="Communities"
            active={pathname.startsWith("/communities")}
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </NavIcon>
          <NavIcon
            href="/browse"
            label="Fundraisers"
            active={pathname.startsWith("/browse")}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </NavIcon>
        </nav>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu((v) => !v)}
            className="flex items-center gap-1 rounded-full p-1 transition-colors hover:bg-[#f5f5f5]"
            aria-label="Profile menu"
            aria-expanded={showProfileMenu}
          >
            {user && <UserAvatar src={user.avatar} size={32} />}
          </button>

          {showProfileMenu && user && (
            <div className="gfm-feed-card absolute right-0 top-full z-50 mt-2 min-w-[220px] py-1">
              <div className="border-b border-black/5 px-4 py-3">
                <p className="text-[16px] leading-6 text-[#232323]">{user.name}</p>
                <p className="gfm-feed-meta">@{user.username}</p>
              </div>
              <Link
                href={`/u/${user.username}`}
                onClick={() => setShowProfileMenu(false)}
                className="block px-4 py-2 text-[16px] leading-6 text-[#232323] hover:bg-[#f5f5f5]"
              >
                View Profile
              </Link>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-[16px] leading-6 text-[#232323] hover:bg-[#f5f5f5]"
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
  badge,
  children,
}: {
  href: string;
  label: string;
  active?: boolean;
  badge?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex min-w-[72px] flex-col items-center rounded-xl px-3 py-1.5 transition-colors ${
        active
          ? "bg-[#f5f5f5] text-[#232323]"
          : "text-[#6f6f6f] hover:bg-[#f5f5f5] hover:text-[#232323]"
      }`}
      aria-label={label}
    >
      <span className="relative">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          {children}
        </svg>
        {!!badge && (
          <span className="absolute -right-2 -top-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-white">
            {badge}
          </span>
        )}
      </span>
      <span className="mt-0.5 text-[11px]">{label}</span>
    </Link>
  );
}
