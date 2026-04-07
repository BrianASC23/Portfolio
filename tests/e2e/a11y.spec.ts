import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('a11y', () => {
  for (const path of ['/', '/projects', '/projects/advising-bot', '/writing', '/resume']) {
    test(`no critical a11y violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .disableRules(['color-contrast']) // validated manually against OKLCH palette
        .analyze();
      const critical = results.violations.filter((v) => v.impact === 'critical');
      expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
    });
  }
});
