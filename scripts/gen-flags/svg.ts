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
