import fs from 'node:fs';
import { type Page, type TestInfo, expect, test } from '@playwright/test';

/**
 * Visual baselines are per-platform, and anti-aliasing and font rasterisation
 * differ enough between them that a win32 baseline can never match a render on
 * ubuntu. The committed baselines are whatever platform generated them, so on
 * any other platform — CI included — there is nothing meaningful to compare
 * against and the right answer is to skip, not to fail on a missing artifact.
 *
 * Regenerate for the platform you are on with:
 *   UPDATE_VISUAL_BASELINES=1 npx playwright test tests/e2e/visual.spec.ts --update-snapshots
 *
 * The opt-out is an explicit env var rather than an inspection of
 * `config.updateSnapshots`, whose value for a bare `--update-snapshots` has
 * changed between Playwright versions — inferring it silently skipped the very
 * run meant to create the missing baselines.
 */
function skipWithoutBaseline(testInfo: TestInfo, snapshot: string): void {
  if (process.env.UPDATE_VISUAL_BASELINES) return;
  const baseline = testInfo.snapshotPath(snapshot);
  test.skip(
    !fs.existsSync(baseline),
    `no ${process.platform} baseline for ${snapshot} — generate with --update-snapshots`,
  );
}

/**
 * `networkidle` does not imply the webfonts have been applied — the face can
 * still be swapping in on the next frame, which is enough to fail a pixel
 * comparison on a page whose hero is 76px type. `document.fonts.ready`
 * resolves only once every face in use has settled.
 */
async function gotoSettled(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
}

test.describe('visual regression', () => {
  test.beforeEach(async ({ page }) => {
    // Stabilize animation for screenshots
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('homepage above the fold', async ({ page }, testInfo) => {
    skipWithoutBaseline(testInfo, 'home-hero.png');

    await gotoSettled(page, '/');
    await expect(page).toHaveScreenshot('home-hero.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('projects index', async ({ page }, testInfo) => {
    skipWithoutBaseline(testInfo, 'projects-index.png');

    await gotoSettled(page, '/projects');
    await expect(page).toHaveScreenshot('projects-index.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
