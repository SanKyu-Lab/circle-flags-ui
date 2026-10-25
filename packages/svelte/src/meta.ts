import pkg from '../package.json' with { type: 'json' }

/** Metadata captured when the Svelte package is built. */
export interface BuildMeta {
  version: string
  commitHash: string
  circleFlagsCommitHash: string
  builtTimestamp: number
}

// Values for development and tests. The package build replaces dist/meta.js with the values
// captured at build time (scripts/tasks/postbuild-svelte.mjs).
export const buildMeta: BuildMeta = {
  version: pkg.version,
  commitHash: 'dev',
  circleFlagsCommitHash: 'unknown',
  builtTimestamp: Date.now(),
}
