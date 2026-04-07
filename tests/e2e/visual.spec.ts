import { expect, test } from '@playwright/test';

test.describe('visual regression', () => {
  test.beforeEach(async ({ page }) => {
    // Stabilize animation for screenshots
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('homepage above the fold', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-hero.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('projects index', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('projects-index.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
