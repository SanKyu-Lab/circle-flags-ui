<div align="center">
  <a href="https://react-circle-flags.js.org/">
    <img src="https://raw.githubusercontent.com/SanKyu-Lab/circle-flags-ui/main/.github/assets/favicon.svg" alt="@sankyu/react-circle-flags" width="120" height="120" />
  </a>
</div>

<div align="center">

# @sankyu/react-circle-flags

[![npm version](https://img.shields.io/npm/v/%40sankyu%2Freact-circle-flags?style=flat-square&label=%40sankyu%2Freact-circle-flags)](https://www.npmjs.com/package/@sankyu/react-circle-flags) [![Bundle Size](https://img.shields.io/bundlephobia/minzip/@sankyu/react-circle-flags?style=flat-square&label=Bundle%20Size)](https://bundlephobia.com/package/@sankyu/react-circle-flags) [![npm downloads](https://img.shields.io/npm/dm/@sankyu/react-circle-flags.svg?style=flat-square&label=NPM%20Downloads)](https://www.npmjs.com/package/@sankyu/react-circle-flags) [![Last Commit](https://img.shields.io/github/last-commit/SanKyu-Lab/circle-flags-ui?style=flat-square&label=Last%20Commit)](https://github.com/SanKyu-Lab/circle-flags-ui/commits/main)

<!-- CI/CD & Quality -->

[![CI](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/ci.yml) [![Release](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/release.yml/badge.svg)](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/release.yml) [![codecov](https://codecov.io/gh/SanKyu-Lab/circle-flags-ui/branch/main/graph/badge.svg)](https://codecov.io/gh/SanKyu-Lab/circle-flags-ui)

[![TypeScript supported](https://img.shields.io/badge/TypeScript-supported-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![Tree-shakable](https://badgen.net/bundlephobia/tree-shaking/@sankyu/react-circle-flags)](https://bundlephobia.com/package/@sankyu/react-circle-flags) [![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square&logo=opensourceinitiative)](./LICENSE)

---

English Version | [简体中文](./README.zh.md)

:star: **Star us on [GitHub](https://github.com/Sankyu-Lab/circle-flags-ui)** | :bug: **Report Issues [here](https://github.com/Sankyu-Lab/circle-flags-ui/issues)**

:rocket: **Explore the [Demo Gallery](https://react-circle-flags.js.org/browse)** | :book: **Read the [Documentation](https://react-circle-flags.js.org/docs/guides/getting-started/)**

</div>

---

## 📖 Overview

This library provides **400+ circular SVG flag components** with **Full-TypeScript support** & **Tree-shaking Optimization**.

Perfect for applications that need fast, crisp country flags without external image requests.

## :world_map: Live Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/SanKyu-Lab/circle-flags-ui/tree/main/examples/example-react?file=src%2FApp.tsx&terminal=dev)

## ✨ Key Features

> [!TIP]
> For more information, you may refer to the [Documentation](https://react-circle-flags.js.org/docs/guides/getting-started/#-key-features).

- 🎯 **Tree-shakable** - Only bundle the flags you use
- 📦 **TypeScript** - Full type definitions included
- ⚡ **Zero dependencies** - Only requires React as peer dependency
- 🎨 **Inline SVG** - No external requests, works offline
- 🔧 **Fully customizable** - All standard SVG props supported
- 📱 **SSR compatible** - Works with `Next.js`, `Remix`, etc.
- 🪶 **Lightweight** - Each flag is ~1KB

## 📦 Installation

```bash
npm install @sankyu/react-circle-flags
# or
pnpm add @sankyu/react-circle-flags
# or
yarn add @sankyu/react-circle-flags
# or
bun add @sankyu/react-circle-flags
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

```tsx
import { FlagUs, FlagCn, FlagGb } from '@sankyu/react-circle-flags'

export default function App() {
  return (
    <div>
      <FlagUs width={48} height={48} />
      <FlagCn width={48} height={48} />
      <FlagGb width={48} height={48} />
    </div>
  )
}
```

### Other usage examples

> [!TIP]
> For more information, you may refer to the [Usage Guide](https://react-circle-flags.js.org/docs/guides/getting-started/usage/).

## ⚠️ Deprecated: `<CircleFlag />`

`<CircleFlag />` is deprecated and is **not recommended for new code**.

- It fetches SVG at runtime (not offline-first).
- After loading, it renders a wrapper with injected SVG HTML, so many SVG-only props won’t apply.

See: https://react-circle-flags.js.org/docs/deprecated/circleflag/

## 📚 API

### Build Meta Information

You can access the library's build meta information from the `buildMeta` export:

```tsx
import { buildMeta } from '@sankyu/react-circle-flags'

console.log(buildMeta.version) // e.g., "1.2.3"
console.log(buildMeta.builtTimestamp) // e.g., 1760000000000
console.log(buildMeta.commitHash) // e.g., <example-sha256-hash>
console.log(buildMeta.circleFlagsCommitHash) // e.g., <example-sha256-hash>
```

### Other Props

...For more information, you may refer to the [API Reference](https://react-circle-flags.js.org/reference/api/interfaceflagcomponentprops/).

### Available Flags

Each flag is exported with the pattern `Flag{PascalCase ISO_CODE}` (for example, `FlagUs`, `FlagCn`). Convenience aliases are provided for common two-letter codes: `FlagUs`, `FlagCn`, `FlagGb`, `FlagJp`.

- `FlagUs` - United States
- `FlagCn` - China
- `FlagGb` - United Kingdom
- `FlagJp` - Japan
- ... and many more

See the [Full list of flags](https://react-circle-flags.js.org/browse) in the react-circle-flags gallery.

## 🎨 Styling

Flag components accept all standard SVG props, making them easy to style with any CSS approach.

> [!TIP]
> For more information, you may refer to the [Styling Guide](https://react-circle-flags.js.org/docs/guides/getting-started/styling/).

## 🔧 TypeScript

All flag components are fully typed with TypeScript, providing autocomplete and type safety out of the box.

> [!TIP]
> For more information, you may refer to the [TypeScript Guide](https://react-circle-flags.js.org/docs/guides/getting-started/typescript/).

## 📖 Examples

> [!TIP]
> For more information, you may refer to the [Guide - Basic Usage](https://react-circle-flags.js.org/docs/guides/getting-started/usage/).

## 📦 Bundle Size & Tree-shaking

`@sankyu/react-circle-flags` is designed to be tree-shakable.

Importing individual flags ensures that only the used flags are included in your bundle.

> [!CAUTION]
> `DynamicFlag` is offline-first and renders runtime codes synchronously, but it bundles all
> 400+ flags (~600 KB, no tree-shaking). Prefer named imports when possible. If runtime codes
> are bounded, use a finite named-import map.

> [!TIP]
> For more information, you may refer to the [Bundle Size & Tree-shaking Guide](https://react-circle-flags.js.org/docs/guides/getting-started/bundle-size/).

## 🤝 Contributing

Please see [CONTRIBUTING.md](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/CONTRIBUTING.md) for contribution guidelines.

## 📄 License

`@sankyu/react-circle-flags` is licensed under the MIT License, © [Sankyu Lab](https://github.com/Sankyu-Lab)

[website](./website/) is licensed under the GPL-3.0 License, © [Sankyu Lab](https://github.com/Sankyu-Lab)

## 🙏 Credits

- Flag designs from [HatScripts/circle-flags](https://github.com/HatScripts/circle-flags)
- Built with [tsup](https://github.com/egoist/tsup)
