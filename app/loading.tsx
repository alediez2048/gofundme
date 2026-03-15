import { FundraiserGridSkeleton } from "@/components/Skeleton";
import Skeleton from "@/components/Skeleton";

/** FR-017: Homepage loading skeleton. */
export default function HomeLoading() {
  return (
    <div className="animate-fadeIn space-y-8 sm:space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <Skeleton className="mx-auto h-10 w-3/4 max-w-lg" />
        <Skeleton className="mx-auto h-5 w-1/2 max-w-sm" />
        <Skeleton className="mx-auto h-12 w-40 rounded-lg" />
      </div>
      {/* Stats */}
      <Skeleton className="h-24 w-full rounded-xl" />
      {/* Trending grid */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <FundraiserGridSkeleton count={4} />
      </div>
    </div>
  );
}
