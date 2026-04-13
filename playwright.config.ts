import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Look for tests inside the tests/ folder
  testDir: './tests',

  // Run tests in parallel within each file
  fullyParallel: false,

  // Retry once on failure so flaky tests are visible
  retries: 2,

  // Single worker — pw-order controls execution order
  workers: 1,

  // Default timeout per test
  timeout: 30_000,

  reporter: [
    ['list'],
    ['playwright-flaky-tracker', {
      enabled: undefined,          // config value wins over FLAKY_TRACKING when set
      // All options are optional — defaults shown below
      outputDir:          'flaky-report',  // where reports are written
      runId:              undefined,       // optional run folder name under flaky-report/runs/
      maxRunsPerTest:     50,              // rolling history window
      minRunsToClassify:  5,               // min runs before HIGH/MEDIUM/LOW assigned
      highFlakyThreshold: 0.4,            // ≥ 40% flaky rate → HIGH
      medFlakyThreshold:  0.2,            // ≥ 20% flaky rate → MEDIUM
    }]
  ],

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