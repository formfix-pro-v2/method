export default function RefundPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      <section className="soft-card p-10">
        <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-4 font-bold">
          Refund Policy
        </p>
        <h1 className="text-5xl mb-6 text-[#4a3f44]">30-Day Money-Back Guarantee</h1>

        <div className="space-y-8 text-[#6f5a62] leading-relaxed">
          <p className="text-lg">
            We want you to feel confident trying Veronica Method. If our program isn&apos;t the right fit
            for you, we offer a full refund within 30 days of purchase — no questions asked.
          </p>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">How to Request a Refund</h2>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Contact us via our <a href="/contact" className="text-[#d8a7b5] underline hover:text-[#8f5d6f]">Contact page</a> or email within 30 days of your purchase date.</li>
              <li>Include your account email address and the plan you purchased.</li>
              <li>No reason required — we respect your decision.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">Refund Timeline</h2>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Refund requests are processed within 5–10 business days.</li>
              <li>The refund will be returned to your original payment method.</li>
              <li>You will receive an email confirmation once the refund is processed.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">After 30 Days</h2>
            <p>
              Refunds are not available after 30 days from the date of purchase. However, you retain
              full access to your program for the duration of your plan (30 or 90 days).
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">Exceptions</h2>
            <ul className="space-y-2 ml-4 list-disc">
              <li>If you experience a technical issue that prevents you from accessing the program, contact us and we will resolve it or issue a refund regardless of the 30-day window.</li>
              <li>Duplicate purchases are always refunded in full.</li>
            </ul>
          </div>

          <div className="pt-6 border-t border-[#f0e3e8]">
            <p className="text-sm text-[#b98fa1] italic">
              Last updated: May 2026. This policy applies to all purchases made through Veronica Method.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
