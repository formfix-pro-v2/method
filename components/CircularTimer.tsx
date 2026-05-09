"use client";

export default function CircularTimer({
  timeLeft,
  totalTime,
  size = 200,
}: {
  timeLeft: number;
  totalTime: number;
  size?: number;
}) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalTime;
  const offset = circumference * (1 - progress);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="timer"
      aria-live="polite"
      aria-label={`${minutes} minutes and ${seconds} seconds remaining`}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f0e3e8"
          strokeWidth={8}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#timerGradient)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-linear"
        />
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d8a7b5" />
            <stop offset="100%" stopColor="#c58d9d" />
          </linearGradient>
        </defs>
      </svg>
      {/* Time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-extralight text-[#4a3f44] tracking-tight">
          {minutes}:{String(seconds).padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#b98fa1] mt-1">
          remaining
        </span>
      </div>
    </div>
  );
}
