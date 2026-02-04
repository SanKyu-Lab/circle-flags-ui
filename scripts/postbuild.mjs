import { isMain } from './lib/is-main.mjs'
import { postbuildReact } from './tasks/postbuild-react.mjs'

export { postbuildReact }

if (isMain(import.meta.url)) {
  postbuildReact()
}
