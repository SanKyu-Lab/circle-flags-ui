// Bundles three consumers of every package with each bundler and counts the flags in the
// output: FlagUs from the package root, FlagUs from its /flags/us subpath, and DynamicFlag.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { rspack } from '@rspack/core'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { build as esbuild } from 'esbuild'
import { build as viteBuild } from 'vite'
import solid from 'vite-plugin-solid'
import webpack from 'webpack'
import { check, countFlags } from './_lib/report.mjs'

const root = process.cwd()
const srcDir = join(root, 'src')
mkdirSync(srcDir, { recursive: true })

const ALL_BUNDLERS = ['vite', 'esbuild', 'webpack', 'rspack']
const packages = [
  { name: 'react', pkg: '@sankyu/react-circle-flags', vitePlugin: react, bundlers: ALL_BUNDLERS },
  { name: 'vue', pkg: '@sankyu/vue-circle-flags', vitePlugin: vue, bundlers: ALL_BUNDLERS },
  { name: 'solid', pkg: '@sankyu/solid-circle-flags', vitePlugin: solid, bundlers: ALL_BUNDLERS },
  // Svelte packages ship .svelte sources, so only bundlers with a Svelte compiler plugin apply.
  {
    name: 'svelte',
    pkg: '@sankyu/svelte-circle-flags',
    vitePlugin: svelte,
    bundlers: ['vite', 'webpack'],
  },
]

const consumers = {
  root: {
    source: ({ pkg }) => `import { FlagUs } from '${pkg}'\nconsole.log(FlagUs)\n`,
    expected: '1 flag',
    pass: flags => flags === 1,
  },
  subpath: {
    source: ({ name, pkg }) =>
      name === 'svelte'
        ? `import FlagUs from '${pkg}/flags/us'\nconsole.log(FlagUs)\n`
        : `import { FlagUs } from '${pkg}/flags/us'\nconsole.log(FlagUs)\n`,
    expected: '1 flag',
    pass: flags => flags === 1,
  },
  dynamic: {
    source: ({ pkg }) => `import { DynamicFlag } from '${pkg}'\nconsole.log(DynamicFlag)\n`,
    expected: 'every flag (>= 400)',
    pass: flags => flags >= 400,
  },
}

const svelteWebpackOptions = {
  module: {
    rules: [{ test: /\.svelte$/, use: { loader: 'svelte-loader', options: { emitCss: false } } }],
  },
  resolve: {
    conditionNames: ['svelte', 'browser', 'import', 'module', 'default'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    extensions: ['.mjs', '.js', '.svelte'],
  },
}

const compileWith = (compiler, options) =>
  new Promise((resolve, reject) => {
    compiler(options, (error, stats) => {
      if (error) return reject(error)
      if (stats.hasErrors()) return reject(new Error(stats.toString('errors-only')))
      const outDir = options.output.path
      resolve(
        readdirSync(outDir)
          .filter(file => file.endsWith('.js'))
          .map(file => readFileSync(join(outDir, file), 'utf8'))
          .join('\n')
      )
    })
  })

const packOptions = (entry, target, id) => ({
  mode: 'production',
  entry,
  devtool: false,
  performance: { hints: false },
  output: { path: join(root, 'out', id), filename: 'bundle.js' },
  ...(target.name === 'svelte' ? svelteWebpackOptions : {}),
})

const bundlers = {
  vite: async (entry, target) => {
    const result = await viteBuild({
      root,
      configFile: false,
      logLevel: 'silent',
      plugins: [target.vitePlugin()],
      build: { write: false, minify: true, rolldownOptions: { input: entry } },
    })
    return (Array.isArray(result) ? result : [result])
      .flatMap(item => item.output)
      .filter(item => item.type === 'chunk')
      .map(item => item.code)
      .join('\n')
  },
  esbuild: async entry => {
    const result = await esbuild({
      entryPoints: [entry],
      bundle: true,
      minify: true,
      write: false,
      format: 'esm',
      platform: 'browser',
      logLevel: 'silent',
    })
    return result.outputFiles.map(file => file.text).join('\n')
  },
  webpack: (entry, target, id) => compileWith(webpack, packOptions(entry, target, id)),
  rspack: (entry, target, id) => compileWith(rspack, packOptions(entry, target, id)),
}

for (const target of packages) {
  for (const [consumerName, consumer] of Object.entries(consumers)) {
    const entry = join(srcDir, `${target.name}-${consumerName}.js`)
    writeFileSync(entry, consumer.source(target))
    for (const bundlerName of target.bundlers) {
      const id = `bundlers/${target.name}-${consumerName}-${bundlerName}`
      await check(
        {
          id,
          title: `${target.pkg} ${consumerName} import via ${bundlerName}`,
          expected: consumer.expected,
        },
        async () => {
          const code = await bundlers[bundlerName](entry, target, id.replaceAll('/', '-'))
          const flags = countFlags(code)
          const kib = (Buffer.byteLength(code) / 1024).toFixed(1)
          return { actual: `${flags} flags, ${kib} KiB`, pass: consumer.pass(flags) }
        }
      )
    }
  }
}
