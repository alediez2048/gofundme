"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { useFundRightStore } from "@/lib/store";
import { BLUR_DATA_URL, calculateProgress, formatCurrency } from "@/lib/utils";
import type { Fundraiser, User } from "@/lib/data";
import type { CauseSummaryResult } from "@/lib/ai/cause-intelligence";
import Breadcrumbs from "./Breadcrumbs";
import ProgressBar from "./ProgressBar";
import UserAvatar from "./UserAvatar";

function FundraiserCard({ f, organizer }: { f: Fundraiser; organizer: User | undefined }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden hover:border-primary/30 transition-colors">
      <Link href={`/f/${f.slug}`} className="block">
        <div className="relative aspect-[16/10] w-full bg-stone-200">
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
          <h3 className="font-semibold text-stone-900 line-clamp-2">{f.title}</h3>
        </div>
      </Link>
      <div className="px-4 pb-4">
        {organizer && (
          <p className="mt-1 text-sm text-stone-600">
            By{" "}
            <Link
              href={`/u/${organizer.username}`}
              className="font-medium text-stone-700 hover:text-primary"
            >
              {organizer.name}
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
            aria-label={`${openId === item.id ? "Collapse" : "Expand"}: ${item.question}`}
          >
            {item.question}
            <span className="text-stone-400 shrink-0 ml-2" aria-hidden="true">
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
  const featured: { label: string; color: string; item: Fundraiser; detail: string }[] = [];
  if (mostUrgent && !seen.has(mostUrgent.id)) {
    seen.add(mostUrgent.id);
    featured.push({
      label: "Most urgent",
      color: "border-amber-200 bg-amber-50/50 text-amber-800",
      item: mostUrgent,
      detail: `${pctOf(mostUrgent)}% to goal`,
    });
  }
  if (mostMomentum && !seen.has(mostMomentum.id)) {
    seen.add(mostMomentum.id);
    featured.push({
      label: "Most momentum",
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-800",
      item: mostMomentum,
      detail: `${mostMomentum.donationCount} donations`,
    });
  }
  if (closestToGoal && !seen.has(closestToGoal.id)) {
    seen.add(closestToGoal.id);
    featured.push({
      label: "Closest to goal",
      color: "border-stone-200 bg-stone-50 text-stone-600",
      item: closestToGoal,
      detail: `${formatCurrency(closestToGoal.goalAmount - closestToGoal.raisedAmount)} to go`,
    });
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Communities", href: "/communities" },
    { label: community.name },
  ];

  return (
    <article className="space-y-8">
      <Breadcrumbs items={breadcrumbItems} />
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
            blurDataURL={BLUR_DATA_URL}
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
            {formatCurrency(community.totalRaised)}
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

      {/* FR-011: Cause Intelligence — About This Cause (AI or static fallback) */}
      <section>
        <h2 className="text-xl font-semibold text-stone-900 mb-3">
          About this cause
        </h2>
        <div className="text-stone-700 mb-2 whitespace-pre-line">{causeSummary.text}</div>
        {causeSummary.isAiGenerated && (
          <p className="text-sm text-stone-500 mb-2">
            <span className="italic">AI-generated summary</span>
            {fundraiserCount > 0 && (
              <> · Based on {fundraiserCount} active fundraiser{fundraiserCount !== 1 ? "s" : ""} in this community</>
            )}
          </p>
        )}
        <div className="rounded-lg bg-stone-50 p-4 space-y-2 text-sm text-stone-700">
          <p><strong>How can I help?</strong> Donate to any campaign below, start a fundraiser, or share this community with others.</p>
          <p><strong>Where does the money go?</strong> Directly to the campaigns you choose. Organizers post updates so you can see impact.</p>
        </div>
      </section>

      {/* Guided discovery */}
      {featured.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Find a campaign to support
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map((f) => (
              <div key={f.item.id} className={`rounded-lg border p-4 ${f.color}`}>
                <p className="text-xs font-semibold uppercase tracking-wide">
                  {f.label}
                </p>
                <Link
                  href={`/f/${f.item.slug}`}
                  className="mt-1 font-medium text-stone-900 hover:text-primary block"
                >
                  {f.item.title}
                </Link>
                <p className="text-sm text-stone-600 mt-1">{f.detail}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Fundraiser directory */}
      <section>
        <h2 className="text-xl font-semibold text-stone-900 mb-4">
          Active fundraisers
        </h2>
        {sortedFundraisers.length === 0 ? (
          <p className="text-stone-600 text-sm">No fundraisers yet. Be the first to start one.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedFundraisers.map((f) => (
              <li key={f.id}>
                <FundraiserCard f={f} organizer={users[f.organizerId]} />
              </li>
            ))}
          </ul>
        )}
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
                  <UserAvatar src={u.avatar} size={40} />
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
    <CommunityBySlug
      slug={slug}
      causeSummary={causeSummary}
      fundraiserCount={fundraiserCount}
    />
  );
}
