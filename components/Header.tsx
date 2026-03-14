"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useFundRightStore } from "@/lib/store";
import UserAvatar from "./UserAvatar";

const DEFAULT_PROFILE_USERNAME = "janahan";

const NAV_LINKS = [
  { href: "/", label: "Discover" },
  { href: "/browse", label: "Browse" },
  { href: "/communities", label: "Communities" },
  { href: "/create", label: "Start a FundRight" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const usersMap = useFundRightStore((s) => s.users);
  const defaultUser = Object.values(usersMap).find(
    (u) => u.username === DEFAULT_PROFILE_USERNAME
  );

  useEffect(() => {
    if (!profileOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [profileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Escape + focus trap when mobile drawer open (same pattern as DonationModal) */
  useEffect(() => {
    if (!mobileOpen) return;
    const el = mobileDrawerRef.current;
    if (!el) return;
    const focusables = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        mobileMenuButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="border-b border-stone-200 bg-white" role="banner">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Main">
        <Link href="/" className="font-semibold text-primary hover:opacity-90">
          FundRight
        </Link>

        {/* Desktop nav — visible from md */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium ${
                isActive(href)
                  ? "text-primary"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-expanded={profileOpen}
              aria-haspopup="true"
              aria-label="Profile menu"
            >
              {defaultUser ? (
                <UserAvatar src={defaultUser.avatar} size={36} />
              ) : (
                <span className="h-9 w-9 rounded-full bg-stone-200" aria-hidden />
              )}
            </button>
            {profileOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
                role="menu"
              >
                {defaultUser && (
                  <Link
                    href={`/u/${defaultUser.username}`}
                    className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    My profile
                  </Link>
                )}
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: hamburger + profile avatar */}
        <div className="flex items-center gap-2 md:hidden">
          {defaultUser && (
            <Link href={`/u/${defaultUser.username}`} className="flex shrink-0" aria-label="My profile">
              <UserAvatar src={defaultUser.avatar} size={36} />
            </Link>
          )}
          <button
            ref={mobileMenuButtonRef}
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded p-2 text-stone-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span className={`block h-0.5 w-5 rounded bg-current transition-transform ${mobileOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 rounded bg-current ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 rounded bg-current transition-transform ${mobileOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile slide-out drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-stone-900/20 md:hidden"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
          <div
            ref={mobileDrawerRef}
            className="fixed top-0 right-0 z-50 h-full w-64 max-w-[85vw] bg-white shadow-xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex flex-col gap-1 p-4 pt-14">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    isActive(href)
                      ? "bg-primary/10 text-primary"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {defaultUser && (
                <Link
                  href={`/u/${defaultUser.username}`}
                  className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    pathname === `/u/${defaultUser.username}`
                      ? "bg-primary/10 text-primary"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  My profile
                </Link>
              )}
              <div className="mt-4 border-t border-stone-200 pt-4">
                <span className="block px-4 py-2 text-sm text-stone-500">Sign Out</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
