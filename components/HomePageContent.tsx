"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useFundRightStore } from "@/lib/store";
import { BLUR_DATA_URL, formatCurrency } from "@/lib/utils";
import type { CauseCategory } from "@/lib/data";
import ProgressBar from "@/components/ProgressBar";

/** Unique cause categories present in seed/store (for Browse by Category). */
function useCauseCategories(): CauseCategory[] {
  const communitiesMap = useFundRightStore((s) => s.communities);
  const communities = Object.values(communitiesMap);
  const set = new Set<CauseCategory>(communities.map((c) => c.causeCategory));
  return Array.from(set);
}

export default function HomePageContent() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fundraisersMap = useFundRightStore((s) => s.fundraisers);
  const communitiesMap = useFundRightStore((s) => s.communities);
  const users = useFundRightStore((s) => s.users);

  const fundraisers = Object.values(fundraisersMap);
  const communities = Object.values(communitiesMap);

  const categories = useCauseCategories();

  const totalRaised = fundraisers.reduce((sum, f) => sum + f.raisedAmount, 0);
  const totalDonations = fundraisers.reduce((sum, f) => sum + f.donationCount, 0);
  const activeFundraisers = fundraisers.length;
  const activeCommunities = communities.length;

  const trendingFundraisers = [...fundraisers]
    .sort((a, b) => b.donationCount - a.donationCount)
    .slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInputRef.current?.value?.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Find causes that matter. Give with confidence.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-stone-600">
          Discover fundraisers, join communities, and support organizers you can trust.
        </p>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/create"
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Start a FundRight
          </Link>
        </div>
        <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-md">
          <div className="flex rounded-lg border border-stone-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
            <input
              ref={searchInputRef}
              type="search"
              name="q"
              placeholder="Search fundraisers, communities, people..."
              className="min-w-0 flex-1 rounded-l-lg border-0 px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-0"
              aria-label="Search"
            />
            <button
              type="submit"
              className="rounded-r-lg bg-stone-100 px-4 py-3 font-medium text-stone-700 hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Platform stats */}
      <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          <div>
            <dt className="text-sm font-medium text-stone-500">Total raised</dt>
            <dd className="mt-1 text-2xl font-bold text-stone-900">
              {formatCurrency(totalRaised)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500">Total donations</dt>
            <dd className="mt-1 text-2xl font-bold text-stone-900">{totalDonations}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500">Active fundraisers</dt>
            <dd className="mt-1 text-2xl font-bold text-stone-900">{activeFundraisers}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500">Active communities</dt>
            <dd className="mt-1 text-2xl font-bold text-stone-900">{activeCommunities}</dd>
          </div>
        </dl>
      </section>

      {/* Trending Fundraisers */}
      <section>
        <h2 className="text-2xl font-bold text-stone-900">Trending Fundraisers</h2>
        <p className="mt-1 text-stone-600">
          Top campaigns by donor support
        </p>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trendingFundraisers.map((f) => {
            const organizer = users[f.organizerId];
            return (
              <li key={f.id}>
                <Link
                  href={`/f/${f.slug}`}
                  className="block overflow-hidden rounded-xl border border-stone-200 bg-white transition-colors hover:border-primary/30"
                >
                  <div className="relative aspect-[16/10] w-full bg-stone-200">
                    <Image
                      src={f.heroImageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-stone-900 line-clamp-2">{f.title}</h3>
                    {organizer && (
                      <p className="mt-1 text-sm text-stone-600">By {organizer.name}</p>
                    )}
                    <div className="mt-3">
                      <ProgressBar raised={f.raisedAmount} goal={f.goalAmount} height="h-2" animate={false} />
                    </div>
                    <p className="mt-2 text-sm font-medium text-stone-700">
                      {formatCurrency(f.raisedAmount)} of {formatCurrency(f.goalAmount)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Active Communities */}
      <section>
        <h2 className="text-2xl font-bold text-stone-900">Active Communities</h2>
        <p className="mt-1 text-stone-600">
          Causes and communities you can support
        </p>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {communities.map((c) => (
            <li key={c.id}>
              <Link
                href={`/communities/${c.slug}`}
                className="block overflow-hidden rounded-xl border border-stone-200 bg-white transition-colors hover:border-primary/30"
              >
                <div className="relative aspect-[21/9] w-full bg-stone-200">
                  <Image
                    src={c.bannerImageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-stone-900">{c.name}</h3>
                  <span className="mt-1 inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700">
                    {c.causeCategory}
                  </span>
                  <dl className="mt-3 flex gap-4 text-sm">
                    <div>
                      <dt className="text-stone-500">Raised</dt>
                      <dd className="font-semibold text-stone-900">
                        {formatCurrency(c.totalRaised)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-stone-500">Fundraisers</dt>
                      <dd className="font-semibold text-stone-900">{c.fundraiserCount}</dd>
                    </div>
                  </dl>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Browse by Category */}
      <section>
        <h2 className="text-2xl font-bold text-stone-900">Browse by Category</h2>
        <p className="mt-1 text-stone-600">
          Explore fundraisers by cause
        </p>
        <ul className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <li key={category}>
              <Link
                href={`/browse/${encodeURIComponent(category)}`}
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:border-primary/50 hover:text-primary"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
