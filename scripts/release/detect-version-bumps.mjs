import { appendFileSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Command } from 'commander'
import { simpleGit } from 'simple-git'

const program = new Command()
  .name('detect-version-bumps')
  .description('Detect packages/*/package.json version changes and emit a matrix payload.')
  .option('--before <sha>', 'Git ref before the change')
  .option('--after <sha>', 'Git ref after the change')
  .option('--github-output <path>', 'Write outputs to GitHub Actions $GITHUB_OUTPUT file')

program.parse()
const options = program.opts()

const before = options.before ?? process.env.GITHUB_EVENT_BEFORE ?? ''
const after = options.after ?? process.env.GITHUB_SHA ?? ''
const githubOutput = options.githubOutput

if (!after) {
  console.error('Missing --after (or GITHUB_SHA)')
  process.exit(2)
}

const repoRoot = resolve(process.cwd())
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
