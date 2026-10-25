<script lang="ts">
  import { DynamicFlag, FlagJp, FlagUs } from '@sankyu/svelte-circle-flags'
  import '../app.css'

  let switchedCode = $state('jp')
</script>

<svelte:head>
  <title>circle-flags-ui SvelteKit SSR example</title>
</svelte:head>

<main data-ssr-example="sveltekit">
  <p class="eyebrow">SvelteKit 3 · Server-side rendering</p>
  <h1>Flags rendered in the first HTML response</h1>
  <p class="intro">
    Named imports and DynamicFlag render on the server and hydrate in the browser. They do not need
    a browser-only guard.
  </p>
  <div class="flag-grid">
    <figure>
      <FlagJp width={72} height={72} title="Japan" />
      <figcaption>Named import: Japan</figcaption>
    </figure>
    <figure>
      <FlagUs width={72} height={72} title="United States" />
      <figcaption>Named import: United States</figcaption>
    </figure>
    <figure>
      <DynamicFlag code="de" width={72} height={72} title="Germany" />
      <figcaption>Runtime code: Germany</figcaption>
    </figure>
  </div>
  <div class="picker">
    <DynamicFlag code={switchedCode} width={48} height={48} data-testid="switched-flag" />
    <button
      type="button"
      data-testid="flag-switch"
      onclick={() => (switchedCode = switchedCode === 'jp' ? 'br' : 'jp')}
    >
      Switch flag after hydration
    </button>
  </div>
</main>
