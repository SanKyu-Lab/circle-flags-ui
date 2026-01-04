import pkg from '../package.json' assert { type: 'json' }

export interface BuildMeta {
  version: string
  commit: string
  builtAt: number
}

declare const __REACT_CIRCLE_FLAGS_COMMIT__: string
declare const __REACT_CIRCLE_FLAGS_BUILT_AT__: string

const parseBuiltAt = (source: string) => {
  const parsed = Number.parseInt(source, 10)
  return Number.isFinite(parsed) ? parsed : Date.now()
}

const commit =
  typeof __REACT_CIRCLE_FLAGS_COMMIT__ !== 'undefined' ? __REACT_CIRCLE_FLAGS_COMMIT__ : 'dev'

const builtAt = parseBuiltAt(
  typeof __REACT_CIRCLE_FLAGS_BUILT_AT__ !== 'undefined'
    ? __REACT_CIRCLE_FLAGS_BUILT_AT__
    : `${Date.now()}`
)

export const buildMeta: BuildMeta = {
  version: pkg.version,
  commit,
  builtAt,
}
