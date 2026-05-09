export type PlanType = "glow" | "elite";

export type PlanData = {
  id: PlanType;
  name: string;
  price: number;
  currency: "EUR";
  durationDays: number;
  monthlyEquivalent: string;
  description: string;
  features: string[];
};

export const plans: Record<PlanType, PlanData> = {
  glow: {
    id: "glow",
    name: "Glow",
    price: 29,
    currency: "EUR",
    durationDays: 30,
    monthlyEquivalent: "€0.96 / day",
    description:
      "A 30-day feminine reset focused on sleep, confidence, comfort and momentum.",
    features: [
      "30-Day Program Access",
      "Daily guided plans",
      "Sleep + hot flash support",
      "Progress dashboard",
      "Smart daily sessions",
    ],
  },

  elite: {
    id: "elite",
    name: "Elite",
    price: 79,
    currency: "EUR",
    durationDays: 90,
    monthlyEquivalent: "€0.87 / day",
    description:
      "Our best value transformation plan with deeper systems and longer support.",
    features: [
      "90-Day Premium Roadmap",
      "Everything in Glow",
      "Pelvic floor restore",
      "Advanced sculpt phases",
      "Monthly reassessments",
      "VIP premium library",
    ],
  },
};

export function getPlan(id: string | null): PlanData {
  if (id === "elite") {
    return plans.elite;
  }

  return plans.glow;
}

// ✅ POPRAVLJENO: Dodata provera da li smo u browseru pre koriscenja localStorage
export function activatePlan(id: PlanType) {
  // Proveri da li window objekat postoji (sto znaci da smo na klijentu/browseru)
  if (typeof window !== "undefined") {
    localStorage.setItem("premium", "true");
    localStorage.setItem("plan", id);
    localStorage.setItem("day", "1");
    localStorage.setItem("purchaseDate", new Date().toISOString());
  }
}
