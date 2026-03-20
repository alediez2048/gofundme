"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFundRightStore } from "@/lib/store";

export default function BottomTabBar() {
  const currentUserId = useFundRightStore((s) => s.currentUser);
  const user = useFundRightStore((s) => (currentUserId ? s.users[currentUserId] : null));
  const pathname = usePathname();

  if (!currentUserId) return null;

  const profileHref = user ? `/u/${user.username}` : "/";

  const tabs: Array<{ href: string; label: string; icon: React.ReactNode; fab?: boolean }> = [
    {
      href: "/",
      label: "Feed",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      href: "/communities",
      label: "Communities",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      href: "/create",
      label: "Create",
      fab: true,
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      ),
    },
    {
      href: "/browse",
      label: "Explore",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      href: profileHref,
      label: "Profile",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-feed-border md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-end justify-around px-2 pt-1 pb-1">
        {tabs.map((tab) => {
          const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

          if (tab.fab) {
            return (
              <Link
                key={tab.label}
                href={tab.href}
                aria-label={tab.label}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <span className="w-12 h-12 rounded-full bg-gfm-green text-white flex items-center justify-center shadow-medium">
                  {tab.icon}
                </span>
                <span className="text-[10px] font-semibold text-gfm-green mt-0.5">{tab.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center py-1 min-w-[48px] min-h-[44px] ${
                isActive ? "text-gfm-green" : "text-feed-text-tertiary"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-semibold mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
