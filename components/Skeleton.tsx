/**
 * FR-017: Skeleton loader — pulsing gray rectangles for loading states.
 * Use via variants or custom width/height for flexible placeholder shapes.
 */

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  );
}

/** Card skeleton matching FundraiserCard layout. */
export function FundraiserCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

/** Grid of card skeletons for browse/home pages. */
export function FundraiserGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <FundraiserCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Donor wall skeleton — row of avatar circles with names. */
export function DonorWallSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

/** Profile stats skeleton — stat boxes in a row. */
export function ProfileStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="space-y-2 text-center">
          <Skeleton className="mx-auto h-4 w-16" />
          <Skeleton className="mx-auto h-6 w-12" />
        </div>
      ))}
    </div>
  );
}

/** Community banner + info skeleton. */
export function CommunityHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[21/9] w-full rounded-xl" />
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-6 w-24 rounded-full" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="space-y-2 text-center">
            <Skeleton className="mx-auto h-4 w-16" />
            <Skeleton className="mx-auto h-6 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
