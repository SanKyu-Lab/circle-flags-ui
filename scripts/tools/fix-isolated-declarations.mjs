// Fixes isolatedDeclarations issues in generated React flag components.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { isMain } from '../lib/is-main.mjs'
import { repoRootFromImportMeta } from '../lib/repo-root.mjs'

const repoRoot = repoRootFromImportMeta(import.meta.url)

const fixFile = filePath => {
  let content = readFileSync(filePath, 'utf-8')

  const arrowIndex = content.indexOf('}) => (')
  if (arrowIndex !== -1) {
    content =
      content.slice(0, arrowIndex) + '}): React.ReactElement => (' + content.slice(arrowIndex + 7)
  }

  content = content.replace(
    /(Flag\w+)\.displayName = '(Flag\w+)'/g,
    `Object.defineProperty($1, 'displayName', { value: '$2' })`
  )

  if (!content.includes('import React')) {
    content = content.replace(
      "import type { SVGProps } from 'react'",
      "import React from 'react'\nimport type { SVGProps } from 'react'"
    )
  }

  writeFileSync(filePath, content, 'utf-8')
  console.log(`Fixed: ${filePath}`)
}

export const fixIsolatedDeclarations = ({ flagsDir } = {}) => {
  const targetDir = flagsDir ?? join(repoRoot, 'packages/react/generated/flags')
  const files = readdirSync(targetDir).filter(f => f.endsWith('.tsx'))

  let fixed = 0
  for (const file of files) {
    const filePath = join(targetDir, file)
    fixFile(filePath)
    fixed++
  }

  console.log(`\nFixed ${fixed} files`)
}

if (isMain(import.meta.url)) {
  fixIsolatedDeclarations()
}
