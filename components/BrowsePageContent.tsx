"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useFundRightStore } from "@/lib/store";
import { BLUR_DATA_URL, formatCurrency } from "@/lib/utils";
import type { CauseCategory, Fundraiser, User } from "@/lib/data";
import Breadcrumbs from "./Breadcrumbs";
import ProgressBar from "./ProgressBar";

type SortKey = "recent" | "most-funded" | "closest-to-goal" | "just-launched";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Most Recent" },
  { value: "most-funded", label: "Most Funded" },
  { value: "closest-to-goal", label: "Closest to Goal" },
  { value: "just-launched", label: "Just Launched" },
];

function sortFundraisers(list: Fundraiser[], key: SortKey): Fundraiser[] {
  const sorted = [...list];
  switch (key) {
    case "recent":
      return sorted.sort((a, b) => b.donationCount - a.donationCount);
    case "most-funded":
      return sorted.sort((a, b) => b.raisedAmount - a.raisedAmount);
    case "closest-to-goal": {
      return sorted.sort((a, b) => {
        const pctA = a.goalAmount > 0 ? a.raisedAmount / a.goalAmount : 0;
        const pctB = b.goalAmount > 0 ? b.raisedAmount / b.goalAmount : 0;
        return pctB - pctA;
      });
    }
    case "just-launched":
      return sorted.sort((a, b) => a.donationCount - b.donationCount);
    default:
      return sorted;
  }
}

function FundraiserCard({
  f,
  organizer,
  community,
}: {
  f: Fundraiser;
  organizer: User | undefined;
  community: { slug: string; name: string } | undefined;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white transition-colors hover:border-primary/30">
      <Link href={`/f/${f.slug}`} className="block">
        <div className="relative aspect-[16/10] w-full bg-stone-200">
          <Image
            src={f.heroImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-stone-900 line-clamp-2">{f.title}</h3>
        </div>
      </Link>
      <div className="px-4 pb-4">
        {organizer && (
          <p className="text-sm text-stone-600">
            By{" "}
            <Link
              href={`/u/${organizer.username}`}
              className="font-medium text-stone-700 hover:text-primary"
            >
              {organizer.name}
            </Link>
          </p>
        )}
        {community && (
          <p className="mt-1">
            <Link
              href={`/communities/${community.slug}`}
              className="inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 hover:text-primary"
            >
              {community.name}
            </Link>
          </p>
        )}
        <div className="mt-3">
          <ProgressBar raised={f.raisedAmount} goal={f.goalAmount} height="h-2" animate={false} />
        </div>
        <p className="mt-2 text-sm font-medium text-stone-700">
          {formatCurrency(f.raisedAmount)} of {formatCurrency(f.goalAmount)}
        </p>
      </div>
    </div>
  );
}

interface BrowsePageContentProps {
  activeCategory?: string;
}

export default function BrowsePageContent({ activeCategory }: BrowsePageContentProps) {
  const fundraisersMap = useFundRightStore((s) => s.fundraisers);
  const communitiesMap = useFundRightStore((s) => s.communities);
  const usersMap = useFundRightStore((s) => s.users);

  const [sortKey, setSortKey] = useState<SortKey>("recent");

  const allFundraisers = useMemo(() => Object.values(fundraisersMap), [fundraisersMap]);
  const communities = useMemo(() => Object.values(communitiesMap), [communitiesMap]);

  const categories = useMemo(() => {
    const set = new Set<CauseCategory>();
    for (const c of communities) set.add(c.causeCategory);
    for (const f of allFundraisers) if (f.causeCategory) set.add(f.causeCategory);
    return Array.from(set);
  }, [communities, allFundraisers]);

  const decodedCategory = activeCategory ? decodeURIComponent(activeCategory) : undefined;

  const filtered = useMemo(() => {
    if (!decodedCategory) return allFundraisers;
    return allFundraisers.filter((f) => f.causeCategory === decodedCategory);
  }, [allFundraisers, decodedCategory]);

  const sorted = useMemo(() => sortFundraisers(filtered, sortKey), [filtered, sortKey]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Browse", href: decodedCategory ? "/browse" : undefined },
    ...(decodedCategory ? [{ label: decodedCategory }] : []),
  ];

  const heading = decodedCategory
    ? `${sorted.length} fundraiser${sorted.length !== 1 ? "s" : ""} in ${decodedCategory}`
    : `${sorted.length} fundraiser${sorted.length !== 1 ? "s" : ""}`;

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
          Browse Fundraisers
        </h1>
        <p className="mt-2 text-stone-600">
          Explore fundraisers by cause and find campaigns aligned with your interests.
        </p>
      </div>

      {/* Category chip bar */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-2 min-w-max pb-2">
          <Link
            href="/browse"
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-offset-4 ${
              !decodedCategory
                ? "bg-primary text-primary-foreground"
                : "border border-stone-200 bg-white text-stone-700 hover:border-primary/50 hover:text-primary"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/browse/${encodeURIComponent(cat)}`}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-offset-4 ${
                decodedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "border border-stone-200 bg-white text-stone-700 hover:border-primary/50 hover:text-primary"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Sort + results count */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-sm font-medium text-stone-700">{heading}</h2>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Sort fundraisers"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Fundraiser grid or empty state */}
      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 py-16 text-center">
          <p className="text-lg font-semibold text-stone-700">
            No fundraisers in this category yet.
          </p>
          <p className="mt-2 text-stone-500">Be the first!</p>
          <Link
            href="/create"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
          >
            Start a FundRight
          </Link>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((f) => {
            const organizer = usersMap[f.organizerId];
            const comm = communitiesMap[f.communityId];
            return (
              <li key={f.id}>
                <FundraiserCard
                  f={f}
                  organizer={organizer}
                  community={comm ? { slug: comm.slug, name: comm.name } : undefined}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
