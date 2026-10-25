// Result rows shared by every check script. The runner reads them from REAL_WORLD_RESULTS.
import { appendFileSync } from 'node:fs'

export const firstLine = error =>
  String(error?.message ?? error)
    .split('\n')[0]
    .slice(0, 240)

export const record = ({ id, title, expected, actual, pass }) => {
  const row = { id, title, expected, actual: String(actual), pass: Boolean(pass) }
  appendFileSync(process.env.REAL_WORLD_RESULTS, `${JSON.stringify(row)}\n`)
  console.log(`${row.pass ? 'PASS' : 'FAIL'} ${id} ${title} :: ${row.actual}`)
}

// Runs one check and records its outcome. A thrown error is a failed row, not a crash,
// so one broken consumer does not hide the results of the others.
export const check = async (meta, run) => {
  try {
    const { actual, pass } = await run()
    record({ ...meta, actual, pass })
  } catch (error) {
    record({ ...meta, actual: firstLine(error), pass: false })
  }
}

// Every flag body references its own mask as url(#cf-<code>-a), so the number of distinct
// mask ids is the number of flags in a piece of code.
export const countFlags = code =>
  new Set([...code.matchAll(/url\(#cf-([a-z0-9_-]+?)-a\)/g)].map(match => match[1])).size
