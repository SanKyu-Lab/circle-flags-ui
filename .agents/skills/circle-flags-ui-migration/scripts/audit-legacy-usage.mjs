#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

const DEFAULT_EXCLUDES = [
  'node_modules',
  '.git',
  'dist',
  'coverage',
  'website/dist',
  '.pnpm-store',
]

const CATEGORY_DEFS = [
  {
    id: 'react-circle-flags',
    title: '`react-circle-flags` dependency / import',
    patterns: ['"react-circle-flags"', "'react-circle-flags'"],
  },
  {
    id: 'circleflag-jsx',
    title: '`<CircleFlag />` usage',
    patterns: ['<CircleFlag'],
  },
  {
    id: 'hatscripts-circle-flags',
    title: 'HatScripts circle-flags asset reference',
    patterns: [
      'hatscripts\\.github\\.io/circle-flags',
      'HatScripts/circle-flags',
      'circle-flags/flags/',
    ],
  },
]

const parseArgs = argv => {
  const args = {
    root: '.',
    format: 'md',
    out: null,
    exclude: [],
  }

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === '--root') {
      if (i + 1 >= argv.length || argv[i + 1].startsWith('--')) {
        console.error('[ERROR] --root requires a value')
        process.exit(2)
      }
      args.root = argv[i + 1]
      i += 1
      continue
    }
    if (token === '--format') {
      if (i + 1 >= argv.length || argv[i + 1].startsWith('--')) {
        console.error('[ERROR] --format requires a value')
        process.exit(2)
      }
      args.format = argv[i + 1]
      i += 1
      continue
    }
    if (token === '--out') {
      if (i + 1 >= argv.length || argv[i + 1].startsWith('--')) {
        console.error('[ERROR] --out requires a value')
        process.exit(2)
      }
      args.out = argv[i + 1]
      i += 1
      continue
    }
    if (token === '--exclude') {
      if (i + 1 >= argv.length || argv[i + 1].startsWith('--')) {
        console.error('[ERROR] --exclude requires a value')
        process.exit(2)
      }
      args.exclude.push(argv[i + 1])
      i += 1
      continue
    }
    if (token === '--help' || token === '-h') {
      printHelpAndExit(0)
    }
  }

  if (args.format !== 'md' && args.format !== 'json') {
    console.error(`[ERROR] --format only accepts md|json, got: ${args.format}`)
    process.exit(2)
  }

  return args
}

const printHelpAndExit = code => {
  process.stdout.write(`audit-legacy-usage.mjs

Usage:
  node audit-legacy-usage.mjs --root <dir> --format md|json --out <path> [--exclude <dir>...]

Options:
  --root      Root directory to scan (default: .)
  --format    Output format: md or json (default: md)
  --out       Write output to a file instead of stdout
  --exclude   Additional directory to exclude (repeatable, e.g. --exclude build --exclude .turbo)
`)
  process.exit(code)
}

const canUseRipgrep = () => {
  const res = spawnSync('rg', ['--version'], { encoding: 'utf8' })
  return res.status === 0
}

// Use path.relative() to avoid false prefix matches (e.g. /foo/bar vs /foo/barbaz).
const toPosixRel = (rootAbs, fileAbs) =>
  relative(rootAbs, fileAbs).split('\\').join('/')

const uniqueSorted = items => Array.from(new Set(items)).sort((a, b) => a.localeCompare(b))

const buildRipgrepExcludeArgs = excludes =>
  excludes.flatMap(dir => ['--glob', `!${dir}/**`])

// Merge all patterns for a category into a single rg invocation using -e flags.
const runRgFilesWithMatches = ({ rootAbs, excludes, patterns }) => {
  const patternArgs = patterns.flatMap(p => ['-e', p])
  const args = [
    '--files-with-matches',
    '--no-messages',
    ...patternArgs,
    ...buildRipgrepExcludeArgs(excludes),
    rootAbs,
  ]

  const res = spawnSync('rg', args, { encoding: 'utf8' })

  if (res.status === 2) {
    const err = String(res.stderr ?? '').trim()
    throw new Error(err || `rg exited with code 2 for patterns: ${patterns.join(', ')}`)
  }

  const stdout = String(res.stdout ?? '').trim()
  if (!stdout) return []
  return stdout.split('\n').map(line => line.trim()).filter(Boolean)
}

const isTextFile = filePath => {
  const lower = filePath.toLowerCase()
  const exts = [
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.mjs',
    '.cjs',
    '.vue',
    '.json',
    '.md',
    '.mdx',
    '.yml',
    '.yaml',
    '.html',
    '.css',
    '.scss',
    '.txt',
  ]
  return exts.some(ext => lower.endsWith(ext))
}

const walkFiles = (rootAbs, excludes) => {
  const excludeSet = new Set(excludes.map(x => x.replace(/\/+$/, '')))
  const files = []

  const visitDir = dirAbs => {
    let dirEntries
    try {
      dirEntries = readdirSync(dirAbs, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of dirEntries) {
      const entryAbs = resolve(dirAbs, entry.name)
      const rel = toPosixRel(rootAbs, entryAbs)

      let shouldExclude = false
      for (const ex of excludeSet) {
        if (rel === ex || rel.startsWith(`${ex}/`)) {
          shouldExclude = true
          break
        }
      }
      if (shouldExclude) continue

      if (entry.isDirectory()) {
        visitDir(entryAbs)
        continue
      }

      if (entry.isFile()) files.push(entryAbs)
    }
  }

  visitDir(rootAbs)
  return files
}

const auditByNodeWalk = ({ rootAbs, excludes }) => {
  const files = walkFiles(rootAbs, excludes)
  const categoryHits = Object.fromEntries(CATEGORY_DEFS.map(c => [c.id, new Set()]))

  for (const fileAbs of files) {
    if (!isTextFile(fileAbs)) continue

    let s
    try {
      const st = statSync(fileAbs)
      if (st.size > 2 * 1024 * 1024) continue
      s = readFileSync(fileAbs, 'utf8')
    } catch {
      continue
    }

    for (const category of CATEGORY_DEFS) {
      // Strip regex escapes for plain string matching in the Node.js fallback path.
      const literals = category.patterns.map(p => p.replace(/\\/g, ''))
      for (const p of literals) {
        if (s.includes(p)) {
          categoryHits[category.id].add(fileAbs)
          break
        }
      }
    }
  }

  return Object.fromEntries(
    CATEGORY_DEFS.map(c => [c.id, uniqueSorted(Array.from(categoryHits[c.id] ?? []))])
  )
}

const auditByRipgrep = ({ rootAbs, excludes }) => {
  const categoryHits = {}
  for (const category of CATEGORY_DEFS) {
    const matched = runRgFilesWithMatches({ rootAbs, excludes, patterns: category.patterns })
    categoryHits[category.id] = uniqueSorted(matched)
  }
  return categoryHits
}

const formatNextSteps = hitCategoryIds => {
  const steps = []

  if (hitCategoryIds.has('react-circle-flags')) {
    steps.push(
      [
        '### Migrate the dependency',
        '- Remove the old package: `react-circle-flags`',
        '- Install the new package for your framework:',
        '  - React: `@sankyu/react-circle-flags`',
        '  - Vue 3: `@sankyu/vue-circle-flags`',
        '  - Solid.js: `@sankyu/solid-circle-flags`',
      ].join('\n')
    )
  }

  if (hitCategoryIds.has('circleflag-jsx')) {
    steps.push(
      [
        '### Replace `<CircleFlag />`',
        '- Prefer **named imports** for the smallest possible bundle',
        '- Runtime code with a bounded value set: **named imports + lookup map**',
        '- Runtime code that must support arbitrary values offline: `DynamicFlag`  ',
        '  _(trade-off: bundles all 400+ flags, significantly increasing bundle size)_',
      ].join('\n')
    )
  }

  if (hitCategoryIds.has('hatscripts-circle-flags')) {
    steps.push(
      [
        '### Replace asset references',
        '- Swap `<img src="...">` CDN links or local flag assets for component rendering',
        '  (named imports / lookup map / `DynamicFlag`)',
        '- Goal: offline-first with tree-shaking, not runtime SVG fetching',
      ].join('\n')
    )
  }

  if (!steps.length) {
    steps.push('- No hits found — nothing to migrate (or verify that the correct directory was scanned).')
  }

  return steps.join('\n\n')
}

const toJsonOutput = ({ root, excludes, hits }) => {
  const categories = CATEGORY_DEFS.map(c => ({
    id: c.id,
    title: c.title,
    patterns: c.patterns,
    files: hits[c.id] ?? [],
    count: (hits[c.id] ?? []).length,
  }))

  return {
    root,
    excludes,
    categories,
    totals: categories.reduce((acc, c) => acc + c.count, 0),
  }
}

const toMdOutput = ({ root, rootAbs, excludes, hits }) => {
  const lines = []
  lines.push('# circle-flags-ui legacy usage audit')
  lines.push('')
  lines.push(`- root: \`${root}\``)
  lines.push(`- excludes: ${excludes.map(x => `\`${x}\``).join(', ')}`)
  lines.push('')
  lines.push('## Summary')
  lines.push('')

  const hitCategoryIds = new Set()

  for (const category of CATEGORY_DEFS) {
    const filesAbs = hits[category.id] ?? []
    const filesRel = filesAbs.map(p => toPosixRel(rootAbs, p))
    const count = filesRel.length
    if (count > 0) hitCategoryIds.add(category.id)

    lines.push(`### ${category.title}`)
    lines.push('')
    lines.push(`- count: **${count}**`)
    if (count > 0) {
      lines.push('')
      for (const file of filesRel) lines.push(`- \`${file}\``)
    }
    lines.push('')
  }

  lines.push('## Next Steps')
  lines.push('')
  lines.push(formatNextSteps(hitCategoryIds))
  lines.push('')

  return lines.join('\n')
}

const writeOutput = ({ outPath, text }) => {
  if (!outPath) {
    process.stdout.write(text)
    if (!text.endsWith('\n')) process.stdout.write('\n')
    return
  }
  writeFileSync(outPath, text, 'utf8')
}

const main = () => {
  const args = parseArgs(process.argv)
  const rootAbs = resolve(process.cwd(), args.root)
  const excludes = [...DEFAULT_EXCLUDES, ...args.exclude]

  const hits = canUseRipgrep()
    ? auditByRipgrep({ rootAbs, excludes })
    : auditByNodeWalk({ rootAbs, excludes })

  const output =
    args.format === 'json'
      ? JSON.stringify(toJsonOutput({ root: args.root, excludes, hits }), null, 2)
      : toMdOutput({ root: args.root, rootAbs, excludes, hits })

  writeOutput({ outPath: args.out, text: output })
}

try {
  main()
} catch (err) {
  console.error(`[ERROR] ${err instanceof Error ? err.message : String(err)}`)
  process.exit(1)
}
