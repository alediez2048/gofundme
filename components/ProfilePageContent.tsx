"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemo, useRef, useState, useEffect } from "react";
import { useFundRightStore } from "@/lib/store";
import { communityBanner } from "@/lib/data/fundraising-images";
import { BLUR_DATA_URL, formatCurrency } from "@/lib/utils";
import type { User, Fundraiser, Community, Donation, CauseCategory } from "@/lib/data";
import Breadcrumbs from "./Breadcrumbs";
import PageTransition from "./PageTransition";
import ProgressBar from "./ProgressBar";
import UserAvatar from "./UserAvatar";
import ProfileActivityFeed from "./feed/ProfileActivityFeed";

const CAUSE_SHIELD: Record<
  CauseCategory,
  { shortLabel: string; emoji: string; className: string }
> = {
  "Medical & Healthcare": {
    shortLabel: "Medical",
    emoji: "🏥",
    className: "bg-violet-100 text-violet-900",
  },
  "Disaster Relief & Wildfire Safety": {
    shortLabel: "Safety & environment",
    emoji: "🌲",
    className: "bg-emerald-100 text-emerald-900",
  },
  Education: {
    shortLabel: "Education",
    emoji: "📚",
    className: "bg-blue-100 text-blue-900",
  },
  "Environment & Climate": {
    shortLabel: "Environment",
    emoji: "🌍",
    className: "bg-green-100 text-green-900",
  },
  "Animals & Wildlife": {
    shortLabel: "Animals",
    emoji: "🐾",
    className: "bg-amber-100 text-amber-900",
  },
  "Community & Neighbors": {
    shortLabel: "Community",
    emoji: "🏘️",
    className: "bg-orange-100 text-orange-900",
  },
};

function buildImpactSummary(
  user: User,
  totalRaisedAsOrganizer: number,
  organizerCount: number,
  causesSupportedCount: number
): string {
  const parts: string[] = [];
  if (organizerCount > 0 && totalRaisedAsOrganizer > 0) {
    parts.push(
      `${user.name} has organized ${organizerCount} campaign${organizerCount !== 1 ? "s" : ""} and raised ${formatCurrency(totalRaisedAsOrganizer)} for their communities.`
    );
  }
  if (user.totalDonated > 0) {
    parts.push(
      `As a donor, they've given ${formatCurrency(user.totalDonated)} to support others.`
    );
  }
  if (causesSupportedCount > 0) {
    parts.push(
      `They support ${causesSupportedCount} cause${causesSupportedCount !== 1 ? "s" : ""} across the platform.`
    );
  }
  if (parts.length === 0) {
    return `${user.name} is building their fundraising presence. Support their campaigns or follow to see their impact.`;
  }
  return parts.join(" ");
}

function ProfileWaveDivider() {
  return (
    <svg
      className="absolute bottom-0 left-0 h-14 w-full text-white sm:h-16"
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0,32 C240,8 480,56 720,36 C960,16 1200,48 1440,28 L1440,60 L0,60 Z"
      />
    </svg>
  );
}

function ActivityCarousel({
  user,
  givingHistorySorted,
  fundraisers,
}: {
  user: User;
  givingHistorySorted: Donation[];
  fundraisers: Record<string, Fundraiser>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => ro.disconnect();
  }, [givingHistorySorted.length]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
    setTimeout(checkScroll, 300);
  };

  if (givingHistorySorted.length === 0) {
    return (
      <section>
        <h2 className="text-heading-md text-heading">Recent activity</h2>
        <p className="mt-3 text-body-sm text-supporting">
          No donations yet. Support a campaign to see it here.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-heading-md text-heading">Recent activity</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-border bg-white text-heading shadow-soft transition-colors hover:bg-surface-subtle disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-border bg-white text-heading shadow-soft transition-colors hover:bg-surface-subtle disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="mt-4 flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-thin snap-x snap-mandatory [scrollbar-width:thin]"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {givingHistorySorted.map((d) => {
          const f = fundraisers[d.fundraiserId];
          return (
            <div
              key={d.id}
              className="min-w-[280px] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-xxl border border-neutral-border bg-white shadow-soft"
            >
              <div className="flex gap-3 p-4">
                <UserAvatar src={user.avatar} name={user.name} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm text-heading">
                    <span className="font-bold">{user.name}</span> donated{" "}
                    <span className="font-bold text-brand">{formatCurrency(d.amount)}</span> to a fundraiser
                  </p>
                  <time
                    dateTime={d.createdAt}
                    className="mt-1 block text-body-xs text-supporting"
                  >
                    {new Date(d.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>
              {f && (
                <Link
                  href={`/f/${f.slug}`}
                  className="block border-t border-neutral-border bg-surface-subtle/50"
                >
                  <div className="relative aspect-[21/9] w-full bg-surface-medium">
                    <Image
                      src={f.heroImageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="280px"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-heading line-clamp-2">{f.title}</p>
                    <div className="mt-2">
                      <ProgressBar raised={f.raisedAmount} goal={f.goalAmount} animate={false} />
                    </div>
                    <p className="mt-2 text-body-xs text-supporting">
                      {formatCurrency(f.raisedAmount)} raised of {formatCurrency(f.goalAmount)}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProfileByUsername({ username }: { username: string }) {
  const user = useFundRightStore((s) =>
    Object.values(s.users).find((u) => u.username === username)
  );
  const users = useFundRightStore((s) => s.users);
  const fundraisers = useFundRightStore((s) => s.fundraisers);
  const communities = useFundRightStore((s) => s.communities);
  const donations = useFundRightStore((s) => s.donations);

  const organizerFundraisers = useMemo(() => {
    if (!user) return [] as Fundraiser[];
    return Object.values(fundraisers).filter((f) => f.organizerId === user.id) as Fundraiser[];
  }, [user, fundraisers]);

  const userCommunities = useMemo(() => {
    if (!user) return [] as Community[];
    return (user.communityIds ?? [])
      .map((id) => communities[id])
      .filter(Boolean) as Community[];
  }, [user, communities]);

  const totalRaisedAsOrganizer = organizerFundraisers.reduce(
    (sum, f) => sum + f.raisedAmount,
    0
  );
  const totalSupporters = organizerFundraisers.reduce(
    (sum, f) => sum + f.donationCount,
    0
  );
  const userDonations = (user?.donationIds ?? [])
    .map((id) => donations[id])
    .filter(Boolean) as Donation[];
  const causesSupportedSet = new Set<string>();
  for (const d of userDonations) {
    const f = fundraisers[d.fundraiserId];
    if (f?.communityId) {
      const c = communities[f.communityId];
      if (c?.causeCategory) causesSupportedSet.add(c.causeCategory);
    }
  }
  const causesSupportedCount = causesSupportedSet.size;
  const givingHistorySorted = [...userDonations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const impactSummary = user
    ? buildImpactSummary(
        user,
        totalRaisedAsOrganizer,
        organizerFundraisers.length,
        causesSupportedCount
      )
    : "";

  const topCauses = useMemo(() => {
    const set = new Set<CauseCategory>();
    organizerFundraisers.forEach((f) => set.add(f.causeCategory));
    userCommunities.forEach((c) => set.add(c.causeCategory));
    return Array.from(set);
  }, [organizerFundraisers, userCommunities]);

  const othersYouMayKnow = useMemo(
    () =>
      user
        ? Object.values(users)
            .filter((u) => u.id !== user.id)
            .slice(0, 6)
        : [],
    [users, user]
  );

  if (!user) notFound();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: user.name },
  ];

  return (
    <article className="space-y-10 pb-4">
      <Breadcrumbs items={breadcrumbItems} />

      {/* LinkedIn-style hero: cover photo + overlapping avatar */}
      <section className="overflow-hidden rounded-xxl border border-neutral-border bg-white shadow-soft">
        <div className="relative h-40 sm:h-48 w-full bg-surface-medium">
          <Image
            src={user.coverPhoto ?? communityBanner.mutualAid}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
          <ProfileWaveDivider />
        </div>

        <div className="relative bg-white px-4 pb-8 pt-0 sm:px-8">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-8">
            <div className="relative z-10 -mt-16 shrink-0 sm:-mt-[4.5rem]">
              <UserAvatar
                src={user.avatar}
                name={user.name}
                size={112}
                className="ring-4 ring-white shadow-medium-strong"
              />
            </div>
            <div className="mt-5 min-w-0 flex-1 text-center sm:mt-0 sm:pb-1 sm:text-left">
              <h1 className="text-heading-xl text-heading sm:text-display-sm flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span>{user.name}</span>
                {user.verified && (
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-soft"
                    title="Verified"
                    aria-label="Verified organizer"
                  >
                    ✓
                  </span>
                )}
              </h1>
              {totalSupporters > 0 && (
                <p className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-body-md text-supporting sm:justify-start">
                  <span className="text-brand" aria-hidden>
                    ✦
                  </span>
                  <span>
                    Inspired{" "}
                    <span className="font-bold text-heading">{totalSupporters}</span>{" "}
                    {totalSupporters === 1 ? "person" : "people"} to help
                  </span>
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-body-sm text-supporting sm:justify-start">
                <span>
                  <span className="font-bold text-heading">{totalSupporters}</span>{" "}
                  supporters
                </span>
                <span className="hidden sm:inline" aria-hidden>
                  ·
                </span>
                <span>
                  <span className="font-bold text-heading">{userCommunities.length}</span>{" "}
                  communit{userCommunities.length === 1 ? "y" : "ies"}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <button
                  type="button"
                  className="rounded-pill bg-brand-strong px-6 py-2.5 text-body-sm font-bold text-white shadow-soft transition-colors duration-hrt hover:bg-brand-hover"
                >
                  Follow
                </button>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-border bg-surface-subtle text-heading shadow-soft transition-colors hover:bg-surface-medium"
                  aria-label="More options"
                >
                  <span className="text-lg leading-none">⋯</span>
                </button>
              </div>
            </div>
          </div>

          {user.bio && (
            <p className="mx-auto mt-6 max-w-2xl text-center text-body-md text-supporting sm:mx-0 sm:text-left">
              {user.bio}
            </p>
          )}
          <p className="mt-3 text-center text-body-sm text-supporting sm:text-left">
            Joined{" "}
            {new Date(user.joinDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </section>

      {/* Two-column layout: main + sticky sidebar */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-10">
      {(othersYouMayKnow.length > 0 || topCauses.length > 0 || organizerFundraisers.length > 0) && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {othersYouMayKnow.length > 0 && (
            <div className="rounded-xxl border border-neutral-border bg-surface-subtle px-4 py-5 sm:px-6">
              <p className="text-body-xs font-bold uppercase tracking-wide text-supporting">
                Others you may know
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {othersYouMayKnow.map((u) => (
                  <Link
                    key={u.id}
                    href={`/u/${u.username}`}
                    className="transition-opacity hover:opacity-90"
                    title={u.name}
                  >
                    <UserAvatar src={u.avatar} name={u.name} size={44} className="ring-2 ring-white shadow-soft" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {topCauses.length > 0 && (
            <div className="rounded-xxl border border-neutral-border bg-white px-4 py-5 shadow-soft sm:px-6">
              <h2 className="text-heading-md text-heading">Top causes</h2>
              <p className="mt-1 text-body-sm text-supporting">
                Causes they organize and support on FundRight
              </p>
              <ul className="mt-5 flex flex-wrap gap-4">
                {topCauses.map((cause) => {
                  const v = CAUSE_SHIELD[cause];
                  return (
                    <li key={cause}>
                      <div
                        className={`flex w-[5.5rem] flex-col items-center rounded-2xl px-3 py-4 text-center shadow-soft ${v.className}`}
                      >
                        <span className="text-2xl" aria-hidden>
                          {v.emoji}
                        </span>
                        <span className="mt-2 text-body-xs font-bold leading-tight">{v.shortLabel}</span>
                      </div>
                      <p className="mt-2 max-w-[6.5rem] text-center text-body-xs text-supporting">
                        {cause}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {organizerFundraisers.length > 0 && (
            <div className="rounded-xxl border border-neutral-border bg-white px-4 py-5 shadow-soft sm:px-6">
              <h2 className="text-heading-md text-heading">Highlights</h2>
              <p className="mt-1 text-body-sm text-supporting">Active fundraisers</p>
              <ul className="mt-6 grid grid-cols-1 gap-5">
                {organizerFundraisers.map((f) => (
                  <li key={f.id} className="min-w-0">
                    <Link
                      href={`/f/${f.slug}`}
                      className="group block overflow-hidden rounded-xxl border border-neutral-border bg-white shadow-soft transition-all duration-hrt ease-hrt hover:border-brand/25 hover:shadow-medium"
                    >
                      <div className="relative aspect-[4/3] w-full bg-surface-medium">
                        <Image
                          src={f.heroImageUrl}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-hrt group-hover:scale-[1.02]"
                          sizes="(max-width: 1279px) 100vw, 33vw"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
                        />
                      </div>
                      <div className="p-4 sm:p-5">
                        <p className="line-clamp-2 text-body-md font-bold text-heading">{f.title}</p>
                        <p className="mt-1 text-body-sm font-bold text-brand">
                          {formatCurrency(f.raisedAmount)} raised
                        </p>
                        <div className="mt-3">
                          <ProgressBar raised={f.raisedAmount} goal={f.goalAmount} animate={false} />
                        </div>
                        <p className="mt-2 text-body-xs text-supporting">
                          {formatCurrency(f.raisedAmount)} of {formatCurrency(f.goalAmount)} goal
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Activity-style giving history — carousel on desktop */}
      <ActivityCarousel
        user={user}
        givingHistorySorted={givingHistorySorted}
        fundraisers={fundraisers}
      />

      <ProfileActivityFeed userId={user.id} />
        </div>

        {/* Sticky sidebar: Analytics, About, Communities */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <section className="rounded-xxl border border-neutral-border bg-surface-subtle px-4 py-4">
              <h2 className="text-body-xs font-bold uppercase tracking-wide text-supporting">Analytics</h2>
              <dl className="mt-3 space-y-2">
                <div>
                  <dt className="text-body-xs text-supporting">Total raised</dt>
                  <dd className="text-heading-md font-bold text-heading">{formatCurrency(totalRaisedAsOrganizer)}</dd>
                </div>
                <div>
                  <dt className="text-body-xs text-supporting">Total donated</dt>
                  <dd className="text-heading-md font-bold text-heading">{formatCurrency(user.totalDonated)}</dd>
                </div>
                <div>
                  <dt className="text-body-xs text-supporting">Causes supported</dt>
                  <dd className="text-heading-md font-bold text-heading">{causesSupportedCount}</dd>
                </div>
              </dl>
            </section>
            <section className="rounded-xxl border border-neutral-border bg-surface-subtle px-4 py-4">
              <h2 className="text-body-xs font-bold uppercase tracking-wide text-supporting">About</h2>
              <p className="mt-3 text-body-sm text-heading">{user.bio || "No bio yet."}</p>
              <ul className="mt-3 space-y-1 text-body-sm text-supporting">
                {organizerFundraisers.length > 0 && (
                  <li>Organized {organizerFundraisers.length} campaign{organizerFundraisers.length !== 1 ? "s" : ""} · {formatCurrency(totalRaisedAsOrganizer)} raised</li>
                )}
                {userCommunities.length > 0 && (
                  <li>Member of {userCommunities.length} communit{userCommunities.length !== 1 ? "ies" : "y"}</li>
                )}
                {user.totalDonated > 0 && (
                  <li>Donated {formatCurrency(user.totalDonated)} to other campaigns</li>
                )}
                {organizerFundraisers.length === 0 && userCommunities.length === 0 && user.totalDonated === 0 && (
                  <li>New to FundRight — follow their journey.</li>
                )}
              </ul>
              <p className="mt-3 text-body-xs text-supporting">
                Joined {new Date(user.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </section>
            {userCommunities.length > 0 && (
              <section className="rounded-xxl border border-neutral-border bg-surface-subtle px-4 py-4">
                <h2 className="text-body-xs font-bold uppercase tracking-wide text-supporting">Communities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {userCommunities.map((c) => (
                    <Link
                      key={c.id}
                      href={`/communities/${c.slug}`}
                      className="rounded-pill bg-brand-subtle px-4 py-2 text-body-sm font-bold text-brand-strong ring-1 ring-brand/20 transition-colors hover:bg-brand-lime/40"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>
      </div>

      <section className="rounded-xxl bg-brand-mint/80 border border-brand-subtle px-5 py-5 sm:px-6">
        <h2 className="text-heading-sm text-heading">Impact at a glance</h2>
        <p className="mt-2 text-body-md leading-relaxed text-heading">{impactSummary}</p>
      </section>
    </article>
  );
}

export default function ProfilePageContent({ username }: { username: string }) {
  return (
    <PageTransition>
      <ProfileByUsername username={username} />
    </PageTransition>
  );
}
