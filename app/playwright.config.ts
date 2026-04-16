import { defineConfig } from '@playwright/test'

// Playwright targets a production build served by `vite preview` so the
// service worker is actually registered (vite-plugin-pwa sets
// `devOptions.enabled: false`). See docs/research/minimum-viable-test-stack.md
// and docs/specs/m001-quality-and-testing.md (§"Test harness conventions").
const PORT = 4173
const HOST = '127.0.0.1'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://${HOST}:${PORT}`,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    serviceWorkers: 'allow',
  },
  webServer: {
    command: `npm run build && npm run preview -- --host ${HOST} --port ${PORT} --strictPort`,
    url: `http://${HOST}:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
