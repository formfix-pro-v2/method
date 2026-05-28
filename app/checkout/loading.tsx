export default function CheckoutLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="soft-card p-8 animate-pulse">
            <div className="h-4 w-24 bg-[#f0e3e8] rounded mb-4" />
            <div className="h-10 w-48 bg-[#f0e3e8] rounded mb-4" />
            <div className="h-4 w-full bg-[#f0e3e8] rounded" />
          </div>
        </div>
        <div className="soft-card p-10 animate-pulse">
          <div className="h-6 w-40 bg-[#f0e3e8] rounded mb-8" />
          <div className="space-y-4">
            <div className="h-12 w-full bg-[#f0e3e8] rounded-2xl" />
            <div className="h-12 w-full bg-[#f0e3e8] rounded-2xl" />
            <div className="h-14 w-full bg-[#f0e3e8] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
