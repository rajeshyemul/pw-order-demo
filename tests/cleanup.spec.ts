import { test, expect } from 'playwright-order-manager/fixtures';

/**
 * Cleanup tests — @runLast boundary
 * Always run last, even if earlier tests failed.
 */

test('app is still responsive after all tests', {
  tag: ['@runLast'],
}, async ({ page }) => {
  await page.goto('/todomvc');

  await expect(
    page.getByPlaceholder('What needs to be done?')
  ).toBeVisible();

  console.log('✅ Cleanup: app still responsive after full run');
});
