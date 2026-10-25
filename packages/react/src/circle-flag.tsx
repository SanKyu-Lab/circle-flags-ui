import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { codeToEmoji, sanitizeSvg } from '@sankyu/circle-flags-core'

import type { FlagComponentProps } from './flag-props'

/**
 * @deprecated `CircleFlag` is deprecated and not recommended for new code.
 *
 * It fetches SVG at runtime and renders a wrapper with injected SVG HTML, so many SVG-only props won’t apply.
 *
 * Prefer `named imports` or `DynamicFlag` instead.
 *
 * Read more: https://react-circle-flags.js.org/docs/deprecated/circleflag
 */
export interface CircleFlagProps extends Omit<FlagComponentProps, 'title'> {
  countryCode?: string
  /** @deprecated Use 'countryCode' instead */
  code?: string
  cdnUrl?: string
  title?: string
}

const DEFAULT_CDN_ENDPOINT = 'https://hatscripts.github.io/circle-flags/flags/'

/**
 * @deprecated `CircleFlag` is deprecated and not recommended for new code.
 *
 * Prefer `named imports` or `DynamicFlag` instead.
 *
 * Read more: https://react-circle-flags.js.org/docs/deprecated/circleflag/
 */
export const CircleFlag = ({
  countryCode,
  code,
  cdnUrl = DEFAULT_CDN_ENDPOINT,
  width = 48,
  height = 48,
  title,
  className,
  style,
  ...props
}: CircleFlagProps): ReactElement => {
  const finalCountryCode = countryCode ?? code ?? ''
  const upperCode = finalCountryCode.toUpperCase()
  const defaultTitle = title ?? `${codeToEmoji(finalCountryCode)} ${upperCode}`
  const url = finalCountryCode
    ? `${cdnUrl.replace(/\/$/, '')}/${finalCountryCode.toLowerCase()}.svg`
    : ''

  // Results are keyed by URL: after `countryCode` or `cdnUrl` changes, the loading state shows
  // until the response for the new URL arrives, and a late response for an old URL is ignored.
  const [result, setResult] = useState<{ url: string; svg: string | null } | null>(null)

  useEffect(() => {
    if (!url) return

    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Failed to load flag: ${response.statusText}`)
        }
        const svg = sanitizeSvg(await response.text())
        if (!svg) {
          throw new Error('Flag response is not a well-formed SVG')
        }
        if (!controller.signal.aborted) setResult({ url, svg })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        console.warn(`Failed to load flag for country code: ${finalCountryCode}`, err)
        setResult({ url, svg: null })
      })

    return () => {
      controller.abort()
    }
  }, [url, finalCountryCode])

  const current = result?.url === url ? result : null

  if (url && !current) {
    return (
      <svg
        viewBox="0 0 512 512"
        width={width}
        height={height}
        className={className}
        style={style}
        role="img"
        aria-label={defaultTitle}
        {...props}
      >
        <title>{defaultTitle}</title>
        <circle cx="256" cy="256" r="256" fill="#f5f5f5" />
        <circle cx="256" cy="256" r="200" fill="#e0e0e0" className="animate-pulse" />
      </svg>
    )
  }

  if (!current?.svg) {
    return (
      <svg
        viewBox="0 0 512 512"
        width={width}
        height={height}
        className={className}
        style={style}
        role="img"
        aria-label={defaultTitle}
        {...props}
      >
        <title>{defaultTitle}</title>
        <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
        <circle cx="256" cy="256" r="200" fill="#e0e0e0" />
        <text x="256" y="280" textAnchor="middle" fontSize="80" fontWeight="bold" fill="#666">
          {upperCode}
        </text>
      </svg>
    )
  }

  const svgWithSize = current.svg.replace(/<svg([^>]*)>/, '<svg$1 width="100%" height="100%">')

  return (
    <div
      className={className}
      style={{ width, height, display: 'inline-block', ...style }}
      dangerouslySetInnerHTML={{ __html: svgWithSize }}
      role="img"
      aria-label={defaultTitle}
      {...(props as object)}
    />
  )
}
