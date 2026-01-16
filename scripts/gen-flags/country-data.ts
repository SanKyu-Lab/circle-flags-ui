import countriesData from 'country-region-data/data.json'

interface CountryDataJson {
  countryName: string
  countryShortCode: string
  regions: Array<{ name: string; shortCode: string }>
}

const allCountries = countriesData as unknown as CountryDataJson[]

export interface CountryNameMapping {
  countryNames: Record<string, string>
  subdivisionNames: Record<string, { country: string; region: string }>
}

export function buildNameMappings(): CountryNameMapping {
  const countryNames: Record<string, string> = {}
  const subdivisionNames: Record<string, { country: string; region: string }> = {}

  for (const country of allCountries) {
    const countryCode = country.countryShortCode.toLowerCase()
    countryNames[countryCode] = country.countryName

    for (const region of country.regions) {
      if (!region.shortCode) continue

      const regionCode = region.shortCode.toLowerCase()
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

export function getNameFromMappings(
  code: string,
  mappings: CountryNameMapping
): string | undefined {
  if (mappings.subdivisionNames[code]) {
    const { country, region } = mappings.subdivisionNames[code]
    return `${country} - ${region}`
  }

  if (mappings.countryNames[code]) {
    return mappings.countryNames[code]
  }

  return undefined
}
