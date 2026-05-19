// ============================================================
// PROMO MODE CONFIGURATION
// When enabled, all users get full premium access for free.
// Payment buttons are greyed out with a "Coming Soon" label.
// To enable payments, set PROMO_MODE = false.
// ============================================================

export const PROMO_MODE = true;

// Optional: set a promo end date (null = indefinite)
// When set, promo automatically ends after this date
export const PROMO_END_DATE: string | null = null; // e.g. "2026-07-01"

export function isPromoActive(): boolean {
  if (!PROMO_MODE) return false;
  if (PROMO_END_DATE) {
    return new Date() < new Date(PROMO_END_DATE);
  }
  return true;
}
