import { SkeletonLine, SkeletonCard } from "@/components/Skeleton";

export default function NutritionLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14 animate-pulse">
      <div className="soft-card p-10 mb-8">
        <SkeletonLine className="h-3 w-28 mb-4" />
        <SkeletonLine className="h-10 w-72 mb-3" />
        <SkeletonLine className="h-4 w-96" />
      </div>
      <SkeletonCard className="mb-8" />
      <div className="grid md:grid-cols-4 gap-5 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="soft-card p-6 text-center">
            <SkeletonLine className="h-2 w-14 mx-auto mb-3" />
            <SkeletonLine className="h-8 w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
