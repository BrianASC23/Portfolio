import { expect, test } from '@playwright/test';

test.describe('homepage', () => {
  test('renders the statement, standing context and every section', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /brian cao builds systems/i, level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole('region', { name: /introduction/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /selected work/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /experience/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /skills/i })).toBeVisible();

    await expect(page.getByText(/^currently$/i)).toBeVisible();
    await expect(page.getByText(/^previously$/i)).toBeVisible();
  });

  test('every featured project links to its case study', async ({ page }) => {
    await page.goto('/');
    const tiles = page.locator('#work a[href^="/projects/"]');
    await expect(tiles).toHaveCount(4);
    await tiles.first().click();
    await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+$/);
  });

  test('command palette opens via ⌘K', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Meta+K');
    await expect(page.getByPlaceholder(/type a command/i)).toBeVisible();
  });
});
