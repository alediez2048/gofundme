import Skeleton, { ProfileStatsSkeleton } from "@/components/Skeleton";

/** FR-017: Profile page loading skeleton. */
export default function ProfileLoading() {
  return (
    <div className="animate-fadeIn space-y-8">
      <Skeleton className="h-4 w-32" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-4 w-full max-w-md" />
      <ProfileStatsSkeleton />
      <div className="space-y-4 border-t border-stone-200 pt-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
