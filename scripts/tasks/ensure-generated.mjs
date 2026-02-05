import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

const requiredFiles = [resolve(rootDir, 'packages/core/src/generated/registry.ts')]

export const ensureGenerated = () => {
  const hasAllGeneratedFiles = requiredFiles.every(p => existsSync(p))

  if (hasAllGeneratedFiles) return

  const result = spawnSync('pnpm', ['-w', 'run', 'gen:flags'], {
    stdio: 'inherit',
    cwd: rootDir,
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}
