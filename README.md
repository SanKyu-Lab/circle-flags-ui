<div align="center">
  <a href="https://react-circle-flags.js.org/">
    <img src=".github/assets/favicon.svg" alt="circle-flags-ui logo" width="120" height="120" />
  </a>
</div>

<div align="center">

# circle-flags-ui [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[![React npm](https://img.shields.io/npm/v/%40sankyu%2Freact-circle-flags?style=flat-square&label=react)](https://www.npmjs.com/package/@sankyu/react-circle-flags) [![Vue npm](https://img.shields.io/npm/v/%40sankyu%2Fvue-circle-flags?style=flat-square&label=vue)](https://www.npmjs.com/package/@sankyu/vue-circle-flags) [![Solid npm](https://img.shields.io/npm/v/%40sankyu%2Fsolid-circle-flags?style=flat-square&label=solid)](https://www.npmjs.com/package/@sankyu/solid-circle-flags)

Monorepo for **400+ circular SVG flag components** across React, Vue 3, and Solid.js.

:rocket: [Demo Gallery](https://react-circle-flags.js.org/browse) | :book: [Documentation](https://react-circle-flags.js.org/docs/guides/getting-started/) | :bug: [Issues](https://github.com/SanKyu-Lab/circle-flags-ui/issues)

</div>

## Package Matrix

| Framework                                                                            | Package                      | Status | npm                                                                                                                                               | Docs / Source                                                                                                 |
| ------------------------------------------------------------------------------------ | ---------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| <img src=".github/assets/react.svg" alt="React" width="16" height="16" /> React      | `@sankyu/react-circle-flags` | Stable | [![npm](https://img.shields.io/npm/v/%40sankyu%2Freact-circle-flags?style=flat-square)](https://www.npmjs.com/package/@sankyu/react-circle-flags) | [Docs](https://react-circle-flags.js.org/docs/guides/getting-started/) · [README](./packages/react/README.md) |
| <img src=".github/assets/vue.svg" alt="Vue" width="16" height="16" /> Vue 3          | `@sankyu/vue-circle-flags`   | Beta   | [![npm](https://img.shields.io/npm/v/%40sankyu%2Fvue-circle-flags?style=flat-square)](https://www.npmjs.com/package/@sankyu/vue-circle-flags)     | [Docs](https://react-circle-flags.js.org/docs/guides/getting-started/) · [README](./packages/vue/README.md)   |
| <img src=".github/assets/solidjs.svg" alt="Solid" width="16" height="16" /> Solid.js | `@sankyu/solid-circle-flags` | Beta   | [![npm](https://img.shields.io/npm/v/%40sankyu%2Fsolid-circle-flags?style=flat-square)](https://www.npmjs.com/package/@sankyu/solid-circle-flags) | [Docs](https://react-circle-flags.js.org/docs/guides/getting-started/) · [README](./packages/solid/README.md) |

## Features

- 🎯 Tree-shakable named exports
- 📦 Full TypeScript support
- ⚡ Offline-first inline SVG components
- 🔧 Standard SVG props for customization
- 📱 SSR-friendly for modern frameworks
- 🧩 Shared core + framework-specific packages

> [!CAUTION]
> `DynamicFlag` is intended for runtime code rendering, but it bundles all 400+ flags
> (~600 KB, no tree-shaking). For minimal bundles, prefer named imports or a finite map.

## Quick Start

### Install a package

```bash
pnpm add @sankyu/react-circle-flags
# or
pnpm add @sankyu/vue-circle-flags
# or
pnpm add @sankyu/solid-circle-flags
```

### Monorepo development

```bash
# install dependencies
pnpm install

# generate flag components from source SVGs
pnpm run gen:flags

# build all packages
pnpm run build

# run checks
pnpm run lint
pnpm run typecheck
pnpm run test
```

## Repository Layout

```text
circle-flags-ui/
├── packages/
│   ├── core/      # shared types, utils, generated registry (private)
│   ├── react/     # @sankyu/react-circle-flags
│   ├── vue/       # @sankyu/vue-circle-flags
│   └── solid/     # @sankyu/solid-circle-flags
├── examples/      # framework examples
├── scripts/       # generation/build/release scripts
└── website/       # docs site (Astro)
```

## Credits

- Flag designs from [HatScripts/circle-flags](https://github.com/HatScripts/circle-flags)

## License

- Repository and packages: MIT © [Sankyu Lab](https://github.com/SanKyu-Lab)
- `website/`: GPL-3.0 (see `website/LICENSE`)
