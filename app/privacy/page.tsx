import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      <section className="soft-card p-10">
        <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-4 font-bold">
          Legal
        </p>
        <h1 className="text-5xl mb-2 text-[#4a3f44]">Privacy Policy</h1>
        <p className="text-sm text-[#7b6870] mb-8">Last updated: May 2025</p>

        <div className="space-y-8 text-[#5a4550] text-sm leading-relaxed">
          <div>
            <p>
              At Veronica Method, we take your privacy seriously. This policy explains what data we collect,
              how we use it, and your rights regarding your personal information.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">1. Data We Collect</h2>
            <p className="mb-3">We collect the following information when you use our service:</p>
            <ul className="space-y-2 ml-4">
              <li><strong>Account data:</strong> Email address and encrypted password for authentication.</li>
              <li><strong>Assessment data:</strong> Age, height, weight, activity level, symptoms, and goals from your wellness quiz.</li>
              <li><strong>Usage data:</strong> Daily check-ins (sleep, energy, stress scores), completed sessions, journal entries, and favorites.</li>
              <li><strong>Payment data:</strong> Processed securely by LemonSqueezy. We never store your card details.</li>
              <li><strong>Device data:</strong> Browser type and push notification subscription (if enabled).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">2. How We Use Your Data</h2>
            <ul className="space-y-2 ml-4">
              <li>Personalize your exercise program, meal plans, and supplement recommendations.</li>
              <li>Track your progress and generate weekly reports.</li>
              <li>Send you reminders and wellness emails (if opted in).</li>
              <li>Improve our service based on aggregated, anonymized usage patterns.</li>
            </ul>
            <p className="mt-3"><strong>We never sell your data to third parties.</strong></p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">3. Data Storage & Security</h2>
            <ul className="space-y-2 ml-4">
              <li>Data is stored securely on Supabase (PostgreSQL) with row-level security policies.</li>
              <li>All connections use HTTPS/TLS encryption.</li>
              <li>Passwords are hashed using bcrypt (we cannot see your password).</li>
              <li>API routes are protected with authentication and rate limiting.</li>
              <li>Some data is cached locally on your device for offline access.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">4. Your Rights (GDPR)</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="space-y-2 ml-4">
              <li><strong>Access:</strong> Download all your data at any time from your Account page.</li>
              <li><strong>Rectification:</strong> Update your profile and quiz data at any time.</li>
              <li><strong>Erasure:</strong> Delete your account and all associated data permanently.</li>
              <li><strong>Portability:</strong> Export your data in JSON format.</li>
              <li><strong>Withdraw consent:</strong> Unsubscribe from emails or disable notifications at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, visit your <Link href="/account" className="text-[#a8687a] underline">Account page</Link> or <Link href="/contact" className="text-[#a8687a] underline">contact us</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">5. Cookies & Analytics</h2>
            <p>
              We use minimal cookies for authentication only. We use Plausible Analytics (privacy-friendly,
              no cookies, GDPR compliant) to understand how our service is used. No personal data is shared
              with analytics providers.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">6. Third-Party Services</h2>
            <ul className="space-y-2 ml-4">
              <li><strong>Supabase:</strong> Authentication and database (EU servers).</li>
              <li><strong>LemonSqueezy:</strong> Payment processing (PCI compliant).</li>
              <li><strong>Vercel:</strong> Hosting and content delivery.</li>
              <li><strong>Resend:</strong> Transactional emails (if enabled).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">7. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. If you delete your account,
              all data is permanently removed within 30 days. Anonymized, aggregated data may be retained
              for service improvement.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">8. Children</h2>
            <p>
              Veronica Method is designed for women aged 40+. We do not knowingly collect data from
              anyone under 18 years of age.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Significant changes will be communicated
              via email or in-app notification.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#4a3f44] mb-3">10. Contact</h2>
            <p>
              For privacy-related questions, contact us at{" "}
              <Link href="/contact" className="text-[#a8687a] underline">our contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
