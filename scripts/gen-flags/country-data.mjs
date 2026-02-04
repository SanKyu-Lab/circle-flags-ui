import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const countriesData = require('country-region-data/data.json')

export const buildNameMappings = () => {
  const countryNames = {}
  const subdivisionNames = {}

  for (const country of countriesData) {
    const countryCode = String(country.countryShortCode).toLowerCase()
    countryNames[countryCode] = country.countryName

    for (const region of country.regions) {
      if (!region.shortCode) continue

      const regionCode = String(region.shortCode).toLowerCase()
      const subdivisionCodeDash = `${countryCode}-${regionCode}`
      const subdivisionCodeUnderscore = `${countryCode}_${regionCode}`

      const mapping = {
        country: country.countryName,
        region: region.name,
      }

      subdivisionNames[subdivisionCodeDash] = mapping
      subdivisionNames[subdivisionCodeUnderscore] = mapping
    }
  }

  return { countryNames, subdivisionNames }
}

export const getNameFromMappings = (code, mappings) => {
  if (mappings.subdivisionNames[code]) {
    const { country, region } = mappings.subdivisionNames[code]
    return `${country} - ${region}`
  }

  if (mappings.countryNames[code]) {
    return mappings.countryNames[code]
  }

  return undefined
}
