// Builds and server-renders a small app against one framework version; FRAMEWORK picks which.
// The variants pin the lowest version each peer range accepts, and several React majors.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build as viteBuild } from 'vite'
import webpack from 'webpack'
import { check } from './_lib/report.mjs'

const require = createRequire(import.meta.url)
const root = process.cwd()
const framework = process.env.FRAMEWORK
const frameworkPackage = { react: 'react', vue: 'vue', solid: 'solid-js', svelte: 'svelte' }[
  framework
]
const version = JSON.parse(
  readFileSync(join(root, 'node_modules', frameworkPackage, 'package.json'), 'utf8')
).version
const prefix = `framework-versions/${framework}-${version}`

const expectFlags = html => {
  const svgCount = (html.match(/<svg/g) ?? []).length
  const bodies = ['cf-us-a', 'cf-jp-a', 'cf-sh-ac-a'].filter(id => html.includes(id))
  const aliasTitle = html.includes('aria-label="AC"')
  return {
    actual: `${svgCount} <svg>, bodies ${bodies.join('/') || 'none'}, alias title ${aliasTitle ? 'AC' : 'not AC'}`,
    pass: svgCount >= 4 && bodies.length === 3 && aliasTitle,
  }
}
const expectedHtml = 'FlagUs, DynamicFlag, FlagAc (titled AC) and the CircleFlag placeholder'

const writeEntry = (name, source) => {
  const path = join(root, 'src', name)
  writeFileSync(path, source)
  return path
}

const loadPlugins = async () => {
  if (framework === 'solid') return [(await import('vite-plugin-solid')).default({ ssr: true })]
  if (framework === 'svelte') return [(await import('@sveltejs/vite-plugin-svelte')).svelte()]
  return []
}

const viteClientBuild = async entry =>
  viteBuild({
    root,
    configFile: false,
    logLevel: 'silent',
    plugins: await loadPlugins(),
    // rollupOptions is the name both Vite 7 (svelte-5.0.0 variant) and Vite 8 accept.
    build: { write: false, minify: true, rollupOptions: { input: entry } },
  })

const viteSsrRender = async (entry, name) => {
  const outDir = join(root, 'out', name)
  await viteBuild({
    root,
    configFile: false,
    logLevel: 'silent',
    plugins: await loadPlugins(),
    build: { ssr: entry, outDir, emptyOutDir: true, minify: false },
  })
  const file = readdirSync(outDir).find(entryFile => /\.m?js$/.test(entryFile))
  const mod = await import(pathToFileURL(join(outDir, file)).href)
  return mod.render()
}

const webpackBuild = entry =>
  new Promise((resolve, reject) => {
    webpack(
      {
        mode: 'production',
        entry,
        devtool: false,
        performance: { hints: false },
        output: { path: join(root, 'out', 'webpack'), filename: 'bundle.js' },
      },
      (error, stats) => {
        if (error) return reject(error)
        if (stats.hasErrors()) return reject(new Error(stats.toString('errors-only')))
        resolve()
      }
    )
  })

const buildOk = async run => {
  await run()
  return { actual: 'built', pass: true }
}

if (framework === 'react') {
  await check(
    {
      id: `${prefix}/ssr-require`,
      title: `React ${version} SSR through require()`,
      expected: expectedHtml,
    },
    async () => {
      const { createElement } = require('react')
      const { renderToString } = require('react-dom/server')
      const lib = require('@sankyu/react-circle-flags')
      return expectFlags(
        renderToString(
          createElement(
            'main',
            null,
            createElement(lib.FlagUs),
            createElement(lib.DynamicFlag, { code: 'jp' }),
            createElement(lib.FlagAc),
            createElement(lib.CircleFlag, { countryCode: 'fr' })
          )
        )
      )
    }
  )
  // React 16 ships CommonJS that Node's ESM loader cannot read named exports from, so
  // `import { createElement } from 'react'` fails in any Node ESM module. React 16 apps render
  // on the server through require() or a bundler, which the other checks cover.
  if (Number(version.split('.')[0]) >= 17) {
    await check(
      {
        id: `${prefix}/ssr-import`,
        title: `React ${version} SSR through import()`,
        expected: expectedHtml,
      },
      async () => {
        // React 17 has no "exports" map, so Node ESM cannot import react-dom/server by its bare
        // subpath. The renderer comes from require(); the app and the package load through ESM.
        const { createElement } = await import('react')
        const { renderToString } = require('react-dom/server')
        const { App } = await import('./src/react-app.js')
        return expectFlags(renderToString(createElement(App)))
      }
    )
  }
  const entry = writeEntry(
    'react-client.js',
    "import { App } from './react-app.js'\nconsole.log(App)\n"
  )
  await check(
    { id: `${prefix}/vite`, title: `React ${version} Vite production build`, expected: 'built' },
    () => buildOk(() => viteClientBuild(entry))
  )
  await check(
    {
      id: `${prefix}/webpack`,
      title: `React ${version} webpack production build`,
      expected: 'built',
    },
    () => buildOk(() => webpackBuild(entry))
  )
}

if (framework === 'vue') {
  await check(
    { id: `${prefix}/ssr`, title: `Vue ${version} SSR`, expected: expectedHtml },
    async () => {
      const { createSSRApp } = await import('vue')
      const { renderToString } = await import('vue/server-renderer')
      const { App } = await import('./src/vue-app.js')
      return expectFlags(await renderToString(createSSRApp(App)))
    }
  )
  const entry = writeEntry(
    'vue-client.js',
    "import { App } from './vue-app.js'\nconsole.log(App)\n"
  )
  await check(
    { id: `${prefix}/vite`, title: `Vue ${version} Vite production build`, expected: 'built' },
    () => buildOk(() => viteClientBuild(entry))
  )
}

if (framework === 'solid') {
  await check(
    {
      id: `${prefix}/ssr`,
      title: `Solid ${version} SSR through vite-plugin-solid`,
      expected: expectedHtml,
    },
    async () => expectFlags(await viteSsrRender(join(root, 'src', 'solid-ssr.jsx'), 'solid-ssr'))
  )
  const entry = writeEntry(
    'solid-client.jsx',
    "import { App } from './solid-app.jsx'\nconsole.log(App)\n"
  )
  await check(
    { id: `${prefix}/vite`, title: `Solid ${version} Vite production build`, expected: 'built' },
    () => buildOk(() => viteClientBuild(entry))
  )
}

if (framework === 'svelte') {
  await check(
    {
      id: `${prefix}/ssr`,
      title: `Svelte ${version} SSR through vite-plugin-svelte`,
      expected: expectedHtml,
    },
    async () => expectFlags(await viteSsrRender(join(root, 'src', 'svelte-ssr.js'), 'svelte-ssr'))
  )
  const entry = writeEntry(
    'svelte-client.js',
    "import { mount } from 'svelte'\nimport App from './App.svelte'\nconsole.log(mount, App)\n"
  )
  await check(
    { id: `${prefix}/vite`, title: `Svelte ${version} Vite production build`, expected: 'built' },
    () => buildOk(() => viteClientBuild(entry))
  )
}
