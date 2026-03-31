import { test, expect } from 'playwright-order-manager/fixtures';

/**
 * Mixed priority tests — all in one file.
 * This demonstrates the 0.1.1 fix: tests with different priorities
 * in the same file now execute in the correct bucket order.
 *
 * Previously (0.1.0): the whole file ran as one unit.
 * Now (0.1.1): file:line selectors target each test individually.
 */

test('P1 — todo input is focusable', {
  tag: ['@P1'],
}, async ({ page }) => {
  await page.goto('/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.click();
  await expect(input).toBeFocused();
});

test('P2 — all filter shows all todos', {
  tag: ['@P2'],
}, async ({ page }) => {
  await page.goto('/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Task one');
  await input.press('Enter');
  await input.fill('Task two');
  await input.press('Enter');

  await page.locator('.todo-list li').first()
    .getByRole('checkbox').check();

  await page.getByRole('link', { name: 'Completed' }).click();
  await page.getByRole('link', { name: 'All' }).click();

  await expect(page.locator('.todo-list li')).toHaveCount(2);
});

test('P3 — empty state shows no footer', {
  tag: ['@P3'],
}, async ({ page }) => {
  await page.goto('/todomvc');

  // With no todos, the footer should not be visible
  await expect(page.locator('.footer')).not.toBeVisible();
});
