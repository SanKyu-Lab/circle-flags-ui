export interface FlagMetadata {
  code: string
  name: string
  componentName: string
  svgSize: number
  optimizedSize: number
  aliasOf?: string // The target code if this is a symlink alias
}
