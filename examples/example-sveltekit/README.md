# SvelteKit SSR example

This example verifies `@sankyu/svelte-circle-flags` with SvelteKit 3 and `@sveltejs/adapter-node`.

- Flags render on the server and hydrate in the browser. They do not need a `browser` check.
- Named imports are the preferred tree-shakeable path.
- `DynamicFlag` is also SSR-safe, but includes the complete flag registry in its bundle.
- `pnpm run verify:ssr` starts the Node production server and asserts that the first HTML response
  already contains SVG flag markup.

Run it from the repository root:

```bash
pnpm run build
pnpm -F example-sveltekit run build
pnpm -F example-sveltekit run verify:ssr
```
