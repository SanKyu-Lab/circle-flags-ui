import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { writeFlagDeclarations } from './write-flag-declarations.mjs'

export const postbuildReact = () => {
  const clientDirective = "'use client';\n"
  for (const entryName of ['index.mjs', 'index.cjs']) {
    const entryPath = join(process.cwd(), 'dist', entryName)
    const content = readFileSync(entryPath, 'utf-8')

    if (!/^["']use client["'];/.test(content)) {
      writeFileSync(entryPath, clientDirective + content, 'utf-8')
    }
  }

  console.log('✅ Preserved React client boundary in published entries')

  const flagsDir = join(process.cwd(), 'dist/flags')

  try {
    const files = readdirSync(flagsDir)
    let processedCount = 0

    for (const file of files) {
      if (!file.endsWith('.cjs') && !file.endsWith('.mjs')) continue

      const filePath = join(flagsDir, file)
      const before = readFileSync(filePath, 'utf-8')
      const after = before.replace(/\bvar\s+/g, 'const ')
      if (before !== after) {
        writeFileSync(filePath, after, 'utf-8')
        processedCount++
      }
    }

    console.log(`✅ Post-process: Replaced 'var' with 'const' in ${processedCount} files`)
  } catch (error) {
    console.error('❌ Post-process failed:', error)
    process.exit(1)
  }

  writeFlagDeclarations(flagsDir)
}
