import { expect, test } from '@playwright/test';

test.describe('visual regression', () => {
  test.beforeEach(async ({ page }) => {
    // Stabilize animation for screenshots
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  /**
   * `networkidle` does not imply the webfonts have been applied — the face can
   * still be swapping in on the next frame, which is enough to fail a pixel
   * comparison on a page whose hero is 76px type. `document.fonts.ready`
   * resolves only once every face in use has settled.
   */
  async function gotoSettled(page: import('@playwright/test').Page, path: string) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
  }

  test('homepage above the fold', async ({ page }) => {
    await gotoSettled(page, '/');
    await expect(page).toHaveScreenshot('home-hero.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('projects index', async ({ page }) => {
    await gotoSettled(page, '/projects');
    await expect(page).toHaveScreenshot('projects-index.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
