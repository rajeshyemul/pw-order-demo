import { test, expect } from 'playwright-order-manager/fixtures';

/**
 * Important feature tests — @P2
 * Features users depend on daily.
 * Run after all @P1 tests complete.
 */

test('user can filter active todos', {
  tag: ['@P2'],
}, async ({ page }) => {
  await page.goto('/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Active task');
  await input.press('Enter');
  await input.fill('Completed task');
  await input.press('Enter');

  await page.locator('.todo-list li').nth(1)
    .getByRole('checkbox').check();

  await page.getByRole('link', { name: 'Active' }).click();

  await expect(page.locator('.todo-list li')).toHaveCount(1);
  await expect(page.getByText('Active task')).toBeVisible();
});

test('user can filter completed todos', {
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

  await expect(page.locator('.todo-list li')).toHaveCount(1);
});

test('user can delete a todo item', {
  tag: ['@P2'],
}, async ({ page }) => {
  await page.goto('/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Task to delete');
  await input.press('Enter');

  await page.locator('.todo-list li').first().hover();
  await page.locator('.todo-list li .destroy').first().click();

  await expect(page.locator('.todo-list li')).toHaveCount(0);
});
