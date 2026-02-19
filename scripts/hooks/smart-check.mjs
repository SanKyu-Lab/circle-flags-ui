#!/usr/bin/env node
/**
 * Smart Git Hook Runner
 *
 * Analyses which files are about to be committed / pushed and runs only the
 * checks that are actually relevant, rather than the full suite every time.
 *
 * Usage:
 *   node scripts/hooks/smart-check.mjs --hook commit-msg --commit-msg-file <path>
 *   node scripts/hooks/smart-check.mjs --hook pre-push
 */

import { parseArgs } from 'node:util'
import { spawnSync } from 'node:child_process'

// ─── ANSI helpers ─────────────────────────────────────────────────────────────

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

const style = (color, text) => (process.stdout.isTTY ? `${c[color]}${text}${c.reset}` : text)

// ─── Zone definitions ─────────────────────────────────────────────────────────
/**
 * A zone maps glob patterns to required checks.
 * Checks from every matched zone are merged (Set union) before running.
 *
 * Available checks: 'format' | 'lint' | 'typecheck'
 *
 * Priority: zones are tested in order; a file may match multiple zones.
 */
const ZONES = [
  {
    name: 'docs',
    // Pure text / asset changes – only need formatting (cheap)
    patterns: ['**/*.md', '**/*.txt', '.github/assets/**', 'website/**'],
    checks: new Set(['format']),
  },
  {
    name: 'ci',
    // GitHub Actions YAML – format only (no TS/JS linting needed)
    patterns: ['.github/workflows/**', '.github/actions/**'],
    checks: new Set(['format']),
  },
  {
    name: 'config',
    // Root-level config & lock files
    patterns: [
      '*.json',
      '*.cjs',
      '*.yml',
      '*.yaml',
      '*.toml',
      'commitlint.config.*',
      'pnpm-workspace.yaml',
      'pnpm-lock.yaml',
    ],
    checks: new Set(['format']),
  },
  {
    name: 'scripts',
    // Repo maintenance / build scripts (JS/MJS only, no type compilation)
    patterns: ['scripts/**'],
    checks: new Set(['format', 'lint']),
  },
  {
    name: 'source',
    // Package sources – run the full suite
    patterns: ['packages/**', 'examples/**'],
    checks: new Set(['format', 'lint', 'typecheck']),
  },
]

// Files that match no zone always trigger the full suite (safe default)
const DEFAULT_CHECKS = new Set(['format', 'lint', 'typecheck'])

// ─── Glob helpers ─────────────────────────────────────────────────────────────

function globToRegex(pattern) {
  // Escape all special regex characters first, then restore the glob ones
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&')
  const rx = escaped
    .replace(/\\\*/g, '*') // undo accidental escape of *
    .replace(/\*\*/g, '\x00DS\x00') // preserve ** temporarily
    .replace(/\*/g, '[^/]+') // * → match within one segment
    .replace(/\x00DS\x00\//g, '(?:.+/)?') // **/ → optional path prefix
    .replace(/\x00DS\x00/g, '.*') // remaining ** → match anything
  return new RegExp(`^${rx}$`)
}

function matchesAny(file, patterns) {
  return patterns.some(p => globToRegex(p).test(file))
}

// ─── Git helpers ──────────────────────────────────────────────────────────────

function git(...args) {
  return spawnSync('git', args, { encoding: 'utf8' }).stdout.trim()
}

/** Files staged for the next commit */
function getStagedFiles() {
  return git('diff', '--cached', '--name-only', '--diff-filter=ACMR').split('\n').filter(Boolean)
}

/**
 * Files changed in commits that are about to be pushed.
 * Reads the push-info lines that Git passes to the pre-push hook via stdin.
 */
function getPushedFiles(stdinText) {
  const files = new Set()
  const NULL_SHA = '0'.repeat(40)

  for (const line of stdinText.trim().split('\n').filter(Boolean)) {
    const [, localSha, , remoteSha] = line.trim().split(' ')
    if (!localSha || localSha === NULL_SHA) continue // branch deleted, skip

    const base =
      remoteSha === NULL_SHA
        ? // New branch: compare against merge-base with origin/main
          git('merge-base', 'HEAD', 'origin/main') || git('rev-list', '--max-parents=0', 'HEAD') // fallback: first commit
        : remoteSha

    if (!base) continue

    const changed = git('diff', '--name-only', `${base}..${localSha}`)
    for (const f of changed.split('\n').filter(Boolean)) files.add(f)
  }

  return [...files]
}

// ─── Check resolver ───────────────────────────────────────────────────────────

function resolveChecks(files) {
  const needed = new Set()
  for (const file of files) {
    const matched = ZONES.filter(z => matchesAny(file, z.patterns))
    if (matched.length === 0) {
      for (const c of DEFAULT_CHECKS) needed.add(c)
    } else {
      for (const zone of matched) {
        for (const check of zone.checks) needed.add(check)
      }
    }
  }
  return needed
}

// ─── Runner ───────────────────────────────────────────────────────────────────

function run(label, command, args) {
  process.stdout.write(style('cyan', `  › ${label}…\n`))
  const result = spawnSync(command, args, { stdio: 'inherit' })
  if (result.status !== 0) {
    console.error(style('red', `\n  ✗  ${label} failed\n`))
    process.exit(result.status ?? 1)
  }
  process.stdout.write(style('green', `  ✓  ${label}\n`))
}

function printSummary(files, checks) {
  const matchedZones = ZONES.filter(z => files.some(f => matchesAny(f, z.patterns))).map(
    z => z.name
  )
  const unknownFiles = files.filter(f => !ZONES.some(z => matchesAny(f, z.patterns)))

  console.log(style('dim', `  files  : ${files.length} changed`))
  if (matchedZones.length) console.log(style('dim', `  zones  : ${matchedZones.join(', ')}`))
  if (unknownFiles.length)
    console.log(style('yellow', `  unknown: ${unknownFiles.join(', ')} → full suite`))
  console.log(style('dim', `  checks : ${checks.size ? [...checks].join(' + ') : '(none)'}`))
  console.log()
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    hook: { type: 'string' },
    'commit-msg-file': { type: 'string' },
  },
  allowPositionals: true,
  strict: false,
})

const hook = values['hook']
console.log(style('bold', `\n🔍  smart-check  [${hook}]\n`))

// ── commitlint (commit-msg only, always runs) ────────────────────────────────
if (hook === 'commit-msg') {
  const msgFile = values['commit-msg-file'] ?? positionals[0]
  if (!msgFile) {
    console.error('smart-check: --commit-msg-file <path> is required for commit-msg hook')
    process.exit(1)
  }
  run('commitlint', 'pnpm', ['exec', 'commitlint', '--edit', msgFile])
}

// ── Detect which files are in scope ──────────────────────────────────────────
let files

if (hook === 'commit-msg') {
  files = getStagedFiles()
} else if (hook === 'pre-push') {
  // Read stdin synchronously – pre-push hook provides push-info on stdin
  const { readFileSync } = await import('node:fs')
  let stdinText = ''
  try {
    stdinText = readFileSync('/dev/stdin', 'utf8')
  } catch {
    // /dev/stdin not available (e.g. running manually) – fall back to empty
  }
  files = getPushedFiles(stdinText)
} else {
  console.error(`smart-check: unknown hook "${hook}". Use --hook commit-msg|pre-push`)
  process.exit(1)
}

if (files.length === 0) {
  console.log(style('yellow', '  ⚠  No relevant files detected – skipping checks.\n'))
  process.exit(0)
}

// ── Figure out what to run ────────────────────────────────────────────────────
const checks = resolveChecks(files)
printSummary(files, checks)

if (checks.size === 0) {
  console.log(style('green', '✅  Nothing to check.\n'))
  process.exit(0)
}

// ── Run checks ────────────────────────────────────────────────────────────────
// In commit-msg, format/lint run in "fix" mode so the staged files get cleaned
// up automatically; in pre-push we only check (read-only).
const isFix = hook === 'commit-msg'

if (checks.has('format')) {
  run(`format${isFix ? ':fix' : ':check'}`, 'pnpm', ['run', isFix ? 'format' : 'format:check'])
}

if (checks.has('lint')) {
  run(`lint${isFix ? ':fix' : ''}`, 'pnpm', ['run', isFix ? 'lint:fix' : 'lint'])
}

if (checks.has('typecheck')) {
  run('typecheck', 'pnpm', ['run', 'typecheck'])
}

console.log(style('bold', style('green', '✅  All checks passed!\n')))
