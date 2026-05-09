import { SkeletonCard, SkeletonLine } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-6 pb-8">
      <div className="grid lg:grid-cols-2 gap-6 items-center animate-pulse">
        <div className="space-y-4">
          <SkeletonLine className="h-5 w-48 rounded-full" />
          <SkeletonLine className="h-14 w-full" />
          <SkeletonLine className="h-14 w-3/4" />
          <SkeletonLine className="h-14 w-1/2" />
          <SkeletonLine className="h-5 w-full" />
          <div className="flex gap-3">
            <SkeletonLine className="h-12 w-40 rounded-full" />
            <SkeletonLine className="h-12 w-40 rounded-full" />
          </div>
        </div>
        <SkeletonCard />
      </div>
    </div>
  );
}
