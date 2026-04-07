import { expect, test } from '@playwright/test';

test('writing index loads', async ({ page }) => {
  await page.goto('/writing');
  await expect(page.getByRole('heading', { name: /notes/i, level: 2 })).toBeVisible();
});
