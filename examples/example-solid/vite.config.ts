import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    // 31000: For ./examples/example-*
    // +1: react, +2: vue, +3: solid, +4: svelte, ...
    port: 31003,
    host: true,
  },
  plugins: [solid(), tailwindcss()],
})
