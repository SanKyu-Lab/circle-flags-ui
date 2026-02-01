import pkg from '../package.json' assert { type: 'json' }

export interface BuildMeta {
  version: string
  commitHash: string
  circleFlagsCommitHash: string
  builtTimestamp: number
}

declare const __SOLID_CIRCLE_FLAGS_COMMIT__: string
declare const __SOLID_CIRCLE_FLAGS_CIRCLE_FLAGS_COMMIT__: string
declare const __SOLID_CIRCLE_FLAGS_BUILT_AT__: string

const parseBuiltAt = (source: string) => {
  const parsed = Number.parseInt(source, 10)
  return Number.isFinite(parsed) ? parsed : Date.now()
}

const commit =
  typeof __SOLID_CIRCLE_FLAGS_COMMIT__ !== 'undefined' ? __SOLID_CIRCLE_FLAGS_COMMIT__ : 'dev'

const circleFlagsCommit =
  typeof __SOLID_CIRCLE_FLAGS_CIRCLE_FLAGS_COMMIT__ !== 'undefined'
    ? __SOLID_CIRCLE_FLAGS_CIRCLE_FLAGS_COMMIT__
    : 'unknown'

const builtAt = parseBuiltAt(
  typeof __SOLID_CIRCLE_FLAGS_BUILT_AT__ !== 'undefined'
    ? __SOLID_CIRCLE_FLAGS_BUILT_AT__
    : `${Date.now()}`
)

export const buildMeta: BuildMeta = {
  version: pkg.version,
  commitHash: commit,
  circleFlagsCommitHash: circleFlagsCommit,
  builtTimestamp: builtAt,
}
