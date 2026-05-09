"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getTodayProgram } from "@/lib/programs";
import { useTranslation } from "@/lib/i18n/useTranslation";
import CircularTimer from "@/components/CircularTimer";
import { useSwipe } from "@/lib/hooks/useSwipe";
import { haptic } from "@/lib/haptic";
import { pushSession, pushSingle } from "@/lib/sync";

const CATEGORY_LABELS: Record<string, string> = {
  warmup: "Warm-Up",
  cooldown: "Cool-Down",
  core: "Core",
  lower: "Lower Body",
  upper: "Upper Body",
  mobility: "Mobility",
  balance: "Balance",
  breathing: "Breathing",
  pelvic: "Pelvic Floor",
  posture: "Posture",
};

/**
 * Finds the best British female voice available.
 * Priority: Google UK Female > Microsoft Libby > any en-GB female > any female > any English
 */
function findBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  // Priority list — British female voices across platforms
  const priorities = [
    // Google Chrome
    (v: SpeechSynthesisVoice) => v.name.includes("Google UK English Female"),
    // Microsoft Edge / Windows
    (v: SpeechSynthesisVoice) => v.name.includes("Libby") && v.lang.startsWith("en-GB"),
    (v: SpeechSynthesisVoice) => v.name.includes("Sonia") && v.lang.startsWith("en-GB"),
    (v: SpeechSynthesisVoice) => v.name.includes("Maisie") && v.lang.startsWith("en-GB"),
    // macOS / iOS
    (v: SpeechSynthesisVoice) => v.name.includes("Kate") && v.lang.startsWith("en-GB"),
    (v: SpeechSynthesisVoice) => v.name.includes("Serena") && v.lang.startsWith("en-GB"),
    (v: SpeechSynthesisVoice) => v.name.includes("Martha"),
    // Fallbacks
    (v: SpeechSynthesisVoice) => v.lang === "en-GB" && v.name.toLowerCase().includes("female"),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("en-GB"),
    (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes("female") && v.lang.startsWith("en"),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("en"),
  ];

  for (const test of priorities) {
    const match = voices.find(test);
    if (match) return match;
  }

  return voices[0] || null;
}

export default function SessionPage() {
  const { t } = useTranslation();
  const [day, setDay] = useState(1);
  const [userName, setUserName] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [voiceGuide, setVoiceGuide] = useState(false);

  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const savedDay = localStorage.getItem("day");
    if (savedDay) setDay(Number(savedDay));
    const savedVoice = localStorage.getItem("voiceGuide");
    if (savedVoice === "true") setVoiceGuide(true);
    try { const qd = JSON.parse(localStorage.getItem("quizData") || "{}"); if (qd.name) setUserName(qd.name); } catch {}
  }, []);

  const program = useMemo(() => {
    return getTodayProgram(day);
  }, [day]);

  const current = program.exercises[index];
  const currentTime = current?.seconds || 120;

  // Speak exercise instructions when voice guide is on
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    // Stop speech immediately when paused or not active
    if (!voiceGuide || !started || paused || !current) {
      window.speechSynthesis.cancel();
      return;
    }

    function speak() {
      window.speechSynthesis.cancel();

      const text = `${current.name}. ${current.start}. Then, ${current.end}`;
      const utterance = new SpeechSynthesisUtterance(text);

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const best = findBestVoice(voices);
        if (best) utterance.voice = best;
      }

      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = "en-GB";

      window.speechSynthesis.speak(utterance);
    }

    // Try immediately, retry after delay if voices not loaded
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      speak();
    } else {
      // Some browsers need voiceschanged, others just need a delay
      const handler = () => { speak(); };
      window.speechSynthesis.addEventListener("voiceschanged", handler, { once: true });

      // Fallback: try again after 500ms even without event
      const timeout = setTimeout(() => {
        window.speechSynthesis.removeEventListener("voiceschanged", handler);
        speak();
      }, 500);

      return () => {
        clearTimeout(timeout);
        window.speechSynthesis.removeEventListener("voiceschanged", handler);
        window.speechSynthesis.cancel();
      };
    }

    return () => { window.speechSynthesis.cancel(); };
  }, [index, started, paused, voiceGuide, current]);

  // Reset timer when exercise changes
  useEffect(() => {
    if (current) {
      setTimeLeft(current.seconds);
    }
  }, [index, current]);

  useEffect(() => {
    if (!started || finished || paused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext();
          return current?.seconds || 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, index, finished, paused]);

  // Play soft gong sound when exercise ends
  function playBeep() {
    try {
      const ctx = new AudioContext();

      // Layer 1: deep warm tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.value = 220;
      gain1.gain.setValueAtTime(0.35, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 2.5);

      // Layer 2: mid harmonic shimmer
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.value = 440;
      gain2.gain.setValueAtTime(0.15, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 2.0);

      // Layer 3: high overtone sparkle
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = "sine";
      osc3.frequency.value = 660;
      gain3.gain.setValueAtTime(0.08, ctx.currentTime);
      gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start();
      osc3.stop(ctx.currentTime + 1.5);
    } catch {
      // Audio not supported
    }
  }

  function handleStart() {
    setStarted(true);
    setPaused(false);
    setTimeLeft(current.seconds);
    haptic("light");

    // Unlock speech synthesis on mobile (requires user gesture)
    if ("speechSynthesis" in window && voiceGuide) {
      const unlock = new SpeechSynthesisUtterance("");
      unlock.volume = 0;
      window.speechSynthesis.speak(unlock);
    }
  }

  function handleStop() {
    setPaused(!paused);
    haptic("light");
  }

  function handlePrev() {
    if (index > 0) {
      playBeep();
      haptic("medium");
      setIndex((prev) => prev - 1);
      setPaused(false);
    }
  }

  function handleNext() {
    playBeep();
    haptic("medium");
    setPaused(false);
    if (index < program.exercises.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setFinished(true);
      setStarted(false);
      // Advance day
      const nextDay = day + 1;
      localStorage.setItem("day", String(nextDay));
      // Auto-save a basic check-in for progress tracking
      try {
        const entry = {
          sleep: 0,
          energy: 0,
          stress: 0,
          symptoms: [],
          date: new Date().toISOString(),
          completedSession: true,
        };
        const history = JSON.parse(localStorage.getItem("checkinHistory") || "[]");
        history.push(entry);
        localStorage.setItem("checkinHistory", JSON.stringify(history.slice(-90)));
      } catch { /* ignore */ }
      // Sync completed session to server
      pushSession({
        day,
        phase: program.phase,
        title: program.title,
        exercisesCount: program.exercises.length,
        durationSeconds: program.totalMinutes * 60,
      });
      pushSingle("profile");
    }
  }

  function handleSkip() {
    handleNext();
  }

  // Swipe left = next, swipe right = skip (same as next for now)
  const swipeHandlers = useSwipe((dir) => {
    if (started && !finished) {
      if (dir === "left") handleNext();
    }
  });

  function format(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  const progressWidth = (timeLeft / currentTime) * 100;

  if (finished) {
    // Voice celebration
    if ("speechSynthesis" in window && voiceGuide) {
      const msg = userName
        ? `Amazing work, ${userName}! Day ${day + 1} is now unlocked. You completed ${program.exercises.length} exercises. See you tomorrow!`
        : `Session complete! Day ${day + 1} is now unlocked. Great job today!`;
      const utterance = new SpeechSynthesisUtterance(msg);
      const voices = window.speechSynthesis.getVoices();
      const best = findBestVoice(voices);
      if (best) utterance.voice = best;
      utterance.rate = 0.9;
      utterance.pitch = 1.05;
      utterance.lang = "en-GB";
      window.speechSynthesis.speak(utterance);
    }

    return (
      <main className="max-w-4xl mx-auto px-6 py-20">
        <section className="soft-card p-12 text-center">
          <div className="text-7xl mb-6">✅</div>
          <h1 className="text-5xl mb-4 text-[#4a3f44]">{t("Session Complete!")}</h1>
          <p className="text-xl text-[#7b6870] mb-4">
            {t("Amazing work today.")}{userName ? ` ${userName},` : ""} Day {day + 1} is now unlocked.
          </p>
          <p className="text-sm text-[#b98fa1] mb-8">
            You completed {program.exercises.length} exercises in ~{program.totalMinutes} minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary">
              {t("Return to Dashboard")}
            </Link>
            <Link href="/checkin" className="btn-outline">
              Daily Check-In
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-14">
      {/* Header with timer */}
      <section className="soft-card overflow-hidden text-center mb-8">
        <div className="p-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <p className="uppercase tracking-[0.25em] text-sm text-[#b98fa1]">
              {t("Live Session")}
            </p>
            <span className="text-[10px] px-3 py-1 rounded-full bg-[#fdf2f5] text-[#b98fa1] font-bold uppercase tracking-widest border border-[#f0e3e8]">
              {program.phase}
            </span>
          </div>

          <h1 className="text-4xl mb-3 text-[#4a3f44]">{program.title}</h1>
          <p className="text-[#7b6870] mb-8">
            {t("Exercise")} {index + 1} {t("of")} {program.exercises.length} •{" "}
            <span className="text-[#b98fa1]">
              {CATEGORY_LABELS[current.category]}
            </span>
          </p>

          {!started ? (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleStart}
                className="w-40 h-40 rounded-full bg-[#d9a8b8] text-white text-5xl mx-auto shadow-xl hover:scale-105 transition flex items-center justify-center"
                aria-label="Start session"
              >
                ▶
              </button>
              <button
                onClick={() => { setVoiceGuide(!voiceGuide); localStorage.setItem("voiceGuide", String(!voiceGuide)); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  voiceGuide
                    ? "bg-[#d8a7b5] text-white"
                    : "bg-[#fdf2f5] text-[#b98fa1] border border-[#f0e3e8]"
                }`}
              >
                🎧 Voice Guide {voiceGuide ? "ON" : "OFF"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <CircularTimer timeLeft={timeLeft} totalTime={currentTime} />
              {/* Playback controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrev}
                  disabled={index === 0}
                  className="w-12 h-12 rounded-full bg-white border border-[#f0e3e8] flex items-center justify-center text-[#b98fa1] hover:border-[#d8a7b5] transition disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous exercise"
                >
                  ⏮
                </button>
                <button
                  onClick={handleStop}
                  className="w-16 h-16 rounded-full bg-[#d9a8b8] text-white text-2xl shadow-lg hover:scale-105 transition flex items-center justify-center"
                  aria-label={paused ? "Resume" : "Pause"}
                >
                  {paused ? "▶" : "⏸"}
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-white border border-[#f0e3e8] flex items-center justify-center text-[#b98fa1] hover:border-[#d8a7b5] transition"
                  aria-label="Next exercise"
                >
                  ⏭
                </button>
              </div>
              {paused && (
                <p className="text-sm text-[#d8a7b5] font-medium animate-pulse">Paused</p>
              )}
            </div>
          )}
        </div>

        {started && (
          <div className="w-full h-2 bg-[#f0e3e8]">
            <div
              className="h-full bg-[#d9a8b8] transition-all duration-1000 ease-linear"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        )}
      </section>

      {/* Current exercise */}
      <section className="soft-card p-8 mb-8" {...swipeHandlers}>
        <div className="w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-6 border border-[#f0e3e8] bg-white">
          <img
            src={current.image}
            alt={current.name}
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = "/exercises/bridge.jpg"; }}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-wrap justify-between items-end mb-6 gap-4">
          <div>
            <h2 className="text-5xl text-[#4a3f44]">{current.name}</h2>
            <span className="text-[10px] px-3 py-1 rounded-full bg-[#fdf2f5] text-[#b98fa1] font-bold uppercase tracking-widest border border-[#f0e3e8] mt-2 inline-block">
              {CATEGORY_LABELS[current.category]}
            </span>
          </div>
          <span className="text-[#b98fa1] text-xl font-medium">
            {current.reps}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-5 text-[#6f5a62] mb-6">
          <div className="p-6 rounded-3xl bg-white border border-[#f0e3e8]">
            <span className="block text-xs uppercase tracking-widest text-[#b98fa1] mb-2">
              {t("Start Position")}
            </span>
            <p className="text-lg leading-relaxed">{current.start}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#f0e3e8]">
            <span className="block text-xs uppercase tracking-widest text-[#b98fa1] mb-2">
              {t("Finish Position")}
            </span>
            <p className="text-lg leading-relaxed">{current.end}</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#fff4f7] mb-8 text-[#7b6870] border border-[#f8e1e7]">
          <span className="mr-2">✨</span> {current.why}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={index === 0}
            className="btn-outline flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← {t("Previous")}
          </button>
          <button
            onClick={() => { setVoiceGuide(!voiceGuide); localStorage.setItem("voiceGuide", String(!voiceGuide)); }}
            className={`px-4 rounded-full text-xs font-medium transition-all shrink-0 ${
              voiceGuide
                ? "bg-[#d8a7b5] text-white"
                : "bg-[#fdf2f5] text-[#b98fa1] border border-[#f0e3e8]"
            }`}
          >
            🎧 {voiceGuide ? "ON" : "OFF"}
          </button>
          <button onClick={handleNext} className="btn-primary flex-1">
            {index < program.exercises.length - 1
              ? t("Next") + " →"
              : t("Finish Session")}
          </button>
        </div>
      </section>

      {/* Up next */}
      <section className="soft-card p-8">
        <h3 className="text-3xl mb-5 text-[#4a3f44]">{t("Up Next")}</h3>
        <div className="grid gap-3">
          {program.exercises.slice(index + 1).map((item, i) => (
            <div
              key={item.name + i}
              className="p-5 rounded-3xl bg-white border border-[#f0e3e8] flex justify-between items-center hover:border-[#d9a8b8] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#b98fa1] font-medium w-6">
                  {index + i + 2}.
                </span>
                <div>
                  <span className="text-lg text-[#4a3f44]">{item.name}</span>
                  <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-[#fdf2f5] text-[#b98fa1] border border-[#f0e3e8]">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                </div>
              </div>
              <span className="text-sm px-4 py-1 rounded-full bg-[#fff4f7] text-[#b98fa1] border border-[#f8e1e7]">
                {item.reps}
              </span>
            </div>
          ))}
          {program.exercises.slice(index + 1).length === 0 && (
            <p className="text-[#b98fa1] italic">
              {t("Last exercise — you're almost done!")}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
