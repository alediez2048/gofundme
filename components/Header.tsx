"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useFundRightStore } from "@/lib/store";
import UserAvatar from "./UserAvatar";

const DEFAULT_PROFILE_USERNAME = "janahan";

const DEMO_USERS = [
  { id: "user-6", name: "Priya Sharma", label: "Donor" },
  { id: "user-1", name: "Janahan Selvakumaran", label: "Organizer" },
  { id: "user-3", name: "David Okonkwo", label: "Firefighter" },
  { id: "user-4", name: "Sarah Lee", label: "Advocate" },
  { id: "user-7", name: "Alex Kim", label: "Tech" },
];

const MOBILE_NAV_LINKS = [
  { href: "/search", label: "Search" },
  { href: "/browse", label: "Fundraisers" },
  { href: "/communities", label: "Communities" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const usersMap = useFundRightStore((s) => s.users);
  const setCurrentUser = useFundRightStore((s) => s.setCurrentUser);
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
    if (!aboutOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [aboutOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
    <header className="sticky top-0 z-40 border-b border-neutral-border bg-white" role="banner">
      <nav
        className="mx-auto flex h-20 max-w-content items-center justify-between px-4"
        aria-label="Main"
      >
        {/* Left: Search, Fundraisers, Communities, About */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/search"
            className="text-supporting transition-colors duration-hrt ease-hrt hover:text-heading"
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
            className={`text-body-md transition-colors duration-hrt ease-hrt ${
              isActive("/browse")
                ? "font-bold text-heading"
                : "text-heading hover:text-brand"
            }`}
          >
            Fundraisers
          </Link>
          <Link
            href="/communities"
            className={`text-body-md transition-colors duration-hrt ease-hrt ${
              isActive("/communities")
                ? "font-bold text-heading"
                : "text-heading hover:text-brand"
            }`}
          >
            Communities
          </Link>
          <div className="relative" ref={aboutRef}>
            <button
              type="button"
              onClick={() => setAboutOpen((o) => !o)}
              className={`flex items-center gap-1 text-body-md transition-colors duration-hrt ease-hrt ${
                aboutOpen ? "text-brand" : "text-heading hover:text-brand"
              }`}
              aria-expanded={aboutOpen}
              aria-haspopup="true"
            >
              About
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-4 w-4 transition-transform duration-hrt ease-hrt ${aboutOpen ? "rotate-180" : ""}`}
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
                className="absolute left-0 top-full z-50 mt-2 w-48 rounded-xl border border-neutral-border bg-white py-1 shadow-medium animate-fadeIn"
                role="menu"
              >
                <Link
                  href="/"
                  className="block px-4 py-2.5 text-body-sm text-heading transition-colors hover:bg-surface-subtle"
                  role="menuitem"
                  onClick={() => setAboutOpen(false)}
                >
                  How it works
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Center: Logo */}
        <Link
          href="/"
          className="text-heading-lg text-brand tracking-tight transition-opacity duration-hrt ease-hrt hover:opacity-90"
        >
          fund<span className="font-bold">right</span>
        </Link>

        {/* Right: CTA, Avatar */}
        <div className="hidden items-center gap-5 md:flex">
          {/* CTA button */}
          <Link href="/create" className="hrt-btn-primary-lg px-6">
            Start a FundRight
          </Link>

          {/* Sign In (demo user picker) */}
          <div className="relative" ref={profileRef}>
            <button
              id="sign-in-trigger"
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="hrt-btn-secondary px-5 py-2 text-body-sm"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              Sign In
            </button>
            {profileOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-neutral-border bg-white py-2 shadow-medium animate-fadeIn"
                role="menu"
              >
                <p className="px-4 pb-2 text-body-xs text-supporting border-b border-neutral-border mb-1">Sign in as a demo user:</p>
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-body-sm text-heading transition-colors hover:bg-surface-subtle flex items-center justify-between"
                    role="menuitem"
                    onClick={() => {
                      setCurrentUser(u.id);
                      setProfileOpen(false);
                      router.push("/");
                    }}
                  >
                    <span className="font-medium">{u.name}</span>
                    <span className="text-body-xs text-supporting">{u.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile: hamburger + avatar */}
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
            className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-md p-2 text-heading hover:bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-heading"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block h-0.5 w-5 rounded bg-current transition-transform duration-hrt ease-hrt ${
                mobileOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-current transition-opacity duration-hrt ease-hrt ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-current transition-transform duration-hrt ease-hrt ${
                mobileOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
          <div
            ref={mobileDrawerRef}
            className="fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] bg-white shadow-strong md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex flex-col gap-1 p-4 pt-14">
              {MOBILE_NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-xl px-4 py-3 text-body-md font-bold transition-colors duration-hrt ease-hrt ${
                    isActive(href)
                      ? "bg-brand-subtle text-brand-strong"
                      : "text-heading hover:bg-surface-subtle"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {defaultUser && (
                <Link
                  href={`/u/${defaultUser.username}`}
                  className={`rounded-xl px-4 py-3 text-body-md font-bold transition-colors ${
                    pathname === `/u/${defaultUser.username}`
                      ? "bg-brand-subtle text-brand-strong"
                      : "text-heading hover:bg-surface-subtle"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  My profile
                </Link>
              )}
              <div className="mt-4 border-t border-neutral-border pt-4">
                <Link href="/create" className="hrt-btn-primary-lg w-full text-center" onClick={() => setMobileOpen(false)}>
                  Start a FundRight
                </Link>
              </div>
              <div className="mt-4 border-t border-neutral-border pt-3">
                <p className="px-4 pb-2 text-body-xs text-supporting">Sign in as:</p>
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className="w-full px-4 py-2 text-left text-body-sm text-heading hover:bg-surface-subtle flex items-center justify-between"
                    onClick={() => {
                      setCurrentUser(u.id);
                      setMobileOpen(false);
                      router.push("/");
                    }}
                  >
                    <span>{u.name}</span>
                    <span className="text-body-xs text-supporting">{u.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
