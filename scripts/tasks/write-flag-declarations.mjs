import { readdirSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { codeToComponentName } from '../gen-flags/utils.mjs'

export const writeFlagDeclarations = (flagsDir = join(process.cwd(), 'dist', 'flags')) => {
  const moduleFiles = readdirSync(flagsDir).filter(file => file.endsWith('.mjs'))

  for (const file of moduleFiles) {
    const code = basename(file, '.mjs')
    const declarationPath = join(flagsDir, `${code}.d.ts`)
    const commonJsDeclarationPath = join(flagsDir, `${code}.d.cts`)

    if (code === 'index') {
      writeFileSync(declarationPath, "export * from '../index.js'\n", 'utf-8')
      writeFileSync(commonJsDeclarationPath, "export * from '../index.cjs'\n", 'utf-8')
      continue
    }

    const componentName = codeToComponentName(code)
    writeFileSync(declarationPath, `export { ${componentName} } from '../index.js'\n`, 'utf-8')
    writeFileSync(
      commonJsDeclarationPath,
      `export { ${componentName} } from '../index.cjs'\n`,
      'utf-8'
    )
  }

  console.log(`✅ Generated ${moduleFiles.length} precise ESM and CJS per-flag declarations`)
}
