import { test, expect } from "@playwright/test";

const BASE_URL = process.env.TEST_BASE_URL || "https://menopause-program.vercel.app";

test.describe("Nightly Health Check", () => {
  test.describe("Critical Pages Load", () => {
    const pages = [
      ["/", "homepage"],
      ["/quiz", "quiz"],
      ["/pricing", "pricing"],
      ["/login", "login"],
      ["/dashboard", "dashboard"],
      ["/nutrition", "nutrition"],
      ["/session", "session"],
      ["/progress", "progress"],
      ["/shopping", "shopping"],
      ["/blog", "blog"],
      ["/terms", "terms"],
      ["/privacy", "privacy"],
      ["/refund", "refund"],
      ["/contact", "contact"],
    ];

    for (const [path, name] of pages) {
      test(`${name} (${path}) loads with 200`, async ({ request }) => {
        const res = await request.get(`${BASE_URL}${path}`);
        expect(res.status()).toBe(200);
      });
    }
  });

  test.describe("Homepage Content", () => {
    test("shows main heading and CTA", async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("text=Start Free Plan")).toBeVisible();
    });

    test("footer has legal links", async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await expect(page.locator("a[href='/privacy']")).toBeVisible();
      await expect(page.locator("a[href='/terms']")).toBeVisible();
      await expect(page.locator("a[href='/refund']")).toBeVisible();
    });
  });

  test.describe("API Health", () => {
    test("GET /api/profile returns 401 without auth", async ({ request }) => {
      const res = await request.get(`${BASE_URL}/api/profile`);
      expect(res.status()).toBe(401);
    });

    test("GET /api/checkin returns 401 without auth", async ({ request }) => {
      const res = await request.get(`${BASE_URL}/api/checkin`);
      expect(res.status()).toBe(401);
    });

    test("POST /api/checkout rejects invalid plan", async ({ request }) => {
      const res = await request.post(`${BASE_URL}/api/checkout`, {
        data: { plan: "invalid" },
      });
      expect(res.status()).toBe(400);
    });
  });

  test.describe("Paddle Checkout", () => {
    test("pricing page loads with plan cards", async ({ page }) => {
      await page.goto(`${BASE_URL}/pricing`);
      await expect(page.locator("text=Glow")).toBeVisible();
      await expect(page.locator("text=Elite")).toBeVisible();
      await expect(page.locator("text=€29")).toBeVisible();
      await expect(page.locator("text=€79")).toBeVisible();
    });

    test("checkout page loads for glow plan", async ({ page }) => {
      await page.goto(`${BASE_URL}/checkout?plan=glow`);
      await expect(page.locator("text=Glow")).toBeVisible();
      await expect(page.locator("text=Secure Payment")).toBeVisible();
    });
  });

  test.describe("Quiz Flow", () => {
    test("quiz page loads with first step", async ({ page }) => {
      await page.goto(`${BASE_URL}/quiz`);
      await expect(page.locator("h2")).toBeVisible();
      await expect(page.locator("text=Continue")).toBeVisible();
    });
  });

  test.describe("Performance", () => {
    test("homepage loads within 5 seconds", async ({ page }) => {
      const start = Date.now();
      await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
      const loadTime = Date.now() - start;
      expect(loadTime).toBeLessThan(5000);
    });

    test("dashboard loads within 5 seconds", async ({ page }) => {
      const start = Date.now();
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });
      const loadTime = Date.now() - start;
      expect(loadTime).toBeLessThan(5000);
    });
  });
});
