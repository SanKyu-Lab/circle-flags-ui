import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { generateFlags } from './gen-flags.ts'
import { syncExampleShared } from './sync-example-shared.ts'

const FLAGS_DIR = join(process.cwd(), 'generated/flags')
const FLAGS_INDEX = join(FLAGS_DIR, 'index.ts')

async function hasGeneratedFlags() {
  if (!existsSync(FLAGS_DIR) || !existsSync(FLAGS_INDEX)) {
    return false
  }

  const entries = await readdir(FLAGS_DIR)
  return entries.some(name => name.endsWith('.tsx') && name !== 'index.ts')
}

async function main() {
  await syncExampleShared()

  const hasFlags = await hasGeneratedFlags()
  if (hasFlags) {
    console.log('✅ Detected generated/flags, skipping generation')
    return
  }

  console.log('⚙️ Did not detect generated/flags, starting generation...')
  await generateFlags()
}

main().catch(error => {
  console.error('❌ Generation failed:', error)
  process.exitCode = 1
})
