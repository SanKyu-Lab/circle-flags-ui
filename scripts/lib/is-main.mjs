import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const isMain = importMetaUrl => {
  const entry = process.argv[1]
  if (!entry) return false
  return importMetaUrl === pathToFileURL(resolve(entry)).href
}
