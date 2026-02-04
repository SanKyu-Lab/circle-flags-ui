import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export const postbuildSolid = async () => {
  console.log('🔧 Running Solid.js postbuild...')

  const distFlagsDir = join('dist', 'flags')
  const files = await readdir(distFlagsDir)

  for (const file of files) {
    if (!file.endsWith('.mjs') && !file.endsWith('.cjs')) continue

    const filePath = join(distFlagsDir, file)
    const content = await readFile(filePath, 'utf-8')

    if (!content.includes('import {') || content.includes('solid-js/web')) continue

    const updated = `import { template as _$template } from "solid-js/web";\n${content}`
    await writeFile(filePath, updated, 'utf-8')
  }

  console.log('✅ Solid.js postbuild complete\n')
}
