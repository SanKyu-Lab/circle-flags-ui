import { useId, useState, useEffect } from 'react'
import type { ReactElement, SVGProps } from 'react'
import {
  codeToEmoji,
  codeToComponentName,
  FlagSizes,
  getSizeName,
  FLAG_REGISTRY,
  type FlagCode,
  type FlagComponentProps as CoreFlagComponentProps,
  type FlagSizeName,
} from '@sankyu/circle-flags-core'

import * as AllFlags from '../generated/flags'

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
        // Use try-catch to handle environments where removeAttribute might not exist
        try {
          el.removeAttribute(attr.name)
        } catch {
          // Fallback: try setting attribute to empty string
          try {
            el.setAttribute(attr.name, '')
          } catch {
            // Last resort: ignore the error in test environments
          }
        }
        return
      }

      if ((name === 'href' || name === 'xlink:href') && value.startsWith('javascript:')) {
        try {
          el.removeAttribute(attr.name)
        } catch {
          try {
            el.setAttribute(attr.name, '')
          } catch {
            // Ignore in test environments
          }
        }
      }
    })
  })

  return svg.outerHTML
}

export interface FlagComponentProps extends SVGProps<SVGSVGElement>, CoreFlagComponentProps {}

/**
 * @deprecated `CircleFlag` is deprecated and not recommended for new code.
 *
 * It fetches SVG at runtime and renders a wrapper with injected SVG HTML, so many SVG-only props won’t apply.
 *
 * Prefer `named imports` or `DynamicFlag` instead.
 *
 * Read more: https://react-circle-flags.sankyu.dev/docs/deprecated/circleflag
 */
export interface CircleFlagProps extends Omit<FlagComponentProps, 'title'> {
  countryCode?: string
  /** @deprecated Use 'countryCode' instead */
  code?: string
  cdnUrl?: string
  title?: string
}

const DEFAULT_CDN_ENDPOINT = 'https://hatscripts.github.io/circle-flags/flags/'

export { FlagSizes, getSizeName }
export type { FlagSizeName }

export const FlagUtils: {
  isValidCountryCode: (code: string) => boolean
  formatCountryCode: (code: string) => string
  getComponentName: (code: string) => string
  sizes: typeof FlagSizes
  getSizeName: (pixels: number) => FlagSizeName | null
} = {
  isValidCountryCode: (code: string): boolean => {
    return Object.prototype.hasOwnProperty.call(FLAG_REGISTRY, code.toLowerCase())
  },

  formatCountryCode: (code: string): string => {
    return code.toUpperCase()
  },

  getComponentName: codeToComponentName,

  sizes: FlagSizes,
  getSizeName,
}

export { buildMeta } from './meta'
export type { BuildMeta } from './meta'

/**
 * @deprecated `CircleFlag` is deprecated and not recommended for new code.
 *
 * Prefer `named imports` or `DynamicFlag` instead.
 *
 * Read more: https://react-circle-flags.sankyu.dev/docs/deprecated/circleflag/
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
  code: string
  // Explicitly include title to avoid type resolution differences across toolchains (e.g. Astro/TS).
  title?: string
}

export const DynamicFlag = ({
  code,
  width = 48,
  height = 48,
  title,
  ...props
}: DynamicFlagProps): ReactElement => {
  const titleId = useId()
  const normalizedCode = code.toLowerCase()
  const componentName = FLAG_REGISTRY[normalizedCode as FlagCode]

  if (!componentName) {
    const upperCode = code.toUpperCase()
    const emoji = codeToEmoji(code)
    const defaultTitle = title ?? `${emoji} ${upperCode}`

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

  const FlagComponent = AllFlags[componentName as keyof typeof AllFlags] as unknown as (
    props: FlagComponentProps
  ) => ReactElement

  if (!FlagComponent || typeof FlagComponent !== 'function') {
    console.error(`Flag component not found for code: ${code}`)
    return <div>Flag not found: {code}</div>
  }

  return <FlagComponent width={width} height={height} title={title} {...props} />
}

export type CountryCode = FlagCode

export * from '../generated/flags'

export {
  FLAG_REGISTRY,
  COUNTRY_NAMES,
  SUBDIVISION_NAMES,
  type FlagCode,
} from '@sankyu/circle-flags-core'
