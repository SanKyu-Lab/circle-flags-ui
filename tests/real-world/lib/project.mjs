// Copies a consumer project into the work directory, points its @sankyu/* dependencies at the
// packed tarballs and installs it the way a user would: from the registry, without a lockfile.
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SKIPPED_ENTRIES = new Set([
  'node_modules',
  'dist',
  'build',
  '.output',
  '.next',
  '.nuxt',
  '.svelte-kit',
  '.turbo',
  'package-lock.json',
])

// Packages with install scripts that the consumer projects need.
const BUILT_DEPENDENCIES = ['@parcel/watcher', 'esbuild', 'sharp', 'unrs-resolver']

export const readTarballs = dir => {
  const tarballs = new Map()
  for (const file of readdirSync(dir)) {
    const match = file.match(/^sankyu-(.+?)-(\d+\.\d+\.\d+(?:-[\w.]+)?)\.tgz$/)
    if (match) tarballs.set(`@sankyu/${match[1]}`, join(dir, file))
  }
  if (tarballs.size === 0) throw new Error(`No @sankyu/* tarballs in ${dir}`)
  return tarballs
}

const pointAtTarballs = (dependencies, tarballs) => {
  if (!dependencies) return
  for (const name of Object.keys(dependencies)) {
    const tarball = tarballs.get(name)
    if (tarball) dependencies[name] = `file:${tarball}`
  }
}

export const prepareProject = ({ source, target, tarballs, libDir, variant }) => {
  rmSync(target, { recursive: true, force: true })
  cpSync(source, target, {
    recursive: true,
    filter: path => !SKIPPED_ENTRIES.has(path.split('/').at(-1)),
  })
  cpSync(libDir, join(target, '_lib'), { recursive: true })

  const manifestPath = join(target, 'package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  delete manifest.realWorld
  if (variant) {
    manifest.dependencies = { ...manifest.dependencies, ...variant.dependencies }
    manifest.devDependencies = { ...manifest.devDependencies, ...variant.devDependencies }
  }
  pointAtTarballs(manifest.dependencies, tarballs)
  pointAtTarballs(manifest.devDependencies, tarballs)
  manifest.pnpm = {
    ...manifest.pnpm,
    overrides: Object.fromEntries([...tarballs].map(([name, path]) => [name, `file:${path}`])),
    onlyBuiltDependencies: BUILT_DEPENDENCIES,
  }
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
}

// Runs a command in a project directory and appends its output to the project log.
export const run = (command, args, { cwd, env, log }) => {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  })
  const output = `$ ${command} ${args.join(' ')}\n${result.stdout ?? ''}${result.stderr ?? ''}\n`
  writeFileSync(log, output, { flag: 'a' })
  if (result.error) throw result.error
  return { status: result.status, output }
}

export const installProject = ({ dir, log }) =>
  run('pnpm', ['install', '--ignore-workspace', '--no-frozen-lockfile', '--reporter=append-only'], {
    cwd: dir,
    log,
  })

export const readVariants = source => {
  const manifest = JSON.parse(readFileSync(join(source, 'package.json'), 'utf8'))
  const variants = manifest.realWorld?.variants
  if (!variants) return [{ suffix: '', variant: undefined }]
  return Object.entries(variants).map(([name, variant]) => ({ suffix: `-${name}`, variant }))
}

export const hasFile = (dir, file) => existsSync(join(dir, file))
