import { resolve } from 'node:path'
import { defineConfig } from 'tsup'
import { solidPlugin } from 'esbuild-plugin-solid'
import {
  createBaseTsupConfig,
  createBuildDefines,
  createFlagModulesPlugin,
  createOnSuccess,
} from '../../scripts/tsup/shared.mjs'

const isProduction = process.env.NODE_ENV === 'production'

const external = ['solid-js']

const define = createBuildDefines({ prefix: 'SOLID_CIRCLE_FLAGS' })

const flagModules = createFlagModulesPlugin({ flagsDir: resolve('generated/flags') })

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
      entry: ['src/index.tsx', 'src/meta.ts'],
      clean: !isWatch,
      dts: true,
      format: ['esm', 'cjs'],
      esbuildPlugins: [flagModules, solidPlugin()],
      onSuccess: createOnSuccess('Main Entry'),
    },
    {
      ...baseConfig,
      entry: ['generated/flags/*.tsx', 'generated/flags/index.ts'],
      outDir: 'dist/flags',
      splitting: false,
      clean: false,
      dts: false,
      minify: true, // Always minify to a single line
      format: ['esm', 'cjs'],
      esbuildPlugins: [flagModules, solidPlugin()],
      onSuccess: createOnSuccess('Flags Entry'),
    },
  ]
})
