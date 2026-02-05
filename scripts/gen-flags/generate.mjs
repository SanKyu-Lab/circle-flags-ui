import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { lstat, mkdir, readFile, readdir, readlink, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'
import {
  CIRCLE_FLAGS_REPO,
  CORE_GENERATED_DIR,
  FLAGS_DIR,
  REACT_OUTPUT_DIR,
  SOLID_OUTPUT_DIR,
  VUE_OUTPUT_DIR,
} from './constants.mjs'
import { svgToReactComponent, svgToSolidComponent, svgToVueComponent } from './svg.mjs'
import { codeToComponentName } from './utils.mjs'
import { repoRootFromImportMeta } from '../lib/repo-root.mjs'

/**
 * Ensure circle-flags repository is available
 */
function ensureCircleFlagsRepo() {
  if (existsSync('.git')) {
    console.log('🔄 Attempting to initialize git submodule...')
    try {
      execSync('git submodule update --init --recursive --remote', { stdio: 'inherit' })
      console.log('✓ Git submodule initialized/updated\n')
    } catch {
      console.log('⚠️  Submodule initialization failed, will try cloning instead\n')
    }
  }

  if (!existsSync(FLAGS_DIR)) {
    if (!existsSync('circle-flags')) {
      console.log('📦 Cloning circle-flags repository...')
      execSync(`git clone --depth 1 ${CIRCLE_FLAGS_REPO}`, { stdio: 'inherit' })
    } else {
      throw new Error(
        `Directory 'circle-flags' exists but '${FLAGS_DIR}' not found. ` +
          `The repository may be corrupted. Please delete 'circle-flags/' and try again.`
      )
    }
  }

  if (!existsSync(FLAGS_DIR)) {
    throw new Error(
      `Failed to set up circle-flags repository. ` +
        `Expected directory '${FLAGS_DIR}' does not exist.`
    )
  }

  console.log('✓ circle-flags repository is ready\n')
}

const writeComponentsFromSvg = async (svgPath, { reactPath, vuePath, solidPath }, code) => {
  const svgContent = await readFile(svgPath, 'utf-8')
  const react = svgToReactComponent(svgContent, code)
  const vue = svgToVueComponent(svgContent, code)
  const solid = svgToSolidComponent(svgContent, code)

  await writeFile(reactPath, react.componentCode, 'utf-8')
  await writeFile(vuePath, vue.componentCode, 'utf-8')
  await writeFile(solidPath, solid.componentCode, 'utf-8')

  return {
    svgSize: react.svgSize,
    optimizedSize: react.optimizedSize,
  }
}

const writeAliasComponents = async (
  { reactPath, vuePath, solidPath },
  { componentName, targetCode, targetComponentName }
) => {
  const aliasContent = `export { ${targetComponentName} as ${componentName} } from './${targetCode}'\n`
  await writeFile(reactPath, aliasContent, 'utf-8')
  await writeFile(vuePath, aliasContent, 'utf-8')
  await writeFile(solidPath, aliasContent, 'utf-8')
}

/**
 * Main generation function
 */
export async function generateFlags() {
  process.chdir(repoRootFromImportMeta(import.meta.url))
  console.log('🚀 Starting optimized flag generation...\n')

  ensureCircleFlagsRepo()

  await mkdir(REACT_OUTPUT_DIR, { recursive: true })
  await mkdir(VUE_OUTPUT_DIR, { recursive: true })
  await mkdir(SOLID_OUTPUT_DIR, { recursive: true })
  await mkdir(CORE_GENERATED_DIR, { recursive: true })

  const files = await readdir(FLAGS_DIR)
  const svgFiles = files.filter(f => f.endsWith('.svg'))

  console.log(`📄 Found ${svgFiles.length} flag files\n`)

  const flags = []
  let totalOriginalSize = 0
  let totalOptimizedSize = 0

  for (const file of svgFiles) {
    const code = basename(file, '.svg')
    const svgPath = `${FLAGS_DIR}/${file}`

    const reactOutputPath = `${REACT_OUTPUT_DIR}/${code}.tsx`
    const vueOutputPath = `${VUE_OUTPUT_DIR}/${code}.ts`
    const solidOutputPath = `${SOLID_OUTPUT_DIR}/${code}.tsx`

    try {
      const stats = await lstat(svgPath)
      const componentName = codeToComponentName(code)

      if (stats.isSymbolicLink()) {
        const linkTarget = await readlink(svgPath)
        const targetCode = basename(linkTarget, '.svg').replace(/^other\//, '')
        const targetComponentName = codeToComponentName(targetCode)
        const targetFile = `${targetCode}.svg`

        if (svgFiles.includes(targetFile)) {
          await writeAliasComponents(
            {
              reactPath: reactOutputPath,
              vuePath: vueOutputPath,
              solidPath: solidOutputPath,
            },
            { componentName, targetCode, targetComponentName }
          )

          flags.push({
            code,
            componentName,
            svgSize: 0,
            optimizedSize: 0,
            aliasOf: targetCode,
          })

          process.stdout.write(`✓ ${componentName}: alias of ${targetComponentName}\r`)
          continue
        }
      }

      const { svgSize, optimizedSize } = await writeComponentsFromSvg(
        svgPath,
        {
          reactPath: reactOutputPath,
          vuePath: vueOutputPath,
          solidPath: solidOutputPath,
        },
        code
      )

      flags.push({
        code,
        componentName,
        svgSize,
        optimizedSize,
      })

      totalOriginalSize += svgSize
      totalOptimizedSize += optimizedSize

      const compression = (((svgSize - optimizedSize) / svgSize) * 100).toFixed(1)
      process.stdout.write(
        `✓ ${componentName}: ${svgSize}B → ${optimizedSize}B (${compression}% smaller)\r`
      )
    } catch (error) {
      console.error(`\n❌ Error processing ${code}:`, error)
    }
  }

  console.log(`\n\n✅ Generated ${flags.length} optimized flag components`)

  const sizedFlags = flags.filter(f => f.svgSize > 0 && f.optimizedSize > 0)
  const largestFlags = sizedFlags
    .slice()
    .sort((a, b) => b.optimizedSize - a.optimizedSize)
    .slice(0, 5)

  const mostCompressed = sizedFlags
    .slice()
    .sort(
      (a, b) =>
        (b.svgSize - b.optimizedSize) / b.svgSize - (a.svgSize - a.optimizedSize) / a.svgSize
    )
    .slice(0, 3)

  const indexContent = `// Auto-generated flag exports for tree-shaking
// Each flag can be imported individually: import { FlagUs } from '@sankyu/react-circle-flags'
//
// 📊 Package Statistics:
// • Total flags: ${flags.length}
// • Original SVG size: ${(totalOriginalSize / 1024).toFixed(1)}KB
// • Optimized size: ${(totalOptimizedSize / 1024).toFixed(1)}KB
// • Size reduction: ${(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100).toFixed(1)}%
//
// 🏆 Largest flags by optimized size: ${largestFlags.map(f => f.componentName).join(', ')}
// 🗜️  Most compressed: ${mostCompressed
    .map(
      f => `${f.componentName} (${(((f.svgSize - f.optimizedSize) / f.svgSize) * 100).toFixed(0)}%)`
    )
    .join(', ')}
//

${flags.map(f => `export { ${f.componentName} } from './${f.code}'`).join('\n')}

// Utility types for better TypeScript experience
export type FlagComponent = {
  width?: number | string
  height?: number | string
  className?: string
  title?: string
}
`

  await writeFile(`${REACT_OUTPUT_DIR}/index.ts`, indexContent, 'utf-8')
  console.log('✅ Generated enhanced index.ts with metadata\n')

  const vueIndexContent = `// Auto-generated flag exports for tree-shaking
// Each flag can be imported individually: import { FlagUs } from '@sankyu/vue-circle-flags'
//
// 📊 Package Statistics:
// • Total flags: ${flags.length}
// • Original SVG size: ${(totalOriginalSize / 1024).toFixed(1)}KB
// • Optimized size: ${(totalOptimizedSize / 1024).toFixed(1)}KB
// • Size reduction: ${(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100).toFixed(1)}%
//

${flags.map(f => `export { ${f.componentName} } from './${f.code}'`).join('\n')}
`

  await writeFile(`${VUE_OUTPUT_DIR}/index.ts`, vueIndexContent, 'utf-8')
  console.log('✅ Generated vue generated/flags/index.ts\n')

  const solidIndexContent = `// Auto-generated flag exports for tree-shaking
// Each flag can be imported individually: import { FlagUs } from '@sankyu/solid-circle-flags'
//
// 📊 Package Statistics:
// • Total flags: ${flags.length}
// • Original SVG size: ${(totalOriginalSize / 1024).toFixed(1)}KB
// • Optimized size: ${(totalOptimizedSize / 1024).toFixed(1)}KB
// • Size reduction: ${(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100).toFixed(1)}%
//

${flags.map(f => `export { ${f.componentName} } from './${f.code}'`).join('\n')}
`

  await writeFile(`${SOLID_OUTPUT_DIR}/index.ts`, solidIndexContent, 'utf-8')
  console.log('✅ Generated solid generated/flags/index.ts\n')

  const aliases = {}
  for (const flag of flags) {
    if (flag.aliasOf) aliases[flag.code] = flag.aliasOf
  }

  const registry = {}
  for (const flag of flags) {
    registry[flag.code] = flag.componentName
  }

  const coreRegistryContent = `export const FLAG_REGISTRY = ${JSON.stringify(registry, null, 2)} as const

${Object.keys(aliases).length > 0 ? `export const FLAG_ALIASES = ${JSON.stringify(aliases, null, 2)} as const\n` : ''}
export type FlagCode = keyof typeof FLAG_REGISTRY
`

  await writeFile(`${CORE_GENERATED_DIR}/registry.ts`, coreRegistryContent, 'utf-8')
  console.log('✅ Generated core/src/generated/registry.ts\n')

  console.log('🎉 Flag generation complete!')
  console.log(`\n📊 Optimization Summary:`)
  console.log(`   • Total flags: ${flags.length}`)
  console.log(`   • Original SVG size: ${(totalOriginalSize / 1024).toFixed(1)}KB`)
  console.log(`   • Optimized size: ${(totalOptimizedSize / 1024).toFixed(1)}KB`)
  console.log(
    `   • Size reduction: ${(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100).toFixed(1)}%`
  )
  console.log(`   • Space saved: ${((totalOriginalSize - totalOptimizedSize) / 1024).toFixed(1)}KB`)
  console.log(`\n📋 Top 5 largest flags:`)
  largestFlags.forEach((flag, i) => {
    console.log(`   ${i + 1}. ${flag.componentName}: ${(flag.optimizedSize / 1024).toFixed(2)}KB`)
  })
}
