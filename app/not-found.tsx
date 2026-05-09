import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="soft-card p-10 max-w-md text-center">
        <div className="text-6xl mb-4">🌸</div>
        <h1 className="text-5xl mb-2 text-[#4a3f44]">Page Not Found</h1>
        <p className="text-[#5a4550] mb-6">
          This page doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link href="/" className="btn-primary px-6">
            Home
          </Link>
          <Link href="/dashboard" className="btn-outline px-6">
            Dashboard
          </Link>
          <Link href="/quiz" className="btn-outline px-6">
            Take Quiz
          </Link>
        </div>

        <div className="pt-6 border-t border-[#f0e3e8]">
          <p className="text-xs text-[#8f6878] mb-3">Looking for something specific?</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              ["Blog", "/blog"],
              ["Pricing", "/pricing"],
              ["Nutrition", "/nutrition"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-xs px-3 py-1.5 rounded-full bg-[#fdf2f5] text-[#8f6878] border border-[#f0e3e8] hover:border-[#d8a7b5] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
