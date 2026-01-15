/**
 * Base props for all flag components across all frameworks
 * Individual framework packages may extend this interface
 */
export interface FlagComponentProps {
  /** Width of the flag */
  width?: number | string
  /** Height of the flag */
  height?: number | string
  /** CSS className */
  className?: string
  /** Accessible title for screen readers */
  title?: string
}

/**
 * Metadata for each flag component
 */
export interface FlagMetadata {
  code: string
  name: string
  componentName: string
  svgSize: number
  optimizedSize: number
}

/**
 * Build metadata interface
 */
export interface BuildMeta {
  version: string
  builtTimestamp: number
  commitHash: string
  circleFlagsCommitHash: string
}
