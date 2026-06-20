import { readdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

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
}
