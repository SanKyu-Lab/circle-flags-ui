import { execSync } from 'child_process'
import { defineConfig } from 'tsup'

const isProduction = process.env.NODE_ENV === 'production'
const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  '@sankyu/circle-flags-core',
]

const resolveCommit = () => {
  const env = process.env
  if (env.REACT_CIRCLE_FLAGS_COMMIT) return env.REACT_CIRCLE_FLAGS_COMMIT
  if (env.GIT_COMMIT) return env.GIT_COMMIT

  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim()
  } catch {
    return 'dev'
  }
}

const resolveCircleFlagsCommit = () => {
  const env = process.env
  if (env.REACT_CIRCLE_FLAGS_CIRCLE_FLAGS_COMMIT) return env.REACT_CIRCLE_FLAGS_CIRCLE_FLAGS_COMMIT

  try {
    return execSync('git -C ../../circle-flags rev-parse HEAD', { encoding: 'utf-8' }).trim()
  } catch {
    return 'unknown'
  }
}

const resolveBuiltAt = () => {
  const env = process.env
  const fallback = `${Date.now()}`
  const source = env.REACT_CIRCLE_FLAGS_BUILT_AT ?? env.BUILD_TIMESTAMP ?? env.BUILD_AT
  const parsed = Number.parseInt(source ?? fallback, 10)
  return Number.isFinite(parsed) ? `${parsed}` : fallback
}

const define = {
  __REACT_CIRCLE_FLAGS_COMMIT__: JSON.stringify(resolveCommit()),
  __REACT_CIRCLE_FLAGS_CIRCLE_FLAGS_COMMIT__: JSON.stringify(resolveCircleFlagsCommit()),
  __REACT_CIRCLE_FLAGS_BUILT_AT__: JSON.stringify(resolveBuiltAt()),
}

const createOnSuccess = (label: string) => {
  let buildCount = 0
  return () => {
    buildCount += 1
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false })
    const phase =
      buildCount === 1 ? 'Initial build complete' : `Incremental build complete #${buildCount}`
    console.log(`✅ ${label} ${phase} (${timestamp})`)
  }
}

const applyReactJsx = (options: { jsx?: string; jsxImportSource?: string }) => {
  options.jsx = 'automatic'
  options.jsxImportSource = 'react'
}

// @ts-expect-error ...
export default defineConfig(options => {
  const isWatch = Boolean(options.watch)

  const baseConfig = {
    format: ['cjs', 'esm'],
    dts: false,
    sourcemap: false,
    treeshake: true,
    minify: isProduction,
    silent: true,
    external,
    target: 'es2020',
    esbuildOptions: applyReactJsx,
    define,
    outExtension: ({ format }: { format: 'esm' | 'cjs' | string }) => ({
      js: format === 'esm' ? '.mjs' : '.cjs',
    }),
  }

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
