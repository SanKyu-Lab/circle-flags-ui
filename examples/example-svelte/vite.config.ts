import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    // 31000: For ./examples/example-*
    // +1: react, +2: vue, +3: solid, +4: svelte, ...
    port: 31004,
    host: true,
  },
  plugins: [tailwindcss(), svelte()],
})
