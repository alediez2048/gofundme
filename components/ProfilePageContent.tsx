"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useFundRightStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import type { User, Fundraiser, Community, Donation } from "@/lib/data";
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

  return (
    <article className="space-y-8">
      {/* Identity */}
      <section className="flex flex-wrap items-start gap-6">
        <UserAvatar src={user.avatar} size={96} />
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
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
          <p className="mt-2 text-stone-600">{user.bio}</p>
          <p className="mt-2 text-sm text-stone-500">
            Joined {new Date(user.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      {/* Trust summary */}
      <section className="rounded-lg bg-stone-50 p-4">
        <h2 className="text-sm font-semibold text-stone-700 mb-2">
          Why trust this organizer
        </h2>
        <ul className="text-sm text-stone-600 space-y-1">
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
        <h2 className="text-sm font-semibold text-stone-700 mb-2">
          Impact at a glance
        </h2>
        <p className="text-stone-700">{impactSummary}</p>
      </section>

      {/* Impact stats */}
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 text-center">
        <div>
          <dt className="text-sm text-stone-500">Total raised (as organizer)</dt>
          <dd className="text-xl font-semibold text-stone-900">
            {formatCurrency(totalRaisedAsOrganizer)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Total donated</dt>
          <dd className="text-xl font-semibold text-stone-900">
            {formatCurrency(user.totalDonated)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Causes supported</dt>
          <dd className="text-xl font-semibold text-stone-900">
            {causesSupportedCount}
          </dd>
        </div>
      </dl>

      {/* Active fundraisers */}
      {organizerFundraisers.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Active fundraisers
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizerFundraisers.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/f/${f.slug}`}
                  className="block rounded-xl border border-stone-200 bg-white p-4 hover:border-primary/30"
                >
                  <p className="font-semibold text-stone-900">{f.title}</p>
                  <p className="mt-1 text-sm text-stone-600">
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
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Communities
          </h2>
          <div className="flex flex-wrap gap-2">
            {userCommunities.map((c) => (
              <Link
                key={c.id}
                href={`/communities/${c.slug}`}
                className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Giving history */}
      <section>
        <h2 className="text-xl font-semibold text-stone-900 mb-4">
          Giving history
        </h2>
        {givingHistorySorted.length === 0 ? (
          <p className="text-stone-600 text-sm">
            No donations yet. Support a campaign to see it here.
          </p>
        ) : (
          <ul className="space-y-3">
            {givingHistorySorted.map((d) => {
              const f = fundraisers[d.fundraiserId];
              return (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-100 bg-stone-50/50 px-4 py-3"
                >
                  <span className="font-semibold text-stone-900">
                    {formatCurrency(d.amount)}
                  </span>
                  {f ? (
                    <Link
                      href={`/f/${f.slug}`}
                      className="text-stone-700 hover:text-primary"
                    >
                      {f.title}
                    </Link>
                  ) : (
                    <span className="text-stone-500">Campaign</span>
                  )}
                  <time
                    dateTime={d.createdAt}
                    className="text-sm text-stone-500"
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
  return <ProfileByUsername username={username} />;
}
