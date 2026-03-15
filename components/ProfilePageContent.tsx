"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useFundRightStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import type { User, Fundraiser, Community, Donation } from "@/lib/data";
import Breadcrumbs from "./Breadcrumbs";
import PageTransition from "./PageTransition";
import UserAvatar from "./UserAvatar";

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

function ProfileByUsername({ username }: { username: string }) {
  const user = useFundRightStore((s) =>
    Object.values(s.users).find((u) => u.username === username)
  );
  const users = useFundRightStore((s) => s.users);
  const fundraisers = useFundRightStore((s) => s.fundraisers);
  const communities = useFundRightStore((s) => s.communities);
  const donations = useFundRightStore((s) => s.donations);

  if (!user) notFound();

  const organizerFundraisers = Object.values(fundraisers).filter(
    (f) => f.organizerId === user.id
  ) as Fundraiser[];
  const totalRaisedAsOrganizer = organizerFundraisers.reduce(
    (sum, f) => sum + f.raisedAmount,
    0
  );
  const userDonations = (user.donationIds ?? [])
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
  const userCommunities = (user.communityIds ?? [])
    .map((id) => communities[id])
    .filter(Boolean) as Community[];
  const givingHistorySorted = [...userDonations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const impactSummary = buildImpactSummary(
    user,
    totalRaisedAsOrganizer,
    organizerFundraisers.length,
    causesSupportedCount
  );

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: user.name },
  ];

  return (
    <article className="space-y-8">
      <Breadcrumbs items={breadcrumbItems} />
      {/* Identity */}
      <section className="flex flex-wrap items-start gap-4 sm:gap-6">
        <UserAvatar src={user.avatar} size={80} />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-heading tracking-tight flex items-center gap-2 sm:text-3xl">
            {user.name}
            {user.verified && (
              <span
                className="text-primary"
                title="Verified"
                aria-label="Verified"
              >
                ✓
              </span>
            )}
          </h1>
          <p className="mt-2 text-secondary">{user.bio}</p>
          <p className="mt-2 text-sm text-secondary">
            Joined {new Date(user.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      {/* Trust summary */}
      <section className="rounded-lg bg-gray-50 p-4">
        <h2 className="text-sm font-semibold text-heading mb-2">
          Why trust this organizer
        </h2>
        <ul className="text-sm text-secondary space-y-1">
          {organizerFundraisers.length > 0 && (
            <li>
              Organized {organizerFundraisers.length} campaign
              {organizerFundraisers.length !== 1 ? "s" : ""} ·{" "}
              {formatCurrency(totalRaisedAsOrganizer)} raised
            </li>
          )}
          {userCommunities.length > 0 && (
            <li>Member of {userCommunities.length} communit{userCommunities.length !== 1 ? "ies" : "y"}</li>
          )}
          {user.totalDonated > 0 && (
            <li>Donated {formatCurrency(user.totalDonated)} to other campaigns</li>
          )}
        </ul>
      </section>

      {/* Impact summary (derived narrative) */}
      <section>
        <h2 className="text-sm font-semibold text-heading mb-2">
          Impact at a glance
        </h2>
        <p className="text-heading">{impactSummary}</p>
      </section>

      {/* Impact stats */}
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 text-center">
        <div>
          <dt className="text-sm text-secondary">Total raised (as organizer)</dt>
          <dd className="text-lg font-semibold text-heading sm:text-xl">
            {formatCurrency(totalRaisedAsOrganizer)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-secondary">Total donated</dt>
          <dd className="text-lg font-semibold text-heading sm:text-xl">
            {formatCurrency(user.totalDonated)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-secondary">Causes supported</dt>
          <dd className="text-lg font-semibold text-heading sm:text-xl">
            {causesSupportedCount}
          </dd>
        </div>
      </dl>

      {/* Active fundraisers */}
      {organizerFundraisers.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-heading mb-4 sm:text-xl">
            Active fundraisers
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizerFundraisers.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/f/${f.slug}`}
                  className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-primary/30"
                >
                  <p className="font-semibold text-heading">{f.title}</p>
                  <p className="mt-1 text-sm text-secondary">
                    {formatCurrency(f.raisedAmount)} of{" "}
                    {formatCurrency(f.goalAmount)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Community memberships */}
      {userCommunities.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-heading mb-4 sm:text-xl">
            Communities
          </h2>
          <div className="flex flex-wrap gap-2">
            {userCommunities.map((c) => (
              <Link
                key={c.id}
                href={`/communities/${c.slug}`}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-heading hover:bg-gray-200"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Giving history */}
      <section>
        <h2 className="text-xl font-semibold text-heading mb-4">
          Giving history
        </h2>
        {givingHistorySorted.length === 0 ? (
          <p className="text-secondary text-sm">
            No donations yet. Support a campaign to see it here.
          </p>
        ) : (
          <ul className="space-y-3">
            {givingHistorySorted.map((d) => {
              const f = fundraisers[d.fundraiserId];
              return (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3"
                >
                  <span className="font-semibold text-heading">
                    {formatCurrency(d.amount)}
                  </span>
                  {f ? (
                    <Link
                      href={`/f/${f.slug}`}
                      className="text-heading hover:text-primary"
                    >
                      {f.title}
                    </Link>
                  ) : (
                    <span className="text-secondary">Campaign</span>
                  )}
                  <time
                    dateTime={d.createdAt}
                    className="text-sm text-secondary"
                  >
                    {new Date(d.createdAt).toLocaleDateString()}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </article>
  );
}

export default function ProfilePageContent({ username }: { username: string }) {
  return <PageTransition><ProfileByUsername username={username} /></PageTransition>;
}
