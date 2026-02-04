import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export const postbuildReact = () => {
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

  try {
    const files = readdirSync(flagsDir)
    let removedCount = 0

    for (const file of files) {
      if (!file.endsWith('.d.ts')) continue
      unlinkSync(join(flagsDir, file))
      removedCount++
    }

    console.log(`✅ Removed ${removedCount} redundant .d.ts files in dist/flags/`)
  } catch (error) {
    console.error('⚠️  Failed to cleanup dist/flags/*.d.ts:', error)
  }

  const dctsPath = join(process.cwd(), 'dist/index.d.cts')
  if (existsSync(dctsPath)) {
    unlinkSync(dctsPath)
    console.log('✅ Removed redundant index.d.cts')
  }
}
