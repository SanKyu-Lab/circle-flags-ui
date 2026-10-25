import { FLAG_REGISTRY, type FlagCode } from './generated/registry'

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

export function isFlagCode(code: string): code is FlagCode {
  const normalized = code.trim().toLowerCase()
  if (normalized !== code) return false
  return Object.prototype.hasOwnProperty.call(FLAG_REGISTRY, normalized)
}

export function coerceFlagCode(code: string, fallback: FlagCode = 'xx'): FlagCode {
  const normalized = code.trim().toLowerCase()
  if (Object.prototype.hasOwnProperty.call(FLAG_REGISTRY, normalized)) return normalized as FlagCode
  return fallback
}

/**
 * Escape HTML special characters to prevent XSS when injecting raw HTML.
 */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, ch => {
    switch (ch) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      case "'":
        return '&#39;'
      default:
        return ch
    }
  })
}

// Elements removed together with their content.
const UNSAFE_ELEMENTS = 'script, foreignObject'
// SMIL animations can rewrite a link target after the static attributes were checked.
const ANIMATION_ELEMENTS = 'set, animate'
const LINK_ATTRIBUTES = new Set(['href', 'xlink:href'])
const URL_ATTRIBUTES = new Set(['href', 'xlink:href', 'src'])

// URL parsers drop tabs and newlines anywhere in a URL and C0 controls or spaces around it, so
// `java\tscript:` and ` javascript:` still run script. Dropping every character up to U+0020
// before the check covers those forms.
const isScriptUrl = (value: string): boolean =>
  [...value]
    .filter(char => char > ' ')
    .join('')
    .toLowerCase()
    .startsWith('javascript:')

/**
 * Sanitize an SVG string fetched from a CDN before it is injected as HTML.
 *
 * Removes `<script>` and `<foreignObject>`, event handler attributes, `javascript:` URLs, and
 * `<set>` / `<animate>` elements that animate a link target. Parsing uses the browser's
 * `DOMParser`, so entities are decoded before the checks run.
 *
 * Returns an empty string when the input is not well-formed SVG, or when `DOMParser` is not
 * available (for example in Node without a DOM implementation).
 */
export function sanitizeSvg(raw: string): string {
  if (typeof DOMParser === 'undefined') return ''

  const doc = new DOMParser().parseFromString(raw, 'image/svg+xml')
  const svg = doc.documentElement
  if (doc.querySelector('parsererror') || svg.localName !== 'svg') return ''

  svg.querySelectorAll(UNSAFE_ELEMENTS).forEach(element => element.remove())
  svg.querySelectorAll(ANIMATION_ELEMENTS).forEach(element => {
    const target = element.getAttribute('attributeName')?.trim().toLowerCase() ?? ''
    if (LINK_ATTRIBUTES.has(target)) element.remove()
  })

  for (const element of [svg, ...Array.from(svg.querySelectorAll('*'))]) {
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase()
      if (name.startsWith('on') || (URL_ATTRIBUTES.has(name) && isScriptUrl(attribute.value))) {
        element.removeAttribute(attribute.name)
      }
    }
  }

  return svg.outerHTML
}
