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

const flagsDir = resolve('generated/flags')
const flagEntries = ['generated/flags/*.tsx', 'generated/flags/index.ts']

// `dist` serves the browser and default conditions, `dist/server` serves node, worker and deno.
// Both are hydratable so either one can hydrate markup rendered by the other.
const compiledTargets = [
  { label: 'DOM', outDir: 'dist', generate: 'dom', platform: 'browser' },
  { label: 'SSR', outDir: 'dist/server', generate: 'ssr', platform: 'node' },
] as const

// @ts-expect-error tsup options signature typing mismatch
export default defineConfig(options => {
  const isWatch = Boolean(options.watch)

  const baseConfig = createBaseTsupConfig({
    external,
    define,
    isProduction,
  })

  const compiled = compiledTargets.flatMap(target => {
    const plugins = () => [
      createFlagModulesPlugin({ flagsDir }),
      solidPlugin({ solid: { generate: target.generate, hydratable: true } }),
    ]
    const isDom = target.generate === 'dom'

    return [
      {
        ...baseConfig,
        entry: isDom ? ['src/index.tsx', 'src/meta.ts'] : ['src/index.tsx'],
        outDir: target.outDir,
        platform: target.platform,
        clean: isDom && !isWatch,
        dts: isDom,
        format: ['esm', 'cjs'],
        esbuildPlugins: plugins(),
        onSuccess: createOnSuccess(`${target.label} Entry`),
      },
      {
        ...baseConfig,
        entry: flagEntries,
        outDir: `${target.outDir}/flags`,
        platform: target.platform,
        splitting: false,
        clean: false,
        dts: false,
        minify: true, // Always minify to a single line
        format: ['esm', 'cjs'],
        esbuildPlugins: plugins(),
        onSuccess: createOnSuccess(`${target.label} Flags`),
      },
    ]
  })

  // The `solid` condition gets JSX as written, so vite-plugin-solid and SolidStart compile it
  // for their own target (dom or ssr, hydratable or not).
  const sourceOptions = {
    ...baseConfig,
    format: ['esm'],
    dts: false,
    clean: false,
    outExtension: () => ({ js: '.jsx' }),
    esbuildOptions: (esbuildOptions: { jsx?: string }) => {
      esbuildOptions.jsx = 'preserve'
    },
    esbuildPlugins: [createFlagModulesPlugin({ flagsDir, extension: '.jsx' })],
  }

  return [
    ...compiled,
    {
      ...sourceOptions,
      entry: ['src/index.tsx'],
      outDir: 'dist/source',
      onSuccess: createOnSuccess('Source Entry'),
    },
    {
      ...sourceOptions,
      entry: flagEntries,
      outDir: 'dist/source/flags',
      splitting: false,
      onSuccess: createOnSuccess('Source Flags'),
    },
  ]
})
