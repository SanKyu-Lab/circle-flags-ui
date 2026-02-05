# @sankyu/react-circle-flags | Example App

React demo app for `@sankyu/react-circle-flags`.

## Live Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/SanKyu-Lab/circle-flags-ui/tree/main/examples/example-react?file=src%2FApp.tsx&terminal=dev)

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
pnpm -F example-react dev
```

## Common Commands

```bash
# development
pnpm -F example-react dev

# type-check + production build
pnpm -F example-react build

# preview built app
pnpm -F example-react preview
```

## Key Files

- App entry: `examples/example-react/src/App.tsx`
- Shared module entry: `examples/example-react/src/libs/shared/index.ts`
- Flag grid UI: `examples/example-react/src/components/FlagGrid.tsx`
- Build info UI: `examples/example-react/src/components/BuildInfoCard.tsx`

## StackBlitz Notes

- This example is configured for StackBlitz auto-install.
- If install is interrupted, run `pnpm install` once, then `pnpm dev`.
