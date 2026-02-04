import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const hasRepoMarkers = dir => {
  return existsSync(resolve(dir, 'pnpm-workspace.yaml')) && existsSync(resolve(dir, 'package.json'))
}

export const findRepoRoot = startDir => {
  let current = resolve(startDir)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (hasRepoMarkers(current)) return current
    const parent = dirname(current)
    if (parent === current) return startDir
    current = parent
  }
}

export const repoRootFromImportMeta = importMetaUrl => {
  const dir = dirname(fileURLToPath(importMetaUrl))
  return findRepoRoot(dir)
}
