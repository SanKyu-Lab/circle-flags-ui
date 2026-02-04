import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { Command } from 'commander'
import conventionalcommits from 'conventional-changelog-conventionalcommits'
import { CommitParser } from 'conventional-commits-parser'
import { simpleGit } from 'simple-git'
import { execSync } from 'node:child_process'

const program = new Command()
  .name('generate-package-changelog')
  .description('Generate per-package CHANGELOG.md and optional release notes markdown.')
  .requiredOption('--package-dir <dir>')
  .requiredOption('--package-name <name>')
  .requiredOption('--version <version>')
  .option('--tag <tag>', 'Tag created for this version')
  .option('--prev-tag <tag>', 'Previous tag', '')
  .option('--notes-path <path>')
  .option('--github-token <token>', 'GitHub token for fetching PR info')
  .option('--repo-owner <owner>', 'GitHub repo owner', 'SanKyu-Lab')
  .option('--repo-name <name>', 'GitHub repo name', 'circle-flags-ui')

program.parse()
const options = program.opts()

const packageDirArg = options.packageDir
const packageName = options.packageName
const version = options.version
const currentTag = options.tag
const prevTagArg = options.prevTag ?? ''
const notesPath = options.notesPath
const githubToken = options.githubToken ?? process.env.GITHUB_TOKEN
const repoOwner = options.repoOwner
const repoName = options.repoName

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

// Fetch PR info using GitHub API with retry
const prInfoCache = new Map()

const fetchPrInfo = async (commitHash, retries = 2) => {
  if (!githubToken) return null

  if (prInfoCache.has(commitHash)) {
    return prInfoCache.get(commitHash)
  }

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/commits/${commitHash}/pulls`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github.groot-preview+json',
          },
        }
      )

      // Handle rate limiting
      if (response.status === 403) {
        const resetTime = response.headers.get('x-ratelimit-reset')
        if (resetTime && i < retries) {
          const waitTime = parseInt(resetTime) * 1000 - Date.now() + 1000
          if (waitTime > 0) {
            await new Promise(resolve => setTimeout(resolve, Math.min(waitTime, 5000)))
            continue
          }
        }
      }

      if (!response.ok) {
        prInfoCache.set(commitHash, null)
        return null
      }

      const pulls = await response.json()
      if (pulls && pulls.length > 0) {
        const pr = pulls[0]
        const info = {
          number: pr.number,
          author: pr.user?.login,
        }
        prInfoCache.set(commitHash, info)
        return info
      }

      prInfoCache.set(commitHash, null)
      return null
    } catch {
      if (i === retries) {
        prInfoCache.set(commitHash, null)
        return null
      }
    }
  }

  prInfoCache.set(commitHash, null)
  return null
}

const buckets = {
  breaking: [],
  feat: [],
  fix: [],
  perf: [],
  refactor: [],
  docs: [],
  chore: [],
  style: [],
  other: [],
}

for (const commit of commits) {
  const parsed = parser.parse(`${commit.subject}\n\n${commit.body}`.trimEnd())
  const breaking = Boolean(parsed.notes?.length)

  const desc = parsed.subject?.trim() || commit.subject.trim()
  const scope = parsed.scope ? `**${parsed.scope}**: ` : ''

  // Get PR info
  const prInfo = await fetchPrInfo(commit.hash)
  const prSuffix = prInfo ? `(@${prInfo.author} in #${prInfo.number})` : ''

  const line = `- ${scope}${desc}${prSuffix}`

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
      buckets.chore.push(line)
      break
    case 'style':
      buckets.style.push(line)
      break
    // Filter out: build, ci, test
    default:
      if (!['build', 'ci', 'test'].includes(parsed.type)) {
        buckets.other.push(line)
      }
  }
}

const today = new Date().toISOString().slice(0, 10)

const sections = []
if (buckets.breaking.length) sections.push(['### 💥 Breaking Changes', buckets.breaking])
if (buckets.feat.length) sections.push(['### 🚀 Features', buckets.feat])
if (buckets.fix.length) sections.push(['### 🐛 Bug Fixes', buckets.fix])
if (buckets.perf.length) sections.push(['### ⚡ Performance', buckets.perf])
if (buckets.refactor.length) sections.push(['### ♻️ Refactors', buckets.refactor])
if (buckets.docs.length) sections.push(['### 📝 Documentation', buckets.docs])
if (buckets.chore.length) sections.push(['### 🧹 Chores', buckets.chore])
if (buckets.style.length) sections.push(['### 🎨 Styles', buckets.style])
if (buckets.other.length) sections.push(['### 🔮 Other', buckets.other])

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
  entry += '- No changes recorded.'
} else {
  for (const [title, lines] of sections) {
    entry += `${title}\n\n${lines.join('\n')}\n\n`
  }
}
entry = entry.trimEnd()

// New release notes format
const comparisonUrl = prevTag
  ? `https://github.com/${repoOwner}/${repoName}/compare/${prevTag}...${currentTag}`
  : `https://github.com/${repoOwner}/${repoName}/commits/${currentTag}`

const notes = `> v${version} is here! 🎉

## What's Changed

${sections.map(([title, lines]) => `${title.replace('### ', '')}\n\n${lines.join('\n')}\n`).join('\n')}

**Full Changelog**: ${comparisonUrl}
`

const insertAfterHeader = content => {
  if (!content.startsWith('# Changelog'))
    return `${header}\n\n${entry.trim()}\n\n${content.trim()}\n`

  const lines = content.split('\n')
  const headerEndIdx = (() => {
    for (let i = 1; i < lines.length; i += 1) {
      if (lines[i].startsWith('## ')) return i
    }
    return lines.length
  })()

  const before = lines.slice(0, headerEndIdx).join('\n').trimEnd()
  const after = lines.slice(headerEndIdx).join('\n')
  // Trim leading blank lines from after
  const afterTrimmed = after.replace(/^\n+/, '')
  // Ensure single blank line between header and entry
  return `${before}\n${entry.trim()}\n\n${afterTrimmed}`.trimEnd() + '\n'
}

if (!alreadyHasVersion) {
  const next = insertAfterHeader(base)
  writeFileSync(changelogPath, next)

  // Run Prettier to format the CHANGELOG.md
  try {
    const prettierPath = resolve(repoRoot, 'node_modules', '.bin', 'prettier')
    execSync(`"${prettierPath}" --write "${changelogPath}"`, { cwd: repoRoot, stdio: 'pipe' })
  } catch {
    // Prettier not found or failed, skip formatting
  }
}

if (notesPath) {
  const resolvedNotesPath = resolve(repoRoot, notesPath)
  writeFileSync(resolvedNotesPath, notes)
}

process.stdout.write(
  `Updated ${relative(repoRoot, changelogPath)} (prevTag=${prevTag || '(none)'})\n`
)
