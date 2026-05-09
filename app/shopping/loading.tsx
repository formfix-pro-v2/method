import { SkeletonLine } from "@/components/Skeleton";

export default function ShoppingLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-14 animate-pulse">
      <div className="soft-card p-10 mb-8">
        <SkeletonLine className="h-3 w-24 mb-4" />
        <SkeletonLine className="h-10 w-56 mb-3" />
        <SkeletonLine className="h-4 w-80" />
      </div>
      <div className="soft-card p-6 mb-8">
        <div className="flex justify-between">
          <SkeletonLine className="h-8 w-48" />
          <SkeletonLine className="h-8 w-24" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="soft-card p-6 mb-4">
          <SkeletonLine className="h-5 w-36 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((j) => (
              <SkeletonLine key={j} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
