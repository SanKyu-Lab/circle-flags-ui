import { defineConfig } from 'tsup'
import { outExtensionMjsCjs } from '../../scripts/tsup/shared.ts'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: false,
  clean: true,
  treeshake: true,
  outExtension: outExtensionMjsCjs,
})
