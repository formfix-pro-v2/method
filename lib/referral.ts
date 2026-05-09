// Simple referral code generator based on user ID
export function generateReferralCode(userId: string): string {
  // Take first 8 chars of user ID and add prefix
  const short = userId.replace(/-/g, "").substring(0, 8).toUpperCase();
  return `VM-${short}`;
}

export function getReferralLink(code: string): string {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/quiz?ref=${code}`;
}

export function saveReferral(code: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("referredBy", code);
  }
}

export function getReferredBy(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("referredBy");
}
