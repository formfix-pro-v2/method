export function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-[#f0e3e8]/60 ${className}`} />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`soft-card p-8 animate-pulse ${className}`}>
      <SkeletonLine className="h-3 w-24 mb-4" />
      <SkeletonLine className="h-8 w-3/4 mb-3" />
      <SkeletonLine className="h-4 w-full mb-2" />
      <SkeletonLine className="h-4 w-2/3" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <SkeletonLine className="h-7 w-48" />
        <div className="flex gap-3">
          <SkeletonLine className="h-9 w-32 rounded-full" />
          <SkeletonLine className="h-9 w-24 rounded-full" />
        </div>
      </div>

      <SkeletonCard className="mb-6" />

      <div className="soft-card p-8 mb-6 animate-pulse">
        <div className="flex justify-between mb-8">
          <div>
            <SkeletonLine className="h-3 w-32 mb-3" />
            <SkeletonLine className="h-7 w-64" />
          </div>
          <SkeletonLine className="h-20 w-36 rounded-3xl" />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#f0e3e8]/20">
              <SkeletonLine className="h-3 w-16 mx-auto mb-2" />
              <SkeletonLine className="h-7 w-12 mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-[30px] bg-[#f0e3e8]/20">
              <SkeletonLine className="h-3 w-20 mb-3" />
              <SkeletonLine className="h-5 w-40 mb-2" />
              <SkeletonLine className="h-3 w-32 mb-4" />
              <SkeletonLine className="h-3 w-full mb-1" />
              <SkeletonLine className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SessionSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="soft-card p-10 text-center mb-8 animate-pulse">
        <SkeletonLine className="h-3 w-24 mx-auto mb-4" />
        <SkeletonLine className="h-10 w-72 mx-auto mb-3" />
        <SkeletonLine className="h-4 w-48 mx-auto mb-8" />
        <SkeletonLine className="w-40 h-40 rounded-full mx-auto" />
      </div>
      <SkeletonCard />
    </div>
  );
}
