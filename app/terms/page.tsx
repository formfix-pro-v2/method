import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      <section className="soft-card p-10">
        <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-4 font-bold">
          Legal
        </p>
        <h1 className="text-5xl mb-2 text-[#4a3f44]">Terms of Service</h1>
        <p className="text-sm text-[#7b6870] mb-8">Last updated: May 2025</p>

        <div className="space-y-8 text-[#5a4550] text-sm leading-relaxed">
          <div>
            <p>
              By using Veronica Method, you agree to these terms. Please read them carefully.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">1. Service Description</h2>
            <p>
              Veronica Method is a digital wellness platform providing personalized exercise programs,
              meal plans, supplement guidance, and progress tracking for women experiencing menopause.
              The service is delivered via web application and mobile app.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">2. Medical Disclaimer</h2>
            <p className="mb-3">
              <strong>Veronica Method is not a medical service.</strong> Our content is for informational
              and educational purposes only. It does not constitute medical advice, diagnosis, or treatment.
            </p>
            <ul className="space-y-2 ml-4">
              <li>Always consult your doctor before starting any exercise program.</li>
              <li>Always consult your doctor before taking supplements, especially if you take medication.</li>
              <li>Stop exercising immediately if you experience pain, dizziness, or discomfort.</li>
              <li>Our pelvic floor exercises are informational — see a pelvic physiotherapist for clinical assessment.</li>
              <li>Meal plans are general guidance — consult a dietitian for specific medical dietary needs.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">3. Accounts</h2>
            <ul className="space-y-2 ml-4">
              <li>You must be at least 18 years old to create an account.</li>
              <li>You are responsible for maintaining the security of your account.</li>
              <li>One account per person. Do not share your login credentials.</li>
              <li>We reserve the right to suspend accounts that violate these terms.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">4. Free & Premium Plans</h2>
            <ul className="space-y-2 ml-4">
              <li><strong>Free plan:</strong> 7 days of exercises, Day 1 meal plan, supplement guide preview, progress tracking.</li>
              <li><strong>Glow plan (€29):</strong> 30 days of full access to all features.</li>
              <li><strong>Elite plan (€79):</strong> 90 days of full access with advanced features.</li>
              <li>All premium plans are one-time payments, not subscriptions.</li>
              <li>Access expires after the plan duration (30 or 90 days from purchase).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">5. Payments</h2>
            <ul className="space-y-2 ml-4">
              <li>Payments are processed securely by LemonSqueezy.</li>
              <li>Prices are in EUR and include applicable taxes.</li>
              <li>You will receive a receipt via email after purchase.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">6. Intellectual Property</h2>
            <p>
              All content (exercises, meal plans, recipes, text, images, code) is owned by Veronica Method.
              You may not copy, redistribute, or resell any content without written permission.
              Personal use within the app is permitted.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">7. Affiliate Program</h2>
            <ul className="space-y-2 ml-4">
              <li>Affiliates earn 25% commission on referred sales.</li>
              <li>Self-referrals are not permitted.</li>
              <li>We reserve the right to terminate affiliate accounts for fraudulent activity.</li>
              <li>Commission payouts are processed monthly.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">8. Limitation of Liability</h2>
            <p>
              Veronica Method is provided &ldquo;as is&rdquo; without warranties. We are not liable for any
              injuries, health issues, or damages arising from use of our exercises, meal plans, or
              supplement recommendations. Use at your own risk and always consult healthcare professionals.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">9. Termination</h2>
            <p>
              You may delete your account at any time from your Account page. We may terminate accounts
              that violate these terms. Upon termination, your data will be deleted per our Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">10. Changes</h2>
            <p>
              We may update these terms from time to time. Continued use of the service after changes
              constitutes acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">11. Contact</h2>
            <p>
              Questions about these terms? <Link href="/contact" className="text-[#a8687a] underline">Contact us</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
