import { expect, test } from '@playwright/test';

test('advising bot case study renders', async ({ page }) => {
  await page.goto('/projects/advising-bot');
  await expect(page.getByRole('heading', { name: 'Advising Bot', level: 1 })).toBeVisible();
  await expect(page.getByText('Case study · in-progress')).toBeVisible();
});
