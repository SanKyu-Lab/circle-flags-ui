# Next.js SSR example

This example verifies `@sankyu/react-circle-flags` with the latest Next.js App Router.

- The page remains a Server Component and does not add its own `use client` directive.
- The package entry declares the client boundary required by the deprecated `CircleFlag` export.
- Named imports are the preferred tree-shakeable path.
- `DynamicFlag` is also SSR-safe, but includes the complete flag registry in its bundle.
- `pnpm run verify:ssr` starts the production server and asserts that the first HTML response
  already contains SVG flag markup.

Run it from the repository root:

```bash
pnpm run build
pnpm -F example-next run build
pnpm -F example-next run verify:ssr
```
