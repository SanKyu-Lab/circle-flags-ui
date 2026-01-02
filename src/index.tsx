import { useId } from 'react'
import type { ComponentType, ReactElement, SVGProps } from 'react'

import * as FlagComponents from '../generated/flags'
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
  /** Alt text fallback (emoji) */
  alt?: string
}

export interface DynamicFlagProps extends Omit<FlagComponentProps, 'title'> {
  /** ISO country code (e.g., 'us', 'cn', 'gb') */
  code: string
  /** Custom title for accessibility */
  title?: string
}

// Backward-compatible prop alias for the CircleFlag component
export type FlagProps = DynamicFlagProps

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

type FlagComponentMap = Record<string, ComponentType<FlagComponentProps>>

const flagComponentMap = FlagComponents as unknown as FlagComponentMap
const flagRegistry = FlagComponents.FLAG_REGISTRY

const getFlagComponent = (code: string): ComponentType<FlagComponentProps> | undefined => {
  const registryKey = code.toLowerCase()
  if (!Object.prototype.hasOwnProperty.call(flagRegistry, registryKey)) {
    return undefined
  }

  const componentName = flagRegistry[registryKey as FlagCode]
  return flagComponentMap[componentName]
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
    return Object.prototype.hasOwnProperty.call(flagRegistry, code.toLowerCase())
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
 * Dynamic flag component that renders existing flags by country code
 *
 * @example
 * import { DynamicFlag } from '@sankyu/react-circle-flags'
 * <DynamicFlag code="us" />
 * <DynamicFlag code="gb" width={64} height={64} className="flag-icon" />
 */
export const DynamicFlag = ({ code, title, ...props }: DynamicFlagProps): ReactElement => {
  const upperCode = code.toUpperCase()
  const emoji = codeToEmoji(code)
  const defaultTitle = `${emoji} ${upperCode}`
  const resolvedTitle = title ?? defaultTitle
  const titleId = useId()

  const FlagComponent = getFlagComponent(code)

  if (FlagComponent) {
    return <FlagComponent title={resolvedTitle} {...props} />
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={48}
      height={48}
      role="img"
      aria-label={resolvedTitle}
      aria-labelledby={titleId}
      {...props}
    >
      <title id={titleId}>{resolvedTitle}</title>
      <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
      <circle cx="256" cy="256" r="200" fill="#e0e0e0" />
      <text x="256" y="280" textAnchor="middle" fontSize="80" fontWeight="bold" fill="#666">
        {upperCode}
      </text>
    </svg>
  )
}

// Backward-compatible component alias
export const CircleFlag: typeof DynamicFlag = DynamicFlag

/**
 * All available country/region flag codes
 * Use this type for type-safe country code validation
 */
export type CountryCode = FlagCode

// Re-export all individual flags for tree-shaking
/** @internal */
/* istanbul ignore next */
export * from '../generated/flags'
/** @internal */
/* istanbul ignore next */
export {
  FlagUs as FlagUS,
  FlagCn as FlagCN,
  FlagGb as FlagGB,
  FlagJp as FlagJP,
} from '../generated/flags'

// Export the flag registry for dynamic loading
/* istanbul ignore next */
export type { FlagCode } from '../generated/flags'
/* istanbul ignore next */
export { FLAG_REGISTRY } from '../generated/flags'
