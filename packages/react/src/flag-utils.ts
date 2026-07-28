import {
  codeToComponentName,
  FlagSizes,
  getSizeName,
  FLAG_REGISTRY,
  type FlagSizeName,
} from '@sankyu/circle-flags-core'

export { FlagSizes, getSizeName }
export type { FlagSizeName }

/** Framework-neutral helpers for validating, formatting, and sizing flag codes. */
export const FlagUtils: {
  isValidCountryCode: (code: string) => boolean
  formatCountryCode: (code: string) => string
  getComponentName: (code: string) => string
  sizes: typeof FlagSizes
  getSizeName: (pixels: number) => FlagSizeName | null
} = {
  isValidCountryCode: (code: string): boolean => {
    return Object.prototype.hasOwnProperty.call(FLAG_REGISTRY, code.toLowerCase())
  },

  formatCountryCode: (code: string): string => {
    return code.toUpperCase()
  },

  getComponentName: codeToComponentName,

  sizes: FlagSizes,
  getSizeName,
}
