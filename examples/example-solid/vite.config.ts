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
  // Vite 8 (rolldown-vite) 的依赖扫描器默认对 .tsx 使用 React JSX transform，
  // 在 Solid 项目中会误报找不到 react/jsx-dev-runtime。
  // 关闭自动发现后由 vite-plugin-solid 在 serve 阶段正常转换源码。
  optimizeDeps: {
    noDiscovery: true,
  },
  plugins: [solid(), tailwindcss()],
})
