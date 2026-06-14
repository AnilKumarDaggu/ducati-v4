import { defineConfig } from '@playwright/test';

/**
 * Smoke e2e on a WebGL2-forced context (RDM-003: "Playwright runs on a
 * WebGL2-forced context" — the QA floor, not WebGPU).
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:5173',
    launchOptions: {
      // Disable WebGPU so the fallback path is what CI exercises.
      args: ['--disable-features=WebGPU', '--use-gl=angle'],
    },
  },
  webServer: {
    command: 'pnpm preview',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env['CI'],
  },
});
