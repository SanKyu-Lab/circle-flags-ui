import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { generateFlags } from './gen-flags.mjs'
import { isMain } from './lib/is-main.mjs'
import { syncExampleShared } from './sync-example-shared.mjs'
import { repoRootFromImportMeta } from './lib/repo-root.mjs'

const repoRoot = repoRootFromImportMeta(import.meta.url)

const hasAnyGeneratedFlags = async () => {
  const reactFlagsDir = join(repoRoot, 'packages/react/generated/flags')
  const reactIndex = join(reactFlagsDir, 'index.ts')
  if (!existsSync(reactFlagsDir) || !existsSync(reactIndex)) return false

  const entries = await readdir(reactFlagsDir)
  return entries.some(name => name.endsWith('.tsx') && name !== 'index.ts')
}

const hasCoreRegistry = () => {
  const registry = join(repoRoot, 'packages/core/src/generated/registry.ts')
  return existsSync(registry)
}

const main = async () => {
  await syncExampleShared()

  const hasFlags = await hasAnyGeneratedFlags()
  const hasCore = hasCoreRegistry()
  if (hasFlags && hasCore) {
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
