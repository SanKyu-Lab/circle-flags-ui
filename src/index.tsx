import { useId, useState, useEffect } from 'react'
import type { ReactElement, SVGProps } from 'react'

import * as AllFlags from '../generated/flags'
import { FLAG_REGISTRY } from '../generated/flags'
import type { FlagCode } from '../generated/flags'

/**
 * Convert ISO country code to flag emoji
 * @example
 * codeToEmoji('us') // returns '🇺🇸'
 * codeToEmoji('cn') // returns '🇨🇳'
 */
function codeToEmoji(code: string): string {
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
 * Minimal SVG sanitizer to drop active content before injecting HTML
 */
function sanitizeSvg(raw: string): string {
  if (typeof DOMParser === 'undefined') return raw

  const parser = new DOMParser()
  const doc = parser.parseFromString(raw, 'image/svg+xml')
  const svg = doc.documentElement

  if (!svg || doc.querySelector('parsererror')) return raw

  svg.querySelectorAll('script,foreignObject').forEach(el => el.remove())

  svg.querySelectorAll('*').forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      const name = attr.name.toLowerCase()
      const value = attr.value.trim().toLowerCase()

      if (name.startsWith('on')) {
        el.removeAttribute(attr.name)
        return
      }

      if ((name === 'href' || name === 'xlink:href') && value.startsWith('javascript:')) {
        el.removeAttribute(attr.name)
      }
    })
  })

  return svg.outerHTML
}

/**
 * Base props for all flag components
 * All individual flag components inherit from this type
 */
export interface FlagComponentProps extends SVGProps<SVGSVGElement> {
  /** Width of the flag */
  width?: number | string
  /** Height of the flag */
  height?: number | string
  /** CSS className */
  className?: string
  /** Accessible title for screen readers */
  title?: string
}

export interface CircleFlagProps extends Omit<FlagComponentProps, 'title'> {
  /** ISO country code (e.g., 'us', 'cn', 'gb') */
  countryCode?: string
  /** @deprecated Use 'countryCode' instead - kept for backward compatibility */
  code?: string
  /** Custom CDN URL for loading SVG flags */
  cdnUrl?: string
  /** Custom title for accessibility */
  title?: string
}

/**
 * Default CDN endpoint for loading flag SVGs
 */
const DEFAULT_CDN_ENDPOINT = 'https://hatscripts.github.io/circle-flags/flags/'

// Add sizes separately to avoid circular reference
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

/**
 * Utility functions for working with flags
 */
export const FlagUtils: {
  isValidCountryCode: (code: string) => boolean
  formatCountryCode: (code: string) => string
  getComponentName: (code: string) => string
  sizes: typeof FlagSizes
  getSizeName: (pixels: number) => FlagSizeName | null
} = {
  /**
   * Check if a country code is valid
   */
  isValidCountryCode: (code: string): boolean => {
    return Object.prototype.hasOwnProperty.call(FLAG_REGISTRY, code.toLowerCase())
  },

  /**
   * Format country code to uppercase
   */
  formatCountryCode: (code: string): string => {
    return code.toUpperCase()
  },

  /**
   * Get component name from country code
   */
  getComponentName: (code: string): string => {
    // Remove special characters and convert to PascalCase
    const cleanName = code
      .toLowerCase()
      .split(/[-_\s]+/) // Split on hyphens, underscores, spaces
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')

    // Ensure it doesn't start with a number
    const safeName = /^[0-9]/.test(cleanName) ? `Flag_${cleanName}` : cleanName

    return `Flag${safeName}`
  },

  sizes: FlagSizes,
  getSizeName,
}

export { buildMeta } from './meta'
export type { BuildMeta } from './meta'

/**
 * Flag component compatible with react-circle-flags API
 * Loads SVG from CDN for minimal bundle size
 *
 * @example
 * import { CircleFlag } from '@sankyu/react-circle-flags'
 * <CircleFlag countryCode="us" height="35" />
 * <CircleFlag code="us" height="35" /> // backward compatible
 * <CircleFlag countryCode="io" height="35" cdnUrl="https://hatscripts.github.io/circle-flags/flags/" />
 */
export const CircleFlag = ({
  countryCode,
  code,
  cdnUrl = DEFAULT_CDN_ENDPOINT,
  width = 48,
  height = 48,
  title,
  className,
  ...props
}: CircleFlagProps): ReactElement => {
  // Backward compatibility: 'code' is an alias for 'countryCode'
  const finalCountryCode = countryCode ?? code ?? ''
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [error, setError] = useState<boolean>(false)
  const titleId = useId()

  const normalizedCode = finalCountryCode.toLowerCase()
  const upperCode = finalCountryCode.toUpperCase()
  const emoji = codeToEmoji(finalCountryCode)
  const defaultTitle = title ?? `${emoji} ${upperCode}`

  useEffect(() => {
    if (!finalCountryCode) {
      setError(true)
      return
    }

    const fetchSvg = async () => {
      try {
        const url = `${cdnUrl.replace(/\/$/, '')}/${normalizedCode}.svg`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to load flag: ${response.statusText}`)
        }

        const svg = await response.text()
        const sanitizedSvg = sanitizeSvg(svg)
        setSvgContent(sanitizedSvg)
        setError(false)
      } catch (err) {
        console.warn(`Failed to load flag for country code: ${finalCountryCode}`, err)
        setError(true)
      }
    }

    fetchSvg()
  }, [finalCountryCode, cdnUrl, normalizedCode])

  // Loading state
  if (!svgContent && !error) {
    return (
      <svg
        viewBox="0 0 512 512"
        width={width}
        height={height}
        className={className}
        role="img"
        aria-label={defaultTitle}
        {...props}
      >
        <title id={titleId}>{defaultTitle}</title>
        <circle cx="256" cy="256" r="256" fill="#f5f5f5" />
        <circle cx="256" cy="256" r="200" fill="#e0e0e0" className="animate-pulse" />
      </svg>
    )
  }

  // Error state - fallback flag
  if (error || !svgContent) {
    return (
      <svg
        viewBox="0 0 512 512"
        width={width}
        height={height}
        className={className}
        role="img"
        aria-label={defaultTitle}
        aria-labelledby={titleId}
        {...props}
      >
        <title id={titleId}>{defaultTitle}</title>
        <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
        <circle cx="256" cy="256" r="200" fill="#e0e0e0" />
        <text x="256" y="280" textAnchor="middle" fontSize="80" fontWeight="bold" fill="#666">
          {upperCode}
        </text>
      </svg>
    )
  }

  // Success state - render SVG from CDN
  // Inject width/height="100%" to SVG to inherit parent container size
  const svgWithSize = svgContent.replace(/<svg([^>]*)>/, '<svg$1 width="100%" height="100%">')

  return (
    <div
      className={className}
      style={{ width, height, display: 'inline-block' }}
      dangerouslySetInnerHTML={{ __html: svgWithSize }}
      role="img"
      aria-label={defaultTitle}
      {...(props as object)}
    />
  )
}

export interface DynamicFlagProps extends FlagComponentProps {
  /** ISO country code (e.g., 'us', 'cn', 'gb') */
  code: string
}

/**
 * Dynamic flag component that bundles all flags
 * Renders flags based on runtime country code
 *
 * WARNING: This component bundles ALL 400+ flag components in your bundle (~600KB).
 * For minimal bundle size, use CircleFlag instead (loads from CDN) or import
 * specific flags: import { FlagUs } from '@sankyu/react-circle-flags'
 *
 * @example
 * import { DynamicFlag } from '@sankyu/react-circle-flags'
 * <DynamicFlag code="us" width={48} height={48} />
 */
export const DynamicFlag = ({
  code,
  width = 48,
  height = 48,
  title,
  ...props
}: DynamicFlagProps): ReactElement => {
  const titleId = useId() // Must be called at top level
  const normalizedCode = code.toLowerCase()
  const componentName = FLAG_REGISTRY[normalizedCode as FlagCode]

  if (!componentName) {
    const upperCode = code.toUpperCase()
    const emoji = codeToEmoji(code)
    const defaultTitle = title ?? `${emoji} ${upperCode}`

    // Fallback for unknown country code
    return (
      <svg
        viewBox="0 0 512 512"
        width={width}
        height={height}
        role="img"
        aria-label={defaultTitle}
        aria-labelledby={titleId}
        {...props}
      >
        <title id={titleId}>{defaultTitle}</title>
        <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
        <circle cx="256" cy="256" r="200" fill="#e0e0e0" />
        <text x="256" y="280" textAnchor="middle" fontSize="80" fontWeight="bold" fill="#666">
          {upperCode}
        </text>
      </svg>
    )
  }

  // Get flag component from the bundled flags
  // All flags are imported via `import * as AllFlags`, so bundle size will be large
  const FlagComponent = AllFlags[componentName as keyof typeof AllFlags] as unknown as (
    props: FlagComponentProps
  ) => ReactElement

  if (!FlagComponent || typeof FlagComponent !== 'function') {
    // This should never happen if FLAG_REGISTRY is in sync
    console.error(`Flag component not found for code: ${code}`)
    return <div>Flag not found: {code}</div>
  }

  return <FlagComponent width={width} height={height} title={title} {...props} />
}

/**
 * All available country/region flag codes
 * Use this type for type-safe country code validation
 */
export type CountryCode = FlagCode

// Re-export all flag components for tree-shaking
// Modern bundlers will automatically tree-shake unused exports
// import { FlagUs, FlagCn } from '@sankyu/react-circle-flags' ✅ Works with tree-shaking
export * from '../generated/flags'
