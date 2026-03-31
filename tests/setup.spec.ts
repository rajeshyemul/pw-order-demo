import { test, expect } from 'playwright-order-manager/fixtures';

/**
 * Setup tests — @runFirst boundary
 * Always run before everything else.
 */

test('app is reachable and loads correctly', {
  tag: ['@runFirst'],
}, async ({ page }) => {
  await page.goto('/todomvc');

  await expect(page).toHaveTitle(/TodoMVC/);
  await expect(
    page.getByPlaceholder('What needs to be done?')
  ).toBeVisible();

  console.log('✅ Setup: app loaded successfully');
});

test('app has correct heading', {
  tag: ['@runFirst'],
}, async ({ page }) => {
  await page.goto('/todomvc');

  await expect(
    page.getByRole('heading', { name: 'todos' })
  ).toBeVisible();

  console.log('✅ Setup: heading verified');
});
