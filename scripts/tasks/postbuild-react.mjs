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

  // Generate per-flag .d.ts files so the `./flags/*` subpath exports are
  // fully typed. tsup's dts rollup produces broken chunks for the per-flag
  // entries (see packages/react/tsup.config.ts), so declarations are emitted
  // here from the generated sources instead. Any stray tsup-emitted .d.ts is
  // overwritten in the process.
  try {
    const generatedDir = join(process.cwd(), 'generated/flags')
    const sources = readdirSync(generatedDir).filter(f => f.endsWith('.tsx'))
    let declared = 0

    for (const file of sources) {
      const code = file.replace(/\.tsx$/, '')
      const source = readFileSync(join(generatedDir, file), 'utf-8')

      // Alias flags re-export their target: keep the same shape in the .d.ts
      // so TypeScript resolves through the sibling declaration.
      const alias = source.match(/^export \{ (\w+) as (\w+) \} from '\.\/([\w-]+)'/)

      let dts
      if (alias) {
        dts = `export { ${alias[1]} as ${alias[2]} } from './${alias[3]}'\n`
      } else {
        const name = source.match(/export const (Flag\w+)/)?.[1]
        if (!name) {
          throw new Error(`Could not find flag export in generated/flags/${file}`)
        }
        dts = `import type { ReactElement, SVGProps } from 'react'
import type { FlagComponentProps } from '@sankyu/circle-flags-core'
export declare const ${name}: (
  props: SVGProps<SVGSVGElement> & FlagComponentProps
) => ReactElement
`
      }

      writeFileSync(join(flagsDir, `${code}.d.ts`), dts, 'utf-8')
      declared++
    }

    console.log(`✅ Generated ${declared} per-flag .d.ts files in dist/flags/`)
  } catch (error) {
    console.error('❌ Failed to generate dist/flags/*.d.ts:', error)
    process.exit(1)
  }

  const dctsPath = join(process.cwd(), 'dist/index.d.cts')
  if (existsSync(dctsPath)) {
    unlinkSync(dctsPath)
    console.log('✅ Removed redundant index.d.cts')
  }
}
