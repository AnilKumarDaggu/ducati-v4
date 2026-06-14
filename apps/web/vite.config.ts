import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const contentDir = fileURLToPath(new URL('../../content', import.meta.url));
const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Authored content is data, versioned at repo root (ARCH-002 §7).
    alias: { '@content': contentDir },
  },
  server: {
    port: 5173,
    fs: { allow: [repoRoot] },
  },
  build: {
    target: 'es2022',
    // Slice assets are served static from this deploy (RDM-003 §0 — no R2 until MVP).
    assetsInlineLimit: 0,
  },
});
