import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const contentDir = fileURLToPath(new URL('../../content', import.meta.url));

export default defineConfig({
  resolve: {
    alias: { '@content': contentDir },
  },
  test: {
    // e2e/ belongs to Playwright (pnpm e2e), not Vitest.
    exclude: ['e2e/**', 'node_modules/**'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    passWithNoTests: true,
  },
});
