/**
 * Convert ISO country code to flag emoji
 * @example
 * codeToEmoji('us') // returns '🇺🇸'
 * codeToEmoji('cn') // returns '🇨🇳'
 */
export function codeToEmoji(code: string): string {
  const upperCode = code.toUpperCase().slice(0, 2)
  if (upperCode.length < 2) return '🏳️'

  // Regional Indicator Symbol A starts at 0x1F1E6
  const base = 0x1f1e6
  const aCode = 'A'.charCodeAt(0)

  return [...upperCode]
    .map(char => String.fromCodePoint(base + char.charCodeAt(0) - aCode))
    .join('')
}

/**
 * Convert file code to valid JavaScript identifier (PascalCase)
 * @example
 * codeToComponentName('us') // returns 'FlagUs'
 * codeToComponentName('af-emirate') // returns 'FlagAfEmirate'
 */
export function codeToComponentName(code: string): string {
  const pascalCaseName = code
    .toLowerCase()
    .split(/[-_\s]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  const validIdentifier = /^[0-9]/.test(pascalCaseName) ? `Flag_${pascalCaseName}` : pascalCaseName

  return `Flag${validIdentifier}`
}

/**
 * Standard flag sizes
 */
export const FlagSizes = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
  xxl: 96,
  xxxl: 128,
} as const

export type FlagSizeName = keyof typeof FlagSizes

/**
 * Get size name from pixel value
 */
export function getSizeName(pixels: number): FlagSizeName | null {
  const entries = Object.entries(FlagSizes) as [FlagSizeName, number][]
  const match = entries.find(([, size]) => size === pixels)
  return match ? match[0] : null
}
