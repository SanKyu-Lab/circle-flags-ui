import { resolve } from 'node:path'
import { defineConfig } from 'tsup'
import {
  createBaseTsupConfig,
  createBuildDefines,
  createFlagModulesPlugin,
  createOnSuccess,
} from '../../scripts/tsup/shared.mjs'

const isProduction = process.env.NODE_ENV === 'production'

const external = ['vue']

const define = createBuildDefines({ prefix: 'VUE_CIRCLE_FLAGS' })

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
      entry: ['src/index.ts', 'src/meta.ts'],
      clean: !isWatch,
      dts: true,
      esbuildPlugins: [flagModules],
      onSuccess: createOnSuccess('Main Entry'),
    },
    {
      ...baseConfig,
      entry: ['generated/flags/*.ts'],
      outDir: 'dist/flags',
      splitting: false,
      clean: false,
      dts: false,
      minify: true, // Always minify to a single line
      esbuildPlugins: [flagModules],
      onSuccess: createOnSuccess('Flags Entry'),
    },
  ]
})
