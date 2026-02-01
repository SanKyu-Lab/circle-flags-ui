import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'

const args = process.argv.slice(2)
const getArg = name => {
  const idx = args.indexOf(name)
  if (idx === -1) return null
  const value = args[idx + 1]
  if (!value || value.startsWith('--')) return null
  return value
}

const packageDirArg = getArg('--package-dir')
const packageName = getArg('--package-name')
const version = getArg('--version')
const currentTag = getArg('--tag')
const prevTagArg = getArg('--prev-tag') ?? ''
const notesPath = getArg('--notes-path')

if (!packageDirArg || !packageName || !version) {
  console.error(
    'Usage: node scripts/release/generate-package-changelog.mjs --package-dir <dir> --package-name <name> --version <version> [--tag <tag>] [--prev-tag <tag>] [--notes-path <path>]'
  )
  process.exit(2)
}

const repoRoot = resolve(process.cwd())
const packageDir = resolve(repoRoot, packageDirArg)
const slug = packageDir.split('/').filter(Boolean).at(-1)

const execGit = (gitArgs, options = {}) =>
  execFileSync('git', gitArgs, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim()

const findPrevTag = () => {
  if (prevTagArg) return prevTagArg
  if (!slug) return ''

  const tagsRaw = execGit(['tag', '--list', `${slug}-v*`, '--sort=-v:refname'])
  const tags = tagsRaw ? tagsRaw.split('\n').filter(Boolean) : []
  if (!tags.length) return ''
  if (!currentTag) return tags[0] ?? ''
  return tags.find(tag => tag !== currentTag) ?? ''
}

const prevTag = findPrevTag()
const rangeArgs = prevTag ? [`${prevTag}..HEAD`] : ['HEAD']

const logFormat = '%H%x1f%s%x1f%b%x1e'
const logRaw = execGit([
  'log',
  ...rangeArgs,
  `--format=${logFormat}`,
  '--',
  packageDirArg,
  `:(exclude)${packageDirArg}/CHANGELOG.md`,
])

const commits = logRaw
  ? logRaw
      .split('\x1e')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const [hash, subject, body] = line.split('\x1f')
        return { hash, subject: subject ?? '', body: body ?? '' }
      })
  : []

const parseConventional = subject => {
  const match = /^(?<type>[a-zA-Z]+)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?:\s*(?<desc>.+)$/.exec(
    subject.trim()
  )
  if (!match?.groups) return null
  return {
    type: match.groups.type.toLowerCase(),
    scope: match.groups.scope ?? '',
    breaking: Boolean(match.groups.breaking),
    desc: match.groups.desc ?? '',
  }
}

const hasBreakingInBody = body => /BREAKING CHANGE:/i.test(body)

const buckets = {
  breaking: [],
  feat: [],
  fix: [],
  perf: [],
  refactor: [],
  docs: [],
  chore: [],
  other: [],
}

for (const commit of commits) {
  const parsed = parseConventional(commit.subject)
  const breaking = Boolean(parsed?.breaking) || hasBreakingInBody(commit.body)

  const desc = parsed?.desc?.trim() || commit.subject.trim()
  const scope = parsed?.scope ? `**${parsed.scope}**: ` : ''
  const shortHash = commit.hash.slice(0, 7)
  const line = `- ${scope}${desc} (${shortHash})`

  if (breaking) {
    buckets.breaking.push(line)
    continue
  }

  switch (parsed?.type) {
    case 'feat':
      buckets.feat.push(line)
      break
    case 'fix':
      buckets.fix.push(line)
      break
    case 'perf':
      buckets.perf.push(line)
      break
    case 'refactor':
      buckets.refactor.push(line)
      break
    case 'docs':
      buckets.docs.push(line)
      break
    case 'chore':
    case 'build':
    case 'ci':
    case 'test':
    case 'style':
      buckets.chore.push(line)
      break
    default:
      buckets.other.push(line)
  }
}

const today = new Date().toISOString().slice(0, 10)

const sections = []
if (buckets.breaking.length) sections.push(['Breaking Changes', buckets.breaking])
if (buckets.feat.length) sections.push(['Features', buckets.feat])
if (buckets.fix.length) sections.push(['Bug Fixes', buckets.fix])
if (buckets.perf.length) sections.push(['Performance', buckets.perf])
if (buckets.refactor.length) sections.push(['Refactors', buckets.refactor])
if (buckets.docs.length) sections.push(['Documentation', buckets.docs])
if (buckets.chore.length) sections.push(['Chores', buckets.chore])
if (buckets.other.length) sections.push(['Other', buckets.other])

const header = `# Changelog

All notable changes to \`${packageName}\` will be documented in this file.

This project follows Conventional Commits.
`

const changelogPath = join(packageDir, 'CHANGELOG.md')
const existing = existsSync(changelogPath) ? readFileSync(changelogPath, 'utf8') : ''
const base = existing.trim() ? existing : header

const alreadyHasVersion = new RegExp(`^##\\s+${version.replaceAll('.', '\\.')}(\\s|$)`, 'm').test(
  base
)

let entry = `## ${version} - ${today}\n\n`
if (!sections.length) {
  entry += '- No changes recorded.\n'
} else {
  for (const [title, lines] of sections) {
    entry += `### ${title}\n\n${lines.join('\n')}\n\n`
  }
}

const notes = `## ${packageName}@${version}\n\n${
  prevTag ? `- Previous tag: \`${prevTag}\`\n` : '- Previous tag: (none)\n'
}\n${entry.trimEnd()}\n`

const insertAfterHeader = content => {
  if (!content.startsWith('# Changelog'))
    return `${header}\n\n${entry}\n${content}`.trimEnd() + '\n'

  const lines = content.split('\n')
  const headerEndIdx = (() => {
    for (let i = 1; i < lines.length; i += 1) {
      if (lines[i].startsWith('## ')) return i
    }
    return lines.length
  })()

  const before = lines.slice(0, headerEndIdx).join('\n').trimEnd()
  const after = lines.slice(headerEndIdx).join('\n').trimStart()
  return `${before}\n\n${entry}\n${after}`.trimEnd() + '\n'
}

if (!alreadyHasVersion) {
  const next = insertAfterHeader(base)
  writeFileSync(changelogPath, next)
}

if (notesPath) {
  const resolvedNotesPath = resolve(repoRoot, notesPath)
  writeFileSync(resolvedNotesPath, notes)
}

process.stdout.write(
  `Updated ${relative(repoRoot, changelogPath)} (prevTag=${prevTag || '(none)'})\n`
)
