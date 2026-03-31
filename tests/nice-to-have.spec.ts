import { test, expect } from 'playwright-order-manager/fixtures';

/**
 * Nice-to-have tests — @P3
 * Edge cases and secondary features.
 * Run after @P1 and @P2 complete.
 */

test('footer shows correct item count', {
  tag: ['@P3'],
}, async ({ page }) => {
  await page.goto('/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('One');
  await input.press('Enter');
  await input.fill('Two');
  await input.press('Enter');

  await expect(
    page.locator('.todo-count')
  ).toContainText('2');
});

test('clear completed button removes completed todos', {
  tag: ['@P3'],
}, async ({ page }) => {
  await page.goto('/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Keep this');
  await input.press('Enter');
  await input.fill('Remove this');
  await input.press('Enter');

  await page.locator('.todo-list li').nth(1)
    .getByRole('checkbox').check();

  await page.getByRole('button', { name: 'Clear completed' }).click();

  await expect(page.locator('.todo-list li')).toHaveCount(1);
  await expect(page.getByText('Keep this')).toBeVisible();
});

test('item count decrements when item is completed', {
  tag: ['@P3'],
}, async ({ page }) => {
  await page.goto('/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Task A');
  await input.press('Enter');
  await input.fill('Task B');
  await input.press('Enter');

  await expect(page.locator('.todo-count')).toContainText('2');

  await page.locator('.todo-list li').first()
    .getByRole('checkbox').check();

  await expect(page.locator('.todo-count')).toContainText('1');
});
