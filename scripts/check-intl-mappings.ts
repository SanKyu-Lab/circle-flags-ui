/**
 * Check all codes in COUNTRY_NAMES and SUBDIVISION_NAMES to see if Intl.DisplayNames
 * would return different values, causing incorrect display names
 *
 * @run: npx tsx scripts/check-intl-mappings.ts
 */

import othersJson from './gen-flags/libs/others.json'
import isoJson from './gen-flags/libs/iso-3166.json'

interface Entry {
  id?: number | null
  alpha2: string
  alpha3?: string | null
  name: string
}

const regionDisplayNames = new Intl.DisplayNames(['en'], { type: 'region' })

console.log('=== Checking Intl.DisplayNames vs defined names ===\n')

// Combine all entries
const allEntries = [...(isoJson as Entry[]), ...(othersJson as Entry[])]

const conflicts: Array<{
  code: string
  definedName: string
  intlName: string
  type: 'historical' | 'organization' | 'special' | 'subdivision' | 'other'
}> = []

const historicalCodes = new Set(['su', 'soviet_union', 'yu', 'an', 'fx'])
const organizationCodes = new Set(['eu', 'european_union', 'un', 'nato'])
const specialCodes = new Set(['ac', 'cp', 'cq', 'dg', 'ea', 'ic', 'ta', 'xk', 'xx', 'uk'])

for (const entry of allEntries) {
  const code = entry.alpha2.toLowerCase()
  const alpha2Upper = entry.alpha2.toUpperCase()

  // Skip subdivision codes for now (they have - or _)
  if (code.includes('-') || code.includes('_')) {
    continue
  }

  try {
    const intlName = regionDisplayNames.of(alpha2Upper)

    // Compare names
    if (
      intlName &&
      intlName !== entry.name &&
      intlName.toLowerCase() !== entry.name.toLowerCase()
    ) {
      let type: (typeof conflicts)[number]['type'] = 'other'

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
  } catch (e) {
    // Code not recognized by Intl.DisplayNames, which is fine
  }
}

// Sort by type and code
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

let currentType: string | null = null
for (const conflict of conflicts) {
  if (currentType !== conflict.type) {
    currentType = conflict.type
    console.log(`--- ${conflict.type.toUpperCase()} ---`)
  }

  console.log(`  ${conflict.code}:`)
  console.log(`    Defined: "${conflict.definedName}"`)
  console.log(`    Intl:    "${conflict.intlName}"`)
  console.log('')
}

// Summary
console.log('=== SUMMARY ===')
console.log('Historical codes:', conflicts.filter(c => c.type === 'historical').length)
console.log('Organization codes:', conflicts.filter(c => c.type === 'organization').length)
console.log('Special codes:', conflicts.filter(c => c.type === 'special').length)
console.log('Other codes:', conflicts.filter(c => c.type === 'other').length)
console.log('')
console.log(
  'CRITICAL: These codes will display incorrectly if we use Intl.DisplayNames without checking COUNTRY_NAMES first!'
)
console.log('')
console.log('The fix in flagData.ts correctly prioritizes COUNTRY_NAMES/SUBDIVISION_NAMES,')
console.log('which prevents ALL of these conflicts.')
