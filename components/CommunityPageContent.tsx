"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useFundRightStore } from "@/lib/store";
import { BLUR_DATA_URL, calculateProgress, formatCurrency } from "@/lib/utils";
import type { Fundraiser, User } from "@/lib/data";
import type { CauseSummaryResult } from "@/lib/ai/cause-intelligence";
import { keywordFilter } from "@/lib/ai/community-discovery";
import type { RankedFundraiser } from "@/lib/ai/community-discovery";
import Breadcrumbs from "./Breadcrumbs";
import PageTransition from "./PageTransition";
import ProgressBar from "./ProgressBar";
import UserAvatar from "./UserAvatar";

function FundraiserCard({ f, organizer, explanation }: { f: Fundraiser; organizer: User | undefined; explanation?: string }) {
  return (
    <div className="hrt-card hover:shadow-medium">
      <Link href={`/f/${f.slug}`} className="block">
        <div className="hrt-card-image relative aspect-[3/2] w-full bg-surface-medium">
          <Image
            src={f.heroImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </div>
        <div className="p-4">
          <h3 className="text-heading-xs text-heading line-clamp-2">{f.title}</h3>
        </div>
      </Link>
      <div className="px-4 pb-4">
        {organizer && (
          <p className="mt-1 text-body-sm text-supporting">
            By{" "}
            <Link
              href={`/u/${organizer.username}`}
              className="font-bold text-heading hover:text-brand transition-colors"
            >
              {organizer.name}
            </Link>
          </p>
        )}
        <div className="mt-3">
          <ProgressBar raised={f.raisedAmount} goal={f.goalAmount} animate={false} />
        </div>
        <p className="mt-2 text-body-sm font-bold text-heading">
          {formatCurrency(f.raisedAmount)}{" "}
          <span className="font-normal text-supporting">raised</span>
        </p>
        {explanation && (
          <p className="mt-2 text-body-xs text-brand italic">{explanation}</p>
        )}
      </div>
    </div>
  );
}

type SortOption = "popular" | "closest" | "most-funded" | "just-launched";

function FundraiserSearch({
  fundraisers,
  users: usersMap,
}: {
  fundraisers: Fundraiser[];
  users: Record<string, User>;
}) {
  const [query, setQuery] = useState("");
  const [smartSearch, setSmartSearch] = useState(false);
  const [sort, setSort] = useState<SortOption>("popular");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRanked, setAiRanked] = useState<RankedFundraiser[] | null>(null);

  const handleSmartSearch = useCallback(async () => {
    if (!query.trim() || !smartSearch) return;
    setAiLoading(true);
    setAiRanked(null);
    try {
      const res = await fetch("/api/ai/community-discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), fundraisers }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ranked && data.ranked.length > 0) {
          setAiRanked(data.ranked);
        }
      }
    } catch {
      // fall back to keyword
    } finally {
      setAiLoading(false);
    }
  }, [query, smartSearch, fundraisers]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (smartSearch) handleSmartSearch();
    }
  };

  const aiFilteredFundraisers = useMemo(() => {
    if (!aiRanked || aiRanked.length === 0) return null;
    const idOrder = aiRanked.map((r) => r.fundraiserId);
    const explanationMap = new Map(aiRanked.map((r) => [r.fundraiserId, r.explanation]));
    const result = idOrder
      .map((id) => fundraisers.find((f) => f.id === id))
      .filter(Boolean) as Fundraiser[];
    return { fundraisers: result, explanationMap };
  }, [aiRanked, fundraisers]);

  const filteredFundraisers = useMemo(() => {
    let list = query.trim() ? keywordFilter(query, fundraisers) : [...fundraisers];

    switch (sort) {
      case "closest":
        list.sort((a, b) => {
          const pctA = a.goalAmount > 0 ? a.raisedAmount / a.goalAmount : 0;
          const pctB = b.goalAmount > 0 ? b.raisedAmount / b.goalAmount : 0;
          return pctB - pctA;
        });
        break;
      case "most-funded":
        list.sort((a, b) => b.raisedAmount - a.raisedAmount);
        break;
      case "just-launched":
        list.sort((a, b) => a.donationCount - b.donationCount);
        break;
      default:
        list.sort((a, b) => b.donationCount - a.donationCount);
    }

    return list;
  }, [query, fundraisers, sort]);

  const displayList = aiFilteredFundraisers?.fundraisers ?? filteredFundraisers;
  const explanationMap = aiFilteredFundraisers?.explanationMap;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setAiRanked(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              smartSearch
                ? "Describe what you're looking for..."
                : "Filter by keyword..."
            }
            className="block w-full rounded-pill border border-neutral-border px-5 py-2.5 pr-10 text-body-sm text-heading focus:border-heading focus:ring-1 focus:ring-heading"
          />
          {aiLoading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-body-xs text-neutral-disabled animate-pulse">
              Searching...
            </span>
          )}
        </div>

        {!smartSearch && (
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-pill border border-neutral-border px-4 py-2.5 text-body-sm text-heading focus:border-heading focus:ring-1 focus:ring-heading"
          >
            <option value="popular">Most Popular</option>
            <option value="closest">Closest to Goal</option>
            <option value="most-funded">Most Funded</option>
            <option value="just-launched">Just Launched</option>
          </select>
        )}

        <button
          type="button"
          onClick={() => {
            setSmartSearch(!smartSearch);
            setAiRanked(null);
          }}
          className={`flex items-center gap-1.5 rounded-pill px-4 py-2.5 text-body-xs font-bold transition-all duration-hrt ease-hrt ${
            smartSearch
              ? "bg-brand-strong text-brand-lime"
              : "bg-surface-extra text-supporting hover:bg-surface-medium"
          }`}
          title="AI-powered natural language search"
        >
          <span aria-hidden="true">&#x2728;</span>
          Smart Search
        </button>

        {smartSearch && query.trim() && (
          <button
            type="button"
            onClick={handleSmartSearch}
            disabled={aiLoading}
            className="hrt-btn-primary-sm px-4 disabled:opacity-50"
          >
            Search
          </button>
        )}
      </div>

      {aiFilteredFundraisers && (
        <p className="mb-3 text-body-xs text-supporting italic">
          AI-ranked results for &ldquo;{query}&rdquo;
        </p>
      )}

      {displayList.length === 0 ? (
        <div className="rounded-xxl border border-dashed border-neutral-border bg-surface-subtle py-8 text-center">
          <p className="text-supporting">No fundraisers match your search.</p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayList.map((f) => (
            <li key={f.id}>
              <FundraiserCard
                f={f}
                organizer={usersMap[f.organizerId]}
                explanation={explanationMap?.get(f.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FAQAccordion({ faq }: { faq: { id: string; question: string; answer: string }[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      {faq.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-neutral-border bg-white overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left font-bold text-heading transition-colors duration-hrt ease-hrt hover:bg-surface-subtle"
            aria-expanded={openId === item.id}
            aria-label={`${openId === item.id ? "Collapse" : "Expand"}: ${item.question}`}
          >
            {item.question}
            <span className="text-neutral-disabled shrink-0 ml-2" aria-hidden="true">
              {openId === item.id ? "\u2212" : "+"}
            </span>
          </button>
          {openId === item.id && (
            <div className="px-4 pb-4 text-supporting text-body-sm border-t border-surface-medium">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

type Tab = "activity" | "fundraisers" | "about";

interface CommunityBySlugProps {
  slug: string;
  causeSummary: CauseSummaryResult;
  fundraiserCount: number;
}

function CommunityBySlug({ slug, causeSummary, fundraiserCount }: CommunityBySlugProps) {
  const community = useFundRightStore((s) =>
    Object.values(s.communities).find((c) => c.slug === slug)
  );
  const users = useFundRightStore((s) => s.users);
  const fundraisers = useFundRightStore((s) => s.fundraisers);
  const donations = useFundRightStore((s) => s.donations);

  const [activeTab, setActiveTab] = useState<Tab>("fundraisers");

  if (!community) notFound();

  const communityFundraisers = (community.fundraiserIds ?? [])
    .map((id) => fundraisers[id])
    .filter(Boolean) as Fundraiser[];
  const sortedFundraisers = [...communityFundraisers].sort(
    (a, b) => b.donationCount - a.donationCount
  );
  const members = (community.memberIds ?? [])
    .map((id) => users[id])
    .filter(Boolean) as User[];
  const displayMembers = members.slice(0, 8);
  const overflowCount = members.length - 8;
  const faqList = community.faq ?? [];

  const pctOf = (f: Fundraiser) => calculateProgress(f.raisedAmount, f.goalAmount);

  const mostMomentum = sortedFundraisers[0] ?? null;
  const closestToGoal = [...sortedFundraisers].sort((a, b) => pctOf(b) - pctOf(a))[0] ?? null;
  const mostUrgent = [...sortedFundraisers].sort((a, b) => pctOf(a) - pctOf(b))[0] ?? null;

  const seen = new Set<string>();
  const featured: { label: string; tagClass: string; item: Fundraiser; detail: string }[] = [];
  if (mostUrgent && !seen.has(mostUrgent.id)) {
    seen.add(mostUrgent.id);
    featured.push({
      label: "Most urgent",
      tagClass: "hrt-tag-warning",
      item: mostUrgent,
      detail: `${pctOf(mostUrgent)}% to goal`,
    });
  }
  if (mostMomentum && !seen.has(mostMomentum.id)) {
    seen.add(mostMomentum.id);
    featured.push({
      label: "Most momentum",
      tagClass: "hrt-tag-positive",
      item: mostMomentum,
      detail: `${mostMomentum.donationCount} donations`,
    });
  }
  if (closestToGoal && !seen.has(closestToGoal.id)) {
    seen.add(closestToGoal.id);
    featured.push({
      label: "Closest to goal",
      tagClass: "hrt-tag-neutral",
      item: closestToGoal,
      detail: `${formatCurrency(closestToGoal.goalAmount - closestToGoal.raisedAmount)} to go`,
    });
  }

  const communityFundraiserIds = new Set(communityFundraisers.map((f) => f.id));
  const recentDonations = useMemo(() => {
    return Object.values(donations)
      .filter((d) => communityFundraiserIds.has(d.fundraiserId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donations, communityFundraisers.length]);

  const topDonors = useMemo(() => {
    const donorTotals = new Map<string, number>();
    Object.values(donations)
      .filter((d) => communityFundraiserIds.has(d.fundraiserId))
      .forEach((d) => {
        donorTotals.set(d.donorId, (donorTotals.get(d.donorId) ?? 0) + d.amount);
      });
    return Array.from(donorTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, total]) => ({ user: users[id], total }))
      .filter((e) => e.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donations, communityFundraisers.length, users]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Communities", href: "/communities" },
    { label: community.name },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: "activity", label: "Activity" },
    { key: "fundraisers", label: "Fundraisers" },
    { key: "about", label: "About" },
  ];

  return (
    <article className="space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      {/* HEADER */}
      <section className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
        <div className="flex-1 min-w-0">
          <h1 className="text-heading-xl sm:text-display-sm text-heading">
            {community.name}
          </h1>
          <span className="hrt-tag-brand mt-2">
            {community.causeCategory}
          </span>
          <p className="mt-3 text-body-md text-supporting leading-relaxed">{community.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-6">
            <div>
              <span className="text-heading-lg sm:text-heading-xl text-brand">
                {formatCurrency(community.totalRaised)}
              </span>
              <span className="ml-1 text-body-sm text-supporting">raised</span>
            </div>
            <div>
              <span className="text-heading-lg sm:text-heading-xl text-heading">
                {community.donationCount}
              </span>
              <span className="ml-1 text-body-sm text-supporting">donations</span>
            </div>
            <div>
              <span className="text-heading-lg sm:text-heading-xl text-heading">
                {community.fundraiserCount}
              </span>
              <span className="ml-1 text-body-sm text-supporting">fundraisers</span>
            </div>
          </div>

          <Link
            href="/create"
            className="hrt-btn-special mt-6 inline-block px-6 py-3"
          >
            Start a FundRight
          </Link>
        </div>

        <div className="w-full md:w-[420px] shrink-0">
          <div className="hrt-card-image relative aspect-[16/10] w-full bg-surface-medium">
            <Image
              src={community.bannerImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 420px"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
        </div>
      </section>

      {/* TOP DONORS */}
      {topDonors.length > 0 && (
        <section className="rounded-xxl border border-neutral-border bg-white p-5">
          <h2 className="text-heading-md text-heading mb-4">Top donors</h2>
          <ol className="space-y-3">
            {topDonors.map((entry, i) => (
              <li key={entry.user!.id} className="flex items-center gap-3">
                <span className="w-6 text-center text-body-sm font-bold text-supporting">{i + 1}</span>
                <UserAvatar src={entry.user!.avatar} size={32} />
                <Link
                  href={`/u/${entry.user!.username}`}
                  className="text-body-sm font-bold text-heading hover:text-brand transition-colors flex-1 min-w-0 truncate"
                >
                  {entry.user!.name}
                </Link>
                <span className="text-body-sm font-bold text-brand">
                  {formatCurrency(entry.total)}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* TABS */}
      <div>
        <div className="flex border-b border-neutral-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-body-sm font-bold transition-colors duration-hrt ease-hrt relative ${
                activeTab === tab.key
                  ? "text-heading"
                  : "text-supporting hover:text-heading"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand rounded-pill" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === "activity" && (
            <section className="space-y-4">
              {recentDonations.length === 0 ? (
                <div className="rounded-xxl border border-dashed border-neutral-border bg-surface-subtle py-12 text-center">
                  <p className="text-supporting">No activity yet in this community.</p>
                </div>
              ) : (
                <ul className="divide-y divide-surface-medium">
                  {recentDonations.map((d) => {
                    const donor = users[d.donorId];
                    const fundraiser = fundraisers[d.fundraiserId];
                    if (!donor || !fundraiser) return null;
                    const timeAgo = formatTimeAgo(d.createdAt);
                    return (
                      <li key={d.id} className="flex items-start gap-3 py-4">
                        <UserAvatar src={donor.avatar} size={36} />
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm text-heading">
                            <Link href={`/u/${donor.username}`} className="font-bold hover:text-brand transition-colors">
                              {donor.name}
                            </Link>
                            {" donated "}
                            <span className="font-bold text-brand">{formatCurrency(d.amount)}</span>
                            {" to "}
                            <Link href={`/f/${fundraiser.slug}`} className="font-bold hover:text-brand transition-colors">
                              {fundraiser.title}
                            </Link>
                          </p>
                          {d.message && (
                            <p className="mt-1 text-body-sm text-supporting italic">&ldquo;{d.message}&rdquo;</p>
                          )}
                          <p className="mt-1 text-body-xs text-neutral-disabled">{timeAgo}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}

          {activeTab === "fundraisers" && (
            <section className="space-y-8">
              {featured.length > 0 && (
                <div>
                  <h2 className="text-heading-md text-heading mb-4">
                    Find a campaign to support
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {featured.map((f) => (
                      <div key={f.item.id} className="rounded-xl border border-neutral-border bg-white p-4">
                        <span className={`${f.tagClass} text-body-xs uppercase tracking-wide`}>
                          {f.label}
                        </span>
                        <Link
                          href={`/f/${f.item.slug}`}
                          className="mt-2 font-bold text-heading hover:text-brand transition-colors block"
                        >
                          {f.item.title}
                        </Link>
                        <p className="text-body-sm text-supporting mt-1">{f.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-heading-md text-heading mb-4">
                  Active fundraisers
                </h2>
                {sortedFundraisers.length === 0 ? (
                  <div className="rounded-xxl border border-dashed border-neutral-border bg-surface-subtle py-12 text-center">
                    <p className="text-heading-sm text-heading">No fundraisers yet.</p>
                    <p className="mt-2 text-supporting">Be the first to start one!</p>
                    <Link
                      href="/create"
                      className="hrt-btn-special mt-4 inline-block px-6 py-3"
                    >
                      Start a FundRight
                    </Link>
                  </div>
                ) : (
                  <FundraiserSearch fundraisers={sortedFundraisers} users={users} />
                )}
              </div>
            </section>
          )}

          {activeTab === "about" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-heading-md text-heading mb-3">
                  About this cause
                </h2>
                <div className="text-body-md text-heading mb-2 whitespace-pre-line leading-relaxed">{causeSummary.text}</div>
                {causeSummary.isAiGenerated && (
                  <p className="text-body-sm text-supporting mb-2">
                    <span className="italic">AI-generated summary</span>
                    {fundraiserCount > 0 && (
                      <> &middot; Based on {fundraiserCount} active fundraiser{fundraiserCount !== 1 ? "s" : ""} in this community</>
                    )}
                  </p>
                )}
                <div className="rounded-xl bg-surface-subtle p-4 space-y-2 text-body-sm text-heading">
                  <p><strong>How can I help?</strong> Donate to any campaign below, start a fundraiser, or share this community with others.</p>
                  <p><strong>Where does the money go?</strong> Directly to the campaigns you choose. Organizers post updates so you can see impact.</p>
                </div>
              </div>

              {faqList.length > 0 && (
                <div>
                  <h2 className="text-heading-md text-heading mb-4">
                    Frequently asked questions
                  </h2>
                  <FAQAccordion faq={faqList} />
                </div>
              )}

              {displayMembers.length > 0 && (
                <div>
                  <h2 className="text-heading-md text-heading mb-4">
                    Community members
                  </h2>
                  <ul className="flex flex-wrap gap-4 items-center">
                    {displayMembers.map((u) => (
                      <li key={u.id}>
                        <Link
                          href={`/u/${u.username}`}
                          className="flex items-center gap-2 text-heading hover:text-brand transition-colors"
                        >
                          <UserAvatar src={u.avatar} size={40} />
                          <span className="text-body-sm font-bold">{u.name}</span>
                        </Link>
                      </li>
                    ))}
                    {overflowCount > 0 && (
                      <li className="text-body-sm text-supporting">
                        +{overflowCount} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </article>
  );
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

interface CommunityPageContentProps {
  slug: string;
  causeSummary: CauseSummaryResult;
  fundraiserCount: number;
}

export default function CommunityPageContent({
  slug,
  causeSummary,
  fundraiserCount,
}: CommunityPageContentProps) {
  return (
    <PageTransition>
      <CommunityBySlug
        slug={slug}
        causeSummary={causeSummary}
        fundraiserCount={fundraiserCount}
      />
    </PageTransition>
  );
}
