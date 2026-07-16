# Nuxt SSR example

This example verifies `@sankyu/vue-circle-flags` with the latest Nuxt release.

- SSR remains enabled and flag components do not use a `ClientOnly` wrapper.
- Named imports are the preferred tree-shakeable path.
- `DynamicFlag` is also SSR-safe, but includes the complete flag registry in its bundle.
- `pnpm run verify:ssr` starts the Nitro production server and asserts that the first HTML
  response already contains SVG flag markup.

Run it from the repository root:

```bash
pnpm run build
pnpm -F example-nuxt run build
pnpm -F example-nuxt run verify:ssr
```
