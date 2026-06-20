import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export const postbuildSvelte = () => {
  const distDir = join(process.cwd(), 'dist')

  // tsdown preserves the relative path of externalized .svelte imports, so
  // `src/index.ts` -> `../generated/flags/*.svelte` becomes a broken path in
  // `dist/index.js`. Rewrite it to the published `./flags/*.svelte` location.
  const jsPath = join(distDir, 'index.js')
  if (existsSync(jsPath)) {
    const before = readFileSync(jsPath, 'utf-8')
    const after = before.replace(/\.\.\/generated\/flags\//g, './flags/')
    if (before !== after) {
      writeFileSync(jsPath, after, 'utf-8')
      console.log('✅ Rewrote generated flags import paths in index.js')
    }
  }

  // The src/index.ts re-export points at the pre-build location. Point it at
  // the published flags directory instead.
  const dtsPath = join(distDir, 'index.d.ts')
  if (existsSync(dtsPath)) {
    const before = readFileSync(dtsPath, 'utf-8')
    const after = before.replace(/\.\.\/generated\/flags/g, './flags')
    if (before !== after) {
      writeFileSync(dtsPath, after, 'utf-8')
      console.log('✅ Rewrote generated flags re-export path in index.d.ts')
    }
  }

  // tsdown may emit a CJS declaration file even when format is ESM-only.
  const dctsPath = join(distDir, 'index.d.cts')
  if (existsSync(dctsPath)) {
    unlinkSync(dctsPath)
    console.log('✅ Removed redundant index.d.cts')
  }

  // Declaration maps reference the unpublished src/generated directories, so
  // they are useless in the npm tarball and only bloat the package. Remove them.
  const removeDtsMaps = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        removeDtsMaps(fullPath)
      } else if (entry.name.endsWith('.d.ts.map')) {
        unlinkSync(fullPath)
      }
    }
  }
  removeDtsMaps(distDir)
  console.log('✅ Removed stale .d.ts.map files')
}
