import { existsSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

export const postbuildCore = () => {
  const dctsPath = join(process.cwd(), 'dist', 'index.d.cts')
  if (!existsSync(dctsPath)) return

  unlinkSync(dctsPath)
  console.log('✅ Removed redundant index.d.cts')
}

postbuildCore()
