import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@example-shared': fileURLToPath(new URL('../shared/src', import.meta.url)),
    },
  },
  server: {
    // 31000: For ./examples/example-*
    // +1: react, +2: vue, +3: solid, +4: svelte, ...
    port: 31002,
    host: true,
    fs: {
      allow: ['..'],
    },
  },
  plugins: [vue(), tailwindcss()],
})
