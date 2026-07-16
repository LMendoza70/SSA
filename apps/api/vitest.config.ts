import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: './src',
    include: ['**/*.spec.ts'],
    exclude: ['node_modules', 'dist'],
    setupFiles: ['./test-setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['**/*.service.ts'],
      exclude: ['node_modules', 'dist', '**/*.spec.ts'],
    },
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src'),
    },
  },
});
