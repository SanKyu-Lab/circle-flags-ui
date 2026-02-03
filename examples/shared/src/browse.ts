const BROWSE_BASE_URL = 'https://react-circle-flags.js.org/browse'

export function getBrowseUrl(countryCode: string): string {
  const url = new URL(BROWSE_BASE_URL)
  url.searchParams.set('countryCode', countryCode)
  return url.toString()
}

export function openBrowse(countryCode: string) {
  window.open(getBrowseUrl(countryCode), '_blank')
}
