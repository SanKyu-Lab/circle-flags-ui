import {
  existsSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { resolveBuiltAt, resolveCircleFlagsCommit, resolveRepoCommit } from '../tsup/shared.mjs'

export const postbuildSvelte = () => {
  const distDir = join(process.cwd(), 'dist')

  // svelte-package copies all files in the input directory, including test
  // files. Remove them so they are not published.
  const removeTestFiles = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        removeTestFiles(fullPath)
      } else if (
        entry.name.endsWith('.test.js') ||
        entry.name.endsWith('.test.ts') ||
        entry.name.endsWith('.test.svelte') ||
        entry.name.endsWith('.spec.js') ||
        entry.name.endsWith('.spec.ts') ||
        entry.name.endsWith('.spec.svelte')
      ) {
        unlinkSync(fullPath)
      }
    }
  }
  removeTestFiles(distDir)
  console.log('✅ Removed test files from dist')

  // Inject build-time metadata constants into dist/meta.js so that buildMeta
  // matches React/Vue/Solid packages. svelte-package does not provide a define
  // replacement like tsup, so we perform a post-build text replacement.
  const metaJsPath = join(distDir, 'meta.js')
  if (existsSync(metaJsPath)) {
    const before = readFileSync(metaJsPath, 'utf-8')
    const after = before
      .replace(
        /__SVELTE_CIRCLE_FLAGS_COMMIT__/g,
        JSON.stringify(resolveRepoCommit('SVELTE_CIRCLE_FLAGS_COMMIT'))
      )
      .replace(
        /__SVELTE_CIRCLE_FLAGS_CIRCLE_FLAGS_COMMIT__/g,
        JSON.stringify(resolveCircleFlagsCommit('SVELTE_CIRCLE_FLAGS_CIRCLE_FLAGS_COMMIT'))
      )
      .replace(
        /__SVELTE_CIRCLE_FLAGS_BUILT_AT__/g,
        JSON.stringify(resolveBuiltAt('SVELTE_CIRCLE_FLAGS_BUILT_AT'))
      )
    if (before !== after) {
      writeFileSync(metaJsPath, after, 'utf-8')
      console.log('✅ Injected build metadata into dist/meta.js')
    }
  }

  // Declaration maps reference the unpublished src directory, so they are
  // useless in the npm tarball and only bloat the package. Remove them.
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

  // After removing .d.ts.map files, strip dangling sourceMappingURL comments
  // from .d.ts files so consumers are not pointed to missing maps.
  const stripSourceMappingUrls = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        stripSourceMappingUrls(fullPath)
      } else if (entry.name.endsWith('.d.ts')) {
        const before = readFileSync(fullPath, 'utf-8')
        const after = before.replace(/\n\/\/# sourceMappingURL=[^\n]+\s*$/g, '\n')
        if (before !== after) {
          writeFileSync(fullPath, after, 'utf-8')
        }
      }
    }
  }
  stripSourceMappingUrls(distDir)
  console.log('✅ Stripped dangling sourceMappingURL comments from .d.ts files')

  // svelte-package leaves intermediate files in .svelte-kit/__package__.
  // They are not part of the published package but clutter the workspace.
  const svelteKitPackageDir = join(process.cwd(), '.svelte-kit', '__package__')
  if (existsSync(svelteKitPackageDir)) {
    rmdirSync(svelteKitPackageDir, { recursive: true })
    console.log('✅ Removed .svelte-kit/__package__ intermediate directory')
  }
}
