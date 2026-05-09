import { SkeletonLine } from "@/components/Skeleton";

export default function ProgressLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14 animate-pulse">
      <div className="soft-card p-10 mb-8">
        <SkeletonLine className="h-3 w-24 mb-4" />
        <SkeletonLine className="h-10 w-64 mb-3" />
        <SkeletonLine className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="soft-card p-6 text-center">
            <SkeletonLine className="h-2 w-16 mx-auto mb-3" />
            <SkeletonLine className="h-9 w-12 mx-auto" />
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="soft-card p-8">
          <SkeletonLine className="h-6 w-40 mb-4" />
          <SkeletonLine className="h-32 w-full rounded-xl" />
        </div>
        <div className="soft-card p-8">
          <SkeletonLine className="h-6 w-40 mb-4" />
          <SkeletonLine className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
