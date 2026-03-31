import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Look for tests inside the tests/ folder
  testDir: './tests',

  // Run tests in parallel within each file
  fullyParallel: false,

  // Retry once on failure so flaky tests are visible
  retries: 1,

  // Single worker — pw-order controls execution order
  workers: 1,

  // Default timeout per test
  timeout: 30_000,

  use: {
    // The demo site we'll test against
    baseURL: 'https://demo.playwright.dev/todomvc',

    // Take a screenshot on failure
    screenshot: 'only-on-failure',

    // Record trace on first retry
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Where Playwright writes its own output
  outputDir: 'test-results',
});