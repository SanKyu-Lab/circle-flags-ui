import { getCountryName } from './names'
import { codeToComponentName, codeToEmoji } from './utils'

/**
 * Convert SVG string to React component string
 */
export function svgToReactComponent(
  svg: string,
  code: string
): { componentCode: string; svgSize: number; optimizedSize: number } {
  const svgSize = svg.length

  // No optimization needed - upstream circle-flags SVGs are already optimized
  let processedSvg = svg
  const optimizedSize = processedSvg.length

  // Remove XML declaration if present
  processedSvg = processedSvg.replace(/<\?xml.*?\?>\s*/g, '')

  // Replace common SVG attributes with React equivalents
  processedSvg = processedSvg
    .replace(/fill-rule/g, 'fillRule')
    .replace(/clip-rule/g, 'clipRule')
    .replace(/stroke-width/g, 'strokeWidth')
    .replace(/stroke-linecap/g, 'strokeLinecap')
    .replace(/stroke-linejoin/g, 'strokeLinejoin')
    // Convert SVG class attribute to React className
    .replace(/\bclass=/g, 'className=')

  // Extract viewBox and other attributes
  const viewBoxMatch = processedSvg.match(/viewBox="([^"]+)"/)
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 512 512'

  // Extract any existing title for accessibility
  const titleMatch = processedSvg.match(/<title[^>]*>([^<]*)<\/title>/)
  const existingTitle = titleMatch ? titleMatch[1] : null

  // Extract the inner content (everything between <svg> tags)
  let innerContent = processedSvg
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim()

  // Remove existing title to avoid duplication
  innerContent = innerContent.replace(/<title[^>]*>[^<]*<\/title>/, '').trim()

  const componentName = codeToComponentName(code)
  const countryName = getCountryName(code)
  const emoji = codeToEmoji(code)
  const upperCode = code.toUpperCase()

  return {
    componentCode: `import type { ReactElement, SVGProps } from 'react'
import type { FlagComponentProps } from '@sankyu/circle-flags-core'

/**
 * ${emoji} *${countryName}* flag component
 *
 * @example
 * <${componentName} width={64} height={64} className="flag-icon" />
 *
 * @param props - Standard SVG props (extends FlagComponentProps)
 * @returns React component
 */
export const ${componentName} = ({
  width = 48,
  height = 48,
  className,
  title = ${existingTitle ? `'${existingTitle}'` : `'${upperCode}'`},
  ...props
}: SVGProps<SVGSVGElement> & FlagComponentProps): ReactElement => (
  <svg
    viewBox="${viewBox}"
    width={width}
    height={height}
    className={className}
    role="img"
    aria-label={title}
    {...props}
  >
    <title>{title}</title>
${innerContent
  .split('\n')
  .map(line => `    ${line}`)
  .join('\n')}
  </svg>
)
`,
    svgSize,
    optimizedSize,
  }
}

/**
 * Convert SVG string to Vue 3 component string (render function, no SFC)
 *
 * Strategy:
 * - Keep SVG inner markup as a constant string
 * - Use `innerHTML` on the <svg> to avoid generating thousands of VNode calls
 * - Escape user-provided title to avoid injection via <title>
 */
export function svgToVueComponent(
  svg: string,
  code: string
): { componentCode: string; svgSize: number; optimizedSize: number } {
  const svgSize = svg.length

  // No optimization needed - upstream circle-flags SVGs are already optimized
  let processedSvg = svg
  const optimizedSize = processedSvg.length

  // Remove XML declaration if present
  processedSvg = processedSvg.replace(/<\?xml.*?\?>\s*/g, '')

  // Extract viewBox and other attributes
  const viewBoxMatch = processedSvg.match(/viewBox="([^"]+)"/)
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 512 512'

  // Extract any existing title for accessibility
  const titleMatch = processedSvg.match(/<title[^>]*>([^<]*)<\/title>/)
  const existingTitle = titleMatch ? titleMatch[1] : null

  // Extract the inner content (everything between <svg> tags)
  let innerContent = processedSvg
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim()

  // Remove existing title to avoid duplication
  innerContent = innerContent.replace(/<title[^>]*>[^<]*<\/title>/, '').trim()

  const componentName = codeToComponentName(code)
  const countryName = getCountryName(code)
  const emoji = codeToEmoji(code)
  const upperCode = code.toUpperCase()

  const innerStringLiteral = JSON.stringify(innerContent)

  return {
    componentCode: `import { defineComponent, h } from 'vue'
import type { PropType, VNode } from 'vue'
import type { FlagComponentProps } from '@sankyu/circle-flags-core'
import { escapeHtml } from '../../src/internal/escape-html'

/**
 * ${emoji} *${countryName}* flag component
 *
 * @example
 * <${componentName} :width="64" :height="64" class="flag-icon" />
 */
const SVG_BODY: string = ${innerStringLiteral}

export const ${componentName} = defineComponent({
  name: '${componentName}',
  inheritAttrs: false,
  props: {
    width: { type: [Number, String] as PropType<number | string>, default: 48 },
    height: { type: [Number, String] as PropType<number | string>, default: 48 },
    className: { type: String, default: undefined },
    title: { type: String, default: ${existingTitle ? `'${existingTitle}'` : `'${upperCode}'`} },
  },
  setup(props, { attrs }): () => VNode {
    return () => {
      const attrsAny = attrs as Record<string, unknown>
      const { class: cls, style, ...rest } = attrsAny

      return h('svg', {
        ...rest,
        viewBox: '${viewBox}',
        width: props.width,
        height: props.height,
        class: [props.className, cls],
        style,
        role: 'img',
        'aria-label': props.title,
        innerHTML: '<title>' + escapeHtml(props.title) + '</title>' + SVG_BODY,
      })
    }
  },
})
`,
    svgSize,
    optimizedSize,
  }
}

/**
 * Convert SVG string to Solid.js component string
 *
 * Strategy:
 * - Use Solid's JSX with innerHTML for efficient rendering
 * - Keep SVG inner markup as a constant string
 * - Escape user-provided title to avoid injection
 */
export function svgToSolidComponent(
  svg: string,
  code: string
): { componentCode: string; svgSize: number; optimizedSize: number } {
  const svgSize = svg.length

  // No optimization needed - upstream circle-flags SVGs are already optimized
  let processedSvg = svg
  const optimizedSize = processedSvg.length

  // Remove XML declaration if present
  processedSvg = processedSvg.replace(/<\?xml.*?\?>\s*/g, '')

  // Extract viewBox and other attributes
  const viewBoxMatch = processedSvg.match(/viewBox="([^"]+)"/)
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 512 512'

  // Extract any existing title for accessibility
  const titleMatch = processedSvg.match(/<title[^>]*>([^<]*)<\/title>/)
  const existingTitle = titleMatch ? titleMatch[1] : null

  // Extract the inner content (everything between <svg> tags)
  let innerContent = processedSvg
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim()

  // Remove existing title to avoid duplication
  innerContent = innerContent.replace(/<title[^>]*>[^<]*<\/title>/, '').trim()

  const componentName = codeToComponentName(code)
  const countryName = getCountryName(code)
  const emoji = codeToEmoji(code)
  const upperCode = code.toUpperCase()

  const innerStringLiteral = JSON.stringify(innerContent)

  return {
    componentCode: `import { mergeProps, splitProps } from 'solid-js'
import type { Component, JSX } from 'solid-js'
import type { FlagComponentProps } from '@sankyu/circle-flags-core'
import { escapeHtml } from '../../src/internal/escape-html'

/**
 * ${emoji} *${countryName}* flag component
 *
 * @example
 * <${componentName} width={64} height={64} class="flag-icon" />
 */
const SVG_BODY: string = ${innerStringLiteral}

export interface ${componentName}Props extends Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'width' | 'height'>, FlagComponentProps {
  width?: number | string
  height?: number | string
}

export const ${componentName}: Component<${componentName}Props> = (props) => {
  const merged = mergeProps(
    {
      width: 48,
      height: 48,
      title: ${existingTitle ? `'${existingTitle}'` : `'${upperCode}'`},
    },
    props
  )

  const [local, rest] = splitProps(merged, ['width', 'height', 'class', 'className', 'title'])

  return (
    <svg
      {...rest}
      viewBox="${viewBox}"
      width={local.width}
      height={local.height}
      class={local.class || local.className}
      role="img"
      aria-label={local.title}
      innerHTML={'<title>' + escapeHtml(local.title) + '</title>' + SVG_BODY}
    />
  )
}
`,
    svgSize,
    optimizedSize,
  }
}
