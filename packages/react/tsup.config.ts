import { resolve } from 'node:path'
import { defineConfig } from 'tsup'
import {
  createBaseTsupConfig,
  createBuildDefines,
  createFlagModulesPlugin,
  createOnSuccess,
} from '../../scripts/tsup/shared.mjs'

const isProduction = process.env.NODE_ENV === 'production'
const external = ['react', 'react-dom']

const define = createBuildDefines({ prefix: 'REACT_CIRCLE_FLAGS' })

const flagModules = createFlagModulesPlugin({ flagsDir: resolve('generated/flags') })

// `react/jsx-runtime` exists from React 16.14 and is not in the `exports` of React 16 and 17,
// so strict ESM resolvers such as webpack 5 cannot load it from `.mjs` files. The build compiles
// JSX to `createElement` (tsconfig.build.json), which works in every React version the peer range
// accepts, and esbuild imports the factory from `react` through the injected module.
const applyReactJsx = (options: { tsconfig?: string; inject?: string[] }) => {
  options.tsconfig = resolve('tsconfig.build.json')
  options.inject = [resolve('../../scripts/tsup/react-jsx-factory.mjs')]
}

// @ts-expect-error ...
export default defineConfig(options => {
  const isWatch = Boolean(options.watch)

  const baseConfig = createBaseTsupConfig({
    external,
    define,
    isProduction,
    esbuildOptions: applyReactJsx,
  })

  return [
    {
      ...baseConfig,
      entry: ['src/index.tsx', 'src/meta.ts'],
      clean: !isWatch,
      dts: true,
      esbuildPlugins: [flagModules],
      onSuccess: createOnSuccess('Main Entry'),
    },
    {
      ...baseConfig,
      entry: ['generated/flags/*.tsx', 'generated/flags/index.ts'],
      outDir: 'dist/flags',
      splitting: false,
      clean: false,
      dts: false, // Generate per-flag .d.ts via custom script to avoid broken rollup chunks
      minify: true, // Always minify to a single line
      esbuildOptions: applyReactJsx,
      esbuildPlugins: [flagModules],
      onSuccess: createOnSuccess('Flags Entry'),
    },
  ]
})
