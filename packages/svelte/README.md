# @sankyu/svelte-circle-flags

400+ circular SVG Svelte flags — tree-shakeable, TypeScript-ready, SSR-compatible, zero deps.

## Installation

```bash
npm install @sankyu/svelte-circle-flags
```

## Usage

```svelte
<script>
  import { FlagUs } from '@sankyu/svelte-circle-flags'
</script>

<FlagUs width={64} height={64} class="flag-icon" />
```

## Dynamic flag

```svelte
<script>
  import { DynamicFlag } from '@sankyu/svelte-circle-flags'
</script>

<DynamicFlag code="us" />
```

## License

MIT
