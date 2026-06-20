# @sankyu/svelte-circle-flags

> **Beta release** — APIs may evolve until v1.0.0.

400+ circular SVG Svelte flags — tree-shakeable, TypeScript-ready, SSR-compatible, zero deps.

## Installation

```bash
npm install @sankyu/svelte-circle-flags
# or
pnpm add @sankyu/svelte-circle-flags
# or
yarn add @sankyu/svelte-circle-flags
```

`@sankyu/svelte-circle-flags` has a single peer dependency:

```bash
npm install svelte@^5.0.0
```

## Usage

Import named flag components directly. Only the flags you import are bundled.

```svelte
<script>
  import { FlagUs, FlagCn, FlagGb } from '@sankyu/svelte-circle-flags'
</script>

<FlagUs width={64} height={64} class="flag-icon" />
<FlagCn width={64} height={64} className="flag-icon" />
<FlagGb width={64} height={64} />
```

### Deep imports

You can also import individual flags directly. This is useful for dynamic imports or when you want to avoid loading the full index:

```svelte
<script>
  import FlagUs from '@sankyu/svelte-circle-flags/flags/us'
</script>

<FlagUs width={64} height={64} />
```

## Dynamic flag

Use `DynamicFlag` when the country code is only known at runtime:

```svelte
<script>
  import { DynamicFlag } from '@sankyu/svelte-circle-flags'

  let code = $state('us')
</script>

<select bind:value={code}>
  <option value="us">United States</option>
  <option value="cn">China</option>
  <option value="gb">United Kingdom</option>
</select>

<DynamicFlag {code} width={64} height={64} />
```

`DynamicFlag` accepts a `strict` prop. When `strict={true}`, invalid codes render a fallback `FlagXx` placeholder instead of attempting coercion.

## CircleFlag (deprecated)

`CircleFlag` fetches SVG from a CDN at runtime. It is kept for compatibility but is **not recommended for new code**.

```svelte
<script>
  import { CircleFlag } from '@sankyu/svelte-circle-flags'
</script>

<CircleFlag countryCode="us" width={64} height={64} />
```

Prefer named imports or `DynamicFlag` for better tree-shaking and offline support.

## Props

All flag components accept standard SVG attributes plus:

| Prop        | Type               | Default | Description                                |
| ----------- | ------------------ | ------- | ------------------------------------------ |
| `width`     | `number \| string` | `48`    | Rendered width                             |
| `height`    | `number \| string` | `48`    | Rendered height                            |
| `class`     | `string`           | —       | CSS class (Svelte convention)              |
| `className` | `string`           | —       | CSS class alias for cross-framework habits |
| `title`     | `string`           | code    | Accessible `<title>` text                  |

## Utilities

```svelte
<script>
  import { FLAG_REGISTRY, FlagUtils } from '@sankyu/svelte-circle-flags'

  const isValid = FlagUtils.isValidCountryCode('us')
  const allCodes = Object.keys(FLAG_REGISTRY)
</script>
```

## TypeScript

`FlagCode` and `CountryCode` are exported from the core registry:

```ts
import type { FlagCode, CountryCode } from '@sankyu/svelte-circle-flags'
```

## SSR

This package ships preprocessed `.svelte` source files and is fully compatible with SvelteKit and other server-side rendering setups.

## License

MIT © [Sankyu Lab](https://github.com/SanKyu-Lab)
