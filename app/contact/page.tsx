"use client";

import { useState } from "react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }

    // Šalji na leads API
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "contact_form" }),
      });
    } catch { /* ne blokiramo UX */ }

    // Šalji email notifikaciju (ako je Resend podešen)
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "welcome",
          to: email,
          data: { name: email.split("@")[0] },
        }),
      });
    } catch { /* ne blokiramo */ }

    setDone(true);
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      <section className="soft-card p-10">
        {!done ? (
          <>
            <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-4 font-bold">
              Get In Touch
            </p>
            <h1 className="text-5xl mb-4 text-[#4a3f44]">Contact Us</h1>
            <p className="text-[#7b6870] text-lg mb-8">
              Have a question or want to learn more? We&apos;d love to hear from
              you.
            </p>

            <form onSubmit={submit} className="space-y-5">
              <div>
                <label
                  htmlFor="contact-email"
                  className="text-[10px] uppercase font-bold text-[#b98fa1] tracking-widest ml-1"
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full mt-1 p-4 rounded-2xl border border-[#ead8de] outline-none focus:border-[#d6a7b1] transition-colors"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="text-[10px] uppercase font-bold text-[#b98fa1] tracking-widest ml-1"
                >
                  Message (optional)
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help..."
                  rows={4}
                  className="w-full mt-1 p-4 rounded-2xl border border-[#ead8de] outline-none focus:border-[#d6a7b1] transition-colors resize-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-4">
                Send Message
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="text-5xl mb-6">🌸</div>
            <h2 className="text-4xl mb-4 text-[#4a3f44]">
              Thank you!
            </h2>
            <p className="text-[#7b6870] text-lg">
              We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        )}
      </section>

      {/* QUICK INFO */}
      <section className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="soft-card p-5 text-center">
          <div className="text-2xl mb-2">📧</div>
          <p className="text-sm font-medium text-[#4a3f44]">Email</p>
          <p className="text-xs text-[#7b6870]">hello@veronica-method.com</p>
        </div>
        <div className="soft-card p-5 text-center">
          <div className="text-2xl mb-2">⏰</div>
          <p className="text-sm font-medium text-[#4a3f44]">Response Time</p>
          <p className="text-xs text-[#7b6870]">Within 24 hours</p>
        </div>
        <div className="soft-card p-5 text-center">
          <div className="text-2xl mb-2">📱</div>
          <p className="text-sm font-medium text-[#4a3f44]">Instagram</p>
          <a href="https://instagram.com/veronica_menopause_program" target="_blank" rel="noopener noreferrer" className="text-xs text-[#b98fa1] hover:underline">
            @veronica_menopause_program
          </a>
        </div>
      </section>
    </main>
  );
}
