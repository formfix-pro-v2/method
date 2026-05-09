import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#f0e3e8]/50" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f8d8df] to-[#d5a6b1] flex items-center justify-center">
                <span className="text-white text-xs font-bold">V</span>
              </div>
              <span className="text-xl font-semibold text-[#7f5665]">
                Veronica Method
              </span>
            </div>
            <p className="text-sm text-[#7b6870] leading-relaxed">
              The complete menopause program: personalized exercises, budget
              nutrition and supplement guidance for women after 40.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-[#4a3f44] uppercase tracking-widest mb-3">
              Quick Links
            </h4>
            <nav aria-label="Quick links" className="flex flex-col gap-2">
              {[
                ["Dashboard", "/dashboard"],
                ["Assessment", "/quiz"],
                ["Blog", "/blog"],
                ["Progress", "/progress"],
                ["Shopping List", "/shopping"],
                ["Nutrition", "/nutrition"],
                ["Download App", "/download"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-[#7b6870] hover:text-[#d8a7b5] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-[#4a3f44] uppercase tracking-widest mb-3">
              Legal
            </h4>
            <nav aria-label="Legal links" className="flex flex-col gap-2">
              {[
                ["Privacy Policy", "/privacy"],
                ["Terms of Service", "/terms"],
                ["Contact", "/contact"],
                ["Become an Affiliate", "/affiliate"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-[#7b6870] hover:text-[#d8a7b5] transition-colors"
                >
                  {label}
                </Link>
              ))}
              <a
                href="https://instagram.com/veronica_menopause_program"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#7b6870] hover:text-[#d8a7b5] transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Instagram
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#f0e3e8]/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#b98fa1]">
            © {new Date().getFullYear()} Veronica Method. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#7d5565]">Scan to get the app:</span>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://veronica-method.vercel.app/download&color=6b3a4d&bgcolor=ffffff"
              alt="QR code"
              width={60}
              height={60}
              className="rounded-lg border border-[#f0e3e8]"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
