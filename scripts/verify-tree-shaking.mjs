import { build } from 'esbuild'
import { join } from 'node:path'
import { isMain } from './lib/is-main.mjs'
import { repoRootFromImportMeta } from './lib/repo-root.mjs'

const repoRoot = repoRootFromImportMeta(import.meta.url)

const packages = [
  { dir: 'react', external: ['react', 'react/jsx-runtime'] },
  { dir: 'vue', external: ['vue'] },
  { dir: 'solid', external: ['solid-js', 'solid-js/web'] },
]

// Every flag body references its own mask as url(#cf-<code>-a).
const countFlags = code =>
  new Set([...code.matchAll(/url\(#cf-([a-z0-9_-]+?)-a\)/g)].map(match => match[1])).size

const bundleFlagUs = async (pkg, entry) => {
  const result = await build({
    stdin: {
      contents: `import { FlagUs } from ${JSON.stringify(entry)}\nconsole.log(FlagUs)\n`,
      resolveDir: join(repoRoot, 'packages', pkg.dir),
    },
    bundle: true,
    minify: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    logLevel: 'silent',
    external: [...pkg.external, '@sankyu/circle-flags-core'],
  })
  return countFlags(result.outputFiles.map(file => file.text).join('\n'))
}

export const verifyTreeShaking = async () => {
  for (const pkg of packages) {
    const dist = join(repoRoot, 'packages', pkg.dir, 'dist')
    for (const entry of [join(dist, 'index.mjs'), join(dist, 'flags', 'us.mjs')]) {
      const flags = await bundleFlagUs(pkg, entry)
      if (flags !== 1) {
        throw new Error(`${entry}: importing FlagUs bundles ${flags} flags, expected 1`)
      }
    }
    console.log(`✅ ${pkg.dir}: importing FlagUs bundles 1 flag`)
  }
}

if (isMain(import.meta.url)) {
  await verifyTreeShaking()
}
