import { emitDts } from 'svelte2tsx'
import { resolve } from 'node:path'

try {
  await emitDts({
    declarationDir: resolve('dist-test'),
    svelteShimsPath: resolve('node_modules/svelte2tsx/svelte-shims-v4.d.ts'),
    libRoot: resolve('src'),
    tsconfig: resolve('tsconfig.json'),
  })
  console.log('emitDts completed')
} catch (e) {
  console.error('emitDts error:', e)
}
