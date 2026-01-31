import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const replaceVarWithConst = filePath => {
  const content = readFileSync(filePath, 'utf-8')
  const newContent = content.replace(/\bvar\s+/g, 'const ')
  if (content !== newContent) writeFileSync(filePath, newContent, 'utf-8')
}

const postProcessFlags = () => {
  const flagsDir = join(process.cwd(), 'dist/flags')
  if (!existsSync(flagsDir)) return

  for (const file of readdirSync(flagsDir)) {
    if (!file.endsWith('.cjs') && !file.endsWith('.mjs')) continue
    replaceVarWithConst(join(flagsDir, file))
  }
}

const postProcessIndex = () => {
  const distDir = join(process.cwd(), 'dist')
  for (const file of ['index.cjs', 'index.mjs']) {
    const filePath = join(distDir, file)
    if (existsSync(filePath)) replaceVarWithConst(filePath)
  }
}

const cleanupTypes = () => {
  // tsup/typescript may emit both .d.ts and .d.cts; we only ship .d.ts
  const dctsPath = join(process.cwd(), 'dist/index.d.cts')
  if (existsSync(dctsPath)) unlinkSync(dctsPath)
}

postProcessFlags()
postProcessIndex()
cleanupTypes()
