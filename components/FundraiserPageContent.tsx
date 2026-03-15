"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFundRightStore } from "@/lib/store";
import { BLUR_DATA_URL, calculateProgress, formatCurrency } from "@/lib/utils";
import type { User, Community } from "@/lib/data";
import { buildTrustSummary } from "@/lib/ai/trust-impact";
import Breadcrumbs from "./Breadcrumbs";
import PageTransition from "./PageTransition";
import DonationModal from "./DonationModal";
import ProgressBar from "./ProgressBar";
import UserAvatar from "./UserAvatar";

function formatStory(text: string): React.ReactNode {
  return text.split(/\n\n+/).map((para, i) => (
    <p key={i} className="mb-4 last:mb-0">
      {para.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j}>{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
    </p>
  ));
}

function TrustSummaryBlock({ organizer }: { organizer: User }) {
  const fundraisers = useFundRightStore((s) => s.fundraisers);
  const communities = useFundRightStore((s) => s.communities);

  const trust = useMemo(
    () =>
      buildTrustSummary(
        organizer,
        Object.values(fundraisers),
        Object.values(communities)
      ),
    [organizer, fundraisers, communities]
  );

  if (trust.stats.campaignCount === 0) return null;

  return (
    <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-heading mb-2">
        Why trust this organizer
      </h3>
      <p className="text-sm text-heading">{trust.text}</p>
      <Link
        href={`/u/${organizer.username}`}
        className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
      >
        View full profile
      </Link>
    </div>
  );
}

function FundraiserBySlug({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const isNewlyCreated = searchParams.get("new") === "1";
  const fundraiser = useFundRightStore((s) =>
    Object.values(s.fundraisers).find((f) => f.slug === slug)
  );
  const users = useFundRightStore((s) => s.users);
  const communities = useFundRightStore((s) => s.communities);
  const fundraisers = useFundRightStore((s) => s.fundraisers);
  const donations = useFundRightStore((s) => s.donations);

  if (!fundraiser) notFound();
  const organizer: User | undefined = users[fundraiser.organizerId];
  const community: Community | undefined = fundraiser.communityId
    ? communities[fundraiser.communityId]
    : undefined;
  const related = community
    ? Object.values(fundraisers).filter(
        (f) => f.communityId === fundraiser.communityId && f.id !== fundraiser.id
      ).slice(0, 3)
    : [];

  // Recent donors with their donation amounts
  const recentDonationIds = fundraiser.donationIds.slice(-5).reverse();
  const recentDonations = recentDonationIds
    .map((id) => {
      const donation = donations[id];
      if (!donation) return null;
      const donor = users[donation.donorId];
      if (!donor) return null;
      return { donor, amount: donation.amount };
    })
    .filter(Boolean) as { donor: User; amount: number }[];

  // Top 3 donors for leaderboard (sorted by amount descending)
  const allDonationsForFundraiser = fundraiser.donationIds
    .map((id) => donations[id])
    .filter(Boolean);
  const donorTotals = new Map<string, { donor: User; total: number }>();
  for (const d of allDonationsForFundraiser) {
    const donor = users[d.donorId];
    if (!donor) continue;
    const existing = donorTotals.get(d.donorId);
    if (existing) {
      existing.total += d.amount;
    } else {
      donorTotals.set(d.donorId, { donor, total: d.amount });
    }
  }
  const topDonorsLeaderboard = Array.from(donorTotals.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; donorUsername: string | null }>({
    show: false,
    donorUsername: null,
  });
  const donateButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast((p) => ({ ...p, show: false })), 4000);
    return () => clearTimeout(t);
  }, [toast.show]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(community ? [{ label: community.name, href: `/communities/${community.slug}` }] : []),
    { label: fundraiser.title },
  ];

  // Edge-case state calculations
  const pct = calculateProgress(fundraiser.raisedAmount, fundraiser.goalAmount);
  const rawPct = fundraiser.goalAmount > 0
    ? Math.round((fundraiser.raisedAmount / fundraiser.goalAmount) * 100)
    : 0;
  const remaining = fundraiser.goalAmount - fundraiser.raisedAmount;
  const isOverfunded = fundraiser.raisedAmount > fundraiser.goalAmount;
  const isGoalReached = fundraiser.raisedAmount >= fundraiser.goalAmount;

  return (
    <article className="space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      {/* FR-016: Newly created fundraiser welcome + share prompt */}
      {isNewlyCreated && fundraiser.donationCount === 0 && (
        <div className="rounded-xl border border-primary/30 bg-emerald-50 p-5">
          <p className="text-lg font-bold text-primary">Your fundraiser is live!</p>
          <p className="mt-1 text-sm text-secondary">
            Share it with friends and family to get the word out and receive your first donation.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href.split("?")[0]);
              }}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-heading hover:bg-gray-50"
            >
              Copy link
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just launched "${fundraiser.title}" on FundRight! Help me reach my goal:`)}&url=${encodeURIComponent(window.location.href.split("?")[0])}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-heading hover:bg-gray-50"
            >
              Share on X
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href.split("?")[0])}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-heading hover:bg-gray-50"
            >
              Share on Facebook
            </a>
          </div>
        </div>
      )}

      {/* Title at the very top */}
      <h1 className="text-2xl font-bold text-heading tracking-tight sm:text-3xl">
        {fundraiser.title}
      </h1>

      {/* Two-column layout: LEFT = content, RIGHT = sticky donation sidebar */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero image */}
          <section className="overflow-hidden rounded-xl bg-gray-200">
            <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
              <Image
                src={fundraiser.heroImageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1024px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </div>
          </section>

          {/* Organizer byline */}
          {organizer && (
            <p className="text-secondary">
              By{" "}
              <Link
                href={`/u/${organizer.username}`}
                className="font-medium text-primary hover:underline"
              >
                {organizer.name}
              </Link>
              {organizer.verified && (
                <span className="ml-1.5 text-primary" aria-label="Verified">
                  ✓
                </span>
              )}
            </p>
          )}

          {/* Trust cues: verification, history snippet, community */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-secondary">
            {organizer?.verified && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-800">
                Verified organizer
              </span>
            )}
            {organizer && organizer.communityIds.length > 0 && (
              <span>
                Part of {organizer.communityIds.length} community
                {organizer.communityIds.length !== 1 ? "s" : ""}
              </span>
            )}
            {community && (
              <Link
                href={`/communities/${community.slug}`}
                className="rounded-full bg-gray-100 px-2.5 py-1 text-heading hover:bg-gray-200"
              >
                {community.name}
              </Link>
            )}
          </div>

          {/* Story section */}
          <section className="border-t border-gray-200 pt-6 sm:pt-8">
            <h2 className="text-lg font-semibold text-heading mb-3 sm:text-xl sm:mb-4">Story</h2>
            <div className="prose prose-gray max-w-none text-heading">
              {formatStory(fundraiser.story)}
            </div>
          </section>

          {/* Organizer updates */}
          {fundraiser.updates.length > 0 && (
            <section className="border-t border-gray-200 pt-6 sm:pt-8">
              <h2 className="text-lg font-semibold text-heading mb-3 sm:text-xl sm:mb-4">Updates</h2>
              <ul className="space-y-4">
                {fundraiser.updates.map((up) => (
                  <li key={up.id} className="rounded-lg bg-gray-50 p-4">
                    <time
                      dateTime={up.date}
                      className="text-sm text-secondary block mb-1"
                    >
                      {new Date(up.date).toLocaleDateString()}
                    </time>
                    <p className="text-heading">{up.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Organizer section */}
          {organizer && (
            <section className="border-t border-gray-200 pt-6 sm:pt-8">
              <h2 className="text-lg font-semibold text-heading mb-4 sm:text-xl">Organizer</h2>
              <Link
                href={`/u/${organizer.username}`}
                className="flex items-center gap-3 group"
              >
                <UserAvatar src={organizer.avatar} size={48} />
                <div>
                  <p className="font-semibold text-heading group-hover:text-primary">
                    {organizer.name}
                    {organizer.verified && (
                      <span className="ml-1.5 text-primary" aria-label="Verified">
                        ✓
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-secondary">Organizer</p>
                </div>
              </Link>
            </section>
          )}

          {/* Top Donors Leaderboard */}
          {topDonorsLeaderboard.length > 0 && (
            <section className="border-t border-gray-200 pt-6 sm:pt-8">
              <h2 className="text-lg font-semibold text-heading mb-4 sm:text-xl">
                Top donors
              </h2>
              <div className="flex items-end justify-center gap-4">
                {/* 2nd place */}
                {topDonorsLeaderboard[1] && (
                  <div className="flex flex-col items-center">
                    <UserAvatar src={topDonorsLeaderboard[1].donor.avatar} size={40} />
                    <p className="mt-2 text-sm font-medium text-heading text-center truncate max-w-[80px]">
                      {topDonorsLeaderboard[1].donor.name.split(" ")[0]}
                    </p>
                    <p className="text-xs text-secondary">
                      {formatCurrency(topDonorsLeaderboard[1].total)}
                    </p>
                    <div className="mt-2 w-16 bg-gray-100 rounded-t-lg flex items-end justify-center" style={{ height: "60px" }}>
                      <span className="text-lg font-bold text-secondary pb-1">2</span>
                    </div>
                  </div>
                )}
                {/* 1st place */}
                {topDonorsLeaderboard[0] && (
                  <div className="flex flex-col items-center">
                    <UserAvatar src={topDonorsLeaderboard[0].donor.avatar} size={48} />
                    <p className="mt-2 text-sm font-semibold text-heading text-center truncate max-w-[80px]">
                      {topDonorsLeaderboard[0].donor.name.split(" ")[0]}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {formatCurrency(topDonorsLeaderboard[0].total)}
                    </p>
                    <div className="mt-2 w-16 bg-primary/10 rounded-t-lg flex items-end justify-center" style={{ height: "90px" }}>
                      <span className="text-lg font-bold text-primary pb-1">1</span>
                    </div>
                  </div>
                )}
                {/* 3rd place */}
                {topDonorsLeaderboard[2] && (
                  <div className="flex flex-col items-center">
                    <UserAvatar src={topDonorsLeaderboard[2].donor.avatar} size={36} />
                    <p className="mt-2 text-sm font-medium text-heading text-center truncate max-w-[80px]">
                      {topDonorsLeaderboard[2].donor.name.split(" ")[0]}
                    </p>
                    <p className="text-xs text-secondary">
                      {formatCurrency(topDonorsLeaderboard[2].total)}
                    </p>
                    <div className="mt-2 w-16 bg-gray-100 rounded-t-lg flex items-end justify-center" style={{ height: "40px" }}>
                      <span className="text-lg font-bold text-secondary pb-1">3</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Parent community badge */}
          {community && (
            <section className="border-t border-gray-200 pt-6 sm:pt-8">
              <p className="text-sm text-secondary mb-2">Part of the community</p>
              <Link
                href={`/communities/${community.slug}`}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-heading hover:bg-gray-50"
              >
                <span className="font-medium">{community.name}</span>
              </Link>
            </section>
          )}

          {/* Related fundraisers */}
          {related.length > 0 && (
            <section className="border-t border-gray-200 pt-6 sm:pt-8">
              <h2 className="text-lg font-semibold text-heading mb-3 sm:text-xl sm:mb-4">
                Related fundraisers in this community
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {related.map((f) => (
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
        </div>

        {/* ── RIGHT COLUMN: Sticky Donation Sidebar Widget ── */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              {/* Raised amount */}
              <div>
                <p className="text-2xl font-bold text-heading">
                  {formatCurrency(fundraiser.raisedAmount)}
                  <span className="text-base font-normal text-secondary ml-1">
                    raised of {formatCurrency(fundraiser.goalAmount)} goal
                  </span>
                </p>
              </div>

              {/* Progress bar */}
              <ProgressBar raised={fundraiser.raisedAmount} goal={fundraiser.goalAmount} height="h-1.5" />

              {/* Donation count */}
              <p className="text-sm text-secondary">
                {fundraiser.donationCount} donation
                {fundraiser.donationCount !== 1 ? "s" : ""}
              </p>

              {/* Edge-case state banners inside sidebar */}
              {/* FR-016: 0% -- Just launched */}
              {fundraiser.donationCount === 0 && (
                <div className="rounded-lg border border-dashed border-primary/40 bg-emerald-50/50 px-4 py-3">
                  <p className="font-semibold text-primary text-sm">Just launched — be the first donor!</p>
                  <p className="mt-1 text-xs text-secondary">
                    Every fundraiser starts with one person. Your donation sets the momentum.
                  </p>
                </div>
              )}

              {/* FR-016: >100% -- Overfunded */}
              {isOverfunded && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                  <p className="font-semibold text-amber-800 text-sm">
                    {rawPct}% — Goal exceeded!
                  </p>
                  <p className="mt-1 text-xs text-amber-700">
                    {formatCurrency(fundraiser.raisedAmount - fundraiser.goalAmount)} over the original goal. Every extra dollar extends the impact.
                  </p>
                </div>
              )}

              {/* FR-016: 100% -- Goal reached */}
              {isGoalReached && !isOverfunded && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                  <p className="font-semibold text-emerald-800 text-sm">Goal reached!</p>
                  <p className="mt-1 text-xs text-emerald-700">
                    This fundraiser hit its {formatCurrency(fundraiser.goalAmount)} goal. You can still donate to extend the impact.
                  </p>
                </div>
              )}

              {/* FR-016: 76-99% -- Urgency */}
              {pct >= 76 && pct < 100 && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
                  <p className="font-semibold text-blue-800 text-sm">
                    Almost there! {formatCurrency(remaining)} to go
                  </p>
                  <p className="mt-1 text-xs text-blue-700">
                    This fundraiser is {pct}% funded. Help push it over the finish line.
                  </p>
                </div>
              )}

              {/* Trust Summary inside sidebar */}
              {organizer && <TrustSummaryBlock organizer={organizer} />}

              {/* Donate now button */}
              <button
                ref={donateButtonRef}
                type="button"
                onClick={() => setModalOpen(true)}
                className={`w-full rounded-full px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  fundraiser.donationCount === 0
                    ? "bg-primary animate-pulse"
                    : "bg-primary"
                }`}
                aria-label="Donate to this fundraiser"
              >
                {fundraiser.donationCount === 0 ? "Be the first to donate" : "Donate now"}
              </button>

              {/* Share button */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href.split("?")[0]);
                }}
                className="w-full rounded-full border border-gray-300 px-6 py-3 font-semibold text-heading hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Share
              </button>

              {/* Recent donors list */}
              {recentDonations.length > 0 && (
                <div className="pt-2 space-y-3">
                  <h3 className="text-sm font-semibold text-heading">Recent donors</h3>
                  <ul className="space-y-3">
                    {recentDonations.map(({ donor, amount }, i) => (
                      <li key={`${donor.id}-${i}`}>
                        <Link
                          href={`/u/${donor.username}`}
                          className="flex items-center gap-3 hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
                        >
                          <UserAvatar src={donor.avatar} size={32} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-heading truncate">
                              {donor.name}
                            </p>
                            <p className="text-xs text-secondary">
                              {formatCurrency(amount)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DonationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        fundraiserId={fundraiser.id}
        fundraiserTitle={fundraiser.title}
        causeCategory={fundraiser.causeCategory}
        users={users}
        triggerRef={donateButtonRef}
        onSuccess={(donorUsername) =>
          setToast({ show: true, donorUsername })
        }
      />

      {toast.show && toast.donorUsername && (
        <div
          className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg"
          role="status"
          aria-live="polite"
        >
          <p className="text-heading">
            Donation added!{" "}
            <Link
              href={`/u/${toast.donorUsername}`}
              className="font-medium text-primary hover:underline"
            >
              View it on your profile →
            </Link>
          </p>
        </div>
      )}
    </article>
  );
}

export default function FundraiserPageContent({ slug }: { slug: string }) {
  return <PageTransition><FundraiserBySlug slug={slug} /></PageTransition>;
}
