// ============================================================
// DAILY SUPPLEMENTS DATA
// Evidence-based supplement recommendations for menopause
// ============================================================

export type DailySupp = {
  name: string;
  icon: string;
  dose: string;
  timing: string;
  priority: "essential" | "recommended";
  symptoms: string[];
};

export const DAILY_SUPPLEMENTS: DailySupp[] = [
  { name: "Vitamin D3", icon: "☀️", dose: "2,000–4,000 IU", timing: "With breakfast", priority: "essential", symptoms: [] },
  { name: "Magnesium Glycinate", icon: "🌙", dose: "300–400mg", timing: "Before bed", priority: "essential", symptoms: ["Poor sleep", "Joint pain", "Mood swings", "Incontinence"] },
  { name: "Omega-3 (EPA/DHA)", icon: "🐟", dose: "1,000–2,000mg", timing: "With meal", priority: "essential", symptoms: ["Joint pain", "Hot flashes", "Mood swings"] },
  { name: "Calcium", icon: "🦴", dose: "500–600mg", timing: "2× with meals", priority: "essential", symptoms: ["Joint pain", "Back pain"] },
  { name: "Vitamin B Complex", icon: "⚡", dose: "1 capsule", timing: "With breakfast", priority: "recommended", symptoms: ["Low energy", "Mood swings", "Low confidence"] },
  { name: "Ashwagandha", icon: "🌿", dose: "300–600mg", timing: "Morning or evening", priority: "recommended", symptoms: ["Poor sleep", "Mood swings", "Hot flashes", "Low confidence"] },
  { name: "Vitamin K2 (MK-7)", icon: "🥬", dose: "100–200mcg", timing: "With Vitamin D3", priority: "recommended", symptoms: [] },
  { name: "Probiotics", icon: "🦠", dose: "10–30B CFU", timing: "Empty stomach", priority: "recommended", symptoms: ["Bloating", "Mood swings", "Weight gain"] },
  { name: "Vitamin C", icon: "🍊", dose: "500–1,000mg", timing: "With breakfast", priority: "recommended", symptoms: ["Pelvic prolapse", "Incontinence", "Joint pain"] },
  { name: "Collagen Peptides", icon: "✨", dose: "10–15g", timing: "Morning, in water or smoothie", priority: "recommended", symptoms: ["Pelvic prolapse", "Incontinence", "Joint pain"] },
  { name: "Zinc", icon: "🔩", dose: "15–30mg", timing: "With dinner", priority: "recommended", symptoms: ["Pelvic prolapse", "Low energy", "Incontinence"] },
];
