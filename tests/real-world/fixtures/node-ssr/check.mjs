// Loads the precompiled packages in plain Node through import and require, then renders flags
// on the server with each framework's renderer. FlagAc is an alias of FlagShAc and must keep
// its own default title.
import { createRequire } from 'node:module'
import { check } from './_lib/report.mjs'

const require = createRequire(import.meta.url)

// The CJS checks load the framework through require() as well, so both sides share one copy of
// the framework runtime, as they would in a CommonJS app.
const loaders = {
  esm: specifier => import(specifier),
  cjs: async specifier => require(specifier),
}

const expectFlags = html => {
  const svgCount = (html.match(/<svg/g) ?? []).length
  const bodies = ['cf-us-a', 'cf-jp-a', 'cf-sh-ac-a'].filter(id => html.includes(id))
  const aliasTitle = html.includes('aria-label="AC"')
  return {
    actual: `${svgCount} <svg>, bodies ${bodies.join('/') || 'none'}, alias title ${aliasTitle ? 'AC' : 'not AC'}`,
    pass: svgCount === 3 && bodies.length === 3 && aliasTitle,
  }
}
const expected = 'FlagUs, DynamicFlag jp and FlagAc render, FlagAc titled AC'

const renderers = {
  react: async (mod, load) => {
    const { createElement } = await load('react')
    const { renderToString } = await load('react-dom/server')
    return renderToString(
      createElement(
        'div',
        null,
        createElement(mod.FlagUs),
        createElement(mod.DynamicFlag, { code: 'jp' }),
        createElement(mod.FlagAc)
      )
    )
  },
  vue: async (mod, load) => {
    const { createSSRApp, h } = await load('vue')
    const { renderToString } = await load('vue/server-renderer')
    const app = createSSRApp({
      render: () => h('div', [h(mod.FlagUs), h(mod.DynamicFlag, { code: 'jp' }), h(mod.FlagAc)]),
    })
    return renderToString(app)
  },
  solid: async (mod, load) => {
    const { createComponent, renderToString } = await load('solid-js/web')
    return renderToString(() => [
      createComponent(mod.FlagUs, {}),
      createComponent(mod.DynamicFlag, { code: 'jp' }),
      createComponent(mod.FlagAc, {}),
    ])
  },
}

for (const name of ['react', 'vue', 'solid']) {
  const pkg = `@sankyu/${name}-circle-flags`
  for (const [entry, exportName] of [
    [pkg, 'FlagUs'],
    [`${pkg}/flags/us`, 'FlagUs'],
    [`${pkg}/meta`, 'buildMeta'],
  ]) {
    for (const [format, load] of Object.entries(loaders)) {
      await check(
        {
          id: `node-ssr/${name}-${format}${entry.slice(pkg.length) || '/'}`,
          title: `${format === 'esm' ? 'import' : 'require'}('${entry}')`,
          expected: `${exportName} exported`,
        },
        async () => {
          const mod = await load(entry)
          return {
            actual: `${exportName} is ${typeof mod[exportName]}`,
            pass: mod[exportName] !== undefined,
          }
        }
      )
    }
  }

  for (const [format, load] of Object.entries(loaders)) {
    await check(
      { id: `node-ssr/${name}-${format}-render`, title: `${name} SSR through ${format}`, expected },
      async () => expectFlags(await renderers[name](await load(pkg), load))
    )
  }
}
