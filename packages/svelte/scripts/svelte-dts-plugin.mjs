import { copyFile, mkdir, readdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { emitDts } from 'svelte2tsx'

/**
 * Copy .svelte source files preserving relative structure.
 *
 * @param {string} srcDir
 * @param {string} dstDir
 */
async function copySvelteFiles(srcDir, dstDir) {
  const entries = await readdir(srcDir, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = resolve(srcDir, entry.name)
    const dstPath = resolve(dstDir, entry.name)
    if (entry.isDirectory()) {
      await copySvelteFiles(srcPath, dstPath)
    } else if (entry.name.endsWith('.svelte')) {
      await mkdir(dirname(dstPath), { recursive: true })
      await copyFile(srcPath, dstPath)
    }
  }
}

/**
 * tsdown plugin that emits .d.ts for Svelte sources and copies .svelte files
 * to the output directory. Follows Svelte packaging best practice of shipping
 * source components rather than pre-compiled JS.
 *
 * @param {object} [options]
 * @param {Array<{ src: string; dst: string }>} [options.mappings]
 * @param {string} [options.tsconfig]
 * @param {string} [options.svelteShimsPath]
 */
export function svelteDtsPlugin(options = {}) {
  const {
    mappings = [
      { src: './src', dst: './dist' },
      { src: './generated/flags', dst: './dist/flags' },
    ],
    tsconfig = './tsconfig.json',
    svelteShimsPath = './node_modules/svelte2tsx/svelte-shims-v4.d.ts',
  } = options

  const tsconfigAbs = resolve(process.cwd(), tsconfig)
  const shimsAbs = resolve(process.cwd(), svelteShimsPath)

  return {
    name: 'svelte-dts-and-copy',
    async closeBundle() {
      // Copy .svelte source files so consumers compile them with their own
      // Svelte toolchain. This is the recommended distribution model for
      // Svelte component libraries.
      for (const { src, dst } of mappings) {
        const srcAbs = resolve(process.cwd(), src)
        const dstAbs = resolve(process.cwd(), dst)
        await copySvelteFiles(srcAbs, dstAbs)
      }

      // Generate TypeScript declarations for every .svelte and .ts file in
      // each mapped source root. Each root emits into its own destination
      // directory so generated/flags/index.ts does not overwrite src/index.ts.
      for (const { src, dst } of mappings) {
        const declarationDirAbs = resolve(process.cwd(), dst)
        await emitDts({
          declarationDir: declarationDirAbs,
          svelteShimsPath: shimsAbs,
          libRoot: resolve(process.cwd(), src),
          tsconfig: tsconfigAbs,
        })
      }

      console.log('✅ Svelte source files and DTS generated')
    },
  }
}
