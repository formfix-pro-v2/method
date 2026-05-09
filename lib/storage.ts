// Client-side storage helpers (fallback + cache layer)
// These work alongside Supabase for offline/quick access

export function saveLocal(key: string, value: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
}

export function getLocal(key: string): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key) || "";
  }
  return "";
}

export function saveUser(email: string) {
  saveLocal("user_email", email);
}

export function getUser() {
  return getLocal("user_email");
}

export function saveQuizData(data: Record<string, unknown>) {
  saveLocal("quizData", JSON.stringify(data));
}

export function getQuizData(): Record<string, unknown> | null {
  const raw = getLocal("quizData");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveProgress(day: number) {
  saveLocal("day", String(day));
}

export function getProgress(): number {
  return Number(getLocal("day") || "1");
}
