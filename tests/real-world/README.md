# Real-world consumer tests

These tests check the packages the way users install them. Each `@sankyu/*` package is packed with
`pnpm pack`, and the tarballs are installed into consumer projects outside the workspace, with
current versions of their other dependencies from the registry.

| Unit                 | What it checks                                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `bundlers`           | Vite 8, esbuild, webpack 5 and Rspack bundle the root entry, a `/flags/*` subpath and `DynamicFlag`; tree-shaking keeps one or all flags |
| `node-ssr`           | Node loads every entry through `import` and `require` and renders flags with the React, Vue and Solid server renderers                   |
| `typescript`         | TypeScript 5.0, 5.9, 6.0 and 7.0 resolve the declarations with `bundler`, `node16` and `node10`; svelte-check rejects invalid props      |
| `framework-versions` | The lowest framework versions the peer ranges accept, and every React major from 16.8, render on the server and build                    |
| `example-*`          | The example apps build for production and run in Chromium without console errors; SSR examples hydrate and switch a flag                 |

## Running

Build the packages, install the runner and Chromium, then run every unit or a subset by id prefix:

```bash
pnpm run build
pnpm --dir tests/real-world install --ignore-workspace --no-lockfile
pnpm --dir tests/real-world exec playwright install chromium
node tests/real-world/run.mjs --pack
node tests/real-world/run.mjs --pack --only bundlers,typescript
```

`--pack` packs `packages/*` into the work directory. `--tarballs <dir>` uses tarballs packed
elsewhere, which is how CI shares one set of tarballs between jobs. `--work <dir>` sets the work
directory (default: `circle-flags-real-world` in the system temp directory). Results are written to
`summary.md` in the work directory, and each unit has its own log under `logs/`.

## Adding a fixture

A fixture is a directory under `fixtures/` with a `package.json` and a `check.mjs`. The runner
copies it, points its `@sankyu/*` dependencies at the tarballs, installs it, and runs `check.mjs`,
which records results through `_lib/report.mjs`. `realWorld.variants` in the fixture's
`package.json` runs the same fixture again with other dependency versions or environment variables.
