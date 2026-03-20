"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { useFundRightStore } from "@/lib/store";
import { BLUR_DATA_URL, formatCurrency } from "@/lib/utils";
import type { Community, Fundraiser, User } from "@/lib/data";
import Breadcrumbs from "./Breadcrumbs";
import PageTransition from "./PageTransition";
import ProgressBar from "./ProgressBar";
import UserAvatar from "./UserAvatar";

const MAX_PER_GROUP = 5;

function fuzzyMatch(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";

  const fundraisersMap = useFundRightStore((s) => s.fundraisers);
  const communitiesMap = useFundRightStore((s) => s.communities);
  const usersMap = useFundRightStore((s) => s.users);

  const allFundraisers = useMemo(() => Object.values(fundraisersMap), [fundraisersMap]);
  const allCommunities = useMemo(() => Object.values(communitiesMap), [communitiesMap]);
  const allUsers = useMemo(() => Object.values(usersMap), [usersMap]);

  const matchedFundraisers = useMemo(() => {
    if (!q) return [] as Fundraiser[];
    return allFundraisers.filter(
      (f) => fuzzyMatch(f.title, q) || fuzzyMatch(f.story, q)
    );
  }, [allFundraisers, q]);

  const matchedCommunities = useMemo(() => {
    if (!q) return [] as Community[];
    return allCommunities.filter(
      (c) => fuzzyMatch(c.name, q) || fuzzyMatch(c.description, q)
    );
  }, [allCommunities, q]);

  const matchedUsers = useMemo(() => {
    if (!q) return [] as User[];
    return allUsers.filter((u) => fuzzyMatch(u.name, q));
  }, [allUsers, q]);

  const totalResults =
    matchedFundraisers.length + matchedCommunities.length + matchedUsers.length;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: q ? `Search: "${q}"` : "Search" },
  ];

  if (!q) {
    return (
      <div className="space-y-8">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="text-center py-16">
          <p className="text-heading-sm text-heading">
            Enter a search term to find fundraisers, communities, and people.
          </p>
        </div>
      </div>
    );
  }

  if (totalResults === 0) {
    return (
      <div className="space-y-8">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="rounded-xxl border border-dashed border-neutral-border bg-surface-subtle py-16 text-center">
          <p className="text-heading-sm text-heading">
            No results for &ldquo;{q}&rdquo;
          </p>
          <p className="mt-2 text-supporting">
            Try a different search or{" "}
            <Link href="/browse" className="font-bold text-brand hover:underline">
              browse by category
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div>
        <h1 className="text-display-sm text-heading">
          Search results for &ldquo;{q}&rdquo;
        </h1>
        <p className="mt-2 text-body-md text-supporting">
          {totalResults} result{totalResults !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Fundraisers */}
      {matchedFundraisers.length > 0 && (
        <section>
          <h2 className="text-heading-md text-heading mb-4">
            Fundraisers ({matchedFundraisers.length})
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchedFundraisers.slice(0, MAX_PER_GROUP).map((f) => {
              const organizer = usersMap[f.organizerId];
              return (
                <li key={f.id}>
                  <Link
                    href={`/f/${f.slug}`}
                    className="hrt-card block hover:shadow-medium"
                  >
                    <div className="hrt-card-image relative aspect-[3/2] w-full bg-surface-medium">
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
                      <h3 className="text-heading-xs text-heading line-clamp-2">
                        {f.title}
                      </h3>
                      {organizer && (
                        <p className="mt-1 text-body-sm text-supporting">
                          By {organizer.name}
                        </p>
                      )}
                      <div className="mt-3">
                        <ProgressBar
                          raised={f.raisedAmount}
                          goal={f.goalAmount}
                          animate={false}
                        />
                      </div>
                      <p className="mt-2 text-body-sm font-bold text-heading">
                        {formatCurrency(f.raisedAmount)}{" "}
                        <span className="font-normal text-supporting">raised</span>
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          {matchedFundraisers.length > MAX_PER_GROUP && (
            <p className="mt-3 text-body-sm text-supporting">
              Showing {MAX_PER_GROUP} of {matchedFundraisers.length} fundraisers
            </p>
          )}
        </section>
      )}

      {/* Communities */}
      {matchedCommunities.length > 0 && (
        <section>
          <h2 className="text-heading-md text-heading mb-4">
            Communities ({matchedCommunities.length})
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {matchedCommunities.slice(0, MAX_PER_GROUP).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/communities/${c.slug}`}
                  className="hrt-card block hover:shadow-medium"
                >
                  <div className="hrt-card-image relative aspect-[21/9] w-full bg-surface-medium">
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
                    <h3 className="text-heading-sm text-heading">{c.name}</h3>
                    <span className="hrt-tag-brand mt-1">
                      {c.causeCategory}
                    </span>
                    <p className="mt-2 text-body-sm text-supporting">
                      {formatCurrency(c.totalRaised)} raised ·{" "}
                      {c.fundraiserCount} fundraisers
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* People */}
      {matchedUsers.length > 0 && (
        <section>
          <h2 className="text-heading-md text-heading mb-4">
            People ({matchedUsers.length})
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchedUsers.slice(0, MAX_PER_GROUP).map((u) => (
              <li key={u.id}>
                <Link
                  href={`/u/${u.username}`}
                  className="flex items-center gap-4 rounded-xxl border border-neutral-border bg-white p-4 transition-all duration-hrt ease-hrt hover:shadow-medium hover:border-brand/30"
                >
                  <UserAvatar src={u.avatar} size={48} />
                  <div>
                    <h3 className="font-bold text-heading">{u.name}</h3>
                    <p className="text-body-sm text-supporting line-clamp-1">{u.bio}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default function SearchPageContent() {
  return (
    <PageTransition>
    <Suspense
      fallback={
        <div className="py-16 text-center text-supporting">Loading search...</div>
      }
    >
      <SearchResults />
    </Suspense>
    </PageTransition>
  );
}
