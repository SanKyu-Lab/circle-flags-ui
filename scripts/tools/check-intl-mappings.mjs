// Checks whether Intl.DisplayNames disagrees with our curated names list.

import { readFileSync } from 'node:fs'

const readJson = url => JSON.parse(readFileSync(url, 'utf8'))

const othersJson = readJson(new URL('../gen-flags/libs/others.json', import.meta.url))
const isoJson = readJson(new URL('../gen-flags/libs/iso-3166.json', import.meta.url))

const regionDisplayNames = new Intl.DisplayNames(['en'], { type: 'region' })

console.log('=== Checking Intl.DisplayNames vs defined names ===\n')

const allEntries = [...isoJson, ...othersJson]

const conflicts = []

const historicalCodes = new Set(['su', 'soviet_union', 'yu', 'an', 'fx'])
const organizationCodes = new Set(['eu', 'european_union', 'un', 'nato'])
const specialCodes = new Set(['ac', 'cp', 'cq', 'dg', 'ea', 'ic', 'ta', 'xk', 'xx', 'uk'])

for (const entry of allEntries) {
  const code = String(entry.alpha2).toLowerCase()
  const alpha2Upper = String(entry.alpha2).toUpperCase()

  if (code.includes('-') || code.includes('_')) {
    continue
  }

  try {
    const intlName = regionDisplayNames.of(alpha2Upper)

    if (
      intlName &&
      intlName !== entry.name &&
      intlName.toLowerCase() !== entry.name.toLowerCase()
    ) {
      let type = 'other'

      if (historicalCodes.has(code)) {
        type = 'historical'
      } else if (organizationCodes.has(code)) {
        type = 'organization'
      } else if (specialCodes.has(code)) {
        type = 'special'
      }

      conflicts.push({
        code,
        definedName: entry.name,
        intlName,
        type,
      })
    }
  } catch {
    // Intentionally ignored: Intl.DisplayNames throws on unknown codes.
  }
}

conflicts.sort((a, b) => {
  if (a.type !== b.type) {
    const order = { historical: 0, organization: 1, special: 2, subdivision: 3, other: 4 }
    return order[a.type] - order[b.type]
  }
  return a.code.localeCompare(b.code)
})

console.log(
  `Found ${conflicts.length} conflicts where Intl.DisplayNames differs from defined names:\n`
)

let currentType = null
for (const conflict of conflicts) {
  if (currentType !== conflict.type) {
    currentType = conflict.type
    console.log(`--- ${String(conflict.type).toUpperCase()} ---`)
  }

  console.log(`  ${conflict.code}:`)
  console.log(`    Defined: "${conflict.definedName}"`)
  console.log(`    Intl:    "${conflict.intlName}"`)
  console.log('')
}

console.log('=== SUMMARY ===')
console.log('Historical codes:', conflicts.filter(c => c.type === 'historical').length)
console.log('Organization codes:', conflicts.filter(c => c.type === 'organization').length)
console.log('Special codes:', conflicts.filter(c => c.type === 'special').length)
console.log('Other codes:', conflicts.filter(c => c.type === 'other').length)
console.log('')
console.log(
  'NOTE: If you rely on Intl.DisplayNames only, these codes may display differently than our curated list.'
)
console.log('')
console.log(
  'If you still want curated display names, consider a small override map (historical/org/special codes) in the website.'
)
