import { FLAG_REGISTRY, COUNTRY_NAMES, SUBDIVISION_NAMES } from '@sankyu/react-circle-flags'
import clm from 'country-locale-map'

export interface FlagInfo {
  code: string
  componentName: string
  countryName: string
  region: string
  continent: string
  type: 'country' | 'subdivision' | 'organization' | 'other'
  currency?: string
  capital?: string
  languages: string[]
  alpha3?: string
  numeric?: string
  defaultLocale?: string
  displayName?: string
  emoji?: string
}

type CountryData = NonNullable<ReturnType<typeof clm.getCountryByAlpha2>>

const getAlpha2 = (code: string) => code.split(/[-_]/)[0].toUpperCase()

const regionDisplayNames = new Intl.DisplayNames(['en'], { type: 'region' })

const getCountryData = (code: string): CountryData | undefined => {
  const alpha2 = getAlpha2(code)
  if (alpha2.length !== 2) return undefined
  return clm.getCountryByAlpha2(alpha2)
}

const getSubdivisionSuffix = (code: string) => {
  const parts = code.split(/[-_]/)
  return parts.length > 1 ? parts[1].toUpperCase() : undefined
}

function getFlagType(code: string): FlagInfo['type'] {
  if (COUNTRY_NAMES[code as keyof typeof COUNTRY_NAMES]) return 'country'
  if (SUBDIVISION_NAMES[code as keyof typeof SUBDIVISION_NAMES]) return 'subdivision'
  if (['eu', 'un', 'nato', 'european_union'].includes(code)) return 'organization'
  return 'other'
}

function getCountryName(code: string, componentName: string): string {
  if (SUBDIVISION_NAMES[code as keyof typeof SUBDIVISION_NAMES]) {
    const { country, region } = SUBDIVISION_NAMES[code as keyof typeof SUBDIVISION_NAMES]
    return `${country} - ${region}`
  }

  if (COUNTRY_NAMES[code as keyof typeof COUNTRY_NAMES]) {
    return COUNTRY_NAMES[code as keyof typeof COUNTRY_NAMES]
  }

  const country = getCountryData(code)
  if (country?.name) {
    const suffix = getSubdivisionSuffix(code)
    return suffix ? `${country.name} - ${suffix}` : country.name
  }

  const name = componentName
    .replace(/^Flag/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim()

  return name || code.toUpperCase()
}

function getRegion(code: string): string {
  const country = getCountryData(code)
  if (country?.region) return country.region
  if (country?.continent) return country.continent
  if (getFlagType(code) === 'organization') return 'International'
  return 'Other'
}

function getContinent(code: string): string {
  const country = getCountryData(code)
  if (country?.continent) return country.continent
  if (getFlagType(code) === 'organization') return 'International'
  return 'Other'
}

function getDisplayName(code: string, fallback: string): string {
  // Prioritize COUNTRY_NAMES and SUBDIVISION_NAMES over Intl.DisplayNames
  // This ensures historical codes (e.g., 'su' -> 'Soviet Union') display correctly
  // instead of being mapped to successor states (e.g., 'Russia')
  if (SUBDIVISION_NAMES[code as keyof typeof SUBDIVISION_NAMES]) {
    const { country, region } = SUBDIVISION_NAMES[code as keyof typeof SUBDIVISION_NAMES]
    return `${country} - ${region}`
  }

  if (COUNTRY_NAMES[code as keyof typeof COUNTRY_NAMES]) {
    return COUNTRY_NAMES[code as keyof typeof COUNTRY_NAMES]
  }

  // Fallback to Intl.DisplayNames for standard country codes
  const countryCode = getAlpha2(code)
  const subdivision = getSubdivisionSuffix(code)

  try {
    const countryName = regionDisplayNames.of(countryCode)
    if (subdivision) {
      return `${countryName} - (${subdivision})`
    }
    return countryName || fallback
  } catch {
    return fallback
  }
}

function buildFlagInfo(code: string, componentName: string): FlagInfo {
  const country = getCountryData(code)
  const countryName = getCountryName(code, componentName)

  return {
    code,
    componentName,
    countryName,
    region: getRegion(code),
    continent: getContinent(code),
    type: getFlagType(code),
    currency: country?.currency,
    capital: country?.capital,
    languages: country?.languages ?? [],
    alpha3: country?.alpha3,
    numeric: country?.numeric,
    defaultLocale: country?.default_locale,
    displayName: getDisplayName(code, countryName),
    emoji: country?.emoji,
  }
}

export function getAllFlags(): FlagInfo[] {
  return Object.entries(FLAG_REGISTRY).map(([code, componentName]) =>
    buildFlagInfo(code, componentName)
  )
}

export function getAllRegions(): string[] {
  const regions = new Set(getAllFlags().map(flag => flag.region))
  return Array.from(regions).sort()
}

export function getAllContinents(): string[] {
  const continents = new Set(getAllFlags().map(flag => flag.continent))
  return Array.from(continents).sort()
}

export function getAllCurrencies(): string[] {
  const currencies = new Set(
    getAllFlags()
      .map(flag => flag.currency)
      .filter(Boolean) as string[]
  )
  return Array.from(currencies).sort()
}

export function getAllTypes(): Array<FlagInfo['type']> {
  return ['country', 'subdivision', 'organization', 'other']
}

export const TYPE_LABELS: Record<FlagInfo['type'], string> = {
  country: 'Country/Region',
  subdivision: 'Subdivision',
  organization: 'Organization',
  other: 'Other',
}

export const getFlagCount = () => Object.keys(FLAG_REGISTRY).length
