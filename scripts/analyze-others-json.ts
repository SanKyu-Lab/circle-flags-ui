/**
 * Analyze others.json to identify entries that can be auto-generated from country-region-data
 *
 * @run: npx tsx scripts/analyze-others-json.ts
 */

import countriesData from 'country-region-data/data.json'
import othersJson from './gen-flags/libs/others.json'

interface OtherEntry {
  id: number | null
  alpha2: string
  alpha3: string | null
  name: string
}

interface CountryData {
  countryName: string
  countryShortCode: string
  regions: Array<{ name: string; shortCode: string }>
}

const others = othersJson as OtherEntry[]

// Build subdivision map from country-region-data
const countryRegionMap = new Map<string, { country: string; region: string }>()
for (const country of countriesData as CountryData[]) {
  for (const region of country.regions) {
    if (region.shortCode) {
      const code = `${country.countryShortCode.toLowerCase()}-${region.shortCode.toLowerCase()}`
      countryRegionMap.set(code, {
        country: country.countryName,
        region: region.name,
      })
    }
  }
}

// Build country map
const countryMap = new Map<string, string>()
for (const country of countriesData as CountryData[]) {
  countryMap.set(country.countryShortCode.toLowerCase(), country.countryName)
}

// Categories for analysis
interface Category {
  name: string
  description: string
  entries: Array<{
    code: string
    othersName: string
    autoName?: string
    canAutoGenerate: boolean
    note?: string
  }>
}

const categories: Category[] = []

// 1. Historical/Obsolete codes (need manual maintenance)
const historicalCodes = new Map([
  ['an', 'Netherlands Antilles (dissolved 2010)'],
  ['fx', 'Metropolitan France (historical)'],
  ['soviet_union', 'Soviet Union (alias)'],
  ['su', 'Soviet Union (ISO 3166-3 SUHH)'],
  ['yu', 'Yugoslavia (dissolved 2003)'],
])

// 2. Organization codes
const organizationCodes = new Map([
  ['eu', 'European Union'],
  ['european_union', 'European Union (alias)'],
  ['un', 'United Nations'],
  ['nato', 'NATO'],
])

// 3. Ethnic/Cultural codes
const ethnicCodes = new Set([
  'guarani',
  'hausa',
  'hmong',
  'kanuri',
  'kikuyu',
  'kongo',
  'malayali',
  'maori',
  'otomi',
  'quechua',
  'sami',
  'ewe',
  'wiphala',
  'yorubaland',
])

// 4. Special territories/entities (no standard ISO code)
const specialTerritories = new Map([
  ['ac', 'Ascension Island (UK overseas territory)'],
  ['cp', 'Clipperton Island (French territory)'],
  ['cq', 'Sark (British Crown dependency)'],
  ['dg', 'Diego Garcia (UK/US military base)'],
  ['ea', 'Ceuta and Melilla (Spanish autonomous cities)'],
  ['ic', 'Canary Islands (Spanish autonomous community)'],
  ['ta', 'Tristan da Cunha (UK overseas territory)'],
  ['xk', 'Kosovo (partially recognized)'],
  ['xx', 'Placeholder flag'],
  ['uk', 'United Kingdom (non-standard, should be gb)'],
])

// 5. Disputed/Unrecognized territories
const disputedTerritories = new Map([
  ['artsakh', 'Artsakh/Nagorno-Karabakh (de facto state)'],
  ['northern_cyprus', 'Northern Cyprus (de facto state)'],
  ['somaliland', 'Somaliland (de facto state)'],
  ['south_ossetia', 'South Ossetia (de facto state)'],
  ['transnistria', 'Transnistria (de facto state)'],
])

// 6. Fictional/Micronations
const micronations = new Map([
  ['sealand', 'Principality of Sealand (micronation)'],
  ['east_african_federation', 'East African Federation (proposed)'],
  ['occitania', 'Occitania (cultural region)'],
  ['easter_island', 'Easter Island (Chile territory, has cl code)'],
])

// Categorize entries
const historicalEntries: Category['entries'] = []
const organizationEntries: Category['entries'] = []
const ethnicEntries: Category['entries'] = []
const specialEntries: Category['entries'] = []
const disputedEntries: Category['entries'] = []
const micronationEntries: Category['entries'] = []
const canAutoGenerateEntries: Category['entries'] = []
const partialAutoEntries: Category['entries'] = []
const unknownEntries: Category['entries'] = []

for (const entry of others) {
  const code = entry.alpha2.toLowerCase()

  if (historicalCodes.has(code)) {
    historicalEntries.push({
      code,
      othersName: entry.name,
      canAutoGenerate: false,
      note: historicalCodes.get(code),
    })
  } else if (organizationCodes.has(code)) {
    organizationEntries.push({
      code,
      othersName: entry.name,
      canAutoGenerate: false,
      note: organizationCodes.get(code),
    })
  } else if (ethnicCodes.has(code)) {
    ethnicEntries.push({
      code,
      othersName: entry.name,
      canAutoGenerate: false,
      note: 'Ethnic/cultural flag',
    })
  } else if (specialTerritories.has(code)) {
    specialEntries.push({
      code,
      othersName: entry.name,
      canAutoGenerate: false,
      note: specialTerritories.get(code),
    })
  } else if (disputedTerritories.has(code)) {
    disputedEntries.push({
      code,
      othersName: entry.name,
      canAutoGenerate: false,
      note: disputedTerritories.get(code),
    })
  } else if (micronations.has(code)) {
    micronationEntries.push({
      code,
      othersName: entry.name,
      canAutoGenerate: false,
      note: micronations.get(code),
    })
  } else if (countryRegionMap.has(code)) {
    // Can be auto-generated from country-region-data
    const autoData = countryRegionMap.get(code)!
    const autoName = `${autoData.region}, ${autoData.country}`
    const namesMatch =
      autoName === entry.name || autoName.toLowerCase() === entry.name.toLowerCase()

    canAutoGenerateEntries.push({
      code,
      othersName: entry.name,
      autoName,
      canAutoGenerate: namesMatch,
      note: namesMatch ? 'Exact match' : 'Name differs slightly',
    })
  } else if (code.includes('-') || code.includes('_')) {
    // Subdivision code but not in country-region-data
    const [countryCode] = code.split(/[-_]/)
    const countryName = countryMap.get(countryCode)

    if (countryName) {
      partialAutoEntries.push({
        code,
        othersName: entry.name,
        autoName: countryName,
        canAutoGenerate: false,
        note: `Country "${countryName}" exists but subdivision not in country-region-data`,
      })
    } else {
      unknownEntries.push({
        code,
        othersName: entry.name,
        canAutoGenerate: false,
        note: 'Unknown subdivision pattern',
      })
    }
  } else {
    unknownEntries.push({
      code,
      othersName: entry.name,
      canAutoGenerate: false,
      note: 'Unknown code',
    })
  }
}

// Output report
console.log('='.repeat(80))
console.log('OTHERS.JSON ANALYSIS REPORT')
console.log('='.repeat(80))
console.log('')
console.log(`Total entries in others.json: ${others.length}`)
console.log(`Total subdivisions in country-region-data: ${countryRegionMap.size}`)
console.log('')

// Summary
console.log('--- SUMMARY ---')
console.log(
  `1. Can auto-generate (exact match):     ${canAutoGenerateEntries.filter(e => e.canAutoGenerate).length}`
)
console.log(
  `2. Can auto-generate (name differs):    ${canAutoGenerateEntries.filter(e => !e.canAutoGenerate).length}`
)
console.log(`3. Historical codes (need manual):      ${historicalEntries.length}`)
console.log(`4. Organization codes (need manual):    ${organizationEntries.length}`)
console.log(`5. Ethnic/cultural codes (need manual): ${ethnicEntries.length}`)
console.log(`6. Special territories (need manual):   ${specialEntries.length}`)
console.log(`7. Disputed territories (need manual):  ${disputedEntries.length}`)
console.log(`8. Micronations/proposed (need manual): ${micronationEntries.length}`)
console.log(`9. Partial auto (country exists):       ${partialAutoEntries.length}`)
console.log(`10. Unknown codes:                      ${unknownEntries.length}`)
console.log('')

// Detailed sections
const sections = [
  {
    name: 'CAN AUTO-GENERATE (exact match)',
    entries: canAutoGenerateEntries.filter(e => e.canAutoGenerate),
  },
  {
    name: 'CAN AUTO-GENERATE (name differs - review needed)',
    entries: canAutoGenerateEntries.filter(e => !e.canAutoGenerate),
  },
  { name: 'HISTORICAL CODES (need manual)', entries: historicalEntries },
  { name: 'ORGANIZATION CODES (need manual)', entries: organizationEntries },
  { name: 'ETHNIC/CULTURAL CODES (need manual)', entries: ethnicEntries },
  { name: 'SPECIAL TERRITORIES (need manual)', entries: specialEntries },
  { name: 'DISPUTED TERRITORIES (need manual)', entries: disputedEntries },
  { name: 'MICRONATIONS/PROPOSED (need manual)', entries: micronationEntries },
  {
    name: 'PARTIAL AUTO-GENERATE (country exists, subdivision manual)',
    entries: partialAutoEntries,
  },
  { name: 'UNKNOWN CODES', entries: unknownEntries },
]

for (const section of sections) {
  if (section.entries.length === 0) continue

  console.log('='.repeat(80))
  console.log(`${section.name} (${section.entries.length} entries)`)
  console.log('-'.repeat(80))

  for (const entry of section.entries) {
    console.log(`  ${entry.code}:`)
    console.log(`    others.json: "${entry.othersName}"`)
    if (entry.autoName) {
      console.log(`    auto-name:   "${entry.autoName}"`)
    }
    if (entry.note) {
      console.log(`    note:        ${entry.note}`)
    }
    console.log('')
  }
}

// Recommendations
console.log('='.repeat(80))
console.log('RECOMMENDATIONS')
console.log('='.repeat(80))
console.log('')
console.log('1. SAFE TO REMOVE from others.json (can auto-generate):')
console.log(
  '   - ' +
    canAutoGenerateEntries
      .filter(e => e.canAutoGenerate)
      .map(e => e.code)
      .join(', ')
)
console.log('')
console.log('2. REVIEW BEFORE REMOVING (name differs slightly):')
for (const entry of canAutoGenerateEntries.filter(e => !e.canAutoGenerate)) {
  console.log(`   - ${entry.code}: "${entry.othersName}" vs "${entry.autoName}"`)
}
console.log('')
console.log('3. MUST KEEP in others.json (no auto-generation possible):')
const mustKeep = [
  ...historicalEntries,
  ...organizationEntries,
  ...ethnicEntries,
  ...specialEntries,
  ...disputedEntries,
  ...micronationEntries,
  ...partialAutoEntries,
  ...unknownEntries,
]
console.log('   - ' + mustKeep.map(e => e.code).join(', '))
