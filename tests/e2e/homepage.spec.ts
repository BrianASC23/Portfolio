import { expect, test } from '@playwright/test';

test.describe('homepage', () => {
  test('renders hero, sections, and nav', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /brian/i, level: 1 })).toBeVisible();
    await expect(page.getByRole('region', { name: /about/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /selected work/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /experience/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /contact/i })).toBeVisible();
  });

  test('hero cta scrolls to work section', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'View work' }).first().click();
    await expect(page).toHaveURL(/#work$/);
  });

  test('command palette opens via ⌘K', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Meta+K');
    await expect(page.getByPlaceholder(/type a command/i)).toBeVisible();
  });
});
