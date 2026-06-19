import svelte from 'rollup-plugin-svelte'
import { sveltePreprocess } from 'svelte-preprocess'
import { defineConfig } from 'tsdown'
import { svelteDtsPlugin } from './scripts/svelte-dts-plugin.mjs'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'neutral',
  clean: true,
  minify: isProduction,
  sourcemap: !isProduction,
  // Keep Svelte components as source files. Consumers compile them with their
  // own Svelte toolchain, which gives the best tree-shaking, SSR/hydration
  // consistency, and version compatibility.
  deps: {
    neverBundle: [/^\.\.?\/.+\.svelte$/],
  },
  plugins: [
    svelte({ preprocess: sveltePreprocess() }),
    svelteDtsPlugin({
      declarationDir: './dist',
      mappings: [
        { src: './src', dst: './dist' },
        { src: './generated/flags', dst: './dist/flags' },
      ],
      tsconfig: './tsconfig.json',
    }),
  ],
})
