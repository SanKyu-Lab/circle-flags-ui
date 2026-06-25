<script lang="ts">
  interface Props {
    href: string
    className?: string
    children?: import('svelte').Snippet
  }

  let { href, className = '', children }: Props = $props()
</script>

<a
  {href}
  target="_blank"
  rel="noreferrer"
  class="font-medium text-indigo-500 no-underline hover:text-indigo-600 hover:underline {className}"
>
  {@render children?.()}
</a>
