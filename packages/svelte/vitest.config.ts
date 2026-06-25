import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    svelte({
      hot: !process.env.VITEST,
    }),
  ],
  resolve: {
    conditions: process.env.VITEST ? ['browser'] : undefined,
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
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: fileURLToPath(new URL('../../coverage/svelte', import.meta.url)),
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
    },
  },
})
