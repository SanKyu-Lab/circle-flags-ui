import { getCountryName } from './names.mjs'
import { codeToComponentName, codeToEmoji } from './utils.mjs'

/**
 * Build the alias components for one alias flag code, such as `ac` for `sh-ac`.
 *
 * An alias renders its target flag and reuses the target's SVG module, so the artwork is
 * bundled once. Only the default `title` (and with it `aria-label`) changes: it is the alias
 * code in upper case, so `FlagAc` announces "AC" rather than "SH-AC".
 */
export function aliasComponents(code, targetCode) {
  const componentName = codeToComponentName(code)
  const targetName = codeToComponentName(targetCode)
  const title = `'${code.toUpperCase()}'`
  const description = `${codeToEmoji(code)} *${getCountryName(code)}* flag component. Renders the artwork of \`${targetName}\`.`

  const react = `import type { ReactElement, SVGProps } from 'react'
import type { FlagComponentProps } from '@sankyu/circle-flags-core'
import { ${targetName} } from './${targetCode}'

/**
 * ${description}
 *
 * @example
 * <${componentName} width={64} height={64} className="flag-icon" />
 */
export const ${componentName} = ({
  title = ${title},
  ...props
}: SVGProps<SVGSVGElement> & FlagComponentProps): ReactElement => (
  <${targetName} title={title} {...props} />
)
`

  const vue = `import { defineComponent, h } from 'vue'
import type { PropType, VNode } from 'vue'
import { ${targetName} } from './${targetCode}'

/**
 * ${description}
 *
 * @example
 * <${componentName} :width="64" :height="64" class="flag-icon" />
 */
export const ${componentName} = defineComponent({
  name: '${componentName}',
  inheritAttrs: false,
  props: {
    width: { type: [Number, String] as PropType<number | string>, default: 48 },
    height: { type: [Number, String] as PropType<number | string>, default: 48 },
    className: { type: String, default: undefined },
    title: { type: String, default: ${title} },
  },
  setup(props, { attrs }): () => VNode {
    return () => h(${targetName}, { ...attrs, ...props })
  },
})
`

  const solid = `import { mergeProps } from 'solid-js'
import type { Component } from 'solid-js'
import { ${targetName} } from './${targetCode}'
import type { ${targetName}Props } from './${targetCode}'

export type ${componentName}Props = ${targetName}Props

/**
 * ${description}
 *
 * @example
 * <${componentName} width={64} height={64} class="flag-icon" />
 */
export const ${componentName}: Component<${componentName}Props> = props => (
  <${targetName} {...mergeProps({ title: ${title} }, props)} />
)
`

  const svelte = `<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import ${targetName} from './${targetCode}.svelte'

  /**
   * ${description}
   *
   * @example
   * <${componentName} width={64} height={64} class="flag-icon" />
   */
  let { title = ${title}, ...rest }: ComponentProps<typeof ${targetName}> = $props()
</script>

<${targetName} {title} {...rest} />
`

  return { react, vue, solid, svelte }
}
