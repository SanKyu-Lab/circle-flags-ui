import { defineConfig } from 'tsup'
import {
  createBaseTsupConfig,
  createBuildDefines,
  createOnSuccess,
} from '../../scripts/tsup/shared.ts'

const isProduction = process.env.NODE_ENV === 'production'
const external = ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime']

const define = createBuildDefines({ prefix: 'REACT_CIRCLE_FLAGS' })

const applyReactJsx = (options: { jsx?: string; jsxImportSource?: string }) => {
  options.jsx = 'automatic'
  options.jsxImportSource = 'react'
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
      entry: ['src/index.tsx'],
      clean: !isWatch,
      dts: true,
      onSuccess: createOnSuccess('Main Entry'),
    },
    {
      ...baseConfig,
      entry: ['generated/flags/*.tsx'],
      outDir: 'dist/flags',
      splitting: false,
      clean: false,
      dts: false, // Generate per-flag .d.ts via custom script to avoid broken rollup chunks
      minify: true, // Always minify to a single line
      esbuildOptions: applyReactJsx,
      onSuccess: createOnSuccess('Flags Entry'),
    },
  ]
})
