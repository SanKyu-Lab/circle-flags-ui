import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import {
  CORE_GENERATED_DIR,
  REACT_OUTPUT_DIR,
  SOLID_OUTPUT_DIR,
  SVELTE_OUTPUT_DIR,
  VUE_OUTPUT_DIR,
} from './gen-flags/constants.mjs'
import { generateFlags } from './gen-flags.mjs'
import { isMain } from './lib/is-main.mjs'
import { syncExampleShared } from './sync-example-shared.mjs'
import { repoRootFromImportMeta } from './lib/repo-root.mjs'

const repoRoot = repoRootFromImportMeta(import.meta.url)

const hasReactFlags = async () => {
  const dir = join(repoRoot, REACT_OUTPUT_DIR)
  const index = join(dir, 'index.ts')
  if (!existsSync(dir) || !existsSync(index)) return false
  const entries = await readdir(dir)
  return entries.some(name => name.endsWith('.tsx') && name !== 'index.ts')
}

const hasFrameworkFlags = (dir, ext) => {
  const index = join(repoRoot, dir, `index.${ext}`)
  return existsSync(index)
}

const hasCoreRegistry = () => {
  return existsSync(join(repoRoot, CORE_GENERATED_DIR, 'registry.ts'))
}

const hasAllGeneratedFlags = async () => {
  const hasReact = await hasReactFlags()
  const hasVue = hasFrameworkFlags(VUE_OUTPUT_DIR, 'ts')
  const hasSolid = hasFrameworkFlags(SOLID_OUTPUT_DIR, 'ts')
  const hasSvelte = hasFrameworkFlags(SVELTE_OUTPUT_DIR, 'ts')
  return hasReact && hasVue && hasSolid && hasSvelte && hasCoreRegistry()
}

const main = async () => {
  await syncExampleShared()

  if (await hasAllGeneratedFlags()) {
    console.log('✅ Detected generated flags, skipping generation')
    return
  }

  console.log('⚙️ Did not detect generated flags, starting generation...')
  await generateFlags()
}

export const runGen = main

if (isMain(import.meta.url)) {
  main().catch(error => {
    console.error('❌ Generation failed:', error)
    process.exitCode = 1
  })
}
