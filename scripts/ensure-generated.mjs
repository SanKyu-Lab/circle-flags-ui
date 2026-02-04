import { isMain } from './lib/is-main.mjs'
import { ensureGenerated } from './tasks/ensure-generated.mjs'

export { ensureGenerated }

if (isMain(import.meta.url)) {
  ensureGenerated()
}
