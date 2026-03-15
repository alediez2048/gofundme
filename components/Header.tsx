"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useFundRightStore } from "@/lib/store";
import UserAvatar from "./UserAvatar";

const DEFAULT_PROFILE_USERNAME = "janahan";

/* GoFundMe-style nav: Left (Search, Donate, Fundraise) | Center (Logo) | Right (About, Avatar) */

const MOBILE_NAV_LINKS = [
  { href: "/search", label: "Search" },
  { href: "/browse", label: "Donate" },
  { href: "/create", label: "Fundraise" },
  { href: "/communities", label: "Communities" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const usersMap = useFundRightStore((s) => s.users);
  const defaultUser = Object.values(usersMap).find(
    (u) => u.username === DEFAULT_PROFILE_USERNAME
  );

  /* Close profile dropdown on outside click */
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

  /* Close about dropdown on outside click */
  useEffect(() => {
    if (!aboutOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [aboutOpen]);

  /* Close mobile drawer on route change */
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
    <header className="border-b border-gray-200 bg-white" role="banner">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
        aria-label="Main"
      >
        {/* ── Left section: Search, Donate, Fundraise ── */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/search"
            className="text-secondary hover:text-heading transition-colors"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx={11} cy={11} r={8} />
              <line x1={21} y1={21} x2={16.65} y2={16.65} />
            </svg>
          </Link>
          <Link
            href="/browse"
            className={`text-sm font-medium transition-colors ${
              isActive("/browse")
                ? "text-primary"
                : "text-secondary hover:text-heading"
            }`}
          >
            Donate
          </Link>
          <Link
            href="/create"
            className={`text-sm font-medium transition-colors ${
              isActive("/create")
                ? "text-primary"
                : "text-secondary hover:text-heading"
            }`}
          >
            Fundraise
          </Link>
        </div>

        {/* ── Center: Logo ── */}
        <Link
          href="/"
          className="text-xl font-bold text-primary tracking-tight hover:opacity-90 transition-opacity"
        >
          FundRight
        </Link>

        {/* ── Right section: About dropdown, User avatar ── */}
        <div className="hidden items-center gap-5 md:flex">
          {/* About dropdown */}
          <div className="relative" ref={aboutRef}>
            <button
              type="button"
              onClick={() => setAboutOpen((o) => !o)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                aboutOpen ? "text-primary" : "text-secondary hover:text-heading"
              }`}
              aria-expanded={aboutOpen}
              aria-haspopup="true"
            >
              About
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-4 w-4 transition-transform ${aboutOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {aboutOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg animate-fadeIn"
                role="menu"
              >
                <Link
                  href="/communities"
                  className="block px-4 py-2 text-sm text-heading hover:bg-gray-50"
                  role="menuitem"
                  onClick={() => setAboutOpen(false)}
                >
                  Communities
                </Link>
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm text-heading hover:bg-gray-50"
                  role="menuitem"
                  onClick={() => setAboutOpen(false)}
                >
                  How it works
                </Link>
              </div>
            )}
          </div>

          {/* Profile avatar + dropdown */}
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
                <span className="h-9 w-9 rounded-full bg-gray-200" aria-hidden />
              )}
            </button>
            {profileOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg animate-fadeIn"
                role="menu"
              >
                {defaultUser && (
                  <Link
                    href={`/u/${defaultUser.username}`}
                    className="block px-4 py-2 text-sm text-heading hover:bg-gray-50"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    My profile
                  </Link>
                )}
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-heading hover:bg-gray-50"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile: hamburger + profile avatar ── */}
        <div className="flex items-center gap-2 md:hidden">
          {defaultUser && (
            <Link
              href={`/u/${defaultUser.username}`}
              className="flex shrink-0"
              aria-label="My profile"
            >
              <UserAvatar src={defaultUser.avatar} size={36} />
            </Link>
          )}
          <button
            ref={mobileMenuButtonRef}
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded p-2 text-secondary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block h-0.5 w-5 rounded bg-current transition-transform ${
                mobileOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-current ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-current transition-transform ${
                mobileOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile slide-out drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
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
              {MOBILE_NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    isActive(href)
                      ? "bg-primary/10 text-primary"
                      : "text-heading hover:bg-gray-50"
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
                      : "text-heading hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  My profile
                </Link>
              )}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <span className="block px-4 py-2 text-sm text-secondary">
                  Sign Out
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
