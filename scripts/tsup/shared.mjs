import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repoRootDir = fileURLToPath(new URL('../..', import.meta.url))
const circleFlagsDir = fileURLToPath(new URL('../../circle-flags', import.meta.url))

const tryExec = (command, options) => {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
      ...options,
    }).trim()
  } catch {
    return null
  }
}

export const resolveRepoCommit = envVarName => {
  const env = process.env
  if (env[envVarName]) return env[envVarName]
  if (env.GIT_COMMIT) return env.GIT_COMMIT
  return tryExec('git rev-parse HEAD', { cwd: repoRootDir }) ?? 'dev'
}

export const resolveCircleFlagsCommit = envVarName => {
  const env = process.env
  if (env[envVarName]) return env[envVarName]
  return tryExec('git rev-parse HEAD', { cwd: circleFlagsDir }) ?? 'unknown'
}

export const resolveBuiltAt = envVarName => {
  const env = process.env
  const fallback = `${Date.now()}`
  const source = env[envVarName] ?? env.BUILD_TIMESTAMP ?? env.BUILD_AT
  const parsed = Number.parseInt(source ?? fallback, 10)
  return Number.isFinite(parsed) ? `${parsed}` : fallback
}

export const createBuildDefines = options => {
  const { prefix } = options
  const commit = resolveRepoCommit(`${prefix}_COMMIT`)
  const circleFlagsCommit = resolveCircleFlagsCommit(`${prefix}_CIRCLE_FLAGS_COMMIT`)
  const builtAt = resolveBuiltAt(`${prefix}_BUILT_AT`)

  return {
    [`__${prefix}_COMMIT__`]: JSON.stringify(commit),
    [`__${prefix}_CIRCLE_FLAGS_COMMIT__`]: JSON.stringify(circleFlagsCommit),
    [`__${prefix}_BUILT_AT__`]: JSON.stringify(builtAt),
  }
}

export const createOnSuccess = label => {
  let buildCount = 0
  return () => {
    buildCount += 1
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false })
    const phase =
      buildCount === 1 ? 'Initial build complete' : `Incremental build complete #${buildCount}`
    console.log(`✅ ${label} ${phase} (${timestamp})`)
  }
}

export const outExtensionMjsCjs = ({ format }) => ({
  js: format === 'esm' ? '.mjs' : '.cjs',
})

export const createBaseTsupConfig = options => {
  const { external, define, isProduction, esbuildOptions } = options

  return {
    format: ['cjs', 'esm'],
    dts: false,
    sourcemap: false,
    treeshake: true,
    minify: isProduction,
    silent: true,
    external,
    target: 'es2020',
    define,
    outExtension: outExtensionMjsCjs,
    ...(esbuildOptions ? { esbuildOptions } : {}),
  }
}
