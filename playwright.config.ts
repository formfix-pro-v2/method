import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://localhost:3000",
    headless: true,
    screenshot: "only-on-failure",
  },
  // Only start local server if not testing against production
  ...(process.env.TEST_BASE_URL
    ? {}
    : {
        webServer: {
          command: "npm run dev",
          port: 3000,
          reuseExistingServer: true,
        },
      }),
});
