#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { Command } from 'commander'
import { isMain } from './lib/is-main.mjs'
import { repoRootFromImportMeta } from './lib/repo-root.mjs'

const repoRoot = repoRootFromImportMeta(import.meta.url)

const run = (cmd, args, options = {}) => {
  const res = spawnSync(cmd, args, {
    stdio: 'inherit',
    cwd: repoRoot,
    ...options,
  })
  if (res.status !== 0) process.exit(res.status ?? 1)
}

const runPnpm = args => run('pnpm', args)

const taskPostinstall = async () => {
  const { runGen } = await import('./gen.mjs')
  await runGen()
}

const taskPrebuild = async () => {
  const { generateFlags } = await import('./gen-flags.mjs')
  await generateFlags()
}

const taskEnsureGenerated = async () => {
  const { ensureGenerated } = await import('./tasks/ensure-generated.mjs')
  await ensureGenerated()
}

const taskBuildCore = async () => {
  runPnpm(['-C', repoRoot, '-F', '@sankyu/circle-flags-core', 'run', 'build'])
}

const taskPostbuild = async pkg => {
  switch (pkg) {
    case 'react': {
      const { postbuildReact } = await import('./tasks/postbuild-react.mjs')
      await postbuildReact()
      return
    }
    case 'solid': {
      const { postbuildSolid } = await import('./tasks/postbuild-solid.mjs')
      await postbuildSolid()
      return
    }
    case 'vue': {
      const { postbuildVue } = await import('./tasks/postbuild-vue.mjs')
      await postbuildVue()
      return
    }
    default:
      throw new Error(`Unknown --pkg for postbuild: ${pkg}`)
  }
}

export const runLifeCycle = async argv => {
  const program = new Command()
    .name('life-cycle')
    .description('Unified entry for npm/pnpm lifecycle scripts (pre*/post*)')
    .argument('<task>', 'Task name')
    .option('--pkg <pkg>', 'Package slug: react|vue|solid|core')
    .parse(argv)

  const opts = program.opts()
  const task = program.args[0]

  switch (task) {
    case 'postinstall':
      await taskPostinstall()
      return
    case 'prebuild':
      await taskPrebuild()
      return
    case 'ensure-generated':
      await taskEnsureGenerated()
      return
    case 'build-core':
      await taskBuildCore()
      return
    case 'postbuild':
      await taskPostbuild(opts.pkg)
      return
    default:
      throw new Error(`Unknown task: ${task}`)
  }
}

if (isMain(import.meta.url)) {
  runLifeCycle(process.argv).catch(error => {
    console.error('❌ life-cycle failed:', error)
    process.exitCode = 1
  })
}
