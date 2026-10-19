import { defineConfig, devices } from '@playwright/test';

/**
 * Dedicated port, not 3000.
 *
 * `reuseExistingServer` means Playwright adopts whatever is already listening
 * rather than starting its own. On 3000 — the default for every Next dev
 * server on the machine — that silently points the whole suite at an unrelated
 * project and the specs fail for reasons that have nothing to do with this
 * code. 3100 is ours; override with PLAYWRIGHT_PORT if it is ever taken.
 */
const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: BASE_URL,
    /**
     * Always start a fresh server, never adopt one already on the port.
     *
     * Reusing is faster, but a server started against an earlier `.next` keeps
     * serving that build's manifest while a later build replaces the files on
     * disk. Its chunk URLs then 404 into the HTML handler and come back as 400
     * text/html — including `webpack-*.js`, so the page renders but never
     * hydrates. Every SSR-only assertion still passes, and only the tests that
     * need client JS fail, which reads as flakiness rather than a stale server.
     */
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
