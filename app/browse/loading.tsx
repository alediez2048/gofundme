import Skeleton, { FundraiserGridSkeleton } from "@/components/Skeleton";

/** FR-017: Browse page loading skeleton. */
export default function BrowseLoading() {
  return (
    <div className="animate-fadeIn space-y-8">
      <Skeleton className="h-4 w-32" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>
      <FundraiserGridSkeleton count={6} />
    </div>
  );
}
