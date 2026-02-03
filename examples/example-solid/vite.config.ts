import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@example-shared': fileURLToPath(new URL('../shared/src', import.meta.url)),
    },
  },
  server: {
    // 31000: For ./examples/example-*
    // +1: react, +2: vue, +3: solid, +4: svelte, ...
    port: 31003,
    host: true,
    fs: {
      allow: ['..'],
    },
  },
  plugins: [solid(), tailwindcss()],
})
