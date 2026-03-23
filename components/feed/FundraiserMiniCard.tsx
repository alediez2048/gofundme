"use client";

import Link from "next/link";
import Image from "next/image";
import { useFundRightStore } from "@/lib/store";
import ProgressBar from "@/components/ProgressBar";
import { BLUR_DATA_URL } from "@/lib/utils";

function formatCurrency(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  return `$${amount.toLocaleString()}`;
}

interface FundraiserMiniCardProps {
  fundraiserId: string;
}

export default function FundraiserMiniCard({ fundraiserId }: FundraiserMiniCardProps) {
  const fundraiser = useFundRightStore((s) => s.fundraisers[fundraiserId]);

  if (!fundraiser) return null;

  return (
    <Link
      href={`/f/${fundraiser.slug}`}
      aria-label={`${fundraiser.title} — ${formatCurrency(fundraiser.raisedAmount)} raised of ${formatCurrency(fundraiser.goalAmount)} goal`}
      className="gfm-feed-card block overflow-hidden transition-transform duration-150 hover:-translate-y-0.5"
    >
      <div className="flex items-stretch">
        {fundraiser.heroImageUrl && (
          <div className="relative h-[104px] w-[112px] shrink-0 bg-stone-200">
            <Image
              src={fundraiser.heroImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="112px"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
          <div>
            <p className="line-clamp-2 text-[16px] leading-6 text-[#232323]">
              {fundraiser.title}
            </p>
          </div>
          <div className="mt-3">
            <ProgressBar raised={fundraiser.raisedAmount} goal={fundraiser.goalAmount} />
          </div>
          <p className="mt-2 text-[14px] leading-5 text-[#b7b7b6]">
            <span className="text-[#232323]">{formatCurrency(fundraiser.raisedAmount)}</span>
            {" "}raised of {formatCurrency(fundraiser.goalAmount)}
          </p>
        </div>
      </div>
    </Link>
  );
}
