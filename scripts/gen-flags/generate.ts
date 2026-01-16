import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { CIRCLE_FLAGS_REPO, CORE_GENERATED_DIR, FLAGS_DIR, REACT_OUTPUT_DIR } from './constants'
import { buildNameMappings, getNameFromMappings } from './country-data'
import { getCountryName } from './names'
import { svgToReactComponent } from './svg'
import type { FlagMetadata } from './types'
import { codeToComponentName } from './utils'

/**
 * Ensure circle-flags repository is available
 */
function ensureCircleFlagsRepo() {
  // First, try to initialize/update as a git submodule
  if (existsSync('.git')) {
    console.log('🔄 Attempting to initialize git submodule...')
    try {
      execSync('git submodule update --init --recursive --remote', { stdio: 'inherit' })
      console.log('✓ Git submodule initialized/updated\n')
    } catch {
      console.log('⚠️  Submodule initialization failed, will try cloning instead\n')
    }
  }

  // Verify the flags directory exists and is not empty
  if (!existsSync(FLAGS_DIR)) {
    // If circle-flags doesn't exist, clone it
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

  // Final verification
  if (!existsSync(FLAGS_DIR)) {
    throw new Error(
      `Failed to set up circle-flags repository. ` +
        `Expected directory '${FLAGS_DIR}' does not exist.`
    )
  }

  console.log('✓ circle-flags repository is ready\n')
}

/**
 * Main generation function
 */
export async function generateFlags() {
  console.log('🚀 Starting optimized flag generation...\n')

  ensureCircleFlagsRepo()

  console.log('📊 Building name mappings from country-region-data...')
  const nameMappings = buildNameMappings()
  console.log(
    `✅ Built mappings: ${Object.keys(nameMappings.countryNames).length} countries, ${Object.keys(nameMappings.subdivisionNames).length} subdivisions\n`
  )

  await mkdir(REACT_OUTPUT_DIR, { recursive: true })
  await mkdir(CORE_GENERATED_DIR, { recursive: true })

  const files = await readdir(FLAGS_DIR)
  const svgFiles = files.filter(f => f.endsWith('.svg'))

  console.log(`📄 Found ${svgFiles.length} flag files\n`)

  const flags: FlagMetadata[] = []
  let totalOriginalSize = 0
  let totalOptimizedSize = 0

  for (const file of svgFiles) {
    const code = basename(file, '.svg')
    const svgPath = `${FLAGS_DIR}/${file}`
    const outputPath = `${REACT_OUTPUT_DIR}/${code}.tsx`

    try {
      const svgContent = await readFile(svgPath, 'utf-8')
      const { componentCode, svgSize, optimizedSize } = svgToReactComponent(svgContent, code)

      await writeFile(outputPath, componentCode, 'utf-8')

      const componentName = codeToComponentName(code)
      const nameFromData = getNameFromMappings(code, nameMappings)
      const displayName = nameFromData || getCountryName(code)

      flags.push({
        code,
        name: displayName,
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

  // Generate enhanced index file with metadata
  const largestFlags = flags.sort((a, b) => b.optimizedSize - a.optimizedSize).slice(0, 5)

  const mostCompressed = flags
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
// 🗜️  Most compressed: ${mostCompressed.map(f => `${f.componentName} (${(((f.svgSize - f.optimizedSize) / f.svgSize) * 100).toFixed(0)}%)`).join(', ')}
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

  const coreRegistryContent = `export const FLAG_REGISTRY = ${JSON.stringify(
    flags.reduce((acc, f) => ({ ...acc, [f.code]: f.componentName }), {}),
    null,
    2
  )} as const

export type FlagCode = keyof typeof FLAG_REGISTRY
`

  await writeFile(`${CORE_GENERATED_DIR}/registry.ts`, coreRegistryContent, 'utf-8')
  console.log('✅ Generated core/src/generated/registry.ts\n')

  const coreNamesContent = `export const COUNTRY_NAMES = ${JSON.stringify(nameMappings.countryNames, null, 2)} as const

export const SUBDIVISION_NAMES = ${JSON.stringify(nameMappings.subdivisionNames, null, 2)} as const
`

  await writeFile(`${CORE_GENERATED_DIR}/names.ts`, coreNamesContent, 'utf-8')
  console.log('✅ Generated core/src/generated/names.ts\n')

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
