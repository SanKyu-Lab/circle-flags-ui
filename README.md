<div align="center">
  <img src="./website/public/favicon.svg" alt="@sankyu/react-circle-flags" width="120" height="120" />
</div>

<div align="center">

# @sankyu/react-circle-flags

[![npm version](https://img.shields.io/npm/v/%40sankyu%2Freact-circle-flags?style=flat-square&label=%40sankyu%2Freact-circle-flags)](https://www.npmjs.com/package/@sankyu/react-circle-flags) [![npm downloads](https://img.shields.io/npm/dm/@sankyu/react-circle-flags.svg?style=flat-square&label=NPM%20Downloads)](https://www.npmjs.com/package/@sankyu/react-circle-flags) [![Bundle Size](https://img.shields.io/bundlephobia/minzip/@sankyu/react-circle-flags?style=flat-square&label=Bundle%20Size)](https://bundlephobia.com/package/@sankyu/react-circle-flags)

[![CI](https://github.com/SanKyu-Lab/react-circle-flags/actions/workflows/ci.yml/badge.svg)](https://github.com/SanKyu-Lab/react-circle-flags/actions/workflows/ci.yml) [![Release](https://github.com/SanKyu-Lab/react-circle-flags/actions/workflows/release.yml/badge.svg)](https://github.com/SanKyu-Lab/react-circle-flags/actions/workflows/release.yml) [![codecov](https://codecov.io/gh/SanKyu-Lab/react-circle-flags/branch/main/graph/badge.svg?token=YHZ46T51AG)](https://codecov.io/gh/SanKyu-Lab/react-circle-flags)

[![TypeScript Supported](https://img.shields.io/badge/TypeScript-Supported-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![React Ready](https://img.shields.io/badge/React-%3E%3D16.0.0-61dafb?style=flat-square&logo=react)](https://reactjs.org/) [![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square&logo=opensourceinitiative)](./LICENSE)

---

:star: **Star us on [GitHub](https://github.com/Sankyu-Lab/react-circle-flags)** | :bug: **Report Issues [here](https://github.com/Sankyu-Lab/react-circle-flags/issues)**

:rocket: **Explore the [Demo Gallery](https://sankyu-lab.github.io/react-circle-flags/browse)** | :book: **Read the [Documentation](https://sankyu-lab.github.io/react-circle-flags/docs/guides/getting-started/)**

</div>

---

## 📖 Overview

This library provides **400+ circular SVG flag components** with **Full-TypeScript support** & **Tree-shaking Optimization**.

Perfect for applications that need fast, crisp country flags without external image requests.

---

## ✨ Key Features

> [!TIP]
> For more information, you may refer to the [Documentation](https://sankyu-lab.github.io/react-circle-flags/docs/guides/getting-started/#-key-features).

- 🎯 **Tree-shakable** - Only bundle the flags you use
- 📦 **TypeScript** - Full type definitions included
- ⚡ **Zero dependencies** - Only requires React as peer dependency
- 🎨 **Inline SVG** - No external requests, works offline
- 🔧 **Fully customizable** - All standard SVG props supported
- 📱 **SSR compatible** - Works with `Next.js`, `Remix`, etc.
- 🪶 **Lightweight** - Each flag is ~1-3KB

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
> For more information, you may refer to the [Installation Guide](https://sankyu-lab.github.io/react-circle-flags/docs/guides/getting-started/installation/).

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

> [!TIP]
> For more information, you may refer to the [Usage Guide](https://sankyu-lab.github.io/react-circle-flags/docs/guides/getting-started/usage/).

### With custom styling

```tsx
import { FlagUs } from '@sankyu/react-circle-flags'

export default function StyledFlag() {
  return (
    <FlagUs
      width={64}
      height={64}
      className="shadow-lg rounded-full"
      style={{ border: '2px solid #000' }}
    />
  )
}
```

### Dynamic flag selection

> [!WARNING]
> ⚠️ Using `DynamicFlag` or `import * as Flags` will pull all flag components into the bundle, which can reduce tree-shaking efficiency and increase bundle size.

```tsx
import { DynamicFlag } from '@sankyu/react-circle-flags'

interface CountryFlagProps {
  countryCode: string
  size?: number
}

export const CountryFlag = ({ countryCode, size = 48 }: CountryFlagProps) => {
  return <DynamicFlag code={countryCode} width={size} height={size} />
}

// Usage
;<CountryFlag countryCode="us" size={64} />
```

> [!TIP]
> For more information, you may refer to the [Dynamic Flag Selection](https://sankyu-lab.github.io/react-circle-flags/docs/guides/getting-started/dynamic-flags/) section in the documentation.

## 📚 API

### Flag Components

Each flag component accepts all standard SVG props:

```tsx
interface FlagProps extends SVGProps<SVGSVGElement> {
  width?: number | string
  height?: number | string
  className?: string
  style?: CSSProperties
  // ... all other SVG props
}
```

### Available Flags

Each flag is exported with the pattern `Flag{PascalCase ISO_CODE}` (for example, `FlagUs`, `FlagCn`). Convenience aliases are provided for common two-letter codes: `FlagUs`, `FlagCn`, `FlagGb`, `FlagJp`.

- `FlagUs` - United States
- `FlagCn` - China
- `FlagGb` - United Kingdom
- `FlagJp` - Japan
- ... and many more

See the [Full list of flags](https://sankyu-lab.github.io/react-circle-flags/browse) in the react-circle-flags gallery.

## 🎨 Styling

Flag components accept all standard SVG props, making them easy to style with any CSS approach.

> [!TIP]
> For more information, you may refer to the [Styling Guide](https://sankyu-lab.github.io/react-circle-flags/docs/guides/getting-started/styling/).

## 🔧 TypeScript

All flag components are fully typed with TypeScript, providing autocomplete and type safety out of the box.

> [!TIP]
> For more information, you may refer to the [TypeScript Guide](https://sankyu-lab.github.io/react-circle-flags/docs/guides/getting-started/typescript/).

## 📖 Examples

> [!TIP]
> For more information, you may refer to the [Guide - Basic Usage](https://sankyu-lab.github.io/react-circle-flags/docs/guides/getting-started/usage/).

## 📦 Bundle Size & Tree-shaking

`@sankyu/react-circle-flags` is designed to be tree-shakable. Importing individual flags ensures that only the used flags are included in your bundle.

> [!TIP]
> For more information, you may refer to the [Bundle Size & Tree-shaking Guide](https://sankyu-lab.github.io/react-circle-flags/docs/guides/getting-started/bundle-size/).

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📄 License

`@sankyu/react-circle-flags` is licensed under the MIT License, © [Sankyu Lab](https://github.com/Sankyu-Lab)

[website](./website/) is licensed under the GPL-3.0 License, © [Sankyu Lab](https://github.com/Sankyu-Lab)

## 🙏 Credits

- Flag designs from [HatScripts/circle-flags](https://github.com/HatScripts/circle-flags)
- Built with [tsup](https://github.com/egoist/tsup)
