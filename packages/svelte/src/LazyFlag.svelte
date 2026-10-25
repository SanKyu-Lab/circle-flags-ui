<script lang="ts">
  import type { Component, Snippet } from 'svelte'
  import { coerceFlagCode } from '@sankyu/circle-flags-core'
  import { flagLoaders } from './flags/lazy.js'
  import type { FlagComponentProps } from './types.js'

  /**
   * Lazy-loading flag component for runtime country codes.
   *
   * Renders nothing (or the `fallback` snippet) until the flag's async chunk
   * resolves. Bundlers split one chunk per flag, so only the rendered flags
   * are ever downloaded — unlike `DynamicFlag`, which bundles every flag.
   *
   * Unlike `DynamicFlag` there is no `strict` mode: codes are always coerced
   * and unknown values resolve to the `xx` placeholder chunk.
   *
   * @example
   * <LazyFlag code={countryCode} width={32} height={32} />
   */
  interface Props extends FlagComponentProps {
    code: string
    fallback?: Snippet
  }

  let {
    code,
    width = 48,
    height = 48,
    class: classProp = undefined,
    className: classNameProp = undefined,
    title,
    fallback,
    ...rest
  }: Props = $props()

  const finalClass = $derived(
    classProp && classNameProp ? `${classProp} ${classNameProp}` : (classProp ?? classNameProp)
  )
  const resolvedCode = $derived(coerceFlagCode(code, 'xx'))
  const loadFlag = $derived(flagLoaders[resolvedCode])

  let Flag = $state<Component | undefined>(undefined)

  $effect(() => {
    let cancelled = false
    Flag = undefined
    loadFlag
      ?.()
      .then(module => {
        if (!cancelled) Flag = module.default
      })
      .catch(error => {
        console.error(`LazyFlag: failed to load flag chunk for "${resolvedCode}"`, error)
      })
    return () => {
      cancelled = true
    }
  })
</script>

{#if Flag}
  <Flag {...rest} {width} {height} class={finalClass} {title} />
{:else if fallback}
  {@render fallback()}
{/if}
