<div align="center">
  <a href="https://react-circle-flags.js.org/">
    <img src=".github/assets/favicon.svg" alt="circle-flags-ui logo" width="120" height="120" />
  </a>

  <h1>circle-flags-ui</h1>

  <p>
    <strong>430 generated circular SVG flags.</strong><br />
    Framework-native packages for React, Vue 3, Solid.js, and Svelte 5.
  </p>

  <p>
    Verified with Vite 8 · first-response SSR with Next.js and Nuxt · precise ESM/CJS TypeScript exports
  </p>

<a href="https://www.npmjs.com/package/@sankyu/react-circle-flags"><img src="https://img.shields.io/npm/v/%40sankyu%2Freact-circle-flags?style=flat-square&label=react&logo=react&logoColor=white&color=61DAFB" alt="React npm" /></a>
<a href="https://www.npmjs.com/package/@sankyu/vue-circle-flags"><img src="https://img.shields.io/npm/v/%40sankyu%2Fvue-circle-flags?style=flat-square&label=vue&logo=vuedotjs&logoColor=white&color=42b883" alt="Vue npm" /></a>
<a href="https://www.npmjs.com/package/@sankyu/solid-circle-flags"><img src="https://img.shields.io/npm/v/%40sankyu%2Fsolid-circle-flags?style=flat-square&label=solid&logo=solid&logoColor=white&color=2C4F7C" alt="Solid npm" /></a>
<a href="https://www.npmjs.com/package/@sankyu/svelte-circle-flags"><img src="https://img.shields.io/npm/v/%40sankyu%2Fsvelte-circle-flags?style=flat-square&label=svelte&logo=svelte&logoColor=white&color=FF3E00" alt="Svelte npm" /></a>

  <br />

<a href="https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/ci.yml"><img src="https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
<a href="https://codecov.io/gh/SanKyu-Lab/circle-flags-ui"><img src="https://codecov.io/gh/SanKyu-Lab/circle-flags-ui/graph/badge.svg" alt="codecov" /></a>
<img src="https://img.shields.io/badge/flags-430-111827?style=flat-square" alt="430 flags" />
<img src="https://img.shields.io/badge/Vite-8_verified-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 8 verified" />
<img src="https://img.shields.io/badge/SSR-Next_%2B_Nuxt-111827?style=flat-square" alt="SSR verified with Next.js and Nuxt" />
<a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-16a34a?style=flat-square" alt="MIT License" /></a>

<br /><br />

<a href="https://react-circle-flags.js.org/browse">Flag gallery</a> ·
<a href="https://react-circle-flags.js.org/docs/guides/getting-started/">Documentation</a> ·
<a href="https://react-circle-flags.js.org/docs/guides/advanced/ssr-compatibility/">SSR guide</a> ·
<a href="https://github.com/SanKyu-Lab/circle-flags-ui/issues">Issues</a>
</div>

---

<div align="center">
  <a href="https://react-circle-flags.js.org/">
    <img src=".github/assets/og.png" alt="circle-flags-ui preview" width="830" />
  </a>
</div>

## What ships

This repository turns the upstream
[HatScripts/circle-flags](https://github.com/HatScripts/circle-flags) SVG collection into
framework-native, typed component packages from one generated source of truth.

- **430 generated flags** with consistent names, props, aliases, and metadata
- **Per-flag subpath exports** for deterministic tree-shaking
- **Precise ESM and CJS declarations** for package roots, metadata, and individual flags
- **Three rendering modes**: static imports, offline runtime lookup, or CDN-backed loading
- **Real compatibility apps** instead of compile-only compatibility claims
- **Published package completeness** with runtime files, declarations, READMEs, and MIT licenses

## Packages

| Framework | Package                                                                                    | Maturity | Verified integration           | Documentation                                |
| --------- | ------------------------------------------------------------------------------------------ | -------- | ------------------------------ | -------------------------------------------- |
| React     | [`@sankyu/react-circle-flags`](https://www.npmjs.com/package/@sankyu/react-circle-flags)   | Stable   | Vite 8, Next.js App Router SSR | [React README](./packages/react/README.md)   |
| Vue 3     | [`@sankyu/vue-circle-flags`](https://www.npmjs.com/package/@sankyu/vue-circle-flags)       | Beta     | Vite 8, Nuxt SSR               | [Vue README](./packages/vue/README.md)       |
| Solid.js  | [`@sankyu/solid-circle-flags`](https://www.npmjs.com/package/@sankyu/solid-circle-flags)   | Beta     | Vite 8 client build            | [Solid README](./packages/solid/README.md)   |
| Svelte 5  | [`@sankyu/svelte-circle-flags`](https://www.npmjs.com/package/@sankyu/svelte-circle-flags) | Beta     | Vite 8 client build            | [Svelte README](./packages/svelte/README.md) |

## Verified compatibility matrix

The versions below are the repository's current executable test matrix, not merely peer dependency
ranges.

| Rendering | Framework stack           | Verification                                                    |
| --------- | ------------------------- | --------------------------------------------------------------- |
| CSR       | React 19.2 + Vite 8.1     | TypeScript and production build                                 |
| SSR       | React 19.2 + Next.js 16.2 | Production server; SVG present in the first HTML response       |
| CSR       | Vue 3.5 + Vite 8.1        | `vue-tsc` and production build                                  |
| SSR       | Vue 3.5 + Nuxt 4.4        | Nitro production server; SVG present in the first HTML response |
| CSR       | Solid.js 1.9 + Vite 8.1   | TypeScript and production build                                 |
| CSR       | Svelte 5.56 + Vite 8.1    | `svelte-check` and production build                             |

The SSR verifier starts each production server, fetches the initial document, checks for the
framework marker and real `<svg>` markup, then shuts the process down cleanly. SolidStart/raw Node
SSR is not claimed by the current matrix.

## Installation

```bash
# React
pnpm add @sankyu/react-circle-flags

# Vue 3
pnpm add @sankyu/vue-circle-flags

# Solid.js
pnpm add @sankyu/solid-circle-flags

# Svelte 5
pnpm add @sankyu/svelte-circle-flags
```

`npm`, `yarn`, and `bun` can install the same published packages.

## Recommended: import individual flags

Per-flag subpaths keep the runtime and TypeScript surface limited to the component you selected.

```tsx
import { FlagCn } from '@sankyu/react-circle-flags/flags/cn'
import { FlagGb } from '@sankyu/react-circle-flags/flags/gb'
import { FlagUs } from '@sankyu/react-circle-flags/flags/us'

export default function RegionPicker() {
  return (
    <div aria-label="Available regions">
      <FlagUs width={40} height={40} title="United States" />
      <FlagGb width={40} height={40} title="United Kingdom" />
      <FlagCn width={40} height={40} title="China" />
    </div>
  )
}
```

The same subpath pattern is available in every package:

| Framework | Import                                                         |
| --------- | -------------------------------------------------------------- |
| React     | `import { FlagUs } from '@sankyu/react-circle-flags/flags/us'` |
| Vue 3     | `import { FlagUs } from '@sankyu/vue-circle-flags/flags/us'`   |
| Solid.js  | `import { FlagUs } from '@sankyu/solid-circle-flags/flags/us'` |
| Svelte 5  | `import FlagUs from '@sankyu/svelte-circle-flags/flags/us'`    |

## Choose the right rendering mode

| API             | Best for                                     | Trade-off                                                   |
| --------------- | -------------------------------------------- | ----------------------------------------------------------- |
| Per-flag import | Known flags, design systems, static UI       | Smallest and most explicit bundle surface                   |
| `DynamicFlag`   | Runtime country codes without network access | Includes the generated flag registry                        |
| `CircleFlag`    | CDN-backed or externally hosted SVGs         | Performs a network request and uses loading/error fallbacks |

For dynamic or remote content, see the
[usage guide](https://react-circle-flags.js.org/docs/guides/getting-started/usage/) and
[CDN guide](https://react-circle-flags.js.org/docs/guides/advanced/cdn-usage/).

## Examples and sandboxes

The compatibility apps are deliberately usable in two ways:

1. As pnpm workspace projects for repository development.
2. As standalone npm projects when opened from StackBlitz or copied into a sandbox.

| Example                                       | Purpose                | Open online                                                                                                                                      |
| --------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`example-react`](./examples/example-react)   | React + Vite 8         | [StackBlitz](https://stackblitz.com/fork/github/SanKyu-Lab/circle-flags-ui/tree/main/examples/example-react?file=src%2FApp.tsx&terminal=dev)     |
| [`example-vue`](./examples/example-vue)       | Vue 3 + Vite 8         | [StackBlitz](https://stackblitz.com/fork/github/SanKyu-Lab/circle-flags-ui/tree/main/examples/example-vue?file=src%2FApp.vue&terminal=dev)       |
| [`example-solid`](./examples/example-solid)   | Solid.js + Vite 8      | [StackBlitz](https://stackblitz.com/fork/github/SanKyu-Lab/circle-flags-ui/tree/main/examples/example-solid?file=src%2FApp.tsx&terminal=dev)     |
| [`example-svelte`](./examples/example-svelte) | Svelte 5 + Vite 8      | [StackBlitz](https://stackblitz.com/fork/github/SanKyu-Lab/circle-flags-ui/tree/main/examples/example-svelte?file=src%2FApp.svelte&terminal=dev) |
| [`example-next`](./examples/example-next)     | Next.js production SSR | Local verification                                                                                                                               |
| [`example-nuxt`](./examples/example-nuxt)     | Nuxt production SSR    | Local verification                                                                                                                               |

The four CSR examples intentionally keep their own `package-lock.json`. StackBlitz treats each
example directory as a standalone npm project, so these locks are part of the sandbox contract even
though the monorepo itself uses pnpm.

```bash
# Standalone sandbox workflow
cd examples/example-react
npm ci
npm run dev
```

## Monorepo development

```bash
# Reproducible workspace install
pnpm install --frozen-lockfile

# Regenerate all framework components from upstream SVGs
pnpm run gen:flags

# Build all publishable packages
pnpm run build

# Format, lint, and type-check
pnpm run format:check
pnpm run lint
pnpm run typecheck

# Run package tests
pnpm run test

# Build every compatibility app and verify production SSR output
pnpm run test:examples
```

## Build and release guarantees

- React, Vue, and Solid publish ESM and CommonJS runtime entries.
- ESM consumers receive `.d.ts`; CommonJS consumers receive `.d.cts`.
- Individual flag exports expose only the matching component type.
- React entries preserve the required client boundary while remaining SSR-renderable in Next.js.
- Vue and React SSR examples render flags without client-only wrappers.
- Package tarballs include their license and documented runtime/type entrypoints.
- Svelte packages are produced with the Svelte package tool and validated with `svelte-check`.

## Repository architecture

```text
circle-flags-ui/
├── circle-flags/          # upstream SVG source
├── packages/
│   ├── core/              # shared registry, types, and utilities
│   ├── react/             # @sankyu/react-circle-flags
│   ├── vue/               # @sankyu/vue-circle-flags
│   ├── solid/             # @sankyu/solid-circle-flags
│   └── svelte/            # @sankyu/svelte-circle-flags
├── examples/
│   ├── example-react/     # Vite 8 CSR + standalone npm sandbox
│   ├── example-vue/       # Vite 8 CSR + standalone npm sandbox
│   ├── example-solid/     # Vite 8 CSR + standalone npm sandbox
│   ├── example-svelte/    # Vite 8 CSR + standalone npm sandbox
│   ├── example-next/      # Next.js production SSR
│   └── example-nuxt/      # Nuxt production SSR
├── scripts/               # generators, build tasks, release tooling, SSR verifier
└── website/               # Astro documentation and gallery
```

## Credits

Flag designs are sourced from
[HatScripts/circle-flags](https://github.com/HatScripts/circle-flags).

## License

- Repository and published packages: MIT © [Sankyu Lab](https://github.com/SanKyu-Lab)
- `website/`: GPL-3.0; see [`website/LICENSE`](./website/LICENSE)
