import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  resolve: {
    alias: [
      {
        find: /^@sankyu\/circle-flags-core$/,
        replacement: fileURLToPath(new URL('../core/src/index.ts', import.meta.url)),
      },
      {
        find: /^@sankyu\/circle-flags-core\/(.*)$/,
        replacement: fileURLToPath(new URL('../core/src/$1', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: [], // Override vite-plugin-solid's auto-detection of jest-dom
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: fileURLToPath(new URL('../../coverage/solid', import.meta.url)),
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    },
  },
})
