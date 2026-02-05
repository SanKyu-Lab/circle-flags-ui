# @sankyu/solid-circle-flags | Example App

Solid.js demo app for `@sankyu/solid-circle-flags`.

## Live Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/SanKyu-Lab/circle-flags-ui/tree/main/examples/example-solid?file=src%2FApp.tsx&terminal=dev)

## What's Included

- Named flag imports for tree-shaking friendly usage
- Dynamic flag rendering with runtime country codes
- Build metadata panel
- Reusable browse/grid UI from shared example modules

## Prerequisites

- Node.js `20.19+` (recommended by current Vite/Rolldown toolchain)
- npm `10+`

## Quick Start

```bash
# from repo root
npm install
npm run dev
```

## Common Commands

```bash
# development
npm run dev

# type-check + production build
npm run build

# preview built app
npm run preview
```

## Key Files

- App entry: `examples/example-solid/src/App.tsx`
- Shared module entry: `examples/example-solid/src/libs/shared/index.ts`
- Flag grid UI: `examples/example-solid/src/components/FlagGrid.tsx`
- Build info UI: `examples/example-solid/src/components/BuildInfoCard.tsx`

## StackBlitz Notes

- This example is configured for StackBlitz auto-install.
- If install is interrupted, run `npm install` once, then `npm run dev`.
