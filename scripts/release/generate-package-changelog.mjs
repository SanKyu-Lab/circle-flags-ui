import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { Command } from 'commander'
import conventionalcommits from 'conventional-changelog-conventionalcommits'
import { CommitParser } from 'conventional-commits-parser'
import { simpleGit } from 'simple-git'

const program = new Command()
  .name('generate-package-changelog')
  .description('Generate per-package CHANGELOG.md and optional release notes markdown.')
  .requiredOption('--package-dir <dir>')
  .requiredOption('--package-name <name>')
  .requiredOption('--version <version>')
  .option('--tag <tag>', 'Tag created for this version')
  .option('--prev-tag <tag>', 'Previous tag', '')
  .option('--notes-path <path>')

program.parse()
const options = program.opts()

const usage =
  'node scripts/release/generate-package-changelog.mjs --package-dir <dir> --package-name <name> --version <version> [--tag <tag>] [--prev-tag <tag>] [--notes-path <path>]'

const packageDirArg = options.packageDir
const packageName = options.packageName
const version = options.version
const currentTag = options.tag
const prevTagArg = options.prevTag ?? ''
const notesPath = options.notesPath

const repoRoot = resolve(process.cwd())
const packageDir = resolve(repoRoot, packageDirArg)
const slug = packageDir.split('/').filter(Boolean).at(-1)
const git = simpleGit({ baseDir: repoRoot })
const preset = await conventionalcommits()
const parser = new CommitParser(preset.parser)

const execGit = async gitArgs => (await git.raw(gitArgs)).trim()

const findPrevTag = () => {
  if (prevTagArg) return prevTagArg
  if (!slug) return ''

  return execGit(['tag', '--list', `${slug}-v*`, '--sort=-v:refname']).then(tagsRaw => {
    const tags = tagsRaw ? tagsRaw.split('\n').filter(Boolean) : []
    if (!tags.length) return ''
    if (!currentTag) return tags[0] ?? ''
    return tags.find(tag => tag !== currentTag) ?? ''
  })
}

const prevTag = await findPrevTag()
const rangeArgs = prevTag ? [`${prevTag}..HEAD`] : ['HEAD']

const logFormat = '%H%x1f%s%x1f%b%x1e'
const logRaw = await execGit([
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
  const parsed = parser.parse(`${commit.subject}\n\n${commit.body}`.trimEnd())
  const breaking = Boolean(parsed.notes?.length)

  const desc = parsed.subject?.trim() || commit.subject.trim()
  const scope = parsed.scope ? `**${parsed.scope}**: ` : ''
  const shortHash = commit.hash.slice(0, 7)
  const line = `- ${scope}${desc} (${shortHash})`

  if (breaking) {
    buckets.breaking.push(line)
    continue
  }

  switch (parsed.type) {
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
