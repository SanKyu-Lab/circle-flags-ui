#!/usr/bin/env node
// Real-world consumer tests. Installs the packed @sankyu/* packages into the fixture projects
// under fixtures/ and into the example apps, then builds, renders and inspects them.
//
//   node run.mjs --pack                     pack packages/* (build them first) and test
//   node run.mjs --tarballs <dir>           test tarballs packed elsewhere
//   node run.mjs --only bundlers,example-   run the units whose id starts with one of these
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { apps } from './apps.mjs'
import { checkApp } from './lib/app.mjs'
import { installProject, prepareProject, readTarballs, readVariants, run } from './lib/project.mjs'
import { record } from './lib/report.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const PACKAGES = ['core', 'react', 'vue', 'solid', 'svelte']

const { values } = parseArgs({
  options: {
    repo: { type: 'string', default: resolve(here, '../..') },
    work: { type: 'string', default: join(tmpdir(), 'circle-flags-real-world') },
    tarballs: { type: 'string' },
    pack: { type: 'boolean', default: false },
    only: { type: 'string' },
  },
})

const repo = resolve(values.repo)
const work = resolve(values.work)
const logs = join(work, 'logs')
const results = join(work, 'results.jsonl')
rmSync(join(work, 'projects'), { recursive: true, force: true })
rmSync(logs, { recursive: true, force: true })
rmSync(results, { force: true })
mkdirSync(logs, { recursive: true })
process.env.REAL_WORLD_RESULTS = results

const packTarballs = () => {
  const dir = join(work, 'tarballs')
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  for (const name of PACKAGES) {
    const packed = run('pnpm', ['pack', '--pack-destination', dir], {
      cwd: join(repo, 'packages', name),
      log: join(logs, 'pack.log'),
    })
    if (packed.status !== 0) throw new Error(`pnpm pack failed for ${name}, see ${logs}/pack.log`)
  }
  return dir
}

if (!values.pack && !values.tarballs) throw new Error('Pass --pack or --tarballs <dir>')
const tarballs = readTarballs(values.pack ? packTarballs() : resolve(values.tarballs))

const fixtureUnits = readdirSync(join(here, 'fixtures')).flatMap(name =>
  readVariants(join(here, 'fixtures', name)).map(({ suffix, variant }) => ({
    id: `${name}${suffix}`,
    source: join(here, 'fixtures', name),
    variant,
  }))
)
const appUnits = apps.map(app => ({ id: app.id, source: join(repo, app.dir), app }))
const prefixes = values.only?.split(',').filter(Boolean)
const selected = [...fixtureUnits, ...appUnits].filter(
  unit => !prefixes || prefixes.some(prefix => unit.id.startsWith(prefix))
)

const countRows = () =>
  existsSync(results) ? readFileSync(results, 'utf8').split('\n').filter(Boolean).length : 0

let browser
let port = 4300
for (const unit of selected) {
  const dir = join(work, 'projects', unit.id)
  const log = join(logs, `${unit.id}.log`)
  console.log(`\n=== ${unit.id}`)

  if (!existsSync(unit.source)) {
    record({
      id: unit.id,
      title: 'project exists',
      expected: unit.source,
      actual: 'missing',
      pass: false,
    })
    continue
  }
  prepareProject({
    source: unit.source,
    target: dir,
    tarballs,
    libDir: join(here, 'lib'),
    variant: unit.variant,
  })
  const install = installProject({ dir, log })
  if (install.status !== 0) {
    record({
      id: `${unit.id}/install`,
      title: 'pnpm install',
      expected: 'exit 0',
      actual: `exit ${install.status}`,
      pass: false,
    })
    continue
  }

  if (unit.app) {
    if (!browser) {
      const { chromium } = await import('playwright')
      browser = await chromium.launch()
    }
    port += 1
    await checkApp({ app: unit.app, dir, port, log, browser })
    continue
  }

  const before = countRows()
  const checked = run('node', ['check.mjs'], { cwd: dir, log, env: unit.variant?.env })
  if (checked.status !== 0 && countRows() === before) {
    const lastLine = checked.output.trim().split('\n').at(-1)
    record({
      id: `${unit.id}/check`,
      title: 'check.mjs',
      expected: 'exit 0',
      actual: lastLine,
      pass: false,
    })
  }
}
await browser?.close()

const rows = readFileSync(results, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map(line => JSON.parse(line))
const failed = rows.filter(row => !row.pass)
const escape = text => String(text).replaceAll('|', '\\|')
const summary = [
  `## Real-world consumer tests: ${rows.length - failed.length}/${rows.length} passed`,
  '',
  '| Check | Expected | Actual | Result |',
  '| --- | --- | --- | --- |',
  ...rows.map(
    row =>
      `| ${escape(row.id)}: ${escape(row.title)} | ${escape(row.expected)} | ${escape(row.actual)} | ${row.pass ? 'pass' : 'FAIL'} |`
  ),
  '',
].join('\n')
writeFileSync(join(work, 'summary.md'), summary)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary)
console.log(`\n${rows.length - failed.length}/${rows.length} passed. Logs: ${logs}`)
process.exitCode = failed.length > 0 ? 1 : 0
