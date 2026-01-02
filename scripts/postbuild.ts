import { readdirSync, readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { generateFlagsDts } from './generate-dts.ts'

/**
 * Post-processing script: Replace var with const in dist/flags
 *
 * This is because esbuild uses var in minify mode to optimize byte size,
 * but we prefer to use modern const/let syntax
 */
function postProcessFlags() {
  const flagsDir = join(process.cwd(), 'dist/flags')

  try {
    const files = readdirSync(flagsDir)
    let processedCount = 0

    for (const file of files) {
      if (!file.endsWith('.cjs') && !file.endsWith('.mjs')) {
        continue
      }

      const filePath = join(flagsDir, file)
      let content = readFileSync(filePath, 'utf-8')

      // Replace var with const
      const newContent = content.replace(/\bvar\s+/g, 'const ')

      if (content !== newContent) {
        writeFileSync(filePath, newContent, 'utf-8')
        processedCount++
      }
    }

    console.log(`✅ Post-process: Replaced 'var' with 'const' in ${processedCount} files`)
  } catch (error) {
    console.error('❌ Post-process failed:', error)
    process.exit(1)
  }
}

async function run() {
  postProcessFlags()

  try {
    await generateFlagsDts()
    console.log('✅ Generated flag d.ts files')
  } catch (error) {
    console.error('❌ Failed to generate d.ts:', error)
    process.exit(1)
  }

  // Remove redundant .d.cts file (same as .d.ts)
  const dctsPath = join(process.cwd(), 'dist/index.d.cts')
  if (existsSync(dctsPath)) {
    unlinkSync(dctsPath)
    console.log('✅ Removed redundant index.d.cts')
  }
}

run()
