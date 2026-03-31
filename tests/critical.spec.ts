import { test, expect } from 'playwright-order-manager/fixtures';

/**
 * Critical path tests — @P1
 * The most important user journeys.
 * Run immediately after @runFirst setup.
 */

test('user can add a new todo item', {
  tag: ['@P1'],
}, async ({ page }) => {
  await page.goto('/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Buy groceries');
  await input.press('Enter');

  await expect(
    page.getByText('Buy groceries')
  ).toBeVisible();
});

test('user can complete a todo item', {
  tag: ['@P1'],
}, async ({ page }) => {
  await page.goto('/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Complete this task');
  await input.press('Enter');

  await page.getByRole('checkbox').first().check();

  await expect(
    page.locator('.todo-list li').first()
  ).toHaveClass(/completed/);
});

test('user can add multiple todo items', {
  tag: ['@P1'],
}, async ({ page }) => {
  await page.goto('/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');

  await input.fill('First task');
  await input.press('Enter');
  await input.fill('Second task');
  await input.press('Enter');
  await input.fill('Third task');
  await input.press('Enter');

  await expect(page.locator('.todo-list li')).toHaveCount(3);
});
