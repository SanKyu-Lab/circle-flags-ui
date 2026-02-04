<div align="center">
  <a href="https://react-circle-flags.js.org/">
    <img src="https://raw.githubusercontent.com/SanKyu-Lab/react-circle-flags/main/.github/assets/favicon.svg" alt="@sankyu/react-circle-flags" width="120" height="120" />
  </a>
</div>

<div align="center">

# @sankyu/react-circle-flags

[![npm version](https://img.shields.io/npm/v/%40sankyu%2Freact-circle-flags?style=flat-square&label=%40sankyu%2Freact-circle-flags)](https://www.npmjs.com/package/@sankyu/react-circle-flags) [![Bundle Size](https://img.shields.io/bundlephobia/minzip/@sankyu/react-circle-flags?style=flat-square&label=Bundle%20Size)](https://bundlephobia.com/package/@sankyu/react-circle-flags) [![npm downloads](https://img.shields.io/npm/dm/@sankyu/react-circle-flags.svg?style=flat-square&label=NPM%20Downloads)](https://www.npmjs.com/package/@sankyu/react-circle-flags) [![Last Commit](https://img.shields.io/github/last-commit/SanKyu-Lab/react-circle-flags?style=flat-square&label=Last%20Commit)](https://github.com/SanKyu-Lab/react-circle-flags/commits/main)

<!-- CI/CD & Quality -->

[![CI](https://github.com/SanKyu-Lab/react-circle-flags/actions/workflows/ci.yml/badge.svg)](https://github.com/SanKyu-Lab/react-circle-flags/actions/workflows/ci.yml) [![Release](https://github.com/SanKyu-Lab/react-circle-flags/actions/workflows/release.yml/badge.svg)](https://github.com/SanKyu-Lab/react-circle-flags/actions/workflows/release.yml) [![codecov](https://codecov.io/gh/SanKyu-Lab/react-circle-flags/branch/main/graph/badge.svg?token=YHZ46T51AG)](https://codecov.io/gh/SanKyu-Lab/react-circle-flags)

[![TypeScript supported](https://img.shields.io/badge/TypeScript-supported-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![Tree-shakable](https://badgen.net/bundlephobia/tree-shaking/@sankyu/react-circle-flags)](https://bundlephobia.com/package/@sankyu/react-circle-flags) [![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square&logo=opensourceinitiative)](./LICENSE)

---

English Version | [简体中文](./README.zh.md)

:star: **Star us on [GitHub](https://github.com/Sankyu-Lab/react-circle-flags)** | :bug: **Report Issues [here](https://github.com/Sankyu-Lab/react-circle-flags/issues)**

:rocket: **Explore the [Demo Gallery](https://react-circle-flags.js.org/browse)** | :book: **Read the [Documentation](https://react-circle-flags.js.org/docs/guides/getting-started/)**

</div>

---

## 📖 Overview

This library provides **400+ circular SVG flag components** with **Full-TypeScript support** & **Tree-shaking Optimization**.

Perfect for applications that need fast, crisp country flags without external image requests.

## :world_map: Live Demo

[![Edit react-circle-flags-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/nyy6vp) [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/SanKyu-Lab/circle-flags-ui/tree/main/examples/example-react?file=src%2FApp.tsx&terminal=dev)

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

> [!TIP]
> For more information, you may refer to the [Bundle Size & Tree-shaking Guide](https://react-circle-flags.js.org/docs/guides/getting-started/bundle-size/).

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📄 License

`@sankyu/react-circle-flags` is licensed under the MIT License, © [Sankyu Lab](https://github.com/Sankyu-Lab)

[website](./website/) is licensed under the GPL-3.0 License, © [Sankyu Lab](https://github.com/Sankyu-Lab)

## 🙏 Credits

- Flag designs from [HatScripts/circle-flags](https://github.com/HatScripts/circle-flags)
- Built with [tsup](https://github.com/egoist/tsup)
