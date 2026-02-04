/**
 * Convert ISO country code to flag emoji
 * Examples:
 * - us -> 🇺🇸
 * - cn -> 🇨🇳
 * - ad -> 🇦🇩
 */
export const codeToEmoji = code => {
  const upperCode = String(code).toUpperCase().slice(0, 2)
  if (upperCode.length < 2) return '🏳️'

  const base = 0x1f1e6
  const aCode = 'A'.charCodeAt(0)

  return [...upperCode]
    .map(char => String.fromCodePoint(base + char.charCodeAt(0) - aCode))
    .join('')
}

/**
 * Convert file code to valid JavaScript identifier
 * Examples:
 * - `af-emirate` -> `AfEmirate` -> `FlagAfEmirate`
 * - `aq-true_south` -> `AqTrueSouth` -> `FlagAqTrueSouth`
 * - `it-72` -> `It72` -> `FlagIt72`
 * - `ru-cu` -> `RuCu` -> `FlagRuCu`
 */
export const codeToComponentName = code => {
  const cleanName = String(code)
    .toLowerCase()
    .split(/[-_\s]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  const safeName = /^[0-9]/.test(cleanName) ? `Flag_${cleanName}` : cleanName
  return `Flag${safeName}`
}
