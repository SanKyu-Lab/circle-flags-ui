import { createSignal, createEffect, mergeProps, splitProps, Show } from 'solid-js'
import type { Component, JSX } from 'solid-js'
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

export interface FlagComponentProps extends CoreFlagComponentProps {
  width?: number | string
  height?: number | string
}

export interface CircleFlagProps
  extends
    Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'width' | 'height' | 'title'>,
    FlagComponentProps {
  countryCode?: string
  /** @deprecated Use 'countryCode' instead */
  code?: string
  cdnUrl?: string
  title?: string
}

const DEFAULT_CDN_ENDPOINT = 'https://hatscripts.github.io/circle-flags/flags/'

export { FlagSizes, getSizeName }
export type { FlagSizeName }

export const FlagUtils = {
  isValidCountryCode: (code: string): boolean => {
    return Object.prototype.hasOwnProperty.call(FLAG_REGISTRY, code.toLowerCase())
  },

  formatCountryCode: (code: string): string => {
    return code.toUpperCase()
  },

  getComponentName: codeToComponentName,

  sizes: FlagSizes,
  getSizeName,
} as const

export { buildMeta } from './meta'
export type { BuildMeta } from './meta'

const toCssSize = (value: number | string | undefined) => {
  if (typeof value === 'number') return `${value}px`
  return value
}

// Simple CDN-based flag loader (for demonstration - production would use resources)
export const CircleFlag: Component<CircleFlagProps> = props => {
  const merged = mergeProps(
    {
      width: 48,
      height: 48,
      cdnUrl: DEFAULT_CDN_ENDPOINT,
    },
    props
  )

  const [local, rest] = splitProps(merged, [
    'countryCode',
    'code',
    'cdnUrl',
    'width',
    'height',
    'title',
    'class',
    'className',
  ])

  const finalCountryCode = () => local.countryCode ?? local.code ?? ''
  const normalizedCode = () => finalCountryCode().toLowerCase()
  const upperCode = () => finalCountryCode().toUpperCase()
  const emoji = () => codeToEmoji(finalCountryCode())
  const defaultTitle = () => local.title ?? `${emoji()} ${upperCode()}`

  const [svgContent, setSvgContent] = createSignal<string | null>(null)
  const [error, setError] = createSignal(false)

  createEffect(() => {
    const code = finalCountryCode()
    if (!code) {
      setSvgContent(null)
      setError(true)
      return
    }

    const url = `${local.cdnUrl!.replace(/\/$/, '')}/${normalizedCode()}.svg`
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load flag: ${response.statusText}`)
        }
        return response.text()
      })
      .then(svg => {
        setSvgContent(svg)
        setError(false)
      })
      .catch(err => {
        console.warn(`Failed to load flag for country code: ${code}`, err)
        setSvgContent(null)
        setError(true)
      })
  })

  return (
    <Show
      when={svgContent() && !error()}
      fallback={
        <svg
          {...rest}
          viewBox="0 0 512 512"
          width={local.width}
          height={local.height}
          class={local.class || local.className}
          role="img"
          aria-label={defaultTitle()}
        >
          <title>{defaultTitle()}</title>
          <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
          <circle cx="256" cy="256" r="200" fill="#e0e0e0" />
          <text x="256" y="280" text-anchor="middle" font-size="80" font-weight="bold" fill="#666">
            {upperCode()}
          </text>
        </svg>
      }
    >
      <div
        {...(rest as any)}
        class={local.class || local.className}
        style={{
          width: toCssSize(local.width),
          height: toCssSize(local.height),
          display: 'inline-block',
          ...(typeof rest.style === 'object' ? (rest.style as object) : {}),
        }}
        role="img"
        aria-label={defaultTitle()}
        innerHTML={svgContent()!.replace(/<svg([^>]*)>/, '<svg$1 width="100%" height="100%">')}
      />
    </Show>
  )
}

export interface DynamicFlagProps
  extends
    Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'width' | 'height' | 'title'>,
    FlagComponentProps {
  code: string
  title?: string
}

export const DynamicFlag: Component<DynamicFlagProps> = props => {
  const merged = mergeProps(
    {
      width: 48,
      height: 48,
    },
    props
  )

  const [local, rest] = splitProps(merged, [
    'code',
    'width',
    'height',
    'title',
    'class',
    'className',
  ])

  const normalizedCode = () => local.code.toLowerCase()
  const componentName = () => FLAG_REGISTRY[normalizedCode() as FlagCode]
  const upperCode = () => local.code.toUpperCase()
  const emoji = () => codeToEmoji(local.code)
  const defaultTitle = () => local.title ?? `${emoji()} ${upperCode()}`

  return (
    <Show
      when={componentName()}
      fallback={
        <svg
          {...rest}
          viewBox="0 0 512 512"
          width={local.width}
          height={local.height}
          class={local.class || local.className}
          role="img"
          aria-label={defaultTitle()}
        >
          <title>{defaultTitle()}</title>
          <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
          <circle cx="256" cy="256" r="200" fill="#e0e0e0" />
          <text x="256" y="280" text-anchor="middle" font-size="80" font-weight="bold" fill="#666">
            {upperCode()}
          </text>
        </svg>
      }
    >
      {(() => {
        const FlagComponent = (AllFlags as any)[componentName()!] as Component<any>
        if (!FlagComponent) {
          console.error(`Flag component not found for code: ${local.code}`)
          return <div>Flag not found: {local.code}</div>
        }
        return (
          <FlagComponent
            {...rest}
            width={local.width}
            height={local.height}
            title={local.title}
            class={local.class || local.className}
          />
        )
      })()}
    </Show>
  )
}

export type CountryCode = FlagCode

export * from '../generated/flags'

export {
  FLAG_REGISTRY,
  COUNTRY_NAMES,
  SUBDIVISION_NAMES,
  type FlagCode,
} from '@sankyu/circle-flags-core'
