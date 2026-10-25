import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Component, PropType, StyleValue, VNode } from 'vue'
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

const toCssSize = (value: number | string | undefined) => {
  if (typeof value === 'number') return `${value}px`
  return value
}

const renderFallbackSvg = (opts: {
  width: number | string
  height: number | string
  title: string
  codeUpper: string
  className?: string
  attrs: Record<string, unknown>
}): VNode => {
  const { class: cls, style, ...rest } = opts.attrs
  return h(
    'svg',
    {
      ...rest,
      viewBox: '0 0 512 512',
      width: opts.width,
      height: opts.height,
      class: [opts.className, cls],
      style,
      role: 'img',
      'aria-label': opts.title,
    },
    [
      h('title', opts.title),
      h('circle', { cx: '256', cy: '256', r: '256', fill: '#f0f0f0' }),
      h('circle', { cx: '256', cy: '256', r: '200', fill: '#e0e0e0' }),
      h(
        'text',
        {
          x: '256',
          y: '280',
          textAnchor: 'middle',
          fontSize: '80',
          fontWeight: 'bold',
          fill: '#666',
        },
        opts.codeUpper
      ),
    ]
  )
}

const renderLoadingSvg = (opts: {
  width: number | string
  height: number | string
  title: string
  className?: string
  attrs: Record<string, unknown>
}): VNode => {
  const { class: cls, style, ...rest } = opts.attrs
  return h(
    'svg',
    {
      ...rest,
      viewBox: '0 0 512 512',
      width: opts.width,
      height: opts.height,
      class: [opts.className, cls],
      style,
      role: 'img',
      'aria-label': opts.title,
    },
    [
      h('title', opts.title),
      h('circle', { cx: '256', cy: '256', r: '256', fill: '#f5f5f5' }),
      h('circle', { cx: '256', cy: '256', r: '200', fill: '#e0e0e0', class: 'animate-pulse' }),
    ]
  )
}

const _CircleFlag = defineComponent({
  name: 'CircleFlag',
  inheritAttrs: false,
  props: {
    countryCode: { type: String, default: undefined },
    code: { type: String, default: undefined },
    cdnUrl: { type: String, default: DEFAULT_CDN_ENDPOINT },
    width: { type: [Number, String] as PropType<number | string>, default: 48 },
    height: { type: [Number, String] as PropType<number | string>, default: 48 },
    title: { type: String, default: undefined },
    className: { type: String, default: undefined },
  },
  setup(props, { attrs }): () => VNode {
    const svgContent = ref<string | null>(null)
    const error = ref(false)
    let currentController: AbortController | null = null

    const finalCountryCode = computed(() => props.countryCode ?? props.code ?? '')
    const normalizedCode = computed(() => finalCountryCode.value.toLowerCase())
    const upperCode = computed(() => finalCountryCode.value.toUpperCase())
    const emoji = computed(() => codeToEmoji(finalCountryCode.value))
    const defaultTitle = computed(() => props.title ?? `${emoji.value} ${upperCode.value}`)

    const load = async () => {
      currentController?.abort()
      currentController = null
      svgContent.value = null
      error.value = false

      if (!finalCountryCode.value) {
        error.value = true
        return
      }

      const controller = new AbortController()
      currentController = controller

      try {
        const url = `${props.cdnUrl.replace(/\/$/, '')}/${normalizedCode.value}.svg`
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Failed to load flag: ${response.statusText}`)
        }

        const svg = await response.text()
        if (controller.signal.aborted) return
        const sanitizedSvg = sanitizeSvg(svg)
        if (!sanitizedSvg) {
          throw new Error('Flag response is not a well-formed SVG')
        }
        svgContent.value = sanitizedSvg
      } catch (err) {
        if (controller.signal.aborted) return
        console.warn(`Failed to load flag for country code: ${finalCountryCode.value}`, err)
        error.value = true
      }
    }

    onMounted(() => {
      void load()
    })

    onBeforeUnmount(() => {
      currentController?.abort()
    })

    watch([() => finalCountryCode.value, () => props.cdnUrl], () => {
      void load()
    })

    return (): VNode => {
      const attrsAny = attrs as Record<string, unknown>

      if (!svgContent.value && !error.value) {
        return renderLoadingSvg({
          width: props.width,
          height: props.height,
          title: defaultTitle.value,
          className: props.className,
          attrs: attrsAny,
        })
      }

      if (error.value || !svgContent.value) {
        return renderFallbackSvg({
          width: props.width,
          height: props.height,
          title: defaultTitle.value,
          codeUpper: upperCode.value,
          className: props.className,
          attrs: attrsAny,
        })
      }

      const svgWithSize = svgContent.value.replace(
        /<svg([^>]*)>/,
        '<svg$1 width="100%" height="100%">'
      )

      const { class: cls, style, ...rest } = attrsAny
      const baseStyle = {
        width: toCssSize(props.width),
        height: toCssSize(props.height),
        display: 'inline-block',
      }

      return h('div', {
        ...rest,
        class: [props.className, cls],
        style: [baseStyle, style as StyleValue],
        innerHTML: svgWithSize,
        role: 'img',
        'aria-label': defaultTitle.value,
      })
    }
  },
})

/**
 * @deprecated `CircleFlag` is deprecated and not recommended for new code.
 *
 * Prefer `named imports` or `DynamicFlag` instead.
 *
 * Read more: https://react-circle-flags.js.org/docs/deprecated/circleflag/
 */
export const CircleFlag: typeof _CircleFlag = _CircleFlag

type DynamicFlagPropsBase = FlagComponentProps & {
  // Explicitly include title to avoid type resolution differences across toolchains (e.g. Astro/TS).
  title?: string
}

export type DynamicFlagProps =
  | (DynamicFlagPropsBase & { strict?: false; code: string })
  | (DynamicFlagPropsBase & { strict: true; code: CountryCode })

export const DynamicFlag = defineComponent(
  (props: DynamicFlagProps, { attrs }): (() => VNode) => {
    const normalizedInput = computed(() => props.code.trim().toLowerCase())
    const resolvedCode = computed(() => coerceFlagCode(props.code, 'xx'))
    const componentName = computed(() => FLAG_REGISTRY[resolvedCode.value])
    const isFallback = computed(() => resolvedCode.value === 'xx' && normalizedInput.value !== 'xx')
    const fallbackTitle = computed(() => {
      if (!isFallback.value) return props.title
      const upperCode = props.code.trim().toUpperCase()
      return props.title ?? (upperCode.length > 0 ? upperCode : 'XX')
    })

    return (): VNode => {
      const attrsAny = attrs as Record<string, unknown>
      const name = componentName.value

      const FlagComponent = (AllFlags as unknown as Record<string, unknown>)[name]

      if (!FlagComponent) {
        console.error(`Flag component not found for code: ${props.code}`)
        return h('div', `Flag not found: ${props.code}`)
      }

      return h(FlagComponent as Component, {
        ...attrsAny,
        width: props.width ?? 48,
        height: props.height ?? 48,
        title: fallbackTitle.value,
        className: props.className,
      })
    }
  },
  {
    name: 'DynamicFlag',
    inheritAttrs: false,
    props: ['code', 'strict', 'width', 'height', 'title', 'className'],
  }
)

export type CountryCode = FlagCode

export * from '../generated/flags'

export { FLAG_REGISTRY, coerceFlagCode, isFlagCode, type FlagCode } from '@sankyu/circle-flags-core'
