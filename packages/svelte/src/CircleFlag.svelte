<script lang="ts">
  import { codeToEmoji, sanitizeSvg } from '@sankyu/circle-flags-core'

  /**
   * @deprecated `CircleFlag` is deprecated and not recommended for new code.
   *
   * It fetches SVG at runtime and renders a wrapper with injected SVG HTML, so many SVG-only props won’t apply.
   *
   * Prefer `named imports` or `DynamicFlag` instead.
   *
   * Read more: https://react-circle-flags.js.org/docs/deprecated/circleflag
   */
  interface Props {
    countryCode?: string
    /** @deprecated Use 'countryCode' instead */
    code?: string
    cdnUrl?: string
    width?: number | string
    height?: number | string
    class?: string
    className?: string
    title?: string
  }

  let {
    countryCode,
    code,
    cdnUrl = 'https://hatscripts.github.io/circle-flags/flags/',
    width = 48,
    height = 48,
    class: classProp = undefined,
    className: classNameProp = undefined,
    title: titleProp,
  }: Props = $props()

  const finalCode = $derived((countryCode ?? code ?? '').trim())
  const normalizedCode = $derived(finalCode.toLowerCase())
  const upperCode = $derived(finalCode.toUpperCase())
  const emoji = $derived(codeToEmoji(finalCode))
  const defaultTitle = $derived(`${emoji} ${upperCode}`)
  const title = $derived(titleProp ?? defaultTitle)
  const finalClass = $derived(classNameProp ?? classProp)

  let svgContent = $state<string | null>(null)
  let error = $state(false)
  let loading = $state(true)

  const toCssSize = (value: number | string) => (typeof value === 'number' ? `${value}px` : value)

  $effect(() => {
    if (!finalCode) {
      svgContent = null
      error = true
      loading = false
      return
    }

    loading = true
    error = false
    svgContent = null

    const url = `${cdnUrl.replace(/\/$/, '')}/${normalizedCode}.svg`

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load flag: ${response.statusText}`)
        }
        return response.text()
      })
      .then(svg => {
        svgContent = sanitizeSvg(svg)
        error = false
      })
      .catch(err => {
        console.warn(`Failed to load flag for country code: ${finalCode}`, err)
        svgContent = null
        error = true
      })
      .finally(() => {
        loading = false
      })
  })
</script>

{#if loading}
  <svg
    class={finalClass}
    viewBox="0 0 512 512"
    width={toCssSize(width)}
    height={toCssSize(height)}
    role="img"
    aria-label={title}
  >
    <title>{title}</title>
    <circle cx="256" cy="256" r="256" fill="#f5f5f5" />
    <circle cx="256" cy="256" r="200" fill="#e0e0e0" class="animate-pulse" />
  </svg>
{:else if error || !svgContent}
  <svg
    class={finalClass}
    viewBox="0 0 512 512"
    width={toCssSize(width)}
    height={toCssSize(height)}
    role="img"
    aria-label={title}
  >
    <title>{title}</title>
    <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
    <circle cx="256" cy="256" r="200" fill="#e0e0e0" />
    <text x="256" y="280" text-anchor="middle" font-size="80" font-weight="bold" fill="#666">
      {upperCode}
    </text>
  </svg>
{:else}
  <div
    class={finalClass}
    style:width={toCssSize(width)}
    style:height={toCssSize(height)}
    style:display="inline-block"
    role="img"
    aria-label={title}
  >
    {@html svgContent.replace(/<svg([^>]*)>/, '<svg$1 width="100%" height="100%">')}
  </div>
{/if}
