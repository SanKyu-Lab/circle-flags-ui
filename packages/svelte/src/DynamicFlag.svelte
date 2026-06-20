<script lang="ts">
  import type { Component } from 'svelte'
  import type { SVGAttributes } from 'svelte/elements'
  import { coerceFlagCode, FLAG_REGISTRY } from '@sankyu/circle-flags-core'
  import * as AllFlags from './flags'

  interface Props extends Omit<SVGAttributes<SVGSVGElement>, 'width' | 'height' | 'title'> {
    code: string
    strict?: boolean
    width?: number | string
    height?: number | string
    className?: string
    title?: string
  }

  let {
    code,
    strict = false,
    width = 48,
    height = 48,
    class: classProp = undefined,
    className: classNameProp = undefined,
    title: titleProp,
    ...rest
  }: Props = $props()

  const finalClass = $derived(classNameProp ?? classProp)

  const normalizedInput = $derived(code.trim().toLowerCase())
  const resolvedCode = $derived(coerceFlagCode(code, 'xx'))
  const isFallback = $derived(resolvedCode === 'xx' && normalizedInput !== 'xx')
  const fallbackTitle = $derived(() => {
    if (!isFallback) return titleProp
    const upperCode = code.trim().toUpperCase()
    return titleProp ?? (upperCode.length > 0 ? upperCode : 'XX')
  })
  const componentName = $derived(FLAG_REGISTRY[resolvedCode])
  const FlagComponent = $derived(
    componentName
      ? ((AllFlags as Record<string, unknown>)[componentName] as Component)
      : undefined
  )
</script>

{#if FlagComponent}
  <FlagComponent {...rest} {width} {height} className={finalClass} title={fallbackTitle()} />
{:else}
  <div>Flag not found: {code}</div>
{/if}
