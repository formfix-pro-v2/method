"use client";

import { useState } from "react";

/**
 * Generates a shareable progress card image using Canvas API.
 * User can save or share their progress on social media.
 */
export default function ProgressShareCard({
  day,
  streak,
  sessionsCompleted,
  avgSleep,
  avgEnergy,
  name,
}: {
  day: number;
  streak: number;
  sessionsCompleted: number;
  avgSleep: number;
  avgEnergy: number;
  name?: string;
}) {
  const [generating, setGenerating] = useState(false);

  async function generateImage() {
    setGenerating(true);

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) { setGenerating(false); return; }

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
    gradient.addColorStop(0, "#e5d5da");
    gradient.addColorStop(1, "#dac8ce");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Card background
    ctx.fillStyle = "rgba(255, 248, 250, 0.92)";
    ctx.beginPath();
    ctx.roundRect(80, 80, 920, 920, 40);
    ctx.fill();

    // Border
    ctx.strokeStyle = "rgba(168, 104, 122, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Brand
    ctx.fillStyle = "#6b3a4d";
    ctx.font = "bold 24px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VERONICA METHOD", 540, 150);

    // Subtitle
    ctx.fillStyle = "#7d5565";
    ctx.font = "16px -apple-system, sans-serif";
    ctx.fillText("Menopause Wellness Program", 540, 180);

    // Name
    if (name) {
      ctx.fillStyle = "#2a1a22";
      ctx.font = "bold 36px -apple-system, sans-serif";
      ctx.fillText(`${name}'s Progress`, 540, 260);
    }

    // Day circle
    ctx.fillStyle = "#a8687a";
    ctx.beginPath();
    ctx.arc(540, 400, 120, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 72px -apple-system, sans-serif";
    ctx.fillText(`${day}`, 540, 420);
    ctx.font = "20px -apple-system, sans-serif";
    ctx.fillText("DAYS", 540, 455);

    // Stats
    const stats = [
      { label: "Streak", value: `${streak} 🔥`, x: 240 },
      { label: "Sessions", value: `${sessionsCompleted}`, x: 540 },
      { label: "Avg Sleep", value: `${avgSleep}/10`, x: 840 },
    ];

    stats.forEach((stat) => {
      ctx.fillStyle = "#2a1a22";
      ctx.font = "bold 40px -apple-system, sans-serif";
      ctx.fillText(stat.value, stat.x, 600);
      ctx.fillStyle = "#7d5565";
      ctx.font = "16px -apple-system, sans-serif";
      ctx.fillText(stat.label, stat.x, 635);
    });

    // Motivational text
    ctx.fillStyle = "#4d3842";
    ctx.font = "italic 22px Georgia, serif";
    ctx.fillText("Every day I show up, I get stronger.", 540, 740);

    // Energy bar
    ctx.fillStyle = "rgba(168, 104, 122, 0.15)";
    ctx.beginPath();
    ctx.roundRect(200, 790, 680, 30, 15);
    ctx.fill();

    ctx.fillStyle = "#a8687a";
    ctx.beginPath();
    ctx.roundRect(200, 790, 680 * (avgEnergy / 10), 30, 15);
    ctx.fill();

    ctx.fillStyle = "#7d5565";
    ctx.font = "14px -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Energy: ${avgEnergy}/10`, 200, 845);

    // Footer
    ctx.textAlign = "center";
    ctx.fillStyle = "#b98fa1";
    ctx.font = "14px -apple-system, sans-serif";
    ctx.fillText("veronica-method.vercel.app", 540, 950);

    // Download
    const link = document.createElement("a");
    link.download = `veronica-method-day-${day}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    setGenerating(false);
  }

  return (
    <button
      onClick={generateImage}
      disabled={generating}
      className="btn-outline text-xs px-4 py-2 flex items-center gap-2 disabled:opacity-50"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {generating ? "Creating..." : "Share Progress"}
    </button>
  );
}
