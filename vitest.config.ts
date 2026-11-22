import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    include: ['apps/**/*.spec.ts', 'libs/**/*.spec.ts'],
  },
});
