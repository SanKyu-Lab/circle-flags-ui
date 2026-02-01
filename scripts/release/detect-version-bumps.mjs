import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const args = process.argv.slice(2)
const getArg = name => {
  const idx = args.indexOf(name)
  if (idx === -1) return null
  const value = args[idx + 1]
  if (!value || value.startsWith('--')) return null
  return value
}

const before = getArg('--before') ?? process.env.GITHUB_EVENT_BEFORE ?? ''
const after = getArg('--after') ?? process.env.GITHUB_SHA ?? ''
const githubOutput = getArg('--github-output')

if (!after) {
  console.error('Missing --after (or GITHUB_SHA)')
  process.exit(2)
}

const repoRoot = resolve(process.cwd())

const execGit = gitArgs =>
  execFileSync('git', gitArgs, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()

const resolveBefore = () => {
  if (before && before !== '0000000000000000000000000000000000000000') return before
  return execGit(['rev-list', '--max-parents=0', 'HEAD'])
}

const resolvedBefore = resolveBefore()

const filesRaw = execGit([
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
  const diff = execGit(['diff', resolvedBefore, after, '--unified=0', '--', file])
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

execFileSync('bash', ['-lc', `cat >> "${githubOutput}" <<'OUT'\n${out.join('\n')}\nOUT\n`], {
  cwd: repoRoot,
  stdio: 'ignore',
})
