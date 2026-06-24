/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths so the build works under the GitHub Pages project
  // sub-path (https://user.github.io/<repo>/) without hardcoding the repo name.
  // Routing lives in the URL hash (HashRouter), so this only affects assets.
  base: './',
  plugins: [react()],
  test: {
    // jsdom for component/integration tests; engine tests are pure and run fine here too.
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
