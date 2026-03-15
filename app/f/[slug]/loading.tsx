import Skeleton from "@/components/Skeleton";
import { DonorWallSkeleton } from "@/components/Skeleton";

/** FR-017: Fundraiser page loading skeleton. */
export default function FundraiserLoading() {
  return (
    <div className="animate-fadeIn space-y-8">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="aspect-[21/9] w-full rounded-xl" />
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
      </div>
      <div className="space-y-4 border-t border-stone-200 pt-6">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="space-y-4 border-t border-stone-200 pt-6">
        <Skeleton className="h-6 w-32" />
        <DonorWallSkeleton count={5} />
      </div>
    </div>
  );
}
