import { appendFileSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { Command } from 'commander'
import { simpleGit } from 'simple-git'

const DEFAULT_REGISTRY = 'https://registry.npmjs.org'

const program = new Command()
  .name('detect-version-bumps')
  .description(
    'Detect releasable packages and emit a GitHub Actions matrix payload. Modes: changed (git diff) or unpublished (npm registry).'
  )
  .option('--before <sha>', 'Git ref before the change')
  .option('--after <sha>', 'Git ref after the change')
  .option('--mode <mode>', 'Detection mode: changed|unpublished', 'changed')
  .option('--registry <url>', 'NPM registry base url', DEFAULT_REGISTRY)
  .option('--github-output <path>', 'Write outputs to GitHub Actions $GITHUB_OUTPUT file')

program.parse()
const options = program.opts()

const before = options.before ?? process.env.GITHUB_EVENT_BEFORE ?? ''
const after = options.after ?? process.env.GITHUB_SHA ?? ''
const githubOutput = options.githubOutput
const mode = String(options.mode ?? 'changed')
const registryBase = String(options.registry ?? DEFAULT_REGISTRY).replace(/\/+$/, '')

const repoRoot = resolve(process.cwd())

const encodeRegistryPackageName = name => {
  if (name.startsWith('@')) return name.replace('/', '%2f')
  return name
}

const fetchRegistry = async url => {
  const res = await fetch(url, {
    headers: {
      accept: 'application/vnd.npm.install-v1+json, application/json',
      'user-agent': 'circle-flags-ui-release-script',
    },
  })
  return res
}

const isVersionPublished = async (name, version) => {
  const encodedName = encodeRegistryPackageName(name)
  const url = `${registryBase}/${encodedName}`
  const res = await fetchRegistry(url)

  if (res.status === 404) return false
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Registry request failed (${res.status}) for ${name}: ${text.slice(0, 500)}`)
  }

  const data = await res.json()
  return Boolean(data?.versions?.[version])
}

const collectWorkspacePackages = () => {
  const packagesDir = resolve(repoRoot, 'packages')
  const dirents = readdirSync(packagesDir, { withFileTypes: true })

  const packages = []
  for (const d of dirents) {
    if (!d.isDirectory()) continue

    const dir = `packages/${d.name}`
    const packageJsonPath = resolve(repoRoot, dir, 'package.json')
    let json
    try {
      json = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    } catch {
      continue
    }

    if (json.private) continue

    const slug = d.name
    packages.push({
      dir,
      name: json.name,
      version: json.version,
      slug,
      tag: `${slug}-v${json.version}`,
    })
  }
  return packages
}

const detectByGitDiff = async () => {
  if (!after) {
    console.error('Missing --after (or GITHUB_SHA)')
    process.exit(2)
  }

  const git = simpleGit({ baseDir: repoRoot })
  const execGit = async gitArgs => (await git.raw(gitArgs)).trim()

  const resolveBefore = async () => {
    if (before && before !== '0000000000000000000000000000000000000000') return before
    return execGit(['rev-list', '--max-parents=0', 'HEAD'])
  }

  const resolvedBefore = await resolveBefore()

  const filesRaw = await execGit([
    'diff',
    '--name-only',
    resolvedBefore,
    after,
    '--',
    'packages/*/package.json',
  ])
  const files = filesRaw ? filesRaw.split('\n').filter(Boolean) : []

  const packages = []

  for (const file of files) {
    const diff = await execGit(['diff', resolvedBefore, after, '--unified=0', '--', file])
    if (!/^[+-].*"version"\s*:/m.test(diff)) continue

    const json = JSON.parse(readFileSync(resolve(repoRoot, file), 'utf8'))
    if (json.private) continue

    const dir = file.replace(/\/package\.json$/, '')
    const slug = dir.split('/').filter(Boolean).at(-1)
    packages.push({
      dir,
      name: json.name,
      version: json.version,
      slug,
      tag: `${slug}-v${json.version}`,
    })
  }

  return packages
}

const detectUnpublished = async () => {
  const all = collectWorkspacePackages()
  const result = []

  for (const pkg of all) {
    const published = await isVersionPublished(pkg.name, pkg.version)
    if (!published) result.push(pkg)
  }

  return result
}

let packages = []
switch (mode) {
  case 'changed':
    packages = await detectByGitDiff()
    break
  case 'unpublished':
    packages = await detectUnpublished()
    break
  default:
    console.error(`Unknown --mode: ${mode}. Expected "changed" or "unpublished".`)
    process.exit(2)
}

const packagesJson = JSON.stringify(packages)
const packagesMd = packages.map(p => `- \`${p.name}@${p.version}\` → \`${p.tag}\``).join('\n')
const hasPackages = packages.length > 0

if (!githubOutput) {
  process.stdout.write(packagesJson)
  process.exit(0)
}

const out = []
out.push(`has_packages=${hasPackages ? 'true' : 'false'}`)
out.push(`packages_json=${packagesJson}`)
out.push('packages_md<<EOF')
out.push(packagesMd)
out.push('EOF')
out.push('')

appendFileSync(githubOutput, `${out.join('\n')}\n`, 'utf8')
