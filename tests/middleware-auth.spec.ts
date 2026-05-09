import { test, expect } from "@playwright/test";

// ============================================================
// MIDDLEWARE AUTH TESTS
// ============================================================
// Testiraju da zaštićene rute redirectuju na /login
// kad korisnik nije ulogovan.
// ============================================================

const protectedRoutes = [
  "/dashboard",
  "/session",
  "/progress",
  "/journal",
  "/favorites",
  "/shopping",
  "/weekly-summary",
  "/rest-day",
  "/account",
  "/checkin",
  "/admin",
];

const publicRoutes = [
  "/",
  "/quiz",
  "/pricing",
  "/blog",
  "/nutrition",
  "/supplements",
  "/contact",
  "/privacy",
  "/terms",
];

test.describe("Middleware — zaštićene rute redirectuju na login", () => {
  for (const route of protectedRoutes) {
    test(`${route} → redirect na /login`, async ({ page }) => {
      const response = await page.goto(route);
      // Treba da nas redirectuje na login
      expect(page.url()).toContain("/login");
    });
  }
});

test.describe("Middleware — javne rute su dostupne", () => {
  for (const route of publicRoutes) {
    test(`${route} → dostupna bez logina`, async ({ page }) => {
      const response = await page.goto(route);
      // Ne sme da redirectuje na login
      expect(page.url()).not.toContain("/login");
    });
  }
});
