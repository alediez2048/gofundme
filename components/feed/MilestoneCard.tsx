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
      <div className="bg-gradient-to-br from-[#b2f5d8] via-[#6ee7a8] to-gfm-green rounded-card-sm p-4 text-center">
        <p className="text-3xl font-bold text-white">{percentage ?? "Milestone"}</p>
        <p className="text-sm text-white/90 font-medium mt-1">
          {fundraiser?.title ?? "Fundraiser"} reached {percentage} of its goal!
        </p>
      </div>
      {fundraiser && (
        <div className="px-1">
          <ProgressBar raised={amount ?? fundraiser.raisedAmount} goal={goalAmount} />
          <p className="text-xs text-feed-text-secondary mt-1">
            <span className="font-semibold text-feed-text-heading">
              ${(amount ?? fundraiser.raisedAmount).toLocaleString()}
            </span>{" "}
            raised of ${goalAmount.toLocaleString()} goal
          </p>
        </div>
      )}
    </div>
  );
});
