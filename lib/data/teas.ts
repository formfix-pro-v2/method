// ============================================================
// DAILY TEAS DATA
// Evidence-based herbal tea recommendations for menopause
// ============================================================

export type DailyTea = {
  name: string;
  icon: string;
  dose: string;
  timing: string;
  priority: "essential" | "recommended";
  symptoms: string[];
  evidence: string;
};

export const DAILY_TEAS: DailyTea[] = [
  { name: "Sage Tea", icon: "🌿", dose: "1–2 cups", timing: "Morning & afternoon", priority: "essential", symptoms: ["Hot flashes"], evidence: "RCT: reduced hot flash intensity after 1 week (Salvia officinalis)" },
  { name: "Chamomile Tea", icon: "🌼", dose: "1–2 cups", timing: "Evening, 30 min before bed", priority: "essential", symptoms: ["Poor sleep", "Mood swings"], evidence: "RCT: improved sleep quality and reduced anxiety in menopausal women" },
  { name: "Green Tea", icon: "🍵", dose: "2–3 cups", timing: "Morning & early afternoon", priority: "essential", symptoms: ["Weight gain", "Low energy"], evidence: "Meta-analysis: -1.2kg weight loss vs placebo over 12 weeks in postmenopausal women" },
  { name: "Valerian Root Tea", icon: "🌱", dose: "1 cup", timing: "30–60 min before bed", priority: "recommended", symptoms: ["Poor sleep"], evidence: "Systematic review: improves sleep quality without morning drowsiness" },
  { name: "Red Clover Tea", icon: "🌺", dose: "1–2 cups", timing: "Any time", priority: "recommended", symptoms: ["Hot flashes", "Mood swings"], evidence: "Contains isoflavones (phytoestrogens). Meta-analysis: reduces hot flash frequency" },
  { name: "Nettle Tea", icon: "🌿", dose: "1–2 cups", timing: "With meals", priority: "recommended", symptoms: ["Low energy", "Joint pain"], evidence: "Rich in iron, calcium, magnesium. Supports bone density and reduces fatigue" },
  { name: "Peppermint Tea", icon: "🍃", dose: "1–2 cups", timing: "After meals", priority: "recommended", symptoms: ["Bloating", "Hot flashes"], evidence: "Reduces bloating and digestive discomfort. Cooling effect helps hot flashes" },
  { name: "Ginger Tea", icon: "🫚", dose: "1–2 cups", timing: "Morning or with meals", priority: "recommended", symptoms: ["Joint pain", "Bloating"], evidence: "Anti-inflammatory. RCT: reduces joint pain and stiffness comparable to ibuprofen" },
  { name: "Hibiscus Tea", icon: "🌺", dose: "1–2 cups", timing: "Any time (cold or hot)", priority: "recommended", symptoms: ["Weight gain", "Hot flashes"], evidence: "Lowers blood pressure, rich in antioxidants. Cooling effect. Supports metabolism" },
  { name: "Lemon Balm Tea", icon: "🍋", dose: "1–2 cups", timing: "Afternoon or evening", priority: "recommended", symptoms: ["Mood swings", "Poor sleep", "Low confidence"], evidence: "Reduces anxiety and improves mood. Mild sedative effect without drowsiness" },
];
