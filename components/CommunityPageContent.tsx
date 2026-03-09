"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { useFundRightStore } from "@/lib/store";
import type { Community, Fundraiser, User } from "@/lib/data";

const blurPlaceholder =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlN2U1ZTMiLz48L3N2Zz4=";

function FundraiserCard({ f, organizer }: { f: Fundraiser; organizer: User | undefined }) {
  const pct = Math.min(100, Math.round((f.raisedAmount / f.goalAmount) * 100));
  return (
    <Link
      href={`/f/${f.slug}`}
      className="block rounded-xl border border-stone-200 bg-white overflow-hidden hover:border-primary/30 transition-colors"
    >
      <div className="relative aspect-[16/10] w-full bg-stone-200">
        <Image
          src={f.heroImageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={blurPlaceholder}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-stone-900 line-clamp-2">{f.title}</h3>
        {organizer && (
          <p className="mt-1 text-sm text-stone-600">By {organizer.name}</p>
        )}
        <div
          className="mt-3 h-2 rounded-full bg-stone-200 overflow-hidden"
          role="progressbar"
          aria-valuenow={f.raisedAmount}
          aria-valuemin={0}
          aria-valuemax={f.goalAmount}
          aria-label="Progress"
        >
          <div
            className="h-full bg-primary"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-medium text-stone-700">
          ${f.raisedAmount.toLocaleString()} of ${f.goalAmount.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

function FAQAccordion({ faq }: { faq: { id: string; question: string; answer: string }[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      {faq.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border border-stone-200 bg-white overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-stone-900 hover:bg-stone-50"
            aria-expanded={openId === item.id}
          >
            {item.question}
            <span className="text-stone-400 shrink-0 ml-2">
              {openId === item.id ? "−" : "+"}
            </span>
          </button>
          {openId === item.id && (
            <div className="px-4 pb-3 text-stone-600 text-sm border-t border-stone-100">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CommunityBySlug({ slug }: { slug: string }) {
  const community = useFundRightStore((s) =>
    Object.values(s.communities).find((c) => c.slug === slug)
  );
  const users = useFundRightStore((s) => s.users);
  const fundraisers = useFundRightStore((s) => s.fundraisers);

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

  const closestToGoal = [...sortedFundraisers].sort(
    (a, b) =>
      b.raisedAmount / b.goalAmount - a.raisedAmount / a.goalAmount
  )[0];
  const mostMomentum = sortedFundraisers[0];
  const mostUrgent = [...sortedFundraisers].sort(
    (a, b) => a.raisedAmount / a.goalAmount - b.raisedAmount / b.goalAmount
  )[0];

  return (
    <article className="space-y-8">
      {/* Header: banner, name, cause badge, stats */}
      <section className="overflow-hidden rounded-xl bg-stone-200">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src={community.bannerImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
            placeholder="blur"
            blurDataURL={blurPlaceholder}
          />
        </div>
      </section>
      <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
        {community.name}
      </h1>
      <span className="inline-block rounded-full bg-stone-200 px-3 py-1 text-sm font-medium text-stone-700">
        {community.causeCategory}
      </span>
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
        <div>
          <dt className="text-sm text-stone-500">Total raised</dt>
          <dd className="text-xl font-semibold text-stone-900">
            ${community.totalRaised.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Donations</dt>
          <dd className="text-xl font-semibold text-stone-900">
            {community.donationCount}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Fundraisers</dt>
          <dd className="text-xl font-semibold text-stone-900">
            {community.fundraiserCount}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Members</dt>
          <dd className="text-xl font-semibold text-stone-900">
            {community.memberCount}
          </dd>
        </div>
      </dl>

      {/* Direct-answer content */}
      <section>
        <h2 className="text-xl font-semibold text-stone-900 mb-3">
          About this cause
        </h2>
        <p className="text-stone-700 mb-4">{community.description}</p>
        <div className="rounded-lg bg-stone-50 p-4 space-y-2 text-sm text-stone-700">
          <p><strong>How can I help?</strong> Donate to any campaign below, start a fundraiser, or share this community with others.</p>
          <p><strong>Where does the money go?</strong> Directly to the campaigns you choose. Organizers post updates so you can see impact.</p>
        </div>
      </section>

      {/* Guided discovery */}
      {(closestToGoal || mostMomentum || mostUrgent) && (
        <section>
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Find a campaign to support
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {mostUrgent && mostUrgent.id !== mostMomentum?.id && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
                <p className="text-xs font-semibold uppercase text-amber-800 tracking-wide">
                  Most urgent
                </p>
                <Link
                  href={`/f/${mostUrgent.slug}`}
                  className="mt-1 font-medium text-stone-900 hover:text-primary block"
                >
                  {mostUrgent.title}
                </Link>
                <p className="text-sm text-stone-600 mt-1">
                  {Math.round((mostUrgent.raisedAmount / mostUrgent.goalAmount) * 100)}% to goal
                </p>
              </div>
            )}
            {mostMomentum && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
                <p className="text-xs font-semibold uppercase text-emerald-800 tracking-wide">
                  Most momentum
                </p>
                <Link
                  href={`/f/${mostMomentum.slug}`}
                  className="mt-1 font-medium text-stone-900 hover:text-primary block"
                >
                  {mostMomentum.title}
                </Link>
                <p className="text-sm text-stone-600 mt-1">
                  {mostMomentum.donationCount} donations
                </p>
              </div>
            )}
            {closestToGoal && closestToGoal.id !== mostMomentum?.id && (
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs font-semibold uppercase text-stone-600 tracking-wide">
                  Closest to goal
                </p>
                <Link
                  href={`/f/${closestToGoal.slug}`}
                  className="mt-1 font-medium text-stone-900 hover:text-primary block"
                >
                  {closestToGoal.title}
                </Link>
                <p className="text-sm text-stone-600 mt-1">
                  ${(closestToGoal.goalAmount - closestToGoal.raisedAmount).toLocaleString()} to go
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Fundraiser directory */}
      <section>
        <h2 className="text-xl font-semibold text-stone-900 mb-4">
          Active fundraisers
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedFundraisers.map((f) => (
            <li key={f.id}>
              <FundraiserCard f={f} organizer={users[f.organizerId]} />
            </li>
          ))}
        </ul>
      </section>

      {/* Members */}
      {displayMembers.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Community members
          </h2>
          <ul className="flex flex-wrap gap-4 items-center">
            {displayMembers.map((u) => (
              <li key={u.id}>
                <Link
                  href={`/u/${u.username}`}
                  className="flex items-center gap-2 text-stone-700 hover:text-primary"
                >
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-stone-200">
                    <Image
                      src={u.avatar}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </span>
                  <span className="text-sm font-medium">{u.name}</span>
                </Link>
              </li>
            ))}
            {overflowCount > 0 && (
              <li className="text-sm text-stone-500">
                +{overflowCount} more
              </li>
            )}
          </ul>
        </section>
      )}

      {/* FAQ */}
      {faqList.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Frequently asked questions
          </h2>
          <FAQAccordion faq={faqList} />
        </section>
      )}
    </article>
  );
}

export default function CommunityPageContent({ slug }: { slug: string }) {
  return <CommunityBySlug slug={slug} />;
}
