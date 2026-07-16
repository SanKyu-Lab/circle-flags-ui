import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { writeFlagDeclarations } from './write-flag-declarations.mjs'

const replaceVarWithConst = filePath => {
  const content = readFileSync(filePath, 'utf-8')
  const updated = content.replace(/\bvar\s+/g, 'const ')
  if (content !== updated) writeFileSync(filePath, updated, 'utf-8')
}

export const postbuildVue = () => {
  const flagsDir = join(process.cwd(), 'dist/flags')
  if (existsSync(flagsDir)) {
    for (const file of readdirSync(flagsDir)) {
      if (!file.endsWith('.cjs') && !file.endsWith('.mjs')) continue
      replaceVarWithConst(join(flagsDir, file))
    }

    writeFlagDeclarations(flagsDir)
  }

  const distDir = join(process.cwd(), 'dist')
  for (const file of ['index.cjs', 'index.mjs']) {
    const filePath = join(distDir, file)
    if (existsSync(filePath)) replaceVarWithConst(filePath)
  }
}
