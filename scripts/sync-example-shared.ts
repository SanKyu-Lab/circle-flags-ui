import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

const GENERATED_BANNER = `// DO NOT CHANGE ANY PART OF THIS FILE
// This file is auto-generated from examples/shared/lib.

`

const EXAMPLES_DIR = join(process.cwd(), 'examples')
const SHARED_LIB_DIR = join(EXAMPLES_DIR, 'shared', 'lib')
const DEST_SUBDIR = join('src', 'libs', 'shared')

async function listFilesRecursively(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const results: string[] = []

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

function shouldCopyFile(filePath: string): boolean {
  return filePath.endsWith('.ts') || filePath.endsWith('.tsx')
}

async function writeGeneratedFile(destPath: string, sourceContent: string) {
  await mkdir(dirname(destPath), { recursive: true })
  await writeFile(destPath, GENERATED_BANNER + sourceContent, 'utf8')
}

export async function syncExampleShared() {
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

syncExampleShared().catch(error => {
  console.error('❌ Failed to sync examples shared lib:', error)
  process.exitCode = 1
})
