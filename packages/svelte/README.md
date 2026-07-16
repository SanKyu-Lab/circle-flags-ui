<div align="center">
  <a href="https://react-circle-flags.js.org/">
    <img src="https://raw.githubusercontent.com/SanKyu-Lab/circle-flags-ui/main/.github/assets/favicon.svg" alt="@sankyu/svelte-circle-flags" width="120" height="120" />
  </a>
</div>

<div align="center">

# @sankyu/svelte-circle-flags

[![npm version](https://img.shields.io/npm/v/%40sankyu%2Fsvelte-circle-flags?style=flat-square&label=%40sankyu%2Fsvelte-circle-flags)](https://www.npmjs.com/package/@sankyu/svelte-circle-flags) [![Bundle Size](https://img.shields.io/bundlephobia/minzip/@sankyu/svelte-circle-flags?style=flat-square&label=Bundle%20Size)](https://bundlephobia.com/package/@sankyu/svelte-circle-flags) [![npm downloads](https://img.shields.io/npm/dm/@sankyu/svelte-circle-flags.svg?style=flat-square&label=NPM%20Downloads)](https://www.npmjs.com/package/@sankyu/svelte-circle-flags) [![Last Commit](https://img.shields.io/github/last-commit/SanKyu-Lab/circle-flags-ui?style=flat-square&label=Last%20Commit)](https://github.com/SanKyu-Lab/circle-flags-ui/commits/main)

<!-- CI/CD & Quality -->

[![CI](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/ci.yml) [![Release](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/release.yml/badge.svg)](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/release.yml) [![codecov](https://codecov.io/gh/SanKyu-Lab/circle-flags-ui/branch/main/graph/badge.svg)](https://codecov.io/gh/SanKyu-Lab/circle-flags-ui)

[![TypeScript supported](https://img.shields.io/badge/TypeScript-supported-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![Tree-shakable](https://badgen.net/bundlephobia/tree-shaking/@sankyu/svelte-circle-flags)](https://bundlephobia.com/package/@sankyu/svelte-circle-flags) [![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square&logo=opensourceinitiative)](./LICENSE)

---

:star: **Star us on [GitHub](https://github.com/Sankyu-Lab/circle-flags-ui)** | :bug: **Report Issues [here](https://github.com/Sankyu-Lab/circle-flags-ui/issues)**

:rocket: **Explore the [Demo Gallery](https://react-circle-flags.js.org/browse)** | :book: **Read the [Documentation](https://react-circle-flags.js.org/docs/guides/getting-started/)**

</div>

---

> [!NOTE]
> 🚧 **Beta Release**
>
> This package is currently in beta. APIs may change in future releases. Please report any issues you encounter!

## 📖 Overview

This library provides **400+ circular SVG flag components** for **Svelte 5** with **Full-TypeScript support** & **Tree-shaking Optimization**.

Perfect for applications that need fast, crisp country flags without external image requests.

## :world_map: Live Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/SanKyu-Lab/circle-flags-ui/tree/main/examples/example-svelte?file=src%2FApp.svelte&terminal=dev)

## ✨ Key Features

- 🎯 **Tree-shakable** - Only bundle the flags you use
- 📦 **TypeScript** - Full type definitions included
- ⚡ **Lightweight shared core** - Only Svelte 5 is required as a peer dependency
- 🎨 **Inline SVG** - No external requests, works offline
- 🔧 **Fully customizable** - All standard SVG props supported
- 📱 **Vite 8 compatible** - Verified against the latest client-side Svelte toolchain
- 🪶 **Lightweight** - Each flag is ~1KB

## 📦 Installation

```bash
npm install @sankyu/svelte-circle-flags
# or
pnpm add @sankyu/svelte-circle-flags
# or
yarn add @sankyu/svelte-circle-flags
# or
bun add @sankyu/svelte-circle-flags
```

> [!TIP]
> For more information, you may refer to the [Installation Guide](https://react-circle-flags.js.org/docs/guides/getting-started/installation/).

### Peer dependency

```bash
npm install svelte@^5.0.0
```

### 🤖 Are you Vibe Coding?

Copy this into your AI Agent (Claude Code, Codex, Cursor ..like) to optimize your flags:

<details>
<summary>AI Agent Prompts</summary>

```txt
Act as an expert Web Engineer. Reference: https://react-circle-flags.js.org/llms.txt & https://react-circle-flags.js.org/llms-small.txt

1. **Audit my project** to find any flag usage:
   - Raw `<img>` tags pointing to `HatScripts/circle-flags` URLs.
   - Legacy `react-circle-flags` library usage.
2. **Propose a migration** to the appropriate `@sankyu/{framework}-circle-flags` package based on my current framework (React/Vue/Solid/Svelte).
3. **Optimize for Tree-shaking**: Replace generic `CircleFlag` components or raw tags with **named imports** (e.g., `import { FlagUs } from '...'`) as per the docs.
```

</details>

## 🚀 Usage

### Import individual flags (Recommended)

```svelte
<script>
  import { FlagUs, FlagCn, FlagGb } from '@sankyu/svelte-circle-flags'
</script>

<div>
  <FlagUs width={48} height={48} />
  <FlagCn width={48} height={48} />
  <FlagGb width={48} height={48} />
</div>
```

### Using `FlagSizes` presets

```svelte
<script>
  import { FlagJp, FlagDe, FlagFr, FlagSizes } from '@sankyu/svelte-circle-flags'
</script>

<div>
  <FlagJp width={FlagSizes.sm} height={FlagSizes.sm} />
  <!-- 24px -->
  <FlagDe width={FlagSizes.md} height={FlagSizes.md} />
  <!-- 32px -->
  <FlagFr width={FlagSizes.lg} height={FlagSizes.lg} />
  <!-- 48px -->
</div>
```

### Dynamic flag selection

```svelte
<script>
  import { DynamicFlag } from '@sankyu/svelte-circle-flags'

  let countryCode = $state('us')
</script>

<select bind:value={countryCode}>
  <option value="us">United States</option>
  <option value="cn">China</option>
  <option value="gb">United Kingdom</option>
</select>

<DynamicFlag code={countryCode} width={48} height={48} />
```

> [!CAUTION]
> `DynamicFlag` is offline-first and renders runtime codes synchronously, but it bundles all
> 400+ flags (~600 KB, no tree-shaking). Prefer named imports when possible. If runtime codes
> are bounded, use a finite named-import map.

### Deep imports

You can also import individual flags directly. This is useful for dynamic imports or when you want to avoid loading the full index:

```svelte
<script>
  import FlagUs from '@sankyu/svelte-circle-flags/flags/us'
</script>

<FlagUs width={48} height={48} />
```

## ⚠️ Deprecated: `CircleFlag`

`CircleFlag` is deprecated and is **not recommended for new code**.

- It fetches SVG at runtime (not offline-first).
- After loading, it renders a wrapper with injected SVG HTML, so many SVG-only props won’t apply.

Prefer named imports or `DynamicFlag` instead.

## 📚 API

### Props

| Prop        | Type               | Default | Description                   |
| ----------- | ------------------ | ------- | ----------------------------- |
| `width`     | `number \| string` | `48`    | Width of the flag             |
| `height`    | `number \| string` | `48`    | Height of the flag            |
| `title`     | `string`           | code    | Accessible title for the SVG  |
| `class`     | `string`           | -       | Standard Svelte class binding |
| `className` | `string`           | -       | Optional className alias      |

### Size Presets

| Size   | Pixels |
| ------ | ------ |
| `xs`   | 16px   |
| `sm`   | 24px   |
| `md`   | 32px   |
| `lg`   | 48px   |
| `xl`   | 64px   |
| `xxl`  | 96px   |
| `xxxl` | 128px  |

### Build Meta Information

You can access the library's build meta information from the `buildMeta` export:

```svelte
<script>
  import { buildMeta } from '@sankyu/svelte-circle-flags'

  console.log(buildMeta.version) // e.g., "0.0.1-beta.1"
  console.log(buildMeta.builtTimestamp) // e.g., 1760000000000
  console.log(buildMeta.commitHash) // e.g., <example-sha256-hash>
  console.log(buildMeta.circleFlagsCommitHash) // e.g., <example-sha256-hash>
</script>
```

### Available Flags

Each flag is exported with the pattern `Flag{PascalCase ISO_CODE}` (for example, `FlagUs`, `FlagCn`). Convenience aliases are provided for common two-letter codes: `FlagUs`, `FlagCn`, `FlagGb`, `FlagJp`.

- `FlagUs` - United States
- `FlagCn` - China
- `FlagGb` - United Kingdom
- `FlagJp` - Japan
- ... and many more

See the [Full list of flags](https://react-circle-flags.js.org/browse) in the gallery.

## 🎨 Styling

Flag components accept all standard SVG attributes and can be styled using Svelte's class binding.

```svelte
<script>
  import { FlagUs } from '@sankyu/svelte-circle-flags'
</script>

<!-- Using class -->
<FlagUs class="rounded-full shadow-lg hover:scale-110 transition-transform" />

<!-- Using inline styles -->
<FlagUs style="filter: grayscale(100%)" />

<!-- With custom attributes -->
<FlagUs aria-label="United States flag" role="img" />
```

## 🔧 TypeScript

All flag components are fully typed with TypeScript, providing autocomplete and type safety out of the box.

```typescript
import type { FlagComponentProps, FlagCode } from '@sankyu/svelte-circle-flags'

// FlagCode is a union type of all valid flag codes
const code: FlagCode = 'us' // ✓ Valid
const invalid: FlagCode = 'xyz' // ✗ Type error
```

## 📦 Bundle Size & Tree-shaking

`@sankyu/svelte-circle-flags` is designed to be tree-shakable.

Importing individual flags ensures that only the used flags are included in your bundle.

```svelte
<script>
  // ✓ Good - only FlagUs and FlagCn are bundled
  import { FlagUs, FlagCn } from '@sankyu/svelte-circle-flags'
</script>
```

## 🤝 Contributing

Please see [CONTRIBUTING.md](https://github.com/Sankyu-Lab/circle-flags-ui/blob/main/CONTRIBUTING.md) for contribution guidelines.

## 📄 License

`@sankyu/svelte-circle-flags` is licensed under the MIT License, © [Sankyu Lab](https://github.com/Sankyu-Lab)

## 🙏 Credits

- Flag designs from [HatScripts/circle-flags](https://github.com/HatScripts/circle-flags)
- Built with [@sveltejs/package](https://github.com/sveltejs/package)
