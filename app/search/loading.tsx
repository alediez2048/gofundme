import Skeleton, { FundraiserCardSkeleton } from "@/components/Skeleton";

/** FR-017: Search page loading skeleton. */
export default function SearchLoading() {
  return (
    <div className="animate-fadeIn space-y-8">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-64" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <FundraiserCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
