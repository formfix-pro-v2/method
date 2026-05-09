import { test, expect } from "@playwright/test";

test.describe("Quiz → Results flow", () => {
  test("completes quiz and shows results", async ({ page }) => {
    await page.goto("/quiz");

    // Step 1: Biometrics (pre-filled defaults)
    await expect(page.locator("h2")).toContainText("Tell us about yourself");
    await page.click("text=Continue");

    // Step 2: Activity
    await page.click("text=Lightly Active");
    await page.click("text=Continue");

    // Step 3: Goal
    await page.click("text=Tone & Sculpt");
    await page.click("text=Continue");

    // Step 4: Symptoms
    await page.click("text=Poor sleep");
    await page.click("text=Joint pain");
    await page.click("text=Continue");

    // Step 5: Intensity
    await page.click("text=Continue");

    // Step 6: Lifestyle
    await page.click("text=Continue");

    // Step 7: Final
    await page.click("text=Generate My Plan");

    // Should redirect to onboarding
    await expect(page).toHaveURL(/onboarding/);
  });
});

test.describe("Homepage", () => {
  test("loads and shows key elements", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Start Free Plan")).toBeVisible();
    await expect(page.locator("text=Menopause")).toBeVisible();
  });
});

test.describe("Dashboard", () => {
  test("loads without errors", async ({ page }) => {
    await page.goto("/dashboard");

    // Should show dashboard content (not redirect to login since we removed auth requirement)
    await expect(page.locator("text=Dashboard")).toBeVisible();
  });
});
