#!/usr/bin/env node
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const distDir = 'dist'

/**
 * Post-build script to ensure proper JSX handling in Solid.js components
 */
async function postBuild() {
  console.log('🔧 Running Solid.js postbuild...')

  const distFlagsDir = join(distDir, 'flags')
  const files = await readdir(distFlagsDir)

  for (const file of files) {
    if (file.endsWith('.mjs') || file.endsWith('.cjs')) {
      const filePath = join(distFlagsDir, file)
      let content = await readFile(filePath, 'utf-8')

      // Ensure JSX imports are present in the bundled files
      if (content.includes('import {') && !content.includes('solid-js/web')) {
        // Add necessary imports if missing
        content = `import { template as _$template } from "solid-js/web";\n${content}`
        await writeFile(filePath, content, 'utf-8')
      }
    }
  }

  console.log('✅ Solid.js postbuild complete\n')
}

postBuild().catch(console.error)
