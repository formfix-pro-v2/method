"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type QuizData = {
  // Personal
  name: string;
  // Nutrition-critical fields
  age: string;
  height: string;
  weight: string;
  activity: string;
  goal: string;
  
  // Program-critical fields
  time: string;
  symptoms: string[];
  severity: Record<string, number>;
  confidence: number;
  sleep: number;
};

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="animate-pulse text-[#b98fa1]">Loading...</div></div>}>
      <QuizContent />
    </Suspense>
  );
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Track affiliate and referral codes
  useEffect(() => {
    const aff = searchParams.get("aff");
    const ref = searchParams.get("ref");
    if (aff) localStorage.setItem("affiliateRef", aff);
    if (ref) localStorage.setItem("referredBy", ref);
  }, [searchParams]);

  const [step, setStep] = useState(1);

  const [form, setForm] = useState<QuizData>({
    name: "",
    age: "48",
    height: "168",
    weight: "72",
    activity: "light",
    goal: "tone",
    time: "20 min",
    symptoms: [],
    severity: {},
    confidence: 5,
    sleep: 5,
  });

  const totalSteps = 7; // Povećali smo broj koraka za biometriju

  const activityOptions = [
    { id: "sedentary", label: "Sedentary", desc: "Office job, little exercise" },
    { id: "light", label: "Lightly Active", desc: "1-3 days of light movement" },
    { id: "moderate", label: "Moderately Active", desc: "3-5 days of exercise" },
    { id: "active", label: "Very Active", desc: "6-7 days of intense sport" },
  ];

  const goals = [
    { id: "fat_loss", label: "Lose belly fat" },
    { id: "tone", label: "Tone & Sculpt" },
    { id: "energy", label: "Boost Energy" },
    { id: "maintain", label: "Hormone Balance" },
  ];

  const symptomOptions = [
    "Hot flashes", "Poor sleep", "Weight gain", "Low energy", 
    "Joint pain", "Bloating", "Back pain", "Mood swings",
    "Incontinence", "Pelvic prolapse"
  ];

  function next() {
    // Validacija (opciono, ali dobro za UX)
    if (step === 1 && (!form.age || !form.height || !form.weight)) return;
    
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    localStorage.setItem("quizData", JSON.stringify(form));
    localStorage.setItem("day", "1");
    router.push("/onboarding");
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  function toggleSymptom(item: string) {
    if (form.symptoms.includes(item)) {
      const nextSymptoms = form.symptoms.filter((x) => x !== item);
      const sev = { ...form.severity };
      delete sev[item];
      setForm({ ...form, symptoms: nextSymptoms, severity: sev });
    } else {
      setForm({
        ...form,
        symptoms: [...form.symptoms, item],
        severity: { ...form.severity, [item]: 3 },
      });
    }
  }

  const progress = useMemo(() => (step / totalSteps) * 100, [step]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      {/* HEADER */}
      <section className="soft-card p-8 mb-8 border border-[#f0e3e8]">
        <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-4 font-bold">
          Step {step} of {totalSteps}
        </p>

        <div className="h-2 bg-white rounded-full overflow-hidden border border-[#f0e3e8]">
          <div
            className="h-full bg-[#d6a7b1] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* STEP 1: NAME + BIOMETRICS */}
      {step === 1 && (
        <section className="soft-card p-8 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-3xl text-[#4a3f44] mb-8">Tell us about yourself</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm text-[#b98fa1] mb-2 font-bold uppercase tracking-widest">Your First Name</label>
              <input 
                type="text" 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full p-4 rounded-2xl border border-[#f0e3e8] outline-none focus:border-[#d6a7b1]"
                placeholder="e.g. Maria"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm text-[#b98fa1] mb-2 font-bold uppercase tracking-widest">Age</label>
              <input 
                type="number" 
                value={form.age}
                onChange={(e) => setForm({...form, age: e.target.value})}
                className="w-full p-4 rounded-2xl border border-[#f0e3e8] outline-none focus:border-[#d6a7b1]"
                placeholder="e.g. 48"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#b98fa1] mb-2 font-bold uppercase tracking-widest">Height (cm)</label>
                <input 
                  type="number" 
                  value={form.height}
                  onChange={(e) => setForm({...form, height: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-[#f0e3e8] outline-none focus:border-[#d6a7b1]"
                  placeholder="168"
                />
              </div>
              <div>
                <label className="block text-sm text-[#b98fa1] mb-2 font-bold uppercase tracking-widest">Weight (kg)</label>
                <input 
                  type="number" 
                  value={form.weight}
                  onChange={(e) => setForm({...form, weight: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-[#f0e3e8] outline-none focus:border-[#d6a7b1]"
                  placeholder="72"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STEP 2: ACTIVITY LEVEL */}
      {step === 2 && (
        <section className="soft-card p-8 animate-in fade-in">
          <h2 className="text-3xl text-[#4a3f44] mb-8">How active are you?</h2>
          <div className="grid gap-4">
            {activityOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setForm({ ...form, activity: opt.id })}
                className={`p-6 rounded-3xl border text-left transition-all ${
                  form.activity === opt.id ? "bg-[#fdf2f5] border-[#d6a7b1] shadow-sm" : "bg-white border-[#f0e3e8]"
                }`}
              >
                <div className="font-semibold text-[#4a3f44]">{opt.label}</div>
                <div className="text-sm text-[#7b6870]">{opt.desc}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* STEP 3: GOALS */}
      {step === 3 && (
        <section className="soft-card p-8 animate-in fade-in">
          <h2 className="text-3xl text-[#4a3f44] mb-8">Your primary goal?</h2>
          <div className="grid gap-4">
            {goals.map((g) => (
              <button
                key={g.id}
                onClick={() => setForm({ ...form, goal: g.id })}
                className={`p-6 rounded-3xl border text-left transition-all ${
                  form.goal === g.id ? "bg-[#fdf2f5] border-[#d6a7b1]" : "bg-white border-[#f0e3e8]"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* STEP 4: SYMPTOMS (Multi-select) */}
      {step === 4 && (
        <section className="soft-card p-8 animate-in fade-in">
          <h2 className="text-3xl text-[#4a3f44] mb-8">What are you feeling?</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {symptomOptions.map((s) => (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  form.symptoms.includes(s) ? "bg-[#fdf2f5] border-[#d6a7b1]" : "bg-white border-[#f0e3e8]"
                }`}
              >
                {form.symptoms.includes(s) ? "✨ " : ""}{s}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* STEP 5: INTENSITY */}
      {step === 5 && (
        <section className="soft-card p-8 animate-in fade-in">
          <h2 className="text-3xl text-[#4a3f44] mb-8">Symptom Intensity</h2>
          <div className="space-y-8">
            {form.symptoms.map((s) => (
              <div key={s}>
                <div className="flex justify-between text-sm mb-2 font-bold text-[#4a3f44] uppercase tracking-widest">
                  <span>{s}</span>
                  <span>{form.severity[s]}/5</span>
                </div>
                <input
                  type="range" min="1" max="5"
                  value={form.severity[s] || 3}
                  onChange={(e) => setForm({
                    ...form,
                    severity: { ...form.severity, [s]: Number(e.target.value) }
                  })}
                  className="w-full accent-[#d6a7b1]"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STEP 6: TIME & LIFESTYLE */}
      {step === 6 && (
        <section className="soft-card p-8 animate-in fade-in">
          <h2 className="text-3xl text-[#4a3f44] mb-8">Lifestyle Snapshot</h2>
          <div className="space-y-8">
            <div>
              <p className="mb-4 text-[#5a4550]">Training time available per day?</p>
              <div className="flex gap-4">
                {["10 min", "20 min", "30 min"].map(t => (
                  <button key={t} onClick={() => setForm({...form, time: t})}
                    className={`flex-1 py-3 rounded-xl border ${form.time === t ? "bg-[#a8687a] text-white border-[#a8687a]" : "bg-white text-[#5a4550] border-[#f0e3e8]"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[#5a4550]">Sleep Quality ({form.sleep}/10)</p>
              <input type="range" min="1" max="10" value={form.sleep} onChange={(e) => setForm({...form, sleep: Number(e.target.value)})} className="w-full accent-[#a8687a]" />
            </div>
            <div>
              <p className="mb-2 text-[#5a4550]">Body Confidence ({form.confidence}/10)</p>
              <input type="range" min="1" max="10" value={form.confidence} onChange={(e) => setForm({...form, confidence: Number(e.target.value)})} className="w-full accent-[#a8687a]" />
              <div className="flex justify-between text-[10px] text-[#7b6870] mt-1">
                <span>Very low</span>
                <span>Very confident</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STEP 7: FINAL (Confirmation) */}
      {step === 7 && (
        <section className="soft-card p-10 text-center animate-in zoom-in-95">
          <div className="text-6xl mb-6">🥗</div>
          <h2 className="text-3xl text-[#4a3f44] mb-4">Almost there!</h2>
          <p className="text-[#7b6870] max-w-sm mx-auto mb-8">
            We've calculated your metabolic rate and budget-friendly hormone menu. Ready to see your dashboard?
          </p>
        </section>
      )}

      {/* NAV */}
      <section className="flex justify-between mt-8">
        <button onClick={back} className="btn-outline px-8 py-3 rounded-2xl">Back</button>
        <button onClick={next} className="btn-primary px-10 py-3 rounded-2xl shadow-md">
          {step === totalSteps ? "Generate My Plan" : "Continue"}
        </button>
      </section>
    </main>
  );
}
