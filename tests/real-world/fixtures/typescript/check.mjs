// Type-checks one consumer per package under every module resolution mode the installed
// TypeScript supports. Each consumer uses @ts-expect-error for props that must be rejected,
// so declarations that fail to resolve or degrade to `any` both fail the check.
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { check } from './_lib/report.mjs'

const require = createRequire(import.meta.url)
const tsVersion = JSON.parse(
  readFileSync(require.resolve('typescript/package.json'), 'utf8')
).version
const tsMajor = Number(tsVersion.split('.')[0])

const modes = {
  bundler: { module: 'esnext', moduleResolution: 'bundler' },
  node16: { module: 'node16', moduleResolution: 'node16' },
  // TypeScript 7 removed node10 resolution; TypeScript 6 still runs it behind ignoreDeprecations.
  ...(tsMajor < 7
    ? {
        node10: {
          module: 'commonjs',
          moduleResolution: 'node10',
          ...(tsMajor === 6 ? { ignoreDeprecations: '6.0' } : {}),
        },
      }
    : {}),
}

const consumers = {
  react: ['src/react.ts'],
  vue: ['src/vue.ts'],
  solid: ['src/solid.ts'],
  commonjs: ['src/commonjs.cts'],
}

const ownDiagnostics = output =>
  output
    .split('\n')
    .filter(
      line => /error TS\d+/.test(line) && (line.startsWith('src/') || line.includes('@sankyu'))
    )

for (const [modeName, mode] of Object.entries(modes)) {
  for (const [consumerName, files] of Object.entries(consumers)) {
    // A .cts file only means CommonJS under node16; bundler resolution has no CommonJS mode.
    if (consumerName === 'commonjs' && modeName === 'bundler') continue
    const configPath = `tsconfig.${consumerName}.${modeName}.json`
    writeFileSync(
      configPath,
      JSON.stringify({
        compilerOptions: { ...mode, strict: true, noEmit: true, skipLibCheck: false, types: [] },
        files,
      })
    )
    await check(
      {
        id: `typescript-${tsVersion}/${consumerName}-${modeName}`,
        title: `tsc ${tsVersion}, ${consumerName} consumer, moduleResolution ${mode.moduleResolution}`,
        expected: 'no diagnostics in the consumer or @sankyu declarations',
      },
      async () => {
        const result = spawnSync('node_modules/.bin/tsc', ['-p', configPath], { encoding: 'utf8' })
        if (result.error) throw result.error
        const diagnostics = ownDiagnostics(`${result.stdout}${result.stderr}`)
        return {
          actual: diagnostics.length === 0 ? 'clean' : `${diagnostics.length}: ${diagnostics[0]}`,
          pass: diagnostics.length === 0,
        }
      }
    )
  }
}

// svelte-check uses the TypeScript JavaScript API, which TypeScript 7 no longer ships.
if (tsMajor < 7) {
  const svelteCheck = dir => {
    writeFileSync(
      `${dir}/tsconfig.json`,
      JSON.stringify({
        compilerOptions: {
          module: 'esnext',
          moduleResolution: 'bundler',
          strict: true,
          noEmit: true,
          verbatimModuleSyntax: true,
        },
        include: ['*.svelte'],
      })
    )
    const result = spawnSync(
      'node_modules/.bin/svelte-check',
      ['--tsconfig', `${dir}/tsconfig.json`, '--output', 'machine'],
      {
        encoding: 'utf8',
      }
    )
    if (result.error) throw result.error
    const output = `${result.stdout}${result.stderr}`
    if (!/COMPLETED \d+ FILES \d+ ERRORS/.test(output))
      throw new Error(output.trim().split('\n').at(-1))
    // Count errors in the consumer and in @sankyu declarations only. Newer svelte releases ship
    // declarations that need DOM types older TypeScript versions lack (VideoFrame in 5.0).
    const errors = output.split('\n').filter(line => {
      const file = / ERROR "([^"]+)"/.exec(line)?.[1]
      return file !== undefined && (!file.includes('node_modules') || file.includes('@sankyu'))
    })
    return { count: errors.length, first: errors[0] ?? '' }
  }

  await check(
    {
      id: `typescript-${tsVersion}/svelte-valid`,
      title: `svelte-check with tsc ${tsVersion}, valid usage`,
      expected: '0 errors',
    },
    async () => {
      const { count, first } = svelteCheck('svelte/valid')
      return {
        actual: count === 0 ? '0 errors' : `${count} errors: ${first.slice(0, 160)}`,
        pass: count === 0,
      }
    }
  )
  await check(
    {
      id: `typescript-${tsVersion}/svelte-invalid`,
      title: `svelte-check with tsc ${tsVersion}, invalid props`,
      expected: '2 errors',
    },
    async () => {
      const { count } = svelteCheck('svelte/invalid')
      return { actual: `${count} errors`, pass: count === 2 }
    }
  )
}
