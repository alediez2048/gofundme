"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useFundRightStore } from "@/lib/store";
import { BLUR_DATA_URL, formatCurrency } from "@/lib/utils";
import type { CauseCategory } from "@/lib/data";
import PageTransition from "@/components/PageTransition";
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
    <PageTransition>
    <div>
      {/* Hero */}
      <section className="py-16 sm:py-24 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-heading">
          Successful fundraisers
          <br />
          start here
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-secondary">
          Discover fundraisers, join communities, and support organizers you can trust.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/create"
            className="rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-opacity"
          >
            Start a FundRight
          </Link>
        </div>
        <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-lg">
          <div className="flex rounded-full border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary overflow-hidden">
            <input
              ref={searchInputRef}
              type="search"
              name="q"
              placeholder="Search fundraisers, communities, people..."
              className="min-w-0 flex-1 border-0 px-6 py-3 text-heading placeholder-gray-400 focus:outline-none focus:ring-0"
              aria-label="Search"
            />
            <button
              type="submit"
              className="bg-gray-100 px-5 py-3 font-medium text-heading hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Stats ticker row */}
      <section className="py-8 border-y border-gray-200">
        <dl className="mx-auto flex flex-wrap justify-center gap-8 sm:gap-16">
          <div className="text-center">
            <dd className="text-2xl sm:text-3xl font-bold text-heading">
              {formatCurrency(totalRaised)}
            </dd>
            <dt className="mt-1 text-sm font-medium text-secondary">Total raised</dt>
          </div>
          <div className="text-center">
            <dd className="text-2xl sm:text-3xl font-bold text-heading">{totalDonations}</dd>
            <dt className="mt-1 text-sm font-medium text-secondary">Total donations</dt>
          </div>
          <div className="text-center">
            <dd className="text-2xl sm:text-3xl font-bold text-heading">{activeFundraisers}</dd>
            <dt className="mt-1 text-sm font-medium text-secondary">Active fundraisers</dt>
          </div>
          <div className="text-center">
            <dd className="text-2xl sm:text-3xl font-bold text-heading">{activeCommunities}</dd>
            <dt className="mt-1 text-sm font-medium text-secondary">Active communities</dt>
          </div>
        </dl>
      </section>

      {/* Discover Fundraisers */}
      <section className="py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-heading">
          Discover fundraisers inspired by what you care about
        </h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trendingFundraisers.map((f) => {
            const organizer = users[f.organizerId];
            return (
              <li key={f.id}>
                <Link
                  href={`/f/${f.slug}`}
                  className="block overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors hover:border-primary/30 focus-visible:outline-offset-4"
                >
                  <div className="relative aspect-[16/10] w-full bg-gray-200">
                    <Image
                      src={f.heroImageUrl}
                      alt={f.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-heading line-clamp-2">{f.title}</h3>
                    {organizer && (
                      <p className="mt-1 text-sm text-secondary">By {organizer.name}</p>
                    )}
                    <div className="mt-3">
                      <ProgressBar raised={f.raisedAmount} goal={f.goalAmount} height="h-2" animate={false} />
                    </div>
                    <p className="mt-2 text-sm font-medium text-heading">
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
      <section className="py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-heading">Active Communities</h2>
        <p className="mt-2 text-secondary">
          Causes and communities you can support
        </p>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {communities.map((c) => (
            <li key={c.id}>
              <Link
                href={`/communities/${c.slug}`}
                className="block overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors hover:border-primary/30 focus-visible:outline-offset-4"
              >
                <div className="relative aspect-[21/9] w-full bg-gray-200">
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
                  <h3 className="font-semibold text-heading">{c.name}</h3>
                  <span className="mt-1 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-heading">
                    {c.causeCategory}
                  </span>
                  <dl className="mt-3 flex gap-4 text-sm">
                    <div>
                      <dt className="text-secondary">Raised</dt>
                      <dd className="font-semibold text-heading">
                        {formatCurrency(c.totalRaised)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-secondary">Fundraisers</dt>
                      <dd className="font-semibold text-heading">{c.fundraiserCount}</dd>
                    </div>
                  </dl>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Browse by Category */}
      <section className="py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-heading">Browse by Category</h2>
        <p className="mt-2 text-secondary">
          Explore fundraisers by cause
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <li key={category}>
              <Link
                href={`/browse/${encodeURIComponent(category)}`}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-heading shadow-sm transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-offset-4"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Dark trust section */}
      <section className="bg-[#1a1a1a] text-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 mt-12">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Your easy, powerful, and trusted home for help
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            <div>
              <h3 className="text-xl font-bold text-primary">Easy</h3>
              <p className="mt-3 text-gray-300 leading-relaxed">
                Start your fundraiser in minutes. Our simple setup means you can begin receiving support right away.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">Powerful</h3>
              <p className="mt-3 text-gray-300 leading-relaxed">
                Share with communities, reach more donors, and watch your impact grow with built-in tools and insights.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">Trusted</h3>
              <p className="mt-3 text-gray-300 leading-relaxed">
                Every donation is protected. Our trust and safety team works around the clock to keep your funds secure.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </PageTransition>
  );
}
