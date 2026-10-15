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

    // The tiles reveal on scroll, so wait for the first to actually be
    // clickable rather than racing the IntersectionObserver.
    const first = tiles.first();
    await first.scrollIntoViewIfNeeded();
    await expect(first).toBeVisible();

    await first.click();
    await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+$/);
  });

  // The palette is a pointer-and-keyboard affordance; the Pixel 5 project has
  // no physical keyboard, so the shortcut is meaningless there.
  test('command palette opens via the platform shortcut', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'no physical keyboard on the mobile project');

    await page.goto('/');

    await page.waitForLoadState('networkidle');

    // The palette is a next/dynamic import with ssr: false, so its keydown
    // listener does not exist until that chunk loads — which takes longer than
    // networkidle, especially headless. So the press has to be retried.
    //
    // But the shortcut is a TOGGLE (`setOpen(prev => !prev)`), so a naive retry
    // closes whatever the previous attempt opened and the test alternates. The
    // Escape first makes each attempt idempotent: the handler's Escape branch
    // is an unconditional `setOpen(false)`, so every iteration is close-then-
    // open regardless of what the last one did.
    //
    // ControlOrMeta resolves to Ctrl on Windows/Linux and Meta on macOS, which
    // is exactly what the handler accepts (`e.metaKey || e.ctrlKey`). A literal
    // Meta+K presses the Super key on Windows and never reaches the page.
    await expect
      .poll(
        async () => {
          await page.keyboard.press('Escape');
          await page.keyboard.press('ControlOrMeta+KeyK');
          return page.locator('[cmdk-root]').count();
        },
        { timeout: 20_000, message: 'command palette never mounted' },
      )
      .toBeGreaterThan(0);

    await expect(page.getByPlaceholder(/type a command/i)).toBeVisible();
  });
});
