import { defineConfig } from 'tsup'
import {
  createBaseTsupConfig,
  createBuildDefines,
  createOnSuccess,
} from '../../scripts/tsup/shared.ts'

const isProduction = process.env.NODE_ENV === 'production'

const external = ['vue']

const define = createBuildDefines({ prefix: 'VUE_CIRCLE_FLAGS' })

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
      onSuccess: createOnSuccess('Flags Entry'),
    },
  ]
})
