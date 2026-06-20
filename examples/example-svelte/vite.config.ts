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
  // vite-plugin-svelte 在预打包 400+ 个 Svelte 国旗组件时，
  // 在 StackBlitz/WebContainer 环境下可能触发 sourcemap/rolldown 异常导致进程退出。
  // 直接排除该包，让浏览器按原生 ESM 加载 .svelte 组件。
  optimizeDeps: {
    exclude: ['@sankyu/svelte-circle-flags'],
  },
  plugins: [tailwindcss(), svelte()],
})
