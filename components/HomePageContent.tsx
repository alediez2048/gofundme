"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { useFundRightStore } from "@/lib/store";
import { BLUR_DATA_URL, formatCurrency } from "@/lib/utils";
import type { CauseCategory } from "@/lib/data";
import type { Fundraiser, User } from "@/lib/data";
import PageTransition from "@/components/PageTransition";
import ProgressBar from "@/components/ProgressBar";
import UserAvatar from "@/components/UserAvatar";

function useCauseCategories(): CauseCategory[] {
  const communitiesMap = useFundRightStore((s) => s.communities);
  const communities = Object.values(communitiesMap);
  const set = new Set<CauseCategory>(communities.map((c) => c.causeCategory));
  return Array.from(set);
}

function TrustBarLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-1 flex-col items-center gap-2 rounded-xl px-3 py-4 text-center transition-colors duration-hrt ease-hrt hover:bg-white/60 sm:flex-row sm:gap-4 sm:text-left"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-white text-brand shadow-soft ring-1 ring-black/5">
        {children}
      </span>
      <span className="text-body-sm font-bold text-heading group-hover:text-brand">{label}</span>
    </Link>
  );
}

function FundraiserCardBlock({
  f,
  organizer,
  sizes,
}: {
  f: Fundraiser;
  organizer: User | undefined;
  sizes: string;
}) {
  return (
    <Link
      href={`/f/${f.slug}`}
      className="hrt-card block overflow-hidden shadow-medium transition-shadow duration-hrt ease-hrt hover:shadow-medium-strong"
    >
      <div className="hrt-card-image relative aspect-[3/2] w-full bg-surface-medium">
        <Image
          src={f.heroImageUrl}
          alt={f.title}
          fill
          className="object-cover"
          sizes={sizes}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-heading-xs text-heading">{f.title}</h3>
        {organizer && (
          <p className="mt-1 text-body-sm text-supporting">By {organizer.name}</p>
        )}
        <div className="mt-3">
          <ProgressBar raised={f.raisedAmount} goal={f.goalAmount} animate={false} />
        </div>
        <p className="mt-2 text-body-sm font-bold text-heading">
          {formatCurrency(f.raisedAmount)}{" "}
          <span className="font-normal text-supporting">raised of {formatCurrency(f.goalAmount)}</span>
        </p>
      </div>
    </Link>
  );
}

function MobileAppMockup({
  featuredFundraiser,
  secondaryFundraiser,
  featuredOrganizer,
  secondaryOrganizer,
}: {
  featuredFundraiser?: Fundraiser;
  secondaryFundraiser?: Fundraiser;
  featuredOrganizer?: User;
  secondaryOrganizer?: User;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[140px] sm:max-w-[150px]">
      <div className="rounded-[2.4rem] border-[7px] border-[#d9d9d9] bg-white p-3 shadow-strong">
        <div className="overflow-hidden rounded-[2rem] bg-white">
          <div className="flex items-center justify-between px-4 pt-3 text-[11px] font-bold text-heading">
            <span>9:41</span>
            <div className="flex items-center gap-1 text-supporting" aria-hidden>
              <span className="h-2 w-2 rounded-full border border-current" />
              <span className="h-2.5 w-3 rounded-[2px] border border-current" />
            </div>
          </div>

          <div className="flex items-center justify-between px-4 pb-3 pt-2">
            <Link
              href="/"
              className="text-[20px] leading-none tracking-tight text-brand"
            >
              fund<span className="font-bold">right</span>
            </Link>
            <div className="flex items-center gap-3 text-supporting" aria-hidden>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                <path d="M10 17a2 2 0 0 0 4 0" />
              </svg>
            </div>
          </div>

          <div className="flex justify-between border-b border-black/5 px-3 pb-2 text-[10px] text-supporting">
            <span className="rounded-full bg-brand-subtle px-3 py-1 font-bold text-brand-strong">
              For You
            </span>
            <span className="px-2 py-1">Following</span>
            <span className="px-2 py-1">Trending</span>
          </div>

          <div className="space-y-3 bg-[#fbfbfb] px-3 py-3">
            <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
              <div className="flex items-center gap-2 px-3 pb-2 pt-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                  W
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold text-heading">
                    Watch Duty community
                  </p>
                  <p className="text-[10px] text-supporting">hit a major milestone</p>
                </div>
                <span className="ml-auto text-[10px] text-supporting">15m</span>
              </div>
              <div className="mx-3 mb-3 rounded-2xl bg-gradient-to-br from-brand to-brand-strong px-4 py-5 text-white">
                <p className="text-[15px] font-bold leading-tight">
                  Community crossed $1,000,000 raised
                </p>
                <p className="mt-1 text-[11px] text-white/85">
                  423 fundraisers · 2,847 members · 12 months
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-black/5 px-3 py-2 text-[10px] text-supporting">
                <span>189</span>
                <span>42</span>
                <span>Share</span>
              </div>
            </div>

            {featuredFundraiser && (
              <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
                <div className="flex items-center gap-2 px-3 pb-2 pt-3">
                  <UserAvatar
                    src={featuredOrganizer?.avatar}
                    name={featuredOrganizer?.name}
                    size={34}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold text-heading">
                      {featuredOrganizer?.name ?? "Organizer"}
                    </p>
                    <p className="text-[10px] text-supporting">started a fundraiser</p>
                  </div>
                  <span className="ml-auto text-[10px] text-supporting">26m</span>
                </div>
                <div className="relative aspect-[4/3] w-full bg-surface-medium">
                  <Image
                    src={featuredFundraiser.heroImageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="280px"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>
                <div className="px-3 pb-3 pt-2">
                  <p className="line-clamp-2 text-[14px] font-bold leading-5 text-heading">
                    {featuredFundraiser.title}
                  </p>
                  <p className="mt-1 text-[11px] text-supporting">
                    by {featuredOrganizer?.name ?? "Organizer"}
                  </p>
                  <p className="mt-2 text-[12px] font-bold text-brand">
                    {formatCurrency(featuredFundraiser.raisedAmount)} raised
                  </p>
                  <div className="mt-2">
                    <ProgressBar
                      raised={featuredFundraiser.raisedAmount}
                      goal={featuredFundraiser.goalAmount}
                      animate={false}
                      height="h-1.5"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-supporting">
                    <span>{featuredOrganizer?.name ?? "Organizer"}</span>
                    <span>of {formatCurrency(featuredFundraiser.goalAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            {secondaryFundraiser && (
              <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
                <div className="flex items-center gap-2 px-3 pb-2 pt-3">
                  <UserAvatar
                    src={secondaryOrganizer?.avatar}
                    name={secondaryOrganizer?.name}
                    size={30}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold text-heading">
                      {secondaryOrganizer?.name ?? "Organizer"}
                    </p>
                    <p className="text-[10px] text-supporting">shared a new update</p>
                  </div>
                </div>
                <div className="px-3 pb-3 text-[11px] leading-4 text-supporting">
                  Follow momentum, post updates, and bring your community along for the journey.
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-black/5 px-4 py-3 text-[10px] text-supporting">
            <div className="flex flex-col items-center gap-1 text-brand-strong">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              <span>Feed</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <span>Communities</span>
            </div>
            <div className="-mt-6 flex h-11 w-11 items-center justify-center rounded-full bg-brand-strong text-brand-lime shadow-medium">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-1">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Explore</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePageContent() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [categoryFilter, setCategoryFilter] = useState<"all" | CauseCategory>("all");

  const fundraisersMap = useFundRightStore((s) => s.fundraisers);
  const communitiesMap = useFundRightStore((s) => s.communities);
  const users = useFundRightStore((s) => s.users);

  const fundraisers = Object.values(fundraisersMap);
  const communities = Object.values(communitiesMap);
  const categories = useCauseCategories();

  const orbitUsers = useMemo(
    () => Object.values(users).slice(0, 8),
    [users]
  );

  const sortedForDiscover = useMemo(() => {
    const filtered =
      categoryFilter === "all"
        ? fundraisers
        : fundraisers.filter((f) => f.causeCategory === categoryFilter);
    return [...filtered].sort((a, b) => b.donationCount - a.donationCount);
  }, [fundraisers, categoryFilter]);

  /** Top fundraisers for discover grid (two per row on sm+). */
  const discoverCards = useMemo(
    () => sortedForDiscover.slice(0, 6),
    [sortedForDiscover]
  );
  const mockupFeaturedFundraiser = discoverCards[0];
  const mockupSecondaryFundraiser = discoverCards[1];

  const totalRaised = fundraisers.reduce((sum, f) => sum + f.raisedAmount, 0);
  const totalDonations = fundraisers.reduce((sum, f) => sum + f.donationCount, 0);
  const activeFundraisers = fundraisers.length;
  const activeCommunities = communities.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInputRef.current?.value?.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <PageTransition>
      <div className="overflow-x-hidden">
        {/* Hero — green band, light CTA, serif headline, avatar halo */}
        <section className="relative -mx-4 rounded-b-3xl bg-gradient-to-b from-brand via-brand to-brand-strong px-4 pb-14 pt-10 text-white sm:-mx-6 sm:mx-0 sm:rounded-3xl sm:px-8 sm:pb-20 sm:pt-14">
          <div className="relative mx-auto max-w-3xl">
            {/* Mobile: overlapping avatar strip */}
            <div className="mb-6 flex justify-center sm:hidden">
              <div className="flex -space-x-3">
                {orbitUsers.slice(0, 6).map((u) => (
                  <UserAvatar
                    key={u.id}
                    src={u.avatar}
                    size={44}
                    className="ring-2 ring-white shadow-soft"
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10 text-center">
              {/* Desktop: distributed avatar row */}
              <div className="mb-8 hidden flex-wrap justify-center gap-4 sm:flex">
                {orbitUsers.map((u) => (
                  <UserAvatar
                    key={u.id}
                    src={u.avatar}
                    size={52}
                    className="ring-[3px] ring-white shadow-medium ring-offset-2 ring-offset-brand"
                  />
                ))}
              </div>
              <p className="text-body-sm font-bold uppercase tracking-wider text-brand-lime">
                Discover the best platform
              </p>
              <h1 className="font-display mt-3 text-display-md text-white sm:text-display-lg">
                Successful fundraisers
                <br />
                start here
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-body-lg text-white/90">
                Discover fundraisers, join communities, and support organizers you can trust.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <Link
                  href="/create"
                  className="inline-flex min-h-[3rem] items-center justify-center rounded-pill bg-white px-10 py-3 text-body-md font-bold text-brand-strong shadow-medium transition-colors duration-hrt ease-hrt hover:bg-brand-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
                >
                  Start a FundRight
                </Link>
              </div>
              <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-lg">
                <div className="flex rounded-pill border border-neutral-border bg-white shadow-soft focus-within:ring-2 focus-within:ring-heading overflow-hidden">
                  <input
                    ref={searchInputRef}
                    type="search"
                    name="q"
                    placeholder="Search fundraisers, communities, people..."
                    className="min-w-0 flex-1 border-0 px-6 py-3 text-heading placeholder-neutral-disabled focus:outline-none focus:ring-0"
                    aria-label="Search"
                  />
                  <button
                    type="submit"
                    className="bg-surface-extra px-5 py-3 font-bold text-heading transition-colors duration-hrt ease-hrt hover:bg-surface-medium"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Sign in to post — visible when logged out */}
        <section className="mx-auto mt-6 max-w-2xl">
          <button
            type="button"
            onClick={() => {
              document.getElementById("sign-in-trigger")?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className="w-full rounded-card border border-black/[0.06] bg-white px-4 py-3 text-left text-sm text-supporting shadow-card transition-colors hover:bg-surface-subtle hover:text-heading"
          >
            Sign in to share what matters
          </button>
        </section>

        {/* Trust bar — warm strip with icon links (GFM pattern) */}
        <section className="mt-0 border-y border-amber-200/40 bg-surface-warm py-2 sm:mt-6 sm:rounded-2xl sm:border">
          <div className="mx-auto flex max-w-content flex-col divide-y divide-amber-200/50 sm:flex-row sm:divide-x sm:divide-y-0">
            <TrustBarLink href="/browse" label="Find fundraisers near you">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </TrustBarLink>
            <TrustBarLink href="/create" label="How to start a FundRight">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden>
                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </TrustBarLink>
            <TrustBarLink href="#why-fundright" label="Why FundRight?">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden>
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </TrustBarLink>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 rounded-xxl bg-surface-subtle py-8 px-4 sm:px-8">
          <dl className="mx-auto flex flex-wrap justify-center gap-8 sm:gap-16">
            <div className="text-center">
              <dd className="text-heading-xl sm:text-display-sm text-heading">
                {formatCurrency(totalRaised)}
              </dd>
              <dt className="mt-1 text-body-sm text-supporting">Total raised</dt>
            </div>
            <div className="text-center">
              <dd className="text-heading-xl sm:text-display-sm text-heading">{totalDonations}</dd>
              <dt className="mt-1 text-body-sm text-supporting">Total donations</dt>
            </div>
            <div className="text-center">
              <dd className="text-heading-xl sm:text-display-sm text-heading">{activeFundraisers}</dd>
              <dt className="mt-1 text-body-sm text-supporting">Active fundraisers</dt>
            </div>
            <div className="text-center">
              <dd className="text-heading-xl sm:text-display-sm text-heading">{activeCommunities}</dd>
              <dt className="mt-1 text-body-sm text-supporting">Active communities</dt>
            </div>
          </dl>
        </section>

        {/* How it works — two columns, phone mock + steps */}
        <section id="how-it-works" className="py-14 sm:py-20 scroll-mt-24">
          <h2 className="text-center font-display text-heading-xl text-heading sm:text-display-sm">
            How FundRight works
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-body-md text-supporting">
            Launch a campaign in minutes and share it with the people who care.
          </p>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="flex justify-center lg:justify-end">
              <MobileAppMockup
                featuredFundraiser={mockupFeaturedFundraiser}
                secondaryFundraiser={mockupSecondaryFundraiser}
                featuredOrganizer={
                  mockupFeaturedFundraiser
                    ? users[mockupFeaturedFundraiser.organizerId]
                    : undefined
                }
                secondaryOrganizer={
                  mockupSecondaryFundraiser
                    ? users[mockupSecondaryFundraiser.organizerId]
                    : undefined
                }
              />
            </div>
            <ol className="mx-auto max-w-md space-y-8 lg:mx-0">
              {[
                {
                  n: "1",
                  title: "Start with the basics",
                  body: "Choose a clear title and a realistic goal. Donors decide in seconds — make it easy to understand who you’re helping and why it matters now.",
                },
                {
                  n: "2",
                  title: "Tell your story with a photo",
                  body: "A real face or moment builds trust. Add a cover image and a heartfelt story so supporters feel connected before they give.",
                },
                {
                  n: "3",
                  title: "Post and share everywhere",
                  body: "Publish your fundraiser and share the link with friends, family, and communities. Every share helps your campaign travel further.",
                },
              ].map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-body-md font-bold text-brand-strong"
                    aria-hidden
                  >
                    {step.n}
                  </span>
                  <div>
                    <h3 className="text-heading-md text-heading">{step.title}</h3>
                    <p className="mt-1 text-body-md text-supporting leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Discover — category filter + 2-column card grid */}
        <section className="py-12 sm:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-heading-xl text-heading sm:text-display-sm">
                Discover fundraisers you’ll love
              </h2>
              <p className="mt-2 text-supporting">
                Inspired by what you care about — filter by category.
              </p>
            </div>
            <label className="flex flex-col gap-1 text-body-xs font-bold text-supporting sm:min-w-[220px]">
              Category
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as "all" | CauseCategory)
                }
                className="rounded-pill border border-neutral-border bg-white px-4 py-2.5 text-body-sm font-bold text-heading shadow-soft focus:border-heading focus:outline-none focus:ring-1 focus:ring-heading"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {discoverCards.length === 0 ? (
            <p className="mt-8 text-center text-supporting">
              No fundraisers in this category yet.{" "}
              <Link href="/create" className="font-bold text-brand hover:underline">
                Start one
              </Link>
            </p>
          ) : (
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {discoverCards.map((f) => (
                <li key={f.id} className="min-w-0">
                  <FundraiserCardBlock
                    f={f}
                    organizer={users[f.organizerId]}
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Active Communities */}
        <section className="py-12 sm:py-16">
          <h2 className="text-heading-xl sm:text-display-sm text-heading">Active communities</h2>
          <p className="mt-2 text-supporting">Causes and communities you can support</p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {communities.slice(0, 4).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/communities/${c.slug}`}
                  className="hrt-card block hover:shadow-medium"
                >
                  <div className="hrt-card-image relative aspect-[21/9] w-full bg-surface-medium">
                    <Image
                      src={c.bannerImageUrl}
                      alt={c.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-heading-sm text-heading">{c.name}</h3>
                    <span className="hrt-tag-brand mt-2">{c.causeCategory}</span>
                    <dl className="mt-3 flex gap-4 text-body-sm">
                      <div>
                        <dt className="text-supporting">Raised</dt>
                        <dd className="font-bold text-heading">{formatCurrency(c.totalRaised)}</dd>
                      </div>
                      <div>
                        <dt className="text-supporting">Fundraisers</dt>
                        <dd className="font-bold text-heading">{c.fundraiserCount}</dd>
                      </div>
                    </dl>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Browse by category chips */}
        <section className="py-12 sm:py-16">
          <h2 className="text-heading-xl sm:text-display-sm text-heading">Browse by category</h2>
          <p className="mt-2 text-supporting">Explore fundraisers by cause</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/browse/${encodeURIComponent(category)}`}
                  className="hrt-btn-secondary px-6 py-2.5 text-body-sm"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Mint band — platform story (GFM light green block) */}
        <section className="rounded-3xl bg-brand-mint px-4 py-14 text-center sm:px-10 sm:py-16">
          <h2 className="font-display text-heading-xl text-brand-strong sm:text-display-sm">
            The giving platform people trust
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-heading/90 leading-relaxed">
            From emergency relief to medical bills, FundRight connects real stories with donors who want
            to help. Communities, verified organizers, and transparent updates keep generosity grounded
            in trust.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/browse" className="font-bold text-brand-strong underline-offset-4 hover:underline">
              Explore fundraisers
            </Link>
            <span className="text-supporting" aria-hidden>
              ·
            </span>
            <Link href="/communities" className="font-bold text-brand-strong underline-offset-4 hover:underline">
              Join a community
            </Link>
          </div>
        </section>

        {/* Tips row — warm cards */}
        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Share your “why”",
              body: "Donors give to people, not abstract causes. Lead with one person or family your campaign helps.",
            },
            {
              title: "Post updates weekly",
              body: "Short updates with photos keep supporters engaged and encourage second gifts.",
            },
            {
              title: "Thank everyone",
              body: "A quick thank-you message makes donors feel great — and more likely to share your link.",
            },
          ].map((tip) => (
            <div
              key={tip.title}
              className="rounded-xxl border border-amber-200/60 bg-surface-warm p-5 shadow-soft"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg" aria-hidden>
                💡
              </div>
              <h3 className="text-heading-xs text-heading">{tip.title}</h3>
              <p className="mt-2 text-body-sm text-supporting leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </section>

        {/* Dark trust section */}
        <section
          id="why-fundright"
          className="mt-14 scroll-mt-24 bg-surface-dark text-white -mx-4 px-4 py-16 sm:-mx-8 sm:rounded-3xl sm:px-8 sm:py-20"
        >
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="font-display text-display-sm sm:text-display-md text-brand-lime">
              Your easy, powerful, and trusted home for help
            </h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-3">
              <div>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-pill bg-brand-lime">
                  <span className="text-xl text-brand-strong" aria-hidden>
                    ✦
                  </span>
                </div>
                <h3 className="text-heading-sm text-white">Easy</h3>
                <p className="mt-3 text-body-md text-gray-300 leading-relaxed">
                  Start your fundraiser in minutes. Our simple setup means you can begin receiving support
                  right away.
                </p>
              </div>
              <div>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-pill bg-brand-lime">
                  <span className="text-xl text-brand-strong" aria-hidden>
                    ⚡
                  </span>
                </div>
                <h3 className="text-heading-sm text-white">Powerful</h3>
                <p className="mt-3 text-body-md text-gray-300 leading-relaxed">
                  Share with communities, reach more donors, and watch your impact grow with built-in tools
                  and insights.
                </p>
              </div>
              <div>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-pill bg-brand-lime">
                  <span className="text-xl text-brand-strong" aria-hidden>
                    🛡
                  </span>
                </div>
                <h3 className="text-heading-sm text-white">Trusted</h3>
                <p className="mt-3 text-body-md text-gray-300 leading-relaxed">
                  Every donation is protected. Our trust and safety team works around the clock to keep your
                  funds secure.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
