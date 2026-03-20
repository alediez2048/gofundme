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
    <div className="rounded-xl bg-brand-mint border border-brand-subtle p-4">
      <h3 className="text-heading-xs text-heading mb-2">
        Why trust this organizer
      </h3>
      <p className="text-body-sm text-heading">{trust.text}</p>
      <Link
        href={`/u/${organizer.username}`}
        className="mt-2 inline-block text-body-xs font-bold text-brand hover:underline"
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

      {/* Newly created welcome */}
      {isNewlyCreated && fundraiser.donationCount === 0 && (
        <div className="rounded-xxl border border-brand bg-brand-mint p-5">
          <p className="text-heading-sm text-brand">Your fundraiser is live!</p>
          <p className="mt-1 text-body-sm text-supporting">
            Share it with friends and family to get the word out and receive your first donation.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href.split("?")[0]);
              }}
              className="hrt-btn-secondary px-4 py-2 text-body-sm"
            >
              Copy link
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just launched "${fundraiser.title}" on FundRight! Help me reach my goal:`)}&url=${encodeURIComponent(window.location.href.split("?")[0])}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hrt-btn-secondary px-4 py-2 text-body-sm"
            >
              Share on X
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href.split("?")[0])}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hrt-btn-secondary px-4 py-2 text-body-sm"
            >
              Share on Facebook
            </a>
          </div>
        </div>
      )}

      {/* Title */}
      <h1 className="text-heading-xl sm:text-display-sm text-heading">
        {fundraiser.title}
      </h1>

      {/* Two-column layout */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero image */}
          <section className="hrt-card-image overflow-hidden bg-surface-medium">
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
            <p className="text-supporting">
              By{" "}
              <Link
                href={`/u/${organizer.username}`}
                className="font-bold text-brand hover:underline"
              >
                {organizer.name}
              </Link>
              {organizer.verified && (
                <span className="ml-1.5 text-brand" aria-label="Verified">
                  ✓
                </span>
              )}
            </p>
          )}

          {/* Trust cues */}
          <div className="flex flex-wrap items-center gap-3 text-body-sm">
            {organizer?.verified && (
              <span className="hrt-tag-positive">
                Verified organizer
              </span>
            )}
            {organizer && organizer.communityIds.length > 0 && (
              <span className="text-supporting">
                Part of {organizer.communityIds.length} community
                {organizer.communityIds.length !== 1 ? "s" : ""}
              </span>
            )}
            {community && (
              <Link
                href={`/communities/${community.slug}`}
                className="hrt-tag-neutral hover:bg-neutral-border transition-colors"
              >
                {community.name}
              </Link>
            )}
          </div>

          {/* Story */}
          <section className="border-t border-neutral-border pt-6 sm:pt-8">
            <h2 className="text-heading-md text-heading mb-3 sm:mb-4">Story</h2>
            <div className="max-w-none text-body-md text-heading leading-relaxed">
              {formatStory(fundraiser.story)}
            </div>
          </section>

          {/* Updates */}
          {fundraiser.updates.length > 0 && (
            <section className="border-t border-neutral-border pt-6 sm:pt-8">
              <h2 className="text-heading-md text-heading mb-3 sm:mb-4">Updates</h2>
              <ul className="space-y-4">
                {fundraiser.updates.map((up) => (
                  <li key={up.id} className="rounded-xl bg-surface-subtle p-4">
                    <time
                      dateTime={up.date}
                      className="text-body-sm text-supporting block mb-1"
                    >
                      {new Date(up.date).toLocaleDateString()}
                    </time>
                    <p className="text-body-md text-heading">{up.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Organizer section */}
          {organizer && (
            <section className="border-t border-neutral-border pt-6 sm:pt-8">
              <h2 className="text-heading-md text-heading mb-4">Organizer</h2>
              <Link
                href={`/u/${organizer.username}`}
                className="flex items-center gap-3 group"
              >
                <UserAvatar src={organizer.avatar} size={48} />
                <div>
                  <p className="font-bold text-heading group-hover:text-brand transition-colors">
                    {organizer.name}
                    {organizer.verified && (
                      <span className="ml-1.5 text-brand" aria-label="Verified">
                        ✓
                      </span>
                    )}
                  </p>
                  <p className="text-body-sm text-supporting">Organizer</p>
                </div>
              </Link>
            </section>
          )}

          {/* Top Donors */}
          {topDonorsLeaderboard.length > 0 && (
            <section className="border-t border-neutral-border pt-6 sm:pt-8">
              <h2 className="text-heading-md text-heading mb-4">
                Top donors
              </h2>
              <div className="flex items-end justify-center gap-4">
                {topDonorsLeaderboard[1] && (
                  <div className="flex flex-col items-center">
                    <UserAvatar src={topDonorsLeaderboard[1].donor.avatar} size={40} />
                    <p className="mt-2 text-body-sm font-bold text-heading text-center truncate max-w-[80px]">
                      {topDonorsLeaderboard[1].donor.name.split(" ")[0]}
                    </p>
                    <p className="text-body-xs text-supporting">
                      {formatCurrency(topDonorsLeaderboard[1].total)}
                    </p>
                    <div className="mt-2 w-16 bg-surface-extra rounded-t-lg flex items-end justify-center" style={{ height: "60px" }}>
                      <span className="text-heading-sm text-supporting pb-1">2</span>
                    </div>
                  </div>
                )}
                {topDonorsLeaderboard[0] && (
                  <div className="flex flex-col items-center">
                    <UserAvatar src={topDonorsLeaderboard[0].donor.avatar} size={48} />
                    <p className="mt-2 text-body-sm font-bold text-heading text-center truncate max-w-[80px]">
                      {topDonorsLeaderboard[0].donor.name.split(" ")[0]}
                    </p>
                    <p className="text-body-xs text-brand font-bold">
                      {formatCurrency(topDonorsLeaderboard[0].total)}
                    </p>
                    <div className="mt-2 w-16 bg-brand-subtle rounded-t-lg flex items-end justify-center" style={{ height: "90px" }}>
                      <span className="text-heading-sm text-brand pb-1">1</span>
                    </div>
                  </div>
                )}
                {topDonorsLeaderboard[2] && (
                  <div className="flex flex-col items-center">
                    <UserAvatar src={topDonorsLeaderboard[2].donor.avatar} size={36} />
                    <p className="mt-2 text-body-sm font-bold text-heading text-center truncate max-w-[80px]">
                      {topDonorsLeaderboard[2].donor.name.split(" ")[0]}
                    </p>
                    <p className="text-body-xs text-supporting">
                      {formatCurrency(topDonorsLeaderboard[2].total)}
                    </p>
                    <div className="mt-2 w-16 bg-surface-extra rounded-t-lg flex items-end justify-center" style={{ height: "40px" }}>
                      <span className="text-heading-sm text-supporting pb-1">3</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Community badge */}
          {community && (
            <section className="border-t border-neutral-border pt-6 sm:pt-8">
              <p className="text-body-sm text-supporting mb-2">Part of the community</p>
              <Link
                href={`/communities/${community.slug}`}
                className="hrt-btn-secondary px-4 py-2 text-body-sm"
              >
                {community.name}
              </Link>
            </section>
          )}

          {/* Related */}
          {related.length > 0 && (
            <section className="border-t border-neutral-border pt-6 sm:pt-8">
              <h2 className="text-heading-md text-heading mb-3 sm:mb-4">
                Related fundraisers in this community
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {related.map((f) => (
                  <li key={f.id}>
                    <Link
                      href={`/f/${f.slug}`}
                      className="block rounded-xxl border border-neutral-border bg-white p-4 transition-all duration-hrt ease-hrt hover:shadow-medium hover:border-brand/30"
                    >
                      <p className="font-bold text-heading">{f.title}</p>
                      <p className="mt-1 text-body-sm text-supporting">
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

        {/* RIGHT COLUMN: Donation Sidebar */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-xxl border border-neutral-border bg-white p-6 shadow-medium space-y-4">
              <div>
                <p className="text-heading-lg text-heading">
                  {formatCurrency(fundraiser.raisedAmount)}
                  <span className="text-body-md font-normal text-supporting ml-1">
                    raised of {formatCurrency(fundraiser.goalAmount)} goal
                  </span>
                </p>
              </div>

              <ProgressBar raised={fundraiser.raisedAmount} goal={fundraiser.goalAmount} />

              <p className="text-body-sm text-supporting">
                {fundraiser.donationCount} donation
                {fundraiser.donationCount !== 1 ? "s" : ""}
              </p>

              {/* Edge-case banners */}
              {fundraiser.donationCount === 0 && (
                <div className="rounded-xl border border-dashed border-brand/40 bg-brand-mint px-4 py-3">
                  <p className="font-bold text-brand text-body-sm">Just launched — be the first donor!</p>
                  <p className="mt-1 text-body-xs text-supporting">
                    Every fundraiser starts with one person. Your donation sets the momentum.
                  </p>
                </div>
              )}

              {isOverfunded && (
                <div className="rounded-xl bg-surface-warm border border-[#FFD863] px-4 py-3">
                  <p className="font-bold text-warning text-body-sm">
                    {rawPct}% — Goal exceeded!
                  </p>
                  <p className="mt-1 text-body-xs text-warning">
                    {formatCurrency(fundraiser.raisedAmount - fundraiser.goalAmount)} over the original goal. Every extra dollar extends the impact.
                  </p>
                </div>
              )}

              {isGoalReached && !isOverfunded && (
                <div className="rounded-xl bg-brand-subtle border border-brand px-4 py-3">
                  <p className="font-bold text-positive text-body-sm">Goal reached!</p>
                  <p className="mt-1 text-body-xs text-positive">
                    This fundraiser hit its {formatCurrency(fundraiser.goalAmount)} goal. You can still donate to extend the impact.
                  </p>
                </div>
              )}

              {pct >= 76 && pct < 100 && (
                <div className="rounded-xl bg-[#E1F6F6] border border-[#A7E3E3] px-4 py-3">
                  <p className="font-bold text-informative text-body-sm">
                    Almost there! {formatCurrency(remaining)} to go
                  </p>
                  <p className="mt-1 text-body-xs text-informative">
                    This fundraiser is {pct}% funded. Help push it over the finish line.
                  </p>
                </div>
              )}

              {organizer && <TrustSummaryBlock organizer={organizer} />}

              {/* Donate button */}
              <button
                ref={donateButtonRef}
                type="button"
                onClick={() => setModalOpen(true)}
                className={`hrt-btn-primary-lg w-full ${
                  fundraiser.donationCount === 0 ? "animate-pulse" : ""
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
                className="hrt-btn-secondary w-full px-6 py-3"
              >
                Share
              </button>

              {/* Recent donors */}
              {recentDonations.length > 0 && (
                <div className="pt-2 space-y-3">
                  <h3 className="text-heading-xs text-heading">Recent donors</h3>
                  <ul className="space-y-3">
                    {recentDonations.map(({ donor, amount }, i) => (
                      <li key={`${donor.id}-${i}`}>
                        <Link
                          href={`/u/${donor.username}`}
                          className="flex items-center gap-3 hover:bg-surface-subtle -mx-2 px-2 py-1 rounded-xl transition-colors duration-hrt ease-hrt"
                        >
                          <UserAvatar src={donor.avatar} size={32} />
                          <div className="flex-1 min-w-0">
                            <p className="text-body-sm font-bold text-heading truncate">
                              {donor.name}
                            </p>
                            <p className="text-body-xs text-supporting">
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
          className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xxl border border-neutral-border bg-white px-4 py-3 shadow-strong"
          role="status"
          aria-live="polite"
        >
          <p className="text-heading">
            Donation added!{" "}
            <Link
              href={`/u/${toast.donorUsername}`}
              className="font-bold text-brand hover:underline"
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
