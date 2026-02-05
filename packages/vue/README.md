<div align="center">
  <a href="https://react-circle-flags.js.org/">
    <img src="https://raw.githubusercontent.com/SanKyu-Lab/circle-flags-ui/main/.github/assets/favicon.svg" alt="@sankyu/vue-circle-flags" width="120" height="120" />
  </a>
</div>

<div align="center">

# @sankyu/vue-circle-flags

[![npm version](https://img.shields.io/npm/v/%40sankyu%2Fvue-circle-flags?style=flat-square&label=%40sankyu%2Fvue-circle-flags)](https://www.npmjs.com/package/@sankyu/vue-circle-flags) [![Bundle Size](https://img.shields.io/bundlephobia/minzip/@sankyu/vue-circle-flags?style=flat-square&label=Bundle%20Size)](https://bundlephobia.com/package/@sankyu/vue-circle-flags) [![npm downloads](https://img.shields.io/npm/dm/@sankyu/vue-circle-flags.svg?style=flat-square&label=NPM%20Downloads)](https://www.npmjs.com/package/@sankyu/vue-circle-flags) [![Last Commit](https://img.shields.io/github/last-commit/SanKyu-Lab/circle-flags-ui?style=flat-square&label=Last%20Commit)](https://github.com/SanKyu-Lab/circle-flags-ui/commits/main)

<!-- CI/CD & Quality -->

[![CI](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/ci.yml) [![Release](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/release.yml/badge.svg)](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/release.yml) [![codecov](https://codecov.io/gh/SanKyu-Lab/circle-flags-ui/branch/main/graph/badge.svg)](https://codecov.io/gh/SanKyu-Lab/circle-flags-ui)

[![TypeScript supported](https://img.shields.io/badge/TypeScript-supported-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![Tree-shakable](https://badgen.net/bundlephobia/tree-shaking/@sankyu/vue-circle-flags)](https://bundlephobia.com/package/@sankyu/vue-circle-flags) [![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square&logo=opensourceinitiative)](./LICENSE)

---

English Version | [简体中文](./README.zh.md)

:star: **Star us on [GitHub](https://github.com/Sankyu-Lab/circle-flags-ui)** | :bug: **Report Issues [here](https://github.com/Sankyu-Lab/circle-flags-ui/issues)**

:rocket: **Explore the [Demo Gallery](https://react-circle-flags.js.org/browse)** | :book: **Read the [Documentation](https://react-circle-flags.js.org/docs/guides/getting-started/)**

</div>

---

> [!NOTE]
> 🚧 **Beta Release**
>
> This package is currently in beta. APIs may change in future releases. Please report any issues you encounter!

## 📖 Overview

This library provides **400+ circular SVG flag components** for Vue 3 with **Full-TypeScript support** & **Tree-shaking Optimization**.

Perfect for applications that need fast, crisp country flags without external image requests.

## ✨ Key Features

> [!TIP]
> For more information, you may refer to the [Documentation](https://react-circle-flags.js.org/docs/guides/getting-started/#-key-features).

- 🎯 **Tree-shakable** - Only bundle the flags you use
- 📦 **TypeScript** - Full type definitions included
- ⚡ **Zero dependencies** - Only requires Vue 3 as peer dependency
- 🎨 **Inline SVG** - No external requests, works offline
- 🔧 **Fully customizable** - All standard SVG props supported
- 📱 **SSR compatible** - Works with `Nuxt.js`, `Quasar`, etc.
- 🪶 **Lightweight** - Each flag is ~1KB

## 📦 Installation

```bash
npm install @sankyu/vue-circle-flags
# or
pnpm add @sankyu/vue-circle-flags
# or
yarn add @sankyu/vue-circle-flags
# or
bun add @sankyu/vue-circle-flags
```

> [!TIP]
> For more information, you may refer to the [Installation Guide](https://react-circle-flags.js.org/docs/guides/getting-started/installation/).

### 🤖 Are you Vibe Coding?

Copy this into your AI Agent (Claude Code, Codex, Cursor ..like) to optimize your flags:

<details>
<summary>AI Agent Prompts</summary>

```txt
Act as an expert Web Engineer. Reference: https://react-circle-flags.js.org/llms.txt & https://react-circle-flags.js.org/llms-small.txt

1. **Audit my project** to find any flag usage:
   - Raw `<img>` tags pointing to `HatScripts/circle-flags` URLs.
   - Legacy `react-circle-flags` library usage.
2. **Propose a migration** to the appropriate `@sankyu/{framework}-circle-flags` package based on my current framework (React/Vue/Solid).
3. **Optimize for Tree-shaking**: Replace generic `CircleFlag` components or raw tags with **named imports** (e.g., `import { Us } from '...'`) as per the docs.
```

</details>

## 🚀 Usage

### Import individual flags (Recommended)

```vue
<script setup lang="ts">
import { FlagUs, FlagCn, FlagGb } from '@sankyu/vue-circle-flags'
</script>

<template>
  <div>
    <FlagUs :width="48" :height="48" />
    <FlagCn :width="48" :height="48" />
    <FlagGb :width="48" :height="48" />
  </div>
</template>
```

### Using `FlagSizes` presets

```vue
<script setup lang="ts">
import { FlagJp, FlagDe, FlagFr, FlagSizes } from '@sankyu/vue-circle-flags'
</script>

<template>
  <div>
    <FlagJp :width="FlagSizes.sm" :height="FlagSizes.sm" />
    <!-- 24px -->
    <FlagDe :width="FlagSizes.md" :height="FlagSizes.md" />
    <!-- 32px -->
    <FlagFr :width="FlagSizes.lg" :height="FlagSizes.lg" />
    <!-- 48px -->
  </div>
</template>
```

### Dynamic flag selection

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DynamicFlag } from '@sankyu/vue-circle-flags'

const countryCode = ref('us')
</script>

<template>
  <DynamicFlag :code="countryCode" :width="48" :height="48" />
</template>
```

### Other usage examples

> [!TIP]
> For more information, you may refer to the [Usage Guide](https://react-circle-flags.js.org/docs/guides/getting-started/usage/).

## 📚 API

### Props

| Prop        | Type               | Default | Description                  |
| ----------- | ------------------ | ------- | ---------------------------- |
| `width`     | `number \| string` | `48`    | Width of the flag            |
| `height`    | `number \| string` | `48`    | Height of the flag           |
| `title`     | `string`           | code    | Accessible title for the SVG |
| `class`     | `string`           | -       | Standard Vue class binding   |
| `className` | `string`           | -       | Optional className alias     |

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

```vue
<script setup lang="ts">
import { buildMeta } from '@sankyu/vue-circle-flags'

console.log(buildMeta.version) // e.g., "0.0.1"
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

Flag components accept all standard SVG attributes and can be styled using Vue's class and style bindings.

> [!TIP]
> For more information, you may refer to the [Styling Guide](https://react-circle-flags.js.org/docs/guides/getting-started/styling/).

```vue
<script setup lang="ts">
import { FlagUs } from '@sankyu/vue-circle-flags'
</script>

<template>
  <!-- Using class -->
  <FlagUs class="rounded-full shadow-lg hover:scale-110 transition-transform" />

  <!-- Using inline styles -->
  <FlagUs :style="{ filter: 'grayscale(100%)' }" />

  <!-- With custom attributes -->
  <FlagUs aria-label="United States flag" role="img" />
</template>
```

## 🔧 TypeScript

All flag components are fully typed with TypeScript, providing autocomplete and type safety out of the box.

> [!TIP]
> For more information, you may refer to the [TypeScript Guide](https://react-circle-flags.js.org/docs/guides/getting-started/typescript/).

```typescript
import type { FlagComponentProps, FlagCode } from '@sankyu/vue-circle-flags'

// FlagCode is a union type of all valid flag codes
const code: FlagCode = 'us' // ✓ Valid
const invalid: FlagCode = 'xyz' // ✗ Type error
```

## 📦 Bundle Size & Tree-shaking

`@sankyu/vue-circle-flags` is designed to be tree-shakable.

Importing individual flags ensures that only the used flags are included in your bundle.

> [!TIP]
> For more information, you may refer to the [Bundle Size & Tree-shaking Guide](https://react-circle-flags.js.org/docs/guides/getting-started/bundle-size/).

```vue
<script setup lang="ts">
// ✓ Good - only FlagUs and FlagCn are bundled
import { FlagUs, FlagCn } from '@sankyu/vue-circle-flags'
</script>
```

## 🤝 Contributing

Please see [CONTRIBUTING.md](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/CONTRIBUTING.md) for contribution guidelines.

## 📄 License

`@sankyu/vue-circle-flags` is licensed under the MIT License, © [Sankyu Lab](https://github.com/Sankyu-Lab)

## 🙏 Credits

- Flag designs from [HatScripts/circle-flags](https://github.com/HatScripts/circle-flags)
- Built with [tsup](https://github.com/egoist/tsup)
