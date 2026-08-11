import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: './test',
    include: ['**/*.integration-spec.ts'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 60000,
    hookTimeout: 30000,
    setupFiles: ['../src/test-setup.ts'],
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src'),
    },
  },
});
