import {
  createSignal,
  createEffect,
  mergeProps,
  onCleanup,
  splitProps,
  Match,
  Show,
  Switch,
} from 'solid-js'
import type { Component, JSX } from 'solid-js'
import {
  codeToEmoji,
  codeToComponentName,
  coerceFlagCode,
  FlagSizes,
  getSizeName,
  sanitizeSvg,
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

/**
 * @deprecated `CircleFlag` is deprecated and not recommended for new code.
 *
 * It fetches SVG at runtime and renders a wrapper with injected SVG HTML, so many SVG-only props won’t apply.
 *
 * Prefer `named imports` or `DynamicFlag` instead.
 *
 * Read more: https://react-circle-flags.js.org/docs/deprecated/circleflag
 */
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

const joinClass = (...values: Array<string | undefined>) =>
  values.filter(Boolean).join(' ') || undefined

const mergeStyle = (
  base: Record<string, string | undefined>,
  style: JSX.CSSProperties | string | undefined
): JSX.CSSProperties | string => {
  if (typeof style !== 'string') return { ...base, ...style }
  const baseText = Object.entries(base)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ')
  return `${baseText}; ${style}`
}

/**
 * @deprecated `CircleFlag` is deprecated and not recommended for new code.
 *
 * Prefer `named imports` or `DynamicFlag` instead.
 *
 * Read more: https://react-circle-flags.js.org/docs/deprecated/circleflag/
 */
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
    'style',
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
    const url = `${local.cdnUrl.replace(/\/$/, '')}/${normalizedCode()}.svg`
    setSvgContent(null)
    setError(false)

    if (!code) {
      setError(true)
      return
    }

    const controller = new AbortController()
    onCleanup(() => controller.abort())

    fetch(url, { signal: controller.signal })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load flag: ${response.statusText}`)
        }
        return response.text()
      })
      .then(svg => {
        if (controller.signal.aborted) return
        setSvgContent(sanitizeSvg(svg))
      })
      .catch(err => {
        if (controller.signal.aborted) return
        console.warn(`Failed to load flag for country code: ${code}`, err)
        setError(true)
      })
  })

  const svgProps = (): JSX.SvgSVGAttributes<SVGSVGElement> => ({
    ...rest,
    viewBox: '0 0 512 512',
    width: local.width,
    height: local.height,
    class: joinClass(local.class, local.className),
    style: local.style,
    role: 'img',
    'aria-label': defaultTitle(),
  })

  return (
    <Switch
      fallback={
        <svg {...svgProps()}>
          <title>{defaultTitle()}</title>
          <circle cx="256" cy="256" r="256" fill="#f5f5f5" />
          <circle cx="256" cy="256" r="200" fill="#e0e0e0" class="animate-pulse" />
        </svg>
      }
    >
      <Match when={svgContent()}>
        {content => (
          <div
            {...(rest as unknown as JSX.HTMLAttributes<HTMLDivElement>)}
            class={joinClass(local.class, local.className)}
            style={mergeStyle(
              {
                width: toCssSize(local.width),
                height: toCssSize(local.height),
                display: 'inline-block',
              },
              local.style
            )}
            role="img"
            aria-label={defaultTitle()}
            innerHTML={content().replace(/<svg([^>]*)>/, '<svg$1 width="100%" height="100%">')}
          />
        )}
      </Match>
      <Match when={error()}>
        <svg {...svgProps()}>
          <title>{defaultTitle()}</title>
          <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
          <circle cx="256" cy="256" r="200" fill="#e0e0e0" />
          <text x="256" y="280" text-anchor="middle" font-size="80" font-weight="bold" fill="#666">
            {upperCode()}
          </text>
        </svg>
      </Match>
    </Switch>
  )
}

export type CountryCode = FlagCode

type DynamicFlagPropsBase = Omit<
  JSX.SvgSVGAttributes<SVGSVGElement>,
  'width' | 'height' | 'title'
> &
  FlagComponentProps & {
    title?: string
  }

export type DynamicFlagProps =
  | (DynamicFlagPropsBase & { strict?: false; code: string })
  | (DynamicFlagPropsBase & { strict: true; code: CountryCode })

const flagComponents = AllFlags as unknown as Record<string, Component<DynamicFlagPropsBase>>

export const DynamicFlag: Component<DynamicFlagProps> = props => {
  const merged = mergeProps(
    {
      width: 48,
      height: 48,
    },
    props
  )

  const [local, rest] = splitProps(merged, ['code', 'strict', 'width', 'height', 'title'])

  const normalizedInput = () => local.code.trim().toLowerCase()
  const resolvedCode = () => coerceFlagCode(local.code, 'xx')
  const isFallback = () => resolvedCode() === 'xx' && normalizedInput() !== 'xx'
  const fallbackTitle = () => {
    if (!isFallback()) return local.title
    const upperCode = local.code.trim().toUpperCase()
    return local.title ?? (upperCode.length > 0 ? upperCode : 'XX')
  }

  const componentName = () => FLAG_REGISTRY[resolvedCode()]

  return (
    <Show
      when={!isFallback()}
      fallback={
        <AllFlags.FlagXx
          {...rest}
          width={local.width}
          height={local.height}
          title={fallbackTitle()}
        />
      }
    >
      {(() => {
        const FlagComponent = flagComponents[componentName()!]
        if (!FlagComponent) {
          console.error(`Flag component not found for code: ${local.code}`)
          return <div>Flag not found: {local.code}</div>
        }
        return (
          <FlagComponent {...rest} width={local.width} height={local.height} title={local.title} />
        )
      })()}
    </Show>
  )
}

export * from '../generated/flags'

export { FLAG_REGISTRY, coerceFlagCode, isFlagCode, type FlagCode } from '@sankyu/circle-flags-core'
