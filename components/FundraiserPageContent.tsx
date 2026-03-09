"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFundRightStore } from "@/lib/store";
import { BLUR_DATA_URL, formatCurrency } from "@/lib/utils";
import type { User, Community } from "@/lib/data";
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

function FundraiserBySlug({ slug }: { slug: string }) {
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
  const topDonorIds = fundraiser.donationIds
    .slice(-5)
    .reverse()
    .map((id) => donations[id]?.donorId)
    .filter(Boolean) as string[];
  const topDonors = topDonorIds.map((id) => users[id]).filter(Boolean) as User[];
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

  return (
    <article className="space-y-8">
      {/* Hero + above-the-fold */}
      <section className="overflow-hidden rounded-xl bg-stone-200">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src={fundraiser.heroImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </div>
      </section>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
            {fundraiser.title}
          </h1>
          {organizer && (
            <p className="text-stone-600">
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
          <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600">
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
                className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-700 hover:bg-stone-200"
              >
                {community.name}
              </Link>
            )}
          </div>

          {/* Progress bar */}
          <ProgressBar raised={fundraiser.raisedAmount} goal={fundraiser.goalAmount} />
          <p className="text-lg font-semibold text-stone-900">
            {formatCurrency(fundraiser.raisedAmount)} raised of{" "}
            {formatCurrency(fundraiser.goalAmount)} goal
          </p>
          <p className="text-sm text-stone-500">
            {fundraiser.donationCount} donation
            {fundraiser.donationCount !== 1 ? "s" : ""}
          </p>

          {/* Donate CTA */}
          <div>
            <button
              ref={donateButtonRef}
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Donate to this fundraiser"
            >
              Donate
            </button>
          </div>
        </div>

        <DonationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          fundraiserId={fundraiser.id}
          fundraiserTitle={fundraiser.title}
          users={users}
          triggerRef={donateButtonRef}
          onSuccess={(donorUsername) =>
            setToast({ show: true, donorUsername })
          }
        />

        {toast.show && toast.donorUsername && (
          <div
            className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-stone-200 bg-white px-4 py-3 shadow-lg"
            role="status"
            aria-live="polite"
          >
            <p className="text-stone-800">
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

        {/* Sidebar placeholder for lg sticky widget (FR-007/FR-009) */}
        <div className="lg:col-span-1" />
      </div>

      {/* Below-the-fold: story */}
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-xl font-semibold text-stone-900 mb-4">Story</h2>
        <div className="prose prose-stone max-w-none text-stone-700">
          {formatStory(fundraiser.story)}
        </div>
      </section>

      {/* Recent donors (top 5) */}
      {topDonors.length > 0 && (
        <section className="border-t border-stone-200 pt-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Recent donors
          </h2>
          <ul className="flex flex-wrap gap-4">
            {topDonors.map((u) => (
              <li key={u.id}>
                <Link
                  href={`/u/${u.username}`}
                  className="flex items-center gap-2 text-stone-700 hover:text-primary"
                >
                  <UserAvatar src={u.avatar} size={40} />
                  <span className="font-medium">{u.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Organizer updates */}
      {fundraiser.updates.length > 0 && (
        <section className="border-t border-stone-200 pt-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">Updates</h2>
          <ul className="space-y-4">
            {fundraiser.updates.map((up) => (
              <li key={up.id} className="rounded-lg bg-stone-50 p-4">
                <time
                  dateTime={up.date}
                  className="text-sm text-stone-500 block mb-1"
                >
                  {new Date(up.date).toLocaleDateString()}
                </time>
                <p className="text-stone-700">{up.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Parent community badge */}
      {community && (
        <section className="border-t border-stone-200 pt-8">
          <p className="text-sm text-stone-600 mb-2">Part of the community</p>
          <Link
            href={`/communities/${community.slug}`}
            className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-stone-700 hover:bg-stone-50"
          >
            <span className="font-medium">{community.name}</span>
          </Link>
        </section>
      )}

      {/* Related fundraisers (3) */}
      {related.length > 0 && (
        <section className="border-t border-stone-200 pt-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Related fundraisers in this community
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((f) => (
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
    </article>
  );
}

export default function FundraiserPageContent({ slug }: { slug: string }) {
  return <FundraiserBySlug slug={slug} />;
}
