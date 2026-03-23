"use client";

import { memo } from "react";
import type { FeedEvent } from "@/lib/data";
import { useFundRightStore } from "@/lib/store";
import ProgressBar from "@/components/ProgressBar";

interface MilestoneCardProps {
  event: FeedEvent;
}

export default memo(function MilestoneCard({ event }: MilestoneCardProps) {
  const fundraiser = useFundRightStore((s) =>
    event.fundraiserId ? s.fundraisers[event.fundraiserId] : undefined
  );

  const percentage = event.metadata.percentage as string | undefined;
  const amount = event.metadata.amount as number | undefined;
  const goalAmount = (event.metadata.goalAmount as number) ?? fundraiser?.goalAmount ?? 0;

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-[#e9fcce] p-4 text-center">
        <p className="gfm-feed-heading-lg text-brand-strong">{percentage ?? "Milestone"}</p>
        <p className="mt-1 text-[16px] leading-6 text-[#232323]">
          {fundraiser?.title ?? "Fundraiser"} reached {percentage} of its goal!
        </p>
      </div>
      {fundraiser && (
        <div className="px-1">
          <ProgressBar raised={amount ?? fundraiser.raisedAmount} goal={goalAmount} />
          <p className="mt-2 text-[14px] leading-5 text-[#b7b7b6]">
            <span className="text-[#232323]">
              ${(amount ?? fundraiser.raisedAmount).toLocaleString()}
            </span>{" "}
            raised of ${goalAmount.toLocaleString()} goal
          </p>
        </div>
      )}
    </div>
  );
});
