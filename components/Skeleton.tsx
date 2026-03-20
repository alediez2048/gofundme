interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-surface-medium ${className}`}
      aria-hidden="true"
    />
  );
}

export function FundraiserCardSkeleton() {
  return (
    <div className="hrt-card">
      <Skeleton className="aspect-[3/2] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-2 w-full rounded-pill" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function FundraiserGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <FundraiserCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DonorWallSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-pill" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

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

export function CommunityHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[21/9] w-full" />
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-6 w-24 rounded-pill" />
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
