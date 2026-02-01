import { defineConfig } from 'tsup'
import { solidPlugin } from 'esbuild-plugin-solid'
import {
  createBaseTsupConfig,
  createBuildDefines,
  createOnSuccess,
} from '../../scripts/tsup/shared.ts'

const isProduction = process.env.NODE_ENV === 'production'

const external = ['solid-js', '@sankyu/circle-flags-core']

const define = createBuildDefines({ prefix: 'SOLID_CIRCLE_FLAGS' })

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
      entry: ['src/index.tsx'],
      clean: !isWatch,
      dts: true,
      format: ['esm', 'cjs'],
      esbuildPlugins: [solidPlugin()],
      onSuccess: createOnSuccess('Main Entry'),
    },
    {
      ...baseConfig,
      entry: ['generated/flags/*.tsx'],
      outDir: 'dist/flags',
      splitting: false,
      clean: false,
      dts: false,
      minify: true, // Always minify to a single line
      format: ['esm', 'cjs'],
      esbuildPlugins: [solidPlugin()],
      onSuccess: createOnSuccess('Flags Entry'),
    },
  ]
})
