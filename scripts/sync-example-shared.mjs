import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { isMain } from './lib/is-main.mjs'
import { repoRootFromImportMeta } from './lib/repo-root.mjs'

const GENERATED_BANNER = `// DO NOT CHANGE ANY PART OF THIS FILE
// This file is auto-generated from examples/shared/lib.

`

const defaultRepoRoot = repoRootFromImportMeta(import.meta.url)
const EXAMPLES_DIR = join(defaultRepoRoot, 'examples')
const SHARED_LIB_DIR = join(EXAMPLES_DIR, 'shared', 'lib')
const DEST_SUBDIR = join('src', 'libs', 'shared')

const listFilesRecursively = async dir => {
  const entries = await readdir(dir, { withFileTypes: true })
  const results = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...(await listFilesRecursively(fullPath)))
      continue
    }

    if (entry.isFile()) {
      results.push(fullPath)
    }
  }

  return results
}

const shouldCopyFile = filePath => filePath.endsWith('.ts') || filePath.endsWith('.tsx')

const writeGeneratedFile = async (destPath, sourceContent) => {
  await mkdir(dirname(destPath), { recursive: true })
  await writeFile(destPath, GENERATED_BANNER + sourceContent, 'utf8')
}

export const syncExampleShared = async () => {
  const sourceFiles = (await listFilesRecursively(SHARED_LIB_DIR)).filter(shouldCopyFile)

  const exampleEntries = await readdir(EXAMPLES_DIR, { withFileTypes: true })
  const exampleDirs = exampleEntries
    .filter(entry => entry.isDirectory() && entry.name.startsWith('example-'))
    .map(entry => join(EXAMPLES_DIR, entry.name))

  for (const exampleDir of exampleDirs) {
    const destRoot = join(exampleDir, DEST_SUBDIR)

    await rm(destRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 })
    await mkdir(destRoot, { recursive: true })

    for (const filePath of sourceFiles) {
      const fileStats = await stat(filePath)
      if (!fileStats.isFile()) continue

      const rel = relative(SHARED_LIB_DIR, filePath)
      const destPath = join(destRoot, rel)
      const content = await readFile(filePath, 'utf8')
      await writeGeneratedFile(destPath, content)
    }
  }
}

if (isMain(import.meta.url)) {
  syncExampleShared().catch(error => {
    console.error('❌ Failed to sync examples shared lib:', error)
    process.exitCode = 1
  })
}
