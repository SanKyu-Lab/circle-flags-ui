import { defineConfig } from 'tsup'
import sveltePlugin from 'esbuild-svelte'
import {
  createBaseTsupConfig,
  createBuildDefines,
  createOnSuccess,
} from '../../scripts/tsup/shared.mjs'

const isProduction = process.env.NODE_ENV === 'production'

const external = ['svelte', 'svelte/internal', 'svelte/internal/client']

const define = createBuildDefines({ prefix: 'SVELTE_CIRCLE_FLAGS' })

// @ts-expect-error tsup options signature typing mismatch
export default defineConfig(options => {
  const isWatch = Boolean(options.watch)

  const baseConfig = createBaseTsupConfig({
    external,
    define,
    isProduction,
  })

  return [
    {
      ...baseConfig,
      entry: ['src/index.ts'],
      clean: !isWatch,
      dts: true,
      format: ['esm', 'cjs'],
      esbuildPlugins: [sveltePlugin()],
      onSuccess: createOnSuccess('Main Entry'),
    },
    {
      ...baseConfig,
      entry: ['generated/flags/*.svelte'],
      outDir: 'dist/flags',
      splitting: false,
      clean: false,
      dts: false,
      minify: true,
      format: ['esm', 'cjs'],
      esbuildPlugins: [sveltePlugin()],
      onSuccess: createOnSuccess('Flags Entry'),
    },
  ]
})
