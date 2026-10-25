# SolidStart SSR example

This example verifies `@sankyu/solid-circle-flags` with SolidStart 2.

- Flags render on the server and hydrate in the browser without a `clientOnly` wrapper.
- SolidStart compiles the package from its `solid` export condition, so the server and client
  output match the app's own Solid build.
- Named imports are the preferred tree-shakeable path.
- `DynamicFlag` is also SSR-safe, but includes the complete flag registry in its bundle.
- `pnpm run verify:ssr` starts the Nitro production server and asserts that the first HTML
  response already contains SVG flag markup and Solid hydration keys.

Run it from the repository root:

```bash
pnpm run build
pnpm -F example-solidstart run build
pnpm -F example-solidstart run verify:ssr
```
