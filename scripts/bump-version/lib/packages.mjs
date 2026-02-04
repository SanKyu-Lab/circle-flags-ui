import { readFileSync } from 'node:fs'
import { readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

export const collectPackages = repoRoot => {
  const packagesDir = resolve(repoRoot, 'packages')
  const dirents = readdirSync(packagesDir, { withFileTypes: true })

  const packages = []
  for (const d of dirents) {
    if (!d.isDirectory()) continue

    const packageJsonPath = resolve(packagesDir, d.name, 'package.json')
    try {
      statSync(packageJsonPath)
    } catch {
      continue
    }

    const json = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    if (json.private) continue

    packages.push({
      slug: d.name,
      name: json.name,
      version: json.version,
      dir: `packages/${d.name}`,
      packageJsonPath,
      dependencies: json.dependencies || {},
      peerDependencies: json.peerDependencies || {},
    })
  }
  return packages
}
