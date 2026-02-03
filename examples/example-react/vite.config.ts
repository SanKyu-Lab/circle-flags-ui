import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // 31000: For ./examples/example-*
    // +1: react, +2: vue, +3: solid, +4: svelte, ...
    port: 31001,
    host: true,
  },
  plugins: [react(), tailwindcss()],
})
