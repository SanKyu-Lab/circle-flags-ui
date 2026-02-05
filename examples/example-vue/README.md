# @sankyu/vue-circle-flags | Example App

Vue 3 demo app for `@sankyu/vue-circle-flags`.

## Live Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/SanKyu-Lab/circle-flags-ui/tree/main/examples/example-vue?file=src%2FApp.vue&terminal=dev)

## What's Included

- Named flag imports for tree-shaking friendly usage
- Dynamic flag rendering with runtime country codes
- Build metadata panel
- Reusable browse/grid UI from shared example modules

## Prerequisites

- Node.js `20.19+` (recommended by current Vite/Rolldown toolchain)
- pnpm `10+`

## Quick Start

```bash
# from repo root
pnpm install
pnpm -F example-vue dev
```

## Common Commands

```bash
# development
pnpm -F example-vue dev

# type-check + production build
pnpm -F example-vue build

# preview built app
pnpm -F example-vue preview
```

## Key Files

- App entry: `examples/example-vue/src/App.vue`
- Shared module entry: `examples/example-vue/src/libs/shared/index.ts`
- Flag grid UI: `examples/example-vue/src/components/FlagGrid.vue`
- Build info UI: `examples/example-vue/src/components/BuildInfoCard.vue`

## StackBlitz Notes

- This example is configured for StackBlitz auto-install.
- If install is interrupted, run `pnpm install` once, then `pnpm dev`.
