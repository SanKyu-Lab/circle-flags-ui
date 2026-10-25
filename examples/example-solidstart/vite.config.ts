import { solidStart } from '@solidjs/start/config'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [solidStart(), nitro()],
  server: {
    host: '0.0.0.0',
    port: 31007,
  },
})
